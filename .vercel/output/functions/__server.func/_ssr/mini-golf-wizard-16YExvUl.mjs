import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mini-golf-wizard-16YExvUl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("mini-golf-wizard");
var W = 320;
var H = 360;
var COURSES = [
	{
		ball: {
			x: 40,
			y: 300
		},
		hole: {
			x: 280,
			y: 60
		},
		walls: [{
			x: 100,
			y: 120,
			w: 120,
			h: 10
		}],
		wells: [{
			x: 160,
			y: 200,
			r: 40
		}],
		ice: [],
		portals: []
	},
	{
		ball: {
			x: 40,
			y: 300
		},
		hole: {
			x: 280,
			y: 60
		},
		walls: [],
		wells: [],
		ice: [{
			x: 80,
			y: 200,
			w: 160,
			h: 40
		}],
		portals: [{
			a: {
				x: 100,
				y: 280
			},
			b: {
				x: 240,
				y: 80
			}
		}]
	},
	{
		ball: {
			x: 40,
			y: 300
		},
		hole: {
			x: 280,
			y: 60
		},
		walls: [{
			x: 140,
			y: 0,
			w: 10,
			h: 200
		}, {
			x: 60,
			y: 200,
			w: 80,
			h: 10
		}],
		wells: [{
			x: 220,
			y: 200,
			r: 35
		}],
		ice: [],
		portals: []
	}
];
function MiniGolfWizard() {
	const [courseIdx, setCourseIdx] = (0, import_react.useState)(0);
	const [strokes, setStrokes] = (0, import_react.useState)(0);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-golf-best", 999);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Drag from the ball to aim!");
	const canvas = (0, import_react.useRef)(null);
	const s = (0, import_react.useRef)({
		ball: {
			x: 40,
			y: 300,
			vx: 0,
			vy: 0,
			spin: 0
		},
		dragging: false,
		dragStart: {
			x: 0,
			y: 0
		},
		stopped: true
	});
	const course = COURSES[courseIdx];
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			ball: {
				x: COURSES[0].ball.x,
				y: COURSES[0].ball.y,
				vx: 0,
				vy: 0,
				spin: 0
			},
			dragging: false,
			dragStart: {
				x: 0,
				y: 0
			},
			stopped: true
		};
		setCourseIdx(0);
		setStrokes(0);
		setTotal(0);
		setOver(false);
		setMsg("Drag from the ball to aim!");
	}, []);
	const nextHole = (0, import_react.useCallback)(() => {
		const ni = (courseIdx + 1) % COURSES.length;
		setCourseIdx(ni);
		setTotal((t) => t + strokes);
		setStrokes(0);
		s.current.ball = {
			x: COURSES[ni].ball.x,
			y: COURSES[ni].ball.y,
			vx: 0,
			vy: 0,
			spin: 0
		};
		s.current.stopped = true;
		setMsg(`Hole ${ni + 1} — drag to aim!`);
		if (ni === 0 && over) {
			if (total + strokes < best) setBest(total + strokes);
		}
	}, [
		courseIdx,
		strokes,
		total,
		best,
		over
	]);
	(0, import_react.useEffect)(() => {
		const getPos = (e) => {
			const r = canvas.current?.getBoundingClientRect();
			const ev = "touches" in e ? e.touches[0] : e;
			if (r) return {
				x: (ev.clientX - r.left) / r.width * W,
				y: (ev.clientY - r.top) / r.height * H
			};
			return {
				x: 0,
				y: 0
			};
		};
		const down = (e) => {
			if (!s.current.stopped) return;
			const p = getPos(e);
			if (Math.hypot(p.x - s.current.ball.x, p.y - s.current.ball.y) < 25) {
				s.current.dragging = true;
				s.current.dragStart = p;
			}
		};
		const move = (e) => {
			if (s.current.dragging) s.current.dragStart = getPos(e);
		};
		const up = (e) => {
			if (!s.current.dragging) return;
			s.current.dragging = false;
			const p = getPos(e);
			const dx = s.current.ball.x - p.x, dy = s.current.ball.y - p.y;
			const power = Math.min(15, Math.hypot(dx, dy) / 8);
			s.current.ball.vx = dx / (Math.hypot(dx, dy) || 1) * power;
			s.current.ball.vy = dy / (Math.hypot(dx, dy) || 1) * power;
			s.current.ball.spin = (s.current.dragStart.x - p.x) * .02;
			s.current.stopped = false;
			setStrokes((s) => s + 1);
		};
		window.addEventListener("mousedown", down);
		window.addEventListener("mousemove", move);
		window.addEventListener("mouseup", up);
		window.addEventListener("touchstart", down);
		window.addEventListener("touchmove", move);
		window.addEventListener("touchend", up);
		return () => {
			window.removeEventListener("mousedown", down);
			window.removeEventListener("mousemove", move);
			window.removeEventListener("mouseup", up);
			window.removeEventListener("touchstart", down);
			window.removeEventListener("touchmove", move);
			window.removeEventListener("touchend", up);
		};
	});
	useGameLoop(() => {
		const st = s.current;
		if (!st.stopped) {
			st.ball.vx *= .97;
			st.ball.vy *= .97;
			st.ball.vx += st.ball.spin * .05;
			st.ball.spin *= .95;
			st.ball.x += st.ball.vx;
			st.ball.y += st.ball.vy;
			course.walls.forEach((w) => {
				if (st.ball.x > w.x && st.ball.x < w.x + w.w && st.ball.y > w.y && st.ball.y < w.y + w.h) {
					st.ball.vx *= -.8;
					st.ball.x += st.ball.vx;
				}
			});
			course.wells.forEach((w) => {
				const d = Math.hypot(st.ball.x - w.x, st.ball.y - w.y);
				if (d < w.r) {
					st.ball.vx += (w.x - st.ball.x) / d * .3;
					st.ball.vy += (w.y - st.ball.y) / d * .3;
				}
			});
			let onIce = false;
			course.ice.forEach((i) => {
				if (st.ball.x > i.x && st.ball.x < i.x + i.w && st.ball.y > i.y && st.ball.y < i.y + i.h) onIce = true;
			});
			if (!onIce) {
				st.ball.vx *= .96;
				st.ball.vy *= .96;
			}
			course.portals.forEach((p) => {
				if (Math.hypot(st.ball.x - p.a.x, st.ball.y - p.a.y) < 12) {
					st.ball.x = p.b.x;
					st.ball.y = p.b.y;
				}
				if (Math.hypot(st.ball.x - p.b.x, st.ball.y - p.b.y) < 12) {
					st.ball.x = p.a.x;
					st.ball.y = p.a.y;
				}
			});
			if (st.ball.x < 8) {
				st.ball.x = 8;
				st.ball.vx *= -.6;
			}
			if (st.ball.x > 312) {
				st.ball.x = 312;
				st.ball.vx *= -.6;
			}
			if (st.ball.y < 8) {
				st.ball.y = 8;
				st.ball.vy *= -.6;
			}
			if (st.ball.y > 352) {
				st.ball.y = 352;
				st.ball.vy *= -.6;
			}
			if (Math.abs(st.ball.vx) < .3 && Math.abs(st.ball.vy) < .3) {
				st.stopped = true;
				st.ball.vx = 0;
				st.ball.vy = 0;
			}
			if (Math.hypot(st.ball.x - course.hole.x, st.ball.y - course.hole.y) < 12 && Math.abs(st.ball.vx) < 3) {
				setMsg(`Hole ${courseIdx + 1} done in ${strokes}! 🎉`);
				setOver(true);
				setTimeout(() => {
					setOver(false);
					nextHole();
				}, 1500);
			}
		}
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		course.ice.forEach((i) => {
			c.fillStyle = "#60a5fa22";
			c.fillRect(i.x, i.y, i.w, i.h);
		});
		course.wells.forEach((w) => {
			const grad = c.createRadialGradient(w.x, w.y, 0, w.x, w.y, w.r);
			grad.addColorStop(0, "#8b5cf644");
			grad.addColorStop(1, "transparent");
			c.fillStyle = grad;
			c.beginPath();
			c.arc(w.x, w.y, w.r, 0, Math.PI * 2);
			c.fill();
		});
		course.portals.forEach((p) => {
			c.fillStyle = "#a855f744";
			c.beginPath();
			c.arc(p.a.x, p.a.y, 10, 0, Math.PI * 2);
			c.fill();
			c.beginPath();
			c.arc(p.b.x, p.b.y, 10, 0, Math.PI * 2);
			c.fill();
		});
		c.fillStyle = "#243240";
		course.walls.forEach((w) => c.fillRect(w.x, w.y, w.w, w.h));
		c.fillStyle = "#071018";
		c.beginPath();
		c.arc(course.hole.x, course.hole.y, 10, 0, Math.PI * 2);
		c.fill();
		c.strokeStyle = G.accent;
		c.lineWidth = 2;
		c.stroke();
		c.fillStyle = "#ece7de";
		c.shadowColor = "#ece7de";
		c.shadowBlur = 6;
		c.beginPath();
		c.arc(st.ball.x, st.ball.y, 6, 0, Math.PI * 2);
		c.fill();
		c.shadowBlur = 0;
		if (st.dragging) {
			c.strokeStyle = G.accent + "88";
			c.setLineDash([4, 4]);
			c.beginPath();
			c.moveTo(st.ball.x, st.ball.y);
			c.lineTo(st.dragStart.x, st.dragStart.y);
			c.stroke();
			c.setLineDash([]);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `Hole ${courseIdx + 1} · ${strokes}`,
		best: best < 999 ? `Best ${best}` : void 0,
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
						maxWidth: "100%",
						touchAction: "none"
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: ["Drag from ball to aim · Total: ", total + strokes]
				})
			]
		})
	});
}
//#endregion
export { MiniGolfWizard as default };
