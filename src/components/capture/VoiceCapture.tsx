import * as React from "react";
import { Mic, Pause, Play, Square, Camera, Paperclip, Upload, AudioLines, Type as TypeIcon } from "lucide-react";
import { currentUser } from "@/data/demo";
import { cn } from "@/lib/utils";

type Mode = "talk" | "type" | "upload" | "camera";

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

/** Dense waveform, 56 bars, heights drifting so it never looks looped. */
const BARS = Array.from({ length: 56 }, (_, i) => ({
  delay: ((i % 9) * 0.07 + (i % 4) * 0.05).toFixed(2),
  duration: (0.7 + ((i * 7) % 6) * 0.1).toFixed(2),
  base: 26 + ((i * 17) % 74),
}));

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex h-14 w-full items-center justify-center gap-[3px]" aria-hidden="true">
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
  { id: "upload", label: "Documents", icon: Paperclip },
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

const SUGGESTIONS = ["List the overdue tasks", "Get me a To Do list", "Prioritize the tasks on fire"];

const LIVE_TRANSCRIPT =
  "Ask Priya to prepare a quotation for fifty cotton shirts for the Mumbai retailer and follow up by Wednesday.";

/** The big gradient circle used by every capture control. */
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
        className={cn("absolute size-[124px] rounded-pill bg-brand-300/40", breathing && "halo-breathe")}
      />
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className="brand-gradient relative flex size-[92px] items-center justify-center rounded-pill text-on-primary shadow-md transition-transform duration-200 hover:scale-[1.04]"
      >
        <Icon className="size-9" strokeWidth={1.75} aria-hidden="true" />
      </button>
    </div>
  );
}

export function VoiceCapture({ onSubmit }: { onSubmit?: () => void }) {
  const [mode, setMode] = React.useState<Mode>("talk");
  const [recording, setRecording] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  const [typed, setTyped] = React.useState("");
  const [greeting, setGreeting] = React.useState("Welcome Back");

  React.useEffect(() => setGreeting(timeGreeting()), []);

  const stop = () => {
    setRecording(false);
    setPaused(false);
    onSubmit?.();
  };

  const greetingLine = (
    <p className="text-small text-secondary-foreground">
      {greeting}, {currentUser.name.split(" ")[0]}
    </p>
  );

  return (
    <section aria-labelledby="capture-heading" className="flex flex-col gap-4">
      <div className="relative isolate overflow-hidden rounded-xl bg-surface-sunken">
        <div aria-hidden="true" className="aurora-bloom pointer-events-none absolute inset-0 -z-10" />

        <div className="flex min-h-[560px] flex-col items-center justify-center px-6 py-14 text-center sm:min-h-[620px] sm:px-10">
          {recording ? (
            <>
              <p className="text-small text-secondary-foreground">
                {paused ? "Paused" : "Listening…"}
              </p>
              <div className="mt-10 w-full max-w-md">
                <Waveform active={!paused} />
              </div>
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  aria-label={paused ? "Resume Recording" : "Pause Recording"}
                  onClick={() => setPaused((p) => !p)}
                  className="flex size-11 items-center justify-center rounded-pill border border-hairline bg-surface/60 text-foreground transition-colors hover:bg-surface"
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
                  className="flex size-11 items-center justify-center rounded-pill border border-hairline bg-surface/60 text-foreground transition-colors hover:bg-surface"
                >
                  <Square className="size-4" aria-hidden="true" />
                </button>
              </div>
              <p
                className="mt-12 max-w-sm text-h2 font-normal italic leading-relaxed text-secondary-foreground"
                style={{
                  maskImage: "linear-gradient(to bottom, var(--foreground) 45%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, #000 45%, transparent 100%)",
                }}
              >
                {LIVE_TRANSCRIPT}
              </p>
            </>
          ) : mode === "talk" ? (
            <>
              {greetingLine}
              <div className="mt-8">
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
              <h1 id="capture-heading" className="mt-10 max-w-xs text-display text-foreground sm:max-w-sm">
                {COPY.talk.heading}
              </h1>
              <p className="mt-4 max-w-xs text-small text-secondary-foreground sm:max-w-sm">
                {COPY.talk.sub}
              </p>
            </>
          ) : mode === "type" ? (
            <>
              {greetingLine}
              <h1 id="capture-heading" className="mt-6 max-w-xs text-display text-foreground sm:max-w-sm">
                {COPY.type.heading}
              </h1>
              <p className="mt-4 max-w-xs text-small text-secondary-foreground sm:max-w-sm">
                {COPY.type.sub}
              </p>
              <div className="mt-8 w-full max-w-md">
                <textarea
                  id="capture-type"
                  rows={2}
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  placeholder="Ask Anything to DecisionOS"
                  aria-label="Ask Anything to DecisionOS"
                  className="w-full resize-y rounded-lg bg-surface/55 px-4 py-3 text-left text-small text-foreground placeholder:text-tertiary-foreground backdrop-blur-sm focus-visible:outline-none"
                />
              </div>
              <div className="mt-4 flex w-full max-w-md flex-wrap justify-start gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTyped(s)}
                    className="rounded-pill border border-hairline bg-surface/50 px-3.5 py-2 text-small text-secondary-foreground transition-colors hover:bg-surface"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </>
          ) : mode === "upload" ? (
            <>
              {greetingLine}
              <div className="mt-8">
                <CaptureCircle label="Upload Documents" icon={Upload} />
              </div>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-hairline bg-surface/60 px-4 py-2.5 text-small font-medium text-foreground transition-colors hover:bg-surface"
                >
                  <Paperclip className="size-4" aria-hidden="true" /> Choose Files
                </button>
              </div>
              <h1 id="capture-heading" className="mt-8 max-w-xs text-display text-foreground sm:max-w-sm">
                {COPY.upload.heading}
              </h1>
              <p className="mt-4 max-w-xs text-small text-secondary-foreground sm:max-w-sm">
                {COPY.upload.sub}
              </p>
            </>
          ) : (
            <>
              {greetingLine}
              <div className="mt-8">
                <CaptureCircle label="Open Camera" icon={Camera} />
              </div>
              <h1 id="capture-heading" className="mt-10 max-w-xs text-display text-foreground sm:max-w-sm">
                {COPY.camera.heading}
              </h1>
              <p className="mt-4 max-w-xs text-small text-secondary-foreground sm:max-w-sm">
                {COPY.camera.sub}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Mode selector */}
      <div className="no-scrollbar -mx-1 flex justify-center gap-2 overflow-x-auto px-1 pb-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            disabled={recording}
            onClick={() => setMode(m.id)}
            aria-pressed={mode === m.id}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-pill px-4 py-2.5 text-small transition-colors duration-200 disabled:opacity-50",
              mode === m.id
                ? "border border-transparent bg-surface-sunken font-semibold text-foreground"
                : "border border-hairline bg-surface text-secondary-foreground hover:bg-surface-hover",
            )}
          >
            <m.icon className="size-4 shrink-0" aria-hidden="true" />
            {m.label}
          </button>
        ))}
      </div>
    </section>
  );
}
