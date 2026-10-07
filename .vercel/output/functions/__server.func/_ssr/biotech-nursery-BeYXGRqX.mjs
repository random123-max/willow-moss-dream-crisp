import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/biotech-nursery-BeYXGRqX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("biotech-nursery");
var TREE = [
	{
		id: "microbe",
		name: "Microbe",
		emoji: "🦠"
	},
	{
		id: "blob",
		name: "Blob",
		emoji: "🫧"
	},
	{
		id: "slime",
		name: "Slime",
		emoji: "🟢"
	},
	{
		id: "spore",
		name: "Spore",
		emoji: "🍄"
	},
	{
		id: "sprout",
		name: "Sprout",
		emoji: "🌱"
	},
	{
		id: "gecko",
		name: "Gecko",
		emoji: "🦎"
	},
	{
		id: "crystal",
		name: "Crystal Being",
		emoji: "💎"
	},
	{
		id: "ethereal",
		name: "Ethereal",
		emoji: "👻"
	},
	{
		id: "ascended",
		name: "Ascended",
		emoji: "✨"
	}
];
function BiotechNursery() {
	const [stage, setStage] = (0, import_react.useState)(0);
	const [hp, setHp] = (0, import_react.useState)(80);
	const [hunger, setHunger] = (0, import_react.useState)(50);
	const [sleep, setSleep] = (0, import_react.useState)(50);
	const [radiation, setRadiation] = (0, import_react.useState)(0);
	const [mutateReady, setMutateReady] = (0, import_react.useState)(false);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Care for your pet to evolve it!");
	const [mutations, setMutations] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			setHunger((h) => {
				const nh = Math.min(100, h + 3);
				if (nh >= 100) {
					setHp((hp) => Math.max(0, hp - 5));
					setMsg("Your pet is starving! 💔");
				}
				return nh;
			});
			setSleep((s) => {
				const ns = Math.min(100, s + 2);
				if (ns >= 100) setMsg("Your pet is exhausted! 😴");
				return ns;
			});
			setRadiation((r) => {
				return Math.max(0, r - 1);
			});
			if (hp <= 0) {
				setOver(true);
				setMsg("Your pet has died... 💀");
			}
			if (hp > 50 && hunger < 50 && sleep < 50 && radiation < 30) setMutateReady(true);
			else setMutateReady(false);
		}, 2e3);
		return () => clearInterval(t);
	}, [
		over,
		hp,
		hunger,
		sleep,
		radiation
	]);
	const feed = (0, import_react.useCallback)(() => {
		if (over) return;
		setHunger((h) => Math.max(0, h - 30));
		setHp((hp) => Math.min(100, hp + 5));
		setMsg("Fed! 🍖");
	}, [over]);
	const rest = (0, import_react.useCallback)(() => {
		if (over) return;
		setSleep((s) => Math.max(0, s - 40));
		setMsg("Rested! 😴");
	}, [over]);
	const irradiate = (0, import_react.useCallback)(() => {
		if (over) return;
		setRadiation((r) => Math.min(100, r + 25));
		setMsg("Irradiated! High radiation causes random mutations! ☢️");
	}, [over]);
	const mutate = (0, import_react.useCallback)(() => {
		if (over || !mutateReady) return;
		if (stage >= TREE.length - 1) {
			setMsg("Fully evolved! 🎉");
			return;
		}
		let next = stage + 1;
		if (radiation > 50) {
			next = Math.min(TREE.length - 1, stage + 1 + Math.floor(Math.random() * 2));
			setMutations((m) => [...m, `Mutated to ${TREE[next].name}!`]);
		}
		setStage(next);
		setMsg(`Evolved into ${TREE[next].name}! ${TREE[next].emoji} 🎉`);
		setMutateReady(false);
	}, [
		over,
		mutateReady,
		stage,
		radiation
	]);
	const reset = () => {
		setStage(0);
		setHp(80);
		setHunger(50);
		setSleep(50);
		setRadiation(0);
		setMutateReady(false);
		setOver(false);
		setMsg("Care for your pet to evolve it!");
		setMutations([]);
	};
	const pet = TREE[stage];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: pet.name,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex size-32 items-center justify-center rounded-full",
					style: {
						background: radiation > 50 ? "#22c55e22" : `${G.accent}11`,
						boxShadow: `0 0 20px ${radiation > 50 ? "#22c55e" : G.accent}33`
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-5xl",
						style: { filter: radiation > 50 ? "hue-rotate(60deg)" : "none" },
						children: pet.emoji
					}), radiation > 50 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -top-2 -right-2 text-lg animate-pulse",
						children: "☢️"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-xs space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Health",
							value: hp,
							color: "#3ee0d0"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Hunger",
							value: hunger,
							color: "#f59e0b"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Fatigue",
							value: sleep,
							color: "#a855f7"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Radiation",
							value: radiation,
							color: "#22c55e",
							warn: radiation > 50
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: feed,
							disabled: over,
							className: "rounded-lg border px-3 py-1.5 text-xs",
							style: {
								borderColor: "#f59e0b",
								color: "#f59e0b"
							},
							children: "🍖 Feed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: rest,
							disabled: over,
							className: "rounded-lg border px-3 py-1.5 text-xs",
							style: {
								borderColor: "#a855f7",
								color: "#a855f7"
							},
							children: "💤 Rest"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: irradiate,
							disabled: over,
							className: "rounded-lg border px-3 py-1.5 text-xs",
							style: {
								borderColor: "#22c55e",
								color: "#22c55e"
							},
							children: "☢️ Irradiate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: mutate,
							disabled: over || !mutateReady,
							className: "rounded-lg px-3 py-1.5 text-xs font-bold disabled:opacity-40",
							style: {
								background: mutateReady ? G.accent : "var(--color-surface)",
								color: mutateReady ? "#071018" : "var(--color-muted)"
							},
							children: "🧬 Evolve"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-1",
					children: TREE.map((t, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-xs ${i <= stage ? "" : "opacity-30"}`,
						children: i <= stage ? t.emoji : "🔒"
					}, i))
				}),
				mutations.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-ember",
					children: m
				}, i))
			]
		})
	});
}
function Stat({ label, value, color, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			style: { color: warn ? "#ff6a3d" : color },
			children: Math.round(value)
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-0.5 h-1.5 overflow-hidden rounded-full bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full",
			style: {
				width: `${value}%`,
				background: warn && value > 50 ? "#ff6a3d" : color
			}
		})
	})] });
}
//#endregion
export { BiotechNursery as default };
