// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api/',      // Internal API routes — index avvadam wasteful
          '/*?*',       // Query param URLs — ?category=X duplicate content avoid
        ],
      },
      {
        // AdsBot ki sitemap info provide cheyyadam — AdSense approval ki helps
        userAgent: 'AdsBot-Google',
        allow: '/',
      },
    ],
    sitemap: 'https://lokayantra.vercel.app/sitemap.xml',
  };
}