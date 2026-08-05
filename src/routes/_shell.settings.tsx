import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Btn,
  Card,
  Field,
  PageHeader,
  Segmented,
  StatusBadge,
  TextInput,
} from "@/components/ds";
import { Avatar } from "@/components/ds/bits";
import { currentUser, people, workspace } from "@/data/demo";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DecisionOS" },
      {
        name: "description",
        content: "Company profile, team access, capture channels and what DecisionOS is allowed to decide.",
      },
      { property: "og:title", content: "Settings — DecisionOS" },
      { property: "og:description", content: "Company, team and automation preferences." },
    ],
  }),
  component: SettingsPage,
});

const tabs = ["Company", "Team", "Channels", "Automation"] as const;

function Toggle({ label, hint, on }: { label: string; hint: string; on?: boolean }) {
  const [checked, setChecked] = React.useState(Boolean(on));
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-hairline py-3 last:border-b-0">
      <div className="min-w-48 flex-1">
        <p className="text-body-strong text-foreground">{label}</p>
        <p className="text-small text-secondary-foreground">{hint}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => setChecked((c) => !c)}
        className={
          checked
            ? "h-6 w-11 rounded-pill bg-brand p-0.5 transition-colors duration-150"
            : "h-6 w-11 rounded-pill bg-surface-sunken p-0.5 transition-colors duration-150"
        }
      >
        <span
          className="block size-5 rounded-pill bg-surface shadow-xs transition-transform duration-150"
          style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

function SettingsPage() {
  const [tab, setTab] = React.useState<(typeof tabs)[number]>("Company");

  return (
    <div>
      <PageHeader eyebrow="Company, team and automation preferences" title="Settings" />
      <div className="mb-6">
        <Segmented options={tabs} value={tab} onChange={setTab} label="Settings section" />
      </div>

      {tab === "Company" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="space-y-3">
            <h2 className="text-h3 text-foreground">Company Profile</h2>
            <Field label="Company Name" htmlFor="s-name">
              <TextInput id="s-name" defaultValue={workspace.name} />
            </Field>
            <Field label="Industry" htmlFor="s-ind">
              <TextInput id="s-ind" defaultValue="Packaging manufacturing" />
            </Field>
            <Field label="Base Currency" htmlFor="s-cur" hint="Amounts are grouped in the Indian style.">
              <TextInput id="s-cur" defaultValue="Indian rupee" />
            </Field>
            <Btn variant="secondary">Save Changes</Btn>
          </Card>

          <Card className="space-y-3">
            <h2 className="text-h3 text-foreground">Your Account</h2>
            <div className="flex items-center gap-3">
              <Avatar name={currentUser.name} size={40} />
              <div>
                <p className="text-body-strong text-foreground">{currentUser.name}</p>
                <p className="text-small text-tertiary-foreground">{currentUser.email}</p>
              </div>
            </div>
            <Field label="Display Name" htmlFor="s-you">
              <TextInput id="s-you" defaultValue={currentUser.name} />
            </Field>
            <Btn variant="secondary">Save Changes</Btn>
          </Card>
        </div>
      ) : null}

      {tab === "Team" ? (
        <Card>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-h3 text-foreground">Team &amp; Access</h2>
            <Btn variant="primary" size="sm">
              Invite Someone
            </Btn>
          </div>
          <ul>
            {people.slice(0, 6).map((p) => (
              <li
                key={p.id}
                className="flex flex-wrap items-center gap-3 border-b border-hairline py-3 last:border-b-0"
              >
                <Avatar name={p.name} />
                <div className="min-w-40 flex-1">
                  <p className="text-body-strong text-foreground">{p.name}</p>
                  <p className="text-small text-tertiary-foreground">{p.role}</p>
                </div>
                <StatusBadge kind="neutral">{p.type === "employee" ? "Team" : p.type === "vendor" ? "Vendor" : "Customer"}</StatusBadge>
                <Btn size="sm" variant="tertiary">
                  Change Access
                </Btn>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      {tab === "Channels" ? (
        <Card>
          <h2 className="mb-1 text-h3 text-foreground">Capture Channels</h2>
          <Toggle
            label="WhatsApp Forwarding"
            hint="Forwarded messages, photos and voice notes land in the review queue."
            on
          />
          <Toggle label="Email Capture" hint="Bills sent to the capture address are parsed automatically." />
          <Toggle
            label="Voice Notes"
            hint="Recordings are transcribed and turned into draft decisions."
            on
          />
          <Toggle
            label="Daily Digest"
            hint="One message each morning with what needs you."
            on
          />
        </Card>
      ) : null}

      {tab === "Automation" ? (
        <Card>
          <h2 className="mb-1 text-h3 text-foreground">What DecisionOS May Do On Its Own</h2>
          <Toggle
            label="Draft Decisions From Captures"
            hint="Drafts always wait for you. Nothing is executed without approval."
            on
          />
          <Toggle
            label="Auto-Assign Routine Tasks"
            hint="Tasks matching an existing workflow go straight to their usual owner."
          />
          <Toggle
            label="Escalate After Two Missed Days"
            hint="An overdue task that has been silent for two days comes to your desk."
            on
          />
          <Toggle
            label="Require Proof On Payment Tasks"
            hint="Payment tasks cannot be marked done without an attachment."
            on
          />
          <p className="mt-4 text-small text-secondary-foreground">
            DecisionOS never approves, pays or sends on your behalf. It prepares; you decide.
          </p>
        </Card>
      ) : null}
    </div>
  );
}
