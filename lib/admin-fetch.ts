import { auth } from "@/lib/firebase";

/**
 * Fetch wrapper that automatically attaches the current admin's
 * Firebase ID token as a Bearer token.
 */
export async function adminFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const currentUser = auth.currentUser;

  if (!currentUser) {
    throw new Error("Not authenticated. Please sign in again.");
  }

  const idToken = await currentUser.getIdToken();

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${idToken}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, { ...options, headers });
}

/**
 * Convenience wrapper for JSON POST requests.
 */
export async function adminPostJSON<T = unknown>(url: string, body: unknown): Promise<T> {
  const res = await adminFetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const data = await res.json();
      message = data.message ?? message;
    } catch {
      // ignore non-JSON error bodies
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}
