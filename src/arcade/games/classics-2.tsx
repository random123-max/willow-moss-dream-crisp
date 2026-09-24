import { useState, useEffect, useCallback, useRef } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 6. Cyberpunk Hangman ═══════════════ */

const WORDS = ["NEON","CYBER","MATRIX","FIREWALL","QUANTUM","GLITCH","PROTOCOL","ENCRYPT","HACKER","DIGITAL"];
function scramble(s: string): string {
  return s.split("").map(c => Math.random() < 0.5 ? String.fromCharCode(c.charCodeAt(0) + (Math.random()<0.5?1:-1)) : c).join("");
}

export function CyberHangman() {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const [lockedKeys, setLockedKeys] = useState<Set<string>>(new Set());
  const [scrambled, setScrambled] = useState(false);
  const maxWrong = 6;
  const won = word.split("").every(c => guessed.has(c));
  const lost = wrong >= maxWrong;

  function guess(letter: string) {
    if (guessed.has(letter) || lockedKeys.has(letter) || won || lost) return;
    setGuessed(g => new Set([...g, letter]));
    if (!word.includes(letter)) {
      const nw = wrong + 1;
      setWrong(nw);
      if (nw % 2 === 0) {
        const keys = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        const lock = keys[Math.floor(Math.random()*keys.length)];
        setLockedKeys(s => new Set([...s, lock]));
        setLog(`🤖 Security drone locked key ${lock}!`);
      } else {
        setScrambled(true);
        setLog("🤖 UI scrambling…");
        setTimeout(() => setScrambled(false), 1500);
      }
    } else {
      setLog("✅ Correct!");
    }
  }
  const [log, setLog] = useState("Guess the firewall code");
  const reset = () => { setWord(WORDS[Math.floor(Math.random()*WORDS.length)]); setGuessed(new Set()); setWrong(0); setLockedKeys(new Set()); setScrambled(false); setLog("Guess the firewall code"); };

  return (
    <GameShell title="Cyberpunk Hangman" sidebar={<>
      <Stat label="Wrong" value={`${wrong}/${maxWrong}`} />
      <Msg>{won ? "🔓 Firewall breached!" : lost ? "💀 Hacked back!" : log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New word</Btn>
    </>}>
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-1.5">
          {word.split("").map((c, i) => (
            <span key={i} className={`flex size-10 items-center justify-center rounded border-b-2 border-primary/40 font-mono text-xl font-bold ${
              guessed.has(c) || lost ? "text-primary" : "text-transparent"
            }`}>
              {guessed.has(c) || lost ? (scrambled && Math.random() < 0.3 ? scramble(c) : c) : "_"}
            </span>
          ))}
        </div>
        <div className="grid max-w-md grid-cols-7 gap-1.5">
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => (
            <button key={l} onClick={() => guess(l)}
              disabled={guessed.has(l) || lockedKeys.has(l) || won || lost}
              className={`flex size-10 items-center justify-center rounded-md text-sm font-bold transition-all ${
                lockedKeys.has(l) ? "bg-bg text-muted opacity-30" :
                guessed.has(l) ? (word.includes(l) ? "bg-primary/20 text-primary" : "bg-ember/20 text-ember") :
                "border border-line bg-surface hover:bg-elevated"
              }`}>
              {lockedKeys.has(l) ? "🔒" : scrambled && Math.random()<0.2 ? scramble(l) : l}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 7. Dots & Boxes: Territory Wars ═══════════════ */

const DOTS = 5; // 5×5 dots → 4×4 boxes
type Lines = { h: boolean[][]; v: boolean[][] }; // h[r][c] = horizontal line at row r between cols c and c+1

export function DotsBoxes() {
  const [hLines, setHLines] = useState<boolean[][]>(Array.from({length: DOTS}, () => Array(DOTS-1).fill(false)));
  const [vLines, setVLines] = useState<boolean[][]>(Array.from({length: DOTS-1}, () => Array(DOTS).fill(false)));
  const [boxes, setBoxes] = useState<(string|null)[][]>(Array.from({length: DOTS-1}, () => Array(DOTS-1).fill(null)));
  const [turn, setTurn] = useState<"P"|"A">("P");
  const [res, setRes] = useState(0);
  const [score, setScore] = useState({p:0, a:0});

  function checkBox(bh: boolean[][], bv: boolean[][], r: number, c: number, who: string): (string|null)[][] {
    const nb = boxes.map(row => [...row]);
    if (bh[r][c] && bh[r+1][c] && bv[r][c] && bv[r][c+1] && !nb[r][c]) {
      nb[r][c] = who;
      if (who === "P") setRes(r => r + 1);
      if (who === "P") setScore(s => ({...s, p: s.p+1})); else setScore(s => ({...s, a: s.a+1}));
    }
    return nb;
  }

  function drawH(r: number, c: number, who: string = "P") {
    if (hLines[r][c]) return;
    const nh = hLines.map(row => [...row]); nh[r][c] = true;
    setHLines(nh);
    let nb = boxes;
    if (r > 0) nb = checkBox(nh, vLines, r-1, c, who);
    if (r < DOTS-1) nb = checkBox(nh, vLines, r, c, who);
    setBoxes(nb);
    setTurn(who === "P" ? "A" : "P");
  }
  function drawV(r: number, c: number, who: string = "P") {
    if (vLines[r][c]) return;
    const nv = vLines.map(row => [...row]); nv[r][c] = true;
    setVLines(nv);
    let nb = boxes;
    if (c > 0) nb = checkBox(hLines, nv, r, c-1, who);
    if (c < DOTS-1) nb = checkBox(hLines, nv, r, c, who);
    setBoxes(nb);
    setTurn(who === "P" ? "A" : "P");
  }

  useEffect(() => {
    if (turn !== "A") return;
    const t = setTimeout(() => {
      const opts: {type:"h"|"v",r:number,c:number}[] = [];
      for (let r=0;r<DOTS;r++) for(let c=0;c<DOTS-1;c++) if(!hLines[r][c]) opts.push({type:"h",r,c});
      for (let r=0;r<DOTS-1;r++) for(let c=0;c<DOTS;c++) if(!vLines[r][c]) opts.push({type:"v",r,c});
      if (!opts.length) return;
      const pick = opts[Math.floor(Math.random()*opts.length)];
      if (pick.type === "h") drawH(pick.r, pick.c, "A"); else drawV(pick.r, pick.c, "A");
    }, 600);
    return () => clearTimeout(t);
  }, [turn]);

  const cellSize = 56;
  return (
    <GameShell title="Dots & Boxes: Territory Wars" sidebar={<>
      <Stat label="You" value={score.p} />
      <Stat label="AI" value={score.a} />
      <Stat label="Resources" value={res} />
      <Btn disabled={res<3} onClick={() => { setRes(r=>r-3); }} className="w-full">Buy Double Line (3 res)</Btn>
      <Btn onClick={() => setBoxes(Array.from({length:DOTS-1},()=>Array(DOTS-1).fill(null)))} variant="ghost" className="w-full">Reset</Btn>
    </>}>
      <div className="mx-auto" style={{width: cellSize*(DOTS-1)+1}}>
        <svg width={cellSize*(DOTS-1)+1} height={cellSize*(DOTS-1)+1} className="rounded-lg border border-line bg-surface">
          {Array.from({length: DOTS-1}).flatMap((_,r) => Array.from({length: DOTS-1}).map((_,c) => (
            <rect key={`b${r}-${c}`} x={c*cellSize+1} y={r*cellSize+1} width={cellSize-1} height={cellSize-1}
              fill={boxes[r][c]==="P"?"rgba(62,224,208,0.2)":boxes[r][c]==="A"?"rgba(255,106,61,0.2)":"transparent"} />
          )))}
          {hLines.map((row,r) => row.map((on,c) => (
            <line key={`h${r}-${c}`} x1={c*cellSize} y1={r*cellSize} x2={(c+1)*cellSize} y2={r*cellSize}
              stroke={on?"var(--color-primary)":"var(--color-line)"} strokeWidth={on?3:1}
              className="cursor-pointer" onClick={() => on||turn!=="P"||drawH(r,c)} />
          )))}
          {vLines.map((row,r) => row.map((on,c) => (
            <line key={`v${r}-${c}`} x1={c*cellSize} y1={r*cellSize} x2={c*cellSize} y2={(r+1)*cellSize}
              stroke={on?"var(--color-primary)":"var(--color-line)"} strokeWidth={on?3:1}
              className="cursor-pointer" onClick={() => on||turn!=="P"||drawV(r,c)} />
          )))}
          {Array.from({length: DOTS}).flatMap((_,r) => Array.from({length: DOTS}).map((_,c) => (
            <circle key={`d${r}-${c}`} cx={c*cellSize} cy={r*cellSize} r={3} fill="var(--color-fg)" />
          )))}
        </svg>
        <p className="mt-2 text-center text-sm text-muted">{turn==="P"?"Click a line to draw":"AI turn…"}</p>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 8. Reversi: Nexus Dominion ═══════════════ */

const R_SZ = 8;
type Disc = "B" | "W" | null;
const DIRS = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

function initReversi(): { board: Disc[]; rifts: boolean[] } {
  const b: Disc[] = Array(R_SZ*R_SZ).fill(null);
  b[27]="W"; b[28]="B"; b[35]="B"; b[36]="W";
  const rifts = Array(R_SZ*R_SZ).fill(false);
  const rp = [10, 25, 38, 53];
  rp.forEach(i => rifts[i] = true);
  return { board: b, rifts };
}
function validMoves(board: Disc[], player: Disc, rifts: boolean[]): number[] {
  const opp = player === "B" ? "W" : "B";
  const moves: number[] = [];
  for (let i = 0; i < R_SZ*R_SZ; i++) {
    if (board[i] || rifts[i]) continue;
    const r = Math.floor(i/R_SZ), c = i%R_SZ;
    for (const [dr, dc] of DIRS) {
      let nr = r+dr, nc = c+dc, found = false;
      const flip: number[] = [];
      while (nr>=0 && nr<R_SZ && nc>=0 && nc<R_SZ) {
        const ni = nr*R_SZ+nc;
        if (rifts[ni]) break;
        if (board[ni] === opp) { flip.push(ni); nr+=dr; nc+=dc; }
        else if (board[ni] === player && flip.length) { found = true; break; }
        else break;
      }
      if (found) { moves.push(i); break; }
    }
  }
  return moves;
}
function applyMove(board: Disc[], idx: number, player: Disc, rifts: boolean[]): Disc[] {
  const nb = [...board]; nb[idx] = player;
  const opp = player === "B" ? "W" : "B";
  const r = Math.floor(idx/R_SZ), c = idx%R_SZ;
  for (const [dr, dc] of DIRS) {
    let nr = r+dr, nc = c+dc;
    const flip: number[] = [];
    while (nr>=0 && nr<R_SZ && nc>=0 && nc<R_SZ) {
      const ni = nr*R_SZ+nc;
      if (rifts[ni]) break;
      if (nb[ni] === opp) { flip.push(ni); nr+=dr; nc+=dc; }
      else if (nb[ni] === player) { flip.forEach(f => nb[f] = player); break; }
      else break;
    }
  }
  return nb;
}

export function ReversiNexus() {
  const [{ board, rifts }, setState] = useState(initReversi);
  const [turn, setTurn] = useState<"B"|"W">("B");
  const valid = validMoves(board, turn, rifts);
  const bCount = board.filter(d => d === "B").length;
  const wCount = board.filter(d => d === "W").length;

  function play(i: number) {
    if (turn !== "B" || !valid.includes(i)) return;
    const nb = applyMove(board, i, "B", rifts);
    setState({ board: nb, rifts });
    setTurn("W");
  }
  useEffect(() => {
    if (turn !== "W") return;
    const moves = validMoves(board, "W", rifts);
    if (!moves.length) { setTurn("B"); return; }
    const t = setTimeout(() => {
      const pick = moves[Math.floor(Math.random()*moves.length)];
      const nb = applyMove(board, pick, "W", rifts);
      setState({ board: nb, rifts });
      setTurn("B");
    }, 600);
    return () => clearTimeout(t);
  }, [turn, board, rifts]);

  const reset = () => { setState(initReversi()); setTurn("B"); };
  const noMoves = valid.length === 0 && turn === "B";

  return (
    <GameShell title="Reversi: Nexus Dominion" sidebar={<>
      <Stat label="You (B)" value={bCount} />
      <Stat label="AI (W)" value={wCount} />
      <Msg>{noMoves ? "No moves — pass" : "Void rifts destroy pieces flipped over them"}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New game</Btn>
    </>}>
      <div className="mx-auto max-w-md rounded-lg border border-line bg-surface p-1.5">
        <div className="grid gap-0.5" style={{gridTemplateColumns:`repeat(${R_SZ},1fr)`}}>
          {board.map((cell, i) => (
            <button key={i} onClick={() => play(i)}
              className={`aspect-square rounded-sm flex items-center justify-center text-lg ${
                rifts[i] ? "bg-ember/20" : valid.includes(i) && turn==="B" ? "bg-primary/10 hover:bg-primary/20" : "bg-bg"
              }`}>
              {cell === "B" && <span className="block size-4/5 rounded-full bg-primary" />}
              {cell === "W" && <span className="block size-4/5 rounded-full bg-dust" />}
              {rifts[i] && <span className="text-ember text-xs">✕</span>}
              {valid.includes(i) && turn === "B" && !cell && <span className="block size-3 rounded-full border border-primary/40" />}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 9. Minesweeper: Toxic Undergrowth ═══════════════ */

const M_SZ = 10, M_MINES = 12;
type MCell = { mine: boolean; revealed: boolean; flag: boolean; adj: number; miasma: number };

function initMine(): MCell[] {
  const b: MCell[] = Array(M_SZ*M_SZ).fill(null).map(() => ({ mine: false, revealed: false, flag: false, adj: 0, miasma: 0 }));
  let placed = 0;
  while (placed < M_MINES) {
    const i = Math.floor(Math.random()*M_SZ*M_SZ);
    if (!b[i].mine) { b[i].mine = true; placed++; }
  }
  for (let i = 0; i < M_SZ*M_SZ; i++) {
    if (b[i].mine) continue;
    const r = Math.floor(i/M_SZ), c = i%M_SZ;
    let cnt = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r+dr, nc = c+dc;
      if (nr>=0 && nr<M_SZ && nc>=0 && nc<M_SZ && b[nr*M_SZ+nc].mine) cnt++;
    }
    b[i].adj = cnt;
  }
  return b;
}

export function MineToxic() {
  const [cells, setCells] = useState<MCell[]>(initMine);
  const [dead, setDead] = useState(false);
  const [radar, setRadar] = useState(0);
  const [tick, setTick] = useState(0);

  useMiasmaTick(cells, setCells, tick, setTick);

  function reveal(i: number) {
    if (dead || cells[i].flag) return;
    const nb = cells.map(c => ({...c}));
    if (nb[i].mine) { nb.forEach(c => { if (c.mine) c.revealed = true; }); setDead(true); return; }
    const queue = [i];
    while (queue.length) {
      const idx = queue.pop()!;
      if (nb[idx].revealed || nb[idx].mine) continue;
      nb[idx].revealed = true; nb[idx].miasma = 0;
      if (nb[idx].adj === 0) {
        const r = Math.floor(idx/M_SZ), c = idx%M_SZ;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const nr = r+dr, nc = c+dc;
          if (nr>=0 && nr<M_SZ && nc>=0 && nc<M_SZ) {
            const ni = nr*M_SZ+nc;
            if (!nb[ni].revealed && !nb[ni].mine) queue.push(ni);
          }
        }
      }
    }
    setRadar(r => r + 1);
    setCells(nb);
  }
  function flag(i: number) {
    if (dead || cells[i].revealed) return;
    const nb = cells.map(c => ({...c})); nb[i].flag = !nb[i].flag; setCells(nb);
  }
  function scan() {
    if (radar < 3) return;
    setRadar(r => r - 3);
    const nb = cells.map(c => ({...c}));
    nb.forEach(c => { if (!c.revealed && !c.mine && c.miasma > 0) c.miasma = 0; });
    setCells(nb);
  }
  const won = cells.filter(c => !c.mine).every(c => c.revealed);
  const reset = () => { setCells(initMine()); setDead(false); setRadar(0); setTick(0); };

  return (
    <GameShell title="Minesweeper: Toxic Undergrowth" sidebar={<>
      <Stat label="Radar charges" value={radar} />
      <Btn onClick={scan} disabled={radar<3} className="w-full">Radar scan (3 charges)</Btn>
      <Msg>{dead ? "💥 Boom!" : won ? "Cleared!" : "Safe clicks charge radar. Miasma hides numbers."}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New field</Btn>
    </>}>
      <div className="mx-auto max-w-md rounded-lg border border-line bg-surface p-1">
        <div className="grid gap-px" style={{gridTemplateColumns:`repeat(${M_SZ},1fr)`}}>
          {cells.map((c, i) => (
            <button key={i} onClick={() => reveal(i)} onContextMenu={e => { e.preventDefault(); flag(i); }}
              className={`flex aspect-square items-center justify-center text-xs font-bold ${
                c.revealed ? (c.mine ? "bg-ember text-bg" : c.miasma > 0 ? "bg-purple-900/40 text-muted" : "bg-bg") : "bg-elevated hover:bg-surface"
              }`}>
              {c.revealed ? (c.mine ? "💥" : c.adj || "") : c.flag ? "🚩" : ""}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 text-center text-xs text-muted">Left-click reveal · Right-click flag</p>
    </GameShell>
  );
}

function useMiasmaTick(cells: MCell[], setCells: React.Dispatch<React.SetStateAction<MCell[]>>, tick: number, setTick: React.Dispatch<React.SetStateAction<number>>) {
  useEffect(() => {
    const id = setInterval(() => {
      setCells(prev => {
        const nb = prev.map(c => ({...c}));
        let changed = false;
        nb.forEach((c, i) => {
          if (!c.revealed && !c.mine && !c.flag) {
            const r = Math.floor(i/M_SZ), col = i%M_SZ;
            let spread = false;
            for (let dr = -1; dr <= 1 && !spread; dr++) for (let dc = -1; dc <= 1; dc++) {
              const nr = r+dr, nc = col+dc;
              if (nr>=0 && nr<M_SZ && nc>=0 && nc<M_SZ) {
                const ni = nr*M_SZ+nc;
                if (nb[ni].miasma > 0) spread = true;
              }
            }
            if (spread || (Math.random() < 0.05)) { c.miasma = Math.min(3, c.miasma + 1); changed = true; }
          }
        });
        return changed ? nb : prev;
      });
      setTick(t => t + 1);
    }, 3000);
    return () => clearInterval(id);
  }, []);
}

/* ═══════════════ 10. Battleship: Fog of War ═══════════════ */

const BS_SZ = 8;
type Ship = { size: number; hits: number; cells: number[] };
function initFleet(): Ship[] {
  return [
    { size: 4, hits: 0, cells: [] },
    { size: 3, hits: 0, cells: [] },
    { size: 3, hits: 0, cells: [] },
    { size: 2, hits: 0, cells: [] },
  ];
}
function placeFleet(): { ships: Ship[]; grid: number[] } {
  const grid = Array(BS_SZ*BS_SZ).fill(-1);
  const ships = initFleet();
  ships.forEach((ship, si) => {
    let placed = false;
    while (!placed) {
      const horiz = Math.random() < 0.5;
      const r = Math.floor(Math.random()*BS_SZ), c = Math.floor(Math.random()*BS_SZ);
      const cells: number[] = [];
      let ok = true;
      for (let i = 0; i < ship.size; i++) {
        const nr = horiz ? r : r+i, nc = horiz ? c+i : c;
        if (nr >= BS_SZ || nc >= BS_SZ || grid[nr*BS_SZ+nc] >= 0) { ok = false; break; }
        cells.push(nr*BS_SZ+nc);
      }
      if (ok) { cells.forEach(ci => grid[ci] = si); ship.cells = cells; placed = true; }
    }
  });
  return { ships, grid };
}

export function BattleshipFog() {
  const [{ ships, grid }, setState] = useState(placeFleet);
  const [shots, setShots] = useState<Set<number>>(new Set());
  const [sonar, setSonar] = useState(3);
  const [airstrike, setAirstrike] = useState(0);
  const [cooldown, setCooldown] = useState(0);
  const [repair, setRepair] = useState(2);
  const [log, setLog] = useState("Find and sink the AI fleet");
  const sunk = ships.filter(s => s.hits >= s.size).length;
  const won = sunk === ships.length;
  const hpLost = ships.reduce((a, s) => a + Math.min(s.hits, s.size), 0);
  const [playerHp, setPlayerHp] = useState(12);

  function fire(i: number) {
    if (won || shots.has(i)) return;
    const ns = new Set([...shots, i]); setShots(ns);
    if (grid[i] >= 0) {
      const si = grid[i];
      const ship = ships[si]; ship.hits++;
      setLog(ship.hits >= ship.size ? "💥 Ship sunk!" : "🎯 Hit!");
      setSonar(s => Math.min(5, s+1));
    } else {
      setLog("💧 Miss");
      if (Math.random() < 0.3) { setPlayerHp(h => Math.max(0, h-1)); setLog("💧 Miss — enemy returns fire! -1 HP"); }
    }
    if (cooldown > 0) setCooldown(c => c-1);
  }
  function ping() {
    if (sonar < 1) return;
    setSonar(s => s-1);
    const reveals: number[] = [];
    for (let i = 0; i < BS_SZ*BS_SZ; i++) {
      if (grid[i] >= 0 && !shots.has(i) && Math.random() < 0.4) reveals.push(i);
    }
    if (reveals.length) { setShots(new Set([...shots, ...reveals])); setLog(`📡 Sonar reveals ${reveals.length} enemy cells`); }
    else setLog("📡 Sonar — no contacts");
  }
  function strike() {
    if (cooldown > 0) return;
    const targets = ships.filter(s => s.hits < s.size).flatMap(s => s.cells).filter(c => !shots.has(c));
    if (!targets.length) return;
    const pick = targets[Math.floor(Math.random()*targets.length)];
    const ship = ships[grid[pick]]; ship.hits++;
    setShots(new Set([...shots, pick]));
    setCooldown(3); setLog("✈️ Airstrike hits an enemy ship!");
  }
  function doRepair() {
    if (repair < 1 || playerHp >= 12) return;
    setRepair(r => r-1); setPlayerHp(h => Math.min(12, h+3)); setLog("🔧 Repaired +3 HP");
  }
  const reset = () => { setState(placeFleet()); setShots(new Set()); setSonar(3); setAirstrike(0); setCooldown(0); setRepair(2); setPlayerHp(12); setLog("Find and sink the AI fleet"); };

  return (
    <GameShell title="Battleship: Fog of War" sidebar={<>
      <Stat label="Ships sunk" value={`${sunk}/${ships.length}`} />
      <Stat label="Your HP" value={`${playerHp}/12`} />
      <Stat label="Sonar" value={sonar} />
      <Stat label="Repairs" value={repair} />
      <Btn onClick={ping} disabled={sonar<1||won} className="w-full">📡 Sonar ping</Btn>
      <Btn onClick={strike} disabled={cooldown>0||won} className="w-full">✈️ Airstrike {cooldown>0?`(${cooldown})`:""}</Btn>
      <Btn onClick={doRepair} disabled={repair<1||playerHp>=12} variant="ghost" className="w-full">🔧 Repair (+3 HP)</Btn>
      <Msg>{won ? "🏆 Victory!" : playerHp <= 0 ? "💀 Defeated!" : log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New battle</Btn>
    </>}>
      <div className="mx-auto max-w-md rounded-lg border border-line bg-surface p-1">
        <div className="grid gap-px" style={{gridTemplateColumns:`repeat(${BS_SZ},1fr)`}}>
          {Array.from({length: BS_SZ*BS_SZ}).map((_, i) => {
            const shot = shots.has(i);
            const hit = shot && grid[i] >= 0;
            return (
              <button key={i} onClick={() => fire(i)} disabled={shot || won || playerHp <= 0}
                className={`aspect-square flex items-center justify-center text-sm font-bold rounded-sm ${
                  hit ? "bg-ember text-bg" : shot ? "bg-surface text-muted" : "bg-elevated hover:bg-surface"
                }`}>
                {hit ? "💥" : shot ? "•" : ""}
              </button>
            );
          })}
        </div>
      </div>
    </GameShell>
  );
}
