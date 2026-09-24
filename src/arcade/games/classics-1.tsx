import { useState, useCallback, useEffect, useMemo } from "react";
import { GameShell, Stat, Btn, Msg } from "../ui";

/* ═══════════════ 1. Neon Grandmaster Tic-Tac-Toe ═══════════════ */

type Cell = "X" | "O" | null;
function checkWin(b: Cell[]): Cell {
  const L = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  for (const [a,c,d] of L) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return null;
}
function minimax(b: Cell[], me: "O", turn: Cell, d: number): number {
  const w = checkWin(b);
  if (w === "O") return 10 - d;
  if (w === "X") return d - 10;
  if (b.every(Boolean)) return 0;
  const scores: number[] = [];
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      const nb = [...b]; nb[i] = turn;
      scores.push(minimax(nb, me, turn === "O" ? "X" : "O", d + 1));
    }
  }
  return turn === me ? Math.max(...scores) : Math.min(...scores);
}
function aiMove(b: Cell[]): number {
  let best = -99, mi = -1;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      const nb = [...b]; nb[i] = "O";
      const s = minimax(nb, "O", "X", 1);
      if (s > best) { best = s; mi = i; }
    }
  }
  return mi;
}

export function NeonTicTacToe() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [glitch, setGlitch] = useState<number>(-1);
  const [glitchCount, setGlitchCount] = useState(0);
  const [round, setRound] = useState(0);
  const winner = checkWin(board);
  const full = board.every(Boolean);
  const over = !!winner || full;

  const applyGlitch = useCallback((b: Cell[]) => {
    if (glitchCount >= 1 && glitch !== -1) {
      const nb = [...b]; nb[glitch] = null;
      setGlitch(-1); setGlitchCount(0);
      return nb;
    }
    if (glitch !== -1) setGlitchCount(glitchCount + 1);
    return b;
  }, [glitch, glitchCount]);

  function play(i: number) {
    if (board[i] || over || turn !== "X") return;
    let nb = [...board]; nb[i] = "X";
    const newRound = round + 1;
    if (newRound % 2 === 0) {
      const filled = nb.map((c, idx) => c ? idx : -1).filter(x => x >= 0);
      if (filled.length) setGlitch(filled[Math.floor(Math.random() * filled.length)]);
    }
    nb = applyGlitch(nb);
    setBoard(nb); setTurn("O"); setRound(newRound);
  }

  useEffect(() => {
    if (turn === "O" && !over) {
      const t = setTimeout(() => {
        let nb = [...board]; nb[aiMove(nb)] = "O";
        nb = applyGlitch(nb);
        setBoard(nb); setTurn("X"); setRound(r => r + 1);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [turn, over]);

  const reset = () => { setBoard(Array(9).fill(null)); setTurn("X"); setGlitch(-1); setGlitchCount(0); setRound(0); };

  return (
    <GameShell title="Neon Grandmaster Tic-Tac-Toe" sidebar={<>
      <Stat label="Round" value={round} />
      {glitch >= 0 && <Msg>⚠️ Tile {glitch + 1} irradiated — cleared next round if unattended!</Msg>}
      <Btn onClick={reset} variant="ghost" className="w-full">New game</Btn>
    </>}>
      <div className="mx-auto grid max-w-xs grid-cols-3 gap-2">
        {board.map((c, i) => (
          <button key={i} onClick={() => play(i)} disabled={!!c || over || turn !== "X"}
            className={`flex h-24 items-center justify-center rounded-lg border text-4xl font-bold transition-all ${
              glitch === i ? "border-ember animate-pulse" : "border-line"
            } ${c === "X" ? "bg-primary/15 text-primary" : c === "O" ? "bg-ember/15 text-ember" : "bg-surface"}`}>
            {c}
          </button>
        ))}
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        {winner ? `${winner === "X" ? "You win" : "AI wins"}!` : full ? "Draw!" : turn === "X" ? "Your move (X)" : "AI thinking…"}
      </p>
    </GameShell>
  );
}

/* ═══════════════ 2. RPS: Quantum Showdown ═══════════════ */

type RPS = "rock" | "paper" | "scissors";
const BEATS: Record<RPS, RPS> = { rock: "scissors", paper: "rock", scissors: "paper" };
const SUPER: Record<RPS, string> = { rock: "Meteor Rock", paper: "Tsunami Paper", scissors: "Lightning Scissors" };

export function RpsQuantum() {
  const [history, setHistory] = useState<RPS[]>([]);
  const [pCharge, setPCharge] = useState(0);
  const [aCharge, setACharge] = useState(0);
  const [score, setScore] = useState({ p: 0, a: 0 });
  const [round, setRound] = useState(0);
  const [result, setResult] = useState<string>("");
  const [canSuper, setCanSuper] = useState(true);

  const predict = (h: RPS[]): RPS => {
    if (h.length < 2) return ["rock","paper","scissors"][Math.floor(Math.random()*3)];
    const last = h[h.length - 1];
    const freq: Record<string, number> = { rock: 0, paper: 0, scissors: 0 };
    for (let i = 0; i < h.length - 1; i++) if (h[i] === last) freq[h[i+1]]++;
    const predicted = Object.entries(freq).sort((a,b) => b[1]-a[1])[0];
    return predicted && freq[predicted[0]] > 0 ? BEATS[predicted[0] as RPS] : ["rock","paper","scissors"][Math.floor(Math.random()*3)];
  };

  function play(move: RPS, superMove: boolean) {
    if (superMove && pCharge < 5) return;
    const ai = superMove ? BEATS[BEATS[predict([...history])]] : predict([...history]);
    let res = "Draw!";
    if (superMove) { res = `Super-move! ${SUPER[move]} — You win!`; setScore(s => ({...s, p: s.p+1})); }
    else if (move === ai) res = `Both played ${move} — Draw!`;
    else if (BEATS[move] === ai) { res = `${move} beats ${ai} — You win!`; setScore(s => ({...s, p: s.p+1})); }
    else { res = `${ai} beats ${move} — AI wins!`; setScore(s => ({...s, a: s.a+1})); }
    setResult(res);
    setHistory(h => [...h, move]);
    setRound(r => r + 1);
    setPCharge(c => superMove ? 0 : Math.min(5, c + 1));
    setACharge(c => Math.min(5, c + 1));
    setCanSuper(false);
    setTimeout(() => setCanSuper(true), 600);
  }

  const reset = () => { setHistory([]); setPCharge(0); setACharge(0); setScore({p:0,a:0}); setRound(0); setResult(""); };

  return (
    <GameShell title="RPS: Quantum Showdown" sidebar={<>
      <Stat label="You" value={score.p} />
      <Stat label="AI" value={score.a} />
      <Stat label="Round" value={round} />
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">Your charge</p>
        <div className="mt-1 h-3 rounded-full bg-surface border border-line">
          <div className="h-full rounded-full bg-primary transition-all" style={{width: `${pCharge*20}%`}} />
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-muted">AI charge</p>
        <div className="mt-1 h-3 rounded-full bg-surface border border-line">
          <div className="h-full rounded-full bg-ember transition-all" style={{width: `${aCharge*20}%`}} />
        </div>
      </div>
      <Btn onClick={reset} variant="ghost" className="w-full">Reset</Btn>
    </>}>
      <div className="flex flex-col items-center gap-6">
        <p className="font-display text-xl text-fg">{result || "Choose your move"}</p>
        <div className="flex gap-4">
          {(["rock","paper","scissors"] as RPS[]).map(m => (
            <button key={m} onClick={() => play(m, false)} disabled={!canSuper}
              className="flex size-24 flex-col items-center justify-center rounded-xl border border-line bg-surface text-3xl transition-colors hover:border-primary/40 hover:bg-elevated disabled:opacity-40">
              {m === "rock" ? "✊" : m === "paper" ? "✋" : "✌️"}
              <span className="mt-1 text-xs capitalize text-muted">{m}</span>
            </button>
          ))}
        </div>
        {pCharge >= 5 && canSuper && (
          <div className="flex gap-2">
            {(["rock","paper","scissors"] as RPS[]).map(m => (
              <button key={m} onClick={() => play(m, true)}
                className="rounded-lg border border-ember/60 bg-ember/15 px-4 py-2 text-sm font-semibold text-ember">
                ⚡ {SUPER[m]}
              </button>
            ))}
          </div>
        )}
      </div>
    </GameShell>
  );
}

/* ═══════════════ 3. Gravity-Shift Connect Four ═══════════════ */

const ROWS = 6, COLS = 7;
type Piece = "R" | "Y" | null;

function dropInto(b: Piece[][], col: number, p: Piece): Piece[][] {
  const nb = b.map(r => [...r]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (!nb[r][col]) { nb[r][col] = p; return nb; }
  }
  return nb;
}
function checkC4(b: Piece[][]): Piece {
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const p = b[r][c]; if (!p) continue;
    if (c <= COLS-4 && b[r][c+1]===p && b[r][c+2]===p && b[r][c+3]===p) return p;
    if (r <= ROWS-4 && b[r+1][c]===p && b[r+2][c]===p && b[r+3][c]===p) return p;
    if (r <= ROWS-4 && c <= COLS-4 && b[r+1][c+1]===p && b[r+2][c+2]===p && b[r+3][c+3]===p) return p;
    if (r <= ROWS-4 && c >= 3 && b[r+1][c-1]===p && b[r+2][c-2]===p && b[r+3][c-3]===p) return p;
  }
  return null;
}
function applyGravity(b: Piece[][]): Piece[][] {
  const nb: Piece[][] = Array.from({length: ROWS}, () => Array(COLS).fill(null));
  for (let c = 0; c < COLS; c++) {
    const col: Piece[] = [];
    for (let r = ROWS-1; r >= 0; r--) if (b[r][c]) col.push(b[r][c]);
    for (let i = 0; i < col.length; i++) nb[ROWS-1-i][c] = col[i];
  }
  return nb;
}
function rotateBoard(b: Piece[][]): Piece[][] {
  const nb: Piece[][] = Array.from({length: COLS}, () => Array(ROWS).fill(null));
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) nb[c][ROWS-1-r] = b[r][c];
  return applyGravity(nb.slice(0, ROWS).map(r => r.slice(0, COLS)));
}
function aiC4(b: Piece[][]): number {
  for (let c = 0; c < COLS; c++) {
    const t = dropInto(b, c, "Y");
    if (checkC4(t) === "Y") return c;
  }
  for (let c = 0; c < COLS; c++) {
    const t = dropInto(b, c, "R");
    if (checkC4(t) === "R") return c;
  }
  return 3;
}

export function GravityConnect4() {
  const [board, setBoard] = useState<Piece[][]>(Array.from({length: ROWS}, () => Array(COLS).fill(null)));
  const [turn, setTurn] = useState<"R" | "Y">("R");
  const [rotUsed, setRotUsed] = useState(false);
  const winner = checkC4(board);

  function play(c: number) {
    if (winner || turn !== "R" || board[0][c]) return;
    setBoard(b => dropInto(b, c, "R")); setTurn("Y");
  }
  function rotate() {
    if (rotUsed || winner || turn !== "R") return;
    setBoard(b => rotateBoard(b)); setRotUsed(true); setTurn("Y");
  }
  useEffect(() => {
    if (turn === "Y" && !winner) {
      const t = setTimeout(() => {
        setBoard(b => dropInto(b, aiC4(b), "Y")); setTurn("R");
      }, 500);
      return () => clearTimeout(t);
    }
  }, [turn, winner]);
  const reset = () => { setBoard(Array.from({length: ROWS}, () => Array(COLS).fill(null))); setTurn("R"); setRotUsed(false); };

  return (
    <GameShell title="Gravity-Shift Connect Four" sidebar={<>
      <Stat label="You" value="🔴" />
      <Stat label="AI" value="🟡" />
      <Btn onClick={rotate} disabled={rotUsed || turn !== "R" || !!winner} className="w-full">
        {rotUsed ? "Rotation used" : "🔄 Rotate board"}
      </Btn>
      <Btn onClick={reset} variant="ghost" className="w-full">New game</Btn>
    </>}>
      <div className="mx-auto max-w-md rounded-xl border border-line bg-surface p-2">
        <div className="grid gap-1" style={{gridTemplateColumns: `repeat(${COLS}, 1fr)`}}>
          {board.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => play(c)}
              className="aspect-square rounded-full border border-line bg-bg disabled:cursor-default"
              disabled={!!cell || turn !== "R" || !!winner}>
              {cell && <span className={`block size-full rounded-full ${cell === "R" ? "bg-primary" : "bg-ember"}`} />}
            </button>
          )))}
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-muted">
        {winner ? `${winner === "R" ? "You win!" : "AI wins!"}` : turn === "R" ? "Drop a piece (click a column)" : "AI thinking…"}
      </p>
    </GameShell>
  );
}

/* ═══════════════ 4. Rogue-Checkers ═══════════════ */

type Checker = { hp: number; king: boolean; side: "W" | "B" } | null;
const SZ = 6;
function initCheckers(): Checker[][] {
  const b: Checker[][] = Array.from({length: SZ}, () => Array(SZ).fill(null));
  for (let r = 0; r < SZ; r++) for (let c = 0; c < SZ; c++) {
    if ((r + c) % 2 === 1) {
      if (r < 2) b[r][c] = { hp: 2, king: false, side: "B" };
      else if (r > 3) b[r][c] = { hp: 2, king: false, side: "W" };
    }
  }
  return b;
}
function getMoves(b: Checker[][], r: number, c: number): [number, number][] {
  const p = b[r][c]; if (!p) return [];
  const dirs = p.king ? [[-1,-1],[-1,1],[1,-1],[1,1]] : p.side === "W" ? [[-1,-1],[-1,1]] : [[1,-1],[1,1]];
  const moves: [number, number][] = [];
  for (const [dr, dc] of dirs) {
    const nr = r+dr, nc = c+dc;
    if (nr >= 0 && nr < SZ && nc >= 0 && nc < SZ && !b[nr][nc]) moves.push([nr, nc]);
    const jr = r+2*dr, jc = c+2*dc;
    if (jr >= 0 && jr < SZ && jc >= 0 && jc < SZ && b[nr]?.[nc]?.side !== p.side && b[nr]?.[nc] && !b[jr]?.[jc])
      moves.push([jr, jc]);
  }
  return moves;
}

export function RogueCheckers() {
  const [board, setBoard] = useState<Checker[][]>(initCheckers);
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [turn, setTurn] = useState<"W" | "B">("W");
  const [log, setLog] = useState("Your turn — select a white piece");
  const moves = sel ? getMoves(board, sel[0], sel[1]) : [];

  function move(r: number, c: number) {
    if (!sel) return;
    const [sr, sc] = sel;
    const nb = board.map(row => [...row]);
    const piece = nb[sr][sc]!;
    const dr = Math.abs(r - sr), dc = Math.abs(c - sc);
    if (dr === 2) {
      const mr = (r + sr) / 2, mc = (c + sc) / 2;
      const target = nb[mr][mc]!;
      target.hp -= 1;
      if (target.hp <= 0) nb[mr][mc] = null;
      if (piece.king && Math.random() < 0.5) {
        const tr = Math.floor(Math.random()*SZ), tc = Math.floor(Math.random()*SZ);
        if (!nb[tr][tc]) { nb[tr][tc] = piece; nb[sr][sc] = null; setLog("⚡ King Teleport!"); setBoard(nb); setSel(null); setTurn("B"); return; }
      }
    }
    nb[r][c] = piece; nb[sr][sc] = null;
    if ((piece.side === "W" && r === 0) || (piece.side === "B" && r === SZ-1)) {
      piece.king = true; setLog("👑 King! Chain Jump or Teleport unlocked.");
    }
    setBoard(nb); setSel(null); setTurn(turn === "W" ? "B" : "W");
  }

  useEffect(() => {
    if (turn !== "B") return;
    const t = setTimeout(() => {
      const pieces: [number, number][] = [];
      for (let r = 0; r < SZ; r++) for (let c = 0; c < SZ; c++)
        if (board[r][c]?.side === "B") pieces.push([r, c]);
      for (const [r, c] of pieces) {
        const ms = getMoves(board, r, c);
        if (ms.length) {
          const [nr, nc] = ms[Math.floor(Math.random() * ms.length)];
          const nb = board.map(row => [...row]);
          const piece = nb[r][c]!;
          if (Math.abs(nr-r) === 2) { const mr=(nr+r)/2,mc=(nc+c)/2; nb[mr][mc]!.hp--; if(nb[mr][mc]!.hp<=0) nb[mr][mc]=null; }
          nb[nr][nc] = piece; nb[r][c] = null;
          if (nr === SZ-1) piece.king = true;
          setBoard(nb); setTurn("W"); setLog("Your turn");
          return;
        }
      }
      setLog("AI has no moves — you win!"); setTurn("W");
    }, 600);
    return () => clearTimeout(t);
  }, [turn]);

  const reset = () => { setBoard(initCheckers()); setSel(null); setTurn("W"); setLog("Your turn — select a white piece"); };

  return (
    <GameShell title="Rogue-Checkers" sidebar={<>
      <Stat label="Turn" value={turn === "W" ? "You" : "AI"} />
      <Msg>{log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New game</Btn>
    </>}>
      <div className="mx-auto max-w-sm">
        <div className="grid gap-px rounded-lg overflow-hidden border border-line" style={{gridTemplateColumns:`repeat(${SZ},1fr)`}}>
          {board.map((row, r) => row.map((cell, c) => (
            <button key={`${r}-${c}`} onClick={() => {
              if (cell?.side === "W" && turn === "W") setSel([r, c]);
              else if (sel && moves.some(m => m[0]===r && m[1]===c)) move(r, c);
            }}
            className={`aspect-square flex items-center justify-center text-2xl ${
              (r+c)%2===0 ? "bg-elevated" : "bg-surface"
            } ${sel?.[0]===r && sel?.[1]===c ? "ring-2 ring-primary" : ""} ${
              moves.some(m=>m[0]===r&&m[1]===c) ? "ring-2 ring-ember" : ""
            }`}>
              {cell && <span className={cell.side === "W" ? "text-primary" : "text-ember"}>
                {cell.king ? "👑" : "●"}
                <sub className="text-xs">{cell.hp}</sub>
              </span>}
            </button>
          )))}
        </div>
      </div>
    </GameShell>
  );
}

/* ═══════════════ 5. Chrono-Memory Match ═══════════════ */

const RUNES = ["🔥","💧","⚡","🌿","🌙","⭐","❄️","💀"];
function makeCards(): { rune: string; cursed: boolean }[] {
  const cards = [...RUNES, ...RUNES].map(r => ({ rune: r, cursed: false }));
  cards[3].cursed = true; cards[11].cursed = true;
  return cards.sort(() => Math.random() - 0.5);
}

export function ChronoMemory() {
  const [cards, setCards] = useState(makeCards);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [time, setTime] = useState(60);
  const [log, setLog] = useState("Match rune pairs to gain time");
  const [over, setOver] = useState(false);

  useEffect(() => {
    if (over) return;
    const id = setInterval(() => setTime(t => { if (t <= 1) { setOver(true); return 0; } return t - 1; }), 1000);
    return () => clearInterval(id);
  }, [over]);

  function flip(i: number) {
    if (flipped.includes(i) || matched.includes(i) || flipped.length >= 2 || over) return;
    const nf = [...flipped, i];
    setFlipped(nf);
    if (nf.length === 2) {
      const [a, b] = nf;
      if (cards[a].rune === cards[b].rune) {
        setMatched(m => [...m, a, b]);
        setFlipped([]);
        if (cards[a].cursed || cards[b].cursed) {
          setLog("💀 Cursed card! Board shuffles…");
          setCards(prev => {
            const nm = prev.map((c, idx) => matched.includes(idx) || idx === a || idx === b ? c : c);
            return [...nm].sort(() => Math.random() - 0.5);
          });
        } else {
          setTime(t => t + 5);
          setLog("✨ Match! +5 seconds");
        }
      } else {
        setTimeout(() => setFlipped([]), 800);
        setLog("No match");
      }
    }
  }

  const won = matched.length === cards.length;
  const reset = () => { setCards(makeCards()); setFlipped([]); setMatched([]); setTime(60); setOver(false); setLog("Match rune pairs to gain time"); };

  return (
    <GameShell title="Chrono-Memory Match" sidebar={<>
      <Stat label="Time" value={`${time}s`} />
      <Stat label="Matched" value={`${matched.length / 2}/${RUNES.length}`} />
      <Msg>{won ? "All matched!" : over ? "Time's up!" : log}</Msg>
      <Btn onClick={reset} variant="ghost" className="w-full">New game</Btn>
    </>}>
      <div className="mx-auto grid max-w-md grid-cols-4 gap-2">
        {cards.map((c, i) => {
          const show = flipped.includes(i) || matched.includes(i);
          return (
            <button key={i} onClick={() => flip(i)}
              className={`flex aspect-square items-center justify-center rounded-lg border text-3xl transition-all ${
                matched.includes(i) ? "border-primary/40 bg-primary/10" :
                show ? "border-line bg-elevated" : "border-line bg-surface hover:bg-elevated"
              }`}>
              {show ? c.rune : "?"}
            </button>
          );
        })}
      </div>
    </GameShell>
  );
}
