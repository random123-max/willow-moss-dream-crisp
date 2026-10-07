import { Suspense, lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { getGame } from "@/lib/arcade-games";

export const Route = createFileRoute("/arcade/$gameId")({
  component: GamePage,
  loader: ({ params }) => ({ game: getGame(params.gameId) }),
});

const gameComponents: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  "neon-tic-tac-toe": lazy(() => import("@/components/arcade/games/neon-tic-tac-toe")),
  "rps-quantum": lazy(() => import("@/components/arcade/games/rps-quantum")),
  "gravity-connect4": lazy(() => import("@/components/arcade/games/gravity-connect4")),
  "rogue-checkers": lazy(() => import("@/components/arcade/games/rogue-checkers")),
  "chrono-memory": lazy(() => import("@/components/arcade/games/chrono-memory")),
  "cyber-hangman": lazy(() => import("@/components/arcade/games/cyber-hangman")),
  "dots-boxes": lazy(() => import("@/components/arcade/games/dots-boxes")),
  "reversi-nexus": lazy(() => import("@/components/arcade/games/reversi-nexus")),
  "minesweeper-toxic": lazy(() => import("@/components/arcade/games/minesweeper-toxic")),
  "battleship-fog": lazy(() => import("@/components/arcade/games/battleship-fog")),
  "cyber-snake": lazy(() => import("@/components/arcade/games/cyber-snake")),
  "pong-kinetic": lazy(() => import("@/components/arcade/games/pong-kinetic")),
  "elemental-breakout": lazy(() => import("@/components/arcade/games/elemental-breakout")),
  "flappy-steampunk": lazy(() => import("@/components/arcade/games/flappy-steampunk")),
  "asteroids-vector": lazy(() => import("@/components/arcade/games/asteroids-vector")),
  "space-invaders-evo": lazy(() => import("@/components/arcade/games/space-invaders-evo")),
  "neon-maze-ghost": lazy(() => import("@/components/arcade/games/neon-maze-ghost")),
  "chrono-runner": lazy(() => import("@/components/arcade/games/chrono-runner")),
  "whack-a-mage": lazy(() => import("@/components/arcade/games/whack-a-mage")),
  "frogger-quantum": lazy(() => import("@/components/arcade/games/frogger-quantum")),
  "lunar-lander": lazy(() => import("@/components/arcade/games/lunar-lander")),
  "orbital-dogfight": lazy(() => import("@/components/arcade/games/orbital-dogfight")),
  "rhythm-vanguard": lazy(() => import("@/components/arcade/games/rhythm-vanguard")),
  "midnight-zombie": lazy(() => import("@/components/arcade/games/midnight-zombie")),
  "mini-golf-wizard": lazy(() => import("@/components/arcade/games/mini-golf-wizard")),
  "fusion-2048": lazy(() => import("@/components/arcade/games/fusion-2048")),
  "sudoku-runes": lazy(() => import("@/components/arcade/games/sudoku-runes")),
  "wordle-cipher": lazy(() => import("@/components/arcade/games/wordle-cipher")),
  "hanoi-kinetic": lazy(() => import("@/components/arcade/games/hanoi-kinetic")),
  "sliding-paradox": lazy(() => import("@/components/arcade/games/sliding-paradox")),
  "lights-overcharge": lazy(() => import("@/components/arcade/games/lights-overcharge")),
  "simon-frequency": lazy(() => import("@/components/arcade/games/simon-frequency")),
  "fifteen-gravity": lazy(() => import("@/components/arcade/games/fifteen-gravity")),
  "nonogram-blueprint": lazy(() => import("@/components/arcade/games/nonogram-blueprint")),
  "steam-pipe": lazy(() => import("@/components/arcade/games/steam-pipe")),
  "mastermind-alchemy": lazy(() => import("@/components/arcade/games/mastermind-alchemy")),
  "color-flood-hex": lazy(() => import("@/components/arcade/games/color-flood-hex")),
  "math-24-spell": lazy(() => import("@/components/arcade/games/math-24-spell")),
  "logic-cube-ink": lazy(() => import("@/components/arcade/games/logic-cube-ink")),
  "echo-shadow": lazy(() => import("@/components/arcade/games/echo-shadow")),
  "cyber-factory": lazy(() => import("@/components/arcade/games/cyber-factory")),
  "micro-cosmos": lazy(() => import("@/components/arcade/games/micro-cosmos")),
  "deep-sea-fishing": lazy(() => import("@/components/arcade/games/deep-sea-fishing")),
  "biotech-nursery": lazy(() => import("@/components/arcade/games/biotech-nursery")),
  "espresso-tycoon": lazy(() => import("@/components/arcade/games/espresso-tycoon")),
  "traffic-grid": lazy(() => import("@/components/arcade/games/traffic-grid")),
  "alchemist-lemonade": lazy(() => import("@/components/arcade/games/alchemist-lemonade")),
  "bonsai-cultivator": lazy(() => import("@/components/arcade/games/bonsai-cultivator")),
  "museum-curator": lazy(() => import("@/components/arcade/games/museum-curator")),
  "red-planet-lander": lazy(() => import("@/components/arcade/games/red-planet-lander")),
};

function GamePage() {
  const { game } = Route.useLoaderData();
  if (!game) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 text-center">
        <p className="font-display text-xl text-fg">Game not found</p>
        <a href="/arcade" className="text-sm text-primary">← Back to the vault</a>
      </div>
    );
  }
  const GameComponent = gameComponents[game.id];
  if (!GameComponent) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 text-center">
        <p className="font-display text-xl text-fg">This game is coming soon!</p>
        <a href="/arcade" className="text-sm text-primary">← Back to the vault</a>
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center">
          <div className="text-sm text-muted animate-pulse">Loading {game.title}…</div>
        </div>
      }
    >
      <GameComponent />
    </Suspense>
  );
}
