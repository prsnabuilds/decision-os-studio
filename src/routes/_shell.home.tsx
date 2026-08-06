import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Stamp, Flame, CalendarClock } from "lucide-react";
import { VoiceCapture } from "@/components/capture/VoiceCapture";
import { buildRanked } from "@/data/demo";
import { plural } from "@/lib/format";

export const Route = createFileRoute("/_shell/home")({
  head: () => ({
    meta: [
      { title: "Home - Capture A Decision | DecisionOS" },
      {
        name: "description",
        content:
          "Speak a decision in Tamil, English or Tanglish. DecisionOS writes it up, assigns the work and tracks it for you.",
      },
      { property: "og:title", content: "Home - Capture A Decision | DecisionOS" },
      {
        property: "og:description",
        content: "The first thing you do each morning: say what needs to happen.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomeCapture,
});

function HomeCapture() {
  const ranked = buildRanked();
  const count = (tier: string) => ranked.filter((r) => r.tier === tier).length;

  const glance = [
    { icon: Stamp, label: "Waiting On You", value: count("approval") },
    { icon: Flame, label: "Overdue", value: count("overdue") + count("escalation") },
    { icon: CalendarClock, label: "Due Today", value: count("today") },
  ];

  return (
    <div className="space-y-8">
      <VoiceCapture />

      <section aria-labelledby="glance-heading" className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="glance-heading" className="text-h3 text-foreground">
            While You Were Away
          </h2>
          <Link
            to="/inbox"
            className="inline-flex items-center gap-1 text-small text-brand hover:underline"
          >
            Open The Decision Desk <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {glance.map((g) => (
            <Link
              key={g.label}
              to="/inbox"
              className="rounded-lg bg-surface px-4 py-3 shadow-xs transition-colors duration-150 hover:bg-surface-hover"
            >
              <span className="flex items-center gap-2 text-small text-secondary-foreground">
                <g.icon className="size-4" aria-hidden="true" />
                {g.label}
              </span>
              <span className="mt-1 block text-h2 tabular text-foreground">{g.value}</span>
              <span className="text-small text-tertiary-foreground">
                {plural(g.value, "item", "items")}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
