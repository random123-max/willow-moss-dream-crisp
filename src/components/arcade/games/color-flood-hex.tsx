import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("color-flood-hex")!;
const SIZE = 7;
const COLORS = ["#3ee0d0", "#ff6a3d", "#a855f7", "#f59e0b", "#22c55e", "#60a5fa"];
const TERRAIN = ["mountain", "river", "normal"];

function init(): { color: number; terrain: number }[][] {
  const g: { color: number; terrain: number }[][] = [];
  for (let r = 0; r < SIZE; r++) {
    const row: { color: number; terrain: number }[] = [];
    for (let c = 0; c < SIZE; c++) {
      const t = Math.random() < 0.1 ? 0 : Math.random() < 0.1 ? 1 : 2;
      row.push({ color: Math.floor(Math.random() * COLORS.length), terrain: t });
    }
    g.push(row);
  }
  return g;
}

export default function ColorFloodHex() {
  const [grid, setGrid] = useState(init);
  const [moves, setMoves] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [maxMoves] = useState(25);

  const flood = useCallback(
    (color: number) => {
      if (over) return;
      const oldColor = grid[0][0].color;
      if (color === oldColor) return;
      setGrid((prev) => {
        const ng = prev.map((row) => row.map((cell) => ({ ...cell })));
        const visited = new Set<string>();
        const queue = [[0, 0]];
        while (queue.length) {
          const [r, c] = queue.shift()!;
          const key = `${r},${c}`;
          if (visited.has(key)) continue;
          visited.add(key);
          if (ng[r][c].terrain === 0) continue; // Mountains block
          if (ng[r][c].color !== oldColor) continue;
          ng[r][c].color = color;
          const neighbors = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1], [r - 1, c + 1], [r + 1, c - 1]];
          for (const [nr, nc] of neighbors) {
            if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
              queue.push([nr, nc]);
            }
          }
        }
        setMoves((m) => m + 1);
        const allSame = ng.every((row) => row.every((cell) => cell.color === ng[0][0].color || cell.terrain === 0));
        if (allSame) { setWon(true); setOver(true); }
        else if (moves + 1 >= maxMoves) { setOver(true); }
        return ng;
      });
    },
    [grid, over, moves, maxMoves],
  );

  const reset = () => {
    setGrid(init());
    setMoves(0);
    setOver(false);
    setWon(false);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${moves}/${maxMoves}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{won ? "Dominion achieved! 🎉" : over ? "Out of moves!" : "Flood the entire grid!"}</p>
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <div key={`${r}-${c}`} className="flex size-9 items-center justify-center rounded" style={{ background: COLORS[cell.color], clipPath: r % 2 ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" : "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)", opacity: cell.terrain === 0 ? 0.3 : 1, border: cell.terrain === 0 ? "2px solid #444" : "none" }}>
                {cell.terrain === 0 && <span className="text-xs">⛰️</span>}
                {cell.terrain === 1 && <span className="text-xs opacity-40">🌊</span>}
              </div>
            )),
          )}
        </div>
        <div className="flex gap-2">
          {COLORS.map((color, i) => (
            <button key={i} type="button" disabled={over || i === grid[0][0].color} onClick={() => flood(i)} className="size-8 rounded-full transition-all hover:scale-110 disabled:opacity-30" style={{ background: color, border: `2px solid ${color}` }} />
          ))}
        </div>
        <p className="text-xs text-muted">⛰️ Mountains block · 🌊 Rivers accelerate flow</p>
      </div>
    </GameShell>
  );
}
