import { useState, useEffect, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("bonsai-cultivator")!;

type Branch = { id: number; angle: number; length: number; tier: number; bloom: boolean; children: number[] };

export default function BonsaiCultivator() {
  const [water, setWater] = useState(50);
  const [health, setHealth] = useState(100);
  const [income, setIncome] = useState(0);
  const [coins, setCoins] = useState(0);
  const [blooms, setBlooms] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([{ id: 0, angle: 0, length: 40, tier: 0, bloom: false, children: [] }]);
  const [selected, setSelected] = useState<number | null>(null);
  const [modifiers, setModifiers] = useState({ bioluminescent: false, crystalline: false, rapid: false });
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Prune and water your bonsai!");
  const [nextId, setNextId] = useState(1);

  // Idle income
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setCoins((c) => c + blooms * (modifiers.bioluminescent ? 3 : 1) + (modifiers.crystalline ? 2 : 0));
      setWater((w) => Math.max(0, w - 2));
      if (water < 20) setHealth((h) => Math.max(0, h - 3));
      if (water >= 40) setHealth((h) => Math.min(100, h + 1));
      if (health <= 0) { setOver(true); setMsg("Your bonsai has withered... 🥀"); }
    }, 2000);
    return () => clearInterval(t);
  }, [over, blooms, water, health, modifiers]);

  const waterTree = useCallback(() => {
    setWater((w) => Math.min(100, w + 25));
    setHealth((h) => Math.min(100, h + 5));
    setMsg("Watered! 💧");
  }, []);

  const prune = useCallback((id: number) => {
    setBranches((prev) => {
      const nb = prev.filter((b) => b.id !== id);
      const parent = nb.find((b) => b.children.includes(id));
      if (parent) parent.children = parent.children.filter((c) => c !== id);
      setMsg("Pruned! ✂️");
      return nb;
    });
  }, []);

  const grow = useCallback((id: number) => {
    const cost = 10;
    if (coins < cost) { setMsg("Not enough coins!"); return; }
    setCoins((c) => c - cost);
    const newId = nextId;
    setNextId((n) => n + 1);
    setBranches((prev) => {
      const nb = prev.map((b) => ({ ...b }));
      const parent = nb.find((b) => b.id === id);
      if (!parent) return prev;
      const angle = (Math.random() - 0.5) * 60;
      const length = parent.length * 0.7;
      const tier = parent.tier + 1;
      const bloom = tier >= 3 && Math.random() < (modifiers.bioluminescent ? 0.6 : 0.3);
      nb.push({ id: newId, angle: parent.angle + angle, length, tier, bloom, children: [] });
      parent.children.push(newId);
      if (bloom) { setBlooms((b) => b + 1); setMsg("A bloom appeared! 🌸"); }
      else setMsg("New branch grown! 🌿");
      return nb;
    });
  }, [coins, nextId, modifiers]);

  const applyMod = useCallback((mod: "bioluminescent" | "crystalline" | "rapid") => {
    const cost = { bioluminescent: 50, crystalline: 30, rapid: 20 };
    if (coins < cost[mod] || modifiers[mod]) return;
    setCoins((c) => c - cost[mod]);
    setModifiers((m) => ({ ...m, [mod]: true }));
    setMsg(`Genetic modifier applied: ${mod}! 🧬`);
  }, [coins, modifiers]);

  const reset = () => {
    setWater(50);
    setHealth(100);
    setCoins(0);
    setBlooms(0);
    setBranches([{ id: 0, angle: 0, length: 40, tier: 0, bloom: false, children: [] }]);
    setSelected(null);
    setModifiers({ bioluminescent: false, crystalline: false, rapid: false });
    setOver(false);
    setMsg("Prune and water your bonsai!");
    setNextId(1);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`💰${coins} 🌸${blooms}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Bonsai visual */}
        <div className="relative h-48 w-48 rounded-xl border-2" style={{ borderColor: G.accent + "44", background: "linear-gradient(180deg, transparent 60%, #1a2a1a)" }}>
          <svg viewBox="-100 -120 200 200" className="h-full w-full">
            {branches.map((b) => {
              const parent = branches.find((p) => p.children.includes(b.id));
              const px = parent ? (parent.angle / 180) * Math.PI : 0;
              const py = parent ? parent.length * Math.cos(px) * (parent.tier === 0 ? 0 : 1) : 0;
              const x2 = Math.sin((b.angle / 180) * Math.PI) * b.length;
              const y2 = 40 - b.length * Math.cos((b.angle / 180) * Math.PI);
              const x1 = parent ? Math.sin((parent.angle / 180) * Math.PI) * parent.length : 0;
              const y1 = parent ? 40 - parent.length * Math.cos((parent.angle / 180) * Math.PI) : 40;
              return (
                <g key={b.id} onClick={() => setSelected(b.id)} style={{ cursor: "pointer" }}>
                  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={selected === b.id ? G.accent : "#22c55e"} strokeWidth={Math.max(2, 8 - b.tier * 2)} strokeLinecap="round" />
                  {b.bloom && <circle cx={x2} cy={y2} r={4} fill={modifiers.bioluminescent ? "#a855f7" : "#ec4899"} className={modifiers.bioluminescent ? "animate-pulse" : ""} />}
                </g>
              );
            })}
            <rect x={-20} y={40} width={40} height={10} rx={3} fill="#8b5e3c" />
          </svg>
        </div>
        {/* Stats */}
        <div className="flex w-full max-w-xs gap-3">
          <div className="flex-1"><div className="text-xs text-muted">💧 Water</div><div className="h-2 rounded-full bg-surface"><div className="h-full rounded-full bg-primary" style={{ width: `${water}%` }} /></div></div>
          <div className="flex-1"><div className="text-xs text-muted">💚 Health</div><div className="h-2 rounded-full bg-surface"><div className="h-full rounded-full bg-green-500" style={{ width: `${health}%` }} /></div></div>
        </div>
        {/* Actions */}
        <div className="flex gap-2">
          <button type="button" onClick={waterTree} disabled={over} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: "#3ee0d0", color: "#3ee0d0" }}>💧 Water</button>
          {selected !== null && selected !== 0 && (
            <>
              <button type="button" onClick={() => grow(selected)} disabled={over || coins < 10} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: "#22c55e", color: "#22c55e" }}>🌿 Grow (10💰)</button>
              <button type="button" onClick={() => { prune(selected); setSelected(null); }} disabled={over} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: "#ff6a3d", color: "#ff6a3d" }}>✂️ Prune</button>
            </>
          )}
          {selected === 0 && <button type="button" onClick={() => grow(0)} disabled={over || coins < 10} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: "#22c55e", color: "#22c55e" }}>🌿 Grow (10💰)</button>}
        </div>
        {/* Modifiers */}
        <div className="flex gap-2">
          <button type="button" onClick={() => applyMod("bioluminescent")} disabled={over || modifiers.bioluminescent || coins < 50} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: "#a855f7", color: "#a855f7" }}>🧬 Bioluminescent (50)</button>
          <button type="button" onClick={() => applyMod("crystalline")} disabled={over || modifiers.crystalline || coins < 30} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: "#60a5fa", color: "#60a5fa" }}>💎 Crystalline (30)</button>
        </div>
        <p className="text-xs text-muted">Tap branches to select · Grow for more blooms!</p>
      </div>
    </GameShell>
  );
}
