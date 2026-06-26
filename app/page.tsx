// app/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { SkeletonGrid } from "@/components/SkeletonCard";
import { getRecentlyPlayed, RecentGame } from "@/lib/recentlyPlayed";
import Image from "next/image";
import Link from "next/link";

interface Game {
  id: string;
  title: string;
  slug?: string;
  thumbnail?: string;
  category?: string;
  likes?: number;
  playCount?: number;
}

export default function HomePage() {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  // NOTE: search ippudu Header.tsx lo global overlay ga work avtundi
  // (every page nundi access avutundi), so home page grid ki vere
  // search filtering avasaram ledu — main grid eppudu allGames chupistundi.

  // ── CONTINUE PLAYING ──
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);

  useEffect(() => {
    setRecentGames(getRecentlyPlayed());
  }, []);

  const finalCategories = [
    { id: "all", name: "All Games", path: "/" },
    { id: "action", name: "Action", path: "/action" },
    { id: "racing", name: "Racing", path: "/racing" },
    { id: "puzzle", name: "Puzzle", path: "/puzzle" },
    { id: "brain", name: "Brain", path: "/brain" },
    { id: "2-player", name: "2 Player", path: "/2-player" },
    { id: "shooting", name: "Shooting", path: "/shooting" },
    { id: "sports", name: "Sports", path: "/sports" },
    { id: "girls", name: "Girls", path: "/girls" },
  ];

  useEffect(() => {
    async function fetchAllGames() {
      try {
        const snap = await getDocs(collection(db, "games"));
        const list: Game[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[];

        // ── 🚀 TRENDING SORTING ──
        // ఎక్కువ స్కోర్ (plays * 2 + likes * 3) ఉన్న గేమ్‌లు టాప్‌లో వచ్చేలా సెట్ చేశాను.
        list.sort((a, b) => {
          const scoreA = (a.playCount ?? 0) * 2 + (a.likes ?? 0) * 3;
          const scoreB = (b.playCount ?? 0) * 2 + (b.likes ?? 0) * 3;
          return scoreB - scoreA;
        });

        setAllGames(list);
      } catch (err) {
        console.error("Error fetching games:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllGames();
  }, []);

  const filteredGames = allGames;

  const pokiGridStyles = [
    "col-span-2 row-span-2 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-2 row-span-2 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
  ];

  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">

      {/* ── BLACK BUBBLES BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/95" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/90" />
        <div className="absolute top-[20px] left-[35%] w-[80px] h-[80px] rounded-full bg-black/95" />
        <div className="absolute top-[-30px] right-[35%] w-[140px] h-[140px] rounded-full bg-black/95" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/85" />
        <div className="absolute top-[180px] left-[2%] w-[60px] h-[60px] rounded-full bg-black/90" />
        <div className="absolute top-[130px] right-[25%] w-[90px] h-[90px] rounded-full bg-black/85" />
        <div className="absolute top-[220px] right-[45%] w-[70px] h-[70px] rounded-full bg-black/90" />
        <div className="absolute top-[280px] left-[12%] w-[110px] h-[110px] rounded-full bg-black/85" />
        <div className="absolute top-[290px] right-[18%] w-[100px] h-[100px] rounded-full bg-black/90" />
        <div className="absolute top-[400px] left-[25%] w-[130px] h-[130px] rounded-full bg-black/90" />
        <div className="absolute top-[450px] left-[60%] w-[95px] h-[95px] rounded-full bg-black/85" />
        <div className="absolute top-[480px] right-[5%] w-[170px] h-[170px] rounded-full bg-black/90" />
        <div className="absolute top-[550px] left-[45%] w-[80px] h-[80px] rounded-full bg-black/95" />
        <div className="absolute top-[580px] left-[3%] w-[125px] h-[125px] rounded-full bg-black/90" />
        <div className="absolute top-[650px] right-[28%] w-[140px] h-[140px] rounded-full bg-black/85" />
        <div className="absolute top-[750px] right-[12%] w-[150px] h-[150px] rounded-full bg-black/90" />
        <div className="absolute top-[820px] left-[35%] w-[115px] h-[115px] rounded-full bg-black/85" />
        <div className="absolute top-[940px] left-[8%] w-[135px] h-[135px] rounded-full bg-black/90" />
        <div className="absolute top-[1100px] left-[15%] w-[140px] h-[140px] rounded-full bg-black/85" />
        <div className="absolute top-[1180px] right-[8%] w-[165px] h-[165px] rounded-full bg-black/90" />
        <div className="absolute top-[1400px] right-[22%] w-[150px] h-[150px] rounded-full bg-black/85" />
        <div className="absolute top-[1620px] left-[10%] w-[120px] h-[120px] rounded-full bg-black/85" />
        <div className="absolute top-[1690px] right-[15%] w-[135px] h-[135px] rounded-full bg-black/95" />
        <div className="absolute top-[1920px] right-[30%] w-[125px] h-[125px] rounded-full bg-black/85" />
        <div className="absolute top-[2000px] left-[4%] w-[150px] h-[150px] rounded-full bg-black/95" />
        <div className="absolute top-[2380px] right-[18%] w-[160px] h-[160px] rounded-full bg-black/85" />
        <div className="absolute bottom-[580px] right-[8%] w-[165px] h-[165px] rounded-full bg-black/85" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-black/90" />
        <div className="absolute bottom-[220px] right-[15%] w-[210px] h-[210px] rounded-full bg-black/85" />
        <div className="absolute bottom-[130px] left-[32%] w-[130px] h-[130px] rounded-full bg-black/95" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-black/85" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-black/95" />
      </div>

      {/* ── CATEGORIES ── */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-[105px] sm:mt-[115px] relative z-10">
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible justify-start sm:justify-start gap-2 sm:gap-2.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-3 px-3 sm:mx-0 sm:px-0">
          {finalCategories.map((cat) => (
            <Link
              href={cat.path}
              key={cat.id}
              className={`
                flex items-center justify-center font-bold uppercase tracking-wider whitespace-nowrap shrink-0
                px-4 sm:px-5 h-[36px] sm:h-[42px] text-[10px] sm:text-[12px] rounded-full border
                transition-colors duration-150 outline-none
                ${cat.id === "all"
                  ? "bg-[#161920] text-white border-black shadow-md"
                  : "bg-white/60 text-black border-black/10 hover:bg-[#161920] hover:text-white"}
              `}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* ── CONTINUE PLAYING ── */}
      {recentGames.length > 0 && (
        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8 relative z-10">
          <div className="flex items-center gap-2 mb-3 px-0.5">
            <svg className="w-3.5 h-3.5 text-black/60" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60">
              Continue Playing
            </span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {recentGames.map((rg) => (
              <Link
                href={`/games/${rg.slug || rg.id}`}
                key={rg.id}
                className="group relative shrink-0 w-[110px] sm:w-[130px] aspect-square overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white/40 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
              >
                {rg.thumbnail ? (
                  <Image
                    src={rg.thumbnail}
                    alt={rg.title}
                    fill
                    sizes="130px"
                    className="object-cover grayscale contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50">
                    {rg.title}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                  <p className="text-[9px] font-black uppercase tracking-wider text-white truncate">
                    {rg.title}
                  </p>
                </div>
                <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <svg className="w-2.5 h-2.5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── GAMES GRID ── */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8 relative z-10">
        {loading ? (
          <SkeletonGrid />
        ) : filteredGames.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2 grid-flow-row-dense">
            {filteredGames.map((game, index) => {
              const sizeClass = pokiGridStyles[index % pokiGridStyles.length];
              return (
                <Link
                  href={`/games/${game.slug || game.id}`}
                  key={game.id}
                  className={`
                    group relative overflow-hidden rounded-[24px] sm:rounded-[32px]
                    border border-black/10 hover:border-black/30
                    bg-white/40 hover:bg-white/55
                    shadow-[0_4px_10px_rgba(0,0,0,0.04)]
                    hover:shadow-[0_12px_24px_rgba(0,0,0,0.18)]
                    hover:-translate-y-1.5
                    transition-[transform,box-shadow,border-color,background-color]
                    duration-200 ease-out
                    ${sizeClass}
                  `}
                >
                  {game.thumbnail ? (
                    <Image
                      src={game.thumbnail}
                      alt={game.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 20vw"
                      className="object-cover grayscale contrast-[1.15] brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105 transition-[filter,transform] duration-300 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-[11px] font-black uppercase tracking-wider text-black/60 group-hover:text-black">
                      {game.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 rounded-b-[24px] sm:rounded-b-[32px]">
                    <p className="text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[70%]">
                      {game.title}
                    </p>
                    <span className="ml-auto text-[8px] font-extrabold text-black bg-white px-2.5 py-1 rounded-md tracking-wider">
                      PLAY
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center font-bold py-20 bg-white/20 rounded-[24px] border border-black/10 max-w-xl mx-auto uppercase tracking-wider text-xs">
            No games available right now.
          </div>
        )}
      </div>

      {/* ── INFO STRIP ── */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-10 sm:mt-16 text-center relative z-10">
        <div className="border border-black/10 p-6 sm:p-12 rounded-[24px] sm:rounded-[32px] shadow-xl space-y-4 bg-white/60">
          <span className="text-xs font-black uppercase tracking-widest text-black/60">LOKAYANTRA ARCADE STATION</span>
          <h2 className="text-xl sm:text-4xl font-black text-black tracking-tight">No Downloads. No Clutter. Just Magic.</h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-black/70 font-semibold leading-relaxed">
            Welcome to LokaYantra. We smashed the boring web grids to build a living, breathing playground of free HTML5 games.
            Click a fluid shape, dive into instant gameplay, and experience the internet&apos;s most beautiful game station.
          </p>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-5 sm:mt-6 relative z-10">
        <div className="border border-black/10 p-6 sm:p-12 rounded-[24px] sm:rounded-[32px] shadow-2xl bg-white/65 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          <div className="md:col-span-5 flex flex-col justify-between space-y-6 md:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f0f0f0] rounded-full flex items-center justify-center border border-black/10">
                  <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                    <circle cx="50" cy="55" r="36" fill="#000" />
                    <circle cx="26" cy="24" r="13" fill="#000" />
                    <circle cx="74" cy="24" r="13" fill="#000" />
                    <circle cx="50" cy="57" r="27" fill="#fff" />
                    <circle cx="39" cy="55" r="6" fill="#000" />
                    <circle cx="61" cy="55" r="6" fill="#000" />
                  </svg>
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter text-[#161920]">LokaYantra</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-black/60 max-w-sm leading-relaxed italic">
                &ldquo;Boring grids are dead. Welcome to the infinite monochrome playground.&rdquo;
              </p>
              
              {/* ── 🌟 SOCIAL SVG LINKS (REPLACED IG/YT TEXT) ── */}
              <div className="flex items-center gap-2.5 pt-1">
                {/* Instagram */}
                <Link 
                  href="https://www.instagram.com/lokayantraofficial?utm_source=qr&igsh=MXBndWQ3MG9uaDE1bw%3D%3D" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md hover:bg-black/80"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="w-4 h-4"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Link>

                {/* YouTube */}
                <Link 
                  href="https://youtube.com/@official.lokayantra?si=0SE7fSqRAd5WxW3h" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md hover:bg-black/80"
                >
                  <svg 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-4 h-4"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
              </div>

            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-black/50 pt-4">© 2026 LOKAYANTRA. ALL RIGHTS RESERVED.</div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-4 pt-4 md:pt-0">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/90 border-b border-black/10 pb-1">Explore</h3>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black/60">
                <li><Link href="/" className="hover:text-black transition-colors">All Games</Link></li>
                <li><Link href="/trending" className="hover:text-black transition-colors">Trending Games</Link></li>
                <li><Link href="/2-player" className="hover:text-black transition-colors">2 Player Games</Link></li>
                <li><Link href="/new-releases" className="hover:text-black transition-colors">New Releases</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/90 border-b border-black/10 pb-1">Studio</h3>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black/60">
                <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors">Contact Station</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/90 border-b border-black/10 pb-1">Legal</h3>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black/60">
                <li><Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-black transition-colors">Terms &amp; Conditions</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}