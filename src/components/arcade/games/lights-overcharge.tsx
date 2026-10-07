import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("lights-overcharge")!;
const SIZE = 5;
const STATES = 3; // 0=off, 1=on, 2=overcharged
const COLORS = ["var(--color-bg)", "#f59e0b", "#ff6a3d"];

export default function LightsOvercharge() {
  const [grid, setGrid] = useState<number[]>(() => {
    const g = Array(SIZE * SIZE).fill(0);
    // Scramble with random clicks
    for (let i = 0; i < 15; i++) {
      const idx = Math.floor(Math.random() * SIZE * SIZE);
      toggleAt(g, idx);
    }
    return g;
  });
  const [moves, setMoves] = useState(0);
  const [over, setOver] = useState(false);
  const [target] = useState(0); // target state = all 0 (off)

  function toggleAt(g: number[], idx: number) {
    const r = Math.floor(idx / SIZE), c = idx % SIZE;
    const cells = [idx, r > 0 ? idx - SIZE : -1, r < SIZE - 1 ? idx + SIZE : -1, c > 0 ? idx - 1 : -1, c < SIZE - 1 ? idx + 1 : -1].filter((i) => i >= 0);
    cells.forEach((i) => { g[i] = (g[i] + 1) % STATES; });
  }

  const click = useCallback(
    (idx: number) => {
      if (over) return;
      setGrid((prev) => {
        const g = [...prev];
        toggleAt(g, idx);
        setMoves((m) => m + 1);
        if (g.every((v) => v === target)) {
          setOver(true);
        }
        return g;
      });
    },
    [over, target],
  );

  const reset = () => {
    const g = Array(SIZE * SIZE).fill(0);
    for (let i = 0; i < 15; i++) { const idx = Math.floor(Math.random() * SIZE * SIZE); toggleAt(g, idx); }
    setGrid(g);
    setMoves(0);
    setOver(false);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${moves} moves`}>
      <div className="flex flex-col items-center gap-4 p-4 pt-6">
        <p className="text-sm text-dust">{over ? "All nodes cleared! 🎉" : "Get all nodes to OFF state"}</p>
        <div className="grid grid-cols-5 gap-2 rounded-xl border-2 p-2" style={{ borderColor: G.accent + "44" }}>
          {grid.map((state, idx) => (
            <button
              key={idx}
              type="button"
              disabled={over}
              onClick={() => click(idx)}
              className="flex size-12 items-center justify-center rounded-lg transition-all hover:scale-95 md:size-14"
              style={{
                background: COLORS[state],
                border: `2px solid ${state > 0 ? COLORS[state] : "var(--color-line)"}`,
                boxShadow: state > 0 ? `0 0 10px ${COLORS[state]}88` : "none",
              }}
            >
              <span className="text-lg">{state === 0 ? "⚫" : state === 1 ? "💡" : "🔥"}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-3 text-xs text-muted">
          <span>⚫ Off</span><span>💡 On</span><span>🔥 Overcharge</span>
        </div>
        <p className="text-xs text-muted">Clicking a node cycles it + neighbors through 3 states</p>
      </div>
    </GameShell>
  );
}
