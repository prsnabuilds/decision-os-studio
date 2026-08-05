import { createFileRoute, Link } from "@tanstack/react-router";
import { Btn, Card, PageHeader, StatusBadge } from "@/components/ds";
import { Avatar } from "@/components/ds/bits";
import { operatingScore } from "@/data/demo";

export const Route = createFileRoute("/_shell/operating-score")({
  head: () => ({
    meta: [
      { title: "Operating Score — DecisionOS" },
      {
        name: "description",
        content:
          "How the business is running: execution, finance, sales and responsiveness, scored from your own records.",
      },
      { property: "og:title", content: "Operating Score — DecisionOS" },
      { property: "og:description", content: "How well the business is being run." },
    ],
  }),
  component: OperatingScorePage,
});

function Bar({ value }: { value: number }) {
  return (
    <span className="block h-1.5 w-full rounded-pill bg-surface-sunken">
      <span className="block h-full rounded-pill bg-brand" style={{ width: `${value}%` }} />
    </span>
  );
}

function OperatingScorePage() {
  const s = operatingScore;
  return (
    <div>
      <PageHeader
        eyebrow="How well the business is being run"
        title="Operating Score"
        backTo="/brief"
        backLabel="Back To CEO Brief"
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <p className="text-label text-tertiary-foreground">Overall</p>
          <p className="mt-1 text-display tabular text-foreground">{s.overall}</p>
          <p className="text-small text-secondary-foreground">out of 100</p>
          <StatusBadge kind="completed" className="mt-3">
            {s.trend}
          </StatusBadge>
          <p className="mt-4 text-small text-secondary-foreground">
            The score reflects what was recorded, not everything that happened. Treat it as a
            prompt for a conversation, not a verdict.
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-h3 text-foreground">By Category</h2>
          <ul className="mt-4 space-y-4">
            {s.categories.map((c) => (
              <li key={c.name}>
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-body text-foreground">{c.name}</span>
                  <span className="tabular text-body text-secondary-foreground">{c.value}</span>
                </div>
                <Bar value={c.value} />
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Tasks Done", value: s.stats.done },
          { label: "Tasks Open", value: s.stats.open },
          { label: "Tasks Overdue", value: s.stats.overdue },
          { label: "Complaints Logged", value: s.stats.complaints },
        ].map((t) => (
          <div key={t.label} className="rounded-md border border-hairline bg-surface p-4">
            <p className="text-label text-tertiary-foreground">{t.label}</p>
            <p className="mt-1 text-h2 tabular text-foreground">{t.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-h2 text-foreground">Team</h2>
        <ul className="space-y-2">
          {s.team.map((m) => (
            <li key={m.name}>
              <Card compact className="flex flex-wrap items-center gap-3">
                <Avatar name={m.name} />
                <div className="min-w-40 flex-1">
                  <p className="text-body-strong text-foreground">{m.name}</p>
                  <p className="text-small text-tertiary-foreground">{m.role}</p>
                </div>
                <div className="w-40">
                  <Bar value={m.score} />
                </div>
                <span className="tabular text-body text-foreground">{m.score}</span>
                <span className="text-small tabular text-secondary-foreground">
                  {m.done} done · {m.open} open
                </span>
                <Btn size="sm" variant="secondary" asChild>
                  <Link to="/coach">Open Coaching</Link>
                </Btn>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
