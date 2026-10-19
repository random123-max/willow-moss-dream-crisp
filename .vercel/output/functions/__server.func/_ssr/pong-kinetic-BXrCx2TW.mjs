import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-DCD8IUw5.mjs";
import { t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pong-kinetic-BXrCx2TW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("pong-kinetic");
var W = 320;
var H = 400;
function PongKinetic() {
	const [score, setScore] = (0, import_react.useState)({
		p: 0,
		ai: 0
	});
	const [over, setOver] = (0, import_react.useState)(false);
	const [emp, setEmp] = (0, import_react.useState)(0);
	const canvas = (0, import_react.useRef)(null);
	const s = (0, import_react.useRef)({
		py: H / 2,
		ay: H / 2,
		bx: W / 2,
		by: H / 2,
		vx: 3,
		vy: 2,
		mass: 1,
		aiFrozen: 0,
		tilt: 0,
		trail: []
	});
	(0, import_react.useEffect)(() => {
		if (over) return;
		if (score.p >= 7 || score.ai >= 7) setOver(true);
	}, [score, over]);
	(0, import_react.useEffect)(() => {
		const move = (e) => {
			const r = canvas.current?.getBoundingClientRect();
			if (r) s.current.py = Math.max(20, Math.min(380, (e.clientY - r.top) / r.height * H));
		};
		const key = (e) => {
			if (e.key === "ArrowUp") s.current.py = Math.max(20, s.current.py - 30);
			if (e.key === "ArrowDown") s.current.py = Math.min(380, s.current.py + 30);
			if (e.key === " " && emp === 0) {
				s.current.aiFrozen = 80;
				setEmp(3);
			}
		};
		window.addEventListener("mousemove", move);
		window.addEventListener("keydown", key);
		return () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("keydown", key);
		};
	});
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			py: H / 2,
			ay: H / 2,
			bx: W / 2,
			by: H / 2,
			vx: 3,
			vy: 2,
			mass: 1,
			aiFrozen: 0,
			tilt: 0,
			trail: []
		};
		setScore({
			p: 0,
			ai: 0
		});
		setOver(false);
		setEmp(0);
	}, []);
	useGameLoop((dt) => {
		if (over) return;
		const st = s.current;
		st.bx += st.vx;
		st.by += st.vy;
		if (st.by < 8 || st.by > 392) st.vy *= -1;
		if (st.bx < 24 && Math.abs(st.by - st.py) < 30 && st.vx < 0) {
			st.vx = Math.abs(st.vx) * 1.05;
			st.vy += (st.by - st.py) * .1;
			st.mass += .1;
		}
		if (st.aiFrozen > 0) st.aiFrozen--;
		else st.ay += Math.sign(st.by - st.ay) * 3;
		if (st.bx > 296 && Math.abs(st.by - st.ay) < 30 && st.vx > 0) {
			st.vx = -Math.abs(st.vx) * 1.05;
			st.vy += (st.by - st.ay) * .1;
			st.mass += .1;
		}
		if (st.bx < 0) {
			setScore((sc) => ({
				...sc,
				ai: sc.ai + 1
			}));
			st.bx = W / 2;
			st.by = H / 2;
			st.vx = 3;
			st.mass = 1;
			st.trail = [];
		}
		if (st.bx > W) {
			setScore((sc) => ({
				...sc,
				p: sc.p + 1
			}));
			st.bx = W / 2;
			st.by = H / 2;
			st.vx = -3;
			st.mass = 1;
			st.trail = [];
		}
		if (emp > 0 && st.aiFrozen === 0) setEmp((e) => Math.max(0, e - 1));
		st.trail.push({
			x: st.bx,
			y: st.by
		});
		if (st.trail.length > 10) st.trail.shift();
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		const bg = c.createLinearGradient(0, 0, W, H);
		bg.addColorStop(0, "#1e1b4b");
		bg.addColorStop(1, "#4c1d95");
		c.fillStyle = bg;
		c.fillRect(0, 0, W, H);
		c.strokeStyle = "rgba(244,114,182,0.4)";
		c.setLineDash([6, 6]);
		c.beginPath();
		c.moveTo(W / 2, 0);
		c.lineTo(W / 2, H);
		c.stroke();
		c.setLineDash([]);
		st.trail.forEach((t, i) => {
			c.globalAlpha = i / st.trail.length * .5;
			c.fillStyle = G.accent;
			c.beginPath();
			c.arc(t.x, t.y, 4 + st.mass * 2, 0, Math.PI * 2);
			c.fill();
		});
		c.globalAlpha = 1;
		const r = 6 + st.mass * 2;
		c.fillStyle = "#fbbf24";
		c.shadowColor = "#fbbf24";
		c.shadowBlur = 18;
		c.beginPath();
		c.arc(st.bx, st.by, r, 0, Math.PI * 2);
		c.fill();
		c.shadowBlur = 0;
		c.fillStyle = "#f472b6";
		c.beginPath();
		c.roundRect(8, st.py - 30, 10, 60, 5);
		c.fill();
		c.fillStyle = st.aiFrozen > 0 ? "rgba(34,211,238,0.4)" : "#22d3ee";
		c.beginPath();
		c.roundRect(302, st.ay - 30, 10, 60, 5);
		c.fill();
		c.fillStyle = "#e9d5ff";
		c.font = "bold 22px 'IBM Plex Mono', monospace";
		c.textAlign = "center";
		c.fillText(`${score.p}`, W / 4, 36);
		c.fillText(`${score.ai}`, 3 * W / 4, 36);
		c.textAlign = "left";
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${score.p}:${score.ai}`,
		extra: emp > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "g3d-chip bg-ember/20 px-3 py-1 text-xs text-ember",
			children: ["EMP ", emp]
		}) : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				over && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl g3d-grad-text",
					children: score.p >= 7 ? "You Win! 🎉" : "AI Wins"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvas,
					width: W,
					height: H,
					className: "g3d-drop rounded-2xl",
					style: {
						border: `2px solid ${G.accent}55`,
						maxWidth: "100%",
						touchAction: "none",
						boxShadow: `0 0 40px ${G.accent}33`
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Mouse / ↑↓ to move · Space for EMP"
				})
			]
		})
	});
}
//#endregion
export { PongKinetic as default };
