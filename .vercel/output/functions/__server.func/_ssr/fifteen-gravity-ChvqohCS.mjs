import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fifteen-gravity-ChvqohCS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("fifteen-gravity");
var SIZE = 4;
function FifteenGravity() {
	const [tiles, setTiles] = (0, import_react.useState)(() => {
		const t = Array.from({ length: 15 }, (_, i) => i + 1);
		t.push(0);
		for (let i = t.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[t[i], t[j]] = [t[j], t[i]];
		}
		return t;
	});
	const [moves, setMoves] = (0, import_react.useState)(0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [pullCD, setPullCD] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-fifteen-best", 999);
	const timer = (0, import_react.useRef)(void 0);
	const empty = tiles.indexOf(0);
	const slide = (0, import_react.useCallback)((idx) => {
		if (over) return;
		const r = Math.floor(idx / SIZE), c = idx % SIZE;
		const er = Math.floor(empty / SIZE), ec = empty % SIZE;
		if (Math.abs(r - er) + Math.abs(c - ec) !== 1) return;
		setTiles((prev) => {
			const nt = [...prev];
			[nt[idx], nt[empty]] = [nt[empty], nt[idx]];
			setMoves((m) => m + 1);
			if (nt.slice(0, 15).every((v, i) => v === i + 1)) {
				setOver(true);
				if (moves + 1 < best) setBest(moves + 1);
			}
			return nt;
		});
	}, [
		over,
		empty,
		moves,
		best,
		setBest
	]);
	(0, import_react.useEffect)(() => {
		if (over) return;
		timer.current = setInterval(() => {
			setTiles((prev) => {
				const e = prev.indexOf(0);
				const r = Math.floor(e / SIZE), c = e % SIZE;
				const neighbors = [
					{
						idx: r > 0 ? e - SIZE : -1,
						dir: "down"
					},
					{
						idx: r < 3 ? e + SIZE : -1,
						dir: "up"
					},
					{
						idx: c > 0 ? e - 1 : -1,
						dir: "right"
					},
					{
						idx: c < 3 ? e + 1 : -1,
						dir: "left"
					}
				].filter((n) => n.idx >= 0);
				if (neighbors.length === 0) return prev;
				const target = neighbors[Math.floor(Math.random() * neighbors.length)];
				const nt = [...prev];
				[nt[e], nt[target.idx]] = [nt[target.idx], nt[e]];
				return nt;
			});
		}, 5e3);
		return () => clearInterval(timer.current);
	}, [over]);
	const reset = () => {
		const t = Array.from({ length: 15 }, (_, i) => i + 1);
		t.push(0);
		for (let i = t.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[t[i], t[j]] = [t[j], t[i]];
		}
		setTiles(t);
		setMoves(0);
		setOver(false);
	};
	const colors = [
		"#3ee0d0",
		"#22c55e",
		"#f59e0b",
		"#ff6a3d",
		"#a855f7",
		"#ec4899",
		"#60a5fa",
		"#84cc16",
		"#fbbf24",
		"#06b6d4",
		"#8b5cf6",
		"#10b981",
		"#ef4444",
		"#d97706",
		"#0ea5e9"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${moves}`,
		best: best < 999 ? `${best}` : void 0,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: over ? "Solved! 🎉" : "Arrange 1-15 in order"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-ember",
					children: "🕳️ Black hole pulls tiles every 5s!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-1 rounded-xl border-2 p-2",
					style: { borderColor: G.accent + "44" },
					children: tiles.map((val, idx) => {
						if (val === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex size-16 items-center justify-center rounded-lg md:size-20",
							style: {
								background: "var(--color-bg)",
								border: "2px dashed #ff6a3d44"
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-lg",
								children: "🕳️"
							})
						}, idx);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: over,
							onClick: () => slide(idx),
							className: "flex size-16 items-center justify-center rounded-lg font-mono text-2xl font-bold transition-all hover:scale-95 md:size-20",
							style: {
								background: colors[val - 1] + "22",
								border: `2px solid ${colors[val - 1]}`,
								color: colors[val - 1],
								boxShadow: `0 0 8px ${colors[val - 1]}44`
							},
							children: val
						}, idx);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Tap tiles to slide · Race the gravity shifts!"
				})
			]
		})
	});
}
//#endregion
export { FifteenGravity as default };
