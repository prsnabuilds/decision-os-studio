import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import {
  Btn,
  Card,
  DetailPanel,
  EmptyState,
  Meta,
  Skel,
  StatusBadge,
  PriorityBadge,
  SectionHeading,
} from "@/components/ds";

import { CaptureBlock } from "@/components/desk/CaptureBlock";
import { ApprovalCard } from "@/components/desk/ApprovalCard";
import { TasksAndActivity } from "@/components/desk/Feed";
import { VoiceReply } from "@/components/desk/VoiceReply";
import { buildRanked, decisions, tasks, topThree } from "@/data/demo";
import { inr, joinReadably, plural } from "@/lib/format";

export const Route = createFileRoute("/_shell/inbox")({
  head: () => ({
    meta: [
      { title: "Decision Desk — DecisionOS" },
      {
        name: "description",
        content:
          "Your morning brief: what needs you today, the decisions waiting on your approval, and everything escalated to you.",
      },
      { property: "og:title", content: "Decision Desk — DecisionOS" },
      {
        property: "og:description",
        content: "Answer one question each morning: what needs me today?",
      },
    ],
  }),
  component: DecisionDesk,
});

function BriefSkeleton() {
  return (
    <section className="mb-10" aria-busy="true" aria-label="Loading your brief">
      <Skel className="h-9 w-40" />
      <Skel className="mt-3 h-7 w-[36rem] max-w-full" />
      <div className="mt-5 space-y-3">
        <Skel className="h-[92px] w-full rounded-lg" />
        <Skel className="h-[92px] w-full rounded-lg" />
        <Skel className="h-[92px] w-full rounded-lg" />
      </div>
      <Skel className="mt-4 h-8 w-44" />
    </section>
  );
}

function DecisionDesk() {
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [showAllDecisions, setShowAllDecisions] = React.useState(false);
  const [reviewing, setReviewing] = React.useState<string | null>(null);


  React.useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 700);
    return () => window.clearTimeout(id);
  }, []);

  const ranked = React.useMemo(() => buildRanked(), []);
  const top = React.useMemo(() => topThree(ranked), [ranked]);
  const others = ranked.length - top.length;

  const pending = decisions.filter((d) => d.status === "pending");
  const longestWaiting = [...pending].sort((a, b) => b.waitingDays - a.waitingDays);
  const escalations = tasks.filter(
    (t) => (t.kind === "escalation" || t.kind === "handoff") && t.status !== "done",
  );

  const counts = {
    decisions: pending.length,
    escalated: escalations.length,
    overdue: ranked.filter((r) => r.tier === "overdue").length,
    today: ranked.filter((r) => r.tier === "today").length,
  };

  const todayLine = joinReadably(
    [
      counts.decisions
        ? `${counts.decisions} ${plural(counts.decisions, "decision needs", "decisions need")} you`
        : "",
      counts.escalated ? `${counts.escalated} escalated to you` : "",
      counts.overdue ? `${counts.overdue} overdue` : "",
      counts.today ? `${counts.today} due today` : "",
    ].filter(Boolean),
  );

  const scrollToLists = () => {
    document.getElementById("decision-approvals")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="space-y-10">
      {processing ? (
        <div className="sticky top-16 z-20 flex items-start gap-3 rounded-lg border border-brand-tint-border bg-brand-tint px-4 py-3">
          <Loader2 className="mt-0.5 size-4 animate-spin text-brand-on-tint" aria-hidden="true" />
          <div>
            <p className="text-body-strong text-brand-on-tint">Thinking…</p>
            <p className="text-small text-secondary-foreground">
              DecisionOS is working through it for you — you can keep going. We'll pop up the summary
              the moment it's ready.
            </p>
          </div>
          <Btn
            variant="tertiary"
            size="sm"
            className="ml-auto"
            onClick={() => setProcessing(false)}
          >
            Review
          </Btn>
        </div>
      ) : null}

      {/* Section 1 — Capture (the first thing you do each morning) */}
      <CaptureBlock
        onSubmit={() => {
          setProcessing(true);
          window.setTimeout(() => setProcessing(false), 4000);
        }}
      />

      {/* Section 2 — Today */}
      {loading ? (
        <BriefSkeleton />
      ) : (
        <section aria-labelledby="today-heading">
          <h1 id="today-heading" className="text-h1 text-foreground">
            Today
          </h1>
          <p className="mt-2 text-lead text-secondary-foreground">
            {todayLine ? `${todayLine}.` : "Nothing needs you right now. You're clear."}
          </p>

          {top.length === 0 ? (
            <div className="mt-5">
              <EmptyState
                title="Nothing Needs You Right Now"
                helper="Decisions awaiting approval, escalations and overdue work will be ranked here each morning."
              />
            </div>
          ) : (
            <ol className="mt-5 space-y-3">
              {top.map((item, i) => (
                <li key={item.id}>
                  <Card urgency={item.urgency} className="flex flex-wrap items-center gap-4 pl-6">
                    <span
                      className="inline-flex size-7 shrink-0 items-center justify-center rounded-pill bg-surface-sunken text-label tabular text-secondary-foreground"
                      aria-label={`Rank ${i + 1}`}
                    >
                      {i + 1}
                    </span>
                    <div className="min-w-48 flex-1">
                      <p className="text-body-strong text-foreground">{item.title}</p>
                      <p className="text-small text-secondary-foreground">{item.reason}</p>
                    </div>
                    {item.amount ? (
                      <span className="tabular text-body-strong text-foreground">
                        {inr(item.amount)}
                      </span>
                    ) : null}
                    {item.kind === "decision" ? (
                      <Btn variant="secondary" size="sm" onClick={() => setReviewing(item.id)}>
                        Review →
                      </Btn>
                    ) : null}

                  </Card>
                </li>
              ))}
            </ol>
          )}

          <Btn variant="tertiary" className="mt-3" onClick={scrollToLists}>
            {others > 0 ? `See The Other ${others} →` : "Nothing else is waiting →"}
          </Btn>
        </section>
      )}

      {/* Section 3 — Decision Approvals */}
      <section id="decision-approvals">
        <SectionHeading
          title="Decision Approvals"
          sub={`${pending.length} ${plural(pending.length, "decision still needs", "decisions still need")} you. Longest waiting first — open one to decide.`}
        />
        <ul className="space-y-1.5">
          {(showAllDecisions ? longestWaiting : longestWaiting.slice(0, 3)).map((d) => (
            <li key={d.id}>
              <Card compact interactive className="flex flex-wrap items-center gap-3">
                <div className="min-w-48 flex-1">
                  <p className="text-body-strong text-foreground">{d.title}</p>
                  <Meta
                    items={[
                      `Waiting ${d.waitingDays} ${plural(d.waitingDays, "day", "days")}`,
                      `Raised by ${d.raisedBy}`,
                      `Unblocks ${d.unblocks.length} ${plural(d.unblocks.length, "task", "tasks")}`,
                    ]}
                    className="mt-1"
                  />
                </div>
                {d.amount ? (
                  <span className="tabular text-body-strong text-foreground">{inr(d.amount)}</span>
                ) : null}
                <Btn variant="secondary" size="sm" onClick={() => setReviewing(d.id)}>
                  Review →
                </Btn>
              </Card>
            </li>
          ))}
        </ul>
        <Btn
          variant="secondary"
          className="mt-4"
          onClick={() => setShowAllDecisions((s) => !s)}
        >
          {showAllDecisions
            ? "Show Only The Longest Waiting"
            : `Show All ${pending.length} Decisions`}
        </Btn>
      </section>

      <DetailPanel
        open={reviewing !== null}
        onClose={() => setReviewing(null)}
        title="Decision Review"
        subtitle="Approve, reject or send it back — the tasks below unblock the moment you decide."
      >
        {reviewing ? (
          <ApprovalCard decision={decisions.find((d) => d.id === reviewing)!} />
        ) : null}
      </DetailPanel>


      {/* Section 4 — Needs Your Attention */}
      {escalations.length > 0 ? (
        <section>
          <SectionHeading title="Needs Your Attention" count={escalations.length} />
          <div className="space-y-3">
            {escalations.map((t) => (
              <Card key={t.id} className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge kind="directive">
                    {t.kind === "escalation" ? "Escalation" : "Handoff"}
                  </StatusBadge>
                  <PriorityBadge priority={t.priority} />
                  {t.amount ? (
                    <span className="ml-auto tabular text-body-strong text-foreground">
                      {inr(t.amount)}
                    </span>
                  ) : null}
                </div>
                <div>
                  <h3 className="text-h3 text-foreground">{t.title}</h3>
                  {t.description ? (
                    <p className="mt-1 text-body text-secondary-foreground">{t.description}</p>
                  ) : null}
                  <p className="mt-1 text-small text-tertiary-foreground">
                    {t.step ? `Raised on step: ${t.step} · ` : ""}Raised by {t.raisedBy}
                  </p>
                </div>
                <VoiceReply
                  ariaLabel={`Your response to ${t.raisedBy}`}
                  placeholder={`Speak or type your decision — it goes back to ${t.raisedBy}`}
                />
              </Card>
            ))}
          </div>
        </section>
      ) : null}

      {/* Section 5 — Tasks & Activity */}
      <TasksAndActivity />
    </div>
  );
}
