// components/AdBanner.tsx
"use client";

import { useEffect, useRef } from "react";

interface AdBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

// highperformanceformat.com ad units motham "atOptions object + invoke.js"
// pattern follow avutayi — ide reusable ga prathi size ki work chesela
// build chesam. Same component ni prathi ad slot ki different adKey tho
// malli malli use cheyachu.
export default function AdBanner({ adKey, width, height, className = "" }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";

    const configScript = document.createElement("script");
    configScript.type = "text/javascript";
    configScript.innerHTML = `atOptions = {
      'key': '${adKey}',
      'format': 'iframe',
      'height': ${height},
      'width': ${width},
      'params': {}
    };`;

    const invokeScript = document.createElement("script");
    invokeScript.src = `https://www.highperformanceformat.com/${adKey}/invoke.js`;
    invokeScript.async = true;

    container.appendChild(configScript);
    container.appendChild(invokeScript);

    return () => {
      container.innerHTML = "";
    };
  }, [adKey, width, height]);

  return (
    <div className={`flex items-center justify-center overflow-hidden ${className}`}>
      <div className="text-[8px] font-black uppercase tracking-widest text-black/20 absolute -mt-4">Ad</div>
      <div
        ref={containerRef}
        style={{ width, height, maxWidth: "100%" }}
      />
    </div>
  );
}