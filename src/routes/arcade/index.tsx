import { createFileRoute, Link } from "@tanstack/react-router";
import { GAMES } from "@/arcade/registry";
import { CATEGORIES } from "@/arcade/types";

export const Route = createFileRoute("/arcade/")({ component: ArcadeVault });

function ArcadeVault() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8">
        <h1 className="font-display text-3xl text-fg md:text-5xl">Arcade Vault</h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          50 small games across four halls. Tap any title to play.
        </p>
      </header>

      {CATEGORIES.map((cat) => {
        const games = GAMES.filter((g) => g.category === cat.key);
        return (
          <section key={cat.key} className="mb-10">
            <h2 className="font-display text-xl text-fg">
              <span className="mr-2">{cat.icon}</span>
              {cat.label}
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {games.map((g) => (
                <Link
                  key={g.id}
                  to="/arcade/$gameId"
                  params={{ gameId: g.id }}
                  className="group rounded-lg border border-line bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-elevated"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-2xl">{g.icon}</span>
                    <span className="font-mono text-xs text-muted">{g.num}</span>
                  </div>
                  <h3 className="mt-2 font-display text-sm leading-tight text-fg group-hover:text-primary">
                    {g.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{g.tagline}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
