import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist, useKeys } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("frogger-quantum")!;
const W = 280, H = 360, CELL = 20, COLS = W / CELL, ROWS = H / CELL;

export default function FroggerQuantum() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-frogger-best", 0);
  const [over, setOver] = useState(false);
  const [rewind, setRewind] = useState(0);
  const keys = useKeys();
  const s = useRef({
    px: Math.floor(COLS / 2), py: ROWS - 1,
    lanes: [] as { y: number; speed: number; dir: number; offset: number }[],
    cars: [] as { lane: number; x: number }[],
    history: [] as { px: number; py: number }[],
    tick: 0, moveCD: 0,
  });

  useEffect(() => {
    const lanes = [
      { y: 3, speed: 1.5, dir: 1, offset: 0 },
      { y: 5, speed: 1, dir: -1, offset: 2 },
      { y: 7, speed: 2, dir: 1, offset: 4 },
      { y: 9, speed: 1.2, dir: -1, offset: 1 },
      { y: 11, speed: 1.8, dir: 1, offset: 3 },
      { y: 13, speed: 1, dir: -1, offset: 5 },
    ];
    s.current.lanes = lanes;
    const cars: { lane: number; x: number }[] = [];
    lanes.forEach((l, i) => {
      for (let j = 0; j < 4; j++) cars.push({ lane: i, x: j * 5 });
    });
    s.current.cars = cars;
  }, []);

  const reset = useCallback(() => {
    s.current = { px: Math.floor(COLS / 2), py: ROWS - 1, lanes: s.current.lanes, cars: s.current.cars, history: [], tick: 0, moveCD: 0 };
    setScore(0);
    setOver(false);
    setRewind(0);
  }, []);

  useGameLoop(() => {
    if (over) return;
    const st = s.current;
    const k = keys.current;
    st.tick++;
    if (st.moveCD > 0) st.moveCD--;

    // Temporal loops — cars move in alternating patterns
    st.cars.forEach((c) => {
      const lane = st.lanes[c.lane];
      c.x += lane.speed * lane.dir * 0.1;
      if (c.x < 0) c.x += COLS;
      if (c.x >= COLS) c.x -= COLS;
    });

    // Move
    if (st.moveCD === 0) {
      if (k.has("arrowleft") && st.px > 0) { st.history.push({ px: st.px, py: st.py }); st.px--; st.moveCD = 8; }
      if (k.has("arrowright") && st.px < COLS - 1) { st.history.push({ px: st.px, py: st.py }); st.px++; st.moveCD = 8; }
      if (k.has("arrowup") && st.py > 0) { st.history.push({ px: st.px, py: st.py }); st.py--; st.moveCD = 8; }
      if (k.has("arrowdown") && st.py < ROWS - 1) { st.history.push({ px: st.px, py: st.py }); st.py++; st.moveCD = 8; }
    }

    // Collision
    for (const c of st.cars) {
      const lane = st.lanes[c.lane];
      if (Math.abs(c.x - st.px) < 0.8 && lane.y === st.py) {
        if (rewind === 0 && st.history.length >= 18) {
          // Rewind 3 seconds (18 moves at 8 ticks)
          const past = st.history.slice(-18);
          const pos = past[0];
          st.px = pos.px;
          st.py = pos.py;
          setRewind(3);
          setScore((sc) => Math.max(0, sc - 5));
        } else {
          setOver(true);
          if (score > best) setBest(score);
        }
      }
    }
    if (rewind > 0) setRewind((r) => r - 1);

    // Win condition — reach top
    if (st.py === 0) {
      setScore((sc) => sc + 50);
      st.py = ROWS - 1;
      st.px = Math.floor(COLS / 2);
      st.history = [];
    }

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    // Goal zone
    c.fillStyle = G.accent + "22";
    c.fillRect(0, 0, W, CELL);
    // Lanes
    st.lanes.forEach((l) => { c.fillStyle = "#24324033"; c.fillRect(0, l.y * CELL, W, CELL); });
    // Cars
    st.cars.forEach((car) => {
      const l = st.lanes[car.lane];
      c.fillStyle = "#ff6a3d";
      c.fillRect(car.x * CELL + 2, l.y * CELL + 3, CELL - 4, CELL - 6);
    });
    // Frog
    c.fillStyle = rewind > 0 ? "#a855f7" : G.accent;
    c.shadowColor = c.fillStyle;
    c.shadowBlur = 8;
    c.beginPath();
    c.arc(st.px * CELL + CELL / 2, st.py * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    c.fill();
    c.shadowBlur = 0;
    c.fillStyle = "#071018";
    c.font = "10px monospace";
    c.fillText("🐸", st.px * CELL + 5, st.py * CELL + 14);
    if (rewind > 0) { c.fillStyle = "#a855f7"; c.font = "14px monospace"; c.fillText("⏪ REWIND!", W / 2 - 30, 20); }
  });

  const canvas = useRef<HTMLCanvasElement>(null);

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%" }} />
        <p className="text-xs text-muted">Arrow keys · Avoid your past timeline!</p>
      </div>
    </GameShell>
  );
}
