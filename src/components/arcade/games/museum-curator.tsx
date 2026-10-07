import { useState, useEffect, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("museum-curator")!;

type Artifact = { id: number; name: string; theme: "ancient" | "natural" | "modern"; value: number; floor: number };
type Guard = { id: number; x: number; y: number; patrol: number };
type Thief = { id: number; x: number; y: number; target: number | null; caught: boolean };

const ARTIFACT_POOL = [
  { name: "Golden Mask", theme: "ancient" as const, value: 100 },
  { name: "Dino Fossil", theme: "natural" as const, value: 80 },
  { name: "Pop Art", theme: "modern" as const, value: 60 },
  { name: "Clay Tablet", theme: "ancient" as const, value: 50 },
  { name: "Meteorite", theme: "natural" as const, value: 90 },
  { name: "Neon Sculpture", theme: "modern" as const, value: 70 },
];

export default function MuseumCurator() {
  const [coins, setCoins] = useState(200);
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [guards, setGuards] = useState<Guard[]>([]);
  const [thieves, setThieves] = useState<Thief[]>([]);
  const [income, setIncome] = useState(0);
  const [day, setDay] = useState(1);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Arrange artifacts, hire guards, open the museum!");
  const [nextId, setNextId] = useState(1);
  const [nightMode, setNightMode] = useState(false);

  // Day/night cycle
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setNightMode((n) => {
        const nn = !n;
        if (nn) {
          // Night — spawn thieves
          setThieves((prev) => [...prev, { id: nextId, x: 0, y: 0, target: null, caught: false }]);
          setMsg("🌙 Night — thieves are coming! Guards patrol!");
        } else {
          // Day — collect income
          setDay((d) => d + 1);
          const synergyBonus = calcSynergy(artifacts);
          const visitorIncome = artifacts.reduce((a, b) => a + b.value, 0) * 0.1 + synergyBonus;
          setCoins((c) => c + Math.floor(visitorIncome));
          setIncome(Math.floor(visitorIncome));
          setMsg(`☀️ Day ${day + 1} — Earned ${Math.floor(visitorIncome)} coins!`);
        }
        return nn;
      });
    }, 8000);
    return () => clearInterval(t);
  }, [over, artifacts, day, nextId]);

  // Guard patrol & thief catching
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      if (!nightMode) return;
      setGuards((prev) => prev.map((g) => ({ ...g, x: g.x + Math.cos(g.patrol) * 10, y: g.y + Math.sin(g.patrol) * 10, patrol: g.patrol + 0.1 })));
      setThieves((prev) => {
        const nt = prev.filter((thief) => !thief.caught);
        nt.forEach((thief) => {
          // Thief moves toward nearest artifact
          if (artifacts.length === 0) return;
          const target = artifacts.reduce((a, b) => {
            const da = Math.hypot(a.floor * 50 - thief.x, 50 - thief.y);
            const db = Math.hypot(b.floor * 50 - thief.x, 50 - thief.y);
            return db < da ? b : a;
          });
          const dx = target.floor * 50 - thief.x;
          const dy = 50 - thief.y;
          const d = Math.hypot(dx, dy) || 1;
          thief.x += (dx / d) * 3;
          thief.y += (dy / d) * 3;
          // Guard catches thief
          guards.forEach((g) => {
            if (Math.hypot(g.x - thief.x, g.y - thief.y) < 30) {
              thief.caught = true;
              setCoins((c) => c + 20);
              setMsg("🚨 Thief caught! +20 coins!");
            }
          });
          // Thief steals artifact
          if (Math.hypot(target.floor * 50 - thief.x, 50 - thief.y) < 10) {
            setArtifacts((arts) => arts.filter((a) => a.id !== target.id));
            setMsg(`💀 Thief stole the ${target.name}!`);
          }
        });
        return nt;
      });
    }, 500);
    return () => clearInterval(t);
  }, [over, nightMode, artifacts, guards]);

  function calcSynergy(arts: Artifact[]): number {
    let bonus = 0;
    for (let i = 0; i < arts.length; i++)
      for (let j = i + 1; j < arts.length; j++)
        if (arts[i].floor === arts[j].floor && arts[i].theme === arts[j].theme) bonus += 10;
    return bonus;
  }

  const buyArtifact = useCallback(() => {
    const pool = ARTIFACT_POOL[Math.floor(Math.random() * ARTIFACT_POOL.length)];
    const cost = pool.value;
    if (coins < cost) { setMsg("Not enough coins!"); return; }
    setCoins((c) => c - cost);
    const floor = artifacts.length % 3;
    setArtifacts((prev) => [...prev, { id: nextId, ...pool, floor }]);
    setNextId((n) => n + 1);
    setMsg(`Acquired ${pool.name} for ${cost} coins! 🏛️`);
  }, [coins, artifacts, nextId]);

  const hireGuard = useCallback(() => {
    if (coins < 50) { setMsg("Not enough coins for a guard!"); return; }
    setCoins((c) => c - 50);
    setGuards((prev) => [...prev, { id: prev.length, x: 100, y: 100, patrol: Math.random() * Math.PI * 2 }]);
    setMsg("Guard hired! 🛡️");
  }, [coins]);

  const reset = () => {
    setCoins(200);
    setArtifacts([]);
    setGuards([]);
    setThieves([]);
    setIncome(0);
    setDay(1);
    setOver(false);
    setMsg("Arrange artifacts, hire guards, open the museum!");
    setNextId(1);
    setNightMode(false);
  };

  const themeEmoji = { ancient: "🏺", natural: "🦴", modern: "🎨" };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`💰${coins} 📅Day${day}`} extra={<span className="rounded-full border border-line bg-bg px-3 py-1 text-xs" style={{ color: nightMode ? "#a855f7" : "#fbbf24" }}>{nightMode ? "🌙 Night" : "☀️ Day"}</span>}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Museum view */}
        <div className="relative w-full max-w-sm overflow-hidden rounded-xl border-2" style={{ height: 200, borderColor: nightMode ? "#a855f744" : G.accent + "44", background: nightMode ? "#0a0a15" : "#101a24" }}>
          {/* Floors */}
          {[0, 1, 2].map((floor) => (
            <div key={floor} className="absolute w-full" style={{ top: floor * 65 }}>
              <div className="border-t border-line/50 px-2 pt-1">
                <span className="text-[10px] text-muted">Floor {floor + 1}</span>
                <div className="flex gap-1">
                  {artifacts.filter((a) => a.floor === floor).map((a) => (
                    <div key={a.id} className="flex flex-col items-center rounded border border-line bg-surface p-1" style={{ opacity: nightMode ? 0.6 : 1 }}>
                      <span className="text-lg">{themeEmoji[a.theme]}</span>
                      <span className="text-[8px] text-muted">{a.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {/* Guards */}
          {guards.map((g) => (
            <div key={g.id} className="absolute text-sm" style={{ left: `${g.x / 3}%`, top: `${g.y / 2}%` }}>🛡️</div>
          ))}
          {/* Thieves */}
          {thieves.map((t) => (
            <div key={t.id} className="absolute text-sm" style={{ left: `${t.x / 3}%`, top: `${t.y / 2}%`, opacity: t.caught ? 0.3 : 0.8 }}>🥷</div>
          ))}
        </div>
        {/* Stats */}
        <div className="flex gap-4 text-xs text-muted">
          <span>🏛️ Artifacts: {artifacts.length}</span>
          <span>🛡️ Guards: {guards.length}</span>
          <span>Synergy: +{calcSynergy(artifacts)}</span>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <button type="button" onClick={buyArtifact} disabled={over} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: G.accent, color: G.accent }}>🏛️ Acquire Artifact</button>
          <button type="button" onClick={hireGuard} disabled={over || coins < 50} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: "#3ee0d0", color: "#3ee0d0" }}>🛡️ Hire Guard (50💰)</button>
        </div>
        <p className="text-xs text-muted">Same-theme artifacts on same floor = synergy bonus!</p>
      </div>
    </GameShell>
  );
}
