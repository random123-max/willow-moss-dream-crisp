import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GameShell } from "./game-shell-BUMQ8toB.mjs";
import { a as getGame } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/traffic-grid-Bq0Ufo_g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var G = getGame("traffic-grid");
var GRID_W = 6;
var GRID_H = 6;
function TrafficGrid() {
	const [lights, setLights] = (0, import_react.useState)(() => Array.from({ length: GRID_H }, () => Array(GRID_W).fill("ns")));
	const [cars, setCars] = (0, import_react.useState)([]);
	const [score, setScore] = (0, import_react.useState)(100);
	const [economy, setEconomy] = (0, import_react.useState)(100);
	const [over, setOver] = (0, import_react.useState)(false);
	const [msg, setMsg] = (0, import_react.useState)("Toggle traffic lights to keep cars moving!");
	const [rage, setRage] = (0, import_react.useState)(0);
	const tick = (0, import_react.useRef)(0);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const spawn = setInterval(() => {
			setCars((prev) => {
				if (prev.length > 20) return prev;
				const dir = [
					"e",
					"w",
					"n",
					"s"
				][Math.floor(Math.random() * 4)];
				const car = {
					x: dir === "e" ? 0 : dir === "w" ? 300 : Math.random() * GRID_W * 50,
					y: dir === "s" ? 0 : dir === "n" ? 300 : Math.random() * GRID_H * 50,
					dir,
					speed: .5 + Math.random() * .5
				};
				return [...prev, car];
			});
		}, 800);
		return () => clearInterval(spawn);
	}, [over]);
	(0, import_react.useEffect)(() => {
		if (over) return;
		const t = setInterval(() => {
			tick.current++;
			setCars((prev) => {
				const ns = [];
				for (const c of prev) {
					const gx = Math.floor(c.x / 50), gy = Math.floor(c.y / 50);
					const atIntersection = gx >= 0 && gx < GRID_W && gy >= 0 && gy < GRID_H && Math.abs(c.x % 50 - 25) < 5 && Math.abs(c.y % 50 - 25) < 5;
					let canMove = true;
					if (atIntersection) {
						const light = lights[gy]?.[gx] ?? "ns";
						if (c.dir === "e" || c.dir === "w") canMove = light === "ew";
						else canMove = light === "ns";
					}
					const nc = { ...c };
					if (canMove) {
						if (c.dir === "e") nc.x += c.speed * 2;
						if (c.dir === "w") nc.x -= c.speed * 2;
						if (c.dir === "s") nc.y += c.speed * 2;
						if (c.dir === "n") nc.y -= c.speed * 2;
					}
					if (nc.x < -10 || nc.x > 310 || nc.y < -10 || nc.y > 310) {
						setScore((s) => Math.min(200, s + 5));
						return ns;
					}
					ns.push(nc);
					if (!canMove) setRage((r) => Math.min(100, r + .5));
				}
				return ns;
			});
			setRage((r) => Math.max(0, r - 1));
			if (rage > 80) {
				setEconomy((e) => Math.max(0, e - 2));
				setScore((s) => Math.max(0, s - 1));
			}
			if (economy <= 0) {
				setOver(true);
				setMsg("Economy crashed! 💥");
			}
		}, 200);
		return () => clearInterval(t);
	}, [
		over,
		lights,
		rage,
		economy
	]);
	const toggle = (0, import_react.useCallback)((r, c) => {
		if (over) return;
		setLights((prev) => {
			const nl = prev.map((row) => [...row]);
			nl[r][c] = nl[r][c] === "ns" ? "ew" : "ns";
			return nl;
		});
	}, [over]);
	const reset = () => {
		setLights(Array.from({ length: GRID_H }, () => Array(GRID_W).fill("ns")));
		setCars([]);
		setScore(100);
		setEconomy(100);
		setOver(false);
		setRage(0);
		setMsg("Toggle traffic lights to keep cars moving!");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameShell, {
		title: G.title,
		emoji: G.emoji,
		accent: G.accent,
		howTo: G.howTo,
		twist: G.twist,
		onReset: reset,
		score: `Score ${score}`,
		extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs",
			style: { color: rage > 60 ? "#ff6a3d" : "#fbbf24" },
			children: [
				"Rage ",
				rage,
				"%"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "rounded-full border border-line bg-bg px-3 py-1 text-xs text-primary",
			children: [
				"Econ ",
				economy,
				"%"
			]
		})] }),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center gap-3 p-4 pt-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-dust",
					children: msg
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid gap-1 rounded-lg border-2 p-1",
					style: {
						gridTemplateColumns: `repeat(${GRID_W}, 1fr)`,
						borderColor: G.accent + "44"
					},
					children: [lights.map((row, r) => row.map((light, c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						disabled: over,
						onClick: () => toggle(r, c),
						className: "flex size-10 items-center justify-center rounded transition-all md:size-12",
						style: {
							background: light === "ns" ? "#3ee0d022" : "#ff6a3d22",
							border: `2px solid ${light === "ns" ? "#3ee0d0" : "#ff6a3d"}`
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs",
							style: { color: light === "ns" ? "#3ee0d0" : "#ff6a3d" },
							children: light === "ns" ? "↕" : "↔"
						})
					}, `${r}-${c}`))), cars.map((car, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pointer-events-none absolute text-xs",
						style: {
							left: car.x / 300 * 269,
							top: car.y / 300 * 269
						},
						children: [
							car.dir === "e" && "🚗",
							car.dir === "w" && "🚙",
							car.dir === "n" && "🚕",
							car.dir === "s" && "🚐"
						]
					}, i))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#3ee0d0" },
						children: "↕ NS Green"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						style: { color: "#ff6a3d" },
						children: "↔ EW Green"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: ["Click intersections to toggle · Cars: ", cars.length]
				})
			]
		})
	});
}
//#endregion
export { TrafficGrid as default };
