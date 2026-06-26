import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { pushFileToGithub, getPagesUrl } from "@/lib/github";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export const runtime = "nodejs";
export const maxDuration = 60;

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

  let body: { slug?: string; htmlBase64?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const { slug, htmlBase64 } = body;

  if (!slug || typeof slug !== "string" || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { message: "slug (lowercase letters, numbers, hyphens only) is required" },
      { status: 400 }
    );
  }

  if (!htmlBase64 || typeof htmlBase64 !== "string") {
    return NextResponse.json({ message: "htmlBase64 is required" }, { status: 400 });
  }

  try {
    // Push directly into games/{slug}/index.html. The deploy-games
    // workflow also triggers on changes under games/**, so this
    // alone is enough to trigger a Pages redeploy — no zip/extract
    // step needed for a single-file game.
    await pushFileToGithub(
      `games/${slug}/index.html`,
      htmlBase64,
      `Add/update single-file game: ${slug}`
    );

    const pagesUrl = getPagesUrl(slug);

    return NextResponse.json({ ok: true, gameUrl: pagesUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to push HTML file to GitHub.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
