// components/AdBanner.tsx
"use client";

import { useEffect, useState } from "react";

interface AdBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
}

// highperformanceformat.com ad scripts లోపల document.write() వాడతాయి —
// idi React useEffect లో dynamic గా script inject chesinappudu panichēyadu
// (browser silently ignore chēstundi, ఖాళీ ఉంటుంది). Fix: prathi ad ni
// dāni sontha fresh <iframe> document లో load cheyadam — akkada
// document.write() sarigga pani chēstundi.
export default function AdBanner({ adKey, width, height, className = "" }: AdBannerProps) {
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
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ width, height, maxWidth: "100%" }}
    >
      {mounted && (
        <iframe
          title={`ad-${adKey}`}
          srcDoc={srcDoc}
          width={width}
          height={height}
          scrolling="no"
          style={{ border: "none", maxWidth: "100%" }}
        />
      )}
    </div>
  );
}