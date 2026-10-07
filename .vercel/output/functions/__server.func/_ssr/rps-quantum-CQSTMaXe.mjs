import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rps-quantum-CQSTMaXe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("rps-quantum");
var MOVES = [
	"rock",
	"paper",
	"scissors"
];
var EMOJI = {
	rock: "🪨",
	paper: "📄",
	scissors: "✂️"
};
var BEATS = {
	rock: "scissors",
	paper: "rock",
	scissors: "paper"
};
function RPSQuantum() {
	const [playerHP, setPlayerHP] = (0, import_react.useState)(100);
	const [aiHP, setAiHP] = (0, import_react.useState)(100);
	const [charge, setCharge] = (0, import_react.useState)(0);
	const [round, setRound] = (0, import_react.useState)(0);
	const [log, setLog] = (0, import_react.useState)("Choose your move!");
	const [over, setOver] = (0, import_react.useState)(false);
	const [superReady, setSuperReady] = (0, import_react.useState)(false);
	const history = (0, import_react.useRef)([]);
	const predict = (0, import_react.useCallback)(() => {
		const h = history.current;
		if (h.length < 2) return MOVES[Math.floor(Math.random() * 3)];
		const last = h[h.length - 1];
		const next = h[h.length - 2];
		const counts = {
			rock: 0,
			paper: 0,
			scissors: 0
		};
		for (let i = 0; i < h.length - 1; i++) if (h[i] === last && h[i + 1] === next) counts[h[i + 1]] = (counts[h[i + 1]] || 0) + 1;
		const predicted = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? MOVES[Math.floor(Math.random() * 3)];
		return BEATS[predicted] === predicted ? MOVES[Math.floor(Math.random() * 3)] : Object.keys(BEATS).find((k) => BEATS[k] === predicted);
	}, []);
	const play = (0, import_react.useCallback)((move, isSuper) => {
		if (over) return;
		history.current.push(move);
		const ai = predict();
		let dmg = 0;
		let aiDmg = 0;
		if (move === ai) setLog(`Both played ${EMOJI[move]}! Tie — no damage.`);
		else if (BEATS[move] === ai) {
			dmg = isSuper ? 35 : 15;
			aiDmg = 5;
			setLog(`${isSuper ? "⚡ SUPER " : ""}${EMOJI[move]} beats ${EMOJI[ai]}! ${dmg} dmg to AI!`);
		} else {
			dmg = 5;
			aiDmg = isSuper ? 10 : 18;
			setLog(`${EMOJI[ai]} beats ${EMOJI[move]}! ${aiDmg} dmg to you!`);
		}
		const newAiHP = Math.max(0, aiHP - dmg);
		const newPlayerHP = Math.max(0, playerHP - aiDmg);
		setAiHP(newAiHP);
		setPlayerHP(newPlayerHP);
		setRound((r) => r + 1);
		if (isSuper) {
			setCharge(0);
			setSuperReady(false);
		} else setCharge((c) => {
			const nc = c + 1;
			if (nc >= 5) {
				setSuperReady(true);
				setLog((l) => l + " ⚡ Super-move ready!");
			}
			return nc >= 5 ? 5 : nc;
		});
		if (newAiHP <= 0 || newPlayerHP <= 0) {
			setOver(true);
			setLog(newAiHP <= 0 ? "Victory! The AI is defeated!" : "Defeated by the AI!");
		}
	}, [
		over,
		predict,
		aiHP,
		playerHP
	]);
	const reset = () => {
		setPlayerHP(100);
		setAiHP(100);
		setCharge(0);
		setRound(0);
		setLog("Choose your move!");
		setOver(false);
		setSuperReady(false);
		history.current = [];
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `R${round}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-5 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-md gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-1 text-xs text-muted",
							children: [
								"You ",
								playerHP,
								"HP"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-3 overflow-hidden rounded-full bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-primary transition-all",
								style: { width: `${playerHP}%` }
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mb-1 text-right text-xs text-muted",
							children: [
								"AI ",
								aiHP,
								"HP"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-3 overflow-hidden rounded-full bg-surface",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "ml-auto h-full bg-ember transition-all",
								style: { width: `${aiHP}%` }
							})
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "⚡ Charge Meter"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							style: { color: G.accent },
							children: [
								charge,
								"/5 ",
								superReady && "— READY!"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 flex gap-1",
						children: [
							0,
							1,
							2,
							3,
							4
						].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 flex-1 rounded-full",
							style: { background: i < charge ? G.accent : "var(--color-line)" }
						}, i))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-center text-sm text-dust",
					children: log
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-3",
					children: MOVES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: over,
						onClick: () => play(m, false),
						className: "flex size-20 flex-col items-center justify-center gap-1 rounded-xl border border-line bg-surface text-3xl transition-all hover:border-primary/40 hover:bg-elevated md:size-24",
						children: [EMOJI[m], /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] uppercase text-muted",
							children: m
						})]
					}, m))
				}),
				superReady && !over && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => play(MOVES[Math.floor(Math.random() * 3)], true),
					className: "rounded-lg px-6 py-3 text-sm font-bold animate-pulse",
					style: {
						background: G.accent,
						color: "#071018"
					},
					children: "⚡ UNLEASH SUPER-MOVE!"
				})
			]
		})
	});
}
//#endregion
export { RPSQuantum as default };
