import { fetchAllGamePixGames, fetchAllCategories, GamePixGame } from "@/lib/gamepix";
import HomepageClient from "@/components/HomepageClient";

export const revalidate = 3600;

export default async function HomePage() {
  let games: GamePixGame[] = [];
  let categories: string[] = [];

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

  return <HomepageClient initialGames={games} categories={categories} />;
}