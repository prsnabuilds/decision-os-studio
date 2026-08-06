import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Btn, Card, EmptyState, SectionHeading, StatusBadge } from "@/components/ds";
import { Avatar } from "@/components/ds/bits";
import { people } from "@/data/demo";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_shell/contacts/$id")({
  head: () => ({
    meta: [
      { title: "Contact Profile - DecisionOS" },
      {
        name: "description",
        content:
          "Everything about one relationship: decisions, tasks, workflows, invoices, payments and complaints.",
      },
      { property: "og:title", content: "Contact Profile - DecisionOS" },
      { property: "og:description", content: "One relationship, its whole history." },
    ],
  }),
  component: ContactProfile,
  notFoundComponent: ContactMissing,
});

function ContactMissing() {
  return (
    <EmptyState
      title="Contact Not Found"
      helper="This contact may have been removed. Head back to People to find the right one."
      action={
        <Btn variant="secondary" asChild>
          <Link to="/contacts">Back To People</Link>
        </Btn>
      }
    />
  );
}

const history = [
  { kind: "Decision", title: "Delhi retailer wants revised quote", meta: "Pending your approval" },
  { kind: "Task", title: "Send the revised Delhi quote", meta: "Due today · Ravi Kumar" },
  { kind: "Workflow", title: "Order #4823 - Quoted", meta: "Sales orders pipeline" },
  { kind: "Invoice", title: "Invoice #4823", meta: inr(820000) },
  { kind: "Payment", title: "Payment received", meta: inr(998700) },
  { kind: "Complaint", title: "Crushed cartons in the July consignment", meta: "Open" },
];

const signals = [
  "Pays within terms - nine of the last ten invoices settled on or before the due date.",
  "Negotiates on price every quarter; last three asks averaged 7%.",
  "Order volume up 18% year on year.",
  "One open complaint on packaging damage, unresolved for 6 days.",
];

function ContactProfile() {
  const { id } = Route.useParams();
  const person = people.find((p) => p.id === id);
  if (!person) throw notFound();

  return (
    <div>
      <Btn variant="tertiary" size="sm" className="mb-4" asChild>
        <Link to="/contacts">
          <ArrowLeft className="size-4" aria-hidden="true" /> Back To People
        </Link>
      </Btn>

      <Card className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar name={person.name} size={48} />
        <div className="min-w-48 flex-1">
          <h1 className="text-h1 text-foreground">{person.name}</h1>
          <p className="text-small text-secondary-foreground">
            {person.company ?? person.role} · {person.phone} · {person.email}
          </p>
        </div>
        <StatusBadge kind="neutral">
          {person.type === "employee" ? person.role : person.type === "customer" ? "Customer" : "Vendor"}
        </StatusBadge>
        <Btn variant="primary">Edit Details</Btn>
      </Card>

      <Card className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-h3 text-foreground">Relationship Intelligence</h2>
            <p className="mt-1 text-body text-secondary-foreground">
              A reliable, price-sensitive account. The relationship is healthy but the open packaging
              complaint is the thing most likely to cost you the next order.
            </p>
          </div>
          <Btn variant="secondary" size="sm">
            Re-Score
          </Btn>
        </div>
        <div className="mt-4">
          <p className="text-label text-tertiary-foreground">Relationship Signals</p>
          <ul className="mt-2 space-y-1">
            {signals.map((s) => (
              <li key={s} className="text-small text-secondary-foreground">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <section className="mb-6">
        <SectionHeading title="History" count={history.length} />
        <ul className="space-y-2">
          {history.map((h) => (
            <li key={h.title}>
              <Card compact className="flex flex-wrap items-center gap-3">
                <StatusBadge kind="neutral">{h.kind}</StatusBadge>
                <span className="min-w-40 flex-1 text-body text-foreground">{h.title}</span>
                <span className="tabular text-small text-secondary-foreground">{h.meta}</span>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-2">
        <Btn variant="secondary">Log A Complaint</Btn>
        <Btn variant="secondary">Create A Task</Btn>
        <Btn variant="secondary">Start A Workflow</Btn>
      </div>
    </div>
  );
}
