"use client";

import { useEffect, useRef } from "react";

interface DisqusCommentsProps {
  url: string;
  identifier: string;
  title: string;
}

declare global {
  interface Window {
    disqus_config?: (this: {
      page: { url: string; identifier: string; title: string };
    }) => void;
    DISQUS?: {
      reset: (options: { reload: boolean; config: () => void }) => void;
    };
  }
}

const DISQUS_SHORTNAME = "lokayantra";

export default function DisqusComments({ url, identifier, title }: DisqusCommentsProps) {
  const threadRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    function setConfig() {
      window.disqus_config = function () {
        this.page.url = url;
        this.page.identifier = identifier;
        this.page.title = title;
      };
    }

    if (!scriptLoaded.current) {
      setConfig();

      const script = document.createElement("script");
      script.src = `https://${DISQUS_SHORTNAME}.disqus.com/embed.js`;
      script.setAttribute("data-timestamp", String(Date.now()));
      script.async = true;
      document.body.appendChild(script);

      scriptLoaded.current = true;
    } else if (window.DISQUS) {
      setConfig();
      window.DISQUS.reset({
        reload: true,
        config: window.disqus_config!,
      });
    }
  }, [url, identifier, title]);

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-3 text-[var(--t)]">Comments</h2>
      <div id="disqus_thread" ref={threadRef} />
    </div>
  );
}
