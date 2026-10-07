//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-RtLJMFUN.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "/workspace/src/routes/__root.tsx",
		children: [
			"/",
			"/arcade",
			"/play"
		],
		preloads: ["/assets/index-Cqoe3In-.js"],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-Cqoe3In-.js"
		} }]
	},
	"/": {
		filePath: "/workspace/src/routes/index.tsx",
		children: void 0,
		preloads: ["/assets/routes-B9qfidnP.js"]
	},
	"/arcade": {
		filePath: "/workspace/src/routes/arcade.tsx",
		children: ["/arcade/$gameId"],
		preloads: ["/assets/arcade-preHNRNA.js", "/assets/arrow-left-DLbdygey.js"]
	},
	"/play": {
		filePath: "/workspace/src/routes/play.tsx",
		children: void 0,
		preloads: ["/assets/play-BJgaJP1o.js", "/assets/arrow-left-DLbdygey.js"]
	},
	"/arcade/$gameId": {
		filePath: "/workspace/src/routes/arcade.$gameId.tsx",
		children: void 0,
		preloads: ["/assets/arcade._gameId-km8V8Vq6.js"]
	}
} });
//#endregion
export { tsrStartManifest };
