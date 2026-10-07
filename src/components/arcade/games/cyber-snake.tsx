import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("cyber-snake")!;
const CELL = 16, COLS = 20, ROWS = 20;

export default function CyberSnake() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-snake-best", 0);
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const state = useRef({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 5, y: 5 } as { x: number; y: number },
    power: null as null | "shield" | "ghost" | "shrink",
    powerTimer: 0,
    tick: 0,
  });

  const onKey = useCallback((e: KeyboardEvent) => {
    const d = state.current.dir;
    if (e.key === "ArrowUp" && d.y === 0) state.current.nextDir = { x: 0, y: -1 };
    if (e.key === "ArrowDown" && d.y === 0) state.current.nextDir = { x: 0, y: 1 };
    if (e.key === "ArrowLeft" && d.x === 0) state.current.nextDir = { x: -1, y: 0 };
    if (e.key === "ArrowRight" && d.x === 0) state.current.nextDir = { x: 1, y: 0 };
    if (e.key === " ") setPaused((p) => !p);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  const reset = useCallback(() => {
    state.current = { snake: [{ x: 10, y: 10 }], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: { x: 5, y: 5 }, power: null, powerTimer: 0, tick: 0 };
    setScore(0);
    setOver(false);
    setPaused(false);
  }, []);

  useGameLoop((dt) => {
    if (over || paused) return;
    state.current.tick += dt;
    if (state.current.tick < 100) return;
    state.current.tick = 0;

    const s = state.current;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (s.power !== "shield" && s.power !== "ghost") {
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { setOver(true); if (score > best) setBest(score); return; }
      if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) { setOver(true); if (score > best) setBest(score); return; }
    }
    if (s.power === "ghost") { head.x = (head.x + COLS) % COLS; head.y = (head.y + ROWS) % ROWS; }
    if (s.power === "shield" && (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)) { s.power = null; }

    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      setScore((sc) => sc + 10);
      s.food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      const powers = ["shield", "ghost", "shrink"] as const;
      s.power = powers[Math.floor(Math.random() * powers.length)];
      s.powerTimer = 50;
      if (s.power === "shrink" && s.snake.length > 3) s.snake.pop();
    } else {
      s.snake.pop();
    }
    if (s.powerTimer > 0) s.powerTimer--;
    if (s.powerTimer === 0) s.power = null;
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <div className="flex gap-3 text-sm">
          <span className="text-muted">Score: {score}</span>
          {state.current.power && <span style={{ color: G.accent }}>⚡ {state.current.power} ({state.current.powerTimer})</span>}
          {paused && <span className="text-ember">PAUSED</span>}
        </div>
        <div className="relative" style={{ width: COLS * CELL, height: ROWS * CELL }}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const seg = state.current.snake.find((s) => s.x === c && s.y === r);
              const isHead = state.current.snake[0].x === c && state.current.snake[0].y === r;
              const isFood = state.current.food.x === c && state.current.food.y === r;
              return (
                <div key={`${r}-${c}`} className="absolute" style={{ left: c * CELL, top: r * CELL, width: CELL, height: CELL }}>
                  {seg && (
                    <div className={`size-full rounded ${isHead ? "rounded-full" : ""}`} style={{ background: G.accent, opacity: state.current.power === "ghost" ? 0.4 : 1, boxShadow: isHead ? `0 0 8px ${G.accent}` : "none" }} />
                  )}
                  {isFood && <div className="size-full rounded-full" style={{ background: "#ff6a3d", boxShadow: "0 0 8px #ff6a3d" }} />}
                </div>
              );
            }),
          )}
          {over && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-bg/80">
              <div className="text-center">
                <p className="font-display text-2xl text-fg">Game Over</p>
                <p className="text-sm text-muted">Score: {score}</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-muted">Arrow keys · Space to pause</p>
      </div>
    </GameShell>
  );
}
