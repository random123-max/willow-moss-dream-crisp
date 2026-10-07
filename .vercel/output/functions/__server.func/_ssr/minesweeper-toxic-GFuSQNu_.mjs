import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/minesweeper-toxic-GFuSQNu_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("minesweeper-toxic");
var SIZE = 8;
var MINES = 10;
function init() {
	const b = Array(64).fill(0).map(() => ({
		mine: false,
		revealed: false,
		flagged: false,
		adj: 0,
		miasma: 0
	}));
	for (let i = 0; i < MINES; i++) {
		let pos;
		do
			pos = Math.floor(Math.random() * SIZE * SIZE);
		while (b[pos].mine);
		b[pos].mine = true;
	}
	for (let i = 0; i < 64; i++) {
		if (b[i].mine) continue;
		const r = Math.floor(i / SIZE), c = i % SIZE;
		let count = 0;
		for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
			const nr = r + dr, nc = c + dc;
			if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE && b[nr * SIZE + nc].mine) count++;
		}
		b[i].adj = count;
	}
	return b;
}
function MinesweeperToxic() {
	const [board, setBoard] = (0, import_react.useState)(init);
	const [over, setOver] = (0, import_react.useState)(false);
	const [won, setWon] = (0, import_react.useState)(false);
	const [radars, setRadars] = (0, import_react.useState)(0);
	const [tick, setTick] = (0, import_react.useState)(0);
	const [msg, setMsg] = (0, import_react.useState)("Clear the field!");
	const timer = (0, import_react.useRef)(void 0);
	if (!over && !won) {
		if (!timer.current) timer.current = setInterval(() => {
			setTick((t) => t + 1);
			setBoard((prev) => {
				if (over) return prev;
				const nb = prev.map((c) => ({ ...c }));
				for (let i = 0; i < nb.length; i++) if (nb[i].revealed && !nb[i].mine && nb[i].adj > 0) nb[i].miasma = Math.min(3, nb[i].miasma + 1);
				return nb;
			});
		}, 5e3);
	}
	const reveal = (0, import_react.useCallback)((i) => {
		if (over || board[i].revealed || board[i].flagged) return;
		const nb = [...board];
		if (nb[i].mine) {
			nb.forEach((c) => c.revealed = true);
			setBoard(nb);
			setOver(true);
			setMsg("💥 Boom! Game over!");
			return;
		}
		const queue = [i];
		while (queue.length) {
			const idx = queue.shift();
			if (nb[idx].revealed) continue;
			nb[idx] = {
				...nb[idx],
				revealed: true,
				miasma: 0
			};
			if (nb[idx].adj === 0 && !nb[idx].mine) {
				const r = Math.floor(idx / SIZE), c = idx % SIZE;
				for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
					const nr = r + dr, nc = c + dc;
					if (nr >= 0 && nr < SIZE && nc >= 0 && nc < SIZE) {
						const ni = nr * SIZE + nc;
						if (!nb[ni].revealed && !nb[ni].mine) queue.push(ni);
					}
				}
			}
		}
		setBoard(nb);
		setRadars((r) => r + 1);
		if (nb.filter((c) => !c.mine && c.revealed).length >= 54) {
			setWon(true);
			setMsg("All clear! You win! 🎉");
		} else setMsg("Safe! +1 radar scan");
	}, [board, over]);
	const flag = (0, import_react.useCallback)((i) => {
		if (over || board[i].revealed) return;
		const nb = [...board];
		nb[i] = {
			...nb[i],
			flagged: !nb[i].flagged
		};
		setBoard(nb);
	}, [board, over]);
	const radar = (0, import_react.useCallback)(() => {
		if (radars < 3 || over) return;
		setRadars((r) => r - 3);
		setBoard((prev) => {
			return prev.map((c) => ({
				...c,
				miasma: 0
			}));
		});
		setMsg("📡 Radar scan — miasma cleared!");
	}, [radars, over]);
	const reset = () => {
		if (timer.current) {
			clearInterval(timer.current);
			timer.current = void 0;
		}
		setBoard(init());
		setOver(false);
		setWon(false);
		setRadars(0);
		setTick(0);
		setMsg("Clear the field!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `📡${radars}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-0.5 rounded-lg border-2 p-1",
					style: {
						gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
						borderColor: G.accent + "44"
					},
					children: board.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: over || won,
						onClick: () => reveal(i),
						onContextMenu: (e) => {
							e.preventDefault();
							flag(i);
						},
						className: "flex size-8 items-center justify-center rounded text-xs font-bold transition-all md:size-10",
						style: {
							background: c.revealed ? c.mine ? "#ff6a3d22" : "var(--color-bg)" : "var(--color-surface)",
							border: `1px solid ${c.revealed ? "var(--color-line)" : G.accent + "22"}`,
							color: c.adj > 0 ? [
								"",
								"#3ee0d0",
								"#84cc16",
								"#f59e0b",
								"#ff6a3d",
								"#a855f7",
								"#ec4899",
								"#ef4444",
								"#dc2626"
							][c.adj] : "var(--color-muted)",
							opacity: c.revealed && c.miasma > 0 ? Math.max(.3, 1 - c.miasma * .25) : 1,
							filter: c.revealed && c.miasma >= 2 ? "blur(1px)" : "none"
						},
						children: c.revealed ? c.mine ? "💥" : c.miasma >= 3 ? "🌫️" : c.adj || "" : c.flagged ? "🚩" : ""
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: radars < 3 || over,
					onClick: radar,
					className: "rounded-lg border px-4 py-2 text-sm transition-all disabled:opacity-40",
					style: {
						borderColor: G.accent,
						color: G.accent
					},
					children: "📡 Radar Scan (3 scans)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Right-click to flag · Miasma spreads every 5s"
				})
			]
		})
	});
}
//#endregion
export { MinesweeperToxic as default };
