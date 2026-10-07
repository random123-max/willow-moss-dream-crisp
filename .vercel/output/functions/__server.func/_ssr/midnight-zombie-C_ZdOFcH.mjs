import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys, r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/midnight-zombie-C_ZdOFcH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("midnight-zombie");
var W = 320;
var H = 400;
function MidnightZombie() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-zombie-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [battery, setBattery] = (0, import_react.useState)(100);
	const [ammo, setAmmo] = (0, import_react.useState)(15);
	const keys = useKeys();
	const canvas = (0, import_react.useRef)(null);
	const mouse = (0, import_react.useRef)({
		x: W / 2,
		y: H / 2
	});
	const s = (0, import_react.useRef)({
		x: W / 2,
		y: H / 2,
		zombies: [],
		bullets: [],
		noise: 0,
		tick: 0,
		fireCD: 0
	});
	(0, import_react.useEffect)(() => {
		const move = (e) => {
			const r = canvas.current?.getBoundingClientRect();
			if (r) mouse.current = {
				x: (e.clientX - r.left) / r.width * W,
				y: (e.clientY - r.top) / r.height * H
			};
		};
		const click = () => {
			if (over || s.current.fireCD > 0 || ammo <= 0) return;
			const dx = mouse.current.x - s.current.x, dy = mouse.current.y - s.current.y;
			const d = Math.hypot(dx, dy) || 1;
			s.current.bullets.push({
				x: s.current.x,
				y: s.current.y,
				vx: dx / d * 6,
				vy: dy / d * 6
			});
			setAmmo((a) => a - 1);
			s.current.fireCD = 10;
			s.current.noise = 30;
		};
		window.addEventListener("mousemove", move);
		window.addEventListener("mousedown", click);
		return () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mousedown", click);
		};
	});
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			x: W / 2,
			y: H / 2,
			zombies: [],
			bullets: [],
			noise: 0,
			tick: 0,
			fireCD: 0
		};
		setScore(0);
		setBattery(100);
		setAmmo(15);
		setOver(false);
	}, []);
	useGameLoop(() => {
		if (over) return;
		const st = s.current;
		const k = keys.current;
		st.tick++;
		if (st.fireCD > 0) st.fireCD--;
		if (k.has("w")) st.y = Math.max(10, st.y - 2);
		if (k.has("s")) st.y = Math.min(390, st.y + 2);
		if (k.has("a")) st.x = Math.max(10, st.x - 2);
		if (k.has("d")) st.x = Math.min(310, st.x + 2);
		if (st.tick % 30 === 0) setBattery((b) => Math.max(0, b - 1));
		if (battery <= 0) {
			setOver(true);
			if (score > best) setBest(score);
		}
		const spawnRate = st.noise > 0 ? .04 : .015;
		if (Math.random() < spawnRate) {
			const side = Math.floor(Math.random() * 4);
			const x = side === 0 ? 0 : side === 1 ? W : Math.random() * W;
			const y = side < 2 ? Math.random() * H : side === 2 ? 0 : H;
			st.zombies.push({
				x,
				y,
				vx: 0,
				vy: 0
			});
		}
		if (st.noise > 0) st.noise--;
		st.zombies.forEach((z) => {
			const dx = st.x - z.x, dy = st.y - z.y;
			const d = Math.hypot(dx, dy) || 1;
			z.vx = dx / d * .8;
			z.vy = dy / d * .8;
			z.x += z.vx;
			z.y += z.vy;
			if (d < 12) {
				setOver(true);
				if (score > best) setBest(score);
			}
		});
		st.bullets = st.bullets.map((b) => ({
			...b,
			x: b.x + b.vx,
			y: b.vy + b.vy
		})).filter((b) => b.x > 0 && b.x < W && b.y > 0 && b.y < H);
		st.bullets = st.bullets.filter((b) => {
			for (let i = 0; i < st.zombies.length; i++) if (Math.hypot(b.x - st.zombies[i].x, b.y - st.zombies[i].y) < 12) {
				st.zombies.splice(i, 1);
				setScore((sc) => sc + 15);
				return false;
			}
			return true;
		});
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		if (battery > 0) {
			const ang = Math.atan2(mouse.current.y - st.y, mouse.current.x - st.x);
			const grad = c.createRadialGradient(st.x, st.y, 0, st.x, st.y, 120);
			grad.addColorStop(0, "rgba(255,255,200,0.15)");
			grad.addColorStop(1, "transparent");
			c.save();
			c.beginPath();
			c.moveTo(st.x, st.y);
			c.arc(st.x, st.y, 120, ang - .5, ang + .5);
			c.closePath();
			c.fillStyle = grad;
			c.fill();
			c.restore();
		}
		c.fillStyle = G.accent;
		c.beginPath();
		c.arc(st.x, st.y, 6, 0, Math.PI * 2);
		c.fill();
		c.strokeStyle = "#ece7de";
		c.beginPath();
		c.moveTo(st.x, st.y);
		c.lineTo(mouse.current.x, mouse.current.y);
		c.stroke();
		c.fillStyle = "#84cc16";
		st.zombies.forEach((z) => {
			c.beginPath();
			c.arc(z.x, z.y, 5, 0, Math.PI * 2);
			c.fill();
		});
		c.fillStyle = "#fbbf24";
		st.bullets.forEach((b) => {
			c.beginPath();
			c.arc(b.x, b.y, 2, 0, Math.PI * 2);
			c.fill();
		});
		c.fillStyle = "#8d968e";
		c.font = "9px monospace";
		c.fillText(`🔋${Math.round(battery)} 🔫${ammo} Score:${score}`, 8, 12);
		if (st.noise > 0) {
			c.fillStyle = "#ff6a3d";
			c.fillText("💥 NOISE!", 8, 24);
		}
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
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvas,
				width: W,
				height: H,
				className: "rounded-lg border-2",
				style: {
					borderColor: G.accent + "44",
					maxWidth: "100%",
					cursor: "crosshair"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "WASD move · Mouse aim · Click shoot"
			})]
		})
	});
}
//#endregion
export { MidnightZombie as default };
