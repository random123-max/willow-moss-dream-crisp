import { useState, useCallback, useEffect, useRef } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("neon-tic-tac-toe")!;
type Cell = "X" | "O" | null;
type Board = (Cell | { marker: Cell; radiation: number })[];

function isCell(c: Cell | { marker: Cell; radiation: number }): c is { marker: Cell; radiation: number } {
  return c !== null && typeof c === "object";
}

function minimax(board: Cell[], ai: Cell, human: Cell, isAi: boolean): number {
  const w = winner(board);
  if (w === ai) return 10 - board.filter((c) => c).length;
  if (w === human) return -10 + board.filter((c) => c).length;
  if (board.every((c) => c)) return 0;
  const scores = board.map((c, i) => {
    if (c) return isAi ? -Infinity : Infinity;
    const nb = [...board];
    nb[i] = isAi ? ai : human;
    return minimax(nb, ai, human, !isAi);
  });
  return isAi ? Math.max(...scores) : Math.min(...scores);
}

function bestMove(board: Cell[], ai: Cell, human: Cell): number {
  let best = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const nb = [...board];
    nb[i] = ai;
    const s = minimax(nb, ai, human, false);
    if (s > best) { best = s; move = i; }
  }
  return move;
}

function winner(b: Cell[]): Cell | null {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (const [a, c, d] of lines) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}

const X_COLOR = "#f472b6";
const O_COLOR = "#22d3ee";

export default function NeonTicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState(0);
  const [msg, setMsg] = useState("Your move — place X");
  const [over, setOver] = useState(false);
  const radiationPending = useRef(false);

  const flatBoard: Cell[] = board.map((c) => (isCell(c) ? c.marker : c));
  const w = winner(flatBoard);

  // End-game / draw detection in effect (not during render)
  useEffect(() => {
    if (over) return;
    if (w) { setOver(true); setMsg(w === "X" ? "You won?! Impossible!" : "AI wins. As expected."); return; }
    if (flatBoard.every((c) => c)) { setOver(true); setMsg("Draw! You survived the glitches."); }
  }, [w, flatBoard, over]);

  // Glitch radiation every 4 half-turns
  useEffect(() => {
    if (over || w || turn === 0 || turn % 4 !== 0 || radiationPending.current) return;
    radiationPending.current = true;
    const id = setTimeout(() => {
      setBoard((prev) => {
        const occupied = prev.map((c, i) => ({ i, c })).filter(({ c }) => isCell(c));
        if (occupied.length === 0) return prev;
        const target = occupied[Math.floor(Math.random() * occupied.length)];
        const nb = [...prev] as Board;
        const cell = nb[target.i] as { marker: Cell; radiation: number };
        if (cell.radiation >= 2) {
          nb[target.i] = null;
          setMsg(`Glitch wiped tile ${target.i + 1}!`);
        } else {
          nb[target.i] = { marker: cell.marker, radiation: cell.radiation + 1 };
          setMsg(`Tile ${target.i + 1} irradiated! ${2 - cell.radiation - 1} rounds left.`);
        }
        return nb;
      });
      radiationPending.current = false;
    }, 600);
    return () => { clearTimeout(id); radiationPending.current = false; };
  }, [turn, over, w]);

  const play = useCallback(
    (i: number) => {
      if (over || flatBoard[i]) return;
      const nb = [...board] as Board;
      nb[i] = "X";
      setBoard(nb);
      setTurn((t) => t + 1);
      setTimeout(() => {
        const fb = nb.map((c) => (isCell(c) ? c.marker : c));
        if (winner(fb)) return;
        const aiIdx = bestMove(fb, "O", "X");
        if (aiIdx >= 0) {
          const nb2 = [...nb];
          nb2[aiIdx] = "O";
          setBoard(nb2);
          setTurn((t) => t + 1);
        }
      }, 300);
    },
    [board, flatBoard, over],
  );

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn(0);
    setMsg("Your move — place X");
    setOver(false);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={msg}>
      <div className="flex flex-col items-center justify-center gap-5 p-4 pt-8">
        <div className="g3d-scene g3d-drop">
          <div className="g3d-board grid grid-cols-3 gap-2.5" style={{ width: 300, height: 300 }}>
            {board.map((c, i) => {
              const marker = isCell(c) ? c.marker : c;
              const radLevel = isCell(c) ? c.radiation : 0;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!!marker || over}
                  onClick={() => play(i)}
                  className="g3d-tile flex items-center justify-center text-5xl font-bold transition-all duration-200"
                  style={{
                    ["--g3d-top" as string]: radLevel > 0 ? "#7c2d12" : "#312e81",
                    ["--g3d-side" as string]: radLevel > 0 ? "#451a03" : "#1e1b4b",
                    color: marker === "X" ? X_COLOR : O_COLOR,
                    boxShadow: marker
                      ? `0 0 24px ${marker === "X" ? X_COLOR : O_COLOR}66, inset 0 1px 0 rgba(255,255,255,.4)`
                      : "inset 0 1px 0 rgba(255,255,255,.15)",
                    animation: marker ? "g3d-pop .32s cubic-bezier(.22,1,.36,1)" : undefined,
                  }}
                >
                  {marker || (radLevel > 0 ? <span className="text-2xl">☢️</span> : (
                    <span className="text-xs text-muted/40">+</span>
                  ))}
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-sm text-muted">{msg}</p>
        {board.some((c) => isCell(c) && c.radiation > 0) && (
          <p className="g3d-chip bg-ember/20 px-3 py-1 text-xs text-ember">⚠️ Glitch radiation active</p>
        )}
      </div>
    </GameShell>
  );
}
