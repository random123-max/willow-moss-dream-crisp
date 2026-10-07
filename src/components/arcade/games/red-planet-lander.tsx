import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { usePersist, useKeys } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("red-planet-lander")!;
const W = 320, H = 400;

export default function RedPlanetLander() {
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [best, setBest] = usePersist("arcade-redplanet-best", Infinity);
  const [fuel, setFuel] = useState(100);
  const [thrust, setThrust] = useState(0);
  const keys = useKeys();
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef({
    x: 160, y: 50, vx: 1, vy: 0, rot: 0, drag: 0.01,
    pad: { x: 120, w: 80 },
    terrain: [] as number[],
  });

  useEffect(() => {
    const t: number[] = [];
    for (let i = 0; i < W; i++) {
      const base = H - 80 - Math.sin(i * 0.02) * 40 - Math.cos(i * 0.05) * 20;
      t.push(base);
    }
    s.current.pad = { x: 100 + Math.random() * 60, w: 80 };
    for (let i = s.current.pad.x; i < s.current.pad.x + s.current.pad.w; i++) {
      t[Math.floor(i)] = H - 100;
      t[Math.floor(i) + 1] = H - 100;
    }
    s.current.terrain = t;
  }, []);

  const reset = useCallback(() => {
    s.current.x = 160;
    s.current.y = 50;
    s.current.vx = 1;
    s.current.vy = 0;
    s.current.rot = 0;
    setFuel(100);
    setOver(false);
    setWon(false);
    setThrust(0);
    const t: number[] = [];
    for (let i = 0; i < W; i++) t.push(H - 80 - Math.sin(i * 0.02) * 40 - Math.cos(i * 0.05) * 20);
    s.current.pad = { x: 100 + Math.random() * 60, w: 80 };
    for (let i = s.current.pad.x; i < s.current.pad.x + s.current.pad.w; i++) { t[Math.floor(i)] = H - 100; t[Math.floor(i) + 1] = H - 100; }
    s.current.terrain = t;
  }, []);

  useEffect(() => {
    let raf: number;
    function loop() {
      if (over) return;
      const st = s.current;
      const k = keys.current;
      if (k.has("arrowleft")) st.rot -= 0.03;
      if (k.has("arrowright")) st.rot += 0.03;
      const isThrust = k.has("arrowup") && fuel > 0;
      setThrust(isThrust ? 1 : 0);
      if (isThrust) {
        const power = 0.15;
        st.vx += Math.sin(st.rot) * power;
        st.vy -= Math.cos(st.rot) * power;
        setFuel((f) => Math.max(0, f - 0.4));
      }
      // Gravity
      st.vy += 0.05;
      // Atmospheric drag
      st.vx *= 1 - st.drag;
      st.vy *= 1 - st.drag * 0.5;
      // Rotational inertia — rotation slowly returns to 0
      st.rot *= 0.995;
      st.x += st.vx;
      st.y += st.vy;
      if (st.x < 0) { st.x = 0; st.vx *= -0.5; }
      if (st.x > W) { st.x = W; st.vx *= -0.5; }

      // Terrain collision
      const groundY = st.terrain[Math.floor(Math.max(0, Math.min(W - 1, st.x)))] ?? H - 80;
      if (st.y >= groundY - 8) {
        const onPad = st.x >= st.pad.x && st.x <= st.pad.x + st.pad.w;
        const safeSpeed = Math.abs(st.vy) < 1.5 && Math.abs(st.vx) < 1 && Math.abs(st.rot) < 0.2;
        if (onPad && safeSpeed) {
          setWon(true);
          setOver(true);
          const score = Math.round(fuel + 100);
          if (score < best) setBest(score);
        } else {
          setOver(true);
        }
      }

      const c = canvas.current?.getContext("2d");
      if (!c) return;
      c.fillStyle = "#1a0505";
      c.fillRect(0, 0, W, H);
      // Stars
      c.fillStyle = "#ffffff33";
      for (let i = 0; i < 30; i++) c.fillRect((i * 37) % W, (i * 53) % (H - 100), 1, 1);
      // Terrain
      c.fillStyle = "#3d1a0d";
      c.beginPath();
      c.moveTo(0, H);
      st.terrain.forEach((ty, i) => c.lineTo(i, ty));
      c.lineTo(W, H);
      c.fill();
      // Pad
      c.fillStyle = G.accent;
      c.fillRect(st.pad.x, st.terrain[Math.floor(st.pad.x)] - 2, st.pad.w, 4);
      c.fillStyle = G.accent + "22";
      c.fillRect(st.pad.x, 0, st.pad.w, H);
      // Lander
      c.save();
      c.translate(st.x, st.y);
      c.rotate(st.rot);
      c.fillStyle = "#ece7de";
      c.fillRect(-6, -8, 12, 16);
      c.fillStyle = "#94a3b8";
      c.fillRect(-10, 4, 3, 4);
      c.fillRect(7, 4, 3, 4);
      if (isThrust) {
        c.fillStyle = "#ff6a3d";
        c.beginPath();
        c.moveTo(-4, 8);
        c.lineTo(0, 14 + Math.random() * 6);
        c.lineTo(4, 8);
        c.fill();
      }
      c.restore();
      // HUD
      c.fillStyle = "#8d968e";
      c.font = "9px monospace";
      c.fillText(`Fuel: ${Math.round(fuel)}`, 8, 14);
      c.fillText(`Vx: ${st.vx.toFixed(2)}`, 8, 26);
      c.fillText(`Vy: ${st.vy.toFixed(2)}`, 8, 38);
      c.fillText(`Rot: ${(st.rot * 180 / Math.PI).toFixed(0)}°`, 8, 50);
      c.fillText(`Thrust: ${thrust ? "ON" : "OFF"}`, 8, 62);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`⛽${Math.round(fuel)}`} best={best === Infinity ? undefined : `Best ${best}`}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        {won && <p className="font-display text-xl" style={{ color: G.accent }}>Safe landing on Mars! 🎉</p>}
        {over && !won && <p className="font-display text-xl text-ember">Crash landing! 💥</p>}
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%" }} />
        <p className="text-xs text-muted">↑ thrust · ←/→ rotate · Manage drag & inertia!</p>
      </div>
    </GameShell>
  );
}
