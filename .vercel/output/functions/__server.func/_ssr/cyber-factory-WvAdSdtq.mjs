import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cyber-factory-WvAdSdtq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("cyber-factory");
function CyberFactory() {
	const [scrap, setScrap] = (0, import_react.useState)(0);
	const [machines, setMachines] = (0, import_react.useState)([]);
	const [power, setPower] = (0, import_react.useState)(0);
	const [heat, setHeat] = (0, import_react.useState)(0);
	const [drones, setDrones] = (0, import_react.useState)(0);
	const [droneHp, setDroneHp] = (0, import_react.useState)([]);
	const [best, setBest] = usePersist("arcade-factory-best", 0);
	const [nextId, setNextId] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		const t = setInterval(() => {
			let gain = 0, powerUse = 0, heatGen = 0;
			machines.forEach((m) => {
				if (m.hp <= 0) return;
				if (m.type === "scrap") {
					gain += m.level * 2;
					heatGen += m.level;
				}
				if (m.type === "power") powerUse -= m.level * 3;
				if (m.type === "cooling") heatGen -= m.level * 2;
				powerUse += 1;
			});
			setScrap((s) => {
				const ns = s + gain + drones * .5;
				if (ns > best) setBest(ns);
				return ns;
			});
			setPower((p) => Math.max(0, Math.min(50, p + 5 - powerUse)));
			setHeat((h) => {
				const nh = Math.max(0, Math.min(100, h + heatGen));
				if (nh >= 100) setMachines((ms) => ms.map((m) => ({
					...m,
					hp: Math.max(0, m.hp - 10)
				})));
				return nh;
			});
			setDroneHp((dh) => dh.map((h) => Math.max(0, h - 1)));
		}, 1e3);
		return () => clearInterval(t);
	}, [
		machines,
		drones,
		best,
		setBest
	]);
	const buy = (0, import_react.useCallback)((type) => {
		const cost = type === "scrap" ? 20 : type === "cooling" ? 30 : 40;
		if (scrap < cost) return;
		setScrap((s) => s - cost);
		setMachines((ms) => [...ms, {
			id: nextId,
			type,
			level: 1,
			hp: 100,
			cost
		}]);
		setNextId((n) => n + 1);
	}, [scrap, nextId]);
	const upgrade = (0, import_react.useCallback)((id) => {
		setMachines((ms) => ms.map((m) => m.id === id && scrap >= m.level * 15 ? {
			...m,
			level: m.level + 1
		} : m));
		setScrap((s) => s - (machines.find((m) => m.id === id)?.level ?? 1) * 15);
	}, [scrap, machines]);
	const buyDrone = (0, import_react.useCallback)(() => {
		if (scrap < 50) return;
		setScrap((s) => s - 50);
		setDrones((d) => d + 1);
		setDroneHp((dh) => [...dh, 100]);
	}, [scrap]);
	const repair = (0, import_react.useCallback)((idx) => {
		if (scrap < 10) return;
		setScrap((s) => s - 10);
		setDroneHp((dh) => dh.map((h, i) => i === idx ? 100 : h));
	}, [scrap]);
	const reset = () => {
		setScrap(0);
		setMachines([]);
		setPower(0);
		setHeat(0);
		setDrones(0);
		setDroneHp([]);
		setNextId(1);
	};
	const typeColor = {
		scrap: "#f97316",
		cooling: "#60a5fa",
		power: "#fbbf24"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${Math.floor(scrap)}`,
		best: `${Math.floor(best)}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid w-full max-w-sm grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {
							label: "Power",
							value: power,
							max: 50,
							color: "#fbbf24"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {
							label: "Heat",
							value: heat,
							max: 100,
							color: "#ff6a3d",
							warn: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, {
							label: "Drones",
							value: drones,
							max: 10,
							color: G.accent
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setScrap((s) => s + 1),
					className: "rounded-xl border-2 px-8 py-4 text-lg font-bold transition-all active:scale-95",
					style: {
						borderColor: G.accent,
						color: G.accent,
						background: G.accent + "11"
					},
					children: "🔧 Generate Scrap (+1)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => buy("scrap"),
							disabled: scrap < 20,
							className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
							style: {
								borderColor: typeColor.scrap,
								color: typeColor.scrap
							},
							children: "🏭 Scrap (20)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => buy("cooling"),
							disabled: scrap < 30,
							className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
							style: {
								borderColor: typeColor.cooling,
								color: typeColor.cooling
							},
							children: "❄️ Cooling (30)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => buy("power"),
							disabled: scrap < 40,
							className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
							style: {
								borderColor: typeColor.power,
								color: typeColor.power
							},
							children: "⚡ Power (40)"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: buyDrone,
							disabled: scrap < 50,
							className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
							style: {
								borderColor: G.accent,
								color: G.accent
							},
							children: "🤖 Drone (50)"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid w-full max-w-sm grid-cols-2 gap-2",
					children: machines.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border p-2",
						style: {
							borderColor: typeColor[m.type] + "44",
							background: typeColor[m.type] + "08"
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-sm",
								children: [
									m.type === "scrap" ? "🏭" : m.type === "cooling" ? "❄️" : "⚡",
									" Lv",
									m.level
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => upgrade(m.id),
								disabled: scrap < m.level * 15,
								className: "text-xs text-primary disabled:opacity-40",
								children: ["⬆ ", m.level * 15]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 h-1 rounded-full bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full",
								style: {
									width: `${m.hp}%`,
									background: m.hp > 50 ? G.accent : "#ff6a3d"
								}
							})
						})]
					}, m.id))
				}),
				droneHp.map((hp, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => repair(i),
					disabled: scrap < 10 || hp >= 100,
					className: "flex items-center gap-2 rounded-lg border border-line px-2 py-1 text-xs disabled:opacity-40",
					children: [
						"🤖 HP: ",
						hp,
						" ",
						hp < 50 && "⚠️",
						" ",
						hp < 100 && "🔧 Repair(10)"
					]
				}, i)),
				heat >= 80 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ember animate-pulse",
					children: "⚠️ OVERHEATING — machines taking damage!"
				})
			]
		})
	});
}
function Gauge({ label, value, max, color, warn }) {
	const pct = Math.min(100, value / max * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mb-1 text-xs text-muted",
		children: [
			label,
			": ",
			Math.round(value)
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 overflow-hidden rounded-full bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full transition-all",
			style: {
				width: `${pct}%`,
				background: warn && pct > 70 ? "#ff6a3d" : color
			}
		})
	})] });
}
//#endregion
export { CyberFactory as default };
