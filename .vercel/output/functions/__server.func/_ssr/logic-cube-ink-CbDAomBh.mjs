import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/logic-cube-ink-CbDAomBh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("logic-cube-ink");
var W = 280;
var H = 280;
var CELL = 35;
var COLS = Math.floor(W / CELL);
var ROWS = Math.floor(H / CELL);
var FACE_SYMBOLS = [
	"◆",
	"▲",
	"●",
	"■",
	"★",
	"✦"
];
function LogicCubeInk() {
	const [painted, setPainted] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [moves, setMoves] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Roll the cube to paint the grid!");
	useKeys();
	const cube = (0, import_react.useRef)({
		bottom: 0,
		front: 1,
		right: 2
	});
	const goal = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const pos = (0, import_react.useRef)({
		x: 0,
		y: 7
	});
	(0, import_react.useEffect)(() => {
		const g = /* @__PURE__ */ new Set();
		for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (Math.random() < .5) g.add(`${r + 1},${c + 1}`);
		if (g.size === 0) g.add("1,1");
		goal.current = g;
	}, []);
	const roll = (0, import_react.useCallback)((dir) => {
		if (over) return;
		const c = cube.current;
		const p = pos.current;
		if (dir === "up" && p.y > 0) {
			p.y--;
			const oldBottom = c.bottom;
			c.bottom = c.front;
			c.front = 5 - oldBottom;
		} else if (dir === "down" && p.y < 7) {
			p.y++;
			const oldFront = c.front;
			c.front = c.bottom;
			c.bottom = 5 - oldFront;
		} else if (dir === "left" && p.x > 0) {
			p.x--;
			const oldBottom = c.bottom;
			c.bottom = c.right;
			c.right = 5 - oldBottom;
		} else if (dir === "right" && p.x < 7) {
			p.x++;
			const oldRight = c.right;
			c.right = c.bottom;
			c.bottom = 5 - oldRight;
		} else return;
		setPainted((prev) => {
			const np = new Set(prev);
			np.add(`${p.x},${p.y}:${c.bottom}`);
			return np;
		});
		setMoves((m) => m + 1);
	}, [over]);
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
				roll(map[e.key]);
			}
		};
		window.addEventListener("keydown", k);
		return () => window.removeEventListener("keydown", k);
	}, [roll]);
	const reset = (0, import_react.useCallback)(() => {
		pos.current = {
			x: 0,
			y: 7
		};
		cube.current = {
			bottom: 0,
			front: 1,
			right: 2
		};
		setPainted(/* @__PURE__ */ new Set());
		setMoves(0);
		setOver(false);
		setMsg("Roll the cube to paint the grid!");
		const g = /* @__PURE__ */ new Set();
		for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (Math.random() < .5) g.add(`${r + 1},${c + 1}`);
		if (g.size === 0) g.add("1,1");
		goal.current = g;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${moves} rolls`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Goal Pattern:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-5 gap-0.5",
						children: Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "size-4 rounded-sm",
							style: {
								background: goal.current.has(`${r},${c}`) ? G.accent + "44" : "var(--color-surface)",
								border: "1px solid var(--color-line)"
							}
						}, `${r}-${c}`)))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-0.5 rounded-lg border-2 p-1",
					style: {
						gridTemplateColumns: `repeat(${COLS}, 1fr)`,
						borderColor: G.accent + "44"
					},
					children: Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => {
						const isCube = pos.current.x === c && pos.current.y === r;
						const paintedHere = [...painted].find((p) => p.startsWith(`${c},${r}:`));
						const faceNum = paintedHere ? parseInt(paintedHere.split(":")[1]) : -1;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-center",
							style: {
								width: CELL,
								height: CELL,
								background: paintedHere ? G.accent + "11" : "var(--color-surface)",
								border: `1px solid ${isCube ? G.accent : "var(--color-line)"}`
							},
							children: [isCube && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								style: { color: G.accent },
								children: "🎲"
							}), paintedHere && !isCube && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: FACE_SYMBOLS[faceNum]
							})]
						}, `${r}-${c}`);
					}))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Bottom: ", FACE_SYMBOLS[cube.current.bottom]] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Front: ", FACE_SYMBOLS[cube.current.front]] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Right: ", FACE_SYMBOLS[cube.current.right]] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => roll("up"),
							className: "rounded border border-line px-4 py-1.5 text-sm",
							children: "↑"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => roll("left"),
							className: "rounded border border-line px-4 py-1.5 text-sm",
							children: "←"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => roll("down"),
							className: "rounded border border-line px-4 py-1.5 text-sm",
							children: "↓"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => roll("right"),
							className: "rounded border border-line px-4 py-1.5 text-sm",
							children: "→"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Arrow keys to roll. Bottom face paints the floor."
				})
			]
		})
	});
}
//#endregion
export { LogicCubeInk as default };
