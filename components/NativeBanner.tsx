// components/NativeBanner.tsx
"use client";

import { useEffect, useRef } from "react";

// "Native Banner" ad unit — ide script + container div combo pattern
// follow avutundi (atOptions object avasaram ledu, direct container id
// meeda invoke.js run avutundi).
export default function NativeBanner({ className = "" }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current || !wrapperRef.current) return;
    loadedRef.current = true;

    const script = document.createElement("script");
    script.async = true;
    script.setAttribute("data-cfasync", "false");
    script.src =
      "https://pl30274834.effectivecpmnetwork.com/b1fee044727f80420e645b43b93a2112/invoke.js";
    wrapperRef.current.appendChild(script);
  }, []);

  return (
    <div ref={wrapperRef} className={`w-full flex justify-center ${className}`}>
      <div id="container-b1fee044727f80420e645b43b93a2112" />
    </div>
  );
}