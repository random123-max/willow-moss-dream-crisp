import { useState, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("mastermind-alchemy")!;
const ELEMENTS = ["🔥", "💧", "🌿", "⚡", "🔮", "❄️"];
const CODE_LEN = 4;

function genCode(): string[] {
  return Array.from({ length: CODE_LEN }, () => ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]);
}

function check(code: string[], guess: string[]): { exact: number; partial: number; reactions: string[] } {
  const exact: boolean[] = Array(CODE_LEN).fill(false);
  const used: boolean[] = Array(CODE_LEN).fill(false);
  let exactCount = 0;
  for (let i = 0; i < CODE_LEN; i++) if (guess[i] === code[i]) { exact[i] = true; used[i] = true; exactCount++; }
  let partialCount = 0;
  const reactions: string[] = [];
  for (let i = 0; i < CODE_LEN; i++) {
    if (exact[i]) { reactions.push("🟢"); continue; }
    let found = false;
    for (let j = 0; j < CODE_LEN; j++) {
      if (!used[j] && guess[i] === code[j]) {
        // Fire + Water = steam hint
        if ((guess[i] === "🔥" && code[j] === "💧") || (guess[i] === "💧" && code[j] === "🔥")) {
          reactions.push("💨"); // steam
        } else {
          reactions.push("🟡");
        }
        used[j] = true;
        partialCount++;
        found = true;
        break;
      }
    }
    if (!found) reactions.push("⚫");
  }
  return { exact: exactCount, partial: partialCount, reactions };
}

export default function MastermindAlchemy() {
  const [code, setCode] = useState<string[]>(genCode);
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [feedback, setFeedback] = useState<string[][]>([]);
  const [current, setCurrent] = useState<string[]>([]);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [msg, setMsg] = useState("Break the alchemical code!");

  const submit = useCallback(() => {
    if (over || current.length !== CODE_LEN) return;
    const fb = check(code, current);
    const ng = [...guesses, current];
    const nf = [...feedback, fb.reactions];
    setGuesses(ng);
    setFeedback(nf);
    setCurrent([]);
    if (fb.exact === CODE_LEN) { setOver(true); setWon(true); setMsg("Alchemical breach! 🎉"); }
    else if (ng.length >= 8) { setOver(true); setMsg(`Failed! Code was ${code.join("")}`); }
    else setMsg(`${fb.exact} exact, ${fb.partial} partial. ${fb.reactions.includes("💨") ? "💨 Steam hints!" : ""}`);
  }, [over, current, code, guesses, feedback]);

  const reset = () => {
    setCode(genCode());
    setGuesses([]);
    setFeedback([]);
    setCurrent([]);
    setOver(false);
    setWon(false);
    setMsg("Break the alchemical code!");
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`${guesses.length}/8`}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {/* Past guesses */}
        <div className="flex flex-col gap-1">
          {guesses.map((g, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex gap-1">
                {g.map((el, j) => <span key={j} className="flex size-8 items-center justify-center rounded text-lg" style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}>{el}</span>)}
              </div>
              <div className="flex gap-1">
                {feedback[i]?.map((f, j) => <span key={j} className="text-sm">{f}</span>)}
              </div>
            </div>
          ))}
        </div>
        {/* Current guess */}
        <div className="flex gap-1">
          {Array.from({ length: CODE_LEN }, (_, i) => (
            <div key={i} className="flex size-10 items-center justify-center rounded text-xl" style={{ background: current[i] ? "var(--color-elevated)" : "var(--color-surface)", border: `2px solid ${current[i] ? G.accent : "var(--color-line)"}` }}>
              {current[i] || "?"}
            </div>
          ))}
        </div>
        {/* Element picker */}
        {!over && (
          <>
            <div className="flex gap-2">
              {ELEMENTS.map((el) => (
                <button key={el} type="button" onClick={() => setCurrent((c) => c.length < CODE_LEN ? [...c, el] : c)} className="flex size-10 items-center justify-center rounded-lg border text-xl transition-all hover:scale-110" style={{ borderColor: G.accent + "44", background: G.accent + "11" }}>
                  {el}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setCurrent((c) => c.slice(0, -1))} className="rounded-lg border border-line px-3 py-1.5 text-sm text-muted">⌫</button>
              <button type="button" onClick={submit} disabled={current.length !== CODE_LEN} className="rounded-lg px-4 py-1.5 text-sm font-bold disabled:opacity-40" style={{ background: G.accent, color: "#071018" }}>Brew</button>
            </div>
          </>
        )}
        <div className="flex gap-2 text-xs text-muted">
          <span>🟢 Exact</span><span>🟡 Partial</span><span>💨 Steam (Fire+Water)</span><span>⚫ Wrong</span>
        </div>
      </div>
    </GameShell>
  );
}
