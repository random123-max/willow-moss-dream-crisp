import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rogue-checkers-DruQBuaH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("rogue-checkers");
var SIZE = 6;
function initBoard() {
	const b = Array(36).fill(null);
	for (let r = 0; r < 2; r++) for (let c = 0; c < SIZE; c++) if ((r + c) % 2 === 1) b[r * SIZE + c] = {
		owner: 2,
		hp: r === 0 ? 3 : 2,
		crowned: false
	};
	for (let r = 4; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if ((r + c) % 2 === 1) b[r * SIZE + c] = {
		owner: 1,
		hp: r === 5 ? 3 : 2,
		crowned: false
	};
	return b;
}
var DIRS = [
	-7,
	-5,
	5,
	7
];
function RogueCheckers() {
	const [board, setBoard] = (0, import_react.useState)(initBoard);
	const [turn, setTurn] = (0, import_react.useState)(1);
	const [sel, setSel] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)("Your turn — select a piece");
	const [over, setOver] = (0, import_react.useState)(false);
	const canMove = (b, i) => {
		const p = b[i];
		if (!p) return [];
		const r = Math.floor(i / SIZE);
		const c = i % SIZE;
		const moves = [];
		for (const d of DIRS) {
			const ni = i + d;
			if (ni < 0 || ni >= 36) continue;
			const nr = Math.floor(ni / SIZE);
			const nc = ni % SIZE;
			if (Math.abs(nr - r) !== 1 || Math.abs(nc - c) !== 1) continue;
			if (!b[ni]) moves.push(ni);
			const ji = ni + d;
			if (ji >= 0 && ji < 36) {
				const jr = Math.floor(ji / SIZE);
				const jc = ji % SIZE;
				if (Math.abs(jr - nr) === 1 && Math.abs(jc - nc) === 1 && b[ji] === null && b[ni] && b[ni].owner !== p.owner) moves.push(ji);
			}
		}
		return moves;
	};
	const move = (0, import_react.useCallback)((to) => {
		if (sel === null || over) return;
		setBoard((prev) => {
			const p = prev[sel];
			if (!p || p.owner !== turn) return prev;
			if (!canMove(prev, sel).includes(to)) return prev;
			const nb = [...prev];
			if (Math.abs(Math.floor(to / SIZE) - Math.floor(sel / SIZE)) === 2) {
				const mid = (sel + to) / 2;
				const target = nb[mid];
				if (target) {
					target.hp -= 1;
					if (target.hp <= 0) nb[mid] = null;
				}
			}
			nb[to] = p;
			nb[sel] = null;
			if (!p.crowned && (p.owner === 1 && Math.floor(to / SIZE) === 0 || p.owner === 2 && Math.floor(to / SIZE) === 5)) {
				p.crowned = true;
				p.ability = Math.random() < .5 ? "chain" : "teleport";
				setMsg(`Piece crowned! Ability: ${p.ability === "chain" ? "Chain Jump" : "Teleport"}!`);
			}
			const p1Alive = nb.some((x) => x?.owner === 1);
			const p2Alive = nb.some((x) => x?.owner === 2);
			if (!p1Alive || !p2Alive) {
				setOver(true);
				setMsg(!p1Alive ? "All your pieces eliminated!" : "AI eliminated!");
			}
			setTurn(turn === 1 ? 2 : 1);
			return nb;
		});
		setSel(null);
	}, [
		sel,
		turn,
		over
	]);
	if (turn === 2 && !over && sel === null) setTimeout(() => {
		setBoard((prev) => {
			const pieces = prev.map((p, i) => ({
				p,
				i
			})).filter(({ p }) => p?.owner === 2);
			for (const { i } of pieces) {
				const moves = canMove(prev, i);
				for (const m of moves) if (Math.abs(Math.floor(m / SIZE) - Math.floor(i / SIZE)) === 2) {
					const nb = [...prev];
					const mid = (i + m) / 2;
					const target = nb[mid];
					if (target) {
						target.hp -= 1;
						if (target.hp <= 0) nb[mid] = null;
					}
					nb[m] = nb[i];
					nb[i] = null;
					setTurn(1);
					setMsg("AI jumped your piece!");
					return nb;
				}
			}
			for (const { i } of pieces) {
				const moves = canMove(prev, i);
				if (moves.length) {
					const m = moves[0];
					const nb = [...prev];
					nb[m] = nb[i];
					nb[i] = null;
					setTurn(1);
					setMsg("Your turn");
					return nb;
				}
			}
			setOver(true);
			setMsg("AI has no moves — you win!");
			return prev;
		});
	}, 500);
	const reset = () => {
		setBoard(initBoard());
		setTurn(1);
		setSel(null);
		setMsg("Your turn — select a piece");
		setOver(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: msg,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-0.5 rounded-lg border-2 p-1",
				style: {
					gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
					borderColor: G.accent + "44"
				},
				children: board.map((p, i) => {
					const dark = (Math.floor(i / SIZE) + i % SIZE) % 2 === 1;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: !dark || over,
						onClick: () => {
							if (p?.owner === 1) setSel(i);
							else if (sel !== null && canMove(board, sel).includes(i)) move(i);
						},
						className: `flex size-11 items-center justify-center rounded text-lg transition-all md:size-12 ${dark ? "cursor-pointer" : "cursor-default"}`,
						style: {
							background: dark ? sel === i ? G.accent + "33" : "var(--color-surface)" : "var(--color-bg)",
							border: sel === i ? `2px solid ${G.accent}` : "1px solid var(--color-line)"
						},
						children: p && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex size-7 items-center justify-center rounded-full text-xs font-bold md:size-8",
							style: {
								background: p.owner === 1 ? G.accent : "#ff6a3d",
								color: "#071018",
								boxShadow: p.crowned ? `0 0 8px ${p.owner === 1 ? G.accent : "#ff6a3d"}` : "none",
								border: p.crowned ? "2px solid #fbbf24" : "none"
							},
							children: [p.hp, p.crowned && "👑"]
						})
					}, i);
				})
			})
		})
	});
}
//#endregion
export { RogueCheckers as default };
