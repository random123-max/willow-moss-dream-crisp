import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("dots-boxes")!;
const SIZE = 4; // dots = SIZE+1, cells = SIZE
type Edge = "h" | "v";
type LineKey = string; // "h-r-c" or "v-r-c"

export default function DotsBoxes() {
  const [lines, setLines] = useState<Set<LineKey>>(new Set());
  const [boxes, setBoxes] = useState<Record<string, 1 | 2>>({});
  const [turn, setTurn] = useState<1 | 2>(1);
  const [res, setRes] = useState({ 1: 0, 2: 0 });
  const [msg, setMsg] = useState("Draw a line!");
  const [over, setOver] = useState(false);

  const drawLine = useCallback(
    (key: LineKey) => {
      if (over || lines.has(key)) return;
      const nl = new Set(lines);
      nl.add(key);
      setLines(nl);
      // Check for completed boxes
      let claimed = false;
      const nb = { ...boxes };
      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const boxKey = `${r},${c}`;
          if (nb[boxKey]) continue;
          if (nl.has(`h-${r}-${c}`) && nl.has(`h-${r + 1}-${c}`) && nl.has(`v-${r}-${c}`) && nl.has(`v-${r}-${c + 1}`)) {
            nb[boxKey] = turn;
            claimed = true;
          }
        }
      }
      setBoxes(nb);
      const p1 = Object.values(nb).filter((o) => o === 1).length;
      const p2 = Object.values(nb).filter((o) => o === 2).length;
      setRes({ 1: p1, 2: p2 });
      if (p1 + p2 >= SIZE * SIZE) {
        setOver(true);
        setMsg(p1 > p2 ? "You win! 🎉" : p1 < p2 ? "AI wins!" : "Draw!");
        return;
      }
      if (!claimed) {
        setTurn(turn === 1 ? 2 : 1);
        setMsg(turn === 1 ? "AI's turn..." : "Your turn");
        // AI move
        setTimeout(() => {
          setLines((prev) => {
            const avail: LineKey[] = [];
            for (let r = 0; r <= SIZE; r++)
              for (let c = 0; c < SIZE; c++) {
                if (!prev.has(`h-${r}-${c}`)) avail.push(`h-${r}-${c}`);
                if (r < SIZE && !prev.has(`v-${r}-${c}`)) avail.push(`v-${r}-${c}`);
              }
            if (!avail.length) return prev;
            const key = avail[Math.floor(Math.random() * avail.length)];
            const n = new Set(prev);
            n.add(key);
            const ab = { ...nb };
            let aiClaimed = false;
            for (let r = 0; r < SIZE; r++)
              for (let c = 0; c < SIZE; c++) {
                if (ab[`${r},${c}`]) continue;
                if (n.has(`h-${r}-${c}`) && n.has(`h-${r + 1}-${c}`) && n.has(`v-${r}-${c}`) && n.has(`v-${r}-${c + 1}`)) {
                  ab[`${r},${c}`] = 2;
                  aiClaimed = true;
                }
              }
            setBoxes(ab);
            const np1 = Object.values(ab).filter((o) => o === 1).length;
            const np2 = Object.values(ab).filter((o) => o === 2).length;
            setRes({ 1: np1, 2: np2 });
            if (np1 + np2 >= SIZE * SIZE) {
              setOver(true);
              setMsg(np1 > np2 ? "You win!" : np1 < np2 ? "AI wins!" : "Draw!");
            } else if (!aiClaimed) {
              setTurn(1);
              setMsg("Your turn");
            }
            return n;
          });
        }, 500);
      } else {
        setMsg(turn === 1 ? "Box claimed! Bonus turn!" : "AI claimed a box!");
      }
    },
    [lines, boxes, turn, over],
  );

  const reset = () => {
    setLines(new Set());
    setBoxes({});
    setTurn(1);
    setRes({ 1: 0, 2: 0 });
    setMsg("Draw a line!");
    setOver(false);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${res[1]} : ${res[2]}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-muted">{msg}</p>
        <div className="relative">
          <svg viewBox={`0 0 ${SIZE * 50} ${SIZE * 50}`} className="touch-none" style={{ width: Math.min(window.innerWidth - 48, 320) }}>
            {/* Boxes */}
            {Object.entries(boxes).map(([key, owner]) => {
              const [r, c] = key.split(",").map(Number);
              return (
                <rect key={key} x={c * 50 + 4} y={r * 50 + 4} width={42} height={42} rx={4} fill={owner === 1 ? G.accent + "33" : "#ff6a3d33"} />
              );
            })}
            {/* Lines */}
            {[...lines].map((key) => {
              const [type, r, c] = key.split("-");
              const ri = +r, ci = +c;
              if (type === "h") return <line key={key} x1={ci * 50} y1={ri * 50} x2={(ci + 1) * 50} y2={ri * 50} stroke={G.accent} strokeWidth={3} />;
              return <line key={key} x1={ci * 50} y1={ri * 50} x2={ci * 50} y2={(ri + 1) * 50} stroke={G.accent} strokeWidth={3} />;
            })}
            {/* Dots */}
            {Array.from({ length: SIZE + 1 }, (_, r) =>
              Array.from({ length: SIZE + 1 }, (_, c) => (
                <circle key={`${r}-${c}`} cx={c * 50} cy={r * 50} r={3} fill="var(--color-fg)" />
              )),
            )}
            {/* Clickable areas */}
            {Array.from({ length: SIZE + 1 }, (_, r) =>
              Array.from({ length: SIZE }, (_, c) => (
                <line key={`ch-${r}-${c}`} x1={c * 50} y1={r * 50} x2={(c + 1) * 50} y2={r * 50} stroke="transparent" strokeWidth={16} onClick={() => drawLine(`h-${r}-${c}`)} style={{ cursor: "pointer" }} />
              )),
            )}
            {Array.from({ length: SIZE }, (_, r) =>
              Array.from({ length: SIZE + 1 }, (_, c) => (
                <line key={`cv-${r}-${c}`} x1={c * 50} y1={r * 50} x2={c * 50} y2={(r + 1) * 50} stroke="transparent" strokeWidth={16} onClick={() => drawLine(`v-${r}-${c}`)} style={{ cursor: "pointer" }} />
              )),
            )}
          </svg>
        </div>
      </div>
    </GameShell>
  );
}
