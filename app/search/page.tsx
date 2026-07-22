import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { fetchSearchIndex, fetchAllCategories, GamePixGame } from "@/lib/gamepix";
import { getHomepageGames } from "@/lib/games-admin";
import SearchResultsClient from "@/components/SearchResultsClient";

export const metadata: Metadata = {
  title: "Search Free Online Games — 500+ HTML5 Games | LokaYantra",
  description:
    "Search and filter 500+ free online games on LokaYantra by name, category, or popularity. No downloads, no installs — find your next favorite browser game instantly.",
  keywords: [
    "search online games",
    "find free games",
    "browser games search",
    "free html5 games",
    "play games online no download",
    "game finder",
  ],
  alternates: { canonical: "https://lokayantra.vercel.app/search" },
  openGraph: {
    title: "Search Free Online Games — 500+ HTML5 Games | LokaYantra",
    description: "Search and filter free online games by name, category, or popularity — no downloads needed.",
    url: "https://lokayantra.vercel.app/search",
    siteName: "LokaYantra",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Games | LokaYantra",
    description: "Search 500+ free online games — no downloads needed.",
  },
};

export default async function SearchPage() {
  let popularGames: GamePixGame[] = [];
  let newestGames: GamePixGame[] = [];
  let categories: string[] = [];
  let adminGames: GamePixGame[] = [];

  try {
    popularGames = await fetchSearchIndex("q");
  } catch {
    popularGames = [];
  }

  try {
    newestGames = await fetchSearchIndex("d");
  } catch {
    newestGames = [];
  }

  try {
    categories = await fetchAllCategories();
  } catch {
    categories = [];
  }

  // Admin-uploaded games (Featured section lo unnavi) — ivi GamePix feed
  // lo raavu, kabatti veti కోసం search ki వేరే గా fetch చేసి కలుపుతున్నాం.
  try {
    const fbGames = await getHomepageGames(200);
    adminGames = fbGames.map((g) => ({
      id: g.id,
      title: g.title,
      thumbnail: g.thumbnail ?? "",
      category: g.category ?? "",
      embedUrl: g.embedUrl ?? g.gameUrl ?? "",
      slug: g.slug ?? g.id,
      description: g.description ?? "",
    }));
  } catch (err) {
    console.error("search: getHomepageGames failed:", err);
    adminGames = [];
  }

  // Merge — admin games (curated) mundu, GamePix games tarwatha,
  // duplicates (same id) తీసేసి.
  const seen = new Set<string>();
  const mergedPopular: GamePixGame[] = [];
  for (const g of [...adminGames, ...popularGames]) {
    if (seen.has(g.id)) continue;
    seen.add(g.id);
    mergedPopular.push(g);
  }

  const seenNewest = new Set<string>();
  const mergedNewest: GamePixGame[] = [];
  for (const g of [...adminGames, ...newestGames]) {
    if (seenNewest.has(g.id)) continue;
    seenNewest.add(g.id);
    mergedNewest.push(g);
  }

  return (
    <main className="w-full min-h-screen text-white font-sans pb-12 relative overflow-hidden select-none bg-[#0a0a0d]">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-white/10" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-white/8" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-white/5" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-white/8" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-white/10" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-4 pt-[105px] sm:pt-[115px]">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-sm mb-6">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">
            LokaYantra Arcade Station
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1">
            Search Games
          </h1>
        </div>

        <Suspense fallback={
          <div className="w-full py-24 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-white/30">Loading search…</p>
          </div>
        }>
          <SearchResultsClient
            initialGames={mergedPopular}
            newestGames={mergedNewest}
            categories={categories}
          />
        </Suspense>

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            ← Back to All Games
          </Link>
        </div>
      </div>
    </main>
  );
}