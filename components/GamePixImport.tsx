"use client";

import { useState } from "react";
import { adminPostJSON } from "@/lib/admin-fetch";

interface ImportResult {
  ok: boolean;
  imported: number;
  skipped: number;
  total: number;
  errors: string[];
}

export default function GamePixImport() {
  const [feedUrl, setFeedUrl] = useState(
    "https://feeds.gamepix.com/v2/json?sid=A3ALT&pagination=100&page=1"
  );
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!feedUrl.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const data = await adminPostJSON<ImportResult>(
        "/api/admin/import-gamepix",
        { feedUrl: feedUrl.trim() }
      );
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 p-5 rounded-xl border border-[var(--b)] bg-[var(--bg2)] space-y-4 max-w-xl">
      <h2 className="text-lg font-semibold">Import Games from GamePix</h2>

      <div>
        <label className="block text-sm font-medium mb-1">
          GamePix RSS Feed URL
        </label>
        <input
          type="text"
          value={feedUrl}
          onChange={(e) => setFeedUrl(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 rounded bg-[var(--bg3)] border border-[var(--b)] text-sm disabled:opacity-60"
          placeholder="https://feeds.gamepix.com/v2/json?sid=..."
        />
        <p className="text-xs text-[var(--t3)] mt-1">
          మీ GamePix dashboard లో Games Catalog → RSS Feed URL copy చేసి ఇక్కడ paste చేయండి.
          pagination=100 గా పెడితే అన్ని games వస్తాయి.
        </p>
      </div>

      <button
        onClick={handleImport}
        disabled={loading || !feedUrl.trim()}
        className="px-4 py-2 bg-[var(--red)] text-white rounded text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
      >
        {loading ? "Importing... (ఇది కొంత సేపు పడుతుంది)" : "Import All Games"}
      </button>

      {loading && (
        <div className="text-sm text-[var(--t3)] animate-pulse">
          GamePix నుండి games fetch చేస్తున్నాం, Firestore లో save చేస్తున్నాం...
        </div>
      )}

      {error && (
        <p className="text-sm text-[var(--red)]">⚠ {error}</p>
      )}

      {result && (
        <div className="space-y-2 text-sm">
          <p className="text-green-400 font-semibold">
            ✓ Import పూర్తైంది!
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded bg-[var(--bg3)] text-center">
              <p className="text-xl font-bold text-green-400">{result.imported}</p>
              <p className="text-xs text-[var(--t3)]">Imported</p>
            </div>
            <div className="p-3 rounded bg-[var(--bg3)] text-center">
              <p className="text-xl font-bold text-[var(--t3)]">{result.skipped}</p>
              <p className="text-xs text-[var(--t3)]">Skipped</p>
            </div>
            <div className="p-3 rounded bg-[var(--bg3)] text-center">
              <p className="text-xl font-bold">{result.total}</p>
              <p className="text-xs text-[var(--t3)]">Total</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="p-3 rounded bg-[var(--bg3)] space-y-1">
              <p className="text-xs font-semibold text-[var(--red)]">
                కొన్ని games import కాలేదు:
              </p>
              {result.errors.map((e, i) => (
                <p key={i} className="text-xs text-[var(--t3)]">• {e}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}