import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/museum-curator-FBXQk_0r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("museum-curator");
var ARTIFACT_POOL = [
	{
		name: "Golden Mask",
		theme: "ancient",
		value: 100
	},
	{
		name: "Dino Fossil",
		theme: "natural",
		value: 80
	},
	{
		name: "Pop Art",
		theme: "modern",
		value: 60
	},
	{
		name: "Clay Tablet",
		theme: "ancient",
		value: 50
	},
	{
		name: "Meteorite",
		theme: "natural",
		value: 90
	},
	{
		name: "Neon Sculpture",
		theme: "modern",
		value: 70
	}
];
function MuseumCurator() {
	const [coins, setCoins] = (0, import_react.useState)(200);
	const [artifacts, setArtifacts] = (0, import_react.useState)([]);
	const [guards, setGuards] = (0, import_react.useState)([]);
	const [thieves, setThieves] = (0, import_react.useState)([]);
	const [income, setIncome] = (0, import_react.useState)(0);
	const [day, setDay] = (0, import_react.useState)(1);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Arrange artifacts, hire guards, open the museum!");
	const [nextId, setNextId] = (0, import_react.useState)(1);
	const [nightMode, setNightMode] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			setNightMode((n) => {
				const nn = !n;
				if (nn) {
					setThieves((prev) => [...prev, {
						id: nextId,
						x: 0,
						y: 0,
						target: null,
						caught: false
					}]);
					setMsg("🌙 Night — thieves are coming! Guards patrol!");
				} else {
					setDay((d) => d + 1);
					const synergyBonus = calcSynergy(artifacts);
					const visitorIncome = artifacts.reduce((a, b) => a + b.value, 0) * .1 + synergyBonus;
					setCoins((c) => c + Math.floor(visitorIncome));
					setIncome(Math.floor(visitorIncome));
					setMsg(`☀️ Day ${day + 1} — Earned ${Math.floor(visitorIncome)} coins!`);
				}
				return nn;
			});
		}, 8e3);
		return () => clearInterval(t);
	}, [
		over,
		artifacts,
		day,
		nextId
	]);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			if (!nightMode) return;
			setGuards((prev) => prev.map((g) => ({
				...g,
				x: g.x + Math.cos(g.patrol) * 10,
				y: g.y + Math.sin(g.patrol) * 10,
				patrol: g.patrol + .1
			})));
			setThieves((prev) => {
				const nt = prev.filter((thief) => !thief.caught);
				nt.forEach((thief) => {
					if (artifacts.length === 0) return;
					const target = artifacts.reduce((a, b) => {
						const da = Math.hypot(a.floor * 50 - thief.x, 50 - thief.y);
						return Math.hypot(b.floor * 50 - thief.x, 50 - thief.y) < da ? b : a;
					});
					const dx = target.floor * 50 - thief.x;
					const dy = 50 - thief.y;
					const d = Math.hypot(dx, dy) || 1;
					thief.x += dx / d * 3;
					thief.y += dy / d * 3;
					guards.forEach((g) => {
						if (Math.hypot(g.x - thief.x, g.y - thief.y) < 30) {
							thief.caught = true;
							setCoins((c) => c + 20);
							setMsg("🚨 Thief caught! +20 coins!");
						}
					});
					if (Math.hypot(target.floor * 50 - thief.x, 50 - thief.y) < 10) {
						setArtifacts((arts) => arts.filter((a) => a.id !== target.id));
						setMsg(`💀 Thief stole the ${target.name}!`);
					}
				});
				return nt;
			});
		}, 500);
		return () => clearInterval(t);
	}, [
		over,
		nightMode,
		artifacts,
		guards
	]);
	function calcSynergy(arts) {
		let bonus = 0;
		for (let i = 0; i < arts.length; i++) for (let j = i + 1; j < arts.length; j++) if (arts[i].floor === arts[j].floor && arts[i].theme === arts[j].theme) bonus += 10;
		return bonus;
	}
	const buyArtifact = (0, import_react.useCallback)(() => {
		const pool = ARTIFACT_POOL[Math.floor(Math.random() * ARTIFACT_POOL.length)];
		const cost = pool.value;
		if (coins < cost) {
			setMsg("Not enough coins!");
			return;
		}
		setCoins((c) => c - cost);
		const floor = artifacts.length % 3;
		setArtifacts((prev) => [...prev, {
			id: nextId,
			...pool,
			floor
		}]);
		setNextId((n) => n + 1);
		setMsg(`Acquired ${pool.name} for ${cost} coins! 🏛️`);
	}, [
		coins,
		artifacts,
		nextId
	]);
	const hireGuard = (0, import_react.useCallback)(() => {
		if (coins < 50) {
			setMsg("Not enough coins for a guard!");
			return;
		}
		setCoins((c) => c - 50);
		setGuards((prev) => [...prev, {
			id: prev.length,
			x: 100,
			y: 100,
			patrol: Math.random() * Math.PI * 2
		}]);
		setMsg("Guard hired! 🛡️");
	}, [coins]);
	const reset = () => {
		setCoins(200);
		setArtifacts([]);
		setGuards([]);
		setThieves([]);
		setIncome(0);
		setDay(1);
		setOver(false);
		setMsg("Arrange artifacts, hire guards, open the museum!");
		setNextId(1);
		setNightMode(false);
	};
	const themeEmoji = {
		ancient: "🏺",
		natural: "🦴",
		modern: "🎨"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `💰${coins} 📅Day${day}`,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs",
			style: { color: nightMode ? "#a855f7" : "#fbbf24" },
			children: nightMode ? "🌙 Night" : "☀️ Day"
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-sm overflow-hidden rounded-xl border-2",
					style: {
						height: 200,
						borderColor: nightMode ? "#a855f744" : G.accent + "44",
						background: nightMode ? "#0a0a15" : "#101a24"
					},
					children: [
						[
							0,
							1,
							2
						].map((floor) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute w-full",
							style: { top: floor * 65 },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-line/50 px-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted",
									children: ["Floor ", floor + 1]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex gap-1",
									children: artifacts.filter((a) => a.floor === floor).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center rounded border border-line bg-surface p-1",
										style: { opacity: nightMode ? .6 : 1 },
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-lg",
											children: themeEmoji[a.theme]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[8px] text-muted",
											children: a.name
										})]
									}, a.id))
								})]
							})
						}, floor)),
						guards.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute text-sm",
							style: {
								left: `${g.x / 3}%`,
								top: `${g.y / 2}%`
							},
							children: "🛡️"
						}, g.id)),
						thieves.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute text-sm",
							style: {
								left: `${t.x / 3}%`,
								top: `${t.y / 2}%`,
								opacity: t.caught ? .3 : .8
							},
							children: "🥷"
						}, t.id))
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🏛️ Artifacts: ", artifacts.length] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["🛡️ Guards: ", guards.length] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Synergy: +", calcSynergy(artifacts)] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: buyArtifact,
						disabled: over,
						className: "rounded-lg border px-3 py-1.5 text-xs",
						style: {
							borderColor: G.accent,
							color: G.accent
						},
						children: "🏛️ Acquire Artifact"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: hireGuard,
						disabled: over || coins < 50,
						className: "rounded-lg border px-3 py-1.5 text-xs disabled:opacity-40",
						style: {
							borderColor: "#3ee0d0",
							color: "#3ee0d0"
						},
						children: "🛡️ Hire Guard (50💰)"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Same-theme artifacts on same floor = synergy bonus!"
				})
			]
		})
	});
}
//#endregion
export { MuseumCurator as default };
