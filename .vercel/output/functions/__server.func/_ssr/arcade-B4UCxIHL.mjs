import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Search, p as ArrowLeft } from "../_libs/lucide-react.mjs";
import { i as CATEGORIES, r as ARCADE_GAMES } from "./router-B7Dqm3Hw.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/arcade-B4UCxIHL.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ArcadeVault() {
	const [cat, setCat] = (0, import_react.useState)("All");
	const [query, setQuery] = (0, import_react.useState)("");
	const filtered = (0, import_react.useMemo)(() => {
		return ARCADE_GAMES.filter((g) => {
			if (cat !== "All" && g.category !== cat) return false;
			if (query && !g.title.toLowerCase().includes(query.toLowerCase()) && !g.blurb.toLowerCase().includes(query.toLowerCase())) return false;
			return true;
		});
	}, [cat, query]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "pointer-events-none fixed inset-0 overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(62,224,208,0.06),transparent_70%)]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,106,61,0.05),transparent_70%)]" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mx-auto max-w-6xl px-4 pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					onClick: () => sessionStorage.setItem("helios-gift-open", "1"),
					className: "mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-fg transition-colors hover:border-primary/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4 text-primary" }), "Gift pack"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mt-6 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.24em] text-ember",
							children: "50 Games"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-2 font-display text-4xl text-fg md:text-6xl",
							children: ["The Arcade ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "Vault"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base",
							children: "Fifty hand-crafted games with unique twists. Board games, arcade action, brain-melting puzzles, and deep sims — each with a guided tour so you never get lost."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "text",
							placeholder: "Search games...",
							value: query,
							onChange: (e) => setQuery(e.target.value),
							className: "h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-fg placeholder:text-muted focus:border-primary/40 focus:outline-none md:w-72"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: ["All", ...CATEGORIES].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setCat(c),
							className: `rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${cat === c ? "border-primary bg-primary/10 text-primary" : "border-line bg-surface text-muted hover:text-fg"}`,
							children: c
						}, c))
					})]
				}),
				cat === "All" ? CATEGORIES.map((category) => {
					const games = filtered.filter((g) => g.category === category);
					if (games.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "font-display text-lg text-fg",
							children: [
								categoryIcons[category],
								" ",
								category
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4",
							children: games.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCard, { game: g }, g.id))
						})]
					}, category);
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4",
					children: filtered.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameCard, { game: g }, g.id))
				}),
				filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-12 text-center text-sm text-muted",
					children: "No games match your search."
				})
			]
		})]
	});
}
var categoryIcons = {
	"Classic & Board": "♟️",
	"Arcade & Action": "🕹️",
	"Puzzles & Logic": "🧩",
	"Idle & Sim": "📊"
};
function GameCard({ game }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/arcade/$gameId",
		params: { gameId: game.id },
		className: "group relative overflow-hidden rounded-xl border border-line bg-surface p-4 transition-all hover:border-primary/40 hover:bg-elevated",
		style: { ["--g"]: game.accent },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -right-8 -top-8 size-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100",
				style: { background: `radial-gradient(circle, ${game.accent}18, transparent 70%)` }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex items-start justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-10 items-center justify-center rounded-lg text-xl transition-transform duration-300 group-hover:scale-110",
					style: {
						background: `${game.accent}1a`,
						border: `1px solid ${game.accent}33`
					},
					children: game.emoji
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-[10px] tabular-nums text-muted",
					children: ["#", game.num]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "relative mt-3 font-display text-sm leading-tight text-fg",
				children: game.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative mt-1 text-xs leading-relaxed text-muted",
				children: game.blurb
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "relative mt-2 text-[10px] font-medium uppercase tracking-[0.12em]",
				style: { color: game.accent },
				children: game.category
			})
		]
	});
}
//#endregion
export { ArcadeVault as component };
