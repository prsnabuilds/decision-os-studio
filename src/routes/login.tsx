import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Btn, Field, Segmented, TextInput } from "@/components/ds";
import { Wordmark } from "@/components/AppShell";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In - DecisionOS" },
      {
        name: "description",
        content: "Sign in to DecisionOS with a password or a one-time code sent to your phone.",
      },
      { property: "og:title", content: "Sign In - DecisionOS" },
      { property: "og:description", content: "Your business decisions, structured and tracked." },
    ],
  }),
  component: LoginPage,
});

const tabs = ["Password", "Passwordless"] as const;

function LoginPage() {
  const [tab, setTab] = React.useState<(typeof tabs)[number]>("Password");
  const [mode, setMode] = React.useState<"in" | "up">("in");
  const [error, setError] = React.useState("");
  const [sent, setSent] = React.useState(false);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-neutral-900 p-10 lg:flex">
        <span className="inline-flex items-center gap-2.5">
          <span className="inline-flex size-8 items-center justify-center rounded-lg bg-brand-500 text-body-strong font-bold text-white">
            D
          </span>
          <span className="text-h3 font-bold">
            <span className="text-white">Decision</span>
            <span className="text-brand-300">OS</span>
          </span>
        </span>
        <div>
          <p className="max-w-md text-h2 text-white">
            Speak the decision. It becomes tasks, approvals and memory - before you reach the
            godown.
          </p>
          <p className="mt-3 max-w-md text-body text-neutral-300">
            Voice, text, WhatsApp and documents, captured once and executed forever.
          </p>
        </div>
        <p className="text-small text-neutral-500">Built for Indian SMEs.</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Wordmark />
          </div>
          <h1 className="mt-6 text-h1 text-foreground">
            {mode === "in" ? "Sign In" : "Create Your Workspace"}
          </h1>
          <p className="mt-1 text-small text-secondary-foreground">
            {mode === "in"
              ? "Welcome back to your morning brief."
              : "Start with your company and add your team after."}
          </p>

          <div className="mt-6">
            <Segmented options={tabs} value={tab} onChange={setTab} label="Sign in method" />
          </div>

          {error ? (
            <p role="alert" className="mt-4 text-small text-destructive">
              {error}
            </p>
          ) : null}

          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError("That email and password did not match. Try again.");
            }}
          >
            {mode === "up" ? (
              <Field label="Company Name" htmlFor="company">
                <TextInput id="company" placeholder="Your company name" />
              </Field>
            ) : null}

            <Field label="Email" htmlFor="email">
              <TextInput id="email" type="email" placeholder="you@company.in" />
            </Field>

            {tab === "Password" ? (
              <Field label="Password" htmlFor="password">
                <TextInput id="password" type="password" placeholder="••••••••" />
              </Field>
            ) : (
              <Field
                label="One-Time Code"
                htmlFor="otp"
                hint={sent ? "Code sent to +91 98400 •••23" : "We will text a six-digit code."}
              >
                <div className="flex gap-2">
                  <TextInput id="otp" inputMode="numeric" placeholder="••••••" />
                  <Btn variant="secondary" type="button" onClick={() => setSent(true)}>
                    Send Code
                  </Btn>
                </div>
              </Field>
            )}

            <Btn variant="primary" type="submit" className="w-full">
              {mode === "in" ? "Sign In" : "Create Workspace"}
            </Btn>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <Btn variant="tertiary" size="sm" onClick={() => setMode(mode === "in" ? "up" : "in")}>
              {mode === "in" ? "Create An Account" : "I Already Have An Account"}
            </Btn>
            <Btn variant="tertiary" size="sm" asChild>
              <Link to="/home">Continue To The Demo</Link>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
