import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useKeys } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("logic-cube-ink")!;
const W = 280, H = 280, CELL = 35;
const COLS = Math.floor(W / CELL), ROWS = Math.floor(H / CELL);
const FACE_SYMBOLS = ["\u25C6", "\u25B2", "\u25CF", "\u25A0", "\u2605", "\u2726"];

export default function LogicCubeInk() {
  const [painted, setPainted] = useState<Set<string>>(new Set());
  const [moves, setMoves] = useState(0);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Roll the cube to paint the grid!");
  const keys = useKeys();
  const cube = useRef({ bottom: 0, front: 1, right: 2 });
  const goal = useRef(new Set<string>());
  const pos = useRef({ x: 0, y: ROWS - 1 });

  useEffect(() => {
    const g = new Set<string>();
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      if (Math.random() < 0.5) g.add(`${r + 1},${c + 1}`);
    }
    if (g.size === 0) g.add("1,1");
    goal.current = g;
  }, []);

  const roll = useCallback((dir: "up" | "down" | "left" | "right") => {
    if (over) return;
    const c = cube.current;
    const p = pos.current;
    if (dir === "up" && p.y > 0) {
      p.y--;
      const oldBottom = c.bottom;
      c.bottom = c.front;
      c.front = 5 - oldBottom;
    } else if (dir === "down" && p.y < ROWS - 1) {
      p.y++;
      const oldFront = c.front;
      c.front = c.bottom;
      c.bottom = 5 - oldFront;
    } else if (dir === "left" && p.x > 0) {
      p.x--;
      const oldBottom = c.bottom;
      c.bottom = c.right;
      c.right = 5 - oldBottom;
    } else if (dir === "right" && p.x < COLS - 1) {
      p.x++;
      const oldRight = c.right;
      c.right = c.bottom;
      c.bottom = 5 - oldRight;
    } else return;

    setPainted((prev) => {
      const np = new Set(prev);
      np.add(`${p.x},${p.y}:${c.bottom}`);
      return np;
    });
    setMoves((m) => m + 1);
  }, [over]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const map: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
      };
      if (map[e.key]) { e.preventDefault(); roll(map[e.key]); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [roll]);

  const reset = useCallback(() => {
    pos.current = { x: 0, y: ROWS - 1 };
    cube.current = { bottom: 0, front: 1, right: 2 };
    setPainted(new Set());
    setMoves(0);
    setOver(false);
    setMsg("Roll the cube to paint the grid!");
    const g = new Set<string>();
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (Math.random() < 0.5) g.add(`${r + 1},${c + 1}`);
    if (g.size === 0) g.add("1,1");
    goal.current = g;
  }, []);

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${moves} rolls`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        <div className="flex flex-col items-center gap-1">
          <p className="text-xs text-muted">Goal Pattern:</p>
          <div className="grid grid-cols-5 gap-0.5">
            {Array.from({ length: 5 }, (_, r) =>
              Array.from({ length: 5 }, (_, c) => (
                <div key={`${r}-${c}`} className="size-4 rounded-sm" style={{ background: goal.current.has(`${r},${c}`) ? G.accent + "44" : "var(--color-surface)", border: "1px solid var(--color-line)" }} />
              )),
            )}
          </div>
        </div>
        <div className="grid gap-0.5 rounded-lg border-2 p-1" style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, borderColor: G.accent + "44" }}>
          {Array.from({ length: ROWS }, (_, r) =>
            Array.from({ length: COLS }, (_, c) => {
              const isCube = pos.current.x === c && pos.current.y === r;
              const paintedHere = [...painted].find((p) => p.startsWith(`${c},${r}:`));
              const faceNum = paintedHere ? parseInt(paintedHere.split(":")[1]) : -1;
              return (
                <div key={`${r}-${c}`} className="flex items-center justify-center" style={{ width: CELL, height: CELL, background: paintedHere ? G.accent + "11" : "var(--color-surface)", border: `1px solid ${isCube ? G.accent : "var(--color-line)"}` }}>
                  {isCube && <span className="text-lg" style={{ color: G.accent }}>{"\uD83C\uDFB2"}</span>}
                  {paintedHere && !isCube && <span className="text-sm">{FACE_SYMBOLS[faceNum]}</span>}
                </div>
              );
            }),
          )}
        </div>
        <div className="flex gap-2 text-xs text-muted">
          <span>Bottom: {FACE_SYMBOLS[cube.current.bottom]}</span>
          <span>Front: {FACE_SYMBOLS[cube.current.front]}</span>
          <span>Right: {FACE_SYMBOLS[cube.current.right]}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <div />
          <button type="button" onClick={() => roll("up")} className="rounded border border-line px-4 py-1.5 text-sm">{"\u2191"}</button>
          <div />
          <button type="button" onClick={() => roll("left")} className="rounded border border-line px-4 py-1.5 text-sm">{"\u2190"}</button>
          <button type="button" onClick={() => roll("down")} className="rounded border border-line px-4 py-1.5 text-sm">{"\u2193"}</button>
          <button type="button" onClick={() => roll("right")} className="rounded border border-line px-4 py-1.5 text-sm">{"\u2192"}</button>
        </div>
        <p className="text-xs text-muted">Arrow keys to roll. Bottom face paints the floor.</p>
      </div>
    </GameShell>
  );
}
