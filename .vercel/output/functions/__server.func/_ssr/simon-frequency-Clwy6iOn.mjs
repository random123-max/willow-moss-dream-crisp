import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
import { r as usePersist } from "./hooks-eG3p33aB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/simon-frequency-Clwy6iOn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("simon-frequency");
var PADS = 4;
var COLORS = [
	"#3ee0d0",
	"#ff6a3d",
	"#a855f7",
	"#fbbf24"
];
var FREQS = [
	261,
	329,
	392,
	523
];
function SimonFrequency() {
	const [seq, setSeq] = (0, import_react.useState)([]);
	const [input, setInput] = (0, import_react.useState)([]);
	const [active, setActive] = (0, import_react.useState)(null);
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [showing, setShowing] = (0, import_react.useState)(false);
	const [round, setRound] = (0, import_react.useState)(0);
	const [best, setBest] = usePersist("arcade-simon-best", 0);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Press start!");
	const audio = (0, import_react.useRef)(null);
	const warped = (0, import_react.useRef)(0);
	const playTone = (0, import_react.useCallback)((pad) => {
		if (!audio.current) audio.current = new AudioContext();
		const osc = audio.current.createOscillator();
		const gain = audio.current.createGain();
		osc.frequency.value = FREQS[pad] * (1 + warped.current * .15);
		osc.type = "sine";
		gain.gain.setValueAtTime(.15, audio.current.currentTime);
		gain.gain.exponentialRampToValueAtTime(.001, audio.current.currentTime + .4);
		osc.connect(gain);
		gain.connect(audio.current.destination);
		osc.start();
		osc.stop(audio.current.currentTime + .4);
		setActive(pad);
		setTimeout(() => setActive(null), 300);
	}, []);
	const showSequence = (0, import_react.useCallback)((s) => {
		setShowing(true);
		setMsg("Watch and listen...");
		s.forEach((pad, i) => {
			setTimeout(() => {
				playTone(pad);
				if (i === s.length - 1) setTimeout(() => {
					setShowing(false);
					setMsg("Your turn!");
				}, 500);
			}, (i + 1) * 600);
		});
	}, [playTone]);
	const start = (0, import_react.useCallback)(() => {
		const newSeq = [Math.floor(Math.random() * PADS)];
		setSeq(newSeq);
		setInput([]);
		setRound(1);
		setOver(false);
		warped.current = 0;
		setPlaying(true);
		setTimeout(() => showSequence(newSeq), 500);
	}, [showSequence]);
	const tap = (0, import_react.useCallback)((pad) => {
		if (showing || over || !playing) return;
		playTone(pad);
		const ni = [...input, pad];
		setInput(ni);
		if (seq[ni.length - 1] !== pad) {
			setOver(true);
			setPlaying(false);
			setMsg(`Wrong! Reached round ${round}.`);
			if (round - 1 > best) setBest(round - 1);
			return;
		}
		if (ni.length === seq.length) {
			if (round > best) setBest(round);
			const next = [...seq, Math.floor(Math.random() * PADS)];
			setSeq(next);
			setRound((r) => r + 1);
			setInput([]);
			warped.current = Math.min(1, (round - 1) * .1);
			setMsg("Correct! Next round...");
			setTimeout(() => showSequence(next), 800);
		}
	}, [
		input,
		seq,
		round,
		showing,
		over,
		playing,
		best,
		setBest,
		playTone,
		showSequence
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		score: `Round ${round}`,
		best: `${best}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-4 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				warped.current > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs",
					style: { color: G.accent },
					children: [
						"🌊 Frequencies warped ",
						Math.round(warped.current * 100),
						"%"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3",
					children: Array.from({ length: PADS }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: showing || over,
						onClick: () => tap(i),
						className: "flex size-28 items-center justify-center rounded-xl text-2xl transition-all md:size-32",
						style: {
							background: COLORS[i],
							opacity: active === i ? 1 : .4,
							boxShadow: active === i ? `0 0 24px ${COLORS[i]}` : "none",
							transform: active === i ? "scale(1.05)" : "scale(1)",
							transition: "all 0.1s"
						},
						children: [
							i === 0 && "◆",
							i === 1 && "▲",
							i === 2 && "●",
							i === 3 && "■"
						]
					}, i))
				}),
				(over || !playing) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: start,
					className: "rounded-lg px-6 py-2.5 text-sm font-bold",
					style: {
						background: G.accent,
						color: "#071018"
					},
					children: over ? "Try Again" : "Start"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Higher rounds warp frequencies — listen for tones!"
				})
			]
		})
	});
}
//#endregion
export { SimonFrequency as default };
