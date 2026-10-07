import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("hanoi-kinetic")!;
const DISKS = 5;
const WEIGHT_LIMIT = 10;

export default function HanoiKinetic() {
  const [pegs, setPegs] = useState<number[][]>([[5, 4, 3, 2, 1], [], []]);
  const [sel, setSel] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Move all disks to peg 3!");
  const [tipped, setTipped] = useState(false);

  const weights = [1, 2, 3, 5, 8]; // Fibonacci-ish for variety

  const move = useCallback(
    (to: number) => {
      if (over || sel === null) return;
      setPegs((prev) => {
        const np = prev.map((p) => [...p]);
        const from = sel;
        if (!np[from].length) return prev;
        const disk = np[from][np[from].length - 1];
        if (np[to].length && np[to][np[to].length - 1] <= disk) {
          setMsg("❌ Larger disk can't go on smaller!");
          return prev;
        }
        np[from].pop();
        np[to].push(disk);
        // Weight check
        const weight = np[to].reduce((a, d) => a + weights[d - 1], 0);
        if (weight > WEIGHT_LIMIT) {
          setMsg("⚠️ Column overloaded — disks scatter!");
          setTipped(true);
          // Scatter disks
          const allDisks = np.flat().sort((a, b) => b - a);
          np[0] = []; np[1] = []; np[2] = [];
          allDisks.forEach((d, i) => np[i % 3].push(d));
          setTimeout(() => setTipped(false), 1000);
        }
        setMoves((m) => m + 1);
        setSel(null);
        if (np[2].length === DISKS && np[2].every((d, i) => d === DISKS - i)) {
          setOver(true);
          setMsg(`Solved in ${moves + 1} moves! 🎉`);
        }
        return np;
      });
    },
    [over, sel, moves],
  );

  const reset = () => {
    setPegs([[5, 4, 3, 2, 1], [], []]);
    setSel(null);
    setMoves(0);
    setOver(false);
    setMsg("Move all disks to peg 3!");
    setTipped(false);
  };

  const colors = ["#3ee0d0", "#22c55e", "#f59e0b", "#ff6a3d", "#a855f7"];

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${moves} moves`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {tipped && <p className="text-sm text-ember animate-pulse">💥 Column tipped! Disks scattered!</p>}
        <div className="flex gap-6 md:gap-12">
          {pegs.map((peg, pi) => {
            const weight = peg.reduce((a, d) => a + weights[d - 1], 0);
            return (
              <button
                key={pi}
                type="button"
                onClick={() => {
                  if (sel === null) { if (peg.length) setSel(pi); }
                  else move(pi);
                }}
                className="relative flex h-48 w-20 flex-col items-center justify-end rounded-lg border-2 transition-all md:w-24"
                style={{ borderColor: sel === pi ? G.accent : "var(--color-line)", background: sel === pi ? G.accent + "11" : "var(--color-surface)" }}
              >
                {/* Base */}
                <div className="absolute bottom-2 h-32 w-1" style={{ background: "var(--color-line)" }} />
                {/* Weight indicator */}
                <span className="absolute top-1 text-[10px] font-mono" style={{ color: weight > WEIGHT_LIMIT * 0.7 ? "#ff6a3d" : "var(--color-muted)" }}>{weight}/{WEIGHT_LIMIT}</span>
                {/* Disks */}
                {peg.map((disk, di) => (
                  <div key={di} className="mb-0.5 rounded-md" style={{ width: `${20 + disk * 12}px`, height: 16, background: colors[disk - 1], boxShadow: `0 0 6px ${colors[disk - 1]}88` }} />
                ))}
                <span className="mt-1 text-xs text-muted">Peg {pi + 1}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted">Tap a peg to select, tap another to move</p>
      </div>
    </GameShell>
  );
}
