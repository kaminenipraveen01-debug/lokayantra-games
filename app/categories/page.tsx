import type { Metadata } from "next";
import Link from "next/link";
import { fetchAllCategories } from "@/lib/gamepix";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All Game Categories | LokaYantra",
  description: "Browse all game categories on LokaYantra — Action, Racing, Puzzle, Adventure, Sports, and more. Find your favorite type of free online HTML5 games.",
};

// Category కి SVG icon
function CategorySVG({ id }: { id: string }) {
  const icons: Record<string, React.ReactNode> = {
    action: <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z" fill="currentColor" />,
    racing: <><circle cx="7" cy="17" r="2.5" fill="currentColor" /><circle cx="17" cy="17" r="2.5" fill="currentColor" /><path d="M5 17L6 9H18L19 17M9 9L11 4H13L15 9" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
    puzzle: <path d="M5 5H11V8.5C11 9.5 12 10 13 9.5C14 9 15 9.5 15 10.8C15 12 14 12.5 13 12C12 11.5 11 12 11 13V17H5V11C4 11 3 10 3.5 9C4 8 3.5 7 2.5 7C1.5 7 1 8 1.5 9C2 10 1.5 11 0.5 11V5H5Z" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    adventure: <><path d="M12 3L19 8V21H5V8L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M9 21V14H15V21" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
    sports: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21" stroke="currentColor" strokeWidth="1" /><path d="M12 3C12 3 16 7 16 12C16 17 12 21 12 21" stroke="currentColor" strokeWidth="1" /><path d="M3 12H21" stroke="currentColor" strokeWidth="1" /></>,
    shooter: <><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="currentColor" strokeWidth="1.6" /></>,
    arcade: <><rect x="5" y="2" width="14" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M9 17V20M15 17V20M7 20H17" stroke="currentColor" strokeWidth="1.4" /><path d="M9 8H15M12 6V10" stroke="currentColor" strokeWidth="1.5" /></>,
    simulation: <><rect x="4" y="7" width="16" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M8 7V4H16V7" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M4 11H20M9 14H15" stroke="currentColor" strokeWidth="1" /></>,
    brain: <path d="M9.5 2C7 2 5 4 5 6.5C5 7.5 5.3 8.4 5.9 9.1C5.3 9.8 5 10.8 5 11.8C5 14.1 6.8 16 9 16.3C9.4 17.5 10.6 18.5 12 18.5C13.4 18.5 14.6 17.5 15 16.3C17.2 16 19 14.1 19 11.8C19 10.8 18.7 9.8 18.1 9.1C18.7 8.4 19 7.5 19 6.5C19 4 17 2 14.5 2C13.4 2 12.4 2.4 11.7 3C11 2.4 10 2 9.5 2Z" fill="none" stroke="currentColor" strokeWidth="1.4" />,
    io: <><circle cx="12" cy="12" r="3" fill="currentColor" /><circle cx="5" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="19" cy="5" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="5" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="19" cy="19" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
    battle: <path d="M6.5 17.5L17.5 6.5M14 4L20 10M4 14L10 20M7 14L4 17L7 20M14 7L17 4L20 7" fill="none" stroke="currentColor" strokeWidth="1.6" />,
    girls: <><circle cx="12" cy="7" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12 10.5C8 10.5 5 13 5 17V21H19V17C19 13 16 10.5 12 10.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
    ball: <><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M12 3V21M3.5 7.5L20.5 7.5M3.5 16.5L20.5 16.5" stroke="currentColor" strokeWidth="1" /></>,
    memory: <><rect x="3" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" /><rect x="14" y="3" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" /><rect x="3" y="14" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" /><rect x="14" y="14" width="7" height="7" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
    card: <><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M3 9H21" stroke="currentColor" strokeWidth="1.6" /></>,
    fighting: <path d="M8 3L5 9H9L7 14L16 7H12L14 3H8Z" fill="none" stroke="currentColor" strokeWidth="1.5" />,
    horror: <><path d="M12 2L14.5 8H21L16 12.5L18 19L12 15L6 19L8 12.5L3 8H9.5L12 2Z" fill="none" stroke="currentColor" strokeWidth="1.5" /></>,
    "match-3": <><circle cx="7" cy="7" r="2.5" fill="currentColor" /><circle cx="12" cy="7" r="2.5" fill="currentColor" /><circle cx="17" cy="7" r="2.5" fill="currentColor" /><circle cx="7" cy="17" r="2.5" fill="currentColor" /><circle cx="12" cy="17" r="2.5" fill="currentColor" /></>,
    stickman: <><circle cx="12" cy="4" r="2" fill="currentColor" /><path d="M12 6V14M8 9L12 11L16 9M10 14L8 20M14 14L16 20" stroke="currentColor" strokeWidth="1.6" fill="none" /></>,
    "2048": <><rect x="3" y="3" width="8" height="8" rx="1" fill="none" stroke="currentColor" strokeWidth="1.6" /><rect x="13" y="3" width="8" height="8" rx="1" fill="currentColor" opacity="0.3" stroke="currentColor" strokeWidth="1.6" /><rect x="3" y="13" width="8" height="8" rx="1" fill="currentColor" opacity="0.6" stroke="currentColor" strokeWidth="1.6" /><rect x="13" y="13" width="8" height="8" rx="1" fill="currentColor" stroke="currentColor" strokeWidth="1.6" /></>,
    driving: <><rect x="3" y="10" width="18" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M6 10L8 5H16L18 10" stroke="currentColor" strokeWidth="1.5" fill="none" /><circle cx="8" cy="18" r="2" fill="currentColor" /><circle cx="16" cy="18" r="2" fill="currentColor" /></>,
    cooking: <><path d="M9 3C9 3 8 6 10 8C12 10 11 13 11 13H13C13 13 12 10 14 8C16 6 15 3 15 3" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M7 13H17V18C17 19.1 16.1 20 15 20H9C7.9 20 7 19.1 7 18V13Z" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
    kids: <><circle cx="12" cy="9" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" /><path d="M8 9C8 9 5 8 4 6M16 9C16 9 19 8 20 6" stroke="currentColor" strokeWidth="1.4" /><path d="M6 20C6 16.7 8.7 14 12 14C15.3 14 18 16.7 18 20" fill="none" stroke="currentColor" strokeWidth="1.6" /></>,
  };

  const defaultIcon = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="w-7 h-7">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );

  const iconContent = icons[id];
  if (!iconContent) return defaultIcon;

  return (
    <svg viewBox="0 0 24 24" className="w-7 h-7">
      {iconContent}
    </svg>
  );
}

function formatCategoryName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function CategoriesPage() {
  let categories: string[] = [];
  try {
    categories = await fetchAllCategories();
  } catch {
    categories = [];
  }

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
            LokaYantra Arcade Station
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-black uppercase tracking-tight mt-1 mb-3">
            All Game Categories
          </h1>
          <p className="text-xs sm:text-sm text-black/60 font-semibold leading-relaxed max-w-3xl">
            At LokaYantra we organize thousands of free browser games into clear, easy-to-browse categories.
            Whether you&apos;re after heart-pounding action, brain-teasing puzzles, high-speed racing, or relaxing
            simulation games — every category links to a curated collection of HTML5 games that load instantly,
            no downloads, no installs.
          </p>
          <p className="text-[10px] font-bold text-black/40 mt-3">{categories.length} categories available</p>
        </div>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {categories.map((catId) => (
              <Link
                key={catId}
                href={`/category/${catId}`}
                className="group flex items-center gap-3 p-3.5 sm:p-4 rounded-[16px] border border-black/10 bg-white/50 hover:bg-white/80 hover:border-black/20 hover:-translate-y-0.5 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.12)] transition-all duration-200"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-black/5 group-hover:bg-black group-hover:text-white text-black/70 flex items-center justify-center transition-colors duration-200">
                  <CategorySVG id={catId} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wide text-black/80 group-hover:text-black leading-tight">
                  {formatCategoryName(catId)} Games
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center font-bold py-20 bg-white/20 rounded-[24px] border border-black/10 uppercase tracking-wider text-xs">
            Categories loading failed. Please try again later.
          </div>
        )}

        <div className="mt-8">
          <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/50 hover:text-black transition-colors">
            ← Back to All Games
          </Link>
        </div>
      </div>
    </main>
  );
}