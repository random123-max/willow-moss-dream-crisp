import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("reversi-nexus")!;
const SIZE = 8;
type Disc = 0 | 1 | 2;
const RIFTS = [18, 27, 36, 45]; // Void rift positions

function init(): Disc[] {
  const b = Array(SIZE * SIZE).fill(0) as Disc[];
  b[27] = 1; b[28] = 2; b[35] = 2; b[36] = 1;
  return b;
}

const DIRS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

function validMoves(b: Disc[], player: Disc): number[] {
  const opp = player === 1 ? 2 : 1;
  const moves: number[] = [];
  for (let i = 0; i < SIZE * SIZE; i++) {
    if (b[i]) continue;
    if (RIFTS.includes(i)) continue;
    const r = Math.floor(i / SIZE), c = i % SIZE;
    for (const [dr, dc] of DIRS) {
      let nr = r + dr, nc = c + dc, found = false;
      while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
        const ni = nr * SIZE + nc;
        if (b[ni] === opp) { found = true; }
        else if (b[ni] === player && found) { moves.push(i); break; }
        else break;
        nr += dr; nc += dc;
      }
      if (moves.includes(i)) break;
    }
  }
  return moves;
}

function applyMove(b: Disc[], i: number, player: Disc): Disc[] {
  const nb = [...b];
  nb[i] = player;
  const opp = player === 1 ? 2 : 1;
  const r = Math.floor(i / SIZE), c = i % SIZE;
  for (const [dr, dc] of DIRS) {
    let nr = r + dr, nc = c + dc;
    const flip: number[] = [];
    while (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
      const ni = nr * SIZE + nc;
      if (nb[ni] === opp) { flip.push(ni); }
      else if (nb[ni] === player) {
        flip.forEach((f) => { if (!RIFTS.includes(f)) nb[f] = player; else nb[f] = 0; });
        break;
      } else break;
      nr += dr; nc += dc;
    }
  }
  return nb;
}

export default function ReversiNexus() {
  const [board, setBoard] = useState<Disc[]>(init);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Your turn — flip discs!");

  const moves = turn === 1 ? validMoves(board, 1) : [];

  const play = useCallback((i: number) => {
    if (over || turn !== 1 || !moves.includes(i)) return;
    const nb = applyMove(board, i, 1);
    setBoard(nb);
    setTurn(2);
    setTimeout(() => {
      const aiMoves = validMoves(nb, 2);
      if (aiMoves.length === 0) { setTurn(1); return; }
      // AI picks best by most flips
      let best = aiMoves[0], bestCount = 0;
      for (const m of aiMoves) {
        const test = applyMove(nb, m, 2);
        const count = test.filter((d) => d === 2).length;
        if (count > bestCount) { bestCount = count; best = m; }
      }
      const nb2 = applyMove(nb, best, 2);
      setBoard(nb2);
      setTurn(1);
      const p1 = nb2.filter((d) => d === 1).length;
      const p2 = nb2.filter((d) => d === 2).length;
      if (p1 + p2 >= SIZE * SIZE - RIFTS.length || validMoves(nb2, 1).length === 0) {
        setOver(true);
        setMsg(p1 > p2 ? "You dominate! 🎉" : p1 < p2 ? "AI dominates!" : "Tied!");
      }
    }, 500);
  }, [board, turn, over, moves]);

  if (turn === 1 && moves.length === 0 && !over) {
    setOver(true);
    const p1 = board.filter((d) => d === 1).length;
    const p2 = board.filter((d) => d === 2).length;
    setMsg(p1 > p2 ? "No moves — you win!" : p1 < p2 ? "No moves — AI wins!" : "Tied!");
  }

  const reset = () => { setBoard(init()); setTurn(1); setOver(false); setMsg("Your turn!"); };
  const p1 = board.filter((d) => d === 1).length;
  const p2 = board.filter((d) => d === 2).length;

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${p1}:${p2}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-muted">{msg}</p>
        <div className="grid gap-0.5 rounded-lg border-2 p-1" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, borderColor: G.accent + "44" }}>
          {board.map((d, i) => {
            const rift = RIFTS.includes(i);
            const valid = moves.includes(i);
            return (
              <button
                key={i}
                type="button"
                disabled={over || !valid || turn !== 1}
                onClick={() => play(i)}
                className="flex size-8 items-center justify-center rounded md:size-9"
                style={{ background: rift ? "#1a0a0a" : "var(--color-bg)", border: `1px solid ${valid ? G.accent + "88" : "var(--color-line)"}` }}
              >
                {rift && <span className="text-xs">🕳️</span>}
                {d === 1 && <span className="size-5 rounded-full" style={{ background: G.accent, boxShadow: `0 0 6px ${G.accent}88` }} />}
                {d === 2 && <span className="size-5 rounded-full" style={{ background: "#ff6a3d", boxShadow: `0 0 6px #ff6a3d88` }} />}
                {valid && !d && !rift && <span className="size-2 rounded-full" style={{ background: G.accent + "55" }} />}
              </button>
            );
          })}
        </div>
        <div className="flex gap-4 text-sm">
          <span style={{ color: G.accent }}>● You: {p1}</span>
          <span style={{ color: "#ff6a3d" }}>● AI: {p2}</span>
          <span className="text-muted">🕳️ Rifts destroy pieces</span>
        </div>
      </div>
    </GameShell>
  );
}
