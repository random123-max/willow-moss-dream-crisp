import { useState, useCallback, useEffect, useRef } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("sliding-paradox")!;
const SIZE = 3;
const TOTAL = SIZE * SIZE;

type Tile = { val: number; circuit: number };

function init(): Tile[] {
  const tiles: Tile[] = [];
  for (let i = 1; i < TOTAL; i++) tiles.push({ val: i, circuit: Math.floor(Math.random() * 4) });
  tiles.push({ val: 0, circuit: 0 }); // empty
  // Shuffle
  for (let i = tiles.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [tiles[i], tiles[j]] = [tiles[j], tiles[i]]; }
  return tiles;
}

function isSolved(tiles: Tile[]): boolean {
  for (let i = 0; i < TOTAL - 1; i++) if (tiles[i].val !== i + 1) return false;
  return true;
}

const CIRCUIT_COLORS = ["#3ee0d0", "#ff6a3d", "#fbbf24", "#a855f7"];

export default function SlidingParadox() {
  const [tiles, setTiles] = useState<Tile[]>(init);
  const [moves, setMoves] = useState(0);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Slide tiles into order!");
  const [circuitsAligned, setCircuitsAligned] = useState(false);

  const empty = tiles.findIndex((t) => t.val === 0);

  const slide = useCallback(
    (idx: number) => {
      if (over) return;
      const r = Math.floor(idx / SIZE), c = idx % SIZE;
      const er = Math.floor(empty / SIZE), ec = empty % SIZE;
      if (Math.abs(r - er) + Math.abs(c - ec) !== 1) return;
      setTiles((prev) => {
        const nt = [...prev];
        [nt[idx], nt[empty]] = [nt[empty], nt[idx]];
        // Slide shifts circuit background
        nt[empty] = { ...nt[empty], circuit: (nt[empty].circuit + 1) % 4 };
        setMoves((m) => m + 1);
        // Check circuit alignment
        const allSameCircuit = nt.slice(0, TOTAL - 1).every((t) => t.circuit === nt[0].circuit);
        setCircuitsAligned(allSameCircuit);
        if (isSolved(nt) && allSameCircuit) {
          setOver(true);
          setMsg("Both layers solved! 🎉");
        } else if (isSolved(nt)) {
          setMsg("Numbers aligned! Align circuits too!");
        } else if (allSameCircuit) {
          setMsg("Circuits aligned! Now fix the numbers!");
        } else {
          setMsg("Keep sliding...");
        }
        return nt;
      });
    },
    [over, empty],
  );

  const reset = () => { setTiles(init()); setMoves(0); setOver(false); setMsg("Slide tiles into order!"); setCircuitsAligned(false); };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${moves} moves`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        <div className="relative grid grid-cols-3 gap-1 rounded-xl border-2 p-2" style={{ borderColor: G.accent + "44" }}>
          {tiles.map((tile, idx) => {
            if (tile.val === 0) return <div key={idx} className="size-20 md:size-24" />;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => slide(idx)}
                className="flex size-20 flex-col items-center justify-center rounded-lg font-mono text-2xl font-bold transition-all hover:scale-95 md:size-24"
                style={{
                  background: CIRCUIT_COLORS[tile.circuit] + "22",
                  border: `2px solid ${CIRCUIT_COLORS[tile.circuit]}`,
                  color: CIRCUIT_COLORS[tile.circuit],
                  boxShadow: `0 0 8px ${CIRCUIT_COLORS[tile.circuit]}44`,
                }}
              >
                {tile.val}
                <span className="text-[8px] opacity-50">━━ {tile.circuit + 1}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 text-xs">
          {CIRCUIT_COLORS.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              <span className="inline-block size-3 rounded" style={{ background: c }} /> {i + 1}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted">Align numbers 1-8 AND matching circuit colors!</p>
      </div>
    </GameShell>
  );
}
