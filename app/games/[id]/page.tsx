import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getGameAdmin, getRelatedGamesAdmin } from "@/lib/games-admin";
import PlayCounter from "@/components/PlayCounter";
import DisqusComments from "@/components/DisqusComments";
import FaqAccordion from "@/components/FaqAccordion";
import GamePlayer from "@/components/GamePlayer";
import Link from "next/link";
import Image from "next/image";

interface GamePageProps {
  params: Promise<{ id: string }>;
}

export const revalidate = 3600;
export const dynamicParams = true;

const SITE_URL = "https://lokayantra.vercel.app";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export async function generateMetadata({ params }: GamePageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const game = await getGameAdmin(resolvedParams.id);
  if (!game) return { title: "Game Not Found | LokaYantra" };

  const title = `${game.title} - Play Online on LokaYantra`;
  const description =
    (game.description as string | undefined)?.slice(0, 160) ||
    `Play ${game.title} online for free on LokaYantra Arcade Station. No downloads, no clutter, just pure gaming magic!`;

  const gameUrl = `${SITE_URL}/games/${game.slug || game.id}`;
  const imageUrl = (game.thumbnail as string | undefined) || `${SITE_URL}/og-image.png`;

  return {
    title,
    description,
    alternates: { canonical: gameUrl },
    openGraph: {
      title,
      description,
      url: gameUrl,
      siteName: "LokaYantra",
      images: [{ url: imageUrl, width: 1200, height: 630, alt: game.title as string }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function GamePage({ params }: GamePageProps) {
  const resolvedParams = await params;
  
  let game;
  try {
    game = await getGameAdmin(resolvedParams.id);
  } catch (err) {
    console.error("Failed to fetch game:", err);
    notFound(); // error వస్తే 404 చూపించు
  }
  
  if (!game) notFound();

  let relatedGames: any[] = [];
  try {
    relatedGames = game.category
      ? await getRelatedGamesAdmin(game.category, game.id, 30)
      : [];
  } catch {
    relatedGames = [];
  }

  const bottomGames = relatedGames.slice(0, 30);
  // ... rest of the code same గా ఉంచండి

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: game.title,
    description:
      (game.description as string | undefined)?.slice(0, 160) ||
      `Play ${game.title} online for free on LokaYantra.`,
    image: game.thumbnail
      ? [game.thumbnail]
      : [`${SITE_URL}/og-image.png`],
    url: `${SITE_URL}/games/${game.slug || game.id}`,
    applicationCategory: "GameApplication",
    operatingSystem: "Web Browser, Windows, Android, iOS",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    author: {
      "@type": "Organization",
      name: (game.developer as string | undefined) || "LokaYantra",
    },
  };

  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PlayCounter gameId={game.id} />

      {/* BLACK BUBBLES BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/95" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/90" />
        <div className="absolute top-[20px] left-[35%] w-[80px] h-[80px] rounded-full bg-black/95" />
        <div className="absolute top-[-30px] right-[35%] w-[140px] h-[140px] rounded-full bg-black/95" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/85" />
        <div className="absolute top-[180px] left-[2%] w-[60px] h-[60px] rounded-full bg-black/90" />
        <div className="absolute top-[130px] right-[25%] w-[90px] h-[90px] rounded-full bg-black/85" />
        <div className="absolute top-[220px] right-[45%] w-[70px] h-[70px] rounded-full bg-black/90" />
        <div className="absolute top-[280px] left-[12%] w-[110px] h-[110px] rounded-full bg-black/85" />
        <div className="absolute top-[290px] right-[18%] w-[100px] h-[100px] rounded-full bg-black/90" />
        <div className="absolute top-[400px] left-[25%] w-[130px] h-[130px] rounded-full bg-black/90" />
        <div className="absolute top-[450px] left-[60%] w-[95px] h-[95px] rounded-full bg-black/85" />
        <div className="absolute top-[480px] right-[5%] w-[170px] h-[170px] rounded-full bg-black/90" />
        <div className="absolute top-[550px] left-[45%] w-[80px] h-[80px] rounded-full bg-black/95" />
        <div className="absolute top-[580px] left-[3%] w-[125px] h-[125px] rounded-full bg-black/90" />
        <div className="absolute top-[650px] right-[28%] w-[140px] h-[140px] rounded-full bg-black/85" />
        <div className="absolute top-[750px] right-[12%] w-[150px] h-[150px] rounded-full bg-black/90" />
        <div className="absolute top-[820px] left-[35%] w-[115px] h-[115px] rounded-full bg-black/85" />
        <div className="absolute top-[940px] left-[8%] w-[135px] h-[135px] rounded-full bg-black/90" />
        <div className="absolute top-[1100px] left-[15%] w-[140px] h-[140px] rounded-full bg-black/85" />
        <div className="absolute top-[1180px] right-[8%] w-[165px] h-[165px] rounded-full bg-black/90" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-black/90" />
        <div className="absolute bottom-[220px] right-[15%] w-[210px] h-[210px] rounded-full bg-black/85" />
        <div className="absolute bottom-[-30px] left-[12%] w-[190px] h-[190px] rounded-full bg-black/85" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-black/95" />
      </div>

      {/* MAIN LAYOUT */}
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-2 sm:px-3 pt-[100px] sm:pt-[115px]">
        <div className="flex gap-3 items-start">

          {/* LEFT AD SLOT */}
          <div className="hidden xl:flex flex-col items-center w-[160px] shrink-0 pt-32">
            <div className="w-[160px] h-[600px] rounded-[20px] bg-white/40 backdrop-blur-md border border-black/10 flex flex-col items-center justify-center overflow-hidden sticky top-28">
              <div className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-2">Ad</div>
              <ins className="adsbygoogle"
                style={{ display: "inline-block", width: "160px", height: "600px" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX" />
            </div>
          </div>

          {/* CENTER PANEL */}
          <div className="flex-1 min-w-0 flex flex-col gap-3">
            <GamePlayer game={{
                                 id: game.id,
                                 title: game.title,
                                 category: game.category,
                                 thumbnail: game.thumbnail,
                                 slug: game.slug,
                                 gameUrl: game.gameUrl,
                                 embedUrl: game.embedUrl,
                                 likes: game.likes,
                                 dislikes: game.dislikes,
                                 youtubeEmbedUrl: game.youtubeEmbedUrl,
                               }} />

            {/* MOBILE AD */}
            <div className="lg:hidden w-full rounded-[16px] bg-white/40 backdrop-blur-md border border-black/10 overflow-hidden flex flex-col items-center justify-center py-2 min-h-[100px]">
              <div className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-1">Ad</div>
              <ins className="adsbygoogle"
                style={{ display: "block", width: "100%", maxWidth: "336px", height: "90px" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX"
                data-ad-format="horizontal" />
            </div>

            {/* RELATED GAMES */}
            {bottomGames.length > 0 && (
              <div className="mt-1">
                <div className="flex items-center justify-between mb-2.5 px-0.5">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-black/25" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50">
                      More {(game.category as string) || "Games"}
                    </span>
                  </div>
                  <Link
                    href="/"
                    className="text-[9px] font-black uppercase tracking-widest text-black/35 hover:text-black transition-colors"
                  >
                    SEE ALL →
                  </Link>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 gap-2">
                  {bottomGames.map((rg: any) => (
                    <Link
                      key={rg.id}
                      href={`/games/${rg.slug || rg.id}`}
                      className="group relative rounded-[16px] overflow-hidden border border-black/10 hover:border-black/50 bg-white/35 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
                    >
                      <div className="relative w-full aspect-square">
                        {rg.thumbnail ? (
                          <img
                            src={rg.thumbnail}
                            alt={rg.title}
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 group-hover:contrast-100 group-hover:scale-105 transition-all duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                            <span className="text-[7px] font-black text-black/25 uppercase">NO IMG</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                            <svg className="w-3.5 h-3.5 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-1.5 bg-white/55 border-t border-black/5">
                        <p className="text-[9px] font-black text-black uppercase tracking-wide truncate leading-tight">
                          {rg.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* INFO SECTION */}
            <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2 flex flex-col gap-3">
                <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] border border-black/10 p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-black/40">
                        {(game.category as string) || "Arcade"}
                      </span>
                      <h1 className="text-base sm:text-lg font-black text-black uppercase tracking-tight leading-tight mt-0.5">
                        {game.title as string}
                      </h1>
                    </div>
                    {game.developer && (
                      <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-black/50 bg-black/5 border border-black/10 rounded-lg px-2 py-1.5 mt-1">
                        by {game.developer as string}
                      </span>
                    )}
                  </div>

                  {game.description && (
                    <p className="text-xs text-black/60 font-semibold leading-relaxed">
                      {game.description as string}
                    </p>
                  )}

                  {game.howToPlay && (
                    <div className="mt-4 pt-4 border-t border-black/8">
                      <h3 className="text-[9px] font-black text-black/40 uppercase tracking-[0.25em] mb-2">
                        How to Play
                      </h3>
                      <p className="text-xs text-black/60 font-semibold leading-relaxed">
                        {game.howToPlay as string}
                      </p>
                    </div>
                  )}

                  {game.tips && (game.tips as string[]).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-black/8">
                      <h3 className="text-[9px] font-black text-black/40 uppercase tracking-[0.25em] mb-2">
                        Tips &amp; Tricks
                      </h3>
                      <ul className="flex flex-col gap-1.5">
                        {(game.tips as string[]).map((tip, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-black/60 font-semibold leading-relaxed">
                            <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full bg-black/8 border border-black/10 flex items-center justify-center text-[8px] font-black text-black/40">
                              {i + 1}
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {game.faqs && (game.faqs as any[]).length > 0 && (
                  <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] border border-black/10 p-5 shadow-sm">
                    <h4 className="text-[9px] font-black text-black/40 uppercase tracking-[0.25em] mb-3">FAQ INDEX</h4>
                    <FaqAccordion items={game.faqs as { question: string; answer: string }[]} />
                  </div>
                )}

                <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] border border-black/10 p-5 shadow-sm">
                  <DisqusComments
                    url={`${SITE_URL}/games/${game.id}`}
                    identifier={game.id}
                    title={game.title as string}
                  />
                </div>
              </div>

              {/* SIDEBAR */}
              <div>
                <div className="bg-white/60 backdrop-blur-2xl rounded-[24px] border border-black/10 p-5 shadow-sm md:sticky md:top-4">
                  <h4 className="text-[10px] font-black text-black uppercase tracking-[0.2em] border-b border-black/10 pb-2.5 mb-3">
                    Game Info
                  </h4>
                  <div className="flex flex-col gap-3 text-[10px] font-black uppercase tracking-wider">
                    {game.developer && (
                      <div className="flex justify-between items-center">
                        <span className="text-black/40">Developer</span>
                        <span className="text-black/80 normal-case font-bold text-right max-w-[130px] truncate">
                          {game.developer as string}
                        </span>
                      </div>
                    )}
                    {game.category && (
                      <div className="flex justify-between items-center">
                        <span className="text-black/40">Category</span>
                        <span className="text-black/80">{game.category as string}</span>
                      </div>
                    )}
                    {game.playCount !== undefined && (
                      <div className="flex justify-between items-center">
                        <span className="text-black/40">Plays</span>
                        <span className="text-black/80">{formatCount(game.playCount as number)}</span>
                      </div>
                    )}
                  </div>
                  {game.controls && (
                    <div className="mt-4 pt-3 border-t border-black/8">
                      <span className="text-[9px] font-black text-black/35 uppercase tracking-widest block mb-2">Controls</span>
                      <p className="text-[11px] text-black/60 font-semibold leading-relaxed normal-case bg-black/5 rounded-xl p-3 border border-black/8">
                        {game.controls as string}
                      </p>
                    </div>
                  )}
                  <div className="mt-4 pt-3 border-t border-black/8 flex flex-col gap-1.5">
                    <span className="text-[9px] font-black text-black/35 uppercase tracking-widest mb-1">More Games</span>
                    {game.category && (
                      <Link href="/" className="text-[10px] font-black text-black/50 hover:text-black transition-colors uppercase tracking-wider">
                        → More {game.category as string}
                      </Link>
                    )}
                    <Link href="/" className="text-[10px] font-black text-black/50 hover:text-black transition-colors uppercase tracking-wider">
                      → All Games
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT ADS */}
          <div className="hidden lg:flex flex-col gap-4 w-[300px] shrink-0 mt-32 sticky top-28">
            <div className="w-[300px] h-[250px] rounded-[20px] bg-white/40 backdrop-blur-md border border-black/10 flex flex-col items-center justify-center overflow-hidden">
              <div className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-2">Ad</div>
              <ins className="adsbygoogle"
                style={{ display: "inline-block", width: "300px", height: "250px" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX" />
            </div>
            <div className="w-[300px] h-[600px] rounded-[20px] bg-white/40 backdrop-blur-md border border-black/10 flex flex-col items-center justify-center overflow-hidden">
              <div className="text-[8px] font-black uppercase tracking-widest text-black/20 mb-2">Ad</div>
              <ins className="adsbygoogle"
                style={{ display: "inline-block", width: "300px", height: "600px" }}
                data-ad-client="ca-pub-XXXXXXXXXXXXXX"
                data-ad-slot="XXXXXXXXXX" />
            </div>
          </div>
        </div>

        {/* BRAND STRIP */}
        <div className="mt-6 border border-black/10 p-6 sm:p-10 rounded-[28px] sm:rounded-[32px] shadow-xl space-y-3 bg-white/60 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-black/60">LOKAYANTRA ARCADE STATION</span>
          <h2 className="text-xl sm:text-3xl font-black text-black tracking-tight">No Downloads. No Clutter. Just Magic.</h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-black/70 font-semibold leading-relaxed">
            Welcome to LokaYantra. We smashed the boring web grids to build a living, breathing playground of free HTML5 games.
          </p>
        </div>

        {/* FOOTER */}
        <footer className="mt-4 border border-black/10 p-6 sm:p-10 rounded-[28px] sm:rounded-[32px] shadow-2xl bg-white/65 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          <div className="md:col-span-5 flex flex-col justify-between space-y-6 md:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#f0f0f0] rounded-full flex items-center justify-center border border-black/10">
                  <svg viewBox="0 0 100 100" className="w-8 h-8" fill="none">
                    <circle cx="50" cy="55" r="36" fill="#000" />
                    <circle cx="26" cy="24" r="13" fill="#000" />
                    <circle cx="74" cy="24" r="13" fill="#000" />
                    <circle cx="50" cy="57" r="27" fill="#fff" />
                    <circle cx="39" cy="55" r="6" fill="#000" />
                    <circle cx="61" cy="55" r="6" fill="#000" />
                  </svg>
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter text-[#161920]">LokaYantra</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-black/60 max-w-sm leading-relaxed italic">
                &ldquo;Boring grids are dead. Welcome to the infinite monochrome playground.&rdquo;
              </p>
              <div className="flex items-center gap-2.5 pt-1">
                <Link href="https://www.instagram.com/lokayantraofficial?utm_source=qr&igsh=MXBndWQ3MG9uaDE1bw%3D%3D" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md hover:bg-black/80">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Link>
                <Link href="https://youtube.com/@official.lokayantra?si=0SE7fSqRAd5WxW3h" target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-md hover:bg-black/80">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </Link>
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-black/50 pt-4">© 2026 LOKAYANTRA. ALL RIGHTS RESERVED.</div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 md:gap-4 pt-4 md:pt-0">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/90 border-b border-black/10 pb-1">Explore</h3>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black/60">
                <li><Link href="/" className="hover:text-black transition-colors">All Games</Link></li>
                <li><Link href="/trending" className="hover:text-black transition-colors">Trending Games</Link></li>
                <li><Link href="/2-player" className="hover:text-black transition-colors">2 Player Games</Link></li>
                <li><Link href="/new-releases" className="hover:text-black transition-colors">New Releases</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/90 border-b border-black/10 pb-1">Studio</h3>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black/60">
                <li><Link href="/about" className="hover:text-black transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="hover:text-black transition-colors">Contact Station</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/90 border-b border-black/10 pb-1">Legal</h3>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black/60">
                <li><Link href="/privacy-policy" className="hover:text-black transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-black transition-colors">Terms &amp; Conditions</Link></li>
              </ul>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}