import type { ReactNode } from "react";

/* Editorial page width container */
export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-6 ${className}`}>{children}</div>;
}

/* Kicker + serif title + standfirst. Serif lives in brand chrome only. */
export function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="mb-9 max-w-2xl">
      {kicker && (
        <p className="mb-2 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-accent-ink">{kicker}</p>
      )}
      <h1 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-[2.6rem]">
        {title}
      </h1>
      {children && <div className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{children}</div>}
    </header>
  );
}

/* Single form-control vocabulary, deduped across views */
export function Field({
  label,
  value,
  onChange,
  options,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-faint">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-md border border-rule-strong bg-paper px-2.5 py-2 text-sm text-ink transition-colors hover:border-ink-faint focus:border-accent disabled:cursor-not-allowed disabled:opacity-40"
      >
        {options.map(([v, t]) => (
          <option key={v} value={v}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}

/* Newspaper data strip: stats split by hairlines, never boxed cards */
export function StatStrip({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid grid-cols-2 border-y border-rule sm:grid-cols-4">
      {items.map((s, i) => (
        <div
          key={s.label}
          className={
            "px-4 py-3.5 " +
            (i % 2 === 1 ? "border-l border-rule " : "") +
            (i >= 2 ? "border-t border-rule sm:border-t-0 " : "") +
            (i % 4 !== 0 ? "sm:border-l sm:border-rule" : "")
          }
        >
          <dt className="text-[0.68rem] font-medium uppercase tracking-[0.1em] text-ink-faint">{s.label}</dt>
          <dd className="mt-1 text-xl font-semibold tabular-nums text-ink">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/* Result bar — share scaled to the leader for visual ranking, true % in the label */
export function ResultBar({
  label,
  pct,
  value,
  color,
  max,
  rank,
}: {
  label: string;
  pct: number;
  value: string;
  color: string;
  max: number;
  rank?: number;
}) {
  const width = max > 0 ? Math.max((pct / max) * 100, 0.5) : 0;
  return (
    <div className="grid grid-cols-[1fr_auto] items-baseline gap-x-3 gap-y-1 py-2">
      <div className="flex min-w-0 items-baseline gap-2">
        {rank != null && <span className="w-4 shrink-0 text-xs tabular-nums text-ink-faint">{rank}</span>}
        <span className="truncate text-sm text-ink">{label}</span>
      </div>
      <span className="text-sm tabular-nums text-ink-soft">
        <span className="font-semibold text-ink">{pct.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%</span>
        <span className="ml-2 text-ink-faint">{value}</span>
      </span>
      <div className="col-span-2 h-2 w-full overflow-hidden rounded-[2px] bg-paper-2">
        <div className="bar-fill h-full rounded-[2px]" style={{ width: `${width}%`, background: color }} />
      </div>
    </div>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        "rounded-md bg-accent px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-accent-ink disabled:opacity-50 " +
        className
      }
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        "rounded-md border border-rule-strong px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-ink-faint hover:text-ink disabled:opacity-50 " +
        className
      }
    >
      {children}
    </button>
  );
}

export function Notice({ kind = "error", children }: { kind?: "error" | "muted"; children: ReactNode }) {
  if (kind === "muted") return <p className="text-sm text-ink-faint">{children}</p>;
  return (
    <p className="rounded-md border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">{children}</p>
  );
}
