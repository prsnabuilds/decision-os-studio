import * as React from "react";
import { Mic, Square } from "lucide-react";
import { Btn, TextArea } from "@/components/ds";
import { cn } from "@/lib/utils";

/**
 * A reply box that treats speaking as the first-class way to respond.
 * Typing stays available, but the mic is always one tap away.
 */
export function VoiceReply({
  placeholder,
  ariaLabel,
  sendLabel = "Send Response",
  onSend,
}: {
  placeholder: string;
  ariaLabel: string;
  sendLabel?: string;
  onSend?: () => void;
}) {
  const [text, setText] = React.useState("");
  const [recording, setRecording] = React.useState(false);
  const [seconds, setSeconds] = React.useState(0);

  React.useEffect(() => {
    if (!recording) return;
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [recording]);

  const timer = `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;

  if (recording) {
    return (
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-brand-tint px-4 py-3">
        <span className="mic-recording flex size-10 items-center justify-center rounded-pill bg-brand text-on-primary">
          <Mic className="size-4" aria-hidden="true" />
        </span>
        <div className="min-w-32 flex-1">
          <p className="text-body-strong text-brand-on-tint">Listening…</p>
          <p className="text-small tabular text-secondary-foreground">{timer}</p>
        </div>
        <Btn
          size="sm"
          variant="secondary"
          onClick={() => {
            setRecording(false);
            setSeconds(0);
            onSend?.();
          }}
        >
          <Square className="size-3.5" aria-hidden="true" /> Stop &amp; Send
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
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2">
        <button
          type="button"
          aria-label="Speak Your Response"
          onClick={() => setRecording(true)}
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-pill bg-brand text-on-primary shadow-xs transition-colors duration-150 hover:bg-brand-hover",
          )}
        >
          <Mic className="size-4" aria-hidden="true" />
        </button>
        <TextArea
          rows={2}
          aria-label={ariaLabel}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 pl-13">
        <Btn
          size="sm"
          variant="secondary"
          onClick={() => {
            setText("");
            onSend?.();
          }}
        >
          {sendLabel}
        </Btn>
        <span className="text-small text-tertiary-foreground">
          Or tap the mic - speaking is faster than typing.
        </span>
      </div>
    </div>
  );
}
