import { NextRequest, NextResponse } from "next/server";

const SID = "A3ALT";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const category = searchParams.get("category") ?? "";

  try {
    const categoryParam = category && category !== "all" ? `&category=${category}` : "";
    const res = await fetch(
      `https://feeds.gamepix.com/v2/json/?order=quality&pagination=12&sid=${SID}&page=${page}${categoryParam}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return NextResponse.json({ games: [], totalPages: 1 });
    const data = await res.json();

    const games = (data.items ?? []).map((item: any) => ({
      id: item.namespace ?? String(item.id),
      title: item.title ?? "",
      thumbnail: item.image?.replace("w=105", "w=512") ?? "",
      category: item.category ?? "",
      slug: item.namespace ?? String(item.id),
    }));

    // last_page_url నుండి total pages తీసుకో
    const lastPageUrl = data.last_page_url ?? "";
    const totalPagesMatch = lastPageUrl.match(/page=(\d+)/);
    const totalPages = totalPagesMatch ? parseInt(totalPagesMatch[1]) : 1;

    return NextResponse.json({ games, totalPages });
  } catch {
    return NextResponse.json({ games: [], totalPages: 1 });
  }
}