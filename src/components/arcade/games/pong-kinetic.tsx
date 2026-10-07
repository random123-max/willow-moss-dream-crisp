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
  const ctx = canvas.current?.getContext("2d");
  const s = useRef({
    py: H / 2, ay: H / 2, bx: W / 2, by: H / 2, vx: 3, vy: 2, mass: 1, aiFrozen: 0, tilt: 0,
  });

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
    s.current = { py: H / 2, ay: H / 2, bx: W / 2, by: H / 2, vx: 3, vy: 2, mass: 1, aiFrozen: 0, tilt: 0 };
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
    // Player paddle
    if (st.bx < 24 && Math.abs(st.by - st.py) < 30 && st.vx < 0) {
      st.vx = Math.abs(st.vx) * 1.05;
      st.vy += (st.by - st.py) * 0.1;
      st.mass += 0.1;
    }
    // AI paddle
    if (st.aiFrozen > 0) st.aiFrozen--;
    else st.ay += Math.sign(st.by - st.ay) * 3;
    if (st.bx > W - 24 && Math.abs(st.by - st.ay) < 30 && st.vx > 0) {
      st.vx = -Math.abs(st.vx) * 1.05;
      st.vy += (st.by - st.ay) * 0.1;
      st.mass += 0.1;
    }
    if (st.bx < 0) { setScore((sc) => ({ ...sc, ai: sc.ai + 1 })); st.bx = W / 2; st.by = H / 2; st.vx = 3; st.mass = 1; }
    if (st.bx > W) { setScore((sc) => ({ ...sc, p: sc.p + 1 })); st.bx = W / 2; st.by = H / 2; st.vx = -3; st.mass = 1; }
    if (emp > 0 && st.aiFrozen === 0) setEmp((e) => Math.max(0, e - 1));

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    c.strokeStyle = "#243240";
    c.setLineDash([4, 4]);
    c.beginPath(); c.moveTo(W / 2, 0); c.lineTo(W / 2, H); c.stroke();
    c.setLineDash([]);
    const r = 6 + st.mass * 2;
    c.fillStyle = G.accent;
    c.shadowColor = G.accent;
    c.shadowBlur = 15;
    c.beginPath(); c.arc(st.bx, st.by, r, 0, Math.PI * 2); c.fill();
    c.shadowBlur = 0;
    c.fillStyle = "#3ee0d0";
    c.fillRect(8, st.py - 30, 8, 60);
    c.fillStyle = st.aiFrozen > 0 ? "#ff6a3d44" : "#ff6a3d";
    c.fillRect(W - 16, st.ay - 30, 8, 60);
    c.fillStyle = "#8d968e";
    c.font = "20px monospace";
    c.fillText(`${score.p}`, W / 4, 30);
    c.fillText(`${score.ai}`, (3 * W) / 4, 30);
  });

  if (score.p >= 7 && !over) { setOver(true); }
  if (score.ai >= 7 && !over) { setOver(true); }

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score.p}:${score.ai}`} extra={emp > 0 ? <span className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-ember">EMP {emp}</span> : undefined}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        {over && <p className="font-display text-xl" style={{ color: score.p >= 7 ? G.accent : "#ff6a3d" }}>{score.p >= 7 ? "You Win! 🎉" : "AI Wins"}</p>}
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%", touchAction: "none" }} />
        <p className="text-xs text-muted">Mouse / ↑↓ to move · Space for EMP</p>
      </div>
    </GameShell>
  );
}
