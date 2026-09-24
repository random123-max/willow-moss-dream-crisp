export const GIFT_CODE = "STAR-ORBIT-7K2M";
export const GIFT_TITLE = "Helios Gift Pack";

export type CatalogStatus = "live" | "sealed";

export type CatalogGame = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  status: CatalogStatus;
  href?: string;
};

export type EduModule = {
  id: string;
  title: string;
  body: string;
};

export const FEATURED: CatalogGame = {
  id: "helios-outpost",
  title: "Helios Outpost",
  tag: "Minecraft + space mods",
  blurb:
    "A block world the way it looks with the Helios pack on — lunar crust, starwood village, visor undead.",
  status: "live",
  href: "/play",
};

export const ARCADE: CatalogGame[] = [
  FEATURED,
  {
    id: "tic-tac-toe",
    title: "Tic Tac Toe",
    tag: "Sealed",
    blurb: "Slot reserved — add this later.",
    status: "sealed",
  },
  {
    id: "rps",
    title: "Rock Paper Scissors",
    tag: "Sealed",
    blurb: "Slot reserved — add this later.",
    status: "sealed",
  },
  {
    id: "orbit-memory",
    title: "Orbit Memory",
    tag: "Sealed",
    blurb: "Slot reserved — add this later.",
    status: "sealed",
  },
];

export const SEALED_TOTAL = 249;

export const EDU_MODULES: EduModule[] = [
  {
    id: "astro",
    title: "Astro Undead",
    body: "Zombies, husks, drowned, and zombie villagers wear cracked visors and suit plating. They drop moon rocks.",
  },
  {
    id: "bones",
    title: "Void Bones",
    body: "Skeletons, strays, and wither bones carry cyan visors and cold-signal armor. They drop star crystals.",
  },
  {
    id: "creeper",
    title: "Star Creeper",
    body: "Creepers become dark-hull cosmic charges with a glowing core. They still hiss. They drop signal cores.",
  },
  {
    id: "wildlife",
    title: "Cosmic Wildlife",
    body: "Spiders, endermen, slime, and ghasts restyle as orbit crawlers, rift walkers, gel cores, and signal wailers.",
  },
  {
    id: "surface",
    title: "Lunar Surface",
    body: "Vanilla grass, dirt, stone, sand, ores, ice, and glowstone shift into crust, regolith, basalt, and beacon crystal.",
  },
  {
    id: "starwood",
    title: "Starwood Grove",
    body: "Placeable starwood logs, planks, and crystal leaves — craft planks from logs at a crafting table.",
  },
  {
    id: "habitat",
    title: "Habitat Build Kit",
    body: "Habitat plates, void glass, comms tiles, lunar ice, and beacon lamps. Build the outpost in Education.",
  },
  {
    id: "ore",
    title: "Star Ore",
    body: "Star ore smelts in a furnace into star crystals. Four crystals make a crystal block.",
  },
  {
    id: "gear",
    title: "Crew Gear",
    body: "Wearable visor, edible ration, moon rock, signal core, fuel cell, astro compass — plus a /function kit care package.",
  },
  {
    id: "drops",
    title: "Night Loot",
    body: "Space-undead, bones, creepers, spiders, and rift walkers drop Helios items on top of their usual loot.",
  },
];
