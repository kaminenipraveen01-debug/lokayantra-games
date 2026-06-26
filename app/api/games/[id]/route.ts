import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import { revalidatePath } from "next/cache";
import { adminAuth } from "@/lib/firebase-admin";
import { deleteGameFolder } from "@/lib/github";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Missing or invalid Authorization header" }, { status: 401 });
  }

  const idToken = authHeader.slice("Bearer ".length);

  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(idToken);
  } catch {
    return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
  }

  if (decodedToken.email !== ADMIN_EMAIL) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: "Game id is required" }, { status: 400 });
  }

  try {
    const db = getFirestore();
    await db.collection("games").doc(id).delete();

    // Best-effort: remove the game's folder from the lokayantra-games repo.
    try {
      await deleteGameFolder(id);
    } catch (ghErr) {
      console.error(`GitHub cleanup failed for games/${id}:`, ghErr);
      // Non-fatal — Firestore doc is already gone, page will 404 even
      // if stale files remain in the games repo.
    }

    revalidatePath(`/games/${id}`);
    revalidatePath("/");

    return NextResponse.json({ deleted: true, id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete game.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

