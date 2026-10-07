import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cyber-hangman-C1_BdzVa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("cyber-hangman");
var WORDS = [
	"FIREWALL",
	"QUANTUM",
	"ENCRYPT",
	"PROTOCOL",
	"NEURAL",
	"BREACH",
	"MATRIX",
	"CIPHER",
	"DIGITAL",
	"HACKING",
	"SYSTEM",
	"CIRCUIT",
	"NETWORK",
	"BINARY"
];
function CyberHangman() {
	const [word, setWord] = (0, import_react.useState)(() => WORDS[Math.floor(Math.random() * WORDS.length)]);
	const [guessed, setGuessed] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [wrong, setWrong] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Breach the firewall!");
	const [scrambled, setScrambled] = (0, import_react.useState)(false);
	const [dimmed, setDimmed] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const display = word.split("").map((l) => guessed.has(l) ? l : "_");
	const won = display.every((l) => l !== "_");
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	if (wrong >= 6 && !over) {
		setOver(true);
		setMsg(`Breached! The word was ${word}`);
	} else if (won && !over) {
		setOver(true);
		setMsg("Firewall breached! You win!");
	}
	const guess = (0, import_react.useCallback)((letter) => {
		if (over || guessed.has(letter) || dimmed.has(letter)) return;
		const ng = new Set(guessed);
		ng.add(letter);
		setGuessed(ng);
		if (!word.includes(letter)) setWrong((w) => {
			const nw = w + 1;
			if (nw % 2 === 0) {
				setScrambled(true);
				setMsg("🤖 Drone scramble! Letters rearranged!");
				setTimeout(() => setScrambled(false), 2e3);
			} else {
				const dim = new Set(dimmed);
				const avail = alphabet.filter((l) => !ng.has(l) && !dim.has(l));
				if (avail.length) dim.add(avail[Math.floor(Math.random() * avail.length)]);
				setDimmed(dim);
				setMsg("🤖 Drone dimmed a key!");
			}
			return nw;
		});
		else setMsg("Letter accepted!");
	}, [
		over,
		guessed,
		word,
		dimmed,
		alphabet
	]);
	const reset = () => {
		setWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
		setGuessed(/* @__PURE__ */ new Set());
		setWrong(0);
		setOver(false);
		setMsg("Breach the firewall!");
		setScrambled(false);
		setDimmed(/* @__PURE__ */ new Set());
	};
	const displayAlpha = scrambled ? [...alphabet].sort(() => Math.random() - .5) : alphabet;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `❌${wrong}/6`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-5 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: Array.from({ length: 6 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xl",
						style: { opacity: i < wrong ? 1 : .2 },
						children: "🤖"
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: display.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex size-10 items-center justify-center rounded-lg border font-mono text-xl font-bold md:size-12",
						style: {
							borderColor: l !== "_" ? G.accent : "var(--color-line)",
							color: l !== "_" ? G.accent : "var(--color-muted)",
							background: l !== "_" ? G.accent + "11" : "var(--color-surface)"
						},
						children: l
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-7 gap-1.5 sm:grid-cols-9",
					children: displayAlpha.map((l) => {
						const used = guessed.has(l);
						const dim = dimmed.has(l);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: over || used || dim,
							onClick: () => guess(l),
							className: "flex size-9 items-center justify-center rounded-md border text-sm font-bold transition-all md:size-10",
							style: {
								borderColor: used ? "var(--color-line)" : G.accent + "44",
								background: used ? "var(--color-elevated)" : dim ? "var(--color-bg)" : "var(--color-surface)",
								color: used ? "var(--color-muted)" : dim ? "var(--color-line)" : G.accent,
								opacity: dim ? .3 : 1
							},
							children: l
						}, l);
					})
				})
			]
		})
	});
}
//#endregion
export { CyberHangman as default };
