import { MetadataRoute } from 'next';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';

export const revalidate = 86400; // రోజుకొకసారి మాత్రమే

const SITE_URL = "https://lokayantra.vercel.app";

// GamePix categories — hardcoded గా పెట్టాం, fetch అవసరం లేదు
const GAMEPIX_CATEGORIES = [
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

  // 1. Static routes
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

  // 2. Category pages
  const categoryRoutes: MetadataRoute.Sitemap = GAMEPIX_CATEGORIES.map((catId) => ({
    url: `${SITE_URL}/category/${catId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // 3. Admin uploaded games మాత్రమే Firebase నుండి
  let adminGameRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = getFirestore(adminApp);
    const snap = await db.collection("games")
      .where("developer", "!=", "GamePix")
      .limit(500)
      .get();

    adminGameRoutes = snap.docs.map((doc) => {
      const data = doc.data();
      const gameIdentifier = data.slug || doc.id;
      const rawDate = data.updatedAt || data.createdAt;
      const lastModified =
        rawDate?.toDate?.() instanceof Date
          ? rawDate.toDate()
          : typeof rawDate === "string"
          ? new Date(rawDate)
          : new Date();

      return {
        url: `${SITE_URL}/games/${gameIdentifier}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    });
  } catch (err) {
    console.error("Sitemap: failed to fetch admin games:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...adminGameRoutes];
}