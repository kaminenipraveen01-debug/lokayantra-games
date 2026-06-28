import { getHomepageGames } from "@/lib/games-admin";
import HomepageClient from "@/components/HomepageClient";

export const revalidate = 3600;

export default async function HomePage() {
  const games = await getHomepageGames();
  return <HomepageClient initialGames={games} />;
}