import type { Metadata } from "next";
import Link from "next/link";
import { FEATURED_CATEGORIES } from "@/lib/categories";
import CategoryIcon from "@/components/CategoryIcon";

export const metadata: Metadata = {
  title: "All Game Categories | LokaYantra",
  description: "Browse all game categories on LokaYantra — Action, Racing, Puzzle, Adventure, Sports, and more. Find your favorite type of free online HTML5 games.",
};

export default function CategoriesPage() {
  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">

      {/* BLACK BUBBLES */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/95" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/90" />
        <div className="absolute top-[20px] left-[35%] w-[80px] h-[80px] rounded-full bg-black/95" />
        <div className="absolute top-[-30px] right-[35%] w-[140px] h-[140px] rounded-full bg-black/95" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/85" />
        <div className="absolute top-[280px] left-[12%] w-[110px] h-[110px] rounded-full bg-black/85" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-black/90" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-black/85" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-black/95" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 sm:px-4 pt-[105px] sm:pt-[115px]">

        <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-black/10 p-6 sm:p-10 shadow-sm mb-6">
          <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40">
            LokaYantra Arcade Station
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1 mb-3">
            All Game Categories
          </h1>
          <p className="text-xs sm:text-sm text-black/60 font-semibold leading-relaxed max-w-3xl">
            At LokaYantra we organize thousands of free browser games into clear, easy-to-browse categories.
            Whether you&apos;re after heart-pounding action, brain-teasing puzzles, high-speed racing, or relaxing
            simulation games, our categories help you find exactly the kind of game you&apos;re in the mood for.
            Every category below links to a curated collection of HTML5 games that load instantly, with no
            downloads and no installs — just click and play.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.id}`}
              className="group flex flex-col gap-3 p-5 rounded-[20px] border border-black/10 bg-white/50 hover:bg-white/70 hover:border-black/30 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center group-hover:bg-[#161920]">
                <CategoryIcon icon={cat.icon} className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-wide text-black">{cat.name}</h2>
                <p className="text-[10px] font-semibold text-black/50 mt-1 leading-relaxed line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8">
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