import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("cyber-snake")!;
const CELL = 26, COLS = 16, ROWS = 16;

const PWR_COLOR: Record<string, string> = {
  shield: "#38bdf8",
  ghost: "#c084fc",
  shrink: "#f472b6",
};

export default function CyberSnake() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-snake-best", 0);
  const [over, setOver] = useState(false);
  const [paused, setPaused] = useState(false);
  const [pwr, setPwr] = useState<{ kind: string; t: number } | null>(null);
  const state = useRef({
    snake: [{ x: 8, y: 8 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    food: { x: 4, y: 4 } as { x: number; y: number },
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
    state.current = { snake: [{ x: 8, y: 8 }], dir: { x: 1, y: 0 }, nextDir: { x: 1, y: 0 }, food: { x: 4, y: 4 }, power: null, powerTimer: 0, tick: 0 };
    setScore(0);
    setOver(false);
    setPaused(false);
    setPwr(null);
  }, []);

  useGameLoop((dt) => {
    if (over || paused) return;
    state.current.tick += dt;
    if (state.current.tick < 110) return;
    state.current.tick = 0;

    const s = state.current;
    s.dir = s.nextDir;
    const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };

    if (s.power !== "shield" && s.power !== "ghost") {
      if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) { setOver(true); setBest((b) => Math.max(b, score)); return; }
      if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) { setOver(true); setBest((b) => Math.max(b, score)); return; }
    }
    if (s.power === "ghost") { head.x = (head.x + COLS) % COLS; head.y = (head.y + ROWS) % ROWS; }
    if (s.power === "shield" && (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)) { s.power = null; setPwr(null); }

    s.snake.unshift(head);
    if (head.x === s.food.x && head.y === s.food.y) {
      setScore((sc) => sc + 10);
      s.food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      const powers = ["shield", "ghost", "shrink"] as const;
      s.power = powers[Math.floor(Math.random() * powers.length)];
      s.powerTimer = 50;
      setPwr({ kind: s.power, t: 50 });
      if (s.power === "shrink" && s.snake.length > 3) s.snake.pop();
    } else {
      s.snake.pop();
    }
    if (s.powerTimer > 0) s.powerTimer--;
    if (s.powerTimer === 0 && s.power) { s.power = null; setPwr(null); }
    setPwr((p) => (p ? { ...p, t: s.powerTimer } : null));
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-4 p-4 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="g3d-chip bg-elevated px-3 py-1 font-mono text-xs text-fg">★ {score}</span>
          {pwr && (
            <span className="g3d-chip px-3 py-1 font-mono text-xs text-fg" style={{ background: PWR_COLOR[pwr.kind] + "33", color: PWR_COLOR[pwr.kind] }}>
              ⚡ {pwr.kind} ({pwr.t})
            </span>
          )}
          {paused && <span className="g3d-chip bg-ember/20 px-3 py-1 text-xs text-ember">PAUSED</span>}
        </div>

        <div className="g3d-scene g3d-drop">
          <div className="g3d-board relative" style={{ width: COLS * CELL, height: ROWS * CELL }}>
            {/* checkered floor */}
            {Array.from({ length: ROWS }, (_, r) =>
              Array.from({ length: COLS }, (_, c) => (
                <div
                  key={`f-${r}-${c}`}
                  className="absolute rounded-md"
                  style={{
                    left: c * CELL + 1, top: r * CELL + 1, width: CELL - 2, height: CELL - 2,
                    background: (r + c) % 2 === 0 ? "rgba(99,102,241,0.16)" : "rgba(167,139,250,0.10)",
                    border: "1px solid rgba(167,139,250,0.10)",
                  }}
                />
              )),
            )}
            {/* snake */}
            {state.current.snake.map((seg, i) => {
              const isHead = i === 0;
              const ghost = state.current.power === "ghost";
              return (
                <div
                  key={`s-${i}`}
                  className="g3d-tile absolute"
                  style={{
                    left: seg.x * CELL + 2, top: seg.y * CELL + 2, width: CELL - 4, height: CELL - 4,
                    ["--g3d-top" as string]: G.accent,
                    ["--g3d-side" as string]: "#15803d",
                    opacity: ghost ? 0.45 : 1,
                    transform: isHead ? "translateZ(10px)" : "translateZ(4px)",
                    boxShadow: isHead ? `0 0 18px ${G.accent}, inset 0 1px 0 rgba(255,255,255,.5)` : "inset 0 1px 0 rgba(255,255,255,.3)",
                    transition: "left .1s, top .1s",
                  }}
                >
                  {isHead && (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px]">🐍</div>
                  )}
                </div>
              );
            })}
            {/* food */}
            <div
              className="g3d-tile g3d-float absolute rounded-full"
              style={{
                left: state.current.food.x * CELL + 4, top: state.current.food.y * CELL + 4, width: CELL - 8, height: CELL - 8,
                ["--g3d-top" as string]: "#fbbf24",
                ["--g3d-side" as string]: "#d97706",
                transform: "translateZ(12px)",
                boxShadow: "0 0 20px #fbbf24",
              }}
            />
          </div>
        </div>

        {over && (
          <div className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-elevated/90 px-6 py-4 text-center backdrop-blur">
            <p className="font-display text-2xl g3d-grad-text">Game Over</p>
            <p className="text-sm text-muted">Score: {score} · Best: {best}</p>
          </div>
        )}
        <p className="text-xs text-muted">Arrow keys / swipe · Space to pause</p>
      </div>
    </GameShell>
  );
}
