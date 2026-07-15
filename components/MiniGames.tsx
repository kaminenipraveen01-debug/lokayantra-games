// components/MiniGames.tsx
// Modal launcher for the 10 secret-code mini-games.
// Fully playable now: Snake, Memory Match, Aim Trainer.
// The rest render a "Coming Soon" placeholder inside the SAME modal shell —
// drop a new component into GAME_REGISTRY to make one playable, no other
// wiring needed (SecretEffectsOverlay + secretCodes.ts already reference
// these ids: snake, dino, spaceshooter, aimtrainer, memory, flappy, brick,
// maze, runner, pixeladventure).
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { ComponentType } from "react";
import { motion } from "framer-motion";

interface GameProps {
  onClose: () => void;
}

// ────────────────────────────────────────────────────────────────
// MODAL SHELL
// ────────────────────────────────────────────────────────────────
const GAME_TITLES: Record<string, string> = {
  snake: "Snake",
  dino: "Dino Run",
  spaceshooter: "Space Shooter",
  aimtrainer: "Aim Trainer",
  memory: "Memory Match",
  flappy: "Flappy Clone",
  brick: "Brick Breaker",
  maze: "Maze Escape",
  runner: "Endless Runner",
  pixeladventure: "Pixel Adventure",
};

export default function MiniGameModal({ gameId, onClose }: { gameId: string; onClose: () => void }) {
  const title = GAME_TITLES[gameId] ?? "Mini Game";
  const GameComponent = GAME_REGISTRY[gameId];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-[28px] bg-[#111319] border border-white/10 shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <p className="text-sm font-black uppercase tracking-widest text-white">{title}</p>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close game"
          >
            ✕
          </button>
        </div>
        <div className="p-4">
          {GameComponent ? <GameComponent onClose={onClose} /> : <ComingSoon />}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ComingSoon() {
  return (
    <div className="py-14 text-center">
      <p className="text-3xl mb-2">🛠️</p>
      <p className="text-xs font-black uppercase tracking-widest text-white/50">
        This mini-game is still being built.
      </p>
      <p className="text-[10px] text-white/30 mt-1">Check back soon — you already unlocked it!</p>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 1. SNAKE
// ────────────────────────────────────────────────────────────────
function SnakeGame({ onClose }: GameProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cell = 16;
    const cols = canvas.width / cell;
    const rows = canvas.height / cell;

    let snake = [{ x: 8, y: 8 }];
    let dir = { x: 1, y: 0 };
    let nextDir = { x: 1, y: 0 };
    let food = { x: 4, y: 4 };
    let alive = true;
    let localScore = 0;

    const placeFood = () => {
      food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    };

    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
        w: { x: 0, y: -1 },
        s: { x: 0, y: 1 },
        a: { x: -1, y: 0 },
        d: { x: 1, y: 0 },
      };
      const next = map[e.key];
      if (next && !(next.x === -dir.x && next.y === -dir.y)) nextDir = next;
    };
    window.addEventListener("keydown", onKey);

    const interval = setInterval(() => {
      if (!alive) return;
      dir = nextDir;
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      if (
        head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows ||
        snake.some((s) => s.x === head.x && s.y === head.y)
      ) {
        alive = false;
        setGameOver(true);
        clearInterval(interval);
        return;
      }

      snake = [head, ...snake];
      if (head.x === food.x && head.y === food.y) {
        localScore += 10;
        setScore(localScore);
        placeFood();
      } else {
        snake.pop();
      }

      ctx.fillStyle = "#0c0e17";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#facc15";
      ctx.fillRect(food.x * cell, food.y * cell, cell - 1, cell - 1);
      ctx.fillStyle = "#4ade80";
      snake.forEach((s) => ctx.fillRect(s.x * cell, s.y * cell, cell - 1, cell - 1));
    }, 110);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
        Arrow keys / WASD · Score: {score}
      </p>
      <canvas ref={canvasRef} width={320} height={320} className="rounded-xl border border-white/10" />
      {gameOver && (
        <div className="text-center">
          <p className="text-white text-sm font-black">Game Over — Score {score}</p>
          <button onClick={onClose} className="mt-2 text-[10px] font-black uppercase tracking-widest text-white/50 underline">
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 2. MEMORY MATCH
// ────────────────────────────────────────────────────────────────
const MEMORY_EMOJIS = ["🐉", "🔥", "👻", "🍕", "🚀", "🏆", "❄️", "🥷"];

function MemoryMatchGame({ onClose }: GameProps) {
  const [cards, setCards] = useState<{ emoji: string; id: number }[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    const deck = [...MEMORY_EMOJIS, ...MEMORY_EMOJIS]
      .map((emoji, i) => ({ emoji, id: i }))
      .sort(() => Math.random() - 0.5);
    setCards(deck);
  }, []);

  const handleFlip = useCallback(
    (id: number) => {
      if (flipped.length === 2 || flipped.includes(id) || matched.includes(id)) return;
      const next = [...flipped, id];
      setFlipped(next);
      if (next.length === 2) {
        setMoves((m) => m + 1);
        const [a, b] = next;
        if (cards[a].emoji === cards[b].emoji) {
          setMatched((m) => [...m, a, b]);
          setFlipped([]);
        } else {
          setTimeout(() => setFlipped([]), 700);
        }
      }
    },
    [flipped, matched, cards]
  );

  const won = cards.length > 0 && matched.length === cards.length;

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Moves: {moves}</p>
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c) => {
          const isFlipped = flipped.includes(c.id) || matched.includes(c.id);
          return (
            <button
              key={c.id}
              onClick={() => handleFlip(c.id)}
              className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl border border-white/10"
              style={{ background: isFlipped ? "#1f232d" : "#2a2f3d" }}
            >
              {isFlipped ? c.emoji : ""}
            </button>
          );
        })}
      </div>
      {won && (
        <div className="text-center">
          <p className="text-white text-sm font-black">🎉 Solved in {moves} moves!</p>
          <button onClick={onClose} className="mt-2 text-[10px] font-black uppercase tracking-widest text-white/50 underline">
            Close
          </button>
        </div>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 3. AIM TRAINER
// ────────────────────────────────────────────────────────────────
function AimTrainerGame({ onClose }: GameProps) {
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [running, setRunning] = useState(true);
  const areaRef = useRef<HTMLDivElement | null>(null);

  const moveTarget = useCallback(() => {
    setTarget({ x: 8 + Math.random() * 84, y: 8 + Math.random() * 84 });
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          setRunning(false);
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const handleHit = () => {
    if (!running) return;
    setScore((s) => s + 1);
    moveTarget();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
        Score: {score} · Time: {timeLeft}s
      </p>
      <div ref={areaRef} className="relative w-[300px] h-[300px] rounded-xl border border-white/10 bg-[#0c0e17] overflow-hidden">
        {running && (
          <button
            onClick={handleHit}
            className="absolute w-9 h-9 rounded-full bg-[#ff003c] shadow-[0_0_16px_#ff003c]"
            style={{ left: `${target.x}%`, top: `${target.y}%`, transform: "translate(-50%,-50%)" }}
            aria-label="target"
          />
        )}
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <p className="text-white text-sm font-black">Final Score: {score}</p>
            <button
              onClick={onClose}
              className="text-[10px] font-black uppercase tracking-widest text-white/50 underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// REGISTRY — add new games here as they're built
// ────────────────────────────────────────────────────────────────
const GAME_REGISTRY: Record<string, ComponentType<GameProps>> = {
  snake: SnakeGame,
  memory: MemoryMatchGame,
  aimtrainer: AimTrainerGame,
  // dino, spaceshooter, flappy, brick, maze, runner, pixeladventure →
  // fall through to <ComingSoon /> until implemented.
};