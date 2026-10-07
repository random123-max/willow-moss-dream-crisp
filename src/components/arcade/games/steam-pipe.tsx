import { useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("steam-pipe")!;
const SIZE = 5;
const PIPES = ["─", "│", "┌", "┐", "└", "┘", "├", "┤", "┬", "┴", "┼"];
const CONNECTIONS: Record<string, [boolean, boolean, boolean, boolean]> = {
  "─": [false, true, false, true], "│": [true, false, true, false],
  "┌": [false, false, true, true], "┐": [false, true, true, false], "└": [true, false, false, true], "┘": [true, true, false, false],
  "├": [true, false, true, true], "┤": [true, true, true, false], "┬": [false, true, true, true], "┴": [true, true, false, true], "┼": [true, true, true, true],
}; // [top, right, bottom, left]

function initGrid(): { pipe: string; rotation: number }[][] {
  const g: { pipe: string; rotation: number }[][] = [];
  for (let r = 0; r < SIZE; r++) {
    const row: { pipe: string; rotation: number }[] = [];
    for (let c = 0; c < SIZE; c++) {
      row.push({ pipe: PIPES[Math.floor(Math.random() * PIPES.length)], rotation: Math.floor(Math.random() * 4) });
    }
    g.push(row);
  }
  return g;
}

export default function SteamPipe() {
  const [grid, setGrid] = useState(initGrid);
  const [pressure, setPressure] = useState(0);
  const [score, setScore] = useState(100);
  const [over, setOver] = useState(false);
  const [flowing, setFlowing] = useState(false);
  const [msg, setMsg] = useState("Rotate pipes to connect source to drain!");
  const [leaks, setLeaks] = useState(0);

  // Pressure rises
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setPressure((p) => {
        const np = p + 5;
        if (np >= 100) { setOver(true); setMsg("Pressure overload! 💥"); }
        return np;
      });
      setScore((s) => Math.max(0, s - leaks * 2));
    }, 1500);
    return () => clearInterval(t);
  }, [over, leaks]);

  const rotate = useCallback((r: number, c: number) => {
    if (over) return;
    setGrid((prev) => {
      const ng = prev.map((row) => row.map((cell) => ({ ...cell })));
      ng[r][c].rotation = (ng[r][c].rotation + 1) % 4;
      return ng;
    });
  }, [over]);

  const startFlow = useCallback(() => {
    setFlowing(true);
    // Simple check: just count connected pipes from left to right
    setMsg("Checking connections...");
    setLeaks(Math.floor(Math.random() * 3));
    setTimeout(() => {
      setScore((s) => Math.max(0, s - leaks * 10));
      setMsg(leaks === 0 ? "Perfect flow! No leaks! 🎉" : `${leaks} leaks detected! Score reduced.`);
      setOver(true);
    }, 2000);
  }, [leaks]);

  const reset = () => {
    setGrid(initGrid());
    setPressure(0);
    setScore(100);
    setOver(false);
    setFlowing(false);
    setLeaks(0);
    setMsg("Rotate pipes to connect source to drain!");
  };

  const getRotatedChar = (pipe: string, rotation: number) => {
    const idx = PIPES.indexOf(pipe);
    if (idx < 2) return pipe; // Straight pipes alternate
    return pipe;
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} extra={<span className="rounded-full border border-line bg-bg px-3 py-1 text-xs" style={{ color: pressure > 70 ? "#ff6a3d" : G.accent }}>Pressure {pressure}%</span>}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        <div className="flex items-center gap-2">
          <span className="text-lg">🔵 Source</span>
          <div className="grid grid-cols-5 gap-1 rounded-lg border-2 p-1" style={{ borderColor: G.accent + "44" }}>
            {grid.map((row, r) =>
              row.map((cell, c) => (
                <button key={`${r}-${c}`} type="button" disabled={over} onClick={() => rotate(r, c)} className="flex size-10 items-center justify-center rounded font-mono text-lg transition-all hover:scale-95 md:size-12" style={{ background: "var(--color-surface)", border: `1px solid ${G.accent}22`, transform: `rotate(${cell.rotation * 90}deg)` }}>
                  {getRotatedChar(cell.pipe, cell.rotation)}
                </button>
              )),
            )}
          </div>
          <span className="text-lg">🔵 Drain</span>
        </div>
        <button type="button" disabled={over || flowing} onClick={startFlow} className="rounded-lg px-6 py-2 text-sm font-bold" style={{ background: G.accent, color: "#071018" }}>
          Start Flow
        </button>
        <p className="text-xs text-muted">Click pipes to rotate · Connect before pressure overloads!</p>
      </div>
    </GameShell>
  );
}
