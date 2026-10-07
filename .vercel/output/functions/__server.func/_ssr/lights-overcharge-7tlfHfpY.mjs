import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lights-overcharge-7tlfHfpY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("lights-overcharge");
var SIZE = 5;
var STATES = 3;
var COLORS = [
	"var(--color-bg)",
	"#f59e0b",
	"#ff6a3d"
];
function LightsOvercharge() {
	const [grid, setGrid] = (0, import_react.useState)(() => {
		const g = Array(25).fill(0);
		for (let i = 0; i < 15; i++) toggleAt(g, Math.floor(Math.random() * SIZE * SIZE));
		return g;
	});
	const [moves, setMoves] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [target] = (0, import_react.useState)(0);
	function toggleAt(g, idx) {
		const r = Math.floor(idx / SIZE), c = idx % SIZE;
		[
			idx,
			r > 0 ? idx - SIZE : -1,
			r < 4 ? idx + SIZE : -1,
			c > 0 ? idx - 1 : -1,
			c < 4 ? idx + 1 : -1
		].filter((i) => i >= 0).forEach((i) => {
			g[i] = (g[i] + 1) % STATES;
		});
	}
	const click = (0, import_react.useCallback)((idx) => {
		if (over) return;
		setGrid((prev) => {
			const g = [...prev];
			toggleAt(g, idx);
			setMoves((m) => m + 1);
			if (g.every((v) => v === target)) setOver(true);
			return g;
		});
	}, [over, target]);
	const reset = () => {
		const g = Array(25).fill(0);
		for (let i = 0; i < 15; i++) toggleAt(g, Math.floor(Math.random() * SIZE * SIZE));
		setGrid(g);
		setMoves(0);
		setOver(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${moves} moves`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: over ? "All nodes cleared! 🎉" : "Get all nodes to OFF state"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5 gap-2 rounded-xl border-2 p-2",
					style: { borderColor: G.accent + "44" },
					children: grid.map((state, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: over,
						onClick: () => click(idx),
						className: "flex size-12 items-center justify-center rounded-lg transition-all hover:scale-95 md:size-14",
						style: {
							background: COLORS[state],
							border: `2px solid ${state > 0 ? COLORS[state] : "var(--color-line)"}`,
							boxShadow: state > 0 ? `0 0 10px ${COLORS[state]}88` : "none"
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg",
							children: state === 0 ? "⚫" : state === 1 ? "💡" : "🔥"
						})
					}, idx))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚫ Off" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💡 On" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🔥 Overcharge" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Clicking a node cycles it + neighbors through 3 states"
				})
			]
		})
	});
}
//#endregion
export { LightsOvercharge as default };
