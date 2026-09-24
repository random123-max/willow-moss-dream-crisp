import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/arcade")({ component: ArcadeLayout });

function ArcadeLayout() {
  return <Outlet />;
}
