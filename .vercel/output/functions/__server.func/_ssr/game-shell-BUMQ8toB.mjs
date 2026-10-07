import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as RotateCcw, d as CircleHelp, p as ArrowLeft, r as Sparkles, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/game-shell-BUMQ8toB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GameShell({ title, emoji, accent, howTo, twist, onReset, children, best, score, extra }) {
	const [tour, setTour] = (0, import_react.useState)(true);
	const [step, setStep] = (0, import_react.useState)(0);
	const isLast = step >= howTo.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex min-h-dvh flex-col bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-surface/95 px-3 py-2.5 backdrop-blur md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/arcade",
						className: "inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-bg px-3 text-xs font-medium text-fg transition-colors hover:border-primary/40",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {
							className: "size-3.5",
							style: { color: accent }
						}), "Vault"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-1 items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-lg leading-none",
							children: emoji
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-display text-sm text-fg md:text-base",
							style: { color: accent },
							children: title
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [
							score && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden rounded-full border border-line bg-bg px-3 py-1 font-mono text-xs tabular-nums text-fg sm:inline-block",
								children: score
							}),
							best && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "hidden rounded-full border border-line bg-bg px-3 py-1 font-mono text-xs tabular-nums text-muted md:inline-block",
								children: ["Best ", best]
							}),
							extra,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => {
									setStep(0);
									setTour(true);
								},
								className: "inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-bg px-3 text-xs font-medium text-fg transition-colors hover:border-primary/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, {
									className: "size-3.5",
									style: { color: accent }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "How to Play"
								})]
							}),
							onReset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: onReset,
								className: "inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-bg px-3 text-xs font-medium text-fg transition-colors hover:border-primary/40",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, {
									className: "size-3.5",
									style: { color: accent }
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Reset"
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative flex-1",
				children
			}),
			tour && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-elevated shadow-2xl",
					style: { boxShadow: `0 0 60px ${accent}22, 0 20px 60px rgba(0,0,0,.5)` },
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-1.5 w-full",
							style: { background: `linear-gradient(90deg, ${accent}, ${accent}55)` }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTour(false),
							className: "absolute right-3 top-4 z-10 inline-flex size-8 items-center justify-center rounded-full bg-surface/80 text-muted hover:text-fg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-12 items-center justify-center rounded-xl text-2xl",
									style: {
										background: `${accent}1a`,
										border: `1px solid ${accent}33`
									},
									children: emoji
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-medium uppercase tracking-[0.16em]",
									style: { color: accent },
									children: isLast ? "Ready?" : `Step ${step + 1} / ${howTo.length}`
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-lg text-fg",
									children: title
								})] })]
							}), !isLast ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-sm leading-relaxed text-dust",
									children: howTo[step]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex gap-1",
									children: howTo.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-1 flex-1 rounded-full",
										style: { background: i <= step ? accent : "var(--color-line)" }
									}, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setStep(0),
										className: "text-xs text-muted hover:text-fg",
										children: "Restart tour"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [step > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setStep((s) => s - 1),
											className: "rounded-lg border border-line bg-surface px-4 py-2 text-sm text-fg hover:border-primary/40",
											children: "Back"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => setStep((s) => s + 1),
											className: "rounded-lg px-4 py-2 text-sm font-semibold text-bg",
											style: { background: accent },
											children: step === howTo.length - 1 ? "Got it!" : "Next"
										})]
									})]
								})
							] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 rounded-xl border p-4",
								style: {
									borderColor: `${accent}44`,
									background: `${accent}0d`
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, {
										className: "size-4 shrink-0",
										style: { color: accent }
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-medium uppercase tracking-[0.14em]",
										style: { color: accent },
										children: "The Twist"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm leading-relaxed text-dust",
										children: twist
									})] })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setTour(false),
								className: "mt-5 w-full rounded-lg py-3 text-sm font-bold text-bg",
								style: { background: accent },
								children: "Start Playing"
							})] })]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { GameShell as t };
