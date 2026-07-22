import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | LokaYantra",
  description: "Read LokaYantra's terms and conditions for using our free online HTML5 games platform.",
  alternates: { canonical: "https://lokayantra.vercel.app/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}