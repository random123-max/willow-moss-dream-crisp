import { useState, useEffect, useCallback, useRef } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("espresso-tycoon")!;

type Order = { id: number; drink: string; temp: number; patience: number; reward: number };
const DRINKS = ["Espresso", "Latte", "Cappuccino", "Mocha", "Macchiato"];
const INGREDIENTS = ["Coffee", "Milk", "Sugar", "Chocolate"];

export default function EspressoTycoon() {
  const [coins, setCoins] = useState(50);
  const [inventory, setInventory] = useState({ Coffee: 10, Milk: 10, Sugar: 10, Chocolate: 5 });
  const [stress, setStress] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [brewing, setBrewing] = useState<Order | null>(null);
  const [brewTemp, setBrewTemp] = useState(0);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Serve customers before they walk out!");
  const [served, setServed] = useState(0);
  const nextId = useRef(1);

  // Spawn orders
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setOrders((prev) => {
        if (prev.length >= 4) return prev;
        const drink = DRINKS[Math.floor(Math.random() * DRINKS.length)];
        const targetTemp = 60 + Math.floor(Math.random() * 30);
        return [...prev, { id: nextId.current++, drink, temp: targetTemp, patience: 100, reward: 8 + Math.floor(Math.random() * 8) }];
      });
    }, 4000);
    return () => clearInterval(t);
  }, [over]);

  // Patience tick
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      setOrders((prev) => prev.map((o) => ({ ...o, patience: o.patience - 2 })).filter((o) => {
        if (o.patience <= 0) { setMsg(`${o.drink} customer walked out! 😡`); setStress((s) => Math.min(100, s + 10)); return false; }
        return true;
      }));
      setStress((s) => Math.max(0, s - 1));
    }, 500);
    return () => clearInterval(t);
  }, [over]);

  // Brew temp
  useEffect(() => {
    if (over || !brewing) return;
    const t = setInterval(() => {
      setBrewTemp((t) => Math.min(100, t + 5));
    }, 100);
    return () => clearInterval(t);
  }, [brewing, over]);

  const takeOrder = useCallback((order: Order) => {
    if (brewing || over) return;
    setBrewing(order);
    setBrewTemp(0);
    setMsg(`Brewing ${order.drink}... Target: ${order.temp}°`);
  }, [brewing, over]);

  const serve = useCallback(() => {
    if (!brewing) return;
    const tempDiff = Math.abs(brewTemp - brewing.temp);
    const quality = Math.max(0, 100 - tempDiff * 2);
    const reward = Math.floor(brewing.reward * (quality / 100));
    if (reward > 0) {
      setCoins((c) => c + reward);
      setServed((s) => s + 1);
      setMsg(`Served ${brewing.drink}! ${quality}% quality. +${reward} coins! ☕`);
    } else {
      setMsg(`Terrible ${brewing.drink}! Customer unhappy 😡`);
      setStress((s) => Math.min(100, s + 5));
    }
    // Consume ingredients
    setInventory((inv) => {
      const ni = { ...inv };
      ni.Coffee = Math.max(0, ni.Coffee - 1);
      if (brewing.drink !== "Espresso") ni.Milk = Math.max(0, ni.Milk - 1);
      if (brewing.drink === "Mocha") ni.Chocolate = Math.max(0, ni.Chocolate - 1);
      return ni;
    });
    setOrders((prev) => prev.filter((o) => o.id !== brewing.id));
    setBrewing(null);
    setBrewTemp(0);
    if (stress >= 100) { setOver(true); setMsg("Staff overwhelmed! Cafe closed! 💔"); }
  }, [brewing, brewTemp, stress]);

  const restock = useCallback(() => {
    setCoins((c) => c - 20);
    setInventory((inv) => ({ Coffee: inv.Coffee + 10, Milk: inv.Milk + 10, Sugar: inv.Sugar + 10, Chocolate: inv.Chocolate + 5 }));
    setMsg("Restocked! 📦");
  }, []);

  const reset = () => {
    setCoins(50);
    setInventory({ Coffee: 10, Milk: 10, Sugar: 10, Chocolate: 5 });
    setStress(0);
    setOrders([]);
    setBrewing(null);
    setBrewTemp(0);
    setOver(false);
    setMsg("Serve customers before they walk out!");
    setServed(0);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`💰${coins} ☕${served}`} extra={<span className="rounded-full border border-line bg-bg px-3 py-1 text-xs" style={{ color: stress > 70 ? "#ff6a3d" : "#a855f7" }}>Stress {stress}%</span>}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Brewing */}
        {brewing && (
          <div className="w-full max-w-xs rounded-xl border-2 p-3" style={{ borderColor: G.accent + "44" }}>
            <p className="text-xs text-muted">Brewing {brewing.drink} · Target: {brewing.temp}°</p>
            <div className="mt-2 h-4 overflow-hidden rounded-full bg-surface">
              <div className="h-full transition-all" style={{ width: `${brewTemp}%`, background: Math.abs(brewTemp - brewing.temp) < 10 ? G.accent : "#ff6a3d" }} />
            </div>
            <p className="mt-1 text-center text-xs">Current: {brewTemp}°</p>
            <button type="button" onClick={serve} className="mt-2 w-full rounded-lg py-2 text-sm font-bold" style={{ background: G.accent, color: "#071018" }}>Serve!</button>
          </div>
        )}
        {/* Orders */}
        <div className="grid w-full max-w-sm grid-cols-2 gap-2">
          {orders.map((o) => (
            <button key={o.id} type="button" onClick={() => takeOrder(o)} disabled={!!brewing} className="rounded-lg border p-2 text-left transition-all disabled:opacity-40" style={{ borderColor: "var(--color-line)", background: "var(--color-surface)" }}>
              <p className="text-sm font-medium text-fg">{o.drink} ☕</p>
              <p className="text-xs text-muted">Target: {o.temp}°</p>
              <div className="mt-1 h-1 rounded-full bg-surface"><div className="h-full rounded-full" style={{ width: `${o.patience}%`, background: o.patience > 30 ? G.accent : "#ff6a3d" }} /></div>
            </button>
          ))}
        </div>
        {/* Inventory */}
        <div className="flex gap-2 text-xs">
          {Object.entries(inventory).map(([k, v]) => (
            <span key={k} className={`rounded-full border px-2 py-0.5 ${v < 3 ? "border-ember text-ember" : "border-line text-muted"}`}>{k}: {v}</span>
          ))}
        </div>
        <button type="button" onClick={restock} disabled={coins < 20} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: G.accent, color: G.accent }}>📦 Restock (20💰)</button>
      </div>
    </GameShell>
  );
}
