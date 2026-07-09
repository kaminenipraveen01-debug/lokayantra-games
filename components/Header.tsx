// components/Header.tsx
"use client";

import { useSearch } from "@/lib/search-context";
import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

function PandaLogo() {
  return (
    <svg viewBox="0 0 100 100" className="w-[75%] h-[75%]" fill="none">
      <circle cx="50" cy="55" r="36" fill="#000000" />
      <circle cx="26" cy="24" r="13" fill="#000000" />
      <circle cx="74" cy="24" r="13" fill="#000000" />
      <circle cx="50" cy="57" r="27" fill="#ffffff" />
      <circle cx="39" cy="55" r="6" fill="#000000" />
      <circle cx="61" cy="55" r="6" fill="#000000" />
    </svg>
  );
}

interface SearchGame {
  id: string;
  title: string;
  slug?: string;
  thumbnail?: string;
  category?: string;
}

// Small skeleton tile for the search overlay grid
function OverlaySkeletonTile() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-black/5 border border-black/5 aspect-square">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent" />
    </div>
  );
}

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ── GLOBAL SEARCH OVERLAY STATE ──
  const [allGames, setAllGames] = useState<SearchGame[]>([]);
  const [gamesLoaded, setGamesLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Firebase (firestore) motham page load ki eager ga రాకుండా, search box
  // open chesinappudu matrame dynamic-import chestunnam — idi
  // firebaseapp.com/auth/iframe.js ni prathi page nunchi తీసేస్తుంది,
  // search వాడేటప్పుడు మాత్రమే load అవుతుంది.
  useEffect(() => {
    if (!isExpanded || gamesLoaded) return;
    async function fetchGames() {
      try {
        const [{ collection, getDocs }, { db }, res] = await Promise.all([
          import("firebase/firestore"),
          import("@/lib/firebase"),
          fetch("/api/games?page=1&limit=120"),
        ]);

        const snap = await getDocs(collection(db, "games"));
        const fbList: SearchGame[] = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })) as SearchGame[];

        const gpData = await res.json();
        const gpList: SearchGame[] = (gpData.games ?? []).map((g: any) => ({
          id: g.id,
          title: g.title,
          slug: g.slug || g.id,
          thumbnail: g.thumbnail,
          category: g.category,
        }));

        // Merge — duplicates తీసేయి
        const seen = new Set(fbList.map((g) => g.id));
        const merged = [
          ...fbList,
          ...gpList.filter((g) => !seen.has(g.id)),
        ];
        setAllGames(merged);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setGamesLoaded(true);
      }
    }
    fetchGames();
  }, [isExpanded, gamesLoaded]);

  // Debounce typing → skeleton shows while waiting
  useEffect(() => {
    if (!searchTerm.trim()) {
      setDebouncedTerm("");
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const t = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      setIsSearching(false);
    }, 350);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const results = useMemo(() => {
    if (!debouncedTerm.trim()) return [];
    const q = debouncedTerm.toLowerCase();
    return allGames.filter((g) => g.title.toLowerCase().includes(q)).slice(0, 12);
  }, [debouncedTerm, allGames]);

  // Close overlay on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }
    if (isExpanded) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  const handleAdminClick = () => {
    router.push("/admin");
  };

  const showOverlayPanel = isExpanded && searchTerm.trim().length > 0;

  return (
    <header ref={containerRef} className="fixed top-5 left-1/2 -translate-x-1/2 z-50 antialiased select-none">
      <motion.div
        layout
        initial={false}
        animate={{
          width: isExpanded ? "92vw" : "240px",
          maxWidth: isExpanded ? "1000px" : "240px",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="h-[64px] sm:h-[72px] rounded-full p-2 flex items-center justify-between border border-white/[0.08] relative overflow-hidden"
        style={{
          backgroundColor: "#161920",
          boxShadow: "inset 0 1px 2px rgba(255,255,255,0.1), 0 12px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* ── PANDA LOGO ── */}
        <motion.div
          layout
          onClick={() => { setIsExpanded(false); router.push("/"); }}
          role="button"
          aria-label="Go to homepage"
          className="h-12 w-12 rounded-full bg-[#f0f0f0] flex items-center justify-center shrink-0 cursor-pointer relative z-20 active:scale-90"
        >
          <PandaLogo />
        </motion.div>

        {/* ── CENTER: SEARCH ── */}
        <div className="flex-1 h-full flex items-center justify-center px-2 overflow-hidden">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                transition={{ duration: 0.3 }}
                className="w-full h-10 rounded-xl px-3 flex items-center gap-2 bg-black/40 border border-white/10"
              >
                <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search games..."
                  aria-label="Search games"
                  className="w-full bg-transparent text-xs font-semibold text-white placeholder-slate-500 outline-none"
                />
                <button
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                  aria-label="Close search"
                  className="text-slate-500 hover:text-white px-1"
                >
                  ✕
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => setIsExpanded(true)}
                aria-label="Open search"
                className="w-10 h-10 rounded-full bg-[#1f232d]/80 border border-white/[0.04] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── RIGHT: LOCK → /admin ── */}
        <motion.button
          layout
          onClick={handleAdminClick}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          title="Admin Panel"
          aria-label="Admin Panel"
          className="shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#252932] to-[#13151a] border border-white/[0.06] shadow-md text-slate-300 hover:text-white transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </motion.button>
      </motion.div>

      {/* ── GLOBAL SEARCH OVERLAY PANEL ── */}
      <AnimatePresence>
        {showOverlayPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-3 w-[92vw] max-w-[1000px] max-h-[60vh] overflow-y-auto rounded-[28px] border border-black/10 shadow-2xl p-4 sm:p-5"
            style={{ backgroundColor: "rgba(207,207,207,0.97)", backdropFilter: "blur(20px)" }}
          >
            {isSearching || !gamesLoaded ? (
              /* Skeleton grid while debouncing / first fetch */
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <OverlaySkeletonTile key={i} />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {results.map((game) => (
                  <Link
                    key={game.id}
                    href={`/games/${game.slug || game.id}`}
                    onClick={() => setIsExpanded(false)}
                    className="group relative overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white/40 hover:-translate-y-1 transition-all duration-200 aspect-square"
                  >
                    {game.thumbnail ? (
                      <Image
                        src={game.thumbnail}
                        alt={game.title}
                        fill
                        sizes="150px"
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50">
                        {game.title}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                      <p className="text-[9px] font-black uppercase tracking-wider text-white truncate">
                        {game.title}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-xs font-black uppercase tracking-wider text-black/40">
                No games match &quot;{debouncedTerm}&quot;
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}