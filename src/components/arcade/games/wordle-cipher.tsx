import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("wordle-cipher")!;
const WORDS = ["CYBER", "GHOST", "PIXEL", "NOVA", "ORBIT", "LASER", "VAULT", "QUARK", "PRISM", "RADAR", "BLAZE", "FLUX"];

export default function WordleCipher() {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const [msg, setMsg] = useState("Guess the 5-letter cipher!");

  const submit = useCallback(() => {
    if (over || current.length !== 5) return;
    const ng = [...guesses, current];
    setGuesses(ng);
    setCurrent("");

    if (current === word) {
      setOver(true);
      setWon(true);
      setMsg("Cipher cracked! 🎉");
      return;
    }
    if (ng.length >= 6) {
      setOver(true);
      setMsg(`Breached! The word was ${word}`);
      return;
    }
    // Firewall hack: lock 1-2 random unused keys
    const avail = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => !current.includes(l) && !locked.has(l));
    if (avail.length > 2) {
      const nl = new Set(locked);
      nl.add(avail[Math.floor(Math.random() * avail.length)]);
      setLocked(nl);
      setMsg("🛡️ Firewall locked a key for next turn!");
    }
  }, [over, current, word, guesses, locked]);

  const getColor = (letter: string, idx: number) => {
    if (word[idx] === letter) return G.accent;
    if (word.includes(letter)) return "#f59e0b";
    return "var(--color-line)";
  };

  const reset = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses([]);
    setCurrent("");
    setOver(false);
    setWon(false);
    setLocked(new Set());
    setMsg("Guess the 5-letter cipher!");
  };

  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${guesses.length}/6`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Guesses grid */}
        <div className="flex flex-col gap-1">
          {Array.from({ length: 6 }, (_, r) => (
            <div key={r} className="flex gap-1">
              {Array.from({ length: 5 }, (_, c) => {
                const guess = guesses[r];
                const letter = guess?.[c] ?? (r === guesses.length ? current[c] : "");
                const color = guess ? getColor(guess[c], c) : "var(--color-line)";
                return (
                  <div key={c} className="flex size-12 items-center justify-center rounded font-mono text-xl font-bold md:size-14" style={{ background: letter ? color + "22" : "var(--color-surface)", border: `2px solid ${color}`, color: color === "var(--color-line)" ? "var(--color-fg)" : color }}>
                    {letter}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        {/* Keyboard */}
        <div className="grid grid-cols-7 gap-1 sm:grid-cols-9">
          {alpha.map((l) => {
            const used = guesses.some((g) => g.includes(l));
            const isLocked = locked.has(l) && !over;
            return (
              <button key={l} type="button" disabled={over || isLocked || current.length >= 5} onClick={() => setCurrent((c) => c.length < 5 ? c + l : c)} className="flex size-8 items-center justify-center rounded text-sm font-bold transition-all md:size-10" style={{ background: isLocked ? "var(--color-bg)" : "var(--color-surface)", border: `1px solid ${isLocked ? "var(--color-line)" : G.accent + "44"}`, color: isLocked ? "var(--color-line)" : G.accent, opacity: isLocked ? 0.3 : 1 }}>
                {isLocked ? "🔒" : l}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => setCurrent((c) => c.slice(0, -1))} className="rounded-lg border border-line px-4 py-2 text-sm text-muted">⌫</button>
          <button type="button" onClick={submit} disabled={current.length !== 5 || over} className="rounded-lg px-6 py-2 text-sm font-bold disabled:opacity-40" style={{ background: G.accent, color: "#071018" }}>Enter</button>
        </div>
      </div>
    </GameShell>
  );
}
