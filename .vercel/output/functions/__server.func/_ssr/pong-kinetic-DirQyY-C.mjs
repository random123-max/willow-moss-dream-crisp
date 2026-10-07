import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pong-kinetic-DirQyY-C.js
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
	canvas.current?.getContext("2d");
	const s = (0, import_react.useRef)({
		py: H / 2,
		ay: H / 2,
		bx: W / 2,
		by: H / 2,
		vx: 3,
		vy: 2,
		mass: 1,
		aiFrozen: 0,
		tilt: 0
	});
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
			tilt: 0
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
		}
		if (emp > 0 && st.aiFrozen === 0) setEmp((e) => Math.max(0, e - 1));
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		c.strokeStyle = "#243240";
		c.setLineDash([4, 4]);
		c.beginPath();
		c.moveTo(W / 2, 0);
		c.lineTo(W / 2, H);
		c.stroke();
		c.setLineDash([]);
		const r = 6 + st.mass * 2;
		c.fillStyle = G.accent;
		c.shadowColor = G.accent;
		c.shadowBlur = 15;
		c.beginPath();
		c.arc(st.bx, st.by, r, 0, Math.PI * 2);
		c.fill();
		c.shadowBlur = 0;
		c.fillStyle = "#3ee0d0";
		c.fillRect(8, st.py - 30, 8, 60);
		c.fillStyle = st.aiFrozen > 0 ? "#ff6a3d44" : "#ff6a3d";
		c.fillRect(304, st.ay - 30, 8, 60);
		c.fillStyle = "#8d968e";
		c.font = "20px monospace";
		c.fillText(`${score.p}`, W / 4, 30);
		c.fillText(`${score.ai}`, 3 * W / 4, 30);
	});
	if (score.p >= 7 && !over) setOver(true);
	if (score.ai >= 7 && !over) setOver(true);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${score.p}:${score.ai}`,
		extra: emp > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs text-ember",
			children: ["EMP ", emp]
		}) : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				over && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					style: { color: score.p >= 7 ? G.accent : "#ff6a3d" },
					children: score.p >= 7 ? "You Win! 🎉" : "AI Wins"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvas,
					width: W,
					height: H,
					className: "rounded-lg border-2",
					style: {
						borderColor: G.accent + "44",
						maxWidth: "100%",
						touchAction: "none"
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
