// lib/recentlyPlayed.ts
// Continue Playing feature kosam localStorage lo recent games track chestam.
// Login avasaram ledu, every browser lo independent ga work avtundi.

const STORAGE_KEY = "lokayantra_recent_games";
const MAX_ITEMS = 12;

export interface RecentGame {
  id: string;
  title: string;
  thumbnail?: string;
  category?: string;
  slug?: string;
  playedAt: number; // timestamp
}

export function getRecentlyPlayed(): RecentGame[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as RecentGame[];
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function addRecentlyPlayed(game: Omit<RecentGame, "playedAt">) {
  if (typeof window === "undefined") return;
  try {
    const existing = getRecentlyPlayed();
    // Already unna game ni remove chesi top ki teskuravali (duplicate avvakunda)
    const filtered = existing.filter((g) => g.id !== game.id);
    const updated: RecentGame[] = [
      { ...game, playedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error("Failed to save recently played:", err);
  }
}

export function clearRecentlyPlayed() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}