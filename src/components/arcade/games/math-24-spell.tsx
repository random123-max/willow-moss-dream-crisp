import { useState, useCallback, useEffect } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("math-24-spell")!;

function genNums(): number[] {
  return Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 9));
}

function canMake24(nums: number[]): boolean {
  if (nums.length === 1) return Math.abs(nums[0] - 24) < 0.001;
  for (let i = 0; i < nums.length; i++)
    for (let j = 0; j < nums.length; j++) {
      if (i === j) continue;
      const rest = nums.filter((_, k) => k !== i && k !== j);
      const ops = [nums[i] + nums[j], nums[i] - nums[j], nums[i] * nums[j]];
      if (nums[j] !== 0) ops.push(nums[i] / nums[j]);
      for (const r of ops) if (canMake24([...rest, r])) return true;
    }
  return false;
}

function makeSolvable(): number[] {
  let nums: number[];
  do { nums = genNums(); } while (!canMake24(nums));
  return nums;
}

export default function Math24Spell() {
  const [nums, setNums] = useState<number[]>(makeSolvable);
  const [selected, setSelected] = useState<number[]>([]);
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [combo, setCombo] = useState(0);
  const [monsterHP, setMonsterHP] = useState(50);
  const [wave, setWave] = useState(1);
  const [msg, setMsg] = useState("Combine 4 numbers to make 24!");
  const [usedIdx, setUsedIdx] = useState<Set<number>>(new Set());

  const calc = useCallback(() => {
    if (selected.length !== 4) return null;
    try {
      // Simple eval of expression with selected nums
      const e = expr.replace(/[0-9]/g, "").replace(/[-+*/()]/g, "").trim();
      if (e) return null;
      // eslint-disable-next-line no-eval
      const r = eval(expr);
      return typeof r === "number" ? r : null;
    } catch {
      return null;
    }
  }, [selected, expr]);

  const check = useCallback(() => {
    const r = calc();
    if (r === null) { setMsg("Invalid expression!"); return; }
    setResult(r);
    if (Math.abs(r - 24) < 0.001) {
      const usesMult = expr.includes("*");
      const dmg = 20 + (usesMult ? 10 * combo : 0);
      setCombo((c) => c + (usesMult ? 1 : 0));
      setMonsterHP((hp) => {
        const nhp = Math.max(0, hp - dmg);
        if (nhp <= 0) {
          setWave((w) => w + 1);
          setMonsterHP(50 + wave * 10);
          setNums(makeSolvable());
        }
        return nhp;
      });
      setMsg(`24! ${usesMult ? `Combo x${combo + 1}! ` : ""}${dmg} damage to monster! 🗡️`);
      setSelected([]);
      setExpr("");
      setResult(null);
      setUsedIdx(new Set());
    } else {
      setMsg(`${r} is not 24. Try again!`);
      setCombo(0);
    }
  }, [calc, expr, combo, wave]);

  const addNum = (idx: number) => {
    if (usedIdx.has(idx)) return;
    setSelected((s) => [...s, nums[idx]]);
    setExpr((e) => e + nums[idx]);
    setUsedIdx((prev) => new Set(prev).add(idx));
  };
  const addOp = (op: string) => {
    setExpr((e) => e + op);
  };

  const reset = () => {
    setNums(makeSolvable());
    setSelected([]);
    setExpr("");
    setResult(null);
    setOver(false);
    setWon(false);
    setCombo(0);
    setMonsterHP(50);
    setWave(1);
    setMsg("Combine 4 numbers to make 24!");
    setUsedIdx(new Set());
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`Wave ${wave}`} extra={<span className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-ember">👹{monsterHP}</span>}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        {combo > 0 && <p className="text-xs" style={{ color: G.accent }}>🔥 Combo x{combo}</p>}
        {/* Monster */}
        <div className="flex w-full max-w-xs items-center gap-2">
          <span className="text-2xl">👹</span>
          <div className="h-3 flex-1 overflow-hidden rounded-full bg-surface">
            <div className="h-full bg-ember transition-all" style={{ width: `${(monsterHP / (50 + wave * 10)) * 100}%` }} />
          </div>
        </div>
        {/* Numbers */}
        <div className="flex gap-2">
          {nums.map((n, i) => (
            <button key={i} type="button" disabled={usedIdx.has(i)} onClick={() => addNum(i)} className="flex size-14 items-center justify-center rounded-lg border-2 text-2xl font-bold transition-all disabled:opacity-30" style={{ borderColor: G.accent, color: G.accent, background: G.accent + "11" }}>
              {n}
            </button>
          ))}
        </div>
        {/* Expression */}
        <div className="rounded-lg border-2 px-4 py-2 font-mono text-lg min-w-[120px] text-center" style={{ borderColor: G.accent + "44", color: result === 24 ? G.accent : "var(--color-fg)" }}>
          {expr || "?"} {result !== null && `= ${result}`}
        </div>
        {/* Operators */}
        <div className="flex gap-2">
          {["+", "-", "*", "/", "(", ")"].map((op) => (
            <button key={op} type="button" onClick={() => addOp(op)} className="flex size-10 items-center justify-center rounded-lg border text-lg font-bold" style={{ borderColor: "var(--color-line)", color: "var(--color-fg)", background: "var(--color-surface)" }}>
              {op}
            </button>
          ))}
          <button type="button" onClick={() => { setExpr(""); setSelected([]); setUsedIdx(new Set()); setResult(null); }} className="flex size-10 items-center justify-center rounded-lg border text-sm" style={{ borderColor: "var(--color-line)", color: "var(--color-muted)" }}>clr</button>
        </div>
        <button type="button" onClick={check} className="rounded-lg px-6 py-2 text-sm font-bold" style={{ background: G.accent, color: "#071018" }}>Cast Spell</button>
        <p className="text-xs text-muted">Using * builds combo damage!</p>
      </div>
    </GameShell>
  );
}
