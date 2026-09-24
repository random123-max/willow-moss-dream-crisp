import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, _ as Link, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Download, i as Gamepad2, n as Package, o as Copy, r as Lock, s as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DKHzRcsv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GiftBox({ open, onOpen }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onOpen,
		disabled: open,
		"aria-label": open ? "Gift opened" : "Tap the gift to open",
		className: "gift-btn relative mx-auto block h-[240px] w-[220px] border-0 bg-transparent p-0 disabled:cursor-default",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "gift-scene",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: `gift ${open ? "is-open" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gift-lid",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gift-bow" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "gift-body",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gift-face" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gift-ribbon-v" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "gift-ribbon-h" })
				]
			})
		}), !open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-6 block font-display text-sm tracking-[0.18em] text-primary",
			children: "TAP TO OPEN"
		}) : null]
	});
}
var GIFT_CODE = "STAR-ORBIT-7K2M";
var FEATURED = {
	id: "helios-outpost",
	title: "Helios Outpost",
	tag: "Minecraft + space mods",
	blurb: "A block world the way it looks with the Helios pack on — lunar crust, starwood village, visor undead.",
	status: "live",
	href: "/play"
};
var ARCADE = [
	FEATURED,
	{
		id: "tic-tac-toe",
		title: "Tic Tac Toe",
		tag: "Sealed",
		blurb: "Slot reserved — add this later.",
		status: "sealed"
	},
	{
		id: "rps",
		title: "Rock Paper Scissors",
		tag: "Sealed",
		blurb: "Slot reserved — add this later.",
		status: "sealed"
	},
	{
		id: "orbit-memory",
		title: "Orbit Memory",
		tag: "Sealed",
		blurb: "Slot reserved — add this later.",
		status: "sealed"
	}
];
var EDU_MODULES = [
	{
		id: "astro",
		title: "Astro Undead",
		body: "Zombies, husks, drowned, and zombie villagers wear cracked visors and suit plating. They drop moon rocks."
	},
	{
		id: "bones",
		title: "Void Bones",
		body: "Skeletons, strays, and wither bones carry cyan visors and cold-signal armor. They drop star crystals."
	},
	{
		id: "creeper",
		title: "Star Creeper",
		body: "Creepers become dark-hull cosmic charges with a glowing core. They still hiss. They drop signal cores."
	},
	{
		id: "wildlife",
		title: "Cosmic Wildlife",
		body: "Spiders, endermen, slime, and ghasts restyle as orbit crawlers, rift walkers, gel cores, and signal wailers."
	},
	{
		id: "surface",
		title: "Lunar Surface",
		body: "Vanilla grass, dirt, stone, sand, ores, ice, and glowstone shift into crust, regolith, basalt, and beacon crystal."
	},
	{
		id: "starwood",
		title: "Starwood Grove",
		body: "Placeable starwood logs, planks, and crystal leaves — craft planks from logs at a crafting table."
	},
	{
		id: "habitat",
		title: "Habitat Build Kit",
		body: "Habitat plates, void glass, comms tiles, lunar ice, and beacon lamps. Build the outpost in Education."
	},
	{
		id: "ore",
		title: "Star Ore",
		body: "Star ore smelts in a furnace into star crystals. Four crystals make a crystal block."
	},
	{
		id: "gear",
		title: "Crew Gear",
		body: "Wearable visor, edible ration, moon rock, signal core, fuel cell, astro compass — plus a /function kit care package."
	},
	{
		id: "drops",
		title: "Night Loot",
		body: "Space-undead, bones, creepers, spiders, and rift walkers drop Helios items on top of their usual loot."
	}
];
function CopyField({ label, value }) {
	const [copied, setCopied] = (0, import_react.useState)(false);
	async function copy() {
		try {
			await navigator.clipboard.writeText(value);
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setCopied(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 flex-1 flex-col gap-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
				className: "min-w-0 flex-1 truncate rounded-md border border-line bg-bg px-3 py-2 font-mono text-sm text-primary",
				children: value
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => void copy(),
				className: "inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-fg",
				"aria-label": `Copy ${label}`,
				children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-primary" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" })
			})]
		})]
	});
}
function PackPanel({ playHref }) {
	const origin = typeof window !== "undefined" ? window.location.origin : "";
	const gameLink = origin ? `${origin}${playHref}` : playHref;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pack-panel mx-auto w-full max-w-5xl px-4 pb-16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "rounded-xl border border-line bg-elevated p-5 md:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.2em] text-ember",
						children: "Opened"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl text-fg md:text-5xl",
						children: "Helios Gift Pack"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base",
						children: "A space rewrite of their Minecraft nights. Play the outpost here, install the Education add-on on their world, and keep this panel for the rest of the arcade."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-col gap-4 md:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyField, {
							label: "Gift code",
							value: GIFT_CODE
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CopyField, {
							label: "Game link",
							value: gameLink
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-line bg-surface p-5 md:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-primary",
							children: "Featured"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-2xl text-fg",
							children: FEATURED.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: FEATURED.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/play",
								className: "inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-bg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gamepad2, { className: "size-4" }), "Play the outpost"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "/downloads/HeliosCrew.mcaddon",
								download: true,
								className: "inline-flex h-12 items-center gap-2 rounded-md border border-primary/40 px-5 text-sm font-semibold text-primary",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Education pack"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl border border-line bg-surface p-5 md:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium uppercase tracking-[0.16em] text-muted",
							children: "Install"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
							className: "mt-3 space-y-2 text-sm leading-relaxed text-dust",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Download HeliosCrew.mcaddon" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "2. Open it with Minecraft Education" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "3. Activate Visuals + Systems on the world" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "4. Optional cheats: /function kit" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/downloads/HeliosCrew.zip",
							download: true,
							className: "mt-4 inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "size-4" }), "Need a zip instead"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl text-fg",
						children: "Education modules"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Real blocks, recipes, loot, and a wearable visor — not empty texture stubs."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: EDU_MODULES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: "rounded-lg border border-line bg-surface p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-base text-fg",
								children: m.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: m.body
							})]
						}, m.id))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end justify-between gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl text-fg",
							children: "Arcade vault"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-muted",
							children: [
								"Helios is live. ",
								249,
								" more slots sit sealed for the small games you add later."
							]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4",
						children: ARCADE.map((g) => g.status === "live" && g.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/play",
							className: "rounded-lg border border-primary/40 bg-elevated p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs uppercase tracking-[0.14em] text-primary",
									children: "Live"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-display text-base text-fg",
									children: g.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: g.tag
								})
							]
						}, g.id) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-lg border border-line bg-surface p-4 opacity-70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "inline-flex items-center gap-1 text-xs uppercase tracking-[0.14em] text-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3" }), "Sealed"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-2 font-display text-base text-fg",
									children: g.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: g.blurb
								})
							]
						}, g.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-muted",
						children: "Vault capacity 250. Remaining sealed slots are held for tic-tac-toe, rock paper scissors, and the rest of the bundle."
					})
				]
			})
		]
	});
}
function Home() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [showPanel, setShowPanel] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const q = new URLSearchParams(window.location.search);
		const stored = sessionStorage.getItem("helios-gift-open") === "1";
		if (q.get("open") === "1" || stored) {
			setOpen(true);
			setShowPanel(true);
		}
	}, []);
	function openGift() {
		setOpen(true);
		sessionStorage.setItem("helios-gift-open", "1");
		window.setTimeout(() => setShowPanel(true), 700);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "min-h-dvh bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute inset-0 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(62,224,208,0.08),transparent_55%)]" })
		}), !showPanel ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative flex min-h-dvh flex-col items-center justify-center px-5 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-[0.22em] text-ember",
					children: "For a space lover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 max-w-xl font-display text-4xl leading-tight text-fg md:text-6xl",
					children: "A gift packed for Minecraft nights."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 max-w-md text-sm leading-relaxed text-muted md:text-base",
					children: "Tap the box. Inside is the Helios outpost, the Education add-on, and a code you can send with the link."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GiftBox, {
						open,
						onOpen: openGift
					})
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative pt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PackPanel, { playHref: "/play" })
		})]
	});
}
//#endregion
export { Home as component };
