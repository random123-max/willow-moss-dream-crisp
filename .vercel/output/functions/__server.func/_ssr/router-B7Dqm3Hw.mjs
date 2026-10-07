import { i as __toESM } from "../_runtime.mjs";
import { R as require_react, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, v as useRouter, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/arcade-games-UVO5_kh1.js
var CATEGORIES = [
	"Classic & Board",
	"Arcade & Action",
	"Puzzles & Logic",
	"Idle & Sim"
];
var ARCADE_GAMES = [
	{
		id: "neon-tic-tac-toe",
		num: 1,
		title: "Neon Grandmaster Tic-Tac-Toe",
		category: "Classic & Board",
		emoji: "❌",
		accent: "#3ee0d0",
		blurb: "Unbeatable minimax AI meets glitch radiation that wipes tiles.",
		twist: "Every 2 rounds a random tile gets irradiated — leave it 2 rounds and it's wiped clean.",
		howTo: [
			"Tap a cell to place your X.",
			"The AI uses minimax — it cannot lose, only draw.",
			"Every 2 rounds, a random tile gets glitch radiation.",
			"If an irradiated tile is still occupied after 2 more rounds, it's wiped!",
			"Survive the glitches and force a draw to win."
		]
	},
	{
		id: "rps-quantum",
		num: 2,
		title: "RPS: Quantum Showdown",
		category: "Classic & Board",
		emoji: "✊",
		accent: "#ff6a3d",
		blurb: "Rock Paper Scissors vs a pattern-learning AI with elemental super-moves.",
		twist: "Charge Meters fill every turn — at 5 charges, unleash a super-move like Meteor Rock.",
		howTo: [
			"Pick Rock, Paper, or Scissors each round.",
			"The AI learns your patterns — vary your plays!",
			"Each round fills your elemental Charge Meter.",
			"At 5 charges, unleash a super-move for bonus damage.",
			"Reduce the AI's HP to zero to win."
		]
	},
	{
		id: "gravity-connect4",
		num: 3,
		title: "Gravity-Shift Connect Four",
		category: "Classic & Board",
		emoji: "🔴",
		accent: "#8b5cf6",
		blurb: "Classic Connect Four — but rotate the entire board once per game.",
		twist: "One 90° board rotation per player re-stacks every piece with new gravity.",
		howTo: [
			"Click a column to drop your piece.",
			"Connect 4 in a row — horizontal, vertical, or diagonal.",
			"Each player gets ONE board rotation per game.",
			"Rotation shifts gravity 90° and re-drops all pieces!",
			"Use your rotation wisely to break the AI's plans."
		]
	},
	{
		id: "rogue-checkers",
		num: 4,
		title: "Rogue-Checkers",
		category: "Classic & Board",
		emoji: "♟️",
		accent: "#f59e0b",
		blurb: "6×6 checkers with character classes, health pools, and crown abilities.",
		twist: "Crowning a piece unlocks abilities like Chain Jump or Teleport.",
		howTo: [
			"Move diagonally; jump enemies to damage them.",
			"Pieces have HP — big pieces take more jumps to kill.",
			"Reach the far row to crown a piece.",
			"Crowned pieces gain unique abilities: Chain Jump or Teleport.",
			"Eliminate all enemy pieces to win."
		]
	},
	{
		id: "chrono-memory",
		num: 5,
		title: "Chrono-Memory Match",
		category: "Classic & Board",
		emoji: "🃏",
		accent: "#ec4899",
		blurb: "Card matching with a ticking decay timer and cursed cards.",
		twist: "Cursed Cards shuffle the remaining board when revealed. Match runes for time bonuses.",
		howTo: [
			"Click cards to flip them.",
			"Match identical fantasy runes to clear them.",
			"Each match extends your time.",
			"Cursed Cards shuffle the board when revealed!",
			"Clear all pairs before time runs out."
		]
	},
	{
		id: "cyber-hangman",
		num: 6,
		title: "Cyberpunk Hangman",
		category: "Classic & Board",
		emoji: "🔤",
		accent: "#22d3ee",
		blurb: "Guess letters to breach a firewall — wrong guesses hack your UI.",
		twist: "Wrong guesses trigger security drones that scramble or dim your keyboard.",
		howTo: [
			"Click letters to guess the hidden word.",
			"Correct letters appear in the word.",
			"Wrong guesses trigger drone hacks.",
			"Drones scramble letters or dim your keyboard.",
			"Breach the firewall before 6 wrong guesses."
		]
	},
	{
		id: "dots-boxes",
		num: 7,
		title: "Dots & Boxes: Territory Wars",
		category: "Classic & Board",
		emoji: "⬜",
		accent: "#84cc16",
		blurb: "Line-drawing territory game where closed boxes yield resources.",
		twist: "Spend resources on Double Lines or Wall Breaks to sabotage the AI.",
		howTo: [
			"Click between two dots to draw a line.",
			"Close a box to claim it and earn resources.",
			"Closing a box gives you another turn.",
			"Spend resources on Double Lines or Wall Breaks.",
			"Claim more boxes than the AI to win."
		]
	},
	{
		id: "reversi-nexus",
		num: 8,
		title: "Reversi: Nexus Dominion",
		category: "Classic & Board",
		emoji: "⚫",
		accent: "#a78bfa",
		blurb: "Othello with Void Rifts that destroy pieces flipped over them.",
		twist: "Static Void Rifts on the board annihilate any piece that lands on them.",
		howTo: [
			"Place a piece to flank and flip enemy discs.",
			"Flipped discs become your color.",
			"Void Rifts destroy any piece flipped onto them.",
			"Rifts alter control paths every game.",
			"Have the most discs when the board fills."
		]
	},
	{
		id: "minesweeper-toxic",
		num: 9,
		title: "Minesweeper: Toxic Undergrowth",
		category: "Classic & Board",
		emoji: "💣",
		accent: "#10b981",
		blurb: "Mine sweeping with spreading Miasma and active radar scans.",
		twist: "Toxic spores spread over time, hiding numbers. Click safe tiles for radar scans.",
		howTo: [
			"Click tiles to reveal them.",
			"Numbers show adjacent mines.",
			"Right-click to flag mines.",
			"Safe clicks give radar scans to reveal nearby mines.",
			"Miasma spreads over time, hiding numbers — clear fast!"
		]
	},
	{
		id: "battleship-fog",
		num: 10,
		title: "Battleship: Fog of War",
		category: "Classic & Board",
		emoji: "🚢",
		accent: "#3b82f6",
		blurb: "Naval combat with sonar pings, airstrike cooldowns, and hull repairs.",
		twist: "Repair Turns fix damaged hulls. Sonar pings reveal enemy sectors.",
		howTo: [
			"Click the enemy grid to fire at ships.",
			"Hit all cells of a ship to sink it.",
			"Sonar pings reveal if a sector has ships.",
			"Airstrikes hit a 3×3 area (cooldown).",
			"Repair Turns fix your damaged hull.",
			"Sink the enemy fleet before they sink yours."
		]
	},
	{
		id: "cyber-snake",
		num: 11,
		title: "Cyber-Snake: Hyperdrive",
		category: "Arcade & Action",
		emoji: "🐍",
		accent: "#22c55e",
		blurb: "Neon snake with physics inertia and shield/ghost power-ups.",
		twist: "Data packets spawn shields, ghost clones, and shrinking boundary portals.",
		howTo: [
			"Arrow keys or swipe to steer.",
			"Collect data packets to grow.",
			"Packets spawn power-ups: shields, ghost clones, shrink portals.",
			"Snake has inertia — plan your turns!",
			"Don't hit yourself or the walls (unless shielded)."
		]
	},
	{
		id: "pong-kinetic",
		num: 12,
		title: "Pong: Kinetic Chaos",
		category: "Arcade & Action",
		emoji: "🏓",
		accent: "#06b6d4",
		blurb: "Pong where the ball gains mass and velocity with every bounce.",
		twist: "Tilt paddles to curve shots; fire EMP blasts to freeze the opponent.",
		howTo: [
			"Move your paddle with mouse or arrow keys.",
			"Ball gains speed and mass every bounce.",
			"Tilt your paddle to curve the ball.",
			"Fire EMP to freeze the AI paddle (cooldown).",
			"First to 7 points wins."
		]
	},
	{
		id: "elemental-breakout",
		num: 13,
		title: "Elemental Breakout",
		category: "Arcade & Action",
		emoji: "🧱",
		accent: "#f97316",
		blurb: "Brick-breaker with reactive elemental bricks and physics.",
		twist: "Ice bricks freeze your paddle, fire bricks explode, iron needs multiple hits.",
		howTo: [
			"Move the paddle to bounce the ball.",
			"Ice bricks freeze your paddle briefly.",
			"Fire bricks explode, clearing nearby rows.",
			"Iron bricks need multiple hits.",
			"Clear all bricks to advance."
		]
	},
	{
		id: "flappy-steampunk",
		num: 14,
		title: "Flappy Steampunk Aviator",
		category: "Arcade & Action",
		emoji: "🐦",
		accent: "#eab308",
		blurb: "Side-scroller with steam pressure management and overheating engines.",
		twist: "Over-boosting overheats your engine, forcing a dangerous unpowered glide.",
		howTo: [
			"Tap/click to boost upward.",
			"Watch the steam pressure gauge!",
			"Over-boosting overheats the engine — no boost until it cools.",
			"When overheated, you must glide through gaps unpowered.",
			"Pass through as many gear gates as possible."
		]
	},
	{
		id: "asteroids-vector",
		num: 15,
		title: "Asteroids: Vector Drift",
		category: "Arcade & Action",
		emoji: "🚀",
		accent: "#8b5cf6",
		blurb: "Space shooter with vector physics and gravity anomalies.",
		twist: "Shattering asteroids release gravity wells that pull your ship in.",
		howTo: [
			"Rotate with ←/→, thrust with ↑, fire with Space.",
			"Asteroids split into smaller pieces when shot.",
			"Shattered rocks release gravity anomalies.",
			"Manage your shield and thruster fuel.",
			"Survive and score as many points as possible."
		]
	},
	{
		id: "space-invaders-evo",
		num: 16,
		title: "Space Invaders: Evolution",
		category: "Arcade & Action",
		emoji: "👾",
		accent: "#ef4444",
		blurb: "Aliens that mutate based on your playstyle.",
		twist: "Shoot too fast → they shield. Use heavy lasers → they split into fast scouts.",
		howTo: [
			"Move with ←/→, fire with Space.",
			"Aliens mutate based on how you play!",
			"Rapid fire → aliens deploy shields.",
			"Heavy lasers → aliens split into fast scouts.",
			"Adapt your strategy to survive each wave."
		]
	},
	{
		id: "neon-maze-ghost",
		num: 17,
		title: "Neon Maze: Ghost Hunt",
		category: "Arcade & Action",
		emoji: "👻",
		accent: "#ec4899",
		blurb: "Top-down dot collector with ghost AI personalities and light traps.",
		twist: "Ghosts have unique AI: aggressive trackers, flankers, and ambushers.",
		howTo: [
			"Arrow keys to move through the maze.",
			"Collect all dots to clear the level.",
			"Lay light traps to stun ghosts.",
			"Ghosts have different AI personalities.",
			"Avoid ghosts — traps stun them temporarily."
		]
	},
	{
		id: "chrono-runner",
		num: 18,
		title: "Chrono-Runner",
		category: "Arcade & Action",
		emoji: "🏃",
		accent: "#14b8a6",
		blurb: "Endless runner where time moves only when you move.",
		twist: "Obstacles move based on your speed — puzzle-like jump planning required.",
		howTo: [
			"Press Space or tap to jump.",
			"Time only moves when YOU move!",
			"Obstacles shift based on your running speed.",
			"Plan jumps carefully — standing still pauses everything.",
			"Survive as long as possible."
		]
	},
	{
		id: "whack-a-mage",
		num: 19,
		title: "Whack-a-Mage",
		category: "Arcade & Action",
		emoji: "🧙",
		accent: "#f59e0b",
		blurb: "Reaction game where mages cast spells before vanishing.",
		twist: "Fire mages clear adjacent targets; illusionists duplicate targets on screen.",
		howTo: [
			"Click mages before they vanish!",
			"Fire mages clear all adjacent targets when whacked.",
			"Illusionists duplicate nearby targets.",
			"Each mage type has a different spell effect.",
			"Hit as many as possible before time runs out."
		]
	},
	{
		id: "frogger-quantum",
		num: 20,
		title: "Frogger: Quantum Highway",
		category: "Arcade & Action",
		emoji: "🐸",
		accent: "#22c55e",
		blurb: "Crossing game with vehicles in alternating temporal loops.",
		twist: "Getting hit rewinds you 3 seconds — navigate past your own past self.",
		howTo: [
			"Arrow keys to hop across lanes.",
			"Vehicles move in temporal loops.",
			"Getting hit rewinds you 3 seconds!",
			"Avoid colliding with your own past timeline.",
			"Reach the far side to advance."
		]
	},
	{
		id: "lunar-lander",
		num: 21,
		title: "Lunar Lander: Gravity Orbit",
		category: "Arcade & Action",
		emoji: "🌙",
		accent: "#94a3b8",
		blurb: "Lunar descent with wind, fuel management, and modular damage.",
		twist: "Landing angle determines which modules take structural damage.",
		howTo: [
			"↑ thrust, ←/→ rotate.",
			"Watch fuel consumption — it's finite.",
			"Wind pushes your lander sideways.",
			"Landing angle determines which modules get damaged.",
			"Land softly on the green pad to win."
		]
	},
	{
		id: "orbital-dogfight",
		num: 22,
		title: "Orbital Dogfight",
		category: "Arcade & Action",
		emoji: "✈️",
		accent: "#dc2626",
		blurb: "Aerial combat with ammo, fuel, cooling, and heat-seeking missiles.",
		twist: "Manage cooling vents while dodging lightning strikes and missiles.",
		howTo: [
			"WASD to fly, Space to fire.",
			"Watch ammo, fuel, and cooling gauges.",
			"Open cooling vents (Shift) to reduce heat.",
			"Dodge heat-seeking missiles and lightning.",
			"Survive and shoot down enemy fighters."
		]
	},
	{
		id: "rhythm-vanguard",
		num: 23,
		title: "Rhythm Vanguard",
		category: "Arcade & Action",
		emoji: "🎵",
		accent: "#a855f7",
		blurb: "Lane defense where tapping to the beat charges your weapon grid.",
		twist: "Missing a beat short-circuits shields, making you vulnerable.",
		howTo: [
			"Tap the highlighted lanes to the beat.",
			"Hitting beats charges your weapon grid.",
			"Fire charged weapons to destroy enemies.",
			"Missing beats short-circuits your shields!",
			"Don't let enemies reach your base."
		]
	},
	{
		id: "midnight-zombie",
		num: 24,
		title: "Midnight Zombie Survival",
		category: "Arcade & Action",
		emoji: "🧟",
		accent: "#6b7280",
		blurb: "Top-down survival with dynamic flashlight and noise mechanics.",
		twist: "Flashlight battery drains; firing weapons attracts unseen hordes.",
		howTo: [
			"WASD to move, mouse to aim, click to shoot.",
			"Your flashlight illuminates the dark.",
			"Flashlight battery drains over time.",
			"Gunfire noise attracts zombies from the dark!",
			"Survive as long as possible."
		]
	},
	{
		id: "mini-golf-wizard",
		num: 25,
		title: "Mini-Golf: Wizard's Course",
		category: "Arcade & Action",
		emoji: "⛳",
		accent: "#16a34a",
		blurb: "Single-screen golf with gravity wells, portals, ice, and wind.",
		twist: "Add spin to curve the ball mid-flight around obstacles.",
		howTo: [
			"Drag from the ball to aim and set power.",
			"Release to putt.",
			"Gravity wells pull the ball — plan around them.",
			"Portals teleport the ball; ice makes it slide.",
			"Add spin to curve the ball mid-flight!",
			"Sink the ball in the hole in as few strokes as possible."
		]
	},
	{
		id: "fusion-2048",
		num: 26,
		title: "2048: Fusion Reactor",
		category: "Puzzles & Logic",
		emoji: "🔢",
		accent: "#f59e0b",
		blurb: "Sliding number puzzle with a heat-based reactor twist.",
		twist: "Stagnant boards overheat — the reactor explodes and destroys your highest tile.",
		howTo: [
			"Swipe or use arrow keys to slide tiles.",
			"Merge identical numbers to combine them.",
			"Reach 2048 to win!",
			"If the board stays stagnant, heat builds up.",
			"Reactor explosion destroys your highest-value tile!"
		]
	},
	{
		id: "sudoku-runes",
		num: 27,
		title: "Sudoku: Runes of Power",
		category: "Puzzles & Logic",
		emoji: "🔮",
		accent: "#a78bfa",
		blurb: "Mini-grid Sudoku where correct placements grant elemental spells.",
		twist: "Cast spells like Reveal Fate or Cleanse Error to solve the puzzle.",
		howTo: [
			"Fill the 4×4 grid so each row, column, and box has 1-4.",
			"Correct placements grant elemental charges.",
			"Spend charges on spells: Reveal Fate, Cleanse Error.",
			"Reveal Fate shows a correct cell.",
			"Cleanse Error fixes one wrong cell.",
			"Solve the grid to win."
		]
	},
	{
		id: "wordle-cipher",
		num: 28,
		title: "Wordle: Cipher Hack",
		category: "Puzzles & Logic",
		emoji: "📝",
		accent: "#22d3ee",
		blurb: "Word-guessing with an AI defense firewall that locks keys.",
		twist: "Wrong guesses trigger system hacks that lock keyboard keys for the next turn.",
		howTo: [
			"Guess the 5-letter word in 6 tries.",
			"Green = right letter, right spot.",
			"Yellow = right letter, wrong spot.",
			"Wrong guesses lock random keys for your next turn!",
			"Adapt your strategy around locked keys.",
			"Crack the cipher before running out of tries."
		]
	},
	{
		id: "hanoi-kinetic",
		num: 29,
		title: "Tower of Hanoi: Kinetic Weight",
		category: "Puzzles & Logic",
		emoji: "🗼",
		accent: "#f97316",
		blurb: "Disk-stacking with structural weight limits per column.",
		twist: "Overloading a column tips it, scattering disks across the board.",
		howTo: [
			"Move all disks to the rightmost peg.",
			"Only one disk at a time; larger never on smaller.",
			"Each column has a weight limit!",
			"Overloading a column tips it — disks scatter!",
			"Plan your moves to avoid catastrophic spills."
		]
	},
	{
		id: "sliding-paradox",
		num: 30,
		title: "Sliding Tile: Paradox Engine",
		category: "Puzzles & Logic",
		emoji: "🧩",
		accent: "#3ee0d0",
		blurb: "Sliding grid where tile moves shift background circuit lines.",
		twist: "Align both numerical order AND underlying circuit lines to unlock.",
		howTo: [
			"Click tiles adjacent to the gap to slide them.",
			"Arrange tiles in numerical order.",
			"Each slide also shifts background circuit lines.",
			"Circuit lines must align to unlock the puzzle.",
			"Solve both layers to win."
		]
	},
	{
		id: "lights-overcharge",
		num: 31,
		title: "Lights Out: Overcharge",
		category: "Puzzles & Logic",
		emoji: "💡",
		accent: "#fbbf24",
		blurb: "Grid-toggling puzzle with three-state color cycling.",
		twist: "Toggling a node cycles adjacent tiles through three color states, not just on/off.",
		howTo: [
			"Click a node to toggle it and its neighbors.",
			"Nodes cycle through three color states.",
			"Get all nodes to the target color.",
			"Each click affects a cross pattern.",
			"Clear the board to the target state."
		]
	},
	{
		id: "simon-frequency",
		num: 32,
		title: "Simon Says: Frequency Modulator",
		category: "Puzzles & Logic",
		emoji: "🎶",
		accent: "#8b5cf6",
		blurb: "Memory sequence game with warping audio frequencies.",
		twist: "Higher rounds warp frequencies — listen for tone patterns, not just colors.",
		howTo: [
			"Watch and listen to the sequence.",
			"Repeat it back by tapping the pads.",
			"Each round adds one more step.",
			"Higher rounds warp the frequencies!",
			"Rely on tone patterns, not just colors.",
			"How long can you last?"
		]
	},
	{
		id: "fifteen-gravity",
		num: 33,
		title: "Fifteen: Gravity Grid",
		category: "Puzzles & Logic",
		emoji: "🔢",
		accent: "#ec4899",
		blurb: "Classic 15-puzzle where the empty tile is a micro black hole.",
		twist: "Every few seconds the black hole pulls adjacent tiles toward it automatically.",
		howTo: [
			"Click tiles to slide them into the empty space.",
			"Arrange tiles 1-15 in order.",
			"The empty tile is a micro black hole!",
			"Every few seconds it pulls an adjacent tile in.",
			"Race against the gravity shifts to solve the puzzle."
		]
	},
	{
		id: "nonogram-blueprint",
		num: 34,
		title: "Nonogram: Blueprint Architect",
		category: "Puzzles & Logic",
		emoji: "📐",
		accent: "#3b82f6",
		blurb: "5×5 pixel logic grid where sections build robot components.",
		twist: "Uncover the image to build a defense unit before time runs out.",
		howTo: [
			"Numbers show consecutive filled cells per row/column.",
			"Click to fill, right-click to mark empty.",
			"Complete the grid to reveal the blueprint.",
			"Revealed sections build robot components.",
			"Finish the robot before time runs out!"
		]
	},
	{
		id: "steam-pipe",
		num: 35,
		title: "Steam-Pipe Connector",
		category: "Puzzles & Logic",
		emoji: "🔧",
		accent: "#06b6d4",
		blurb: "Tile-rotation puzzle with real-time water pressure.",
		twist: "Faulty connections leak, reducing your score — reroute fast!",
		howTo: [
			"Click pipes to rotate them.",
			"Connect the water source to the drain.",
			"Water pressure rises in real-time.",
			"Faulty connections trigger leaks!",
			"Leaks reduce your score — reroute quickly.",
			"Complete the circuit before pressure overloads."
		]
	},
	{
		id: "mastermind-alchemy",
		num: 36,
		title: "Mastermind: Alchemical Breach",
		category: "Puzzles & Logic",
		emoji: "⚗️",
		accent: "#84cc16",
		blurb: "Code-breaking with elemental reaction feedback pegs.",
		twist: "Fire + Water creates steam hints; element combos give conditional clues.",
		howTo: [
			"Guess the 4-element code.",
			"Each peg gives elemental feedback.",
			"Fire + Water = steam hints (partial matches).",
			"Earth + Air = dust clues (wrong position).",
			"Crack the alchemical code in 8 tries."
		]
	},
	{
		id: "color-flood-hex",
		num: 37,
		title: "Color Flood: Hex Dominion",
		category: "Puzzles & Logic",
		emoji: "🌈",
		accent: "#a855f7",
		blurb: "Hexagonal flood-fill with terrain tiles affecting expansion.",
		twist: "Mountains block expansion; rivers accelerate color flow.",
		howTo: [
			"Pick a color to flood-fill from the origin.",
			"The filled area adopts the chosen color.",
			"Mountains block color expansion.",
			"Rivers accelerate color flow downstream.",
			"Fill the entire hex grid in as few moves as possible."
		]
	},
	{
		id: "math-24-spell",
		num: 38,
		title: "Math 24: Spellweaver",
		category: "Puzzles & Logic",
		emoji: "➗",
		accent: "#f59e0b",
		blurb: "Combine numbers with arithmetic to reach 24.",
		twist: "Specific operations build magical combos to defeat incoming monsters.",
		howTo: [
			"Use +, −, ×, ÷ to combine four numbers into 24.",
			"Each correct solution defeats a monster.",
			"Using multiplication loops builds combo multipliers.",
			"Combos deal bonus damage to monsters.",
			"Defeat monsters before they reach you!"
		]
	},
	{
		id: "logic-cube-ink",
		num: 39,
		title: "Logic Cube: Ink Trails",
		category: "Puzzles & Logic",
		emoji: "🎲",
		accent: "#60a5fa",
		blurb: "Roll a 3D cube on a grid to paint paths with stamp patterns.",
		twist: "Cube sides have unique stamps — match the goal design precisely.",
		howTo: [
			"Arrow keys to roll the cube on the grid.",
			"Each face paints its stamp pattern on the floor.",
			"Cube faces have unique patterns.",
			"Match the goal design by planning your rolls.",
			"Paint the target pattern to win."
		]
	},
	{
		id: "echo-shadow",
		num: 40,
		title: "Echo Shadow",
		category: "Puzzles & Logic",
		emoji: "🌑",
		accent: "#6366f1",
		blurb: "Puzzle platformer where your shadow mimics moves in reverse.",
		twist: "Hit two separate switches simultaneously — you and your shadow.",
		howTo: [
			"Arrow keys to move and jump.",
			"Your shadow mimics your movements in REVERSE.",
			"Both you and your shadow must hit switches.",
			"Time your moves so both reach switches at once.",
			"Activate all switches to open the exit."
		]
	},
	{
		id: "cyber-factory",
		num: 41,
		title: "Cyber-Factory Idle",
		category: "Idle & Sim",
		emoji: "🏭",
		accent: "#f97316",
		blurb: "Click to generate scrap; balance cooling, power, and drone repair.",
		twist: "Drones degrade over time and need repairs — manage the grid economy.",
		howTo: [
			"Click the reactor to generate scrap.",
			"Buy machines, cooling, and power distribution.",
			"Hire automated drones to generate passive scrap.",
			"Drones degrade over time — repair them!",
			"Balance the grid to maximize output.",
			"Watch for overheating and power failures."
		]
	},
	{
		id: "micro-cosmos",
		num: 42,
		title: "Micro-Cosmos Builder",
		category: "Idle & Sim",
		emoji: "🪐",
		accent: "#06b6d4",
		blurb: "Planet simulation: balance oxygen, carbon, and temperature for life.",
		twist: "Prevent extinction events like solar flares while evolving life.",
		howTo: [
			"Adjust atmospheric sliders: oxygen, carbon, temperature.",
			"Watch life evolve from microbes to complex organisms.",
			"Balance creates ideal conditions for evolution.",
			"Watch for extinction events: solar flares, ice ages.",
			"Keep the ecosystem stable to reach sentient life!"
		]
	},
	{
		id: "deep-sea-fishing",
		num: 43,
		title: "Cozy Deep-Sea Fishing",
		category: "Idle & Sim",
		emoji: "🎣",
		accent: "#0ea5e9",
		blurb: "Fishing with ecosystem simulation and reel tension vs depth pressure.",
		twist: "Bait types attract different ocean layers; balance reel tension against pressure.",
		howTo: [
			"Select bait type to target different depths.",
			"Cast your line and wait for a bite.",
			"Reel in by holding — but watch the tension!",
			"Too much tension snaps the line.",
			"Depth pressure fights against your reel.",
			"Catch rare fish to fill your collection."
		]
	},
	{
		id: "biotech-nursery",
		num: 44,
		title: "Pocket Biotech Nursery",
		category: "Idle & Sim",
		emoji: "🧬",
		accent: "#22c55e",
		blurb: "Feed and mutate a digital pet by adjusting its genetic code.",
		twist: "Balance diet, sleep, and radiation to unlock evolution branches.",
		howTo: [
			"Feed your pet to keep it alive and growing.",
			"Adjust its genetic code: diet, sleep, radiation.",
			"Different balances unlock evolution branches.",
			"Too much radiation mutates it randomly.",
			"Cultivate rare species on the evolution tree!"
		]
	},
	{
		id: "espresso-tycoon",
		num: 45,
		title: "Espresso Tycoon: Rush Hour",
		category: "Idle & Sim",
		emoji: "☕",
		accent: "#d97706",
		blurb: "Serve complex drink orders while managing inventory and staff stress.",
		twist: "Manage drink temperatures and staff stress before patrons walk out.",
		howTo: [
			"Read each customer's drink order.",
			"Select the right ingredients and brew.",
			"Watch drink temperature — serve at the right temp!",
			"Staff stress rises with each order.",
			"Customers walk out if kept waiting too long.",
			"Earn coins to upgrade your café."
		]
	},
	{
		id: "traffic-grid",
		num: 46,
		title: "Metropolis Traffic Grid",
		category: "Idle & Sim",
		emoji: "🚦",
		accent: "#ef4444",
		blurb: "Toggle traffic lights across an active city hub.",
		twist: "Mishandling causes congestion, driver rage, and multi-car gridlocks.",
		howTo: [
			"Click intersections to toggle traffic lights.",
			"Green lets cars through; red stops them.",
			"Manage traffic flow to prevent jams.",
			"Congestion causes driver rage!",
			"Multi-car gridlocks crash the local economy.",
			"Keep traffic flowing smoothly."
		]
	},
	{
		id: "alchemist-lemonade",
		num: 47,
		title: "Alchemist's Lemonade Stand",
		category: "Idle & Sim",
		emoji: "🍋",
		accent: "#eab308",
		blurb: "Mix potions with fluctuating market demands and weather.",
		twist: "Weather, diseases, and rival pricing force daily recipe adjustments.",
		howTo: [
			"Mix lemonade with adjustable ingredients.",
			"Set your price each day.",
			"Weather affects demand — rain means fewer buyers.",
			"Diseases change what customers want.",
			"Rival merchants compete on price!",
			"Adapt your recipe daily to maximize profit."
		]
	},
	{
		id: "bonsai-cultivator",
		num: 48,
		title: "Bonsai Cultivator Idle",
		category: "Idle & Sim",
		emoji: "🌳",
		accent: "#16a34a",
		blurb: "Prune and water a digital bonsai with genetic growth modifiers.",
		twist: "Cultivate rare bioluminescent blooms for idle income.",
		howTo: [
			"Water your bonsai to keep it healthy.",
			"Prune branches to shape its growth.",
			"Apply genetic modifiers to guide growth paths.",
			"Cultivate rare bioluminescent blooms.",
			"Blooms generate idle income over time.",
			"Grow the most beautiful bonsai!"
		]
	},
	{
		id: "museum-curator",
		num: 49,
		title: "Grand Museum Curator",
		category: "Idle & Sim",
		emoji: "🏛️",
		accent: "#d97706",
		blurb: "Arrange artifacts for synergy bonuses while catching art thieves.",
		twist: "Hire guards to patrol dark halls and catch stealthy AI thieves.",
		howTo: [
			"Place artifacts on exhibit floors.",
			"Adjacent artifacts with synergy themes give bonuses.",
			"Hire guards to patrol the museum.",
			"AI thieves try to steal artifacts at night!",
			"More visitors = more income, but more theft risk.",
			"Maximize synergy and protect your collection."
		]
	},
	{
		id: "red-planet-lander",
		num: 50,
		title: "Red Planet Thruster Lander",
		category: "Idle & Sim",
		emoji: "🔴",
		accent: "#dc2626",
		blurb: "High-fidelity physics lander with drag, inertia, and throttle.",
		twist: "Manage horizontal velocity, rotational inertia, and atmospheric drag.",
		howTo: [
			"↑ throttle, ←/→ rotate the lander.",
			"Gravity pulls you down constantly.",
			"Atmospheric drag slows your fall.",
			"Horizontal velocity and rotational inertia matter!",
			"Land softly on the marked zone with low velocity.",
			"Manage fuel — it's all you've got."
		]
	}
];
function getGame(id) {
	return ARCADE_GAMES.find((g) => g.id === id);
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-B7Dqm3Hw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var styles_default = "/assets/styles-vdGS-vJZ.css";
var APP_NAME = "Helios Gift Pack";
var Route$4 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "A gift for a Minecraft Education space lover — tap the box for the Helios outpost, add-on pack, and shareable game code."
			},
			{
				name: "theme-color",
				content: "#071018"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;500;600&family=Syne:wght@600;700;800&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg font-sans text-fg antialiased",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$3 = () => import("./routes-2kErwXm6.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./arcade-B4UCxIHL.mjs");
var Route$2 = createFileRoute("/arcade")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./play-Bcyv1APJ.mjs");
var Route$1 = createFileRoute("/play")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./arcade._gameId-BDPBF86X.mjs");
var Route = createFileRoute("/arcade/$gameId")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	loader: ({ params }) => ({ game: getGame(params.gameId) })
});
var IndexRoute = Route$3.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$4
});
var ArcadeRoute = Route$2.update({
	id: "/arcade",
	path: "/arcade",
	getParentRoute: () => Route$4
});
var PlayRoute = Route$1.update({
	id: "/play",
	path: "/play",
	getParentRoute: () => Route$4
});
var ArcadeRouteChildren = { ArcadeGameIdRoute: Route.update({
	id: "/$gameId",
	path: "/$gameId",
	getParentRoute: () => ArcadeRoute
}) };
var rootRouteChildren = {
	IndexRoute,
	ArcadeRoute: ArcadeRoute._addFileChildren(ArcadeRouteChildren),
	PlayRoute
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { getGame as a, CATEGORIES as i, Route as n, ARCADE_GAMES as r, router_exports as t };
