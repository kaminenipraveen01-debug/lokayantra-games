// app/games/[id]/loading.tsx
// Next.js automatically shows this while the page is loading

import { SkeletonGamePage } from "@/components/SkeletonCard";

export default function GameLoading() {
  return (
    <main className="w-full min-h-screen text-white font-sans pb-12 relative overflow-hidden select-none bg-[#0a0a0d]">

      {/* Same white bubbles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-50px] left-[20%] w-[180px] h-[180px] rounded-full bg-white/10" />
        <div className="absolute top-[50px] left-[5%] w-[150px] h-[150px] rounded-full bg-white/8" />
        <div className="absolute top-[20px] left-[35%] w-[80px] h-[80px] rounded-full bg-white/10" />
        <div className="absolute top-[-30px] right-[35%] w-[140px] h-[140px] rounded-full bg-white/10" />
        <div className="absolute top-[60px] right-[10%] w-[160px] h-[160px] rounded-full bg-white/5" />
        <div className="absolute top-[180px] left-[2%] w-[60px] h-[60px] rounded-full bg-white/8" />
        <div className="absolute top-[400px] left-[25%] w-[130px] h-[130px] rounded-full bg-white/8" />
        <div className="absolute top-[480px] right-[5%] w-[170px] h-[170px] rounded-full bg-white/8" />
        <div className="absolute top-[650px] right-[28%] w-[140px] h-[140px] rounded-full bg-white/5" />
        <div className="absolute bottom-[320px] left-[5%] w-[180px] h-[180px] rounded-full bg-white/8" />
        <div className="absolute bottom-[220px] right-[15%] w-[210px] h-[210px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] right-[20%] w-[220px] h-[220px] rounded-full bg-white/10" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-3 pt-[105px] sm:pt-[115px]">
        <SkeletonGamePage />
      </div>
    </main>
  );
}