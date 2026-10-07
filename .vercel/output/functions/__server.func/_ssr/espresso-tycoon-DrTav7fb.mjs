import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/espresso-tycoon-DrTav7fb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("espresso-tycoon");
var DRINKS = [
	"Espresso",
	"Latte",
	"Cappuccino",
	"Mocha",
	"Macchiato"
];
function EspressoTycoon() {
	const [coins, setCoins] = (0, import_react.useState)(50);
	const [inventory, setInventory] = (0, import_react.useState)({
		Coffee: 10,
		Milk: 10,
		Sugar: 10,
		Chocolate: 5
	});
	const [stress, setStress] = (0, import_react.useState)(0);
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [brewing, setBrewing] = (0, import_react.useState)(null);
	const [brewTemp, setBrewTemp] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Serve customers before they walk out!");
	const [served, setServed] = (0, import_react.useState)(0);
	const nextId = (0, import_react.useRef)(1);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			setOrders((prev) => {
				if (prev.length >= 4) return prev;
				const drink = DRINKS[Math.floor(Math.random() * DRINKS.length)];
				const targetTemp = 60 + Math.floor(Math.random() * 30);
				return [...prev, {
					id: nextId.current++,
					drink,
					temp: targetTemp,
					patience: 100,
					reward: 8 + Math.floor(Math.random() * 8)
				}];
			});
		}, 4e3);
		return () => clearInterval(t);
	}, [over]);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			setOrders((prev) => prev.map((o) => ({
				...o,
				patience: o.patience - 2
			})).filter((o) => {
				if (o.patience <= 0) {
					setMsg(`${o.drink} customer walked out! 😡`);
					setStress((s) => Math.min(100, s + 10));
					return false;
				}
				return true;
			}));
			setStress((s) => Math.max(0, s - 1));
		}, 500);
		return () => clearInterval(t);
	}, [over]);
	(0, import_react.useEffect)(() => {
		if (over || !brewing) return;
		const t = setInterval(() => {
			setBrewTemp((t) => Math.min(100, t + 5));
		}, 100);
		return () => clearInterval(t);
	}, [brewing, over]);
	const takeOrder = (0, import_react.useCallback)((order) => {
		if (brewing || over) return;
		setBrewing(order);
		setBrewTemp(0);
		setMsg(`Brewing ${order.drink}... Target: ${order.temp}°`);
	}, [brewing, over]);
	const serve = (0, import_react.useCallback)(() => {
		if (!brewing) return;
		const tempDiff = Math.abs(brewTemp - brewing.temp);
		const quality = Math.max(0, 100 - tempDiff * 2);
		const reward = Math.floor(brewing.reward * (quality / 100));
		if (reward > 0) {
			setCoins((c) => c + reward);
			setServed((s) => s + 1);
			setMsg(`Served ${brewing.drink}! ${quality}% quality. +${reward} coins! ☕`);
		} else {
			setMsg(`Terrible ${brewing.drink}! Customer unhappy 😡`);
			setStress((s) => Math.min(100, s + 5));
		}
		setInventory((inv) => {
			const ni = { ...inv };
			ni.Coffee = Math.max(0, ni.Coffee - 1);
			if (brewing.drink !== "Espresso") ni.Milk = Math.max(0, ni.Milk - 1);
			if (brewing.drink === "Mocha") ni.Chocolate = Math.max(0, ni.Chocolate - 1);
			return ni;
		});
		setOrders((prev) => prev.filter((o) => o.id !== brewing.id));
		setBrewing(null);
		setBrewTemp(0);
		if (stress >= 100) {
			setOver(true);
			setMsg("Staff overwhelmed! Cafe closed! 💔");
		}
	}, [
		brewing,
		brewTemp,
		stress
	]);
	const restock = (0, import_react.useCallback)(() => {
		setCoins((c) => c - 20);
		setInventory((inv) => ({
			Coffee: inv.Coffee + 10,
			Milk: inv.Milk + 10,
			Sugar: inv.Sugar + 10,
			Chocolate: inv.Chocolate + 5
		}));
		setMsg("Restocked! 📦");
	}, []);
	const reset = () => {
		setCoins(50);
		setInventory({
			Coffee: 10,
			Milk: 10,
			Sugar: 10,
			Chocolate: 5
		});
		setStress(0);
		setOrders([]);
		setBrewing(null);
		setBrewTemp(0);
		setOver(false);
		setMsg("Serve customers before they walk out!");
		setServed(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `💰${coins} ☕${served}`,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs",
			style: { color: stress > 70 ? "#ff6a3d" : "#a855f7" },
			children: [
				"Stress ",
				stress,
				"%"
			]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				brewing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-xs rounded-xl border-2 p-3",
					style: { borderColor: G.accent + "44" },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"Brewing ",
								brewing.drink,
								" · Target: ",
								brewing.temp,
								"°"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 h-4 overflow-hidden rounded-full bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full transition-all",
								style: {
									width: `${brewTemp}%`,
									background: Math.abs(brewTemp - brewing.temp) < 10 ? G.accent : "#ff6a3d"
								}
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-center text-xs",
							children: [
								"Current: ",
								brewTemp,
								"°"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: serve,
							className: "mt-2 w-full rounded-lg py-2 text-sm font-bold",
							style: {
								background: G.accent,
								color: "#071018"
							},
							children: "Serve!"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid w-full max-w-sm grid-cols-2 gap-2",
					children: orders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => takeOrder(o),
						disabled: !!brewing,
						className: "rounded-lg border p-2 text-left transition-all disabled:opacity-40",
						style: {
							borderColor: "var(--color-line)",
							background: "var(--color-surface)"
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm font-medium text-fg",
								children: [o.drink, " ☕"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									"Target: ",
									o.temp,
									"°"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 h-1 rounded-full bg-surface",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full",
									style: {
										width: `${o.patience}%`,
										background: o.patience > 30 ? G.accent : "#ff6a3d"
									}
								})
							})
						]
					}, o.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 text-xs",
					children: Object.entries(inventory).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: `rounded-full border px-2 py-0.5 ${v < 3 ? "border-ember text-ember" : "border-line text-muted"}`,
						children: [
							k,
							": ",
							v
						]
					}, k))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: restock,
					disabled: coins < 20,
					className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
					style: {
						borderColor: G.accent,
						color: G.accent
					},
					children: "📦 Restock (20💰)"
				})
			]
		})
	});
}
//#endregion
export { EspressoTycoon as default };
