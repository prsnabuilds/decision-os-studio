import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, ArrowUp, ArrowDown, Trash2, Paperclip } from "lucide-react";
import {
  Btn,
  Card,
  EmptyState,
  Field,
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
const counterpartyOptions = people
  .filter((p) => p.type !== "employee")
  .map((p) => p.name);

export const Route = createFileRoute("/_shell/my-work")({
  head: () => ({
    meta: [
      { title: "My Work — DecisionOS" },
      {
        name: "description",
        content:
          "Execute the work: tasks grouped by urgency, a status board, operational pipelines and leave.",
      },
      { property: "og:title", content: "My Work — DecisionOS" },
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

const groupLabels: Record<Urgency, string> = {
  overdue: "Overdue",
  today: "Today",
  week: "This Week",
  later: "Later",
};

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

  const metaItems = dense
    ? [task.assignee, dueLabel].filter(Boolean)
    : [
        task.priority === "high" ? <PriorityBadge priority="high" /> : null,
        task.status !== "todo" ? statusLabels[task.status] : null,
        task.assignee,
        dueLabel,
        task.requireProof ? "Proof required" : null,
        `${task.progress}% done`,
        typeof aiScore === "number" ? `AI score ${aiScore}` : null,
      ].filter(Boolean);

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
          {dense && task.amount ? (
            <p className="mt-1 tabular text-small text-secondary-foreground">{inr(task.amount)}</p>
          ) : null}
        </div>
        {!dense && task.amount ? (
          <span className="tabular text-body-strong text-foreground">{inr(task.amount)}</span>
        ) : null}

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

          <div>
            <p className="text-label text-tertiary-foreground">Execution Steps</p>
            {steps.length === 0 ? (
              <p className="mt-1 text-small text-secondary-foreground">
                No steps yet — add one if the work needs breaking down.
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

function GroupedView({ aiPriority }: { aiPriority: boolean }) {
  const [collapsed, setCollapsed] = React.useState<Record<string, boolean>>({
    today: false,
    week: true,
    later: true,
  });
  const order: Urgency[] = ["overdue", "today", "week", "later"];
  const active = tasks.filter((t) => t.status !== "done");

  return (
    <div className="space-y-6">
      {order.map((g) => {
        const items = active.filter((t) => groupOf(t) === g);
        const isCollapsed = collapsed[g] ?? false;
        return (
          <section key={g}>
            <button
              type="button"
              onClick={() => setCollapsed((c) => ({ ...c, [g]: !isCollapsed }))}
              aria-expanded={!isCollapsed}
              className="mb-3 flex w-full items-center gap-2 text-left"
            >
              {isCollapsed ? (
                <ChevronRight className="size-4 text-secondary-foreground" />
              ) : (
                <ChevronDown className="size-4 text-secondary-foreground" />
              )}
              <h2 className="text-h3 text-foreground">{groupLabels[g]}</h2>
              <span className="text-label tabular text-tertiary-foreground">
                {items.length} {items.length === 1 ? "task" : "tasks"}
              </span>
            </button>
            {isCollapsed ? (
              <p className="pl-6 text-small text-secondary-foreground">
                {items.length} hidden in this group.
              </p>
            ) : items.length === 0 ? (
              <EmptyState title="Nothing Here" helper="You're all caught up!" />
            ) : (
              <ul className="space-y-2">
                {items.map((t, i) => (
                  <li key={t.id}>
                    <TaskCard task={t} {...(aiPriority ? { aiScore: 92 - i * 7 } : {})} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}
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
              <Select id="nt-priority" options={["High", "Medium", "Low"]} placeholder="Choose a priority" />
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

      <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        <div className="flex min-w-max gap-3">
        {columns.map((c) => {
          const items = tasks.filter((t) => t.status === c);
          return (
            <div key={c} className="w-72 shrink-0 rounded-lg bg-surface-sunken p-3">

              <div className="mb-3 flex items-center justify-between">
                <p className="text-label text-tertiary-foreground">{statusLabels[c]}</p>
                <span className="text-label tabular text-tertiary-foreground">{items.length}</span>
              </div>
              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="px-1 text-small text-tertiary-foreground">No tasks in this column.</p>
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

function WorkflowsView() {
  const [tab, setTab] = React.useState<"Pipelines" | "Task Board">("Pipelines");
  const [note, setNote] = React.useState("");
  const [newCard, setNewCard] = React.useState(false);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Segmented
          options={["Pipelines", "Task Board"] as const}
          value={tab}
          onChange={setTab}
          label="Workflow view"
        />
        {tab === "Pipelines" ? (
          <Btn variant="primary" onClick={() => setNewCard((n) => !n)}>
            New Pipeline Card
          </Btn>
        ) : null}
      </div>

      {note ? <p className="mb-3 text-small text-secondary-foreground">{note}</p> : null}

      {tab === "Task Board" ? (
        <BoardView />
      ) : (
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
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(${p.stages.length}, minmax(200px, 1fr))` }}
              >
                {p.stages.map((stage, si) => (
                  <div key={stage} className="rounded-lg border border-hairline bg-surface-sunken p-3">
                    <p className="mb-3 text-label text-tertiary-foreground">{stage}</p>
                    <div className="space-y-2">
                      {p.cards
                        .filter((c) => c.stage === stage)
                        .map((c) => (
                          <Card key={c.id} compact className="space-y-1">
                            <p className="text-body-strong text-foreground">{c.title}</p>
                            <p className="text-small text-secondary-foreground">{c.counterparty}</p>
                            <p className="tabular text-small text-foreground">{inr(c.amount)}</p>
                            <p className="text-label text-tertiary-foreground">Created {c.created}</p>
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
            </section>
          ))}
        </div>
      )}
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
                  {l.type} · {l.from} – {l.to}
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
                options={["Full Day", "Half Day — Morning", "Half Day — Afternoon"]}
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
                <li>2 tasks fall inside these dates — dispatch confirmation and the Delhi quote.</li>
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
            <VoiceTextArea id="ab-note" rows={2} placeholder="Anything the team should know today" />
          </Field>
          <Btn variant="secondary">Report Absence</Btn>
        </Card>
      </section>

      <section>
        <SectionHeading title="Leave Approvals" sub="Requests waiting on you." />
        <Card compact className="flex flex-wrap items-center gap-3">
          <span className="min-w-40 flex-1 text-body-strong text-foreground">
            Ravi Kumar · Casual leave · 12 Aug – 13 Aug
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
                <Select id={`ap-${d}`} options={approverOptions} defaultValue="Prasanna Narayanan" />
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
  const [view, setView] = React.useState<(typeof views)[number]>("My Work");
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

  return (
    <div>
      <PageHeader eyebrow="Where decisions become finished work" title="My Work" />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Segmented options={views} value={view} onChange={setView} label="Work view" />
        <Segmented options={scopes} value={scope} onChange={setScope} label="Task scope" />
        <AiBtn
          size="sm"
          onClick={toggleAi}
          aria-pressed={ai}
          loading={scoring}
          className={cn(!ai && "bg-surface text-secondary-foreground border-hairline")}
        >
          {scoring ? "Scoring…" : ai ? "AI Priority Is On" : "Prioritise With AI"}
        </AiBtn>
      </div>

      {view === "My Work" ? <GroupedView aiPriority={ai} /> : null}
      {view === "Board" ? <BoardView /> : null}
      {view === "Workflows" ? <WorkflowsView /> : null}
      {view === "Leave" ? <LeaveView /> : null}
    </div>
  );
}
