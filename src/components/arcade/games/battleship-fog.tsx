import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("battleship-fog")!;
const SIZE = 8;
const SHIPS = [4, 3, 3, 2];

type CellState = "empty" | "ship" | "hit" | "miss";
type Grid = CellState[][];

function placeShips(): Grid {
  const g: Grid = Array.from({ length: SIZE }, () => Array(SIZE).fill("empty"));
  for (const len of SHIPS) {
    let placed = false;
    while (!placed) {
      const horiz = Math.random() < 0.5;
      const r = Math.floor(Math.random() * SIZE);
      const c = Math.floor(Math.random() * (horiz ? SIZE - len : SIZE));
      let ok = true;
      for (let i = 0; i < len; i++) {
        const rr = horiz ? r : r + i;
        const cc = horiz ? c + i : c;
        if (rr >= SIZE || g[rr][cc] !== "empty") { ok = false; break; }
      }
      if (ok) {
        for (let i = 0; i < len; i++) {
          const rr = horiz ? r : r + i;
          const cc = horiz ? c + i : c;
          g[rr][cc] = "ship";
        }
        placed = true;
      }
    }
  }
  return g;
}

export default function BattleshipFog() {
  const [enemy, setEnemy] = useState<Grid>(placeShips);
  const [player, setPlayer] = useState<Grid>(placeShips);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Fire on the enemy grid!");
  const [cooldown, setCooldown] = useState(0);
  const [repairReady, setRepairReady] = useState(true);
  const [turn, setTurn] = useState(1);
  const [enemyHits, setEnemyHits] = useState(0);
  const [playerHits, setPlayerHits] = useState(0);

  const totalCells = SHIPS.reduce((a, b) => a + b, 0);

  const fire = useCallback(
    (r: number, c: number) => {
      if (over || turn !== 1 || enemy[r][c] === "hit" || enemy[r][c] === "miss") return;
      const ne = enemy.map((row) => [...row]);
      ne[r][c] = ne[r][c] === "ship" ? "hit" : "miss";
      setEnemy(ne);
      const newEnemyHits = ne.flat().filter((s) => s === "hit").length;
      setEnemyHits(newEnemyHits);
      if (newEnemyHits >= totalCells) {
        setOver(true);
        setMsg("Victory! Enemy fleet sunk! 🎉");
        return;
      }
      setMsg(ne[r][c] === "hit" ? "Direct hit! 🔥" : "Splash — miss.");
      setTurn(2);
      // AI fires
      setTimeout(() => {
        setPlayer((prev) => {
          const np = prev.map((row) => [...row]);
          let targets: [number, number][] = [];
          for (let r = 0; r < SIZE; r++)
            for (let c = 0; c < SIZE; c++)
              if (np[r][c] === "empty" || np[r][c] === "ship") targets.push([r, c]);
          const [tr, tc] = targets[Math.floor(Math.random() * targets.length)];
          np[tr][tc] = np[tr][tc] === "ship" ? "hit" : "miss";
          const newPlayerHits = np.flat().filter((s) => s === "hit").length;
          setPlayerHits(newPlayerHits);
          if (newPlayerHits >= totalCells) {
            setOver(true);
            setMsg("Your fleet is sunk! 💀");
          } else {
            setMsg(np[tr][tc] === "hit" ? "Enemy hit your ship!" : "Enemy missed.");
          }
          return np;
        });
        setTurn(1);
        setCooldown((c) => Math.max(0, c - 1));
      }, 600);
    },
    [enemy, over, turn, totalCells],
  );

  const airstrike = useCallback(() => {
    if (over || cooldown > 0 || turn !== 1) return;
    const ne = enemy.map((r) => [...r]);
    const r = Math.floor(Math.random() * (SIZE - 2));
    const c = Math.floor(Math.random() * (SIZE - 2));
    for (let dr = 0; dr < 3; dr++)
      for (let dc = 0; dc < 3; dc++)
        if (ne[r + dr][c + dc] !== "hit") ne[r + dr][c + dc] = ne[r + dr][c + dc] === "ship" ? "hit" : "miss";
    setEnemy(ne);
    setCooldown(3);
    setMsg(`💥 Airstrike at ${r},${c}!`);
    const hits = ne.flat().filter((s) => s === "hit").length;
    setEnemyHits(hits);
    if (hits >= totalCells) { setOver(true); setMsg("Victory! 🎉"); }
  }, [enemy, over, cooldown, turn, totalCells]);

  const repair = useCallback(() => {
    if (over || !repairReady || turn !== 1) return;
    setPlayer((prev) => {
      const np = prev.map((r) => [...r]);
      const hits = np.flat().map((s, i) => ({ s, i })).filter(({ s }) => s === "hit");
      if (hits.length) {
        const { i } = hits[Math.floor(Math.random() * hits.length)];
        const r = Math.floor(i / SIZE), c = i % SIZE;
        np[r][c] = "ship";
      }
      setPlayerHits(np.flat().filter((s) => s === "hit").length);
      return np;
    });
    setRepairReady(false);
    setMsg("🔧 Hull repaired!");
  }, [over, repairReady, turn]);

  const reset = () => {
    setEnemy(placeShips());
    setPlayer(placeShips());
    setOver(false);
    setMsg("Fire on the enemy grid!");
    setCooldown(0);
    setRepairReady(true);
    setTurn(1);
    setEnemyHits(0);
    setPlayerHits(0);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`Enemy:${enemyHits}/${totalCells}`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Enemy grid */}
        <p className="text-xs uppercase tracking-wide text-ember">Enemy Waters</p>
        <div className="grid gap-0.5 rounded-lg border-2 p-1" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, borderColor: "#ff6a3d44" }}>
          {enemy.map((row, r) =>
            row.map((c, ci) => (
              <button
                key={`${r}-${ci}`}
                type="button"
                disabled={over || turn !== 1 || c === "hit" || c === "miss"}
                onClick={() => fire(r, ci)}
                className="size-7 rounded md:size-8"
                style={{
                  background: c === "hit" ? "#ff6a3d" : c === "miss" ? "var(--color-bg)" : "var(--color-surface)",
                  border: `1px solid ${c === "hit" ? "#ff6a3d" : "var(--color-line)"}`,
                }}
              >
                {c === "hit" && "🔥"}
              </button>
            )),
          )}
        </div>
        {/* Controls */}
        <div className="flex gap-2">
          <button type="button" disabled={over || cooldown > 0 || turn !== 1} onClick={airstrike} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: "#ff6a3d", color: "#ff6a3d" }}>
            💥 Airstrike {cooldown > 0 && `(${cooldown})`}
        </button>
          <button type="button" disabled={over || !repairReady || turn !== 1} onClick={repair} className="rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40" style={{ borderColor: G.accent, color: G.accent }}>
            🔧 Repair {!repairReady && "(used)"}
          </button>
        </div>
        {/* Player grid */}
        <p className="text-xs uppercase tracking-wide text-primary">Your Fleet</p>
        <div className="grid gap-0.5 rounded-lg border-2 p-1" style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)`, borderColor: G.accent + "44" }}>
          {player.map((row, r) =>
            row.map((c, ci) => (
              <div key={`${r}-${ci}`} className="size-7 rounded md:size-8" style={{ background: c === "hit" ? "#ff6a3d" : c === "ship" ? G.accent + "44" : "var(--color-surface)", border: `1px solid ${c === "hit" ? "#ff6a3d" : "var(--color-line)"}` }}>
                {c === "hit" && "💥"}
              </div>
            )),
          )}
        </div>
      </div>
    </GameShell>
  );
}
