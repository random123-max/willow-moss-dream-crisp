import { useState, useEffect, useCallback } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 36. Mastermind: Alchemical Breach ═══════════════ */

const ELEMENTS = ["🔥", "💧", "⚡", "🌿", "🌙"];
const CODE_LEN = 4;

export function MastermindAlchemy() {
  const [code, setCode] = useState<string[]>(() => Array.from({length: CODE_LEN}, () => ELEMENTS[Math.floor(Math.random()*ELEMENTS.length)]));
  const [guess, setGuess] = useState<string[]>([]);
  const [history, setHistory] = useState<{ guess: string[]; feedback: { type: string; pos: number }[] }[]>([]);
  const [won, setWon] = useState(false);
  const [log, setLog] = useState("Guess the 4-element alchemical code");

  function check() {
    if (guess.length !== CODE_LEN) return;
    const feedback: { type: string; pos: number }[] = [];
    const codeUsed = [false, false, false, false];
    const guessUsed = [false, false, false, false];
    guess.forEach((g, i) => {
      if (g === code[i]) { feedback.push({ type: "match", pos: i }); codeUsed[i] = true; guessUsed[i] = true; }
    });
    guess.forEach((g, i) => {
      if (!guessUsed[i]) {
        const idx = code.findIndex((c, j) => !codeUsed[j] && c === g);
        if (idx >= 0) {
          const reaction = getReaction(g, code[idx]);
          feedback.push({ type: reaction, pos: i });
          codeUsed[idx] = true; guessUsed[i] = true;
        }
      }
    });
    setHistory(h => [...h, { guess: [...guess], feedback }]);
    if (guess.every((g, i) => g === code[i])) { setWon(true); setLog("🏆 Code breached!"); }
    else setLog(`Feedback: ${feedback.map(f => f.type).join(", ")}`);
    setGuess([]);
  }

  function getReaction(a: string, b: string): string {
    if (a === b) return "steam";
    if ((a === "🔥" && b === "💧") || (a === "💧" && b === "🔥")) return "steam";
    if ((a === "⚡" && b === "💧") || (a === "💧" && b === "⚡")) return "spark";
    if ((a === "🔥" && b === "🌿") || (a === "🌿" && b === "🔥")) return "ember";
    if ((a === "🌙" && b === "⚡") || (a === "⚡" && b === "🌙")) return "void";
    return "hint";
  }

  const reset = () => {
    setCode(Array.from({length: CODE_LEN}, () => ELEMENTS[Math.floor(Math.random()*ELEMENTS.length)]));
    setGuess([]); setHistory([]); setWon(false); setLog("Guess the 4-element alchemical code");
  };

  return (
    <GameShell title="Mastermind: Alchemical Breach" sidebar={<>
      <Stat label="Tries" value={history.length} />
      <Msg>{won ? log : log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New code</Btn>
    </>}>
      <div className="flex flex-col gap-3">
        {history.map((h, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-2">
            <div className="flex gap-1 text-xl">{h.guess.map((g, j) => <span key={j}>{g}</span>)}</div>
            <div className="flex flex-wrap gap-1 text-xs">
              {h.feedback.map((f, j) => (
                <span key={j} className="rounded bg-bg px-1.5 py-0.5 text-muted">{f.type === "match" ? "✓" : f.type}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({length: CODE_LEN}).map((_, i) => (
              <div key={i} className="flex size-10 items-center justify-center rounded-md border border-line bg-surface text-xl">
                {guess[i] ?? "?"}
              </div>
            ))}
          </div>
          <Btn onClick={check} disabled={guess.length !== CODE_LEN || won}>Check</Btn>
        </div>
        <div className="flex gap-2">
          {ELEMENTS.map(e => (
            <button key={e} onClick={() => guess.length < CODE_LEN && !won && setGuess(g => [...g, e])}
              className="flex size-12 items-center justify-center rounded-lg border border-line bg-surface text-2xl hover:bg-elevated">
              {e}
            </button>
          ))}
          {guess.length > 0 && <button onClick={() => setGuess(g => g.slice(0, -1))} className="rounded-lg border border-line bg-surface px-3 text-sm text-muted">⌫</button>}
        </div>
        <p className="text-xs text-muted">✓ = exact match · steam/spark/ember/void = elemental reaction hint</p>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 37. Color Flood: Hex Dominion ═══════════════ */

const HEX_COLORS = ["#3ee0d0", "#ff6a3d", "#4fc3f7", "#ece7de", "#8d968e"];
const HEX_SZ = 7;
type HexCell = { color: number; terrain: "normal" | "mountain" | "river" };
function initHex(): HexCell[] {
  const cells: HexCell[] = [];
  for (let i = 0; i < HEX_SZ * HEX_SZ; i++) {
    const r = Math.random();
    cells.push({ color: Math.floor(Math.random() * HEX_COLORS.length), terrain: r < 0.08 ? "mountain" : r < 0.16 ? "river" : "normal" });
  }
  return cells;
}

export function ColorFloodHex() {
  const [cells, setCells] = useState<HexCell[]>(initHex);
  const [moves, setMoves] = useState(0);
  const maxMoves = 25;

  function flood(color: number) {
    const start = 0; const oldColor = cells[start].color;
    if (color === oldColor) return;
    const visited = new Set<number>();
    const queue = [start];
    while (queue.length) {
      const i = queue.pop()!;
      if (visited.has(i)) continue;
      visited.add(i);
      if (cells[i].color !== oldColor) continue;
      const nb = cells[i];
      if (nb.terrain === "mountain" && i !== start) continue;
      setCells(prev => { const np = [...prev]; np[i] = { ...np[i], color }; return np; });
      const r = Math.floor(i / HEX_SZ), c = i % HEX_SZ;
      [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr, nc]) => {
        if (nr >= 0 && nr < HEX_SZ && nc >= 0 && nc < HEX_SZ) {
          const ni = nr * HEX_SZ + nc;
          if (!visited.has(ni) && cells[ni].color === oldColor && cells[ni].terrain !== "mountain") queue.push(ni);
        }
      });
    }
    setMoves(m => m + 1);
  }

  // Apply flood synchronously
  const doFlood = (color: number) => {
    const oldColor = cells[0].color;
    if (color === oldColor) return;
    const np = [...cells];
    const visited = new Set<number>();
    const queue = [0];
    while (queue.length) {
      const i = queue.pop()!;
      if (visited.has(i)) continue;
      visited.add(i);
      if (np[i].color !== oldColor) continue;
      if (np[i].terrain === "mountain" && i !== 0) continue;
      np[i] = { ...np[i], color };
      if (np[i].terrain === "river") {
        const r = Math.floor(i / HEX_SZ), c = i % HEX_SZ;
        [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc]) => {
          if (nr>=0 && nr<HEX_SZ && nc>=0 && nc<HEX_SZ) {
            const ni = nr*HEX_SZ+nc;
            if (np[ni].color === oldColor) np[ni] = { ...np[ni], color };
          }
        });
      }
      const r = Math.floor(i / HEX_SZ), c = i % HEX_SZ;
      [[r-1,c],[r+1,c],[r,c-1],[r,c+1]].forEach(([nr,nc]) => {
        if (nr>=0 && nr<HEX_SZ && nc>=0 && nc<HEX_SZ) {
          const ni = nr*HEX_SZ+nc;
          if (!visited.has(ni) && np[ni].color === oldColor && np[ni].terrain !== "mountain") queue.push(ni);
        }
      });
    }
    setCells(np); setMoves(m => m + 1);
  };

  const won = cells.every(c => c.color === cells[0].color);
  const reset = () => { setCells(initHex()); setMoves(0); };

  return (
    <GameShell title="Color Flood: Hex Dominion" sidebar={<>
      <Stat label="Moves" value={`${moves}/${maxMoves}`} />
      <Msg>{won ? "🏆 Flooded!" : moves >= maxMoves ? "Out of moves!" : "Mountains block, rivers accelerate flow."}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New board</Btn>
    </>}>
      <div className="mx-auto grid max-w-sm gap-0.5 rounded-lg border border-line bg-bg p-2" style={{gridTemplateColumns: `repeat(${HEX_SZ}, 1fr)`}}>
        {cells.map((c, i) => (
          <div key={i} className="aspect-square rounded-sm flex items-center justify-center text-[8px]"
            style={{ backgroundColor: HEX_COLORS[c.color] }}>
            {c.terrain === "mountain" ? "⛰" : c.terrain === "river" ? "~" : ""}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-2">
        {HEX_COLORS.map((color, i) => (
          <button key={i} onClick={() => doFlood(i)} disabled={won || moves >= maxMoves}
            className="size-10 rounded-lg border-2 border-line hover:scale-110 transition-transform disabled:opacity-40"
            style={{ backgroundColor: color }} />
        ))}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 38. Math 24: Spellweaver ═══════════════ */

function genNumbers(): number[] {
  return Array.from({length: 4}, () => 1 + Math.floor(Math.random() * 9));
}
function canMake24(nums: number[]): boolean {
  if (nums.length === 1) return nums[0] === 24;
  for (let i = 0; i < nums.length; i++) for (let j = 0; j < nums.length; j++) {
    if (i === j) continue;
    const rest = nums.filter((_, k) => k !== i && k !== j);
    for (const op of ["+","-","*","/"]) {
      let r = 0;
      if (op === "+") r = nums[i] + nums[j];
      else if (op === "-") r = nums[i] - nums[j];
      else if (op === "*") r = nums[i] * nums[j];
      else if (nums[j] !== 0) r = nums[i] / nums[j];
      else continue;
      if (canMake24([...rest, r])) return true;
    }
  }
  return false;
}

export function Math24Spell() {
  const [nums, setNums] = useState<number[]>(() => { let n; do { n = genNumbers(); } while (!canMake24(n)); return n; });
  const [expr, setExpr] = useState("");
  const [combo, setCombo] = useState(0);
  const [monsterHp, setMonsterHp] = useState(100);
  const [log, setLog] = useState("Combine numbers to make 24 and attack!");
  const [used, setUsed] = useState<Set<number>>(new Set());

  function submit() {
    try {
      const result = eval(expr);
      if (Math.abs(result - 24) < 0.01) {
        const dmg = 20 + combo * 5;
        setMonsterHp(h => Math.max(0, h - dmg));
        setCombo(c => c + 1);
        setLog(`✨ ${dmg} damage! Combo: ${combo + 1}`);
        if (monsterHp - dmg <= 0) { setLog("🏆 Monster defeated!"); return; }
        const nn = genNumbers(); setNums(nn); setExpr(""); setUsed(new Set());
      } else setLog(`❌ = ${result}, not 24`);
    } catch { setLog("❌ Invalid expression"); }
  }

  function addNum(n: number, idx: number) {
    setExpr(e => e + n);
    setUsed(s => new Set([...s, idx]));
  }

  const reset = () => { const nn = genNumbers(); setNums(nn); setExpr(""); setCombo(0); setMonsterHp(100); setUsed(new Set()); setLog("Combine numbers to make 24 and attack!"); };

  return (
    <GameShell title="Math 24: Spellweaver" sidebar={<>
      <Stat label="Monster HP" value={monsterHp} />
      <Stat label="Combo" value={combo} />
      <Msg>{log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New battle</Btn>
    </>}>
      <div className="flex flex-col items-center gap-4">
        <div className="text-6xl">👹</div>
        <div className="flex gap-2">
          {nums.map((n, i) => (
            <button key={i} onClick={() => addNum(n, i)} disabled={used.has(i)}
              className="flex size-14 items-center justify-center rounded-lg border border-line bg-surface text-2xl font-bold text-fg hover:bg-elevated disabled:opacity-30">
              {n}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-1">
          {["+","-","*","/","(",")"].map(op => (
            <button key={op} onClick={() => setExpr(e => e + op)}
              className="flex size-10 items-center justify-center rounded-md border border-line bg-surface text-lg font-bold text-fg hover:bg-elevated">
              {op}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <code className="rounded-md border border-line bg-bg px-3 py-2 font-mono text-lg text-primary">{expr || "?"}</code>
          <button onClick={() => setExpr("")} className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted">Clear</button>
        </div>
        <Btn onClick={submit} disabled={!expr}>Cast spell (= 24)</Btn>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 39. Logic Cube: Ink Trails ═══════════════ */

const LC_SZ = 4;
type CubeState = { x: number; y: number; face: number };
const GOAL = [[1,0,0,1],[0,1,1,0],[0,1,1,0],[1,0,0,1]];
const PAINT: Record<number, string> = { 0: "A", 1: "B", 2: "C", 3: "D" };

export function LogicCube() {
  const [cube, setCube] = useState<CubeState>({ x: 0, y: 0, face: 0 });
  const [trail, setTrail] = useState<number[][]>(Array.from({length: LC_SZ}, () => Array(LC_SZ).fill(-1)));
  const [moves, setMoves] = useState(0);
  const [log, setLog] = useState("Roll the cube to paint tiles matching the goal");

  useEffect(() => {
    const nt = trail.map(r => [...r]); nt[0][0] = 0; setTrail(nt);
  }, []);

  function roll(dir: "up" | "down" | "left" | "right") {
    const nc = { ...cube };
    if (dir === "up" && cube.y > 0) nc.y--;
    else if (dir === "down" && cube.y < LC_SZ-1) nc.y++;
    else if (dir === "left" && cube.x > 0) nc.x--;
    else if (dir === "right" && cube.x < LC_SZ-1) nc.x++;
    else return;
    // Rolling changes the face
    const faceMap: Record<string, number> = { up: (cube.face + 1) % 4, down: (cube.face + 3) % 4, left: (cube.face + 2) % 4, right: (cube.face + 2) % 4 };
    nc.face = faceMap[dir];
    setCube(nc);
    const nt = trail.map(r => [...r]); nt[nc.y][nc.x] = nc.face; setTrail(nt);
    setMoves(m => m + 1);
    const correct = nt.every((row, r) => row.every((v, c) => GOAL[r][c] === (v >= 0 ? v % 2 : 0)));
    if (correct) setLog("🏆 Pattern matched!");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") roll("up");
      else if (e.key === "ArrowDown") roll("down");
      else if (e.key === "ArrowLeft") roll("left");
      else if (e.key === "ArrowRight") roll("right");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cube, trail]);

  const reset = () => { setCube({x:0,y:0,face:0}); setTrail(Array.from({length: LC_SZ}, () => Array(LC_SZ).fill(-1))); setMoves(0); setLog("Roll the cube to paint tiles matching the goal"); };

  return (
    <GameShell title="Logic Cube: Ink Trails" sidebar={<>
      <Stat label="Moves" value={moves} />
      <Msg>{log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">Reset</Btn>
    </>}>
      <div className="flex flex-col items-center gap-4">
        <div className="text-xs text-muted">Goal pattern (1=paint, 0=blank):</div>
        <div className="grid gap-0.5" style={{gridTemplateColumns: `repeat(${LC_SZ}, 1fr)`}}>
          {GOAL.flat().map((v, i) => (
            <div key={i} className="size-8 rounded-sm border border-line" style={{backgroundColor: v ? "rgba(62,224,208,0.2)" : "transparent"}} />
          ))}
        </div>
        <div className="grid gap-0.5 rounded-lg border border-line bg-bg p-1" style={{gridTemplateColumns: `repeat(${LC_SZ}, 1fr)`}}>
          {trail.flat().map((v, i) => {
            const r = Math.floor(i / LC_SZ), c = i % LC_SZ;
            const isCube = cube.x === c && cube.y === r;
            return (
              <div key={i} className={`flex size-10 items-center justify-center rounded-sm border text-sm font-bold ${
                isCube ? "border-primary bg-primary/20" : v >= 0 ? "border-line bg-surface" : "border-line"
              }`}>
                {isCube ? `🎲${PAINT[cube.face]}` : v >= 0 ? PAINT[v] : ""}
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => roll("up")} variant="ghost">↑</Btn>
          <Btn onClick={() => roll("left")} variant="ghost">←</Btn>
          <Btn onClick={() => roll("down")} variant="ghost">↓</Btn>
          <Btn onClick={() => roll("right")} variant="ghost">→</Btn>
        </div>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 40. Echo Shadow ═══════════════ */

export function EchoShadow() {
  const [px, setPx] = useState(2);
  const [sx, setSx] = useState(2);
  const [switches, setSwitches] = useState([false, false]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [log, setLog] = useState("You and your shadow must hit both switches");

  function move(dir: number) {
    if (won) return;
    const npx = Math.max(0, Math.min(4, px + dir));
    const nsx = Math.max(0, Math.min(4, sx - dir)); // shadow moves in reverse
    setPx(npx); setSx(nsx); setMoves(m => m + 1);
    const sw = [false, false];
    if (npx === 0) sw[0] = true;
    if (nsx === 4) sw[1] = true;
    setSwitches(sw);
    if (sw[0] && sw[1]) { setWon(true); setLog("🏆 Both switches activated!"); }
    else setLog(sw[0] ? "You hit switch A!" : sw[1] ? "Shadow hit switch B!" : "Keep moving");
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") move(-1);
      else if (e.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [px, sx, won]);

  const reset = () => { setPx(2); setSx(2); setSwitches([false, false]); setMoves(0); setWon(false); setLog("You and your shadow must hit both switches"); };

  return (
    <GameShell title="Echo Shadow" sidebar={<>
      <Stat label="Moves" value={moves} />
      <Msg>{log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">Reset</Btn>
    </>}>
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-md">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">You (←→ move)</p>
          <div className="flex h-16 items-center gap-1 rounded-lg border border-line bg-surface p-1">
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} className={`flex flex-1 items-center justify-center rounded-md ${i === 0 ? "border border-primary/40" : ""}`}>
                {i === 0 && !switches[0] ? "🔴" : i === 0 && switches[0] ? "🟢" : i === px ? "🙂" : ""}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-md">
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Shadow (moves in reverse)</p>
          <div className="flex h-16 items-center gap-1 rounded-lg border border-line bg-surface p-1 opacity-60">
            {Array.from({length: 5}).map((_, i) => (
              <div key={i} className={`flex flex-1 items-center justify-center rounded-md ${i === 4 ? "border border-ember/40" : ""}`}>
                {i === 4 && !switches[1] ? "🔴" : i === 4 && switches[1] ? "🟢" : i === sx ? "👤" : ""}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Btn onClick={() => move(-1)} variant="ghost">←</Btn>
          <Btn onClick={() => move(1)} variant="ghost">→</Btn>
        </div>
        <p className="text-xs text-muted">You move right → shadow moves left. Hit both switches simultaneously.</p>
      </div>
    </GameShell>
  );
}
