/**
 * Local-date helpers — all storage writes (daily_logs, weight_logs, profiles)
 * use these so "today" always means the user's local calendar day, not UTC.
 * Never use toISOString().split("T")[0] for date storage — that gives UTC date
 * which differs from local date during the midnight-UTC window.
 */

/** YYYY-MM-DD in the user's LOCAL timezone */
export function localToday(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

/** YYYY-MM-DD for local yesterday — used by streak consecutive-day check */
export function localYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1); // local date arithmetic, not UTC
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}
