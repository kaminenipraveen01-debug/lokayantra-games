import type { Metadata } from "next";
import Link from "next/link";
import {
  Grid3x3, Zap, Flame, Compass, Plane, PawPrint, Gamepad2, Target, CircleDot,
  Swords, Bike, Blocks, Brain, Building2, Car, Layers, Smile, Cat, Crown,
  Gift, MousePointer, ChefHat, Palette, Shirt, GraduationCap, Key, Users,
  Sprout, Crosshair, Fish, Sparkles, Skull, Terminal, Flag, Scissors, Ghost,
  Eye, Clock, Network, Puzzle, Footprints, Baby, Calculator, Waves,
  Pickaxe, Smartphone, Coins, Ship, Turtle, Globe, Music2, Anchor, Tv, Bot,
  Utensils, HelpCircle, Truck, RotateCw, Trophy, User, Stethoscope, Tent,
  Sword, Shield, Book, CarFront, type LucideIcon,
} from "lucide-react";
import { fetchAllCategories } from "@/lib/gamepix";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "All Game Categories | LokaYantra",
  description: "Browse all game categories on LokaYantra — Action, Racing, Puzzle, Adventure, Sports, and more. Find your favorite type of free online HTML5 games.",
};

// prathi category id ki oka clean, consistent lucide icon — motham okate
// stroke style tho untundi kabatti icons anni ekkuva "suite" avutayi.
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "2048": Grid3x3,
  action: Zap,
  addictive: Flame,
  adventure: Compass,
  airplane: Plane,
  animal: PawPrint,
  arcade: Gamepad2,
  archery: Target,
  ball: CircleDot,
  basketball: CircleDot,
  baseball: CircleDot,
  battle: Swords,
  "battle-royale": Swords,
  bike: Bike,
  block: Blocks,
  board: Grid3x3,
  brain: Brain,
  building: Building2,
  car: Car,
  card: Layers,
  casual: Smile,
  cats: Cat,
  chess: Crown,
  christmas: Gift,
  clicker: MousePointer,
  cooking: ChefHat,
  "dirt-bike": Bike,
  dinosaur: Footprints,
  drawing: Palette,
  "dress-up": Shirt,
  drifting: Car,
  driving: CarFront,
  educational: GraduationCap,
  escape: Key,
  family: Users,
  farming: Sprout,
  fashion: Shirt,
  fighting: Swords,
  "fire-and-water": Flame,
  "first-person-shooter": Crosshair,
  fishing: Fish,
  flash: Zap,
  flight: Plane,
  fun: Sparkles,
  "games-for-girls": Sparkles,
  gangster: Skull,
  gdevelop: Terminal,
  golf: Flag,
  granny: Users,
  gun: Crosshair,
  "hair-salon": Scissors,
  halloween: Ghost,
  helicopter: Plane,
  "hidden-object": Eye,
  hockey: CircleDot,
  horror: Ghost,
  horse: PawPrint,
  hunting: Crosshair,
  "hyper-casual": Zap,
  idle: Clock,
  io: Network,
  "jigsaw-puzzles": Puzzle,
  jumping: Footprints,
  junior: Baby,
  kids: Baby,
  knight: Shield,
  mahjong: Layers,
  makeup: Sparkles,
  management: Building2,
  mario: Gamepad2,
  "match-3": Grid3x3,
  math: Calculator,
  memory: Brain,
  mermaid: Waves,
  minecraft: Blocks,
  mining: Pickaxe,
  mmorpg: Swords,
  mobile: Smartphone,
  money: Coins,
  monster: Ghost,
  multiplayer: Users,
  music: Music2,
  naval: Ship,
  ninja: Swords,
  "ninja-turtle": Turtle,
  offroad: Car,
  "open-world": Globe,
  parking: CarFront,
  parkour: Footprints,
  piano: Music2,
  pirates: Anchor,
  pixel: Grid3x3,
  platformer: Layers,
  police: Shield,
  pool: CircleDot,
  princess: Crown,
  puzzle: Puzzle,
  racing: Car,
  restaurant: Utensils,
  retro: Tv,
  robots: Bot,
  rpg: Swords,
  runner: Footprints,
  scary: Ghost,
  scrabble: Grid3x3,
  sharks: Fish,
  shooter: Crosshair,
  simulation: Building2,
  skateboard: Footprints,
  "skibidi-toilet": Sparkles,
  skill: Target,
  snake: Waves,
  sniper: Crosshair,
  soccer: CircleDot,
  solitaire: Layers,
  spinner: RotateCw,
  sports: Trophy,
  stickman: User,
  strategy: Layers,
  surgery: Stethoscope,
  survival: Tent,
  sword: Sword,
  tanks: Shield,
  tap: MousePointer,
  tetris: Blocks,
  trivia: HelpCircle,
  truck: Truck,
  "two-player": Users,
  tycoon: Building2,
  war: Swords,
  word: Book,
  "world-cup": Trophy,
  worm: Waves,
  wrestling: Swords,
  zombie: Ghost,
};

function CategoryIcon({ id }: { id: string }) {
  const Icon = CATEGORY_ICONS[id] ?? Gamepad2;
  return <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.75} />;
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
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3">
            {categories.map((catId) => (
              <Link
                key={catId}
                href={`/category/${catId}`}
                className="group relative flex flex-col items-center justify-center gap-2 p-3 sm:p-4 aspect-square rounded-[20px] sm:rounded-[24px] border border-black/10 bg-white/50 hover:bg-white/80 hover:border-black/20 hover:-translate-y-1 shadow-[0_4px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.14)] transition-all duration-200"
              >
                <div className="shrink-0 w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-black/5 group-hover:bg-black group-hover:text-white text-black/70 flex items-center justify-center transition-colors duration-200">
                  <CategoryIcon id={catId} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wide text-black/80 group-hover:text-black text-center leading-tight line-clamp-2">
                  {formatCategoryName(catId)}
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