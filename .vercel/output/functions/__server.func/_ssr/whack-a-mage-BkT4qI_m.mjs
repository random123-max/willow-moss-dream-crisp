import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { t as useGameLoop } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/whack-a-mage-BkT4qI_m.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("whack-a-mage");
var COLS = 3;
function WhackAMage() {
	const [score, setScore] = (0, import_react.useState)(0);
	const [time, setTime] = (0, import_react.useState)(30);
	const [over, setOver] = (0, import_react.useState)(false);
	const [mages, setMages] = (0, import_react.useState)(Array(9).fill(null));
	const types = (0, import_react.useRef)([
		"fire",
		"ice",
		"illusion",
		"normal"
	]);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => setTime((s) => s > 0 ? s - 1 : 0), 1e3);
		return () => clearInterval(t);
	}, [over]);
	(0, import_react.useEffect)(() => {
		if (over || time <= 0) {
			setOver(true);
			return;
		}
	}, [time]);
	useGameLoop(() => {
		if (over) return;
		if (Math.random() < .04) setMages((prev) => {
			const np = [...prev];
			const empty = np.map((m, i) => ({
				m,
				i
			})).filter(({ m }) => !m);
			if (empty.length === 0) return prev;
			const { i } = empty[Math.floor(Math.random() * empty.length)];
			np[i] = {
				type: types.current[Math.floor(Math.random() * types.current.length)],
				born: Date.now(),
				ttl: 1500 + Math.random() * 1e3
			};
			return np;
		});
		setMages((prev) => {
			const now = Date.now();
			let changed = false;
			const np = prev.map((m) => {
				if (m && now - m.born > m.ttl) {
					changed = true;
					return null;
				}
				return m;
			});
			return changed ? np : prev;
		});
	});
	const whack = (0, import_react.useCallback)((i) => {
		if (over || !mages[i]) return;
		const mage = mages[i];
		setMages((prev) => {
			const np = [...prev];
			np[i] = null;
			return np;
		});
		setScore((sc) => sc + 10);
		if (mage.type === "fire") setMages((prev) => {
			const np = [...prev];
			const r = Math.floor(i / COLS), c = i % COLS;
			for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
				const ni = (r + dr) * COLS + (c + dc);
				if (ni >= 0 && ni < np.length && ni !== i) np[ni] = null;
			}
			return np;
		});
		if (mage.type === "illusion") setMages((prev) => {
			const np = [...prev];
			for (let j = 0; j < np.length; j++) if (!np[j] && Math.random() < .4) np[j] = {
				type: "normal",
				born: Date.now(),
				ttl: 800
			};
			return np;
		});
	}, [mages, over]);
	const reset = () => {
		setScore(0);
		setTime(30);
		setOver(false);
		setMages(Array(9).fill(null));
	};
	const emoji = {
		fire: "🔥",
		ice: "🧊",
		illusion: "🌀",
		normal: "🧙"
	};
	const color = {
		fire: "#ff6a3d",
		ice: "#60a5fa",
		illusion: "#a855f7",
		normal: G.accent
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `${score}`,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs text-ember",
			children: ["⏱️", time]
		}),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-3 gap-3",
				children: mages.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: over,
					onClick: () => whack(i),
					className: "flex size-20 items-center justify-center rounded-xl border text-4xl transition-all md:size-24",
					style: {
						background: m ? color[m.type] + "22" : "var(--color-surface)",
						borderColor: m ? color[m.type] : "var(--color-line)",
						boxShadow: m ? `0 0 12px ${color[m.type]}44` : "none"
					},
					children: m ? emoji[m.type] : ""
				}, i))
			}), over && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-display text-xl text-fg",
				children: ["Final Score: ", score]
			})]
		})
	});
}
//#endregion
export { WhackAMage as default };
