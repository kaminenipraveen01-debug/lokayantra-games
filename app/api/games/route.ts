import { NextRequest, NextResponse } from "next/server";
import { fetchGamePixPage } from "@/lib/gamepix";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const category = searchParams.get("category") ?? "all";

  try {
    const games = await fetchGamePixPage(
      page,
      category === "all" ? undefined : category
    );
    return NextResponse.json({ games });
  } catch {
    return NextResponse.json({ games: [] });
  }
}