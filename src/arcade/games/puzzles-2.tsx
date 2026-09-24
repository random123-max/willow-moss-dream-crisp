import { useState, useEffect, useRef, useCallback } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 31. Lights Out: Overcharge ═══════════════ */

const L_SZ = 4;
function initLights(): number[] {
  const b = Array(L_SZ * L_SZ).fill(0);
  for (let i = 0; i < 6; i++) b[Math.floor(Math.random() * b.length)] = 1;
  return b;
}
function toggle(b: number[], i: number): number[] {
  const nb = [...b]; const r = Math.floor(i / L_SZ), c = i % L_SZ;
  [[r,c],[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr, nc]) => {
    if (nr >= 0 && nr < L_SZ && nc >= 0 && nc < L_SZ) nb[nr*L_SZ+nc] = (nb[nr*L_SZ+nc] + 1) % 3;
  });
  return nb;
}

export function LightsOvercharge() {
  const [board, setBoard] = useState<number[]>(initLights);
  const [moves, setMoves] = useState(0);
  const won = board.every(x => x === 0);

  function click(i: number) { setBoard(b => toggle(b, i)); setMoves(m => m + 1); }
  const reset = () => { setBoard(initLights()); setMoves(0); };
  const colors = ["bg-surface", "bg-primary/30", "bg-ember/40"];

  return (
    <GameShell title="Lights Out: Overcharge" sidebar={<>
      <Stat label="Moves" value={moves} />
      <Msg>{won ? "🏆 All dark!" : "Cycle nodes through 3 states. Turn all to 0."}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New puzzle</Btn>
    </>}>
      <div className="mx-auto grid max-w-xs grid-cols-4 gap-2">
        {board.map((v, i) => (
          <button key={i} onClick={() => click(i)}
            className={`flex aspect-square items-center justify-center rounded-lg border border-line text-2xl font-bold ${colors[v]}`}>
            {v}
          </button>
        ))}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 32. Simon Says: Frequency Modulator ═══════════════ */

const SIMON_COLORS = [
  { c: "#3ee0d0", name: "C" },
  { c: "#ff6a3d", name: "E" },
  { c: "#4fc3f7", name: "G" },
  { c: "#ece7de", name: "B" },
];

export function SimonFreq() {
  const [seq, setSeq] = useState<number[]>([]);
  const [input, setInput] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState(-1);
  const [round, setRound] = useState(0);
  const [log, setLog] = useState("Press Start");
  const [freqShift, setFreqShift] = useState(0);

  const start = () => {
    setSeq([Math.floor(Math.random() * 4)]); setInput([]); setRound(1); setLog("Watch…"); setFreqShift(0);
    setTimeout(() => playSeq(), 500);
  };

  const playSeq = useCallback(() => {
    setPlaying(true);
    let i = 0;
    const show = () => {
      if (i >= seq.length) { setPlaying(false); setActive(-1); setLog("Your turn!"); return; }
      setActive(seq[i]);
      setTimeout(() => { setActive(-1); i++; setTimeout(show, 200); }, 400 + freqShift * 50);
    };
    show();
  }, [seq, freqShift]);

  function press(i: number) {
    if (playing) return;
    const ni = [...input, i]; setInput(ni); setActive(i);
    setTimeout(() => setActive(-1), 200);
    if (seq[ni.length - 1] !== i) { setLog("❌ Wrong! Game over."); setRound(0); return; }
    if (ni.length === seq.length) {
      const next = [...seq, Math.floor(Math.random() * 4)];
      setSeq(next); setInput([]); setRound(r => r + 1); setFreqShift(f => f + 1);
      setLog("✅ Correct! Watch…");
      setTimeout(() => playSeq(), 800);
    }
  }

  return (
    <GameShell title="Simon Says: Frequency Modulator" sidebar={<>
      <Stat label="Round" value={round} />
      <Stat label="Freq shift" value={freqShift} />
      <Msg>{log}</Msg>
      <Btn onClick={start} variant="ghost" className="w-full">Start / Restart</Btn>
    </>}>
      <div className="mx-auto grid max-w-xs grid-cols-2 gap-3">
        {SIMON_COLORS.map((c, i) => (
          <button key={i} onClick={() => press(i)}
            className="aspect-square rounded-2xl border-2 transition-all"
            style={{
              borderColor: c.c,
              backgroundColor: active === i ? c.c : "transparent",
              opacity: active === i ? 1 : 0.3,
              transform: `rotate(${freqShift * 3}deg)`,
            }}>
            <span className="font-display text-2xl font-bold" style={{ color: active === i ? "#071018" : c.c }}>{c.name}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted">Higher rounds warp frequencies — tones shift pitch & speed.</p>
    </GameShell>
  );
}

/* ═══════════════ 33. Fifteen: Gravity Grid ═══════════════ */

const F_SZ = 4;
function initFifteen(): number[] {
  const t = Array.from({length: F_SZ*F_SZ-1}, (_, i) => i+1).concat([0]);
  for (let i = 0; i < 100; i++) {
    const e = t.indexOf(0); const r = Math.floor(e/F_SZ), c = e%F_SZ;
    const dirs = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([nr,nc]) => nr>=0&&nr<F_SZ&&nc>=0&&nc<F_SZ);
    const [nr, nc] = dirs[Math.floor(Math.random()*dirs.length)];
    [t[e], t[nr*F_SZ+nc]] = [t[nr*F_SZ+nc], t[e]];
  }
  return t;
}

export function FifteenGravity() {
  const [tiles, setTiles] = useState<number[]>(initFifteen);
  const [moves, setMoves] = useState(0);
  const [autoPull, setAutoPull] = useState(true);
  const won = tiles.every((t, i) => i === F_SZ*F_SZ-1 ? t === 0 : t === i+1);

  function click(i: number) {
    const e = tiles.indexOf(0); const er = Math.floor(e/F_SZ), ec = e%F_SZ; const r = Math.floor(i/F_SZ), c = i%F_SZ;
    if (Math.abs(er-r)+Math.abs(ec-c) !== 1) return;
    const nt = [...tiles]; [nt[i], nt[e]] = [nt[e], nt[i]]; setTiles(nt); setMoves(m => m+1);
  }

  useEffect(() => {
    if (!autoPull || won) return;
    const id = setInterval(() => {
      setTiles(prev => {
        const e = prev.indexOf(0); const er = Math.floor(e/F_SZ), ec = e%F_SZ;
        const adj: number[] = [];
        [[er-1,ec],[er+1,ec],[er,ec-1],[er,ec+1]].forEach(([nr,nc]) => {
          if (nr>=0&&nr<F_SZ&&nc>=0&&nc<F_SZ) adj.push(nr*F_SZ+nc);
        });
        if (!adj.length) return prev;
        const pull = adj[Math.floor(Math.random()*adj.length)];
        const nt = [...prev]; [nt[pull], nt[e]] = [nt[e], nt[pull]]; setMoves(m => m+1);
        return nt;
      });
    }, 4000);
    return () => clearInterval(id);
  }, [autoPull, won]);

  const reset = () => { setTiles(initFifteen()); setMoves(0); setAutoPull(true); };

  return (
    <GameShell title="Fifteen: Gravity Grid" sidebar={<>
      <Stat label="Moves" value={moves} />
      <Btn onClick={() => setAutoPull(a => !a)} variant="ghost" className="w-full">{autoPull ? "⏸ Pause black hole" : "▶ Resume pull"}</Btn>
      <Msg>{won ? "🏆 Solved!" : "The empty tile is a black hole — it auto-pulls neighbors every 4s."}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">Shuffle</Btn>
    </>}>
      <div className="mx-auto grid max-w-xs grid-cols-4 gap-1 rounded-lg border border-line bg-bg p-2">
        {tiles.map((t, i) => (
          <button key={i} onClick={() => click(i)} disabled={t === 0}
            className="flex aspect-square items-center justify-center rounded-md border border-line bg-surface font-display text-xl font-bold text-fg hover:bg-elevated">
            {t || ""}
          </button>
        ))}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 34. Nonogram: Blueprint Architect ═══════════════ */

const N_SZ = 5;
const SOLUTION = [
  [1,1,0,1,1],
  [1,0,1,0,1],
  [0,1,1,1,0],
  [1,0,1,0,1],
  [1,1,0,1,1],
];
function getClues(line: number[]): number[] {
  const clues: number[] = []; let cnt = 0;
  for (const v of line) { if (v) cnt++; else { if (cnt) clues.push(cnt); cnt = 0; } }
  if (cnt) clues.push(cnt);
  return clues.length ? clues : [0];
}

export function NonogramBlueprint() {
  const [grid, setGrid] = useState<number[][]>(Array.from({length: N_SZ}, () => Array(N_SZ).fill(0)));
  const [marks, setMarks] = useState<number[][]>(Array.from({length: N_SZ}, () => Array(N_SZ).fill(0)));
  const [time, setTime] = useState(60);
  const [over, setOver] = useState(false);
  const rowClues = SOLUTION.map(r => getClues(r));
  const colClues = Array.from({length: N_SZ}, (_, c) => getClues(SOLUTION.map(r => r[c])));

  useEffect(() => {
    if (over) return;
    const id = setInterval(() => setTime(t => { if (t <= 1) { setOver(true); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, [over]);

  function click(r: number, c: number) {
    if (over) return;
    const nm = marks.map(row => [...row]);
    nm[r][c] = nm[r][c] === 0 ? 1 : nm[r][c] === 1 ? 2 : 0;
    setMarks(nm);
    const correct = nm.every((row, ri) => row.every((v, ci) => (v === 1) === !!SOLUTION[ri][ci]));
    if (correct) { setOver(true); setTime(t => t); }
  }

  const won = marks.every((row, r) => row.every((v, c) => v === 1) === !!SOLUTION[r][c]));

  return (
    <GameShell title="Nonogram: Blueprint Architect" sidebar={<>
      <Stat label="Time" value={`${time}s`} />
      <Msg>{won ? "🤖 Robot built!" : over && time <= 0 ? "⏰ Time's up!" : "Fill=1, mark=2, empty=0. Match the blueprint."}</Msg>
    </>}>
      <div className="mx-auto" style={{display: "grid", gridTemplateColumns: `auto repeat(${N_SZ}, 1fr)`}}>
        <div />
        {colClues.map((cl, c) => (
          <div key={c} className="flex flex-col items-center justify-end text-xs text-muted" style={{minHeight: 30}}>
            {cl.map((n, i) => <span key={i}>{n}</span>)}
          </div>
        ))}
        {rowClues.map((cl, r) => (
          <>
            <div key={`r${r}`} className="flex items-center justify-end gap-0.5 pr-1 text-xs text-muted">
              {cl.map((n, i) => <span key={i}>{n}</span>)}
            </div>
            {Array.from({length: N_SZ}).map((_, c) => (
              <button key={`${r}-${c}`} onClick={() => click(r, c)}
                className={`aspect-square border border-line ${
                  marks[r][c] === 1 ? "bg-primary" : marks[r][c] === 2 ? "bg-ember/20" : "bg-surface hover:bg-elevated"
                }`} />
            ))}
          </>
        ))}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 35. Steam-Pipe Connector ═══════════════ */

const PIPE_TYPES = ["straight", "curve", "cross"];
const PIPE_DIRS: Record<string, number[]> = {
  straight: [0, 2], curve: [0, 1], cross: [0, 1, 2, 3],
};
function initPipes(): { type: string; rot: number; filled: boolean }[] {
  return Array.from({length: 25}, () => ({
    type: PIPE_TYPES[Math.floor(Math.random() * 3)],
    rot: Math.floor(Math.random() * 4),
    filled: false,
  }));
}
function getConnections(type: string, rot: number): number[] {
  return PIPE_DIRS[type].map(d => (d + rot) % 4);
}

export function SteamPipe() {
  const [pipes, setPipes] = useState(initPipes);
  const [pressure, setPressure] = useState(0);
  const [score, setScore] = useState(0);
  const [leaks, setLeaks] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPressure(p => Math.min(100, p + 5));
      setPipes(prev => {
        const np = prev.map(p => ({...p, filled: false}));
        np[0].filled = true;
        const queue = [0];
        while (queue.length) {
          const i = queue.pop()!;
          const conns = getConnections(np[i].type, np[i].rot);
          conns.forEach(dir => {
            const nr = Math.floor(i/5) + (dir === 0 ? -1 : dir === 2 ? 1 : 0);
            const nc = (i%5) + (dir === 1 ? 1 : dir === 3 ? -1 : 0);
            if (nr < 0 || nr >= 5 || nc < 0 || nc >= 5) { setLeaks(l => l + 1); return; }
            const ni = nr * 5 + nc;
            if (!np[ni].filled) {
              const nConns = getConnections(np[ni].type, np[ni].rot);
              const opposite = (dir + 2) % 4;
              if (nConns.includes(opposite)) { np[ni].filled = true; queue.push(ni); setScore(s => s + 1); }
              else setLeaks(l => l + 1);
            }
          });
        }
        return np;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  function rotate(i: number) {
    setPipes(prev => { const np = prev.map(p => ({...p})); np[i].rot = (np[i].rot + 1) % 4; return np; });
  }
  const reset = () => { setPipes(initPipes()); setPressure(0); setScore(0); setLeaks(0); };

  return (
    <GameShell title="Steam-Pipe Connector" sidebar={<>
      <Stat label="Pressure" value={`${pressure}%`} />
      <Stat label="Flow score" value={score} />
      <Stat label="Leaks" value={leaks} />
      <Msg>Click pipes to rotate. Connect from source (top-left). Faulty joints leak!</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">Reset</Btn>
    </>}>
      <div className="mx-auto grid max-w-sm grid-cols-5 gap-1 rounded-lg border border-line bg-bg p-2">
        {pipes.map((p, i) => (
          <button key={i} onClick={() => rotate(i)}
            className={`flex aspect-square items-center justify-center rounded-md border border-line text-2xl ${
              p.filled ? "bg-primary/30 border-primary" : "bg-surface hover:bg-elevated"
            }`}>
            <span style={{ transform: `rotate(${p.rot * 90}deg)` }}>
              {p.type === "straight" ? "│" : p.type === "curve" ? "╰" : "✛"}
            </span>
          </button>
        ))}
      </div>
    </GameShell>
  );
}
