import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/sliding-paradox-BJZrfIUk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("sliding-paradox");
var SIZE = 3;
var TOTAL = 9;
function init() {
	const tiles = [];
	for (let i = 1; i < TOTAL; i++) tiles.push({
		val: i,
		circuit: Math.floor(Math.random() * 4)
	});
	tiles.push({
		val: 0,
		circuit: 0
	});
	for (let i = tiles.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[tiles[i], tiles[j]] = [tiles[j], tiles[i]];
	}
	return tiles;
}
function isSolved(tiles) {
	for (let i = 0; i < 8; i++) if (tiles[i].val !== i + 1) return false;
	return true;
}
var CIRCUIT_COLORS = [
	"#3ee0d0",
	"#ff6a3d",
	"#fbbf24",
	"#a855f7"
];
function SlidingParadox() {
	const [tiles, setTiles] = (0, import_react.useState)(init);
	const [moves, setMoves] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Slide tiles into order!");
	const [circuitsAligned, setCircuitsAligned] = (0, import_react.useState)(false);
	const empty = tiles.findIndex((t) => t.val === 0);
	const slide = (0, import_react.useCallback)((idx) => {
		if (over) return;
		const r = Math.floor(idx / SIZE), c = idx % SIZE;
		const er = Math.floor(empty / SIZE), ec = empty % SIZE;
		if (Math.abs(r - er) + Math.abs(c - ec) !== 1) return;
		setTiles((prev) => {
			const nt = [...prev];
			[nt[idx], nt[empty]] = [nt[empty], nt[idx]];
			nt[empty] = {
				...nt[empty],
				circuit: (nt[empty].circuit + 1) % 4
			};
			setMoves((m) => m + 1);
			const allSameCircuit = nt.slice(0, 8).every((t) => t.circuit === nt[0].circuit);
			setCircuitsAligned(allSameCircuit);
			if (isSolved(nt) && allSameCircuit) {
				setOver(true);
				setMsg("Both layers solved! 🎉");
			} else if (isSolved(nt)) setMsg("Numbers aligned! Align circuits too!");
			else if (allSameCircuit) setMsg("Circuits aligned! Now fix the numbers!");
			else setMsg("Keep sliding...");
			return nt;
		});
	}, [over, empty]);
	const reset = () => {
		setTiles(init());
		setMoves(0);
		setOver(false);
		setMsg("Slide tiles into order!");
		setCircuitsAligned(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${moves} moves`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative grid grid-cols-3 gap-1 rounded-xl border-2 p-2",
					style: { borderColor: G.accent + "44" },
					children: tiles.map((tile, idx) => {
						if (tile.val === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-20 md:size-24" }, idx);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => slide(idx),
							className: "flex size-20 flex-col items-center justify-center rounded-lg font-mono text-2xl font-bold transition-all hover:scale-95 md:size-24",
							style: {
								background: CIRCUIT_COLORS[tile.circuit] + "22",
								border: `2px solid ${CIRCUIT_COLORS[tile.circuit]}`,
								color: CIRCUIT_COLORS[tile.circuit],
								boxShadow: `0 0 8px ${CIRCUIT_COLORS[tile.circuit]}44`
							},
							children: [tile.val, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[8px] opacity-50",
								children: ["━━ ", tile.circuit + 1]
							})]
						}, idx);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 text-xs",
					children: CIRCUIT_COLORS.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-block size-3 rounded",
								style: { background: c }
							}),
							" ",
							i + 1
						]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Align numbers 1-8 AND matching circuit colors!"
				})
			]
		})
	});
}
//#endregion
export { SlidingParadox as default };
