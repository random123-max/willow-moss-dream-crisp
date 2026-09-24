import { useEffect, useRef, useState } from "react";
import { HeliosEngine, type HudSnap } from "@/game/engine";
import { ATLAS_H, ATLAS_W, HOTBAR } from "@/game/blocks";

const emptyHud: HudSnap = {
  hp: 10,
  crystals: 0,
  slot: 4,
  counts: [0, 0, 0, 24, 48, 16, 16, 8, 16],
  grounded: true,
  msg: "Click the world to look around",
  locked: false,
};

export function GameCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  const engine = useRef<HeliosEngine | null>(null);
  const [hud, setHud] = useState<HudSnap>(emptyHud);
  const stick = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const e = new HeliosEngine(canvas, setHud);
    engine.current = e;
    void e.start();
    return () => e.destroy();
  }, []);

  function onStick(ev: React.PointerEvent) {
    const el = stick.current;
    const eng = engine.current;
    if (!el || !eng) return;
    el.setPointerCapture(ev.pointerId);
    const r = el.getBoundingClientRect();
    const lx = ((ev.clientX - r.left) / r.width) * 2 - 1;
    const ly = ((ev.clientY - r.top) / r.height) * 2 - 1;
    eng.setTouch(Math.max(-1, Math.min(1, lx)), Math.max(-1, Math.min(1, ly)), true);
  }

  const hearts = Array.from({ length: 10 }, (_, i) => i < Math.ceil(hud.hp));

  return (
    <div className="relative h-[100dvh] w-full overflow-hidden bg-bg">
      <canvas ref={ref} className="block h-full w-full touch-none" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute left-1/2 top-0 h-5 w-px -translate-x-1/2 bg-fg/90" />
          <span className="absolute left-0 top-1/2 h-px w-5 -translate-y-1/2 bg-fg/90" />
        </div>

        <div className="absolute left-4 top-20 max-w-xs rounded-lg border border-line bg-surface/85 px-3 py-2">
          <p className="font-display text-xs tracking-[0.16em] text-primary">HELIOS OUTPOST</p>
          <p className="mt-1 text-xs text-dust">{hud.msg}</p>
          <p className="mt-1 font-mono text-xs tabular-nums text-muted">Crystals {hud.crystals}</p>
        </div>

        <div className="absolute bottom-[5.5rem] left-1/2 flex -translate-x-1/2 gap-1 md:bottom-24">
          {hearts.map((on, i) => (
            <span
              key={i}
              className={`block h-3 w-3 rotate-45 border ${on ? "border-ember bg-ember" : "border-line bg-transparent"}`}
            />
          ))}
        </div>

        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-1 rounded-md border border-line bg-bg/80 p-1">
          {HOTBAR.map((slot, i) => {
            const col = slot.tile % ATLAS_W;
            const row = Math.floor(slot.tile / ATLAS_W);
            const selected = hud.slot === i;
            return (
              <button
                key={slot.id}
                type="button"
                className={`pointer-events-auto relative flex size-9 items-center justify-center rounded-sm border md:size-11 ${
                  selected ? "border-fg bg-elevated" : "border-line bg-surface"
                }`}
                onClick={() => engine.current?.pickSlot(i)}
                aria-label={slot.name}
              >
                <span
                  className="block size-8"
                  style={{
                    backgroundImage: "url(/game/atlas.png)",
                    backgroundRepeat: "no-repeat",
                    imageRendering: "pixelated",
                    backgroundSize: `${ATLAS_W * 32}px ${ATLAS_H * 32}px`,
                    backgroundPosition: `-${col * 32}px -${row * 32}px`,
                  }}
                />
                <span className="absolute bottom-0 right-0 pr-0.5 font-mono text-[10px] tabular-nums text-fg">
                  {hud.counts[i]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="absolute bottom-20 left-1/2 hidden -translate-x-1/2 text-xs text-muted md:block">
          WASD move · Space jump · Shift sprint · LMB mine · RMB place
        </p>
      </div>

      <div
        ref={stick}
        className="absolute bottom-28 left-4 size-24 rounded-full border border-line bg-surface/70 md:hidden"
        onPointerDown={onStick}
        onPointerMove={onStick}
        onPointerUp={() => engine.current?.setTouch(0, 0, false)}
        onPointerCancel={() => engine.current?.setTouch(0, 0, false)}
      />
      <button
        type="button"
        className="absolute bottom-28 right-4 rounded-full border border-line bg-surface px-5 py-3 text-sm font-medium text-fg md:hidden"
        onPointerDown={() => engine.current?.jump()}
      >
        Jump
      </button>
    </div>
  );
}
