import { fetchAllGamePixGames, fetchAllCategories, GamePixGame } from "@/lib/gamepix";
import { getHomepageGames } from "@/lib/games-admin";
import HomepageClient from "@/components/HomepageClient";

export const revalidate = 3600;

export default async function HomePage() {
  let gamepixGames: GamePixGame[] = [];
  let categories: string[] = [];
  let adminGames: GamePixGame[] = [];

  try {
    gamepixGames = await fetchAllGamePixGames();
  } catch (err) {
    console.error("Failed to fetch GamePix games:", err);
  }

  try {
    categories = await fetchAllCategories();
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  // Firebase లో upload చేసిన games తీసుకో
  try {
    const fbGames = await getHomepageGames(100);
    adminGames = fbGames.map((g) => ({
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

  // Admin games పైన, GamePix games కింద
  const allGames = [...adminGames, ...gamepixGames];

  return <HomepageClient initialGames={allGames} categories={categories} />;
}