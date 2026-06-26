import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Oka ghanta ki okasari sitemap auto-refresh avutundi — redeploy avasaram ledu.
// Kotta game add chesina, next hour lo sitemap lo automatic ga kanipistundi.
export const revalidate = 3600;

const SITE_URL = "https://lokayantra.vercel.app";

// [...slug]/page.tsx lo unna category routes — ivi kuda sitemap lo undali,
// search engines ki category pages discover avvataniki
const CATEGORY_SLUGS = [
  "action",
  "racing",
  "puzzle",
  "brain",
  "2-player",
  "shooting",
  "sports",
  "girls",
  "trending",
  "new-releases",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. మెయిన్ రూట్స్ మరియు యాడ్‌సెన్స్ కి కావలసిన అన్ని లీగల్ పేజీల లిస్ట్
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // 2. Category pages (/action, /racing, etc.) — search engines ki ee
  // pages kuda discover avvataniki important
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
  url: `${SITE_URL}/${slug}`,
  lastModified: new Date(),
  changeFrequency: 'daily' as const, // ఇక్కడ 'as const' యాడ్ చెయ్
  priority: 0.7,
}));

  // 3. Firebase nundi games fetch — ee step fail ayina mottam sitemap
  // build fail avvakunda try/catch tho protect chestam (Vercel build break avvakunda)
  let gameUrls: MetadataRoute.Sitemap = [];
  try {
    const snap = await getDocs(collection(db, "games"));
    gameUrls = snap.docs.map((doc) => {
      const data = doc.data();
      const gameIdentifier = data.slug || doc.id;

      // Game ki actual updatedAt/createdAt field unte adi vadali, lekapothe build time
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
        priority: 0.8,
      };
    });
  } catch (err) {
    console.error("Sitemap: failed to fetch games from Firestore:", err);
    // gameUrls empty ga vadileyyam — kani static + category routes ayina
    // sariga publish avtayi, mottam sitemap break avvadu
  }

  return [...staticRoutes, ...categoryRoutes, ...gameUrls];
}