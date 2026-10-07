import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hanoi-kinetic-DcByFgFD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("hanoi-kinetic");
var DISKS = 5;
var WEIGHT_LIMIT = 10;
function HanoiKinetic() {
	const [pegs, setPegs] = (0, import_react.useState)([
		[
			5,
			4,
			3,
			2,
			1
		],
		[],
		[]
	]);
	const [sel, setSel] = (0, import_react.useState)(null);
	const [moves, setMoves] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Move all disks to peg 3!");
	const [tipped, setTipped] = (0, import_react.useState)(false);
	const weights = [
		1,
		2,
		3,
		5,
		8
	];
	const move = (0, import_react.useCallback)((to) => {
		if (over || sel === null) return;
		setPegs((prev) => {
			const np = prev.map((p) => [...p]);
			const from = sel;
			if (!np[from].length) return prev;
			const disk = np[from][np[from].length - 1];
			if (np[to].length && np[to][np[to].length - 1] <= disk) {
				setMsg("❌ Larger disk can't go on smaller!");
				return prev;
			}
			np[from].pop();
			np[to].push(disk);
			if (np[to].reduce((a, d) => a + weights[d - 1], 0) > WEIGHT_LIMIT) {
				setMsg("⚠️ Column overloaded — disks scatter!");
				setTipped(true);
				const allDisks = np.flat().sort((a, b) => b - a);
				np[0] = [];
				np[1] = [];
				np[2] = [];
				allDisks.forEach((d, i) => np[i % 3].push(d));
				setTimeout(() => setTipped(false), 1e3);
			}
			setMoves((m) => m + 1);
			setSel(null);
			if (np[2].length === DISKS && np[2].every((d, i) => d === DISKS - i)) {
				setOver(true);
				setMsg(`Solved in ${moves + 1} moves! 🎉`);
			}
			return np;
		});
	}, [
		over,
		sel,
		moves
	]);
	const reset = () => {
		setPegs([
			[
				5,
				4,
				3,
				2,
				1
			],
			[],
			[]
		]);
		setSel(null);
		setMoves(0);
		setOver(false);
		setMsg("Move all disks to peg 3!");
		setTipped(false);
	};
	const colors = [
		"#3ee0d0",
		"#22c55e",
		"#f59e0b",
		"#ff6a3d",
		"#a855f7"
	];
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
				tipped && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ember animate-pulse",
					children: "💥 Column tipped! Disks scattered!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-6 md:gap-12",
					children: pegs.map((peg, pi) => {
						const weight = peg.reduce((a, d) => a + weights[d - 1], 0);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								if (sel === null) {
									if (peg.length) setSel(pi);
								} else move(pi);
							},
							className: "relative flex h-48 w-20 flex-col items-center justify-end rounded-lg border-2 transition-all md:w-24",
							style: {
								borderColor: sel === pi ? G.accent : "var(--color-line)",
								background: sel === pi ? G.accent + "11" : "var(--color-surface)"
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute bottom-2 h-32 w-1",
									style: { background: "var(--color-line)" }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "absolute top-1 text-[10px] font-mono",
									style: { color: weight > WEIGHT_LIMIT * .7 ? "#ff6a3d" : "var(--color-muted)" },
									children: [
										weight,
										"/",
										WEIGHT_LIMIT
									]
								}),
								peg.map((disk, di) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mb-0.5 rounded-md",
									style: {
										width: `${20 + disk * 12}px`,
										height: 16,
										background: colors[disk - 1],
										boxShadow: `0 0 6px ${colors[disk - 1]}88`
									}
								}, di)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 text-xs text-muted",
									children: ["Peg ", pi + 1]
								})
							]
						}, pi);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Tap a peg to select, tap another to move"
				})
			]
		})
	});
}
//#endregion
export { HanoiKinetic as default };
