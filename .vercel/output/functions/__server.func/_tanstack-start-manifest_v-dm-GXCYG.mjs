//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-dm-GXCYG.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/app/src/routes/__root.tsx",
		children: [
			"/",
			"/arcade",
			"/play"
		],
		preloads: ["/assets/index-wI0KjC-4.js", "/assets/useStore-CP8wJgJA.js"],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-wI0KjC-4.js"
		} }]
	},
	"/": {
		filePath: "/app/src/routes/index.tsx",
		children: void 0,
		preloads: ["/assets/routes-BuC0r5fT.js"]
	},
	"/arcade": {
		filePath: "/app/src/routes/arcade.tsx",
		children: ["/arcade/$gameId", "/arcade/"],
		preloads: ["/assets/arcade-CTZ3FUBV.js"]
	},
	"/play": {
		filePath: "/app/src/routes/play.tsx",
		children: void 0,
		preloads: ["/assets/play-DZqpr9x6.js", "/assets/arrow-left-dB3NkjKy.js"]
	},
	"/arcade/$gameId": {
		filePath: "/app/src/routes/arcade.$gameId.tsx",
		children: void 0,
		preloads: ["/assets/arcade._gameId-UsBeOBWc.js"]
	},
	"/arcade/": {
		filePath: "/app/src/routes/arcade.index.tsx",
		children: void 0,
		preloads: ["/assets/arcade.index-Bvf3cwnf.js", "/assets/arrow-left-dB3NkjKy.js"]
	}
} });
//#endregion
export { tsrStartManifest };
