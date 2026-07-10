// components/SocialBarAd.tsx
"use client";

import { useEffect } from "react";

// Ide "Social Bar" type ad — idi oka specific content slot ki belong
// avvadu, motham site meeda floating/sticky ga janasariddi kabatti —
// idi layout.tsx lo okkasare, global ga add cheyali (prathi page lo kaadu).
export default function SocialBarAd() {
  useEffect(() => {
    if (document.getElementById("social-bar-ad-script")) return;
    const script = document.createElement("script");
    script.id = "social-bar-ad-script";
    script.async = true;
    script.src =
      "https://pl30274835.effectivecpmnetwork.com/7d/63/fc/7d63fcde02d19d34a7aad776b9797c9a.js";
    document.body.appendChild(script);
  }, []);

  return null;
}