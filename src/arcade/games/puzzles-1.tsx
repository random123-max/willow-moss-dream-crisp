import { useState, useEffect, useCallback } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 26. 2048: Fusion Reactor ═══════════════ */

const G4 = 4;
type Board = number[][];
function init2048(): Board {
  const b: Board = Array.from({length: G4}, () => Array(G4).fill(0));
  addTile(b); addTile(b); return b;
}
function addTile(b: Board) {
  const empty: [number, number][] = [];
  for (let r = 0; r < G4; r++) for (let c = 0; c < G4; c++) if (!b[r][c]) empty.push([r, c]);
  if (!empty.length) return;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  b[r][c] = Math.random() < 0.9 ? 2 : 4;
}
function slide(row: number[]): number[] {
  const f = row.filter(x => x); const res: number[] = [];
  for (let i = 0; i < f.length; i++) {
    if (f[i] === f[i+1]) { res.push(f[i]*2); i++; } else res.push(f[i]);
  }
  while (res.length < G4) res.push(0);
  return res;
}
function move(b: Board, dir: string): Board {
  const nb = b.map(r => [...r]);
  if (dir === "left") nb.forEach((r, i) => nb[i] = slide(r));
  else if (dir === "right") nb.forEach((r, i) => nb[i] = slide(r.reverse()).reverse());
  else if (dir === "up") { for (let c = 0; c < G4; c++) { const col = slide(nb.map(r => r[c])); col.forEach((v, r) => nb[r][c] = v); } }
  else if (dir === "down") { for (let c = 0; c < G4; c++) { const col = slide(nb.map(r => r[c]).reverse()).reverse(); col.forEach((v, r) => nb[r][c] = v); } }
  return nb;
}

export function Reactor2048() {
  const [board, setBoard] = useState<Board>(init2048);
  const [score, setScore] = useState(0);
  const [heat, setHeat] = useState(0);
  const [exploded, setExploded] = useState(false);
  const max = Math.max(...board.flat());

  const doMove = useCallback((dir: string) => {
    if (exploded) return;
    setBoard(prev => {
      const nb = move(prev, dir);
      if (JSON.stringify(nb) === JSON.stringify(prev)) { setHeat(h => { const nh = h + 1; if (nh >= 3) { setExploded(true); } return nh; }); return prev; }
      addTile(nb); setHeat(0);
      setScore(s => s + nb.flat().filter(x => x > max).reduce((a, v) => a + v, 0));
      return nb;
    });
  }, [exploded, max]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, string> = { ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" };
      if (map[e.key]) doMove(map[e.key]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doMove]);

  const reset = () => { setBoard(init2048()); setScore(0); setHeat(0); setExploded(false); };
  const colors: Record<number, string> = { 0: "bg-surface", 2: "bg-primary/20 text-primary", 4: "bg-primary/30 text-primary", 8: "bg-primary/40 text-bg", 16: "bg-ember/30 text-ember", 32: "bg-ember/40 text-bg", 64: "bg-ember/50 text-bg", 128: "bg-ember/60 text-bg", 256: "bg-ember/70 text-bg", 512: "bg-ember/80 text-bg" };

  return (
    <GameShell title="2048: Fusion Reactor" sidebar={<>
      <Stat label="Score" value={score} />
      <Stat label="Heat" value={`${heat}/3`} />
      <Stat label="Max tile" value={max} />
      {exploded && <Msg>💥 Reactor exploded! Max tile lost.</Msg>}
      <Msg>Arrows to slide. 3 stagnant moves → explosion!</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New game</Btn>
    </>}>
      <div className="mx-auto grid max-w-xs grid-cols-4 gap-1.5 rounded-lg border border-line bg-bg p-2">
        {board.flat().map((v, i) => (
          <div key={i} className={`flex aspect-square items-center justify-center rounded-md font-mono text-lg font-bold ${colors[v] ?? "bg-ember text-bg"}`}>
            {v || ""}
          </div>
        ))}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 27. Sudoku: Runes of Power ═══════════════ */

const S_SZ = 4;
type SBoard = (number | null)[][];
function initSudoku(): SBoard {
  const b: SBoard = Array.from({length: S_SZ}, () => Array(S_SZ).fill(null));
  const solution = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
  for (let r = 0; r < S_SZ; r++) for (let c = 0; c < S_SZ; c++) {
    if (Math.random() < 0.4) b[r][c] = solution[r][c];
  }
  return b;
}
function checkSudoku(b: SBoard): boolean {
  for (let r = 0; r < S_SZ; r++) {
    const row = b[r].filter(x => x !== null);
    if (new Set(row).size !== row.length || row.length !== S_SZ) return false;
  }
  for (let c = 0; c < S_SZ; c++) {
    const col = b.map(r => r[c]).filter(x => x !== null);
    if (new Set(col).size !== col.length || col.length !== S_SZ) return false;
  }
  return true;
}

export function SudokuRunes() {
  const [board, setBoard] = useState<SBoard>(initSudoku);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [mana, setMana] = useState(0);
  const [log, setLog] = useState("Fill the grid. Correct placements give mana.");
  const solved = checkSudoku(board);

  function place(n: number) {
    if (!sel) return;
    const [r, c] = sel;
    if (board[r][c] !== null) return;
    const nb = board.map(row => [...row]);
    nb[r][c] = n;
    setBoard(nb);
    const correct = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]][r][c] === n;
    if (correct) { setMana(m => m + 1); setLog("✨ Correct! +1 mana"); }
    else setLog("❌ Wrong placement");
  }
  function reveal() {
    if (mana < 2) return;
    setMana(m => m - 2);
    const sol = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
    for (let r = 0; r < S_SZ; r++) for (let c = 0; c < S_SZ; c++) {
      if (board[r][c] !== sol[r][c]) { const nb = board.map(row => [...row]); nb[r][c] = sol[r][c]; setBoard(nb); setLog("🔮 Reveal Fate!"); return; }
    }
  }
  function cleanse() {
    if (mana < 1) return;
    setMana(m => m - 1);
    const sol = [[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
    const nb = board.map(row => [...row]);
    for (let r = 0; r < S_SZ; r++) for (let c = 0; c < S_SZ; c++) {
      if (nb[r][c] !== null && nb[r][c] !== sol[r][c]) { nb[r][c] = null; setBoard(nb); setLog("🧹 Cleanse Error!"); return; }
    }
  }
  const reset = () => { setBoard(initSudoku()); setSel(null); setMana(0); setLog("Fill the grid. Correct placements give mana."); };

  return (
    <GameShell title="Sudoku: Runes of Power" sidebar={<>
      <Stat label="Mana" value={mana} />
      <Btn onClick={reveal} disabled={mana<2} className="w-full">🔮 Reveal Fate (2)</Btn>
      <Btn onClick={cleanse} disabled={mana<1} variant="ghost" className="w-full">🧹 Cleanse Error (1)</Btn>
      <Msg>{solved ? "🏆 Solved!" : log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New puzzle</Btn>
    </>}>
      <div className="mx-auto max-w-xs">
        <div className="grid grid-cols-4 gap-1">
          {board.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => setSel([r, c])}
              className={`aspect-square rounded-md border text-2xl font-bold ${
                sel?.[0]===r && sel?.[1]===c ? "border-primary" : "border-line"
              } ${cell !== null ? "bg-surface text-fg" : "bg-bg"}`}>
              {cell ?? ""}
            </button>
          )))}
        </div>
        <div className="mt-3 flex gap-2">
          {[1,2,3,4].map(n => (
            <button key={n} onClick={() => place(n)} className="flex-1 rounded-md border border-line bg-surface py-2 font-bold text-fg hover:bg-elevated">{n}</button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 28. Wordle: Cipher Hack ═══════════════ */

const WORDS5 = ["CYBER", "NEURAL", "PIXEL", "CODE", "LASER", "ORBIT", "RADAR", "GHOST", "PRISM", "CRYPT", "NEXUS", "FLUX"];
const W_LEN = 5;
function pick5(): string {
  const w = WORDS5.filter(x => x.length === W_LEN);
  return w[Math.floor(Math.random() * w.length)] || "CYBER";
}

export function WordleCipher() {
  const [word, setWord] = useState(pick5);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const [over, setOver] = useState(false);
  const [log, setLog] = useState("Guess the 5-letter cipher");
  const won = guesses.length > 0 && guesses[guesses.length-1] === word;

  function submit() {
    if (current.length !== W_LEN || over) return;
    setGuesses(g => [...g, current]);
    const wrong = current.split("").filter((c, i) => c !== word[i]).length;
    if (wrong > 0) {
      const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(k => !locked.has(k));
      const lock = keys[Math.floor(Math.random() * keys.length)];
      setLocked(s => new Set([...s, lock]));
      setLog(`🤖 Firewall locked key ${lock}!`);
    } else { setOver(true); setLog("🔓 Cipher cracked!"); return; }
    if (guesses.length + 1 >= 6) { setOver(true); setLog(`💀 Locked out! Word: ${word}`); }
    setCurrent("");
  }

  function type(letter: string) {
    if (current.length < W_LEN && !locked.has(letter)) setCurrent(c => c + letter);
  }
  function backspace() { setCurrent(c => c.slice(0, -1)); }
  const reset = () => { setWord(pick5()); setGuesses([]); setCurrent(""); setLocked(new Set()); setOver(false); setLog("Guess the 5-letter cipher"); };

  const getColor = (c: string, i: number, guess: string) => {
    if (word[i] === c) return "bg-primary/30 text-primary";
    if (word.includes(c)) return "bg-ember/20 text-ember";
    return "bg-surface text-muted";
  };

  return (
    <GameShell title="Wordle: Cipher Hack" sidebar={<>
      <Stat label="Tries" value={`${guesses.length}/6`} />
      <Stat label="Locked" value={locked.size} />
      <Msg>{won ? "🏆 Cracked!" : over ? log : log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New cipher</Btn>
    </>}>
      <div className="mx-auto flex max-w-xs flex-col gap-1.5">
        {Array.from({length: 6}).map((_, r) => (
          <div key={r} className="flex justify-center gap-1.5">
            {Array.from({length: W_LEN}).map((_, c) => {
              const guess = guesses[r];
              const ch = guess ? guess[c] : r === guesses.length ? current[c] : "";
              return (
                <div key={c} className={`flex size-12 items-center justify-center rounded-md border border-line font-mono text-lg font-bold ${
                  guess ? getColor(ch, c, guess) : "bg-surface"
                }`}>{ch}</div>
              );
            })}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-1">
        {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
          <button key={l} onClick={() => type(l)} onContextMenu={e => { e.preventDefault(); backspace(); }}
            disabled={locked.has(l) || over || won}
            className={`flex size-9 items-center justify-center rounded text-sm font-bold ${
              locked.has(l) ? "bg-bg text-muted opacity-30" : "border border-line bg-surface hover:bg-elevated"
            }`}>{locked.has(l) ? "🔒" : l}</button>
        ))}
        <button onClick={submit} disabled={current.length !== W_LEN || over} className="ml-2 rounded bg-primary px-4 text-sm font-bold text-bg disabled:opacity-40">Enter</button>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 29. Tower of Hanoi: Kinetic Weight ═══════════════ */

export function HanoiKinetic() {
  const [pegs, setPegs] = useState<number[][]>([[4, 3, 2, 1], [], []]);
  const [sel, setSel] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [tipped, setTipped] = useState(false);
  const [log, setLog] = useState("Move all disks to peg 3");
  const won = pegs[2].length === 4;
  const weightLimit = [4, 3, 6];

  function move(from: number, to: number) {
    if (from === to || tipped) return;
    const np = pegs.map(p => [...p]);
    const disk = np[from][np[from].length - 1];
    if (disk === undefined) return;
    const top = np[to][np[to].length - 1];
    if (top !== undefined && disk > top) { setLog("❌ Can't place larger on smaller"); return; }
    const weight = np[to].reduce((a, d) => a + d, 0) + disk;
    if (weight > weightLimit[to]) {
      setLog("💥 Column tipped! Disks scatter!");
      np[to] = [];
      const scattered = [disk, ...np[from].splice(np[from].length-1)];
      scattered.sort(() => Math.random() - 0.5);
      np[(to + 1) % 3].push(...scattered.filter((_, i) => i < 2));
      np[(to + 2) % 3].push(...scattered.filter((_, i) => i >= 2));
      np[to].sort((a, b) => b - a);
      setPegs(np); setTipped(true); setMoves(m => m + 1);
      setTimeout(() => setTipped(false), 1000);
      return;
    }
    np[from].pop(); np[to].push(disk);
    setPegs(np); setMoves(m => m + 1); setSel(null);
    setLog(np[2].length === 4 ? "🏆 Solved!" : "Good move");
  }

  const click = (peg: number) => {
    if (sel === null) { if (pegs[peg].length) setSel(peg); }
    else { move(sel, peg); }
  };
  const reset = () => { setPegs([[4, 3, 2, 1], [], []]); setSel(null); setMoves(0); setTipped(false); setLog("Move all disks to peg 3"); };

  return (
    <GameShell title="Tower of Hanoi: Kinetic Weight" sidebar={<>
      <Stat label="Moves" value={moves} />
      <Msg>{won ? "🏆 Solved!" : tipped ? "💥 Column tipped!" : log}</Msg>
      <Msg>Peg weight limits: [{weightLimit.join(", ")}]. Overload → tip!</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">Reset</Btn>
    </>}>
      <div className="flex justify-center gap-8 pt-8">
        {pegs.map((peg, i) => (
          <button key={i} onClick={() => click(i)}
            className={`relative flex h-48 w-32 flex-col-reverse items-center rounded-lg border ${sel === i ? "border-primary" : "border-line"} bg-surface p-2`}>
            <div className="absolute bottom-2 h-44 w-1.5 bg-line" />
            {peg.map((disk, j) => (
              <div key={j} className="relative z-10 mb-0.5 rounded-md"
                style={{ width: `${disk * 16}px`, height: 14 + "px", backgroundColor: ["#3ee0d0", "#4fc3f7", "#ff6a3d", "#ece7de"][disk - 1] }} />
            ))}
          </button>
        ))}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 30. Sliding Tile: Paradox Engine ═══════════════ */

const P_SZ = 3;
export function SlidingParadox() {
  const [tiles, setTiles] = useState<number[]>([1,2,3,4,5,6,7,8,0]);
  const [bgShift, setBgShift] = useState(0);
  const [moves, setMoves] = useState(0);
  const won = tiles.every((t, i) => i === P_SZ*P_SZ-1 ? t === 0 : t === i + 1);

  function shuffle() {
    let t = [...tiles];
    for (let i = 0; i < 100; i++) {
      const e = t.indexOf(0); const r = Math.floor(e/P_SZ), c = e%P_SZ;
      const dirs = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([nr,nc]) => nr>=0&&nr<P_SZ&&nc>=0&&nc<P_SZ);
      const [nr, nc] = dirs[Math.floor(Math.random()*dirs.length)];
      [t[e], t[nr*P_SZ+nc]] = [t[nr*P_SZ+nc], t[e]];
    }
    setTiles(t); setMoves(0);
  }

  function click(i: number) {
    const e = tiles.indexOf(0); const er = Math.floor(e/P_SZ), ec = e%P_SZ; const r = Math.floor(i/P_SZ), c = i%P_SZ;
    if (Math.abs(er-r)+Math.abs(ec-c) !== 1) return;
    const nt = [...tiles]; [nt[i], nt[e]] = [nt[e], nt[i]];
    setTiles(nt); setMoves(m => m + 1); setBgShift(s => s + 1);
  }

  useEffect(() => { shuffle(); }, []);

  return (
    <GameShell title="Sliding Tile: Paradox Engine" sidebar={<>
      <Stat label="Moves" value={moves} />
      <Stat label="Bg shift" value={bgShift} />
      <Msg>{won ? "🏆 Both layers aligned!" : "Match numbers AND circuit lines"}</Msg>
      <Btn onClick={shuffle} variant="ghost" className="w-full">Shuffle</Btn>
    </>}>
      <div className="relative mx-auto max-w-xs">
        {/* Background circuit pattern that shifts */}
        <div className="absolute inset-0 rounded-lg border border-line bg-surface opacity-30"
          style={{ background: `linear-gradient(${bgShift * 45}deg, transparent 48%, var(--color-primary) 49%, var(--color-primary) 51%, transparent 52%)` }} />
        <div className="relative grid grid-cols-3 gap-1 p-2">
          {tiles.map((t, i) => (
            <button key={i} onClick={() => click(i)} disabled={t === 0}
              className="flex aspect-square items-center justify-center rounded-md border border-line bg-surface font-display text-2xl font-bold text-fg hover:bg-elevated"
              style={{ transform: t ? `rotate(${(bgShift % 4) * 2}deg)` : "" }}>
              {t || ""}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
