import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/wordle-cipher-CUcmbaek.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("wordle-cipher");
var WORDS = [
	"CYBER",
	"GHOST",
	"PIXEL",
	"NOVA",
	"ORBIT",
	"LASER",
	"VAULT",
	"QUARK",
	"PRISM",
	"RADAR",
	"BLAZE",
	"FLUX"
];
function WordleCipher() {
	const [word, setWord] = (0, import_react.useState)(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
	const [guesses, setGuesses] = (0, import_react.useState)([]);
	const [current, setCurrent] = (0, import_react.useState)("");
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [locked, setLocked] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [msg, setMsg] = (0, import_react.useState)("Guess the 5-letter cipher!");
	const submit = (0, import_react.useCallback)(() => {
		if (over || current.length !== 5) return;
		const ng = [...guesses, current];
		setGuesses(ng);
		setCurrent("");
		if (current === word) {
			setOver(true);
			setWon(true);
			setMsg("Cipher cracked! 🎉");
			return;
		}
		if (ng.length >= 6) {
			setOver(true);
			setMsg(`Breached! The word was ${word}`);
			return;
		}
		const avail = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter((l) => !current.includes(l) && !locked.has(l));
		if (avail.length > 2) {
			const nl = new Set(locked);
			nl.add(avail[Math.floor(Math.random() * avail.length)]);
			setLocked(nl);
			setMsg("🛡️ Firewall locked a key for next turn!");
		}
	}, [
		over,
		current,
		word,
		guesses,
		locked
	]);
	const getColor = (letter, idx) => {
		if (word[idx] === letter) return G.accent;
		if (word.includes(letter)) return "#f59e0b";
		return "var(--color-line)";
	};
	const reset = () => {
		setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
		setGuesses([]);
		setCurrent("");
		setOver(false);
		setWon(false);
		setLocked(/* @__PURE__ */ new Set());
		setMsg("Guess the 5-letter cipher!");
	};
	const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${guesses.length}/6`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-1",
					children: Array.from({ length: 6 }, (_, r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1",
						children: Array.from({ length: 5 }, (_, c) => {
							const guess = guesses[r];
							const letter = guess?.[c] ?? (r === guesses.length ? current[c] : "");
							const color = guess ? getColor(guess[c], c) : "var(--color-line)";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex size-12 items-center justify-center rounded font-mono text-xl font-bold md:size-14",
								style: {
									background: letter ? color + "22" : "var(--color-surface)",
									border: `2px solid ${color}`,
									color: color === "var(--color-line)" ? "var(--color-fg)" : color
								},
								children: letter
							}, c);
						})
					}, r))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1 sm:grid-cols-9",
					children: alpha.map((l) => {
						guesses.some((g) => g.includes(l));
						const isLocked = locked.has(l) && !over;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: over || isLocked || current.length >= 5,
							onClick: () => setCurrent((c) => c.length < 5 ? c + l : c),
							className: "flex size-8 items-center justify-center rounded text-sm font-bold transition-all md:size-10",
							style: {
								background: isLocked ? "var(--color-bg)" : "var(--color-surface)",
								border: `1px solid ${isLocked ? "var(--color-line)" : G.accent + "44"}`,
								color: isLocked ? "var(--color-line)" : G.accent,
								opacity: isLocked ? .3 : 1
							},
							children: isLocked ? "🔒" : l
						}, l);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCurrent((c) => c.slice(0, -1)),
						className: "rounded-lg border border-line px-4 py-2 text-sm text-muted",
						children: "⌫"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: submit,
						disabled: current.length !== 5 || over,
						className: "rounded-lg px-6 py-2 text-sm font-bold disabled:opacity-40",
						style: {
							background: G.accent,
							color: "#071018"
						},
						children: "Enter"
					})]
				})
			]
		})
	});
}
//#endregion
export { WordleCipher as default };
