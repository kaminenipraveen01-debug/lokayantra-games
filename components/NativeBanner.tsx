// components/NativeBanner.tsx
"use client";

import { useEffect, useState } from "react";

interface NativeBannerProps {
  className?: string;
  height?: number;
}

// "Native Banner" script kuda document.write() vaadutundi kabatti, ide
// AdBanner laage sontha <iframe> document lo isolate chesi load
// chestunnam — ide document.write() ni reliable ga panichēyisthundi.
export default function NativeBanner({ className = "", height = 300 }: NativeBannerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const srcDoc = `<!DOCTYPE html>
<html>
<head>
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;}</style>
</head>
<body>
<div id="container-b1fee044727f80420e645b43b93a2112"></div>
<script async="async" data-cfasync="false" src="https://pl30274834.effectivecpmnetwork.com/b1fee044727f80420e645b43b93a2112/invoke.js"></script>
</body>
</html>`;

  return (
    <div className={`w-full flex justify-center overflow-hidden ${className}`} style={{ height }}>
      {mounted && (
        <iframe
          title="native-banner-ad"
          srcDoc={srcDoc}
          width="100%"
          height={height}
          scrolling="no"
          style={{ border: "none", maxWidth: "100%" }}
        />
      )}
    </div>
  );
}