import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("elemental-breakout")!;
const W = 320, H = 400;

type Brick = { x: number; y: number; w: number; h: number; type: "normal" | "ice" | "fire" | "iron"; hp: number };

export default function ElementalBreakout() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-breakout-best", 0);
  const [over, setOver] = useState(false);
  const [frozen, setFrozen] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef({
    px: W / 2, bx: W / 2, by: H - 30, vx: 2.5, vy: -2.5, bricks: [] as Brick[],
  });

  const initBricks = useCallback(() => {
    const bricks: Brick[] = [];
    const types: Brick["type"][] = ["normal", "ice", "fire", "iron"];
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 8; c++) {
        const t = types[Math.floor(Math.random() * types.length)];
        bricks.push({ x: c * 40 + 2, y: r * 20 + 30, w: 36, h: 16, type: t, hp: t === "iron" ? 3 : 1 });
      }
    return bricks;
  }, []);

  useEffect(() => {
    s.current.bricks = initBricks();
    const move = (e: MouseEvent) => {
      const r = canvas.current?.getBoundingClientRect();
      if (r) s.current.px = Math.max(30, Math.min(W - 30, ((e.clientX - r.left) / r.width) * W));
    };
    const touch = (e: TouchEvent) => {
      const r = canvas.current?.getBoundingClientRect();
      if (r) s.current.px = Math.max(30, Math.min(W - 30, ((e.touches[0].clientX - r.left) / r.width) * W));
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", touch);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("touchmove", touch); };
  });

  const reset = useCallback(() => {
    s.current = { px: W / 2, bx: W / 2, by: H - 30, vx: 2.5, vy: -2.5, bricks: initBricks() };
    setScore(0);
    setOver(false);
    setFrozen(0);
  }, []);

  useGameLoop(() => {
    if (over) return;
    const st = s.current;
    if (frozen > 0) { setFrozen((f) => f - 1); }
    else {
      st.bx += st.vx;
      st.by += st.vy;
      if (st.bx < 6 || st.bx > W - 6) st.vx *= -1;
      if (st.by < 6) st.vy *= -1;
      // Paddle
      if (st.by > H - 20 && Math.abs(st.bx - st.px) < 35 && st.vy > 0) {
        st.vy = -Math.abs(st.vy);
        st.vx += (st.bx - st.px) * 0.05;
      }
      if (st.by > H) { setOver(true); if (score > best) setBest(score); return; }
      // Bricks
      st.bricks = st.bricks.filter((b) => {
        if (st.bx > b.x && st.bx < b.x + b.w && st.by > b.y && st.by < b.y + b.h) {
          st.vy *= -1;
          b.hp--;
          if (b.hp <= 0) {
            setScore((sc) => sc + 10);
            if (b.type === "ice") setFrozen(60);
            if (b.type === "fire") st.bricks = st.bricks.filter((x) => Math.abs(x.y - b.y) > 20 || x === b);
            return false;
          }
          return true;
        }
        return true;
      });
      if (st.bricks.length === 0) { st.bricks = initBricks(); setScore((sc) => sc + 50); }
    }

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    // Bricks
    const colors: Record<Brick["type"], string> = { normal: "#3ee0d0", ice: "#60a5fa", fire: "#ff6a3d", iron: "#94a3b8" };
    st.bricks.forEach((b) => {
      c.fillStyle = colors[b.type];
      c.globalAlpha = b.type === "iron" ? b.hp / 3 : 1;
      c.fillRect(b.x, b.y, b.w, b.h);
    });
    c.globalAlpha = 1;
    // Ball
    c.fillStyle = "#3ee0d0";
    c.shadowColor = "#3ee0d0";
    c.shadowBlur = 10;
    c.beginPath(); c.arc(st.bx, st.by, 5, 0, Math.PI * 2); c.fill();
    c.shadowBlur = 0;
    // Paddle
    c.fillStyle = frozen > 0 ? "#60a5fa" : "#ece7de";
    c.fillRect(st.px - 30, H - 12, 60, 6);
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        {frozen > 0 && <p className="text-sm text-blue-400">🧊 Paddle frozen!</p>}
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%", touchAction: "none" }} />
        <p className="text-xs text-muted">Mouse to move paddle</p>
      </div>
    </GameShell>
  );
}
