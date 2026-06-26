import { NextRequest, NextResponse } from "next/server";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import "@/lib/firebase-admin"; // ensure admin app is initialized

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
    await db.collection("games").doc(id).update({
      playCount: FieldValue.increment(1),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to increment play count.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
