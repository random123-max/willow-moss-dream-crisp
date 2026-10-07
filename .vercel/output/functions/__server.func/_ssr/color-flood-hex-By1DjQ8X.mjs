import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/color-flood-hex-By1DjQ8X.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("color-flood-hex");
var SIZE = 7;
var COLORS = [
	"#3ee0d0",
	"#ff6a3d",
	"#a855f7",
	"#f59e0b",
	"#22c55e",
	"#60a5fa"
];
function init() {
	const g = [];
	for (let r = 0; r < SIZE; r++) {
		const row = [];
		for (let c = 0; c < SIZE; c++) {
			const t = Math.random() < .1 ? 0 : Math.random() < .1 ? 1 : 2;
			row.push({
				color: Math.floor(Math.random() * COLORS.length),
				terrain: t
			});
		}
		g.push(row);
	}
	return g;
}
function ColorFloodHex() {
	const [grid, setGrid] = (0, import_react.useState)(init);
	const [moves, setMoves] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [maxMoves] = (0, import_react.useState)(25);
	const flood = (0, import_react.useCallback)((color) => {
		if (over) return;
		const oldColor = grid[0][0].color;
		if (color === oldColor) return;
		setGrid((prev) => {
			const ng = prev.map((row) => row.map((cell) => ({ ...cell })));
			const visited = /* @__PURE__ */ new Set();
			const queue = [[0, 0]];
			while (queue.length) {
				const [r, c] = queue.shift();
				const key = `${r},${c}`;
				if (visited.has(key)) continue;
				visited.add(key);
				if (ng[r][c].terrain === 0) continue;
				if (ng[r][c].color !== oldColor) continue;
				ng[r][c].color = color;
				const neighbors = [
					[r - 1, c],
					[r + 1, c],
					[r, c - 1],
					[r, c + 1],
					[r - 1, c + 1],
					[r + 1, c - 1]
				];
				for (const [nr, nc] of neighbors) if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) queue.push([nr, nc]);
			}
			setMoves((m) => m + 1);
			if (ng.every((row) => row.every((cell) => cell.color === ng[0][0].color || cell.terrain === 0))) {
				setWon(true);
				setOver(true);
			} else if (moves + 1 >= maxMoves) setOver(true);
			return ng;
		});
	}, [
		grid,
		over,
		moves,
		maxMoves
	]);
	const reset = () => {
		setGrid(init());
		setMoves(0);
		setOver(false);
		setWon(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${moves}/${maxMoves}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: won ? "Dominion achieved! 🎉" : over ? "Out of moves!" : "Flood the entire grid!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-0.5",
					style: { gridTemplateColumns: `repeat(${SIZE}, 1fr)` },
					children: grid.map((row, r) => row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex size-9 items-center justify-center rounded",
						style: {
							background: COLORS[cell.color],
							clipPath: r % 2 ? "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)" : "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
							opacity: cell.terrain === 0 ? .3 : 1,
							border: cell.terrain === 0 ? "2px solid #444" : "none"
						},
						children: [cell.terrain === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs",
							children: "⛰️"
						}), cell.terrain === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs opacity-40",
							children: "🌊"
						})]
					}, `${r}-${c}`)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: COLORS.map((color, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: over || i === grid[0][0].color,
						onClick: () => flood(i),
						className: "size-8 rounded-full transition-all hover:scale-110 disabled:opacity-30",
						style: {
							background: color,
							border: `2px solid ${color}`
						}
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "⛰️ Mountains block · 🌊 Rivers accelerate flow"
				})
			]
		})
	});
}
//#endregion
export { ColorFloodHex as default };
