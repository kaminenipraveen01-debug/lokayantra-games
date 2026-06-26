import Link from "next/link";

export default function GameNotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg)] text-[var(--t)] gap-4">
      <h1 className="text-2xl font-bold">Game not found</h1>
      <Link href="/" className="text-[var(--red)] underline">
        Back to library
      </Link>
    </main>
  );
}
