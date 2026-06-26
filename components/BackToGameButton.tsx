"use client";

import { useEffect, useState } from "react";

export default function BackToGameButton({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToGame = () => {
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      onClick={scrollToGame}
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50
                  flex items-center gap-2 px-5 py-2.5 rounded-full
                  bg-[var(--red)] text-white text-sm font-semibold
                  shadow-[0_4px_20px_rgba(229,57,53,0.4)]
                  transition-all duration-300
                  ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
      Back to Game
    </button>
  );
}