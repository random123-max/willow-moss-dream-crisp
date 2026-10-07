import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist, useKeys } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("midnight-zombie")!;
const W = 320, H = 400;

export default function MidnightZombie() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-zombie-best", 0);
  const [over, setOver] = useState(false);
  const [battery, setBattery] = useState(100);
  const [ammo, setAmmo] = useState(15);
  const keys = useKeys();
  const canvas = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: W / 2, y: H / 2 });
  const s = useRef({
    x: W / 2, y: H / 2, zombies: [] as { x: number; y: number; vx: number; vy: number }[],
    bullets: [] as { x: number; y: number; vx: number; vy: number }[], noise: 0, tick: 0, fireCD: 0,
  });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const r = canvas.current?.getBoundingClientRect();
      if (r) mouse.current = { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
    };
    const click = () => {
      if (over || s.current.fireCD > 0 || ammo <= 0) return;
      const dx = mouse.current.x - s.current.x, dy = mouse.current.y - s.current.y;
      const d = Math.hypot(dx, dy) || 1;
      s.current.bullets.push({ x: s.current.x, y: s.current.y, vx: (dx / d) * 6, vy: (dy / d) * 6 });
      setAmmo((a) => a - 1);
      s.current.fireCD = 10;
      s.current.noise = 30; // Gunfire attracts zombies
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", click);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mousedown", click); };
  });

  const reset = useCallback(() => {
    s.current = { x: W / 2, y: H / 2, zombies: [], bullets: [], noise: 0, tick: 0, fireCD: 0 };
    setScore(0);
    setBattery(100);
    setAmmo(15);
    setOver(false);
  }, []);

  useGameLoop(() => {
    if (over) return;
    const st = s.current;
    const k = keys.current;
    st.tick++;
    if (st.fireCD > 0) st.fireCD--;
    if (k.has("w")) st.y = Math.max(10, st.y - 2);
    if (k.has("s")) st.y = Math.min(H - 10, st.y + 2);
    if (k.has("a")) st.x = Math.max(10, st.x - 2);
    if (k.has("d")) st.x = Math.min(W - 10, st.x + 2);

    // Battery drain
    if (st.tick % 30 === 0) setBattery((b) => Math.max(0, b - 1));
    if (battery <= 0) { setOver(true); if (score > best) setBest(score); }

    // Spawn zombies — more if noise
    const spawnRate = st.noise > 0 ? 0.04 : 0.015;
    if (Math.random() < spawnRate) {
      const side = Math.floor(Math.random() * 4);
      const x = side === 0 ? 0 : side === 1 ? W : Math.random() * W;
      const y = side < 2 ? Math.random() * H : side === 2 ? 0 : H;
      st.zombies.push({ x, y, vx: 0, vy: 0 });
    }
    if (st.noise > 0) st.noise--;

    // Zombies chase player
    st.zombies.forEach((z) => {
      const dx = st.x - z.x, dy = st.y - z.y;
      const d = Math.hypot(dx, dy) || 1;
      z.vx = (dx / d) * 0.8;
      z.vy = (dy / d) * 0.8;
      z.x += z.vx;
      z.y += z.vy;
      if (d < 12) { setOver(true); if (score > best) setBest(score); }
    });

    // Bullets
    st.bullets = st.bullets.map((b) => ({ ...b, x: b.x + b.vx, y: b.vy + b.vy })).filter((b) => b.x > 0 && b.x < W && b.y > 0 && b.y < H);
    st.bullets = st.bullets.filter((b) => {
      for (let i = 0; i < st.zombies.length; i++) {
        if (Math.hypot(b.x - st.zombies[i].x, b.y - st.zombies[i].y) < 12) {
          st.zombies.splice(i, 1);
          setScore((sc) => sc + 15);
          return false;
        }
      }
      return true;
    });

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    // Flashlight
    if (battery > 0) {
      const ang = Math.atan2(mouse.current.y - st.y, mouse.current.x - st.x);
      const grad = c.createRadialGradient(st.x, st.y, 0, st.x, st.y, 120);
      grad.addColorStop(0, "rgba(255,255,200,0.15)");
      grad.addColorStop(1, "transparent");
      c.save();
      c.beginPath();
      c.moveTo(st.x, st.y);
      c.arc(st.x, st.y, 120, ang - 0.5, ang + 0.5);
      c.closePath();
      c.fillStyle = grad;
      c.fill();
      c.restore();
    }
    // Player
    c.fillStyle = G.accent;
    c.beginPath(); c.arc(st.x, st.y, 6, 0, Math.PI * 2); c.fill();
    c.strokeStyle = "#ece7de";
    c.beginPath(); c.moveTo(st.x, st.y); c.lineTo(mouse.current.x, mouse.current.y); c.stroke();
    // Zombies
    c.fillStyle = "#84cc16";
    st.zombies.forEach((z) => { c.beginPath(); c.arc(z.x, z.y, 5, 0, Math.PI * 2); c.fill(); });
    // Bullets
    c.fillStyle = "#fbbf24";
    st.bullets.forEach((b) => { c.beginPath(); c.arc(b.x, b.y, 2, 0, Math.PI * 2); c.fill(); });
    // HUD
    c.fillStyle = "#8d968e";
    c.font = "9px monospace";
    c.fillText(`🔋${Math.round(battery)} 🔫${ammo} Score:${score}`, 8, 12);
    if (st.noise > 0) { c.fillStyle = "#ff6a3d"; c.fillText("💥 NOISE!", 8, 24); }
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%", cursor: "crosshair" }} />
        <p className="text-xs text-muted">WASD move · Mouse aim · Click shoot</p>
      </div>
    </GameShell>
  );
}
