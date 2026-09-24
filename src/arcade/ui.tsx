import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

export function GameShell({
  title,
  children,
  sidebar,
}: {
  title: string;
  children: ReactNode;
  sidebar?: ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-bg">
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-surface/90 px-4 py-3 backdrop-blur">
        <Link
          to="/arcade"
          className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Vault
        </Link>
        <h1 className="font-display text-base text-fg md:text-lg">{title}</h1>
      </div>
      <div className="flex flex-col md:flex-row">
        <div className="min-h-[60dvh] flex-1 p-4">{children}</div>
        {sidebar && (
          <div className="space-y-3 border-t border-line p-4 md:w-64 md:border-l md:border-t-0">
            {sidebar}
          </div>
        )}
      </div>
    </div>
  );
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2">
      <p className="text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-0.5 font-mono text-lg tabular-nums text-fg">{value}</p>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors disabled:opacity-40 ";
  const styles: Record<string, string> = {
    primary: "bg-primary text-bg hover:brightness-110",
    ghost: "border border-line bg-surface text-fg hover:bg-elevated",
    danger: "bg-ember text-bg hover:brightness-110",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={base + styles[variant] + " " + className}
    >
      {children}
    </button>
  );
}

export function Msg({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-muted">
      {children}
    </p>
  );
}

export function Canvas({ ref, className }: { ref: React.RefObject<HTMLCanvasElement | null>; className?: string }) {
  return <canvas ref={ref} className={"block rounded-lg border border-line bg-bg " + (className ?? "")} />;
}
