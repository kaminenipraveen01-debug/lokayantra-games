"use client";

import Link from "next/link";
import Image from "next/image";
import { Game } from "@/types/game";

interface HeroProps {
  games: Game[];
}

export default function Hero({ games }: HeroProps) {
  // గేమ్స్ లిస్ట్ ఖాళీగా ఉంటే సేఫ్ గా నల్ రిటర్న్ చేస్తాం
  if (!games || games.length === 0) return null;

  // మొదటి గేమ్‌ను ఫీచర్డ్ గేమ్‌గా తీసుకుంటున్నాం (నువ్వు కావాలంటే ఫైర్‌బేస్‌లో 'featured: true' ఉన్నది కూడా వాడుకోవచ్చు)
  const featuredGame = games[0];
  
  const displayRating = featuredGame.rating 
    ? featuredGame.rating.toFixed(1) 
    : "4.8";

  const shortDesc = featuredGame.description 
    ? featuredGame.description.slice(0, 140) + "..."
    : "Experience the ultimate premium browser gameplay directly on Lokayantra. No downloads required.";

  return (
    <section className="relative w-full rounded-2xl overflow-hidden bg-[#0c0e17] border border-white/[0.03] shadow-2xl group">
      
      {/* 1. Backdrop Big Thumbnail Area */}
      <div className="relative w-full h-[280px] sm:h-[380px] md:h-[450px] overflow-hidden">
        {featuredGame.thumbnail ? (
          <Image
            src={featuredGame.thumbnail}
            alt={featuredGame.title}
            fill
            priority
            className="object-cover object-center transition-transform duration-700 ease-out scale-102 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 to-[#05060b]" />
        )}

        {/* 2. Advanced Cinematic Gradient Overlays */}
        {/* ఎడమ వైపు నుండి టెక్స్ట్ స్పష్టంగా కనిపించడానికి డార్క్ గ్రేడియంట్ */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#05060b] via-[#05060b]/70 to-transparent z-10 hidden md:block" />
        {/* మొబైల్ లో కింద నుండి పైకి డార్క్ గ్రేడియంట్ */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#05060b] via-[#05060b]/80 to-black/20 z-10 md:hidden" />
        {/* బాటమ్ ఎడ్జ్ ని గ్రిడ్ లో స్మూత్ గా కలపడానికి గ్రేడియంట్ */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05060b] to-transparent z-10" />
      </div>

      {/* 3. Hero Elements / Content Layer */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 sm:p-8 md:p-12 md:max-w-xl lg:max-w-2xl h-full">
        <div className="space-y-3 sm:space-y-4">
          
          {/* Badges & Tags */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-white badge-hot tracking-widest animate-pulse">
              FEATURED
            </span>
            {featuredGame.category && (
              <span className="px-2 py-0.5 rounded bg-white/10 backdrop-blur-md border border-white/5 text-[9px] font-bold text-[var(--accent-secondary)] uppercase tracking-wider">
                {featuredGame.category}
              </span>
            )}
            <span className="text-xs font-black text-[var(--accent-gold)] flex items-center gap-0.5">
              ⭐ <span className="text-white">{displayRating}</span>
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-[var(--accent-primary)] transition-colors duration-300">
            {featuredGame.title}
          </h2>

          {/* Short Description */}
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-medium">
            {shortDesc}
          </p>

          {/* 11. Play Button (Action Trigger) */}
          <div className="pt-2">
            <Link
              href={`/games/${featuredGame.id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[var(--r-btn)] btn-primary text-xs sm:text-sm font-black text-white uppercase tracking-wider"
            >
              <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Play Now</span>
            </Link>
          </div>

        </div>
      </div>

    </section>
  );
}