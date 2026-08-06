import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, FileSpreadsheet, FileText, QrCode, Loader2 } from "lucide-react";
import {
  Btn,
  Card,
  CountBadge,
  EmptyState,
  PageHeader,
  Segmented,
  StatusBadge,
} from "@/components/ds";
import { AiTag } from "@/components/ds/ai";
import { captureReview } from "@/data/demo";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_shell/ingest")({
  head: () => ({
    meta: [
      { title: "Capture — DecisionOS" },
      {
        name: "description",
        content:
          "Bulk import invoices, bills and spreadsheets, then confirm what the AI read in the review queue.",
      },
      { property: "og:title", content: "Capture — DecisionOS" },
      { property: "og:description", content: "Bulk import and the review queue." },
    ],
  }),
  component: CapturePage,
});

const reviewTabs = ["Contacts", "Invoices", "Payments", "Tasks"] as const;

function ImportTab() {
  const [reading, setReading] = React.useState(false);
  const [messages] = React.useState([
    { id: "w1", from: "Ravi Kumar", text: "Delhi retailer asking for 8% off on packaging", when: "09:12" },
    { id: "w2", from: "Acme Packaging", text: "Invoice AP-2291 attached", when: "08:40" },
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="rounded-lg border border-dashed border-hairline-strong bg-surface-sunken p-6 text-center">
            <Upload className="mx-auto size-6 text-tertiary-foreground" aria-hidden="true" />
            <p className="mt-2 text-body-strong text-foreground">Upload Document</p>
            <p className="mt-1 text-small text-secondary-foreground">
              PDF / Photo — Invoice, bill, receipt or PO — AI reads it with OCR
            </p>
            <Btn variant="primary" className="mt-4" onClick={() => setReading(true)}>
              Choose A Document
            </Btn>
          </div>
        </Card>

        <Card>
          <div className="rounded-lg border border-dashed border-hairline-strong bg-surface-sunken p-6 text-center">
            <FileSpreadsheet className="mx-auto size-6 text-tertiary-foreground" aria-hidden="true" />
            <p className="mt-2 text-body-strong text-foreground">Upload CSV</p>
            <p className="mt-1 text-small text-secondary-foreground">
              CSV / Excel — bulk records in one go
            </p>
            <Btn variant="secondary" className="mt-4">
              Choose A Spreadsheet
            </Btn>
          </div>
        </Card>
      </div>

      {reading ? (
        <Card compact className="flex flex-wrap items-center gap-3">
          <Loader2 className="size-4 animate-spin text-brand" aria-hidden="true" />
          <AiTag>Reading with OCR</AiTag>
          <p className="min-w-40 flex-1 text-body text-foreground">
            Reading the document — extracting vendor, amount, date and line items.
          </p>
          <Btn size="sm" variant="tertiary" onClick={() => setReading(false)}>
            Cancel
          </Btn>
        </Card>
      ) : null}

      <Card compact className="flex flex-wrap items-center gap-3">
        <StatusBadge kind="directive">Direction</StatusBadge>
        <p className="min-w-40 flex-1 text-small text-secondary-foreground">
          This looks like an incoming bill you received, not an invoice you issued. Getting this
          wrong reverses the effect on your finances.
        </p>
        <Btn size="sm" variant="secondary">
          It Is Incoming
        </Btn>
        <Btn size="sm" variant="secondary">
          It Is Outgoing
        </Btn>
      </Card>

      <Card compact className="flex flex-wrap items-center gap-3">
        <StatusBadge kind="pending">Own Company</StatusBadge>
        <p className="min-w-40 flex-1 text-small text-secondary-foreground">
          The seller on this document appears to be Preview Industries — your own company. Check
          before accepting it as a bill.
        </p>
      </Card>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <QrCode className="size-5 text-brand" aria-hidden="true" />
          <h2 className="min-w-40 flex-1 text-h3 text-foreground">WhatsApp</h2>
          <Btn size="sm" variant="secondary">
            Connect A Number
          </Btn>
          <Btn size="sm" variant="tertiary">
            Refresh
          </Btn>
        </div>
        <p className="text-small text-secondary-foreground">
          Scan the QR link on your phone to forward messages, photos and voice notes straight into
          the review queue.
        </p>
        {messages.length === 0 ? (
          <EmptyState
            title="No Messages Yet"
            helper="Forwarded WhatsApp messages will appear here within a few seconds."
          />
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => (
              <li
                key={m.id}
                className="flex flex-wrap items-center gap-3 rounded-md border border-hairline px-3 py-2"
              >
                <span className="text-body-strong text-foreground">{m.from}</span>
                <span className="min-w-40 flex-1 text-small text-secondary-foreground">{m.text}</span>
                <span className="text-label tabular text-tertiary-foreground">{m.when}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <section>
        <h2 className="mb-3 text-h3 text-foreground">Records</h2>
        <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-hairline">
                {["Record", "Party", "Amount", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-label text-tertiary-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Invoice AP-2291", "Acme Packaging", 240000, "Awaiting review"],
                ["Payment NEFT 88123", "Coimbatore Distributors", 622300, "Accepted"],
              ].map((r) => (
                <tr key={r[0] as string} className="border-b border-hairline last:border-b-0">
                  <td className="px-4 py-3 text-body text-foreground">{r[0]}</td>
                  <td className="px-4 py-3 text-body text-secondary-foreground">{r[1]}</td>
                  <td className="px-4 py-3 tabular text-body text-foreground">
                    {inr(r[2] as number)}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge kind={r[3] === "Accepted" ? "completed" : "pending"}>
                      {r[3] as string}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ReviewTab() {
  const [tab, setTab] = React.useState<(typeof reviewTabs)[number]>("Invoices");
  const items = captureReview[tab.toLowerCase() as keyof typeof captureReview];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Segmented options={reviewTabs} value={tab} onChange={setTab} label="Review queue" />
        <CountBadge count={items.length} />
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Nothing Waiting In This Queue"
          helper="Parsed captures appear here for a human to confirm before they become records."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((i) => (
            <li key={i.id}>
              <Card className="flex flex-wrap gap-4">
                <div>
                  <p className="text-label text-tertiary-foreground">Under Review — Original File</p>
                  <button
                    type="button"
                    aria-label={`Open the original file for ${i.name}`}
                    className="mt-2 flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-md border border-hairline bg-surface-sunken text-small text-tertiary-foreground hover:bg-surface-hover"
                  >
                    <FileText className="size-5" aria-hidden="true" />
                    Open File
                  </button>
                </div>
                <div className="min-w-48 flex-1 space-y-2">
                  <p className="text-body-strong text-foreground">{i.name}</p>
                  <p className="text-small text-secondary-foreground">{i.detail}</p>
                  <StatusBadge kind={i.confidence.startsWith("High") ? "completed" : "pending"}>
                    {i.confidence}
                  </StatusBadge>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Btn size="sm" variant="secondary">
                      Accept
                    </Btn>
                    <Btn size="sm" variant="secondary">
                      Edit Fields
                    </Btn>
                    <Btn size="sm" variant="destructive">
                      Reject
                    </Btn>
                  </div>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CapturePage() {
  const [tab, setTab] = React.useState<"Import" | "Review">("Import");
  const reviewCount = Object.values(captureReview).reduce((n, v) => n + v.length, 0);

  return (
    <div>
      <PageHeader title="Capture" />
      <div className="mb-6 flex items-center gap-2">
        <Segmented options={["Import", "Review"] as const} value={tab} onChange={setTab} label="Capture mode" />
        <CountBadge count={reviewCount} />
        <span className="text-small text-secondary-foreground">waiting in review</span>
      </div>
      {tab === "Import" ? <ImportTab /> : <ReviewTab />}
    </div>
  );
}
