import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Search } from "lucide-react";
import {
  Btn,
  Card,
  EmptyState,
  Field,
  Meta,
  PageHeader,
  SectionHeading,
  StatusBadge,
  Select,
  TextInput,
} from "@/components/ds";

import { Avatar } from "@/components/ds/bits";
import { VoiceInput } from "@/components/ds/voice";
import { people, workspace } from "@/data/demo";

export const Route = createFileRoute("/_shell/contacts/")({
  head: () => ({
    meta: [
      { title: "People — DecisionOS" },
      {
        name: "description",
        content: "Everyone the business deals with — your team, your customers and your vendors.",
      },
      { property: "og:title", content: "People — DecisionOS" },
      { property: "og:description", content: "Team, customers and vendors in one place." },
    ],
  }),
  component: PeoplePage,
});

const statuses = ["All", "Active", "Inactive"] as const;
const ownerOptions = people.filter((p) => p.type === "employee").map((p) => p.name);

function PeoplePage() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<(typeof statuses)[number]>("All");
  const [adding, setAdding] = React.useState(false);
  const [complaintFor, setComplaintFor] = React.useState<string | null>(null);

  const filtered = people.filter(
    (p) =>
      (status === "All" || p.status === status.toLowerCase()) &&
      (p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.company ?? "").toLowerCase().includes(query.toLowerCase())),
  );

  const groups = [
    { label: "Employees", items: filtered.filter((p) => p.type === "employee") },
    { label: workspace.customerLabel, items: filtered.filter((p) => p.type === "customer") },
    { label: workspace.vendorLabel, items: filtered.filter((p) => p.type === "vendor") },
  ];

  const hidden = people.length - filtered.length;

  return (
    <div>
      <PageHeader
        title="People"
      >
        <Btn variant="primary" onClick={() => setAdding((a) => !a)}>
          Add Contact
        </Btn>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <div className="min-w-60 flex-1">
          <Field label="Search" htmlFor="people-search">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-tertiary-foreground"
                aria-hidden="true"
              />
              <TextInput
                id="people-search"
                className="pl-9"
                placeholder="Search by name or company"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </Field>
        </div>
        <Field label="Status" htmlFor="people-status">
          <Select
            id="people-status"
            className="w-44"
            options={statuses}
            value={status}
            onChange={(e) => setStatus(e.target.value as (typeof statuses)[number])}
          />
        </Field>
      </div>

      <p className="mb-4 text-small text-secondary-foreground">
        {hidden > 0
          ? `${hidden} contacts hidden by the current search and filter.`
          : "Nothing is hidden."}
      </p>

      {adding ? (
        <Card className="mb-6 space-y-3">
          <h2 className="text-h3 text-foreground">Add Contact</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Name" htmlFor="ac-name">
              <TextInput id="ac-name" placeholder="Full name" />
            </Field>
            <Field label="Company" htmlFor="ac-company">
              <TextInput id="ac-company" placeholder="Company name" />
            </Field>
            <Field label="Phone" htmlFor="ac-phone">
              <TextInput id="ac-phone" inputMode="tel" placeholder="Mobile number" />
            </Field>
            <Field label="Email" htmlFor="ac-email">
              <TextInput id="ac-email" type="email" placeholder="Email address" />
            </Field>
            <Field label="Birthday" htmlFor="ac-birthday">
              <TextInput id="ac-birthday" type="date" />
            </Field>
            <Field label="Type" htmlFor="ac-type">
              <Select
                id="ac-type"
                options={["Customer", "Vendor", "Employee"]}
                placeholder="Choose a type"
              />
            </Field>
            <Field label="Status" htmlFor="ac-status">
              <Select id="ac-status" options={["Active", "Inactive"]} defaultValue="Active" />
            </Field>
            <Field label="Assigned Owner" htmlFor="ac-owner">
              <Select id="ac-owner" options={ownerOptions} placeholder="Choose an owner" />
            </Field>
          </div>
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => setAdding(false)}>
              Save Contact
            </Btn>
            <Btn variant="tertiary" onClick={() => setAdding(false)}>
              Cancel
            </Btn>
          </div>
        </Card>
      ) : null}

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.label}>
            <SectionHeading title={g.label} count={g.items.length} />
            {g.items.length === 0 ? (
              <EmptyState
                title="Nothing Matches This Filter"
                helper="Clear the search or change the status filter to see the rest."
              />
            ) : (
              <ul className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {g.items.map((p) => (
                  <li key={p.id}>
                    <Card compact interactive className="h-full">
                      <div className="flex items-start gap-3">
                        <Avatar name={p.name} size={36} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-body-strong text-foreground">{p.name}</p>
                          <Meta
                            items={[
                              p.type === "employee"
                                ? p.role
                                : p.type === "customer"
                                  ? "Customer"
                                  : "Vendor",
                              p.company ?? null,
                              p.phone,
                            ].filter(Boolean)}
                          />
                        </div>
                        {p.status === "inactive" ? (
                          <StatusBadge kind="neutral">Inactive</StatusBadge>
                        ) : null}
                      </div>
                      <div className="mt-3 flex items-center gap-1">
                        <Btn size="sm" variant="secondary" asChild>
                          <Link to="/contacts/$id" params={{ id: p.id }}>
                            Open <ChevronRight className="size-4" aria-hidden="true" />
                          </Link>
                        </Btn>
                        <Btn
                          size="sm"
                          variant="tertiary"
                          onClick={() => setComplaintFor(complaintFor === p.id ? null : p.id)}
                        >
                          Log Complaint
                        </Btn>
                      </div>
                      {complaintFor === p.id ? (
                        <div className="mt-3 flex w-full items-end gap-2 border-t border-hairline pt-3">
                          <div className="flex-1">
                            <Field label="Complaint" htmlFor={`comp-${p.id}`}>
                              <VoiceInput
                                id={`comp-${p.id}`}
                                micLabel="Speak The Complaint"
                                placeholder="What went wrong?"
                              />
                            </Field>
                          </div>
                          <Btn size="sm" variant="secondary" onClick={() => setComplaintFor(null)}>
                            Save
                          </Btn>
                        </div>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ul>

            )}
          </section>
        ))}
      </div>
    </div>
  );
}
