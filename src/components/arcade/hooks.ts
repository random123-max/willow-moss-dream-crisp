import { useEffect, useRef, useState, useCallback } from "react";

/** requestAnimationFrame loop hook for canvas/arcade games. */
export function useGameLoop(callback: (dt: number) => void, active = true) {
  const ref = useRef(callback);
  ref.current = callback;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let last = performance.now();
    function loop(now: number) {
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
export function usePersist<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const set = useCallback(
    (v: T | ((p: T) => T)) => {
      setVal((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          /* ignore */
        }
        return next;
      });
    },
    [key],
  );
  return [val, set];
}

/** Keyboard input hook — returns a ref to currently-pressed keys. */
export function useKeys() {
  const keys = useRef<Set<string>>(new Set());
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      keys.current.add(e.key.toLowerCase());
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key.toLowerCase());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);
  return keys;
}

/** Canvas ref + sizing hook. Returns ref and dimensions. */
export function useCanvas(maxW = 480, maxH = 640) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [size, setSize] = useState({ w: maxW, h: maxH });
  useEffect(() => {
    function resize() {
      const vw = window.innerWidth;
      const w = Math.min(vw - 24, maxW);
      const h = Math.min(w * (maxH / maxW), maxH);
      setSize({ w, h });
    }
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [maxW, maxH]);
  return { ref, size };
}
