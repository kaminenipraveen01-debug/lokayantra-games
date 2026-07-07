"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface GameControlBarProps {
  gameId: string;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  initialLikes?: number;
  initialDislikes?: number;
  gameTitle?: string;
}

type ReactionState = "like" | "dislike" | null;

export default function GameControlBar({
  gameId,
  iframeRef,
  initialLikes = 0,
  initialDislikes = 0,
  gameTitle = "",
}: GameControlBarProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [dislikes, setDislikes] = useState(initialDislikes);
  const [reaction, setReaction] = useState<ReactionState>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // The reaction that is ACTUALLY committed in Firestore right now.
  // Only updated after a transaction succeeds — never from optimistic clicks.
  const committedReactionRef = useRef<ReactionState>(null);
  // The most recent reaction the user wants, updated on every click.
  const latestReactionRef = useRef<ReactionState>(null);

  // ── Restore local (per-device) UI state on mount ──
  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem("lokayantra_favorites") || "[]");
      setIsFavorite(Array.isArray(favs) && favs.includes(gameId));

      const reactions = JSON.parse(localStorage.getItem("lokayantra_reactions") || "{}");
      const savedReaction: ReactionState = reactions[gameId] ?? null;

      setReaction(savedReaction);
      committedReactionRef.current = savedReaction;
      latestReactionRef.current = savedReaction;
      setLikes(initialLikes);
      setDislikes(initialDislikes);
    } catch (e) {
      console.error("Error restoring states:", e);
      committedReactionRef.current = null;
      latestReactionRef.current = null;
    }
  }, [gameId, initialLikes, initialDislikes]);

  // NOTE: counts are shown from `initialLikes` / `initialDislikes` (fetched once
  // per page load, e.g. server-side) — intentionally NOT a live Firestore
  // listener, so Firestore reads never scale with how many people are
  // viewing the page or how many likes/dislikes come in. Refresh the page
  // to see the latest totals.
  useEffect(() => {
    const onFSChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFSChange);
    return () => document.removeEventListener("fullscreenchange", onFSChange);
  }, []);

  const commitToFirestore = useCallback(
    (targetGameId: string) => {
      const from = committedReactionRef.current;
      const to = latestReactionRef.current;

      // Nothing actually changed since the last commit — skip the write.
      if (from === to) return;

      const gameRef = doc(db, "games", targetGameId);
      runTransaction(db, async (transaction) => {
        const snap = await transaction.get(gameRef);
        if (!snap.exists()) return;

        const data = snap.data();
        let l: number = data.likes ?? 0;
        let d: number = data.dislikes ?? 0;

        // Undo whatever is currently committed for this user...
        if (from === "like") l = Math.max(0, l - 1);
        if (from === "dislike") d = Math.max(0, d - 1);

        // ...then apply the new target state.
        if (to === "like") l = l + 1;
        if (to === "dislike") d = d + 1;

        transaction.update(gameRef, { likes: l, dislikes: d });
      })
        .then(() => {
          // Only mark as committed once Firestore actually reflects it.
          committedReactionRef.current = to;
        })
        .catch((err) => {
          console.error("Firestore reaction update failed:", err);
          // Leave committedReactionRef untouched so the next attempt
          // retries the correct transition instead of silently drifting.
        });
    },
    []
  );

  const handleReaction = useCallback(
    (type: "like" | "dislike") => {
      const reactions = JSON.parse(localStorage.getItem("lokayantra_reactions") || "{}");
      const previous: ReactionState = reactions[gameId] ?? null;
      const newReaction: ReactionState = previous === type ? null : type;

      // 1. Optimistic UI update (local counters shown to this user only,
      //    the live onSnapshot listener will reconcile the real numbers).
      if (previous === type) {
        if (type === "like") setLikes((n) => Math.max(0, n - 1));
        else setDislikes((n) => Math.max(0, n - 1));
        delete reactions[gameId];
      } else {
        if (previous === "like") setLikes((n) => Math.max(0, n - 1));
        if (previous === "dislike") setDislikes((n) => Math.max(0, n - 1));
        if (type === "like") setLikes((n) => n + 1);
        else setDislikes((n) => n + 1);
        reactions[gameId] = type;
      }
      setReaction(newReaction);
      localStorage.setItem("lokayantra_reactions", JSON.stringify(reactions));

      // 2. Track only the latest desired state; committedReactionRef stays
      //    untouched until a transaction actually succeeds, so rapid
      //    clicking can never cause a double-subtract in Firestore.
      latestReactionRef.current = newReaction;

      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        commitToFirestore(gameId);
      }, 600);
    },
    [gameId, commitToFirestore]
  );

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const handleFavorite = useCallback(() => {
    const favs: string[] = JSON.parse(localStorage.getItem("lokayantra_favorites") || "[]");
    const next = isFavorite ? favs.filter((id) => id !== gameId) : [...favs, gameId];
    localStorage.setItem("lokayantra_favorites", JSON.stringify(next));
    setIsFavorite(!isFavorite);
  }, [gameId, isFavorite]);

  const handleFullscreen = useCallback(() => {
    const el = iframeRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.();
  }, [iframeRef]);

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: gameTitle, url });
      else {
        await navigator.clipboard.writeText(url);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2000);
      }
    } catch {}
  }, [gameTitle]);

  const totalVotes = likes + dislikes;
  const likePercent = totalVotes > 0 ? Math.round((likes / totalVotes) * 100) : null;

  return (
    <div className="relative w-full">
      {shareToast && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-xl z-50">
          LINK COPIED ✓
        </div>
      )}

      <div className="flex items-center gap-2 px-3 py-2 rounded-[18px] bg-white/60 backdrop-blur-md border border-black/10 shadow-sm">

        {/* ── LIKE / DISLIKE ── */}
        <div className="flex items-center rounded-xl overflow-hidden border border-black/10 bg-white/80">
          <button
            onClick={() => handleReaction("like")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-black transition-all duration-150 ${
              reaction === "like" ? "bg-black text-white" : "text-black/50 hover:bg-black/8 hover:text-black"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={reaction === "like" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3" />
            </svg>
            <span>{formatCount(likes)}</span>
          </button>

          <div className="w-px h-5 bg-black/10" />

          <button
            onClick={() => handleReaction("dislike")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-black transition-all duration-150 ${
              reaction === "dislike" ? "bg-black text-white" : "text-black/50 hover:bg-black/8 hover:text-black"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={reaction === "dislike" ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3" />
            </svg>
            <span>{formatCount(dislikes)}</span>
          </button>
        </div>

        {likePercent !== null && (
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/80 border border-black/8 text-[10px] font-black text-black/50">
            <span className="text-black font-black">{likePercent}%</span>
            <span>liked</span>
          </div>
        )}

        <div className="flex-1" />

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleFavorite}
            title={isFavorite ? "Saved" : "Save"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black border transition-all duration-150 ${
              isFavorite ? "bg-black text-white border-black" : "bg-white/80 text-black/50 border-black/10 hover:border-black/30 hover:text-black"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 10-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
            <span className="hidden sm:inline">{isFavorite ? "SAVED" : "SAVE"}</span>
          </button>

          <button
            onClick={handleShare}
            title="Share"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black bg-white/80 text-black/50 border border-black/10 hover:border-black/30 hover:text-black transition-all duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            <span className="hidden sm:inline">SHARE</span>
          </button>

          <button
            onClick={handleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-black border transition-all duration-150 ${
              isFullscreen ? "bg-black text-white border-black" : "bg-white/80 text-black/50 border-black/10 hover:border-black/30 hover:text-black"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              {isFullscreen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V5m0 4H5m4 0L4 4m11 5V5m0 4h4m-4 0l5-5M9 15v4m0-4H5m4 0l-5 5m11-5v4m0-4h4m-4 0l5-5" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              )}
            </svg>
            <span className="hidden sm:inline">{isFullscreen ? "EXIT" : "FULLSCREEN"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.max(0, n));
}