import { Slot } from "@radix-ui/react-slot";
import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown } from "lucide-react";
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
      // Slot forwards to an anchor/Link, which has no disabled attribute.
      {...(asChild ? {} : { disabled: disabled || loading })}
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
      {/* Slot needs exactly one child, so only the plain button gets a spinner slot. */}
      {asChild ? (
        children
      ) : (
        <>
          {loading ? <Spinner /> : null}
          {children}
        </>
      )}
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

/*
 * Status colour is deliberately minimal: four roles only.
 *   attention → something is waiting on a person (caution)
 *   late      → past due (danger)
 *   done      → closed successfully (success)
 *   neutral   → everything else, including informational labels
 * Older names are kept as aliases so callers stay readable.
 */
export type StatusKind =
  | "attention"
  | "late"
  | "done"
  | "neutral"
  | "pending"
  | "directive"
  | "overdue"
  | "completed"
  | "rejected";

const statusStyles: Record<StatusKind, string> = {
  attention: "bg-[var(--badge-pending-bg)] text-[var(--badge-pending-fg)]",
  pending: "bg-[var(--badge-pending-bg)] text-[var(--badge-pending-fg)]",
  late: "bg-[var(--badge-overdue-bg)] text-[var(--badge-overdue-fg)]",
  overdue: "bg-[var(--badge-overdue-bg)] text-[var(--badge-overdue-fg)]",
  done: "bg-[var(--badge-completed-bg)] text-[var(--badge-completed-fg)]",
  completed: "bg-[var(--badge-completed-bg)] text-[var(--badge-completed-fg)]",
  directive: "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-fg)]",
  rejected: "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-fg)]",
  neutral: "bg-[var(--badge-neutral-bg)] text-[var(--badge-neutral-fg)]",
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
        "inline-flex items-center gap-1.5 rounded-pill px-2 py-0.5 text-label",
        statusStyles[kind],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

/* High priority earns a tint; medium and low stay as quiet text. */
export function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  if (priority !== "high") {
    return (
      <span className="text-label text-tertiary-foreground">
        {priority === "medium" ? "Medium" : "Low"} Priority
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-pill bg-[var(--badge-pending-bg)] px-2 py-0.5 text-label text-[var(--badge-pending-fg)]">
      High Priority
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

/* A quiet second line of metadata, dot-separated. */
export function Meta({
  items,
  className,
}: {
  items: React.ReactNode[];
  className?: string | undefined;
}) {
  const shown = items.filter(Boolean);
  return (
    <p
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-tertiary-foreground",
        className,
      )}
    >
      {shown.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 ? (
            <span aria-hidden="true" className="opacity-50">
              ·
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1.5">{item}</span>
        </React.Fragment>
      ))}
    </p>
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
  bordered,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  urgency?: Urgency | undefined;
  compact?: boolean | undefined;
  interactive?: boolean | undefined;
  /* Opt in to a hard edge only for containers that must read as panels. */
  bordered?: boolean | undefined;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg bg-surface",
        bordered ? "border border-hairline" : "shadow-xs",
        compact ? "p-3.5" : "p-5",
        interactive && "transition-colors duration-150 hover:bg-surface-hover",
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


export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="mb-3 inline-flex items-center gap-1.5 text-small text-secondary-foreground transition-colors duration-150 hover:text-foreground"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      {label}
    </Link>
  );
}

export function PageHeader({
  eyebrow,
  title,
  backTo,
  backLabel,
  children,
}: {
  eyebrow?: string | undefined;
  title: string;
  backTo?: string | undefined;
  backLabel?: string | undefined;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6">
      {backTo ? <BackLink to={backTo} label={backLabel ?? "Back"} /> : null}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow ? <p className="text-label text-tertiary-foreground">{eyebrow}</p> : null}
          <h1 className="text-h1 text-foreground">{title}</h1>
        </div>
        {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
      </div>
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

/* ------------------------------ Detail panel ------------------------------ */

/*
 * A focused slide-over. Detail belongs in a deliberate surface, never at the
 * bottom of a long scroll.
 */
export function DetailPanel({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string | undefined;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Close detail"
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/40"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col bg-surface shadow-lg sm:w-[560px]"
      >
        <div className="flex items-start gap-3 border-b border-hairline px-5 py-4">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-h3 text-foreground">{title}</h2>
            {subtitle ? (
              <p className="mt-0.5 text-small text-tertiary-foreground">{subtitle}</p>
            ) : null}
          </div>
          <IconBtn label="Close" onClick={onClose}>
            <span aria-hidden="true" className="text-body">
              ✕
            </span>
          </IconBtn>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}
