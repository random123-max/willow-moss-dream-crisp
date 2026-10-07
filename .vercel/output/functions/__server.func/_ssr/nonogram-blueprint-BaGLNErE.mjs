import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nonogram-blueprint-BaGLNErE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("nonogram-blueprint");
var SIZE = 5;
var PUZZLES = [
	[
		[
			1,
			1,
			1,
			1,
			1
		],
		[
			1,
			0,
			1,
			0,
			1
		],
		[
			1,
			1,
			1,
			1,
			1
		],
		[
			0,
			1,
			0,
			1,
			0
		],
		[
			0,
			1,
			1,
			1,
			0
		]
	],
	[
		[
			0,
			0,
			1,
			0,
			0
		],
		[
			1,
			1,
			1,
			1,
			1
		],
		[
			0,
			1,
			1,
			1,
			0
		],
		[
			0,
			1,
			0,
			1,
			0
		],
		[
			1,
			0,
			0,
			0,
			1
		]
	],
	[
		[
			0,
			0,
			1,
			0,
			0
		],
		[
			0,
			1,
			1,
			1,
			0
		],
		[
			1,
			1,
			1,
			1,
			1
		],
		[
			1,
			0,
			1,
			0,
			1
		],
		[
			0,
			1,
			0,
			1,
			0
		]
	]
];
function getHints(line) {
	const hints = [];
	let count = 0;
	for (const cell of line) if (cell === 1) count++;
	else if (count > 0) {
		hints.push(count);
		count = 0;
	}
	if (count > 0) hints.push(count);
	return hints.length ? hints : [0];
}
function NonogramBlueprint() {
	const [puzzleIdx] = (0, import_react.useState)(() => Math.floor(Math.random() * PUZZLES.length));
	const puzzle = PUZZLES[puzzleIdx];
	const [grid, setGrid] = (0, import_react.useState)(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
	const [marks, setMarks] = (0, import_react.useState)(() => Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
	const [time, setTime] = (0, import_react.useState)(60);
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [progress, setProgress] = (0, import_react.useState)(0);
	const rowHints = puzzle.map(getHints);
	const colHints = Array.from({ length: SIZE }, (_, c) => getHints(puzzle.map((row) => row[c])));
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => setTime((s) => {
			if (s <= 1) {
				setOver(true);
				return 0;
			}
			return s - 1;
		}), 1e3);
		return () => clearInterval(t);
	}, [over]);
	const click = (0, import_react.useCallback)((r, c, mark) => {
		if (over) return;
		setMarks((prev) => {
			const nm = prev.map((row) => [...row]);
			nm[r][c] = mark ? nm[r][c] === 2 ? 0 : 2 : nm[r][c] === 1 ? 0 : 1;
			let correct = 0;
			for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) if (nm[i][j] === 1 === (puzzle[i][j] === 1)) correct++;
			setProgress(Math.round(correct / 25 * 100));
			let isWin = true;
			for (let i = 0; i < SIZE; i++) for (let j = 0; j < SIZE; j++) if (nm[i][j] === 1 !== (puzzle[i][j] === 1)) isWin = false;
			if (isWin) {
				setWon(true);
				setOver(true);
			}
			return nm;
		});
	}, [over, puzzle]);
	const reset = () => {
		setMarks(Array.from({ length: SIZE }, () => Array(SIZE).fill(0)));
		setTime(60);
		setOver(false);
		setWon(false);
		setProgress(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `⏱️${time}`,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs text-primary",
			children: [progress, "%"]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: won ? "Blueprint complete! 🤖🎉" : over ? "Time's up!" : "Click to fill, right-click to mark empty"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-grid gap-px",
						style: { gridTemplateColumns: `auto repeat(${SIZE}, 28px)` },
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
							colHints.map((hints, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-col items-center justify-end gap-px text-[10px] font-mono text-muted",
								children: hints.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h }, i))
							}, c)),
							puzzle.map((_, r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-end gap-1 pr-1 text-[10px] font-mono text-muted",
								children: rowHints[r].map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: h }, i))
							}, `r-${r}`), Array.from({ length: SIZE }, (_, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: over,
								onClick: () => click(r, c, false),
								onContextMenu: (e) => {
									e.preventDefault();
									click(r, c, true);
								},
								className: "flex size-7 items-center justify-center rounded-sm text-xs",
								style: {
									background: marks[r][c] === 1 ? G.accent : marks[r][c] === 2 ? "var(--color-elevated)" : "var(--color-surface)",
									border: `1px solid ${marks[r][c] === 1 ? G.accent : "var(--color-line)"}`,
									color: "var(--color-muted)"
								},
								children: marks[r][c] === 2 ? "✕" : marks[r][c] === 1 ? "■" : ""
							}, `${r}-${c}`))] }))
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Build the robot before time runs out!"
				})
			]
		})
	});
}
//#endregion
export { NonogramBlueprint as default };
