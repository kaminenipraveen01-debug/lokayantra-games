import { NextRequest, NextResponse } from "next/server";
import { doc, runTransaction } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { type, previous } = await req.json();
    const gameRef = doc(db, "games", params.id);

    await runTransaction(db, async (transaction) => {
      const snap = await transaction.get(gameRef);
      if (!snap.exists()) throw new Error("Game not found");

      const data = snap.data();
      let likes: number = data.likes ?? 0;
      let dislikes: number = data.dislikes ?? 0;

      if (previous === "like") likes = Math.max(0, likes - 1);
      if (previous === "dislike") dislikes = Math.max(0, dislikes - 1);
      if (type === "like") likes = likes + 1;
      if (type === "dislike") dislikes = dislikes + 1;

      transaction.update(gameRef, { likes, dislikes });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reaction API error:", err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}