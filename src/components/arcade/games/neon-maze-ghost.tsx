import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist, useKeys } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("neon-maze-ghost")!;
const W = 280, H = 280, CELL = 20, COLS = W / CELL, ROWS = H / CELL;
const MAZE = [
  "1111111111111111", "1000000010000010", "1011110010111110", "1010000010100010",
  "1010111110100010", "1010100000100010", "1010101111101110", "1010100000000010",
  "1010111110111110", "1000000010000010", "1011111010111110", "1000001010000010",
  "1110111010111110", "1000000000000010", "1111111111111110", "1111111111111111",
];
// Simpler maze:
const M = [
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,
  1,0,0,0,0,1,0,0,0,0,0,0,0,1,
  1,0,1,1,0,1,0,1,1,1,1,1,0,1,
  1,0,1,0,0,0,0,0,0,0,0,1,0,1,
  1,0,1,0,1,1,1,1,1,1,0,1,0,1,
  1,0,0,0,1,0,0,0,0,1,0,0,0,1,
  1,1,1,0,1,0,1,1,0,1,1,1,0,1,
  1,0,0,0,0,0,1,0,0,0,0,0,0,1,
  1,0,1,1,1,1,1,0,1,1,1,1,0,1,
  1,0,0,0,0,0,0,0,0,0,0,1,0,1,
  1,1,1,1,1,1,1,1,1,1,1,1,1,1,
];
const MW = 14, MH = 11;

export default function NeonMazeGhost() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-maze-best", 0);
  const [over, setOver] = useState(false);
  const [traps, setTraps] = useState(3);
  const keys = useKeys();
  const s = useRef({
    px: 1, py: 1, ghosts: [{ x: MW - 2, y: MH - 2, type: "chase", stun: 0 }, { x: 7, y: 5, type: "flank", stun: 0 }, { x: 1, y: 9, type: "ambush", stun: 0 }],
    dots: new Set<number>(), placedTraps: new Set<number>(), tick: 0, dir: { x: 0, y: 0 },
  });

  useEffect(() => {
    const dots = new Set<number>();
    for (let i = 0; i < M.length; i++) if (M[i] === 0) dots.add(i);
    s.current.dots = dots;
  }, []);

  const reset = useCallback(() => {
    const dots = new Set<number>();
    for (let i = 0; i < M.length; i++) if (M[i] === 0) dots.add(i);
    s.current = { px: 1, py: 1, ghosts: [{ x: MW - 2, y: MH - 2, type: "chase", stun: 0 }, { x: 7, y: 5, type: "flank", stun: 0 }, { x: 1, y: 9, type: "ambush", stun: 0 }], dots, placedTraps: new Set(), tick: 0, dir: { x: 0, y: 0 } };
    setScore(0);
    setOver(false);
    setTraps(3);
  }, []);

  const placeTrap = useCallback(() => {
    if (traps <= 0) return;
    const idx = s.current.py * MW + s.current.px;
    if (M[idx] !== 0) return;
    s.current.placedTraps.add(idx);
    setTraps((t) => t - 1);
  }, [traps]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Enter") placeTrap(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  useGameLoop(() => {
    if (over) return;
    const st = s.current;
    const k = keys.current;
    st.tick++;
    if (st.tick % 8 === 0) {
      if (k.has("arrowleft") && M[st.py * MW + (st.px - 1)] === 0) st.px--;
      if (k.has("arrowright") && M[st.py * MW + (st.px + 1)] === 0) st.px++;
      if (k.has("arrowup") && M[(st.py - 1) * MW + st.px] === 0) st.py--;
      if (k.has("arrowdown") && M[(st.py + 1) * MW + st.px] === 0) st.py++;
    }
    // Collect dots
    const idx = st.py * MW + st.px;
    if (st.dots.has(idx)) { st.dots.delete(idx); setScore((sc) => sc + 10); }
    if (st.dots.size === 0) { setOver(true); if (score > best) setBest(score); }

    // Ghost movement
    if (st.tick % 15 === 0) {
      st.ghosts.forEach((g) => {
        if (g.stun > 0) { g.stun--; return; }
        let dx = st.px - g.x, dy = st.py - g.y;
        if (g.type === "flank") { dx = -dx; dy = -dy; }
        const moves = [];
        if (dx > 0 && M[g.y * MW + (g.x + 1)] === 0) moves.push([1, 0]);
        if (dx < 0 && M[g.y * MW + (g.x - 1)] === 0) moves.push([-1, 0]);
        if (dy > 0 && M[(g.y + 1) * MW + g.x] === 0) moves.push([0, 1]);
        if (dy < 0 && M[(g.y - 1) * MW + g.x] === 0) moves.push([0, -1]);
        if (moves.length) {
          const [mx, my] = moves[Math.floor(Math.random() * moves.length)];
          g.x += mx; g.y += my;
        }
        // Trap check
        const gidx = g.y * MW + g.x;
        if (st.placedTraps.has(gidx)) { g.stun = 30; st.placedTraps.delete(gidx); }
        // Catch
        if (g.x === st.px && g.y === st.py) { setOver(true); if (score > best) setBest(score); }
      });
    }
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        <div className="flex gap-3 text-sm">
          <span className="text-muted">Dots: {score / 10}</span>
          <span style={{ color: G.accent }}>Traps: {traps}</span>
        </div>
        <div className="grid gap-px rounded-lg border-2 p-1" style={{ gridTemplateColumns: `repeat(${MW}, 1fr)`, borderColor: G.accent + "44" }}>
          {M.map((cell, i) => {
            const r = Math.floor(i / MW), c = i % MW;
            const isPlayer = s.current.px === c && s.current.py === r;
            const isGhost = s.current.ghosts.some((g) => g.x === c && g.y === r);
            const isDot = s.current.dots.has(i);
            const isTrap = s.current.placedTraps.has(i);
            return (
              <div key={i} className="size-5 md:size-6" style={{ background: cell ? "var(--color-line)" : "var(--color-bg)", borderRadius: 2 }}>
                {isPlayer && <div className="size-3 mx-auto mt-0.5 rounded-full" style={{ background: G.accent, boxShadow: `0 0 6px ${G.accent}` }} />}
                {isGhost && <div className="size-3 mx-auto mt-0.5 text-center text-sm" style={{ opacity: s.current.ghosts.find((g) => g.x === c && g.y === r)?.stun ? 0.4 : 1 }}>👻</div>}
                {isDot && !isPlayer && <div className="size-1 mx-auto mt-1.5 rounded-full bg-muted" />}
                {isTrap && <div className="size-2 mx-auto mt-1 rounded" style={{ background: "#fbbf24" }} />}
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted">Arrow keys to move · Enter to place trap</p>
      </div>
    </GameShell>
  );
}
