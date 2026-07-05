export interface GamePixGame {
  id: string;
  title: string;
  description?: string;
  category?: string;
  thumbnail?: string;
  embedUrl?: string;
  namespace?: string;
  slug?: string;
  width?: number;
  height?: number;
}

const SID = "A3ALT";

// Homepage కి initial 10 pages మాత్రమే — build fast అవుతుంది
export async function fetchAllGamePixGames(): Promise<GamePixGame[]> {
  const allGames: GamePixGame[] = [];

  for (let page = 1; page <= 10; page++) {
    try {
      const res = await fetch(
        `https://feeds.gamepix.com/v2/json/?order=quality&pagination=12&sid=${SID}&page=${page}`,
        { next: { revalidate: 3600 } }
      );
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
          thumbnail: item.image?.replace("w=105", "w=512") ?? "",
          embedUrl: item.url ?? "",
          namespace: item.namespace ?? "",
          slug: item.namespace ?? String(item.id),
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

// Single game fetch — namespace తో direct fetch
export async function fetchGamePixGame(id: string): Promise<GamePixGame | null> {
  try {
    for (let page = 1; page <= 5; page++) {
      const res = await fetch(
        `https://feeds.gamepix.com/v2/json/?order=quality&pagination=12&sid=${SID}&page=${page}`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) break;
      const data = await res.json();
      const items = data.items ?? [];
      if (items.length === 0) break;
      const item = items.find(
        (i: any) => i.namespace === id || String(i.id) === id
      );
      if (item) {
        return {
          id: item.namespace ?? String(item.id),
          title: item.title ?? "",
          description: item.description ?? "",
          category: item.category ?? "",
          thumbnail: item.image?.replace("w=105", "w=512") ?? "",
          embedUrl: item.url ?? "",
          namespace: item.namespace ?? "",
          slug: item.namespace ?? String(item.id),
          width: item.width ?? 800,
          height: item.height ?? 600,
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Page by page fetch — API route కి
export async function fetchGamePixPage(
  page: number,
  category?: string
): Promise<GamePixGame[]> {
  const categoryParam =
    category && category !== "all" ? `&category=${category}` : "";
  try {
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json/?order=quality&pagination=12&sid=${SID}&page=${page}${categoryParam}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      id: item.namespace ?? String(item.id),
      title: item.title ?? "",
      description: item.description ?? "",
      category: item.category ?? "",
      thumbnail: item.image?.replace("w=105", "w=512") ?? "",
      embedUrl: item.url ?? "",
      namespace: item.namespace ?? "",
      slug: item.namespace ?? String(item.id),
      width: item.width ?? 800,
      height: item.height ?? 600,
    }));
  } catch {
    return [];
  }
}

// Category filter
export function filterByCategory(
  games: GamePixGame[],
  category: string
): GamePixGame[] {
  if (!category || category === "all") return games;
  return games.filter((g) => g.category === category);
}

// అన్ని unique categories GamePix నుండి collect చేయి (multiple pages scan చేసి)
export async function fetchAllCategories(): Promise<string[]> {
  const categorySet = new Set<string>();
  
  for (let page = 1; page <= 30; page++) {
    try {
      const games = await fetchGamePixPage(page);
      if (games.length === 0) break;
      games.forEach((g) => {
        if (g.category) categorySet.add(g.category);
      });
    } catch {
      break;
    }
  }

  return Array.from(categorySet).sort();
}