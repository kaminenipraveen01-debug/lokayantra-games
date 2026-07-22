"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { User } from "firebase/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    // Firebase Auth SDK ni idle time lo matrame load chestunnam — idi
    // page LCP/critical-render path ni block cheyakunda chestundi.
    // Sadharana users (games aade vallu) ki idi ekkuvasari 0-1 second
    // delay tho load avutundi, kani anta varaku site instant ga
    // interactive ga untundi.
    const init = async () => {
      const { onAuthStateChanged } = await import("firebase/auth");
      const { auth } = await import("./firebase");
      if (cancelled) return;
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(firebaseUser);
        setLoading(false);
      });
    };

    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const idleId = (window as any).requestIdleCallback(init, { timeout: 2000 });
      return () => {
        cancelled = true;
        (window as any).cancelIdleCallback?.(idleId);
        unsubscribe?.();
      };
    } else {
      // Safari/older browsers ki fallback — chinna setTimeout tho
      const timeoutId = setTimeout(init, 200);
      return () => {
        cancelled = true;
        clearTimeout(timeoutId);
        unsubscribe?.();
      };
    }
  }, []);

  const signInWithGoogle = async () => {
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const { auth } = await import("./firebase");
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    const { signOut } = await import("firebase/auth");
    const { auth } = await import("./firebase");
    await signOut(auth);
  };

  const isAdmin = !!user?.email && user.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}