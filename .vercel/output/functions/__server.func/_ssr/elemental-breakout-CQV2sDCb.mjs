import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/elemental-breakout-CQV2sDCb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("elemental-breakout");
var W = 320;
var H = 400;
function ElementalBreakout() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-breakout-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [frozen, setFrozen] = (0, import_react.useState)(0);
	const canvas = (0, import_react.useRef)(null);
	const s = (0, import_react.useRef)({
		px: W / 2,
		bx: W / 2,
		by: 370,
		vx: 2.5,
		vy: -2.5,
		bricks: []
	});
	const initBricks = (0, import_react.useCallback)(() => {
		const bricks = [];
		const types = [
			"normal",
			"ice",
			"fire",
			"iron"
		];
		for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) {
			const t = types[Math.floor(Math.random() * types.length)];
			bricks.push({
				x: c * 40 + 2,
				y: r * 20 + 30,
				w: 36,
				h: 16,
				type: t,
				hp: t === "iron" ? 3 : 1
			});
		}
		return bricks;
	}, []);
	(0, import_react.useEffect)(() => {
		s.current.bricks = initBricks();
		const move = (e) => {
			const r = canvas.current?.getBoundingClientRect();
			if (r) s.current.px = Math.max(30, Math.min(290, (e.clientX - r.left) / r.width * W));
		};
		const touch = (e) => {
			const r = canvas.current?.getBoundingClientRect();
			if (r) s.current.px = Math.max(30, Math.min(290, (e.touches[0].clientX - r.left) / r.width * W));
		};
		window.addEventListener("mousemove", move);
		window.addEventListener("touchmove", touch);
		return () => {
			window.removeEventListener("mousemove", move);
			window.removeEventListener("touchmove", touch);
		};
	});
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			px: W / 2,
			bx: W / 2,
			by: 370,
			vx: 2.5,
			vy: -2.5,
			bricks: initBricks()
		};
		setScore(0);
		setOver(false);
		setFrozen(0);
	}, []);
	useGameLoop(() => {
		if (over) return;
		const st = s.current;
		if (frozen > 0) setFrozen((f) => f - 1);
		else {
			st.bx += st.vx;
			st.by += st.vy;
			if (st.bx < 6 || st.bx > 314) st.vx *= -1;
			if (st.by < 6) st.vy *= -1;
			if (st.by > 380 && Math.abs(st.bx - st.px) < 35 && st.vy > 0) {
				st.vy = -Math.abs(st.vy);
				st.vx += (st.bx - st.px) * .05;
			}
			if (st.by > H) {
				setOver(true);
				if (score > best) setBest(score);
				return;
			}
			st.bricks = st.bricks.filter((b) => {
				if (st.bx > b.x && st.bx < b.x + b.w && st.by > b.y && st.by < b.y + b.h) {
					st.vy *= -1;
					b.hp--;
					if (b.hp <= 0) {
						setScore((sc) => sc + 10);
						if (b.type === "ice") setFrozen(60);
						if (b.type === "fire") st.bricks = st.bricks.filter((x) => Math.abs(x.y - b.y) > 20 || x === b);
						return false;
					}
					return true;
				}
				return true;
			});
			if (st.bricks.length === 0) {
				st.bricks = initBricks();
				setScore((sc) => sc + 50);
			}
		}
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		const colors = {
			normal: "#3ee0d0",
			ice: "#60a5fa",
			fire: "#ff6a3d",
			iron: "#94a3b8"
		};
		st.bricks.forEach((b) => {
			c.fillStyle = colors[b.type];
			c.globalAlpha = b.type === "iron" ? b.hp / 3 : 1;
			c.fillRect(b.x, b.y, b.w, b.h);
		});
		c.globalAlpha = 1;
		c.fillStyle = "#3ee0d0";
		c.shadowColor = "#3ee0d0";
		c.shadowBlur = 10;
		c.beginPath();
		c.arc(st.bx, st.by, 5, 0, Math.PI * 2);
		c.fill();
		c.shadowBlur = 0;
		c.fillStyle = frozen > 0 ? "#60a5fa" : "#ece7de";
		c.fillRect(st.px - 30, 388, 60, 6);
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
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				frozen > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-blue-400",
					children: "🧊 Paddle frozen!"
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
					children: "Mouse to move paddle"
				})
			]
		})
	});
}
//#endregion
export { ElementalBreakout as default };
