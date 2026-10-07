import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys, r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asteroids-vector-BFP8n_iG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("asteroids-vector");
var W = 320;
var H = 400;
function AsteroidsVector() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-asteroids-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const canvas = (0, import_react.useRef)(null);
	const keys = useKeys();
	const s = (0, import_react.useRef)({
		ship: {
			x: W / 2,
			y: H / 2,
			vx: 0,
			vy: 0,
			rot: 0,
			shield: 3
		},
		bullets: [],
		asts: [],
		wells: [],
		fireCD: 0
	});
	(0, import_react.useEffect)(() => {
		const spawn = (r, x, y) => ({
			x: x ?? Math.random() * W,
			y: y ?? Math.random() * H,
			vx: (Math.random() - .5) * 2,
			vy: (Math.random() - .5) * 2,
			r,
			rot: 0,
			vrot: (Math.random() - .5) * .1
		});
		s.current.asts = [
			spawn(30),
			spawn(25),
			spawn(20),
			spawn(20)
		];
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			ship: {
				x: W / 2,
				y: H / 2,
				vx: 0,
				vy: 0,
				rot: 0,
				shield: 3
			},
			bullets: [],
			asts: [{
				x: 50,
				y: 50,
				vx: 1,
				vy: 1,
				r: 30,
				rot: 0,
				vrot: .05
			}, {
				x: 250,
				y: 200,
				vx: -1,
				vy: 1,
				r: 25,
				rot: 0,
				vrot: -.03
			}],
			wells: [],
			fireCD: 0
		};
		setScore(0);
		setOver(false);
	}, []);
	useGameLoop(() => {
		if (over) return;
		const st = s.current;
		const k = keys.current;
		if (k.has("arrowleft")) st.ship.rot -= .08;
		if (k.has("arrowright")) st.ship.rot += .08;
		if (k.has("arrowup")) {
			st.ship.vx += Math.cos(st.ship.rot) * .15;
			st.ship.vy += Math.sin(st.ship.rot) * .15;
		}
		st.ship.x = (st.ship.x + st.ship.vx + W) % W;
		st.ship.y = (st.ship.y + st.ship.vy + H) % H;
		st.ship.vx *= .99;
		st.ship.vy *= .99;
		if (st.fireCD > 0) st.fireCD--;
		if (k.has(" ") && st.fireCD === 0) {
			st.bullets.push({
				x: st.ship.x + Math.cos(st.ship.rot) * 10,
				y: st.ship.y + Math.sin(st.ship.rot) * 10
			});
			st.fireCD = 12;
		}
		st.bullets = st.bullets.map((b) => ({
			x: b.x + Math.cos(st.ship.rot) * 4,
			y: b.y + Math.sin(st.ship.rot) * 4
		})).filter((b) => b.x > 0 && b.x < W && b.y > 0 && b.y < H);
		st.wells.forEach((w) => {
			const dx = w.x - st.ship.x, dy = w.y - st.ship.y;
			const d = Math.hypot(dx, dy);
			if (d < w.r) {
				st.ship.vx += dx / d * .1;
				st.ship.vy += dy / d * .1;
			}
		});
		st.wells = st.wells.filter((w) => --w.life > 0);
		st.asts.forEach((a) => {
			a.x += a.vx;
			a.y += a.vy;
			a.rot += a.vrot;
			if (a.x < 0 || a.x > W) a.vx *= -1;
			if (a.y < 0 || a.y > H) a.vy *= -1;
		});
		st.bullets.forEach((b, bi) => {
			st.asts.forEach((a, ai) => {
				if (Math.hypot(b.x - a.x, b.y - a.y) < a.r) {
					st.bullets.splice(bi, 1);
					st.asts.splice(ai, 1);
					setScore((sc) => sc + Math.floor(30 / a.r * 10));
					if (a.r > 15) {
						st.asts.push({
							x: a.x,
							y: a.y,
							vx: a.vx + 1,
							vy: a.vy,
							r: a.r / 2,
							rot: 0,
							vrot: .05
						});
						st.asts.push({
							x: a.x,
							y: a.y,
							vx: a.vx - 1,
							vy: -a.vy,
							r: a.r / 2,
							rot: 0,
							vrot: -.05
						});
					}
					st.wells.push({
						x: a.x,
						y: a.y,
						r: 60,
						life: 60
					});
				}
			});
		});
		st.asts.forEach((a) => {
			if (Math.hypot(st.ship.x - a.x, st.ship.y - a.y) < a.r + 6) {
				st.ship.shield--;
				st.ship.vx += (st.ship.x - a.x) * .1;
				st.ship.vy += (st.ship.y - a.y) * .1;
				if (st.ship.shield <= 0) {
					setOver(true);
					if (score > best) setBest(score);
				}
			}
		});
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		st.wells.forEach((w) => {
			const grad = c.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
			grad.addColorStop(0, "#a855f722");
			grad.addColorStop(1, "transparent");
			c.fillStyle = grad;
			c.beginPath();
			c.arc(w.x, w.y, w.r, 0, Math.PI * 2);
			c.fill();
		});
		c.save();
		c.translate(st.ship.x, st.ship.y);
		c.rotate(st.ship.rot);
		c.strokeStyle = G.accent;
		c.lineWidth = 2;
		c.shadowColor = G.accent;
		c.shadowBlur = 8;
		c.beginPath();
		c.moveTo(10, 0);
		c.lineTo(-8, -6);
		c.lineTo(-4, 0);
		c.lineTo(-8, 6);
		c.closePath();
		c.stroke();
		if (k.has("arrowup")) {
			c.strokeStyle = "#ff6a3d";
			c.beginPath();
			c.moveTo(-4, 0);
			c.lineTo(-12, 0);
			c.stroke();
		}
		c.shadowBlur = 0;
		c.restore();
		c.fillStyle = "#fbbf24";
		st.bullets.forEach((b) => {
			c.beginPath();
			c.arc(b.x, b.y, 2, 0, Math.PI * 2);
			c.fill();
		});
		c.strokeStyle = "#8d968e";
		c.lineWidth = 1.5;
		st.asts.forEach((a) => {
			c.save();
			c.translate(a.x, a.y);
			c.rotate(a.rot);
			c.beginPath();
			for (let i = 0; i < 7; i++) {
				const ang = i / 7 * Math.PI * 2;
				const r = a.r * (.8 + Math.sin(i * 3) * .2);
				if (i === 0) c.moveTo(Math.cos(ang) * r, Math.sin(ang) * r);
				else c.lineTo(Math.cos(ang) * r, Math.sin(ang) * r);
			}
			c.closePath();
			c.stroke();
			c.restore();
		});
		c.fillStyle = "#8d968e";
		c.font = "12px monospace";
		c.fillText(`🛡️${st.ship.shield}`, 8, 15);
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
				children: "←/→ rotate · ↑ thrust · Space fire"
			})]
		})
	});
}
//#endregion
export { AsteroidsVector as default };
