import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, Trash2, Paperclip } from "lucide-react";
import {
  Btn,
  Card,
  EmptyState,
  Field,
  FilterPill,
  Meta,
  PageHeader,
  Select,
  SelectWithOther,
  PriorityBadge,
  SectionHeading,
  Segmented,
  StatusBadge,
  TextInput,
  type Urgency,
} from "@/components/ds";
import { AiBtn } from "@/components/ds/ai";
import { useIsMobile } from "@/hooks/use-mobile";
import { VoiceTextArea } from "@/components/ds/voice";
import { leaves, people, pipelines, tasks, type Task } from "@/data/demo";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

const assigneeOptions = [
  ...people.filter((p) => p.type === "employee").map((p) => p.name),
  "Sales",
  "Operations",
  "Finance",
];
const approverOptions = people.filter((p) => p.type === "employee").map((p) => p.name);
const counterpartyOptions = people.filter((p) => p.type !== "employee").map((p) => p.name);

export const Route = createFileRoute("/_shell/my-work")({
  head: () => ({
    meta: [
      { title: "My Work - DecisionOS" },
      {
        name: "description",
        content:
          "Execute the work: tasks grouped by urgency, a status board, operational pipelines and leave.",
      },
      { property: "og:title", content: "My Work - DecisionOS" },
      { property: "og:description", content: "Where the decisions become finished work." },
    ],
  }),
  component: MyWorkPage,
});

const views = ["My Work", "Board", "Workflows", "Leave"] as const;
const scopes = ["My Tasks", "All Tasks"] as const;

function groupOf(t: Task): Urgency {
  if (t.dueInDays < 0) return "overdue";
  if (t.dueInDays === 0) return "today";
  if (t.dueInDays <= 7) return "week";
  return "later";
}

const statusLabels = {
  todo: "To Do",
  in_progress: "In Progress",
  blocked: "Blocked",
  done: "Done",
} as const;

function TaskCard({
  task,
  aiScore,
  dense = false,
}: {
  task: Task;
  aiScore?: number;
  dense?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [steps, setSteps] = React.useState(task.steps ?? []);

  const move = (i: number, dir: -1 | 1) => {
    setSteps((s) => {
      const next = [...s];
      const j = i + dir;
      if (j < 0 || j >= next.length) return s;
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  };

  const dueLabel =
    task.dueInDays < 0
      ? `Due ${Math.abs(task.dueInDays)} ${Math.abs(task.dueInDays) === 1 ? "day" : "days"} ago`
      : task.dueInDays === 0
        ? "Due today"
        : `Due in ${task.dueInDays} days`;

  const overdue = task.dueInDays < 0;
  const metaItems = [
    <span key="due" className={overdue ? "text-danger-600" : undefined}>
      {dueLabel}
    </span>,
    `${task.progress}% done`,
  ];

  return (
    <Card
      compact
      urgency={groupOf(task) === "overdue" || groupOf(task) === "today" ? groupOf(task) : undefined}
      className="pl-5"
    >
      <div className="flex flex-wrap items-start gap-2">
        <div className="min-w-40 flex-1">
          <p className="text-body-strong text-foreground">{task.title}</p>
          <Meta items={metaItems} className="mt-1" />
        </div>

        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? `Collapse ${task.title}` : `Expand ${task.title}`}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex size-8 items-center justify-center rounded-md text-secondary-foreground hover:bg-surface-hover"
        >
          {open ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-4 border-t border-hairline pt-4">
          <p className="text-body text-secondary-foreground">
            {task.description ?? "No description was captured with this task."}
          </p>

          <Meta
            items={[
              task.priority === "high" ? <PriorityBadge key="p" priority="high" /> : null,
              task.status !== "todo" ? statusLabels[task.status] : null,
              task.assignee ? `With ${task.assignee}` : null,
              task.requireProof ? "Proof required" : null,
              task.amount ? inr(task.amount) : null,
              typeof aiScore === "number" ? `AI score ${aiScore}` : null,
            ].filter(Boolean)}
          />

          <div>
            <p className="text-label text-tertiary-foreground">Execution Steps</p>
            {steps.length === 0 ? (
              <p className="mt-1 text-small text-secondary-foreground">
                No steps yet - add one if the work needs breaking down.
              </p>
            ) : (
              <ul className="mt-2 space-y-1">
                {steps.map((s, i) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 rounded-md border border-hairline px-3 py-2"
                  >
                    <span className="flex-1 text-small text-foreground">{s}</span>
                    <button
                      type="button"
                      aria-label={`Move "${s}" up`}
                      onClick={() => move(i, -1)}
                      className="rounded-sm p-1 text-secondary-foreground hover:bg-surface-hover"
                    >
                      <ArrowUp className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move "${s}" down`}
                      onClick={() => move(i, 1)}
                      className="rounded-sm p-1 text-secondary-foreground hover:bg-surface-hover"
                    >
                      <ArrowDown className="size-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove "${s}"`}
                      onClick={() => setSteps((x) => x.filter((y) => y !== s))}
                      className="rounded-sm p-1 text-destructive hover:bg-destructive-hover"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Btn size="sm" variant="tertiary" className="mt-2">
              Add Execution Step
            </Btn>
          </div>

          <div>
            <p className="text-label text-tertiary-foreground">Attachments &amp; Proof</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-sm border border-hairline bg-surface-sunken px-2.5 py-1 text-label text-secondary-foreground">
                <Paperclip className="size-3.5" /> GRN-2291.pdf
              </span>
              <Btn size="sm" variant="secondary">
                Upload Proof
              </Btn>
            </div>
            {task.requireProof ? (
              <p className="mt-2 text-small text-secondary-foreground">
                This task cannot be marked done until a photo or document is attached.
              </p>
            ) : null}
          </div>

          <div>
            <p className="text-label text-tertiary-foreground">Comments</p>
            <VoiceTextArea
              rows={2}
              className="mt-2"
              aria-label="Add a comment for the team"
              placeholder="Add a comment for the team…"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Btn size="sm" variant="secondary">
              Set Progress
            </Btn>
            <Btn size="sm" variant="secondary" disabled={task.requireProof}>
              Mark Done
            </Btn>
            <Btn size="sm" variant="secondary">
              Reassign
            </Btn>
            <Btn size="sm" variant="tertiary">
              Escalate To The Founder
            </Btn>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

const workFilters = ["All", "To Do", "In Progress", "Blocked", "Done"] as const;
type WorkFilter = (typeof workFilters)[number];

const filterStatus: Record<Exclude<WorkFilter, "All">, Task["status"]> = {
  "To Do": "todo",
  "In Progress": "in_progress",
  Blocked: "blocked",
  Done: "done",
};

function GroupedView() {
  const [filter, setFilter] = React.useState<WorkFilter>("All");
  const [scope, setScope] = React.useState<(typeof scopes)[number]>("My Tasks");
  const [ai, setAi] = React.useState(false);
  const [scoring, setScoring] = React.useState(false);

  const toggleAi = () => {
    if (ai) {
      setAi(false);
      return;
    }
    setScoring(true);
    window.setTimeout(() => {
      setScoring(false);
      setAi(true);
    }, 900);
  };

  const countOf = (f: WorkFilter) =>
    f === "All"
      ? tasks.filter((t) => t.status !== "done").length
      : tasks.filter((t) => t.status === filterStatus[f]).length;

  const items =
    filter === "All"
      ? tasks.filter((t) => t.status !== "done")
      : tasks.filter((t) => t.status === filterStatus[filter]);

  const sorted = [...items].sort((a, b) => a.dueInDays - b.dueInDays);

  return (
    <div>
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div
          role="group"
          aria-label="Task scope"
          className="inline-flex min-w-0 items-center gap-1 rounded-pill bg-surface-sunken p-1"
        >
          {scopes.map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={scope === s}
              onClick={() => setScope(s)}
              className={cn(
                "h-8 shrink-0 rounded-pill px-3 text-label transition-colors duration-150",
                scope === s
                  ? "bg-surface text-foreground shadow-xs font-semibold"
                  : "text-secondary-foreground hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <AiBtn
          size="sm"
          onClick={toggleAi}
          aria-pressed={ai}
          loading={scoring}
          className="h-9 shrink-0 gap-2 whitespace-nowrap px-3.5 active:scale-95"
        >
          <span>{scoring ? "Scoring…" : ai ? "AI priority is on" : "Prioritise with AI"}</span>
        </AiBtn>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5 sm:gap-2">
        {workFilters.map((f) => (
          <FilterPill
            key={f}
            label={f}
            count={countOf(f)}
            active={filter === f}
            onClick={() => setFilter(f)}
          />
        ))}
      </div>

      {sorted.length === 0 ? (
        <EmptyState title="Nothing Here" helper="You're all caught up!" />
      ) : (
        <ul className="space-y-2">
          {sorted.map((t, i) => (
            <li key={t.id}>
              <TaskCard task={t} {...(ai ? { aiScore: 92 - i * 7 } : {})} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function BoardView() {
  const [dialog, setDialog] = React.useState(false);
  const columns = ["todo", "in_progress", "blocked", "done"] as const;
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Btn variant="primary" onClick={() => setDialog((d) => !d)}>
          New Task
        </Btn>
      </div>

      {dialog ? (
        <Card className="mb-4 space-y-3">
          <h3 className="text-h3 text-foreground">New Task</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" htmlFor="nt-title">
              <TextInput id="nt-title" placeholder="What needs to happen" />
            </Field>
            <Field label="Assignee (Person Or Role)" htmlFor="nt-assignee">
              <Select id="nt-assignee" options={assigneeOptions} placeholder="Choose who owns it" />
            </Field>
            <Field label="Priority" htmlFor="nt-priority">
              <Select
                id="nt-priority"
                options={["High", "Medium", "Low"]}
                placeholder="Choose a priority"
              />
            </Field>
            <Field label="Due Date" htmlFor="nt-due">
              <TextInput id="nt-due" type="date" />
            </Field>
          </div>
          <Field label="Description" htmlFor="nt-desc">
            <VoiceTextArea id="nt-desc" rows={2} placeholder="What does done look like?" />
          </Field>
          <label className="flex items-center gap-2 text-small text-secondary-foreground">
            <input
              type="checkbox"
              className="size-4 rounded-sm border border-hairline-strong accent-[var(--primary-action)]"
            />
            Require Proof Before This Can Be Completed
          </label>
          <div className="flex gap-2">
            <Btn variant="secondary" onClick={() => setDialog(false)}>
              Create Task
            </Btn>
            <Btn variant="tertiary" onClick={() => setDialog(false)}>
              Cancel
            </Btn>
          </div>
        </Card>
      ) : null}

      <div className="no-scrollbar -mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-3">
          {columns.map((c) => {
            const items = tasks.filter((t) => t.status === c);
            return (
              <div key={c} className="w-72 shrink-0 rounded-lg bg-surface-sunken p-3">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-label text-tertiary-foreground">{statusLabels[c]}</p>
                  <span className="text-label tabular text-tertiary-foreground">
                    {items.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {items.length === 0 ? (
                    <p className="px-1 text-small text-tertiary-foreground">
                      No tasks in this column.
                    </p>
                  ) : (
                    items.map((t) => <TaskCard key={t.id} task={t} dense />)
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/** Staged progress rail for a workflow card: done / current / upcoming. */
function StageProgress({ stages, current }: { stages: string[]; current: string }) {
  const idx = Math.max(0, stages.indexOf(current));
  return (
    <ol className="flex items-start gap-1.5" aria-label="Workflow stages">
      {stages.map((s, i) => {
        const state = i < idx ? "done" : i === idx ? "active" : "next";
        return (
          <li key={s} className="min-w-0 flex-1">
            <span
              aria-hidden="true"
              className={cn(
                "block h-1 rounded-pill",
                state === "done" && "bg-success-600",
                state === "active" && "brand-gradient",
                state === "next" && "bg-hairline-strong opacity-60",
              )}
            />
            <span
              className={cn(
                "mt-1.5 block truncate text-meta",
                state === "done" && "text-secondary-foreground",
                state === "active" && "font-semibold text-foreground",
                state === "next" && "text-tertiary-foreground",
              )}
              title={s}
            >
              {s}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function WorkflowsView() {
  const [note, setNote] = React.useState("");
  const [newCard, setNewCard] = React.useState(false);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-end gap-3">
        <Btn variant="primary" onClick={() => setNewCard((n) => !n)}>
          New Pipeline
        </Btn>

      </div>

      {note ? <p className="mb-3 text-small text-secondary-foreground">{note}</p> : null}

      <div className="space-y-8">
        {newCard ? (
          <Card className="space-y-3">
            <h3 className="text-h3 text-foreground">New Card</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Pipeline" htmlFor="pc-pipeline">
                <Select
                  id="pc-pipeline"
                  options={pipelines.map((p) => p.name)}
                  placeholder="Choose a pipeline"
                />
              </Field>
              <Field label="Title" htmlFor="pc-title">
                <TextInput id="pc-title" placeholder="Order or reference number" />
              </Field>
              <Field label="Counterparty" htmlFor="pc-party">
                <Select
                  id="pc-party"
                  options={counterpartyOptions}
                  placeholder="Choose a customer or vendor"
                />
              </Field>
              <Field label="Amount In Rupees" htmlFor="pc-amount">
                <TextInput id="pc-amount" inputMode="numeric" placeholder="Amount in rupees" />
              </Field>
            </div>
            <div className="flex gap-2">
              <Btn variant="secondary" onClick={() => setNewCard(false)}>
                Create Card
              </Btn>
              <Btn variant="tertiary" onClick={() => setNewCard(false)}>
                Cancel
              </Btn>
            </div>
          </Card>
        ) : null}

        {pipelines.map((p) => (
          <section key={p.name}>
            <h2 className="mb-3 text-h3 text-foreground">{p.name}</h2>
            <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
              <div
                className="grid w-max gap-3"
                style={{ gridTemplateColumns: `repeat(${p.stages.length}, minmax(220px, 1fr))` }}
              >
                {p.stages.map((stage, si) => (
                  <div
                    key={stage}
                    className="rounded-lg border border-hairline bg-surface-sunken p-3"
                  >
                    <p className="mb-3 text-label text-tertiary-foreground">{stage}</p>
                    <div className="space-y-2">
                      {p.cards
                        .filter((c) => c.stage === stage)
                        .map((c) => (
                          <Card key={c.id} compact className="space-y-1">
                            <p className="text-body-strong text-foreground">{c.title}</p>
                            <p className="text-small text-secondary-foreground">{c.counterparty}</p>
                            <p className="tabular text-small text-foreground">{inr(c.amount)}</p>
                            <p className="text-label text-tertiary-foreground">
                              Created {c.created}
                            </p>
                            <div className="flex gap-1 pt-1">
                              <Btn
                                size="sm"
                                variant="secondary"
                                onClick={() =>
                                  setNote(
                                    si === p.stages.length - 1
                                      ? `${c.title} is already at the final stage.`
                                      : `${c.title} moved to ${p.stages[si + 1]}.`,
                                  )
                                }
                              >
                                Advance
                              </Btn>
                              <Btn
                                size="sm"
                                variant="tertiary"
                                onClick={() => setNote(`${c.title} deleted.`)}
                              >
                                Delete
                              </Btn>
                            </div>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function LeaveView() {
  const [impact, setImpact] = React.useState(false);
  return (
    <div className="space-y-8">
      <section>
        <SectionHeading title="My Leaves" sub="Your requests and where they stand." />
        <ul className="space-y-2">
          {leaves.map((l) => (
            <li key={l.id}>
              <Card compact className="flex flex-wrap items-center gap-3">
                <span className="min-w-40 flex-1 text-body-strong text-foreground">
                  {l.type} · {l.from} to {l.to}
                </span>
                <span className="text-small text-secondary-foreground">{l.portion}</span>
                <StatusBadge kind={l.status === "approved" ? "completed" : "pending"}>
                  {l.status === "approved" ? "Approved" : "Pending"}
                </StatusBadge>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="space-y-3">
          <h3 className="text-h3 text-foreground">Request Leave</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Leave Type" htmlFor="lv-type">
              <SelectWithOther
                id="lv-type"
                options={["Casual Leave", "Sick Leave", "Earned Leave", "Unpaid Leave"]}
                placeholder="Choose a leave type"
                otherPlaceholder="Tell us the leave type"
              />
            </Field>
            <Field label="Portion" htmlFor="lv-portion">
              <Select
                id="lv-portion"
                options={["Full Day", "Half Day - Morning", "Half Day - Afternoon"]}
                placeholder="Choose a portion"
              />
            </Field>
            <Field label="From" htmlFor="lv-from">
              <TextInput id="lv-from" type="date" />
            </Field>
            <Field label="To" htmlFor="lv-to">
              <TextInput id="lv-to" type="date" />
            </Field>
          </div>
          <Field label="Reason" htmlFor="lv-reason">
            <VoiceTextArea id="lv-reason" rows={2} placeholder="Tell your team why, in a line" />
          </Field>
          <Btn variant="primary" onClick={() => setImpact(true)}>
            Check Impact &amp; Submit
          </Btn>
          {impact ? (
            <div className="rounded-md border border-hairline bg-surface-sunken p-4">
              <p className="text-body-strong text-foreground">Operational Impact</p>
              <ul className="mt-2 space-y-1 text-small text-secondary-foreground">
                <li>
                  2 tasks fall inside these dates - dispatch confirmation and the Delhi quote.
                </li>
                <li>1 pipeline card (Order #4823) has no second owner on those days.</li>
              </ul>
              <Btn size="sm" variant="secondary" className="mt-3">
                Apply To All
              </Btn>
            </div>
          ) : null}
        </Card>

        <Card className="space-y-3">
          <h3 className="text-h3 text-foreground">Report Absence</h3>
          <Field label="Reason" htmlFor="ab-reason">
            <SelectWithOther
              id="ab-reason"
              options={["Unwell", "Travel", "Personal", "Family Emergency"]}
              placeholder="Choose a reason"
              otherPlaceholder="Tell us the reason"
            />
          </Field>
          <Field label="Note" htmlFor="ab-note">
            <VoiceTextArea
              id="ab-note"
              rows={2}
              placeholder="Anything the team should know today"
            />
          </Field>
          <Btn variant="secondary">Report Absence</Btn>
        </Card>
      </section>

      <section>
        <SectionHeading title="Leave Approvals" sub="Requests waiting on you." />
        <Card compact className="flex flex-wrap items-center gap-3">
          <span className="min-w-40 flex-1 text-body-strong text-foreground">
            Ravi Kumar · Casual leave · 12 Aug to 13 Aug
          </span>
          <Btn size="sm" variant="secondary">
            Approve
          </Btn>
          <Btn size="sm" variant="destructive">
            Decline
          </Btn>
        </Card>
      </section>

      <section>
        <SectionHeading
          title="Leave Approvers By Department"
          sub="Who signs off for each department."
        />
        <Card className="space-y-3">
          {["Sales", "Operations", "Finance"].map((d) => (
            <div key={d} className="grid gap-3 sm:grid-cols-2">
              <Field label={d} htmlFor={`ap-${d}`}>
                <Select
                  id={`ap-${d}`}
                  options={approverOptions}
                  defaultValue="Prasanna Narayanan"
                />
              </Field>
            </div>
          ))}
          <Btn variant="secondary">Save Approvers</Btn>
        </Card>
      </section>
    </div>
  );
}

function MyWorkPage() {
  const isMobile = useIsMobile();
  const [view, setView] = React.useState<(typeof views)[number]>("My Work");

  // The Kanban board stays available on tablet and desktop only; on phones the
  // same tasks are shown as the list + status pills instead.
  const available = React.useMemo(
    () => (isMobile ? views.filter((v) => v !== "Board") : views),
    [isMobile],
  );
  const activeView = isMobile && view === "Board" ? "My Work" : view;

  return (
    <div>
      <PageHeader title="My Work" />

      <div className="mb-6">
        <Segmented options={available} value={activeView} onChange={setView} label="Work view" />
      </div>

      {activeView === "My Work" ? <GroupedView /> : null}
      {activeView === "Board" ? <BoardView /> : null}
      {activeView === "Workflows" ? <WorkflowsView /> : null}
      {activeView === "Leave" ? <LeaveView /> : null}
    </div>
  );
}
