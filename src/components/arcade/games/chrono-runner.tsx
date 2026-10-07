import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("chrono-runner")!;
const W = 320, H = 400;

type Obstacle = { x: number; y: number; w: number; h: number; type: "spike" | "block" | "low" };

export default function ChronoRunner() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-chrono-best", 0);
  const [over, setOver] = useState(false);
  const [running, setRunning] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef({ y: H - 60, vy: 0, ground: H - 40, obs: [] as Obstacle[], scroll: 0, speed: 2, jumpHeld: false, tick: 0 });

  const reset = useCallback(() => {
    s.current = { y: H - 60, vy: 0, ground: H - 40, obs: [], scroll: 0, speed: 2, jumpHeld: false, tick: 0 };
    setScore(0);
    setOver(false);
    setRunning(false);
  }, []);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === " " && !running) { e.preventDefault(); setRunning(true); }
      if (e.key === " ") { e.preventDefault(); if (s.current.y >= s.current.ground - 1) s.current.vy = -10; }
    };
    const tap = () => {
      if (!running) setRunning(true);
      if (s.current.y >= s.current.ground - 1) s.current.vy = -10;
    };
    window.addEventListener("keydown", key);
    window.addEventListener("click", tap);
    window.addEventListener("touchstart", tap);
    return () => { window.removeEventListener("keydown", key); window.removeEventListener("click", tap); window.removeEventListener("touchstart", tap); };
  });

  useGameLoop(() => {
    if (over || !running) return;
    const st = s.current;
    // Time only moves when running (player is actively in the game)
    st.tick++;
    st.scroll += st.speed;
    setScore(Math.floor(st.scroll / 10));

    // Physics
    st.vy += 0.5;
    st.y += st.vy;
    if (st.y > st.ground) { st.y = st.ground; st.vy = 0; }

    // Spawn obstacles — speed based on score
    st.speed = 2 + Math.min(4, st.scroll / 1000);
    if (st.tick % Math.max(40, 80 - Math.floor(st.speed * 5)) === 0) {
      const types = ["spike", "block", "low"] as const;
      const t = types[Math.floor(Math.random() * types.length)];
      st.obs.push({ x: W, y: t === "low" ? st.ground - 30 : st.ground - 20, w: t === "block" ? 30 : 20, h: t === "block" ? 30 : 20, type: t });
    }
    // Obstacles move based on speed (time moves when you move)
    st.obs.forEach((o) => o.x -= st.speed);
    st.obs = st.obs.filter((o) => o.x > -50);

    // Collision
    const px = 40, py = st.y, pw = 16, ph = 24;
    for (const o of st.obs) {
      if (px < o.x + o.w && px + pw > o.x && py < o.y + o.h && py + ph > o.y) {
        setOver(true);
        if (score > best) setBest(score);
      }
    }

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    // Ground
    c.fillStyle = "#243240";
    c.fillRect(0, st.ground, W, 2);
    // Grid lines moving
    c.strokeStyle = "#24324055";
    for (let x = -st.scroll % 40; x < W; x += 40) { c.beginPath(); c.moveTo(x, st.ground); c.lineTo(x - 20, H); c.stroke(); }
    // Obstacles
    st.obs.forEach((o) => {
      c.fillStyle = o.type === "spike" ? "#ff6a3d" : o.type === "block" ? "#f59e0b" : "#a855f7";
      if (o.type === "spike") { c.beginPath(); c.moveTo(o.x, o.y + o.h); c.lineTo(o.x + o.w / 2, o.y); c.lineTo(o.x + o.w, o.y + o.h); c.fill(); }
      else c.fillRect(o.x, o.y, o.w, o.h);
    });
    // Runner
    c.fillStyle = G.accent;
    c.shadowColor = G.accent;
    c.shadowBlur = 8;
    c.fillRect(px, py, pw, ph);
    c.shadowBlur = 0;
    c.fillStyle = "#8d968e";
    c.font = "12px monospace";
    c.fillText(`Speed ${st.speed.toFixed(1)}`, 10, 15);
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        {!running && !over && <p className="text-sm" style={{ color: G.accent }}>Tap or Space to start running!</p>}
        {over && <p className="font-display text-xl text-ember">Game Over — Score {score}</p>}
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%" }} />
        <p className="text-xs text-muted">Space / tap to jump · Time moves only when you do!</p>
      </div>
    </GameShell>
  );
}
