import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("cyber-hangman")!;
const WORDS = ["FIREWALL", "QUANTUM", "ENCRYPT", "PROTOCOL", "NEURAL", "BREACH", "MATRIX", "CIPHER", "DIGITAL", "HACKING", "SYSTEM", "CIRCUIT", "NETWORK", "BINARY"];

export default function CyberHangman() {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Breach the firewall!");
  const [scrambled, setScrambled] = useState(false);
  const [dimmed, setDimmed] = useState<Set<string>>(new Set());

  const display = word.split("").map((l) => (guessed.has(l) ? l : "_"));
  const won = display.every((l) => l !== "_");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  if (wrong >= 6 && !over) {
    setOver(true);
    setMsg(`Breached! The word was ${word}`);
  } else if (won && !over) {
    setOver(true);
    setMsg("Firewall breached! You win!");
  }

  const guess = useCallback(
    (letter: string) => {
      if (over || guessed.has(letter) || dimmed.has(letter)) return;
      const ng = new Set(guessed);
      ng.add(letter);
      setGuessed(ng);
      if (!word.includes(letter)) {
        setWrong((w) => {
          const nw = w + 1;
          // Drone hack
          if (nw % 2 === 0) {
            setScrambled(true);
            setMsg("🤖 Drone scramble! Letters rearranged!");
            setTimeout(() => setScrambled(false), 2000);
          } else {
            const dim = new Set(dimmed);
            const avail = alphabet.filter((l) => !ng.has(l) && !dim.has(l));
            if (avail.length) dim.add(avail[Math.floor(Math.random() * avail.length)]);
            setDimmed(dim);
            setMsg("🤖 Drone dimmed a key!");
          }
          return nw;
        });
      } else {
        setMsg("Letter accepted!");
      }
    },
    [over, guessed, word, dimmed, alphabet],
  );

  const reset = () => {
    setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuessed(new Set());
    setWrong(0);
    setOver(false);
    setMsg("Breach the firewall!");
    setScrambled(false);
    setDimmed(new Set());
  };

  const displayAlpha = scrambled ? [...alphabet].sort(() => Math.random() - 0.5) : alphabet;

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`❌${wrong}/6`}>
      <div className="flex flex-col items-center gap-5 p-4 pt-6">
        {/* Drone indicator */}
        <div className="flex gap-1">
          {Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="text-xl" style={{ opacity: i < wrong ? 1 : 0.2 }}>🤖</span>
          ))}
        </div>
        {/* Word */}
        <div className="flex gap-2">
          {display.map((l, i) => (
            <span key={i} className="flex size-10 items-center justify-center rounded-lg border font-mono text-xl font-bold md:size-12" style={{ borderColor: l !== "_" ? G.accent : "var(--color-line)", color: l !== "_" ? G.accent : "var(--color-muted)", background: l !== "_" ? G.accent + "11" : "var(--color-surface)" }}>
              {l}
            </span>
          ))}
        </div>
        <p className="text-sm text-dust">{msg}</p>
        {/* Keyboard */}
        <div className="grid grid-cols-7 gap-1.5 sm:grid-cols-9">
          {displayAlpha.map((l) => {
            const used = guessed.has(l);
            const dim = dimmed.has(l);
            return (
              <button
                key={l}
                type="button"
                disabled={over || used || dim}
                onClick={() => guess(l)}
                className="flex size-9 items-center justify-center rounded-md border text-sm font-bold transition-all md:size-10"
                style={{
                  borderColor: used ? "var(--color-line)" : G.accent + "44",
                  background: used ? "var(--color-elevated)" : dim ? "var(--color-bg)" : "var(--color-surface)",
                  color: used ? "var(--color-muted)" : dim ? "var(--color-line)" : G.accent,
                  opacity: dim ? 0.3 : 1,
                }}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
