import { NextResponse } from "next/server";
import { fetchSearchIndex } from "@/lib/gamepix";

export const revalidate = 1800;

export async function GET() {
  try {
    const games = await fetchSearchIndex("q");
    return NextResponse.json(
      { games },
      { headers: { "Cache-Control": "public, max-age=0, s-maxage=1800, stale-while-revalidate=3600" } }
    );
  } catch (err) {
    console.error("/api/search-index error:", err);
    return NextResponse.json({ games: [] }, { status: 200 });
  }
}