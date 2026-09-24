import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Check, Copy, Download, Gamepad2, Package } from "lucide-react";
import { EDU_MODULES, FEATURED, GIFT_CODE } from "@/lib/catalog";
import { GAMES } from "@/arcade/registry";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{label}</p>
      <div className="flex items-center gap-2">
        <code className="min-w-0 flex-1 truncate rounded-md border border-line bg-bg px-3 py-2 font-mono text-sm text-primary">
          {value}
        </code>
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-line bg-surface text-fg"
          aria-label={`Copy ${label}`}
        >
          {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export function PackPanel({ playHref }: { playHref: string }) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const gameLink = origin ? `${origin}${playHref}` : playHref;

  return (
    <div className="pack-panel mx-auto w-full max-w-5xl px-4 pb-16">
      <header className="rounded-xl border border-line bg-elevated p-5 md:p-7">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ember">Opened</p>
        <h1 className="mt-2 font-display text-3xl text-fg md:text-5xl">Helios Gift Pack</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
          A space rewrite of their Minecraft nights. Play the outpost here, install the Education
          add-on on their world, and keep this panel for the rest of the arcade.
        </p>
        <div className="mt-5 flex flex-col gap-4 md:flex-row">
          <CopyField label="Gift code" value={GIFT_CODE} />
          <CopyField label="Game link" value={gameLink} />
        </div>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <article className="rounded-xl border border-line bg-surface p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Featured</p>
          <h2 className="mt-2 font-display text-2xl text-fg">{FEATURED.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{FEATURED.blurb}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/play"
              className="inline-flex h-12 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-bg"
            >
              <Gamepad2 className="size-4" />
              Play the outpost
            </Link>
            <a
              href="/downloads/HeliosCrew.mcaddon"
              download
              className="inline-flex h-12 items-center gap-2 rounded-md border border-primary/40 px-5 text-sm font-semibold text-primary"
            >
              <Download className="size-4" />
              Education pack
            </a>
          </div>
        </article>
        <article className="rounded-xl border border-line bg-surface p-5 md:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Install</p>
          <ol className="mt-3 space-y-2 text-sm leading-relaxed text-dust">
            <li>1. Download HeliosCrew.mcaddon</li>
            <li>2. Open it with Minecraft Education</li>
            <li>3. Activate Visuals + Systems on the world</li>
            <li>4. Optional cheats: /function kit</li>
          </ol>
          <a
            href="/downloads/HeliosCrew.zip"
            download
            className="mt-4 inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline"
          >
            <Package className="size-4" />
            Need a zip instead
          </a>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl text-fg">Education modules</h2>
        <p className="mt-1 text-sm text-muted">
          Real blocks, recipes, loot, and a wearable visor — not empty texture stubs.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {EDU_MODULES.map((m) => (
            <article key={m.id} className="rounded-lg border border-line bg-surface p-4">
              <h3 className="font-display text-base text-fg">{m.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{m.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-fg">Arcade vault</h2>
            <p className="mt-1 text-sm text-muted">
              50 small games are live. Browse the full vault or jump in below.
            </p>
          </div>
          <Link
            to="/arcade"
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-bg"
          >
            <Gamepad2 className="size-4" />
            Enter vault
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {GAMES.slice(0, 8).map((g) => (
            <Link
              key={g.id}
              to="/arcade/$gameId"
              params={{ gameId: g.id }}
              className="group rounded-lg border border-primary/40 bg-elevated p-4 transition-colors hover:bg-surface"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl">{g.icon}</span>
                <span className="font-mono text-xs text-muted">{g.num}</span>
              </div>
              <h3 className="mt-2 font-display text-base leading-tight text-fg group-hover:text-primary">
                {g.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">{g.tagline}</p>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          50 games across four halls — enter the vault to browse them all.
        </p>
      </section>
    </div>
  );
}
