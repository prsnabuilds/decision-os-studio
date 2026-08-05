import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card, PageHeader, Segmented, StatusBadge, TextArea } from "@/components/ds";
import { Avatar } from "@/components/ds/bits";
import { operatingScore } from "@/data/demo";

export const Route = createFileRoute("/_shell/coach")({
  head: () => ({
    meta: [
      { title: "Coaching — DecisionOS" },
      {
        name: "description",
        content:
          "Per-person coaching notes grounded in what actually happened: completions, delays and escalations.",
      },
      { property: "og:title", content: "Coaching — DecisionOS" },
      { property: "og:description", content: "Coach from the record, not from memory." },
    ],
  }),
  component: CoachPage,
});

const notes: Record<string, { strengths: string[]; watch: string[]; suggested: string }> = {
  "Prasanna Narayanan": {
    strengths: ["Clears approvals the same day they are raised."],
    watch: ["Holds three decisions open while travelling."],
    suggested: "Delegate the packaging approvals below ₹1,00,000 so the queue keeps moving.",
  },
  "Ravi Kumar": {
    strengths: ["Fastest on customer callbacks — median under two hours."],
    watch: ["Escalates pricing questions that fall inside his own discount limit."],
    suggested: "Agree a written discount ceiling so fewer calls come back to the desk.",
  },
  "Meena Raghavan": {
    strengths: ["Attaches proof without being asked."],
    watch: ["Two overdue reconciliations, both waiting on the same vendor."],
    suggested: "Give her a direct line to Acme Packaging rather than routing through sales.",
  },
};

function CoachPage() {
  const names = operatingScore.team.map((t) => t.name) as [string, ...string[]];
  const [who, setWho] = React.useState(names[0]);
  const person = operatingScore.team.find((t) => t.name === who)!;
  const note = notes[who]!;

  return (
    <div>
      <PageHeader eyebrow="Coach from the record, not from memory" title="Coaching" />

      <div className="mb-6">
        <Segmented options={names} value={who} onChange={setWho} label="Person" />
      </div>

      <Card className="mb-4 flex flex-wrap items-center gap-4">
        <Avatar name={person.name} size={40} />
        <div className="min-w-40 flex-1">
          <p className="text-h3 text-foreground">{person.name}</p>
          <p className="text-small text-tertiary-foreground">{person.role}</p>
        </div>
        <StatusBadge kind="neutral">Score {person.score}</StatusBadge>
        <StatusBadge kind="completed">{person.done} completed</StatusBadge>
        <StatusBadge kind="pending">{person.open} open</StatusBadge>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-h3 text-foreground">What Is Working</h2>
          <ul className="mt-2 space-y-1.5">
            {note.strengths.map((s) => (
              <li key={s} className="text-body text-secondary-foreground">
                {s}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="text-h3 text-foreground">What To Watch</h2>
          <ul className="mt-2 space-y-1.5">
            {note.watch.map((s) => (
              <li key={s} className="text-body text-secondary-foreground">
                {s}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4">
        <h2 className="text-h3 text-foreground">Suggested Conversation</h2>
        <p className="mt-2 text-body text-secondary-foreground">{note.suggested}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn variant="secondary">Create A Task From This</Btn>
          <Btn variant="tertiary">Dismiss</Btn>
        </div>
      </Card>

      <Card className="mt-4 space-y-3">
        <h2 className="text-h3 text-foreground">Your Private Note</h2>
        <TextArea
          rows={4}
          aria-label={`Private coaching note about ${person.name}`}
          placeholder="Only you can see this. What did you agree in the last conversation?"
        />
        <Btn variant="secondary">Save Note</Btn>
      </Card>
    </div>
  );
}
