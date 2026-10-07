import { useState, useCallback, useEffect, useRef } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { usePersist } from "@/components/arcade/hooks";
import { getGame } from "@/lib/arcade-games";

const G = getGame("simon-frequency")!;
const PADS = 4;
const COLORS = ["#3ee0d0", "#ff6a3d", "#a855f7", "#fbbf24"];
const FREQS = [261, 329, 392, 523]; // C, E, G, C

export default function SimonFrequency() {
  const [seq, setSeq] = useState<number[]>([]);
  const [input, setInput] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [showing, setShowing] = useState(false);
  const [round, setRound] = useState(0);
  const [best, setBest] = usePersist("arcade-simon-best", 0);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Press start!");
  const audio = useRef<AudioContext | null>(null);
  const warped = useRef(0);

  const playTone = useCallback((pad: number) => {
    if (!audio.current) audio.current = new AudioContext();
    const osc = audio.current.createOscillator();
    const gain = audio.current.createGain();
    osc.frequency.value = FREQS[pad] * (1 + warped.current * 0.15);
    osc.type = "sine";
    gain.gain.setValueAtTime(0.15, audio.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.current.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audio.current.destination);
    osc.start();
    osc.stop(audio.current.currentTime + 0.4);
    setActive(pad);
    setTimeout(() => setActive(null), 300);
  }, []);

  const showSequence = useCallback(
    (s: number[]) => {
      setShowing(true);
      setMsg("Watch and listen...");
      s.forEach((pad, i) => {
        setTimeout(() => {
          playTone(pad);
          if (i === s.length - 1) setTimeout(() => { setShowing(false); setMsg("Your turn!"); }, 500);
        }, (i + 1) * 600);
      });
    },
    [playTone],
  );

  const start = useCallback(() => {
    const newSeq = [Math.floor(Math.random() * PADS)];
    setSeq(newSeq);
    setInput([]);
    setRound(1);
    setOver(false);
    warped.current = 0;
    setPlaying(true);
    setTimeout(() => showSequence(newSeq), 500);
  }, [showSequence]);

  const tap = useCallback(
    (pad: number) => {
      if (showing || over || !playing) return;
      playTone(pad);
      const ni = [...input, pad];
      setInput(ni);
      if (seq[ni.length - 1] !== pad) {
        setOver(true);
        setPlaying(false);
        setMsg(`Wrong! Reached round ${round}.`);
        if (round - 1 > best) setBest(round - 1);
        return;
      }
      if (ni.length === seq.length) {
        if (round > best) setBest(round);
        const next = [...seq, Math.floor(Math.random() * PADS)];
        setSeq(next);
        setRound((r) => r + 1);
        setInput([]);
        warped.current = Math.min(1, (round - 1) * 0.1);
        setMsg("Correct! Next round...");
        setTimeout(() => showSequence(next), 800);
      }
    },
    [input, seq, round, showing, over, playing, best, setBest, playTone, showSequence],
  );

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} score={`Round ${round}`} best={`${best}`}>
      <div className="flex flex-col items-center gap-4 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {warped.current > 0 && <p className="text-xs" style={{ color: G.accent }}>🌊 Frequencies warped {Math.round(warped.current * 100)}%</p>}
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: PADS }, (_, i) => (
            <button
              key={i}
              type="button"
              disabled={showing || over}
              onClick={() => tap(i)}
              className="flex size-28 items-center justify-center rounded-xl text-2xl transition-all md:size-32"
              style={{
                background: COLORS[i],
                opacity: active === i ? 1 : 0.4,
                boxShadow: active === i ? `0 0 24px ${COLORS[i]}` : "none",
                transform: active === i ? "scale(1.05)" : "scale(1)",
                transition: "all 0.1s",
              }}
            >
              {i === 0 && "◆"}{i === 1 && "▲"}{i === 2 && "●"}{i === 3 && "■"}
            </button>
          ))}
        </div>
        {(over || !playing) && (
          <button type="button" onClick={start} className="rounded-lg px-6 py-2.5 text-sm font-bold" style={{ background: G.accent, color: "#071018" }}>
            {over ? "Try Again" : "Start"}
          </button>
        )}
        <p className="text-xs text-muted">Higher rounds warp frequencies — listen for tones!</p>
      </div>
    </GameShell>
  );
}
