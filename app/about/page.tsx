"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";

// ── ICONS ──
function IconBolt({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
  );
}
function IconPanda({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" className={className}>
      <circle cx="50" cy="55" r="34" fill="currentColor" />
      <circle cx="27" cy="25" r="12" fill="currentColor" />
      <circle cx="73" cy="25" r="12" fill="currentColor" />
      <circle cx="50" cy="57" r="25" fill="white" />
      <circle cx="40" cy="55" r="5.5" fill="currentColor" />
      <circle cx="60" cy="55" r="5.5" fill="currentColor" />
    </svg>
  );
}
function IconSwatch({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconDevices({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="14" height="10" rx="1.5" />
      <path d="M6 18h6" />
      <rect x="17" y="9" width="5" height="9" rx="1.2" />
    </svg>
  );
}

// ── MOUSE-TRACKING SPOTLIGHT ──
function MouseSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (ref.current) {
        ref.current.style.setProperty("--mx", `${e.clientX}px`);
        ref.current.style.setProperty("--my", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background: "radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.04) 0%, transparent 70%)",
        transition: "background 0.1s",
      }}
    />
  );
}

// ── CONSTELLATION GRID ──
function ConstellationBg() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
          </pattern>
          <radialGradient id="fade" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id="gridmask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridmask)" />
      </svg>
      {/* Dot accents at grid intersections */}
      {[
        [160, 80], [400, 160], [720, 80], [240, 320], [560, 240],
        [880, 320], [80, 480], [480, 400], [800, 480], [320, 560],
      ].map(([cx, cy], i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: 2, height: 2,
            left: cx, top: cy,
            opacity: 0.15,
            animation: `twinkle ${3 + i * 0.4}s ease-in-out ${i * 0.3}s infinite alternate`,
          }}
        />
      ))}
    </div>
  );
}

// ── NUCLEAR TILT CARD — 3 depth layers ──
function NuclearCard({
  children,
  className = "",
  intensity = 22,
  glowColor = "rgba(255,255,255,0.12)",
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glowColor?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!wrapRef.current || !cardRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return;
      const rx = -y * intensity;
      const ry = x * intensity;

      // Main card: full tilt + scale
      cardRef.current.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale3d(1.04,1.04,1.04)`;

      // Shadow card: opposite drift for parallax depth
      if (shadowRef.current) {
        shadowRef.current.style.transform = `perspective(600px) rotateX(${rx * 0.6}deg) rotateY(${ry * 0.6}deg) scale3d(1.02,1.02,1.02) translate(${ry * 0.8}px, ${-rx * 0.8}px)`;
      }

      // Moving glow follows cursor within card
      if (glowRef.current) {
        const gx = (x + 0.5) * 100;
        const gy = (y + 0.5) * 100;
        glowRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, ${glowColor} 0%, transparent 65%)`;
        glowRef.current.style.opacity = "1";
      }
    });
  }, [intensity, glowColor]);

  const handleMouseLeave = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }
    if (shadowRef.current) {
      shadowRef.current.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1) translate(0px,0px)";
    }
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, []);

  return (
    <div ref={wrapRef} className="relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      {/* Layer 1: deep shadow ghost */}
      <div
        ref={shadowRef}
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: "rgba(0,0,0,0.6)",
          filter: "blur(28px)",
          transform: "scale(0.95) translateY(12px)",
          transition: "transform 0.18s cubic-bezier(0.23,1,0.32,1)",
          zIndex: 0,
        }}
      />
      {/* Layer 2: border rim that catches light */}
      <div
        className="absolute inset-0 rounded-[inherit]"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 40%, rgba(255,255,255,0.05) 100%)",
          zIndex: 1,
          padding: 1,
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      {/* Layer 3: main card surface */}
      <div
        ref={cardRef}
        className={`relative ${className}`}
        style={{
          transition: "transform 0.18s cubic-bezier(0.23,1,0.32,1)",
          willChange: "transform",
          zIndex: 2,
        }}
      >
        {/* Moving cursor glow */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-[inherit] opacity-0 pointer-events-none"
          style={{ transition: "opacity 0.2s", zIndex: 0 }}
        />
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
}

// ── ANIMATED COUNTER ──
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = target / 50;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
        observer.disconnect();
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── SCROLL REVEAL ──
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => setV(true), delay); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className} style={{
      opacity: v ? 1 : 0,
      transform: v ? "translateY(0)" : "translateY(50px)",
      transition: `opacity 0.8s cubic-bezier(0.23,1,0.32,1) ${delay}ms, transform 0.8s cubic-bezier(0.23,1,0.32,1) ${delay}ms`,
    }}>
      {children}
    </div>
  );
}

// ── DATA ──
const stats = [
  { value: 8, suffix: "", label: "Categories" },
  { value: 100, suffix: "%", label: "Free Forever" },
  { value: 1, suffix: "", label: "Developer" },
  { value: 0, suffix: "", label: "Downloads Needed" },
];

const features = [
  {
    Icon: IconBolt,
    title: "Zero Friction",
    desc: "No downloads, no installs, no sign-up walls. Click a shape, you're playing in under a second.",
    num: "01",
  },
  {
    Icon: IconPanda,
    title: "Panda Curated",
    desc: "Every game is hand-picked — no auto-scraped junk filling a grid. Quality over quantity, always.",
    num: "02",
  },
  {
    Icon: IconSwatch,
    title: "Monochrome World",
    desc: "While most arcades look like a rainbow exploded, we built a calm, premium black-and-white universe.",
    num: "03",
  },
  {
    Icon: IconDevices,
    title: "Plays Everywhere",
    desc: "Desktop, tablet, or phone — the station reshapes itself. Games go fullscreen on mobile automatically.",
    num: "04",
  },
];

const story = [
  { tag: "ORIGIN", title: "One File, One Idea", desc: "LokaYantra began as a single HTML page — no team, no funding, just the belief that web games deserved a better home.", num: "01" },
  { tag: "DESIGN", title: "The Bubble Grid", desc: "We threw out the boring rectangle grid almost every other site uses and built our own fluid bubble-mosaic layout.", num: "02" },
  { tag: "REBUILD", title: "Full Platform Rewrite", desc: "Rebuilt from the ground up on Next.js — real-time uploads, admin panel, Firestore backend, custom game player.", num: "03" },
  { tag: "TODAY", title: "Still One Developer", desc: "Every page, every game, every pixel here is still built solo. No big studio. Just a panda with a keyboard.", num: "04" },
];

// ── PAGE ──
export default function AboutPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes twinkle {
          from { opacity: 0.08; transform: scale(1); }
          to   { opacity: 0.4;  transform: scale(2); }
        }
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.6; }
          100% { transform: scale(1.7);  opacity: 0; }
        }
        @keyframes glitch-x {
          0%, 100% { clip-path: inset(0 0 90% 0); transform: translate(-3px, 0); }
          20%       { clip-path: inset(30% 0 50% 0); transform: translate(3px, 0); }
          40%       { clip-path: inset(60% 0 20% 0); transform: translate(-2px, 0); }
          60%       { clip-path: inset(80% 0 5%  0); transform: translate(2px,  0); }
          80%       { clip-path: inset(10% 0 70% 0); transform: translate(-1px, 0); }
        }
        @keyframes glitch-y {
          0%, 100% { clip-path: inset(0 0 90% 0); transform: translate(3px, 0); }
          20%       { clip-path: inset(40% 0 40% 0); transform: translate(-3px, 0); }
          60%       { clip-path: inset(70% 0 10% 0); transform: translate(2px, 0); }
        }
        @keyframes breathe {
          0%, 100% { opacity: 0.7; }
          50%       { opacity: 1; }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-100%); opacity: 0; }
          to   { transform: translateX(0);     opacity: 1; }
        }
        .noise::after {
          content: '';
          position: fixed; inset: 0; pointer-events: none; z-index: 999;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.032'/%3E%3C/svg%3E");
          background-size: 128px 128px;
        }
        .card-surface {
          background: linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.2) 100%);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(32px) saturate(1.5);
        }
        .card-surface-bright {
          background: linear-gradient(145deg, rgba(255,255,255,0.11) 0%, rgba(255,255,255,0.04) 50%, rgba(0,0,0,0.15) 100%);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(40px) saturate(1.8);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.04) inset, 0 40px 80px -30px rgba(0,0,0,0.9);
        }
        .hero-line {
          box-shadow: 0 1px 0 rgba(255,255,255,0.08);
        }
        .text-ice {
          background: linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.65) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-ice-strong {
          background: linear-gradient(170deg, #ffffff 30%, rgba(180,180,220,0.7) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(255,255,255,0.2));
        }
      `}} />

      <main
        className="noise w-full min-h-screen font-sans pb-32 relative overflow-hidden select-none"
        style={{ background: "linear-gradient(170deg, #06060f 0%, #0c0c18 35%, #08080e 70%, #050509 100%)" }}
      >
        {/* MOUSE SPOTLIGHT */}
        <MouseSpotlight />

        {/* CONSTELLATION GRID */}
        <ConstellationBg />

        {/* DEEP AMBIENT BLOBS */}
        <div className="pointer-events-none fixed inset-0 z-0">
          <div className="absolute w-[900px] h-[900px] rounded-full"
            style={{ top: "-20%", left: "-15%", background: "radial-gradient(circle, rgba(120,120,255,0.04) 0%, transparent 65%)" }} />
          <div className="absolute w-[700px] h-[700px] rounded-full"
            style={{ top: "50%", right: "-15%", background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 65%)" }} />
          <div className="absolute w-[500px] h-[500px] rounded-full"
            style={{ bottom: "-10%", left: "25%", background: "radial-gradient(circle, rgba(80,80,200,0.03) 0%, transparent 65%)" }} />
        </div>

        {/* ── HERO ── */}
        <div className="w-full max-w-[1020px] mx-auto px-4 pt-[110px] sm:pt-[160px] relative z-10">
          <Reveal>
            {/* Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2))" }} />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/25">Our Manifesto</span>
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.2), transparent)" }} />
            </div>

            {/* GLITCH HERO TITLE */}
            <div className="relative text-center mb-10 overflow-hidden">
              {/* Chromatic aberration layer R */}
              <h1
                className="absolute inset-0 text-[clamp(52px,11vw,128px)] font-black uppercase leading-[0.9] pointer-events-none"
                aria-hidden="true"
                style={{
                  color: "rgba(255,80,80,0.15)",
                  letterSpacing: "-0.05em",
                  transform: "translate(-2px, 0)",
                  animation: "glitch-x 7s step-end 2s infinite",
                }}
              >
                LOKAYANTRA
              </h1>
              {/* Chromatic aberration layer B */}
              <h1
                className="absolute inset-0 text-[clamp(52px,11vw,128px)] font-black uppercase leading-[0.9] pointer-events-none"
                aria-hidden="true"
                style={{
                  color: "rgba(80,80,255,0.15)",
                  letterSpacing: "-0.05em",
                  transform: "translate(2px, 0)",
                  animation: "glitch-y 7s step-end 2s infinite",
                }}
              >
                LOKAYANTRA
              </h1>
              {/* Main title */}
              <h1
                className="relative text-[clamp(52px,11vw,128px)] font-black uppercase leading-[0.9] text-ice-strong"
                style={{ letterSpacing: "-0.05em" }}
              >
                LOKAYANTRA
              </h1>
              {/* Subtitle slash */}
              <p className="mt-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.45em] text-white/20">
                The Arcade Without Compromise
              </p>
            </div>

            {/* Panda with aggressive pulse */}
            <div className="flex justify-center mb-12">
              <div className="relative">
                <div className="absolute inset-0 rounded-full" style={{ animation: "pulse-ring 2s ease-out 0s infinite", border: "1px solid rgba(255,255,255,0.25)" }} />
                <div className="absolute inset-0 rounded-full" style={{ animation: "pulse-ring 2s ease-out 0.6s infinite", border: "1px solid rgba(255,255,255,0.12)" }} />
                <div
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center card-surface-bright"
                  style={{ boxShadow: "0 0 60px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.15)" }}
                >
                  <IconPanda className="w-13 h-13 sm:w-16 sm:h-16 text-white" />
                </div>
              </div>
            </div>

            {/* Hero card — full nuclear tilt */}
            <NuclearCard intensity={10} className="card-surface-bright rounded-[36px] p-10 sm:p-16 text-center">
              <p className="text-base sm:text-xl font-semibold leading-relaxed max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.58)" }}>
                Boring grids are dead.{" "}
                <strong className="text-white font-black">LokaYantra</strong> is a living, breathing playground — built for players who want{" "}
                <strong className="text-white">aesthetic fury</strong> and{" "}
                <strong className="text-white">instant action</strong>, zero downloads, zero clutter, zero compromise.
              </p>
            </NuclearCard>
          </Reveal>
        </div>

        {/* ── STATS ── */}
        <div className="w-full max-w-[1020px] mx-auto px-4 mt-20 sm:mt-28 relative z-10">
          <Reveal delay={80}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
              {stats.map((s, i) => (
                <NuclearCard key={i} intensity={24} glowColor="rgba(255,255,255,0.18)"
                  className="card-surface-bright rounded-[28px] p-7 sm:p-9 text-center"
                >
                  <div
                    className="text-[clamp(36px,6vw,64px)] font-black leading-none mb-2 text-ice-strong"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    <Counter target={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25">{s.label}</div>
                </NuclearCard>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── FEATURES ── */}
        <div className="w-full max-w-[1020px] mx-auto px-4 mt-24 sm:mt-32 relative z-10">
          <Reveal delay={80}>
            <div className="mb-14 sm:mb-20">
              <span className="block text-center text-[9px] font-black uppercase tracking-[0.45em] text-white/20 mb-3">What Makes Us Different</span>
              <h2 className="text-center text-[clamp(32px,6vw,72px)] font-black uppercase leading-[0.9] text-ice"
                style={{ letterSpacing: "-0.04em" }}>
                Built Different,<br />On Purpose
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 100}>
                <NuclearCard intensity={20} glowColor="rgba(255,255,255,0.15)"
                  className="card-surface rounded-[28px] p-8 sm:p-10 h-full group relative overflow-hidden"
                >
                  {/* Giant number */}
                  <div
                    className="absolute -bottom-6 -right-3 text-[120px] font-black leading-none pointer-events-none select-none"
                    style={{ color: "rgba(255,255,255,0.025)", letterSpacing: "-0.06em" }}
                  >
                    {f.num}
                  </div>

                  {/* Icon */}
                  <div className="relative w-14 h-14 mb-7">
                    <div className="absolute inset-0 rounded-2xl border border-white/10"
                      style={{ animation: "spin-slow 12s linear infinite" }} />
                    <div className="absolute inset-0 rounded-2xl card-surface flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.06)" }}>
                      <f.Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h3 className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white mb-3">{f.title}</h3>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{f.desc}</p>

                  {/* Bottom edge light */}
                  <div className="absolute bottom-0 left-8 right-8 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)" }} />
                </NuclearCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── STORY ── */}
        <div className="w-full max-w-[1020px] mx-auto px-4 mt-24 sm:mt-32 relative z-10">
          <Reveal delay={80}>
            <div className="mb-14 sm:mb-20">
              <span className="block text-center text-[9px] font-black uppercase tracking-[0.45em] text-white/20 mb-3">The Journey</span>
              <h2 className="text-center text-[clamp(32px,6vw,72px)] font-black uppercase leading-[0.9] text-ice"
                style={{ letterSpacing: "-0.04em" }}>
                Our Story
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {story.map((t, i) => (
              <Reveal key={i} delay={i * 110}>
                <NuclearCard intensity={18} glowColor="rgba(255,255,255,0.12)"
                  className="card-surface rounded-[24px] p-7 sm:p-9 relative overflow-hidden"
                >
                  <div
                    className="absolute -top-6 -right-3 font-black leading-none pointer-events-none select-none"
                    style={{ fontSize: 120, color: "rgba(255,255,255,0.03)", letterSpacing: "-0.06em" }}
                    aria-hidden
                  >{t.num}</div>
                  <span className="text-[8px] font-black uppercase tracking-[0.45em] text-white/20 mb-2 block">{t.tag}</span>
                  <h4 className="text-sm sm:text-base font-black uppercase tracking-tight text-white mb-3">{t.title}</h4>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.42)" }}>{t.desc}</p>
                </NuclearCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* ── FOUNDER NOTE ── */}
        <div className="w-full max-w-[820px] mx-auto px-4 mt-24 sm:mt-32 relative z-10">
          <Reveal delay={80}>
            <NuclearCard intensity={8} glowColor="rgba(255,255,255,0.1)"
              className="card-surface-bright rounded-[36px] p-9 sm:p-14 relative overflow-hidden"
            >
              {/* Corner accent lines */}
              <div className="absolute top-6 left-6 w-10 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="absolute top-6 left-6 w-px h-10" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="absolute bottom-6 right-6 w-10 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
              <div className="absolute bottom-6 right-6 w-px h-10" style={{ background: "rgba(255,255,255,0.15)" }} />

              {/* Big quote mark */}
              <div className="absolute top-4 left-8 text-[100px] font-black leading-none select-none pointer-events-none"
                style={{ color: "rgba(255,255,255,0.035)", lineHeight: 1 }}>&rdquo;</div>

              <span className="block text-[9px] font-black uppercase tracking-[0.45em] text-white/20 mb-6 text-center">From The Founder</span>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100"
                    style={{ animation: "spin-slow 14s linear infinite" }}>
                    <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="8 5" />
                  </svg>
                  <div className="w-22 h-22 sm:w-24 sm:h-24 rounded-full card-surface flex items-center justify-center"
                    style={{ width: 88, height: 88 }}>
                    <IconPanda className="w-12 h-12 text-white" />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-1">Praveen Kumar</h3>
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25 mb-5">Solo Developer · Designer · Founder</p>
                  <p className="text-sm sm:text-base font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.52)" }}>
                    "I build, design, and run LokaYantra solo — every page, every pixel of the platform.
                    No big studio behind this, just one developer who got tired of boring game portals
                    and decided to build the one I actually wanted to use."
                  </p>
                </div>
              </div>
            </NuclearCard>
          </Reveal>
        </div>

        {/* ── CORE PILLARS ── */}
        <div className="w-full max-w-[1020px] mx-auto px-4 mt-14 sm:mt-20 relative z-10">
          <Reveal delay={80}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {[
                { Icon: IconPanda, label: "Panda Aesthetic", desc: "Monochrome, minimalistic, and incredibly premium visuals designed to put games first." },
                { Icon: IconBolt, label: "Zero Friction", desc: "One click, absolute immersion. Play directly in your browser with optimized cloud speeds." },
              ].map((p, i) => (
                <NuclearCard key={i} intensity={20} glowColor="rgba(255,255,255,0.14)"
                  className="card-surface rounded-[24px] p-7 sm:p-8"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-xl card-surface flex items-center justify-center"
                      style={{ background: "rgba(255,255,255,0.07)" }}>
                      <p.Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xs font-black uppercase tracking-[0.22em] text-white">{p.label}</h3>
                  </div>
                  <p className="text-xs font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{p.desc}</p>
                </NuclearCard>
              ))}
            </div>
          </Reveal>
        </div>

        {/* ── CTA ── */}
        <div className="w-full max-w-[1020px] mx-auto px-4 mt-20 sm:mt-24 relative z-10 text-center">
          <Reveal delay={80}>
            <Link
              href="/"
              className="inline-flex h-[56px] px-12 items-center justify-center font-black uppercase tracking-[0.22em] text-[11px] rounded-full text-white relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.05) 100%)",
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.04) inset, 0 25px 50px -18px rgba(0,0,0,0.8)",
                transition: "transform 0.2s cubic-bezier(0.23,1,0.32,1), box-shadow 0.2s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.06)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(255,255,255,0.08) inset, 0 30px 60px -18px rgba(0,0,0,0.9), 0 0 40px rgba(255,255,255,0.05)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 1px rgba(255,255,255,0.04) inset, 0 25px 50px -18px rgba(0,0,0,0.8)"; }}
            >
              <span className="relative z-10">← Back to Arcade</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
            </Link>
          </Reveal>
        </div>
      </main>
    </>
  );
}