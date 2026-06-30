import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryById, FEATURED_CATEGORIES } from "@/lib/categories";
import { fetchGamePixPage } from "@/lib/gamepix";
import CategoryIcon from "@/components/CategoryIcon";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const cat = getCategoryById(id);
  if (!cat) return { title: "Category Not Found | LokaYantra" };

  return {
    title: `${cat.name} Games - Play Free Online | LokaYantra`,
    description: `${cat.description} Play free ${cat.name.toLowerCase()} games online on LokaYantra, no downloads required.`,
    alternates: { canonical: `https://lokayantra.vercel.app/category/${cat.id}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const cat = getCategoryById(id);
  if (!cat) notFound();

  let games: any[] = [];
  try {
    const [p1, p2, p3, p4] = await Promise.all([
      fetchGamePixPage(1, cat.id),
      fetchGamePixPage(2, cat.id),
      fetchGamePixPage(3, cat.id),
      fetchGamePixPage(4, cat.id),
    ]);
    games = [...p1, ...p2, ...p3, ...p4];
  } catch {
    games = [];
  }

  const otherCategories = FEATURED_CATEGORIES.filter((c) => c.id !== cat.id).slice(0, 6);

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

        <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-black/10 p-6 sm:p-10 shadow-sm mb-6 flex items-start gap-4">
          <div className="w-14 h-14 shrink-0 rounded-2xl bg-black text-white flex items-center justify-center">
            <CategoryIcon icon={cat.icon} className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40">
              Game Category
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1 mb-2">
              {cat.name} Games
            </h1>
            <p className="text-xs sm:text-sm text-black/60 font-semibold leading-relaxed max-w-2xl">
              {cat.description} Browse our growing collection of free {cat.name.toLowerCase()} games — all playable
              instantly in your browser with no downloads or installs needed.
            </p>
          </div>
        </div>

        {games.length > 0 ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.id}`}
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
        ) : (
          <div className="text-center font-bold py-20 bg-white/20 rounded-[24px] border border-black/10 uppercase tracking-wider text-xs">
            No games found in this category right now.
          </div>
        )}

        {/* OTHER CATEGORIES */}
        <div className="mt-10 bg-white/60 backdrop-blur-2xl rounded-[24px] border border-black/10 p-6 shadow-sm">
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 mb-4">
            Explore Other Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {otherCategories.map((c) => (
              <Link
                key={c.id}
                href={`/category/${c.id}`}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/10 bg-white/50 hover:bg-[#161920] hover:text-white hover:border-black text-[10px] font-black uppercase tracking-wide transition-colors"
              >
                <CategoryIcon icon={c.icon} className="w-3.5 h-3.5" />
                {c.name}
              </Link>
            ))}
            <Link
              href="/categories"
              className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/30 bg-black text-white text-[10px] font-black uppercase tracking-wide hover:bg-[#161920] transition-colors"
            >
              All Categories →
            </Link>
          </div>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors"
          >
            ← Back to All Games
          </Link>
        </div>
      </div>
    </main>
  );
}