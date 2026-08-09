import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Stamp, Flame, CalendarClock, Star, ArrowRight } from "lucide-react";
import {
  BottomSheet,
  Btn,
  Card,
  DetailPanel,
  EmptyState,
  FilterPill,
  Meta,
  Skel,
  SectionHeading,
} from "@/components/ds";
import { ApprovalCard } from "@/components/desk/ApprovalCard";
import { TasksAndActivity } from "@/components/desk/Feed";
import { VoiceReply } from "@/components/desk/VoiceReply";
import { decisions, tasks } from "@/data/demo";
import { inr, plural } from "@/lib/format";

export const Route = createFileRoute("/_shell/inbox")({
  head: () => ({
    meta: [
      { title: "Decision Desk - DecisionOS" },
      {
        name: "description",
        content:
          "What needs you today: decisions waiting on your approval, overdue work, what's due and what matters most.",
      },
      { property: "og:title", content: "Decision Desk - DecisionOS" },
      {
        property: "og:description",
        content: "Answer one question each morning: what needs me today?",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DecisionDesk,
});

function DeskSkeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading your desk">
      <Skel className="h-9 w-40" />
      <Skel className="h-7 w-[28rem] max-w-full" />
      <Skel className="h-24 w-full rounded-lg" />
      <Skel className="h-24 w-full rounded-lg" />
    </div>
  );
}

function Group({
  title,
  count,
  showTitle,
  children,
}: {
  title: string;
  count: number;
  showTitle: boolean;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section aria-label={title}>
      {showTitle ? (
        <h2 className="mb-2 text-h3 text-secondary-foreground">
          {title} <span className="tabular text-tertiary-foreground">{count}</span>
        </h2>
      ) : null}
      {children}
    </section>
  );
}

/** Title leads; everything else recedes into a single quiet meta line. */
function DeskRow({
  title,
  meta,
  amount,
  action,
}: {
  title: string;
  meta: (React.ReactNode | null)[];
  amount?: number | undefined;
  action?: React.ReactNode;
}) {
  return (
    <Card compact interactive className="flex flex-wrap items-center gap-3">
      <div className="min-w-48 flex-1">
        <p className="text-h3 text-foreground">{title}</p>
        <Meta className="mt-0.5" items={meta.filter(Boolean)} />
      </div>
      {amount ? (
        <span className="tabular text-body-strong text-foreground">{inr(amount)}</span>
      ) : null}
      {action}
    </Card>
  );
}

function DecisionDesk() {
  const [loading, setLoading] = React.useState(true);
  const [reviewing, setReviewing] = React.useState<string | null>(null);
  const [respondTo, setRespondTo] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<"all" | "decision" | "fire" | "due" | "important">(
    "all",
  );

  React.useEffect(() => {
    const id = window.setTimeout(() => setLoading(false), 500);
    return () => window.clearTimeout(id);
  }, []);

  const pending = [...decisions.filter((d) => d.status === "pending")].sort(
    (a, b) => b.waitingDays - a.waitingDays,
  );
  const open = tasks.filter((t) => t.status !== "done");
  const escalations = open.filter((t) => t.kind === "escalation" || t.kind === "handoff");
  const overdue = open.filter((t) => t.kind === "task" && t.dueInDays < 0);
  const dueToday = open.filter((t) => t.kind === "task" && t.dueInDays === 0);
  const important = open.filter(
    (t) => t.kind === "task" && t.priority === "high" && t.dueInDays > 0,
  );

  const onFire = [...escalations, ...overdue];
  const escalated = escalations.find((t) => t.id === respondTo);

  const headline = [
    pending.length
      ? `${pending.length} ${plural(pending.length, "decision", "decisions")} waiting on you`
      : "",
    onFire.length ? `${onFire.length} on fire` : "",
    dueToday.length ? `${dueToday.length} due today` : "",
  ]
    .filter(Boolean)
    .join(" · ");

  const filters = [
    { id: "decision", label: "Needs Your Decision", count: pending.length },
    { id: "fire", label: "On Fire", count: onFire.length },
    { id: "due", label: "Due Today", count: dueToday.length },
    { id: "important", label: "Important", count: important.length },
  ] as const;

  const show = (id: (typeof filters)[number]["id"]) => filter === "all" || filter === id;

  if (loading) return <DeskSkeleton />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-h1 text-foreground">Decision Desk</h1>
        <p className="mt-1 text-lead text-secondary-foreground">
          {headline || "Nothing needs you right now. You're clear."}
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
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

      {pending.length + onFire.length + dueToday.length + important.length === 0 ? (
        <EmptyState
          title="Nothing Needs You Right Now"
          helper="Decisions, escalations and overdue work land here the moment they appear."
        />
      ) : null}

      {show("decision") ? (
        <Group
          tone="decision"
          icon={Stamp}
          title="Needs Your Decision"
          sub="Work stays blocked until you decide. Longest waiting first."
          count={pending.length}
        >
          <ul className="space-y-1.5">
            {pending.map((d) => (
              <li key={d.id}>
                <DeskRow
                  title={d.title}
                  amount={d.amount}
                  meta={[
                    `Waiting ${d.waitingDays} ${plural(d.waitingDays, "day", "days")}`,
                    `From ${d.raisedBy}`,
                    `Unblocks ${d.unblocks.length} ${plural(d.unblocks.length, "task", "tasks")}`,
                  ]}
                  action={
                    <Btn variant="secondary" size="sm" onClick={() => setReviewing(d.id)}>
                      Review <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Btn>
                  }
                />
              </li>
            ))}
          </ul>
        </Group>
      ) : null}

      {show("fire") ? (
        <Group
          tone="fire"
          icon={Flame}
          title="On Fire"
          sub="Escalated to you or already past its date."
          count={onFire.length}
        >
          <ul className="space-y-1.5">
            {onFire.map((t) => (
              <li key={t.id}>
                <DeskRow
                  title={t.title}
                  amount={t.amount}
                  meta={[
                    t.kind === "task"
                      ? `${Math.abs(t.dueInDays)} ${plural(Math.abs(t.dueInDays), "day", "days")} overdue`
                      : t.kind === "escalation"
                        ? `Escalated by ${t.raisedBy}`
                        : `Handed to you by ${t.raisedBy}`,
                    t.assignee ? `With ${t.assignee}` : null,
                  ]}
                  action={
                    t.kind === "task" ? (
                      <Btn variant="tertiary" size="sm">
                        Chase
                      </Btn>
                    ) : (
                      <Btn variant="secondary" size="sm" onClick={() => setRespondTo(t.id)}>
                        Respond
                      </Btn>
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </Group>
      ) : null}

      {show("due") ? (
        <Group
          tone="due"
          icon={CalendarClock}
          title="Due Today"
          sub="On the date - nudge anything that looks slow."
          count={dueToday.length}
        >
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {dueToday.map((t) => (
              <li key={t.id}>
                <DeskRow
                  title={t.title}
                  amount={t.amount}
                  meta={[t.assignee ? `With ${t.assignee}` : null]}
                  action={
                    <Btn variant="tertiary" size="sm">
                      Nudge
                    </Btn>
                  }
                />
              </li>
            ))}
          </ul>
        </Group>
      ) : null}

      {show("important") ? (
        <Group
          tone="important"
          icon={Star}
          title="Important, Not Yet Due"
          sub="High-value work worth keeping an eye on this week."
          count={important.length}
        >
          <ul className="grid gap-1.5 sm:grid-cols-2">
            {important.map((t) => (
              <li key={t.id}>
                <DeskRow
                  title={t.title}
                  amount={t.amount}
                  meta={[
                    `Due in ${t.dueInDays} ${plural(t.dueInDays, "day", "days")}`,
                    t.assignee ? `With ${t.assignee}` : null,
                  ]}
                />
              </li>
            ))}
          </ul>
        </Group>
      ) : null}

      {filter === "all" ? (
        <div>
          <SectionHeading title="Everything Else" sub="Captured, classified and waiting quietly." />
          <TasksAndActivity />
        </div>
      ) : null}

      <BottomSheet open={reviewing !== null} onClose={() => setReviewing(null)}>
        {reviewing ? <ApprovalCard decision={decisions.find((d) => d.id === reviewing)!} /> : null}
      </BottomSheet>

      <DetailPanel
        open={escalated !== undefined}
        onClose={() => setRespondTo(null)}
        title={escalated ? escalated.title : "Respond"}
        subtitle={escalated ? `Raised by ${escalated.raisedBy}` : undefined}
      >
        {escalated ? (
          <div className="space-y-4">
            {escalated.description ? (
              <p className="text-body text-secondary-foreground">{escalated.description}</p>
            ) : null}
            <VoiceReply
              ariaLabel={`Your response to ${escalated.raisedBy}`}
              placeholder={`Speak or type your decision - it goes back to ${escalated.raisedBy}`}
              onSend={() => setRespondTo(null)}
            />
          </div>
        ) : null}
      </DetailPanel>
    </div>
  );
}
