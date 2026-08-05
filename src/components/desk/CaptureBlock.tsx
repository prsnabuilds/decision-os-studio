import * as React from "react";
import { Mic, Paperclip, Camera, Upload } from "lucide-react";
import { Btn, Card, Field, TextArea } from "@/components/ds";
import { cn } from "@/lib/utils";

const languages = ["Auto", "English", "தமிழ்", "Tanglish"] as const;

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}


export function CaptureBlock({ onSubmit }: { onSubmit: () => void }) {
  const [expanded, setExpanded] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [language, setLanguage] = React.useState<(typeof languages)[number]>("Auto");

  React.useEffect(() => {
    if (!recording || paused) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording, paused]);

  // Refuses to collapse over unsaved work: the control is withdrawn, not disabled.
  const hasUnsavedWork = typed.trim().length > 0 || recording;

  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  const status = recording ? (paused ? "Paused" : "Recording…") : "Tap to speak a decision";

  if (!expanded) {
    return (
      <section
        aria-labelledby="capture-hero-heading"
        className="rounded-xl bg-brand-tint px-6 py-8 sm:px-8 sm:py-10"
      >
        <div className="flex flex-col items-center gap-5 text-center">
          <button
            type="button"
            aria-label="Speak A Decision"
            onClick={() => {
              setExpanded(true);
              setRecording(true);
            }}
            className="flex size-20 shrink-0 items-center justify-center rounded-pill bg-brand text-on-primary shadow-md transition-transform duration-150 hover:bg-brand-hover hover:scale-105 sm:size-24"
          >
            <Mic className="size-8 sm:size-9" aria-hidden="true" />
          </button>
          <div>
            <p className="text-label text-brand-on-tint">{greeting}</p>
            <h2 id="capture-hero-heading" className="mt-1 text-h1 text-foreground">
              Say What Needs To Happen
            </h2>
            <p className="mx-auto mt-2 max-w-md text-lead text-secondary-foreground">
              Speak it in Tamil, English or Tanglish — DecisionOS writes it up, assigns it and
              tracks it for you.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Btn variant="secondary" size="sm" onClick={() => setExpanded(true)}>
              Type It Instead
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => setExpanded(true)}>
              <Upload className="size-4" aria-hidden="true" /> Upload A File
            </Btn>
            <Btn variant="secondary" size="sm" onClick={() => setExpanded(true)}>
              <Camera className="size-4" aria-hidden="true" /> Take A Photo
            </Btn>
          </div>
        </div>
      </section>
    );
  }


  return (
    <Card className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-h3 text-foreground">Capture A Decision</p>
          <p className="text-small text-secondary-foreground">
            Speak in any language — AI writes it up in English
          </p>
        </div>
        {hasUnsavedWork ? (
          <p className="text-small text-tertiary-foreground">
            {recording ? "Recording — stays open until you finalise." : "Unsaved text — stays open until you send or clear it."}
          </p>
        ) : (
          <Btn variant="tertiary" size="sm" onClick={() => setExpanded(false)}>
            Collapse Capture
          </Btn>
        )}
      </div>

      {/* Way 1 — Speak */}
      <section className="rounded-lg border border-hairline p-4">
        <p className="text-label text-tertiary-foreground">Way 1 · Speak</p>
        <div className="mt-4 flex flex-wrap items-center gap-5">
          <button
            type="button"
            aria-label={recording ? "Stop Recording" : "Start Recording"}
            onClick={() => {
              setRecording((r) => !r);
              setPaused(false);
              if (recording) setSeconds(0);
            }}
            className={cn(
              "flex size-24 shrink-0 items-center justify-center rounded-pill bg-brand text-on-primary shadow-xs transition-colors duration-150 hover:bg-brand-hover",
              recording && !paused && "mic-recording",
            )}
          >
            <Mic className="size-9" aria-hidden="true" />
          </button>
          <div className="space-y-2">
            <p className="text-body-strong text-foreground">{status}</p>
            {recording ? (
              <p className="text-small tabular text-secondary-foreground">{timer}</p>
            ) : (
              <p className="text-small text-secondary-foreground">
                Tamil, English and Tanglish are all understood.
              </p>
            )}
            {recording ? (
              <div className="flex flex-wrap gap-2">
                <Btn size="sm" variant="secondary" onClick={() => setPaused((p) => !p)}>
                  {paused ? "Resume" : "Pause"}
                </Btn>
                <Btn
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setRecording(false);
                    setSeconds(0);
                    onSubmit();
                  }}
                >
                  Finalise
                </Btn>
                <Btn
                  size="sm"
                  variant="tertiary"
                  onClick={() => {
                    setRecording(false);
                    setSeconds(0);
                  }}
                >
                  Cancel
                </Btn>
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Btn size="sm" variant="secondary">
            <Paperclip className="size-4" aria-hidden="true" /> Attach Files
          </Btn>
          <Btn size="sm" variant="secondary">
            <Camera className="size-4" aria-hidden="true" /> Add Photo
          </Btn>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-label text-tertiary-foreground">Language</span>
            <div className="flex flex-wrap gap-1">
              {languages.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  aria-pressed={language === l}
                  className={cn(
                    "h-8 rounded-pill border px-3 text-label transition-colors duration-150",
                    language === l
                      ? "border-brand-tint-border bg-brand-tint text-brand-on-tint"
                      : "border-hairline bg-surface text-secondary-foreground hover:bg-surface-hover",
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Way 2 — Type */}
      <section className="rounded-lg border border-hairline p-4">
        <p className="text-label text-tertiary-foreground">Way 2 · Type</p>
        <div className="mt-3">
          <Field label="The Directive" htmlFor="capture-type">
            <TextArea
              id="capture-type"
              rows={3}
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Tell sales to send the revised quote to the Delhi retailer by Friday, and ask finance to clear the packaging invoice."
            />
          </Field>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn
            variant="primary"
            onClick={() => {
              setTyped("");
              onSubmit();
            }}
          >
            Structure It
          </Btn>
          <Btn variant="secondary">
            <Paperclip className="size-4" aria-hidden="true" /> Attach Files
          </Btn>
          <Btn variant="secondary">
            <Camera className="size-4" aria-hidden="true" /> Add Photo
          </Btn>
        </div>
      </section>

      {/* Way 3 — Upload */}
      <section className="rounded-lg border border-hairline p-4">
        <p className="text-label text-tertiary-foreground">Way 3 · Upload An Image Or File</p>
        <div className="mt-3 rounded-lg border border-dashed border-hairline-strong bg-surface-sunken p-6 text-center">
          <Upload className="mx-auto size-6 text-tertiary-foreground" aria-hidden="true" />
          <p className="mt-2 text-body-strong text-foreground">
            No need to speak or type — the file is the directive.
          </p>
          <p className="mx-auto mt-1 max-w-lg text-small text-secondary-foreground">
            Photographs of orders, invoices, lists and business cards, plus PDF, Word and Excel.
            Several pages can be added together and are read as one.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Btn variant="secondary">Upload Image / PDF / Doc</Btn>
            <Btn variant="secondary">Capture Photo</Btn>
            <Btn variant="secondary" onClick={onSubmit}>
              Analyse &amp; Structure
            </Btn>
          </div>
        </div>
      </section>
    </Card>
  );
}
