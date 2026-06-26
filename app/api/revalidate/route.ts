import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(req: NextRequest) {
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

  let body: { gameId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { gameId } = body;

  if (!gameId || typeof gameId !== "string") {
    return NextResponse.json({ message: "gameId (string) is required" }, { status: 400 });
  }

  revalidatePath(`/games/${gameId}`);
  revalidatePath("/");

  return NextResponse.json({ revalidated: true, gameId, now: Date.now() });
}
