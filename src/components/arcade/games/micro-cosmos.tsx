import { useState, useEffect, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("micro-cosmos")!;

type Life = { stage: number; name: string };
const LIFE_STAGES = ["Microbe", "Algae", "Plankton", "Worm", "Fish", "Amphibian", "Reptile", "Mammal", "Sentient"];

export default function MicroCosmos() {
  const [oxygen, setOxygen] = useState(30);
  const [carbon, setCarbon] = useState(40);
  const [temp, setTemp] = useState(15);
  const [life, setLife] = useState<Life>({ stage: 0, name: "Microbe" });
  const [over, setOver] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState("Balance the atmosphere for life to evolve!");

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setTick((tk) => tk + 1);
      // Natural processes
      setOxygen((o) => Math.min(100, o + (life.stage >= 2 ? 1 : 0.5)));
      setCarbon((c) => Math.max(0, c - (life.stage >= 1 ? 0.5 : 0.2)));
      setTemp((t) => Math.min(50, Math.max(-50, t + (carbon > 50 ? 0.3 : -0.1))));
      // Check evolution conditions
      const ideal = oxygen > 20 && oxygen < 60 && carbon < 50 && temp > 5 && temp < 30;
      if (ideal && life.stage < LIFE_STAGES.length - 1 && tick % 20 === 0) {
        setLife((l) => {
          const ns = l.stage + 1;
          setEvents((ev) => [`✨ Evolved: ${LIFE_STAGES[ns]}!`, ...ev.slice(0, 3)]);
          return { stage: ns, name: LIFE_STAGES[ns] };
        });
      }
      // Extinction events
      if (tick % 50 === 0 && Math.random() < 0.3) {
        const event = Math.random() < 0.5 ? "solar flare" : "ice age";
        if (event === "solar flare") { setTemp((t) => t + 10); setEvents((ev) => [`🔥 Solar flare! Temp rising!`, ...ev.slice(0, 3)]); }
        else { setTemp((t) => t - 10); setEvents((ev) => [`❄️ Ice age! Temp dropping!`, ...ev.slice(0, 3)]); }
      }
      // Extinction
      if (temp > 40 || temp < -10 || oxygen < 5 || oxygen > 90) {
        setOver(true);
        setMsg("Extinction event! Life died out. 💀");
      }
      if (life.stage >= LIFE_STAGES.length - 1) {
        setOver(true);
        setMsg("Sentient life achieved! 🎉 You win!");
      }
    }, 2000);
    return () => clearInterval(t);
  }, [over, life, oxygen, carbon, temp, tick]);

  const adjust = useCallback((what: "oxygen" | "carbon" | "temp", delta: number) => {
    if (over) return;
    if (what === "oxygen") setOxygen((o) => Math.min(100, Math.max(0, o + delta)));
    if (what === "carbon") setCarbon((c) => Math.min(100, Math.max(0, c + delta)));
    if (what === "temp") setTemp((t) => Math.min(50, Math.max(-50, t + delta)));
  }, [over]);

  const reset = () => {
    setOxygen(30);
    setCarbon(40);
    setTemp(15);
    setLife({ stage: 0, name: "Microbe" });
    setOver(false);
    setEvents([]);
    setTick(0);
    setMsg("Balance the atmosphere for life to evolve!");
  };

  const ideal = oxygen > 20 && oxygen < 60 && carbon < 50 && temp > 5 && temp < 30;

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={life.name}>
      <div className="flex flex-col items-center gap-4 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Planet visual */}
        <div className="flex size-32 items-center justify-center rounded-full" style={{ background: `radial-gradient(circle, ${ideal ? "#3ee0d0" : "#ff6a3d"}33, #071018)`, boxShadow: `0 0 30px ${ideal ? "#3ee0d0" : "#ff6a3d"}44` }}>
          <span className="text-4xl">{life.stage <= 1 ? "🦠" : life.stage <= 3 ? "🌿" : life.stage <= 5 ? "🐟" : life.stage <= 7 ? "🦎" : "🧠"}</span>
        </div>
        {/* Sliders */}
        <div className="w-full max-w-sm space-y-3">
          <Slider label="Oxygen" value={oxygen} min={0} max={100} ideal={[20, 60]} accent={G.accent} onAdjust={(d) => adjust("oxygen", d)} />
          <Slider label="Carbon" value={carbon} min={0} max={100} ideal={[0, 50]} accent="#ff6a3d" onAdjust={(d) => adjust("carbon", d)} />
          <Slider label="Temperature" value={temp + 50} min={0} max={100} ideal={[55, 80]} accent="#fbbf24" onAdjust={(d) => adjust("temp", d)} unit="°C" display={temp} />
        </div>
        {/* Evolution */}
        <div className="flex items-center gap-1">
          {LIFE_STAGES.map((s, i) => (
            <span key={i} className={`text-xs ${i <= life.stage ? "text-primary" : "text-muted"}`}>{i <= life.stage ? "●" : "○"}</span>
          ))}
        </div>
        {/* Events */}
        {events.map((e, i) => <p key={i} className="text-xs text-ember animate-pulse">{e}</p>)}
      </div>
    </GameShell>
  );
}

function Slider({ label, value, min, max, ideal, accent, onAdjust, unit, display }: { label: string; value: number; min: number; max: number; ideal: [number, number]; accent: string; onAdjust: (d: number) => void; unit?: string; display?: number }) {
  const inIdeal = value >= ideal[0] && value <= ideal[1];
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span style={{ color: inIdeal ? "#3ee0d0" : "#ff6a3d" }}>{display ?? value}{unit ?? "%"}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <button type="button" onClick={() => onAdjust(-5)} className="flex size-7 items-center justify-center rounded border border-line text-sm">−</button>
        <div className="relative h-2 flex-1 rounded-full bg-surface">
          <div className="absolute h-full rounded-full" style={{ left: `${ideal[0]}%`, width: `${ideal[1] - ideal[0]}%`, background: "#3ee0d033" }} />
          <div className="h-full rounded-full" style={{ width: `${value}%`, background: inIdeal ? "#3ee0d0" : "#ff6a3d" }} />
        </div>
        <button type="button" onClick={() => onAdjust(5)} className="flex size-7 items-center justify-center rounded border border-line text-sm">+</button>
      </div>
    </div>
  );
}
