import { MetadataRoute } from 'next';

const SITE_URL = "https://lokayantra.vercel.app";

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

export default function sitemap(): MetadataRoute.Sitemap {
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

  const categoryRoutes: MetadataRoute.Sitemap = GAMEPIX_CATEGORIES.map((catId) => ({
    url: `${SITE_URL}/category/${catId}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes];
}