import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card, EmptyState, PageHeader, StatusBadge } from "@/components/ds";
import { notifications as seed } from "@/data/demo";
import { relativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — DecisionOS" },
      {
        name: "description",
        content: "Escalations, approvals and updates from your team, newest first.",
      },
      { property: "og:title", content: "Notifications — DecisionOS" },
      { property: "og:description", content: "Everything that happened while you were away." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const [items, setItems] = React.useState(seed);
  const groups = [
    { label: "Today", items: items.filter((n) => n.hoursAgo < 24) },
    { label: "Earlier This Week", items: items.filter((n) => n.hoursAgo >= 24) },
  ];
  const unread = items.filter((n) => n.unread).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        backTo="/inbox"
        backLabel="Back To Decision Desk"
      >
        <Btn
          variant="primary"
          onClick={() => setItems((xs) => xs.map((x) => ({ ...x, unread: false })))}
        >
          Mark All Read
        </Btn>
      </PageHeader>

      {items.length === 0 ? (
        <EmptyState
          title="You're All Caught Up."
          helper="Escalations, approvals and task updates will appear here as they happen."
        />
      ) : (
        <div className="space-y-8">
          {groups.map((g) => (
            <section key={g.label}>
              <h2 className="mb-3 text-h3 text-foreground">
                {g.label}{" "}
                <span className="text-label tabular text-tertiary-foreground">
                  {g.items.length}
                </span>
              </h2>
              <ul className="space-y-2">
                {g.items.map((n) => (
                  <li key={n.id}>
                    <Card compact interactive className="flex flex-wrap items-center gap-3">
                      <StatusBadge kind="neutral">{n.type}</StatusBadge>
                      <div className="min-w-48 flex-1">
                        <p
                          className={cn(
                            n.unread
                              ? "text-body-strong text-foreground"
                              : "text-body text-tertiary-foreground",
                          )}
                        >
                          {n.title}
                        </p>
                        <p className="text-small text-tertiary-foreground">{n.from}</p>
                      </div>
                      <span className="text-label text-tertiary-foreground">
                        {relativeTime(n.hoursAgo)}
                      </span>
                      <Btn size="sm" variant="tertiary">
                        Open Record
                      </Btn>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
