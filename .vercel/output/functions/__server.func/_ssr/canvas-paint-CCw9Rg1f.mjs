//#region node_modules/.nitro/vite/services/ssr/assets/canvas-paint-CCw9Rg1f.js
/** Paint a vibrant, depthful arena background onto a 2D canvas context.
*  Replaces the old flat dark-retro fills with a colourful gradient + soft vignette. */
function paintArena(ctx, w, h, accent = "#a78bfa", opts) {
	const top = opts?.top ?? "#1e1b4b";
	const bottom = opts?.bottom ?? "#4c1d95";
	const g = ctx.createLinearGradient(0, 0, 0, h);
	g.addColorStop(0, top);
	g.addColorStop(1, bottom);
	ctx.fillStyle = g;
	ctx.fillRect(0, 0, w, h);
	const rg = ctx.createRadialGradient(w * .8, h * .15, 4, w * .8, h * .15, w * .7);
	rg.addColorStop(0, hexA(accent, .22));
	rg.addColorStop(1, "transparent");
	ctx.fillStyle = rg;
	ctx.fillRect(0, 0, w, h);
	if (opts?.vignette !== false) {
		const v = ctx.createRadialGradient(w / 2, h / 2, h * .4, w / 2, h / 2, h * .8);
		v.addColorStop(0, "transparent");
		v.addColorStop(1, "rgba(0,0,0,0.35)");
		ctx.fillStyle = v;
		ctx.fillRect(0, 0, w, h);
	}
}
function hexA(hex, a) {
	const h = hex.replace("#", "");
	const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
	return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}
//#endregion
export { paintArena as t };
