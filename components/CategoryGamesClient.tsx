"use client";

import { useState } from "react";
import Link from "next/link";

interface Game {
  id: string;
  title: string;
  thumbnail?: string;
  slug?: string;
}

interface Props {
  initialGames: Game[];
  categoryId: string;
  initialPage: number;
}

export default function CategoryGamesClient({ initialGames, categoryId, initialPage }: Props) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [page, setPage] = useState(initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(initialGames.length >= 48);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/games?page=${page + 1}&category=${categoryId}`);
      const data = await res.json();
      if (data.games?.length > 0) {
        setGames((prev) => [...prev, ...data.games]);
        setPage((p) => p + 1);
        if (data.games.length < 12) setHasMore(false);
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
    <>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
        {games.map((game) => (
          <Link
            key={game.id}
            href={`/games/${game.slug || game.id}`}
            className="group relative aspect-square overflow-hidden rounded-[20px] border border-black/10 hover:border-black/30 bg-white/40 hover:bg-white/55 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.18)] hover:-translate-y-1.5 transition-all duration-200"
          >
            {game.thumbnail ? (
              <img
                src={game.thumbnail}
                alt={game.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.15] brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105 transition-all duration-300"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-[11px] font-black uppercase tracking-wider text-black/60">
                {game.title}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
              <p className="text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[70%]">
                {game.title}
              </p>
              <span className="ml-auto text-[8px] font-extrabold text-black bg-white px-2.5 py-1 rounded-md tracking-wider">
                PLAY
              </span>
            </div>
          </Link>
        ))}
      </div>

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
  );
}