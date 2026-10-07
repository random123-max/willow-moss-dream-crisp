import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys, r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orbital-dogfight-CwE-GzG-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("orbital-dogfight");
var W = 320;
var H = 400;
function OrbitalDogfight() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-dogfight-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const keys = useKeys();
	const canvas = (0, import_react.useRef)(null);
	const s = (0, import_react.useRef)({
		x: W / 2,
		y: H / 2,
		vx: 0,
		vy: 0,
		ammo: 20,
		fuel: 100,
		heat: 0,
		vents: false,
		enemies: [],
		bullets: [],
		missiles: [],
		lightning: 0,
		fireCD: 0,
		tick: 0
	});
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			x: W / 2,
			y: H / 2,
			vx: 0,
			vy: 0,
			ammo: 20,
			fuel: 100,
			heat: 0,
			vents: false,
			enemies: [{
				x: 50,
				y: 50,
				vx: 1,
				vy: 1,
				hp: 2
			}, {
				x: 270,
				y: 100,
				vx: -1,
				vy: 1,
				hp: 2
			}],
			bullets: [],
			missiles: [],
			lightning: 0,
			fireCD: 0,
			tick: 0
		};
		setScore(0);
		setOver(false);
	}, []);
	useGameLoop(() => {
		if (over) return;
		const st = s.current;
		const k = keys.current;
		st.tick++;
		if (k.has("w") && st.fuel > 0) {
			st.vy -= .2;
			st.fuel -= .15;
		}
		if (k.has("s") && st.fuel > 0) {
			st.vy += .2;
			st.fuel -= .15;
		}
		if (k.has("a") && st.fuel > 0) {
			st.vx -= .2;
			st.fuel -= .15;
		}
		if (k.has("d") && st.fuel > 0) {
			st.vx += .2;
			st.fuel -= .15;
		}
		st.vents = k.has("shift");
		st.vx *= .97;
		st.vy *= .97;
		st.x = Math.max(10, Math.min(310, st.x + st.vx));
		st.y = Math.max(10, Math.min(390, st.y + st.vy));
		if (st.vents) st.heat = Math.max(0, st.heat - .5);
		else st.heat += .1;
		if (st.heat > 100) st.heat = 100;
		if (st.fireCD > 0) st.fireCD--;
		if (k.has(" ") && st.ammo > 0 && st.fireCD === 0 && st.heat < 80) {
			st.bullets.push({
				x: st.x,
				y: st.y - 10,
				vx: st.vx,
				vy: -4,
				mine: true
			});
			st.ammo--;
			st.heat += 5;
			st.fireCD = 8;
		}
		st.bullets = st.bullets.map((b) => ({
			...b,
			x: b.x + b.vx,
			y: b.y + b.vy
		})).filter((b) => b.y > 0 && b.y < H);
		st.enemies.forEach((e) => {
			e.x += e.vx;
			e.y += e.vy;
			if (e.x < 20 || e.x > 300) e.vx *= -1;
			if (e.y < 20 || e.y > 380) e.vy *= -1;
		});
		st.bullets = st.bullets.filter((b) => {
			for (const e of st.enemies) if (Math.hypot(b.x - e.x, b.y - e.y) < 15) {
				e.hp--;
				if (e.hp <= 0) {
					st.enemies = st.enemies.filter((x) => x !== e);
					setScore((sc) => sc + 25);
					st.enemies.push({
						x: Math.random() * W,
						y: 20,
						vx: (Math.random() - .5) * 2,
						vy: 1,
						hp: 2
					});
				}
				return false;
			}
			return true;
		});
		if (st.tick % 120 === 0 && st.enemies.length > 0) {
			const e = st.enemies[Math.floor(Math.random() * st.enemies.length)];
			st.missiles.push({
				x: e.x,
				y: e.y,
				tx: st.x,
				ty: st.y
			});
		}
		st.missiles = st.missiles.map((m) => {
			const dx = st.x - m.x, dy = st.y - m.y;
			const d = Math.hypot(dx, dy) || 1;
			return {
				...m,
				x: m.x + dx / d * 1.5,
				y: m.y + dy / d * 1.5
			};
		}).filter((m) => {
			if (Math.hypot(m.x - st.x, m.y - st.y) < 10) {
				setOver(true);
				if (score > best) setBest(score);
				return false;
			}
			return m.x > 0 && m.x < W && m.y > 0 && m.y < H;
		});
		if (st.tick % 200 === 0 && Math.random() < .5) st.lightning = 5;
		if (st.lightning > 0) {
			st.lightning--;
			if (Math.abs(st.x - W / 2) < 30 && st.lightning === 4) {
				setOver(true);
				if (score > best) setBest(score);
			}
		}
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		if (st.lightning > 0) {
			c.fillStyle = "#ffffff10";
			c.fillRect(0, 0, W, H);
			c.strokeStyle = "#ffffff66";
			c.beginPath();
			c.moveTo(Math.random() * W, 0);
			c.lineTo(Math.random() * W, H);
			c.stroke();
		}
		c.fillStyle = "#ff6a3d";
		st.enemies.forEach((e) => {
			c.beginPath();
			c.arc(e.x, e.y, 8, 0, Math.PI * 2);
			c.fill();
			c.fillStyle = "#071018";
			c.font = "10px monospace";
			c.fillText("✈", e.x - 4, e.y + 3);
			c.fillStyle = "#ff6a3d";
		});
		c.fillStyle = G.accent;
		c.shadowColor = G.accent;
		c.shadowBlur = 8;
		c.beginPath();
		c.arc(st.x, st.y, 6, 0, Math.PI * 2);
		c.fill();
		c.shadowBlur = 0;
		c.fillStyle = "#fbbf24";
		st.bullets.forEach((b) => c.fillRect(b.x - 1, b.y, 2, 6));
		c.fillStyle = "#ef4444";
		st.missiles.forEach((m) => c.beginPath());
		st.missiles.forEach((m) => {
			c.beginPath();
			c.arc(m.x, m.y, 3, 0, Math.PI * 2);
			c.fill();
		});
		c.fillStyle = "#8d968e";
		c.font = "9px monospace";
		c.fillText(`Ammo:${st.ammo} Fuel:${Math.round(st.fuel)} Heat:${Math.round(st.heat)}`, 8, 12);
		if (st.vents) c.fillText("VENTS OPEN", 8, 24);
		if (st.heat > 80) {
			c.fillStyle = "#ff6a3d";
			c.fillText("⚠ OVERHEAT!", 8, 36);
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
					maxWidth: "100%"
				}
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted",
				children: "WASD fly · Space fire · Shift vents"
			})]
		})
	});
}
//#endregion
export { OrbitalDogfight as default };
