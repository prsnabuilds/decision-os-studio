import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Flame } from "lucide-react";
import {
  Btn,
  Card,
  FilterPill,
  Meta,
  PageHeader,
  SectionHeading,
  Segmented,
  StatusBadge,
} from "@/components/ds";
import { AiBtn, AiTag } from "@/components/ds/ai";
import { buildRanked, decisions } from "@/data/demo";
import { inr, plural } from "@/lib/format";

export const Route = createFileRoute("/_shell/brief")({
  head: () => ({
    meta: [
      { title: "CEO Brief - DecisionOS" },
      {
        name: "description",
        content:
          "A periodic narrative summary of the business: fires, decisions, tasks and what moved this period.",
      },
      { property: "og:title", content: "CEO Brief - DecisionOS" },
      {
        property: "og:description",
        content: "The deeper review surface for founder-led businesses.",
      },
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

  const summaryByPeriod: Record<(typeof periods)[number], string> = {
    Morning:
      "Cash is healthy but ageing receivables are the pressure point: ₹4,00,000 sits past thirty days with one retailer. Six decisions are waiting on you, the oldest for three days. The packaging reconciliation has been late for six days and is holding the distributor payout behind it.",
    Evening:
      "Three of today's five commitments closed. The dispatch schedule was confirmed and payroll is signed off. The Delhi quote did not go out and now runs into tomorrow's negotiation window.",
    Weekly:
      "Dispatch slipped four times this week - always on the second shift, which is the case for the coordinator hire you raised on Tuesday. Revenue billed is ₹18,42,300 against ₹16,21,000 received; the gap is one retailer.",
    Monthly:
      "Spend held at ₹4,82,000 with packaging at 38% of it, concentrated in a single vendor. Net profit is ₹11,39,000. Execution is the weakest of the four operating categories and it is a follow-through problem, not a workload one.",
  };

  const completed = [
    { title: "Leave request approved", by: "Ravi Kumar", when: "Yesterday" },
    { title: "Packaging rate held until October", by: "Meena Raghavan", when: "2 days ago" },
    { title: "Coimbatore consignment dispatched", by: "Ops team", when: "3 days ago" },
    { title: "Invoice #4791 settled in full", by: "Finance", when: "4 days ago" },
  ];

  const filters = [
    { id: "fires", label: "Fires", count: fires.length },
    { id: "decisions", label: "Decisions", count: decisions.length },
    { id: "completed", label: "Work Completed", count: completed.length },
  ] as const;

  const [filter, setFilter] = React.useState<(typeof filters)[number]["id"] | "all">("all");
  const show = (id: (typeof filters)[number]["id"]) => filter === "all" || filter === id;

  return (
    <div>
      <PageHeader title="CEO Brief">
        <Btn variant="secondary">Send Daily Digest</Btn>
      </PageHeader>

      <div className="mb-4">
        <Segmented options={periods} value={period} onChange={setPeriod} label="Brief period" />
      </div>

      <Card compact className="mb-5">
        <AiTag>Written by DecisionOS</AiTag>
        <p className="mt-2 text-small leading-relaxed text-foreground">{summaryByPeriod[period]}</p>
        <div className="mt-3">
          <AiBtn size="sm">Rewrite Brief</AiBtn>
        </div>
      </Card>

      <div className="mb-5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <FilterPill
            key={f.id}
            label={f.label}
            count={f.count}
            active={filter === f.id}
            onClick={() => setFilter((c) => (c === f.id ? "all" : f.id))}
          />
        ))}
      </div>

      {show("fires") ? (
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
                    <span className="tabular text-body-strong text-foreground">
                      {inr(f.amount)}
                    </span>
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
      ) : null}

      <section className="mb-8 grid gap-6 lg:grid-cols-2">
        {show("decisions") ? (
          <div>
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="text-h2 text-foreground">Decisions This Period</h2>
              <span className="text-small text-tertiary-foreground">
                {decisions.length} raised · {decisions.filter((d) => d.status === "pending").length}{" "}
                still waiting
              </span>
            </div>
            <ul className="space-y-1.5">
              {decisions.slice(0, 4).map((d) => (
                <li key={d.id}>
                  <Card compact interactive className="flex flex-wrap items-center gap-3">
                    <div className="min-w-40 flex-1">
                      <p className="text-body-strong text-foreground">{d.title}</p>
                      <Meta
                        className="mt-1"
                        items={
                          [
                            d.status === "pending"
                              ? `Waiting ${d.waitingDays} ${plural(d.waitingDays, "day", "days")}`
                              : "Decided",
                            `Raised by ${d.raisedBy}`,
                            d.amount ? inr(d.amount) : null,
                          ].filter(Boolean) as string[]
                        }
                      />
                    </div>
                    <StatusBadge kind={d.status === "pending" ? "attention" : "done"}>
                      {d.status === "pending" ? "Needs You" : "Closed"}
                    </StatusBadge>
                  </Card>
                </li>
              ))}
            </ul>
            <Btn variant="tertiary" size="sm" className="mt-2" asChild>
              <Link to="/inbox">Open The Decision Desk →</Link>
            </Btn>
          </div>
        ) : null}

        {show("completed") ? (
          <div>
            <div className="mb-3 flex items-baseline gap-2">
              <h2 className="text-h2 text-foreground">Work Completed</h2>
              <span className="text-small text-tertiary-foreground">
                {completed.length} finished this period
              </span>
            </div>
            <ul className="space-y-1.5">
              {completed.map((c) => (
                <li key={c.title}>
                  <Card compact className="flex flex-wrap items-center gap-3">
                    <CheckCircle2 className="size-4 shrink-0 text-success-600" aria-hidden="true" />
                    <div className="min-w-40 flex-1">
                      <p className="text-body-strong text-foreground">{c.title}</p>
                      <Meta className="mt-1" items={[c.by, c.when]} />
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
            <Btn variant="tertiary" size="sm" className="mt-2" asChild>
              <Link to="/journal">See The Full Record →</Link>
            </Btn>
          </div>
        ) : null}
      </section>

      <section>
        <SectionHeading
          title="Go Deeper"
          sub="Three views behind this brief - each one comes back here."
        />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              to: "/operating-score",
              title: "Operating Score",
              sub: "How well the business is being run",
            },
            { to: "/coach", title: "Work Coach", sub: "Coach your team from the record" },
            {
              to: "/journal",
              title: "Decision Journal",
              sub: "Every decision and what came of it",
            },
          ].map((t) => (
            <Link key={t.to} to={t.to} className="block">
              <Card interactive className="h-full">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-body-strong text-foreground">{t.title}</p>
                  <ArrowRight
                    className="size-4 shrink-0 text-tertiary-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="mt-1 text-small text-secondary-foreground">{t.sub}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
