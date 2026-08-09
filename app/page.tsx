import { fetchAllGamePixGames, fetchAllCategories, fetchTrendingGames, fetchNewReleases, fetchRecommendedGames, fetchMostPlayedGames, GamePixGame } from "@/lib/gamepix";
import { getHomepageGames } from "@/lib/games-admin";
import HomepageClient from "@/components/HomepageClient";

export const revalidate = 3600;

// Admin games ni GamePix games list లోకి randomly-kani-evenly mix చేయడానికి —
// prathi Nth position లో ఒక్క admin game insert చేస్తాం, so avi grid antaa
// spread అయ్యి కనిపిస్తాయి, top లో gుమిగూడకుండా, kani special treatment
// కూడా లేకుండా (fair, natural feel).
function fairMix<T extends { id: string }>(base: T[], inserts: T[]): T[] {
  if (inserts.length === 0) return base;
  const seen = new Set(base.map((g) => g.id));
  const uniqueInserts = inserts.filter((g) => !seen.has(g.id));
  if (uniqueInserts.length === 0) return base;

  const result = [...base];
  const spacing = Math.max(6, Math.floor(result.length / uniqueInserts.length));
  uniqueInserts.forEach((game, i) => {
    const pos = Math.min(result.length, (i + 1) * spacing + i);
    result.splice(pos, 0, game);
  });
  return result;
}

export default async function HomePage() {
  let games: GamePixGame[] = [];
  let categories: string[] = [];
  let featuredGames: GamePixGame[] = [];
  let trendingGames: GamePixGame[] = [];
  let newReleases: GamePixGame[] = [];
  let recommendedGames: GamePixGame[] = [];
  let mostPlayedGames: GamePixGame[] = [];

  try {
    games = await fetchAllGamePixGames();
  } catch (err) {
    console.error("Failed to fetch GamePix games:", err);
  }

  try {
    categories = await fetchAllCategories();
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  try {
    const fbGames = await getHomepageGames(100);
    featuredGames = fbGames.map((g) => ({
      id: g.id,
      title: g.title,
      thumbnail: g.thumbnail ?? "",
      category: g.category ?? "",
      embedUrl: g.embedUrl ?? g.gameUrl ?? "",
      slug: g.slug ?? g.id,
      description: g.description ?? "",
    }));
  } catch (err) {
    console.error("Failed to fetch admin games:", err);
  }

  // Admin games ni main grid లోకి కూడా fair గా mix చేద్దాం — Featured
  // strip లో matrame కాకుండా, developers తమ game ni "real" game లానే
  // చూడాలని కోరుకుంటున్నారు కాబట్టి.
  games = fairMix(games, featuredGames);

  try {
    trendingGames = await fetchTrendingGames();
  } catch (err) {
    console.error("Failed to fetch trending games:", err);
  }

  try {
    newReleases = await fetchNewReleases();
  } catch (err) {
    console.error("Failed to fetch new releases:", err);
  }

  // Admin games ni New Releases section లో కూడా చేర్చుదాం (కొత్తగా
  // upload chేసినవి, so "new" గా చూపించడం సహజమే)
  newReleases = fairMix(newReleases, featuredGames);

  try {
    recommendedGames = await fetchRecommendedGames();
  } catch (err) {
    console.error("Failed to fetch recommended games:", err);
  }

  try {
    mostPlayedGames = await fetchMostPlayedGames();
  } catch (err) {
    console.error("Failed to fetch most played games:", err);
  }

  return (
    <HomepageClient
      initialGames={games}
      categories={categories}
      featuredGames={featuredGames}
      trendingGames={trendingGames}
      newReleases={newReleases}
      recommendedGames={recommendedGames}
      mostPlayedGames={mostPlayedGames}
    />
  );
}