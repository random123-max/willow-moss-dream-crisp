import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys, r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lunar-lander-CAPci56r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("lunar-lander");
var W = 320;
var H = 400;
function LunarLander() {
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [best, setBest] = usePersist("arcade-lander-best", Infinity);
	const [fuel, setFuel] = (0, import_react.useState)(100);
	const keys = useKeys();
	const canvas = (0, import_react.useRef)(null);
	const s = (0, import_react.useRef)({
		x: 160,
		y: 50,
		vx: .5,
		vy: 0,
		rot: 0,
		wind: .02,
		thrusting: false,
		pad: {
			x: 120,
			w: 80
		},
		terrain: [],
		damage: {
			l: 100,
			r: 100,
			t: 100,
			b: 100
		},
		tick: 0
	});
	(0, import_react.useEffect)(() => {
		const t = [];
		for (let i = 0; i < W; i++) t.push(340 - Math.sin(i * .03) * 30 - Math.random() * 10);
		s.current.terrain = t;
		s.current.pad = {
			x: 100 + Math.random() * 80,
			w: 80
		};
		for (let i = s.current.pad.x; i < s.current.pad.x + s.current.pad.w; i++) t[Math.floor(i)] = 320;
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			x: 160,
			y: 50,
			vx: .5,
			vy: 0,
			rot: 0,
			wind: .02,
			thrusting: false,
			pad: {
				x: 100 + Math.random() * 80,
				w: 80
			},
			terrain: (() => {
				const t = [];
				for (let i = 0; i < W; i++) t.push(340 - Math.sin(i * .03) * 30 - Math.random() * 10);
				for (let i = s.current.pad.x; i < s.current.pad.x + s.current.pad.w; i++) t[Math.floor(i)] = 320;
				return t;
			})(),
			damage: {
				l: 100,
				r: 100,
				t: 100,
				b: 100
			},
			tick: 0
		};
		setFuel(100);
		setOver(false);
		setWon(false);
	}, []);
	useGameLoop(() => {
		if (over) return;
		const st = s.current;
		const k = keys.current;
		if (k.has("arrowleft")) st.rot -= .05;
		if (k.has("arrowright")) st.rot += .05;
		st.thrusting = k.has("arrowup") && fuel > 0;
		if (st.thrusting) {
			st.vx += Math.sin(st.rot) * .08;
			st.vy -= Math.cos(st.rot) * .15;
			setFuel((f) => Math.max(0, f - .3));
		}
		st.vx += st.wind * Math.sin(st.tick);
		st.vy += .06;
		st.x += st.vx;
		st.y += st.vy;
		if (st.x < 0) st.x = 0;
		if (st.x > W) st.x = W;
		st.tick++;
		const groundY = st.terrain[Math.floor(st.x)] ?? 340;
		if (st.y >= groundY - 10) {
			const onPad = st.x >= st.pad.x && st.x <= st.pad.x + st.pad.w;
			const safeSpeed = Math.abs(st.vy) < 2 && Math.abs(st.vx) < 1 && Math.abs(st.rot) < .3;
			if (onPad && safeSpeed) {
				setWon(true);
				setOver(true);
				const score = Math.round(fuel);
				if (score < best) setBest(score);
			} else {
				const ang = Math.abs(st.rot);
				if (ang > .5) st.damage.l = Math.max(0, st.damage.l - 30);
				if (ang > 1) st.damage.r = Math.max(0, st.damage.r - 30);
				if (Math.abs(st.vy) > 3) st.damage.b = Math.max(0, st.damage.b - 40);
				if (Math.abs(st.vx) > 2) {
					st.damage.l -= 20;
					st.damage.r -= 20;
				}
				setOver(true);
			}
		}
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		c.fillStyle = "#1a2a38";
		c.beginPath();
		c.moveTo(0, H);
		st.terrain.forEach((ty, i) => c.lineTo(i, ty));
		c.lineTo(W, H);
		c.fill();
		c.fillStyle = G.accent;
		c.fillRect(st.pad.x, st.terrain[Math.floor(st.pad.x)] - 2, st.pad.w, 4);
		c.fillStyle = G.accent + "33";
		c.fillRect(st.pad.x, 0, st.pad.w, H);
		c.save();
		c.translate(st.x, st.y);
		c.rotate(st.rot);
		c.strokeStyle = "#ece7de";
		c.lineWidth = 2;
		c.beginPath();
		c.moveTo(0, -8);
		c.lineTo(-6, 6);
		c.lineTo(-3, 4);
		c.lineTo(3, 4);
		c.lineTo(6, 6);
		c.closePath();
		c.stroke();
		if (st.thrusting) {
			c.fillStyle = "#ff6a3d";
			c.beginPath();
			c.moveTo(-3, 5);
			c.lineTo(0, 12 + Math.random() * 4);
			c.lineTo(3, 5);
			c.fill();
		}
		c.restore();
		c.fillStyle = "#8d968e";
		c.font = "10px monospace";
		c.fillText(`Fuel: ${Math.round(fuel)}`, 8, 15);
		c.fillText(`Vy: ${st.vy.toFixed(1)}`, 8, 28);
		c.fillText(`Vx: ${st.vx.toFixed(1)}`, 8, 41);
		c.fillText(`Ang: ${(st.rot * 180 / Math.PI).toFixed(0)}°`, 8, 54);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `⛽${Math.round(fuel)}`,
		best: best === Infinity ? void 0 : `⛽${best}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2 p-4 pt-6",
			children: [
				won && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					style: { color: G.accent },
					children: "Safe landing! 🎉"
				}),
				over && !won && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl text-ember",
					children: "Crash! 💥"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvas,
					width: W,
					height: H,
					className: "rounded-lg border-2",
					style: {
						borderColor: G.accent + "44",
						maxWidth: "100%"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "↑ thrust · ←/→ rotate · Land soft on green pad"
				})
			]
		})
	});
}
//#endregion
export { LunarLander as default };
