import { useState, useEffect, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("cyber-factory")!;

type Machine = { id: number; type: "scrap" | "cooling" | "power"; level: number; hp: number; cost: number };

export default function CyberFactory() {
  const [scrap, setScrap] = useState(0);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [power, setPower] = useState(0);
  const [heat, setHeat] = useState(0);
  const [drones, setDrones] = useState(0);
  const [droneHp, setDroneHp] = useState<number[]>([]);
  const [best, setBest] = usePersist("arcade-factory-best", 0);
  const [nextId, setNextId] = useState(1);

  // Tick loop
  useEffect(() => {
    const t = setInterval(() => {
      let gain = 0, powerUse = 0, heatGen = 0;
      machines.forEach((m) => {
        if (m.hp <= 0) return;
        if (m.type === "scrap") { gain += m.level * 2; heatGen += m.level; }
        if (m.type === "power") powerUse -= m.level * 3;
        if (m.type === "cooling") heatGen -= m.level * 2;
        powerUse += 1;
      });
      setScrap((s) => { const ns = s + gain + drones * 0.5; if (ns > best) setBest(ns); return ns; });
      setPower((p) => Math.max(0, Math.min(50, p + 5 - powerUse)));
      setHeat((h) => {
        const nh = Math.max(0, Math.min(100, h + heatGen));
        if (nh >= 100) setMachines((ms) => ms.map((m) => ({ ...m, hp: Math.max(0, m.hp - 10) })));
        return nh;
      });
      // Drone degradation
      setDroneHp((dh) => dh.map((h) => Math.max(0, h - 1)));
    }, 1000);
    return () => clearInterval(t);
  }, [machines, drones, best, setBest]);

  const buy = useCallback((type: Machine["type"]) => {
    const cost = type === "scrap" ? 20 : type === "cooling" ? 30 : 40;
    if (scrap < cost) return;
    setScrap((s) => s - cost);
    setMachines((ms) => [...ms, { id: nextId, type, level: 1, hp: 100, cost }]);
    setNextId((n) => n + 1);
  }, [scrap, nextId]);

  const upgrade = useCallback((id: number) => {
    setMachines((ms) => ms.map((m) => m.id === id && scrap >= m.level * 15 ? { ...m, level: m.level + 1 } : m));
    setScrap((s) => s - (machines.find((m) => m.id === id)?.level ?? 1) * 15);
  }, [scrap, machines]);

  const buyDrone = useCallback(() => {
    if (scrap < 50) return;
    setScrap((s) => s - 50);
    setDrones((d) => d + 1);
    setDroneHp((dh) => [...dh, 100]);
  }, [scrap]);

  const repair = useCallback((idx: number) => {
    if (scrap < 10) return;
    setScrap((s) => s - 10);
    setDroneHp((dh) => dh.map((h, i) => i === idx ? 100 : h));
  }, [scrap]);

  const reset = () => {
    setScrap(0);
    setMachines([]);
    setPower(0);
    setHeat(0);
    setDrones(0);
    setDroneHp([]);
    setNextId(1);
  };

  const typeColor: Record<string, string> = { scrap: "#f97316", cooling: "#60a5fa", power: "#fbbf24" };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${Math.floor(scrap)}`} best={`${Math.floor(best)}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        {/* Gauges */}
        <div className="grid w-full max-w-sm grid-cols-3 gap-2">
          <Gauge label="Power" value={power} max={50} color="#fbbf24" />
          <Gauge label="Heat" value={heat} max={100} color="#ff6a3d" warn />
          <Gauge label="Drones" value={drones} max={10} color={G.accent} />
        </div>
        <button type="button" onClick={() => setScrap((s) => s + 1)} className="rounded-xl border-2 px-8 py-4 text-lg font-bold transition-all active:scale-95" style={{ borderColor: G.accent, color: G.accent, background: G.accent + "11" }}>
          🔧 Generate Scrap (+1)
        </button>
        {/* Buy buttons */}
        <div className="flex gap-2">
          <button type="button" onClick={() => buy("scrap")} disabled={scrap < 20} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: typeColor.scrap, color: typeColor.scrap }}>🏭 Scrap (20)</button>
          <button type="button" onClick={() => buy("cooling")} disabled={scrap < 30} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: typeColor.cooling, color: typeColor.cooling }}>❄️ Cooling (30)</button>
          <button type="button" onClick={() => buy("power")} disabled={scrap < 40} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: typeColor.power, color: typeColor.power }}>⚡ Power (40)</button>
          <button type="button" onClick={buyDrone} disabled={scrap < 50} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: G.accent, color: G.accent }}>🤖 Drone (50)</button>
        </div>
        {/* Machines */}
        <div className="grid w-full max-w-sm grid-cols-2 gap-2">
          {machines.map((m) => (
            <div key={m.id} className="rounded-lg border p-2" style={{ borderColor: typeColor[m.type] + "44", background: typeColor[m.type] + "08" }}>
              <div className="flex items-center justify-between">
                <span className="text-sm">{m.type === "scrap" ? "🏭" : m.type === "cooling" ? "❄️" : "⚡"} Lv{m.level}</span>
                <button type="button" onClick={() => upgrade(m.id)} disabled={scrap < m.level * 15} className="text-xs text-primary disabled:opacity-40">⬆ {m.level * 15}</button>
              </div>
              <div className="mt-1 h-1 rounded-full bg-surface"><div className="h-full rounded-full" style={{ width: `${m.hp}%`, background: m.hp > 50 ? G.accent : "#ff6a3d" }} /></div>
            </div>
          ))}
        </div>
        {/* Drones */}
        {droneHp.map((hp, i) => (
          <button key={i} type="button" onClick={() => repair(i)} disabled={scrap < 10 || hp >= 100} className="flex items-center gap-2 rounded-lg border border-line px-2 py-1 text-xs disabled:opacity-40">
            🤖 HP: {hp} {hp < 50 && "⚠️"} {hp < 100 && "🔧 Repair(10)"}
          </button>
        ))}
        {heat >= 80 && <p className="text-sm text-ember animate-pulse">⚠️ OVERHEATING — machines taking damage!</p>}
      </div>
    </GameShell>
  );
}

function Gauge({ label, value, max, color, warn }: { label: string; value: number; max: number; color: string; warn?: boolean }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <p className="mb-1 text-xs text-muted">{label}: {Math.round(value)}</p>
      <div className="h-2 overflow-hidden rounded-full bg-surface">
        <div className="h-full transition-all" style={{ width: `${pct}%`, background: warn && pct > 70 ? "#ff6a3d" : color }} />
      </div>
    </div>
  );
}
