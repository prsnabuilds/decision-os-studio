import * as React from "react";
import {
  Check,
  X,
  LayoutGrid,
  User,
  Truck,
  FileText,
  IndianRupee,
  MessageSquareWarning,
  ListChecks,
  Stamp,
  Bell,
} from "lucide-react";
import { Btn, Card, EmptyState, FilterPill, IconBtn, StatusBadge } from "@/components/ds";
import { SourceLabel } from "@/components/ds/bits";
import { feed, type FeedClass, type FeedItem } from "@/data/demo";
import { inr } from "@/lib/format";

const classIcons: Record<FeedClass, React.ComponentType<{ className?: string }>> = {
  Customer: User,
  Supplier: Truck,
  Invoice: FileText,
  Payment: IndianRupee,
  Complaint: MessageSquareWarning,
  Task: ListChecks,
  Approval: Stamp,
  Reminder: Bell,
};

const filters: ("All" | FeedClass)[] = [
  "All",
  "Customer",
  "Supplier",
  "Invoice",
  "Payment",
  "Complaint",
  "Task",
  "Approval",
  "Reminder",
];

function needsToday(item: FeedItem) {
  return item.urgency === "overdue" || item.urgency === "today";
}

export function TasksAndActivity() {
  const [filter, setFilter] = React.useState<"All" | FeedClass>("All");
  const [showEverything, setShowEverything] = React.useState(false);

  const byFilter = feed.filter((f) => filter === "All" || f.classification === filter);
  const visible = showEverything ? byFilter : byFilter.filter(needsToday);
  const hiddenCount = byFilter.length - visible.length;

  const counts = (c: "All" | FeedClass) =>
    c === "All" ? feed.length : feed.filter((f) => f.classification === c).length;

  return (
    <section aria-labelledby="feed-heading">
      <h2 id="feed-heading" className="mb-4 text-h2 text-foreground">
        Tasks &amp; Activity
      </h2>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((f) => (
          <FilterPill
            key={f}
            label={f}
            count={counts(f)}
            active={filter === f}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      {visible.length === 0 ? (
        byFilter.length === 0 ? (
          <EmptyState
            title="Inbox Zero"
            helper="Captured voice notes, uploads, invoices, payments and complaints will appear here — classified automatically."
          />
        ) : (
          <EmptyState
            title="Nothing In The Feed Needs You Today"
            helper="Everything here is either scheduled for later or already closed."
            action={
              <Btn variant="secondary" onClick={() => setShowEverything(true)}>
                Show Everything ({byFilter.length})
              </Btn>
            }
          />
        )
      ) : (
        <ul className="space-y-1.5">
          {visible.map((item) => {
            const Icon = classIcons[item.classification];
            return (
              <li key={item.id}>
                <Card
                  compact
                  interactive
                  urgency={
                    item.urgency === "overdue"
                      ? "overdue"
                      : item.urgency === "today"
                        ? "today"
                        : undefined
                  }
                  className="group flex flex-wrap items-center gap-3 pl-5"
                >
                  <div className="min-w-48 flex-1">
                    <p className="text-body-strong text-foreground">{item.title}</p>
                    <Meta
                      items={[
                        <>
                          <Icon className="size-3.5" aria-hidden="true" />
                          {item.classification}
                        </>,
                        <SourceLabel source={item.source} />,
                        item.duplicates ? `${item.duplicates}× captured` : null,
                        <span className="truncate">{item.preview}</span>,
                      ].filter(Boolean)}
                    />
                  </div>
                  {item.amount ? (
                    <span className="tabular text-body-strong text-foreground">
                      {inr(item.amount)}
                    </span>
                  ) : null}
                  <div className="flex items-center gap-1">
                    {item.status === "pending" ? (
                      <Btn size="sm" variant="secondary">
                        Approve
                      </Btn>
                    ) : null}
                    <IconBtn label="Open On The Board">
                      <LayoutGrid className="size-4" />
                    </IconBtn>
                    <IconBtn label="Mark Done">
                      <Check className="size-4" />
                    </IconBtn>
                    <IconBtn label="Dismiss">
                      <X className="size-4" />
                    </IconBtn>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>

      )}

      {/* Rendered unconditionally — the disclosure rule. */}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Btn variant="secondary" onClick={() => setShowEverything((s) => !s)}>
          {showEverything
            ? "Show Only What Needs You Today"
            : `Show Everything (${byFilter.length})`}
        </Btn>
        <p className="text-small text-secondary-foreground">
          {showEverything
            ? `Showing all ${byFilter.length}.`
            : hiddenCount > 0
              ? `${hiddenCount} not needed today — scheduled later or already closed.`
              : "Nothing is hidden."}
        </p>
      </div>
    </section>
  );
}
