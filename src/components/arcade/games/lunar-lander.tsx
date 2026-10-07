import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist, useKeys } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("lunar-lander")!;
const W = 320, H = 400;

export default function LunarLander() {
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [best, setBest] = usePersist("arcade-lander-best", Infinity);
  const [fuel, setFuel] = useState(100);
  const keys = useKeys();
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef({
    x: 160, y: 50, vx: 0.5, vy: 0, rot: 0, wind: 0.02, thrusting: false,
    pad: { x: 120, w: 80 },
    terrain: [] as number[],
    damage: { l: 100, r: 100, t: 100, b: 100 },
    tick: 0,
  });

  useEffect(() => {
    const t: number[] = [];
    for (let i = 0; i < W; i++) t.push(H - 60 - Math.sin(i * 0.03) * 30 - Math.random() * 10);
    s.current.terrain = t;
    s.current.pad = { x: 100 + Math.random() * 80, w: 80 };
    for (let i = s.current.pad.x; i < s.current.pad.x + s.current.pad.w; i++) t[Math.floor(i)] = H - 80;
  }, []);

  const reset = useCallback(() => {
    s.current = {
      x: 160, y: 50, vx: 0.5, vy: 0, rot: 0, wind: 0.02, thrusting: false,
      pad: { x: 100 + Math.random() * 80, w: 80 },
      terrain: (() => { const t: number[] = []; for (let i = 0; i < W; i++) t.push(H - 60 - Math.sin(i * 0.03) * 30 - Math.random() * 10); for (let i = s.current.pad.x; i < s.current.pad.x + s.current.pad.w; i++) t[Math.floor(i)] = H - 80; return t; })(),
      damage: { l: 100, r: 100, t: 100, b: 100 },
      tick: 0,
    };
    setFuel(100);
    setOver(false);
    setWon(false);
  }, []);

  useGameLoop(() => {
    if (over) return;
    const st = s.current;
    const k = keys.current;
    if (k.has("arrowleft")) st.rot -= 0.05;
    if (k.has("arrowright")) st.rot += 0.05;
    st.thrusting = k.has("arrowup") && fuel > 0;
    if (st.thrusting) {
      st.vx += Math.sin(st.rot) * 0.08;
      st.vy -= Math.cos(st.rot) * 0.15;
      setFuel((f) => Math.max(0, f - 0.3));
    }
    st.vx += st.wind * Math.sin(st.tick);
    st.vy += 0.06; // gravity
    st.x += st.vx;
    st.y += st.vy;
    if (st.x < 0) st.x = 0;
    if (st.x > W) st.x = W;
    st.tick++;

    // Terrain collision
    const groundY = st.terrain[Math.floor(st.x)] ?? H - 60;
    if (st.y >= groundY - 10) {
      const onPad = st.x >= st.pad.x && st.x <= st.pad.x + st.pad.w;
      const safeSpeed = Math.abs(st.vy) < 2 && Math.abs(st.vx) < 1 && Math.abs(st.rot) < 0.3;
      if (onPad && safeSpeed) {
        setWon(true);
        setOver(true);
        const score = Math.round(fuel);
        if (score < best) setBest(score);
      } else {
        // Damage based on angle
        const ang = Math.abs(st.rot);
        if (ang > 0.5) st.damage.l = Math.max(0, st.damage.l - 30);
        if (ang > 1) st.damage.r = Math.max(0, st.damage.r - 30);
        if (Math.abs(st.vy) > 3) st.damage.b = Math.max(0, st.damage.b - 40);
        if (Math.abs(st.vx) > 2) { st.damage.l -= 20; st.damage.r -= 20; }
        setOver(true);
      }
    }

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    // Terrain
    c.fillStyle = "#1a2a38";
    c.beginPath();
    c.moveTo(0, H);
    st.terrain.forEach((ty, i) => c.lineTo(i, ty));
    c.lineTo(W, H);
    c.fill();
    // Pad
    c.fillStyle = G.accent;
    c.fillRect(st.pad.x, st.terrain[Math.floor(st.pad.x)] - 2, st.pad.w, 4);
    c.fillStyle = G.accent + "33";
    c.fillRect(st.pad.x, 0, st.pad.w, H);
    // Lander
    c.save();
    c.translate(st.x, st.y);
    c.rotate(st.rot);
    c.strokeStyle = "#ece7de";
    c.lineWidth = 2;
    c.beginPath();
    c.moveTo(0, -8); c.lineTo(-6, 6); c.lineTo(-3, 4); c.lineTo(3, 4); c.lineTo(6, 6); c.closePath();
    c.stroke();
    if (st.thrusting) {
      c.fillStyle = "#ff6a3d";
      c.beginPath();
      c.moveTo(-3, 5); c.lineTo(0, 12 + Math.random() * 4); c.lineTo(3, 5); c.fill();
    }
    c.restore();
    // HUD
    c.fillStyle = "#8d968e";
    c.font = "10px monospace";
    c.fillText(`Fuel: ${Math.round(fuel)}`, 8, 15);
    c.fillText(`Vy: ${st.vy.toFixed(1)}`, 8, 28);
    c.fillText(`Vx: ${st.vx.toFixed(1)}`, 8, 41);
    c.fillText(`Ang: ${(st.rot * 180 / Math.PI).toFixed(0)}°`, 8, 54);
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`⛽${Math.round(fuel)}`} best={best === Infinity ? undefined : `⛽${best}`}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        {won && <p className="font-display text-xl" style={{ color: G.accent }}>Safe landing! 🎉</p>}
        {over && !won && <p className="font-display text-xl text-ember">Crash! 💥</p>}
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%" }} />
        <p className="text-xs text-muted">↑ thrust · ←/→ rotate · Land soft on green pad</p>
      </div>
    </GameShell>
  );
}
