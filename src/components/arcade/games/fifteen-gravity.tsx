import { useState, useCallback, useEffect, useRef } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("fifteen-gravity")!;
const SIZE = 4;
const TOTAL = SIZE * SIZE;

export default function FifteenGravity() {
  const [tiles, setTiles] = useState<number[]>(() => {
    const t = Array.from({ length: TOTAL - 1 }, (_, i) => i + 1);
    t.push(0);
    for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; }
    return t;
  });
  const [moves, setMoves] = useState(0);
  const [over, setOver] = useState(false);
  const [pullCD, setPullCD] = useState(0);
  const [best, setBest] = usePersist("arcade-fifteen-best", 999);
  const timer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const empty = tiles.indexOf(0);

  const slide = useCallback(
    (idx: number) => {
      if (over) return;
      const r = Math.floor(idx / SIZE), c = idx % SIZE;
      const er = Math.floor(empty / SIZE), ec = empty % SIZE;
      if (Math.abs(r - er) + Math.abs(c - ec) !== 1) return;
      setTiles((prev) => {
        const nt = [...prev];
        [nt[idx], nt[empty]] = [nt[empty], nt[idx]];
        setMoves((m) => m + 1);
        if (nt.slice(0, TOTAL - 1).every((v, i) => v === i + 1)) {
          setOver(true);
          if (moves + 1 < best) setBest(moves + 1);
        }
        return nt;
      });
    },
    [over, empty, moves, best, setBest],
  );

  // Black hole pull every 5 seconds
  useEffect(() => {
    if (over) return;
    timer.current = setInterval(() => {
      setTiles((prev) => {
        const e = prev.indexOf(0);
        const r = Math.floor(e / SIZE), c = e % SIZE;
        const neighbors = [
          { idx: r > 0 ? e - SIZE : -1, dir: "down" },
          { idx: r < SIZE - 1 ? e + SIZE : -1, dir: "up" },
          { idx: c > 0 ? e - 1 : -1, dir: "right" },
          { idx: c < SIZE - 1 ? e + 1 : -1, dir: "left" },
        ].filter((n) => n.idx >= 0);
        if (neighbors.length === 0) return prev;
        const target = neighbors[Math.floor(Math.random() * neighbors.length)];
        const nt = [...prev];
        [nt[e], nt[target.idx]] = [nt[target.idx], nt[e]];
        return nt;
      });
    }, 5000);
    return () => clearInterval(timer.current);
  }, [over]);

  const reset = () => {
    const t = Array.from({ length: TOTAL - 1 }, (_, i) => i + 1);
    t.push(0);
    for (let i = t.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [t[i], t[j]] = [t[j], t[i]]; }
    setTiles(t);
    setMoves(0);
    setOver(false);
  };

  const colors = ["#3ee0d0", "#22c55e", "#f59e0b", "#ff6a3d", "#a855f7", "#ec4899", "#60a5fa", "#84cc16", "#fbbf24", "#06b6d4", "#8b5cf6", "#10b981", "#ef4444", "#d97706", "#0ea5e9"];

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${moves}`} best={best < 999 ? `${best}` : undefined}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{over ? "Solved! 🎉" : "Arrange 1-15 in order"}</p>
        <p className="text-xs text-ember">🕳️ Black hole pulls tiles every 5s!</p>
        <div className="grid grid-cols-4 gap-1 rounded-xl border-2 p-2" style={{ borderColor: G.accent + "44" }}>
          {tiles.map((val, idx) => {
            if (val === 0) return <div key={idx} className="flex size-16 items-center justify-center rounded-lg md:size-20" style={{ background: "var(--color-bg)", border: "2px dashed #ff6a3d44" }}><span className="text-lg">🕳️</span></div>;
            return (
              <button key={idx} type="button" disabled={over} onClick={() => slide(idx)} className="flex size-16 items-center justify-center rounded-lg font-mono text-2xl font-bold transition-all hover:scale-95 md:size-20" style={{ background: colors[val - 1] + "22", border: `2px solid ${colors[val - 1]}`, color: colors[val - 1], boxShadow: `0 0 8px ${colors[val - 1]}44` }}>
                {val}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted">Tap tiles to slide · Race the gravity shifts!</p>
      </div>
    </GameShell>
  );
}
