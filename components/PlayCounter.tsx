"use client";

import { useEffect, useRef } from "react";

interface PlayCounterProps {
  gameId: string;
}

export default function PlayCounter({ gameId }: PlayCounterProps) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    fetch(`/api/games/${gameId}/play`, { method: "POST" }).catch(() => {
      // Non-critical — don't disrupt the player if this fails
    });
  }, [gameId]);

  return null;
}
