// components/SkeletonCard.tsx
"use client";

// ── Single game card skeleton ──
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-[24px] sm:rounded-[32px] bg-white/[0.06] border border-white/10 ${className}`}>
      {/* Shimmer overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* Thumbnail placeholder */}
      <div className="w-full aspect-square bg-white/10 rounded-[24px] sm:rounded-[32px]" />
    </div>
  );
}

// ── Home page full grid skeleton ──
export function SkeletonGrid() {
  // Same pokiGridStyles pattern — mobile lo grid-cols-3 tho match avvataniki
  const sizes = [
    "col-span-2 row-span-2 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-2 row-span-2 aspect-square",
    "col-span-1 row-span-1 aspect-square",
    "col-span-1 row-span-1 aspect-square",
  ];

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-1.5 sm:gap-2 grid-flow-row-dense">
      {Array.from({ length: 24 }).map((_, i) => (
        <SkeletonCard key={i} className={sizes[i % sizes.length]} />
      ))}
    </div>
  );
}

// ── Game player page skeleton ──
export function SkeletonGamePage() {
  return (
    <div className="flex gap-3 items-start animate-pulse">

      {/* Left ad slot skeleton */}
      <div className="hidden xl:block w-[160px] shrink-0 pt-8">
        <div className="w-[160px] h-[600px] rounded-[20px] bg-white/[0.06] border border-white/10" />
      </div>

      {/* Center */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">

        {/* Top label */}
        <div className="flex items-center gap-2 px-1">
          <div className="w-2 h-2 rounded-full bg-white/15" />
          <div className="w-24 h-3 rounded-full bg-white/10" />
        </div>

        {/* iframe area */}
        <div className="relative w-full rounded-[20px] overflow-hidden bg-white/[0.06] border border-white/10 shadow-sm">
          {/* Chrome bar */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 bg-white/10 border-b border-white/5">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
              <div className="w-2.5 h-2.5 rounded-full bg-white/15" />
            </div>
            <div className="flex-1 h-5 rounded-md bg-white/10 max-w-sm" />
          </div>
          {/* iframe placeholder — 16:9 */}
          <div className="relative w-full aspect-video max-h-[calc(100vh-220px)] bg-white/10">
            {/* Shimmer */}
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {/* Center play icon hint */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-white/30 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Control bar skeleton */}
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-[18px] bg-white/5 border border-white/10">
          <div className="w-24 h-8 rounded-xl bg-white/10" />
          <div className="flex-1" />
          <div className="w-16 h-8 rounded-xl bg-white/10" />
          <div className="w-16 h-8 rounded-xl bg-white/10" />
          <div className="w-24 h-8 rounded-xl bg-white/10" />
        </div>

        {/* Bottom games row skeleton */}
        <div className="mt-1">
          <div className="flex items-center justify-between mb-2.5 px-0.5">
            <div className="w-28 h-3 rounded-full bg-white/10" />
            <div className="w-16 h-3 rounded-full bg-white/10" />
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-6 xl:grid-cols-7 gap-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="relative rounded-[16px] overflow-hidden bg-white/[0.06] border border-white/10">
                <div className="w-full aspect-square bg-white/10" />
                <div className="px-2 py-1.5 bg-white/[0.04] border-t border-white/5">
                  <div className="w-full h-2.5 rounded-full bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info grid skeleton */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="md:col-span-2 bg-white/[0.04] rounded-[24px] border border-white/10 p-5 space-y-3">
            <div className="w-16 h-2.5 rounded-full bg-white/10" />
            <div className="w-48 h-5 rounded-full bg-white/10" />
            <div className="space-y-2 pt-1">
              <div className="w-full h-2.5 rounded-full bg-white/10" />
              <div className="w-full h-2.5 rounded-full bg-white/10" />
              <div className="w-3/4 h-2.5 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="bg-white/[0.04] rounded-[24px] border border-white/10 p-5 space-y-3">
            <div className="w-20 h-3 rounded-full bg-white/10 border-b border-white/10 pb-2" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex justify-between">
                <div className="w-16 h-2.5 rounded-full bg-white/10" />
                <div className="w-20 h-2.5 rounded-full bg-white/10" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right ad slots skeleton */}
      <div className="hidden lg:flex flex-col gap-4 w-[300px] shrink-0">
        <div className="w-[300px] h-[250px] rounded-[20px] bg-white/[0.06] border border-white/10" />
        <div className="w-[300px] h-[600px] rounded-[20px] bg-white/[0.06] border border-white/10" />
        <div className="w-[300px] h-[250px] rounded-[20px] bg-white/[0.06] border border-white/10" />
      </div>
    </div>
  );
}