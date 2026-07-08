"use client";

import { useState, useEffect } from "react";
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
  initialTotalPages: number;
}

export default function CategoryGamesClient({
  initialGames,
  categoryId,
  initialPage,
  initialTotalPages,
}: Props) {
  const [games, setGames] = useState<Game[]>(initialGames);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  const fetchPage = async (page: number) => {
    setLoading(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const res = await fetch(`/api/games?page=${page}&category=${categoryId}`);
      const data = await res.json();
      setGames(data.games ?? []);
      setTotalPages(data.totalPages ?? totalPages);
      setCurrentPage(page);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  // Pagination numbers — max 5 pages show చేయి
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <>
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-[16px] bg-white/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.slug || game.id}`}
              className="group relative aspect-square overflow-hidden rounded-[16px] sm:rounded-[20px] bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
            >
              {game.thumbnail ? (
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-200"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-[11px] font-black uppercase tracking-wider text-black/60 bg-gray-100">
                  {game.title}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
                <p className="text-[9px] font-black uppercase tracking-wide text-white truncate">{game.title}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-8 flex-wrap">
          {/* Previous */}
          <button
            onClick={() => fetchPage(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="w-9 h-9 rounded-full border border-black/10 bg-white/60 flex items-center justify-center text-black/50 hover:bg-[#161920] hover:text-white disabled:opacity-30 transition-colors text-sm font-black"
          >
            ‹
          </button>

          {/* Page numbers */}
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-black/40 text-sm font-black">
                ...
              </span>
            ) : (
              <button
                key={p}
                onClick={() => fetchPage(p as number)}
                disabled={loading}
                className={`w-9 h-9 rounded-full border text-[11px] font-black transition-colors ${
                  currentPage === p
                    ? "bg-[#161920] text-white border-black shadow-md"
                    : "border-black/10 bg-white/60 text-black/70 hover:bg-[#161920] hover:text-white"
                }`}
              >
                {p}
              </button>
            )
          )}

          {/* Next */}
          <button
            onClick={() => fetchPage(currentPage + 1)}
            disabled={currentPage === totalPages || loading}
            className="w-9 h-9 rounded-full border border-black/10 bg-white/60 flex items-center justify-center text-black/50 hover:bg-[#161920] hover:text-white disabled:opacity-30 transition-colors text-sm font-black"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}