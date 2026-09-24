export type GameCategory = "classics" | "action" | "puzzles" | "simulation";

export type GameMeta = {
  id: string;
  num: number;
  title: string;
  category: GameCategory;
  tagline: string;
  description: string;
  icon: string;
};

export const CATEGORIES: { key: GameCategory; label: string; icon: string }[] = [
  { key: "classics", label: "Complex Classic & Board", icon: "♟️" },
  { key: "action", label: "Intricate Arcade & Action", icon: "🕹️" },
  { key: "puzzles", label: "Brain-Melting Puzzles & Logic", icon: "🧩" },
  { key: "simulation", label: "Deep Idle & Simulation", icon: "📈" },
];
