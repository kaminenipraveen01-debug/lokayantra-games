// lib/secret-codes-context.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  SECRET_CODE_MAP,
  SecretCode,
  TOTAL_SECRETS,
  getMilestoneForCount,
  Milestone,
} from "./secretCodes";
import { useAuth } from "./auth-context";

const STORAGE_KEY = "lokayantra_secrets_v1";
const XP_PER_SECRET = 100;

type TriggerStatus = "new" | "repeat" | "unknown";

export interface TriggerResult {
  status: TriggerStatus;
  entry?: SecretCode;
}

export interface ActiveEvent {
  id: number;
  entry: SecretCode;
  isNew: boolean;
}

interface ToastState {
  message: string;
  kind: "unknown" | "repeat";
}

interface SecretCodesContextValue {
  discovered: Set<string>;
  discoveredCount: number;
  totalSecrets: number;
  xp: number;
  milestone: Milestone | null;
  activeEvent: ActiveEvent | null;
  newMilestone: Milestone | null;
  toast: ToastState | null;
  unlockedGames: string[];
  activeGame: string | null;
  hydrated: boolean;
  triggerCode: (raw: string) => TriggerResult;
  dismissEvent: () => void;
  dismissToast: () => void;
  dismissMilestone: () => void;
  openGame: (gameId: string) => void;
  closeGame: () => void;
}

const SecretCodesContext = createContext<SecretCodesContextValue | undefined>(undefined);

function loadDiscovered(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? new Set(arr) : new Set();
  } catch {
    return new Set();
  }
}

function saveDiscovered(set: Set<string>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // ignore quota / privacy-mode errors — localStorage is best-effort
  }
}

export function SecretCodesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [discovered, setDiscovered] = useState<Set<string>>(new Set());
  const [activeEvent, setActiveEvent] = useState<ActiveEvent | null>(null);
  const [newMilestone, setNewMilestone] = useState<Milestone | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount only (avoids SSR/client mismatch)
  useEffect(() => {
    setDiscovered(loadDiscovered());
    setHydrated(true);
  }, []);

  // Best-effort cloud sync — user logged in unte progress Firestore ki
  // save avutundi, kani idi feature ni block cheyadu. localStorage e
  // source of truth, ee sync just a backup/cross-device convenience.
  useEffect(() => {
    if (!hydrated || !user || discovered.size === 0) return;
    (async () => {
      try {
        const [{ doc, setDoc, serverTimestamp }, { db }] = await Promise.all([
          import("firebase/firestore"),
          import("./firebase"),
        ]);
        await setDoc(
          doc(db, "secretProgress", user.uid),
          { codes: Array.from(discovered), count: discovered.size, updatedAt: serverTimestamp() },
          { merge: true }
        );
      } catch {
        // Silent — cloud sync is optional.
      }
    })();
  }, [discovered, user, hydrated]);

  const triggerCode = useCallback(
    (raw: string): TriggerResult => {
      const code = raw.trim().toLowerCase();
      if (!code) return { status: "unknown" };

      const entry = SECRET_CODE_MAP[code];
      if (!entry) {
        setToast({ message: "Nothing happened... Keep exploring! 🔍", kind: "unknown" });
        return { status: "unknown" };
      }

      if (discovered.has(code)) {
        setToast({ message: "Already Discovered ✅", kind: "repeat" });
        setActiveEvent({ id: Date.now(), entry, isNew: false });
        return { status: "repeat", entry };
      }

      const next = new Set(discovered);
      next.add(code);
      setDiscovered(next);
      saveDiscovered(next);
      setActiveEvent({ id: Date.now(), entry, isNew: true });

      const milestone = getMilestoneForCount(next.size);
      const prevMilestone = getMilestoneForCount(next.size - 1);
      if (milestone && milestone.count !== prevMilestone?.count) {
        setNewMilestone(milestone);
      }

      return { status: "new", entry };
    },
    [discovered]
  );

  const unlockedGames = Array.from(discovered)
    .map((c) => SECRET_CODE_MAP[c]?.unlocksGame)
    .filter((g): g is string => Boolean(g));

  const value: SecretCodesContextValue = {
    discovered,
    discoveredCount: discovered.size,
    totalSecrets: TOTAL_SECRETS,
    xp: discovered.size * XP_PER_SECRET,
    milestone: getMilestoneForCount(discovered.size),
    activeEvent,
    newMilestone,
    toast,
    unlockedGames,
    activeGame,
    hydrated,
    triggerCode,
    dismissEvent: () => setActiveEvent(null),
    dismissToast: () => setToast(null),
    dismissMilestone: () => setNewMilestone(null),
    openGame: (gameId: string) => setActiveGame(gameId),
    closeGame: () => setActiveGame(null),
  };

  return <SecretCodesContext.Provider value={value}>{children}</SecretCodesContext.Provider>;
}

export function useSecretCodes(): SecretCodesContextValue {
  const ctx = useContext(SecretCodesContext);
  if (!ctx) throw new Error("useSecretCodes must be used within a SecretCodesProvider");
  return ctx;
}