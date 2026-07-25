import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth-context";
import { SearchProvider } from "@/lib/search-context";
import { SecretCodesProvider } from "@/lib/secret-codes-context";
import Header from "@/components/Header";
import SecretEffectsOverlay from "@/components/SecretEffectsOverlay";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const SITE_URL = "https://lokayantra.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LokaYantra — Free Online Games, No Downloads",
    template: "%s | LokaYantra",
  },
  description:
    "Play 500+ free HTML5 browser games instantly on LokaYantra. Action, Racing, Puzzle, Adventure and more — no downloads, no installs, just click and play.",
  keywords: [
    "free online games",
    "browser games",
    "html5 games",
    "play games online",
    "free games no download",
    "action games",
    "puzzle games",
    "racing games",
  ],
  authors: [{ name: "LokaYantra", url: SITE_URL }],
  creator: "LokaYantra",
  publisher: "LokaYantra",
  verification: {
    google: "Ky6z3tsotqyy6e_A997Q6XHDCOF6TEMSLz1XwtTD2JA",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "LokaYantra",
    title: "LokaYantra — Free Online Games, No Downloads",
    description:
      "Play 500+ free HTML5 browser games instantly. Action, Racing, Puzzle, Adventure and more — no downloads needed.",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "LokaYantra — Free Online Games",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LokaYantra — Free Online Games, No Downloads",
    description:
      "Play 500+ free HTML5 browser games instantly. No downloads needed.",
    images: [`${SITE_URL}/og-image.png`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://pl30274834.effectivecpmnetwork.com" />
      </head>
      <body
        className={`${inter.className} bg-[#0a0a0d] text-white antialiased selection:bg-black selection:text-white overflow-x-hidden`}
      >
        <AuthProvider>
          <SearchProvider>
            <SecretCodesProvider>
              <div className="min-h-screen flex flex-col relative">
                <Header />
                <main className="flex-1 w-full">
                  {children}
                </main>
              </div>

              {/* Renders all 50 secret code effects, toasts, achievement
                  banners and the mini-game modal. Mounted once here so it
                  works from any page (Header search + /search page both
                  call triggerCode()). */}
              <SecretEffectsOverlay />
            </SecretCodesProvider>
          </SearchProvider>
        </AuthProvider>

        {/* AdSense script — page fully interactive అయ్యాక, idle time లో
            load అవుతుంది (lazyOnload). Ide 152KB unused JS ni LCP/render
            path nunchi తీసేస్తుంది — <head> లో raw <script async> unte
            adi immediate ga network fetch start chestundi, ఇది కాదు. */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        {/* Google Analytics (GA4) — page fully interactive అయ్యాక load అవుతుంది,
    AdSense script లానే, LCP/performance ki నష్టం లేకుండా */}
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-WE5ZJDP37W"
  strategy="lazyOnload"
/>
<Script id="ga4-init" strategy="lazyOnload">
  {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-WE5ZJDP37W');
  `}
</Script>
      </body>
    </html>
  );
}