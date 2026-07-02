import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase-admin";

const adminDb = getFirestore(adminApp);

export interface GameSummary {
  id: string;
  title: string;
  thumbnail?: string;
  category?: string;
  playCount?: number;
  likes?: number;
  slug?: string;
  embedUrl?: string;
  gameUrl?: string;
  description?: string;
}
export interface GameFull {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string;
  category?: string;
  playCount?: number;
  likes?: number;
  dislikes?: number;
  slug?: string;
  embedUrl?: string;
  gameUrl?: string;
  howToPlay?: string;
  tips?: string[];
  faqs?: { question: string; answer: string }[];
  platforms?: string[];
  controls?: string;
  developer?: string;
  releaseDate?: string;
  youtubeEmbedUrl?: string;
}

export async function getHomepageGames(limitCount = 48): Promise<GameSummary[]> {
  const snap = await adminDb
    .collection("games")
    .orderBy("playCount", "desc")
    .limit(limitCount)
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      thumbnail: data.thumbnail ?? "",
      category: data.category ?? "",
      playCount: data.playCount ?? 0,
      likes: data.likes ?? 0,
      slug: data.slug ?? "",
      embedUrl: data.embedUrl ?? "",
      gameUrl: data.gameUrl ?? "",
      description: data.description ?? "",
    };
  });
}

export async function getGamesByCategory(
  category: string,
  limitCount = 48
): Promise<GameSummary[]> {
  const snap = await adminDb
    .collection("games")
    .where("category", "==", category)
    .orderBy("playCount", "desc")
    .limit(limitCount)
    .get();

  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      title: data.title ?? "",
      thumbnail: data.thumbnail ?? "",
      category: data.category ?? "",
      playCount: data.playCount ?? 0,
      likes: data.likes ?? 0,
      slug: data.slug ?? "",
    };
  });
}

export async function getGameAdmin(id: string): Promise<GameFull | null> {
  const snap = await adminDb.collection("games").doc(id).get();
  if (!snap.exists) return null;
  const data = snap.data()!;
  return {
    id: snap.id,
    title: data.title ?? "",
    description: data.description ?? "",
    thumbnail: data.thumbnail ?? "",
    category: data.category ?? "",
    playCount: data.playCount ?? 0,
    likes: data.likes ?? 0,
    dislikes: data.dislikes ?? 0,
    slug: data.slug ?? "",
    embedUrl: data.embedUrl ?? "",
    gameUrl: data.gameUrl ?? "",
    howToPlay: data.howToPlay ?? "",
    tips: data.tips ?? [],
    faqs: data.faqs ?? [],
    platforms: data.platforms ?? [],
    controls: data.controls ?? "",
    developer: data.developer ?? "",
    releaseDate: data.releaseDate ?? "",
    youtubeEmbedUrl: data.youtubeEmbedUrl ?? "",
  };
}

export async function getRelatedGamesAdmin(
  category: string,
  excludeId: string,
  limitCount = 30
): Promise<GameSummary[]> {
  const snap = await adminDb
    .collection("games")
    .where("category", "==", category)
    .limit(limitCount + 1)
    .get();

  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title ?? "",
        thumbnail: data.thumbnail ?? "",
        category: data.category ?? "",
        playCount: data.playCount ?? 0,
        slug: data.slug ?? "",
      };
    })
    .filter((g) => g.id !== excludeId)
    .slice(0, limitCount);
}