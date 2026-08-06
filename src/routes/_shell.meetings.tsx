import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { Btn, Card, EmptyState, PageHeader, StatusBadge, TextArea } from "@/components/ds";
import { AiBtn } from "@/components/ds/ai";
import { meetings } from "@/data/demo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes — DecisionOS" },
      {
        name: "description",
        content:
          "Record a meeting or paste a transcript and DecisionOS extracts the decisions and the tasks they create.",
      },
      { property: "og:title", content: "Meeting Notes — DecisionOS" },
      { property: "og:description", content: "Meetings turned into decisions and tasks." },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const [recording, setRecording] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [paste, setPaste] = React.useState(false);
  const [open, setOpen] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const active = meetings.find((m) => m.id === open);

  return (
    <div>
      <PageHeader eyebrow="Say it once, keep it forever" title="Meeting Notes" />

      <Card className="mb-8 flex flex-wrap items-center gap-5">
        <button
          type="button"
          aria-label={recording ? "Stop Recording The Meeting" : "Record A Meeting"}
          onClick={() => {
            setRecording((r) => !r);
            if (recording) setSeconds(0);
          }}
          className={cn(
            "flex size-20 shrink-0 items-center justify-center rounded-pill bg-brand text-on-primary shadow-xs transition-colors duration-150 hover:bg-brand-hover",
            recording && "mic-recording",
          )}
        >
          <Mic className="size-8" aria-hidden="true" />
        </button>
        <div className="min-w-48 flex-1">
          <p className="text-h3 text-foreground">
            {recording ? "Recording The Meeting…" : "Tap To Record A Meeting"}
          </p>
          <p className="text-small text-secondary-foreground">
            AI transcribes &amp; extracts action items
          </p>
          {recording ? (
            <p className="mt-1 text-small tabular text-secondary-foreground">{timer}</p>
          ) : null}
        </div>
        <Btn variant="tertiary" onClick={() => setPaste((p) => !p)}>
          {paste ? "Record Instead" : "Paste Transcript Instead"}
        </Btn>
      </Card>

      {paste ? (
        <Card className="mb-8 space-y-3">
          <TextArea
            rows={5}
            aria-label="Meeting transcript"
            placeholder="Paste the transcript or your own notes here…"
          />
          <AiBtn>Summarise &amp; Extract Tasks</AiBtn>
        </Card>
      ) : null}

      <section>
        <h2 className="mb-3 text-h2 text-foreground">Past Meetings</h2>
        {meetings.length === 0 ? (
          <EmptyState
            title="No Meetings Yet"
            helper="Recorded meetings and pasted transcripts will be summarised and listed here."
          />
        ) : (
          <ul className="space-y-2">
            {meetings.map((m) => (
              <li key={m.id}>
                <Card compact interactive className="flex flex-wrap items-center gap-3">
                  <div className="min-w-48 flex-1">
                    <p className="text-body-strong text-foreground">{m.title}</p>
                    <p className="text-small text-secondary-foreground">{m.summary}</p>
                  </div>
                  <span className="text-label text-tertiary-foreground">{m.date}</span>
                  <StatusBadge kind="neutral">{m.duration}</StatusBadge>
                  <Btn size="sm" variant="secondary" onClick={() => setOpen(m.id)}>
                    Open
                  </Btn>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {active ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            className="absolute inset-0 bg-neutral-900/40"
            aria-label="Close meeting summary"
            onClick={() => setOpen(null)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="relative w-full max-w-lg space-y-4 rounded-lg border border-hairline bg-surface p-5 shadow-lg"
          >
            <div>
              <h3 className="text-h3 text-foreground">{active.title}</h3>
              <p className="text-small text-tertiary-foreground">
                {active.date} · {active.duration}
              </p>
            </div>
            <p className="text-body text-secondary-foreground">{active.summary}</p>
            <div>
              <p className="text-label text-tertiary-foreground">Decisions Extracted</p>
              <ul className="mt-1 space-y-1 text-small text-foreground">
                <li>Hold the packaging rate until October.</li>
                <li>Revisit the second dispatch coordinator hire this week.</li>
              </ul>
            </div>
            <div>
              <p className="text-label text-tertiary-foreground">Tasks Created</p>
              <ul className="mt-1 space-y-1 text-small text-foreground">
                <li>Confirm the rate hold in writing — Meena Raghavan</li>
                <li>Draft the coordinator role — Meena Raghavan</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2">
              <Btn variant="tertiary" onClick={() => setOpen(null)}>
                Close
              </Btn>
              <Btn variant="primary" onClick={() => setOpen(null)}>
                Send To The Desk
              </Btn>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
