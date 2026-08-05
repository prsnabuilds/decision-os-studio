import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Card, EmptyState, FilterPill, PageHeader, StatusBadge } from "@/components/ds";
import { journalDays } from "@/data/demo";

export const Route = createFileRoute("/_shell/journal")({
  head: () => ({
    meta: [
      { title: "Decision Journal — DecisionOS" },
      {
        name: "description",
        content:
          "A permanent record of every decision captured, approved or rejected, and the work each one created.",
      },
      { property: "og:title", content: "Decision Journal — DecisionOS" },
      { property: "og:description", content: "The record of how this business was run." },
    ],
  }),
  component: JournalPage,
});

const filters = ["All", "Captured", "Approved", "Rejected", "Escalations"] as const;

function JournalPage() {
  const [filter, setFilter] = React.useState<(typeof filters)[number]>("All");

  const days = journalDays
    .map((d) => ({
      ...d,
      events: d.events.filter((e) =>
        filter === "All" ? true : e.kind.toLowerCase().includes(filter.toLowerCase().slice(0, 6)),
      ),
    }))
    .filter((d) => d.events.length > 0);

  const countFor = (f: (typeof filters)[number]) =>
    journalDays.reduce(
      (n, d) =>
        n +
        d.events.filter((e) =>
          f === "All" ? true : e.kind.toLowerCase().includes(f.toLowerCase().slice(0, 6)),
        ).length,
      0,
    );

  return (
    <div>
      <PageHeader eyebrow="The record of how this business was run" title="Decision Journal" />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <FilterPill
            key={f}
            label={f}
            count={countFor(f)}
            active={filter === f}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      {days.length === 0 ? (
        <EmptyState
          title="Nothing Recorded Under This Filter"
          helper="Every decision you take is written here the moment it happens."
        />
      ) : (
        <div className="space-y-8">
          {days.map((d) => (
            <section key={d.day}>
              <h2 className="mb-3 text-h3 text-foreground">{d.day}</h2>
              <ol className="relative space-y-3 border-l border-hairline pl-5">
                {d.events.map((e) => (
                  <li key={e.id} className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute top-5 -left-[23px] size-1.5 rounded-pill bg-hairline-strong"
                    />
                    <Card compact className="flex flex-wrap items-center gap-3">
                      <StatusBadge
                        kind={
                          e.kind.includes("approved")
                            ? "completed"
                            : e.kind.includes("rejected")
                              ? "rejected"
                              : "neutral"
                        }
                      >
                        {e.kind}
                      </StatusBadge>
                      <p className="min-w-48 flex-1 text-body text-foreground">{e.title}</p>
                      <span className="text-label tabular text-tertiary-foreground">{e.time}</span>
                    </Card>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
