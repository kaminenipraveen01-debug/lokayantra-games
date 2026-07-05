import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase-admin";

const adminDb = getFirestore(adminApp);

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  try {
    const auth = req.headers.get("Authorization") ?? "";
    const token = auth.replace("Bearer ", "").trim();
    if (!token) return false;
    await adminAuth.verifyIdToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const isAdmin = await verifyAdmin(req);
  if (!isAdmin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // ఒక్కసారి 400 మాత్రమే delete చేయి
    const snap = await adminDb
      .collection("games")
      .where("developer", "==", "GamePix")
      .limit(400)
      .get();

    if (snap.empty) {
      return NextResponse.json({ ok: true, deleted: 0, hasMore: false });
    }

    const batch = adminDb.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return NextResponse.json({
      ok: true,
      deleted: snap.docs.length,
      hasMore: snap.docs.length === 400,
    });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}