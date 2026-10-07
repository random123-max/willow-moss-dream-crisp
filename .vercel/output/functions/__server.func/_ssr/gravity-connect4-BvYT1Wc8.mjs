import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gravity-connect4-BvYT1Wc8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("gravity-connect4");
var ROWS = 6;
var COLS = 7;
function dropInto(grid, col, player) {
	const ng = grid.map((r) => [...r]);
	for (let r = 5; r >= 0; r--) if (ng[r][col] === 0) {
		ng[r][col] = player;
		return ng;
	}
	return grid;
}
function checkWin(grid) {
	for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
		const p = grid[r][c];
		if (!p) continue;
		if (c + 3 < COLS && p === grid[r][c + 1] && p === grid[r][c + 2] && p === grid[r][c + 3]) return p;
		if (r + 3 < ROWS && p === grid[r + 1][c] && p === grid[r + 2][c] && p === grid[r + 3][c]) return p;
		if (r + 3 < ROWS && c + 3 < COLS && p === grid[r + 1][c + 1] && p === grid[r + 2][c + 2] && p === grid[r + 3][c + 3]) return p;
		if (r + 3 < ROWS && c >= 3 && p === grid[r + 1][c - 1] && p === grid[r + 2][c - 2] && p === grid[r + 3][c - 3]) return p;
	}
	return 0;
}
function rotateBoard(grid) {
	const rotated = Array.from({ length: COLS }, () => Array(ROWS).fill(0));
	for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) rotated[c][5 - r] = grid[r][c];
	const result = Array.from({ length: COLS }, () => Array(ROWS).fill(0));
	for (let c = 0; c < COLS; c++) {
		let writeRow = 5;
		for (let r = 5; r >= 0; r--) if (rotated[r][c]) {
			result[writeRow][c] = rotated[r][c];
			writeRow--;
		}
	}
	const final = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
	for (let r = 0; r < Math.min(ROWS, COLS); r++) for (let c = 0; c < Math.min(ROWS, COLS); c++) final[r][c] = result[r]?.[c] ?? 0;
	return final;
}
function aiMove(grid) {
	for (let c = 0; c < COLS; c++) if (checkWin(dropInto(grid, c, 2)) === 2) return c;
	for (let c = 0; c < COLS; c++) if (checkWin(dropInto(grid, c, 1)) === 1) return c;
	return Math.floor(Math.random() * COLS);
}
function GravityConnect4() {
	const [grid, setGrid] = (0, import_react.useState)(() => Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
	const [turn, setTurn] = (0, import_react.useState)(1);
	const [msg, setMsg] = (0, import_react.useState)("Drop a disc!");
	const [over, setOver] = (0, import_react.useState)(false);
	const [rotations, setRotations] = (0, import_react.useState)({
		1: 1,
		2: 1
	});
	const play = (0, import_react.useCallback)((col) => {
		if (over || turn !== 1) return;
		const ng = dropInto(grid, col, 1);
		setGrid(ng);
		const w = checkWin(ng);
		if (w) {
			setOver(true);
			setMsg(w === 1 ? "You win! 🎉" : "AI wins!");
			return;
		}
		setTurn(2);
		setTimeout(() => {
			const aiCol = aiMove(ng);
			const ng2 = dropInto(ng, aiCol, 2);
			setGrid(ng2);
			const w2 = checkWin(ng2);
			if (w2) {
				setOver(true);
				setMsg(w2 === 1 ? "You win! 🎉" : "AI wins!");
				return;
			}
			setTurn(1);
		}, 400);
	}, [
		grid,
		turn,
		over
	]);
	const rotate = (0, import_react.useCallback)(() => {
		if (over || rotations[turn] <= 0) return;
		const ng = rotateBoard(grid);
		setGrid(ng);
		setRotations((r) => ({
			...r,
			[turn]: r[turn] - 1
		}));
		const w = checkWin(ng);
		if (w) {
			setOver(true);
			setMsg(w === 1 ? "Rotation win! 🎉" : "AI rotation win!");
		}
	}, [
		grid,
		turn,
		over,
		rotations
	]);
	const reset = () => {
		setGrid(Array.from({ length: ROWS }, () => Array(COLS).fill(0)));
		setTurn(1);
		setMsg("Drop a disc!");
		setOver(false);
		setRotations({
			1: 1,
			2: 1
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: msg,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-xl border-2 p-2",
					style: { borderColor: G.accent + "44" },
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-1",
						style: { gridTemplateColumns: `repeat(${COLS}, 1fr)` },
						children: grid.map((row, r) => row.map((cell, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							disabled: over || turn !== 1,
							onClick: () => play(c),
							className: "size-10 rounded-full border border-line transition-all hover:opacity-80 md:size-12",
							style: {
								background: cell === 1 ? G.accent : cell === 2 ? "#ff6a3d" : "var(--color-bg)",
								boxShadow: cell ? `inset 0 0 8px rgba(0,0,0,.3), 0 0 12px ${cell === 1 ? G.accent : "#ff6a3d"}55` : "none"
							}
						}, `${r}-${c}`)))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					disabled: over || rotations[turn] <= 0,
					onClick: rotate,
					className: "rounded-lg border px-4 py-2 text-sm font-medium transition-all disabled:opacity-40",
					style: {
						borderColor: G.accent,
						color: rotations[turn] > 0 ? G.accent : "var(--color-muted)"
					},
					children: [
						"🔄 Rotate Board (",
						rotations[turn],
						" left)"
					]
				})
			]
		})
	});
}
//#endregion
export { GravityConnect4 as default };
