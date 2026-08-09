import { Link } from "@tanstack/react-router";
import { Workflow as WorkflowIcon } from "lucide-react";
import { findWorkflow } from "@/data/demo";

/** "Part of: Order #4823 (Sales orders)" - the larger process this belongs to. */
export function WorkflowChip({ id }: { id: string }) {
  const found = findWorkflow(id);
  if (!found) return null;
  return (
    <Link
      to="/my-work"
      search={{ view: "Workflows", workflow: id }}
      className="inline-flex max-w-full items-center gap-1.5 rounded-pill bg-surface-sunken px-2.5 py-1 text-meta text-secondary-foreground transition-colors hover:bg-surface-hover hover:text-foreground"
    >
      <WorkflowIcon className="size-3 shrink-0" aria-hidden="true" />
      <span className="truncate">
        Part of: {found.card.title} ({found.pipeline.name})
      </span>
    </Link>
  );
}
