import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Btn,
  Card,
  CountBadge,
  EmptyState,
  Field,
  FilterPill,
  PageHeader,
  PriorityBadge,
  Quarters,
  Rule,
  SectionHeading,
  Segmented,
  Skel,
  StatusBadge,
  TextArea,
  TextInput,
} from "@/components/ds";
import { Avatar, PersonChip, SourceLabel } from "@/components/ds/bits";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System - DecisionOS" },
      {
        name: "description",
        content:
          "The DecisionOS component gallery: colour, type, buttons, badges, cards, forms and states.",
      },
      { property: "og:title", content: "Design System - DecisionOS" },
      { property: "og:description", content: "Every primitive in one place." },
    ],
  }),
  component: DesignSystemPage,
});

function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-h3 text-foreground">{title}</h2>
      <Card className="flex flex-wrap items-center gap-3">{children}</Card>
    </section>
  );
}

const swatches = [
  ["Brand", "var(--brand-600)"],
  ["Brand hover", "var(--brand-700)"],
  ["Brand tint", "var(--brand-50)"],
  ["Danger", "var(--danger-600)"],
  ["Caution", "var(--caution-600)"],
  ["Success", "var(--success-600)"],
  ["Surface", "var(--surface)"],
  ["Sunken", "var(--surface-sunken)"],
  ["Hairline", "var(--hairline)"],
  ["Text primary", "var(--text-primary)"],
  ["Text secondary", "var(--text-secondary)"],
  ["Text tertiary", "var(--text-tertiary)"],
] as const;

function DesignSystemPage() {
  const [seg, setSeg] = React.useState<"Grouped" | "Board">("Grouped");
  const [pill, setPill] = React.useState("All");
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 lg:px-8">
      <PageHeader title="Design System" />

      <div className="space-y-8">
        <section className="space-y-3">
          <h2 className="text-h3 text-foreground">Colour</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {swatches.map(([name, value]) => (
              <div key={name} className="rounded-md border border-hairline bg-surface p-3">
                <span
                  className="block h-10 w-full rounded-sm border border-hairline"
                  style={{ backgroundColor: value }}
                  aria-hidden="true"
                />
                <p className="mt-2 text-label text-tertiary-foreground">{name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3 text-foreground">Typography</h2>
          <Card className="space-y-2">
            <p className="text-display text-foreground">Display - the morning surface</p>
            <p className="text-h1 text-foreground">Heading one</p>
            <p className="text-h2 text-foreground">Heading two</p>
            <p className="text-h3 text-foreground">Heading three</p>
            <p className="text-lead text-secondary-foreground">
              Lead text carries the sentence that explains the screen.
            </p>
            <p className="text-body text-foreground">
              Body text is the default. Sentence case throughout - nothing is set in capitals.
            </p>
            <p className="text-body-strong text-foreground">Body strong for record titles.</p>
            <p className="text-small text-secondary-foreground">Small text for supporting detail.</p>
            <p className="text-label text-tertiary-foreground">Label text for metadata</p>
            <p className="text-code text-foreground">Monospace only inside the terminal</p>
            <p className="tabular text-body text-foreground">{inr(1015000)}</p>
          </Card>
        </section>

        <Row title="Buttons">
          <Btn variant="primary">Primary</Btn>
          <Btn variant="secondary">Secondary</Btn>
          <Btn variant="tertiary">Tertiary</Btn>
          <Btn variant="destructive">Destructive</Btn>
          <Btn variant="primary" loading={loading} onClick={() => setLoading((l) => !l)}>
            Toggle Busy
          </Btn>
          <Btn variant="primary" disabled>
            Disabled
          </Btn>
          <Btn size="sm">Small</Btn>
          <Btn size="lg">Large</Btn>
        </Row>

        <Row title="Badges">
          <StatusBadge kind="pending">Pending</StatusBadge>
          <StatusBadge kind="directive">Direction</StatusBadge>
          <StatusBadge kind="overdue">Overdue</StatusBadge>
          <StatusBadge kind="completed">Completed</StatusBadge>
          <StatusBadge kind="rejected">Rejected</StatusBadge>
          <StatusBadge kind="neutral">Neutral</StatusBadge>
          <PriorityBadge priority="high" />
          <PriorityBadge priority="medium" />
          <PriorityBadge priority="low" />
          <CountBadge count={3} />
          <CountBadge count={2} tone="danger" />
          <CountBadge count={7} tone="brand" />
        </Row>

        <Row title="People & Sources">
          <Avatar name="Meena Raghavan" />
          <PersonChip name="Ravi Kumar" />
          <SourceLabel source="voice" />
          <SourceLabel source="whatsapp" />
          <SourceLabel source="text" />
          <SourceLabel source="upload" />
        </Row>

        <section className="space-y-3">
          <h2 className="text-h3 text-foreground">Cards &amp; Urgency Edges</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["overdue", "today", "week", "later"] as const).map((u) => (
              <Card key={u} urgency={u}>
                <p className="pl-2 text-body-strong text-foreground">Urgency: {u}</p>
                <p className="pl-2 text-small text-secondary-foreground">
                  A three-pixel edge carries the urgency so the card body stays calm.
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3 text-foreground">Forms</h2>
          <Card className="grid gap-3 sm:grid-cols-2">
            <Field label="Text Input" htmlFor="ds-1" hint="A short hint sits under the field.">
              <TextInput id="ds-1" placeholder="Type here…" />
            </Field>
            <Field label="With An Error" htmlFor="ds-2" error="This field is required.">
              <TextInput id="ds-2" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Text Area" htmlFor="ds-3">
                <TextArea id="ds-3" rows={3} placeholder="Longer notes go here…" />
              </Field>
            </div>
          </Card>
        </section>

        <Row title="Segmented & Filters">
          <Segmented
            options={["Grouped", "Board"] as const}
            value={seg}
            onChange={setSeg}
            label="Example view"
          />
          {["All", "Open", "Done"].map((p) => (
            <FilterPill key={p} label={p} count={4} active={pill === p} onClick={() => setPill(p)} />
          ))}
          <Quarters value={50} />
        </Row>

        <section className="space-y-3">
          <h2 className="text-h3 text-foreground">Section Heading</h2>
          <Card>
            <SectionHeading title="Tasks & Activity" sub="Everything else, in one stream." count={12}>
              <Btn size="sm" variant="tertiary">
                Filter
              </Btn>
            </SectionHeading>
            <Rule />
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3 text-foreground">States</h2>
          <EmptyState
            title="Nothing Needs You Right Now."
            helper="New captures, escalations and approvals will appear here."
            action={<Btn variant="secondary">Capture Something</Btn>}
          />
          <Card className="space-y-2">
            <Skel className="h-4 w-2/3" />
            <Skel className="h-4 w-1/2" />
            <Skel className="h-4 w-1/3" />
          </Card>
        </section>

        <section className="space-y-3">
          <h2 className="text-h3 text-foreground">Terminal</h2>
          <div className="rounded-lg bg-terminal-bg p-5 text-code text-terminal-fg">
            <p className="text-terminal-label">&gt; Ask AI - grounded in your company data.</p>
            <p className="text-terminal-dim">&gt; thinking…</p>
            <p className="mt-2">
              Six purchases are waiting on you, worth {inr(1015000)} in total.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
