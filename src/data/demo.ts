export type Source = "voice" | "whatsapp" | "text" | "upload";

export type Person = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  type: "employee" | "customer" | "vendor";
  company?: string;
  phone?: string;
  status: "active" | "inactive";
};

export type Decision = {
  id: string;
  title: string;
  summary: string;
  source: Source;
  raisedBy: string;
  createdOn: string;
  waitingDays: number;
  amount?: number;
  status: "pending" | "approved" | "rejected";
  unblocks: { id: string; title: string; assignee: string; requireProof: boolean }[];
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  assignee: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "in_progress" | "blocked" | "done";
  progress: 0 | 25 | 50 | 75 | 100;
  requireProof: boolean;
  /** negative = overdue days, 0 = today, positive = days ahead */
  dueInDays: number;
  kind: "task" | "escalation" | "handoff";
  raisedBy?: string;
  step?: string;
  steps?: string[];
};

export const workspace = {
  name: "Preview Industries",
  customerLabel: "Customers",
  vendorLabel: "Vendors",
};

export const currentUser = {
  name: "Prasanna Narayanan",
  email: "prasanna@previewindustries.in",
  role: "Owner",
};

export const people: Person[] = [
  {
    id: "p1",
    name: "Prasanna Narayanan",
    email: "prasanna@previewindustries.in",
    role: "Owner",
    department: "Leadership",
    type: "employee",
    phone: "+91 98400 11223",
    status: "active",
  },
  {
    id: "p2",
    name: "Ravi Kumar",
    email: "ravi@previewindustries.in",
    role: "Sales",
    department: "Sales",
    type: "employee",
    phone: "+91 98401 44551",
    status: "active",
  },
  {
    id: "p3",
    name: "Meena Raghavan",
    email: "meena@previewindustries.in",
    role: "Operations",
    department: "Operations",
    type: "employee",
    phone: "+91 98402 77310",
    status: "active",
  },
  {
    id: "c1",
    name: "Delhi Retail Mart",
    company: "Delhi Retail Mart Pvt Ltd",
    email: "buying@delhiretailmart.in",
    role: "Retailer",
    department: "-",
    type: "customer",
    phone: "+91 98110 22114",
    status: "active",
  },
  {
    id: "c2",
    name: "Coimbatore Distributors",
    company: "CBE Distributors LLP",
    email: "accounts@cbedist.in",
    role: "Distributor",
    department: "-",
    type: "customer",
    phone: "+91 99447 88120",
    status: "active",
  },
  {
    id: "c3",
    name: "Salem Retailer Hub",
    company: "Salem Retailer Hub",
    email: "hub@salemretail.in",
    role: "Retailer",
    department: "-",
    type: "customer",
    phone: "+91 90031 55672",
    status: "inactive",
  },
  {
    id: "v1",
    name: "Acme Packaging",
    company: "Acme Packaging Industries",
    email: "sales@acmepack.in",
    role: "Packaging supplier",
    department: "-",
    type: "vendor",
    phone: "+91 98450 33001",
    status: "active",
  },
  {
    id: "v2",
    name: "Southern Transport",
    company: "Southern Transport Co.",
    email: "ops@southerntransport.in",
    role: "Freight",
    department: "-",
    type: "vendor",
    phone: "+91 94440 12093",
    status: "active",
  },
];

export const decisions: Decision[] = [
  {
    id: "d1",
    title: "Approve supplier payment timing",
    summary:
      "Move the ₹4,80,000 payment to Friday to preserve payroll headroom while maintaining the committed supplier window.",
    source: "voice",
    raisedBy: "Prasanna Narayanan",
    createdOn: "2 August 2026",
    waitingDays: 3,
    amount: 480000,
    status: "pending",
    unblocks: [
      {
        id: "d1t1",
        title: "Reschedule the Acme Packaging payment to Friday",
        assignee: "Meena Raghavan",
        requireProof: true,
      },
      {
        id: "d1t2",
        title: "Confirm the revised window with Acme Packaging",
        assignee: "Ravi Kumar",
        requireProof: false,
      },
    ],
  },
  {
    id: "d2",
    title: "Delhi retailer wants revised quote",
    summary: "Retailer asked for 8% off the packaging line. Margin holds at 6%.",
    source: "whatsapp",
    raisedBy: "Ravi Kumar",
    createdOn: "3 August 2026",
    waitingDays: 2,
    amount: 320000,
    status: "pending",
    unblocks: [
      { id: "d2t1", title: "Send the revised Delhi quote", assignee: "Ravi Kumar", requireProof: false },
    ],
  },
  {
    id: "d3",
    title: "Raise freight rate on the Chennai route",
    summary:
      "Transporter wants 11% more from next month. Holding the current rate means absorbing ₹38,000 a month.",
    source: "whatsapp",
    raisedBy: "Meena Raghavan",
    createdOn: "3 August 2026",
    waitingDays: 2,
    amount: 38000,
    status: "pending",
    unblocks: [
      {
        id: "d3t1",
        title: "Renegotiate the Southern Transport contract",
        assignee: "Meena Raghavan",
        requireProof: false,
      },
    ],
  },
  {
    id: "d4",
    title: "Hire a second dispatch coordinator",
    summary: "Dispatch has slipped four times this month with one coordinator covering both shifts.",
    source: "voice",
    raisedBy: "Prasanna Narayanan",
    createdOn: "4 August 2026",
    waitingDays: 1,
    status: "pending",
    unblocks: [
      { id: "d4t1", title: "Open the dispatch coordinator role", assignee: "Meena Raghavan", requireProof: false },
    ],
  },
  {
    id: "d5",
    title: "Write off the damaged carton stock",
    summary: "₹1,15,000 of packaging damaged in the monsoon leak. Insurance covers a third of it.",
    source: "text",
    raisedBy: "Meena Raghavan",
    createdOn: "4 August 2026",
    waitingDays: 1,
    amount: 115000,
    status: "pending",
    unblocks: [
      { id: "d5t1", title: "File the insurance claim for the leak", assignee: "Meena Raghavan", requireProof: true },
    ],
  },
  {
    id: "d6",
    title: "Extend credit terms for the Coimbatore distributor",
    summary:
      "Asked to move from 30 to 45 days. They have never missed a payment; it costs ₹62,000 of working capital.",
    source: "whatsapp",
    raisedBy: "Ravi Kumar",
    createdOn: "5 August 2026",
    waitingDays: 0,
    amount: 62000,
    status: "pending",
    unblocks: [
      { id: "d6t1", title: "Update the Coimbatore credit terms", assignee: "Ravi Kumar", requireProof: false },
    ],
  },
];

export const tasks: Task[] = [
  {
    id: "t1",
    title: "Chennai stockist wants a callback today",
    description: "Stockist is asking whether we can hold last quarter's rate for the festive order.",
    assignee: "Prasanna Narayanan",
    raisedBy: "Ravi Kumar",
    kind: "escalation",
    priority: "high",
    status: "blocked",
    progress: 25,
    requireProof: false,
    dueInDays: 0,
    step: "Rate confirmation",
  },
  {
    id: "t2",
    title: "Approve the revised packaging artwork",
    description: "Vendor needs sign-off before the plates are cut.",
    amount: 88000,
    assignee: "Prasanna Narayanan",
    raisedBy: "Meena Raghavan",
    kind: "escalation",
    priority: "high",
    status: "blocked",
    progress: 50,
    requireProof: true,
    dueInDays: 1,
    step: "Artwork approval",
  },
  {
    id: "t3",
    title: "Take over the Trichy dealer conversation",
    description: "Ravi is on the Delhi trip this week and the dealer expects a reply.",
    assignee: "Prasanna Narayanan",
    raisedBy: "Ravi Kumar",
    kind: "handoff",
    priority: "medium",
    status: "todo",
    progress: 0,
    requireProof: false,
    dueInDays: 2,
  },
  {
    id: "t4",
    title: "Reconcile packaging invoice against the GRN",
    amount: 240000,
    assignee: "Meena Raghavan",
    kind: "task",
    priority: "high",
    status: "in_progress",
    progress: 50,
    requireProof: true,
    dueInDays: -6,
    steps: ["Pull the GRN copy", "Match line items", "Flag the shortfall to Acme Packaging"],
  },
  {
    id: "t5",
    title: "Return the signed transporter agreement",
    assignee: "Meena Raghavan",
    kind: "task",
    priority: "medium",
    status: "todo",
    progress: 25,
    requireProof: true,
    dueInDays: -4,
  },
  {
    id: "t6",
    title: "Release the quarterly distributor payout",
    amount: 1800000,
    assignee: "Prasanna Narayanan",
    kind: "task",
    priority: "high",
    status: "todo",
    progress: 0,
    requireProof: false,
    dueInDays: -3,
  },
  {
    id: "t7",
    title: "Chase the Salem retailer receivable",
    amount: 95000,
    assignee: "Ravi Kumar",
    kind: "task",
    priority: "medium",
    status: "in_progress",
    progress: 75,
    requireProof: false,
    dueInDays: -3,
  },
  {
    id: "t8",
    title: "Confirm the monsoon leak repair quote",
    amount: 610000,
    assignee: "Meena Raghavan",
    kind: "task",
    priority: "high",
    status: "todo",
    progress: 0,
    requireProof: false,
    dueInDays: -1,
  },
  {
    id: "t9",
    title: "Confirm dispatch schedule with the transporter",
    amount: 420000,
    assignee: "Meena Raghavan",
    kind: "task",
    priority: "high",
    status: "in_progress",
    progress: 50,
    requireProof: false,
    dueInDays: 0,
  },
  {
    id: "t10",
    title: "Send the revised Delhi quote",
    assignee: "Ravi Kumar",
    kind: "task",
    priority: "medium",
    status: "todo",
    progress: 0,
    requireProof: false,
    dueInDays: 0,
  },
  {
    id: "t11",
    title: "Sign off the weekly payroll run",
    amount: 75000,
    assignee: "Prasanna Narayanan",
    kind: "task",
    priority: "medium",
    status: "todo",
    progress: 0,
    requireProof: false,
    dueInDays: 0,
  },
  {
    id: "t12",
    title: "Plan the Diwali dispatch schedule",
    assignee: "Meena Raghavan",
    kind: "task",
    priority: "low",
    status: "todo",
    progress: 0,
    requireProof: false,
    dueInDays: 21,
  },
  {
    id: "t13",
    title: "Leave request - Ravi Kumar",
    assignee: "Prasanna Narayanan",
    kind: "task",
    priority: "low",
    status: "done",
    progress: 100,
    requireProof: false,
    dueInDays: -8,
  },
];

/* ---------------- Desk tiering ---------------- */

export type Tier = "approval" | "escalation" | "overdue" | "today";

export type RankedItem = {
  id: string;
  tier: Tier;
  title: string;
  reason: string;
  amount?: number | undefined;
  urgency?: "overdue" | "today" | undefined;
  kind: "decision" | "task";
};

export function buildRanked(): RankedItem[] {
  const approvals: RankedItem[] = decisions
    .filter((d) => d.status === "pending")
    .sort((a, b) => b.waitingDays - a.waitingDays)
    .map((d) => ({
      id: d.id,
      tier: "approval" as const,
      title: d.title,
      reason: "Waiting on your approval - work is blocked until you decide",
      amount: d.amount,
      kind: "decision" as const,
    }));

  const escalations: RankedItem[] = tasks
    .filter((t) => (t.kind === "escalation" || t.kind === "handoff") && t.status !== "done")
    .map((t) => ({
      id: t.id,
      tier: "escalation" as const,
      title: t.title,
      reason: `${t.raisedBy} ${t.kind === "escalation" ? "escalated" : "handed"} this to you`,
      amount: t.amount,
      kind: "task" as const,
    }));

  const overdue: RankedItem[] = tasks
    .filter((t) => t.kind === "task" && t.status !== "done" && t.dueInDays < 0)
    .sort((a, b) => {
      const days = Math.abs(a.dueInDays) - Math.abs(b.dueInDays);
      // Worst first; amount only breaks ties inside the same day count.
      if (days !== 0) return -days;
      return (b.amount ?? 0) - (a.amount ?? 0);
    })
    .map((t) => ({
      id: t.id,
      tier: "overdue" as const,
      title: t.title,
      reason: `${Math.abs(t.dueInDays)} ${Math.abs(t.dueInDays) === 1 ? "day" : "days"} overdue`,
      amount: t.amount,
      urgency: "overdue" as const,
      kind: "task" as const,
    }));

  const dueToday: RankedItem[] = tasks
    .filter((t) => t.kind === "task" && t.status !== "done" && t.dueInDays === 0)
    .sort((a, b) => (b.amount ?? 0) - (a.amount ?? 0))
    .map((t) => ({
      id: t.id,
      tier: "today" as const,
      title: t.title,
      reason: "Due today",
      amount: t.amount,
      urgency: "today" as const,
      kind: "task" as const,
    }));

  return [...approvals, ...escalations, ...overdue, ...dueToday];
}

/** One slot per populated tier before any tier takes a second. */
export function topThree(ranked: RankedItem[], slots = 3): RankedItem[] {
  const order: Tier[] = ["approval", "escalation", "overdue", "today"];
  const picked: RankedItem[] = [];
  for (const tier of order) {
    if (picked.length >= slots) break;
    const first = ranked.find((r) => r.tier === tier);
    if (first) picked.push(first);
  }
  for (const item of ranked) {
    if (picked.length >= slots) break;
    if (!picked.includes(item)) picked.push(item);
  }
  return picked.slice(0, slots);
}

export type FeedClass =
  | "Customer"
  | "Supplier"
  | "Invoice"
  | "Payment"
  | "Complaint"
  | "Task"
  | "Approval"
  | "Reminder";

export type FeedItem = {
  id: string;
  classification: FeedClass;
  source: Source;
  title: string;
  preview: string;
  amount?: number;
  urgency: "overdue" | "today" | "later" | "closed";
  status: "pending" | "open" | "closed";
  duplicates?: number;
};

export const feed: FeedItem[] = [
  {
    id: "f1",
    classification: "Invoice",
    source: "upload",
    title: "Reconcile packaging invoice against the GRN",
    preview: "Acme Packaging invoice #AP-2291 - quantities do not match the goods receipt.",
    amount: 240000,
    urgency: "overdue",
    status: "open",
    duplicates: 2,
  },
  {
    id: "f2",
    classification: "Payment",
    source: "voice",
    title: "Release the quarterly distributor payout",
    preview: "Quarterly payout across four distributors, held pending your release.",
    amount: 1800000,
    urgency: "overdue",
    status: "open",
  },
  {
    id: "f3",
    classification: "Customer",
    source: "whatsapp",
    title: "Chase the Salem retailer receivable",
    preview: "Salem Retailer Hub is 38 days past the agreed payment date.",
    amount: 95000,
    urgency: "overdue",
    status: "open",
  },
  {
    id: "f4",
    classification: "Supplier",
    source: "text",
    title: "Return the signed transporter agreement",
    preview: "Southern Transport is waiting on the countersigned copy.",
    urgency: "overdue",
    status: "open",
  },
  {
    id: "f5",
    classification: "Approval",
    source: "voice",
    title: "Confirm the monsoon leak repair quote",
    preview: "Repair contractor quote for the godown roof, valid until Friday.",
    amount: 610000,
    urgency: "overdue",
    status: "pending",
  },
  {
    id: "f6",
    classification: "Task",
    source: "voice",
    title: "Confirm dispatch schedule with the transporter",
    preview: "Three trucks for the Chennai and Trichy routes tomorrow morning.",
    amount: 420000,
    urgency: "today",
    status: "open",
  },
  {
    id: "f7",
    classification: "Customer",
    source: "whatsapp",
    title: "Send the revised Delhi quote",
    preview: "Delhi Retail Mart asked for the packaging line reworked at 8% off.",
    urgency: "today",
    status: "open",
  },
  {
    id: "f8",
    classification: "Payment",
    source: "text",
    title: "Sign off the weekly payroll run",
    preview: "Payroll for 14 staff, ready for release.",
    amount: 75000,
    urgency: "today",
    status: "open",
  },
  {
    id: "f9",
    classification: "Complaint",
    source: "whatsapp",
    title: "Damaged cartons reported by Coimbatore Distributors",
    preview: "Four cartons arrived crushed in the last consignment.",
    urgency: "later",
    status: "open",
  },
  {
    id: "f10",
    classification: "Reminder",
    source: "text",
    title: "Plan the Diwali dispatch schedule",
    preview: "Scheduled for the last week of the month.",
    urgency: "later",
    status: "open",
  },
  {
    id: "f11",
    classification: "Task",
    source: "voice",
    title: "Leave request - Ravi Kumar",
    preview: "Approved and closed on 30 July.",
    urgency: "closed",
    status: "closed",
  },
];

export const finance = {
  revenueBilled: 1842300,
  revenueReceived: 1621000,
  totalSpend: 482000,
  netProfit: 1139000,
  assetValue: 310000,
  inventoryValue: 154000,
  categories: [
    { name: "Packaging", amount: 184000 },
    { name: "Freight", amount: 121000 },
    { name: "Utilities", amount: 96000 },
    { name: "Payroll", amount: 81000 },
  ],
  vendors: [
    { name: "Acme Packaging", amount: 184000 },
    { name: "Southern Transport", amount: 121000 },
  ],
  monthlySpend: [
    { month: "Mar", amount: 62000 },
    { month: "Apr", amount: 71000 },
    { month: "May", amount: 88000 },
    { month: "Jun", amount: 79000 },
    { month: "Jul", amount: 94000 },
    { month: "Aug", amount: 88000 },
  ],
  expenses: [
    { id: "e1", title: "Carton stock - August", vendor: "Acme Packaging", amount: 184000, category: "Packaging" },
    { id: "e2", title: "Chennai route freight", vendor: "Southern Transport", amount: 121000, category: "Freight" },
    { id: "e3", title: "Godown electricity", vendor: "TNEB", amount: 96000, category: "Utilities" },
    { id: "e4", title: "July payroll", vendor: "Internal", amount: 81000, category: "Payroll" },
  ],
  invoices: [
    { id: "i1", title: "Invoice #4823 - Delhi Retail Mart", party: "Delhi Retail Mart", amount: 820000, status: "Sent" },
    { id: "i2", title: "Invoice #4824 - CBE Distributors", party: "Coimbatore Distributors", amount: 622300, status: "Paid" },
    { id: "i3", title: "Invoice #4825 - Salem Retailer Hub", party: "Salem Retailer Hub", amount: 400000, status: "Overdue" },
  ],
  payments: [
    { id: "pay1", title: "Payment received - CBE Distributors", party: "Coimbatore Distributors", amount: 622300, status: "Reconciled" },
    { id: "pay2", title: "Payment received - Delhi Retail Mart", party: "Delhi Retail Mart", amount: 998700, status: "Reconciled" },
  ],
  assets: [
    { id: "a1", name: "Carton sealing machine", category: "Machinery", amount: 210000 },
    { id: "a2", name: "Godown racking", category: "Fixtures", amount: 100000 },
  ],
  inventory: [
    { id: "inv1", item: "Printed cartons - 5 kg", quantity: 4200, cost: 92000 },
    { id: "inv2", item: "Stretch wrap rolls", quantity: 310, cost: 62000 },
  ],
  insights: [
    "Packaging spend is 38% of total spend this quarter - one vendor carries all of it.",
    "₹4,00,000 of receivables sit past 30 days with a single retailer.",
    "Freight cost per dispatch rose 9% since June without a volume change.",
  ],
};

export const operatingScore = {
  overall: 72,
  trend: "+4 since last month",
  categories: [
    { name: "Execution", value: 68 },
    { name: "Finance", value: 81 },
    { name: "Sales", value: 74 },
    { name: "Responsiveness", value: 65 },
  ],
  stats: { done: 24, open: 7, overdue: 2, complaints: 1 },
  team: [
    { name: "Prasanna Narayanan", role: "Owner", score: 78, done: 12, open: 3 },
    { name: "Ravi Kumar", role: "Sales", score: 61, done: 9, open: 4 },
    { name: "Meena Raghavan", role: "Operations", score: 58, done: 3, open: 5 },
  ],
};

export const notifications = [
  { id: "n1", type: "Escalation", title: "Ravi Kumar escalated the Chennai stockist callback", from: "Ravi Kumar", hoursAgo: 2, unread: true },
  { id: "n2", type: "Approval", title: "Supplier payment timing is waiting on your approval", from: "DecisionOS", hoursAgo: 5, unread: true },
  { id: "n3", type: "Task", title: "Meena Raghavan uploaded proof on the GRN reconciliation", from: "Meena Raghavan", hoursAgo: 9, unread: true },
  { id: "n4", type: "Invoice", title: "Invoice #4825 is now overdue", from: "DecisionOS", hoursAgo: 26, unread: false },
  { id: "n5", type: "Capture", title: "3 captures parsed and waiting in Review", from: "DecisionOS", hoursAgo: 30, unread: false },
  { id: "n6", type: "Complaint", title: "Coimbatore Distributors logged a damaged carton complaint", from: "Meena Raghavan", hoursAgo: 48, unread: false },
  { id: "n7", type: "Meeting", title: "Monday production review summary is ready", from: "DecisionOS", hoursAgo: 72, unread: false },
];

export const meetings = [
  { id: "m1", title: "Monday production review", date: "3 August 2026", duration: "28 min", summary: "Dispatch slipped twice last week; the second coordinator hire was raised again. Packaging vendor rate holds until October." },
  { id: "m2", title: "Delhi retailer negotiation", date: "31 July 2026", duration: "41 min", summary: "Retailer pushed for 8% off. Agreed to model a 6% floor and revert with a revised quote by Friday." },
  { id: "m3", title: "Quarterly finance catch-up", date: "28 July 2026", duration: "52 min", summary: "Receivables ageing is the main pressure. Distributor payout to be released once the GRN reconciliation clears." },
];

export const journalDays = [
  {
    day: "5 August 2026",
    events: [
      { id: "j1", kind: "Decision captured", title: "Extend credit terms for the Coimbatore distributor", time: "09:14" },
      { id: "j2", kind: "Task created", title: "Update the Coimbatore credit terms", time: "09:14" },
    ],
  },
  {
    day: "4 August 2026",
    events: [
      { id: "j3", kind: "Decision approved", title: "Hold the packaging rate until October", time: "17:32" },
      { id: "j4", kind: "Decision captured", title: "Write off the damaged carton stock", time: "11:05" },
      { id: "j5", kind: "Escalation resolved", title: "Trichy dealer conversation handed to the founder", time: "10:20" },
    ],
  },
  {
    day: "2 August 2026",
    events: [
      { id: "j6", kind: "Decision captured", title: "Approve supplier payment timing", time: "08:41" },
      { id: "j7", kind: "Decision rejected", title: "Advance the distributor payout by a week", time: "08:39" },
    ],
  },
];

export const pipelines = [
  {
    name: "Sales orders",
    stages: ["Enquiry", "Quoted", "Confirmed", "Dispatched", "Paid"],
    cards: [
      { id: "so1", title: "Order #4823", counterparty: "Delhi Retail Mart", amount: 820000, created: "1 Aug", stage: "Quoted" },
      { id: "so2", title: "Order #4824", counterparty: "Coimbatore Distributors", amount: 622300, created: "28 Jul", stage: "Dispatched" },
      { id: "so3", title: "Order #4826", counterparty: "Trichy Dealer Co.", amount: 145000, created: "4 Aug", stage: "Enquiry" },
    ],
  },
  {
    name: "Purchase orders",
    stages: ["Raised", "Approved", "Received", "Reconciled"],
    cards: [
      { id: "po1", title: "PO #1188", counterparty: "Acme Packaging", amount: 240000, created: "26 Jul", stage: "Received" },
      { id: "po2", title: "PO #1189", counterparty: "Southern Transport", amount: 121000, created: "2 Aug", stage: "Approved" },
    ],
  },
];

export const leaves = [
  { id: "l1", type: "Casual leave", from: "12 Aug", to: "13 Aug", portion: "Full day", status: "pending", reason: "Family function in Madurai", who: "Ravi Kumar" },
  { id: "l2", type: "Sick leave", from: "29 Jul", to: "29 Jul", portion: "Half day", status: "approved", reason: "Clinic appointment", who: "Meena Raghavan" },
];

export const captureReview = {
  contacts: [
    { id: "rc1", name: "Trichy Dealer Co.", detail: "Phone +91 94430 22118 · from a business card photo", confidence: "High confidence" },
  ],
  invoices: [
    { id: "ri1", name: "Acme Packaging - AP-2291", detail: "₹2,40,000 · dated 26 July · incoming bill", confidence: "Medium confidence - amount unclear on the scan" },
    { id: "ri2", name: "Southern Transport - ST-0771", detail: "₹1,21,000 · dated 2 August · incoming bill", confidence: "High confidence" },
  ],
  payments: [
    { id: "rp1", name: "Payment from CBE Distributors", detail: "₹6,22,300 · NEFT reference 88123", confidence: "High confidence" },
  ],
  tasks: [
    { id: "rt1", name: "Call the Trichy dealer back", detail: "Extracted from a WhatsApp voice note", confidence: "Medium confidence - no deadline stated" },
  ],
};

/* ---------------- Workflow links ----------------
 * A workflow (pipeline card) is the larger process; tasks and decisions belong
 * to a stage inside it. Kept as lookup maps so the link reads both ways.
 */

export type WorkflowLink = { workflowId: string; stage: string };

export const taskWorkflow: Record<string, WorkflowLink> = {
  t2: { workflowId: "po1", stage: "Approved" },
  t4: { workflowId: "po1", stage: "Received" },
  t6: { workflowId: "po1", stage: "Reconciled" },
  t5: { workflowId: "po2", stage: "Approved" },
  t9: { workflowId: "so2", stage: "Dispatched" },
  t7: { workflowId: "so2", stage: "Paid" },
  t10: { workflowId: "so1", stage: "Quoted" },
  t1: { workflowId: "so1", stage: "Quoted" },
};

export const decisionWorkflow: Record<string, WorkflowLink> = {
  d1: { workflowId: "po1", stage: "Received" },
  d2: { workflowId: "so1", stage: "Quoted" },
};

/** Workflow cards that cannot advance until a decision is answered. */
export const workflowBlockers: Record<string, string> = { po1: "d1", so1: "d2" };

export function findWorkflow(cardId: string) {
  for (const p of pipelines) {
    const card = p.cards.find((c) => c.id === cardId);
    if (card) return { pipeline: p, card };
  }
  return null;
}

export function tasksOfWorkflow(cardId: string) {
  return tasks.filter((t) => taskWorkflow[t.id]?.workflowId === cardId);
}

export function decisionsOfWorkflow(cardId: string) {
  return decisions.filter((d) => decisionWorkflow[d.id]?.workflowId === cardId);
}

/* ---------------- Captured financial documents ----------------
 * Everything captured on Home that turned out to be financial lands here for
 * review. Non-financial captures stay with their task or workflow.
 */

export type CapturedDoc = {
  id: string;
  name: string;
  kind: "Invoice" | "Bill" | "Receipt" | "Expense";
  party: string;
  amount: number;
  date: string;
  status: "Needs review" | "Reviewed" | "Filed";
  source: Source;
};

export const capturedDocs: CapturedDoc[] = [
  { id: "cd1", name: "AP-2291.pdf", kind: "Bill", party: "Acme Packaging", amount: 240000, date: "26 Jul", status: "Needs review", source: "upload" },
  { id: "cd2", name: "ST-0771.pdf", kind: "Bill", party: "Southern Transport", amount: 121000, date: "2 Aug", status: "Needs review", source: "whatsapp" },
  { id: "cd3", name: "Diesel receipt", kind: "Receipt", party: "IOCL Guindy", amount: 4800, date: "3 Aug", status: "Reviewed", source: "upload" },
  { id: "cd4", name: "Invoice #4825", kind: "Invoice", party: "Salem Retailer Hub", amount: 400000, date: "28 Jul", status: "Filed", source: "text" },
  { id: "cd5", name: "Godown repair estimate", kind: "Expense", party: "Sri Balaji Works", amount: 61000, date: "5 Aug", status: "Needs review", source: "upload" },
];
