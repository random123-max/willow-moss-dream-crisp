import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dots-boxes-BTfZCIcd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("dots-boxes");
var SIZE = 4;
function DotsBoxes() {
	const [lines, setLines] = (0, import_react.useState)(/* @__PURE__ */ new Set());
	const [boxes, setBoxes] = (0, import_react.useState)({});
	const [turn, setTurn] = (0, import_react.useState)(1);
	const [res, setRes] = (0, import_react.useState)({
		1: 0,
		2: 0
	});
	const [msg, setMsg] = (0, import_react.useState)("Draw a line!");
	const [over, setOver] = (0, import_react.useState)(false);
	const drawLine = (0, import_react.useCallback)((key) => {
		if (over || lines.has(key)) return;
		const nl = new Set(lines);
		nl.add(key);
		setLines(nl);
		let claimed = false;
		const nb = { ...boxes };
		for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
			const boxKey = `${r},${c}`;
			if (nb[boxKey]) continue;
			if (nl.has(`h-${r}-${c}`) && nl.has(`h-${r + 1}-${c}`) && nl.has(`v-${r}-${c}`) && nl.has(`v-${r}-${c + 1}`)) {
				nb[boxKey] = turn;
				claimed = true;
			}
		}
		setBoxes(nb);
		const p1 = Object.values(nb).filter((o) => o === 1).length;
		const p2 = Object.values(nb).filter((o) => o === 2).length;
		setRes({
			1: p1,
			2: p2
		});
		if (p1 + p2 >= 16) {
			setOver(true);
			setMsg(p1 > p2 ? "You win! 🎉" : p1 < p2 ? "AI wins!" : "Draw!");
			return;
		}
		if (!claimed) {
			setTurn(turn === 1 ? 2 : 1);
			setMsg(turn === 1 ? "AI's turn..." : "Your turn");
			setTimeout(() => {
				setLines((prev) => {
					const avail = [];
					for (let r = 0; r <= SIZE; r++) for (let c = 0; c < SIZE; c++) {
						if (!prev.has(`h-${r}-${c}`)) avail.push(`h-${r}-${c}`);
						if (r < SIZE && !prev.has(`v-${r}-${c}`)) avail.push(`v-${r}-${c}`);
					}
					if (!avail.length) return prev;
					const key = avail[Math.floor(Math.random() * avail.length)];
					const n = new Set(prev);
					n.add(key);
					const ab = { ...nb };
					let aiClaimed = false;
					for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
						if (ab[`${r},${c}`]) continue;
						if (n.has(`h-${r}-${c}`) && n.has(`h-${r + 1}-${c}`) && n.has(`v-${r}-${c}`) && n.has(`v-${r}-${c + 1}`)) {
							ab[`${r},${c}`] = 2;
							aiClaimed = true;
						}
					}
					setBoxes(ab);
					const np1 = Object.values(ab).filter((o) => o === 1).length;
					const np2 = Object.values(ab).filter((o) => o === 2).length;
					setRes({
						1: np1,
						2: np2
					});
					if (np1 + np2 >= 16) {
						setOver(true);
						setMsg(np1 > np2 ? "You win!" : np1 < np2 ? "AI wins!" : "Draw!");
					} else if (!aiClaimed) {
						setTurn(1);
						setMsg("Your turn");
					}
					return n;
				});
			}, 500);
		} else setMsg(turn === 1 ? "Box claimed! Bonus turn!" : "AI claimed a box!");
	}, [
		lines,
		boxes,
		turn,
		over
	]);
	const reset = () => {
		setLines(/* @__PURE__ */ new Set());
		setBoxes({});
		setTurn(1);
		setRes({
			1: 0,
			2: 0
		});
		setMsg("Draw a line!");
		setOver(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${res[1]} : ${res[2]}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: msg
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
					viewBox: `0 0 200 200`,
					className: "touch-none",
					style: { width: Math.min(window.innerWidth - 48, 320) },
					children: [
						Object.entries(boxes).map(([key, owner]) => {
							const [r, c] = key.split(",").map(Number);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
								x: c * 50 + 4,
								y: r * 50 + 4,
								width: 42,
								height: 42,
								rx: 4,
								fill: owner === 1 ? G.accent + "33" : "#ff6a3d33"
							}, key);
						}),
						[...lines].map((key) => {
							const [type, r, c] = key.split("-");
							const ri = +r, ci = +c;
							if (type === "h") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: ci * 50,
								y1: ri * 50,
								x2: (ci + 1) * 50,
								y2: ri * 50,
								stroke: G.accent,
								strokeWidth: 3
							}, key);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
								x1: ci * 50,
								y1: ri * 50,
								x2: ci * 50,
								y2: (ri + 1) * 50,
								stroke: G.accent,
								strokeWidth: 3
							}, key);
						}),
						Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
							cx: c * 50,
							cy: r * 50,
							r: 3,
							fill: "var(--color-fg)"
						}, `${r}-${c}`))),
						Array.from({ length: 5 }, (_, r) => Array.from({ length: SIZE }, (_, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: c * 50,
							y1: r * 50,
							x2: (c + 1) * 50,
							y2: r * 50,
							stroke: "transparent",
							strokeWidth: 16,
							onClick: () => drawLine(`h-${r}-${c}`),
							style: { cursor: "pointer" }
						}, `ch-${r}-${c}`))),
						Array.from({ length: SIZE }, (_, r) => Array.from({ length: 5 }, (_, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
							x1: c * 50,
							y1: r * 50,
							x2: c * 50,
							y2: (r + 1) * 50,
							stroke: "transparent",
							strokeWidth: 16,
							onClick: () => drawLine(`v-${r}-${c}`),
							style: { cursor: "pointer" }
						}, `cv-${r}-${c}`)))
					]
				})
			})]
		})
	});
}
//#endregion
export { DotsBoxes as default };
