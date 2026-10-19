import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-DCD8IUw5.mjs";
import { r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cyber-snake-Bpzm11kN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("cyber-snake");
var CELL = 26;
var COLS = 16;
var ROWS = 16;
var PWR_COLOR = {
	shield: "#38bdf8",
	ghost: "#c084fc",
	shrink: "#f472b6"
};
function CyberSnake() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-snake-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [paused, setPaused] = (0, import_react.useState)(false);
	const [pwr, setPwr] = (0, import_react.useState)(null);
	const state = (0, import_react.useRef)({
		snake: [{
			x: 8,
			y: 8
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
			x: 4,
			y: 4
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
				x: 8,
				y: 8
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
				x: 4,
				y: 4
			},
			power: null,
			powerTimer: 0,
			tick: 0
		};
		setScore(0);
		setOver(false);
		setPaused(false);
		setPwr(null);
	}, []);
	useGameLoop((dt) => {
		if (over || paused) return;
		state.current.tick += dt;
		if (state.current.tick < 110) return;
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
				setBest((b) => Math.max(b, score));
				return;
			}
			if (s.snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
				setOver(true);
				setBest((b) => Math.max(b, score));
				return;
			}
		}
		if (s.power === "ghost") {
			head.x = (head.x + COLS) % COLS;
			head.y = (head.y + ROWS) % ROWS;
		}
		if (s.power === "shield" && (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS)) {
			s.power = null;
			setPwr(null);
		}
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
			setPwr({
				kind: s.power,
				t: 50
			});
			if (s.power === "shrink" && s.snake.length > 3) s.snake.pop();
		} else s.snake.pop();
		if (s.powerTimer > 0) s.powerTimer--;
		if (s.powerTimer === 0 && s.power) {
			s.power = null;
			setPwr(null);
		}
		setPwr((p) => p ? {
			...p,
			t: s.powerTimer
		} : null);
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
			className: "flex flex-col items-center gap-4 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-center gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "g3d-chip bg-elevated px-3 py-1 font-mono text-xs text-fg",
							children: ["★ ", score]
						}),
						pwr && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "g3d-chip px-3 py-1 font-mono text-xs text-fg",
							style: {
								background: PWR_COLOR[pwr.kind] + "33",
								color: PWR_COLOR[pwr.kind]
							},
							children: [
								"⚡ ",
								pwr.kind,
								" (",
								pwr.t,
								")"
							]
						}),
						paused && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "g3d-chip bg-ember/20 px-3 py-1 text-xs text-ember",
							children: "PAUSED"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "g3d-scene g3d-drop",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "g3d-board relative",
						style: {
							width: 416,
							height: 416
						},
						children: [
							Array.from({ length: ROWS }, (_, r) => Array.from({ length: COLS }, (_, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute rounded-md",
								style: {
									left: c * CELL + 1,
									top: r * CELL + 1,
									width: 24,
									height: 24,
									background: (r + c) % 2 === 0 ? "rgba(99,102,241,0.16)" : "rgba(167,139,250,0.10)",
									border: "1px solid rgba(167,139,250,0.10)"
								}
							}, `f-${r}-${c}`))),
							state.current.snake.map((seg, i) => {
								const isHead = i === 0;
								const ghost = state.current.power === "ghost";
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "g3d-tile absolute",
									style: {
										left: seg.x * CELL + 2,
										top: seg.y * CELL + 2,
										width: 22,
										height: 22,
										["--g3d-top"]: G.accent,
										["--g3d-side"]: "#15803d",
										opacity: ghost ? .45 : 1,
										transform: isHead ? "translateZ(10px)" : "translateZ(4px)",
										boxShadow: isHead ? `0 0 18px ${G.accent}, inset 0 1px 0 rgba(255,255,255,.5)` : "inset 0 1px 0 rgba(255,255,255,.3)",
										transition: "left .1s, top .1s"
									},
									children: isHead && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 flex items-center justify-center text-[10px]",
										children: "🐍"
									})
								}, `s-${i}`);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "g3d-tile g3d-float absolute rounded-full",
								style: {
									left: state.current.food.x * CELL + 4,
									top: state.current.food.y * CELL + 4,
									width: 18,
									height: 18,
									["--g3d-top"]: "#fbbf24",
									["--g3d-side"]: "#d97706",
									transform: "translateZ(12px)",
									boxShadow: "0 0 20px #fbbf24"
								}
							})
						]
					})
				}),
				over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-1 rounded-2xl border border-line bg-elevated/90 px-6 py-4 text-center backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl g3d-grad-text",
						children: "Game Over"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Score: ",
							score,
							" · Best: ",
							best
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Arrow keys / swipe · Space to pause"
				})
			]
		})
	});
}
//#endregion
export { CyberSnake as default };
