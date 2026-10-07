import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/bonsai-cultivator-Ucl7BBC3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("bonsai-cultivator");
function BonsaiCultivator() {
	const [water, setWater] = (0, import_react.useState)(50);
	const [health, setHealth] = (0, import_react.useState)(100);
	const [income, setIncome] = (0, import_react.useState)(0);
	const [coins, setCoins] = (0, import_react.useState)(0);
	const [blooms, setBlooms] = (0, import_react.useState)(0);
	const [branches, setBranches] = (0, import_react.useState)([{
		id: 0,
		angle: 0,
		length: 40,
		tier: 0,
		bloom: false,
		children: []
	}]);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [modifiers, setModifiers] = (0, import_react.useState)({
		bioluminescent: false,
		crystalline: false,
		rapid: false
	});
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Prune and water your bonsai!");
	const [nextId, setNextId] = (0, import_react.useState)(1);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			setCoins((c) => c + blooms * (modifiers.bioluminescent ? 3 : 1) + (modifiers.crystalline ? 2 : 0));
			setWater((w) => Math.max(0, w - 2));
			if (water < 20) setHealth((h) => Math.max(0, h - 3));
			if (water >= 40) setHealth((h) => Math.min(100, h + 1));
			if (health <= 0) {
				setOver(true);
				setMsg("Your bonsai has withered... 🥀");
			}
		}, 2e3);
		return () => clearInterval(t);
	}, [
		over,
		blooms,
		water,
		health,
		modifiers
	]);
	const waterTree = (0, import_react.useCallback)(() => {
		setWater((w) => Math.min(100, w + 25));
		setHealth((h) => Math.min(100, h + 5));
		setMsg("Watered! 💧");
	}, []);
	const prune = (0, import_react.useCallback)((id) => {
		setBranches((prev) => {
			const nb = prev.filter((b) => b.id !== id);
			const parent = nb.find((b) => b.children.includes(id));
			if (parent) parent.children = parent.children.filter((c) => c !== id);
			setMsg("Pruned! ✂️");
			return nb;
		});
	}, []);
	const grow = (0, import_react.useCallback)((id) => {
		const cost = 10;
		if (coins < cost) {
			setMsg("Not enough coins!");
			return;
		}
		setCoins((c) => c - cost);
		const newId = nextId;
		setNextId((n) => n + 1);
		setBranches((prev) => {
			const nb = prev.map((b) => ({ ...b }));
			const parent = nb.find((b) => b.id === id);
			if (!parent) return prev;
			const angle = (Math.random() - .5) * 60;
			const length = parent.length * .7;
			const tier = parent.tier + 1;
			const bloom = tier >= 3 && Math.random() < (modifiers.bioluminescent ? .6 : .3);
			nb.push({
				id: newId,
				angle: parent.angle + angle,
				length,
				tier,
				bloom,
				children: []
			});
			parent.children.push(newId);
			if (bloom) {
				setBlooms((b) => b + 1);
				setMsg("A bloom appeared! 🌸");
			} else setMsg("New branch grown! 🌿");
			return nb;
		});
	}, [
		coins,
		nextId,
		modifiers
	]);
	const applyMod = (0, import_react.useCallback)((mod) => {
		const cost = {
			bioluminescent: 50,
			crystalline: 30,
			rapid: 20
		};
		if (coins < cost[mod] || modifiers[mod]) return;
		setCoins((c) => c - cost[mod]);
		setModifiers((m) => ({
			...m,
			[mod]: true
		}));
		setMsg(`Genetic modifier applied: ${mod}! 🧬`);
	}, [coins, modifiers]);
	const reset = () => {
		setWater(50);
		setHealth(100);
		setCoins(0);
		setBlooms(0);
		setBranches([{
			id: 0,
			angle: 0,
			length: 40,
			tier: 0,
			bloom: false,
			children: []
		}]);
		setSelected(null);
		setModifiers({
			bioluminescent: false,
			crystalline: false,
			rapid: false
		});
		setOver(false);
		setMsg("Prune and water your bonsai!");
		setNextId(1);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `💰${coins} 🌸${blooms}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative h-48 w-48 rounded-xl border-2",
					style: {
						borderColor: G.accent + "44",
						background: "linear-gradient(180deg, transparent 60%, #1a2a1a)"
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
						viewBox: "-100 -120 200 200",
						className: "h-full w-full",
						children: [branches.map((b) => {
							const parent = branches.find((p) => p.children.includes(b.id));
							const px = parent ? parent.angle / 180 * Math.PI : 0;
							parent && parent.length * Math.cos(px) * (parent.tier === 0 ? 0 : 1);
							const x2 = Math.sin(b.angle / 180 * Math.PI) * b.length;
							const y2 = 40 - b.length * Math.cos(b.angle / 180 * Math.PI);
							const x1 = parent ? Math.sin(parent.angle / 180 * Math.PI) * parent.length : 0;
							const y1 = parent ? 40 - parent.length * Math.cos(parent.angle / 180 * Math.PI) : 40;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
								onClick: () => setSelected(b.id),
								style: { cursor: "pointer" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
									x1,
									y1,
									x2,
									y2,
									stroke: selected === b.id ? G.accent : "#22c55e",
									strokeWidth: Math.max(2, 8 - b.tier * 2),
									strokeLinecap: "round"
								}), b.bloom && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx: x2,
									cy: y2,
									r: 4,
									fill: modifiers.bioluminescent ? "#a855f7" : "#ec4899",
									className: modifiers.bioluminescent ? "animate-pulse" : ""
								})]
							}, b.id);
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
							x: -20,
							y: 40,
							width: 40,
							height: 10,
							rx: 3,
							fill: "#8b5e3c"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-xs gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: "💧 Water"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 rounded-full bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-primary",
								style: { width: `${water}%` }
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted",
							children: "💚 Health"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 rounded-full bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full rounded-full bg-green-500",
								style: { width: `${health}%` }
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: waterTree,
							disabled: over,
							className: "rounded-lg border px-3 py-1.5 text-xs",
							style: {
								borderColor: "#3ee0d0",
								color: "#3ee0d0"
							},
							children: "💧 Water"
						}),
						selected !== null && selected !== 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => grow(selected),
							disabled: over || coins < 10,
							className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
							style: {
								borderColor: "#22c55e",
								color: "#22c55e"
							},
							children: "🌿 Grow (10💰)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								prune(selected);
								setSelected(null);
							},
							disabled: over,
							className: "rounded-lg border px-3 py-1.5 text-xs",
							style: {
								borderColor: "#ff6a3d",
								color: "#ff6a3d"
							},
							children: "✂️ Prune"
						})] }),
						selected === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => grow(0),
							disabled: over || coins < 10,
							className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
							style: {
								borderColor: "#22c55e",
								color: "#22c55e"
							},
							children: "🌿 Grow (10💰)"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => applyMod("bioluminescent"),
						disabled: over || modifiers.bioluminescent || coins < 50,
						className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
						style: {
							borderColor: "#a855f7",
							color: "#a855f7"
						},
						children: "🧬 Bioluminescent (50)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => applyMod("crystalline"),
						disabled: over || modifiers.crystalline || coins < 30,
						className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
						style: {
							borderColor: "#60a5fa",
							color: "#60a5fa"
						},
						children: "💎 Crystalline (30)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Tap branches to select · Grow for more blooms!"
				})
			]
		})
	});
}
//#endregion
export { BonsaiCultivator as default };
