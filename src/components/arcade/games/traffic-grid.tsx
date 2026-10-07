import { useState, useEffect, useCallback, useRef } from "react";
import { GameShell } from "@/components/arcade/game-shell";
import { getGame } from "@/lib/arcade-games";

const G = getGame("traffic-grid")!;
const GRID_W = 6, GRID_H = 6;

type Light = "ns" | "ew"; // north-south green or east-west green
type Car = { x: number; y: number; dir: "n" | "s" | "e" | "w"; speed: number };

export default function TrafficGrid() {
  const [lights, setLights] = useState<Light[][]>(() => Array.from({ length: GRID_H }, () => Array(GRID_W).fill("ns")));
  const [cars, setCars] = useState<Car[]>([]);
  const [score, setScore] = useState(100);
  const [economy, setEconomy] = useState(100);
  const [over, setOver] = useState(false);
  const [msg, setMsg] = useState("Toggle traffic lights to keep cars moving!");
  const [rage, setRage] = useState(0);
  const tick = useRef(0);

  // Spawn cars
  useEffect(() => {
    if (over) return;
    const spawn = setInterval(() => {
      setCars((prev) => {
        if (prev.length > 20) return prev;
        const dirs: Car["dir"][] = ["e", "w", "n", "s"];
        const dir = dirs[Math.floor(Math.random() * 4)];
        const car: Car = {
          x: dir === "e" ? 0 : dir === "w" ? GRID_W * 50 : Math.random() * GRID_W * 50,
          y: dir === "s" ? 0 : dir === "n" ? GRID_H * 50 : Math.random() * GRID_H * 50,
          dir,
          speed: 0.5 + Math.random() * 0.5,
        };
        return [...prev, car];
      });
    }, 800);
    return () => clearInterval(spawn);
  }, [over]);

  // Update cars
  useEffect(() => {
    if (over) return;
    const t = setInterval(() => {
      tick.current++;
      setCars((prev) => {
        const ns: Car[] = [];
        for (const c of prev) {
          const gx = Math.floor(c.x / 50), gy = Math.floor(c.y / 50);
          const atIntersection = gx >= 0 && gx < GRID_W && gy >= 0 && gy < GRID_H && Math.abs((c.x % 50) - 25) < 5 && Math.abs((c.y % 50) - 25) < 5;
          let canMove = true;
          if (atIntersection) {
            const light = lights[gy]?.[gx] ?? "ns";
            if (c.dir === "e" || c.dir === "w") canMove = light === "ew";
            else canMove = light === "ns";
          }
          const nc = { ...c };
          if (canMove) {
            if (c.dir === "e") nc.x += c.speed * 2;
            if (c.dir === "w") nc.x -= c.speed * 2;
            if (c.dir === "s") nc.y += c.speed * 2;
            if (c.dir === "n") nc.y -= c.speed * 2;
          }
          // Check bounds — car leaves grid = scored
          if (nc.x < -10 || nc.x > GRID_W * 50 + 10 || nc.y < -10 || nc.y > GRID_H * 50 + 10) {
            setScore((s) => Math.min(200, s + 5));
            return ns;
          }
          ns.push(nc);
          if (!canMove) setRage((r) => Math.min(100, r + 0.5));
        }
        return ns;
      });
      setRage((r) => Math.max(0, r - 1));
      if (rage > 80) {
        setEconomy((e) => Math.max(0, e - 2));
        setScore((s) => Math.max(0, s - 1));
      }
      if (economy <= 0) { setOver(true); setMsg("Economy crashed! 💥"); }
    }, 200);
    return () => clearInterval(t);
  }, [over, lights, rage, economy]);

  const toggle = useCallback((r: number, c: number) => {
    if (over) return;
    setLights((prev) => {
      const nl = prev.map((row) => [...row]);
      nl[r][c] = nl[r][c] === "ns" ? "ew" : "ns";
      return nl;
    });
  }, [over]);

  const reset = () => {
    setLights(Array.from({ length: GRID_H }, () => Array(GRID_W).fill("ns")));
    setCars([]);
    setScore(100);
    setEconomy(100);
    setOver(false);
    setRage(0);
    setMsg("Toggle traffic lights to keep cars moving!");
  };

  return (
    <GameShell title={G.title} emoji={G.emoji} accent={G.accent} howTo={G.howTo} twist={G.twist} onReset={reset} score={`Score ${score}`} extra={<><span className="rounded-full border border-line bg-bg px-3 py-1 text-xs" style={{ color: rage > 60 ? "#ff6a3d" : "#fbbf24" }}>Rage {rage}%</span><span className="rounded-full border border-line bg-bg px-3 py-1 text-xs text-primary">Econ {economy}%</span></>}>
      <div className="flex flex-col items-center gap-3 p-4 pt-6">
        <p className="text-sm text-dust">{msg}</p>
        <div className="relative grid gap-1 rounded-lg border-2 p-1" style={{ gridTemplateColumns: `repeat(${GRID_W}, 1fr)`, borderColor: G.accent + "44" }}>
          {lights.map((row, r) =>
            row.map((light, c) => (
              <button key={`${r}-${c}`} type="button" disabled={over} onClick={() => toggle(r, c)} className="flex size-10 items-center justify-center rounded transition-all md:size-12" style={{ background: light === "ns" ? "#3ee0d022" : "#ff6a3d22", border: `2px solid ${light === "ns" ? "#3ee0d0" : "#ff6a3d"}` }}>
                <span className="text-xs" style={{ color: light === "ns" ? "#3ee0d0" : "#ff6a3d" }}>{light === "ns" ? "↕" : "↔"}</span>
              </button>
            )),
          )}
          {/* Cars overlay */}
          {cars.map((car, i) => (
            <div key={i} className="pointer-events-none absolute text-xs" style={{ left: car.x / (GRID_W * 50) * (GRID_W * 44 + GRID_W - 1), top: car.y / (GRID_H * 50) * (GRID_H * 44 + GRID_H - 1) }}>
              {car.dir === "e" && "🚗"}{car.dir === "w" && "🚙"}{car.dir === "n" && "🚕"}{car.dir === "s" && "🚐"}
            </div>
          ))}
        </div>
        <div className="flex gap-3 text-xs">
          <span style={{ color: "#3ee0d0" }}>↕ NS Green</span>
          <span style={{ color: "#ff6a3d" }}>↔ EW Green</span>
        </div>
        <p className="text-xs text-muted">Click intersections to toggle · Cars: {cars.length}</p>
      </div>
    </GameShell>
  );
}
