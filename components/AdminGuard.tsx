"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AdminGuard({ children }: { children: ReactNode }) {
  const { user, loading, isAdmin, signInWithGoogle, logout } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] text-[var(--t)]">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--t)]">
        <h1 className="text-xl font-bold">Admin Access</h1>
        <button
          onClick={signInWithGoogle}
          className="px-4 py-2 bg-[var(--red)] rounded hover:opacity-90"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--bg)] text-[var(--t)]">
        <h1 className="text-xl font-bold text-[var(--red)]">Access Denied</h1>
        <p className="text-[var(--t2)]">
          This account ({user.email}) is not authorized to view this page.
        </p>
        <div className="flex gap-3">
          <button
            onClick={logout}
            className="px-4 py-2 bg-[var(--bg3)] rounded hover:opacity-90"
          >
            Sign out
          </button>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-[var(--bg3)] rounded hover:opacity-90"
          >
            Go home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
