"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";
import { adminFetch } from "@/lib/admin-fetch";
import { Game } from "@/types/game";

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
    if (!confirm(`Delete "${gameId}" permanently? This removes its Firestore entry and all files from the games repo. This cannot be undone.`)) {
      return;
    }

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

      {/* Games list */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">
            All Games {!loading && <span className="text-[var(--t3)] font-normal">({games.length})</span>}
          </h2>
        </div>

        {error && (
          <p className="text-sm text-[var(--red)] mb-3">⚠ {error}</p>
        )}

        {loading && (
          <p className="text-sm text-[var(--t3)]">Loading games...</p>
        )}

        {!loading && games.length === 0 && !error && (
          <p className="text-sm text-[var(--t3)]">No games uploaded yet.</p>
        )}

        {!loading && games.length > 0 && (
          <div className="rounded-xl border border-[var(--b)] bg-[var(--bg2)] overflow-hidden">
            {/* Header row — desktop only */}
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
                  {/* Thumbnail */}
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-md overflow-hidden bg-[var(--bg3)] flex-shrink-0">
                    {game.thumbnail ? (
                      <Image
                        src={game.thumbnail}
                        alt={game.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-[var(--t3)]">
                        N/A
                      </div>
                    )}
                  </div>

                  {/* Title + mobile meta */}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{game.title || game.id}</p>
                    <p className="text-xs text-[var(--t3)] truncate">{game.id}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-[var(--t3)] sm:hidden">
                      <span>{game.category || "Uncategorized"}</span>
                      <span>{game.playCount ?? 0} plays</span>
                      <span>{game.likes ?? 0} likes</span>
                    </div>
                  </div>

                  {/* Category — desktop */}
                  <div className="hidden sm:block">
                    <span className="px-2 py-0.5 rounded-md bg-[var(--bg3)] text-xs text-[var(--t2)]">
                      {game.category || "Uncategorized"}
                    </span>
                  </div>

                  {/* Plays — desktop */}
                  <div className="hidden sm:block text-sm text-[var(--t2)]">
                    {game.playCount ?? 0}
                  </div>

                  {/* Likes — desktop */}
                  <div className="hidden sm:block text-sm text-[var(--t2)]">
                    {game.likes ?? 0}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end gap-2 mt-2 sm:mt-0">
                    <Link
                      href={`/admin/upload?edit=${game.id}`}
                      className="px-3 py-1.5 text-xs font-medium rounded bg-[var(--bg3)] text-[var(--t2)] hover:text-white hover:bg-[var(--bg3)]/80 transition"
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