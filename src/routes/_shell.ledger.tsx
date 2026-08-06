import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Btn, Card, EmptyState, Field, PageHeader, Segmented, Select, StatusBadge, TextInput } from "@/components/ds";
import { AiBtn, AiTag } from "@/components/ds/ai";
import { VoiceInput } from "@/components/ds/voice";
import { finance, people } from "@/data/demo";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/_shell/ledger")({
  head: () => ({
    meta: [
      { title: "Finance — DecisionOS" },
      {
        name: "description",
        content:
          "Money in one place: revenue, spend, assets and inventory with an AI brief over your own records.",
      },
      { property: "og:title", content: "Finance — DecisionOS" },
      { property: "og:description", content: "Revenue, spend, assets and inventory in one place." },
    ],
  }),
  component: FinancePage,
});

const tabs = ["Overview", "Revenue", "Expenses", "Assets", "Inventory"] as const;

function Kpi({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md bg-surface p-3 shadow-xs">
      <p className="text-label text-tertiary-foreground">{label}</p>
      <p className="mt-0.5 text-h3 tabular text-foreground">{inr(value)}</p>
    </div>
  );
}


function Table({
  columns,
  rows,
  empty,
}: {
  columns: string[];
  rows: (string | number)[][];
  empty: string;
}) {
  if (rows.length === 0) {
    return <EmptyState title="Nothing Here Yet" helper={empty} />;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-hairline bg-surface">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-hairline">
            {columns.map((c) => (
              <th key={c} className="px-4 py-3 text-label text-tertiary-foreground">
                {c}
              </th>
            ))}
            <th className="px-4 py-3 text-label text-tertiary-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-hairline last:border-b-0">
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={
                    typeof cell === "number"
                      ? "px-4 py-3 tabular text-body text-foreground"
                      : "px-4 py-3 text-body text-secondary-foreground"
                  }
                >
                  {typeof cell === "number" ? inr(cell) : cell}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  <Btn size="sm" variant="tertiary">
                    View Attachment
                  </Btn>
                  <Btn size="sm" variant="tertiary">
                    Reclassify
                  </Btn>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Overview() {
  const max = Math.max(...finance.monthlySpend.map((m) => m.amount));
  const maxCat = Math.max(...finance.categories.map((c) => c.amount));
  return (
    <div className="space-y-8">
      <section className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        <Kpi label="Revenue Billed" value={finance.revenueBilled} />
        <Kpi label="Revenue Received" value={finance.revenueReceived} />
        <Kpi label="Total Spend" value={finance.totalSpend} />
        <Kpi label="Net Profit" value={finance.netProfit} />
        <Kpi label="Asset Value" value={finance.assetValue} />
        <Kpi label="Inventory Value" value={finance.inventoryValue} />
      </section>

      <Card className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-h3 text-foreground">Finance Brief</h2>
          <AiTag>Answered by DecisionOS</AiTag>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <VoiceInput
            aria-label="Ask about your finances"
            className="min-w-60 flex-1"
            micLabel="Speak Your Finance Question"
            placeholder="Ask about spend, dues or margins"
          />
          <AiBtn>Ask</AiBtn>
        </div>
      </Card>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-h3 text-foreground">Monthly Spend</h2>
          <div className="mt-4 flex h-40 items-end gap-3">
            {finance.monthlySpend.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <span
                  className="w-full rounded-sm bg-brand"
                  style={{ height: `${(m.amount / max) * 120}px` }}
                  aria-hidden="true"
                />
                <span className="text-label text-tertiary-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-h3 text-foreground">By Category</h2>
          <ul className="mt-4 space-y-3">
            {finance.categories.map((c) => (
              <li key={c.name}>
                <div className="flex items-center justify-between">
                  <span className="text-small text-secondary-foreground">{c.name}</span>
                  <span className="tabular text-small text-foreground">{inr(c.amount)}</span>
                </div>
                <span className="mt-1 block h-1.5 w-full rounded-pill bg-surface-sunken">
                  <span
                    className="block h-full rounded-pill bg-brand"
                    style={{ width: `${(c.amount / maxCat) * 100}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <Card>
        <h2 className="text-h3 text-foreground">Top Vendors By Spend</h2>
        <ul className="mt-3 space-y-2">
          {finance.vendors.map((v) => (
            <li key={v.name} className="flex items-center justify-between">
              <span className="text-body text-foreground">{v.name}</span>
              <span className="tabular text-body text-foreground">{inr(v.amount)}</span>
            </li>
          ))}
        </ul>
      </Card>

      <section>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <h2 className="text-h2 text-foreground">Insights</h2>
          <AiTag>Spotted by DecisionOS</AiTag>
        </div>
        <ul className="space-y-2">
          {finance.insights.map((i) => (
            <li key={i}>
              <InsightRow insight={i} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function InsightRow({ insight }: { insight: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <Card compact>
      <div className="flex flex-wrap items-center gap-3">
        <p className="min-w-48 flex-1 text-body text-foreground">{insight}</p>
        <Btn size="sm" variant="secondary" onClick={() => setOpen((o) => !o)}>
          Create Task
        </Btn>
      </div>
      {open ? (
        <div className="mt-3 grid gap-3 border-t border-hairline pt-3 sm:grid-cols-2">
          <Field label="Task Title" htmlFor="ins-title">
            <TextInput id="ins-title" defaultValue={insight.slice(0, 48)} />
          </Field>
          <Field label="Assignee" htmlFor="ins-assignee">
            <Select id="ins-assignee" options={staffOptions} placeholder="Choose who owns it" />
          </Field>
          <div>
            <Btn size="sm" variant="secondary" onClick={() => setOpen(false)}>
              Create Task
            </Btn>
          </div>
        </div>
      ) : null}
    </Card>
  );
}

const staffOptions = people.filter((p) => p.type === "employee").map((p) => p.name);
const customerOptions = people.filter((p) => p.type === "customer").map((p) => p.name);
const vendorOptions = people.filter((p) => p.type === "vendor").map((p) => p.name);
const categoryOptions = finance.categories.map((c) => c.name);

function FinancePage() {
  const [tab, setTab] = React.useState<(typeof tabs)[number]>("Overview");
  const [form, setForm] = React.useState(false);

  return (
    <div>
      <PageHeader eyebrow="Money in one place" title="Finance">
        <Btn variant="secondary">Upload Statement Or Bill</Btn>
        <Btn variant="secondary">Fix Old Purchases</Btn>
      </PageHeader>

      <div className="mb-6">
        <Segmented options={tabs} value={tab} onChange={setTab} label="Finance section" />
      </div>

      {tab === "Overview" ? <Overview /> : null}

      {tab !== "Overview" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Btn variant="primary" onClick={() => setForm((f) => !f)}>
              {tab === "Revenue"
                ? "Add Income"
                : tab === "Expenses"
                  ? "Add Expense"
                  : tab === "Assets"
                    ? "Add Asset"
                    : "Add Item"}
            </Btn>
          </div>

          {form ? (
            <Card className="grid gap-3 sm:grid-cols-2">
              <Field label="Title" htmlFor="fin-title">
                <TextInput id="fin-title" />
              </Field>
              <Field label={tab === "Revenue" ? "Customer" : "Vendor"} htmlFor="fin-party">
                <Select
                  id="fin-party"
                  options={tab === "Revenue" ? customerOptions : vendorOptions}
                  placeholder={tab === "Revenue" ? "Choose a customer" : "Choose a vendor"}
                />
              </Field>
              <Field label="Amount" htmlFor="fin-amount">
                <TextInput id="fin-amount" inputMode="numeric" />
              </Field>
              <Field label="Category" htmlFor="fin-cat">
                <div className="flex gap-2">
                  <Select id="fin-cat" options={categoryOptions} placeholder="Choose a category" className="flex-1" />
                  <AiBtn type="button">Suggest</AiBtn>
                </div>
              </Field>
              <div className="sm:col-span-2 flex gap-2">
                <Btn variant="secondary" onClick={() => setForm(false)}>
                  Save
                </Btn>
                <Btn variant="tertiary" onClick={() => setForm(false)}>
                  Cancel
                </Btn>
              </div>
            </Card>
          ) : null}

          {tab === "Revenue" ? (
            <div className="space-y-6">
              <div>
                <h2 className="mb-3 text-h3 text-foreground">Sales &amp; Service Invoices</h2>
                <Table
                  columns={["Invoice", "Customer", "Amount", "Status"]}
                  rows={finance.invoices.map((i) => [i.title, i.party, i.amount, i.status])}
                  empty="Invoices you issue will appear here."
                />
              </div>
              <div>
                <h2 className="mb-3 text-h3 text-foreground">Payments Received</h2>
                <Table
                  columns={["Payment", "Customer", "Amount", "Status"]}
                  rows={finance.payments.map((p) => [p.title, p.party, p.amount, p.status])}
                  empty="Payments received will appear here."
                />
              </div>
            </div>
          ) : null}

          {tab === "Expenses" ? (
            <Table
              columns={["Expense", "Vendor", "Amount", "Category"]}
              rows={finance.expenses.map((e) => [e.title, e.vendor, e.amount, e.category])}
              empty="Bills and purchases will appear here once captured."
            />
          ) : null}

          {tab === "Assets" ? (
            <Table
              columns={["Asset", "Category", "Value"]}
              rows={finance.assets.map((a) => [a.name, a.category, a.amount])}
              empty="Machinery, fixtures and equipment will appear here."
            />
          ) : null}

          {tab === "Inventory" ? (
            <Table
              columns={["Item", "Quantity", "Cost"]}
              rows={finance.inventory.map((i) => [i.item, i.quantity, i.cost])}
              empty="Stock you record will appear here."
            />
          ) : null}
        </div>
      ) : null}

      <p className="mt-6 text-small text-tertiary-foreground">
        Figures are drawn from your own records. Where two sources disagree, both are shown rather
        than reconciled silently.
      </p>
      <StatusBadge kind="neutral" className="mt-3">
        Also reachable at /finance
      </StatusBadge>
    </div>
  );
}
