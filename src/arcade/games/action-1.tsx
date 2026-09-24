import { useState, useEffect, useRef } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 11. Cyber-Snake: Hyperdrive ═══════════════ */

export function CyberSnake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 420, H = 420; canvas.width = W; canvas.height = H;
    const G = 20, N = W / G;
    let snake = [{x:10,y:10}], vx = 1, vy = 0, ix = 1, iy = 0;
    let food = {x: 15, y: 10}, shield = 0, ghost = 0, frame = 0, dead = false;
    const placeFood = () => { food = {x:Math.floor(Math.random()*N), y:Math.floor(Math.random()*N)}; };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" && vy === 0) { ix=0; iy=-1; }
      else if (e.key === "ArrowDown" && vy === 0) { ix=0; iy=1; }
      else if (e.key === "ArrowLeft" && vx === 0) { ix=-1; iy=0; }
      else if (e.key === "ArrowRight" && vx === 0) { ix=1; iy=0; }
    };
    window.addEventListener("keydown", onKey);
    let raf = 0;
    const loop = () => {
      if (dead) { setOver(true); return; }
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      if (frame % 8 === 0) {
        vx = ix; vy = iy;
        const hx = snake[0].x + vx, hy = snake[0].y + vy;
        if (hx<0||hx>=N||hy<0||hy>=N||snake.some(s=>s.x===hx&&s.y===hy)) {
          if (shield > 0) { shield--; snake.unshift({x:hx,y:hy}); if(snake.length>1)snake.pop(); }
          else { dead = true; setOver(true); return; }
        } else snake.unshift({x:hx,y:hy});
        if (hx === food.x && hy === food.y) {
          setScore(s => s + 10); placeFood();
          const r = Math.random();
          if (r < 0.3) shield = 3;
          else if (r < 0.5) ghost = 5;
        } else if (snake.length > 1) snake.pop();
        if (ghost > 0) ghost--;
      }
      ctx.fillStyle = "#3ee0d0"; snake.forEach((s, i) => {
        ctx.globalAlpha = ghost > 0 && i > 0 ? 0.3 : 1;
        ctx.fillRect(s.x*G+1, s.y*G+1, G-2, G-2);
      });
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#ff6a3d"; ctx.fillRect(food.x*G+1, food.y*G+1, G-2, G-2);
      if (shield > 0) { ctx.strokeStyle = "#3ee0d0"; ctx.lineWidth = 2; ctx.strokeRect(2,2,W-4,H-4); }
      frame++; raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); };
  }, []);

  const restart = () => {
    setScore(0); setOver(false);
    const c = canvasRef.current; if (c) { const ctx = c.getContext("2d")!; ctx.fillStyle="#071018"; ctx.fillRect(0,0,420,420); }
    // Force re-init by remounting
    canvasRef.current?.remove();
    location.reload();
  };

  return (
    <GameShell title="Cyber-Snake: Hyperdrive" sidebar={<>
      <Stat label="Score" value={score} />
      {over && <Msg>💀 Game over! Score: {score}</Msg>}
      <Msg>Arrow keys to steer. Data packets give shields & ghost mode.</Msg>
      <Btn onClick={restart} variant="ghost" className="w-full">Restart</Btn>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 12. Pong: Kinetic Chaos ═══════════════ */

export function PongKinetic() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ p: 0, a: 0 });
  const [emp, setEmp] = useState(2);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 500, H = 320; canvas.width = W; canvas.height = H;
    let py = H/2, ay = H/2, pw = 80, ball = {x:W/2,y:H/2,vx:3,vy:1,mass:1};
    let empCd = 0, frozen = 0;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") py = Math.max(0, py - 30);
      if (e.key === "ArrowDown") py = Math.min(H-pw, py + 30);
      if (e.key === " " && empCd <= 0) { frozen = 120; empCd = 300; setEmp(e => e-1+1); }
    };
    window.addEventListener("keydown", onKey);
    let raf = 0;
    const loop = () => {
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      ball.x += ball.vx; ball.y += ball.vy;
      if (ball.y < 0 || ball.y > H) ball.vy *= -1;
      // AI paddle
      if (frozen <= 0) ay += Math.sign(ball.y - (ay + pw/2)) * 2.5;
      ay = Math.max(0, Math.min(H-pw, ay));
      // Paddle collisions
      if (ball.x < 15 && ball.y > py && ball.y < py + pw && ball.vx < 0) {
        ball.vx = -ball.vx * 1.08; ball.mass += 0.1;
        ball.vy += (ball.y - (py + pw/2)) * 0.05;
      }
      if (ball.x > W-15 && ball.y > ay && ball.y < ay + pw && ball.vx > 0) {
        ball.vx = -ball.vx * 1.08; ball.mass += 0.1;
        ball.vy += (ball.y - (ay + pw/2)) * 0.05;
      }
      // Score
      if (ball.x < 0) { setScore(s => ({...s, a:s.a+1})); resetBall(); }
      if (ball.x > W) { setScore(s => ({...s, p:s.p+1})); resetBall(); }
      if (empCd > 0) empCd--; if (frozen > 0) frozen--;
      // Draw
      ctx.fillStyle = "#3ee0d0"; ctx.fillRect(10, py, 6, pw);
      ctx.fillStyle = frozen > 0 ? "#446" : "#ff6a3d"; ctx.fillRect(W-16, ay, 6, pw);
      ctx.fillStyle = "#ece7de";
      const r = 6 + ball.mass;
      ctx.beginPath(); ctx.arc(ball.x, ball.y, r, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = "#243240"; ctx.setLineDash([5,5]); ctx.beginPath(); ctx.moveTo(W/2,0); ctx.lineTo(W/2,H); ctx.stroke(); ctx.setLineDash([]);
      raf = requestAnimationFrame(loop);
    };
    function resetBall() { ball = {x:W/2,y:H/2,vx:Math.random()<0.5?3:-3,vy:(Math.random()-0.5)*4,mass:1}; }
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <GameShell title="Pong: Kinetic Chaos" sidebar={<>
      <Stat label="You" value={score.p} />
      <Stat label="AI" value={score.a} />
      <Msg>↑↓ to move. Space for EMP (freezes AI). Ball gains mass per hit.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 13. Elemental Breakout ═══════════════ */

export function ElementalBreakout() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 480, H = 360; canvas.width = W; canvas.height = H;
    let px = W/2, bx = W/2, by = H-30, bvx = 3, bvy = -3, frozen = 0, dead = false;
    const bw = 80, bricks: {x:number;y:number;w:number;h:number;hp:number;type:string}[] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
      const types = ["ice","fire","iron","normal"];
      const type = types[r];
      bricks.push({x:c*58+8, y:r*22+20, w:50, h:18, hp: type==="iron"?3:1, type});
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") px = Math.max(bw/2, px - 25);
      if (e.key === "ArrowRight") px = Math.min(W-bw/2, px + 25);
    };
    window.addEventListener("keydown", onKey);
    let raf = 0;
    const loop = () => {
      if (dead) return;
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      if (frozen > 0) frozen--;
      if (frozen <= 0) { bx += bvx; by += bvy; }
      if (bx < 6 || bx > W-6) bvx *= -1;
      if (by < 6) bvy *= -1;
      if (by > H) { setLives(l => { if (l-1 <= 0) dead = true; return l-1; }); by = H-30; bvy = -3; }
      if (by > H-18 && Math.abs(bx - px) < bw/2) { bvy = -Math.abs(bvy); bvx += (bx-px)*0.05; }
      for (const br of bricks) {
        if (br.hp <= 0) continue;
        if (bx > br.x && bx < br.x+br.w && by > br.y && by < br.y+br.h) {
          bvy *= -1; br.hp--;
          if (br.type === "fire") { bricks.forEach(b => { if (b.y === br.y && b.hp > 0) b.hp = 0; }); setScore(s => s + 50); }
          else if (br.type === "ice") { frozen = 60; setScore(s => s + 10); }
          else if (br.type === "iron") setScore(s => s + 30);
          else setScore(s => s + 10);
        }
        ctx.fillStyle = br.type === "ice" ? "#4fc3f7" : br.type === "fire" ? "#ff6a3d" : br.type === "iron" ? "#8d968e" : "#3ee0d0";
        if (br.hp <= 0) ctx.globalAlpha = 0; else if (br.type === "iron") ctx.globalAlpha = br.hp/3;
        ctx.fillRect(br.x, br.y, br.w, br.h);
        ctx.globalAlpha = 1;
      }
      ctx.fillStyle = frozen > 0 ? "#4fc3f7" : "#3ee0d0";
      ctx.fillRect(px - bw/2, H-12, bw, 8);
      ctx.fillStyle = "#ece7de"; ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI*2); ctx.fill();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onKey); };
  }, []);

  return (
    <GameShell title="Elemental Breakout" sidebar={<>
      <Stat label="Score" value={score} />
      <Stat label="Lives" value={lives} />
      <Msg>←→ to move. Ice freezes paddle, fire clears rows, iron takes 3 hits.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 14. Flappy Steampunk Aviator ═══════════════ */

export function FlappySteampunk() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);
  const [pressure, setPressure] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 400, H = 480; canvas.width = W; canvas.height = H;
    let y = H/2, vy = 0, pipes: {x:number;gap:number;passed:boolean}[] = [];
    let steam = 50, overheated = false, frame = 0, dead = false;
    const spawn = () => pipes.push({x:W, gap:100+Math.random()*200, passed:false});
    spawn();
    const onTap = () => {
      if (dead) return;
      if (overheated) { vy = Math.min(vy + 0.3, 5); return; }
      vy = -5; steam = Math.min(100, steam + 8);
      if (steam > 80) overheated = true;
    };
    canvas.addEventListener("pointerdown", onTap);
    let raf = 0;
    const loop = () => {
      if (dead) return;
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      vy += overheated ? 0.35 : 0.25; y += vy;
      if (steam > 0 && !overheated) steam = Math.max(0, steam - 0.3);
      else if (overheated) { steam = Math.max(0, steam - 0.5); if (steam < 30) overheated = false; }
      if (frame % 90 === 0) spawn();
      pipes.forEach(p => {
        p.x -= overheated ? 1.5 : 2.5;
        if (!p.passed && p.x < 80) { p.passed = true; setScore(s => s + 1); }
        ctx.fillStyle = "#243240"; ctx.fillRect(p.x, 0, 40, p.gap - 60); ctx.fillRect(p.x, p.gap + 60, 40, H);
        if (80 > p.x && 80 < p.x + 40 && (y < p.gap - 50 || y > p.gap + 50)) { dead = true; setOver(true); }
      });
      pipes = pipes.filter(p => p.x > -50);
      if (y > H || y < 0) { dead = true; setOver(true); }
      // Gears
      pipes.forEach(p => { ctx.fillStyle = "#8d968e"; ctx.fillRect(p.x+5, p.gap-60-12, 30, 12); ctx.fillRect(p.x+5, p.gap+60, 30, 12); });
      // Player
      ctx.fillStyle = overheated ? "#ff6a3d" : "#3ee0d0";
      ctx.beginPath(); ctx.arc(80, y, 14, 0, Math.PI*2); ctx.fill();
      // Steam gauge
      ctx.fillStyle = "#243240"; ctx.fillRect(10, H-30, 100, 12);
      ctx.fillStyle = overheated ? "#ff6a3d" : "#3ee0d0"; ctx.fillRect(12, H-28, steam*0.96, 8);
      setPressure(Math.round(steam));
      frame++; raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); canvas.removeEventListener("pointerdown", onTap); };
  }, []);

  return (
    <GameShell title="Flappy Steampunk Aviator" sidebar={<>
      <Stat label="Score" value={score} />
      <Stat label="Steam" value={`${pressure}%`} />
      {over && <Msg>💀 Overheated or crashed! Tap to restart.</Msg>}
      <Msg>Tap/click to boost. Over-boosting overheats → forced glide.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}

/* ═══════════════ 15. Asteroids: Vector Drift �══════════════ */

export function AsteroidsDrift() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 480, H = 400; canvas.width = W; canvas.height = H;
    let sx = W/2, sy = H/2, svx = 0, svy = 0, ang = 0, thrust = false;
    const roids: {x:number;y:number;vx:number;vy:number;r:number}[] = [];
    for (let i = 0; i < 5; i++) roids.push({x:Math.random()*W, y:Math.random()*H, vx:(Math.random()-0.5)*2, vy:(Math.random()-0.5)*2, r:30});
    const wells: {x:number;y:number;r:number}[] = [];
    const bullets: {x:number;y:number;vx:number;vy:number;life:number}[] = [];
    const keys: Set<string> = new Set();
    const onDown = (e: KeyboardEvent) => keys.add(e.key);
    const onUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    let raf = 0, cd = 0;
    const loop = () => {
      ctx.fillStyle = "#071018"; ctx.fillRect(0,0,W,H);
      if (keys.has("ArrowLeft")) ang -= 0.08;
      if (keys.has("ArrowRight")) ang += 0.08;
      thrust = keys.has("ArrowUp");
      if (thrust) { svx += Math.cos(ang)*0.15; svy += Math.sin(ang)*0.15; }
      if (keys.has(" ") && cd <= 0) { bullets.push({x:sx,y:sy,vx:Math.cos(ang)*5,vy:Math.sin(ang)*5,life:60}); cd = 10; }
      if (cd > 0) cd--;
      svx *= 0.99; svy *= 0.99; sx += svx; sy += svy;
      if (sx<0) sx=W; if (sx>W) sx=0; if (sy<0) sy=H; if (sy>H) sy=0;
      // Gravity wells
      wells.forEach(w => { const dx = w.x-sx, dy = w.y-sy, d = Math.hypot(dx,dy); if (d < w.r) { svx += dx/d*0.1; svy += dy/d*0.1; } });
      for (let i = wells.length-1; i >= 0; i--) { if (Math.hypot(wells[i].x-sx, wells[i].y-sy) < 15) wells.splice(i,1); }
      // Bullets
      for (let i = bullets.length-1; i >= 0; i--) {
        const b = bullets[i]; b.x += b.vx; b.y += b.vy; b.life--;
        if (b.life <= 0) { bullets.splice(i,1); continue; }
        for (let j = roids.length-1; j >= 0; j--) {
          const r = roids[j];
          if (Math.hypot(b.x-r.x, b.y-r.y) < r.r) {
            setScore(s => s + 20);
            if (r.r > 15) { roids.push({x:r.x,y:r.y,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,r:r.r/2}); roids.push({x:r.x,y:r.y,vx:(Math.random()-0.5)*3,vy:(Math.random()-0.5)*3,r:r.r/2}); }
            else wells.push({x:r.x,y:r.y,r:60});
            roids.splice(j,1); bullets.splice(i,1);
          }
        }
      }
      roids.forEach(r => {
        r.x += r.vx; r.y += r.vy; if (r.x<0||r.x>W) r.vx*=-1; if (r.y<0||r.y>H) r.vy*=-1;
        if (Math.hypot(r.x-sx, r.y-sy) < r.r + 8) { setLives(l => l-1); sx = W/2; sy = H/2; svx = svy = 0; }
        ctx.strokeStyle = "#8d968e"; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, Math.PI*2); ctx.stroke();
      });
      // Draw ship
      ctx.save(); ctx.translate(sx, sy); ctx.rotate(ang);
      ctx.strokeStyle = "#3ee0d0"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(12,0); ctx.lineTo(-8,-8); ctx.lineTo(-8,8); ctx.closePath(); ctx.stroke();
      if (thrust) { ctx.strokeStyle = "#ff6a3d"; ctx.beginPath(); ctx.moveTo(-8,0); ctx.lineTo(-14,0); ctx.stroke(); }
      ctx.restore();
      // Bullets
      ctx.fillStyle = "#ff6a3d"; bullets.forEach(b => ctx.fillRect(b.x-1, b.y-1, 3, 3));
      // Wells
      wells.forEach(w => { ctx.strokeStyle = "rgba(62,224,208,0.2)"; ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, Math.PI*2); ctx.stroke(); });
      if (roids.length === 0) { for (let i = 0; i < 6; i++) roids.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-0.5)*2,vy:(Math.random()-0.5)*2,r:30}); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  return (
    <GameShell title="Asteroids: Vector Drift" sidebar={<>
      <Stat label="Score" value={score} />
      <Stat label="Lives" value={lives} />
      <Msg>←→ rotate · ↑ thrust · Space fire. Shards release gravity wells.</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}
