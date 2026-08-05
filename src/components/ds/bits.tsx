import { Mic, MessageCircle, Type, FileUp } from "lucide-react";
import type { Source } from "@/data/demo";

export function SourceLabel({ source }: { source: Source }) {
  const map = {
    voice: { Icon: Mic, label: "Voice" },
    whatsapp: { Icon: MessageCircle, label: "WhatsApp" },
    text: { Icon: Type, label: "Text" },
    upload: { Icon: FileUp, label: "Upload" },
  } as const;
  const { Icon, label } = map[source];
  return (
    <span className="inline-flex items-center gap-1.5 text-label text-tertiary-foreground">
      <Icon className="size-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}

export function Avatar({ name, size = 28 }: { name: string; size?: number }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("");
  return (
    <span
      className="inline-flex items-center justify-center rounded-pill bg-surface-sunken text-label text-secondary-foreground"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function PersonChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-pill border border-hairline bg-surface px-2 py-0.5 text-label text-secondary-foreground">
      <Avatar name={name} size={18} />
      {name}
    </span>
  );
}
