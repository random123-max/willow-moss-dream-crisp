import { useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("fusion-2048")!;

type Grid = number[][];
const SIZE = 4;

function init(): Grid {
  const g: Grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  addTile(g); addTile(g);
  return g;
}

function addTile(g: Grid) {
  const empty: [number, number][] = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (g[r][c] === 0) empty.push([r, c]);
  if (empty.length) { const [r, c] = empty[Math.floor(Math.random() * empty.length)]; g[r][c] = Math.random() < 0.9 ? 2 : 4; }
}

function slide(row: number[]): [number[], boolean] {
  const filtered = row.filter((x) => x);
  let merged = false;
  for (let i = 0; i < filtered.length - 1; i++) {
    if (filtered[i] === filtered[i + 1]) { filtered[i] *= 2; filtered.splice(i + 1, 1); merged = true; }
  }
  while (filtered.length < SIZE) filtered.push(0);
  return [filtered, merged];
}

const COLORS: Record<number, string> = {
  2: "#243240", 4: "#30465a", 8: "#3ee0d0", 16: "#2bcdb8", 32: "#ff6a3d", 64: "#e55a2a",
  128: "#f59e0b", 256: "#eab308", 512: "#a855f7", 1024: "#8b5cf6", 2048: "#3ee0d0",
};

export default function Fusion2048() {
  const [grid, setGrid] = useState<Grid>(init);
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-2048-best", 0);
  const [heat, setHeat] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const move = useCallback((dir: "up" | "down" | "left" | "right") => {
    if (over) return;
    let moved = false;
    setGrid((prev) => {
      const g = prev.map((r) => [...r]);
      const rotate = (g: Grid): Grid => g[0].map((_, i) => g.map((r) => r[i]).reverse());
      let g2 = g;
      if (dir === "up") g2 = rotate(rotate(rotate(g)));
      if (dir === "right") g2 = rotate(g);
      if (dir === "down") g2 = rotate(rotate(g));
      // slide left
      g2 = g2.map((row) => { const [r, m] = slide(row); if (m) moved = true; return r; });
      // rotate back
      let g3 = g2;
      if (dir === "up") g3 = rotate(g2);
      if (dir === "right") g3 = rotate(rotate(rotate(g2)));
      if (dir === "down") g3 = rotate(rotate(g2));
      if (moved) {
        addTile(g3);
        setMoves((m) => m + 1);
        setScore((s) => { const ns = s + g3.flat().filter((x) => x > 2).reduce((a, b) => a + b, 0) - g.flat().reduce((a, b) => a + b, 0); if (ns > best) setBest(ns); return ns; });
        if (g3.flat().includes(2048) && !won) setWon(true);
        // Check if no moves left
        const canMove = g3.some((row, r) => row.some((cell, c) => cell === 0 || (c < 3 && cell === row[c + 1]) || (r < 3 && cell === g3[r + 1][c])));
        if (!canMove) setOver(true);
      }
      return g3;
    });
    setHeat(0);
  }, [over, won, best]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const map: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      };
      if (map[e.key]) { e.preventDefault(); move(map[e.key]); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  // Heat buildup if stagnant
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setHeat((h) => {
        const nh = h + 1;
        if (nh >= 5) {
          // Reactor explosion — destroy highest tile
          setGrid((prev) => {
            let max = 0, maxR = 0, maxC = 0;
            for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (prev[r][c] > max) { max = prev[r][c]; maxR = r; maxC = c; }
            const ng = prev.map((row) => [...row]);
            if (max > 0) ng[maxR][maxC] = 0;
            return ng;
          });
          return 0;
        }
        return nh;
      });
    }, 2000);
    return () => clearInterval(t);
  }, [over, moves]);

  const reset = () => { setGrid(init()); setScore(0); setHeat(0); setOver(false); setWon(false); setMoves(0); };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <div className="flex w-full max-w-xs items-center justify-between">
          <span className="text-sm text-muted">Moves: {moves}</span>
          <span className="text-sm" style={{ color: heat >= 3 ? "#ff6a3d" : heat >= 2 ? "#f59e0b" : G.accent }}>🔥 Heat: {heat}/5 {heat >= 3 && "⚠️"}</span>
        </div>
        <div className="relative">
          <div className="grid grid-cols-4 gap-2 rounded-xl border-2 p-2" style={{ borderColor: G.accent + "44" }}>
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <div key={`${r}-${c}`} className="flex size-14 items-center justify-center rounded-lg font-mono text-sm font-bold transition-all md:size-16" style={{ background: cell ? COLORS[cell] ?? "#3ee0d0" : "var(--color-bg)", color: cell >= 128 ? "#071018" : "#ece7de", boxShadow: cell >= 128 ? `0 0 12px ${COLORS[cell]}88` : "none" }}>
                  {cell || ""}
                </div>
              )),
            )}
          </div>
          {heat >= 3 && <div className="pointer-events-none absolute inset-0 rounded-xl animate-pulse" style={{ boxShadow: `inset 0 0 20px #ff6a3d77` }} />}
        </div>
        {won && <p className="text-sm" style={{ color: G.accent }}>🎉 You reached 2048!</p>}
        {over && <p className="font-display text-xl text-ember">Reactor meltdown! Score: {score}</p>}
        <div className="grid grid-cols-3 gap-2">
          <div />
          <button type="button" onClick={() => move("up")} disabled={over} className="rounded-lg border border-line bg-surface px-4 py-2 text-sm">↑</button>
          <div />
          <button type="button" onClick={() => move("left")} disabled={over} className="rounded-lg border border-line bg-surface px-4 py-2 text-sm">←</button>
          <button type="button" onClick={() => move("down")} disabled={over} className="rounded-lg border border-line bg-surface px-4 py-2 text-sm">↓</button>
          <button type="button" onClick={() => move("right")} disabled={over} className="rounded-lg border border-line bg-surface px-4 py-2 text-sm">→</button>
        </div>
        <p className="text-xs text-muted">Arrow keys or buttons · Move before heat explodes!</p>
      </div>
    </GameShell>
  );
}
