import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { Game } from "@/types/game";

/**
 * Trending score: weighted combination of plays and likes.
 * playCount × 2 + likes × 3 — likes carry more signal than passive plays.
 */
export function getTrendingScore(game: Game): number {
  const plays = game.playCount ?? 0;
  const likes = game.likes ?? 0;
  return plays * 2 + likes * 3;
}

export async function getAllGames(): Promise<Game[]> {
  const snap = await getDocs(collection(db, "games"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Game));
}

export async function getTrendingGames(max = 12): Promise<Game[]> {
  const games = await getAllGames();
  return games
    .sort((a, b) => getTrendingScore(b) - getTrendingScore(a))
    .slice(0, max);
}

export const getGame = cache(async (id: string): Promise<Game | null> => {
  // 1. సేఫ్టీ గార్డ్: ఒకవేళ id రాకపోతే ఇక్కడే ఆపేయ్
  if (!id || typeof id !== 'string') {
    console.error("❌ ERROR: getGame function received an undefined or invalid ID!");
    return null;
  }

  // 2. ఒకవేళ db కరెక్ట్ గా లేకపోతే దాన్ని కూడా చెక్ చేద్దాం
  if (!db) {
    console.error("❌ ERROR: Firestore 'db' instance is undefined!");
    return null;
  }

  const snap = await getDoc(doc(db, "games", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Game;
});