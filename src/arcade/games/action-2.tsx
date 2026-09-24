import { useState, useEffect, useRef } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 16. Space Invaders: Evolution ═══════════════ */

export function SpaceInvadersEvo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 440, H = 400; canvas.width = W; canvas.height = H;
    let px = W/2, frame = 0, dead = false;
    const bullets: {x:number;y:number}[] = [];
    const eBullets: {x:number;y:number}[] = [];
    let aliens: {x:number;y:number;type:string;hp:number}[] = [];
    let dir = 1, fastFire = 0, heavyUse = 0;
    const spawn = () => {
      aliens = [];
      for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++)
        aliens.push({x: c*44+30, y: r*32+20, type: "normal", hp: 1});
    };
    spawn();
    const keys: Set<string> = new Set();
    const onDown = (e: KeyboardEvent) => keys.add(e.key);
    const onUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    let raf = 0, cd = 0;
    const loop = () => {
      if (dead) return;
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      if (keys.has("ArrowLeft")) px = Math.max(15, px - 4);
      if (keys.has("ArrowRight")) px = Math.min(W-15, px + 4);
      if (keys.has(" ") && cd <= 0) { bullets.push({x:px, y:H-30}); cd = heavyUse > 5 ? 25 : 12; heavyUse++; }
      if (cd > 0) cd--;
      // Alien movement
      if (frame % 30 === 0) {
        let edge = false;
        aliens.forEach(a => { a.x += dir * 8; if (a.x > W-20 || a.x < 10) edge = true; });
        if (edge) { dir *= -1; aliens.forEach(a => a.y += 16); }
      }
      // Evolution
      if (fastFire > 10) aliens.forEach(a => { if (a.type === "normal") a.type = "shield"; });
      if (heavyUse > 8 && Math.random() < 0.02) aliens.forEach(a => { if (a.type === "normal" && Math.random() < 0.3) { a.type = "scout"; a.hp = 1; } });
      // Bullets
      for (let i = bullets.length-1; i >= 0; i--) {
        const b = bullets[i]; b.y -= 6; if (b.y < 0) { bullets.splice(i,1); continue; }
        for (let j = aliens.length-1; j >= 0; j--) {
          const a = aliens[j];
          if (Math.abs(b.x-a.x) < 14 && Math.abs(b.y-a.y) < 12) {
            bullets.splice(i,1);
            if (a.type === "shield") { a.hp--; if (a.hp <= 0) { aliens.splice(j,1); setScore(s => s + 30); } }
            else if (a.type === "scout") { if (Math.random() < 0.4) { aliens.splice(j,1); setScore(s => s + 50); } else { a.x += (Math.random()-0.5)*60; } }
            else { aliens.splice(j,1); setScore(s => s + 10); fastFire++; }
          }
        }
      }
      // Enemy fire
      if (Math.random() < 0.03 + fastFire * 0.002) {
        const a = aliens[Math.floor(Math.random()*aliens.length)];
        if (a) eBullets.push({x:a.x, y:a.y});
      }
      for (let i = eBullets.length-1; i >= 0; i--) {
        const b = eBullets[i]; b.y += 4; if (b.y > H) { eBullets.splice(i,1); continue; }
        if (Math.abs(b.x-px) < 14 && b.y > H-35) { eBullets.splice(i,1); setLives(l => l-1); }
      }
      if (aliens.length === 0) spawn();
      // Draw
      ctx.fillStyle = "#3ee0d0"; ctx.fillRect(px-12, H-25, 24, 15);
      bullets.forEach(b => ctx.fillRect(b.x-1, b.y-6, 3, 6));
      aliens.forEach(a => {
        ctx.fillStyle = a.type === "shield" ? "#4fc3f7" : a.type === "scout" ? "#ff6a3d" : "#8d968e";
        if (a.type === "shield") { ctx.fillRect(a.x-12, a.y-10, 24, 20); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.strokeRect(a.x-12, a.y-10, 24, 20); }
        else { ctx.beginPath(); ctx.arc(a.x, a.y, 10, 0, Math.PI*2); ctx.fill(); }
      });
      eBullets.forEach(b => { ctx.fillStyle = "#ff6a3d"; ctx.fillRect(b.x-1, b.y, 3, 8); });
      frame++; raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  return (
    <GameShell title="Space Invaders: Evolution" sidebar={<>
      <Stat label="Score" value={score} />
      <Stat label="Lives" value={lives} />
      <Msg>←→ move · Space fire. Fast fire → shields. Heavy lasers → splitting scouts.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 17. Neon Maze: Ghost Hunt ═══════════════ */

export function NeonMazeGhost() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 420, H = 420, G = 21; canvas.width = W; canvas.height = H;
    const N = W / G;
    const maze: number[][] = Array.from({length: N}, () => Array(N).fill(1));
    // Simple maze gen
    for (let i = 1; i < N-1; i += 2) for (let j = 1; j < N-1; j += 2) { maze[i][j] = 0; if (j+2<N) maze[i][j+1] = 0; }
    for (let j = 1; j < N-1; j += 2) for (let i = 1; i < N-1; i += 2) maze[i][j] = 0;
    let px = 1, py = 1, dots = 0;
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (maze[i][j] === 0) dots++;
    const ghosts: {x:number;y:number;vx:number;vy:number;type:string}[] = [
      {x:N-2, y:N-2, vx:0, vy:0, type: "chase"},
      {x:1, y:N-2, vx:0, vy:0, type: "flank"},
      {x:N-2, y:1, vx:0, vy:0, type: "ambush"},
    ];
    const traps: {x:number;y:number}[] = [];
    let invuln = 0, frame = 0;
    const keys: Set<string> = new Set();
    const onDown = (e: KeyboardEvent) => keys.add(e.key);
    const onUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    let raf = 0;
    const loop = () => {
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      if (frame % 8 === 0) {
        if (keys.has("ArrowUp") && maze[py-1]?.[px] === 0) py--;
        if (keys.has("ArrowDown") && maze[py+1]?.[px] === 0) py++;
        if (keys.has("ArrowLeft") && maze[py][px-1] === 0) px--;
        if (keys.has("ArrowRight") && maze[py][px+1] === 0) px++;
        if (maze[py][px] === 0) { maze[py][px] = 2; setScore(s => s + 10); }
        if (keys.has(" ") && traps.length < 3) { traps.push({x:px, y:py}); }
      }
      // Ghost AI
      if (frame % 15 === 0) ghosts.forEach(g => {
        const dx = px - g.x, dy = py - g.y;
        if (g.type === "chase") { g.vx = Math.sign(dx); g.vy = Math.sign(dy); }
        else if (g.type === "flank") { g.vx = -Math.sign(dx); g.vy = Math.sign(dy); }
        else { g.vx = Math.sign(dx) * (Math.random() < 0.5 ? 1 : 0); g.vy = Math.sign(dy) * (Math.random() < 0.5 ? 1 : 0); }
        const nx = g.x + g.vx, ny = g.y + g.vy;
        if (maze[ny]?.[nx] !== 1) { g.x = nx; g.y = ny; }
        if (traps.some(t => t.x === g.x && t.y === g.y)) { g.x = N-2; g.y = N-2; setScore(s => s + 100); }
        if (g.x === px && g.y === py && invuln <= 0) { setScore(s => Math.max(0, s-50)); invuln = 60; }
      });
      if (invuln > 0) invuln--;
      // Draw maze
      for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
        if (maze[i][j] === 1) { ctx.fillStyle = "#243240"; ctx.fillRect(j*G, i*G, G, G); }
        else if (maze[i][j] === 0) { ctx.fillStyle = "#3ee0d0"; ctx.beginPath(); ctx.arc(j*G+G/2, i*G+G/2, 2, 0, Math.PI*2); ctx.fill(); }
      }
      traps.forEach(t => { ctx.fillStyle = "rgba(255,106,61,0.4)"; ctx.fillRect(t.x*G, t.y*G, G, G); });
      ghosts.forEach(g => { ctx.fillStyle = g.type === "chase" ? "#ff6a3d" : g.type === "flank" ? "#4fc3f7" : "#ff0"; ctx.beginPath(); ctx.arc(g.x*G+G/2, g.y*G+G/2, G/2-2, 0, Math.PI*2); ctx.fill(); });
      ctx.fillStyle = invuln > 0 && frame % 4 < 2 ? "#fff" : "#ece7de"; ctx.beginPath(); ctx.arc(px*G+G/2, py*G+G/2, G/2-2, 0, Math.PI*2); ctx.fill();
      frame++; raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  return (
    <GameShell title="Neon Maze: Ghost Hunt" sidebar={<>
      <Stat label="Score" value={score} />
      <Msg>Arrows to move. Space drops light traps (max 3). Ghosts have different AI.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 18. Chrono-Runner ═══════════════ */

export function ChronoRunner() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 480, H = 240; canvas.width = W; canvas.height = H;
    let py = H - 40, vy = 0, jumping = false;
    let obstacles: {x:number;h:number;type:string}[] = [];
    let frame = 0, speed = 0, dist = 0, dead = false;
    const spawn = () => obstacles.push({x: W, h: 20 + Math.random()*30, type: Math.random()<0.3?"high":"low"});
    spawn();
    const keys: Set<string> = new Set();
    const onDown = (e: KeyboardEvent) => {
      keys.add(e.key);
      if ((e.key === "ArrowUp" || e.key === " ") && !jumping && !dead) { vy = -8; jumping = true; }
    };
    const onUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    let raf = 0;
    const loop = () => {
      if (dead) return;
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      // Time moves only when moving
      const moving = keys.has("ArrowRight") || keys.has("ArrowUp") || keys.has(" ");
      speed = moving ? 3 + Math.min(3, dist * 0.001) : 0;
      dist += speed;
      if (speed > 0) {
        if (frame % 80 === 0) spawn();
        obstacles.forEach(o => o.x -= speed);
        obstacles = obstacles.filter(o => o.x > -30);
        if (jumping) { vy += 0.4; py += vy; if (py >= H-40) { py = H-40; vy = 0; jumping = false; } }
        obstacles.forEach(o => {
          if (o.x < 50 && o.x > 20 && py > H - 40 - o.h) { dead = true; setOver(true); }
        });
        if (dist % 100 < speed) setScore(s => s + 1);
      }
      // Draw
      obstacles.forEach(o => { ctx.fillStyle = o.type === "high" ? "#ff6a3d" : "#8d968e"; ctx.fillRect(o.x, H - 40 - o.h, 20, o.h); });
      ctx.fillStyle = "#3ee0d0"; ctx.fillRect(40, py - 20, 20, 20);
      ctx.strokeStyle = "#243240"; ctx.beginPath(); ctx.moveTo(0, H-20); ctx.lineTo(W, H-20); ctx.stroke();
      ctx.fillStyle = "#8d968e"; ctx.font = "12px monospace"; ctx.fillText(`Distance: ${Math.floor(dist)}`, 10, 20);
      frame++; raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  return (
    <GameShell title="Chrono-Runner" sidebar={<>
      <Stat label="Distance" value={score} />
      {over && <Msg>💀 Crashed! Time stops when you stop.</Msg>}
      <Msg>↑/Space jump. → to run. Time moves only when you do — plan jumps.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 19. Whack-a-Mage ═══════════════ */

const MAGE_TYPES = [
  { type: "fire", icon: "🔥", effect: "Clears adjacent targets" },
  { type: "ice", icon: "❄️", effect: "Freezes timer briefly" },
  { type: "illusion", icon: "✨", effect: "Duplicates targets" },
  { type: "normal", icon: "🧙", effect: "Just points" },
];

export function WhackMage() {
  const [holes, setHoles] = useState<(string|null)[]>(Array(9).fill(null));
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [over, setOver] = useState(false);
  const frozenRef = useRef(false);

  useEffect(() => {
    if (over) return;
    const spawn = setInterval(() => {
      if (frozenRef.current) return;
      setHoles(prev => {
        const nb = [...prev];
        const empty = nb.map((h, i) => h ? -1 : i).filter(i => i >= 0);
        if (empty.length) {
          const i = empty[Math.floor(Math.random()*empty.length)];
          const mage = MAGE_TYPES[Math.floor(Math.random()*MAGE_TYPES.length)];
          nb[i] = mage.type;
          setTimeout(() => { setHoles(p => { const p2 = [...p]; if (p2[i] === mage.type) p2[i] = null; return p2; }); }, 1500);
        }
        return nb;
      });
    }, 700);
    const timer = setInterval(() => setTime(t => { if (t <= 1) { setOver(true); return 0; } return t - 1; }), 1000);
    return () => { clearInterval(spawn); clearInterval(timer); };
  }, [over]);

  function whack(i: number) {
    const t = holes[i]; if (!t || over) return;
    setHoles(h => { const n = [...h]; n[i] = null; return n; });
    setScore(s => s + 10);
    if (t === "fire") {
      setHoles(h => { const n = [...h]; [[i-1,i+1],[i-3,i+3]].flat().forEach(j => { if (j >= 0 && j < 9 && n[j]) n[j] = null; }); return n; });
      setScore(s => s + 20);
    } else if (t === "illusion") {
      const empty = holes.map((h, j) => h || j === i ? -1 : j).filter(j => j >= 0);
      if (empty.length >= 2) {
        setHoles(h => { const n = [...h]; n[empty[0]] = "normal"; if (empty[1] !== undefined) n[empty[1]] = "normal"; return n; });
      }
    } else if (t === "ice") {
      frozenRef.current = true; setTimeout(() => { frozenRef.current = false; }, 2000);
    }
  }

  const restart = () => { setHoles(Array(9).fill(null)); setScore(0); setTime(30); setOver(false); frozenRef.current = false; };

  return (
    <GameShell title="Whack-a-Mage" sidebar={<>
      <Stat label="Score" value={score} />
      <Stat label="Time" value={`${time}s`} />
      <Msg>🔥 clears adjacent · ❄️ freezes · ✨ duplicates</Msg>
      {over && <Btn onClick={restart} className="w-full">Play again</Btn>}
    </>}>
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
        {holes.map((h, i) => (
          <button key={i} onClick={() => whack(i)}
            className="flex aspect-square items-center justify-center rounded-lg border border-line bg-surface text-4xl hover:bg-elevated">
            {h ? MAGE_TYPES.find(m => m.type === h)?.icon : ""}
          </button>
        ))}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 20. Frogger: Quantum Highway ═══════════════ */

export function FroggerQuantum() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [rewinds, setRewinds] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 420, H = 420, G = 30, N = H/G; canvas.width = W; canvas.height = H;
    let fx = 6, fy = N-1, frame = 0, dead = false;
    let rewindPos: {x:number;y:number}[] = [];
    let lanes: {y:number;speed:number;dir:number;cars:{x:number}[]}[] = [];
    for (let l = 1; l < N-2; l++) {
      const speed = 1 + l * 0.3;
      const dir = l % 2 === 0 ? 1 : -1;
      const cars = Array.from({length: 3}, (_, i) => ({x: i * (W/3) + Math.random()*60}));
      lanes.push({y: l, speed, dir, cars});
    }
    const onKey = (e: KeyboardEvent) => {
      if (dead) return;
      rewindPos.push({x: fx, y: fy});
      if (rewindPos.length > 30) rewindPos.shift();
      if (e.key === "ArrowUp") fy = Math.max(0, fy-1);
      if (e.key === "ArrowDown") fy = Math.min(N-1, fy+1);
      if (e.key === "ArrowLeft") fx = Math.max(0, fx-1);
      if (e.key === "ArrowRight") fx = Math.min(N-1, fx+1);
      if (fy === 0) { setScore(s => s + 100); fy = N-1; rewindPos = []; }
    };
    window.addEventListener("keydown", onKey);
    let raf = 0, carColors = ["#3ee0d0", "#ff6a3d", "#4fc3f7", "#ff0", "#8d968e"];
    const loop = () => {
      if (dead) return;
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      // Road lines
      lanes.forEach(lane => {
        lane.cars.forEach(car => {
          car.x += lane.dir * lane.speed;
          if (lane.dir > 0 && car.x > W) car.x = -G;
          if (lane.dir < 0 && car.x < -G) car.x = W;
          // Temporal loop: every 120 frames cars reverse
          ctx.fillStyle = (Math.floor(frame/120) % 2 === 0) ? carColors[lanes.indexOf(lane) % carColors.length] : "#8d968e";
          ctx.fillRect(car.x, lane.y * G + 5, G-4, G-10);
          if (lane.y === fy && Math.abs(car.x - fx * G) < G) {
            // Hit: rewind 3 seconds
            if (rewindPos.length > 18) {
              const past = rewindPos[rewindPos.length - 18];
              fx = past.x; fy = past.y;
              setRewinds(r => r - 1);
            } else {
              dead = true; setScore(0);
            }
          }
        });
        ctx.strokeStyle = "#243240"; ctx.beginPath(); ctx.moveTo(0, lane.y*G+G); ctx.lineTo(W, lane.y*G+G); ctx.stroke();
      });
      // Frog
      ctx.fillStyle = "#3ee0d0"; ctx.beginPath(); ctx.arc(fx*G+G/2, fy*G+G/2, G/2-3, 0, Math.PI*2); ctx.fill();
      // Goal
      ctx.fillStyle = "rgba(255,106,61,0.2)"; ctx.fillRect(0, 0, W, G);
      frame++; raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <GameShell title="Frogger: Quantum Highway" sidebar={<>
      <Stat label="Score" value={score} />
      <Stat label="Rewinds" value={rewinds} />
      <Msg>Arrows to move. Cars reverse in temporal loops. Hits rewind you 3 seconds.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}
