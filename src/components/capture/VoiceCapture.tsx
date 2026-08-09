import * as React from "react";
import {
  Mic,
  Pause,
  Play,
  Square,
  Camera,
  Paperclip,
  Upload,
  AudioLines,
  Type as TypeIcon,
  Sparkles,
} from "lucide-react";
import { currentUser } from "@/data/demo";
import { cn } from "@/lib/utils";

type Mode = "talk" | "type" | "upload" | "camera";

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/** Dense waveform, 48 bars, heights drifting so it never looks looped. */
const BARS = Array.from({ length: 48 }, (_, i) => ({
  delay: ((i % 9) * 0.07 + (i % 4) * 0.05).toFixed(2),
  duration: (0.7 + ((i * 7) % 6) * 0.1).toFixed(2),
  base: 26 + ((i * 17) % 74),
}));

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-10 w-full items-center justify-center gap-[3px]" aria-hidden="true">
      {BARS.map((b, i) => (
        <span
          key={i}
          className={cn("w-[3px] rounded-pill bg-brand-500", active ? "wave-bar" : "opacity-40")}
          style={{
            height: `${b.base}%`,
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
  { id: "upload", label: "Docs", icon: Paperclip },
  { id: "camera", label: "Photo", icon: Camera },
] as const;

const COPY: Record<Mode, { heading: string; sub: string }> = {
  talk: {
    heading: "Say What Needs To Happen",
    sub: "Speak in any language. DecisionOS writes it up, assigns it and tracks it.",
  },
  type: {
    heading: "Type What You Want Done",
    sub: "Write it in any language. DecisionOS structures it, assigns it and tracks it.",
  },
  upload: {
    heading: "Drop In a Document",
    sub: "Upload a bill, invoice or file. DecisionOS reads it, structures it and files it.",
  },
  camera: {
    heading: "Point And Capture",
    sub: "Capture a bill, receipt or note. DecisionOS reads it, structures it and files it.",
  },
};

const SUGGESTIONS = [
  "List the overdue tasks",
  "Get me a To Do list",
  "Prioritize the tasks on fire",
];

/** The gradient circle used by every capture control. */
function CaptureCircle({
  label,
  icon: Icon,
  onClick,
  breathing,
}: {
  label: string;
  icon: typeof Mic;
  onClick?: () => void;
  breathing?: boolean;
}) {
  return (
    <div className="relative flex items-center justify-center">
      <span
        aria-hidden="true"
        className={cn(
          "absolute size-[96px] rounded-pill bg-brand-300/40",
          breathing && "halo-breathe",
        )}
      />
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="brand-gradient relative flex size-[72px] items-center justify-center rounded-pill text-on-primary shadow-md transition-transform duration-150 hover:scale-[1.04] active:scale-95"
      >
        <Icon className="size-7" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}

export function VoiceCapture({ onSubmit }: { onSubmit?: () => void }) {
  const [mode, setMode] = React.useState<Mode>("talk");
  const [recording, setRecording] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [processing, setProcessing] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [greeting, setGreeting] = React.useState("Welcome Back");

  React.useEffect(() => setGreeting(timeGreeting()), []);

  const stop = () => {
    setRecording(false);
    setPaused(false);
    setProcessing(true);
    onSubmit?.();
  };

  React.useEffect(() => {
    if (!processing) return;
    const id = window.setTimeout(() => setProcessing(false), 3200);
    return () => window.clearTimeout(id);
  }, [processing]);

  const greetingLine = (
    <p className="text-label text-secondary-foreground">
      {greeting}, {currentUser.name.split(" ")[0]}
    </p>
  );

  const heading = "mt-5 max-w-xs text-h1 font-bold text-foreground";
  const sub = "mt-2 max-w-[19rem] text-label leading-relaxed text-secondary-foreground";

  return (
    <section aria-labelledby="capture-heading" className="flex flex-col gap-3">
      <div className="relative isolate overflow-hidden rounded-xl bg-surface-sunken">
        <div
          aria-hidden="true"
          className="aurora-bloom pointer-events-none absolute inset-0 -z-10"
        />

        <div className="flex h-[calc(100dvh-16rem)] min-h-[300px] flex-col items-center justify-center overflow-y-auto px-5 py-8 text-center sm:h-[calc(100dvh-15rem)] sm:max-h-[560px] sm:px-10">
          {processing ? (
            <>
              <span className="inline-flex items-center gap-2 rounded-pill bg-brand-tint px-3 py-1 text-label text-brand-on-tint">
                <Sparkles className="size-3.5 animate-pulse" aria-hidden="true" />
                Structuring it…
              </span>
              <h1 id="capture-heading" className={heading}>
                Making Sense Of It
              </h1>
              <p className={sub}>
                DecisionOS is turning what you said into tasks, owners and dates.
              </p>
            </>
          ) : recording ? (
            <>
              <p className="text-label text-secondary-foreground">
                {paused ? "Paused" : "Listening…"}
              </p>
              <div className="mt-6 w-full max-w-md">
                <Waveform active={!paused} />
              </div>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label={paused ? "Resume Recording" : "Pause Recording"}
                  onClick={() => setPaused((p) => !p)}
                  className="flex size-10 items-center justify-center rounded-pill border border-hairline bg-surface/60 text-foreground transition-colors hover:bg-surface active:scale-95"
                >
                  {paused ? (
                    <Play className="size-4" aria-hidden="true" />
                  ) : (
                    <Pause className="size-4" aria-hidden="true" />
                  )}
                </button>
                <button
                  type="button"
                  aria-label="Stop Recording"
                  onClick={stop}
                  className="flex size-10 items-center justify-center rounded-pill border border-hairline bg-surface/60 text-foreground transition-colors hover:bg-surface active:scale-95"
                >
                  <Square className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p className="mt-8 max-w-[19rem] text-label leading-relaxed text-secondary-foreground">
                Keep talking. Press stop when you are done and DecisionOS will structure it.
              </p>
            </>
          ) : mode === "talk" ? (
            <>
              {greetingLine}
              <div className="mt-6">
                <CaptureCircle
                  label="Start Recording"
                  icon={Mic}
                  breathing
                  onClick={() => {
                    setRecording(true);
                    setPaused(false);
                  }}
                />
              </div>
              <h1 id="capture-heading" className={heading}>
                {COPY.talk.heading}
              </h1>
              <p className={sub}>{COPY.talk.sub}</p>
            </>
          ) : mode === "type" ? (
            <>
              {greetingLine}
              <h1 id="capture-heading" className="mt-4 max-w-xs text-h1 font-bold text-foreground">
                {COPY.type.heading}
              </h1>
              <p className={sub}>{COPY.type.sub}</p>
              <div className="mt-5 w-full max-w-md">
                <textarea
                  id="capture-type"
                  rows={2}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="Ask Anything to DecisionOS"
                  aria-label="Ask Anything to DecisionOS"
                  className="w-full resize-y rounded-lg bg-surface/55 px-4 py-2.5 text-left text-small text-foreground placeholder:text-tertiary-foreground backdrop-blur-sm focus-visible:outline-none"
                />
              </div>
              <div className="mt-3 flex w-full max-w-md flex-wrap justify-start gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTyped(s)}
                    className="rounded-pill border border-hairline bg-surface/50 px-3 py-1.5 text-label text-secondary-foreground transition-colors hover:bg-surface active:scale-95"
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex w-full max-w-md justify-start">
                <button
                  type="button"
                  disabled={!typed.trim()}
                  onClick={() => {
                    setTyped("");
                    setProcessing(true);
                    onSubmit?.();
                  }}
                  className="brand-gradient inline-flex h-9 items-center gap-2 rounded-pill px-4 text-small font-semibold text-on-primary shadow-xs transition hover:brightness-110 active:scale-95 disabled:opacity-45"
                >
                  <Sparkles className="size-4 shrink-0" aria-hidden="true" />
                  Structure it
                </button>
              </div>
            </>
          ) : mode === "upload" ? (
            <>
              {greetingLine}
              <div className="mt-6">
                <CaptureCircle
                  label="Upload Documents"
                  icon={Upload}
                  onClick={() => setProcessing(true)}
                />
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => setProcessing(true)}
                  className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface/60 px-3.5 py-2 text-small font-medium text-foreground transition-colors hover:bg-surface active:scale-95"
                >
                  <Paperclip className="size-4" aria-hidden="true" /> Choose Files
                </button>
              </div>
              <h1 id="capture-heading" className={heading}>
                {COPY.upload.heading}
              </h1>
              <p className={sub}>{COPY.upload.sub}</p>
            </>
          ) : (
            <>
              {greetingLine}
              <div className="mt-6">
                <CaptureCircle
                  label="Open Camera"
                  icon={Camera}
                  onClick={() => setProcessing(true)}
                />
              </div>
              <h1 id="capture-heading" className={heading}>
                {COPY.camera.heading}
              </h1>
              <p className={sub}>{COPY.camera.sub}</p>
            </>
          )}
        </div>
      </div>

      {/* Mode selector: all four always visible, no horizontal scroll. */}
      <div className="flex w-full items-center justify-center gap-1.5 sm:gap-2">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={recording}
            onClick={() => {
              setMode(m.id);
              setProcessing(false);
            }}
            aria-pressed={mode === m.id}
            className={cn(
              "inline-flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-pill px-2 py-2 text-label transition-colors duration-150 active:scale-95 disabled:opacity-50 sm:flex-none sm:px-4 sm:py-2.5 sm:text-small",
              mode === m.id
                ? "border border-transparent bg-surface-sunken font-semibold text-foreground"
                : "border border-hairline bg-surface text-secondary-foreground hover:bg-surface-hover",
            )}
          >
            <m.icon className="size-4 shrink-0" aria-hidden="true" />
            <span className="truncate">{m.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
