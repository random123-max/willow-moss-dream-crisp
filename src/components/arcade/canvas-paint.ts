/** Paint a vibrant, depthful arena background onto a 2D canvas context.
 *  Replaces the old flat dark-retro fills with a colourful gradient + soft vignette. */
export function paintArena(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  accent = "#a78bfa",
  opts?: { top?: string; bottom?: string; vignette?: boolean },
): void {
  const top = opts?.top ?? "#1e1b4b";
  const bottom = opts?.bottom ?? "#4c1d95";
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // accent glow in a corner
  const rg = ctx.createRadialGradient(w * 0.8, h * 0.15, 4, w * 0.8, h * 0.15, w * 0.7);
  rg.addColorStop(0, hexA(accent, 0.22));
  rg.addColorStop(1, "transparent");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, w, h);
  if (opts?.vignette !== false) {
    const v = ctx.createRadialGradient(w / 2, h / 2, h * 0.4, w / 2, h / 2, h * 0.8);
    v.addColorStop(0, "transparent");
    v.addColorStop(1, "rgba(0,0,0,0.35)");
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, w, h);
  }
}

function hexA(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}
