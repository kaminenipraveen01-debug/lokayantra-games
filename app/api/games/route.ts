import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase-admin";

const adminDb = getFirestore(adminApp);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "48");
  const category = searchParams.get("category") ?? "";
  const offset = (page - 1) * limit;

  try {
    let snap;

    if (category && category !== "all") {
      // category filter — orderBy లేకుండా
      snap = await adminDb
        .collection("games")
        .where("category", "==", category)
        .offset(offset)
        .limit(limit)
        .get();
    } else {
      // all games — playCount order లో
      snap = await adminDb
        .collection("games")
        .orderBy("playCount", "desc")
        .offset(offset)
        .limit(limit)
        .get();
    }

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
    console.error("Games API error:", err);
    return NextResponse.json({ games: [] }, { status: 200 });
  }
}