// lib/secretCodes.ts
// Central registry of all 50 Lokayantra secret codes.
// Each entry drives BOTH the popup text and which generic visual
// effect + mini-game (if any) it triggers — see components/SecretEffectsOverlay.tsx
// and components/MiniGames.tsx for the renderers.

export type EffectKind =
  | "glow"        // golden/colored screen glow
  | "rain"        // falling emoji (banana, pizza, snow, coins...)
  | "confetti"    // confetti burst
  | "matrix"      // green matrix code rain (canvas)
  | "snow"        // gentle snowfall + frost edges
  | "stars"       // moving starfield / nebula (canvas)
  | "shake"       // screen shake
  | "flash"       // quick full-screen flash
  | "aura"        // pulsing colored aura around viewport edge
  | "silhouette"  // large emoji/figure crossing the screen
  | "portal"      // swirling portal ring
  | "disco"       // color-cycling disco lights
  | "glitch"      // RGB-split glitch flicker
  | "eclipse"     // screen darkens like an eclipse
  | "founder";    // cinematic founder easter egg (code #50)

export interface SecretCode {
  code: string;
  category: "Visual" | "Gamer" | "Hidden" | "Funny" | "Legendary";
  title: string;
  popup: string;
  effect: EffectKind;
  color?: string;       // hex color used by glow/aura/flash/particles
  emoji?: string;        // used by rain/silhouette effects
  durationMs?: number;   // effect duration, default 3200ms (godmode/founder override)
  unlocksGame?: string;  // mini-game id (see components/MiniGames.tsx), if any
  premium?: boolean;     // true = handled by components/PremiumEffects.tsx (multi-phase, bespoke)
}

export const SECRET_CODES: SecretCode[] = [
  // ── CATEGORY 1 – Visual Effects ──
  { code: "godmode", category: "Visual", title: "God Mode", popup: "⚡ GOD MODE ACTIVATED ⚡", effect: "glow", color: "#ffd700", durationMs: 15000, premium: true },
  { code: "matrix", category: "Visual", title: "Matrix", popup: "Wake up, LokaYantra...", effect: "matrix", color: "#00ff41", unlocksGame: "snake" },
  { code: "rainbow", category: "Visual", title: "Rainbow", popup: "Colors Unleashed! 🌈", effect: "confetti" },
  { code: "galaxy", category: "Visual", title: "Galaxy", popup: "GALAXY MODE ACTIVATED", effect: "stars", color: "#7c9bff", durationMs: 16500, premium: true },
  { code: "retro", category: "Visual", title: "Retro", popup: "◄ INSERT COIN ►", effect: "glitch", color: "#ff2e63", unlocksGame: "dino" },
  { code: "neon", category: "Visual", title: "Neon", popup: "Neon City Online", effect: "aura", color: "#00f0ff" },
  { code: "fire", category: "Visual", title: "Fire", popup: "It's getting hot! 🔥", effect: "rain", emoji: "🔥", color: "#ff5500" },
  { code: "ice", category: "Visual", title: "Ice", popup: "Chilly... ❄️", effect: "rain", emoji: "❄️", color: "#8fd9ff" },
  { code: "ghost", category: "Visual", title: "Ghost", popup: "Boo! 👻", effect: "aura", color: "#c9c9ff", unlocksGame: "flappy" },
  { code: "disco", category: "Visual", title: "Disco", popup: "Disco Fever! 🕺", effect: "disco" },

  // ── CATEGORY 2 – Gamer Effects ──
  { code: "levelup", category: "Gamer", title: "Level Up", popup: "LEVEL UP!", effect: "glow", color: "#4ade80", durationMs: 12000, premium: true },
  { code: "combo", category: "Gamer", title: "Combo", popup: "COMBO STARTED", effect: "flash", color: "#fb923c", durationMs: 15000, premium: true },
  { code: "winner", category: "Gamer", title: "Winner", popup: "YOU WIN!", effect: "confetti", color: "#facc15", durationMs: 10000, premium: true },
  { code: "speedrun", category: "Gamer", title: "Speedrun", popup: "SPEEDRUN MODE", effect: "flash", color: "#facc15", durationMs: 20000, premium: true, unlocksGame: "aimtrainer" },
  { code: "checkpoint", category: "Gamer", title: "Checkpoint", popup: "CHECKPOINT SAVED", effect: "glow", color: "#38bdf8", durationMs: 6000, premium: true },
  { code: "bossfight", category: "Gamer", title: "Boss Fight", popup: "BOSS APPROACHING", effect: "silhouette", emoji: "👹", color: "#ef4444", durationMs: 15000, premium: true },
  { code: "respawn", category: "Gamer", title: "Respawn", popup: "RESPAWNED", effect: "flash", color: "#4ade80", durationMs: 7000, premium: true },
  { code: "ultimate", category: "Gamer", title: "Ultimate", popup: "ULTIMATE UNLEASHED", effect: "aura", color: "#facc15", durationMs: 14500, premium: true, unlocksGame: "runner" },
  { code: "legend", category: "Gamer", title: "Legend", popup: "LEGEND", effect: "glow", color: "#fbbf24", durationMs: 10500, premium: true },
  { code: "champion", category: "Gamer", title: "Champion", popup: "CHAMPION", effect: "confetti", color: "#facc15", durationMs: 10500, premium: true },

  // ── CATEGORY 3 – Hidden Features ──
  { code: "portal", category: "Hidden", title: "Portal", popup: "A portal opens...", effect: "portal", color: "#a855f7", unlocksGame: "maze" },
  { code: "unlock", category: "Hidden", title: "Unlock", popup: "Hidden room unlocked!", effect: "glow", color: "#38bdf8" },
  { code: "vault", category: "Hidden", title: "Vault", popup: "The vault creaks open...", effect: "glow", color: "#eab308", unlocksGame: "memory" },
  { code: "treasure", category: "Hidden", title: "Treasure", popup: "💰 Treasure found!", effect: "rain", emoji: "🪙", color: "#facc15" },
  { code: "mystery", category: "Hidden", title: "Mystery", popup: "A mystery unfolds...", effect: "glitch", color: "#c084fc" },
  { code: "hidden", category: "Hidden", title: "Hidden Badge", popup: "Hidden badge found!", effect: "glow", color: "#94a3b8" },
  { code: "developer", category: "Hidden", title: "Developer Room", popup: "Welcome, developer. 🛠️", effect: "aura", color: "#22c55e" },
  { code: "secret", category: "Hidden", title: "Secret Progress", popup: "Secret collection progress shown.", effect: "flash", color: "#f472b6" },
  { code: "masterkey", category: "Hidden", title: "Master Key", popup: "🔑 Master Key used!", effect: "glow", color: "#fde047" },
  { code: "404secret", category: "Hidden", title: "404 Secret", popup: "This page doesn't exist... or does it? 🤔", effect: "glitch", color: "#f87171" },

  // ── CATEGORY 4 – Funny Codes ──
  { code: "banana", category: "Funny", title: "Banana", popup: "🍌 Banana rain!", effect: "rain", emoji: "🍌" },
  { code: "pizza", category: "Funny", title: "Pizza", popup: "🍕 Pizza time!", effect: "rain", emoji: "🍕" },
  { code: "coffee", category: "Funny", title: "Coffee", popup: "☕ Ahh, coffee.", effect: "rain", emoji: "☕" },
  { code: "cat", category: "Funny", title: "Cat", popup: "🐱 A cat runs by!", effect: "silhouette", emoji: "🐱", color: "#fb923c" },
  { code: "dog", category: "Funny", title: "Dog", popup: "🐶 Woof woof!", effect: "silhouette", emoji: "🐶", color: "#a16207" },
  { code: "dance", category: "Funny", title: "Dance", popup: "💃 Dance party!", effect: "disco" },
  { code: "rocket", category: "Funny", title: "Rocket", popup: "🚀 Launching!", effect: "silhouette", emoji: "🚀", color: "#f97316", unlocksGame: "spaceshooter" },
  { code: "boom", category: "Funny", title: "Boom", popup: "💥 BOOM!", effect: "flash", color: "#ef4444", unlocksGame: "brick" },
  { code: "ninja", category: "Funny", title: "Ninja", popup: "🥷 Poof! A ninja appears.", effect: "silhouette", emoji: "🥷", color: "#334155" },
  { code: "ghostparty", category: "Funny", title: "Ghost Party", popup: "👻 Ghost dance party!", effect: "rain", emoji: "👻" },

  // ── CATEGORY 5 – Legendary Codes ──
  { code: "infinity", category: "Legendary", title: "Infinity", popup: "♾️ Infinity...", effect: "portal", color: "#38bdf8" },
  { code: "dragon", category: "Legendary", title: "Dragon", popup: "🐉 A dragon flies across the sky!", effect: "silhouette", emoji: "🐉", color: "#dc2626" },
  { code: "phoenix", category: "Legendary", title: "Phoenix", popup: "🔥 Rebirth from the ashes.", effect: "silhouette", emoji: "🐦‍🔥", color: "#f97316" },
  { code: "titan", category: "Legendary", title: "Titan", popup: "The ground shakes...", effect: "shake", color: "#57534e" },
  { code: "eclipse", category: "Legendary", title: "Eclipse", popup: "🌑 The sun goes dark.", effect: "eclipse", color: "#0f172a" },
  { code: "cosmos", category: "Legendary", title: "Cosmos", popup: "🌌 The galaxy expands.", effect: "stars", color: "#818cf8" },
  { code: "quantum", category: "Legendary", title: "Quantum", popup: "Reality glitches...", effect: "glitch", color: "#22d3ee" },
  { code: "omega", category: "Legendary", title: "Omega", popup: "⚡ Golden lightning!", effect: "flash", color: "#facc15" },
  { code: "immortal", category: "Legendary", title: "Immortal", popup: "You cannot be stopped.", effect: "aura", color: "#e2e8f0" },
  {
    code: "lokayantra",
    category: "Legendary",
    title: "Founder's Secret",
    popup: "👑 Welcome to the Heart of Lokayantra.",
    effect: "founder",
    color: "#ffd700",
    durationMs: 6500,
    unlocksGame: "pixeladventure",
  },
];

export const SECRET_CODE_MAP: Record<string, SecretCode> = Object.fromEntries(
  SECRET_CODES.map((c) => [c.code.toLowerCase(), c])
);

export const TOTAL_SECRETS = SECRET_CODES.length; // 50

export interface Milestone {
  count: number;
  title: string;
}

export const MILESTONES: Milestone[] = [
  { count: 5, title: "Bronze Explorer" },
  { count: 10, title: "Silver Explorer" },
  { count: 20, title: "Gold Explorer" },
  { count: 35, title: "Master Explorer" },
  { count: 50, title: "Legend of Lokayantra" },
];

export function getMilestoneForCount(count: number): Milestone | null {
  let best: Milestone | null = null;
  for (const m of MILESTONES) {
    if (count >= m.count) best = m;
  }
  return best;
}