import { useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("nonogram-blueprint")!;
const SIZE = 5;

const PUZZLES: number[][][] = [
  // Robot face
  [
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0],
  ],
  // Star
  [
    [0, 0, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0],
    [1, 0, 0, 0, 1],
  ],
  // Spaceship
  [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0],
  ],
];

function getHints(line: number[]): number[] {
  const hints: number[] = [];
  let count = 0;
  for (const cell of line) {
    if (cell === 1) count++;
    else if (count > 0) { hints.push(count); count = 0; }
  }
  if (count > 0) hints.push(count);
  return hints.length ? hints : [0];
}

export default function NonogramBlueprint() {
  const [puzzleIdx] = useState(() => Math.floor(Math.random() * PUZZLES.length));
  const puzzle = PUZZLES[puzzleIdx];
  const [grid, setGrid] = useState<number[][]>(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
  const [marks, setMarks] = useState<number[][]>(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(0))); // 0=empty, 1=filled, 2=marked
  const [time, setTime] = useState(60);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [progress, setProgress] = useState(0);

  const rowHints = puzzle.map(getHints);
  const colHints = Array.from({ length: SIZE }, (_, c) => getHints(puzzle.map((row) => row[c])));

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => setTime((s) => { if (s <= 1) { setOver(true); return 0; } return s - 1; }), 1000);
    return () => clearInterval(t);
  }, [over]);

  const click = useCallback(
    (r: number, c: number, mark: boolean) => {
      if (over) return;
      setMarks((prev) => {
        const nm = prev.map((row) => [...row]);
        nm[r][c] = mark ? (nm[r][c] === 2 ? 0 : 2) : nm[r][c] === 1 ? 0 : 1;
        // Check progress
        let correct = 0;
        for (let i = 0; i < SIZE; i++)
          for (let j = 0; j < SIZE; j++)
            if ((nm[i][j] === 1) === (puzzle[i][j] === 1)) correct++;
        setProgress(Math.round((correct / (SIZE * SIZE)) * 100));
        // Check win
        let isWin = true;
        for (let i = 0; i < SIZE; i++)
          for (let j = 0; j < SIZE; j++)
            if ((nm[i][j] === 1) !== (puzzle[i][j] === 1)) isWin = false;
        if (isWin) { setWon(true); setOver(true); }
        return nm;
      });
    },
    [over, puzzle],
  );

  const reset = () => {
    setMarks(Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
    setTime(60);
    setOver(false);
    setWon(false);
    setProgress(0);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`⏱️${time}`} extra={<span className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-primary">{progress}%</span>}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{won ? "Blueprint complete! 🤖🎉" : over ? "Time's up!" : "Click to fill, right-click to mark empty"}</p>
        <div className="overflow-x-auto">
          <div className="inline-grid gap-px" style={{ gridTemplateColumns: `auto repeat(${SIZE}, 28px)` }}>
            {/* Top-left empty */}
            <div />
            {/* Column hints */}
            {colHints.map((hints, c) => (
              <div key={c} className="flex flex-col items-center justify-end gap-px text-[10px] font-mono text-muted">
                {hints.map((h, i) => <span key={i}>{h}</span>)}
              </div>
            ))}
            {/* Rows */}
            {puzzle.map((_, r) => (
              <>
                <div key={`r-${r}`} className="flex items-center justify-end gap-1 pr-1 text-[10px] font-mono text-muted">
                  {rowHints[r].map((h, i) => <span key={i}>{h}</span>)}
                </div>
                {Array.from({ length: SIZE }, (_, c) => (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    disabled={over}
                    onClick={() => click(r, c, false)}
                    onContextMenu={(e) => { e.preventDefault(); click(r, c, true); }}
                    className="flex size-7 items-center justify-center rounded-sm text-xs"
                    style={{
                      background: marks[r][c] === 1 ? G.accent : marks[r][c] === 2 ? "var(--color-elevated)" : "var(--color-surface)",
                      border: `1px solid ${marks[r][c] === 1 ? G.accent : "var(--color-line)"}`,
                      color: "var(--color-muted)",
                    }}
                  >
                    {marks[r][c] === 2 ? "✕" : marks[r][c] === 1 ? "■" : ""}
                  </button>
                ))}
              </>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted">Build the robot before time runs out!</p>
      </div>
    </GameShell>
  );
}
