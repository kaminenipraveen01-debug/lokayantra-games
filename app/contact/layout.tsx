import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact LokaYantra — Support & Feedback",
  description:
    "Get in touch with LokaYantra — report a bug, suggest a game, or ask about advertising. We reply within 24–48 hours.",
  alternates: { canonical: "https://lokayantra.vercel.app/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}