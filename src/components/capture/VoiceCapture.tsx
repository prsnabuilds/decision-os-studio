import * as React from "react";
import { Mic, Pause, Play, Square, Keyboard, Upload, Camera, Paperclip, Check } from "lucide-react";
import { Btn, Field, TextArea } from "@/components/ds";
import { currentUser } from "@/data/demo";
import { cn } from "@/lib/utils";

type Mode = "speak" | "type" | "upload";

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
    <div className="flex h-12 flex-1 items-center justify-center gap-1" aria-hidden="true">
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

export function VoiceCapture({ onSubmit }: { onSubmit?: () => void }) {
  const [mode, setMode] = React.useState<Mode>("speak");
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
        ? "Paused — pick up where you left off"
        : "Listening…"
      : "Tap to speak a decision";

  const switchMode = (m: Mode) => {
    if (recording) return;
    setMode(m);
  };

  return (
    <section
      aria-labelledby="capture-heading"
      className="overflow-hidden rounded-xl bg-brand-tint px-5 py-8 sm:px-10 sm:py-12"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="text-label text-brand-on-tint">{greeting}, {currentUser.name.split(" ")[0]}</p>
        <h1 id="capture-heading" className="mt-1 text-h1 text-foreground">
          Say What Needs To Happen
        </h1>
        <p className="mt-2 max-w-md text-lead text-secondary-foreground">
          Speak it in Tamil, English or Tanglish — DecisionOS writes it up, assigns it and tracks it.
        </p>

        {/* Mic + live state */}
        <div className="mt-8 flex w-full flex-col items-center gap-5">
          <div className="relative flex items-center justify-center">
            {recording && !paused ? (
              <span
                aria-hidden="true"
                className="halo-breathe absolute size-32 rounded-pill bg-brand/25 sm:size-36"
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
                  setMode("speak");
                  setRecording(true);
                  setPaused(false);
                  setSeconds(0);
                }
              }}
              className={cn(
                "relative flex size-24 items-center justify-center rounded-pill bg-brand text-on-primary shadow-md transition-all duration-200 hover:bg-brand-hover hover:scale-[1.04] disabled:opacity-70 sm:size-28",
                recording && !paused && "mic-recording",
              )}
            >
              {processing ? (
                <span className="size-6 animate-spin rounded-pill border-2 border-on-primary/40 border-t-on-primary" />
              ) : recording ? (
                <Square className="size-8" aria-hidden="true" />
              ) : (
                <Mic className="size-9" aria-hidden="true" />
              )}
            </button>
          </div>

          <div className="min-h-6">
            <p className="text-body-strong text-brand-on-tint">{status}</p>
            {recording ? (
              <p className="text-small tabular text-secondary-foreground">{timer}</p>
            ) : null}
          </div>

          {recording ? (
            <div className="soft-rise w-full max-w-lg rounded-lg bg-surface/70 px-4 py-3">
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
            <div className="soft-rise processing-sheen w-full max-w-lg rounded-lg px-4 py-3 text-small text-secondary-foreground">
              Transcribing, finding the people involved and drafting the tasks.
            </div>
          ) : null}

          {captured && !recording && !processing ? (
            <div className="soft-rise flex w-full max-w-lg items-center gap-3 rounded-lg bg-surface px-4 py-3 text-left shadow-xs">
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
        </div>

        {/* Mode switch — calm, no layout jump */}
        {!recording && !processing ? (
          <div className="mt-8 w-full">
            <div className="flex flex-wrap justify-center gap-1.5">
              {(
                [
                  { id: "speak", label: "Speak", icon: Mic },
                  { id: "type", label: "Type Instead", icon: Keyboard },
                  { id: "upload", label: "Upload A File", icon: Upload },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => switchMode(m.id)}
                  aria-pressed={mode === m.id}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-pill px-4 text-label transition-colors duration-200",
                    mode === m.id
                      ? "bg-surface text-brand-on-tint shadow-xs"
                      : "text-secondary-foreground hover:bg-surface/60",
                  )}
                >
                  <m.icon className="size-4" aria-hidden="true" />
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {mode === "type" ? (
                <div key="type" className="soft-rise mx-auto max-w-xl rounded-lg bg-surface p-4 text-left shadow-xs">
                  <Field label="The Directive" htmlFor="capture-type">
                    <TextArea
                      id="capture-type"
                      rows={3}
                      value={typed}
                      onChange={(e) => setTyped(e.target.value)}
                      placeholder="Type what happened, or what you want done."
                    />
                  </Field>
                  <div className="mt-3 flex flex-wrap gap-2">
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
                    <Btn size="sm" variant="tertiary" onClick={() => setMode("speak")}>
                      <Mic className="size-4" aria-hidden="true" /> Speak Instead
                    </Btn>
                  </div>
                </div>
              ) : null}

              {mode === "upload" ? (
                <div key="upload" className="soft-rise mx-auto max-w-xl rounded-lg bg-surface p-6 text-center shadow-xs">
                  <Upload className="mx-auto size-6 text-tertiary-foreground" aria-hidden="true" />
                  <p className="mt-2 text-body-strong text-foreground">
                    The file is the directive
                  </p>
                  <p className="mt-1 text-small text-secondary-foreground">
                    Order photos, invoices, lists — plus PDF, Word and Excel.
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <Btn size="sm" variant="secondary">
                      <Paperclip className="size-4" aria-hidden="true" /> Choose Files
                    </Btn>
                    <Btn size="sm" variant="secondary">
                      <Camera className="size-4" aria-hidden="true" /> Take A Photo
                    </Btn>
                    <Btn size="sm" variant="primary" onClick={() => finalise("Upload")}>
                      Analyse
                    </Btn>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
