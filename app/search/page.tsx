import type { Metadata } from "next";
import Link from "next/link";
import { fetchSearchIndex, fetchAllCategories } from "@/lib/gamepix";
import SearchResultsClient from "@/components/SearchResultsClient";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Search Games | LokaYantra",
  description: "Search and filter thousands of free HTML5 games on LokaYantra by name, category, and popularity.",
};

export default async function SearchPage() {
  let popularGames: any[] = [];
  let newestGames: any[] = [];
  let categories: string[] = [];

  try {
    popularGames = await fetchSearchIndex("quality");
  } catch {
    popularGames = [];
  }

  try {
    newestGames = await fetchSearchIndex("pubdate");
  } catch {
    newestGames = [];
  }

  try {
    categories = await fetchAllCategories();
  } catch {
    categories = [];
  }

  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/20" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/15" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/10" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-black/15" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-black/10" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-black/20" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-4 pt-[105px] sm:pt-[115px]">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-black/10 p-6 sm:p-10 shadow-sm mb-6">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40">
            LokaYantra Arcade Station
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1">
            Search Games
          </h1>
        </div>

        <SearchResultsClient
          initialGames={popularGames}
          newestGames={newestGames}
          categories={categories}
        />

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors">
            ← Back to All Games
          </Link>
        </div>
      </div>
    </main>
  );
}