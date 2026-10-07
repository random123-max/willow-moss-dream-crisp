import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/echo-shadow-B-19HOlp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("echo-shadow");
var W = 300;
var H = 360;
var LEVELS = [{
	platforms: [
		{
			x: 0,
			y: 340,
			w: 300
		},
		{
			x: 50,
			y: 260,
			w: 80
		},
		{
			x: 170,
			y: 200,
			w: 80
		},
		{
			x: 250,
			y: 140,
			w: 50
		}
	],
	switches: [{
		x: 260,
		y: 120
	}, {
		x: 20,
		y: 320
	}],
	exit: {
		x: 270,
		y: 80
	}
}];
function EchoShadow() {
	const [level] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Move both you and your shadow to switches!");
	const [switches, setSwitches] = (0, import_react.useState)([false, false]);
	const keys = useKeys();
	const s = (0, import_react.useRef)({
		px: 20,
		py: 320,
		pvx: 0,
		pvy: 0,
		grounded: true,
		sx: 280,
		sy: 320,
		svx: 0,
		svy: 0,
		sgrounded: true,
		history: [],
		tick: 0
	});
	const canvas = (0, import_react.useRef)(null);
	const lvl = LEVELS[level];
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			px: 20,
			py: 320,
			pvx: 0,
			pvy: 0,
			grounded: true,
			sx: 280,
			sy: 320,
			svx: 0,
			svy: 0,
			sgrounded: true,
			history: [],
			tick: 0
		};
		setOver(false);
		setWon(false);
		setSwitches([false, false]);
		setMsg("Move both you and your shadow to switches!");
	}, []);
	(0, import_react.useEffect)(() => {
		let raf;
		function loop() {
			if (over) return;
			const st = s.current;
			const k = keys.current;
			st.tick++;
			if (k.has("arrowleft")) st.pvx = -3;
			else if (k.has("arrowright")) st.pvx = 3;
			else st.pvx *= .8;
			if (k.has("arrowup") && st.grounded) {
				st.pvy = -8;
				st.grounded = false;
			}
			st.pvy += .4;
			st.px += st.pvx;
			st.py += st.pvy;
			st.grounded = false;
			for (const p of lvl.platforms) if (st.px > p.x - 8 && st.px < p.x + p.w + 8 && st.py > p.y - 12 && st.py < p.y && st.pvy >= 0) {
				st.py = p.y - 12;
				st.pvy = 0;
				st.grounded = true;
			}
			if (st.py > H) {
				st.py = 320;
				st.px = 20;
				st.pvy = 0;
			}
			st.history.push({
				x: st.px,
				y: st.py
			});
			if (st.history.length > 120) st.history.shift();
			const shadowIdx = st.history.length - 1 - Math.min(st.history.length - 1, Math.floor(st.tick / 2));
			const shadowPos = st.history[shadowIdx] ?? {
				x: 280,
				y: 320
			};
			st.sx = shadowPos.x;
			st.sy = shadowPos.y;
			const ns = [...switches];
			lvl.switches.forEach((sw, i) => {
				if (Math.abs(st.px - sw.x) < 15 && Math.abs(st.py - sw.y) < 15) ns[i] = true;
				if (Math.abs(st.sx - (W - sw.x)) < 15 && Math.abs(st.sy - sw.y) < 15) ns[i] = true;
			});
			if (ns.some((v, i) => v !== switches[i])) setSwitches(ns);
			if (ns.every((v) => v)) {
				setWon(true);
				setOver(true);
				setMsg("Both switches activated! 🎉");
			}
			const c = canvas.current?.getContext("2d");
			if (!c) return;
			c.fillStyle = "#071018";
			c.fillRect(0, 0, W, H);
			c.fillStyle = "#243240";
			lvl.platforms.forEach((p) => c.fillRect(p.x, p.y, p.w, 6));
			lvl.switches.forEach((sw, i) => {
				c.fillStyle = switches[i] ? G.accent : "#ff6a3d";
				c.beginPath();
				c.arc(sw.x, sw.y, 8, 0, Math.PI * 2);
				c.fill();
				c.fillStyle = switches[i] ? G.accent + "44" : "#ff6a3d44";
				c.beginPath();
				c.arc(W - sw.x, sw.y, 8, 0, Math.PI * 2);
				c.fill();
			});
			c.fillStyle = G.accent + "88";
			c.fillRect(lvl.exit.x - 10, lvl.exit.y - 10, 20, 20);
			c.fillStyle = G.accent;
			c.beginPath();
			c.arc(st.px, st.py, 8, 0, Math.PI * 2);
			c.fill();
			c.fillStyle = "#6366f188";
			c.beginPath();
			c.arc(st.sx, st.sy, 8, 0, Math.PI * 2);
			c.fill();
			raf = requestAnimationFrame(loop);
		}
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: switches.filter((s) => s).length + "/2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-2 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
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
					children: "←/→ move · ↑ jump · Shadow mimics in reverse!"
				})
			]
		})
	});
}
//#endregion
export { EchoShadow as default };
