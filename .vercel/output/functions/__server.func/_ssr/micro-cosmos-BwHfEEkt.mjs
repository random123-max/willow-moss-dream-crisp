import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/micro-cosmos-BwHfEEkt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("micro-cosmos");
var LIFE_STAGES = [
	"Microbe",
	"Algae",
	"Plankton",
	"Worm",
	"Fish",
	"Amphibian",
	"Reptile",
	"Mammal",
	"Sentient"
];
function MicroCosmos() {
	const [oxygen, setOxygen] = (0, import_react.useState)(30);
	const [carbon, setCarbon] = (0, import_react.useState)(40);
	const [temp, setTemp] = (0, import_react.useState)(15);
	const [life, setLife] = (0, import_react.useState)({
		stage: 0,
		name: "Microbe"
	});
	const [over, setOver] = (0, import_react.useState)(false);
	const [events, setEvents] = (0, import_react.useState)([]);
	const [tick, setTick] = (0, import_react.useState)(0);
	const [msg, setMsg] = (0, import_react.useState)("Balance the atmosphere for life to evolve!");
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			setTick((tk) => tk + 1);
			setOxygen((o) => Math.min(100, o + (life.stage >= 2 ? 1 : .5)));
			setCarbon((c) => Math.max(0, c - (life.stage >= 1 ? .5 : .2)));
			setTemp((t) => Math.min(50, Math.max(-50, t + (carbon > 50 ? .3 : -.1))));
			if (oxygen > 20 && oxygen < 60 && carbon < 50 && temp > 5 && temp < 30 && life.stage < LIFE_STAGES.length - 1 && tick % 20 === 0) setLife((l) => {
				const ns = l.stage + 1;
				setEvents((ev) => [`✨ Evolved: ${LIFE_STAGES[ns]}!`, ...ev.slice(0, 3)]);
				return {
					stage: ns,
					name: LIFE_STAGES[ns]
				};
			});
			if (tick % 50 === 0 && Math.random() < .3) {
				if ((Math.random() < .5 ? "solar flare" : "ice age") === "solar flare") {
					setTemp((t) => t + 10);
					setEvents((ev) => [`🔥 Solar flare! Temp rising!`, ...ev.slice(0, 3)]);
				} else {
					setTemp((t) => t - 10);
					setEvents((ev) => [`❄️ Ice age! Temp dropping!`, ...ev.slice(0, 3)]);
				}
			}
			if (temp > 40 || temp < -10 || oxygen < 5 || oxygen > 90) {
				setOver(true);
				setMsg("Extinction event! Life died out. 💀");
			}
			if (life.stage >= LIFE_STAGES.length - 1) {
				setOver(true);
				setMsg("Sentient life achieved! 🎉 You win!");
			}
		}, 2e3);
		return () => clearInterval(t);
	}, [
		over,
		life,
		oxygen,
		carbon,
		temp,
		tick
	]);
	const adjust = (0, import_react.useCallback)((what, delta) => {
		if (over) return;
		if (what === "oxygen") setOxygen((o) => Math.min(100, Math.max(0, o + delta)));
		if (what === "carbon") setCarbon((c) => Math.min(100, Math.max(0, c + delta)));
		if (what === "temp") setTemp((t) => Math.min(50, Math.max(-50, t + delta)));
	}, [over]);
	const reset = () => {
		setOxygen(30);
		setCarbon(40);
		setTemp(15);
		setLife({
			stage: 0,
			name: "Microbe"
		});
		setOver(false);
		setEvents([]);
		setTick(0);
		setMsg("Balance the atmosphere for life to evolve!");
	};
	const ideal = oxygen > 20 && oxygen < 60 && carbon < 50 && temp > 5 && temp < 30;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: life.name,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex size-32 items-center justify-center rounded-full",
					style: {
						background: `radial-gradient(circle, ${ideal ? "#3ee0d0" : "#ff6a3d"}33, #071018)`,
						boxShadow: `0 0 30px ${ideal ? "#3ee0d0" : "#ff6a3d"}44`
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-4xl",
						children: life.stage <= 1 ? "🦠" : life.stage <= 3 ? "🌿" : life.stage <= 5 ? "🐟" : life.stage <= 7 ? "🦎" : "🧠"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "Oxygen",
							value: oxygen,
							min: 0,
							max: 100,
							ideal: [20, 60],
							accent: G.accent,
							onAdjust: (d) => adjust("oxygen", d)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "Carbon",
							value: carbon,
							min: 0,
							max: 100,
							ideal: [0, 50],
							accent: "#ff6a3d",
							onAdjust: (d) => adjust("carbon", d)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Slider, {
							label: "Temperature",
							value: temp + 50,
							min: 0,
							max: 100,
							ideal: [55, 80],
							accent: "#fbbf24",
							onAdjust: (d) => adjust("temp", d),
							unit: "°C",
							display: temp
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1",
					children: LIFE_STAGES.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-xs ${i <= life.stage ? "text-primary" : "text-muted"}`,
						children: i <= life.stage ? "●" : "○"
					}, i))
				}),
				events.map((e, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-ember animate-pulse",
					children: e
				}, i))
			]
		})
	});
}
function Slider({ label, value, min, max, ideal, accent, onAdjust, unit, display }) {
	const inIdeal = value >= ideal[0] && value <= ideal[1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			style: { color: inIdeal ? "#3ee0d0" : "#ff6a3d" },
			children: [display ?? value, unit ?? "%"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-1 flex items-center gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onAdjust(-5),
				className: "flex size-7 items-center justify-center rounded border border-line text-sm",
				children: "−"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-2 flex-1 rounded-full bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute h-full rounded-full",
					style: {
						left: `${ideal[0]}%`,
						width: `${ideal[1] - ideal[0]}%`,
						background: "#3ee0d033"
					}
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full",
					style: {
						width: `${value}%`,
						background: inIdeal ? "#3ee0d0" : "#ff6a3d"
					}
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onAdjust(5),
				className: "flex size-7 items-center justify-center rounded border border-line text-sm",
				children: "+"
			})
		]
	})] });
}
//#endregion
export { MicroCosmos as default };
