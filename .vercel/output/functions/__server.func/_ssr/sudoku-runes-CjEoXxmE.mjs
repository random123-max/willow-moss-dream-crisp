import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sudoku-runes-CjEoXxmE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("sudoku-runes");
var SIZE = 4;
var BOX = 2;
function validSolution() {
	return [
		[
			1,
			2,
			3,
			4
		],
		[
			3,
			4,
			1,
			2
		],
		[
			2,
			1,
			4,
			3
		],
		[
			4,
			3,
			2,
			1
		]
	];
}
function makePuzzle() {
	const sol = validSolution();
	const puzzle = sol.map((row) => row.map(() => null));
	const cells = 6;
	for (let i = 0; i < cells; i++) {
		const r = Math.floor(Math.random() * SIZE), c = Math.floor(Math.random() * SIZE);
		puzzle[r][c] = sol[r][c];
	}
	return {
		puzzle,
		solution: sol
	};
}
function SudokuRunes() {
	const [data, setData] = (0, import_react.useState)(makePuzzle);
	const [grid, setGrid] = (0, import_react.useState)(data.puzzle);
	const [given, setGiven] = (0, import_react.useState)(data.puzzle.map((row) => row.map((c) => c !== null)));
	const [charge, setCharge] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Fill the grid 1-4!");
	const check = (0, import_react.useCallback)(() => {
		for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] !== data.solution[r][c]) return false;
		return true;
	}, [grid, data]);
	const place = (0, import_react.useCallback)((r, c, val) => {
		if (given[r][c] || over) return;
		const ng = grid.map((row) => [...row]);
		ng[r][c] = val;
		setGrid(ng);
		if (val !== null && val === data.solution[r][c]) {
			setCharge((ch) => Math.min(5, ch + 1));
			setMsg("✨ Correct placement! +1 elemental charge!");
		} else if (val !== null) setMsg("❌ Wrong — try again.");
		if (ng.flat().every((c) => c !== null) && check()) {
			setOver(true);
			setMsg("🎉 Sudoku solved! Runes aligned!");
		}
	}, [
		grid,
		given,
		over,
		data,
		check
	]);
	const castSpell = (0, import_react.useCallback)((spell) => {
		if (charge < 2) return;
		setCharge((c) => c - 2);
		if (spell === "reveal") {
			for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] !== data.solution[r][c]) {
				place(r, c, data.solution[r][c]);
				setMsg("🔮 Reveal Fate! A cell was revealed.");
				return;
			}
		} else for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c] !== null && grid[r][c] !== data.solution[r][c]) {
			place(r, c, data.solution[r][c]);
			setMsg("🔮 Cleanse Error! A wrong cell was fixed.");
			return;
		}
	}, [
		charge,
		grid,
		data,
		place
	]);
	const reset = () => {
		const d = makePuzzle();
		setData(d);
		setGrid(d.puzzle);
		setGiven(d.puzzle.map((row) => row.map((c) => c !== null)));
		setCharge(0);
		setOver(false);
		setMsg("Fill the grid 1-4!");
	};
	const selected = {
		r: -1,
		c: -1
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `🔮${charge}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-1 rounded-lg border-2 p-1",
					style: { borderColor: G.accent + "44" },
					children: grid.map((row, r) => row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: given[r][c] || over,
						onClick: () => {
							selected.r = r;
							selected.c = c;
						},
						className: `flex size-16 items-center justify-center rounded font-mono text-xl font-bold transition-all md:size-20 ${given[r][c] ? "" : "hover:bg-elevated"}`,
						style: {
							background: given[r][c] ? "var(--color-elevated)" : cell !== null && cell === data.solution[r][c] ? G.accent + "22" : cell !== null ? "#ff6a3d22" : "var(--color-surface)",
							border: `${(c + 1) % BOX === 0 && c < 3 ? 2 : 1}px solid ${(r + 1) % BOX === 0 && r < 3 ? G.accent + "44" : "var(--color-line)"}`,
							color: given[r][c] ? "var(--color-fg)" : cell === data.solution[r][c] ? G.accent : "#ff6a3d"
						},
						children: cell || ""
					}, `${r}-${c}`)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [[
						1,
						2,
						3,
						4
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (selected.r >= 0) place(selected.r, selected.c, n);
						},
						className: "flex size-12 items-center justify-center rounded-lg border text-lg font-bold",
						style: {
							borderColor: G.accent,
							color: G.accent,
							background: G.accent + "11"
						},
						children: n
					}, n)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							if (selected.r >= 0) place(selected.r, selected.c, null);
						},
						className: "flex size-12 items-center justify-center rounded-lg border border-line text-lg text-muted",
						children: "✕"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: charge < 2,
						onClick: () => castSpell("reveal"),
						className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
						style: {
							borderColor: G.accent,
							color: G.accent
						},
						children: "🔮 Reveal (2⚡)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: charge < 2,
						onClick: () => castSpell("cleanse"),
						className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
						style: {
							borderColor: G.accent,
							color: G.accent
						},
						children: "🧹 Cleanse (2⚡)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Tap a cell, then a number · 2 charges per spell"
				})
			]
		})
	});
}
//#endregion
export { SudokuRunes as default };
