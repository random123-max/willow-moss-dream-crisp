import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rhythm-vanguard-D_zkDGnc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("rhythm-vanguard");
var LANES = 4;
function RhythmVanguard() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [shield, setShield] = (0, import_react.useState)(100);
	const [charge, setCharge] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [enemies, setEnemies] = (0, import_react.useState)([]);
	const [combo, setCombo] = (0, import_react.useState)(0);
	(0, import_react.useRef)(0);
	const tick = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const i = setInterval(() => {
			tick.current++;
			if (tick.current % 15 === 0) setNotes((prev) => [...prev, {
				lane: Math.floor(Math.random() * LANES),
				y: 0,
				hit: false
			}]);
			if (tick.current % 40 === 0) setEnemies((prev) => [...prev, {
				y: 0,
				lane: Math.floor(Math.random() * LANES),
				hp: 1
			}]);
			setNotes((prev) => prev.map((n) => ({
				...n,
				y: n.y + 8
			})).filter((n) => n.y < 400));
			setEnemies((prev) => {
				const np = prev.map((e) => ({
					...e,
					y: e.y + 1.5
				}));
				np.filter((e) => e.y >= 380).forEach(() => setShield((s) => Math.max(0, s - 15)));
				return np.filter((e) => e.y < 380);
			});
		}, 50);
		return () => clearInterval(i);
	}, [over]);
	(0, import_react.useEffect)(() => {
		if (shield <= 0 && !over) setOver(true);
	}, [shield, over]);
	const hitLane = (0, import_react.useCallback)((lane) => {
		const hitZone = notes.filter((n) => !n.hit && n.lane === lane && n.y > 320 && n.y < 380);
		if (hitZone.length > 0) {
			setNotes((prev) => prev.map((n) => n === hitZone[0] ? {
				...n,
				hit: true
			} : n));
			setScore((sc) => sc + 10 + combo * 2);
			setCombo((c) => c + 1);
			setCharge((c) => Math.min(100, c + 15));
			setEnemies((prev) => {
				const inLane = prev.filter((e) => e.lane === lane);
				if (charge >= 50 && inLane.length > 0) {
					setCharge((c) => c - 50);
					return prev.filter((e) => e !== inLane[0]);
				}
				return prev;
			});
		} else {
			setCombo(0);
			setShield((s) => Math.max(0, s - 5));
		}
	}, [
		notes,
		combo,
		charge
	]);
	(0, import_react.useEffect)(() => {
		const k = (e) => {
			const map = {
				d: 0,
				f: 1,
				j: 2,
				k: 3,
				"1": 0,
				"2": 1,
				"3": 2,
				"4": 3
			};
			if (map[e.key.toLowerCase()] !== void 0) hitLane(map[e.key.toLowerCase()]);
		};
		window.addEventListener("keydown", k);
		return () => window.removeEventListener("keydown", k);
	});
	const reset = () => {
		setScore(0);
		setShield(100);
		setCharge(0);
		setOver(false);
		setNotes([]);
		setEnemies([]);
		setCombo(0);
	};
	const laneLabels = [
		"D",
		"F",
		"J",
		"K"
	];
	const laneColors = [
		"#ff6a3d",
		"#fbbf24",
		"#3ee0d0",
		"#a855f7"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${score}`,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs text-primary",
			children: ["🛡️", shield]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: ["Combo: ", combo]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						style: { color: G.accent },
						children: [
							"⚡ ",
							charge,
							"/100"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative overflow-hidden rounded-lg border-2",
					style: {
						borderColor: G.accent + "44",
						width: Math.min(window.innerWidth - 48, 280),
						height: 400
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 flex",
							children: Array.from({ length: LANES }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 border-r border-line/50",
								style: { background: `${laneColors[i]}08` },
								children: [notes.filter((n) => n.lane === i && !n.hit).map((n, ni) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute rounded",
									style: {
										left: `${i / LANES * 100}%`,
										width: `${100 / LANES}%`,
										top: n.y,
										height: 8,
										background: laneColors[i],
										boxShadow: `0 0 6px ${laneColors[i]}`
									}
								}, ni)), enemies.filter((e) => e.lane === i).map((e, ei) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute text-lg",
									style: {
										left: `${i / LANES * 100 + 8}%`,
										top: e.y
									},
									children: "👾"
								}, ei))]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-16 left-0 right-0 h-1",
							style: { background: G.accent + "55" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-0 left-0 h-2",
							style: {
								width: `${charge}%`,
								background: G.accent
							}
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: laneLabels.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: over,
						onClick: () => hitLane(i),
						className: "flex size-14 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all active:scale-95",
						style: {
							borderColor: laneColors[i],
							color: laneColors[i],
							background: laneColors[i] + "11"
						},
						children: l
					}, i))
				}),
				over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-xl text-ember",
					children: ["Shields down! Score: ", score]
				})
			]
		})
	});
}
//#endregion
export { RhythmVanguard as default };
