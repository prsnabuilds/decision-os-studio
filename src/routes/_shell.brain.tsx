import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card, EmptyState, PageHeader, Segmented, StatusBadge } from "@/components/ds";
import { AiBtn } from "@/components/ds/ai";
import { VoiceInput } from "@/components/ds/voice";

export const Route = createFileRoute("/_shell/brain")({
  head: () => ({
    meta: [
      { title: "Company Brain — DecisionOS" },
      {
        name: "description",
        content:
          "Institutional memory: ask a grounded question about your operations or search every decision, task and workflow.",
      },
      { property: "og:title", content: "Company Brain — DecisionOS" },
      { property: "og:description", content: "Everything your business knows, retrievable." },
    ],
  }),
  component: BrainPage,
});

const suggestions = [
  "What purchases need my approval?",
  "Which tasks are overdue?",
  "Summarise open sales orders",
  "What did I decide about festive stock?",
];

const answer = {
  text: "Six purchases are waiting on you, worth ₹10,15,000 in total. The oldest is the supplier payment timing decision, raised three days ago on a ₹4,80,000 payment to Acme Packaging. The largest single exposure is the ₹6,10,000 monsoon leak repair quote, which expires on Friday.",
  sources: [
    "Decision · Approve supplier payment timing",
    "Decision · Write off the damaged carton stock",
    "Task · Confirm the monsoon leak repair quote",
    "Invoice · AP-2291 — Acme Packaging",
  ],
};

const searchResults = [
  {
    group: "Decisions",
    items: [
      { title: "Approve supplier payment timing", links: 2, tasks: ["Reschedule the Acme payment", "Confirm the window"] },
      { title: "Extend credit terms for the Coimbatore distributor", links: 1, tasks: ["Update the credit terms"] },
    ],
  },
  {
    group: "Tasks",
    items: [
      { title: "Reconcile packaging invoice against the GRN", links: 3, tasks: [] },
      { title: "Chase the Salem retailer receivable", links: 1, tasks: [] },
    ],
  },
  {
    group: "Workflows",
    items: [{ title: "Order #4823 — Delhi Retail Mart", links: 4, tasks: [] }],
  },
  {
    group: "Contacts",
    items: [{ title: "Acme Packaging", links: 6, tasks: [] }],
  },
  {
    group: "Company Memory",
    items: [{ title: "Packaging rate held until October", links: 2, tasks: [] }],
  },
];

function Terminal({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-terminal-bg p-5 text-code text-terminal-fg">{children}</div>
  );
}

function AskTab() {
  const [state, setState] = React.useState<"idle" | "thinking" | "answered" | "error">("idle");
  const [question, setQuestion] = React.useState("");

  const ask = (q: string) => {
    setQuestion(q);
    setState("thinking");
    window.setTimeout(() => setState("answered"), 1100);
  };

  return (
    <div className="space-y-4">
      <Terminal>
        <p className="text-terminal-label">&gt; DecisionOS Ask AI — grounded in your company data.</p>
        <p className="text-terminal-dim">&gt; Try one of the queries below to begin.</p>
        {question ? <p className="mt-3">&gt; {question}</p> : null}
        {state === "thinking" ? <p className="mt-2 text-terminal-dim">&gt; thinking…</p> : null}
        {state === "answered" ? (
          <div className="mt-3 space-y-3">
            <p className="whitespace-pre-line">{answer.text}</p>
            <div className="rounded-md bg-terminal-row p-3">
              <p className="text-terminal-label">Sources:</p>
              <ul className="mt-1 space-y-0.5">
                {answer.sources.map((s) => (
                  <li key={s} className="text-terminal-dim">
                    · {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
        {state === "error" ? (
          <p className="mt-2 text-terminal-dim">AI service error. Please try again.</p>
        ) : null}
      </Terminal>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => ask(s)}
            className="inline-flex h-8 items-center rounded-pill border border-hairline bg-surface px-3 text-label text-secondary-foreground transition-colors duration-150 hover:bg-surface-hover"
          >
            {s}
          </button>
        ))}
      </div>

      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question || suggestions[0]!);
        }}
      >
        <VoiceInput
          aria-label="Ask anything about your operations"
          className="min-w-60 flex-1"
          micLabel="Speak Your Question"
          placeholder="Ask anything about your operations…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <AiBtn type="submit" loading={state === "thinking"}>
          Ask The Brain
        </AiBtn>
      </form>
    </div>
  );
}

function SearchTab() {
  const [query, setQuery] = React.useState("");
  const [searched, setSearched] = React.useState(false);

  const results = searchResults
    .map((g) => ({
      ...g,
      items: g.items.filter((i) => i.title.toLowerCase().includes(query.toLowerCase())),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="space-y-4">
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setSearched(true);
        }}
      >
        <VoiceInput
          aria-label="Search decisions, tasks, workflows"
          className="min-w-60 flex-1"
          micLabel="Speak Your Search"
          placeholder="Search decisions, tasks, workflows…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Btn variant="primary" type="submit">
          Search
        </Btn>
      </form>
      <p className="text-small text-secondary-foreground">
        Find the exact records — decisions, tasks, workflows, contacts &amp; more that match your
        words.
      </p>

      {!searched ? (
        <EmptyState
          title="Search The Company Brain"
          helper="Trace any founder decision to the tasks and workflows it created."
        />
      ) : results.length === 0 ? (
        <EmptyState title="No Matches" helper="No records match those words. Try fewer of them." />
      ) : (
        <div className="space-y-6">
          {results.map((g) => (
            <section key={g.group}>
              <div className="mb-2 flex items-center gap-2">
                <h3 className="text-h3 text-foreground">{g.group}</h3>
                <span className="text-label tabular text-tertiary-foreground">
                  {g.items.length}
                </span>
              </div>
              <ul className="space-y-2">
                {g.items.map((i) => (
                  <li key={i.title}>
                    <Card compact>
                      <p className="text-body-strong text-foreground">{i.title}</p>
                      <p className="text-small text-secondary-foreground">
                        {i.links} linked {i.links === 1 ? "record" : "records"}
                      </p>
                      {i.tasks.length ? (
                        <ul className="mt-2 flex flex-wrap gap-1.5">
                          {i.tasks.map((t) => (
                            <li key={t}>
                              <StatusBadge kind="neutral">{t}</StatusBadge>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          <Card compact>
            <p className="text-small text-secondary-foreground">
              Finance records are permission-gated. Ask an owner if you need access to invoices and
              payments in search.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}

function BrainPage() {
  const [tab, setTab] = React.useState<"Ask" | "Search">("Ask");
  return (
    <div>
      <PageHeader title="Company Brain" />
      <div className="mb-2">
        <Segmented options={["Ask", "Search"] as const} value={tab} onChange={setTab} label="Brain mode" />
      </div>
      <p className="mb-5 text-small text-tertiary-foreground">
        Ask = get an AI answer · Search = find records
      </p>
      {tab === "Ask" ? <AskTab /> : <SearchTab />}
    </div>
  );
}
