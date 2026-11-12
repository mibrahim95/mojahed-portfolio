const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const now = new Date();
export const NOW = now.getFullYear() * 12 + now.getMonth();

// "Feb 2023" -> absolute month number; "now" -> this month.
export const toMonth = (s) => {
  if (/now/i.test(s)) return NOW;
  const [m, y] = s.trim().split(/\s+/);
  return Number(y) * 12 + MONTHS.indexOf(m);
};
export const range = (dates) => dates.split(/\s*[–—]\s*/).map(toMonth);

// A scale from month numbers to percentages between two years.
export function scale(firstYear) {
  const start = firstYear * 12;
  const span = NOW + 3 - start;
  return {
    start,
    years: Array.from({ length: now.getFullYear() - firstYear + 1 }, (_, i) => firstYear + i),
    at: (m) => ((m - start) / span) * 100,
  };
}

export function tenure(dates) {
  const [a, b] = range(dates);
  // Both end months count, as on LinkedIn: Feb to Mar is 2 mo.
  const total = b - a + 1;
  const y = Math.floor(total / 12);
  const m = total % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo`].filter(Boolean).join(" ");
}

export const SHORT = { comcast: "Comcast", t14: "Turn 14", temple: "MIS tutor", "5b": "Five Below" };
