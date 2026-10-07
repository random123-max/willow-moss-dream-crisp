import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/steam-pipe-D7X2ySW4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("steam-pipe");
var SIZE = 5;
var PIPES = [
	"─",
	"│",
	"┌",
	"┐",
	"└",
	"┘",
	"├",
	"┤",
	"┬",
	"┴",
	"┼"
];
function initGrid() {
	const g = [];
	for (let r = 0; r < SIZE; r++) {
		const row = [];
		for (let c = 0; c < SIZE; c++) row.push({
			pipe: PIPES[Math.floor(Math.random() * PIPES.length)],
			rotation: Math.floor(Math.random() * 4)
		});
		g.push(row);
	}
	return g;
}
function SteamPipe() {
	const [grid, setGrid] = (0, import_react.useState)(initGrid);
	const [pressure, setPressure] = (0, import_react.useState)(0);
	const [score, setScore] = (0, import_react.useState)(100);
	const [over, setOver] = (0, import_react.useState)(false);
	const [flowing, setFlowing] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Rotate pipes to connect source to drain!");
	const [leaks, setLeaks] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			setPressure((p) => {
				const np = p + 5;
				if (np >= 100) {
					setOver(true);
					setMsg("Pressure overload! 💥");
				}
				return np;
			});
			setScore((s) => Math.max(0, s - leaks * 2));
		}, 1500);
		return () => clearInterval(t);
	}, [over, leaks]);
	const rotate = (0, import_react.useCallback)((r, c) => {
		if (over) return;
		setGrid((prev) => {
			const ng = prev.map((row) => row.map((cell) => ({ ...cell })));
			ng[r][c].rotation = (ng[r][c].rotation + 1) % 4;
			return ng;
		});
	}, [over]);
	const startFlow = (0, import_react.useCallback)(() => {
		setFlowing(true);
		setMsg("Checking connections...");
		setLeaks(Math.floor(Math.random() * 3));
		setTimeout(() => {
			setScore((s) => Math.max(0, s - leaks * 10));
			setMsg(leaks === 0 ? "Perfect flow! No leaks! 🎉" : `${leaks} leaks detected! Score reduced.`);
			setOver(true);
		}, 2e3);
	}, [leaks]);
	const reset = () => {
		setGrid(initGrid());
		setPressure(0);
		setScore(100);
		setOver(false);
		setFlowing(false);
		setLeaks(0);
		setMsg("Rotate pipes to connect source to drain!");
	};
	const getRotatedChar = (pipe, rotation) => {
		if (PIPES.indexOf(pipe) < 2) return pipe;
		return pipe;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${score}`,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs",
			style: { color: pressure > 70 ? "#ff6a3d" : G.accent },
			children: [
				"Pressure ",
				pressure,
				"%"
			]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg",
							children: "🔵 Source"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-5 gap-1 rounded-lg border-2 p-1",
							style: { borderColor: G.accent + "44" },
							children: grid.map((row, r) => row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: over,
								onClick: () => rotate(r, c),
								className: "flex size-10 items-center justify-center rounded font-mono text-lg transition-all hover:scale-95 md:size-12",
								style: {
									background: "var(--color-surface)",
									border: `1px solid ${G.accent}22`,
									transform: `rotate(${cell.rotation * 90}deg)`
								},
								children: getRotatedChar(cell.pipe, cell.rotation)
							}, `${r}-${c}`)))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg",
							children: "🔵 Drain"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: over || flowing,
					onClick: startFlow,
					className: "rounded-lg px-6 py-2 text-sm font-bold",
					style: {
						background: G.accent,
						color: "#071018"
					},
					children: "Start Flow"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Click pipes to rotate · Connect before pressure overloads!"
				})
			]
		})
	});
}
//#endregion
export { SteamPipe as default };
