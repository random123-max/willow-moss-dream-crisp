import { useState, useCallback, useEffect, useRef } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("rhythm-vanguard")!;
const LANES = 4;

type Note = { lane: number; y: number; hit: boolean };
type Enemy = { y: number; lane: number; hp: number };

export default function RhythmVanguard() {
  const [score, setScore] = useState(0);
  const [shield, setShield] = useState(100);
  const [charge, setCharge] = useState(0);
  const [over, setOver] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [combo, setCombo] = useState(0);
  const beat = useRef(0);
  const tick = useRef(0);

  useEffect(() => {
    if (over) return;
    const i = setInterval(() => {
      tick.current++;
      // Spawn notes on beat
      if (tick.current % 15 === 0) {
        setNotes((prev) => [...prev, { lane: Math.floor(Math.random() * LANES), y: 0, hit: false }]);
      }
      // Spawn enemies
      if (tick.current % 40 === 0) {
        setEnemies((prev) => [...prev, { y: 0, lane: Math.floor(Math.random() * LANES), hp: 1 }]);
      }
      // Move notes
      setNotes((prev) => prev.map((n) => ({ ...n, y: n.y + 8 })).filter((n) => n.y < 400));
      // Move enemies
      setEnemies((prev) => {
        const np = prev.map((e) => ({ ...e, y: e.y + 1.5 }));
        // Enemies reaching bottom damage shield
        np.filter((e) => e.y >= 380).forEach(() => setShield((s) => Math.max(0, s - 15)));
        return np.filter((e) => e.y < 380);
      });
    }, 50);
    return () => clearInterval(i);
  }, [over]);

  useEffect(() => {
    if (shield <= 0 && !over) setOver(true);
  }, [shield, over]);

  const hitLane = useCallback((lane: number) => {
    const hitZone = notes.filter((n) => !n.hit && n.lane === lane && n.y > 320 && n.y < 380);
    if (hitZone.length > 0) {
      setNotes((prev) => prev.map((n) => (n === hitZone[0] ? { ...n, hit: true } : n)));
      setScore((sc) => sc + 10 + combo * 2);
      setCombo((c) => c + 1);
      setCharge((c) => Math.min(100, c + 15));
      // Charged shot kills enemy in same lane
      setEnemies((prev) => {
        const inLane = prev.filter((e) => e.lane === lane);
        if (charge >= 50 && inLane.length > 0) {
          setCharge((c) => c - 50);
          return prev.filter((e) => e !== inLane[0]);
        }
        return prev;
      });
    } else {
      // Missed — short circuit shield
      setCombo(0);
      setShield((s) => Math.max(0, s - 5));
    }
  }, [notes, combo, charge]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const map: Record<string, number> = { d: 0, f: 1, j: 2, k: 3, "1": 0, "2": 1, "3": 2, "4": 3 };
      if (map[e.key.toLowerCase()] !== undefined) hitLane(map[e.key.toLowerCase()]);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  const reset = () => {
    setScore(0);
    setShield(100);
    setCharge(0);
    setOver(false);
    setNotes([]);
    setEnemies([]);
    setCombo(0);
  };

  const laneLabels = ["D", "F", "J", "K"];
  const laneColors = ["#ff6a3d", "#fbbf24", "#3ee0d0", "#a855f7"];

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} extra={<span className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-primary">🛡️{shield}</span>}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <div className="flex gap-3 text-sm">
          <span className="text-muted">Combo: {combo}</span>
          <span style={{ color: G.accent }}>⚡ {charge}/100</span>
        </div>
        <div className="relative overflow-hidden rounded-lg border-2" style={{ borderColor: G.accent + "44", width: Math.min(window.innerWidth - 48, 280), height: 400 }}>
          {/* Lanes */}
          <div className="absolute inset-0 flex">
            {Array.from({ length: LANES }, (_, i) => (
              <div key={i} className="flex-1 border-r border-line/50" style={{ background: `${laneColors[i]}08` }}>
                {/* Notes */}
                {notes.filter((n) => n.lane === i && !n.hit).map((n, ni) => (
                  <div key={ni} className="absolute rounded" style={{ left: `${(i / LANES) * 100}%`, width: `${100 / LANES}%`, top: n.y, height: 8, background: laneColors[i], boxShadow: `0 0 6px ${laneColors[i]}` }} />
                ))}
                {/* Enemies */}
                {enemies.filter((e) => e.lane === i).map((e, ei) => (
                  <div key={ei} className="absolute text-lg" style={{ left: `${(i / LANES) * 100 + 8}%`, top: e.y }}>👾</div>
                ))}
              </div>
            ))}
          </div>
          {/* Hit zone */}
          <div className="absolute bottom-16 left-0 right-0 h-1" style={{ background: G.accent + "55" }} />
          {/* Charge bar */}
          <div className="absolute bottom-0 left-0 h-2" style={{ width: `${charge}%`, background: G.accent }} />
        </div>
        {/* Lane buttons */}
        <div className="flex gap-2">
          {laneLabels.map((l, i) => (
            <button
              key={i}
              type="button"
              disabled={over}
              onClick={() => hitLane(i)}
              className="flex size-14 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all active:scale-95"
              style={{ borderColor: laneColors[i], color: laneColors[i], background: laneColors[i] + "11" }}
            >
              {l}
            </button>
          ))}
        </div>
        {over && <p className="font-display text-xl text-ember">Shields down! Score: {score}</p>}
      </div>
    </GameShell>
  );
}
