export interface GamePixGame {
  id: string;
  title: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  embedUrl?: string;
  namespace?: string;
  slug?: string; // ✅ Added
  width?: number;
  height?: number;
}

const SID = "A3ALT";
const BASE_URL = `https://feeds.gamepix.com/v2/json/?order=quality&pagination=12&sid=${SID}`;
const MAX_PAGES = 42; // 42 × 12 = 504 games

// Build time లో అన్ని games fetch చేయి
export async function fetchAllGamePixGames(): Promise<GamePixGame[]> {
  const allGames: GamePixGame[] = [];

  for (let page = 1; page <= MAX_PAGES; page++) {
    try {
      const res = await fetch(`${BASE_URL}&page=${page}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      const data = await res.json();
      const items = data.items ?? [];
      if (items.length === 0) break;

      for (const item of items) {
        allGames.push({
          id: item.namespace ?? String(item.id),
          title: item.title ?? "",
          description: item.description ?? "",
          category: item.category ?? "",
          thumbnail: item.image
            ? item.image.replace("w=105", "w=512")
            : "",
          embedUrl: item.url ?? "",
          namespace: item.namespace ?? "",
          slug: item.namespace ?? String(item.id), // ✅ Added
          width: item.width ?? 800,
          height: item.height ?? 600,
        });
      }
    } catch {
      break;
    }
  }

  return allGames;
}

// Single game fetch
export async function fetchGamePixGame(id: string): Promise<GamePixGame | null> {
  // namespace తో direct URL construct చేయి
  try {
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json/?order=quality&pagination=100&sid=${SID}&page=1`,
      { next: { revalidate: 3600 } }
    );
    // id తో match చేయి — కానీ ఇది slow, cache వాడుతాం
    const data = await res.json();
    const item = (data.items ?? []).find(
      (i: any) => i.namespace === id || String(i.id) === id
    );
    if (!item) return null;
    return {
      id: item.namespace ?? String(item.id),
      title: item.title ?? "",
      description: item.description ?? "",
      category: item.category ?? "",
      thumbnail: item.image?.replace("w=105", "w=512") ?? "",
      embedUrl: item.url ?? "",
      namespace: item.namespace ?? "",
      slug: item.namespace ?? String(item.id), // ✅ Added
    };
  } catch {
    return null;
  }
}

// Category తో filter
export function filterByCategory(
  games: GamePixGame[],
  category: string
): GamePixGame[] {
  if (!category || category === "all") return games;
  return games.filter((g) => g.category === category);
}