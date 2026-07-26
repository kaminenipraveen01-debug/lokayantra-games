import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchGamePixPage } from "@/lib/gamepix";
import CategoryGamesClient from "@/components/CategoryGamesClient";
import AdBanner from "@/components/AdBanner";
import NativeBanner from "@/components/NativeBanner";
import categoryContentData from "@/data/category-content.json";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

interface CategoryContent {
  intro: string;
  highlights: string[];
}

function getCategoryContent(id: string): CategoryContent | null {
  const raw = (categoryContentData as Record<string, any>)[id];
  if (raw && typeof raw.intro === "string" && Array.isArray(raw.highlights)) {
    return { intro: raw.intro, highlights: raw.highlights };
  }
  return null;
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
  const lower = name.toLowerCase();
  const url = `https://lokayantra.vercel.app/category/${id}`;

  const title = `${name} Games — Play Free Online, No Download | LokaYantra`;
  const description =
    `Play free ${lower} games online instantly — no download, no install needed. ` +
    `Browse our full collection of ${lower} games and play directly in your browser on LokaYantra.`;
  const keywords = [
    `${lower} games`,
    `free ${lower} games`,
    `${lower} games online`,
    `play ${lower} games no download`,
    `best ${lower} games 2026`,
    "free browser games",
    "html5 games online",
  ];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title, description, url, siteName: "LokaYantra", type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const name = formatCategoryName(id);
  const categoryContent = getCategoryContent(id);

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
            Game Category
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mt-1 mb-2">
            {name} Games
          </h1>
          <p className="text-xs sm:text-sm text-white/60 font-semibold leading-relaxed max-w-2xl">
            Browse our growing collection of free {name.toLowerCase()} games — all playable
            instantly in your browser with no downloads or installs needed.
          </p>

          {categoryContent && (
            <>
              <p className="text-xs sm:text-sm text-white/60 font-semibold leading-relaxed max-w-2xl mt-3">
                {categoryContent.intro}
              </p>
              {categoryContent.highlights.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {categoryContent.highlights.map((h, i) => (
                    <span key={i} className="text-[10px] font-black uppercase tracking-wide px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60">
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div className="w-full flex items-center justify-center py-2 mb-6 rounded-[16px] bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          <AdBanner adKey="1964a0ad17560680bdab1ffb00859133" width={468} height={60} />
        </div>

        <CategoryGamesClient
          initialGames={initialGames}
          categoryId={id}
          initialPage={4}
          initialTotalPages={50}
        />

        <div className="w-full flex items-center justify-center py-2 mt-8 rounded-[16px] bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          <AdBanner adKey="b0af7b8091bb9ba523dec2416736fdaa" width={728} height={90} />
        </div>

        <div className="mt-6 flex gap-4">
          <Link href="/categories" className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            ← All Categories
          </Link>
          <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
            ← All Games
          </Link>
        </div>

        <div className="w-full flex items-center justify-center py-3 mt-6 rounded-[16px] bg-white/5 backdrop-blur-md border border-white/10 overflow-hidden">
          <NativeBanner />
        </div>
      </div>
    </main>
  );
}