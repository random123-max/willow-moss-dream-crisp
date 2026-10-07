import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist, useKeys } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("space-invaders-evo")!;
const W = 320, H = 400;
const COLS = 8, ROWS = 4;

type Alien = { x: number; y: number; type: "normal" | "shielded" | "scout"; hp: number };
type Bullet = { x: number; y: number; vy: number; heavy: boolean };

export default function SpaceInvadersEvo() {
  const [score, setScore] = useState(0);
  const [best, setBest] = usePersist("arcade-invaders-best", 0);
  const [over, setOver] = useState(false);
  const [fireRate, setFireRate] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const keys = useKeys();
  const s = useRef({
    px: W / 2, aliens: [] as Alien[], bullets: [] as Bullet[], dir: 1, tick: 0, fireCD: 0, drop: 0,
  });

  const initAliens = useCallback(() => {
    const aliens: Alien[] = [];
    for (let r = 0; r < ROWS; r++)
      for (let c = 0; c < COLS; c++)
        aliens.push({ x: c * 36 + 20, y: r * 28 + 30, type: "normal", hp: 1 });
    return aliens;
  }, []);

  useEffect(() => { s.current.aliens = initAliens(); }, []);

  const reset = useCallback(() => {
    s.current = { px: W / 2, aliens: initAliens(), bullets: [], dir: 1, tick: 0, fireCD: 0, drop: 0 };
    setScore(0);
    setOver(false);
    setFireRate(0);
  }, []);

  useGameLoop(() => {
    if (over) return;
    const st = s.current;
    const k = keys.current;
    if (k.has("arrowleft")) st.px = Math.max(15, st.px - 4);
    if (k.has("arrowright")) st.px = Math.min(W - 15, st.px + 4);
    if (st.fireCD > 0) st.fireCD--;
    if (k.has(" ") && st.fireCD === 0) {
      st.bullets.push({ x: st.px, y: H - 20, vy: -5, heavy: fireRate > 30 });
      st.fireCD = Math.max(6, 15 - Math.floor(fireRate / 5));
      setFireRate((f) => f + 1);
    }
    st.bullets = st.bullets.map((b) => ({ ...b, y: b.y + b.vy })).filter((b) => b.y > 0 && b.y < H);

    st.tick++;
    if (st.tick % 30 === 0) {
      st.aliens.forEach((a) => { a.x += st.dir * 4; });
      const maxX = Math.max(...st.aliens.map((a) => a.x), 0);
      const minX = Math.min(...st.aliens.map((a) => a.x), W);
      if (maxX > W - 20 || minX < 20) {
        st.dir *= -1;
        st.aliens.forEach((a) => { a.y += 15; });
      }
    }

    // Bullet-alien collision
    st.bullets.forEach((b, bi) => {
      st.aliens.forEach((a, ai) => {
        if (Math.abs(b.x - a.x) < 15 && Math.abs(b.y - a.y) < 12) {
          st.bullets.splice(bi, 1);
          a.hp -= b.heavy ? 2 : 1;
          if (a.hp <= 0) {
            st.aliens.splice(ai, 1);
            setScore((sc) => sc + (a.type === "scout" ? 20 : a.type === "shielded" ? 15 : 10));
          }
        }
      });
    });

    // Evolution based on fire rate
    if (fireRate > 30 && st.tick % 60 === 0 && st.aliens.length > 0) {
      const target = st.aliens[Math.floor(Math.random() * st.aliens.length)];
      if (fireRate > 50 && target.type === "normal") {
        target.type = "shielded";
        target.hp = 2;
      } else if (fireRate > 60 && Math.random() < 0.3 && target.type === "normal") {
        target.type = "scout";
        // Split into 2
        st.aliens.push({ x: target.x + 30, y: target.y, type: "scout", hp: 1 });
      }
    }

    if (st.aliens.length === 0) {
      s.current.aliens = initAliens();
      setScore((sc) => sc + 50);
    }
    if (st.aliens.some((a) => a.y > H - 30)) { setOver(true); if (score > best) setBest(score); }

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    // Aliens
    st.aliens.forEach((a) => {
      const color = a.type === "shielded" ? "#60a5fa" : a.type === "scout" ? "#fbbf24" : "#ef4444";
      c.fillStyle = color;
      c.shadowColor = color;
      c.shadowBlur = 6;
      if (a.type === "shielded") { c.fillRect(a.x - 14, a.y - 10, 28, 20); c.fillStyle = "#071018"; c.font = "10px monospace"; c.fillText("🛡", a.x - 6, a.y + 4); }
      else if (a.type === "scout") { c.beginPath(); c.arc(a.x, a.y, 8, 0, Math.PI * 2); c.fill(); }
      else { c.font = "16px monospace"; c.fillText("👾", a.x - 8, a.y + 8); }
    });
    c.shadowBlur = 0;
    // Player
    c.fillStyle = G.accent;
    c.fillRect(st.px - 12, H - 16, 24, 6);
    c.beginPath(); c.moveTo(st.px, H - 22); c.lineTo(st.px - 8, H - 16); c.lineTo(st.px + 8, H - 16); c.fill();
    // Bullets
    c.fillStyle = "#fbbf24";
    st.bullets.forEach((b) => c.fillRect(b.x - 1, b.y - 4, 2, 8));
    // Fire rate meter
    c.fillStyle = fireRate > 50 ? "#ff6a3d" : "#3ee0d0";
    c.fillRect(0, H - 4, Math.min(W, fireRate * 3), 2);
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%" }} />
        <p className="text-xs text-muted">←/→ move · Space fire · Aliens mutate as you shoot!</p>
      </div>
    </GameShell>
  );
}
