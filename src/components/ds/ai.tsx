import * as React from "react";
import { Sparkles } from "lucide-react";
import { Btn } from "@/components/ds";
import { cn } from "@/lib/utils";

/**
 * Every AI-powered action wears the same badge: a tinted pill with a sparkle.
 * If a button does not have this shape, a human is doing the work.
 */
export function AiBtn({
  children,
  className,
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}) {
  return (
    <Btn variant="ai" size={size} className={cn(className)} {...props}>
      <Sparkles className="size-4 shrink-0" aria-hidden="true" />
      {children}
    </Btn>
  );
}

/** Inline label for AI-written content, so nothing reads as if a person typed it. */
export function AiTag({ children = "Written by DecisionOS" }: { children?: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill bg-brand-tint px-2.5 py-1 text-label text-brand-on-tint">
      <Sparkles className="size-3.5" aria-hidden="true" />
      {children}
    </span>
  );
}
