import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys, r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/neon-maze-ghost-D6qPPxNq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("neon-maze-ghost");
var M = [
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	0,
	1,
	1,
	0,
	1,
	0,
	1,
	1,
	1,
	1,
	1,
	0,
	1,
	1,
	0,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	0,
	1,
	1,
	0,
	1,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	0,
	1,
	0,
	1,
	1,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	1,
	1,
	1,
	1,
	0,
	1,
	0,
	1,
	1,
	0,
	1,
	1,
	1,
	0,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	1,
	0,
	1,
	1,
	1,
	1,
	1,
	0,
	1,
	1,
	1,
	1,
	0,
	1,
	1,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	1,
	0,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1,
	1
];
var MW = 14;
function NeonMazeGhost() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-maze-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [traps, setTraps] = (0, import_react.useState)(3);
	const keys = useKeys();
	const s = (0, import_react.useRef)({
		px: 1,
		py: 1,
		ghosts: [
			{
				x: 12,
				y: 9,
				type: "chase",
				stun: 0
			},
			{
				x: 7,
				y: 5,
				type: "flank",
				stun: 0
			},
			{
				x: 1,
				y: 9,
				type: "ambush",
				stun: 0
			}
		],
		dots: /* @__PURE__ */ new Set(),
		placedTraps: /* @__PURE__ */ new Set(),
		tick: 0,
		dir: {
			x: 0,
			y: 0
		}
	});
	(0, import_react.useEffect)(() => {
		const dots = /* @__PURE__ */ new Set();
		for (let i = 0; i < M.length; i++) if (M[i] === 0) dots.add(i);
		s.current.dots = dots;
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		const dots = /* @__PURE__ */ new Set();
		for (let i = 0; i < M.length; i++) if (M[i] === 0) dots.add(i);
		s.current = {
			px: 1,
			py: 1,
			ghosts: [
				{
					x: 12,
					y: 9,
					type: "chase",
					stun: 0
				},
				{
					x: 7,
					y: 5,
					type: "flank",
					stun: 0
				},
				{
					x: 1,
					y: 9,
					type: "ambush",
					stun: 0
				}
			],
			dots,
			placedTraps: /* @__PURE__ */ new Set(),
			tick: 0,
			dir: {
				x: 0,
				y: 0
			}
		};
		setScore(0);
		setOver(false);
		setTraps(3);
	}, []);
	const placeTrap = (0, import_react.useCallback)(() => {
		if (traps <= 0) return;
		const idx = s.current.py * MW + s.current.px;
		if (M[idx] !== 0) return;
		s.current.placedTraps.add(idx);
		setTraps((t) => t - 1);
	}, [traps]);
	(0, import_react.useEffect)(() => {
		const k = (e) => {
			if (e.key === "Enter") placeTrap();
		};
		window.addEventListener("keydown", k);
		return () => window.removeEventListener("keydown", k);
	});
	useGameLoop(() => {
		if (over) return;
		const st = s.current;
		const k = keys.current;
		st.tick++;
		if (st.tick % 8 === 0) {
			if (k.has("arrowleft") && M[st.py * MW + (st.px - 1)] === 0) st.px--;
			if (k.has("arrowright") && M[st.py * MW + (st.px + 1)] === 0) st.px++;
			if (k.has("arrowup") && M[(st.py - 1) * MW + st.px] === 0) st.py--;
			if (k.has("arrowdown") && M[(st.py + 1) * MW + st.px] === 0) st.py++;
		}
		const idx = st.py * MW + st.px;
		if (st.dots.has(idx)) {
			st.dots.delete(idx);
			setScore((sc) => sc + 10);
		}
		if (st.dots.size === 0) {
			setOver(true);
			if (score > best) setBest(score);
		}
		if (st.tick % 15 === 0) st.ghosts.forEach((g) => {
			if (g.stun > 0) {
				g.stun--;
				return;
			}
			let dx = st.px - g.x, dy = st.py - g.y;
			if (g.type === "flank") {
				dx = -dx;
				dy = -dy;
			}
			const moves = [];
			if (dx > 0 && M[g.y * MW + (g.x + 1)] === 0) moves.push([1, 0]);
			if (dx < 0 && M[g.y * MW + (g.x - 1)] === 0) moves.push([-1, 0]);
			if (dy > 0 && M[(g.y + 1) * MW + g.x] === 0) moves.push([0, 1]);
			if (dy < 0 && M[(g.y - 1) * MW + g.x] === 0) moves.push([0, -1]);
			if (moves.length) {
				const [mx, my] = moves[Math.floor(Math.random() * moves.length)];
				g.x += mx;
				g.y += my;
			}
			const gidx = g.y * MW + g.x;
			if (st.placedTraps.has(gidx)) {
				g.stun = 30;
				st.placedTraps.delete(gidx);
			}
			if (g.x === st.px && g.y === st.py) {
				setOver(true);
				if (score > best) setBest(score);
			}
		});
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
			className: "flex flex-col items-center gap-2 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: ["Dots: ", score / 10]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: { color: G.accent },
						children: ["Traps: ", traps]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-px rounded-lg border-2 p-1",
					style: {
						gridTemplateColumns: `repeat(${MW}, 1fr)`,
						borderColor: G.accent + "44"
					},
					children: M.map((cell, i) => {
						const r = Math.floor(i / MW), c = i % MW;
						const isPlayer = s.current.px === c && s.current.py === r;
						const isGhost = s.current.ghosts.some((g) => g.x === c && g.y === r);
						const isDot = s.current.dots.has(i);
						const isTrap = s.current.placedTraps.has(i);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "size-5 md:size-6",
							style: {
								background: cell ? "var(--color-line)" : "var(--color-bg)",
								borderRadius: 2
							},
							children: [
								isPlayer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-3 mx-auto mt-0.5 rounded-full",
									style: {
										background: G.accent,
										boxShadow: `0 0 6px ${G.accent}`
									}
								}),
								isGhost && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-3 mx-auto mt-0.5 text-center text-sm",
									style: { opacity: s.current.ghosts.find((g) => g.x === c && g.y === r)?.stun ? .4 : 1 },
									children: "👻"
								}),
								isDot && !isPlayer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-1 mx-auto mt-1.5 rounded-full bg-muted" }),
								isTrap && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-2 mx-auto mt-1 rounded",
									style: { background: "#fbbf24" }
								})
							]
						}, i);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Arrow keys to move · Enter to place trap"
				})
			]
		})
	});
}
//#endregion
export { NeonMazeGhost as default };
