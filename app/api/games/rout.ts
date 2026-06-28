import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase-admin";

const adminDb = getFirestore(adminApp);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "48");
  const offset = (page - 1) * limit;

  try {
    const snap = await adminDb
      .collection("games")
      .orderBy("playCount", "desc")
      .offset(offset)
      .limit(limit)
      .get();

    const games = snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        title: data.title ?? "",
        thumbnail: data.thumbnail ?? "",
        category: data.category ?? "",
        playCount: data.playCount ?? 0,
        slug: data.slug ?? "",
      };
    });

    return NextResponse.json({ games });
  } catch (err) {
    return NextResponse.json({ games: [] }, { status: 500 });
  }
}