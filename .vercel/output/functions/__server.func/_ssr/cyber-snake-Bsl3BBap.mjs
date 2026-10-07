import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cyber-snake-Bsl3BBap.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("cyber-snake");
var CELL = 16;
var COLS = 20;
var ROWS = 20;
function CyberSnake() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-snake-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const state = (0, import_react.useRef)({
		snake: [{
			x: 10,
			y: 10
		}],
		dir: {
			x: 1,
			y: 0
		},
		nextDir: {
			x: 1,
			y: 0
		},
		food: {
			x: 5,
			y: 5
		},
		power: null,
		powerTimer: 0,
		tick: 0
	});
	const onKey = (0, import_react.useCallback)((e) => {
		const d = state.current.dir;
		if (e.key === "ArrowUp" && d.y === 0) state.current.nextDir = {
			x: 0,
			y: -1
		};
		if (e.key === "ArrowDown" && d.y === 0) state.current.nextDir = {
			x: 0,
			y: 1
		};
		if (e.key === "ArrowLeft" && d.x === 0) state.current.nextDir = {
			x: -1,
			y: 0
		};
		if (e.key === "ArrowRight" && d.x === 0) state.current.nextDir = {
			x: 1,
			y: 0
		};
		if (e.key === " ") setPaused((p) => !p);
	}, []);
	(0, import_react.useEffect)(() => {
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onKey]);
	const reset = (0, import_react.useCallback)(() => {
		state.current = {
			snake: [{
				x: 10,
				y: 10
			}],
			dir: {
				x: 1,
				y: 0
			},
			nextDir: {
				x: 1,
				y: 0
			},
			food: {
				x: 5,
				y: 5
			},
			power: null,
			powerTimer: 0,
			tick: 0
		};
		setScore(0);
		setOver(false);
		setPaused(false);
	}, []);
	useGameLoop((dt) => {
		if (over || paused) return;
		state.current.tick += dt;
		if (state.current.tick < 100) return;
		state.current.tick = 0;
		const s = state.current;
		s.dir = s.nextDir;
		const head = {
			x: s.snake[0].x + s.dir.x,
			y: s.snake[0].y + s.dir.y
		};
		if (s.power !== "shield" && s.power !== "ghost") {
			if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
				setOver(true);
				if (score > best) setBest(score);
				return;
			}
			if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
				setOver(true);
				if (score > best) setBest(score);
				return;
			}
		}
		if (s.power === "ghost") {
			head.x = (head.x + COLS) % COLS;
			head.y = (head.y + ROWS) % ROWS;
		}
		if (s.power === "shield" && (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)) s.power = null;
		s.snake.unshift(head);
		if (head.x === s.food.x && head.y === s.food.y) {
			setScore((sc) => sc + 10);
			s.food = {
				x: Math.floor(Math.random() * COLS),
				y: Math.floor(Math.random() * ROWS)
			};
			const powers = [
				"shield",
				"ghost",
				"shrink"
			];
			s.power = powers[Math.floor(Math.random() * powers.length)];
			s.powerTimer = 50;
			if (s.power === "shrink" && s.snake.length > 3) s.snake.pop();
		} else s.snake.pop();
		if (s.powerTimer > 0) s.powerTimer--;
		if (s.powerTimer === 0) s.power = null;
	});
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
					className: "flex gap-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: ["Score: ", score]
						}),
						state.current.power && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: { color: G.accent },
							children: [
								"⚡ ",
								state.current.power,
								" (",
								state.current.powerTimer,
								")"
							]
						}),
						paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-ember",
							children: "PAUSED"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					style: {
						width: 320,
						height: 320
					},
					children: [Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => {
						const seg = state.current.snake.find((s) => s.x === c && s.y === r);
						const isHead = state.current.snake[0].x === c && state.current.snake[0].y === r;
						const isFood = state.current.food.x === c && state.current.food.y === r;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "absolute",
							style: {
								left: c * CELL,
								top: r * CELL,
								width: CELL,
								height: CELL
							},
							children: [seg && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `size-full rounded ${isHead ? "rounded-full" : ""}`,
								style: {
									background: G.accent,
									opacity: state.current.power === "ghost" ? .4 : 1,
									boxShadow: isHead ? `0 0 8px ${G.accent}` : "none"
								}
							}), isFood && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "size-full rounded-full",
								style: {
									background: "#ff6a3d",
									boxShadow: "0 0 8px #ff6a3d"
								}
							})]
						}, `${r}-${c}`);
					})), over && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center rounded-lg bg-bg/80",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl text-fg",
								children: "Game Over"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["Score: ", score]
							})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Arrow keys · Space to pause"
				})
			]
		})
	});
}
//#endregion
export { CyberSnake as default };
