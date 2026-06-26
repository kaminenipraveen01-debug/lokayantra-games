// components/GameCard.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Game } from "@/types/game";

interface GameCardProps {
  game: Game;
  rank?: number;
  gridSizeStyle?: string;
}

export default function GameCard({ game, rank, gridSizeStyle = "w-full aspect-[4/3]" }: GameCardProps) {
  const isHot = (game.playCount ?? 0) > 5000;
  const isNew = !isHot && (game.playCount ?? 0) < 1000;

  const displayRating = game.rating 
    ? game.rating.toFixed(1) 
    : (4.5 + (game.playCount ? (game.playCount % 5) * 0.1 : 0.3)).toFixed(1);

  return (
    <Link
      href={`/games/${game.id}`}
      className={`
        group relative flex flex-col rounded-[28px] overflow-hidden 
        bg-gradient-to-b from-white/40 to-white/10 backdrop-blur-md
        border border-black/10 hover:border-black/80
        shadow-[0_8px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_50px_rgba(0,0,0,0.25)]
        hover:-translate-y-2 active:scale-[0.96] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1)
        ${gridSizeStyle}
      `}
    >
      {/* Visual Sandbox Layer */}
      <div className="relative w-full flex-1 overflow-hidden bg-neutral-200">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={game.title}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover filter grayscale contrast-[1.15] brightness-[0.95] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-black/30 text-[9px] font-black tracking-widest">
            NO IMAGE
          </div>
        )}

        {/* Glass Fluid Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex items-end p-3">
          <div className="w-full flex items-center justify-between transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out">
            <span className="text-[9px] font-black tracking-widest text-white uppercase bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
              LAUNCH ⚡
            </span>
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black text-xs font-bold shadow-lg">
              →
            </div>
          </div>
        </div>

        {/* Dynamic Badges System */}
        {rank !== undefined ? (
          <div className="absolute top-3 left-3 flex items-center justify-center h-5 px-2 rounded-lg bg-black text-white text-[9px] font-black tracking-wider shadow-md border border-white/20">
            #{rank}
          </div>
        ) : isHot ? (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-black text-white tracking-widest border border-white/10 shadow-sm">
            🔥 HOT
          </div>
        ) : isNew ? (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-lg text-[8px] font-black uppercase bg-white text-black border border-black/30 tracking-widest shadow-sm">
            ✨ NEW
          </div>
        ) : null}

        {game.category && (
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-white/80 backdrop-blur-md border border-black/10 text-[8px] font-black text-black/60 uppercase tracking-widest">
            {game.category}
          </div>
        )}
      </div>

      {/* Info Floor */}
      <div className="p-3.5 flex flex-col gap-1 bg-white/50 border-t border-black/5 backdrop-blur-sm">
        <h3 className="text-xs font-black text-black uppercase tracking-wide truncate">
          {game.title}
        </h3>
        <div className="flex items-center justify-between text-[9px] font-black text-black/40">
          <span className="flex items-center gap-0.5 text-black">
            ★ <span className="font-extrabold text-black/70">{displayRating}</span>
          </span>
          <span className="tracking-widest font-extrabold">
            {formatCount(game.playCount ?? 0)} PLAYS
          </span>
        </div>
      </div>
    </Link>
  );
}

function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return String(n);
}