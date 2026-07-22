import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About LokaYantra — Free Online Games Platform",
  description:
    "Learn about LokaYantra, a free browser-based gaming platform with 1000+ HTML5 games across action, racing, puzzle, adventure and more — no downloads needed.",
  keywords: ["about lokayantra", "free online games platform", "html5 game website", "no download games site"],
  alternates: { canonical: "https://lokayantra.vercel.app/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}