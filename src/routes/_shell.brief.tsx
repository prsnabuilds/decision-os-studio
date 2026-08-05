import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Flame } from "lucide-react";
import { Btn, Card, PageHeader, Segmented, StatusBadge } from "@/components/ds";
import { buildRanked, decisions, tasks } from "@/data/demo";
import { inr, joinReadably, plural } from "@/lib/format";

export const Route = createFileRoute("/_shell/brief")({
  head: () => ({
    meta: [
      { title: "CEO Brief — DecisionOS" },
      {
        name: "description",
        content:
          "A periodic narrative summary of the business: fires, decisions, tasks and what moved this period.",
      },
      { property: "og:title", content: "CEO Brief — DecisionOS" },
      { property: "og:description", content: "The deeper review surface for founder-led businesses." },
    ],
  }),
  component: BriefPage,
});

const periods = ["Morning", "Evening", "Weekly", "Monthly"] as const;

function BriefPage() {
  const [period, setPeriod] = React.useState<(typeof periods)[number]>("Morning");
  const navigate = useNavigate();

  const ranked = buildRanked();
  const fires = ranked.filter((r) => r.tier === "overdue");
  const pending = decisions.filter((d) => d.status === "pending").length;
  const openTasks = tasks.filter((t) => t.status !== "done").length;

  const counters = [
    { label: "Fires", value: fires.length },
    { label: "Decisions", value: pending },
    { label: "Tasks", value: openTasks },
    { label: "Overdue", value: fires.length },
  ].filter((c) => c.value > 0);

  const summaryByPeriod: Record<(typeof periods)[number], string> = {
    Morning:
      "Cash is healthy but ageing receivables are the pressure point: ₹4,00,000 sits past thirty days with one retailer. Six decisions are waiting on you, the oldest for three days. The packaging reconciliation has been late for six days and is holding the distributor payout behind it.",
    Evening:
      "Three of today's five commitments closed. The dispatch schedule was confirmed and payroll is signed off. The Delhi quote did not go out and now runs into tomorrow's negotiation window.",
    Weekly:
      "Dispatch slipped four times this week — always on the second shift, which is the case for the coordinator hire you raised on Tuesday. Revenue billed is ₹18,42,300 against ₹16,21,000 received; the gap is one retailer.",
    Monthly:
      "Spend held at ₹4,82,000 with packaging at 38% of it, concentrated in a single vendor. Net profit is ₹11,39,000. Execution is the weakest of the four operating categories and it is a follow-through problem, not a workload one.",
  };

  return (
    <div>
      <PageHeader eyebrow="Your business, in prose" title="CEO Brief">
        <Btn variant="secondary">Send Daily Digest</Btn>
      </PageHeader>

      <div className="mb-6">
        <Segmented options={periods} value={period} onChange={setPeriod} label="Brief period" />
      </div>

      <Card className="mb-6">
        <p className="text-body text-foreground">{summaryByPeriod[period]}</p>
        <p className="mt-4 text-small text-secondary-foreground">
          {joinReadably(
            counters.map((c) => `${c.value} ${plural(c.value, c.label.replace(/s$/, ""), c.label).toLowerCase()}`),
          )}
          {counters.length ? " need attention this period." : "Nothing needs attention this period."}
        </p>
      </Card>

      <section className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="size-4 text-danger-600" aria-hidden="true" />
          <h2 className="text-h2 text-foreground">Fires</h2>
          <StatusBadge kind="overdue">{fires.length} Overdue</StatusBadge>
        </div>
        <ul className="space-y-2">
          {fires.map((f) => (
            <li key={f.id}>
              <Card
                compact
                interactive
                urgency="overdue"
                className="flex flex-wrap items-center gap-3 pl-5"
              >
                <div className="min-w-48 flex-1">
                  <p className="text-body-strong text-foreground">{f.title}</p>
                  <p className="text-small text-secondary-foreground">{f.reason}</p>
                </div>
                {f.amount ? (
                  <span className="tabular text-body-strong text-foreground">{inr(f.amount)}</span>
                ) : null}
                <Btn
                  size="sm"
                  variant="secondary"
                  onClick={() => navigate({ to: "/inbox", hash: f.id })}
                >
                  Open On The Desk →
                </Btn>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="text-h3 text-foreground">Decisions This Period</h3>
          <ul className="mt-3 space-y-2">
            {decisions.slice(0, 4).map((d) => (
              <li key={d.id} className="text-small text-secondary-foreground">
                {d.title}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="text-h3 text-foreground">Work Completed</h3>
          <ul className="mt-3 space-y-2">
            <li className="text-small text-secondary-foreground">Leave request — Ravi Kumar</li>
            <li className="text-small text-secondary-foreground">
              Packaging rate held until October
            </li>
            <li className="text-small text-secondary-foreground">
              Coimbatore consignment dispatched
            </li>
          </ul>
        </Card>
      </section>

      <Card className="flex flex-wrap items-center gap-3">
        <p className="text-small text-secondary-foreground">Go deeper:</p>
        <Btn variant="tertiary" size="sm" asChild>
          <Link to="/operating-score">Operating Score</Link>
        </Btn>
        <Btn variant="tertiary" size="sm" asChild>
          <Link to="/coach">Work Coach</Link>
        </Btn>
        <Btn variant="tertiary" size="sm" asChild>
          <Link to="/journal">Decision Journal</Link>
        </Btn>
      </Card>
    </div>
  );
}
