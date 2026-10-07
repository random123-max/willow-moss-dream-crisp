import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mastermind-alchemy-CT5UNRtY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("mastermind-alchemy");
var ELEMENTS = [
	"🔥",
	"💧",
	"🌿",
	"⚡",
	"🔮",
	"❄️"
];
var CODE_LEN = 4;
function genCode() {
	return Array.from({ length: CODE_LEN }, () => ELEMENTS[Math.floor(Math.random() * ELEMENTS.length)]);
}
function check(code, guess) {
	const exact = Array(CODE_LEN).fill(false);
	const used = Array(CODE_LEN).fill(false);
	let exactCount = 0;
	for (let i = 0; i < CODE_LEN; i++) if (guess[i] === code[i]) {
		exact[i] = true;
		used[i] = true;
		exactCount++;
	}
	let partialCount = 0;
	const reactions = [];
	for (let i = 0; i < CODE_LEN; i++) {
		if (exact[i]) {
			reactions.push("🟢");
			continue;
		}
		let found = false;
		for (let j = 0; j < CODE_LEN; j++) if (!used[j] && guess[i] === code[j]) {
			if (guess[i] === "🔥" && code[j] === "💧" || guess[i] === "💧" && code[j] === "🔥") reactions.push("💨");
			else reactions.push("🟡");
			used[j] = true;
			partialCount++;
			found = true;
			break;
		}
		if (!found) reactions.push("⚫");
	}
	return {
		exact: exactCount,
		partial: partialCount,
		reactions
	};
}
function MastermindAlchemy() {
	const [code, setCode] = (0, import_react.useState)(genCode);
	const [guesses, setGuesses] = (0, import_react.useState)([]);
	const [feedback, setFeedback] = (0, import_react.useState)([]);
	const [current, setCurrent] = (0, import_react.useState)([]);
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Break the alchemical code!");
	const submit = (0, import_react.useCallback)(() => {
		if (over || current.length !== CODE_LEN) return;
		const fb = check(code, current);
		const ng = [...guesses, current];
		const nf = [...feedback, fb.reactions];
		setGuesses(ng);
		setFeedback(nf);
		setCurrent([]);
		if (fb.exact === CODE_LEN) {
			setOver(true);
			setWon(true);
			setMsg("Alchemical breach! 🎉");
		} else if (ng.length >= 8) {
			setOver(true);
			setMsg(`Failed! Code was ${code.join("")}`);
		} else setMsg(`${fb.exact} exact, ${fb.partial} partial. ${fb.reactions.includes("💨") ? "💨 Steam hints!" : ""}`);
	}, [
		over,
		current,
		code,
		guesses,
		feedback
	]);
	const reset = () => {
		setCode(genCode());
		setGuesses([]);
		setFeedback([]);
		setCurrent([]);
		setOver(false);
		setWon(false);
		setMsg("Break the alchemical code!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${guesses.length}/8`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1",
					children: guesses.map((g, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: g.map((el, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-8 items-center justify-center rounded text-lg",
								style: {
									background: "var(--color-surface)",
									border: "1px solid var(--color-line)"
								},
								children: el
							}, j))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: feedback[i]?.map((f, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm",
								children: f
							}, j))
						})]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: Array.from({ length: CODE_LEN }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex size-10 items-center justify-center rounded text-xl",
						style: {
							background: current[i] ? "var(--color-elevated)" : "var(--color-surface)",
							border: `2px solid ${current[i] ? G.accent : "var(--color-line)"}`
						},
						children: current[i] || "?"
					}, i))
				}),
				!over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: ELEMENTS.map((el) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCurrent((c) => c.length < CODE_LEN ? [...c, el] : c),
						className: "flex size-10 items-center justify-center rounded-lg border text-xl transition-all hover:scale-110",
						style: {
							borderColor: G.accent + "44",
							background: G.accent + "11"
						},
						children: el
					}, el))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCurrent((c) => c.slice(0, -1)),
						className: "rounded-lg border border-line px-3 py-1.5 text-sm text-muted",
						children: "⌫"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: submit,
						disabled: current.length !== CODE_LEN,
						className: "rounded-lg px-4 py-1.5 text-sm font-bold disabled:opacity-40",
						style: {
							background: G.accent,
							color: "#071018"
						},
						children: "Brew"
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🟢 Exact" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "🟡 Partial" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "💨 Steam (Fire+Water)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "⚫ Wrong" })
					]
				})
			]
		})
	});
}
//#endregion
export { MastermindAlchemy as default };
