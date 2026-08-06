import * as React from "react";
import { Mic, Pause, Play, Square, Camera, Paperclip, Check, AudioLines, Type as TypeIcon } from "lucide-react";
import { Btn, Field, TextArea } from "@/components/ds";
import { currentUser } from "@/data/demo";
import { cn } from "@/lib/utils";

type Mode = "talk" | "type" | "upload" | "camera";

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/** Twenty bars whose heights drift, so the waveform never looks looped. */
const BARS = Array.from({ length: 21 }, (_, i) => ({
  delay: (i % 7) * 0.11 + (i % 3) * 0.05,
  duration: 0.8 + ((i * 7) % 5) * 0.12,
  base: 30 + ((i * 13) % 60),
}));

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-10 flex-1 items-center justify-center gap-1" aria-hidden="true">
      {BARS.map((b, i) => (
        <span
          key={i}
          className={cn(
            "w-1 rounded-pill bg-brand transition-[height,opacity] duration-500",
            active ? "wave-bar" : "opacity-40",
          )}
          style={{
            height: active ? `${b.base}%` : "18%",
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

const MODES = [
  { id: "talk", label: "Talk", icon: AudioLines },
  { id: "type", label: "Type", icon: TypeIcon },
  { id: "upload", label: "Upload Documents", icon: Paperclip },
  { id: "camera", label: "Take A Photo", icon: Camera },
] as const;

export function VoiceCapture({ onSubmit }: { onSubmit?: () => void }) {
  const [mode, setMode] = React.useState<Mode>("talk");
  const [recording, setRecording] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);
  const [processing, setProcessing] = React.useState(false);
  const [captured, setCaptured] = React.useState<string | null>(null);
  const [typed, setTyped] = React.useState("");
  const [greeting, setGreeting] = React.useState("Welcome Back");

  React.useEffect(() => setGreeting(timeGreeting()), []);

  React.useEffect(() => {
    if (!recording || paused) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording, paused]);

  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  const finalise = (label: string) => {
    setRecording(false);
    setPaused(false);
    setSeconds(0);
    setProcessing(true);
    onSubmit?.();
    window.setTimeout(() => {
      setProcessing(false);
      setCaptured(label);
    }, 2200);
  };

  const status = processing
    ? "Writing it up…"
    : recording
      ? paused
        ? "Paused - pick up where you left off"
        : "Listening…"
      : null;

  const subline: Record<Mode, string> = {
    talk: "Speak in any language. DecisionOS writes it up, assigns it and tracks it.",
    type: "Type it out. DecisionOS writes it up, assigns it and tracks it.",
    upload: "Drop in an invoice, order or list. DecisionOS reads it and drafts the work.",
    camera: "Photograph a note, board or bill. DecisionOS reads it and drafts the work.",
  };

  return (
    <section aria-labelledby="capture-heading" className="flex flex-col gap-4">
      {/* Hero card with the aurora bloom behind the copy */}
      <div className="relative isolate overflow-hidden rounded-xl bg-surface-sunken">
        <div aria-hidden="true" className="aurora-bloom pointer-events-none absolute inset-0 -z-10" />

        <div className="flex min-h-[420px] flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[520px] sm:px-10">
          <p className="text-label text-secondary-foreground">
            {greeting}, {currentUser.name.split(" ")[0]}
          </p>
          <h1
            id="capture-heading"
            className="mt-2 max-w-sm text-[1.75rem] font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-[2.25rem]"
          >
            Say What Needs To Happen
          </h1>
          <p className="mt-3 max-w-xs text-small leading-relaxed text-secondary-foreground sm:max-w-sm">
            {subline[mode]}
          </p>

          {/* Mic - voice capture only */}
          {mode === "talk" ? (
            <div className="relative mt-9 flex items-center justify-center">
              {recording && !paused ? (
                <span
                  aria-hidden="true"
                  className="halo-breathe absolute size-28 rounded-pill bg-brand/25 sm:size-32"
                />
              ) : null}
              <button
                type="button"
                aria-label={recording ? "Stop Recording" : "Start Recording"}
                disabled={processing}
                onClick={() => {
                  if (processing) return;
                  if (recording) {
                    finalise("Voice note");
                  } else {
                    setRecording(true);
                    setPaused(false);
                    setSeconds(0);
                  }
                }}
                className={cn(
                  "relative flex size-20 items-center justify-center rounded-pill bg-brand text-on-primary shadow-md transition-all duration-200 hover:scale-[1.04] hover:bg-brand-hover disabled:opacity-70 sm:size-24",
                  recording && !paused && "mic-recording",
                )}
              >
                {processing ? (
                  <span className="size-6 animate-spin rounded-pill border-2 border-on-primary/40 border-t-on-primary" />
                ) : recording ? (
                  <Square className="size-7" aria-hidden="true" />
                ) : (
                  <Mic className="size-8" aria-hidden="true" />
                )}
              </button>
            </div>
          ) : null}

          {status ? (
            <div className="mt-4">
              <p className="text-body-strong text-brand-on-tint">{status}</p>
              {recording ? (
                <p className="text-small tabular text-secondary-foreground">{timer}</p>
              ) : null}
            </div>
          ) : null}

          {recording ? (
            <div className="soft-rise mt-4 w-full max-w-md rounded-lg bg-surface/80 px-4 py-3 backdrop-blur-sm">
              <Waveform active={!paused} />
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <Btn size="sm" variant="secondary" onClick={() => setPaused((p) => !p)}>
                  {paused ? (
                    <>
                      <Play className="size-3.5" aria-hidden="true" /> Resume
                    </>
                  ) : (
                    <>
                      <Pause className="size-3.5" aria-hidden="true" /> Pause
                    </>
                  )}
                </Btn>
                <Btn size="sm" variant="primary" onClick={() => finalise("Voice note")}>
                  Finalise
                </Btn>
                <Btn
                  size="sm"
                  variant="tertiary"
                  onClick={() => {
                    setRecording(false);
                    setPaused(false);
                    setSeconds(0);
                  }}
                >
                  Cancel
                </Btn>
              </div>
            </div>
          ) : null}

          {processing ? (
            <div className="soft-rise processing-sheen mt-4 w-full max-w-md rounded-lg px-4 py-3 text-small text-secondary-foreground">
              Transcribing, finding the people involved and drafting the tasks.
            </div>
          ) : null}

          {captured && !recording && !processing ? (
            <div className="soft-rise mt-4 flex w-full max-w-md items-center gap-3 rounded-lg bg-surface/85 px-4 py-3 text-left shadow-xs backdrop-blur-sm">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-pill bg-brand-tint text-brand-on-tint">
                <Check className="size-4" aria-hidden="true" />
              </span>
              <p className="flex-1 text-small text-secondary-foreground">
                {captured} captured and structured. It's waiting on the Decision Desk.
              </p>
              <Btn size="sm" variant="tertiary" onClick={() => setCaptured(null)}>
                Dismiss
              </Btn>
            </div>
          ) : null}

          {/* Typing */}
          {!recording && !processing && mode === "type" ? (
            <div className="soft-rise mt-8 w-full max-w-md rounded-lg bg-surface/90 p-4 text-left shadow-xs backdrop-blur-sm">
              <Field label="The Directive" htmlFor="capture-type">
                <TextArea
                  id="capture-type"
                  rows={3}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="Type what happened, or what you want done."
                />
              </Field>
              <div className="mt-3">
                <Btn
                  variant="primary"
                  size="sm"
                  disabled={typed.trim().length === 0}
                  onClick={() => {
                    setTyped("");
                    finalise("Directive");
                  }}
                >
                  Structure It
                </Btn>
              </div>
            </div>
          ) : null}

          {/* Documents */}
          {!recording && !processing && mode === "upload" ? (
            <div className="soft-rise mt-8 w-full max-w-md rounded-lg bg-surface/90 p-5 text-center shadow-xs backdrop-blur-sm">
              <Paperclip className="mx-auto size-5 text-tertiary-foreground" aria-hidden="true" />
              <p className="mt-2 text-body-strong text-foreground">The file is the directive</p>
              <p className="mt-1 text-small text-secondary-foreground">
                Invoices, lists, PDF, Word and Excel.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Btn size="sm" variant="secondary">
                  <Paperclip className="size-4" aria-hidden="true" /> Choose Files
                </Btn>
                <Btn size="sm" variant="primary" onClick={() => finalise("Upload")}>
                  Analyse
                </Btn>
              </div>
            </div>
          ) : null}

          {/* Camera */}
          {!recording && !processing && mode === "camera" ? (
            <div className="soft-rise mt-8 w-full max-w-md rounded-lg bg-surface/90 p-5 text-center shadow-xs backdrop-blur-sm">
              <Camera className="mx-auto size-5 text-tertiary-foreground" aria-hidden="true" />
              <p className="mt-2 text-body-strong text-foreground">Point and shoot</p>
              <p className="mt-1 text-small text-secondary-foreground">
                Order slips, whiteboards, handwritten notes.
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Btn size="sm" variant="secondary">
                  <Camera className="size-4" aria-hidden="true" /> Open Camera
                </Btn>
                <Btn size="sm" variant="primary" onClick={() => finalise("Photo")}>
                  Analyse
                </Btn>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Icon-only mode pills */}
      <div className="flex justify-center gap-3">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={recording || processing}
            onClick={() => {
              setMode(m.id);
              setCaptured(null);
            }}
            aria-pressed={mode === m.id}
            aria-label={m.label}
            title={m.label}
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-pill border transition-colors duration-200 disabled:opacity-50",
              mode === m.id
                ? "border-transparent bg-brand text-on-primary"
                : "border-hairline bg-surface text-secondary-foreground hover:bg-surface-hover",
            )}
          >
            <m.icon className="size-[1.15rem]" aria-hidden="true" />
          </button>
        ))}
      </div>
    </section>
  );
}
