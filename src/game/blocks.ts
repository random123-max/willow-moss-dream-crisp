export const AIR = 0;
export const GRASS = 1;
export const DIRT = 2;
export const STONE = 3;
export const COBBLE = 4;
export const SAND = 5;
export const LOG = 6;
export const PLANKS = 7;
export const LEAVES = 8;
export const GLASS = 9;
export const LAMP = 10;
export const ORE = 11;
export const ICE = 12;
export const METAL = 13;
export const ROOF = 14;
export const WOOL = 15;
export const BEDROCK = 16;
export const GRAVEL = 17;
export const CRYSTAL = 18;

export const ATLAS_W = 16;
export const ATLAS_H = 2;

/** Atlas tile index. Grass/log use per-face mapping in tileFor. */
export const TILE: Record<number, number> = {
  [GRASS]: 0,
  [DIRT]: 2,
  [STONE]: 3,
  [COBBLE]: 4,
  [SAND]: 5,
  [LOG]: 6,
  [PLANKS]: 8,
  [LEAVES]: 9,
  [GLASS]: 10,
  [LAMP]: 11,
  [ORE]: 12,
  [ICE]: 13,
  [METAL]: 14,
  [ROOF]: 15,
  [WOOL]: 16,
  [BEDROCK]: 17,
  [GRAVEL]: 18,
  [CRYSTAL]: 19,
};

export const OPAQUE: Record<number, boolean> = {
  [GRASS]: true,
  [DIRT]: true,
  [STONE]: true,
  [COBBLE]: true,
  [SAND]: true,
  [LOG]: true,
  [PLANKS]: true,
  [LEAVES]: false,
  [GLASS]: false,
  [LAMP]: true,
  [ORE]: true,
  [ICE]: true,
  [METAL]: true,
  [ROOF]: true,
  [WOOL]: true,
  [BEDROCK]: true,
  [GRAVEL]: true,
  [CRYSTAL]: true,
};

export function isSolid(id: number) {
  return id !== AIR;
}

export function isOpaque(id: number) {
  return !!OPAQUE[id];
}

export function tileFor(id: number, nx: number, ny: number, nz: number) {
  if (id === GRASS) {
    if (ny === 1) return 0;
    if (ny === -1) return 2;
    return 1;
  }
  if (id === LOG) {
    if (ny !== 0) return 7;
    return 6;
  }
  if (id === LAMP) {
    if (ny !== 0) return 11;
    return 23;
  }
  return TILE[id] ?? 3;
}

export type HotbarSlot = { id: number; name: string; tile: number };

export const HOTBAR: HotbarSlot[] = [
  { id: GRASS, name: "Lunar crust", tile: 0 },
  { id: DIRT, name: "Regolith", tile: 2 },
  { id: STONE, name: "Basalt", tile: 3 },
  { id: COBBLE, name: "Cobble", tile: 4 },
  { id: PLANKS, name: "Starwood", tile: 8 },
  { id: LOG, name: "Starwood log", tile: 6 },
  { id: GLASS, name: "Void glass", tile: 10 },
  { id: LAMP, name: "Beacon", tile: 11 },
  { id: METAL, name: "Habitat plate", tile: 14 },
];

export const FACE_SHADE: Record<string, number> = {
  "0,1,0": 1,
  "0,-1,0": 0.5,
  "1,0,0": 0.6,
  "-1,0,0": 0.6,
  "0,0,1": 0.8,
  "0,0,-1": 0.8,
};
