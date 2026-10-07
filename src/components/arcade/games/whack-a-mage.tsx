import { useState, useRef, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { useGameLoop } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("whack-a-mage")!;
const COLS = 3, ROWS = 3;

type Mage = { type: "fire" | "ice" | "illusion" | "normal"; born: number; ttl: number };

export default function WhackAMage() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30);
  const [over, setOver] = useState(false);
  const [mages, setMages] = useState<(Mage | null)[]>(Array(COLS * ROWS).fill(null));
  const types = useRef(["fire", "ice", "illusion", "normal"] as const);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => setTime((s) => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [over]);

  useEffect(() => {
    if (over || time <= 0) { setOver(true); return; }
  }, [time]);

  useGameLoop(() => {
    if (over) return;
    // Spawn mages
    if (Math.random() < 0.04) {
      setMages((prev) => {
        const np = [...prev];
        const empty = np.map((m, i) => ({ m, i })).filter(({ m }) => !m);
        if (empty.length === 0) return prev;
        const { i } = empty[Math.floor(Math.random() * empty.length)];
        const type = types.current[Math.floor(Math.random() * types.current.length)];
        np[i] = { type, born: Date.now(), ttl: 1500 + Math.random() * 1000 };
        return np;
      });
    }
    // Remove expired mages
    setMages((prev) => {
      const now = Date.now();
      let changed = false;
      const np = prev.map((m) => {
        if (m && now - m.born > m.ttl) { changed = true; return null; }
        return m;
      });
      return changed ? np : prev;
    });
  });

  const whack = useCallback(
    (i: number) => {
      if (over || !mages[i]) return;
      const mage = mages[i]!;
      setMages((prev) => { const np = [...prev]; np[i] = null; return np; });
      setScore((sc) => sc + 10);
      if (mage.type === "fire") {
        // Clear adjacent
        setMages((prev) => {
          const np = [...prev];
          const r = Math.floor(i / COLS), c = i % COLS;
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++) {
              const ni = (r + dr) * COLS + (c + dc);
              if (ni >= 0 && ni < np.length && ni !== i) np[ni] = null;
            }
          return np;
        });
      }
      if (mage.type === "illusion") {
        // Duplicate targets
        setMages((prev) => {
          const np = [...prev];
          for (let j = 0; j < np.length; j++) {
            if (!np[j] && Math.random() < 0.4) {
              np[j] = { type: "normal", born: Date.now(), ttl: 800 };
            }
          }
          return np;
        });
      }
    },
    [mages, over],
  );

  const reset = () => {
    setScore(0);
    setTime(30);
    setOver(false);
    setMages(Array(COLS * ROWS).fill(null));
  };

  const emoji: Record<string, string> = { fire: "🔥", ice: "🧊", illusion: "🌀", normal: "🧙" };
  const color: Record<string, string> = { fire: "#ff6a3d", ice: "#60a5fa", illusion: "#a855f7", normal: G.accent };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${score}`} extra={<span className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-ember">⏱️{time}</span>}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <div className="grid grid-cols-3 gap-3">
          {mages.map((m, i) => (
            <button
              key={i}
              type="button"
              disabled={over}
              onClick={() => whack(i)}
              className="flex size-20 items-center justify-center rounded-xl border text-4xl transition-all md:size-24"
              style={{
                background: m ? color[m.type] + "22" : "var(--color-surface)",
                borderColor: m ? color[m.type] : "var(--color-line)",
                boxShadow: m ? `0 0 12px ${color[m.type]}44` : "none",
              }}
            >
              {m ? emoji[m.type] : ""}
            </button>
          ))}
        </div>
        {over && <p className="font-display text-xl text-fg">Final Score: {score}</p>}
      </div>
    </GameShell>
  );
}
