import { useEffect, useRef } from "react";

/** requestAnimationFrame loop with delta time. */
export function useRafLoop(cb: (dt: number) => void, active = true) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ref.current(dt);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active]);
}

/** Keyboard handler map keyed by KeyboardEvent.key (e.g. "ArrowUp"). */
export function useKeys(handlers: Record<string, (e: KeyboardEvent) => void>) {
  const ref = useRef(handlers);
  ref.current = handlers;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const h = ref.current[e.key];
      if (h) {
        e.preventDefault();
        h(e);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

/** SetInterval wrapper that supports null to pause. */
export function useInterval(cb: () => void, ms: number | null) {
  const ref = useRef(cb);
  ref.current = cb;
  useEffect(() => {
    if (ms === null) return;
    const id = setInterval(() => ref.current(), ms);
    return () => clearInterval(id);
  }, [ms]);
}

/** Mount-only effect that runs once. */
export function useOnce(fn: () => void | (() => void)) {
  const ref = useRef<void | (() => void)>(undefined);
  if (ref.current === undefined) ref.current = fn();
  useEffect(() => () => { if (typeof ref.current === "function") ref.current(); }, []);
}
