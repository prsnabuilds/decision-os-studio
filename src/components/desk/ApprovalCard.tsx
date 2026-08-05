import * as React from "react";
import { Paperclip, UserCog, Plus } from "lucide-react";
import { Btn, Card, StatusBadge } from "@/components/ds";
import { PersonChip, SourceLabel } from "@/components/ds/bits";
import type { Decision } from "@/data/demo";
import { inr } from "@/lib/format";

export function ApprovalCard({ decision }: { decision: Decision }) {
  const [proof, setProof] = React.useState<Record<string, boolean>>(
    Object.fromEntries(decision.unblocks.map((t) => [t.id, t.requireProof])),
  );
  const [outcome, setOutcome] = React.useState<"pending" | "approved" | "rejected">("pending");

  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge kind={outcome === "approved" ? "completed" : outcome === "rejected" ? "rejected" : "pending"}>
          {outcome === "approved" ? "Approved" : outcome === "rejected" ? "Rejected" : "Pending"}
        </StatusBadge>
        <StatusBadge kind="directive">Directive</StatusBadge>
        <span className="text-label text-tertiary-foreground">Created {decision.createdOn}</span>
        {decision.amount ? (
          <span className="ml-auto text-h3 tabular text-foreground">{inr(decision.amount)}</span>
        ) : null}
      </div>

      <div>
        <h3 className="text-h3 text-foreground">{decision.title}</h3>
        <p className="mt-1 flex items-center gap-2 text-small text-tertiary-foreground">
          Raised by {decision.raisedBy} · <SourceLabel source={decision.source} />
        </p>
      </div>

      <p className="text-body text-secondary-foreground">{decision.summary}</p>

      <div className="rounded-md border border-hairline">
        <p className="border-b border-hairline px-4 py-2 text-label text-tertiary-foreground">
          Tasks It Will Unblock
        </p>
        <ul>
          {decision.unblocks.map((t) => (
            <li
              key={t.id}
              className="flex flex-wrap items-center gap-3 border-b border-hairline px-4 py-3 last:border-b-0"
            >
              <span className="min-w-40 flex-1 text-body text-foreground">{t.title}</span>
              <PersonChip name={t.assignee} />
              <Btn size="sm" variant="tertiary">
                <UserCog className="size-4" aria-hidden="true" /> Change Assignee
              </Btn>
              <Btn size="sm" variant="tertiary">
                <Paperclip className="size-4" aria-hidden="true" /> Attach Reference
              </Btn>
              <label className="inline-flex items-center gap-2 text-small text-secondary-foreground">
                <input
                  type="checkbox"
                  className="size-4 rounded-sm border border-hairline-strong accent-[var(--primary-action)]"
                  checked={proof[t.id] ?? false}
                  onChange={(e) => setProof((p) => ({ ...p, [t.id]: e.target.checked }))}
                />
                Require Proof
              </label>
            </li>
          ))}
        </ul>
      </div>

      <Btn size="sm" variant="tertiary">
        <Plus className="size-4" aria-hidden="true" /> Add Team Member / Task
      </Btn>

      <div className="flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
        <Btn variant="primary" onClick={() => setOutcome("approved")}>
          Approve
        </Btn>
        <Btn variant="destructive" onClick={() => setOutcome("rejected")}>
          Reject
        </Btn>
        <Btn variant="tertiary">Discuss / Who Raised This</Btn>
      </div>
    </Card>
  );
}
