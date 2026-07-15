// components/SearchResultsClient.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GamePixGame } from "@/lib/gamepix";
import { useSecretCodes } from "@/lib/secret-codes-context";

interface Props {
  initialGames: GamePixGame[];
  newestGames: GamePixGame[];
  categories: string[];
}

type SortOption = "relevance" | "newest" | "az";

function formatCategoryName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function SearchResultsClient({ initialGames, newestGames, categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerCode } = useSecretCodes();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "all");
  const [sort, setSort] = useState<SortOption>((searchParams.get("sort") as SortOption) ?? "relevance");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  // Debounce typing — URL ni prathi keystroke ki update cheyakunda
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  // URL sync — shareable/bookmarkable search links కోసం
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (category !== "all") params.set("category", category);
    if (sort !== "relevance") params.set("sort", sort);
    const qs = params.toString();
    router.replace(qs ? `/search?${qs}` : "/search", { scroll: false });
  }, [debouncedQuery, category, sort, router]);

  const results = useMemo(() => {
    const sourceList = sort === "newest" ? newestGames : initialGames;
    let list = sourceList.filter((g) => g && g.id);

    if (category !== "all") {
      list = list.filter((g) => g.category === category);
    }

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.trim().toLowerCase();
      list = list.filter((g) => (g.title || "").toLowerCase().includes(q));
    }

    if (sort === "az") {
      list = [...list].sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return list;
  }, [initialGames, newestGames, category, debouncedQuery, sort]);

  // Secret code check — Enter నొక్కినప్పుడు exact text ఒక code తో match
  // అయితే effect fire అవుతుంది, box clear అవుతుంది. Match కాకపోతే
  // మామూలు filtering (already happening live) కొనసాగుతుంది.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !query.trim()) return;
    const result = triggerCode(query.trim());
    if (result.status === "new" || result.status === "repeat") {
      setQuery("");
    }
  };

  return (
    <div className="w-full">
      {/* SEARCH + FILTER BAR */}
      <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-black/10 p-5 sm:p-7 shadow-sm mb-6 flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search games by name..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white/70 border border-black/10 focus:border-black outline-none font-bold text-sm transition-all"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-12 px-4 rounded-2xl bg-white/70 border border-black/10 focus:border-black outline-none font-black text-[11px] uppercase tracking-wide cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{formatCategoryName(c)}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="h-12 px-4 rounded-2xl bg-white/70 border border-black/10 focus:border-black outline-none font-black text-[11px] uppercase tracking-wide cursor-pointer"
        >
          <option value="relevance">Most Popular</option>
          <option value="newest">Newest</option>
          <option value="az">A - Z</option>
        </select>
      </div>

      {/* RESULT COUNT */}
      <p className="text-[10px] font-black uppercase tracking-widest text-black/40 mb-4 px-1">
        {results.length} {results.length === 1 ? "game" : "games"} found
        {debouncedQuery.trim() && <> for &ldquo;{debouncedQuery.trim()}&rdquo;</>}
      </p>

      {/* RESULTS GRID */}
      {results.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 sm:gap-2">
          {results.map((game) => (
            <Link
              href={`/games/${game.slug || game.id}`}
              key={game.id}
              className="group relative aspect-square overflow-hidden rounded-[20px] sm:rounded-[24px] border border-black/10 hover:border-black/30 bg-white/40 hover:bg-white/55 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.18)] hover:-translate-y-1.5 transition-all duration-200"
            >
              {game.thumbnail ? (
                <img
                  src={game.thumbnail}
                  alt={game.title || "Game"}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover grayscale contrast-[1.15] brightness-90 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:scale-105 transition-[filter,transform] duration-300 ease-out"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[10px] font-black uppercase tracking-wider text-black/60">
                  {game.title || "Untitled Game"}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2.5">
                <p className="text-[9px] font-black uppercase tracking-wider text-white truncate max-w-[70%]">{game.title || "Untitled Game"}</p>
                <span className="ml-auto text-[7px] font-extrabold text-black bg-white px-2 py-0.5 rounded-md tracking-wider">PLAY</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center font-bold py-20 bg-white/20 rounded-[24px] border border-black/10">
          <p className="text-sm font-black uppercase tracking-wide text-black/50 mb-1">No games match your search</p>
          <p className="text-xs text-black/40 font-semibold">Try a different keyword or clear the category filter.</p>
        </div>
      )}
    </div>
  );
}