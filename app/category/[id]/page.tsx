import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { fetchGamePixPage } from "@/lib/gamepix";
import { getHomepageGames } from "@/lib/games-admin";
import CategoryGamesClient from "@/components/CategoryGamesClient";
import AdBanner from "@/components/AdBanner";
import NativeBanner from "@/components/NativeBanner";
import categoryContentData from "@/data/category-content.json";
import FaqAccordion from "@/components/FaqAccordion";

export const revalidate = 3600;

interface CategoryPageProps {
  params: Promise<{ id: string }>;
}

interface CategoryContent {
  intro: string;
  highlights: string[];
  subgenres: { name: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

function getCategoryContent(id: string): CategoryContent | null {
  const raw = (categoryContentData as Record<string, any>)[id];
  if (raw && typeof raw.intro === "string" && Array.isArray(raw.highlights)) {
    return {
      intro: raw.intro,
      highlights: raw.highlights,
      subgenres: Array.isArray(raw.subgenres) ? raw.subgenres : [],
      faqs: Array.isArray(raw.faqs) ? raw.faqs : [],
    };
  }
  return null;
}

function formatCategoryName(id: string): string {
  return id
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function fairMix<T extends { id: string }>(base: T[], inserts: T[]): T[] {
  if (inserts.length === 0) return base;
  const seen = new Set(base.map((g) => g.id));
  const uniqueInserts = inserts.filter((g) => !seen.has(g.id));
  if (uniqueInserts.length === 0) return base;
  const result = [...base];
  const spacing = Math.max(6, Math.floor(result.length / uniqueInserts.length));
  uniqueInserts.forEach((game, i) => {
    const pos = Math.min(result.length, (i + 1) * spacing + i);
    result.splice(pos, 0, game);
  });
  return result;
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

  let adminGames: any[] = [];
try {
  const fbGames = await getHomepageGames(100);
  adminGames = fbGames
    .filter((g) => (g.category || "").toLowerCase() === id.toLowerCase())
    .map((g) => ({
      id: g.id,
      title: g.title,
      category: g.category ?? "",
      thumbnail: g.thumbnail ?? "",
      embedUrl: g.embedUrl ?? g.gameUrl ?? "",
      slug: g.slug ?? g.id,
    }));
} catch {}

initialGames = fairMix(initialGames, adminGames);

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

        {/* POPULAR IN THIS CATEGORY — real games నుండి (GamePix), AI generated కాదు,
    కాబట్టి links ఎప్పుడూ working గా ఉంటాయి, fake game names risk లేదు */}
{initialGames.length > 0 && (
  <div className="mt-6 bg-white/5 backdrop-blur-2xl rounded-[24px] border border-white/10 p-5 sm:p-8 shadow-sm">
    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 mb-4">
      Most Popular {name} Games Right Now
    </h3>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {initialGames.slice(0, 5).map((g: any) => (
        <Link
          key={g.id}
          href={`/games/${g.id}`}
          className="group flex flex-col gap-2 hover:-translate-y-1 transition-all duration-200"
        >
          <div className="relative aspect-square rounded-[16px] overflow-hidden border border-white/10 group-hover:border-white/30">
            {g.thumbnail && (
              <img src={g.thumbnail} alt={g.title} loading="lazy"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            )}
          </div>
          <p className="text-[10px] font-black text-white/70 group-hover:text-white uppercase tracking-wide truncate">{g.title}</p>
        </Link>
      ))}
    </div>
  </div>
)}

{categoryContent && (
  <div className="mt-6 bg-white/5 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-sm">
    {/* Main intro — already unna paragraph ni ikkade move చేద్దాం, article feel కోసం */}
    <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-4">
      About {name} Games
    </h2>
    <p className="text-sm text-white/70 font-semibold leading-relaxed max-w-4xl">
      {categoryContent.intro}
    </p>

    {categoryContent.subgenres && categoryContent.subgenres.length > 0 && (
      <div className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-5">
          Types of {name} Games
        </h3>
        <div className="space-y-5 max-w-4xl">
          {categoryContent.subgenres.map((s, i) => (
            <div key={i}>
              <h4 className="text-sm font-black text-white/90 uppercase tracking-wide mb-1.5">
                {s.name}
              </h4>
              <p className="text-sm text-white/60 font-semibold leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    )}

    {categoryContent.highlights && categoryContent.highlights.length > 0 && (
      <div className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-4">
          What Makes {name} Games Fun
        </h3>
        <div className="flex flex-wrap gap-2">
          {categoryContent.highlights.map((h, i) => (
            <span key={i} className="text-xs font-bold px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70">
              {h}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
)}

{categoryContent?.faqs && categoryContent.faqs.length > 0 && (
  <div className="mt-6 bg-white/5 backdrop-blur-2xl rounded-[24px] sm:rounded-[32px] border border-white/10 p-6 sm:p-10 shadow-sm">
    <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-5">
      Frequently Asked Questions
    </h3>
    <FaqAccordion items={categoryContent.faqs} />
  </div>
)}

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