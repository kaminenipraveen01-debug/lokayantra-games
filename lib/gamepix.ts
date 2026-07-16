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

// Search కోసం — v2/json feed నే వాడతాం (ఇది నిజంగా పనిచేస్తుందని site
// motham లో already confirm అయ్యింది), కానీ pages ni parallel batches లో
// fetch చేసి (sequential కంటే chాలా faster), ఎక్కువ coverage (~60 pages ×
// 12 = ~720 games per order) ఇస్తున్నాం.
export async function fetchSearchIndex(order: "q" | "d" = "q"): Promise<GamePixGame[]> {
  const legacyOrder = order === "d" ? "pubdate" : "quality";
  const allGames: GamePixGame[] = [];
  const seen = new Set<string>();
  const MAX_PAGES = 60;
  const BATCH_SIZE = 15;

  for (let batchStart = 1; batchStart <= MAX_PAGES; batchStart += BATCH_SIZE) {
    const pageNumbers = Array.from(
      { length: Math.min(BATCH_SIZE, MAX_PAGES - batchStart + 1) },
      (_, i) => batchStart + i
    );

    const batchResults = await Promise.all(
      pageNumbers.map(async (page) => {
        try {
          const res = await fetch(
            `https://feeds.gamepix.com/v2/json/?order=${legacyOrder}&pagination=12&sid=${SID}&page=${page}`,
            { next: { revalidate: 1800 } }
          );
          if (!res.ok) return [];
          const data = await res.json();
          return data.items ?? [];
        } catch {
          return [];
        }
      })
    );

    let gotAny = false;
    for (const items of batchResults) {
      if (items.length > 0) gotAny = true;
      for (const item of items) {
        const id = item.namespace ?? String(item.id);
        if (!id || seen.has(id)) continue;
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
    }

    // catalog అయిపోతే (ఏ page లోనూ items రాకపోతే) ఇక ఆగిపోదాం
    if (!gotAny) break;
  }

  return allGames;
}