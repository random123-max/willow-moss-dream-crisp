import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist, useKeys } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("asteroids-vector")!;
const W = 320, H = 400;

type Vec = { x: number; y: number };
type Ast = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vrot: number };
type Well = { x: number; y: number; r: number; life: number };

export default function AsteroidsVector() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-asteroids-best", 0);
  const [over, setOver] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const s = useRef({
    ship: { x: W / 2, y: H / 2, vx: 0, vy: 0, rot: 0, shield: 3 } as { x: number; y: number; vx: number; vy: number; rot: number; shield: number },
    bullets: [] as Vec[],
    asts: [] as Ast[],
    wells: [] as Well[],
    fireCD: 0,
  });

  useEffect(() => {
    const spawn = (r: number, x?: number, y?: number): Ast => ({
      x: x ?? Math.random() * W, y: y ?? Math.random() * H,
      vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2, r,
      rot: 0, vrot: (Math.random() - 0.5) * 0.1,
    });
    s.current.asts = [spawn(30), spawn(25), spawn(20), spawn(20)];
  }, []);

  const reset = useCallback(() => {
    s.current = {
      ship: { x: W / 2, y: H / 2, vx: 0, vy: 0, rot: 0, shield: 3 },
      bullets: [], asts: [{ x: 50, y: 50, vx: 1, vy: 1, r: 30, rot: 0, vrot: 0.05 }, { x: 250, y: 200, vx: -1, vy: 1, r: 25, rot: 0, vrot: -0.03 }], wells: [], fireCD: 0,
    };
    setScore(0);
    setOver(false);
  }, []);

  useGameLoop(() => {
    if (over) return;
    const st = s.current;
    const k = keys.current;
    if (k.has("arrowleft")) st.ship.rot -= 0.08;
    if (k.has("arrowright")) st.ship.rot += 0.08;
    if (k.has("arrowup")) {
      st.ship.vx += Math.cos(st.ship.rot) * 0.15;
      st.ship.vy += Math.sin(st.ship.rot) * 0.15;
    }
    st.ship.x = (st.ship.x + st.ship.vx + W) % W;
    st.ship.y = (st.ship.y + st.ship.vy + H) % H;
    st.ship.vx *= 0.99; st.ship.vy *= 0.99;
    if (st.fireCD > 0) st.fireCD--;
    if (k.has(" ") && st.fireCD === 0) {
      st.bullets.push({ x: st.ship.x + Math.cos(st.ship.rot) * 10, y: st.ship.y + Math.sin(st.ship.rot) * 10 });
      st.fireCD = 12;
    }
    st.bullets = st.bullets.map((b) => ({ x: b.x + Math.cos(st.ship.rot) * 4, y: b.y + Math.sin(st.ship.rot) * 4 })).filter((b) => b.x > 0 && b.x < W && b.y > 0 && b.y < H);

    // Gravity wells pull ship
    st.wells.forEach((w) => {
      const dx = w.x - st.ship.x, dy = w.y - st.ship.y;
      const d = Math.hypot(dx, dy);
      if (d < w.r) { st.ship.vx += (dx / d) * 0.1; st.ship.vy += (dy / d) * 0.1; }
    });
    st.wells = st.wells.filter((w) => --w.life > 0);

    // Asteroids
    st.asts.forEach((a) => { a.x += a.vx; a.y += a.vy; a.rot += a.vrot; if (a.x < 0 || a.x > W) a.vx *= -1; if (a.y < 0 || a.y > H) a.vy *= -1; });
    // Bullet-asteroid collision
    st.bullets.forEach((b, bi) => {
      st.asts.forEach((a, ai) => {
        if (Math.hypot(b.x - a.x, b.y - a.y) < a.r) {
          st.bullets.splice(bi, 1);
          st.asts.splice(ai, 1);
          setScore((sc) => sc + Math.floor(30 / a.r * 10));
          if (a.r > 15) {
            st.asts.push({ x: a.x, y: a.y, vx: a.vx + 1, vy: a.vy, r: a.r / 2, rot: 0, vrot: 0.05 });
            st.asts.push({ x: a.x, y: a.y, vx: a.vx - 1, vy: -a.vy, r: a.r / 2, rot: 0, vrot: -0.05 });
          }
          st.wells.push({ x: a.x, y: a.y, r: 60, life: 60 });
        }
      });
    });
    // Ship-asteroid collision
    st.asts.forEach((a) => {
      if (Math.hypot(st.ship.x - a.x, st.ship.y - a.y) < a.r + 6) {
        st.ship.shield--;
        st.ship.vx += (st.ship.x - a.x) * 0.1;
        st.ship.vy += (st.ship.y - a.y) * 0.1;
        if (st.ship.shield <= 0) { setOver(true); if (score > best) setBest(score); }
      }
    });

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    // Wells
    st.wells.forEach((w) => {
      const grad = c.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
      grad.addColorStop(0, "#a855f722");
      grad.addColorStop(1, "transparent");
      c.fillStyle = grad;
      c.beginPath(); c.arc(w.x, w.y, w.r, 0, Math.PI * 2); c.fill();
    });
    // Ship
    c.save();
    c.translate(st.ship.x, st.ship.y);
    c.rotate(st.ship.rot);
    c.strokeStyle = G.accent;
    c.lineWidth = 2;
    c.shadowColor = G.accent;
    c.shadowBlur = 8;
    c.beginPath(); c.moveTo(10, 0); c.lineTo(-8, -6); c.lineTo(-4, 0); c.lineTo(-8, 6); c.closePath(); c.stroke();
    if (k.has("arrowup")) { c.strokeStyle = "#ff6a3d"; c.beginPath(); c.moveTo(-4, 0); c.lineTo(-12, 0); c.stroke(); }
    c.shadowBlur = 0;
    c.restore();
    // Bullets
    c.fillStyle = "#fbbf24";
    st.bullets.forEach((b) => { c.beginPath(); c.arc(b.x, b.y, 2, 0, Math.PI * 2); c.fill(); });
    // Asteroids
    c.strokeStyle = "#8d968e";
    c.lineWidth = 1.5;
    st.asts.forEach((a) => {
      c.save(); c.translate(a.x, a.y); c.rotate(a.rot);
      c.beginPath();
      for (let i = 0; i < 7; i++) { const ang = (i / 7) * Math.PI * 2; const r = a.r * (0.8 + Math.sin(i * 3) * 0.2); if (i === 0) c.moveTo(Math.cos(ang) * r, Math.sin(ang) * r); else c.lineTo(Math.cos(ang) * r, Math.sin(ang) * r); }
      c.closePath(); c.stroke(); c.restore();
    });
    // Shield
    c.fillStyle = "#8d968e";
    c.font = "12px monospace";
    c.fillText(`🛡️${st.ship.shield}`, 8, 15);
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%" }} />
        <p className="text-xs text-muted">←/→ rotate · ↑ thrust · Space fire</p>
      </div>
    </GameShell>
  );
}
