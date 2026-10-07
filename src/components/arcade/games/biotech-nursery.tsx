import { useState, useEffect, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("biotech-nursery")!;

const TREE = [
  { id: "microbe", name: "Microbe", emoji: "🦠" },
  { id: "blob", name: "Blob", emoji: "🫧" },
  { id: "slime", name: "Slime", emoji: "🟢" },
  { id: "spore", name: "Spore", emoji: "🍄" },
  { id: "sprout", name: "Sprout", emoji: "🌱" },
  { id: "gecko", name: "Gecko", emoji: "🦎" },
  { id: "crystal", name: "Crystal Being", emoji: "💎" },
  { id: "ethereal", name: "Ethereal", emoji: "👻" },
  { id: "ascended", name: "Ascended", emoji: "✨" },
];

export default function BiotechNursery() {
  const [stage, setStage] = useState(0);
  const [hp, setHp] = useState(80);
  const [hunger, setHunger] = useState(50);
  const [sleep, setSleep] = useState(50);
  const [radiation, setRadiation] = useState(0);
  const [mutateReady, setMutateReady] = useState(false);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Care for your pet to evolve it!");
  const [mutations, setMutations] = useState<string[]>([]);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setHunger((h) => {
        const nh = Math.min(100, h + 3);
        if (nh >= 100) { setHp((hp) => Math.max(0, hp - 5)); setMsg("Your pet is starving! 💔"); }
        return nh;
      });
      setSleep((s) => {
        const ns = Math.min(100, s + 2);
        if (ns >= 100) setMsg("Your pet is exhausted! 😴");
        return ns;
      });
      setRadiation((r) => {
        const nr = Math.max(0, r - 1);
        return nr;
      });
      if (hp <= 0) { setOver(true); setMsg("Your pet has died... 💀"); }
      // Mutate ready when balanced
      if (hp > 50 && hunger < 50 && sleep < 50 && radiation < 30) setMutateReady(true);
      else setMutateReady(false);
    }, 2000);
    return () => clearInterval(t);
  }, [over, hp, hunger, sleep, radiation]);

  const feed = useCallback(() => {
    if (over) return;
    setHunger((h) => Math.max(0, h - 30));
    setHp((hp) => Math.min(100, hp + 5));
    setMsg("Fed! 🍖");
  }, [over]);

  const rest = useCallback(() => {
    if (over) return;
    setSleep((s) => Math.max(0, s - 40));
    setMsg("Rested! 😴");
  }, [over]);

  const irradiate = useCallback(() => {
    if (over) return;
    setRadiation((r) => Math.min(100, r + 25));
    setMsg("Irradiated! High radiation causes random mutations! ☢️");
  }, [over]);

  const mutate = useCallback(() => {
    if (over || !mutateReady) return;
    if (stage >= TREE.length - 1) { setMsg("Fully evolved! 🎉"); return; }
    let next = stage + 1;
    if (radiation > 50) {
      // Random mutation — skip or branch
      next = Math.min(TREE.length - 1, stage + 1 + Math.floor(Math.random() * 2));
      setMutations((m) => [...m, `Mutated to ${TREE[next].name}!`]);
    }
    setStage(next);
    setMsg(`Evolved into ${TREE[next].name}! ${TREE[next].emoji} 🎉`);
    setMutateReady(false);
  }, [over, mutateReady, stage, radiation]);

  const reset = () => {
    setStage(0);
    setHp(80);
    setHunger(50);
    setSleep(50);
    setRadiation(0);
    setMutateReady(false);
    setOver(false);
    setMsg("Care for your pet to evolve it!");
    setMutations([]);
  };

  const pet = TREE[stage];

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={pet.name}>
      <div className="flex flex-col items-center gap-4 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Pet display */}
        <div className="relative flex size-32 items-center justify-center rounded-full" style={{ background: radiation > 50 ? "#22c55e22" : `${G.accent}11`, boxShadow: `0 0 20px ${radiation > 50 ? "#22c55e" : G.accent}33` }}>
          <span className="text-5xl" style={{ filter: radiation > 50 ? "hue-rotate(60deg)" : "none" }}>{pet.emoji}</span>
          {radiation > 50 && <span className="absolute -top-2 -right-2 text-lg animate-pulse">☢️</span>}
        </div>
        {/* Stats */}
        <div className="w-full max-w-xs space-y-2">
          <Stat label="Health" value={hp} color="#3ee0d0" />
          <Stat label="Hunger" value={hunger} color="#f59e0b" />
          <Stat label="Fatigue" value={sleep} color="#a855f7" />
          <Stat label="Radiation" value={radiation} color="#22c55e" warn={radiation > 50} />
        </div>
        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-2">
          <button type="button" onClick={feed} disabled={over} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: "#f59e0b", color: "#f59e0b" }}>🍖 Feed</button>
          <button type="button" onClick={rest} disabled={over} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: "#a855f7", color: "#a855f7" }}>💤 Rest</button>
          <button type="button" onClick={irradiate} disabled={over} className="rounded-lg border px-3 py-1.5 text-xs" style={{ borderColor: "#22c55e", color: "#22c55e" }}>☢️ Irradiate</button>
          <button type="button" onClick={mutate} disabled={over || !mutateReady} className="rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-40" style={{ background: mutateReady ? G.accent : "var(--color-surface)", color: mutateReady ? "#071018" : "var(--color-muted)" }}>🧬 Evolve</button>
        </div>
        {/* Evolution tree */}
        <div className="flex items-center gap-1">
          {TREE.map((t, i) => (
            <span key={i} className={`text-xs ${i <= stage ? "" : "opacity-30"}`}>{i <= stage ? t.emoji : "🔒"}</span>
          ))}
        </div>
        {mutations.map((m, i) => <p key={i} className="text-xs text-ember">{m}</p>)}
      </div>
    </GameShell>
  );
}

function Stat({ label, value, color, warn }: { label: string; value: number; color: string; warn?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span style={{ color: warn ? "#ff6a3d" : color }}>{Math.round(value)}</span>
      </div>
      <div className="mt-0.5 h-1.5 overflow-hidden rounded-full bg-surface">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: warn && value > 50 ? "#ff6a3d" : color }} />
      </div>
    </div>
  );
}
