import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchGamePixPage } from "@/lib/gamepix";
import CategoryGamesClient from "@/components/CategoryGamesClient";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

function formatCategoryName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const name = formatCategoryName(id);
  return {
    title: `${name} Games - Play Free Online | LokaYantra`,
    description: `Play free ${name.toLowerCase()} games online on LokaYantra. No downloads, no installs — just click and play instantly in your browser.`,
    alternates: { canonical: `https://lokayantra.vercel.app/category/${id}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const name = formatCategoryName(id);

  let initialGames: any[] = [];
  try {
    const pages = await Promise.all([
      fetchGamePixPage(1, id),
      fetchGamePixPage(2, id),
      fetchGamePixPage(3, id),
      fetchGamePixPage(4, id),
    ]);
    initialGames = pages.flat();
  } catch {
    initialGames = [];
  }

  if (initialGames.length === 0) notFound();

  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/95" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/90" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/85" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-black/90" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-black/85" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-black/95" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-4 pt-[105px] sm:pt-[115px]">
        <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-black/10 p-6 sm:p-10 shadow-sm mb-6">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40">
            Game Category
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1 mb-2">
            {name} Games
          </h1>
          <p className="text-xs sm:text-sm text-black/60 font-semibold leading-relaxed max-w-2xl">
            Browse our growing collection of free {name.toLowerCase()} games — all playable
            instantly in your browser with no downloads or installs needed.
          </p>
        </div>

        <CategoryGamesClient
          initialGames={initialGames}
          categoryId={id}
          initialPage={4}
        />

        <div className="mt-8 flex gap-4">
          <Link href="/categories" className="text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors">
            ← All Categories
          </Link>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors">
            ← All Games
          </Link>
        </div>
      </div>
    </main>
  );
}