import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("rogue-checkers")!;
const SIZE = 6;
type Piece = { owner: 1 | 2; hp: number; crowned: boolean; ability?: "chain" | "teleport" } | null;

function initBoard(): Piece[] {
  const b: Piece[] = Array(SIZE * SIZE).fill(null);
  for (let r = 0; r < 2; r++)
    for (let c = 0; c < SIZE; c++)
      if ((r + c) % 2 === 1) b[r * SIZE + c] = { owner: 2, hp: r === 0 ? 3 : 2, crowned: false };
  for (let r = 4; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if ((r + c) % 2 === 1) b[r * SIZE + c] = { owner: 1, hp: r === 5 ? 3 : 2, crowned: false };
  return b;
}

const DIRS = [-SIZE - 1, -SIZE + 1, SIZE - 1, SIZE + 1];

export default function RogueCheckers() {
  const [board, setBoard] = useState<Piece[]>(initBoard);
  const [turn, setTurn] = useState<1 | 2>(1);
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState("Your turn — select a piece");
  const [over, setOver] = useState(false);

  const canMove = (b: Piece[], i: number): number[] => {
    const p = b[i];
    if (!p) return [];
    const r = Math.floor(i / SIZE);
    const c = i % SIZE;
    const moves: number[] = [];
    for (const d of DIRS) {
      const ni = i + d;
      if (ni < 0 || ni >= SIZE * SIZE) continue;
      const nr = Math.floor(ni / SIZE);
      const nc = ni % SIZE;
      if (Math.abs(nr - r) !== 1 || Math.abs(nc - c) !== 1) continue;
      if (!b[ni]) moves.push(ni);
      // Jump
      const ji = ni + d;
      if (ji >= 0 && ji < SIZE * SIZE) {
        const jr = Math.floor(ji / SIZE);
        const jc = ji % SIZE;
        if (Math.abs(jr - nr) === 1 && Math.abs(jc - nc) === 1 && b[ji] === null && b[ni] && b[ni]!.owner !== p.owner) {
          moves.push(ji);
        }
      }
    }
    return moves;
  };

  const move = useCallback(
    (to: number) => {
      if (sel === null || over) return;
      setBoard((prev) => {
        const p = prev[sel];
        if (!p || p.owner !== turn) return prev;
        const moves = canMove(prev, sel);
        if (!moves.includes(to)) return prev;
        const nb = [...prev];
        const isJump = Math.abs(Math.floor(to / SIZE) - Math.floor(sel / SIZE)) === 2;
        if (isJump) {
          const mid = (sel + to) / 2;
          const target = nb[mid];
          if (target) {
            target.hp -= 1;
            if (target.hp <= 0) nb[mid] = null;
          }
        }
        nb[to] = p;
        nb[sel] = null;
        // Crown
        if (!p.crowned && ((p.owner === 1 && Math.floor(to / SIZE) === 0) || (p.owner === 2 && Math.floor(to / SIZE) === SIZE - 1))) {
          p.crowned = true;
          p.ability = Math.random() < 0.5 ? "chain" : "teleport";
          setMsg(`Piece crowned! Ability: ${p.ability === "chain" ? "Chain Jump" : "Teleport"}!`);
        }
        // Check win
        const p1Alive = nb.some((x) => x?.owner === 1);
        const p2Alive = nb.some((x) => x?.owner === 2);
        if (!p1Alive || !p2Alive) {
          setOver(true);
          setMsg(!p1Alive ? "All your pieces eliminated!" : "AI eliminated!");
        }
        setTurn(turn === 1 ? 2 : 1);
        return nb;
      });
      setSel(null);
    },
    [sel, turn, over],
  );

  // AI
  if (turn === 2 && !over && sel === null) {
    setTimeout(() => {
      setBoard((prev) => {
        const pieces = prev.map((p, i) => ({ p, i })).filter(({ p }) => p?.owner === 2);
        for (const { i } of pieces) {
          const moves = canMove(prev, i);
          for (const m of moves) {
            if (Math.abs(Math.floor(m / SIZE) - Math.floor(i / SIZE)) === 2) {
              // Jump
              const nb = [...prev];
              const mid = (i + m) / 2;
              const target = nb[mid];
              if (target) {
                target.hp -= 1;
                if (target.hp <= 0) nb[mid] = null;
              }
              nb[m] = nb[i];
              nb[i] = null;
              setTurn(1);
              setMsg("AI jumped your piece!");
              return nb;
            }
          }
        }
        // Random move
        for (const { i } of pieces) {
          const moves = canMove(prev, i);
          if (moves.length) {
            const m = moves[0];
            const nb = [...prev];
            nb[m] = nb[i];
            nb[i] = null;
            setTurn(1);
            setMsg("Your turn");
            return nb;
          }
        }
        setOver(true);
        setMsg("AI has no moves — you win!");
        return prev;
      });
    }, 500);
  }

  const reset = () => {
    setBoard(initBoard());
    setTurn(1);
    setSel(null);
    setMsg("Your turn — select a piece");
    setOver(false);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={msg}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <div className="grid gap-0.5 rounded-lg border-2 p-1" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, borderColor: G.accent + "44" }}>
          {board.map((p, i) => {
            const dark = (Math.floor(i / SIZE) + (i % SIZE)) % 2 === 1;
            return (
              <button
                key={i}
                type="button"
                disabled={!dark || over}
                onClick={() => {
                  if (p?.owner === 1) setSel(i);
                  else if (sel !== null && canMove(board, sel).includes(i)) move(i);
                }}
                className={`flex size-11 items-center justify-center rounded text-lg transition-all md:size-12 ${dark ? "cursor-pointer" : "cursor-default"}`}
                style={{
                  background: dark ? (sel === i ? G.accent + "33" : "var(--color-surface)") : "var(--color-bg)",
                  border: sel === i ? `2px solid ${G.accent}` : "1px solid var(--color-line)",
                }}
              >
                {p && (
                  <span
                    className="flex size-7 items-center justify-center rounded-full text-xs font-bold md:size-8"
                    style={{
                      background: p.owner === 1 ? G.accent : "#ff6a3d",
                      color: "#071018",
                      boxShadow: p.crowned ? `0 0 8px ${p.owner === 1 ? G.accent : "#ff6a3d"}` : "none",
                      border: p.crowned ? "2px solid #fbbf24" : "none",
                    }}
                  >
                    {p.hp}{p.crowned && "👑"}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
