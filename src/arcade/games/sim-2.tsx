import { useState, useEffect, useRef } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 46. Metropolis Traffic Grid ═══════════════ */

const INTERSECTIONS = 4;
type Light = "NS" | "EW";

export function TrafficGrid() {
  const [lights, setLights] = useState<Light[]>(Array(INTERSECTIONS).fill("NS"));
  const [cars, setCars] = useState<{x:number;y:number;vx:number;vy:number;wait:number}[]>([]);
  const [economy, setEconomy] = useState(100);
  const [rage, setRage] = useState(0);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (over) return;
      if (cars.length < 8 && Math.random() < 0.3) {
        const horiz = Math.random() < 0.5;
        cars.push({
          x: horiz ? -20 : Math.random() * 400,
          y: horiz ? Math.floor(Math.random() * 4) * 100 : -20,
          vx: horiz ? 2 : 0,
          vy: horiz ? 0 : 2,
          wait: 0,
        });
      }
      setCars(prev => {
        const nc = prev.map(c => {
          const dir = c.vx > 0 ? "EW" : c.vy > 0 ? "NS" : "NS";
          const lightIdx = c.vx > 0 ? Math.floor(c.x / 100) : Math.floor(c.y / 100);
          const atLight = c.vx > 0 ? c.x % 100 < 10 && c.x % 100 > 5 : c.y % 100 < 10 && c.y % 100 > 5;
          if (atLight && lightIdx >= 0 && lightIdx < INTERSECTIONS && lights[lightIdx] !== dir) {
            return { ...c, wait: c.wait + 1 };
          }
          return { ...c, x: c.x + c.vx, y: c.y + c.vy, wait: 0 };
        }).filter(c => c.x < 420 && c.y < 420);
        const waiting = nc.filter(c => c.wait > 0).length;
        if (waiting > 0) { setRage(r => Math.min(100, r + waiting * 2)); setEconomy(e => Math.max(0, e - waiting)); }
        else { setScore(s => s + nc.length); setRage(r => Math.max(0, r - 1)); }
        return nc;
      });
      if (rage >= 100) setOver(true);
    }, 200);
    return () => clearInterval(id);
  }, [lights, rage, over]);

  function toggle(i: number) {
    setLights(l => l.map((x, j) => j === i ? (x === "NS" ? "EW" : "NS") : x));
  }
  const reset = () => { setLights(Array(INTERSECTIONS).fill("NS")); setCars([]); setEconomy(100); setRage(0); setScore(0); setOver(false); };

  return (
    <GameShell title="Metropolis Traffic Grid" sidebar={<>
      <Stat label="Economy" value={`${economy}`} />
      <Stat label="Rage" value={`${Math.round(rage)}%`} />
      <Stat label="Score" value={score} />
      {over && <Msg>💀 Gridlock collapse!</Msg>}
      <Btn onClick={reset} variant="ghost" className="w-full">Restart</Btn>
    </>}>
      <div className="mx-auto max-w-md">
        <div className="relative rounded-lg border border-line bg-bg" style={{width: 400, height: 400}}>
          {Array.from({length: 4}).map((_, i) => (
            <button key={i} onClick={() => toggle(i)}
              className={`absolute flex size-12 items-center justify-center rounded-md border-2 text-xs font-bold ${
                lights[i] === "NS" ? "border-primary text-primary" : "border-ember text-ember"
              } bg-surface`}
              style={{left: i * 100 - 24 + 62, top: 188}}>
              {lights[i]}
            </button>
          ))}
          {cars.map((c, i) => (
            <div key={i} className={`absolute size-3 rounded-full ${c.wait > 5 ? "bg-ember" : "bg-primary"}`}
              style={{left: c.x, top: c.y}} />
          ))}
          <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
            {Array.from({length: 16}).map((_, i) => <div key={i} className="border border-line/30" />)}
          </div>
        </div>
        <p className="mt-2 text-center text-xs text-muted">Click intersections to toggle lights. Keep traffic flowing!</p>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 47. Alchemist's Lemonade Stand ═══════════════ */

const RECIPES = [
  { name: "Basic", ingredients: ["lemon", "sugar"], price: 2 },
  { name: "Fizzy", ingredients: ["lemon", "sugar", "fizz"], price: 5 },
  { name: "Health", ingredients: ["lemon", "herb"], price: 8 },
  { name: "Mystic", ingredients: ["lemon", "sugar", "herb", "fizz"], price: 15 },
];
const WEATHERS = ["☀️ Sunny", "🌧️ Rainy", "❄️ Cold", "🌡️ Hot"];
const DISEASES = ["None", "Cold", "Flu"];

export function AlchemistLemonade() {
  const [money, setMoney] = useState(30);
  const [day, setDay] = useState(1);
  const [weather, setWeather] = useState(0);
  const [disease, setDisease] = useState(0);
  const [recipe, setRecipe] = useState(0);
  const [price, setPrice] = useState(RECIPES[0].price);
  const [log, setLog] = useState("Mix potions for market demand");

  function nextDay() {
    let demand = 10;
    if (weather === 3) demand += 10;
    if (weather === 1) demand -= 5;
    if (disease === 2 && recipe === 2) demand += 15;
    if (disease === 1 && recipe === 2) demand += 8;
    if (price > RECIPES[recipe].price * 2) demand = Math.floor(demand * 0.3);
    const earnings = demand * price;
    setMoney(m => m + earnings);
    setLog(`Day ${day}: Sold ${demand} × ${RECIPES[recipe].name} @ ${price} = +${earnings}`);
    setDay(d => d + 1);
    setWeather(Math.floor(Math.random() * 4));
    setDisease(Math.floor(Math.random() * 3));
  }

  return (
    <GameShell title="Alchemist's Lemonade Stand" sidebar={<>
      <Stat label="Money" value={money} />
      <Stat label="Day" value={day} />
      <Msg>{WEATHERS[weather]} | Disease: {DISEASES[disease]}</Msg>
      <Msg>{log}</Msg>
    </>}>
      <div className="flex flex-col items-center gap-6">
        <div className="text-6xl">{WEATHERS[weather]}</div>
        <div className="flex flex-col gap-2">
          <p className="text-center text-sm text-muted">Recipe:</p>
          <div className="flex gap-2">
            {RECIPES.map((r, i) => (
              <button key={i} onClick={() => { setRecipe(i); setPrice(r.price); }}
                className={`rounded-lg border px-3 py-2 text-xs ${recipe === i ? "border-primary bg-primary/10" : "border-line bg-surface"}`}>
                {r.name}<br/>${r.price}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted">Price:</span>
          <button onClick={() => setPrice(p => Math.max(1, p - 1))} className="rounded border border-line bg-surface px-2">-</button>
          <span className="font-mono text-lg text-fg">${price}</span>
          <button onClick={() => setPrice(p => p + 1)} className="rounded border border-line bg-surface px-2">+</button>
        </div>
        <Btn onClick={nextDay}>Next day →</Btn>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 48. Bonsai Cultivator Idle ═══════════════ */

export function BonsaiCultivator() {
  const [water, setWater] = useState(50);
  const [growth, setGrowth] = useState(0);
  const [blooms, setBlooms] = useState(0);
  const [income, setIncome] = useState(0);
  const [money, setMoney] = useState(0);
  const [modifiers, setModifiers] = useState<string[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setWater(w => Math.max(0, w - 1));
      setGrowth(g => {
        const rate = water > 20 ? 1 + modifiers.length * 0.5 : 0;
        return Math.min(100, g + rate);
      });
      if (growth >= 100 && water > 20) {
        setBlooms(b => b + 1);
        setGrowth(0);
        const earn = 10 + modifiers.length * 5;
        setMoney(m => m + earn);
        setIncome(earn);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [water, growth, modifiers]);

  function prune() {
    if (money < 15) return;
    setMoney(m => m - 15);
    setModifiers(m => [...m, "✨"]);
    setBlooms(b => b + 1);
  }
  const reset = () => { setWater(50); setGrowth(0); setBlooms(0); setMoney(0); setIncome(0); setModifiers([]); };

  return (
    <GameShell title="Bonsai Cultivator Idle" sidebar={<>
      <Stat label="Money" value={money} />
      <Stat label="Blooms" value={blooms} />
      <Stat label="Water" value={`${Math.round(water)}%`} />
      <Stat label="Growth" value={`${Math.round(growth)}%`} />
      <Btn onClick={prune} disabled={money < 15} className="w-full">✨ Prune (15)</Btn>
      <Btn onClick={reset} variant="ghost" className="w-full">Reset</Btn>
    </>}>
      <div className="flex flex-col items-center gap-6">
        <div className="relative flex h-64 w-48 items-end justify-center rounded-lg border border-line bg-gradient-to-t from-primary/5 to-bg">
          <div className="relative">
            <div className="h-2 w-32 rounded-full bg-line" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2" style={{height: `${50 + growth * 0.8}px`}}>
              <div className="mx-auto h-full w-3 rounded bg-gradient-to-t from-line to-primary/40" />
              {modifiers.map((_, i) => (
                <div key={i} className="absolute rounded-full bg-ember" style={{
                  left: `${Math.sin(i * 2) * 20}px`,
                  top: `${i * 30 + 20}px`,
                  width: 12, height: 12,
                  boxShadow: "0 0 8px rgba(255,106,61,0.6)",
                }} />
              ))}
            </div>
          </div>
        </div>
        <Btn onClick={() => setWater(w => Math.min(100, w + 30))}>💧 Water (+30%)</Btn>
        {income > 0 && <p className="text-sm text-primary">Last bloom earned +${income}</p>}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 49. Grand Museum Curator ═══════════════ */

const ARTIFACTS = [
  { name: "Vase", icon: "🏺", synergy: { ancient: 2, art: 1 } },
  { name: "Painting", icon: "🖼️", synergy: { art: 2, modern: 1 } },
  { name: "Sculpture", icon: "🗿", synergy: { ancient: 1, art: 1 } },
  { name: "Fossil", icon: "🦴", synergy: { ancient: 2 } },
  { name: "Jewel", icon: "💎", synergy: { modern: 2, art: 1 } },
];

export function MuseumCurator() {
  const [exhibits, setExhibits] = useState<(typeof ARTIFACTS[0])[]>([ARTIFACTS[0], ARTIFACTS[1]]);
  const [guards, setGuards] = useState(1);
  const [money, setMoney] = useState(50);
  const [income, setIncome] = useState(0);
  const [thieves, setThieves] = useState(0);
  const [log, setLog] = useState("Arrange exhibits for synergy bonuses");

  useEffect(() => {
    const id = setInterval(() => {
      const earn = exhibits.length * 5 + guards * 2;
      setMoney(m => m + earn);
      setIncome(earn);
      if (Math.random() < 0.1 && exhibits.length > guards) {
        setThieves(t => t + 1);
        setLog("🦹 Thief spotted! Hire more guards!");
        if (guards < exhibits.length && Math.random() < 0.5) {
          setExhibits(e => e.length > 1 ? e.slice(0, -1) : e);
          setLog("🦹 Artifact stolen! Hire guards!");
        }
      }
    }, 3000);
    return () => clearInterval(id);
  }, [exhibits, guards]);

  function buy(idx: number) {
    if (money < 15) return;
    setMoney(m => m - 15);
    setExhibits(e => [...e, ARTIFACTS[idx]]);
    setLog(`Added ${ARTIFACTS[idx].name}`);
  }
  function hireGuard() {
    if (money < 10) return;
    setMoney(m => m - 10);
    setGuards(g => g + 1);
    setLog("🛡️ Guard hired!");
  }

  return (
    <GameShell title="Grand Museum Curator" sidebar={<>
      <Stat label="Money" value={money} />
      <Stat label="Income" value={`+${income}/3s`} />
      <Stat label="Exhibits" value={exhibits.length} />
      <Stat label="Guards" value={guards} />
      <Stat label="Thefts" value={thieves} />
      <Btn onClick={hireGuard} disabled={money < 10} className="w-full">🛡️ Hire guard (10)</Btn>
      <Msg>{log}</Msg>
    </>}>
      <div className="flex flex-col items-center gap-6">
        <div className="grid grid-cols-5 gap-2">
          {exhibits.map((a, i) => (
            <div key={i} className="flex flex-col items-center rounded-lg border border-line bg-surface p-3">
              <span className="text-3xl">{a.icon}</span>
              <span className="mt-1 text-xs text-muted">{a.name}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {ARTIFACTS.map((a, i) => (
            <button key={i} onClick={() => buy(i)} disabled={money < 15}
              className="flex flex-col items-center rounded-lg border border-line bg-surface p-3 hover:bg-elevated disabled:opacity-40">
              <span className="text-2xl">{a.icon}</span>
              <span className="mt-1 text-xs text-muted">{a.name} (15)</span>
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 50. Red Planet Thruster Lander ═══════════════ */

export function RedPlanetLander() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hud, setHud] = useState({ fuel: 100, vel: 0, alt: 0, status: "flying", score: 0 });

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = 420, H = 480; canvas.width = W; canvas.height = H;
    let lx = W/2, ly = 40, vx = 0.5, vy = 0, fuel = 100, ang = 0;
    let landed = false, crashed = false, score = 0, thrust = 0;
    const terrain: number[] = [];
    for (let i = 0; i < W; i++) terrain.push(360 + Math.sin(i*0.015)*40 + Math.cos(i*0.03)*15);
    const pad = { s: 170, e: 230 };
    for (let i = pad.s; i < pad.e; i++) terrain[i] = 380;
    const keys: Set<string> = new Set();
    const onDown = (e: KeyboardEvent) => keys.add(e.key);
    const onUp = (e: KeyboardEvent) => keys.delete(e.key);
    window.addEventListener("keydown", onDown); window.addEventListener("keyup", onUp);
    let raf = 0;
    const loop = () => {
      if (landed || crashed) return;
      ctx.fillStyle = "#1a0a0a"; ctx.fillRect(0,0,W,H);
      if (keys.has("ArrowLeft")) ang -= 0.05;
      if (keys.has("ArrowRight")) ang += 0.05;
      thrust = 0;
      if (keys.has("ArrowUp") && fuel > 0) {
        vy += Math.cos(ang) * -0.15; vx += Math.sin(ang) * 0.15; fuel -= 0.4; thrust = 1;
      }
      vy += 0.06; vx *= 0.995; lx += vx; ly += vy;
      if (lx < 0) lx = W; if (lx > W) lx = 0;
      const gy = terrain[Math.max(0, Math.min(W-1, Math.floor(lx)))] ?? 380;
      if (ly >= gy - 10) {
        const onPad = lx > pad.s && lx < pad.e;
        const speed = Math.hypot(vx, vy);
        const angleOk = Math.abs(ang) < 0.3;
        if (onPad && speed < 2 && angleOk) { landed = true; score = Math.round(fuel * 10 + (2 - speed) * 50); setHud(h => ({...h, status: "landed", score})); }
        else { crashed = true; setHud(h => ({...h, status: "crashed"})); }
      }
      ctx.fillStyle = "#4a2020"; ctx.beginPath(); ctx.moveTo(0, H); terrain.forEach((y, x) => ctx.lineTo(x, y)); ctx.lineTo(W, H); ctx.fill();
      ctx.fillStyle = "#ff6a3d"; ctx.fillRect(pad.s, 376, pad.e-pad.s, 4);
      ctx.save(); ctx.translate(lx, ly); ctx.rotate(ang);
      ctx.fillStyle = crashed ? "#ff0" : "#ece7de"; ctx.fillRect(-7, -7, 14, 14);
      if (thrust) { ctx.fillStyle = "#ff6a3d"; ctx.beginPath(); ctx.moveTo(-4, 7); ctx.lineTo(4, 7); ctx.lineTo(0, 14); ctx.fill(); }
      ctx.restore();
      setHud({ fuel: Math.max(0, Math.round(fuel)), vel: Math.round(Math.hypot(vx, vy)*10)/10, alt: Math.round(gy - ly), status: landed ? "landed" : crashed ? "crashed" : "flying", score });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("keydown", onDown); window.removeEventListener("keyup", onUp); };
  }, []);

  return (
    <GameShell title="Red Planet Thruster Lander" sidebar={<>
      <Stat label="Fuel" value={`${hud.fuel}%`} />
      <Stat label="Altitude" value={hud.alt} />
      <Stat label="Velocity" value={hud.vel} />
      <Stat label="Score" value={hud.score} />
      <Msg>{hud.status === "landed" ? `🏆 Landed! Score: ${hud.score}` : hud.status === "crashed" ? "💥 Crashed!" : "↑ thrust · ←→ rotate. Land upright, slow, on pad."}</Msg>
    </>}>
      <canvas ref={canvasRef} className="mx-auto block rounded-lg border border-line" />
    </GameShell>
  );
}
