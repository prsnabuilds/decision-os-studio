import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { Btn, StatusBadge } from "@/components/ds";
import { SourceLabel } from "@/components/ds/bits";
import { VoiceReply } from "@/components/desk/VoiceReply";
import type { Decision } from "@/data/demo";
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

function Disclosure({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border-t border-hairline pt-3">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 text-left text-small text-secondary-foreground"
      >
        {label}
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform", open && "rotate-180")}
        />
      </button>
      {open ? <div className="pt-3">{children}</div> : null}
    </div>
  );
}

export function ApprovalCard({ decision }: { decision: Decision }) {
  const [outcome, setOutcome] = React.useState<"pending" | "approved" | "rejected">("pending");

  return (
    <div className="space-y-5">
      <div>
        <div className="flex flex-wrap items-start gap-2">
          <h3 className="min-w-40 flex-1 text-h3 text-foreground">{decision.title}</h3>
          {decision.amount ? (
            <span className="tabular text-h3 text-foreground">{inr(decision.amount)}</span>
          ) : null}
        </div>
        <p className="mt-1 text-small text-tertiary-foreground">
          Raised by {decision.raisedBy} · <SourceLabel source={decision.source} /> ·{" "}
          {decision.createdOn}
        </p>
        {outcome !== "pending" ? (
          <div className="mt-2">
            <StatusBadge kind={outcome === "approved" ? "done" : "neutral"}>
              {outcome === "approved" ? "Approved" : "Rejected"}
            </StatusBadge>
          </div>
        ) : null}
      </div>

      <p className="text-body text-secondary-foreground">{decision.summary}</p>

      <div className="flex flex-wrap gap-2">
        <Btn variant="primary" className="flex-1" onClick={() => setOutcome("approved")}>
          Approve
        </Btn>
        <Btn variant="destructive" className="flex-1" onClick={() => setOutcome("rejected")}>
          Reject
        </Btn>
      </div>

      <Disclosure label={`What happens next (${decision.unblocks.length} tasks unblock)`}>
        <UnblockTimeline decision={decision} />
      </Disclosure>

      <Disclosure label={`Add a note or send it back to ${decision.raisedBy}`}>
        <VoiceReply
          ariaLabel={`Your note to ${decision.raisedBy}`}
          placeholder={`Speak or type - this goes back to ${decision.raisedBy}`}
          sendLabel="Send Note"
        />
      </Disclosure>
    </div>
  );
}
