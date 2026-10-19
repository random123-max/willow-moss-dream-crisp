import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("pong-kinetic")!;
const W = 320, H = 400;

export default function PongKinetic() {
  const [score, setScore] = useState({ p: 0, ai: 0 });
  const [over, setOver] = useState(false);
  const [emp, setEmp] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef({ py: H / 2, ay: H / 2, bx: W / 2, by: H / 2, vx: 3, vy: 2, mass: 1, aiFrozen: 0, tilt: 0, trail: [] as { x: number; y: number }[] });

  // End-game detection in effect (not during render)
  useEffect(() => {
    if (over) return;
    if (score.p >= 7 || score.ai >= 7) setOver(true);
  }, [score, over]);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const r = canvas.current?.getBoundingClientRect();
      if (r) s.current.py = Math.max(20, Math.min(H - 20, ((e.clientY - r.top) / r.height) * H));
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") s.current.py = Math.max(20, s.current.py - 30);
      if (e.key === "ArrowDown") s.current.py = Math.min(H - 20, s.current.py + 30);
      if (e.key === " " && emp === 0) { s.current.aiFrozen = 80; setEmp(3); }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("keydown", key);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("keydown", key); };
  });

  const reset = useCallback(() => {
    s.current = { py: H / 2, ay: H / 2, bx: W / 2, by: H / 2, vx: 3, vy: 2, mass: 1, aiFrozen: 0, tilt: 0, trail: [] };
    setScore({ p: 0, ai: 0 });
    setOver(false);
    setEmp(0);
  }, []);

  useGameLoop((dt) => {
    if (over) return;
    const st = s.current;
    st.bx += st.vx;
    st.by += st.vy;
    if (st.by < 8 || st.by > H - 8) st.vy *= -1;
    if (st.bx < 24 && Math.abs(st.by - st.py) < 30 && st.vx < 0) {
      st.vx = Math.abs(st.vx) * 1.05; st.vy += (st.by - st.py) * 0.1; st.mass += 0.1;
    }
    if (st.aiFrozen > 0) st.aiFrozen--;
    else st.ay += Math.sign(st.by - st.ay) * 3;
    if (st.bx > W - 24 && Math.abs(st.by - st.ay) < 30 && st.vx > 0) {
      st.vx = -Math.abs(st.vx) * 1.05; st.vy += (st.by - st.ay) * 0.1; st.mass += 0.1;
    }
    if (st.bx < 0) { setScore((sc) => ({ ...sc, ai: sc.ai + 1 })); st.bx = W / 2; st.by = H / 2; st.vx = 3; st.mass = 1; st.trail = []; }
    if (st.bx > W) { setScore((sc) => ({ ...sc, p: sc.p + 1 })); st.bx = W / 2; st.by = H / 2; st.vx = -3; st.mass = 1; st.trail = []; }
    if (emp > 0 && st.aiFrozen === 0) setEmp((e) => Math.max(0, e - 1));

    st.trail.push({ x: st.bx, y: st.by });
    if (st.trail.length > 10) st.trail.shift();

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    // colourful gradient arena
    const bg = c.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#1e1b4b");
    bg.addColorStop(1, "#4c1d95");
    c.fillStyle = bg;
    c.fillRect(0, 0, W, H);
    // centre dashed glow line
    c.strokeStyle = "rgba(244,114,182,0.4)";
    c.setLineDash([6, 6]);
    c.beginPath(); c.moveTo(W / 2, 0); c.lineTo(W / 2, H); c.stroke();
    c.setLineDash([]);
    // ball trail
    st.trail.forEach((t, i) => {
      c.globalAlpha = (i / st.trail.length) * 0.5;
      c.fillStyle = G.accent;
      c.beginPath(); c.arc(t.x, t.y, 4 + st.mass * 2, 0, Math.PI * 2); c.fill();
    });
    c.globalAlpha = 1;
    // ball
    const r = 6 + st.mass * 2;
    c.fillStyle = "#fbbf24";
    c.shadowColor = "#fbbf24";
    c.shadowBlur = 18;
    c.beginPath(); c.arc(st.bx, st.by, r, 0, Math.PI * 2); c.fill();
    c.shadowBlur = 0;
    // paddles — 3D rounded
    c.fillStyle = "#f472b6";
    c.beginPath(); c.roundRect(8, st.py - 30, 10, 60, 5); c.fill();
    c.fillStyle = st.aiFrozen > 0 ? "rgba(34,211,238,0.4)" : "#22d3ee";
    c.beginPath(); c.roundRect(W - 18, st.ay - 30, 10, 60, 5); c.fill();
    // score
    c.fillStyle = "#e9d5ff";
    c.font = "bold 22px 'IBM Plex Mono', monospace";
    c.textAlign = "center";
    c.fillText(`${score.p}`, W / 4, 36);
    c.fillText(`${score.ai}`, (3 * W) / 4, 36);
    c.textAlign = "left";
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score.p}:${score.ai}`} extra={emp > 0 ? <span className="g3d-chip bg-ember/20 px-3 py-1 text-xs text-ember">EMP {emp}</span> : undefined}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        {over && <p className="font-display text-xl g3d-grad-text">{score.p >= 7 ? "You Win! 🎉" : "AI Wins"}</p>}
        <canvas ref={canvas} width={W} height={H} className="g3d-drop rounded-2xl" style={{ border: `2px solid ${G.accent}55`, maxWidth: "100%", touchAction: "none", boxShadow: `0 0 40px ${G.accent}33` }} />
        <p className="text-xs text-muted">Mouse / ↑↓ to move · Space for EMP</p>
      </div>
    </GameShell>
  );
}
