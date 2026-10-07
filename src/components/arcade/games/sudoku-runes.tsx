import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("sudoku-runes")!;
const SIZE = 4;
const BOX = 2;

function validSolution(): number[][] {
  const base = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
  return base;
}

function makePuzzle(): { puzzle: (number | null)[][]; solution: number[][] } {
  const sol = validSolution();
  const puzzle = sol.map((row) => row.map(() => null as number | null));
  const cells = 6;
  for (let i = 0; i < cells; i++) {
    const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
    puzzle[r][c] = sol[r][c];
  }
  return { puzzle, solution: sol };
}

export default function SudokuRunes() {
  const [data, setData] = useState(makePuzzle);
  const [grid, setGrid] = useState<(number | null)[][]>(data.puzzle);
  const [given, setGiven] = useState<boolean[][]>(data.puzzle.map((row) => row.map((c) => c !== null)));
  const [charge, setCharge] = useState(0);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Fill the grid 1-4!");

  const check = useCallback(() => {
    for (let r = 0; r < SIZE; r++)
      for (let c = 0; c < SIZE; c++) {
        if (grid[r][c] !== data.solution[r][c]) return false;
      }
    return true;
  }, [grid, data]);

  const place = useCallback(
    (r: number, c: number, val: number | null) => {
      if (given[r][c] || over) return;
      const ng = grid.map((row) => [...row]);
      ng[r][c] = val;
      setGrid(ng);
      if (val !== null && val === data.solution[r][c]) {
        setCharge((ch) => Math.min(5, ch + 1));
        setMsg("✨ Correct placement! +1 elemental charge!");
      } else if (val !== null) {
        setMsg("❌ Wrong — try again.");
      }
      if (ng.flat().every((c) => c !== null) && check()) {
        setOver(true);
        setMsg("🎉 Sudoku solved! Runes aligned!");
      }
    },
    [grid, given, over, data, check],
  );

  const castSpell = useCallback(
    (spell: "reveal" | "cleanse") => {
      if (charge < 2) return;
      setCharge((c) => c - 2);
      if (spell === "reveal") {
        for (let r = 0; r < SIZE; r++)
          for (let c = 0; c < SIZE; c++)
            if (grid[r][c] !== data.solution[r][c]) {
              place(r, c, data.solution[r][c]);
              setMsg("🔮 Reveal Fate! A cell was revealed.");
              return;
            }
      } else {
        for (let r = 0; r < SIZE; r++)
          for (let c = 0; c < SIZE; c++)
            if (grid[r][c] !== null && grid[r][c] !== data.solution[r][c]) {
              place(r, c, data.solution[r][c]);
              setMsg("🔮 Cleanse Error! A wrong cell was fixed.");
              return;
            }
      }
    },
    [charge, grid, data, place],
  );

  const reset = () => {
    const d = makePuzzle();
    setData(d);
    setGrid(d.puzzle);
    setGiven(d.puzzle.map((row) => row.map((c) => c !== null)));
    setCharge(0);
    setOver(false);
    setMsg("Fill the grid 1-4!");
  };

  const selected = { r: -1, c: -1 };
  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`🔮${charge}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        <div className="grid grid-cols-4 gap-1 rounded-lg border-2 p-1" style={{ borderColor: G.accent + "44" }}>
          {grid.map((row, r) =>
            row.map((cell, c) => (
              <button
                key={`${r}-${c}`}
                type="button"
                disabled={given[r][c] || over}
                onClick={() => { selected.r = r; selected.c = c; }}
                className={`flex size-16 items-center justify-center rounded font-mono text-xl font-bold transition-all md:size-20 ${given[r][c] ? "" : "hover:bg-elevated"}`}
                style={{
                  background: given[r][c] ? "var(--color-elevated)" : cell !== null && cell === data.solution[r][c] ? G.accent + "22" : cell !== null ? "#ff6a3d22" : "var(--color-surface)",
                  border: `${(c + 1) % BOX === 0 && c < SIZE - 1 ? 2 : 1}px solid ${(r + 1) % BOX === 0 && r < SIZE - 1 ? G.accent + "44" : "var(--color-line)"}`,
                  color: given[r][c] ? "var(--color-fg)" : cell === data.solution[r][c] ? G.accent : "#ff6a3d",
                }}
              >
                {cell || ""}
              </button>
            )),
          )}
        </div>
        {/* Number input */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((n) => (
            <button key={n} type="button" onClick={() => { if (selected.r >= 0) place(selected.r, selected.c, n); }} className="flex size-12 items-center justify-center rounded-lg border text-lg font-bold" style={{ borderColor: G.accent, color: G.accent, background: G.accent + "11" }}>
              {n}
            </button>
          ))}
          <button type="button" onClick={() => { if (selected.r >= 0) place(selected.r, selected.c, null); }} className="flex size-12 items-center justify-center rounded-lg border border-line text-lg text-muted">✕</button>
        </div>
        {/* Spells */}
        <div className="flex gap-2">
          <button type="button" disabled={charge < 2} onClick={() => castSpell("reveal")} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: G.accent, color: G.accent }}>🔮 Reveal (2⚡)</button>
          <button type="button" disabled={charge < 2} onClick={() => castSpell("cleanse")} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: G.accent, color: G.accent }}>🧹 Cleanse (2⚡)</button>
        </div>
        <p className="text-xs text-muted">Tap a cell, then a number · 2 charges per spell</p>
      </div>
    </GameShell>
  );
}
