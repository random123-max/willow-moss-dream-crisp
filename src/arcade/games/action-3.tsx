import { useState, useEffect, useRef } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 21. Lunar Lander: Gravity Orbit ═══════════════ */

export function LunarLander() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState({ fuel: 100, alt: 0, vel: 0, damage: 0, status: "flying" });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 420, H = 480; canvas.width = W; canvas.height = H;
    let lx = W/2, ly = 50, vx = 1, vy = 0, fuel = 100, thrust = 0, wind = 0.1, damage = 0, landed = false, crashed = false;
    const terrain: number[] = [];
    for (let i = 0; i < W; i++) terrain.push(350 + Math.sin(i*0.02)*30 + Math.random()*10);
    const padStart = 160, padEnd = 220;
    for (let i = padStart; i < padEnd; i++) terrain[i] = 380;
    const keys: Set<string> = new Set();
    const onDown = (e: KeyboardEvent) => keys.add(e.key);
    const onUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    let raf = 0;
    const loop = () => {
      if (landed || crashed) return;
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      wind += (Math.random()-0.5)*0.02;
      vx += wind * 0.01; vy += 0.04; thrust = 0;
      if (keys.has("ArrowUp") && fuel > 0) { vy -= 0.12; fuel -= 0.3; thrust = 1; }
      if (keys.has("ArrowLeft") && fuel > 0) { vx -= 0.06; fuel -= 0.15; }
      if (keys.has("ArrowRight") && fuel > 0) { vx += 0.06; fuel -= 0.15; }
      lx += vx; ly += vy;
      const groundY = terrain[Math.max(0, Math.min(W-1, Math.floor(lx)))] ?? 380;
      if (ly >= groundY - 8) {
        const onPad = lx > padStart && lx < padEnd;
        if (onPad && Math.hypot(vx, vy) < 2) { landed = true; }
        else { crashed = true; damage = 100; }
      }
      ctx.fillStyle = "#243240"; ctx.beginPath(); ctx.moveTo(0, H); terrain.forEach((y, x) => ctx.lineTo(x, y)); ctx.lineTo(W, H); ctx.fill();
      ctx.fillStyle = "#3ee0d0"; ctx.fillRect(padStart, 376, padEnd-padStart, 4);
      ctx.save(); ctx.translate(lx, ly);
      ctx.fillStyle = crashed ? "#ff6a3d" : "#ece7de"; ctx.fillRect(-8, -8, 16, 16);
      if (thrust) { ctx.fillStyle = "#ff6a3d"; ctx.beginPath(); ctx.moveTo(-5, 8); ctx.lineTo(5, 8); ctx.lineTo(0, 16); ctx.fill(); }
      ctx.restore();
      setHud({ fuel: Math.max(0, Math.round(fuel)), alt: Math.round(groundY - ly), vel: Math.round(Math.hypot(vx, vy)*10)/10, damage: Math.round(damage), status: landed ? "landed" : crashed ? "crashed" : "flying" });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  return (
    <GameShell title="Lunar Lander: Gravity Orbit" sidebar={<>
      <Stat label="Fuel" value={`${hud.fuel}%`} />
      <Stat label="Altitude" value={hud.alt} />
      <Stat label="Velocity" value={hud.vel} />
      <Msg>{hud.status === "landed" ? "🏆 Safe landing!" : hud.status === "crashed" ? "💥 Crashed!" : "↑ thrust · ←→ lateral. Land slow on the pad."}</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 22. Orbital Dogfight ═══════════════ */

export function OrbitalDogfight() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState({ ammo: 30, fuel: 100, cool: 0, hp: 100, score: 0 });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 480, H = 400; canvas.width = W; canvas.height = H;
    let px = W/2, py = H/2, pvx = 0, pvy = 0, ang = 0, ammo = 30, fuel = 100, cool = 0, hp = 100, score = 0;
    const bullets: {x:number;y:number;vx:number;vy:number}[] = [];
    const missiles: {x:number;y:number;vx:number;vy:number}[] = [];
    const enemies: {x:number;y:number;vx:number;vy:number;hp:number}[] = [];
    for (let i = 0; i < 3; i++) enemies.push({x:Math.random()*W, y:Math.random()*H, vx:0, vy:0, hp:2});
    const keys: Set<string> = new Set();
    const onDown = (e: KeyboardEvent) => keys.add(e.key);
    const onUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    let raf = 0, cd = 0;
    const loop = () => {
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      if (keys.has("ArrowLeft")) ang -= 0.06;
      if (keys.has("ArrowRight")) ang += 0.06;
      if (keys.has("ArrowUp") && fuel > 0) { pvx += Math.cos(ang)*0.1; pvy += Math.sin(ang)*0.1; fuel -= 0.15; }
      if (keys.has(" ") && cd <= 0 && ammo > 0) { bullets.push({x:px, y:py, vx:Math.cos(ang)*6, vy:Math.sin(ang)*6}); ammo--; cd = 8; cool += 5; }
      if (cd > 0) cd--; if (cool > 0) cool -= 0.5;
      pvx *= 0.98; pvy *= 0.98; px += pvx; py += pvy;
      if (px<0)px=W; if(px>W)px=0; if(py<0)py=H; if(py>H)py=0;
      for (let i = bullets.length-1; i >= 0; i--) {
        const b = bullets[i]; b.x += b.vx; b.y += b.vy;
        if (b.x<0||b.x>W||b.y<0||b.y>H) { bullets.splice(i,1); continue; }
        for (let j = enemies.length-1; j >= 0; j--) {
          if (Math.hypot(b.x-enemies[j].x, b.y-enemies[j].y) < 15) { enemies[j].hp--; bullets.splice(i,1); if (enemies[j].hp <= 0) { enemies.splice(j,1); score += 100; } }
        }
      }
      for (let i = missiles.length-1; i >= 0; i--) {
        const m = missiles[i]; const dx = px-m.x, dy = py-m.y, d = Math.hypot(dx,dy);
        m.vx += dx/Math.max(1,d)*0.05; m.vy += dy/Math.max(1,d)*0.05; m.x += m.vx; m.y += m.vy;
        if (d < 10) { hp -= 20; missiles.splice(i,1); }
        if (m.x<-10||m.x>W+10||m.y<-10||m.y>H+10) missiles.splice(i,1);
      }
      enemies.forEach(e => {
        const dx = px-e.x, dy = py-e.y, d = Math.max(1, Math.hypot(dx,dy));
        e.vx += dx/d*0.02; e.vy += dy/d*0.02; e.vx*=0.95; e.vy*=0.95; e.x+=e.vx; e.y+=e.vy;
        if (d < 15) hp -= 0.5;
        if (Math.random() < 0.005) missiles.push({x:e.x, y:e.y, vx:0, vy:0});
        ctx.fillStyle = "#ff6a3d"; ctx.beginPath(); ctx.arc(e.x, e.y, 10, 0, Math.PI*2); ctx.fill();
      });
      if (enemies.length === 0) for (let i = 0; i < 4; i++) enemies.push({x:Math.random()*W, y:Math.random()*H, vx:0, vy:0, hp:2});
      ctx.save(); ctx.translate(px, py); ctx.rotate(ang);
      ctx.fillStyle = cool > 80 ? "#ff6a3d" : "#3ee0d0"; ctx.beginPath(); ctx.moveTo(12,0); ctx.lineTo(-8,-6); ctx.lineTo(-8,6); ctx.fill(); ctx.restore();
      bullets.forEach(b => { ctx.fillStyle = "#ff6a3d"; ctx.fillRect(b.x-1, b.y-1, 3, 3); });
      missiles.forEach(m => { ctx.fillStyle = "#ff0"; ctx.beginPath(); ctx.arc(m.x, m.y, 3, 0, Math.PI*2); ctx.fill(); });
      setHud({ ammo: Math.max(0, ammo), fuel: Math.max(0, Math.round(fuel)), cool: Math.round(cool), hp: Math.max(0, Math.round(hp)), score });
      if (hp <= 0) return;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  return (
    <GameShell title="Orbital Dogfight" sidebar={<>
      <Stat label="Score" value={hud.score} />
      <Stat label="HP" value={hud.hp} />
      <Stat label="Ammo" value={hud.ammo} />
      <Stat label="Fuel" value={`${hud.fuel}%`} />
      <Msg>←→ rotate · ↑ thrust · Space fire. Watch heat & missiles.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 23. Rhythm Vanguard ═══════════════ */

const LANES = 4;
export function RhythmVanguard() {
  const [notes, setNotes] = useState<{lane:number;y:number}[]>([]);
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [combo, setCombo] = useState(0);
  const [over, setOver] = useState(false);
  const comboRef = useRef(0);
  comboRef.current = combo;

  useEffect(() => {
    if (over) return;
    const spawn = setInterval(() => {
      if (Math.random() < 0.6) setNotes(n => [...n, {lane: Math.floor(Math.random()*LANES), y: 0}]);
    }, 500);
    const move = setInterval(() => {
      setNotes(n => {
        const moved = n.map(note => ({...note, y: note.y + 4}));
        const missed = moved.filter(note => note.y > 100);
        if (missed.length) { setShield(s => Math.max(0, s - missed.length * 10)); setCombo(0); }
        return moved.filter(note => note.y <= 100);
      });
    }, 50);
    return () => { clearInterval(spawn); clearInterval(move); };
  }, [over]);

  useEffect(() => { if (shield <= 0) setOver(true); }, [shield]);

  function hit(lane: number) {
    const target = notes.find(n => n.lane === lane && n.y > 80 && n.y < 100);
    if (target) {
      setNotes(n => n.filter(x => x !== target));
      setScore(s => s + 10 * (1 + Math.floor(comboRef.current / 5)));
      setCombo(c => c + 1); setShield(s => Math.min(100, s + 2));
    } else { setCombo(0); setShield(s => Math.max(0, s - 5)); }
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, number> = { d: 0, f: 1, j: 2, k: 3, D: 0, F: 1, J: 2, K: 3 };
      if (map[e.key] !== undefined && !over) hit(map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [notes, over]);

  const restart = () => { setNotes([]); setScore(0); setShield(100); setCombo(0); setOver(false); };
  const colors = ["#3ee0d0", "#ff6a3d", "#4fc3f7", "#ece7de"];

  return (
    <GameShell title="Rhythm Vanguard" sidebar={<>
      <Stat label="Score" value={score} />
      <Stat label="Shield" value={`${shield}%`} />
      <Stat label="Combo" value={combo} />
      {over && <Btn onClick={restart} className="w-full">Retry</Btn>}
      <Msg>Press D F J K in time. Missing short-circuits shields.</Msg>
    </>}>
      <div className="mx-auto flex max-w-sm gap-2" style={{height: 320}}>
        {Array.from({length: LANES}).map((_, lane) => (
          <div key={lane} className="relative flex-1 overflow-hidden rounded-lg border border-line bg-surface"
            onClick={() => !over && hit(lane)}>
            <div className="absolute bottom-0 w-full border-t-2" style={{borderColor: colors[lane]}} />
            {notes.filter(n => n.lane === lane).map((n, i) => (
              <div key={i} className="absolute left-1/2 size-8 -translate-x-1/2 rounded-full"
                style={{ bottom: `${n.y}%`, backgroundColor: colors[lane] }} />
            ))}
          </div>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-muted">Tap lanes or use D F J K</p>
    </GameShell>
  );
}

/* ═══════════════ 24. Midnight Zombie Survival ═══════════════ */

export function ZombieSurvival() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState({ hp: 100, battery: 100, ammo: 30, kills: 0 });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 460, H = 380; canvas.width = W; canvas.height = H;
    let px = W/2, py = H/2, hp = 100, battery = 100, ammo = 30, kills = 0;
    const zombies: {x:number;y:number;hp:number}[] = [];
    const bullets: {x:number;y:number;vx:number;vy:number}[] = [];
    let mx = W/2, my = H/2, firing = false, frame = 0;
    const keys: Set<string> = new Set();
    const onDown = (e: KeyboardEvent) => keys.add(e.key);
    const onUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    canvas.addEventListener("mousemove", e => { const r = canvas.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; });
    canvas.addEventListener("mousedown", () => { firing = true; });
    canvas.addEventListener("mouseup", () => { firing = false; });
    let raf = 0, cd = 0;
    const loop = () => {
      ctx.fillStyle = "#000"; ctx.fillRect(0,0,W,H);
      if (keys.has("w")||keys.has("ArrowUp")) py -= 2;
      if (keys.has("s")||keys.has("ArrowDown")) py += 2;
      if (keys.has("a")||keys.has("ArrowLeft")) px -= 2;
      if (keys.has("d")||keys.has("ArrowRight")) px += 2;
      px = Math.max(10, Math.min(W-10, px)); py = Math.max(10, Math.min(H-10, py));
      battery = Math.max(0, battery - 0.05);
      const lightR = battery > 0 ? 120 : 20;
      if (firing && cd <= 0 && ammo > 0) {
        const ang = Math.atan2(my - py, mx - px);
        bullets.push({x:px, y:py, vx:Math.cos(ang)*7, vy:Math.sin(ang)*7});
        ammo--; cd = 10;
      }
      if (cd > 0) cd--;
      if (frame % 120 === 0 && zombies.length < 12) zombies.push({x:Math.random()<0.5?-10:W+10, y:Math.random()*H, hp:2});
      zombies.forEach(z => {
        const dx = px-z.x, dy = py-z.y, d = Math.max(0.1, Math.hypot(dx,dy));
        z.x += dx/d*0.8; z.y += dy/d*0.8;
        if (d < 15) hp -= 0.2;
      });
      for (let i = bullets.length-1; i >= 0; i--) {
        const b = bullets[i]; b.x += b.vx; b.y += b.vy;
        if (b.x<0||b.x>W||b.y<0||b.y>H) { bullets.splice(i,1); continue; }
        for (let j = zombies.length-1; j >= 0; j--) {
          if (Math.hypot(b.x-zombies[j].x, b.y-zombies[j].y) < 12) { zombies[j].hp--; bullets.splice(i,1); if (zombies[j].hp <= 0) { zombies.splice(j,1); kills++; } }
        }
      }
      // Raycast flashlight
      ctx.save();
      ctx.beginPath(); ctx.arc(px, py, lightR, 0, Math.PI*2); ctx.clip();
      ctx.fillStyle = "#101a24"; ctx.fillRect(0,0,W,H);
      zombies.forEach(z => {
        const d = Math.hypot(z.x-px, z.y-py);
        if (d < lightR) { ctx.fillStyle = "#ff6a3d"; ctx.beginPath(); ctx.arc(z.x, z.y, 8, 0, Math.PI*2); ctx.fill(); }
      });
      ctx.restore();
      // Player
      ctx.fillStyle = "#3ee0d0"; ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#ece7de"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(mx, my); ctx.stroke();
      bullets.forEach(b => { ctx.fillStyle = "#ff6a3d"; ctx.fillRect(b.x-1, b.y-1, 3, 3); });
      setHud({ hp: Math.max(0, Math.round(hp)), battery: Math.round(battery), ammo, kills });
      if (hp <= 0) return;
      frame++; raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  return (
    <GameShell title="Midnight Zombie Survival" sidebar={<>
      <Stat label="HP" value={hud.hp} />
      <Stat label="Battery" value={`${hud.battery}%`} />
      <Stat label="Ammo" value={hud.ammo} />
      <Stat label="Kills" value={hud.kills} />
      <Msg>WASD move · mouse aim · click fire. Light drains battery. Noise attracts horde.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 25. Mini-Golf: Wizard's Course ═══════════════ */

export function MiniGolfWizard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState(0);
  const [hole, setHole] = useState(1);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 420, H = 360; canvas.width = W; canvas.height = H;
    const courses = [
      { ball: {x:60, y:H/2}, hole: {x:W-60, y:H/2}, wells: [{x:W/2, y:H/2, r:50}], ice: [{x:200, y:120, w:80, h:40}], portals: [{a:{x:80, y:80}, b:{x:W-80, y:280}}] },
      { ball: {x:60, y:H-60}, hole: {x:W-60, y:60}, wells: [], ice: [{x:150, y:150, w:120, h:60}], portals: [] },
      { ball: {x:W/2, y:H-40}, hole: {x:W/2, y:40}, wells: [{x:150, y:200, r:40}, {x:270, y:200, r:40}], ice: [], portals: [{a:{x:40, y:40}, b:{x:W-40, y:H-40}}] },
    ];
    let ci = 0;
    let bx = courses[0].ball.x, by = courses[0].ball.y, bvx = 0, bvy = 0, moving = false;
    let dragging = false, dragX = 0, dragY = 0, spin = 0;
    let won = false, strokes = 0;
    const load = (i: number) => {
      ci = i % courses.length;
      const c = courses[ci];
      bx = c.ball.x; by = c.ball.y; bvx = bvy = 0; moving = false; won = false; strokes = 0; setStrokes(0);
    };
    load(0);
    const getMouse = (e: MouseEvent) => { const r = canvas.getBoundingClientRect(); return {x: e.clientX-r.left, y: e.clientY-r.top}; };
    canvas.addEventListener("mousedown", e => { if (!moving) { dragging = true; const m = getMouse(e); dragX = m.x; dragY = m.y; } });
    canvas.addEventListener("mousemove", e => { if (dragging) { const m = getMouse(e); dragX = m.x; dragY = m.y; } });
    canvas.addEventListener("mouseup", e => {
      if (dragging && !moving) {
        dragging = false; const m = getMouse(e);
        bvx = (bx - m.x) * 0.05; bvy = (by - m.y) * 0.05;
        moving = true; strokes++; setStrokes(strokes);
      }
    });
    let raf = 0;
    const loop = () => {
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      const c = courses[ci];
      // Ice patches
      c.ice.forEach(i => { ctx.fillStyle = "rgba(79,195,247,0.2)"; ctx.fillRect(i.x, i.y, i.w, i.h); });
      // Gravity wells
      c.wells.forEach(w => { ctx.strokeStyle = "rgba(62,224,208,0.3)"; ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI*2); ctx.stroke(); });
      // Portals
      c.portals.forEach(p => { ctx.fillStyle = "#4fc3f7"; ctx.beginPath(); ctx.arc(p.a.x, p.a.y, 8, 0, Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(p.b.x, p.b.y, 8, 0, Math.PI*2); ctx.fill(); });
      // Hole
      ctx.fillStyle = "#000"; ctx.beginPath(); ctx.arc(c.hole.x, c.hole.y, 12, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#3ee0d0"; ctx.lineWidth = 2; ctx.stroke();
      // Physics
      if (moving) {
        bx += bvx; by += bvy;
        c.wells.forEach(w => { const dx = w.x-bx, dy = w.y-by, d = Math.max(1, Math.hypot(dx,dy)); if (d < w.r) { bvx += dx/d*0.15; bvy += dy/d*0.15; } });
        const onIce = c.ice.some(i => bx > i.x && bx < i.x+i.w && by > i.y && by < i.y+i.h);
        const fric = onIce ? 0.998 : 0.98;
        bvx *= fric; bvy *= fric;
        bvx += Math.cos(spin) * 0.02; bvy += Math.sin(spin) * 0.02; spin += 0.1;
        if (bx < 10) { bx = 10; bvx *= -0.6; } if (bx > W-10) { bx = W-10; bvx *= -0.6; }
        if (by < 10) { by = 10; bvy *= -0.6; } if (by > H-10) { by = H-10; bvy *= -0.6; }
        c.portals.forEach(p => {
          if (Math.hypot(bx-p.a.x, by-p.a.y) < 10) { bx = p.b.x; by = p.b.y; }
          if (Math.hypot(bx-p.b.x, by-p.b.y) < 10) { bx = p.a.x; by = p.a.y; }
        });
        if (Math.hypot(bx-c.hole.x, by-c.hole.y) < 12 && Math.hypot(bvx, bvy) < 2) { won = true; moving = false; }
        if (Math.hypot(bvx, bvy) < 0.1) moving = false;
      }
      if (won) {
        ctx.fillStyle = "#3ee0d0"; ctx.font = "bold 24px sans-serif"; ctx.textAlign = "center"; ctx.fillText("Hole in " + strokes + "!", W/2, H/2);
        setTimeout(() => { if (ci < courses.length - 1) { load(ci + 1); setHole(h => h + 1); } else { setOver(true); } }, 2000);
        won = false;
      }
      // Aim line
      if (dragging) { ctx.strokeStyle = "#3ee0d0"; ctx.lineWidth = 2; ctx.setLineDash([5,5]); ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(dragX, dragY); ctx.stroke(); ctx.setLineDash([]); }
      // Ball
      ctx.fillStyle = "#ece7de"; ctx.beginPath(); ctx.arc(bx, by, 6, 0, Math.PI*2); ctx.fill();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <GameShell title="Mini-Golf: Wizard's Course" sidebar={<>
      <Stat label="Strokes" value={strokes} />
      <Stat label="Hole" value={hole} />
      {over && <Msg>🏆 Course complete!</Msg>}
      <Msg>Drag from ball to aim & release. Gravity wells pull, ice slides, portals teleport.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}
