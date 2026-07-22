import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | LokaYantra",
  description: "Read LokaYantra's privacy policy — how we collect, use, and protect your data while you play free online games.",
  alternates: { canonical: "https://lokayantra.vercel.app/privacy-policy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}