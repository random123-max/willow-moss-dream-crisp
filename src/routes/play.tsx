import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { GameCanvas } from "@/components/game-canvas";

export const Route = createFileRoute("/play")({ component: Play });

function Play() {
  return (
    <div className="relative bg-bg">
      <Link
        to="/"
        onClick={() => sessionStorage.setItem("helios-gift-open", "1")}
        className="absolute left-4 top-4 z-10 inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface/90 px-4 text-sm text-fg"
      >
        <ArrowLeft className="size-4 text-primary" />
        Gift pack
      </Link>
      <GameCanvas />
    </div>
  );
}
