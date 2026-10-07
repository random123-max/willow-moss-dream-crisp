import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fusion-2048-Nu4cz_MX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("fusion-2048");
var SIZE = 4;
function init() {
	const g = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
	addTile(g);
	addTile(g);
	return g;
}
function addTile(g) {
	const empty = [];
	for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (g[r][c] === 0) empty.push([r, c]);
	if (empty.length) {
		const [r, c] = empty[Math.floor(Math.random() * empty.length)];
		g[r][c] = Math.random() < .9 ? 2 : 4;
	}
}
function slide(row) {
	const filtered = row.filter((x) => x);
	let merged = false;
	for (let i = 0; i < filtered.length - 1; i++) if (filtered[i] === filtered[i + 1]) {
		filtered[i] *= 2;
		filtered.splice(i + 1, 1);
		merged = true;
	}
	while (filtered.length < SIZE) filtered.push(0);
	return [filtered, merged];
}
var COLORS = {
	2: "#243240",
	4: "#30465a",
	8: "#3ee0d0",
	16: "#2bcdb8",
	32: "#ff6a3d",
	64: "#e55a2a",
	128: "#f59e0b",
	256: "#eab308",
	512: "#a855f7",
	1024: "#8b5cf6",
	2048: "#3ee0d0"
};
function Fusion2048() {
	const [grid, setGrid] = (0, import_react.useState)(init);
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-2048-best", 0);
	const [heat, setHeat] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [moves, setMoves] = (0, import_react.useState)(0);
	const move = (0, import_react.useCallback)((dir) => {
		if (over) return;
		let moved = false;
		setGrid((prev) => {
			const g = prev.map((r) => [...r]);
			const rotate = (g) => g[0].map((_, i) => g.map((r) => r[i]).reverse());
			let g2 = g;
			if (dir === "up") g2 = rotate(rotate(rotate(g)));
			if (dir === "right") g2 = rotate(g);
			if (dir === "down") g2 = rotate(rotate(g));
			g2 = g2.map((row) => {
				const [r, m] = slide(row);
				if (m) moved = true;
				return r;
			});
			let g3 = g2;
			if (dir === "up") g3 = rotate(g2);
			if (dir === "right") g3 = rotate(rotate(rotate(g2)));
			if (dir === "down") g3 = rotate(rotate(g2));
			if (moved) {
				addTile(g3);
				setMoves((m) => m + 1);
				setScore((s) => {
					const ns = s + g3.flat().filter((x) => x > 2).reduce((a, b) => a + b, 0) - g.flat().reduce((a, b) => a + b, 0);
					if (ns > best) setBest(ns);
					return ns;
				});
				if (g3.flat().includes(2048) && !won) setWon(true);
				if (!g3.some((row, r) => row.some((cell, c) => cell === 0 || c < 3 && cell === row[c + 1] || r < 3 && cell === g3[r + 1][c]))) setOver(true);
			}
			return g3;
		});
		setHeat(0);
	}, [
		over,
		won,
		best
	]);
	(0, import_react.useEffect)(() => {
		const k = (e) => {
			const map = {
				ArrowUp: "up",
				ArrowDown: "down",
				ArrowLeft: "left",
				ArrowRight: "right"
			};
			if (map[e.key]) {
				e.preventDefault();
				move(map[e.key]);
			}
		};
		window.addEventListener("keydown", k);
		return () => window.removeEventListener("keydown", k);
	});
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			setHeat((h) => {
				const nh = h + 1;
				if (nh >= 5) {
					setGrid((prev) => {
						let max = 0, maxR = 0, maxC = 0;
						for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (prev[r][c] > max) {
							max = prev[r][c];
							maxR = r;
							maxC = c;
						}
						const ng = prev.map((row) => [...row]);
						if (max > 0) ng[maxR][maxC] = 0;
						return ng;
					});
					return 0;
				}
				return nh;
			});
		}, 2e3);
		return () => clearInterval(t);
	}, [over, moves]);
	const reset = () => {
		setGrid(init());
		setScore(0);
		setHeat(0);
		setOver(false);
		setWon(false);
		setMoves(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${score}`,
		best: `${best}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-xs items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: ["Moves: ", moves]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm",
						style: { color: heat >= 3 ? "#ff6a3d" : heat >= 2 ? "#f59e0b" : G.accent },
						children: [
							"🔥 Heat: ",
							heat,
							"/5 ",
							heat >= 3 && "⚠️"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-4 gap-2 rounded-xl border-2 p-2",
						style: { borderColor: G.accent + "44" },
						children: grid.map((row, r) => row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-14 items-center justify-center rounded-lg font-mono text-sm font-bold transition-all md:size-16",
							style: {
								background: cell ? COLORS[cell] ?? "#3ee0d0" : "var(--color-bg)",
								color: cell >= 128 ? "#071018" : "#ece7de",
								boxShadow: cell >= 128 ? `0 0 12px ${COLORS[cell]}88` : "none"
							},
							children: cell || ""
						}, `${r}-${c}`)))
					}), heat >= 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "pointer-events-none absolute inset-0 rounded-xl animate-pulse",
						style: { boxShadow: `inset 0 0 20px #ff6a3d77` }
					})]
				}),
				won && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: G.accent },
					children: "🎉 You reached 2048!"
				}),
				over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-xl text-ember",
					children: ["Reactor meltdown! Score: ", score]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => move("up"),
							disabled: over,
							className: "rounded-lg border border-line bg-surface px-4 py-2 text-sm",
							children: "↑"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => move("left"),
							disabled: over,
							className: "rounded-lg border border-line bg-surface px-4 py-2 text-sm",
							children: "←"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => move("down"),
							disabled: over,
							className: "rounded-lg border border-line bg-surface px-4 py-2 text-sm",
							children: "↓"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => move("right"),
							disabled: over,
							className: "rounded-lg border border-line bg-surface px-4 py-2 text-sm",
							children: "→"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Arrow keys or buttons · Move before heat explodes!"
				})
			]
		})
	});
}
//#endregion
export { Fusion2048 as default };
