import { NextRequest, NextResponse } from "next/server";
import { fetchGamePixPage } from "@/lib/gamepix";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const category = searchParams.get("category") ?? "all";
  const limit = parseInt(searchParams.get("limit") ?? "48");

  try {
    // 48 games కి 4 pages కావాలి (12 × 4 = 48)
    const pagesNeeded = Math.ceil(limit / 12);
    const startPage = (page - 1) * pagesNeeded + 1;
    
    const allGames = [];
    for (let p = startPage; p < startPage + pagesNeeded; p++) {
      const games = await fetchGamePixPage(
        p,
        category === "all" ? undefined : category
      );
      allGames.push(...games);
      if (games.length < 12) break;
    }

    return NextResponse.json({ games: allGames });
  } catch {
    return NextResponse.json({ games: [] });
  }
}