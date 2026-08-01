import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import "@/lib/firebase-admin";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Game id is required" }, { status: 400 });
  }

  try {
    const db = getFirestore();
    // .update() badulu .set(..., {merge:true}) — idi document ఇంతకుముందు
    // exist ayina, avvakapoyina, రెండు scenarios lo pani chestundi.
    // GamePix games ki Firestore doc undakapovachu (manam intentional
    // గా delete chesamu), so ee playCount POST vaste, idi ఇప్పుడు oka
    // chinna doc (playCount field matrame) create chేస్తుంది — full game
    // metadata (title/thumbnail/etc) ekkadaa create avvadu, kevalam ee
    // ఒక్క counter field.
    await db.collection("games").doc(id).set(
      { playCount: FieldValue.increment(1) },
      { merge: true }
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to increment play count.";
    return NextResponse.json({ message }, { status: 500 });
  }
}