import * as React from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Check, ArrowRight } from "lucide-react";
import { Btn, StatusBadge } from "@/components/ds";
import { SourceLabel } from "@/components/ds/bits";
import { VoiceReply } from "@/components/desk/VoiceReply";
import { WorkflowChip } from "@/components/workflow/WorkflowChip";
import { decisionWorkflow, type Decision } from "@/data/demo";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/format";


/** Past = done, current = active, next = upcoming. */
function UnblockTimeline({ decision }: { decision: Decision }) {
  const steps = [
    { title: "Raised by " + decision.raisedBy, sub: decision.createdOn, state: "done" as const },
    {
      title: "Waiting on your decision",
      sub: "Everything below is blocked",
      state: "active" as const,
    },
    ...decision.unblocks.map((t) => ({
      title: t.title,
      sub: t.assignee ? `Goes to ${t.assignee}` : "Unassigned",
      state: "next" as const,
    })),
  ];

  return (
    <ol className="relative space-y-4 pl-6">
      <span
        aria-hidden="true"
        className="absolute bottom-2 left-[7px] top-2 w-px bg-hairline-strong"
      />
      {steps.map((s, i) => (
        <li key={i} className="relative">
          <span
            aria-hidden="true"
            className={cn(
              "absolute -left-6 top-0.5 flex size-4 items-center justify-center rounded-pill",
              s.state === "done" && "bg-success-600 text-white",
              s.state === "active" && "bg-brand ring-4 ring-brand-tint",
              s.state === "next" && "border border-hairline-strong bg-surface",
            )}
          >
            {s.state === "done" ? <Check className="size-3" strokeWidth={3} /> : null}
          </span>
          <p
            className={cn(
              "text-body",
              s.state === "next" ? "text-tertiary-foreground" : "text-body-strong text-foreground",
            )}
          >
            {s.title}
          </p>
          <p className="text-small text-tertiary-foreground">{s.sub}</p>
        </li>
      ))}
    </ol>
  );
}

function Disclosure({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-t border-hairline pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left text-small text-secondary-foreground"
      >
        <span className="flex-1">{label}</span>
        {hint ? <span className="text-small text-tertiary-foreground">{hint}</span> : null}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? <div className="pt-3">{children}</div> : null}
    </div>
  );
}

export function ApprovalCard({ decision }: { decision: Decision }) {
  const [outcome, setOutcome] = React.useState<"pending" | "approved" | "rejected">("pending");
  const link = decisionWorkflow[decision.id];

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-h2 font-semibold text-foreground">{decision.title}</h3>
        {decision.amount ? (
          <p className="mt-1 tabular text-h1 font-bold text-brand">{inr(decision.amount)}</p>
        ) : null}
        {link ? (
          <div className="mt-2">
            <WorkflowChip id={link.workflowId} />
          </div>
        ) : null}
        {outcome !== "pending" ? (
          <div className="mt-2">
            <StatusBadge kind={outcome === "approved" ? "done" : "neutral"}>
              {outcome === "approved" ? "Approved" : "Rejected"}
            </StatusBadge>
          </div>
        ) : null}
      </div>

      <p className="text-body leading-relaxed text-secondary-foreground">{decision.summary}</p>

      {link ? (
        <Link
          to="/my-work"
          search={{ view: "Workflows", workflow: link.workflowId }}
          className="flex items-center gap-2 rounded-md bg-surface-sunken px-3 py-2 text-small text-foreground hover:bg-surface-hover"
        >
          <span className="flex-1">
            Unblocks {decision.unblocks.length}{" "}
            {decision.unblocks.length === 1 ? "task" : "tasks"} in this workflow
          </span>
          <ArrowRight className="size-3.5 shrink-0 text-brand" aria-hidden="true" />
        </Link>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Btn variant="primary" className="flex-1" onClick={() => setOutcome("approved")}>
          Approve
        </Btn>
        <Btn variant="destructive" className="flex-1" onClick={() => setOutcome("rejected")}>
          Reject
        </Btn>
      </div>


      <Disclosure
        label="What happens next"
        hint={`${decision.unblocks.length} ${decision.unblocks.length === 1 ? "task" : "tasks"}`}
      >
        <UnblockTimeline decision={decision} />
      </Disclosure>

      <Disclosure label="Send a note" hint={`To ${decision.raisedBy}`}>
        <VoiceReply
          ariaLabel={`Your note to ${decision.raisedBy}`}
          placeholder={`Speak or type - this goes back to ${decision.raisedBy}`}
          sendLabel="Send Note"
        />
      </Disclosure>
    </div>
  );
}
