import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, MessageCircle, FileText, Type } from "lucide-react";
import { Btn, Card } from "@/components/ds";
import { Wordmark } from "@/components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DecisionOS — The Operating Brain For Founder-Led Businesses" },
      {
        name: "description",
        content:
          "Speak the decision and DecisionOS structures it into tasks, approvals and workflows — tracked, chased and permanently searchable.",
      },
      { property: "og:title", content: "DecisionOS — The Operating Brain For Founder-Led Businesses" },
      {
        property: "og:description",
        content: "Speak the decision and DecisionOS structures it into tasks, approvals and workflows — tracked, chased and permanently searchable.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: Mic,
    title: "Speak In Any Language",
    body: "English, Tamil or Tanglish. The founder never changes how they talk in order to be organised.",
  },
  {
    icon: MessageCircle,
    title: "Forward A WhatsApp Message",
    body: "A message from a dealer becomes a decision record, a task and an owner.",
  },
  {
    icon: FileText,
    title: "Photograph The Order Book",
    body: "Invoices, order books and business cards are read, checked and filed.",
  },
  {
    icon: Type,
    title: "Type One Line",
    body: "One sentence in becomes tasks, assignees and deadlines out.",
  },
];

const comparison = [
  ["What usually happens", "What DecisionOS does"],
  ["The decision lives in the founder's head", "The decision is written, assigned and searchable"],
  ["Follow-up depends on someone remembering", "Follow-up is chased automatically"],
  ["Every morning starts with nine dashboards", "Every morning starts with one brief"],
];

const testimonials = [
  {
    quote:
      "I stopped repeating myself. I say it once in the van and by the time I reach the godown it is already assigned.",
    who: "Founder, packaging manufacturer, Coimbatore",
  },
  {
    quote:
      "The morning screen tells me the three things. Not thirty numbers. Three things.",
    who: "Managing Partner, distribution business, Chennai",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-hairline bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
          <Wordmark />
          <div className="flex items-center gap-2">
            <Btn variant="tertiary" asChild>
              <Link to="/login">Log In</Link>
            </Btn>
            <Btn variant="primary" asChild>
              <Link to="/login">Sign Up</Link>
            </Btn>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 pb-24 sm:px-6">
        <section className="py-20 text-center">
          <p className="text-label text-tertiary-foreground">
            The Operating Brain for Founder-Led Businesses
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl text-display text-foreground">
            Speak the decision. <span className="text-brand">We run the company.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lead text-secondary-foreground">
            The founder holds the whole business in their head. DecisionOS is where that knowledge
            goes, so it stops living only there — structured into tasks, approvals and workflows the
            moment it is spoken.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Btn variant="primary" size="lg" asChild>
              <Link to="/login">Get Started Free</Link>
            </Btn>
            <Btn variant="secondary" size="lg" asChild>
              <Link to="/home">See How It Works</Link>
            </Btn>
          </div>
          <p className="mt-6 text-small text-tertiary-foreground">
            Voice · Text · WhatsApp · Documents — captured once, executed forever.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title}>
              <f.icon className="size-5 text-brand" aria-hidden="true" />
              <h2 className="mt-3 text-h3 text-foreground">{f.title}</h2>
              <p className="mt-1 text-small text-secondary-foreground">{f.body}</p>
            </Card>
          ))}
        </section>

        <section className="mt-20">
          <h2 className="text-h2 text-foreground">The Difference</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-hairline bg-surface">
            {comparison.map(([a, b], i) => (
              <div
                key={a}
                className="grid grid-cols-1 gap-1 border-b border-hairline px-5 py-4 last:border-b-0 sm:grid-cols-2 sm:gap-6"
              >
                <p
                  className={
                    i === 0 ? "text-label text-tertiary-foreground" : "text-body text-secondary-foreground"
                  }
                >
                  {a}
                </p>
                <p className={i === 0 ? "text-label text-tertiary-foreground" : "text-body text-foreground"}>
                  {b}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <blockquote
              key={t.who}
              className="rounded-lg border border-hairline border-l-[3px] border-l-brand bg-surface p-5"
            >
              <p className="text-body text-foreground">"{t.quote}"</p>
              <footer className="mt-3 text-small text-tertiary-foreground">{t.who}</footer>
            </blockquote>
          ))}
        </section>

        <section className="mt-20 rounded-xl border border-hairline bg-surface px-6 py-14 text-center">
          <h2 className="text-h2 text-foreground">Say it once. It gets done.</h2>
          <p className="mx-auto mt-2 max-w-xl text-body text-secondary-foreground">
            Start with a single spoken decision this morning and watch it turn into tracked work.
          </p>
          <div className="mt-6 flex justify-center">
            <Btn variant="primary" size="lg" asChild>
              <Link to="/login">Get Started Free</Link>
            </Btn>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline py-8 text-center text-small text-tertiary-foreground">
        DecisionOS · Built for Indian SMEs ·{" "}
        <Link to="/design-system" className="text-brand">
          Design System
        </Link>
      </footer>
    </div>
  );
}
