// components/PremiumEffects.tsx
// Multi-phase "premium" secret-code effects — galaxy, godmode, and the
// 10 gamer codes (levelup → champion). Each runs its own timeline:
//   POPUP (glass card, ~1.2-2s) → AMBIENT (main effect, full duration)
//   → END (fade / closing message)
// The "ARM" phase (search-bar glow + tiny spinner, 0-0.5s) happens
// earlier, inside components/Header.tsx, before triggerCode() is even
// called — see handleSearchSubmit() there.
//
// Games/buttons/navbar underneath are NEVER covered: the outer wrapper
// is `pointer-events-none`, and ambient ("body glow") styling reaches
// the navbar pill + `.btn-primary` buttons via a body class + CSS
// variable — see the `.secret-ambient-active` rules appended to
// globals.css (see README_INTEGRATION.md).
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ComponentType, CSSProperties } from "react";
import { SecretCode } from "@/lib/secretCodes";
import { ParticleField, CanvasEffect, AuraEffect } from "./SecretEffectsOverlay";

export interface PremiumEffectProps {
  entry: SecretCode;
  isNew: boolean;
  onEnd: () => void;
  onPlayGame: () => void;
}

// ────────────────────────────────────────────────────────────────
// SHARED ENGINE
// ────────────────────────────────────────────────────────────────

/** Runs through `steps` (ms per phase) in sequence, then calls onEnd. */
function usePhases(steps: number[], onEnd: () => void): number {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    let cumulative = 0;
    const timers = steps.map((ms, i) => {
      cumulative += ms;
      return setTimeout(() => setPhase(i + 1), cumulative);
    });
    const endTimer = setTimeout(onEnd, cumulative);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(endTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return phase;
}

/** Toggles a body class + CSS var so the navbar pill / .btn-primary
 *  buttons pick up a matching glow while an ambient effect is active. */
function useAmbientGlow(color: string | undefined, active: boolean) {
  useEffect(() => {
    if (!active || !color) return;
    document.documentElement.style.setProperty("--secret-glow-color", color);
    document.body.classList.add("secret-ambient-active");
    return () => {
      document.body.classList.remove("secret-ambient-active");
    };
  }, [active, color]);
}

/** Center glass popup card — used by every premium code's POPUP phase. */
function GlassPopup({ icon, title, color, sub }: { icon?: string; title: string; color: string; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute top-[16%] left-1/2 -translate-x-1/2 text-center px-8 py-6 rounded-3xl border"
      style={{
        background: "rgba(10,10,18,0.55)",
        backdropFilter: "blur(14px)",
        borderColor: `${color}55`,
        boxShadow: `0 0 40px ${color}44, inset 0 1px 0 rgba(255,255,255,0.06)`,
      }}
    >
      {icon && <div className="text-4xl mb-1">{icon}</div>}
      <p
        className="text-xl sm:text-3xl font-black tracking-wide"
        style={{ color, textShadow: `0 0 18px ${color}aa` }}
      >
        {title}
      </p>
      {sub && <p className="mt-1 text-[11px] font-bold text-white/60 uppercase tracking-widest">{sub}</p>}
    </motion.div>
  );
}

/** Canvas cursor-trail: spawns fading glyph/dot particles at the mouse
 *  position. Fully pointer-events-none, purely decorative. */
function CursorTrail({ color, glyph }: { color: string; glyph?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    type P = { x: number; y: number; life: number; vx: number; vy: number };
    let particles: P[] = [];
    const onMove = (e: MouseEvent) => {
      particles.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -0.4 - Math.random() * 0.6,
      });
      if (particles.length > 60) particles = particles.slice(-60);
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
      });
      particles = particles.filter((p) => p.life > 0);
      for (const p of particles) {
        ctx.globalAlpha = Math.max(p.life, 0);
        if (glyph) {
          ctx.font = "14px sans-serif";
          ctx.fillText(glyph, p.x, p.y);
        } else {
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 2.4 * p.life + 0.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
    };
  }, [color, glyph]);

  return <canvas ref={ref} className="absolute inset-0 w-full h-full" />;
}

/** Slow-drifting emoji cloud (embers, diamonds, bubbles...) */
function FloatingEmoji({ emoji, count = 14 }: { emoji: string; count?: number }) {
  const items = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 5,
        size: 14 + Math.random() * 16,
      })),
    [count]
  );
  return (
    <div className="absolute inset-0">
      {items.map((it, i) => (
        <motion.span
          key={i}
          className="absolute"
          style={{ left: `${it.left}vw`, fontSize: it.size, bottom: -30 }}
          animate={{ y: ["0vh", "-110vh"], opacity: [0, 1, 1, 0], x: [0, 20, -10, 0] }}
          transition={{ duration: it.duration, delay: it.delay, repeat: Infinity, ease: "linear" }}
        >
          {emoji}
        </motion.span>
      ))}
    </div>
  );
}

/** Four pulsing radial-gradient blobs at the viewport corners — used
 *  for "energy waves" (godmode) and glowing borders (legend). */
function CornerPulses({ color }: { color: string }) {
  const corners = [
    { top: -60, left: -60 },
    { top: -60, right: -60 },
    { bottom: -60, left: -60 },
    { bottom: -60, right: -60 },
  ];
  return (
    <>
      {corners.map((pos, i) => (
        <motion.div
          key={i}
          className="absolute w-[240px] h-[240px] rounded-full"
          style={{ ...pos, background: `radial-gradient(circle, ${color}55, transparent 70%)` }}
          animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </>
  );
}

/** Thin flickering "lightning" streaks along the screen edges. */
function EdgeLightning({ color }: { color: string }) {
  const bolts = useMemo(
    () =>
      Array.from({ length: 4 }, () => ({
        side: Math.floor(Math.random() * 4),
        delay: Math.random() * 3,
      })),
    []
  );
  return (
    <>
      {bolts.map((b, i) => {
        const base: CSSProperties =
          b.side === 0
            ? { top: 0, left: `${10 + i * 20}%`, width: 2, height: "22%" }
            : b.side === 1
            ? { bottom: 0, left: `${15 + i * 18}%`, width: 2, height: "18%" }
            : b.side === 2
            ? { left: 0, top: `${10 + i * 20}%`, height: 2, width: "18%" }
            : { right: 0, top: `${12 + i * 18}%`, height: 2, width: "18%" };
        return (
          <motion.div
            key={i}
            className="absolute"
            style={{ ...base, background: color, boxShadow: `0 0 12px 2px ${color}` }}
            animate={{ opacity: [0, 1, 0, 0.7, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 + Math.random() * 2, delay: b.delay }}
          />
        );
      })}
    </>
  );
}

// ────────────────────────────────────────────────────────────────
// 1. GALAXY — the fully-specced reference design
// ────────────────────────────────────────────────────────────────
function GalaxyEffect({ entry, onEnd }: PremiumEffectProps) {
  // Step2 popup ~2s, Step3 ambient ~13s, Step4 end message ~1.5s
  const phase = usePhases([2000, 13000, 1500], onEnd);
  useAmbientGlow(entry.color, phase === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {(phase === 0 || phase === 1) && <CanvasEffect kind="galaxy" color="#e6ecff" />}
      {phase === 1 && (
        <motion.div animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0" style={{ boxShadow: `inset 0 0 160px 30px ${entry.color}44` }} />
      )}

      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" icon="🌌" title="GALAXY MODE ACTIVATED" color={entry.color ?? "#7c9bff"} />}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 2 && (
          <motion.div
            key="end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-[20%] left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-lg font-black text-white/90">Galaxy Mode Ended</p>
            <p className="text-xs font-bold text-white/50 mt-1">Everything normal.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 2. GODMODE
// ────────────────────────────────────────────────────────────────
function GodmodeEffect({ entry, isNew, onPlayGame, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#ffd700";
  // popup 2s (screen dims 10%), ambient 12s, fade 1s
  const phase = usePhases([2000, 12000, 1000], onEnd);
  useAmbientGlow(color, phase === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {phase === 0 && <div className="absolute inset-0 bg-black/10" />}
      {phase === 1 && (
        <>
          <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 200px 50px ${color}55`, background: `${color}0a` }} />
          <CornerPulses color={color} />
          <EdgeLightning color={color} />
          <CursorTrail color={color} />
        </>
      )}
      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" icon="⚡" title="GOD MODE ACTIVATED ⚡" color={color} />}
      </AnimatePresence>
      {phase === 1 && isNew && entry.unlocksGame && (
        <button onClick={onPlayGame} className="pointer-events-auto absolute bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white text-black text-xs font-black uppercase tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-transform">
          🎮 Play Unlocked Game
        </button>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 3. LEVEL UP — XP bar + rising particles
// ────────────────────────────────────────────────────────────────
function LevelUpEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#4ade80";
  const phase = usePhases([2000, 9200, 800], onEnd);
  useAmbientGlow(color, phase === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" icon="⬆️" title="LEVEL UP!" sub="Level 2" color={color} />}
      </AnimatePresence>

      {(phase === 1 || phase === 2) && (
        <>
          <ParticleField mode="emoji" emoji="✨" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} className="absolute top-6 left-1/2 -translate-x-1/2 text-xl">
            ⭐
          </motion.div>
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 h-3 rounded-full bg-white/10 overflow-hidden border border-white/10">
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}, #a3e635)` }}
              initial={{ width: "0%" }}
              animate={{ width: phase === 2 ? "100%" : "100%" }}
              transition={{ duration: 9, ease: "easeOut" }}
            />
          </div>
        </>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 4. COMBO — click-driven counter (doesn't block underlying clicks)
// ────────────────────────────────────────────────────────────────
function ComboEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#fb923c";
  const phase = usePhases([1500, 12800, 700], onEnd);
  useAmbientGlow(color, phase === 1);
  const [combo, setCombo] = useState(1);

  useEffect(() => {
    if (phase !== 1) return;
    // Capture-phase listener: counts clicks WITHOUT blocking the
    // underlying game/button click (no preventDefault/stopPropagation).
    const onClick = () => setCombo((c) => c + 1);
    window.addEventListener("click", onClick, true);
    return () => window.removeEventListener("click", onClick, true);
  }, [phase]);

  const scale = 1 + Math.min(combo, 20) * 0.02;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" icon="🔥" title="COMBO STARTED" color={color} />}
      </AnimatePresence>
      {phase === 1 && (
        <motion.div
          animate={{ scale }}
          className="absolute top-24 right-6 px-4 py-2 rounded-2xl text-right"
          style={{ background: "rgba(10,10,18,0.55)", boxShadow: `0 0 24px ${color}66`, border: `1px solid ${color}55` }}
        >
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/50">Combo</p>
          <p className="text-2xl font-black" style={{ color, textShadow: `0 0 12px ${color}aa` }}>
            x{combo}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 5. WINNER — confetti, trophy, fireworks
// ────────────────────────────────────────────────────────────────
function WinnerEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#facc15";
  const phase = usePhases([1500, 8000, 700], onEnd);
  useAmbientGlow(color, phase === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {phase === 0 && <motion.div initial={{ opacity: 0.8 }} animate={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 bg-white" />}
      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" icon="🏆" title="YOU WIN!" color={color} />}
      </AnimatePresence>
      {(phase === 1 || phase === 2) && (
        <>
          <ParticleField mode="confetti" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} className="absolute top-10 left-1/2 -translate-x-1/2 text-4xl">
            🏆
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 6. SPEEDRUN — top-left running timer
// ────────────────────────────────────────────────────────────────
function SpeedrunEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#facc15";
  const phase = usePhases([1200, 18000, 800], onEnd);
  useAmbientGlow(color, phase === 1);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (phase !== 1) return;
    const start = Date.now();
    const id = setInterval(() => setElapsedMs(Date.now() - start), 100);
    return () => clearInterval(id);
  }, [phase]);

  const secs = Math.floor(elapsedMs / 1000);
  const cs = Math.floor((elapsedMs % 1000) / 10);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" icon="⏱" title="SPEEDRUN MODE" color={color} />}
      </AnimatePresence>
      {(phase === 1 || phase === 2) && (
        <>
          <CursorTrail color={color} />
          <div
            className="absolute top-24 left-6 px-4 py-2 rounded-2xl font-mono text-2xl font-black"
            style={{ color, background: "rgba(10,10,18,0.5)", border: `1px solid ${color}55`, boxShadow: `0 0 20px ${color}55` }}
          >
            {String(Math.floor(secs / 60)).padStart(2, "0")}:{String(secs % 60).padStart(2, "0")}.{String(cs).padStart(2, "0")}
          </div>
        </>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 7. CHECKPOINT — brief blue flag save
// ────────────────────────────────────────────────────────────────
function CheckpointEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#38bdf8";
  const phase = usePhases([1800, 3400, 800], onEnd);
  useAmbientGlow(color, phase === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <AnimatePresence>
        {phase === 0 && (
          <GlassPopup key="popup" icon="💾" title="CHECKPOINT SAVED" color={color} />
        )}
      </AnimatePresence>
      {phase === 1 && (
        <>
          <div className="absolute inset-0" style={{ boxShadow: `inset 0 0 100px 20px ${color}33` }} />
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl"
          >
            🚩
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 8. BOSSFIGHT — cinematic warning + silhouette + screen shake
// ────────────────────────────────────────────────────────────────
function BossfightEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#ef4444";
  // dark+bass 2s, warning 3s, main 8.5s, smoke-out 1.5s
  const phase = usePhases([2000, 3000, 8500, 1500], onEnd);
  useAmbientGlow(color, phase === 1 || phase === 2);

  // Periodic screen shake bursts during the main phase
  useEffect(() => {
    if (phase !== 2) return;
    let n = 0;
    const burst = () => {
      let k = 0;
      const id = setInterval(() => {
        k++;
        document.body.style.transform = `translate(${(Math.random() - 0.5) * 6}px, ${(Math.random() - 0.5) * 6}px)`;
        if (k > 6) {
          clearInterval(id);
          document.body.style.transform = "";
        }
      }, 40);
    };
    const id = setInterval(burst, 3000);
    return () => {
      clearInterval(id);
      document.body.style.transform = "";
    };
  }, [phase]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 0 ? 0.85 : phase >= 3 ? 0 : 0.55 }}
        transition={{ duration: 1.2 }}
        className="absolute inset-0 bg-black"
      />

      {(phase === 1 || phase === 2) && (
        <>
          {/* Boss silhouette — kept in the upper 40% so the game grid below stays clear */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: -40 }}
            animate={{ scale: 1, opacity: 0.55, y: [0, -6, 0] }}
            transition={{ duration: 1.2, y: { duration: 3, repeat: Infinity } }}
            className="absolute top-[6%] left-1/2 -translate-x-1/2 text-[140px] sm:text-[200px]"
            style={{ filter: `drop-shadow(0 0 40px ${color})` }}
          >
            {entry.emoji ?? "👹"}
          </motion.div>
          {/* Glowing eyes */}
          <motion.div animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 1, repeat: Infinity }} className="absolute top-[16%] left-1/2 -translate-x-1/2 flex gap-8">
            <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 16px 4px ${color}` }} />
            <div className="w-3 h-3 rounded-full" style={{ background: color, boxShadow: `0 0 16px 4px ${color}` }} />
          </motion.div>
          <FloatingEmoji emoji="💨" count={10} />
        </>
      )}

      <AnimatePresence>
        {phase === 1 && (
          <motion.div key="warn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute top-[40%] left-1/2 -translate-x-1/2 text-center">
            <p className="text-2xl font-black text-red-400 animate-pulse">⚔ WARNING</p>
            <p className="text-lg font-black text-white/90 mt-1">BOSS APPROACHING</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 9. RESPAWN — flash + health bar fill
// ────────────────────────────────────────────────────────────────
function RespawnEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#4ade80";
  const phase = usePhases([1200, 5000, 800], onEnd);
  useAmbientGlow(color, phase === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {phase === 0 && <motion.div initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }} className="absolute inset-0 bg-white" />}
      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" icon="❤️" title="RESPAWNED" color={color} />}
      </AnimatePresence>
      {phase === 1 && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-56 h-4 rounded-full bg-white/10 overflow-hidden border border-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${color}, #22c55e)` }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.2, ease: "easeOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 10. ULTIMATE — golden/purple aura + floating diamonds
// ────────────────────────────────────────────────────────────────
function UltimateEffect({ entry, isNew, onPlayGame, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#facc15";
  const phase = usePhases([1000, 12800, 700], onEnd);
  useAmbientGlow(color, phase === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {phase === 0 && <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.5 }} className="absolute inset-0" style={{ background: `${color}33` }} />}
      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" title="ULTIMATE UNLEASHED" color={color} />}
      </AnimatePresence>
      {phase === 1 && (
        <>
          <AuraEffect color={color} />
          <FloatingEmoji emoji="♦️" count={16} />
          <CursorTrail color={color} />
        </>
      )}
      {phase === 1 && isNew && entry.unlocksGame && (
        <button onClick={onPlayGame} className="pointer-events-auto absolute bottom-10 left-1/2 -translate-x-1/2 px-5 py-2 rounded-full bg-white text-black text-xs font-black uppercase tracking-wide shadow-lg hover:scale-105 active:scale-95 transition-transform">
          🎮 Play Unlocked Game
        </button>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 11. LEGEND — falling crown + gold border + fireworks
// ────────────────────────────────────────────────────────────────
function LegendEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#fbbf24";
  const phase = usePhases([1800, 8000, 700], onEnd);
  useAmbientGlow(color, phase === 1);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      {phase === 0 && (
        <motion.div initial={{ y: "-30vh", opacity: 0, rotate: -20 }} animate={{ y: "0vh", opacity: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 160, damping: 14 }} className="absolute top-[8%] left-1/2 -translate-x-1/2 text-6xl">
          👑
        </motion.div>
      )}
      <AnimatePresence>
        {phase === 0 && <GlassPopup key="popup" title="LEGEND" color={color} />}
      </AnimatePresence>
      {phase === 1 && (
        <>
          <div className="absolute inset-2 rounded-[32px] border-2" style={{ borderColor: `${color}66`, boxShadow: `0 0 30px ${color}55, inset 0 0 30px ${color}33` }} />
          <ParticleField mode="confetti" />
        </>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// 12. CHAMPION — top banner + spotlight + ribbon
// ────────────────────────────────────────────────────────────────
function ChampionEffect({ entry, onEnd }: PremiumEffectProps) {
  const color = entry.color ?? "#facc15";
  const phase = usePhases([1000, 8500, 800], onEnd);
  useAmbientGlow(color, phase === 1 || phase === 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden">
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-center"
        style={{ background: "rgba(10,10,18,0.6)", border: `1px solid ${color}66`, boxShadow: `0 0 30px ${color}55` }}
      >
        <p className="text-xl font-black" style={{ color }}>🏅 CHAMPION</p>
        {phase >= 1 && <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mt-0.5">Champion of Lokayantra</p>}
      </motion.div>

      {phase === 1 && (
        <>
          <div
            className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[140vw] h-[140vw]"
            style={{
              background: `conic-gradient(from 90deg, transparent 0deg, ${color}22 20deg, transparent 40deg)`,
              animation: "spin 8s linear infinite",
            }}
          />
          <ParticleField mode="confetti" />
        </>
      )}
    </motion.div>
  );
}

// ────────────────────────────────────────────────────────────────
// REGISTRY
// ────────────────────────────────────────────────────────────────
export const PREMIUM_EFFECTS: Record<string, ComponentType<PremiumEffectProps>> = {
  galaxy: GalaxyEffect,
  godmode: GodmodeEffect,
  levelup: LevelUpEffect,
  combo: ComboEffect,
  winner: WinnerEffect,
  speedrun: SpeedrunEffect,
  checkpoint: CheckpointEffect,
  bossfight: BossfightEffect,
  respawn: RespawnEffect,
  ultimate: UltimateEffect,
  legend: LegendEffect,
  champion: ChampionEffect,
};