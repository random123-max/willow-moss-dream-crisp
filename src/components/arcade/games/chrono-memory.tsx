import { useState, useEffect, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("chrono-memory")!;
const RUNES = ["🔮", "⚔️", "🛡️", "🗡️", "🧪", "📜", "🗝️", "💀"];
const PAIRS = [...RUNES, ...RUNES];

function shuffle<T>(a: T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

export default function ChronoMemory() {
  const [cards, setCards] = useState(() => shuffle(PAIRS).map((r, i) => ({ id: i, rune: r, flipped: false, matched: false, cursed: Math.random() < 0.12 })));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [time, setTime] = useState(60);
  const [matches, setMatches] = useState(0);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Match the runes!");
  const [lock, setLock] = useState(false);

  useEffect(() => {
    if (over) return;
    const t = setInterval(() => setTime((s) => {
      if (s <= 1) {
        setOver(true);
        setMsg("Time's up!");
        return 0;
      }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [over]);

  const flip = useCallback((idx: number) => {
    if (lock || over || cards[idx].flipped || cards[idx].matched) return;
    const nc = [...cards];
    nc[idx] = { ...nc[idx], flipped: true };
    setCards(nc);
    const nf = [...flipped, idx];
    setFlipped(nf);

    if (nf.length === 2) {
      setLock(true);
      const [a, b] = nf;
      if (nc[a].rune === nc[b].rune) {
        setTimeout(() => {
          setCards((prev) => {
            const np = [...prev];
            np[a] = { ...np[a], matched: true };
            np[b] = { ...np[b], matched: true };
            return np;
          });
          setMatches((m) => {
            const nm = m + 1;
            if (nc[a].cursed || nc[b].cursed) {
              setMsg("💀 Cursed card! Board shuffling!");
              setCards((prev) => {
                const unmatched = prev.filter((c) => !c.matched);
                const shuffled = shuffle(unmatched.map((c, i) => ({ ...c, flipped: false })));
                let si = 0;
                return prev.map((c) => (c.matched ? c : shuffled[si++]));
              });
            } else {
              setTime((t) => t + 5);
              setMsg("Match! +5 seconds");
            }
            if (nm >= RUNES.length) {
              setOver(true);
              setMsg("All matched! Victory!");
            }
            return nm;
          });
          setFlipped([]);
          setLock(false);
        }, 500);
      } else {
        setTimeout(() => {
          setCards((prev) => {
            const np = [...prev];
            np[a] = { ...np[a], flipped: false };
            np[b] = { ...np[b], flipped: false };
            return np;
          });
          setFlipped([]);
          setLock(false);
          setMsg("No match — try again");
        }, 800);
      }
    }
  }, [cards, flipped, lock, over]);

  const reset = () => {
    setCards(shuffle(PAIRS).map((r, i) => ({ id: i, rune: r, flipped: false, matched: false, cursed: Math.random() < 0.12 })));
    setFlipped([]);
    setTime(60);
    setMatches(0);
    setOver(false);
    setMsg("Match the runes!");
    setLock(false);
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`⏱️${time}s`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <div className="flex w-full max-w-sm items-center justify-between">
          <span className="text-sm" style={{ color: time < 15 ? "#ff6a3d" : G.accent }}>⏱️ {time}s</span>
          <span className="text-sm text-muted">Matches: {matches}/{RUNES.length}</span>
        </div>
        <p className="text-sm text-dust">{msg}</p>
        <div className="grid grid-cols-4 gap-2">
          {cards.map((c, i) => (
            <button
              key={c.id}
              type="button"
              disabled={c.matched || over}
              onClick={() => flip(i)}
              className="flex size-16 items-center justify-center rounded-lg border text-2xl transition-all md:size-20"
              style={{
                background: c.matched ? "var(--color-elevated)" : c.flipped ? "var(--color-surface)" : "var(--color-bg)",
                borderColor: c.flipped || c.matched ? G.accent + "55" : "var(--color-line)",
                opacity: c.matched ? 0.3 : 1,
                transform: c.flipped ? "rotateY(0)" : "rotateY(0)",
              }}
            >
              {c.flipped || c.matched ? c.rune : "❓"}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
