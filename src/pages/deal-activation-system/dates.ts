import { type CalendarDate, Time, endOfMonth, getLocalTimeZone, parseTime, startOfMonth, today } from "@internationalized/date";

/**
 * Date helpers for the DAS concepts. "Today" is the real date, so pickers, validation
 * and sample flights stay current: sample campaigns are placed relative to it (e.g.
 * "next month") instead of on fixed calendar dates.
 */

export const todayDate = (): CalendarDate => today(getLocalTimeZone());

/** First and last day of next month — the sample flight used across the concepts. */
export const nextMonth = () => {
    const start = startOfMonth(todayDate().add({ months: 1 }));
    return { start, end: endOfMonth(start) };
};

export const START_OF_DAY = new Time(0, 0);
export const END_OF_DAY = new Time(23, 59);

/** "09:30" ↔ Time, for drafts that store times as strings. */
export const toTime = (s?: string, fallback = START_OF_DAY) => (s ? parseTime(s) : fallback);
export const timeString = (t: Time) => `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;

const fmt = (d: CalendarDate, opts: Intl.DateTimeFormatOptions) => new Date(Date.UTC(d.year, d.month - 1, d.day)).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

/** "Oct 1" */
export const shortDay = (d: CalendarDate) => fmt(d, { month: "short", day: "numeric" });
/** "Oct 1, 2026" */
export const longDay = (d: CalendarDate) => fmt(d, { month: "short", day: "numeric", year: "numeric" });

export const formatTime12 = (t: Time) => `${t.hour % 12 || 12}:${String(t.minute).padStart(2, "0")} ${t.hour < 12 ? "AM" : "PM"}`;
