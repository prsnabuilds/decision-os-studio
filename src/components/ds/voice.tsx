import * as React from "react";
import { Mic, Square } from "lucide-react";
import { cn } from "@/lib/utils";

function useTimer(active: boolean) {
  const [seconds, setSeconds] = React.useState(0);
  React.useEffect(() => {
    if (!active) {
      setSeconds(0);
      return;
    }
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [active]);
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function Waveform({ bars = 14 }: { bars?: number }) {
  return (
    <span aria-hidden="true" className="flex h-4 items-center gap-[3px]">
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="wave-bar block w-[2px] rounded-pill bg-brand"
          style={{ height: "100%", animationDelay: `${(i % 7) * 90}ms` }}
        />
      ))}
    </span>
  );
}

/**
 * A textarea you can speak into. Typing stays available, but the mic is always
 * inside the field — speaking is the faster path on every screen.
 */
export function VoiceTextArea({
  className,
  rows = 3,
  micLabel = "Speak Instead Of Typing",
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { micLabel?: string }) {
  const [recording, setRecording] = React.useState(false);
  const timer = useTimer(recording);

  return (
    <div
      className={cn(
        "rounded-md border border-hairline bg-surface transition-colors duration-200 focus-within:border-brand",
        recording && "border-brand-tint-border bg-brand-tint",
        className,
      )}
    >
      <textarea
        rows={rows}
        className="w-full resize-y bg-transparent p-3 text-body text-foreground placeholder:text-tertiary-foreground focus-visible:outline-none"
        {...props}
      />
      <div className="flex flex-wrap items-center gap-2 border-t border-hairline px-2 py-1.5">
        <button
          type="button"
          aria-label={recording ? "Stop Recording" : micLabel}
          aria-pressed={recording}
          onClick={() => setRecording((r) => !r)}
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-pill transition-colors duration-150",
            recording
              ? "mic-recording bg-brand text-on-primary"
              : "bg-brand-tint text-brand-on-tint hover:bg-brand-tint-hover",
          )}
        >
          {recording ? <Square className="size-3.5" /> : <Mic className="size-4" />}
        </button>
        {recording ? (
          <>
            <Waveform />
            <span className="text-small tabular text-brand-on-tint">{timer}</span>
            <span className="text-small text-secondary-foreground">Listening…</span>
          </>
        ) : (
          <span className="text-small text-tertiary-foreground">
            Tap the mic and speak — Tamil, English or Tanglish.
          </span>
        )}
      </div>
    </div>
  );
}

/** Single-line field with the same speak-instead-of-type affordance. */
export function VoiceInput({
  className,
  micLabel = "Speak Instead Of Typing",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { micLabel?: string }) {
  const [recording, setRecording] = React.useState(false);
  const timer = useTimer(recording);

  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 rounded-md border border-hairline bg-surface pr-1.5 pl-3 transition-colors duration-200 focus-within:border-brand",
        recording && "border-brand-tint-border bg-brand-tint",
        className,
      )}
    >
      {recording ? (
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Waveform bars={10} />
          <span className="text-small tabular text-brand-on-tint">{timer}</span>
          <span className="truncate text-small text-secondary-foreground">Listening…</span>
        </div>
      ) : (
        <input
          className="min-w-0 flex-1 bg-transparent text-body text-foreground placeholder:text-tertiary-foreground focus-visible:outline-none"
          {...props}
        />
      )}
      <button
        type="button"
        aria-label={recording ? "Stop Recording" : micLabel}
        aria-pressed={recording}
        onClick={() => setRecording((r) => !r)}
        className={cn(
          "inline-flex size-7 shrink-0 items-center justify-center rounded-pill transition-colors duration-150",
          recording
            ? "mic-recording bg-brand text-on-primary"
            : "bg-brand-tint text-brand-on-tint hover:bg-brand-tint-hover",
        )}
      >
        {recording ? <Square className="size-3" /> : <Mic className="size-3.5" />}
      </button>
    </div>
  );
}
