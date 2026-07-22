import type { Metadata } from "next";
import Link from "next/link";
import { fetchGamePixPage } from "@/lib/gamepix";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "New Games — Latest Free Online Releases | LokaYantra",
  description:
    "Check out the newest free games added to LokaYantra — fresh HTML5 browser games updated daily, no downloads needed, play instantly.",
  keywords: [
    "new games online",
    "latest free games",
    "new html5 games",
    "just released games",
    "free games updated daily",
    "new browser games 2026",
  ],
  alternates: { canonical: "https://lokayantra.vercel.app/new-releases" },
  openGraph: {
    title: "New Games — Latest Free Online Releases | LokaYantra",
    description: "Fresh free games added daily — be the first to play them, no downloads needed.",
    url: "https://lokayantra.vercel.app/new-releases",
    siteName: "LokaYantra",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "New Games | LokaYantra",
    description: "The newest free online games, updated daily — no downloads needed.",
  },
};

async function fetchNewReleasesPage(page: number) {
  try {
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json/?order=pubdate&pagination=12&sid=A3ALT&page=${page}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      id: item.namespace ?? String(item.id),
      title: item.title ?? "",
      category: item.category ?? "",
      thumbnail: item.image?.replace("w=105", "w=512") ?? "",
      embedUrl: item.url ?? "",
      slug: item.namespace ?? String(item.id),
    }));
  } catch {
    return [];
  }
}

export default async function NewReleasesPage() {
  let games: any[] = [];
  try {
    const pages = await Promise.all([
      fetchNewReleasesPage(1),
      fetchNewReleasesPage(2),
      fetchNewReleasesPage(3),
      fetchNewReleasesPage(4),
    ]);
    games = pages.flat();
  } catch {
    games = [];
  }

  return (
    <main className="w-full min-h-screen text-white font-sans pb-12 relative overflow-hidden select-none bg-[#0a0a0d]">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-white/10" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-white/8" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-white/10" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-4 pt-[105px] sm:pt-[115px]">
        <div className="bg-white/5 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-sm">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z"/>
              </svg>
              <span className="text-[9px] font-black uppercase tracking-widest text-white">New</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
            New Releases
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-semibold leading-relaxed">
            Fresh games just added — be the first to play them. Updated daily!
          </p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/games/${game.id}`}
              className="group relative aspect-square overflow-hidden rounded-[20px] border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.3)] hover:-translate-y-1.5 transition-all duration-200"
            >
              {game.thumbnail ? (
                <img src={game.thumbnail} alt={game.title} loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-[11px] font-black uppercase tracking-wider text-white/60">
                  {game.title}
                </div>
              )}
              {/* NEW badge */}
              <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 text-white text-[7px] font-black shadow-md">
                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15 9H22L16.5 13.5L18.5 21L12 16.5L5.5 21L7.5 13.5L2 9H9L12 2Z"/>
                </svg>
                <span>NEW</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-3">
                <p className="text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[70%]">{game.title}</p>
                <span className="ml-auto text-[8px] font-extrabold text-black bg-white px-2.5 py-1 rounded-md tracking-wider">PLAY</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            ← Back to All Games
          </Link>
        </div>
      </div>
    </main>
  );
}