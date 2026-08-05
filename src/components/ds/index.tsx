import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ------------------------------ Buttons ------------------------------ */

type Variant = "primary" | "secondary" | "tertiary" | "destructive";
type Size = "sm" | "md" | "lg";

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-small",
  md: "h-10 px-4 text-body-strong",
  lg: "h-12 px-5 text-body-strong",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-on-primary shadow-xs hover:bg-brand-hover active:brightness-95",
  secondary:
    "bg-surface text-foreground border border-hairline-strong hover:bg-surface-hover",
  tertiary: "text-secondary-foreground hover:bg-surface-hover",
  destructive:
    "bg-transparent border border-destructive-border text-destructive hover:bg-destructive-hover",
};

export function Btn({
  variant = "secondary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  asChild,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  asChild?: boolean;
}) {
  const Comp: React.ElementType = asChild ? Slot : "button";
  return (
    <Comp
      // Busy keeps its colour; only genuinely disabled goes neutral.
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md whitespace-nowrap transition-colors duration-150",
        sizes[size],
        variants[variant],
        disabled &&
          !loading &&
          "bg-surface-sunken text-disabled-foreground border-hairline shadow-none hover:bg-surface-sunken cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </Comp>
  );
}

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-4 shrink-0 animate-spin rounded-pill border-2 border-current border-t-transparent opacity-80",
        className,
      )}
    />
  );
}

export function IconBtn({
  label,
  children,
  className,
  variant = "tertiary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  variant?: Variant;
}) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={label}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-pill transition-colors duration-150",
              variant === "secondary"
                ? "border border-hairline-strong bg-surface hover:bg-surface-hover"
                : "text-secondary-foreground hover:bg-surface-hover",
              className,
            )}
            {...props}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent
          sideOffset={6}
          className="rounded-md border border-hairline bg-surface px-2.5 py-1.5 text-small text-foreground shadow-md"
        >
          {label}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ------------------------------ Badges ------------------------------ */

export type StatusKind =
  | "pending"
  | "directive"
  | "overdue"
  | "completed"
  | "rejected"
  | "neutral";

const statusStyles: Record<StatusKind, string> = {
  pending:
    "bg-[var(--badge-pending-bg)] text-[var(--badge-pending-fg)] border-[var(--badge-pending-bd)]",
  directive:
    "bg-[var(--badge-directive-bg)] text-[var(--badge-directive-fg)] border-[var(--badge-directive-bd)]",
  overdue:
    "bg-[var(--badge-overdue-bg)] text-[var(--badge-overdue-fg)] border-[var(--badge-overdue-bd)]",
  completed:
    "bg-[var(--badge-completed-bg)] text-[var(--badge-completed-fg)] border-[var(--badge-completed-bd)]",
  rejected:
    "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-fg)] border-[var(--badge-neutral-bd)]",
  neutral:
    "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-fg)] border-[var(--badge-neutral-bd)]",
};

export function StatusBadge({
  kind = "neutral",
  children,
  icon,
  className,
}: {
  kind?: StatusKind;
  children: React.ReactNode;
  icon?: React.ReactNode | undefined;
  className?: string | undefined;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-0.5 text-label",
        statusStyles[kind],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const map = {
    high: "bg-caution-50 text-caution-800 border-caution-200",
    medium: "bg-neutral-100 text-foreground border-hairline",
    low: "bg-background text-secondary-foreground border-hairline",
  } as const;
  const labels = { high: "High", medium: "Medium", low: "Low" } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill border px-2.5 py-0.5 text-label",
        map[priority],
      )}
    >
      {labels[priority]} Priority
    </span>
  );
}

export function CountBadge({
  count,
  tone = "neutral",
}: {
  count: number;
  tone?: "neutral" | "danger" | "brand" | undefined;
}) {
  const map = {
    neutral: "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-fg)]",
    danger: "bg-[var(--badge-overdue-bg)] text-[var(--badge-overdue-fg)]",
    brand: "bg-brand-tint text-brand-on-tint",
  } as const;
  return (
    <span className={cn("min-w-6 rounded-pill px-2 py-0.5 text-center text-label", map[tone])}>
      {count}
    </span>
  );
}

/* ------------------------------ Surfaces ------------------------------ */

export type Urgency = "overdue" | "today" | "week" | "later";

const edgeColor: Record<Urgency, string> = {
  overdue: "var(--edge-overdue)",
  today: "var(--edge-today)",
  week: "var(--edge-week)",
  later: "var(--edge-later)",
};

export function Card({
  urgency,
  compact,
  className,
  children,
  interactive,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  urgency?: Urgency | undefined;
  compact?: boolean | undefined;
  interactive?: boolean | undefined;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border border-hairline bg-surface",
        compact ? "p-4" : "p-5",
        interactive && "transition-shadow duration-150 hover:shadow-sm",
        className,
      )}
      {...props}
    >
      {urgency ? (
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-[3px]"
          style={{ backgroundColor: edgeColor[urgency] }}
        />
      ) : null}
      {children}
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-label text-tertiary-foreground">{eyebrow}</p> : null}
        <h1 className="text-h1 text-foreground">{title}</h1>
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </header>
  );
}

export function SectionHeading({
  title,
  sub,
  count,
  countTone,
  children,
}: {
  title: string;
  sub?: string | undefined;
  count?: number | undefined;
  countTone?: "neutral" | "danger" | "brand" | undefined;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-h2 text-foreground">{title}</h2>
          {typeof count === "number" ? <CountBadge count={count} tone={countTone} /> : null}
        </div>
        {sub ? <p className="mt-1 text-lead text-secondary-foreground">{sub}</p> : null}
      </div>
      {children ? <div className="flex items-center gap-2">{children}</div> : null}
    </div>
  );
}

export function EmptyState({
  title,
  helper,
  action,
}: {
  title: string;
  helper: string;
  action?: React.ReactNode | undefined;
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface px-6 py-12 text-center">
      <p className="text-body-strong text-foreground">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-small text-secondary-foreground">{helper}</p>
      {action ? <div className="mt-4 flex justify-center">{action}</div> : null}
    </div>
  );
}

export function Skel({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-md", className)} aria-hidden="true" />;
}

/* ------------------------------ Forms ------------------------------ */

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string | undefined;
  error?: string | undefined;
  children: React.ReactNode;
  htmlFor?: string | undefined;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-label text-tertiary-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-small text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-small text-tertiary-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

export const inputClass =
  "h-10 w-full rounded-md border border-hairline bg-surface px-3 text-body text-foreground placeholder:text-tertiary-foreground focus-visible:border-brand";

export function TextInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClass, className)} {...props} />;
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-hairline bg-surface p-3 text-body text-foreground placeholder:text-tertiary-foreground focus-visible:border-brand",
        className,
      )}
      {...props}
    />
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div
      role="tablist"
      aria-label={label}
      className="inline-flex flex-wrap gap-1 rounded-md border border-hairline bg-surface p-1"
    >
      {options.map((opt) => (
        <button
          key={opt}
          role="tab"
          type="button"
          aria-selected={value === opt}
          onClick={() => onChange(opt)}
          className={cn(
            "h-8 rounded-sm px-3 text-small font-semibold transition-colors duration-150",
            value === opt
              ? "bg-brand-tint text-brand-on-tint"
              : "text-secondary-foreground hover:bg-surface-hover",
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function FilterPill({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-pill border px-3 text-label transition-colors duration-150",
        active
          ? "border-brand-tint-border bg-brand-tint text-brand-on-tint"
          : "border-hairline bg-surface text-secondary-foreground hover:bg-surface-hover",
      )}
    >
      {label}
      <span className="tabular opacity-70">{count}</span>
    </button>
  );
}

export function Rule() {
  return <hr className="border-t border-hairline" />;
}

export function Quarters({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1" aria-hidden="true">
        {[25, 50, 75, 100].map((q) => (
          <span
            key={q}
            className={cn(
              "h-1.5 w-8 rounded-pill",
              value >= q ? "bg-brand" : "bg-surface-sunken",
            )}
          />
        ))}
      </div>
      <span className="text-label tabular text-tertiary-foreground">{value}% Done</span>
    </div>
  );
}
