import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Search, Lock } from "lucide-react";
import { ARCADE_GAMES, CATEGORIES, type GameCategory } from "@/lib/arcade-games";

export const Route = createFileRoute("/arcade/")({ component: ArcadeVault });

function ArcadeVault() {
  const [cat, setCat] = useState<GameCategory | "All">("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return ARCADE_GAMES.filter((g) => {
      if (cat !== "All" && g.category !== cat) return false;
      if (query && !g.title.toLowerCase().includes(query.toLowerCase()) && !g.blurb.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [cat, query]);

  return (
    <div className="min-h-dvh bg-bg">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(62,224,208,0.06),transparent_70%)]" />
        <div className="absolute right-1/4 top-1/3 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(255,106,61,0.05),transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-20">
        {/* Back */}
        <Link
          to="/"
          onClick={() => sessionStorage.setItem("helios-gift-open", "1")}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm text-fg transition-colors hover:border-primary/40"
        >
          <ArrowLeft className="size-4 text-primary" />
          Gift pack
        </Link>

        {/* Header */}
        <header className="mt-6 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-ember">50 Games</p>
          <h1 className="mt-2 font-display text-4xl text-fg md:text-6xl">
            The Arcade <span className="text-primary">Vault</span>
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted md:text-base">
            Fifty hand-crafted games with unique twists. Board games, arcade action, brain-melting
            puzzles, and deep sims — each with a guided tour so you never get lost.
          </p>
        </header>

        {/* Search + filters */}
        <div className="mt-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search games..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-full border border-line bg-surface pl-10 pr-4 text-sm text-fg placeholder:text-muted focus:border-primary/40 focus:outline-none md:w-72"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(["All", ...CATEGORIES] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                  cat === c
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-line bg-surface text-muted hover:text-fg"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Category sections */}
        {cat === "All" ? (
          CATEGORIES.map((category) => {
            const games = filtered.filter((g) => g.category === category);
            if (games.length === 0) return null;
            return (
              <section key={category} className="mt-8">
                <h2 className="font-display text-lg text-fg">
                  {categoryIcons[category]} {category}
                </h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {games.map((g) => (
                    <GameCard key={g.id} game={g} />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {filtered.map((g) => (
              <GameCard key={g.id} game={g} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted">No games match your search.</p>
        )}
      </div>
    </div>
  );
}

const categoryIcons: Record<GameCategory, string> = {
  "Classic & Board": "♟️",
  "Arcade & Action": "🕹️",
  "Puzzles & Logic": "🧩",
  "Idle & Sim": "📊",
};

function GameCard({ game }: { game: (typeof ARCADE_GAMES)[number] }) {
  return (
    <Link
      to="/arcade/$gameId"
      params={{ gameId: game.id }}
      className="group relative overflow-hidden rounded-xl border border-line bg-surface p-4 transition-all hover:border-primary/40 hover:bg-elevated"
      style={{ ["--g" as string]: game.accent }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `radial-gradient(circle, ${game.accent}18, transparent 70%)` }}
      />
      <div className="relative flex items-start justify-between">
        <span
          className="flex size-10 items-center justify-center rounded-lg text-xl transition-transform duration-300 group-hover:scale-110"
          style={{ background: `${game.accent}1a`, border: `1px solid ${game.accent}33` }}
        >
          {game.emoji}
        </span>
        <span className="font-mono text-[10px] tabular-nums text-muted">#{game.num}</span>
      </div>
      <h3 className="relative mt-3 font-display text-sm leading-tight text-fg">{game.title}</h3>
      <p className="relative mt-1 text-xs leading-relaxed text-muted">{game.blurb}</p>
      <p className="relative mt-2 text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: game.accent }}>
        {game.category}
      </p>
    </Link>
  );
}
