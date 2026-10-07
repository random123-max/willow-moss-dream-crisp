import { useState, useRef, useCallback } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("rps-quantum")!;
type Move = "rock" | "paper" | "scissors";
const MOVES: Move[] = ["rock", "paper", "scissors"];
const EMOJI: Record<Move, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };
const BEATS: Record<Move, Move> = { rock: "scissors", paper: "rock", scissors: "paper" };

export default function RPSQuantum() {
  const [playerHP, setPlayerHP] = useState(100);
  const [aiHP, setAiHP] = useState(100);
  const [charge, setCharge] = useState(0);
  const [round, setRound] = useState(0);
  const [log, setLog] = useState("Choose your move!");
  const [over, setOver] = useState(false);
  const [superReady, setSuperReady] = useState(false);
  const history = useRef<Move[]>([]);

  const predict = useCallback((): Move => {
    const h = history.current;
    if (h.length < 2) return MOVES[Math.floor(Math.random() * 3)];
    const last = h[h.length - 1];
    const next = h[h.length - 2];
    const counts: Record<Move, number> = { rock: 0, paper: 0, scissors: 0 };
    for (let i = 0; i < h.length - 1; i++) {
      if (h[i] === last && h[i + 1] === next) counts[h[i + 1]] = (counts[h[i + 1]] || 0) + 1;
    }
    // Counter the most likely next move
    const predicted = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] as Move) ?? MOVES[Math.floor(Math.random() * 3)];
    return BEATS[predicted] === predicted ? MOVES[Math.floor(Math.random() * 3)] : (Object.keys(BEATS).find((k) => BEATS[k as Move] === predicted) as Move);
  }, []);

  const play = useCallback(
    (move: Move, isSuper: boolean) => {
      if (over) return;
      history.current.push(move);
      const ai = predict();
      let dmg = 0;
      let aiDmg = 0;
      if (move === ai) {
        setLog(`Both played ${EMOJI[move]}! Tie — no damage.`);
      } else if (BEATS[move] === ai) {
        dmg = isSuper ? 35 : 15;
        aiDmg = 5;
        setLog(`${isSuper ? "⚡ SUPER " : ""}${EMOJI[move]} beats ${EMOJI[ai]}! ${dmg} dmg to AI!`);
      } else {
        dmg = 5;
        aiDmg = isSuper ? 10 : 18;
        setLog(`${EMOJI[ai]} beats ${EMOJI[move]}! ${aiDmg} dmg to you!`);
      }
      const newAiHP = Math.max(0, aiHP - dmg);
      const newPlayerHP = Math.max(0, playerHP - aiDmg);
      setAiHP(newAiHP);
      setPlayerHP(newPlayerHP);
      setRound((r) => r + 1);
      if (isSuper) {
        setCharge(0);
        setSuperReady(false);
      } else {
        setCharge((c) => {
          const nc = c + 1;
          if (nc >= 5) {
            setSuperReady(true);
            setLog((l) => l + " ⚡ Super-move ready!");
          }
          return nc >= 5 ? 5 : nc;
        });
      }
      if (newAiHP <= 0 || newPlayerHP <= 0) {
        setOver(true);
        setLog(newAiHP <= 0 ? "Victory! The AI is defeated!" : "Defeated by the AI!");
      }
    },
    [over, predict, aiHP, playerHP],
  );

  const reset = () => {
    setPlayerHP(100);
    setAiHP(100);
    setCharge(0);
    setRound(0);
    setLog("Choose your move!");
    setOver(false);
    setSuperReady(false);
    history.current = [];
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`R${round}`}>
      <div className="flex flex-col items-center gap-5 p-4 pt-6">
        {/* HP bars */}
        <div className="flex w-full max-w-md gap-4">
          <div className="flex-1">
            <p className="mb-1 text-xs text-muted">You {playerHP}HP</p>
            <div className="h-3 overflow-hidden rounded-full bg-surface">
              <div className="h-full bg-primary transition-all" style={{ width: `${playerHP}%` }} />
            </div>
          </div>
          <div className="flex-1">
            <p className="mb-1 text-right text-xs text-muted">AI {aiHP}HP</p>
            <div className="h-3 overflow-hidden rounded-full bg-surface">
              <div className="ml-auto h-full bg-ember transition-all" style={{ width: `${aiHP}%` }} />
            </div>
          </div>
        </div>

        {/* Charge meter */}
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">⚡ Charge Meter</span>
            <span style={{ color: G.accent }}>{charge}/5 {superReady && "— READY!"}</span>
          </div>
          <div className="mt-1 flex gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-2 flex-1 rounded-full" style={{ background: i < charge ? G.accent : "var(--color-line)" }} />
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-dust">{log}</p>

        {/* Move buttons */}
        <div className="flex gap-3">
          {MOVES.map((m) => (
            <button
              key={m}
              type="button"
              disabled={over}
              onClick={() => play(m, false)}
              className="flex size-20 flex-col items-center justify-center gap-1 rounded-xl border border-line bg-surface text-3xl transition-all hover:border-primary/40 hover:bg-elevated md:size-24"
            >
              {EMOJI[m]}
              <span className="text-[10px] uppercase text-muted">{m}</span>
            </button>
          ))}
        </div>
        {superReady && !over && (
          <button
            type="button"
            onClick={() => play(MOVES[Math.floor(Math.random() * 3)], true)}
            className="rounded-lg px-6 py-3 text-sm font-bold animate-pulse"
            style={{ background: G.accent, color: "#071018" }}
          >
            ⚡ UNLEASH SUPER-MOVE!
          </button>
        )}
      </div>
    </GameShell>
  );
}
