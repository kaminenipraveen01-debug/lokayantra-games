import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context";
import { SearchProvider } from "@/lib/search-context";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lokayantra | Free Browser Games",
  description: "Play free, instant-play HTML5 browser games on Lokayantra.",
  // ── Metadata లో మీ పాండా SVG లోగోను లింక్ చేసాను ──
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* ── బ్రౌజర్ టాబ్ కోసం డైరెక్ట్ SVG ఐకాన్ లింక్ ── */}
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="shortcut icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" type="image/svg+xml" />

        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXX"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${inter.className} bg-[#1e222b] text-white antialiased selection:bg-[#ff512f] selection:text-white overflow-x-hidden`}
        style={{ backgroundColor: "#1e222b" }}
      >
        <AuthProvider>
          <SearchProvider>
            <div className="min-h-screen flex flex-col relative bg-[#1e222b]">
              <Header />
              <main className="flex-1 w-full bg-[#1e222b]">
                {children}
              </main>
            </div>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  );
}