"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getRecentlyPlayed, removeRecentlyPlayed, RecentGame } from "@/lib/recentlyPlayed";
import { GamePixGame } from "@/lib/gamepix";

const CATEGORIES = [
  { id: "all", name: "All Games" },
  { id: "2048", name: "2048" },
  { id: "action", name: "Action" },
  { id: "addictive", name: "Addictive" },
  { id: "adventure", name: "Adventure" },
  { id: "airplane", name: "Airplane" },
  { id: "animal", name: "Animal" },
  { id: "anime", name: "Anime" },
  { id: "arcade", name: "Arcade" },
  { id: "archery", name: "Archery" },
  { id: "baby", name: "Baby" },
  { id: "ball", name: "Ball" },
  { id: "barbie", name: "Barbie" },
  { id: "baseball", name: "Baseball" },
  { id: "basketball", name: "Basketball" },
  { id: "battle", name: "Battle" },
  { id: "battle-royale", name: "Battle Royale" },
  { id: "bejeweled", name: "Bejeweled" },
  { id: "bike", name: "Bike" },
  { id: "block", name: "Block" },
  { id: "board", name: "Board" },
  { id: "bowling", name: "Bowling" },
  { id: "boxing", name: "Boxing" },
  { id: "brain", name: "Brain" },
  { id: "bubble-shooter", name: "Bubble Shooter" },
  { id: "building", name: "Building" },
  { id: "car", name: "Car" },
  { id: "card", name: "Card" },
  { id: "casual", name: "Casual" },
  { id: "cats", name: "Cats" },
  { id: "checkers", name: "Checkers" },
  { id: "chess", name: "Chess" },
  { id: "christmas", name: "Christmas" },
  { id: "city-building", name: "City Building" },
  { id: "classics", name: "Classics" },
  { id: "clicker", name: "Clicker" },
  { id: "coding", name: "Coding" },
  { id: "coloring", name: "Coloring" },
  { id: "cooking", name: "Cooking" },
  { id: "cool", name: "Cool" },
  { id: "crazy", name: "Crazy" },
  { id: "cricket", name: "Cricket" },
  { id: "dinosaur", name: "Dinosaur" },
  { id: "dirt-bike", name: "Dirt Bike" },
  { id: "dragons", name: "Dragons" },
  { id: "drawing", name: "Drawing" },
  { id: "dress-up", name: "Dress Up" },
  { id: "drifting", name: "Drifting" },
  { id: "driving", name: "Driving" },
  { id: "educational", name: "Educational" },
  { id: "escape", name: "Escape" },
  { id: "family", name: "Family" },
  { id: "farming", name: "Farming" },
  { id: "fashion", name: "Fashion" },
  { id: "fighting", name: "Fighting" },
  { id: "fire-and-water", name: "Fire And Water" },
  { id: "first-person-shooter", name: "First Person Shooter" },
  { id: "fishing", name: "Fishing" },
  { id: "flash", name: "Flash" },
  { id: "flight", name: "Flight" },
  { id: "fun", name: "Fun" },
  { id: "games-for-girls", name: "Games For Girls" },
  { id: "gangster", name: "Gangster" },
  { id: "gdevelop", name: "Gdevelop" },
  { id: "golf", name: "Golf" },
  { id: "granny", name: "Granny" },
  { id: "gun", name: "Gun" },
  { id: "hair-salon", name: "Hair Salon" },
  { id: "halloween", name: "Halloween" },
  { id: "helicopter", name: "Helicopter" },
  { id: "hidden-object", name: "Hidden Object" },
  { id: "hockey", name: "Hockey" },
  { id: "horror", name: "Horror" },
  { id: "horse", name: "Horse" },
  { id: "hunting", name: "Hunting" },
  { id: "hyper-casual", name: "Hyper Casual" },
  { id: "idle", name: "Idle" },
  { id: "io", name: "IO" },
  { id: "jewel", name: "Jewel" },
  { id: "jigsaw-puzzles", name: "Jigsaw Puzzles" },
  { id: "jumping", name: "Jumping" },
  { id: "junior", name: "Junior" },
  { id: "kids", name: "Kids" },
  { id: "knight", name: "Knight" },
  { id: "mahjong", name: "Mahjong" },
  { id: "makeup", name: "Makeup" },
  { id: "management", name: "Management" },
  { id: "mario", name: "Mario" },
  { id: "match-3", name: "Match 3" },
  { id: "math", name: "Math" },
  { id: "memory", name: "Memory" },
  { id: "mermaid", name: "Mermaid" },
  { id: "minecraft", name: "Minecraft" },
  { id: "mining", name: "Mining" },
  { id: "mmorpg", name: "Mmorpg" },
  { id: "mobile", name: "Mobile" },
  { id: "money", name: "Money" },
  { id: "monster", name: "Monster" },
  { id: "multiplayer", name: "Multiplayer" },
  { id: "music", name: "Music" },
  { id: "naval", name: "Naval" },
  { id: "ninja", name: "Ninja" },
  { id: "ninja-turtle", name: "Ninja Turtle" },
  { id: "offroad", name: "Offroad" },
  { id: "open-world", name: "Open World" },
  { id: "parking", name: "Parking" },
  { id: "parkour", name: "Parkour" },
  { id: "piano", name: "Piano" },
  { id: "pirates", name: "Pirates" },
  { id: "pixel", name: "Pixel" },
  { id: "platformer", name: "Platformer" },
  { id: "police", name: "Police" },
  { id: "pool", name: "Pool" },
  { id: "princess", name: "Princess" },
  { id: "puzzle", name: "Puzzle" },
  { id: "racing", name: "Racing" },
  { id: "restaurant", name: "Restaurant" },
  { id: "retro", name: "Retro" },
  { id: "robots", name: "Robots" },
  { id: "rpg", name: "Rpg" },
  { id: "runner", name: "Runner" },
  { id: "scary", name: "Scary" },
  { id: "scrabble", name: "Scrabble" },
  { id: "sharks", name: "Sharks" },
  { id: "shooter", name: "Shooter" },
  { id: "simulation", name: "Simulation" },
  { id: "skateboard", name: "Skateboard" },
  { id: "skibidi-toilet", name: "Skibidi Toilet" },
  { id: "skill", name: "Skill" },
  { id: "snake", name: "Snake" },
  { id: "sniper", name: "Sniper" },
  { id: "soccer", name: "Soccer" },
  { id: "solitaire", name: "Solitaire" },
  { id: "spinner", name: "Spinner" },
  { id: "sports", name: "Sports" },
  { id: "stickman", name: "Stickman" },
  { id: "strategy", name: "Strategy" },
  { id: "surgery", name: "Surgery" },
  { id: "survival", name: "Survival" },
  { id: "sword", name: "Sword" },
  { id: "tanks", name: "Tanks" },
  { id: "tap", name: "Tap" },
  { id: "tetris", name: "Tetris" },
  { id: "trivia", name: "Trivia" },
  { id: "truck", name: "Truck" },
  { id: "two-player", name: "Two Player" },
  { id: "tycoon", name: "Tycoon" },
  { id: "war", name: "War" },
  { id: "word", name: "Word" },
  { id: "world-cup", name: "World Cup" },
  { id: "worm", name: "Worm" },
  { id: "wrestling", name: "Wrestling" },
  { id: "zombie", name: "Zombie" },
];

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

interface Props {
  initialGames: GamePixGame[];
}

export default function HomepageClient({ initialGames }: Props) {
  const [recentGames, setRecentGames] = useState<RecentGame[]>([]);
  const [games, setGames] = useState<GamePixGame[]>(initialGames); // ✅ GameSummary → GamePixGame
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingMore, setLoadingMore] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialGames.length >= 48);

  useEffect(() => {
    setRecentGames(getRecentlyPlayed());
  }, []);

  const handleCategoryChange = async (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
    setHasMore(true);
    setCategoryLoading(true);

    if (catId === "all") {
      setGames(initialGames);
      setHasMore(initialGames.length >= 48);
      setCategoryLoading(false);
      return;
    }

    setGames([]);
    try {
      const res = await fetch(`/api/games?page=1&limit=48&category=${catId}`);
      const data = await res.json();
      setGames(data.games ?? []);
      setHasMore((data.games ?? []).length >= 48);
    } catch {
      setGames([]);
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleRemoveRecent = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    removeRecentlyPlayed(id);
    setRecentGames(getRecentlyPlayed());
  };

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const url = selectedCategory === "all"
        ? `/api/games?page=${page + 1}&limit=48`
        : `/api/games?page=${page + 1}&limit=48&category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.games?.length > 0) {
        setGames((prev) => [...prev, ...data.games]);
        setPage((p) => p + 1);
        if (data.games.length < 48) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">

      {/* BLACK BUBBLES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/95" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/90" />
        <div className="absolute top-[20px] left-[35%] w-[80px] h-[80px] rounded-full bg-black/95" />
        <div className="absolute top-[-30px] right-[35%] w-[140px] h-[140px] rounded-full bg-black/95" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/85" />
        <div className="absolute top-[180px] left-[2%] w-[60px] h-[60px] rounded-full bg-black/90" />
        <div className="absolute top-[130px] right-[25%] w-[90px] h-[90px] rounded-full bg-black/85" />
        <div className="absolute top-[280px] left-[12%] w-[110px] h-[110px] rounded-full bg-black/85" />
        <div className="absolute top-[290px] right-[18%] w-[100px] h-[100px] rounded-full bg-black/90" />
        <div className="absolute top-[400px] left-[25%] w-[130px] h-[130px] rounded-full bg-black/90" />
        <div className="absolute top-[480px] right-[5%] w-[170px] h-[170px] rounded-full bg-black/90" />
        <div className="absolute top-[580px] left-[3%] w-[125px] h-[125px] rounded-full bg-black/90" />
        <div className="absolute top-[650px] right-[28%] w-[140px] h-[140px] rounded-full bg-black/85" />
        <div className="absolute top-[750px] right-[12%] w-[150px] h-[150px] rounded-full bg-black/90" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-black/90" />
        <div className="absolute bottom-[220px] right-[15%] w-[210px] h-[210px] rounded-full bg-black/85" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-black/85" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-black/95" />
      </div>

      {/* CATEGORIES */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-[105px] sm:mt-[115px] relative z-10">
        <div className="flex flex-nowrap overflow-x-auto gap-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-3 px-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`
                flex items-center justify-center font-bold uppercase tracking-wider whitespace-nowrap shrink-0
                px-4 sm:px-5 h-[36px] sm:h-[42px] text-[10px] sm:text-[12px] rounded-full border
                transition-colors duration-150 outline-none
                ${selectedCategory === cat.id
                  ? "bg-[#161920] text-white border-black shadow-md"
                  : "bg-white/60 text-black border-black/10 hover:bg-[#161920] hover:text-white"}
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* CONTINUE PLAYING */}
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
              <div key={rg.id} className="relative shrink-0 w-[110px] sm:w-[130px]">
                <Link
                  href={`/games/${rg.slug || rg.id}`}
                  className="group relative block w-full aspect-square overflow-hidden rounded-2xl border border-black/10 hover:border-black/40 bg-white/40 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
                >
                  {rg.thumbnail ? (
                    <img
                      src={rg.thumbnail}
                      alt={rg.title}
                      className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.1] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[9px] font-black uppercase tracking-wider text-black/50">
                      {rg.title}
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                    <p className="text-[9px] font-black uppercase tracking-wider text-white truncate w-full">
                      {rg.title}
                    </p>
                  </div>
                  {/* Play icon */}
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                    <svg className="w-2.5 h-2.5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </Link>

                {/* Game title below */}
                <p className="text-[9px] font-black uppercase tracking-wide text-black/60 truncate mt-1 px-0.5">
                  {rg.title}
                </p>

                {/* Remove button */}
                <button
                  onClick={(e) => handleRemoveRecent(e, rg.id)}
                  className="mt-0.5 w-full flex items-center justify-center gap-1 text-[8px] font-black uppercase tracking-wider text-black/30 hover:text-red-500 transition-colors"
                >
                  <span>✕</span>
                  <span>Remove</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GAMES GRID */}
      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8 relative z-10">
        {categoryLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-[24px] bg-white/30 animate-pulse" />
            ))}
          </div>
        ) : games.length > 0 ? (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2 grid-flow-row-dense">
              {games.map((game, index) => {
                const sizeClass = pokiGridStyles[index % pokiGridStyles.length];
                return (
                  <Link
                    href={`/games/${game.slug || game.id}`} // ✅ slug now exists on GamePixGame
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
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.15] brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105 transition-[filter,transform] duration-300 ease-out"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-[11px] font-black uppercase tracking-wider text-black/60">
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

            {/* LOAD MORE */}
            {hasMore && (
              <div className="flex justify-center mt-8 mb-4">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-[#161920] text-white font-black uppercase tracking-widest text-xs rounded-full hover:bg-black transition-colors disabled:opacity-50"
                >
                  {loadingMore ? "Loading..." : "Load More Games"}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center font-bold py-20 bg-white/20 rounded-[24px] border border-black/10 max-w-xl mx-auto uppercase tracking-wider text-xs">
            No games in this category.
          </div>
        )}
      </div>

      {/* INFO STRIP */}
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
                <li><Link href="/" className="hover:text-black transition-colors">Trending Games</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">2 Player Games</Link></li>
                <li><Link href="/" className="hover:text-black transition-colors">New Releases</Link></li>
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