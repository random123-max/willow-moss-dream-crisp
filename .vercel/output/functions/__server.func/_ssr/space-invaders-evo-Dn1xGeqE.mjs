import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys, r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/space-invaders-evo-Dn1xGeqE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("space-invaders-evo");
var W = 320;
var H = 400;
var COLS = 8;
var ROWS = 4;
function SpaceInvadersEvo() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-invaders-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [fireRate, setFireRate] = (0, import_react.useState)(0);
	const canvas = (0, import_react.useRef)(null);
	const keys = useKeys();
	const s = (0, import_react.useRef)({
		px: W / 2,
		aliens: [],
		bullets: [],
		dir: 1,
		tick: 0,
		fireCD: 0,
		drop: 0
	});
	const initAliens = (0, import_react.useCallback)(() => {
		const aliens = [];
		for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) aliens.push({
			x: c * 36 + 20,
			y: r * 28 + 30,
			type: "normal",
			hp: 1
		});
		return aliens;
	}, []);
	(0, import_react.useEffect)(() => {
		s.current.aliens = initAliens();
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			px: W / 2,
			aliens: initAliens(),
			bullets: [],
			dir: 1,
			tick: 0,
			fireCD: 0,
			drop: 0
		};
		setScore(0);
		setOver(false);
		setFireRate(0);
	}, []);
	useGameLoop(() => {
		if (over) return;
		const st = s.current;
		const k = keys.current;
		if (k.has("arrowleft")) st.px = Math.max(15, st.px - 4);
		if (k.has("arrowright")) st.px = Math.min(305, st.px + 4);
		if (st.fireCD > 0) st.fireCD--;
		if (k.has(" ") && st.fireCD === 0) {
			st.bullets.push({
				x: st.px,
				y: 380,
				vy: -5,
				heavy: fireRate > 30
			});
			st.fireCD = Math.max(6, 15 - Math.floor(fireRate / 5));
			setFireRate((f) => f + 1);
		}
		st.bullets = st.bullets.map((b) => ({
			...b,
			y: b.y + b.vy
		})).filter((b) => b.y > 0 && b.y < H);
		st.tick++;
		if (st.tick % 30 === 0) {
			st.aliens.forEach((a) => {
				a.x += st.dir * 4;
			});
			const maxX = Math.max(...st.aliens.map((a) => a.x), 0);
			const minX = Math.min(...st.aliens.map((a) => a.x), W);
			if (maxX > 300 || minX < 20) {
				st.dir *= -1;
				st.aliens.forEach((a) => {
					a.y += 15;
				});
			}
		}
		st.bullets.forEach((b, bi) => {
			st.aliens.forEach((a, ai) => {
				if (Math.abs(b.x - a.x) < 15 && Math.abs(b.y - a.y) < 12) {
					st.bullets.splice(bi, 1);
					a.hp -= b.heavy ? 2 : 1;
					if (a.hp <= 0) {
						st.aliens.splice(ai, 1);
						setScore((sc) => sc + (a.type === "scout" ? 20 : a.type === "shielded" ? 15 : 10));
					}
				}
			});
		});
		if (fireRate > 30 && st.tick % 60 === 0 && st.aliens.length > 0) {
			const target = st.aliens[Math.floor(Math.random() * st.aliens.length)];
			if (fireRate > 50 && target.type === "normal") {
				target.type = "shielded";
				target.hp = 2;
			} else if (fireRate > 60 && Math.random() < .3 && target.type === "normal") {
				target.type = "scout";
				st.aliens.push({
					x: target.x + 30,
					y: target.y,
					type: "scout",
					hp: 1
				});
			}
		}
		if (st.aliens.length === 0) {
			s.current.aliens = initAliens();
			setScore((sc) => sc + 50);
		}
		if (st.aliens.some((a) => a.y > 370)) {
			setOver(true);
			if (score > best) setBest(score);
		}
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		st.aliens.forEach((a) => {
			const color = a.type === "shielded" ? "#60a5fa" : a.type === "scout" ? "#fbbf24" : "#ef4444";
			c.fillStyle = color;
			c.shadowColor = color;
			c.shadowBlur = 6;
			if (a.type === "shielded") {
				c.fillRect(a.x - 14, a.y - 10, 28, 20);
				c.fillStyle = "#071018";
				c.font = "10px monospace";
				c.fillText("🛡", a.x - 6, a.y + 4);
			} else if (a.type === "scout") {
				c.beginPath();
				c.arc(a.x, a.y, 8, 0, Math.PI * 2);
				c.fill();
			} else {
				c.font = "16px monospace";
				c.fillText("👾", a.x - 8, a.y + 8);
			}
		});
		c.shadowBlur = 0;
		c.fillStyle = G.accent;
		c.fillRect(st.px - 12, 384, 24, 6);
		c.beginPath();
		c.moveTo(st.px, 378);
		c.lineTo(st.px - 8, 384);
		c.lineTo(st.px + 8, 384);
		c.fill();
		c.fillStyle = "#fbbf24";
		st.bullets.forEach((b) => c.fillRect(b.x - 1, b.y - 4, 2, 8));
		c.fillStyle = fireRate > 50 ? "#ff6a3d" : "#3ee0d0";
		c.fillRect(0, 396, Math.min(W, fireRate * 3), 2);
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
					maxWidth: "100%"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "←/→ move · Space fire · Aliens mutate as you shoot!"
			})]
		})
	});
}
//#endregion
export { SpaceInvadersEvo as default };
