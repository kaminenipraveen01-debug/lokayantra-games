import { fetchAllGamePixGames, GamePixGame } from "@/lib/gamepix";
import HomepageClient from "@/components/HomepageClient";

export const revalidate = 3600;

export default async function HomePage() {
  let games: GamePixGame[] = [];

  try {
    games = await fetchAllGamePixGames();
  } catch (err) {
    console.error("Failed to fetch GamePix games:", err);
  }

  return <HomepageClient initialGames={games} />;
}