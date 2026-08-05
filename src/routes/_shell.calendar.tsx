import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card, EmptyState, PageHeader, Segmented, StatusBadge } from "@/components/ds";
import { tasks } from "@/data/demo";

export const Route = createFileRoute("/_shell/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — DecisionOS" },
      {
        name: "description",
        content: "Deadlines, follow-ups and meetings laid out as an agenda rather than a grid.",
      },
      { property: "og:title", content: "Calendar — DecisionOS" },
      { property: "og:description", content: "What is due, and when." },
    ],
  }),
  component: CalendarPage,
});

const agenda = [
  { day: "Today · 5 August", label: "today" as const },
  { day: "Tomorrow · 6 August", label: "week" as const },
  { day: "Thursday · 7 August", label: "week" as const },
];

function CalendarPage() {
  const [view, setView] = React.useState<"Agenda" | "Month">("Agenda");

  const buckets = [
    tasks.filter((t) => t.dueInDays <= 0).slice(0, 4),
    tasks.filter((t) => t.dueInDays > 0 && t.dueInDays <= 7).slice(0, 3),
    tasks.filter((t) => t.dueInDays > 7).slice(0, 2),
  ];

  return (
    <div>
      <PageHeader
        eyebrow="What is due, and when"
        title="Calendar"
        backTo="/my-work"
        backLabel="Back To My Work"
      >
        <Btn variant="secondary">Add An Entry</Btn>
      </PageHeader>

      <div className="mb-6">
        <Segmented
          options={["Agenda", "Month"] as const}
          value={view}
          onChange={setView}
          label="Calendar view"
        />
      </div>

      {view === "Agenda" ? (
        <div className="space-y-8">
          {agenda.map((a, i) => (
            <section key={a.day}>
              <h2 className="mb-3 text-h3 text-foreground">{a.day}</h2>
              {buckets[i]!.length === 0 ? (
                <EmptyState title="Nothing Scheduled" helper="This day is clear." />
              ) : (
                <ul className="space-y-2">
                  {buckets[i]!.map((t) => (
                    <li key={t.id}>
                      <Card compact urgency={t.dueInDays < 0 ? "overdue" : t.dueInDays === 0 ? "today" : t.dueInDays <= 7 ? "week" : "later"} className="flex flex-wrap items-center gap-3">
                        <div className="min-w-48 flex-1 pl-2">
                          <p className="text-body-strong text-foreground">{t.title}</p>
                          <p className="text-small text-secondary-foreground">{t.assignee}</p>
                        </div>
                        <StatusBadge kind={t.dueInDays < 0 ? "overdue" : "neutral"}>
                          {t.dueInDays < 0 ? "Overdue" : "Due"}
                        </StatusBadge>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      ) : (
        <Card>
          <div className="grid grid-cols-7 gap-px overflow-hidden rounded-md bg-hairline">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div key={d} className="bg-surface p-2 text-center text-label text-tertiary-foreground">
                {d}
              </div>
            ))}
            {Array.from({ length: 35 }).map((_, i) => {
              const date = i - 3;
              const has = [5, 6, 11, 18].includes(date);
              return (
                <div key={i} className="min-h-20 bg-surface p-2">
                  {date > 0 && date <= 31 ? (
                    <>
                      <span className="text-label tabular text-tertiary-foreground">{date}</span>
                      {has ? (
                        <span className="mt-1 block rounded-sm bg-brand-tint px-1.5 py-0.5 text-label text-brand-on-tint">
                          2 due
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
