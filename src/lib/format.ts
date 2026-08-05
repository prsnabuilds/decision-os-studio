/** Indian digit grouping: ₹4,80,000 (lakh/crore), never ₹480,000. */
export function inr(amount: number): string {
  const sign = amount < 0 ? "-" : "";
  const n = Math.abs(Math.round(amount));
  const s = String(n);
  if (s.length <= 3) return `${sign}₹${s}`;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${sign}₹${grouped},${last3}`;
}

export function plural(n: number, one: string, many: string) {
  return n === 1 ? one : many;
}

/** "6 days overdue" / "1 day overdue" */
export function overdueText(days: number) {
  return `${days} ${plural(days, "day", "days")} overdue`;
}

/** Joins with commas and a final "and". */
export function joinReadably(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0]!;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
}

export function relativeTime(hoursAgo: number): string {
  if (hoursAgo < 1) return "Just now";
  if (hoursAgo < 24)
    return `${Math.round(hoursAgo)} ${plural(Math.round(hoursAgo), "hour", "hours")} ago`;
  const d = Math.round(hoursAgo / 24);
  return `${d} ${plural(d, "day", "days")} ago`;
}
