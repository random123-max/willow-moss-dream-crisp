import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chrono-memory-DsKxXxmZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("chrono-memory");
var RUNES = [
	"🔮",
	"⚔️",
	"🛡️",
	"🗡️",
	"🧪",
	"📜",
	"🗝️",
	"💀"
];
var PAIRS = [...RUNES, ...RUNES];
function shuffle(a) {
	const b = [...a];
	for (let i = b.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[b[i], b[j]] = [b[j], b[i]];
	}
	return b;
}
function ChronoMemory() {
	const [cards, setCards] = (0, import_react.useState)(() => shuffle(PAIRS).map((r, i) => ({
		id: i,
		rune: r,
		flipped: false,
		matched: false,
		cursed: Math.random() < .12
	})));
	const [flipped, setFlipped] = (0, import_react.useState)([]);
	const [time, setTime] = (0, import_react.useState)(60);
	const [matches, setMatches] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Match the runes!");
	const [lock, setLock] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => setTime((s) => {
			if (s <= 1) {
				setOver(true);
				setMsg("Time's up!");
				return 0;
			}
			return s - 1;
		}), 1e3);
		return () => clearInterval(t);
	}, [over]);
	const flip = (0, import_react.useCallback)((idx) => {
		if (lock || over || cards[idx].flipped || cards[idx].matched) return;
		const nc = [...cards];
		nc[idx] = {
			...nc[idx],
			flipped: true
		};
		setCards(nc);
		const nf = [...flipped, idx];
		setFlipped(nf);
		if (nf.length === 2) {
			setLock(true);
			const [a, b] = nf;
			if (nc[a].rune === nc[b].rune) setTimeout(() => {
				setCards((prev) => {
					const np = [...prev];
					np[a] = {
						...np[a],
						matched: true
					};
					np[b] = {
						...np[b],
						matched: true
					};
					return np;
				});
				setMatches((m) => {
					const nm = m + 1;
					if (nc[a].cursed || nc[b].cursed) {
						setMsg("💀 Cursed card! Board shuffling!");
						setCards((prev) => {
							const shuffled = shuffle(prev.filter((c) => !c.matched).map((c, i) => ({
								...c,
								flipped: false
							})));
							let si = 0;
							return prev.map((c) => c.matched ? c : shuffled[si++]);
						});
					} else {
						setTime((t) => t + 5);
						setMsg("Match! +5 seconds");
					}
					if (nm >= RUNES.length) {
						setOver(true);
						setMsg("All matched! Victory!");
					}
					return nm;
				});
				setFlipped([]);
				setLock(false);
			}, 500);
			else setTimeout(() => {
				setCards((prev) => {
					const np = [...prev];
					np[a] = {
						...np[a],
						flipped: false
					};
					np[b] = {
						...np[b],
						flipped: false
					};
					return np;
				});
				setFlipped([]);
				setLock(false);
				setMsg("No match — try again");
			}, 800);
		}
	}, [
		cards,
		flipped,
		lock,
		over
	]);
	const reset = () => {
		setCards(shuffle(PAIRS).map((r, i) => ({
			id: i,
			rune: r,
			flipped: false,
			matched: false,
			cursed: Math.random() < .12
		})));
		setFlipped([]);
		setTime(60);
		setMatches(0);
		setOver(false);
		setMsg("Match the runes!");
		setLock(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `⏱️${time}s`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex w-full max-w-sm items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm",
						style: { color: time < 15 ? "#ff6a3d" : G.accent },
						children: [
							"⏱️ ",
							time,
							"s"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted",
						children: [
							"Matches: ",
							matches,
							"/",
							RUNES.length
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: cards.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: c.matched || over,
						onClick: () => flip(i),
						className: "flex size-16 items-center justify-center rounded-lg border text-2xl transition-all md:size-20",
						style: {
							background: c.matched ? "var(--color-elevated)" : c.flipped ? "var(--color-surface)" : "var(--color-bg)",
							borderColor: c.flipped || c.matched ? G.accent + "55" : "var(--color-line)",
							opacity: c.matched ? .3 : 1,
							transform: c.flipped ? "rotateY(0)" : "rotateY(0)"
						},
						children: c.flipped || c.matched ? c.rune : "❓"
					}, c.id))
				})
			]
		})
	});
}
//#endregion
export { ChronoMemory as default };
