import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/math-24-spell-BtdTo7lz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("math-24-spell");
function genNums() {
	return Array.from({ length: 4 }, () => 1 + Math.floor(Math.random() * 9));
}
function canMake24(nums) {
	if (nums.length === 1) return Math.abs(nums[0] - 24) < .001;
	for (let i = 0; i < nums.length; i++) for (let j = 0; j < nums.length; j++) {
		if (i === j) continue;
		const rest = nums.filter((_, k) => k !== i && k !== j);
		const ops = [
			nums[i] + nums[j],
			nums[i] - nums[j],
			nums[i] * nums[j]
		];
		if (nums[j] !== 0) ops.push(nums[i] / nums[j]);
		for (const r of ops) if (canMake24([...rest, r])) return true;
	}
	return false;
}
function makeSolvable() {
	let nums;
	do
		nums = genNums();
	while (!canMake24(nums));
	return nums;
}
function Math24Spell() {
	const [nums, setNums] = (0, import_react.useState)(makeSolvable);
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [expr, setExpr] = (0, import_react.useState)("");
	const [result, setResult] = (0, import_react.useState)(null);
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [combo, setCombo] = (0, import_react.useState)(0);
	const [monsterHP, setMonsterHP] = (0, import_react.useState)(50);
	const [wave, setWave] = (0, import_react.useState)(1);
	const [msg, setMsg] = (0, import_react.useState)("Combine 4 numbers to make 24!");
	const [usedIdx, setUsedIdx] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const calc = (0, import_react.useCallback)(() => {
		if (selected.length !== 4) return null;
		try {
			const e = expr.replace(/[0-9]/g, "").replace(/[-+*/()]/g, "").trim();
			if (e) return null;
			const r = eval(expr);
			return typeof r === "number" ? r : null;
		} catch {
			return null;
		}
	}, [selected, expr]);
	const check = (0, import_react.useCallback)(() => {
		const r = calc();
		if (r === null) {
			setMsg("Invalid expression!");
			return;
		}
		setResult(r);
		if (Math.abs(r - 24) < .001) {
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
			setUsedIdx(/* @__PURE__ */ new Set());
		} else {
			setMsg(`${r} is not 24. Try again!`);
			setCombo(0);
		}
	}, [
		calc,
		expr,
		combo,
		wave
	]);
	const addNum = (idx) => {
		if (usedIdx.has(idx)) return;
		setSelected((s) => [...s, nums[idx]]);
		setExpr((e) => e + nums[idx]);
		setUsedIdx((prev) => new Set(prev).add(idx));
	};
	const addOp = (op) => {
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
		setUsedIdx(/* @__PURE__ */ new Set());
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `Wave ${wave}`,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs text-ember",
			children: ["👹", monsterHP]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				combo > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs",
					style: { color: G.accent },
					children: ["🔥 Combo x", combo]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-xs items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-2xl",
						children: "👹"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-3 flex-1 overflow-hidden rounded-full bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full bg-ember transition-all",
							style: { width: `${monsterHP / (50 + wave * 10) * 100}%` }
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: nums.map((n, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: usedIdx.has(i),
						onClick: () => addNum(i),
						className: "flex size-14 items-center justify-center rounded-lg border-2 text-2xl font-bold transition-all disabled:opacity-30",
						style: {
							borderColor: G.accent,
							color: G.accent,
							background: G.accent + "11"
						},
						children: n
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border-2 px-4 py-2 font-mono text-lg min-w-[120px] text-center",
					style: {
						borderColor: G.accent + "44",
						color: result === 24 ? G.accent : "var(--color-fg)"
					},
					children: [
						expr || "?",
						" ",
						result !== null && `= ${result}`
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [[
						"+",
						"-",
						"*",
						"/",
						"(",
						")"
					].map((op) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => addOp(op),
						className: "flex size-10 items-center justify-center rounded-lg border text-lg font-bold",
						style: {
							borderColor: "var(--color-line)",
							color: "var(--color-fg)",
							background: "var(--color-surface)"
						},
						children: op
					}, op)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setExpr("");
							setSelected([]);
							setUsedIdx(/* @__PURE__ */ new Set());
							setResult(null);
						},
						className: "flex size-10 items-center justify-center rounded-lg border text-sm",
						style: {
							borderColor: "var(--color-line)",
							color: "var(--color-muted)"
						},
						children: "clr"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: check,
					className: "rounded-lg px-6 py-2 text-sm font-bold",
					style: {
						background: G.accent,
						color: "#071018"
					},
					children: "Cast Spell"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Using * builds combo damage!"
				})
			]
		})
	});
}
//#endregion
export { Math24Spell as default };
