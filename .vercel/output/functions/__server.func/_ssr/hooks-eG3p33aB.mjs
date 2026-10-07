import { i as __toESM } from "../_runtime.mjs";
import { R as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-eG3p33aB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/** requestAnimationFrame loop hook for canvas/arcade games. */
function useGameLoop(callback, active = true) {
	const ref = (0, import_react.useRef)(callback);
	ref.current = callback;
	(0, import_react.useEffect)(() => {
		if (!active) return;
		let raf = 0;
		let last = performance.now();
		function loop(now) {
			const dt = Math.min(50, now - last);
			last = now;
			ref.current(dt);
			raf = requestAnimationFrame(loop);
		}
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [active]);
}
/** localStorage persistence hook. */
function usePersist(key, initial) {
	const [val, setVal] = (0, import_react.useState)(() => {
		try {
			const raw = localStorage.getItem(key);
			return raw ? JSON.parse(raw) : initial;
		} catch {
			return initial;
		}
	});
	return [val, (0, import_react.useCallback)((v) => {
		setVal((prev) => {
			const next = typeof v === "function" ? v(prev) : v;
			try {
				localStorage.setItem(key, JSON.stringify(next));
			} catch {}
			return next;
		});
	}, [key])];
}
/** Keyboard input hook — returns a ref to currently-pressed keys. */
function useKeys() {
	const keys = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	(0, import_react.useEffect)(() => {
		const down = (e) => {
			keys.current.add(e.key.toLowerCase());
			if ([
				"arrowup",
				"arrowdown",
				"arrowleft",
				"arrowright",
				" "
			].includes(e.key.toLowerCase())) e.preventDefault();
		};
		const up = (e) => keys.current.delete(e.key.toLowerCase());
		window.addEventListener("keydown", down);
		window.addEventListener("keyup", up);
		return () => {
			window.removeEventListener("keydown", down);
			window.removeEventListener("keyup", up);
		};
	}, []);
	return keys;
}
//#endregion
export { useKeys as n, usePersist as r, useGameLoop as t };
