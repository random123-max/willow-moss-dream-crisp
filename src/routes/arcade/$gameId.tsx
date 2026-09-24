import { createFileRoute, useParams } from "@tanstack/react-router";
import { Suspense } from "react";
import { GAME_COMPONENTS, GAMES } from "@/arcade/registry";

export const Route = createFileRoute("/arcade/$gameId")({ component: GamePlayer });

function GamePlayer() {
  const { gameId } = useParams({ from: "/arcade/$gameId" });
  const meta = GAMES.find((g) => g.id === gameId);
  const Component = GAME_COMPONENTS[gameId];

  if (!meta || !Component) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg text-muted">
        Game not found.
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-bg text-muted">
          Loading {meta.title}…
        </div>
      }
    >
      <Component />
    </Suspense>
  );
}
