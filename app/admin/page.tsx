"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { adminFetch, adminPostJSON } from "@/lib/admin-fetch";
import { Game } from "@/types/game";

// ── GamePix Import ────────────────────────────────────────────────────────────

interface ImportResult {
  ok: boolean;
  imported: number;
  skipped: number;
  total: number;
  errors: string[];
}

function GamePixImport() {
  const [feedUrl, setFeedUrl] = useState(
    "https://feeds.gamepix.com/v2/json/?sid=A3ALT&pagination=12&page=1"
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
        <label className="block text-sm font-medium mb-1">GamePix RSS Feed URL</label>
        <input
          type="text"
          value={feedUrl}
          onChange={(e) => setFeedUrl(e.target.value)}
          disabled={loading}
          className="w-full px-3 py-2 rounded bg-[var(--bg3)] border border-[var(--b)] text-sm disabled:opacity-60"
          placeholder="https://feeds.gamepix.com/v2/json/?sid=..."
        />
      </div>
      <button
        onClick={handleImport}
        disabled={loading || !feedUrl.trim()}
        className="px-4 py-2 bg-[var(--red)] text-white rounded text-sm font-medium disabled:opacity-50 hover:opacity-90 transition"
      >
        {loading ? "Importing..." : "Import All Games"}
      </button>
      {loading && <p className="text-sm text-[var(--t3)] animate-pulse">Importing...</p>}
      {error && <p className="text-sm text-[var(--red)]">⚠ {error}</p>}
      {result && (
        <div className="space-y-2 text-sm">
          <p className="text-green-400 font-semibold">✓ Import పూర్తైంది!</p>
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
              <p className="text-xs font-semibold text-[var(--red)]">కొన్ని games import కాలేదు:</p>
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

// ── Delete GamePix Games ──────────────────────────────────────────────────────

function DeleteGamePixGames() {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(0);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("Firebase లో ఉన్న అన్ని GamePix games delete చేయాలా? ఇది undo కాదు!")) return;
    setLoading(true);
    setError(null);
    setDeleted(0);
    setDone(false);

    try {
      let totalDeleted = 0;
      let hasMore = true;

      while (hasMore) {
        const data = await adminPostJSON<{ ok: boolean; deleted: number; hasMore: boolean }>(
          "/api/admin/delete-gamepix",
          {}
        );
        totalDeleted += data.deleted;
        setDeleted(totalDeleted);
        hasMore = data.hasMore;
      }
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-5 rounded-xl border border-red-500/30 bg-red-500/5 space-y-3 max-w-xl">
      <h2 className="text-lg font-semibold text-red-400">Delete GamePix Games from Firebase</h2>
      <p className="text-xs text-[var(--t3)]">
        Firebase లో GamePix imported games ఉన్నాయి — అవి quota consume చేస్తున్నాయి.
        Delete చేస్తే Firebase reads దాదాపు zero అవుతాయి.
      </p>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-4 py-2 bg-red-500 text-white rounded text-sm font-medium disabled:opacity-50 hover:bg-red-600 transition"
      >
        {loading ? `Deleting... (${deleted} deleted so far)` : "Delete All GamePix Games"}
      </button>
      {error && <p className="text-sm text-red-400">⚠ {error}</p>}
      {done && (
        <p className="text-sm text-green-400">✓ {deleted} games deleted successfully!</p>
      )}
    </div>
  );
}

// ── Admin Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let snap;
      try {
        snap = await getDocs(query(collection(db, "games"), orderBy("createdAt", "desc")));
      } catch {
        snap = await getDocs(collection(db, "games"));
      }
      setGames(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Game)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load games.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const handleDelete = async (gameId: string) => {
    if (!confirm(`Delete "${gameId}" permanently?`)) return;
    setDeletingId(gameId);
    setError(null);
    try {
      const res = await adminFetch(`/api/games/${gameId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? `Delete failed (${res.status})`);
      }
      setGames((prev) => prev.filter((g) => g.id !== gameId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete game.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--t)] p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[var(--t3)]">{user?.email}</span>
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm bg-[var(--bg3)] rounded hover:opacity-90"
          >
            Sign out
          </button>
        </div>
      </div>

      <Link
        href="/admin/upload"
        className="inline-block px-4 py-2 bg-[var(--red)] text-white rounded text-sm font-medium hover:opacity-90"
      >
        + Upload New Game
      </Link>

      <GamePixImport />
      <DeleteGamePixGames />

      {/* Games list */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            All Games{" "}
            {!loading && (
              <span className="text-[var(--t3)] font-normal">({games.length})</span>
            )}
          </h2>
        </div>

        {error && <p className="text-sm text-[var(--red)] mb-3">⚠ {error}</p>}
        {loading && <p className="text-sm text-[var(--t3)]">Loading games...</p>}

        {!loading && games.length === 0 && !error && (
          <p className="text-sm text-[var(--t3)]">No games uploaded yet.</p>
        )}

        {!loading && games.length > 0 && (
          <div className="rounded-xl border border-[var(--b)] bg-[var(--bg2)] overflow-hidden">
            <div className="hidden sm:grid grid-cols-[64px_1fr_140px_110px_110px_150px] gap-3 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-[var(--t3)] border-b border-[var(--b)]">
              <span></span>
              <span>Title</span>
              <span>Category</span>
              <span>Plays</span>
              <span>Likes</span>
              <span className="text-right">Actions</span>
            </div>

            <ul className="divide-y divide-[var(--b)]">
              {games.map((game) => (
                <li
                  key={game.id}
                  className="grid grid-cols-[64px_1fr] sm:grid-cols-[64px_1fr_140px_110px_110px_150px] gap-3 items-center px-4 py-3"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-[var(--bg3)] flex-shrink-0">
                    {game.thumbnail ? (
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-[var(--t3)]">
                        N/A
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{game.title || game.id}</p>
                    <p className="text-xs text-[var(--t3)] truncate">{game.id}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--t3)] sm:hidden">
                      <span>{game.category || "Uncategorized"}</span>
                      <span>{game.playCount ?? 0} plays</span>
                      <span>{game.likes ?? 0} likes</span>
                    </div>
                  </div>

                  <div className="hidden sm:block">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg3)] text-xs text-[var(--t2)]">
                      {game.category || "Uncategorized"}
                    </span>
                  </div>

                  <div className="hidden sm:block text-sm text-[var(--t2)]">
                    {game.playCount ?? 0}
                  </div>

                  <div className="hidden sm:block text-sm text-[var(--t2)]">
                    {game.likes ?? 0}
                  </div>

                  <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end gap-2 mt-2 sm:mt-0">
                    <Link
                      href={`/admin/upload?edit=${game.id}`}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-[var(--bg3)] text-[var(--t2)] hover:text-white transition"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(game.id)}
                      disabled={deletingId === game.id}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-[var(--red)]/10 text-[var(--red)] border border-[var(--red)]/30 hover:bg-[var(--red)] hover:text-white transition disabled:opacity-50"
                    >
                      {deletingId === game.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}