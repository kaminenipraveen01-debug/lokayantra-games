import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { adminApp } from "@/lib/firebase-admin";

const db = getFirestore(adminApp);

interface GamePixItem {
  id: string;
  title: string;
  description?: string;
  category?: string;
  image?: string;
  banner_image?: string;
  url?: string;
  namespace?: string;
  width?: number;
  height?: number;
  quality_score?: number;
}

interface GamePixFeed {
  items: GamePixItem[];
  next_url?: string;
}

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

  let feedUrl: string;
  try {
    const body = await req.json();
    feedUrl = body.feedUrl;
    if (!feedUrl) throw new Error("feedUrl is required");
  } catch {
    return NextResponse.json({ message: "Invalid request body" }, { status: 400 });
  }

  // Feed URL ని correct format కి normalize చేయి
  // /json? → /json/? గా మార్చు
  feedUrl = feedUrl.replace(
    /feeds\.gamepix\.com\/v2\/json\?/,
    "feeds.gamepix.com/v2/json/?"
  );

  const allItems: GamePixItem[] = [];
  let currentUrl: string | undefined = feedUrl;
  let pageCount = 0;
  const MAX_PAGES = 200;

  try {
    while (currentUrl && pageCount < MAX_PAGES) {
      const res = await fetch(currentUrl, {
        headers: { "Accept": "application/json" },
      });
      if (!res.ok) {
        throw new Error(`Feed fetch failed at page ${pageCount + 1}: ${res.status}`);
      }
      const data: GamePixFeed = await res.json();
      allItems.push(...(data.items ?? []));
      // next_url same అయితే infinite loop అవుతుంది — break చేయి
      if (!data.next_url || data.next_url === currentUrl) break;
      currentUrl = data.next_url;
      pageCount++;
    }
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Feed fetch failed" },
      { status: 500 }
    );
  }

  if (allItems.length === 0) {
    return NextResponse.json({ message: "No games found in feed" }, { status: 400 });
  }

  let imported = 0;
  let skipped = 0;
  const errors: string[] = [];
  const BATCH_SIZE = 400;

  for (let i = 0; i < allItems.length; i += BATCH_SIZE) {
    const chunk = allItems.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    for (const item of chunk) {
      try {
        // namespace వాడి slug తయారు చేయి — అది already clean గా ఉంటుంది
        const slug = item.namespace
          ? item.namespace.toLowerCase().trim()
          : String(item.id).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

        if (!slug || !item.title) {
          skipped++;
          continue;
        }

        const ref = db.collection("games").doc(slug);
        const existing = await ref.get();
        if (existing.exists) {
          skipped++;
          continue;
        }

        const width = item.width ?? 800;
        const height = item.height ?? 600;
        const isPortrait = height > width;
        const platforms = isPortrait
          ? ["Mobile", "Tablet"]
          : ["Desktop", "Mobile", "Tablet"];

        // image URL లో w=105 ని w=512 కి upgrade చేయి — better quality
        const thumbnail = item.image
          ? item.image.replace("w=105", "w=512")
          : "";

        batch.set(ref, {
          id: slug,
          title: item.title,
          description: item.description ?? "",
          thumbnail,
          category: item.category ?? "Uncategorized",
          embedUrl: item.url ?? "",
          gameUrl: "",
          howToPlay: "",
          tips: [],
          faqs: [],
          platforms,
          controls: "",
          developer: "GamePix",
          releaseDate: "",
          youtubeEmbedUrl: "",
          playCount: 0,
          likes: 0,
          dislikes: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        imported++;
      } catch (err) {
        errors.push(
          `${item.title}: ${err instanceof Error ? err.message : "unknown error"}`
        );
      }
    }

    await batch.commit();
  }

  return NextResponse.json({
    ok: true,
    imported,
    skipped,
    total: allItems.length,
    errors: errors.slice(0, 10),
  });
}