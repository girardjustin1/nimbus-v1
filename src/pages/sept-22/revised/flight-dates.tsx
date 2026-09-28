import { useState } from "react";
import type { CalendarDate, Time } from "@internationalized/date";
import { END_OF_DAY, START_OF_DAY, nextMonth, shortDay, todayDate } from "../../deal-activation-system/dates";
import { DateTimePicker } from "../../deal-activation-system/round-1-components/datetime-picker";
import { DatePicker } from "./date-picker";

/**
 * Sept 22 · item 2 — the flight dates row, before and after.
 *
 * Same layout, same validation, same "N-day flight" summary. The only difference is that
 * the revised row asks for two dates instead of two dates and two times, because a time
 * of day is not something the platform can act on yet.
 */

const FLIGHT = nextMonth();

const Field = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-secondary">{label}</span>
        {children}
        {hint && <span className="text-xs text-tertiary">{hint}</span>}
    </div>
);

const Row = ({ children, summary }: { children: React.ReactNode; summary: string }) => (
    <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {children}
        </div>
        <p className="text-sm text-tertiary">{summary}</p>
    </div>
);

const days = (start?: CalendarDate, end?: CalendarDate) => (start && end ? end.compare(start) + 1 : 0);

const flightSummary = (start?: CalendarDate, end?: CalendarDate, suffix = "") =>
    start && end ? `${shortDay(start)} – ${shortDay(end)} · ${days(start, end)}-day flight${suffix}` : "Pick a start and end date.";

/** What was reviewed on Sep 22 — date and time of day on each end of the flight. */
export const FlightDatesBefore = () => {
    const [start, setStart] = useState<{ date?: CalendarDate; time: Time }>({ date: FLIGHT.start, time: START_OF_DAY });
    const [end, setEnd] = useState<{ date?: CalendarDate; time: Time }>({ date: FLIGHT.end, time: END_OF_DAY });
    return (
        <Row summary={flightSummary(start.date, end.date, ", all times UTC")}>
            <Field label="Start">
                <DateTimePicker label="Start" value={start} onChange={setStart} minValue={todayDate()} placeholder="Select start" />
            </Field>
            <span className="hidden pt-9 text-quaternary sm:block">→</span>
            <Field label="End">
                <DateTimePicker
                    label="End"
                    value={end}
                    onChange={setEnd}
                    minValue={start.date ?? todayDate()}
                    notBefore={start.date ? { date: start.date, time: start.time } : undefined}
                    placeholder="Select end"
                />
            </Field>
        </Row>
    );
};

/** Revised — dates only, because the backend has no time of day on a flight yet. */
export const FlightDatesAfter = () => {
    const [start, setStart] = useState<CalendarDate | undefined>(FLIGHT.start);
    const [end, setEnd] = useState<CalendarDate | undefined>(FLIGHT.end);
    return (
        <Row summary={flightSummary(start, end)}>
            <Field label="Start">
                <DatePicker label="Start" value={start} onChange={setStart} minValue={todayDate()} placeholder="Select start" />
            </Field>
            <span className="hidden pt-9 text-quaternary sm:block">→</span>
            <Field label="End" hint="Runs to the end of this day.">
                <DatePicker label="End" value={end} onChange={setEnd} minValue={start ?? todayDate()} placeholder="Select end" />
            </Field>
        </Row>
    );
};
