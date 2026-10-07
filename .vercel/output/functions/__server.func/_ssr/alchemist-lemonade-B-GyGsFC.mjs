import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alchemist-lemonade-B-GyGsFC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("alchemist-lemonade");
function AlchemistLemonade() {
	const [coins, setCoins] = (0, import_react.useState)(50);
	const [price, setPrice] = (0, import_react.useState)(5);
	const [day, setDay] = (0, import_react.useState)(1);
	const [weather, setWeather] = (0, import_react.useState)("sunny");
	const [recipe, setRecipe] = (0, import_react.useState)({
		sweet: 50,
		sour: 50,
		magic: 0
	});
	const [rivals, setRivals] = (0, import_react.useState)(4);
	const [disease, setDisease] = (0, import_react.useState)("none");
	const [msg, setMsg] = (0, import_react.useState)("Set your price and brew lemonade!");
	const [over, setOver] = (0, import_react.useState)(false);
	const [lastSales, setLastSales] = (0, import_react.useState)(0);
	const weatherEmoji = {
		sunny: "☀️",
		cloudy: "☁️",
		rainy: "🌧️"
	};
	const sell = (0, import_react.useCallback)(() => {
		let demand = 100;
		if (weather === "rainy") demand *= .3;
		if (weather === "cloudy") demand *= .6;
		if (price > 8) demand *= .5;
		if (price < 3) demand *= 1.5;
		if (rivals > 5) demand *= .7;
		if (disease === "fever") demand *= 1.3;
		if (disease === "cold") demand *= .6;
		const sales = Math.max(0, Math.floor(demand / 10));
		const revenue = sales * price;
		const costs = 5;
		setCoins((c) => c + revenue - costs);
		setLastSales(sales);
		setMsg(`Sold ${sales} cups for ${revenue} coins! ${revenue - costs > 0 ? "Profit!" : "Loss!"}`);
		setDay((d) => d + 1);
		setWeather([
			"sunny",
			"cloudy",
			"rainy"
		][Math.floor(Math.random() * 3)]);
		setRivals(Math.max(1, Math.min(10, rivals + Math.floor(Math.random() * 3) - 1)));
		if (Math.random() < .2) {
			setDisease(Math.random() < .5 ? "cold" : "fever");
			setMsg((m) => m + " 🤒 Disease spreading!");
		} else setDisease("none");
		if (coins <= 0 && revenue - costs < 0) {
			setOver(true);
			setMsg("Bankrupt! 💀");
		}
	}, [
		weather,
		price,
		rivals,
		disease,
		coins
	]);
	const reset = () => {
		setCoins(50);
		setPrice(5);
		setDay(1);
		setWeather("sunny");
		setRecipe({
			sweet: 50,
			sour: 50,
			magic: 0
		});
		setRivals(4);
		setDisease("none");
		setMsg("Set your price and brew lemonade!");
		setOver(false);
		setLastSales(0);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `💰${coins}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-sm items-center justify-between rounded-xl border border-line bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: ["Day ", day]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl",
						children: weatherEmoji[weather]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted",
							children: [
								"Rivals: ",
								rivals,
								" 🏪"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							style: { color: disease === "fever" ? "#ff6a3d" : disease === "cold" ? "#60a5fa" : "var(--color-muted)" },
							children: disease === "none" ? "Healthy" : disease === "cold" ? "🤧 Cold" : "🤒 Fever"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Price per cup"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: { color: G.accent },
							children: [price, " coins"]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: over,
								onClick: () => setPrice((p) => Math.max(1, p - 1)),
								className: "flex size-7 items-center justify-center rounded border border-line",
								children: "−"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "1",
								max: "15",
								value: price,
								onChange: (e) => setPrice(+e.target.value),
								className: "flex-1",
								disabled: over
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: over,
								onClick: () => setPrice((p) => Math.min(15, p + 1)),
								className: "flex size-7 items-center justify-center rounded border border-line",
								children: "+"
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecipeSlider, {
							label: "🍯 Sweetness",
							value: recipe.sweet,
							onChange: (v) => setRecipe((r) => ({
								...r,
								sweet: v
							})),
							color: "#fbbf24",
							disabled: over
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecipeSlider, {
							label: "🍋 Sourness",
							value: recipe.sour,
							onChange: (v) => setRecipe((r) => ({
								...r,
								sour: v
							})),
							color: "#84cc16",
							disabled: over
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecipeSlider, {
							label: "✨ Magic",
							value: recipe.magic,
							onChange: (v) => setRecipe((r) => ({
								...r,
								magic: v
							})),
							color: G.accent,
							disabled: over
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: sell,
					disabled: over,
					className: "rounded-lg px-6 py-2.5 text-sm font-bold",
					style: {
						background: G.accent,
						color: "#071018"
					},
					children: [
						"🍋 Sell Today (",
						lastSales,
						" last day)"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Weather, diseases, and rival pricing affect demand!"
				})
			]
		})
	});
}
function RecipeSlider({ label, value, onChange, color, disabled }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			style: { color },
			children: [value, "%"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "range",
		min: "0",
		max: "100",
		value,
		onChange: (e) => onChange(+e.target.value),
		disabled,
		className: "mt-1 w-full",
		style: { accentColor: color }
	})] });
}
//#endregion
export { AlchemistLemonade as default };
