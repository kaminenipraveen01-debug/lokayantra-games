import { getHomepageGames, GameSummary } from "@/lib/games-admin";
import HomepageClient from "@/components/HomepageClient";

export const revalidate = 3600;

export default async function HomePage() {
  let games: GameSummary[] = [];
  
  try {
    games = await getHomepageGames();
  } catch (err) {
    console.error("Failed to fetch games:", err);
    // Quota exceeded అయినా page build అవుతుంది
    // Empty array తో render అవుతుంది
  }
  
  return <HomepageClient initialGames={games} />;
}