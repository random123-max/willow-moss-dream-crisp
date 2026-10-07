import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { n as useKeys, r as usePersist, t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/frogger-quantum-BRY8I3OT.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("frogger-quantum");
var W = 280;
var H = 360;
var CELL = 20;
var COLS = W / CELL;
function FroggerQuantum() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-frogger-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [rewind, setRewind] = (0, import_react.useState)(0);
	const keys = useKeys();
	const s = (0, import_react.useRef)({
		px: Math.floor(COLS / 2),
		py: 17,
		lanes: [],
		cars: [],
		history: [],
		tick: 0,
		moveCD: 0
	});
	(0, import_react.useEffect)(() => {
		const lanes = [
			{
				y: 3,
				speed: 1.5,
				dir: 1,
				offset: 0
			},
			{
				y: 5,
				speed: 1,
				dir: -1,
				offset: 2
			},
			{
				y: 7,
				speed: 2,
				dir: 1,
				offset: 4
			},
			{
				y: 9,
				speed: 1.2,
				dir: -1,
				offset: 1
			},
			{
				y: 11,
				speed: 1.8,
				dir: 1,
				offset: 3
			},
			{
				y: 13,
				speed: 1,
				dir: -1,
				offset: 5
			}
		];
		s.current.lanes = lanes;
		const cars = [];
		lanes.forEach((l, i) => {
			for (let j = 0; j < 4; j++) cars.push({
				lane: i,
				x: j * 5
			});
		});
		s.current.cars = cars;
	}, []);
	const reset = (0, import_react.useCallback)(() => {
		s.current = {
			px: Math.floor(COLS / 2),
			py: 17,
			lanes: s.current.lanes,
			cars: s.current.cars,
			history: [],
			tick: 0,
			moveCD: 0
		};
		setScore(0);
		setOver(false);
		setRewind(0);
	}, []);
	useGameLoop(() => {
		if (over) return;
		const st = s.current;
		const k = keys.current;
		st.tick++;
		if (st.moveCD > 0) st.moveCD--;
		st.cars.forEach((c) => {
			const lane = st.lanes[c.lane];
			c.x += lane.speed * lane.dir * .1;
			if (c.x < 0) c.x += COLS;
			if (c.x >= COLS) c.x -= COLS;
		});
		if (st.moveCD === 0) {
			if (k.has("arrowleft") && st.px > 0) {
				st.history.push({
					px: st.px,
					py: st.py
				});
				st.px--;
				st.moveCD = 8;
			}
			if (k.has("arrowright") && st.px < 13) {
				st.history.push({
					px: st.px,
					py: st.py
				});
				st.px++;
				st.moveCD = 8;
			}
			if (k.has("arrowup") && st.py > 0) {
				st.history.push({
					px: st.px,
					py: st.py
				});
				st.py--;
				st.moveCD = 8;
			}
			if (k.has("arrowdown") && st.py < 17) {
				st.history.push({
					px: st.px,
					py: st.py
				});
				st.py++;
				st.moveCD = 8;
			}
		}
		for (const c of st.cars) {
			const lane = st.lanes[c.lane];
			if (Math.abs(c.x - st.px) < .8 && lane.y === st.py) {
				if (rewind === 0 && st.history.length >= 18) {
					const pos = st.history.slice(-18)[0];
					st.px = pos.px;
					st.py = pos.py;
					setRewind(3);
					setScore((sc) => Math.max(0, sc - 5));
				} else {
					setOver(true);
					if (score > best) setBest(score);
				}
			}
		}
		if (rewind > 0) setRewind((r) => r - 1);
		if (st.py === 0) {
			setScore((sc) => sc + 50);
			st.py = 17;
			st.px = Math.floor(COLS / 2);
			st.history = [];
		}
		const c = canvas.current?.getContext("2d");
		if (!c) return;
		c.fillStyle = "#071018";
		c.fillRect(0, 0, W, H);
		c.fillStyle = G.accent + "22";
		c.fillRect(0, 0, W, CELL);
		st.lanes.forEach((l) => {
			c.fillStyle = "#24324033";
			c.fillRect(0, l.y * CELL, W, CELL);
		});
		st.cars.forEach((car) => {
			const l = st.lanes[car.lane];
			c.fillStyle = "#ff6a3d";
			c.fillRect(car.x * CELL + 2, l.y * CELL + 3, 16, 14);
		});
		c.fillStyle = rewind > 0 ? "#a855f7" : G.accent;
		c.shadowColor = c.fillStyle;
		c.shadowBlur = 8;
		c.beginPath();
		c.arc(st.px * CELL + CELL / 2, st.py * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
		c.fill();
		c.shadowBlur = 0;
		c.fillStyle = "#071018";
		c.font = "10px monospace";
		c.fillText("🐸", st.px * CELL + 5, st.py * CELL + 14);
		if (rewind > 0) {
			c.fillStyle = "#a855f7";
			c.font = "14px monospace";
			c.fillText("⏪ REWIND!", W / 2 - 30, 20);
		}
	});
	const canvas = (0, import_react.useRef)(null);
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
				children: "Arrow keys · Avoid your past timeline!"
			})]
		})
	});
}
//#endregion
export { FroggerQuantum as default };
