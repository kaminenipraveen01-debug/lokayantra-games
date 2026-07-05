// app/[...slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { SkeletonGrid } from "@/components/SkeletonCard";

interface Game {
  id: string;
  title: string;
  slug?: string;
  thumbnail?: string;
  category?: string;
  isTrending?: boolean;
  isNew?: boolean;
  gameUrl?: string;
  embedUrl?: string;
  likes?: number;
  dislikes?: number;
  youtubeEmbedUrl?: string;
}

export default function Page() {
  const params = useParams();
  const slugParam = params?.slug;
  const currentSlug = Array.isArray(slugParam) ? slugParam[0] : (slugParam || "all");

  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Games");

  const [game, setGame] = useState<Game | null>(null);
  const [isGamePage, setIsGamePage] = useState(false);
  const router = useRouter();

  const finalCategories = [
    { id: "all", name: "All Games", path: "/" },
    { id: "action", name: "Action", path: "/action" },
    { id: "racing", name: "Racing", path: "/racing" },
    { id: "puzzle", name: "Puzzle", path: "/puzzle" },
    { id: "brain", name: "Brain", path: "/brain" },
    { id: "2-player", name: "2 Player", path: "/2-player" },
    { id: "shooting", name: "Shooting", path: "/shooting" },
    { id: "sports", name: "Sports", path: "/sports" },
    { id: "girls", name: "Girls", path: "/girls" },
  ];

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const snap = await getDocs(collection(db, "games"));
        const list: Game[] = [];
        snap.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as Game);
        });
        setAllGames(list);

        const gameDoc = list.find(g => g.id === currentSlug || g.slug === currentSlug);
        const isCat = finalCategories.some(c => c.id === currentSlug) || ["trending", "new-releases"].includes(currentSlug);

        if (gameDoc && !isCat) {
          // Game page detect ayindi — full game player (/games/[id]) ki redirect cheyyi
          // Ads, related games, comments, info akkade sariga unnai
          router.replace(`/games/${gameDoc.slug || gameDoc.id}`);
          return;
        } else {
          setIsGamePage(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentSlug]);

  useEffect(() => {
    if (isGamePage || allGames.length === 0) return;

    if (currentSlug === "trending") {
      setPageTitle("Trending Games");
      const trending = allGames.filter(g => g.isTrending === true);
      setFilteredGames(trending.length > 0 ? trending : allGames.slice(0, 6));
    } else if (currentSlug === "new-releases") {
      setPageTitle("New Releases");
      const newGames = allGames.filter(g => g.isNew === true);
      setFilteredGames(newGames.length > 0 ? newGames : [...allGames].reverse().slice(0, 5));
    } else {
      const activeCat = finalCategories.find((c) => c.id === currentSlug);
      const categoryName = activeCat ? activeCat.name : currentSlug;
      setPageTitle(currentSlug === "all" ? "All Games" : `${categoryName} Games`);
      const filtered = allGames.filter(
        (g) => currentSlug === "all" || g.category?.toLowerCase() === categoryName.toLowerCase()
      );
      setFilteredGames(filtered);
    }
  }, [currentSlug, allGames, isGamePage]);

  const pokiGridStyles = [
    { size: "col-span-2 row-span-2 w-full aspect-square" },
    { size: "col-span-1 row-span-1 w-full aspect-square" },
    { size: "col-span-1 row-span-1 w-full aspect-square" },
    { size: "col-span-1 row-span-1 w-full aspect-square" },
    { size: "col-span-1 row-span-1 w-full aspect-square" },
    { size: "col-span-2 row-span-2 w-full aspect-square" },
    { size: "col-span-1 row-span-1 w-full aspect-square" },
    { size: "col-span-1 row-span-1 w-full aspect-square" },
  ];

  // 🔄 SKELETON LOADING STATE — category click chesinappudu idi kanipistundi.
  // Real layout (title + pills + mt-8 grid) tho exact ga match avvataniki
  // ee skeleton lo kuda title placeholder + real pills + mt-8 grid pెట్టాను.
  if (loading) {
    return (
      <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black/20" />
          <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black/15" />
          <div className="absolute top-[20px] left-[35%] w-[80px] h-[80px] rounded-full bg-black/20" />
          <div className="absolute top-[-30px] right-[35%] w-[140px] h-[140px] rounded-full bg-black/20" />
          <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black/10" />
        </div>

        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-[105px] sm:mt-[115px] relative z-10">
          {/* Title placeholder — same height/margin as real h1 */}
          <div className="w-48 h-6 rounded-full bg-black/10 mb-6 animate-pulse border-l-4 border-black/10 pl-3" />

          {/* Real category pills — static data, no need to wait for fetch */}
          <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible justify-start gap-2 sm:gap-2.5 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-3 px-3 sm:mx-0 sm:px-0">
            {finalCategories.map((cat) => (
              <Link
                href={cat.path}
                key={cat.id}
                className={`group cursor-pointer flex items-center justify-center text-center font-bold uppercase tracking-wider px-4 sm:px-5 h-[36px] sm:h-[42px] text-[10px] sm:text-[12px] rounded-full border transition-all duration-200 ${
                  currentSlug === cat.id
                    ? "bg-[#161920] text-white border-black scale-105"
                    : "bg-white/60 text-black border-black/10 hover:bg-[#161920] hover:text-white"
                }`}
              >
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Same mt-8 gap as loaded grid */}
        <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8 relative z-10">
          <SkeletonGrid />
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen text-black font-sans pb-12 relative overflow-hidden select-none bg-[#cfcfcf]">
      {/* Background Bubbles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-black" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-black" />
        <div className="absolute top-[20px] left-[35%] w-[80px] h-[80px] rounded-full bg-black" />
        <div className="absolute top-[-30px] right-[35%] w-[140px] h-[140px] rounded-full bg-black" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-black" />
        <div className="absolute bottom-[420px] right-[15%] w-[210px] h-[210px] rounded-full bg-black" />
        <div className="absolute bottom-[240px] left-[8%] w-[190px] h-[190px] rounded-full bg-black" />
        <div className="absolute bottom-[110px] right-[30%] w-[240px] h-[240px] rounded-full bg-black" />
        <div className="absolute bottom-[-60px] left-[25%] w-[200px] h-[200px] rounded-full bg-black" />
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-[105px] sm:mt-[115px] relative z-10">
        <h1 className="text-xl font-black uppercase tracking-widest mb-6 text-[#161920] text-center sm:text-left border-l-4 border-black pl-3">{pageTitle}</h1>
        <div className="flex flex-nowrap sm:flex-wrap overflow-x-auto sm:overflow-visible justify-start gap-2 sm:gap-2.5 w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden -mx-3 px-3 sm:mx-0 sm:px-0">
          {finalCategories.map((cat) => (
            <Link href={cat.path} key={cat.id} className={`group cursor-pointer flex items-center justify-center text-center font-bold uppercase tracking-wider px-4 sm:px-5 h-[36px] sm:h-[42px] text-[10px] sm:text-[12px] rounded-full border transition-all duration-200 ${currentSlug === cat.id ? "bg-[#161920] text-white border-black scale-105" : "bg-white/60 text-black border-black/10 hover:bg-[#161920] hover:text-white"}`}>
              <span>{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-3 sm:px-4 mt-6 sm:mt-8 relative z-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2 grid-flow-row-dense items-center justify-center">
          {filteredGames.map((game, index) => {
            const style = pokiGridStyles[index % pokiGridStyles.length];
            return (
              <Link href={`/${game.slug || game.id}`} key={game.id} className={`group relative overflow-hidden flex flex-col items-center justify-center rounded-[24px] sm:rounded-[32px] border border-black/10 hover:border-black bg-white/30 backdrop-blur-md shadow-[0_4px_10px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_35px_rgba(0,0,0,0.4)] hover:-translate-y-2 transition-all duration-300 z-10 ${style.size}`}>
                {game.thumbnail ? (
                  <div className="relative w-full h-full overflow-hidden rounded-[24px] sm:rounded-[32px]">
                    <Image src={game.thumbnail} alt={game.title} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover h-full w-full grayscale contrast-125 brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300" />
                  </div>
                ) : (
                  <div className="p-3 text-center text-[11px] font-black uppercase tracking-wider text-black/60 truncate w-full">{game.title}</div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between rounded-b-[24px] sm:rounded-b-[32px]">
                  <p className="text-[10px] font-black uppercase tracking-wider text-white truncate max-w-[70%]">{game.title}</p>
                  <span className="text-[8px] font-extrabold text-black uppercase bg-white px-2.5 py-1 rounded-md tracking-wider">PLAY</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 mt-16 text-center relative z-10">
        <div className="border border-black/10 p-8 sm:p-12 rounded-[32px] shadow-xl space-y-4 bg-white/60 backdrop-blur-2xl">
          <span className="text-xs font-black uppercase tracking-widest text-black/60">LOKAYANTRA ARCADE STATION</span>
          <h2 className="text-3xl sm:text-4xl font-black text-black tracking-tight">No Downloads. No Clutter. Just Magic.</h2>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm text-black/70 font-semibold leading-relaxed">Welcome to LokaYantra. We smashed the boring web grids to build a living, breathing playground of free HTML5 games. Click a fluid shape, dive into instant gameplay, and experience the internet&apos;s most beautiful game station.</p>
        </div>
      </div>

      <footer className="w-full max-w-[1400px] mx-auto px-4 mt-6 relative z-10">
        <div className="border border-black/10 p-8 sm:p-12 rounded-[32px] shadow-2xl bg-white/65 backdrop-blur-2xl grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          <div className="md:col-span-5 flex flex-col justify-between space-y-6 md:space-y-0">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-full relative flex items-center justify-center border border-white/20 shadow-md">
                    <div className="absolute top-0 left-[-2px] w-3.5 h-3.5 bg-black rounded-full" />
                    <div className="absolute top-0 right-[-2px] w-3.5 h-3.5 bg-black rounded-full" />
                    <div className="w-7 h-6 bg-white rounded-full flex items-center justify-between px-1.5 pt-0.5"><div className="w-1.5 h-1.5 bg-black rounded-full" /><div className="w-1.5 h-1.5 bg-black rounded-full" /></div>
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter text-[#161920]">LokaYantra</span>
              </div>
              <p className="text-xs font-bold uppercase tracking-wide text-black/60 max-w-sm leading-relaxed italic">&ldquo;Boring grids are dead. Welcome to the infinite monochrome playground.&rdquo;</p>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-black/50 pt-4">© 2026 LOKAYANTRA. ARCADE STATION.</div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-4 pt-4 md:pt-0">
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-black/90 border-b border-black/10 pb-1">Explore</h3>
              <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider text-black/60">
                <li><Link href="/" className="hover:text-black transition-colors">All Games</Link></li>
                <li><Link href="/trending" className="hover:text-black transition-colors">Trending Games</Link></li>
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
        </div>
      </footer>
    </main>
  );
}