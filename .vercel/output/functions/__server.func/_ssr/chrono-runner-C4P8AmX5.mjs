import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chrono-runner-C4P8AmX5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("chrono-runner");
var W = 320;
var H = 400;
function ChronoRunner() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-chrono-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [running, setRunning] = (0, import_react.useState)(false);
	const canvas = (0, import_react.useRef)(null);
	const s = (0, import_react.useRef)({
		y: 340,
		vy: 0,
		ground: 360,
		obs: [],
		scroll: 0,
		speed: 2,
		jumpHeld: false,
		tick: 0
	});
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			y: 340,
			vy: 0,
			ground: 360,
			obs: [],
			scroll: 0,
			speed: 2,
			jumpHeld: false,
			tick: 0
		};
		setScore(0);
		setOver(false);
		setRunning(false);
	}, []);
	(0, import_react.useEffect)(() => {
		const key = (e) => {
			if (e.key === " " && !running) {
				e.preventDefault();
				setRunning(true);
			}
			if (e.key === " ") {
				e.preventDefault();
				if (s.current.y >= s.current.ground - 1) s.current.vy = -10;
			}
		};
		const tap = () => {
			if (!running) setRunning(true);
			if (s.current.y >= s.current.ground - 1) s.current.vy = -10;
		};
		window.addEventListener("keydown", key);
		window.addEventListener("click", tap);
		window.addEventListener("touchstart", tap);
		return () => {
			window.removeEventListener("keydown", key);
			window.removeEventListener("click", tap);
			window.removeEventListener("touchstart", tap);
		};
	});
	useGameLoop(() => {
		if (over || !running) return;
		const st = s.current;
		st.tick++;
		st.scroll += st.speed;
		setScore(Math.floor(st.scroll / 10));
		st.vy += .5;
		st.y += st.vy;
		if (st.y > st.ground) {
			st.y = st.ground;
			st.vy = 0;
		}
		st.speed = 2 + Math.min(4, st.scroll / 1e3);
		if (st.tick % Math.max(40, 80 - Math.floor(st.speed * 5)) === 0) {
			const types = [
				"spike",
				"block",
				"low"
			];
			const t = types[Math.floor(Math.random() * types.length)];
			st.obs.push({
				x: W,
				y: t === "low" ? st.ground - 30 : st.ground - 20,
				w: t === "block" ? 30 : 20,
				h: t === "block" ? 30 : 20,
				type: t
			});
		}
		st.obs.forEach((o) => o.x -= st.speed);
		st.obs = st.obs.filter((o) => o.x > -50);
		const px = 40, py = st.y, pw = 16, ph = 24;
		for (const o of st.obs) if (px < o.x + o.w && 56 > o.x && py < o.y + o.h && py + ph > o.y) {
			setOver(true);
			if (score > best) setBest(score);
		}
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		c.fillStyle = "#243240";
		c.fillRect(0, st.ground, W, 2);
		c.strokeStyle = "#24324055";
		for (let x = -st.scroll % 40; x < W; x += 40) {
			c.beginPath();
			c.moveTo(x, st.ground);
			c.lineTo(x - 20, H);
			c.stroke();
		}
		st.obs.forEach((o) => {
			c.fillStyle = o.type === "spike" ? "#ff6a3d" : o.type === "block" ? "#f59e0b" : "#a855f7";
			if (o.type === "spike") {
				c.beginPath();
				c.moveTo(o.x, o.y + o.h);
				c.lineTo(o.x + o.w / 2, o.y);
				c.lineTo(o.x + o.w, o.y + o.h);
				c.fill();
			} else c.fillRect(o.x, o.y, o.w, o.h);
		});
		c.fillStyle = G.accent;
		c.shadowColor = G.accent;
		c.shadowBlur = 8;
		c.fillRect(px, py, pw, ph);
		c.shadowBlur = 0;
		c.fillStyle = "#8d968e";
		c.font = "12px monospace";
		c.fillText(`Speed ${st.speed.toFixed(1)}`, 10, 15);
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
				!running && !over && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					style: { color: G.accent },
					children: "Tap or Space to start running!"
				}),
				over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-xl text-ember",
					children: ["Game Over — Score ", score]
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
					children: "Space / tap to jump · Time moves only when you do!"
				})
			]
		})
	});
}
//#endregion
export { ChronoRunner as default };
