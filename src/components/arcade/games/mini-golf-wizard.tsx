import { useRef, useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop, usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("mini-golf-wizard")!;
const W = 320, H = 360;

type Course = { ball: { x: number; y: number }; hole: { x: number; y: number }; walls: { x: number; y: number; w: number; h: number }[]; wells: { x: number; y: number; r: number }[]; ice: { x: number; y: number; w: number; h: number }[]; portals: { a: { x: number; y: number }; b: { x: number; y: number } }[] };

const COURSES: Course[] = [
  { ball: { x: 40, y: 300 }, hole: { x: 280, y: 60 }, walls: [{ x: 100, y: 120, w: 120, h: 10 }], wells: [{ x: 160, y: 200, r: 40 }], ice: [], portals: [] },
  { ball: { x: 40, y: 300 }, hole: { x: 280, y: 60 }, walls: [], wells: [], ice: [{ x: 80, y: 200, w: 160, h: 40 }], portals: [{ a: { x: 100, y: 280 }, b: { x: 240, y: 80 } }] },
  { ball: { x: 40, y: 300 }, hole: { x: 280, y: 60 }, walls: [{ x: 140, y: 0, w: 10, h: 200 }, { x: 60, y: 200, w: 80, h: 10 }], wells: [{ x: 220, y: 200, r: 35 }], ice: [], portals: [] },
];

export default function MiniGolfWizard() {
  const [courseIdx, setCourseIdx] = useState(0);
  const [strokes, setStrokes] = useState(0);
  const [total, setTotal] = useState(0);
  const [best, setBest] = usePersist("arcade-golf-best", 999);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Drag from the ball to aim!");
  const canvas = useRef<HTMLCanvasElement>(null);
  const s = useRef({
    ball: { x: 40, y: 300, vx: 0, vy: 0, spin: 0 },
    dragging: false, dragStart: { x: 0, y: 0 }, stopped: true,
  });

  const course = COURSES[courseIdx];

  const reset = useCallback(() => {
    s.current = { ball: { x: COURSES[0].ball.x, y: COURSES[0].ball.y, vx: 0, vy: 0, spin: 0 }, dragging: false, dragStart: { x: 0, y: 0 }, stopped: true };
    setCourseIdx(0);
    setStrokes(0);
    setTotal(0);
    setOver(false);
    setMsg("Drag from the ball to aim!");
  }, []);

  const nextHole = useCallback(() => {
    const ni = (courseIdx + 1) % COURSES.length;
    setCourseIdx(ni);
    setTotal((t) => t + strokes);
    setStrokes(0);
    s.current.ball = { x: COURSES[ni].ball.x, y: COURSES[ni].ball.y, vx: 0, vy: 0, spin: 0 };
    s.current.stopped = true;
    setMsg(`Hole ${ni + 1} — drag to aim!`);
    if (ni === 0 && over) {
      if (total + strokes < best) setBest(total + strokes);
    }
  }, [courseIdx, strokes, total, best, over]);

  useEffect(() => {
    const getPos = (e: MouseEvent | TouchEvent) => {
      const r = canvas.current?.getBoundingClientRect();
      const ev = "touches" in e ? e.touches[0] : (e as MouseEvent);
      if (r) return { x: ((ev.clientX - r.left) / r.width) * W, y: ((ev.clientY - r.top) / r.height) * H };
      return { x: 0, y: 0 };
    };
    const down = (e: MouseEvent | TouchEvent) => {
      if (!s.current.stopped) return;
      const p = getPos(e);
      if (Math.hypot(p.x - s.current.ball.x, p.y - s.current.ball.y) < 25) {
        s.current.dragging = true;
        s.current.dragStart = p;
      }
    };
    const move = (e: MouseEvent | TouchEvent) => {
      if (s.current.dragging) s.current.dragStart = getPos(e);
    };
    const up = (e: MouseEvent | TouchEvent) => {
      if (!s.current.dragging) return;
      s.current.dragging = false;
      const p = getPos(e);
      const dx = s.current.ball.x - p.x, dy = s.current.ball.y - p.y;
      const power = Math.min(15, Math.hypot(dx, dy) / 8);
      s.current.ball.vx = (dx / (Math.hypot(dx, dy) || 1)) * power;
      s.current.ball.vy = (dy / (Math.hypot(dx, dy) || 1)) * power;
      s.current.ball.spin = (s.current.dragStart.x - p.x) * 0.02;
      s.current.stopped = false;
      setStrokes((s) => s + 1);
    };
    window.addEventListener("mousedown", down);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchstart", down as EventListener);
    window.addEventListener("touchmove", move as EventListener);
    window.addEventListener("touchend", up as EventListener);
    return () => {
      window.removeEventListener("mousedown", down); window.removeEventListener("mousemove", move); window.removeEventListener("mouseup", up);
      window.removeEventListener("touchstart", down as EventListener); window.removeEventListener("touchmove", move as EventListener); window.removeEventListener("touchend", up as EventListener);
    };
  });

  useGameLoop(() => {
    const st = s.current;
    if (!st.stopped) {
      st.ball.vx *= 0.97;
      st.ball.vy *= 0.97;
      // Spin curves the ball
      st.ball.vx += st.ball.spin * 0.05;
      st.ball.spin *= 0.95;
      st.ball.x += st.ball.vx;
      st.ball.y += st.ball.vy;
      // Walls
      course.walls.forEach((w) => {
        if (st.ball.x > w.x && st.ball.x < w.x + w.w && st.ball.y > w.y && st.ball.y < w.y + w.h) {
          st.ball.vx *= -0.8;
          st.ball.x += st.ball.vx;
        }
      });
      // Wells
      course.wells.forEach((w) => {
        const d = Math.hypot(st.ball.x - w.x, st.ball.y - w.y);
        if (d < w.r) { st.ball.vx += ((w.x - st.ball.x) / d) * 0.3; st.ball.vy += ((w.y - st.ball.y) / d) * 0.3; }
      });
      // Ice
      let onIce = false;
      course.ice.forEach((i) => { if (st.ball.x > i.x && st.ball.x < i.x + i.w && st.ball.y > i.y && st.ball.y < i.y + i.h) onIce = true; });
      if (!onIce) { st.ball.vx *= 0.96; st.ball.vy *= 0.96; }
      // Portals
      course.portals.forEach((p) => {
        if (Math.hypot(st.ball.x - p.a.x, st.ball.y - p.a.y) < 12) { st.ball.x = p.b.x; st.ball.y = p.b.y; }
        if (Math.hypot(st.ball.x - p.b.x, st.ball.y - p.b.y) < 12) { st.ball.x = p.a.x; st.ball.y = p.a.y; }
      });
      // Bounds
      if (st.ball.x < 8) { st.ball.x = 8; st.ball.vx *= -0.6; }
      if (st.ball.x > W - 8) { st.ball.x = W - 8; st.ball.vx *= -0.6; }
      if (st.ball.y < 8) { st.ball.y = 8; st.ball.vy *= -0.6; }
      if (st.ball.y > H - 8) { st.ball.y = H - 8; st.ball.vy *= -0.6; }
      if (Math.abs(st.ball.vx) < 0.3 && Math.abs(st.ball.vy) < 0.3) { st.stopped = true; st.ball.vx = 0; st.ball.vy = 0; }
      // Hole
      if (Math.hypot(st.ball.x - course.hole.x, st.ball.y - course.hole.y) < 12 && Math.abs(st.ball.vx) < 3) {
        setMsg(`Hole ${courseIdx + 1} done in ${strokes}! 🎉`);
        setOver(true);
        setTimeout(() => { setOver(false); nextHole(); }, 1500);
      }
    }

    const c = canvas.current?.getContext("2d");
    if (!c) return;
    c.fillStyle = "#071018";
    c.fillRect(0, 0, W, H);
    // Ice
    course.ice.forEach((i) => { c.fillStyle = "#60a5fa22"; c.fillRect(i.x, i.y, i.w, i.h); });
    // Wells
    course.wells.forEach((w) => {
      const grad = c.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
      grad.addColorStop(0, "#8b5cf644"); grad.addColorStop(1, "transparent");
      c.fillStyle = grad; c.beginPath(); c.arc(w.x, w.y, w.r, 0, Math.PI * 2); c.fill();
    });
    // Portals
    course.portals.forEach((p) => {
      c.fillStyle = "#a855f744"; c.beginPath(); c.arc(p.a.x, p.a.y, 10, 0, Math.PI * 2); c.fill();
      c.beginPath(); c.arc(p.b.x, p.b.y, 10, 0, Math.PI * 2); c.fill();
    });
    // Walls
    c.fillStyle = "#243240";
    course.walls.forEach((w) => c.fillRect(w.x, w.y, w.w, w.h));
    // Hole
    c.fillStyle = "#071018";
    c.beginPath(); c.arc(course.hole.x, course.hole.y, 10, 0, Math.PI * 2); c.fill();
    c.strokeStyle = G.accent; c.lineWidth = 2; c.stroke();
    // Ball
    c.fillStyle = "#ece7de";
    c.shadowColor = "#ece7de"; c.shadowBlur = 6;
    c.beginPath(); c.arc(st.ball.x, st.ball.y, 6, 0, Math.PI * 2); c.fill();
    c.shadowBlur = 0;
    // Aim line
    if (st.dragging) {
      c.strokeStyle = G.accent + "88";
      c.setLineDash([4, 4]);
      c.beginPath(); c.moveTo(st.ball.x, st.ball.y); c.lineTo(st.dragStart.x, st.dragStart.y); c.stroke();
      c.setLineDash([]);
    }
  });

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`Hole ${courseIdx + 1} · ${strokes}`} best={best < 999 ? `Best ${best}` : undefined}>
      <div className="flex flex-col items-center gap-2 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        <canvas ref={canvas} width={W} height={H} className="rounded-lg border-2" style={{ borderColor: G.accent + "44", maxWidth: "100%", touchAction: "none" }} />
        <p className="text-xs text-muted">Drag from ball to aim · Total: {total + strokes}</p>
      </div>
    </GameShell>
  );
}
