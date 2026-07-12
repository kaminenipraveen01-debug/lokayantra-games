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

// Grid tiles motham 216-242px range lo display avutunnayi kabatti w=512
// avasaram ledu — w=256 retina (2x) displays ki kuda crisp ga untundi,
// kani file size sagam ki taggutundi (PageSpeed "Improve image delivery"
// audit fix chesindi idi).
const THUMB_WIDTH = "w=256";

function resizeThumb(url: string): string {
  return url ? url.replace("w=105", THUMB_WIDTH) : "";
}

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
          thumbnail: resizeThumb(item.image ?? ""),
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
          // Game detail page లో పెద్ద hero thumbnail వాడొచ్చు కాబట్టి ఇక్కడ
          // మాత్రం అసలు size (512) అలాగే ఉంచుతున్నాం.
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
      thumbnail: resizeThumb(item.image ?? ""),
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
export async function fetchTrendingGames(): Promise<GamePixGame[]> {
  try {
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json/?order=quality&pagination=12&sid=${SID}&page=2`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      id: item.namespace ?? String(item.id),
      title: item.title ?? "",
      category: item.category ?? "",
      thumbnail: resizeThumb(item.image ?? ""),
      embedUrl: item.url ?? "",
      slug: item.namespace ?? String(item.id),
    }));
  } catch {
    return [];
  }
}

export async function fetchNewReleases(): Promise<GamePixGame[]> {
  try {
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json/?order=pubdate&pagination=12&sid=${SID}&page=1`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      id: item.namespace ?? String(item.id),
      title: item.title ?? "",
      category: item.category ?? "",
      thumbnail: resizeThumb(item.image ?? ""),
      embedUrl: item.url ?? "",
      slug: item.namespace ?? String(item.id),
    }));
  } catch {
    return [];
  }
}

export async function fetchRecommendedGames(): Promise<GamePixGame[]> {
  try {
    // వేరే page నుండి తీసుకో — variety కోసం
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json/?order=quality&pagination=12&sid=${SID}&page=5`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      id: item.namespace ?? String(item.id),
      title: item.title ?? "",
      category: item.category ?? "",
      thumbnail: resizeThumb(item.image ?? ""),
      embedUrl: item.url ?? "",
      slug: item.namespace ?? String(item.id),
    }));
  } catch {
    return [];
  }
}

export async function fetchMostPlayedGames(): Promise<GamePixGame[]> {
  try {
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json/?order=quality&pagination=12&sid=${SID}&page=3`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items ?? []).map((item: any) => ({
      id: item.namespace ?? String(item.id),
      title: item.title ?? "",
      category: item.category ?? "",
      thumbnail: resizeThumb(item.image ?? ""),
      embedUrl: item.url ?? "",
      slug: item.namespace ?? String(item.id),
    }));
  } catch {
    return [];
  }
}

// Search page కోసం — GamePix యొక్క limit-1000 endpoint వాడి, పెద్ద
// coverage తో (v2/json feed లో page-by-page fetch చేసేకంటే చాలా faster,
// ఎక్కువ games) index build చేస్తున్నాం. Rendu offset batches (0, 1000)
// fetch చేసి, up to ~2000 games వరకు cover చేస్తుంది.
export async function fetchSearchIndex(order: "q" | "d" = "q"): Promise<GamePixGame[]> {
  const allGames: GamePixGame[] = [];
  const seen = new Set<string>();
  const offsets = [0, 1000];

  for (const offset of offsets) {
    try {
      const res = await fetch(
        `https://games.gamepix.com/games?sid=${SID}&order=${order}&limit=1000&offset=${offset}`,
        { next: { revalidate: 1800 } }
      );
      if (!res.ok) break;
      const data = await res.json();
      const items = data.items ?? data.games ?? data ?? [];
      if (!Array.isArray(items) || items.length === 0) break;

      for (const item of items) {
        const id = item.namespace ?? String(item.id ?? "");
        if (!id || seen.has(id)) continue;
        seen.add(id);
        allGames.push({
          id,
          title: item.title ?? "",
          description: item.description ?? "",
          category: item.category ?? "",
          thumbnail: resizeThumb(item.image ?? item.banner?.landscape ?? ""),
          embedUrl: item.url ?? "",
          namespace: item.namespace ?? "",
          slug: id,
          width: item.width ?? 800,
          height: item.height ?? 600,
        });
      }

      if (items.length < 1000) break; // last page
    } catch (err) {
      console.error("fetchSearchIndex error:", err);
      break;
    }
  }

  // Fallback — పైన API ఏదైనా కారణంతో ఏమీ ఇవ్వకపోతే, పాత v2/json feed
  // (15 pages) ద్వారా కనీసం ~180 games అయినా చూపిద్దాం, పూర్తిగా ఖాళీగా
  // కాకుండా.
  if (allGames.length === 0) {
    const legacyOrder = order === "d" ? "pubdate" : "quality";
    for (let page = 1; page <= 15; page++) {
      try {
        const res = await fetch(
          `https://feeds.gamepix.com/v2/json/?order=${legacyOrder}&pagination=12&sid=${SID}&page=${page}`,
          { next: { revalidate: 1800 } }
        );
        if (!res.ok) break;
        const data = await res.json();
        const items = data.items ?? [];
        if (items.length === 0) break;
        for (const item of items) {
          const id = item.namespace ?? String(item.id);
          if (seen.has(id)) continue;
          seen.add(id);
          allGames.push({
            id,
            title: item.title ?? "",
            description: item.description ?? "",
            category: item.category ?? "",
            thumbnail: resizeThumb(item.image ?? ""),
            embedUrl: item.url ?? "",
            namespace: item.namespace ?? "",
            slug: id,
            width: item.width ?? 800,
            height: item.height ?? 600,
          });
        }
      } catch {
        break;
      }
    }
  }

  return allGames;
}