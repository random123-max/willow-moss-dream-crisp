import {
  AIR,
  BEDROCK,
  COBBLE,
  CRYSTAL,
  DIRT,
  GLASS,
  GRASS,
  GRAVEL,
  ICE,
  LAMP,
  LEAVES,
  LOG,
  METAL,
  ORE,
  PLANKS,
  ROOF,
  SAND,
  STONE,
  WOOL,
} from "./blocks";

export const CS = 16;
export const WORLD_H = 40;
export const VIEW = 4;

export const VILLAGE = { x0: 0, z0: 0, x1: 36, z1: 28, y: 20 };

export function hash2(x: number, z: number) {
  let n = (x * 374761393 + z * 668265263) | 0;
  n = (n ^ (n >> 13)) * 1274126177;
  return ((n ^ (n >> 16)) >>> 0) / 4294967295;
}

export function heightAt(x: number, z: number) {
  if (inVillage(x, z)) return VILLAGE.y;
  const nx = x * 0.04;
  const nz = z * 0.04;
  let h =
    18 +
    Math.sin(nx) * 3.4 +
    Math.cos(nz * 1.15) * 2.6 +
    Math.sin((nx + nz) * 0.55) * 2.1 +
    Math.sin(nx * 2.2) * 0.8;
  const cr = hash2(Math.floor(x / 22), Math.floor(z / 22));
  if (cr > 0.78) {
    const cx = Math.floor(x / 22) * 22 + 11;
    const cz = Math.floor(z / 22) * 22 + 11;
    const d = Math.hypot(x - cx, z - cz);
    if (d < 7) h -= (7 - d) * 0.9;
  }
  return Math.max(6, Math.floor(h));
}

export function inVillage(x: number, z: number) {
  return x >= VILLAGE.x0 && x <= VILLAGE.x1 && z >= VILLAGE.z0 && z <= VILLAGE.z1;
}

export function idx(x: number, y: number, z: number) {
  return x + y * CS + z * CS * WORLD_H;
}

export type Stamp = { x: number; y: number; z: number; id: number };

let stamps: Stamp[] | null = null;

function add(list: Stamp[], x: number, y: number, z: number, id: number) {
  list.push({ x, y, z, id });
}

function fillBox(
  list: Stamp[],
  x0: number,
  y0: number,
  z0: number,
  x1: number,
  y1: number,
  z1: number,
  id: number,
  hollow = false,
) {
  for (let y = y0; y <= y1; y++) {
    for (let z = z0; z <= z1; z++) {
      for (let x = x0; x <= x1; x++) {
        if (hollow) {
          const wall = x === x0 || x === x1 || z === z0 || z === z1 || y === y0 || y === y1;
          if (!wall) continue;
        }
        add(list, x, y, z, id);
      }
    }
  }
}

function house(
  list: Stamp[],
  ox: number,
  oz: number,
  w: number,
  d: number,
  wall: number,
  floor: number,
  roof: number,
) {
  const y = VILLAGE.y;
  const h = 4;
  fillBox(list, ox, y, oz, ox + w - 1, y, oz + d - 1, floor);
  fillBox(list, ox, y + 1, oz, ox + w - 1, y + h, oz + d - 1, wall, true);
  // log corners
  for (let yy = y; yy <= y + h; yy++) {
    add(list, ox, yy, oz, LOG);
    add(list, ox + w - 1, yy, oz, LOG);
    add(list, ox, yy, oz + d - 1, LOG);
    add(list, ox + w - 1, yy, oz + d - 1, LOG);
  }
  // roof
  fillBox(list, ox - 1, y + h, oz - 1, ox + w, y + h, oz + d, roof);
  fillBox(list, ox, y + h + 1, oz, ox + w - 1, y + h + 1, oz + d - 1, roof);
  // door
  const dx = ox + Math.floor(w / 2);
  add(list, dx, y + 1, oz, AIR);
  add(list, dx, y + 2, oz, AIR);
  // windows
  add(list, ox + 1, y + 2, oz, GLASS);
  add(list, ox + w - 2, y + 2, oz, GLASS);
  add(list, ox, y + 2, oz + 2, GLASS);
  add(list, ox + w - 1, y + 2, oz + 2, GLASS);
  // interior
  add(list, ox + 2, y + 1, oz + d - 2, WOOL);
  add(list, ox + 3, y + 1, oz + d - 2, WOOL);
  add(list, dx, y + h - 1, oz + 2, LAMP);
  add(list, ox + w - 2, y + 1, oz + 2, PLANKS);
}

function tree(list: Stamp[], tx: number, tz: number) {
  const h = heightAt(tx, tz);
  const th = 4 + Math.floor(hash2(tx, tz) * 3);
  for (let y = 1; y <= th; y++) add(list, tx, h + y, tz, LOG);
  const top = h + th;
  for (let dy = -1; dy <= 2; dy++) {
    const r = dy === 2 ? 1 : 2;
    for (let dz = -r; dz <= r; dz++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.abs(dx) === r && Math.abs(dz) === r && hash2(tx + dx, tz + dz) < 0.4) continue;
        if (dx === 0 && dz === 0 && dy <= 0) continue;
        add(list, tx + dx, top + dy, tz + dz, LEAVES);
      }
    }
  }
  add(list, tx, top + 2, tz, LEAVES);
}

export function getStamps() {
  if (stamps) return stamps;
  const list: Stamp[] = [];
  const y = VILLAGE.y;

  // gravel paths
  for (let x = 2; x <= 34; x++) {
    add(list, x, y, 12, GRAVEL);
    add(list, x, y, 13, GRAVEL);
  }
  for (let z = 2; z <= 24; z++) {
    add(list, 16, y, z, GRAVEL);
    add(list, 17, y, z, GRAVEL);
  }

  house(list, 2, 2, 7, 6, PLANKS, PLANKS, ROOF);
  house(list, 20, 2, 8, 6, COBBLE, PLANKS, ROOF);
  house(list, 4, 16, 7, 6, PLANKS, PLANKS, METAL);

  // greenhouse
  fillBox(list, 22, y, 16, 30, y, 24, DIRT);
  fillBox(list, 22, y + 1, 16, 30, y + 4, 24, GLASS, true);
  fillBox(list, 22, y + 4, 16, 30, y + 4, 24, GLASS);
  add(list, 26, y + 1, 16, AIR);
  add(list, 26, y + 2, 16, AIR);
  add(list, 26, y + 3, 20, LAMP);
  for (let z = 18; z <= 22; z++) {
    for (let x = 24; x <= 28; x++) add(list, x, y, z, SAND);
  }

  // well
  fillBox(list, 14, y, 10, 18, y + 1, 14, COBBLE, true);
  add(list, 16, y, 12, ICE);
  add(list, 16, y - 1, 12, ICE);
  add(list, 16, y + 3, 12, LAMP);

  // watchtower
  fillBox(list, 32, y, 20, 34, y + 8, 22, COBBLE, true);
  fillBox(list, 31, y + 8, 19, 35, y + 8, 23, PLANKS);
  add(list, 33, y + 1, 20, AIR);
  add(list, 33, y + 2, 20, AIR);
  add(list, 33, y + 9, 21, LAMP);

  // comms tower
  for (let yy = y + 1; yy <= y + 10; yy++) add(list, 33, yy, 4, METAL);
  add(list, 33, y + 11, 4, LAMP);
  add(list, 32, y + 10, 4, METAL);
  add(list, 34, y + 10, 4, METAL);
  fillBox(list, 31, y, 2, 35, y, 6, METAL);

  // farm
  for (let z = 16; z <= 20; z++) {
    for (let x = 10; x <= 14; x++) add(list, x, y, z, DIRT);
  }
  add(list, 12, y + 1, 16, LAMP);
  add(list, 12, y + 1, 20, LAMP);

  // crystal shrine
  fillBox(list, 1, y, 10, 3, y, 14, STONE);
  add(list, 2, y + 1, 12, CRYSTAL);
  add(list, 2, y + 2, 12, CRYSTAL);

  // trees around, not inside village core
  for (let z = -40; z <= 50; z += 6) {
    for (let x = -40; x <= 50; x += 6) {
      const jx = x + Math.floor(hash2(x, z) * 4) - 2;
      const jz = z + Math.floor(hash2(z, x) * 4) - 2;
      if (inVillage(jx, jz)) continue;
      if (hash2(jx, jz) > 0.55) tree(list, jx, jz);
    }
  }

  stamps = list;
  return list;
}

export function genChunk(cx: number, cz: number) {
  const d = new Uint8Array(CS * WORLD_H * CS);
  for (let z = 0; z < CS; z++) {
    for (let x = 0; x < CS; x++) {
      const wx = cx * CS + x;
      const wz = cz * CS + z;
      const h = heightAt(wx, wz);
      const pond = !inVillage(wx, wz) && hash2(Math.floor(wx / 14), Math.floor(wz / 14)) > 0.88;
      for (let y = 0; y <= h && y < WORLD_H; y++) {
        let id = STONE;
        if (y === 0) id = BEDROCK;
        else if (y === h) {
          if (pond && h < 17) id = ICE;
          else if (inVillage(wx, wz)) id = GRASS;
          else id = GRASS;
        } else if (y > h - 3) id = DIRT;
        if (y < h - 4 && y > 3 && hash2(wx * 3, wz + y * 7) > 0.973) id = ORE;
        if (y < h - 5 && y > 4 && hash2(wx + y, wz * 5) > 0.985) id = CRYSTAL;
        // caves
        if (y > 3 && y < h - 3) {
          const cave =
            Math.sin(wx * 0.21 + y * 0.17) * Math.cos(wz * 0.19 - y * 0.13) + hash2(wx, y + wz) * 0.35;
          if (cave > 0.72) id = AIR;
        }
        d[idx(x, y, z)] = id;
      }
      if (!inVillage(wx, wz) && hash2(wx + 2, wz + 9) > 0.993 && h + 1 < WORLD_H) {
        d[idx(x, h + 1, z)] = LAMP;
      }
    }
  }
  const x0 = cx * CS;
  const z0 = cz * CS;
  for (const s of getStamps()) {
    if (s.x < x0 || s.x >= x0 + CS || s.z < z0 || s.z >= z0 + CS) continue;
    if (s.y < 0 || s.y >= WORLD_H) continue;
    d[idx(s.x - x0, s.y, s.z - z0)] = s.id;
  }
  return d;
}
