import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, RotateCcw, HelpCircle, X, Sparkles } from "lucide-react";

export function GameShell({
  title,
  emoji,
  accent,
  howTo,
  twist,
  onReset,
  children,
  best,
  score,
  extra,
}: {
  title: string;
  emoji: string;
  accent: string;
  howTo: string[];
  twist: string;
  onReset?: () => void;
  children: ReactNode;
  best?: string;
  score?: string;
  extra?: ReactNode;
}) {
  const [tour, setTour] = useState(true);
  const [step, setStep] = useState(0);

  const isLast = step >= howTo.length;

  return (
    <div className="relative flex min-h-dvh flex-col bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center gap-2 border-b border-line bg-surface/95 px-3 py-2.5 backdrop-blur md:px-4">
        <Link
          to="/arcade"
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-bg px-3 text-xs font-medium text-fg transition-colors hover:border-primary/40"
        >
          <ArrowLeft className="size-3.5" style={{ color: accent }} />
          Vault
        </Link>
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <span className="text-lg leading-none">{emoji}</span>
          <h1 className="truncate font-display text-sm text-fg md:text-base" style={{ color: accent }}>
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-1.5">
          {score && (
            <span className="hidden rounded-full border border-line bg-bg px-3 py-1 font-mono text-xs tabular-nums text-fg sm:inline-block">
              {score}
            </span>
          )}
          {best && (
            <span className="hidden rounded-full border border-line bg-bg px-3 py-1 font-mono text-xs tabular-nums text-muted md:inline-block">
              Best {best}
            </span>
          )}
          {extra}
          <button
            type="button"
            onClick={() => {
              setStep(0);
              setTour(true);
            }}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-bg px-3 text-xs font-medium text-fg transition-colors hover:border-primary/40"
          >
            <HelpCircle className="size-3.5" style={{ color: accent }} />
            <span className="hidden sm:inline">How to Play</span>
          </button>
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line bg-bg px-3 text-xs font-medium text-fg transition-colors hover:border-primary/40"
            >
              <RotateCcw className="size-3.5" style={{ color: accent }} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </header>

      {/* Game area */}
      <div className="relative flex-1">{children}</div>

      {/* Tour overlay */}
      {tour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/85 p-4 backdrop-blur-sm">
          <div
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-line bg-elevated shadow-2xl"
            style={{ boxShadow: `0 0 60px ${accent}22, 0 20px 60px rgba(0,0,0,.5)` }}
          >
            <div className="h-1.5 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}55)` }} />
            <button
              type="button"
              onClick={() => setTour(false)}
              className="absolute right-3 top-4 z-10 inline-flex size-8 items-center justify-center rounded-full bg-surface/80 text-muted hover:text-fg"
            >
              <X className="size-4" />
            </button>
            <div className="p-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex size-12 items-center justify-center rounded-xl text-2xl"
                  style={{ background: `${accent}1a`, border: `1px solid ${accent}33` }}
                >
                  {emoji}
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.16em]" style={{ color: accent }}>
                    {isLast ? "Ready?" : `Step ${step + 1} / ${howTo.length}`}
                  </p>
                  <h2 className="font-display text-lg text-fg">{title}</h2>
                </div>
              </div>

              {!isLast ? (
                <>
                  <p className="mt-4 text-sm leading-relaxed text-dust">{howTo[step]}</p>
                  <div className="mt-3 flex gap-1">
                    {howTo.map((_, i) => (
                      <span
                        key={i}
                        className="h-1 flex-1 rounded-full"
                        style={{ background: i <= step ? accent : "var(--color-line)" }}
                      />
                    ))}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="text-xs text-muted hover:text-fg"
                    >
                      Restart tour
                    </button>
                    <div className="flex gap-2">
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={() => setStep((s) => s - 1)}
                          className="rounded-lg border border-line bg-surface px-4 py-2 text-sm text-fg hover:border-primary/40"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setStep((s) => s + 1)}
                        className="rounded-lg px-4 py-2 text-sm font-semibold text-bg"
                        style={{ background: accent }}
                      >
                        {step === howTo.length - 1 ? "Got it!" : "Next"}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="mt-4 rounded-xl border p-4"
                    style={{ borderColor: `${accent}44`, background: `${accent}0d` }}
                  >
                    <div className="flex items-start gap-2">
                      <Sparkles className="size-4 shrink-0" style={{ color: accent }} />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-[0.14em]" style={{ color: accent }}>
                          The Twist
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-dust">{twist}</p>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTour(false)}
                    className="mt-5 w-full rounded-lg py-3 text-sm font-bold text-bg"
                    style={{ background: accent }}
                  >
                    Start Playing
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
