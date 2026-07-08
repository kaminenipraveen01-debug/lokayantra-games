"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecentlyPlayed, removeRecentlyPlayed, RecentGame } from "@/lib/recentlyPlayed";
import { GamePixGame } from "@/lib/gamepix";
import {
  Zap, Car, Puzzle, Compass, Trophy, Crosshair, Gamepad2, Building2,
  Brain, Network, Swords, Grid3x3, type LucideIcon,
} from "lucide-react";

// motham games anni okey size — ఏ big/tall special tile లేదు
function getTileClass(_index: number) {
  return "col-span-1 row-span-1 aspect-square";
}

// Homepage లో చూపించే 12 main categories — motham lucide-react icons తో,
// consistent stroke style, categories/page.tsx లో unna style తోనే match avutundi.
const HOME_CATEGORIES: { id: string; name: string; Icon: LucideIcon }[] = [
  { id: "action", name: "Action Games", Icon: Zap },
  { id: "racing", name: "Racing Games", Icon: Car },
  { id: "puzzle", name: "Puzzle Games", Icon: Puzzle },
  { id: "adventure", name: "Adventure Games", Icon: Compass },
  { id: "sports", name: "Sports Games", Icon: Trophy },
  { id: "shooter", name: "Shooting Games", Icon: Crosshair },
  { id: "arcade", name: "Arcade Games", Icon: Gamepad2 },
  { id: "simulation", name: "Simulation Games", Icon: Building2 },
  { id: "brain", name: "Brain Games", Icon: Brain },
  { id: "io", name: ".IO Games", Icon: Network },
  { id: "battle", name: "Battle Games", Icon: Swords },
];

interface Props {
  initialGames: GamePixGame[];
  categories: string[];
  featuredGames?: GamePixGame[];
  trendingGames?: GamePixGame[];
  newReleases?: GamePixGame[];
  recommendedGames?: GamePixGame[];
  mostPlayedGames?: GamePixGame[];
}

export default function HomepageClient({ initialGames, categories: _categories, featuredGames = [], trendingGames = [], newReleases = [], recommendedGames = [], mostPlayedGames = [] }: Props) {
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [games, setGames] = useState<GamePixGame[]>(initialGames);

  useEffect(() => {
    setRecentGames(getRecentlyPlayed());
  }, []);

  const handleRemoveRecent = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeRecentlyPlayed(id);
    setRecentGames(getRecentlyPlayed());
  };


  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">

      {/* BLACK BUBBLES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/20" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/15" />
        <div className="absolute top-[20px] left-[35%] w-[80px] h-[80px] rounded-full bg-black/20" />
        <div className="absolute top-[-30px] right-[35%] w-[140px] h-[140px] rounded-full bg-black/20" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/10" />
        <div className="absolute top-[180px] left-[2%] w-[60px] h-[60px] rounded-full bg-black/15" />
        <div className="absolute top-[130px] right-[25%] w-[90px] h-[90px] rounded-full bg-black/10" />
        <div className="absolute top-[280px] left-[12%] w-[110px] h-[110px] rounded-full bg-black/10" />
        <div className="absolute top-[290px] right-[18%] w-[100px] h-[100px] rounded-full bg-black/15" />
        <div className="absolute top-[400px] left-[25%] w-[130px] h-[130px] rounded-full bg-black/15" />
        <div className="absolute top-[480px] right-[5%] w-[170px] h-[170px] rounded-full bg-black/15" />
        <div className="absolute top-[580px] left-[3%] w-[125px] h-[125px] rounded-full bg-black/15" />
        <div className="absolute top-[650px] right-[28%] w-[140px] h-[140px] rounded-full bg-black/10" />
        <div className="absolute top-[750px] right-[12%] w-[150px] h-[150px] rounded-full bg-black/15" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-black/15" />
        <div className="absolute bottom-[220px] right-[15%] w-[210px] h-[210px] rounded-full bg-black/10" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-black/10" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-black/20" />
      </div>

      {/* CONTINUE PLAYING */}
      {recentGames.length > 0 && (
        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-[105px] sm:mt-[115px] relative z-10">
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
              <div key={rg.id} className="relative shrink-0 w-[110px] sm:w-[130px]">
                <Link
                  href={`/games/${rg.slug || rg.id}`}
                  className="group relative block w-full aspect-square overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white/40 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
                >
                  {rg.thumbnail ? (
                    <img src={rg.thumbnail} alt={rg.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50">
                      {rg.title}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                    <p className="text-[9px] font-black uppercase tracking-wider text-white truncate w-full">{rg.title}</p>
                  </div>
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <svg className="w-2.5 h-2.5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </Link>
                <p className="text-[9px] font-black uppercase tracking-wide text-black/60 truncate mt-1 px-0.5">{rg.title}</p>
                <button
                  onClick={(e) => handleRemoveRecent(e, rg.id)}
                  className="mt-0.5 w-full flex items-center justify-center gap-1 text-[8px] font-black uppercase tracking-wider text-black/30 hover:text-red-500 transition-colors"
                >
                  <span>✕</span><span>Remove</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAMES GRID */}
      <div className={`w-full max-w-[1400px] mx-auto px-3 sm:px-4 ${recentGames.length > 0 ? "mt-6 sm:mt-8" : "mt-[105px] sm:mt-[115px]"} relative z-10`}>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2 auto-rows-[1fr] grid-flow-row-dense">
          {games.map((game, index) => {
            const sizeClass = getTileClass(index);
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
                  <img src={game.thumbnail} alt={game.title} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.15] brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105 transition-[filter,transform] duration-300 ease-out"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-[11px] font-black uppercase tracking-wider text-black/60">
                    {game.title}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3 rounded-b-[24px] sm:rounded-b-[32px]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[70%]">{game.title}</p>
                  <span className="ml-auto text-[8px] font-extrabold text-black bg-white px-2.5 py-1 rounded-md tracking-wider">PLAY</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {featuredGames.length > 0 && (
  <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-8 relative z-10">
    <div className="flex items-center justify-between mb-3 px-0.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-black to-gray-700 shadow-sm">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <span className="text-[9px] font-black uppercase tracking-widest text-white">Admin</span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
          Admin Games
        </span>
      </div>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {featuredGames.map((game) => (
        <div key={game.id} className="relative shrink-0 w-[140px] sm:w-[160px]">
          <Link
            href={`/games/${game.slug || game.id}`}
            className="group relative block w-full aspect-square overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white hover:-translate-y-1 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {game.thumbnail ? (
              <img src={game.thumbnail} alt={game.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50 bg-gray-100">
                {game.title}
              </div>
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-black to-gray-700 text-white text-[8px] font-black shadow-md">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span>ADMIN</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
              <p className="text-[9px] font-black uppercase tracking-wider text-white truncate w-full">{game.title}</p>
            </div>
          </Link>
          <p className="text-[9px] font-black uppercase tracking-wide text-black/60 truncate mt-1.5 px-0.5">{game.title}</p>
        </div>
      ))}
    </div>
  </div>
)}

  {trendingGames.length > 0 && (
  <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-8 relative z-10">
    <div className="flex items-center justify-between mb-3 px-0.5">
      <div className="flex items-center gap-2">
        <span className="text-lg">🔥</span>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
          Trending Games
        </span>
      </div>
      <Link href="/trending" className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
        See All →
      </Link>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {trendingGames.map((game, index) => (
        <div key={game.id} className="relative shrink-0 w-[140px] sm:w-[160px]">
          <Link
            href={`/games/${game.slug || game.id}`}
            className="group relative block w-full aspect-square overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white/40 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
          >
            {game.thumbnail ? (
              <img src={game.thumbnail} alt={game.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50">
                {game.title}
              </div>
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[8px] font-black shadow-md">
              <span>🔥</span>
              <span>#{index + 1}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
              <p className="text-[9px] font-black uppercase tracking-wider text-white truncate w-full">{game.title}</p>
            </div>
          </Link>
          <p className="text-[9px] font-black uppercase tracking-wide text-black/60 truncate mt-1.5 px-0.5">{game.title}</p>
        </div>
      ))}
    </div>
  </div>
)}

{newReleases.length > 0 && (
  <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-8 relative z-10">
    <div className="flex items-center justify-between mb-3 px-0.5">
      <div className="flex items-center gap-2">
        {/* Custom NEW badge */}
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-sm">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z"/>
          </svg>
          <span className="text-[9px] font-black uppercase tracking-widest text-white">New</span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
          New Releases
        </span>
      </div>
      <Link href="/new-releases" className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
        See All →
      </Link>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {newReleases.map((game, index) => (
        <div key={game.id} className="relative shrink-0 w-[140px] sm:w-[160px]">
          <Link
            href={`/games/${game.slug || game.id}`}
            className="group relative block w-full aspect-square overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white/40 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
          >
            {game.thumbnail ? (
              <img src={game.thumbnail} alt={game.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50">
                {game.title}
              </div>
            )}
            {/* Custom NEW badge on card */}
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white text-[8px] font-black shadow-md">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z"/>
              </svg>
              <span>NEW</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
              <p className="text-[9px] font-black uppercase tracking-wider text-white truncate w-full">{game.title}</p>
            </div>
          </Link>
          <p className="text-[9px] font-black uppercase tracking-wide text-black/60 truncate mt-1.5 px-0.5">{game.title}</p>
        </div>
      ))}
    </div>
  </div>
)}

{recommendedGames.length > 0 && (
  <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-8 relative z-10">
    <div className="flex items-center justify-between mb-3 px-0.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-500 to-purple-400 shadow-sm">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          <span className="text-[9px] font-black uppercase tracking-widest text-white">Pick</span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
          Recommended
        </span>
      </div>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {recommendedGames.map((game) => (
        <div key={game.id} className="relative shrink-0 w-[140px] sm:w-[160px]">
          <Link
            href={`/games/${game.slug || game.id}`}
            className="group relative block w-full aspect-square overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white/40 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
          >
            {game.thumbnail ? (
              <img src={game.thumbnail} alt={game.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50">
                {game.title}
              </div>
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-400 text-white text-[8px] font-black shadow-md">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
              <span>PICK</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
              <p className="text-[9px] font-black uppercase tracking-wider text-white truncate w-full">{game.title}</p>
            </div>
          </Link>
          <p className="text-[9px] font-black uppercase tracking-wide text-black/60 truncate mt-1.5 px-0.5">{game.title}</p>
        </div>
      ))}
    </div>
  </div>
)}

{mostPlayedGames.length > 0 && (
  <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-8 relative z-10">
    <div className="flex items-center justify-between mb-3 px-0.5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 shadow-sm">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
          </svg>
          <span className="text-[9px] font-black uppercase tracking-widest text-white">Hot</span>
        </div>
        <span className="text-[11px] font-black uppercase tracking-[0.2em] text-black">
          Most Played
        </span>
      </div>
    </div>
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
      {mostPlayedGames.map((game, index) => (
        <div key={game.id} className="relative shrink-0 w-[140px] sm:w-[160px]">
          <Link
            href={`/games/${game.slug || game.id}`}
            className="group relative block w-full aspect-square overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white/40 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
          >
            {game.thumbnail ? (
              <img src={game.thumbnail} alt={game.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50">
                {game.title}
              </div>
            )}
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-[8px] font-black shadow-md">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
              <span>#{index + 1}</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
              <p className="text-[9px] font-black uppercase tracking-wider text-white truncate w-full">{game.title}</p>
            </div>
          </Link>
          <p className="text-[9px] font-black uppercase tracking-wide text-black/60 truncate mt-1.5 px-0.5">{game.title}</p>
        </div>
      ))}
    </div>
  </div>
)}
  
      {/* CATEGORIES — Load More కింద, Poki style, square tiles */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-8 sm:mt-10 relative z-10">
        <div className="flex items-center justify-between mb-4 px-0.5">
          <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-black/60">Browse by Category</h2>
          <Link href="/categories" className="text-[10px] font-black uppercase tracking-widest text-black/40 hover:text-black transition-colors">
            All Categories →
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
          {HOME_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group relative flex flex-col items-center justify-center gap-2 p-3 sm:p-4 aspect-square rounded-[20px] sm:rounded-[24px] border border-black/10 bg-white/50 hover:bg-white/80 hover:border-black/20 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition-all duration-200"
            >
              <div className="shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-black/5 group-hover:bg-black group-hover:text-white text-black/70 flex items-center justify-center transition-colors duration-200">
                <cat.Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.75} />
              </div>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wide text-black/80 group-hover:text-black text-center leading-tight line-clamp-2">
                {cat.name}
              </span>
            </Link>
          ))}

          {/* All Categories tile */}
          <Link
            href="/categories"
            className="group relative flex flex-col items-center justify-center gap-2 p-3 sm:p-4 aspect-square rounded-[20px] sm:rounded-[24px] border border-black/30 bg-[#161920] text-white hover:bg-black hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition-all duration-200"
          >
            <div className="shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-white/10 flex items-center justify-center">
              <Grid3x3 className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.75} />
            </div>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wide text-center leading-tight">
              All Categories
            </span>
          </Link>
        </div>
      </div>

      {/* INFO STRIP */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-8 sm:mt-10 text-center relative z-10">
        <div className="border border-black/10 p-6 sm:p-12 rounded-[24px] sm:rounded-[32px] shadow-xl space-y-4 bg-white/60">
          <span className="text-xs font-black uppercase tracking-widest text-black/60">LOKAYANTRA ARCADE STATION</span>
          <h2 className="text-xl sm:text-4xl font-black text-black tracking-tight">No Downloads. No Clutter. Just Magic.</h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-black/70 font-semibold leading-relaxed">
            Welcome to LokaYantra. We smashed the boring web grids to build a living, breathing playground of free HTML5 games.
            Click a fluid shape, dive into instant gameplay, and experience the internet&apos;s most beautiful game station.
          </p>
        </div>
      </div>

      {/* FOOTER */}
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
              <div className="flex items-center gap-2.5 pt-1">
                <Link href="https://www.instagram.com/lokayantraofficial?utm_source=qr&igsh=MXBndWQ3MG9uaDE1bw%3D%3D" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Link>
                <Link href="https://youtube.com/@official.lokayantra?si=0SE7fSqRAd5WxW3h" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
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
                <li><Link href="/categories" className="hover:text-black transition-colors">All Categories</Link></li>
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