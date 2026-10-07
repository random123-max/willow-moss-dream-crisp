import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/deep-sea-fishing-BEtTNHWq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("deep-sea-fishing");
var FISH = [
	{
		name: "Anchovy",
		depth: 1,
		rarity: 1,
		emoji: "🐟"
	},
	{
		name: "Mackerel",
		depth: 2,
		rarity: 2,
		emoji: "🐠"
	},
	{
		name: "Tuna",
		depth: 3,
		rarity: 3,
		emoji: "🐡"
	},
	{
		name: "Anglerfish",
		depth: 4,
		rarity: 5,
		emoji: "🦑"
	},
	{
		name: "Giant Squid",
		depth: 5,
		rarity: 8,
		emoji: "🐙"
	}
];
var BAITS = [
	{
		name: "Worm",
		depth: 1,
		cost: 0
	},
	{
		name: "Lure",
		depth: 2,
		cost: 20
	},
	{
		name: "Deep Lure",
		depth: 4,
		cost: 50
	}
];
function DeepSeaFishing() {
	const [coins, setCoins] = (0, import_react.useState)(10);
	const [bait, setBait] = (0, import_react.useState)(0);
	const [casting, setCasting] = (0, import_react.useState)(false);
	const [depth, setDepth] = (0, import_react.useState)(0);
	const [tension, setTension] = (0, import_react.useState)(0);
	const [biting, setBiting] = (0, import_react.useState)(null);
	const [reeling, setReeling] = (0, import_react.useState)(false);
	const [catches, setCatches] = (0, import_react.useState)([]);
	const [msg, setMsg] = (0, import_react.useState)("Cast your line!");
	const [over, setOver] = (0, import_react.useState)(false);
	const cast = (0, import_react.useCallback)(() => {
		if (casting || over) return;
		setCasting(true);
		setDepth(0);
		setMsg("Line descending...");
		let d = 0;
		const targetDepth = BAITS[bait].depth * 20;
		const interval = setInterval(() => {
			d += 2;
			setDepth(d);
			if (d >= targetDepth) {
				clearInterval(interval);
				const possibleFish = FISH.filter((f) => Math.abs(f.depth - BAITS[bait].depth) <= 1);
				const caught = possibleFish[Math.floor(Math.random() * possibleFish.length)];
				if (caught && Math.random() > .3) {
					setBiting(caught);
					setMsg(`Something's biting! ${caught.emoji}`);
				} else {
					setMsg("Nothing biting... Reel in and try again.");
					setTimeout(() => {
						setCasting(false);
						setDepth(0);
					}, 1e3);
				}
			}
		}, 100);
	}, [
		casting,
		bait,
		over
	]);
	const reel = (0, import_react.useCallback)(() => {
		if (!biting || reeling) return;
		setReeling(true);
		const fish = biting;
		let d = depth;
		const reelInterval = setInterval(() => {
			d -= 3;
			setDepth(d);
			setTension((t) => {
				const nt = t + fish.rarity + depth / 100 * 10;
				if (nt > 100) {
					clearInterval(reelInterval);
					setMsg("Line snapped! Fish escaped! 💔");
					setBiting(null);
					setReeling(false);
					setCasting(false);
					setDepth(0);
					setTension(0);
					return 0;
				}
				return nt;
			});
			if (d <= 0) {
				clearInterval(reelInterval);
				setMsg(`Caught a ${fish.name}! ${fish.emoji} +${fish.rarity * 5} coins!`);
				setCoins((c) => c + fish.rarity * 5);
				setCatches((prev) => [fish, ...prev].slice(0, 8));
				setBiting(null);
				setReeling(false);
				setCasting(false);
				setDepth(0);
				setTension(0);
			}
		}, 80);
	}, [
		biting,
		reeling,
		depth
	]);
	const buyBait = (0, import_react.useCallback)((idx) => {
		if (coins < BAITS[idx].cost) return;
		setCoins((c) => c - BAITS[idx].cost);
		setBait(idx);
	}, [coins]);
	const reset = () => {
		setCoins(10);
		setBait(0);
		setCasting(false);
		setDepth(0);
		setTension(0);
		setBiting(null);
		setReeling(false);
		setCatches([]);
		setMsg("Cast your line!");
		setOver(false);
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
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-xs overflow-hidden rounded-lg border-2",
					style: {
						height: 320,
						borderColor: G.accent + "44",
						background: "linear-gradient(180deg, #0ea5e922, #071018)"
					},
					children: [
						[
							1,
							2,
							3,
							4,
							5
						].map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute w-full border-t border-dashed border-line/30",
							style: { top: d * 60 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute right-1 -mt-4 text-[10px] text-muted",
								children: [d * 20, "m"]
							})
						}, d)),
						FISH.filter((f) => f.depth <= BAITS[bait].depth + 1).map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute text-lg",
							style: {
								top: f.depth * 50 + 20,
								left: `${i * 37 % 80}%`,
								opacity: .5
							},
							children: f.emoji
						}, i)),
						casting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute left-1/2 w-px -translate-x-1/2",
							style: {
								top: 0,
								height: depth * 3,
								background: "#ece7de"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -bottom-2 -left-1 size-2 rounded-full bg-primary" })
						}),
						reeling && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute bottom-2 left-2 right-2 h-2 rounded-full bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full transition-all",
								style: {
									width: `${tension}%`,
									background: tension > 70 ? "#ff6a3d" : "#3ee0d0"
								}
							})
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [!casting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: cast,
						className: "rounded-lg px-4 py-2 text-sm font-bold",
						style: {
							background: G.accent,
							color: "#071018"
						},
						children: "🎣 Cast"
					}), biting && !reeling && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: reel,
						className: "rounded-lg px-4 py-2 text-sm font-bold animate-pulse",
						style: {
							background: "#ff6a3d",
							color: "#071018"
						},
						children: "Reel In!"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: BAITS.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => buyBait(i),
						disabled: coins < b.cost || casting,
						className: `rounded-lg border px-3 py-1.5 text-xs transition-all disabled:opacity-40 ${bait === i ? "border-primary" : "border-line"}`,
						style: { color: bait === i ? G.accent : "var(--color-muted)" },
						children: [
							b.name,
							" ",
							b.cost > 0 && `(${b.cost}💰)`
						]
					}, i))
				}),
				catches.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: catches.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg",
						title: f.name,
						children: f.emoji
					}, i))
				})
			]
		})
	});
}
//#endregion
export { DeepSeaFishing as default };
