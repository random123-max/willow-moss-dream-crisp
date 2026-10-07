import { useState, useEffect, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("alchemist-lemonade")!;

export default function AlchemistLemonade() {
  const [coins, setCoins] = useState(50);
  const [price, setPrice] = useState(5);
  const [day, setDay] = useState(1);
  const [weather, setWeather] = useState<"sunny" | "cloudy" | "rainy">("sunny");
  const [recipe, setRecipe] = useState({ sweet: 50, sour: 50, magic: 0 });
  const [rivals, setRivals] = useState(4);
  const [disease, setDisease] = useState<"none" | "cold" | "fever">("none");
  const [msg, setMsg] = useState("Set your price and brew lemonade!");
  const [over, setOver] = useState(false);
  const [lastSales, setLastSales] = useState(0);

  const weatherEmoji = { sunny: "☀️", cloudy: "☁️", rainy: "🌧️" };

  const sell = useCallback(() => {
    let demand = 100;
    if (weather === "rainy") demand *= 0.3;
    if (weather === "cloudy") demand *= 0.6;
    if (price > 8) demand *= 0.5;
    if (price < 3) demand *= 1.5;
    if (rivals > 5) demand *= 0.7;
    if (disease === "fever") demand *= 1.3; // fever = more thirst
    if (disease === "cold") demand *= 0.6;
    const sales = Math.max(0, Math.floor(demand / 10));
    const revenue = sales * price;
    const costs = 5; // ingredients
    setCoins((c) => c + revenue - costs);
    setLastSales(sales);
    setMsg(`Sold ${sales} cups for ${revenue} coins! ${revenue - costs > 0 ? "Profit!" : "Loss!"}`);
    // Next day
    setDay((d) => d + 1);
    // Random events
    const weathers = ["sunny", "cloudy", "rainy"] as const;
    setWeather(weathers[Math.floor(Math.random() * 3)]);
    setRivals(Math.max(1, Math.min(10, rivals + Math.floor(Math.random() * 3) - 1)));
    if (Math.random() < 0.2) {
      setDisease(Math.random() < 0.5 ? "cold" : "fever");
      setMsg((m) => m + " 🤒 Disease spreading!");
    } else {
      setDisease("none");
    }
    if (coins <= 0 && revenue - costs < 0) { setOver(true); setMsg("Bankrupt! 💀"); }
  }, [weather, price, rivals, disease, coins]);

  const reset = () => {
    setCoins(50);
    setPrice(5);
    setDay(1);
    setWeather("sunny");
    setRecipe({ sweet: 50, sour: 50, magic: 0 });
    setRivals(4);
    setDisease("none");
    setMsg("Set your price and brew lemonade!");
    setOver(false);
    setLastSales(0);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`💰${coins}`}>
      <div className="flex flex-col items-center gap-4 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Day info */}
        <div className="flex w-full max-w-sm items-center justify-between rounded-xl border border-line bg-surface p-3">
          <div>
            <p className="text-xs text-muted">Day {day}</p>
            <p className="text-2xl">{weatherEmoji[weather]}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Rivals: {rivals} 🏪</p>
            <p className="text-xs" style={{ color: disease === "fever" ? "#ff6a3d" : disease === "cold" ? "#60a5fa" : "var(--color-muted)" }}>
              {disease === "none" ? "Healthy" : disease === "cold" ? "🤧 Cold" : "🤒 Fever"}
            </p>
          </div>
        </div>
        {/* Price setter */}
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Price per cup</span>
            <span style={{ color: G.accent }}>{price} coins</span>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <button type="button" disabled={over} onClick={() => setPrice((p) => Math.max(1, p - 1))} className="flex size-7 items-center justify-center rounded border border-line">−</button>
            <input type="range" min="1" max="15" value={price} onChange={(e) => setPrice(+e.target.value)} className="flex-1" disabled={over} />
            <button type="button" disabled={over} onClick={() => setPrice((p) => Math.min(15, p + 1))} className="flex size-7 items-center justify-center rounded border border-line">+</button>
          </div>
        </div>
        {/* Recipe sliders */}
        <div className="w-full max-w-sm space-y-2">
          <RecipeSlider label="🍯 Sweetness" value={recipe.sweet} onChange={(v) => setRecipe((r) => ({ ...r, sweet: v }))} color="#fbbf24" disabled={over} />
          <RecipeSlider label="🍋 Sourness" value={recipe.sour} onChange={(v) => setRecipe((r) => ({ ...r, sour: v }))} color="#84cc16" disabled={over} />
          <RecipeSlider label="✨ Magic" value={recipe.magic} onChange={(v) => setRecipe((r) => ({ ...r, magic: v }))} color={G.accent} disabled={over} />
        </div>
        <button type="button" onClick={sell} disabled={over} className="rounded-lg px-6 py-2.5 text-sm font-bold" style={{ background: G.accent, color: "#071018" }}>
          🍋 Sell Today ({lastSales} last day)
        </button>
        <p className="text-xs text-muted">Weather, diseases, and rival pricing affect demand!</p>
      </div>
    </GameShell>
  );
}

function RecipeSlider({ label, value, onChange, color, disabled }: { label: string; value: number; onChange: (v: number) => void; color: string; disabled?: boolean }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span style={{ color }}>{value}%</span>
      </div>
      <input type="range" min="0" max="100" value={value} onChange={(e) => onChange(+e.target.value)} disabled={disabled} className="mt-1 w-full" style={{ accentColor: color }} />
    </div>
  );
}
