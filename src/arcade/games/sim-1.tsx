import { useState, useEffect } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 41. Cyber-Factory Idle ═══════════════ */

export function CyberFactory() {
  const [scrap, setScrap] = useState(0);
  const [power, setPower] = useState(100);
  const [cooling, setCooling] = useState(100);
  const [drones, setDrones] = useState(0);
  const [droneHp, setDroneHp] = useState<number[]>([]);

  useEffect(() => {
    const id = setInterval(() => {
      setScrap(s => s + drones);
      setPower(p => Math.max(0, p - drones * 0.5));
      setCooling(c => Math.max(0, c - drones * 0.3));
      if (drones > 0 && (power < 20 || cooling < 20)) {
        setDroneHp(hp => hp.map(h => Math.max(0, h - 5)));
      }
    }, 1000);
    return () => clearInterval(id);
  }, [drones, power, cooling]);

  function buyDrone() {
    if (scrap < 20) return;
    setScrap(s => s - 20); setDrones(d => d + 1); setDroneHp(hp => [...hp, 100]);
  }
  function repair() {
    if (scrap < 5) return;
    setScrap(s => s - 5);
    setDroneHp(hp => hp.map(h => Math.min(100, h + 20)));
    setCooling(c => Math.min(100, c + 10)); setPower(p => Math.min(100, p + 10));
  }

  return (
    <GameShell title="Cyber-Factory Idle" sidebar={<>
      <Stat label="Scrap" value={Math.floor(scrap)} />
      <Stat label="Drones" value={drones} />
      <Stat label="Power" value={`${Math.round(power)}%`} />
      <Stat label="Cooling" value={`${Math.round(cooling)}%`} />
      <Btn onClick={buyDrone} disabled={scrap < 20} className="w-full">🤖 Buy drone (20)</Btn>
      <Btn onClick={repair} disabled={scrap < 5} variant="ghost" className="w-full">🔧 Repair (5)</Btn>
      <Msg>{power < 20 ? "⚠️ Low power!" : cooling < 20 ? "⚠️ Overheating!" : "Click gear for scrap. Drones auto-produce."}</Msg>
    </>}>
      <div className="flex flex-col items-center gap-6">
        <button onClick={() => setScrap(s => s + 1)}
          className="flex size-40 items-center justify-center rounded-2xl border-2 border-primary/40 bg-elevated text-6xl transition-all hover:scale-105 active:scale-95">
          ⚙️
        </button>
        <div className="grid grid-cols-5 gap-2">
          {droneHp.map((h, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="text-2xl">{h > 50 ? "🤖" : h > 0 ? "🔧" : "💀"}</div>
              <div className="mt-1 h-12 w-3 rounded-full bg-surface border border-line">
                <div className="rounded-full bg-primary transition-all" style={{height: `${h}%`}} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 42. Micro-Cosmos Builder ═══════════════ */

export function MicroCosmos() {
  const [oxygen, setOxygen] = useState(50);
  const [carbon, setCarbon] = useState(30);
  const [temp, setTemp] = useState(15);
  const [life, setLife] = useState(0);
  const [log, setLog] = useState("Balance the atmosphere to evolve life");
  const [event, setEvent] = useState("");

  useEffect(() => {
    const id = setInterval(() => {
      setOxygen(o => Math.max(0, Math.min(100, o + (Math.random() - 0.45) * 3)));
      setCarbon(c => Math.max(0, Math.min(100, c + (Math.random() - 0.55) * 3)));
      setTemp(t => Math.max(-50, Math.min(50, t + (Math.random() - 0.5) * 2)));
      setLife(l => {
        if (oxygen > 20 && oxygen < 80 && temp > 0 && temp < 30 && carbon < 70) return Math.min(100, l + 1);
        if (oxygen < 10 || temp > 40 || temp < -10 || carbon > 90) return Math.max(0, l - 2);
        return l;
      });
      if (Math.random() < 0.05) {
        const events = ["☀️ Solar flare!", "❄️ Ice age!", "🌋 Volcanic eruption!", "🌧️ Rain!"];
        const ev = events[Math.floor(Math.random() * events.length)];
        setEvent(ev);
        if (ev.includes("Solar")) setTemp(t => t + 10);
        if (ev.includes("Ice")) setTemp(t => t - 10);
        if (ev.includes("Volcanic")) setCarbon(c => c + 15);
        if (ev.includes("Rain")) setOxygen(o => o + 10);
        setTimeout(() => setEvent(""), 2000);
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  function adjust(gas: string, delta: number) {
    if (gas === "O2") setOxygen(o => Math.min(100, Math.max(0, o + delta)));
    if (gas === "CO2") setCarbon(c => Math.min(100, Math.max(0, c + delta)));
    if (gas === "temp") setTemp(t => t + delta);
  }
  const evolved = life >= 100;

  return (
    <GameShell title="Micro-Cosmos Builder" sidebar={<>
      <Stat label="Life" value={`${Math.round(life)}%`} />
      <Stat label="Oxygen" value={`${Math.round(oxygen)}%`} />
      <Stat label="Carbon" value={`${Math.round(carbon)}%`} />
      <Stat label="Temp" value={`${Math.round(temp)}°C`} />
      {event && <Msg>{event}</Msg>}
      <Msg>{evolved ? "🏆 Fully evolved!" : life <= 0 ? "💀 Extinction!" : log}</Msg>
    </>}>
      <div className="flex flex-col items-center gap-4">
        <div className="flex size-48 items-center justify-center rounded-full border-4 border-line bg-gradient-to-b from-primary/10 to-bg text-6xl">
          {evolved ? "🌍" : life > 50 ? "🦠" : life > 20 ? "🧫" : life > 0 ? "🔬" : "💀"}
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => adjust("O2", 5)} variant="ghost">+O₂</Btn>
          <Btn onClick={() => adjust("O2", -5)} variant="ghost">-O₂</Btn>
          <Btn onClick={() => adjust("CO2", -5)} variant="ghost">-CO₂</Btn>
          <Btn onClick={() => adjust("temp", 2)} variant="ghost">+Temp</Btn>
          <Btn onClick={() => adjust("temp", -2)} variant="ghost">-Temp</Btn>
        </div>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 43. Cozy Deep-Sea Fishing ═══════════════ */

const FISH_TYPES = [
  { name: "Sardine", depth: 0, bait: "worm", value: 5, icon: "🐟" },
  { name: "Tuna", depth: 1, bait: "fish", value: 15, icon: "🐠" },
  { name: "Anglerfish", depth: 2, bait: "glow", value: 40, icon: "🐡" },
  { name: "Leviathan", depth: 3, bait: "meat", value: 100, icon: "🐋" },
];
const BAITS = ["worm", "fish", "glow", "meat"];
const BAIT_COST: Record<string, number> = { worm: 0, fish: 10, glow: 25, meat: 50 };

export function CozyFishing() {
  const [money, setMoney] = useState(50);
  const [bait, setBait] = useState("worm");
  const [depth, setDepth] = useState(0);
  const [reeling, setReeling] = useState(false);
  const [tension, setTension] = useState(0);
  const [catchMsg, setCatchMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!reeling) return;
    const id = setInterval(() => {
      setTension(t => {
        const nt = Math.max(0, t + (Math.random() * 20 - 8));
        if (nt >= 100 || nt <= 0) { setReeling(false); return 0; }
        return nt;
      });
    }, 200);
    return () => clearInterval(id);
  }, [reeling]);

  function cast() {
    if (reeling) return;
    setTension(40); setReeling(true); setCatchMsg(null);
  }
  function reel() {
    if (!reeling) return;
    if (tension > 20 && tension < 80) {
      const fish = FISH_TYPES.find(f => f.depth === depth && f.bait === bait);
      if (fish) { setMoney(m => m + fish.value); setCatchMsg(`${fish.icon} +${fish.value}!`); }
      setReeling(false); setTension(0);
    }
  }
  function buyBait(b: string) {
    if (money >= BAIT_COST[b]) { setBait(b); setMoney(m => m - BAIT_COST[b]); }
  }
  const pressure = depth * 25;

  return (
    <GameShell title="Cozy Deep-Sea Fishing" sidebar={<>
      <Stat label="Money" value={money} />
      <Stat label="Depth" value={["Shallow","Mid","Deep","Abyss"][depth]} />
      <Stat label="Pressure" value={`${pressure}%`} />
      <Msg>Bait: {bait}</Msg>
    </>}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-64 w-full max-w-sm rounded-lg border border-line bg-gradient-to-b from-primary/5 to-bg overflow-hidden">
          <span className="absolute top-4 left-1/2 -translate-x-1/2 text-4xl">🌊</span>
          {catchMsg && <span className="absolute top-12 left-1/2 -translate-x-1/2 text-lg font-bold text-primary">{catchMsg}</span>}
          {reeling && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
              <div className="h-3 w-40 rounded-full border border-line bg-surface">
                <div className="h-full rounded-full transition-all" style={{width: `${tension}%`, backgroundColor: tension > 80 || tension < 20 ? "#ff6a3d" : "#3ee0d0"}} />
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-2">
            {BAITS.map(b => (
              <button key={b} onClick={() => buyBait(b)} className={`rounded-md border px-3 py-1.5 text-xs ${bait === b ? "border-primary bg-primary/10" : "border-line bg-surface"}`}>{b}</button>
            ))}
          </div>
          <div className="flex gap-2">
            <Btn onClick={() => setDepth(d => Math.max(0, d-1))} variant="ghost">↑ Shallow</Btn>
            <Btn onClick={() => setDepth(d => Math.min(3, d+1))} variant="ghost">↓ Deep</Btn>
          </div>
          {!reeling ? <Btn onClick={cast}>🎣 Cast</Btn> : <Btn onClick={reel}>Reel in</Btn>}
        </div>
        <p className="text-xs text-muted">Keep tension 20-80% while reeling. Match bait to fish.</p>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 44. Pocket Biotech Nursery ═══════════════ */

export function BiotechNursery() {
  const [pet, setPet] = useState({ hunger: 50, sleep: 50, rad: 0, stage: 0 });
  const [log, setLog] = useState("Raise your biotech pet");

  useEffect(() => {
    const id = setInterval(() => {
      setPet(p => {
        const ns = { hunger: Math.max(0, p.hunger - 1), sleep: Math.max(0, p.sleep - 0.5), rad: Math.max(0, p.rad - 0.3), stage: p.stage };
        if (ns.hunger < 10) setLog("🤢 Starving!");
        else if (ns.sleep < 10) setLog("😴 Exhausted!");
        else if (ns.rad > 80) setLog("☢️ Over-radiated!");
        else if (ns.hunger > 40 && ns.sleep > 40 && ns.rad > 30 && ns.stage < 4) {
          ns.stage++; ns.rad = 0; setLog(`🧬 Evolved to stage ${ns.stage + 1}!`);
        }
        return ns;
      });
    }, 2000);
    return () => clearInterval(id);
  }, []);

  function feed() { setPet(p => ({...p, hunger: Math.min(100, p.hunger + 20)})); setLog("🍖 Fed!"); }
  function rest() { setPet(p => ({...p, sleep: Math.min(100, p.sleep + 30)})); setLog("💤 Resting!"); }
  function irradiate() { setPet(p => ({...p, rad: Math.min(100, p.rad + 25)})); setLog("☢️ Irradiated!"); }
  const stages = ["🥚", "🫧", "🦠", "🦎", "🧬"];

  return (
    <GameShell title="Pocket Biotech Nursery" sidebar={<>
      <Stat label="Stage" value={`${pet.stage + 1}/5`} />
      <div><p className="text-xs uppercase text-muted">Hunger</p><div className="mt-1 h-3 rounded-full bg-surface border border-line"><div className="h-full rounded-full bg-ember" style={{width: `${pet.hunger}%`}} /></div></div>
      <div><p className="text-xs uppercase text-muted">Sleep</p><div className="mt-1 h-3 rounded-full bg-surface border border-line"><div className="h-full rounded-full bg-primary" style={{width: `${pet.sleep}%`}} /></div></div>
      <div><p className="text-xs uppercase text-muted">Radiation</p><div className="mt-1 h-3 rounded-full bg-surface border border-line"><div className="h-full rounded-full bg-yellow-500" style={{width: `${pet.rad}%`}} /></div></div>
      <Msg>{log}</Msg>
    </>}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex size-40 items-center justify-center rounded-full border-4 border-line bg-gradient-to-b from-primary/10 to-bg text-7xl">
          {stages[pet.stage]}
        </div>
        <div className="flex gap-2">
          <Btn onClick={feed}>🍖 Feed</Btn>
          <Btn onClick={rest} variant="ghost">💤 Rest</Btn>
          <Btn onClick={irradiate} variant="ghost">☢️ Irradiate</Btn>
        </div>
        <p className="text-xs text-muted">High hunger + sleep + radiation triggers evolution.</p>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 45. Espresso Tycoon: Rush Hour ═══════════════ */

const DRINKS = [
  { name: "Espresso", recipe: ["coffee"], price: 3, time: 5 },
  { name: "Latte", recipe: ["coffee", "milk"], price: 5, time: 8 },
  { name: "Mocha", recipe: ["coffee", "milk", "chocolate"], price: 7, time: 10 },
];
const INGREDIENTS = ["coffee", "milk", "chocolate"];

export function EspressoTycoon() {
  const [stock, setStock] = useState({ coffee: 10, milk: 10, chocolate: 10 });
  const [money, setMoney] = useState(20);
  const [stress, setStress] = useState(0);
  const [queue, setQueue] = useState<{drink: number; timer: number}[]>([]);
  const [log, setLog] = useState("Serve customers before they walk out");
  const [serving, setServing] = useState<number | null>(null);
  const [serveProgress, setServeProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (queue.length < 4 && Math.random() < 0.4) {
        setQueue(q => [...q, { drink: Math.floor(Math.random() * DRINKS.length), timer: 15 }]);
      }
      setQueue(q => q.map(o => ({...o, timer: o.timer - 1})).filter(o => {
        if (o.timer <= 0) { setStress(s => Math.min(100, s + 15)); setLog("😡 Customer walked out!"); return false; }
        return true;
      }));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (serving === null) return;
    const id = setInterval(() => {
      setServeProgress(p => {
        if (p >= 100) {
          const drink = DRINKS[serving];
          setMoney(m => m + drink.price);
          setStress(s => Math.max(0, s - 5));
          setLog(`✅ Served ${drink.name}! +${drink.price}`);
          setServing(null);
          return 0;
        }
        return p + 10;
      });
    }, 100);
    return () => clearInterval(id);
  }, [serving]);

  function serve(idx: number) {
    const drink = DRINKS[queue[idx].drink];
    if (drink.recipe.some(ing => stock[ing as keyof typeof stock] <= 0)) { setLog("❌ Not enough ingredients!"); return; }
    setStock(s => { const ns = {...s}; drink.recipe.forEach(ing => ns[ing as keyof typeof ns]--); return ns; });
    setQueue(q => q.filter((_, i) => i !== idx));
    setServing(queue[idx].drink); setServeProgress(0);
  }
  function restock() {
    if (money < 10) return;
    setMoney(m => m - 10);
    setStock(s => ({ coffee: s.coffee + 5, milk: s.milk + 5, chocolate: s.chocolate + 5 }));
    setLog("📦 Restocked!");
  }
  const over = stress >= 100;

  return (
    <GameShell title="Espresso Tycoon: Rush Hour" sidebar={<>
      <Stat label="Money" value={money} />
      <Stat label="Stress" value={`${Math.round(stress)}%`} />
      <Stat label="Queue" value={queue.length} />
      <Btn onClick={restock} disabled={money < 10} variant="ghost" className="w-full">📦 Restock (10)</Btn>
      <Msg>{over ? "💀 Burnout!" : log}</Msg>
    </}>      <div className="flex flex-col items-center gap-4">
        {serving !== null && (
          <div className="w-full max-w-sm rounded-lg border border-line bg-surface p-3">
            <p className="text-center text-sm text-muted">Making {DRINKS[serving].name}…</p>
            <div className="mt-2 h-3 rounded-full bg-bg border border-line">
              <div className="h-full rounded-full bg-primary transition-all" style={{width: `${serveProgress}%`}} />
            </div>
          </div>
        )}
        <div className="flex flex-col gap-2">
          {queue.length === 0 && <p className="text-center text-sm text-muted">Waiting for customers…</p>}
          {queue.map((order, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-line bg-surface p-3">
              <span className="text-sm text-fg">{DRINKS[order.drink].name} — ${DRINKS[order.drink].price}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted">{order.timer}s</span>
                <button onClick={() => serve(i)} disabled={serving !== null}
                  className="rounded-md bg-primary px-3 py-1 text-xs font-bold text-bg disabled:opacity-40">Serve</button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3 text-xs text-muted">
          <span>☕ {stock.coffee}</span><span>🥛 {stock.milk}</span><span>🍫 {stock.chocolate}</span>
        </div>
      </div>
    </GameShell>
  );
}
