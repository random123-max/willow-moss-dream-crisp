import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/flappy-steampunk-DWHOHGZD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("flappy-steampunk");
var W = 320;
var H = 400;
function FlappySteampunk() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-flappy-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [pressure, setPressure] = (0, import_react.useState)(0);
	const [overheat, setOverheat] = (0, import_react.useState)(false);
	const canvas = (0, import_react.useRef)(null);
	const s = (0, import_react.useRef)({
		y: H / 2,
		vy: 0,
		gaps: [],
		tick: 0,
		overheatTimer: 0
	});
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			y: H / 2,
			vy: 0,
			gaps: [{
				x: W,
				h: H / 2
			}],
			tick: 0,
			overheatTimer: 0
		};
		setScore(0);
		setPressure(0);
		setOverheat(false);
		setOver(false);
	}, []);
	const boost = (0, import_react.useCallback)(() => {
		if (over) return;
		if (s.current.overheatTimer > 0) return;
		s.current.vy = -4;
		setPressure((p) => {
			const np = p + 18;
			if (np >= 100) {
				setOverheat(true);
				s.current.overheatTimer = 80;
				setPressure(0);
			}
			return np >= 100 ? 0 : np;
		});
	}, [over]);
	(0, import_react.useEffect)(() => {
		const key = (e) => {
			if (e.key === " ") {
				e.preventDefault();
				boost();
			}
		};
		const tap = () => boost();
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
		if (over) return;
		const st = s.current;
		st.vy += .18;
		st.y += st.vy;
		if (st.overheatTimer > 0) {
			st.overheatTimer--;
			if (st.overheatTimer === 0) setOverheat(false);
		}
		st.tick++;
		if (st.tick % 90 === 0) st.gaps.push({
			x: W,
			h: 60 + Math.random() * 280
		});
		st.gaps.forEach((g) => g.x -= 2);
		st.gaps = st.gaps.filter((g) => g.x > -50);
		for (const g of st.gaps) if (g.x < 40 && g.x > -20) {
			if (st.y < g.h - 30 || st.y > g.h + 30) {
				setOver(true);
				if (score > best) setBest(score);
				return;
			}
			if (Math.abs(g.x - 20) < 2) setScore((sc) => sc + 1);
		}
		if (st.y < 0 || st.y > H) {
			setOver(true);
			if (score > best) setBest(score);
		}
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		c.fillStyle = "#243240";
		st.gaps.forEach((g) => {
			c.fillRect(g.x, 0, 40, g.h - 30);
			c.fillRect(g.x, g.h + 30, 40, H - g.h - 30);
		});
		c.fillStyle = "#fbbf24";
		st.gaps.forEach((g) => {
			c.beginPath();
			c.arc(g.x + 20, g.h - 15, 8, 0, Math.PI * 2);
			c.fill();
			c.beginPath();
			c.arc(g.x + 20, g.h + 15, 8, 0, Math.PI * 2);
			c.fill();
		});
		c.fillStyle = overheat ? "#ff6a3d" : G.accent;
		c.shadowColor = c.fillStyle;
		c.shadowBlur = 12;
		c.beginPath();
		c.arc(20, st.y, 10, 0, Math.PI * 2);
		c.fill();
		c.shadowBlur = 0;
		c.strokeStyle = "#243240";
		c.lineWidth = 2;
		c.beginPath();
		c.arc(290, 30, 20, 0, Math.PI * 2);
		c.stroke();
		c.strokeStyle = overheat ? "#ff6a3d" : G.accent;
		c.lineWidth = 3;
		c.beginPath();
		c.arc(290, 30, 16, -Math.PI / 2, -Math.PI / 2 + pressure / 100 * Math.PI * 2);
		c.stroke();
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
				overheat && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ember animate-pulse",
					children: "🔥 ENGINE OVERHEAT — gliding unpowered!"
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
					children: "Tap / Space to boost"
				})
			]
		})
	});
}
//#endregion
export { FlappySteampunk as default };
