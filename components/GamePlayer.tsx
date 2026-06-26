// components/GamePlayer.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import GameControlBar from "@/components/GameControlBar";
import Image from "next/image";
import { addRecentlyPlayed } from "@/lib/recentlyPlayed";

interface GameData {
  id: string;
  title: string;
  category?: string;
  thumbnail?: string;
  slug?: string;
  gameUrl?: string;     // Manasontivi (zip/html)
  embedUrl?: string;    // External games (itch.io/github pages)
  likes?: number;
  dislikes?: number;
  youtubeEmbedUrl?: string;
}

export default function GamePlayer({ game }: { game: GameData }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const stageRef = useRef<HTMLDivElement>(null); // fullscreen target (chrome bar + iframe box)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Logic: embedUrl unte adi, lekapothe gameUrl.
  const finalGameUrl = game.embedUrl || game.gameUrl;

  // ── CONTINUE PLAYING TRACKING ──
  // User "PLAY NOW" nokkina prathi sari, ee game ni localStorage
  // recently-played list lo top ki teskuntam. Home page "Continue
  // Playing" row idi chadivi chupistundi.
  useEffect(() => {
    if (isPlaying) {
      addRecentlyPlayed({
        id: game.id,
        title: game.title,
        thumbnail: game.thumbnail,
        category: game.category,
        slug: game.slug,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  // ── FULLSCREEN + AUTO-ROTATE (mobile-first, Poki-style) ──
  // Fullscreen lo unnappudu, mobile lo automatic ga landscape ki
  // rotate avvataniki try chestam (screen.orientation.lock).
  // Browser/device support cheyakapothe silent ga fail avtundi, app break avvadu.
  useEffect(() => {
    function handleFullscreenChange() {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);

      if (active) {
        const orientation = (screen as any)?.orientation;
        if (orientation?.lock) {
          orientation.lock("landscape").catch(() => {
            // Desktop/unsupported devices lo fail avvachu, pattinchukovaddu
          });
        }
      } else {
        const orientation = (screen as any)?.orientation;
        if (orientation?.unlock) {
          try {
            orientation.unlock();
          } catch {
            // ignore
          }
        }
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const isMobileViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches;

  // ── PLAY BUTTON CLICK ──
  // Mobile lo: click cheyyagane game start avvadame kakunda, immediate ga
  // fullscreen + landscape rotate kuda trigger avtundi (Poki/CrazyGames laga).
  // Desktop lo: normal ga inline player start avtundi, fullscreen vaaru
  // chrome-bar expand (⛶) button tho manual ga teskovachu.
  const handlePlayClick = () => {
    setIsPlaying(true);
    if (isMobileViewport() && stageRef.current) {
      // User gesture (click) లోపలే call cheyyali, fullscreen API ki idi avasaram
      stageRef.current.requestFullscreen?.().catch(() => {
        // Fullscreen blocked ayyina, game ఇంకా normal inline view lo play avtundi
      });
    }
  };

  const toggleFullscreen = () => {
    if (!stageRef.current) return;
    if (!document.fullscreenElement) {
      stageRef.current.requestFullscreen?.().catch(() => {
        // Fullscreen blocked (rare) — game ఇంకా normal view lo work avtune untundi
      });
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* TOP LABEL */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_2px_rgba(52,211,153,0.5)] animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">LIVE</span>
          <span className="text-[9px] font-black text-black/70 uppercase tracking-wider truncate max-w-[160px] sm:max-w-xs">
            {game.title}
          </span>
        </div>
        {game.category && (
          <span className="text-[8px] font-black uppercase tracking-widest text-black/30 bg-black/5 px-2 py-1 rounded-lg border border-black/8">
            {game.category}
          </span>
        )}
      </div>

      {/* GAME STAGE — fullscreen target */}
      <div
        ref={stageRef}
        className={`relative w-full rounded-[20px] overflow-hidden bg-neutral-950 border border-black/20 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] ${
          isFullscreen ? "h-screen rounded-none border-0" : ""
        }`}
      >
        {/* Browser chrome bar — fullscreen lo hide chestam, full game screen kosam */}
        {!isFullscreen && (
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-[#1a1a1a] border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] border border-black/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] border border-black/20" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#28C840] border border-black/20" />
            </div>
            <div className="flex-1 mx-2 bg-white/5 border border-white/10 rounded-md px-3 py-1 flex items-center gap-2 max-w-sm">
              <svg className="w-2.5 h-2.5 text-white/25 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
              <span className="text-[9px] text-white/25 font-mono truncate">lokayantra.com/games/{game.id}</span>
            </div>

            {/* Expand / Fullscreen button — desktop kosam manual control */}
            {isPlaying && (
              <button
                onClick={toggleFullscreen}
                title="Fullscreen"
                className="shrink-0 w-7 h-7 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" />
                </svg>
              </button>
            )}
          </div>
        )}

        <div
          className={
            isFullscreen
              ? "relative w-full h-full bg-neutral-900"
              : "relative w-full aspect-video max-h-[calc(100vh-220px)] bg-neutral-900"
          }
        >
          {/* PANDA BACK BUTTON — fullscreen lో matrame kanipistundi, click chesthe normal view ki vastundi */}
          {isFullscreen && (
            <button
              onClick={exitFullscreen}
              title="Exit Fullscreen"
              className="absolute top-3 left-3 z-50 w-11 h-11 rounded-full bg-[#f0f0f0] border border-black/10 shadow-lg flex items-center justify-center active:scale-90 transition-transform"
            >
              <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                <circle cx="50" cy="55" r="36" fill="#000000" />
                <circle cx="26" cy="24" r="13" fill="#000000" />
                <circle cx="74" cy="24" r="13" fill="#000000" />
                <circle cx="50" cy="57" r="27" fill="#ffffff" />
                <circle cx="39" cy="55" r="6" fill="#000000" />
                <circle cx="61" cy="55" r="6" fill="#000000" />
              </svg>
            </button>
          )}

          {!isPlaying ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 group cursor-pointer" onClick={handlePlayClick}>
              {game.thumbnail && (
                <Image 
                  src={game.thumbnail} 
                  alt={game.title} 
                  fill 
                  className="object-cover opacity-20 blur-sm group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <button className="relative z-30 px-6 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:scale-110 group-hover:bg-amber-400 transition-all duration-300">
                PLAY NOW
              </button>
            </div>
          ) : (
            finalGameUrl ? (
              <iframe
                ref={iframeRef}
                src={finalGameUrl}
                title={game.title}
                className="absolute inset-0 w-full h-full border-0 bg-neutral-900"
                allow="fullscreen; gamepad; autoplay; keyboard-images"
                scrolling="no"
                // Ee sandbox settings ni konchem tagginchi chudu oka vela load avvakapothe
                // "allow-popups" thీసేశా — third-party game iframes lo deceptive popup/redirect
                // ads వస్తే అది AdSense policy violation అవ్వొచ్చు. Konni legit games popup
                // (e.g. leaderboard window) వాడితే అవి pనిచేయకపోవచ్చు, kani majority games ki
                // ee restriction safe.
                sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-presentation"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
                Game Link Not Found!
              </div>
            )
          )}
        </div>
      </div>

      {/* CONTROL BAR */}
      <GameControlBar
        gameId={game.id}
        iframeRef={iframeRef}
        initialLikes={game.likes ?? 0}
        initialDislikes={game.dislikes ?? 0}
        gameTitle={game.title}
      />

      {/* YOUTUBE GUIDE */}
      {game.youtubeEmbedUrl && (
        <div className="mt-1 w-full border border-black/10 p-4 rounded-[18px] bg-white/50 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-3.5 h-3.5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93 0.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-0.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-widest text-black/50">Gameplay Guide</span>
          </div>
          <div className="relative w-full aspect-video rounded-[14px] overflow-hidden border border-black/10">
            <iframe
              src={game.youtubeEmbedUrl}
              title={`${game.title} Guide`}
              className="absolute inset-0 w-full h-full bg-black"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}