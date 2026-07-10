import { MetadataRoute } from 'next';
import { fetchAllGamePixGames, fetchAllCategories } from '@/lib/gamepix';

const SITE_URL = "https://lokayantra.vercel.app";

// fetchAllCategories() fail ayithe (build time lo GamePix feed down unte)
// fallback ga ee hardcoded list vaadutundi — sitemap ontiga ఖాళీగా
// pోకుండా.
const FALLBACK_CATEGORIES = [
  "2048", "action", "addictive", "adventure", "airplane", "animal",
  "arcade", "archery", "ball", "basketball", "battle", "battle-royale",
  "bike", "block", "board", "brain", "building", "car", "card", "casual",
  "cats", "chess", "christmas", "clicker", "cooking", "dirt-bike",
  "dinosaur", "drawing", "dress-up", "drifting", "driving", "educational",
  "escape", "family", "farming", "fashion", "fighting", "fishing", "flash",
  "flight", "fun", "golf", "granny", "gun", "halloween", "hockey",
  "horror", "horse", "hunting", "hyper-casual", "idle", "io",
  "jigsaw-puzzles", "jumping", "kids", "knight", "mahjong", "makeup",
  "management", "match-3", "math", "memory", "minecraft", "mining",
  "mobile", "money", "monster", "multiplayer", "music", "naval", "ninja",
  "offroad", "parking", "parkour", "piano", "pirates", "pixel",
  "platformer", "police", "pool", "princess", "puzzle", "racing",
  "restaurant", "retro", "robots", "rpg", "runner", "scary", "shooter",
  "simulation", "skateboard", "skill", "snake", "sniper", "soccer",
  "solitaire", "sports", "stickman", "strategy", "survival", "sword",
  "tanks", "tetris", "trivia", "truck", "two-player", "tycoon", "war",
  "word", "world-cup", "worm", "wrestling", "zombie",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/new-releases`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Categories — dynamic ga GamePix nunchi try chestunnam, fail aithe
  // fallback hardcoded list vaadutundi.
  let categoryIds: string[] = FALLBACK_CATEGORIES;
  try {
    const dynamicCategories = await fetchAllCategories();
    if (dynamicCategories.length > 0) categoryIds = dynamicCategories;
  } catch (err) {
    console.error("sitemap: fetchAllCategories failed, using fallback:", err);
  }

  const categoryRoutes: MetadataRoute.Sitemap = categoryIds.map((catId) => ({
    url: `${SITE_URL}/category/${catId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Game pages — ivi actual "money pages", organic traffic ekkuva ikkade
  // vastundi. Infinite-scroll grid valla bots ki discover cheyadam kashtam
  // kaabatti, direct ga sitemap lo pettadam ముఖ్యం.
  let gameRoutes: MetadataRoute.Sitemap = [];
  try {
    const games = await fetchAllGamePixGames();
    gameRoutes = games
      .filter((g) => g.id)
      .map((g) => ({
        url: `${SITE_URL}/games/${g.slug || g.id}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }));
  } catch (err) {
    console.error("sitemap: fetchAllGamePixGames failed:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...gameRoutes];
}