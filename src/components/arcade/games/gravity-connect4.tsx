import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("gravity-connect4")!;
const ROWS = 6;
const COLS = 7;
type Disc = 0 | 1 | 2; // 0 empty, 1 player, 2 AI

function dropInto(grid: Disc[][], col: number, player: Disc): Disc[][] {
  const ng = grid.map((r) => [...r]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (ng[r][col] === 0) {
      ng[r][col] = player;
      return ng;
    }
  }
  return grid;
}

function checkWin(grid: Disc[][]): Disc {
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const p = grid[r][c];
      if (!p) continue;
      if (c + 3 < COLS && p === grid[r][c + 1] && p === grid[r][c + 2] && p === grid[r][c + 3]) return p;
      if (r + 3 < ROWS && p === grid[r + 1][c] && p === grid[r + 2][c] && p === grid[r + 3][c]) return p;
      if (r + 3 < ROWS && c + 3 < COLS && p === grid[r + 1][c + 1] && p === grid[r + 2][c + 2] && p === grid[r + 3][c + 3]) return p;
      if (r + 3 < ROWS && c >= 3 && p === grid[r + 1][c - 1] && p === grid[r + 2][c - 2] && p === grid[r + 3][c - 3]) return p;
    }
  return 0;
}

function rotateBoard(grid: Disc[][]): Disc[][] {
  // Rotate 90° clockwise, then apply gravity
  const rotated: Disc[][] = Array.from({ length: COLS }, () => Array(ROWS).fill(0));
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      rotated[c][ROWS - 1 - r] = grid[r][c];
  // Apply gravity per column
  const result = Array.from({ length: COLS }, () => Array(ROWS).fill(0));
  for (let c = 0; c < COLS; c++) {
    let writeRow = ROWS - 1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (rotated[r][c]) {
        result[writeRow][c] = rotated[r][c];
        writeRow--;
      }
    }
  }
  // Pad to ROWS x COLS — after rotation dimensions swap
  const final: Disc[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  for (let r = 0; r < Math.min(ROWS, COLS); r++)
    for (let c = 0; c < Math.min(ROWS, COLS); c++)
      final[r][c] = result[r]?.[c] ?? 0;
  return final;
}

function aiMove(grid: Disc[][]): number {
  // Simple heuristic: block or win, else random
  for (let c = 0; c < COLS; c++) {
    const test = dropInto(grid, c, 2);
    if (checkWin(test) === 2) return c;
  }
  for (let c = 0; c < COLS; c++) {
    const test = dropInto(grid, c, 1);
    if (checkWin(test) === 1) return c;
  }
  return Math.floor(Math.random() * COLS);
}

export default function GravityConnect4() {
  const [grid, setGrid] = useState<Disc[][]>(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
  const [turn, setTurn] = useState(1);
  const [msg, setMsg] = useState("Drop a disc!");
  const [over, setOver] = useState(false);
  const [rotations, setRotations] = useState<Record<number, number>>({ 1: 1, 2: 1 });

  const play = useCallback(
    (col: number) => {
      if (over || turn !== 1) return;
      const ng = dropInto(grid, col, 1);
      setGrid(ng);
      const w = checkWin(ng);
      if (w) {
        setOver(true);
        setMsg(w === 1 ? "You win! 🎉" : "AI wins!");
        return;
      }
      setTurn(2);
      setTimeout(() => {
        const aiCol = aiMove(ng);
        const ng2 = dropInto(ng, aiCol, 2);
        setGrid(ng2);
        const w2 = checkWin(ng2);
        if (w2) {
          setOver(true);
          setMsg(w2 === 1 ? "You win! 🎉" : "AI wins!");
          return;
        }
        setTurn(1);
      }, 400);
    },
    [grid, turn, over],
  );

  const rotate = useCallback(() => {
    if (over || rotations[turn] <= 0) return;
    const ng = rotateBoard(grid);
    setGrid(ng);
    setRotations((r) => ({ ...r, [turn]: r[turn] - 1 }));
    const w = checkWin(ng);
    if (w) {
      setOver(true);
      setMsg(w === 1 ? "Rotation win! 🎉" : "AI rotation win!");
    }
  }, [grid, turn, over, rotations]);

  const reset = () => {
    setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
    setTurn(1);
    setMsg("Drop a disc!");
    setOver(false);
    setRotations({ 1: 1, 2: 1 });
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={msg}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-muted">{msg}</p>
        <div className="overflow-hidden rounded-xl border-2 p-2" style={{ borderColor: G.accent + "44" }}>
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  disabled={over || turn !== 1}
                  onClick={() => play(c)}
                  className="size-10 rounded-full border border-line transition-all hover:opacity-80 md:size-12"
                  style={{
                    background: cell === 1 ? G.accent : cell === 2 ? "#ff6a3d" : "var(--color-bg)",
                    boxShadow: cell ? `inset 0 0 8px rgba(0,0,0,.3), 0 0 12px ${cell === 1 ? G.accent : "#ff6a3d"}55` : "none",
                  }}
                />
              )),
            )}
          </div>
        </div>
        <button
          type="button"
          disabled={over || rotations[turn] <= 0}
          onClick={rotate}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-all disabled:opacity-40"
          style={{ borderColor: G.accent, color: rotations[turn] > 0 ? G.accent : "var(--color-muted)" }}
        >
          🔄 Rotate Board ({rotations[turn]} left)
        </button>
      </div>
    </GameShell>
  );
}
