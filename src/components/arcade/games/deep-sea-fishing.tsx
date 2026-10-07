import { useState, useEffect, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("deep-sea-fishing")!;

type Fish = { name: string; depth: number; rarity: number; emoji: string };
const FISH: Fish[] = [
  { name: "Anchovy", depth: 1, rarity: 1, emoji: "🐟" },
  { name: "Mackerel", depth: 2, rarity: 2, emoji: "🐠" },
  { name: "Tuna", depth: 3, rarity: 3, emoji: "🐡" },
  { name: "Anglerfish", depth: 4, rarity: 5, emoji: "🦑" },
  { name: "Giant Squid", depth: 5, rarity: 8, emoji: "🐙" },
];

const BAITS = [
  { name: "Worm", depth: 1, cost: 0 },
  { name: "Lure", depth: 2, cost: 20 },
  { name: "Deep Lure", depth: 4, cost: 50 },
];

export default function DeepSeaFishing() {
  const [coins, setCoins] = useState(10);
  const [bait, setBait] = useState(0);
  const [casting, setCasting] = useState(false);
  const [depth, setDepth] = useState(0);
  const [tension, setTension] = useState(0);
  const [biting, setBiting] = useState<Fish | null>(null);
  const [reeling, setReeling] = useState(false);
  const [catches, setCatches] = useState<Fish[]>([]);
  const [msg, setMsg] = useState("Cast your line!");
  const [over, setOver] = useState(false);

  const cast = useCallback(() => {
    if (casting || over) return;
    setCasting(true);
    setDepth(0);
    setMsg("Line descending...");
    let d = 0;
    const targetDepth = BAITS[bait].depth * 20;
    const interval = setInterval(() => {
      d += 2;
      setDepth(d);
      if (d >= targetDepth) {
        clearInterval(interval);
        // Check for bite
        const possibleFish = FISH.filter((f) => Math.abs(f.depth - BAITS[bait].depth) <= 1);
        const caught = possibleFish[Math.floor(Math.random() * possibleFish.length)];
        if (caught && Math.random() > 0.3) {
          setBiting(caught);
          setMsg(`Something's biting! ${caught.emoji}`);
        } else {
          setMsg("Nothing biting... Reel in and try again.");
          setTimeout(() => { setCasting(false); setDepth(0); }, 1000);
        }
      }
    }, 100);
  }, [casting, bait, over]);

  const reel = useCallback(() => {
    if (!biting || reeling) return;
    setReeling(true);
    const fish = biting;
    let d = depth;
    const reelInterval = setInterval(() => {
      d -= 3;
      setDepth(d);
      setTension((t) => {
        // Tension increases with rarity and depth pressure
        const nt = t + fish.rarity + (depth / 100) * 10;
        if (nt > 100) {
          clearInterval(reelInterval);
          setMsg("Line snapped! Fish escaped! 💔");
          setBiting(null);
          setReeling(false);
          setCasting(false);
          setDepth(0);
          setTension(0);
          return 0;
        }
        return nt;
      });
      if (d <= 0) {
        clearInterval(reelInterval);
        setMsg(`Caught a ${fish.name}! ${fish.emoji} +${fish.rarity * 5} coins!`);
        setCoins((c) => c + fish.rarity * 5);
        setCatches((prev) => [fish, ...prev].slice(0, 8));
        setBiting(null);
        setReeling(false);
        setCasting(false);
        setDepth(0);
        setTension(0);
      }
    }, 80);
  }, [biting, reeling, depth]);

  const buyBait = useCallback((idx: number) => {
    if (coins < BAITS[idx].cost) return;
    setCoins((c) => c - BAITS[idx].cost);
    setBait(idx);
  }, [coins]);

  const reset = () => {
    setCoins(10);
    setBait(0);
    setCasting(false);
    setDepth(0);
    setTension(0);
    setBiting(null);
    setReeling(false);
    setCatches([]);
    setMsg("Cast your line!");
    setOver(false);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`💰${coins}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Ocean visualization */}
        <div className="relative w-full max-w-xs overflow-hidden rounded-lg border-2" style={{ height: 320, borderColor: G.accent + "44", background: "linear-gradient(180deg, #0ea5e922, #071018)" }}>
          {/* Depth lines */}
          {[1, 2, 3, 4, 5].map((d) => (
            <div key={d} className="absolute w-full border-t border-dashed border-line/30" style={{ top: d * 60 }}>
              <span className="absolute right-1 -mt-4 text-[10px] text-muted">{d * 20}m</span>
            </div>
          ))}
          {/* Fish swimming */}
          {FISH.filter((f) => f.depth <= BAITS[bait].depth + 1).map((f, i) => (
            <div key={i} className="absolute text-lg" style={{ top: f.depth * 50 + 20, left: `${(i * 37) % 80}%`, opacity: 0.5 }}>{f.emoji}</div>
          ))}
          {/* Fishing line */}
          {casting && (
            <div className="absolute left-1/2 w-px -translate-x-1/2" style={{ top: 0, height: depth * 3, background: "#ece7de" }}>
              <div className="absolute -bottom-2 -left-1 size-2 rounded-full bg-primary" />
            </div>
          )}
          {/* Tension bar */}
          {reeling && (
            <div className="absolute bottom-2 left-2 right-2 h-2 rounded-full bg-surface">
              <div className="h-full rounded-full transition-all" style={{ width: `${tension}%`, background: tension > 70 ? "#ff6a3d" : "#3ee0d0" }} />
            </div>
          )}
        </div>
        {/* Controls */}
        <div className="flex gap-2">
          {!casting && <button type="button" onClick={cast} className="rounded-lg px-4 py-2 text-sm font-bold" style={{ background: G.accent, color: "#071018" }}>🎣 Cast</button>}
          {biting && !reeling && <button type="button" onClick={reel} className="rounded-lg px-4 py-2 text-sm font-bold animate-pulse" style={{ background: "#ff6a3d", color: "#071018" }}>Reel In!</button>}
        </div>
        {/* Bait selection */}
        <div className="flex gap-2">
          {BAITS.map((b, i) => (
            <button key={i} type="button" onClick={() => buyBait(i)} disabled={coins < b.cost || casting} className={`rounded-lg border px-3 py-1.5 text-xs transition-all disabled:opacity-40 ${bait === i ? "border-primary" : "border-line"}`} style={{ color: bait === i ? G.accent : "var(--color-muted)" }}>
              {b.name} {b.cost > 0 && `(${b.cost}💰)`}
            </button>
          ))}
        </div>
        {/* Catches */}
        {catches.length > 0 && (
          <div className="flex gap-1">
            {catches.map((f, i) => <span key={i} className="text-lg" title={f.name}>{f.emoji}</span>)}
          </div>
        )}
      </div>
    </GameShell>
  );
}
