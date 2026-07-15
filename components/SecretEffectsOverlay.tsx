// components/SecretEffectsOverlay.tsx
// Mount this ONCE near the bottom of app/layout.tsx (inside <body>, after
// {children}). It listens to SecretCodesContext and renders:
//   1. The full-screen visual effect for whatever code was just triggered
//   2. A center popup with the code's message ("⚡ GOD MODE ACTIVATED!" etc.)
//   3. Small toasts for "Nothing happened" / "Already Discovered"
//   4. A milestone banner (Bronze/Silver/Gold/Master/Legend Explorer)
//   5. A "Play Mini-Game" button when a code that unlocks a game is found
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSecretCodes } from "@/lib/secret-codes-context";
import { EffectKind, SecretCode } from "@/lib/secretCodes";
import MiniGameModal from "./MiniGames";

const DEFAULT_DURATION = 3200;

export default function SecretEffectsOverlay() {
  const {
    activeEvent,
    dismissEvent,
    toast,
    dismissToast,
    newMilestone,
    dismissMilestone,
    discoveredCount,
    totalSecrets,
    openGame,
    activeGame,
    closeGame,
  } = useSecretCodes();

  // Auto-dismiss the active effect after its duration
  useEffect(() => {
    if (!activeEvent) return;
    const ms = activeEvent.entry.durationMs ?? DEFAULT_DURATION;
    const t = setTimeout(dismissEvent, ms);
    return () => clearTimeout(t);
  }, [activeEvent, dismissEvent]);

  // Auto-dismiss toasts
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismissToast, 2200);
    return () => clearTimeout(t);
  }, [toast, dismissToast]);

  return (
    <>
      {/* ── FULL-SCREEN EFFECT + POPUP ── */}
      <AnimatePresence>
        {activeEvent && (
          <EffectLayer
            key={activeEvent.id}
            entry={activeEvent.entry}
            isNew={activeEvent.isNew}
            onPlayGame={() => {
              if (activeEvent.entry.unlocksGame) openGame(activeEvent.entry.unlocksGame);
            }}
          />
        )}
      </AnimatePresence>

      {/* ── TOASTS (unknown / repeat) ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-5 py-3 rounded-full bg-black/85 text-white text-xs font-bold tracking-wide shadow-2xl backdrop-blur"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MILESTONE BANNER ── */}
      <AnimatePresence>
        {newMilestone && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[9999]"
            onAnimationComplete={() => {
              setTimeout(dismissMilestone, 3500);
            }}
          >
            <div className="px-6 py-4 rounded-3xl bg-gradient-to-r from-[#ffd700] to-[#ff9d00] shadow-2xl text-center">
              <p className="text-[10px] font-black uppercase tracking-widest text-black/60">
                Achievement Unlocked
              </p>
              <p className="text-lg font-black text-black">{newMilestone.title}</p>
              <p className="text-[10px] font-bold text-black/50 mt-0.5">
                {discoveredCount} / {totalSecrets} secrets found
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MINI GAME MODAL ── */}
      <AnimatePresence>
        {activeGame && <MiniGameModal gameId={activeGame} onClose={closeGame} />}
      </AnimatePresence>
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// EFFECT LAYER — picks the right visual based on entry.effect
// ────────────────────────────────────────────────────────────────
function EffectLayer({
  entry,
  isNew,
  onPlayGame,
}: {
  entry: SecretCode;
  isNew: boolean;
  onPlayGame: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
    >
      <EffectVisual effect={entry.effect} color={entry.color} emoji={entry.emoji} />

      {/* Center popup message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
        className="absolute top-[18%] left-1/2 -translate-x-1/2 text-center px-6"
      >
        <p
          className="text-2xl sm:text-4xl font-black drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
          style={{ color: entry.color ?? "#ffffff" }}
        >
          {entry.popup}
        </p>
        {isNew && (
          <p className="mt-2 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-white/70">
            Secret Discovered — {entry.title}
          </p>
        )}
        {isNew && entry.unlocksGame && (
          <button
            onClick={onPlayGame}
            className="pointer-events-auto mt-4 px-5 py-2 rounded-full bg-white text-black text-xs font-black uppercase tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-transform"
          >
            🎮 Play Unlocked Game
          </button>
        )}
      </motion.div>
    </motion.div>
  );
}

function EffectVisual({ effect, color, emoji }: { effect: EffectKind; color?: string; emoji?: string }) {
  switch (effect) {
    case "glow":
      return <GlowEffect color={color ?? "#ffd700"} />;
    case "aura":
      return <AuraEffect color={color ?? "#00f0ff"} />;
    case "flash":
      return <FlashEffect color={color ?? "#ffffff"} />;
    case "shake":
      return <ShakeEffect />;
    case "confetti":
      return <ParticleField mode="confetti" />;
    case "rain":
      return <ParticleField mode="emoji" emoji={emoji ?? "✨"} />;
    case "matrix":
      return <CanvasEffect kind="matrix" color={color ?? "#00ff41"} />;
    case "snow":
      return <CanvasEffect kind="snow" color={color ?? "#ffffff"} />;
    case "stars":
      return <CanvasEffect kind="stars" color={color ?? "#818cf8"} />;
    case "disco":
      return <DiscoEffect />;
    case "glitch":
      return <GlitchEffect color={color ?? "#ff2e63"} />;
    case "portal":
      return <PortalEffect color={color ?? "#a855f7"} />;
    case "eclipse":
      return <EclipseEffect />;
    case "silhouette":
      return <SilhouetteEffect emoji={emoji ?? "❓"} color={color} />;
    case "founder":
      return <FounderEffect color={color ?? "#ffd700"} />;
    default:
      return null;
  }
}

// ── Simple CSS-driven effects ──

function GlowEffect({ color }: { color: string }) {
  return (
    <div
      className="absolute inset-0"
      style={{ boxShadow: `inset 0 0 180px 40px ${color}55`, background: `${color}0d` }}
    />
  );
}

function AuraEffect({ color }: { color: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 1.4, repeat: Infinity }}
      className="absolute inset-0"
      style={{ boxShadow: `inset 0 0 120px 20px ${color}88` }}
    />
  );
}

function FlashEffect({ color }: { color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0"
      style={{ background: color }}
    />
  );
}

function ShakeEffect() {
  useEffect(() => {
    document.body.style.transition = "transform 0.05s";
    let n = 0;
    const id = setInterval(() => {
      n++;
      const x = (Math.random() - 0.5) * 10;
      const y = (Math.random() - 0.5) * 10;
      document.body.style.transform = `translate(${x}px, ${y}px)`;
      if (n > 14) {
        clearInterval(id);
        document.body.style.transform = "";
      }
    }, 40);
    return () => {
      clearInterval(id);
      document.body.style.transform = "";
    };
  }, []);
  return null;
}

function DiscoEffect() {
  const colors = ["#ff003c", "#00f0ff", "#facc15", "#a855f7", "#22c55e"];
  return (
    <>
      {colors.map((c, i) => (
        <motion.div
          key={c}
          className="absolute inset-0 mix-blend-screen"
          style={{ background: c }}
          animate={{ opacity: [0, 0.35, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </>
  );
}

function GlitchEffect({ color }: { color: string }) {
  return (
    <motion.div
      animate={{ x: [0, -4, 4, -2, 0], opacity: [0.5, 0.8, 0.5, 0.8, 0.5] }}
      transition={{ duration: 0.4, repeat: 4 }}
      className="absolute inset-0 mix-blend-difference"
      style={{ background: color }}
    />
  );
}

function EclipseEffect() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.85 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black"
      style={{
        maskImage: "radial-gradient(circle at 50% 40%, transparent 60px, black 180px)",
        WebkitMaskImage: "radial-gradient(circle at 50% 40%, transparent 60px, black 180px)",
      }}
    />
  );
}

function SilhouetteEffect({ emoji, color }: { emoji: string; color?: string }) {
  return (
    <motion.div
      initial={{ x: "-20vw" }}
      animate={{ x: "120vw" }}
      transition={{ duration: 2.6, ease: "easeInOut" }}
      className="absolute top-[35%] text-[100px] sm:text-[160px] drop-shadow-2xl"
      style={{ filter: color ? `drop-shadow(0 0 24px ${color})` : undefined }}
    >
      {emoji}
    </motion.div>
  );
}

function PortalEffect({ color }: { color: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border-4"
          style={{ borderColor: color }}
          initial={{ width: 20, height: 20, opacity: 0.9 }}
          animate={{ width: 500, height: 500, opacity: 0, rotate: 180 }}
          transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function FounderEffect({ color }: { color: string }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0"
        style={{ background: `radial-gradient(circle at 50% 35%, ${color}33, #000000 75%)` }}
      />
      <ParticleField mode="confetti" />
      <motion.div
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity }}
        className="absolute inset-0"
        style={{ boxShadow: `inset 0 0 220px 60px ${color}66` }}
      />
    </>
  );
}

// ── Particle field: confetti or falling emoji ──
function ParticleField({ mode, emoji }: { mode: "confetti" | "emoji"; emoji?: string }) {
  const pieces = Array.from({ length: mode === "confetti" ? 60 : 36 });
  const confettiColors = ["#ff003c", "#00f0ff", "#ffd700", "#22c55e", "#a855f7", "#f472b6"];

  return (
    <div className="absolute inset-0">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 1.2;
        const duration = 2.2 + Math.random() * 1.6;
        const size = mode === "confetti" ? 6 + Math.random() * 6 : 18 + Math.random() * 16;
        const rotate = Math.random() * 360;

        if (mode === "confetti") {
          const c = confettiColors[i % confettiColors.length];
          return (
            <motion.span
              key={i}
              initial={{ y: "-10vh", x: `${left}vw`, opacity: 1, rotate: 0 }}
              animate={{ y: "110vh", rotate }}
              transition={{ duration, delay, ease: "easeIn" }}
              className="absolute block"
              style={{ width: size, height: size * 0.5, background: c, borderRadius: 2 }}
            />
          );
        }

        return (
          <motion.span
            key={i}
            initial={{ y: "-10vh", x: `${left}vw`, opacity: 1 }}
            animate={{ y: "110vh", rotate }}
            transition={{ duration, delay, ease: "linear" }}
            className="absolute block"
            style={{ fontSize: size }}
          >
            {emoji}
          </motion.span>
        );
      })}
    </div>
  );
}

// ── Canvas-based effects: matrix rain / snow / starfield ──
function CanvasEffect({ kind, color }: { kind: "matrix" | "snow" | "stars"; color: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let raf = 0;

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    if (kind === "matrix") {
      const fontSize = 16;
      const columns = Math.floor(width / fontSize);
      const drops = new Array(columns).fill(1);
      const chars = "アイウエオカキクケコサシスセソ0123456789";
      const draw = () => {
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = color;
        ctx.font = `${fontSize}px monospace`;
        for (let i = 0; i < drops.length; i++) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
          drops[i]++;
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else if (kind === "snow") {
      const flakes = Array.from({ length: 120 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 3,
        speed: 0.5 + Math.random() * 1.5,
      }));
      const draw = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = color;
        for (const f of flakes) {
          ctx.beginPath();
          ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fill();
          f.y += f.speed;
          if (f.y > height) f.y = -5;
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else {
      const stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8,
        speed: 0.2 + Math.random() * 0.8,
      }));
      const draw = () => {
        ctx.fillStyle = "rgba(5,5,15,0.35)";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = color;
        for (const s of stars) {
          ctx.globalAlpha = 0.6 + Math.random() * 0.4;
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
          ctx.fill();
          s.x -= s.speed;
          if (s.x < 0) s.x = width;
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(draw);
      };
      draw();
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [kind, color]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}