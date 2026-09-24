import { lazy } from "react";
import type { GameMeta } from "./types";

export const GAMES: GameMeta[] = [
  // ── Classic & Board ──
  { id: "neon-ttt", num: 1, title: "Neon Grandmaster Tic-Tac-Toe", category: "classics", icon: "❌", tagline: "Unbeatable minimax AI + glitch radiation", description: "3×3 with minimax AI; random tiles get glitch radiation that wipes markers left untended." },
  { id: "rps-quantum", num: 2, title: "RPS: Quantum Showdown", category: "classics", icon: "✊", tagline: "Pattern-learning AI + super-move charge meters", description: "Rock-Paper-Scissors vs predictive AI; charge meters let you unleash elemental super-moves." },
  { id: "gravity-c4", num: 3, title: "Gravity-Shift Connect Four", category: "classics", icon: "🔴", tagline: "Drop pieces, rotate the board once per game", description: "Standard Connect Four but one 90° board rotation per game re-stacks everything." },
  { id: "rogue-checkers", num: 4, title: "Rogue-Checkers", category: "classics", icon: "♟️", tagline: "6×6 checkers with HP pools and king abilities", description: "Compact checkers with piece health; crowning unlocks Chain Jump or Teleport." },
  { id: "chrono-memory", num: 5, title: "Chrono-Memory Match", category: "classics", icon: "🃏", tagline: "Card matching with decay and cursed cards", description: "Flip rune pairs for time extensions; cursed cards shuffle the board." },
  { id: "cyber-hangman", num: 6, title: "Cyberpunk Hangman", category: "classics", icon: "🔠", tagline: "Wrong guesses hack your keyboard UI", description: "Guess the code; wrong answers trigger security drones that scramble or dim keys." },
  { id: "dots-boxes", num: 7, title: "Dots & Boxes: Territory Wars", category: "classics", icon: "📦", tagline: "Close boxes for resources, buy sabotage", description: "Line-drawing grid; completed boxes yield resources to buy Double Lines or Wall Breaks." },
  { id: "reversi-nexus", num: 8, title: "Reversi: Nexus Dominion", category: "classics", icon: "⬛", tagline: "Othello with void rifts that destroy pieces", description: "8×8 Othello; static void rifts annihilate any piece flipped across them." },
  { id: "mine-toxic", num: 9, title: "Minesweeper: Toxic Undergrowth", category: "classics", icon: "💣", tagline: "Spreading miasma hides the numbers", description: "Mine grid with procedurally spreading miasma; safe clicks give radar scans." },
  { id: "battleship-fog", num: 10, title: "Battleship: Fog of War", category: "classics", icon: "🚢", tagline: "Sonar, airstrikes, and repair turns", description: "Single-player fleet hunt with sonar pings, airstrike cooldowns, and hull repair." },
  // ── Arcade & Action ──
  { id: "cyber-snake", num: 11, title: "Cyber-Snake: Hyperdrive", category: "action", icon: "🐍", tagline: "Inertia snake with shields and ghost clones", description: "Neon snake with physics inertia; data packets spawn power-ups." },
  { id: "pong-kinetic", num: 12, title: "Pong: Kinetic Chaos", category: "action", icon: "🏓", tagline: "Mass-velocity ball, paddle tilt, EMP blasts", description: "Ball gains mass and speed; tilt paddles to curve and fire EMPs." },
  { id: "elemental-breakout", num: 13, title: "Elemental Breakout", category: "action", icon: "🧱", tagline: "Ice, fire, and iron bricks with reactive physics", description: "Brick-breaker where ice freezes your paddle, fire explodes, iron takes heavy hits." },
  { id: "flappy-steampunk", num: 14, title: "Flappy Steampunk Aviator", category: "action", icon: "⚙️", tagline: "Manage steam pressure through moving gears", description: "Tap to boost, but over-boost overheats the engine forcing a glide." },
  { id: "asteroids-drift", num: 15, title: "Asteroids: Vector Drift", category: "action", icon: "🪨", tagline: "Vector physics with gravity anomalies", description: "Shattering asteroids release gravity wells that pull your ship." },
  { id: "space-invaders-evo", num: 16, title: "Space Invaders: Evolution", category: "action", icon: "👾", tagline: "Aliens mutate based on your play style", description: "Shoot fast and they shield; use heavy lasers and they split into scouts." },
  { id: "neon-maze-ghost", num: 17, title: "Neon Maze: Ghost Hunt", category: "action", icon: "👻", tagline: "Lay light traps for ghosts with unique AI", description: "Collect dots and trap ghosts with different pathfinding personalities." },
  { id: "chrono-runner", num: 18, title: "Chrono-Runner", category: "action", icon: "⏱️", tagline: "Time moves only when you move", description: "Endless runner where obstacles respond to your speed; plan jumps like puzzles." },
  { id: "whack-mage", num: 19, title: "Whack-a-Mage", category: "action", icon: "🪄", tagline: "Reaction clicks with spell-casting mages", description: "Fire mages clear adjacent targets; illusionists duplicate them." },
  { id: "frogger-quantum", num: 20, title: "Frogger: Quantum Highway", category: "action", icon: "🐸", tagline: "Temporal loops rewind you 3 seconds on hit", description: "Cross lanes in alternating time loops; getting hit rewinds your position." },
  { id: "lunar-lander", num: 21, title: "Lunar Lander: Gravity Orbit", category: "action", icon: "🌙", tagline: "Wind, fuel mass, and impact-angle damage", description: "Descend with wind simulation, fuel consumption, and structural damage." },
  { id: "orbital-dogfight", num: 22, title: "Orbital Dogfight", category: "action", icon: "🚀", tagline: "Ammo, fuel, cooling, heat-seeking missiles", description: "Single-screen fighter managing resources while evading tracking missiles." },
  { id: "rhythm-vanguard", num: 23, title: "Rhythm Vanguard", category: "action", icon: "🎵", tagline: "Tap to the beat to charge your defenses", description: "Lane defense where the beat powers weapons; missing short-circuits shields." },
  { id: "zombie-survival", num: 24, title: "Midnight Zombie Survival", category: "action", icon: "🔦", tagline: "Raycast lighting, draining battery, noise horde", description: "Top-down survival with dynamic flashlight and noise-attracted hordes." },
  { id: "mini-golf-wizard", num: 25, title: "Mini-Golf: Wizard's Course", category: "action", icon: "⛳", tagline: "Gravity wells, portals, ice, and spin", description: "Single-screen courses with magical terrain and mid-flight ball curve." },
  // ── Puzzles & Logic ──
  { id: "reactor-2048", num: 26, title: "2048: Fusion Reactor", category: "puzzles", icon: "⚛️", tagline: "Merge tiles generate heat; stagnate and explode", description: "Sliding 2048 where stagnant boards trigger a reactor explosion." },
  { id: "sudoku-runes", num: 27, title: "Sudoku: Runes of Power", category: "puzzles", icon: "🔮", tagline: "Mini-sudoku with elemental spell-casting", description: "Place correct numbers to earn elements; cast Reveal Fate or Cleanse Error." },
  { id: "wordle-cipher", num: 28, title: "Wordle: Cipher Hack", category: "puzzles", icon: "🔤", tagline: "AI firewall locks keys on wrong guesses", description: "Word-guessing where each wrong guess locks out keyboard keys." },
  { id: "hanoi-kinetic", num: 29, title: "Tower of Hanoi: Kinetic Weight", category: "puzzles", icon: "🗼", tagline: "Columns have weight limits and can tip", description: "Disk-stacking where overloading a column scatters its disks." },
  { id: "sliding-paradox", num: 30, title: "Sliding Tile: Paradox Engine", category: "puzzles", icon: "🔀", tagline: "Align numbers and circuit lines simultaneously", description: "Sliding grid where moving a tile shifts the background; match both layers." },
  { id: "lights-overcharge", num: 31, title: "Lights Out: Overcharge", category: "puzzles", icon: "💡", tagline: "Three-state toggle spreading to neighbors", description: "Grid toggling where nodes cycle through three color states." },
  { id: "simon-freq", num: 32, title: "Simon Says: Frequency Modulator", category: "puzzles", icon: "🎛️", tagline: "Audio-visual pattern matching with warped frequencies", description: "Memory sequence where higher rounds warp the tones." },
  { id: "fifteen-gravity", num: 33, title: "Fifteen: Gravity Grid", category: "puzzles", icon: "🔲", tagline: "Empty tile is a black hole pulling neighbors", description: "15-puzzle where the gap auto-pulls adjacent tiles every few seconds." },
  { id: "nonogram-bp", num: 34, title: "Nonogram: Blueprint Architect", category: "puzzles", icon: "📐", tagline: "5×5 logic grid builds a robot before time runs out", description: "Pixel logic grid; uncover the image to complete a defense unit." },
  { id: "steam-pipe", num: 35, title: "Steam-Pipe Connector", category: "puzzles", icon: "🔧", tagline: "Rotate pipes against rising water pressure", description: "Tile-rotation where faulty connections leak and reduce your score." },
  { id: "mastermind-alch", num: 36, title: "Mastermind: Alchemical Breach", category: "puzzles", icon: "⚗️", tagline: "Code-breaking with elemental reaction clues", description: "Feedback pegs give conditional hints based on elemental reactions." },
  { id: "color-flood-hex", num: 37, title: "Color Flood: Hex Dominion", category: "puzzles", icon: "🎨", tagline: "Hex flood-fill with mountains and rivers", description: "Hexagonal board where terrain tiles block or accelerate color flow." },
  { id: "math24-spell", num: 38, title: "Math 24: Spellweaver", category: "puzzles", icon: "🔢", tagline: "Arithmetic to 24 with magical combos", description: "Combine numbers to total 24; loops build combos to defeat monsters." },
  { id: "logic-cube", num: 39, title: "Logic Cube: Ink Trails", category: "puzzles", icon: "🧊", tagline: "Roll a 3D cube to paint matching paths", description: "Cube sides have unique stamps; roll precisely to match the goal." },
  { id: "echo-shadow", num: 40, title: "Echo Shadow", category: "puzzles", icon: "👤", tagline: "Shadow mimics your moves in reverse", description: "Platformer where your shadow replays backwards; hit two switches at once." },
  // ── Idle & Simulation ──
  { id: "cyber-factory", num: 41, title: "Cyber-Factory Idle", category: "simulation", icon: "🏭", tagline: "Balance grid economy, cooling, and degrading drones", description: "Click for scrap; manage cooling, power, and repair degrading drones." },
  { id: "micro-cosmos", num: 42, title: "Micro-Cosmos Builder", category: "simulation", icon: "🪐", tagline: "Evolve life while preventing extinction events", description: "Balance atmosphere, temperature, and oxygen to evolve microbes." },
  { id: "cozy-fishing", num: 43, title: "Cozy Deep-Sea Fishing", category: "simulation", icon: "🎣", tagline: "Ecosystem sim with reel tension and depth pressure", description: "Bait types attract different layers; balance tension against pressure." },
  { id: "biotech-nursery", num: 44, title: "Pocket Biotech Nursery", category: "simulation", icon: "🧬", tagline: "Mutate a pet via genetic code and diet", description: "Feed, sleep, and irradiate to unlock evolution branches." },
  { id: "espresso-tycoon", num: 45, title: "Espresso Tycoon: Rush Hour", category: "simulation", icon: "☕", tagline: "Serve recipes, manage temps and staff stress", description: "Fill complex orders before customers walk out." },
  { id: "traffic-grid", num: 46, title: "Metropolis Traffic Grid", category: "simulation", icon: "🚦", tagline: "Toggle lights to avoid gridlock and rage", description: "Manage intersections; congestion crashes the local economy." },
  { id: "alchemist-lemonade", num: 47, title: "Alchemist's Lemonade Stand", category: "simulation", icon: "🍋", tagline: "Potion market with weather and rival pricing", description: "Mix potions; adjust recipes for fluctuating demand and conditions." },
  { id: "bonsai-cultivator", num: 48, title: "Bonsai Cultivator Idle", category: "simulation", icon: "🌳", tagline: "Prune and water for rare bioluminescent blooms", description: "Customize growth paths with genetic modifiers for idle income." },
  { id: "museum-curator", num: 49, title: "Grand Museum Curator", category: "simulation", icon: "🏛️", tagline: "Arrange exhibits for synergy, catch thieves", description: "Maximize artifact synergy; hire guards to patrol dark halls." },
  { id: "red-planet-lander", num: 50, title: "Red Planet Thruster Lander", category: "simulation", icon: "🛸", tagline: "High-fidelity physics landing simulator", description: "Manage velocity, inertia, drag, and throttle on a rugged surface." },
];

// ── Lazy game components ──
const classics1 = () => import("./games/classics-1");
const classics2 = () => import("./games/classics-2");
const action1 = () => import("./games/action-1");
const action2 = () => import("./games/action-2");
const action3 = () => import("./games/action-3");
const puzzles1 = () => import("./games/puzzles-1");
const puzzles2 = () => import("./games/puzzles-2");
const puzzles3 = () => import("./games/puzzles-3");
const sim1 = () => import("./games/sim-1");
const sim2 = () => import("./games/sim-2");

import type { ComponentType } from "react";
const lazyPick = <T extends Record<string, ComponentType>>(loader: () => Promise<T>, name: keyof T) =>
  lazy(() => loader().then((m) => ({ default: m[name] as ComponentType })));

export const GAME_COMPONENTS: Record<string, ComponentType> = {
  "neon-ttt": lazyPick(classics1, "NeonTicTacToe"),
  "rps-quantum": lazyPick(classics1, "RpsQuantum"),
  "gravity-c4": lazyPick(classics1, "GravityConnect4"),
  "rogue-checkers": lazyPick(classics1, "RogueCheckers"),
  "chrono-memory": lazyPick(classics1, "ChronoMemory"),
  "cyber-hangman": lazyPick(classics2, "CyberHangman"),
  "dots-boxes": lazyPick(classics2, "DotsBoxes"),
  "reversi-nexus": lazyPick(classics2, "ReversiNexus"),
  "mine-toxic": lazyPick(classics2, "MineToxic"),
  "battleship-fog": lazyPick(classics2, "BattleshipFog"),
  "cyber-snake": lazyPick(action1, "CyberSnake"),
  "pong-kinetic": lazyPick(action1, "PongKinetic"),
  "elemental-breakout": lazyPick(action1, "ElementalBreakout"),
  "flappy-steampunk": lazyPick(action1, "FlappySteampunk"),
  "asteroids-drift": lazyPick(action1, "AsteroidsDrift"),
  "space-invaders-evo": lazyPick(action2, "SpaceInvadersEvo"),
  "neon-maze-ghost": lazyPick(action2, "NeonMazeGhost"),
  "chrono-runner": lazyPick(action2, "ChronoRunner"),
  "whack-mage": lazyPick(action2, "WhackMage"),
  "frogger-quantum": lazyPick(action2, "FroggerQuantum"),
  "lunar-lander": lazyPick(action3, "LunarLander"),
  "orbital-dogfight": lazyPick(action3, "OrbitalDogfight"),
  "rhythm-vanguard": lazyPick(action3, "RhythmVanguard"),
  "zombie-survival": lazyPick(action3, "ZombieSurvival"),
  "mini-golf-wizard": lazyPick(action3, "MiniGolfWizard"),
  "reactor-2048": lazyPick(puzzles1, "Reactor2048"),
  "sudoku-runes": lazyPick(puzzles1, "SudokuRunes"),
  "wordle-cipher": lazyPick(puzzles1, "WordleCipher"),
  "hanoi-kinetic": lazyPick(puzzles1, "HanoiKinetic"),
  "sliding-paradox": lazyPick(puzzles1, "SlidingParadox"),
  "lights-overcharge": lazyPick(puzzles2, "LightsOvercharge"),
  "simon-freq": lazyPick(puzzles2, "SimonFreq"),
  "fifteen-gravity": lazyPick(puzzles2, "FifteenGravity"),
  "nonogram-bp": lazyPick(puzzles2, "NonogramBlueprint"),
  "steam-pipe": lazyPick(puzzles2, "SteamPipe"),
  "mastermind-alch": lazyPick(puzzles3, "MastermindAlchemy"),
  "color-flood-hex": lazyPick(puzzles3, "ColorFloodHex"),
  "math24-spell": lazyPick(puzzles3, "Math24Spell"),
  "logic-cube": lazyPick(puzzles3, "LogicCube"),
  "echo-shadow": lazyPick(puzzles3, "EchoShadow"),
  "cyber-factory": lazyPick(sim1, "CyberFactory"),
  "micro-cosmos": lazyPick(sim1, "MicroCosmos"),
  "cozy-fishing": lazyPick(sim1, "CozyFishing"),
  "biotech-nursery": lazyPick(sim1, "BiotechNursery"),
  "espresso-tycoon": lazyPick(sim1, "EspressoTycoon"),
  "traffic-grid": lazyPick(sim2, "TrafficGrid"),
  "alchemist-lemonade": lazyPick(sim2, "AlchemistLemonade"),
  "bonsai-cultivator": lazyPick(sim2, "BonsaiCultivator"),
  "museum-curator": lazyPick(sim2, "MuseumCurator"),
  "red-planet-lander": lazyPick(sim2, "RedPlanetLander"),
};
