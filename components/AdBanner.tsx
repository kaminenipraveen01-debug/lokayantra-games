// components/AdBanner.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface AdBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

export default function AdBanner({ adKey, width, height, className = "" }: AdBannerProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" } // viewport కి 200px దగ్గరైనప్పుడే load అవుతుంది
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const srcDoc = `<!DOCTYPE html>
<html>
<head>
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;}</style>
</head>
<body>
<script type="text/javascript">
  atOptions = {
    'key': '${adKey}',
    'format': 'iframe',
    'height': ${height},
    'width': ${width},
    'params': {}
  };
</script>
<script type="text/javascript" src="https://www.highperformanceformat.com/${adKey}/invoke.js"></script>
</body>
</html>`;

  return (
    <div
      ref={containerRef}
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height, maxWidth: "100%" }}
    >
      {shouldLoad && (
        <iframe
          title={`ad-${adKey}`}
          srcDoc={srcDoc}
          width={width}
          height={height}
          scrolling="no"
          style={{ border: "none", maxWidth: "100%" }}
          loading="lazy"
        />
      )}
    </div>
  );
}