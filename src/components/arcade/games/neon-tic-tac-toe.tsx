import { useState, useCallback } from "react";
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
  let best = -Infinity,
    move = -1;
  for (let i = 0; i < 9; i++) {
    if (board[i]) continue;
    const nb = [...board];
    nb[i] = ai;
    const s = minimax(nb, ai, human, false);
    if (s > best) {
      best = s;
      move = i;
    }
  }
  return move;
}

function winner(b: Cell[]): Cell | null {
  const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  for (const [a, c, d] of lines) {
    if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  }
  return null;
}

export default function NeonTicTacToe() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [turn, setTurn] = useState(0);
  const [msg, setMsg] = useState("Your move — place X");
  const [over, setOver] = useState(false);

  const flatBoard: Cell[] = board.map((c) => (isCell(c) ? c.marker : c));
  const w = winner(flatBoard);

  const play = useCallback(
    (i: number) => {
      if (over || flatBoard[i]) return;
      const nb = [...board] as Board;
      nb[i] = "X";
      setBoard(nb);
      setTurn((t) => t + 1);
      // AI move
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

  // Glitch radiation: every 2 turns, irradiate a random occupied tile
  if (turn > 0 && turn % 4 === 0 && !over && !w) {
    setTimeout(() => {
      setBoard((prev) => {
        const occupied = prev
          .map((c, i) => ({ i, c }))
          .filter(({ c }) => isCell(c));
        if (occupied.length === 0) return prev;
        const target = occupied[Math.floor(Math.random() * occupied.length)];
        const nb = [...prev] as Board;
        const cell = nb[target.i] as { marker: Cell; radiation: number };
        if (cell.radiation >= 2) {
          nb[target.i] = null; // Wiped!
          setMsg(`Glitch wiped tile ${target.i + 1}!`);
        } else {
          nb[target.i] = { marker: cell.marker, radiation: cell.radiation + 1 };
          setMsg(`Tile ${target.i + 1} irradiated! ${2 - cell.radiation - 1} rounds left.`);
        }
        return nb;
      });
    }, 600);
  }

  if (w && !over) {
    setOver(true);
    setMsg(w === "X" ? "You won?! Impossible!" : "AI wins. As expected.");
  } else if (!w && flatBoard.every((c) => c) && !over) {
    setOver(true);
    setMsg("Draw! You survived the glitches.");
  }

  const reset = () => {
    setBoard(Array(9).fill(null));
    setTurn(0);
    setMsg("Your move — place X");
    setOver(false);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={msg}>
      <div className="flex flex-col items-center justify-center gap-4 p-4 pt-8">
        <div className="grid grid-cols-3 gap-2">
          {board.map((c, i) => {
            const marker = isCell(c) ? c.marker : c;
            const radLevel = isCell(c) ? c.radiation : 0;
            return (
              <button
                key={i}
                type="button"
                disabled={!!marker || over}
                onClick={() => play(i)}
                className={`flex size-24 items-center justify-center rounded-xl border text-5xl font-bold transition-all md:size-28 ${
                  radLevel > 0 ? "animate-pulse" : ""
                }`}
                style={{
                  borderColor: radLevel > 0 ? "#ff6a3d" : "var(--color-line)",
                  background: radLevel > 0 ? "#ff6a3d15" : "var(--color-surface)",
                  color: marker === "X" ? "#3ee0d0" : "#ff6a3d",
                  boxShadow: marker ? `0 0 20px ${marker === "X" ? "#3ee0d0" : "#ff6a3d"}44` : "none",
                }}
              >
                {marker || (radLevel > 0 && "\u2622\uFE0F")}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-muted">{msg}</p>
        {board.some((c) => isCell(c) && c.radiation > 0) && <p className="text-xs text-ember">{"\u2620\uFE0F Glitch radiation active"}</p>}
      </div>
    </GameShell>
  );
}

