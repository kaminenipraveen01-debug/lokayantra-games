import { MetadataRoute } from 'next';
import { fetchAllGamePixGames, fetchAllCategories } from '@/lib/gamepix';
import { getFirestore } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';

export const revalidate = 3600;

const SITE_URL = "https://lokayantra.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

  // 1. Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/trending`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/new-releases`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  // 2. Category pages — /category/action format
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const categories = await fetchAllCategories();
    categoryRoutes = categories.map((catId) => ({
      url: `${SITE_URL}/category/${catId}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Sitemap: failed to fetch categories:", err);
  }

  // 3. GamePix game pages
  let gamepixRoutes: MetadataRoute.Sitemap = [];
  try {
    const games = await fetchAllGamePixGames();
    gamepixRoutes = games.map((game) => ({
      url: `${SITE_URL}/games/${game.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Sitemap: failed to fetch GamePix games:", err);
  }

  // 4. Firebase admin uploaded games మాత్రమే (GamePix import కాదు)
  let adminGameRoutes: MetadataRoute.Sitemap = [];
  try {
    const db = getFirestore(adminApp);
    const snap = await db.collection("games")
      .where("developer", "!=", "GamePix") // GamePix imported games తీసేయి
      .get();
    adminGameRoutes = snap.docs.map((doc) => {
      const data = doc.data();
      const gameIdentifier = data.slug || doc.id;
      const rawDate = data.updatedAt || data.createdAt;
      const lastModified =
        rawDate?.toDate?.() instanceof Date
          ? rawDate.toDate()
          : typeof rawDate === "string"
          ? new Date(rawDate)
          : new Date();

      return {
        url: `${SITE_URL}/games/${gameIdentifier}`,
        lastModified,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
      };
    });
  } catch (err) {
    console.error("Sitemap: failed to fetch admin games:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...gamepixRoutes, ...adminGameRoutes];
}