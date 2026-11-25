import { useEffect, useRef, useState } from "react";
import { type CalendarDate, parseDate } from "@internationalized/date";
import { Calendar } from "@untitledui/icons";
import { RangeCalendar } from "@/components/application/date-picker/range-calendar";
import { cx } from "@/utils/cx";
import { TEAL } from "../../das-shell";
import { StateAction, TEAL_DARK, tealControls } from "../../nimbus-ui";
import { DATA_TODAY, type Range, customRange, longDate, rangeDays } from "./insights-data";

/**
 * Performance Insights · Round 2 · C16: the date picker behind the date pill.
 *
 * The design system's range calendar (two months) in a Nimbus panel: presets down the
 * left, the calendar, and a footer with the dates picked, how many days, Cancel and Apply.
 * Nothing changes until Apply. The sample data runs to its own “today” (Nov 13, 2026), so
 * later days cannot be picked. A range that matches a preset becomes that preset, so the
 * quick range buttons light up for it.
 */

const DAY = 86_400_000;
const iso = (t: number) => new Date(t).toISOString().slice(0, 10);
const back = (d: string, n: number) => iso(Date.parse(`${d}T00:00:00Z`) - n * DAY);
const monthStart = (d: string) => `${d.slice(0, 8)}01`;
const monthEnd = (d: string) => {
    const [y, m] = d.split("-").map(Number);
    return iso(Date.UTC(y, m, 0));
};

const PRESETS: { label: string; start: string; end: string }[] = (() => {
    const t = DATA_TODAY;
    const lastMonthEnd = back(monthStart(t), 1);
    return [
        { label: "Yesterday", start: back(t, 1), end: back(t, 1) },
        { label: "Last 7 days", start: back(t, 6), end: t },
        { label: "Last 14 days", start: back(t, 13), end: t },
        { label: "Last 30 days", start: back(t, 29), end: t },
        { label: "This month", start: monthStart(t), end: t },
        { label: "Last month", start: monthStart(lastMonthEnd), end: monthEnd(lastMonthEnd) },
    ];
})();

/** "Nov 07 – Nov 13, 2026", or one date for a single day. */
const rangeText = (r: Range) => {
    const days = rangeDays(r);
    const a = days[0];
    const b = days[days.length - 1];
    if (a === b) return longDate(a);
    return a.slice(0, 4) === b.slice(0, 4) ? `${longDate(a).slice(0, 6)} – ${longDate(b)}` : `${longDate(a)} – ${longDate(b)}`;
};

type Draft = { start: CalendarDate; end: CalendarDate };
const toDraft = (r: Range): Draft => {
    const days = rangeDays(r);
    return { start: parseDate(days[0]), end: parseDate(days[days.length - 1]) };
};

export const RangePicker = ({
    value,
    onChange,
    className,
    defaultOpen = false,
}: {
    value: Range;
    onChange: (r: Range) => void;
    className?: string;
    defaultOpen?: boolean;
}) => {
    const [open, setOpen] = useState(defaultOpen);
    const [draft, setDraft] = useState<Draft>(() => toDraft(value));
    const [focused, setFocused] = useState<CalendarDate>(() => toDraft(value).end);
    const box = useRef<HTMLDivElement>(null);

    const show = () => {
        const d = toDraft(value);
        setDraft(d);
        setFocused(d.end);
        setOpen(true);
    };
    useEffect(() => {
        if (!open) return;
        const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        const down = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setOpen(false);
        window.addEventListener("keydown", key);
        window.addEventListener("mousedown", down);
        return () => {
            window.removeEventListener("keydown", key);
            window.removeEventListener("mousedown", down);
        };
    }, [open]);

    const start = draft.start.toString();
    const end = draft.end.toString();
    const days = Math.round((Date.parse(end) - Date.parse(start)) / DAY) + 1;
    const draftRange = customRange(start, end);
    const changed = draftRange !== value;

    return (
        <div ref={box} className="relative">
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                onClick={() => (open ? setOpen(false) : show())}
                className={cx(
                    "inline-flex h-9 items-center gap-2 rounded-full px-3 text-md font-semibold text-secondary ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary",
                    className,
                )}
                style={open ? { color: TEAL_DARK, boxShadow: `inset 0 0 0 2px ${TEAL}` } : undefined}
            >
                <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
                {rangeText(value)}
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-label="Choose dates"
                    className="absolute top-11 left-0 z-30 flex rounded-2xl bg-primary shadow-xl ring-1 ring-secondary"
                    style={tealControls}
                >
                    <ul className="flex w-44 flex-col gap-0.5 border-r border-secondary p-3" aria-label="Presets">
                        {PRESETS.map((p) => {
                            const on = p.start === start && p.end === end;
                            return (
                                <li key={p.label}>
                                    <button
                                        type="button"
                                        aria-pressed={on}
                                        onClick={() => {
                                            setDraft({ start: parseDate(p.start), end: parseDate(p.end) });
                                            setFocused(parseDate(p.end));
                                        }}
                                        className={cx("w-full rounded-md px-3 py-2 text-left text-md", on ? "font-bold" : "text-secondary hover:bg-secondary")}
                                        style={on ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f` } : undefined}
                                    >
                                        {p.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="flex flex-col">
                        <RangeCalendar
                            aria-label="Dates"
                            value={draft}
                            onChange={(v) => v && setDraft({ start: v.start as CalendarDate, end: v.end as CalendarDate })}
                            focusedValue={focused}
                            onFocusChange={(d) => setFocused(d as CalendarDate)}
                            maxValue={parseDate(DATA_TODAY)}
                            visibleDuration={{ months: 2 }}
                        />
                        <div className="flex items-center justify-between gap-6 border-t border-secondary px-5 py-4">
                            <span className="text-md font-semibold text-secondary">
                                {rangeText(draftRange)}
                                <span className="ml-2 font-normal text-tertiary">
                                    {days} {days === 1 ? "day" : "days"}
                                </span>
                            </span>
                            <span className="flex gap-3">
                                <StateAction quiet onPress={() => setOpen(false)}>
                                    Cancel
                                </StateAction>
                                <StateAction
                                    disabled={!changed}
                                    onPress={() => {
                                        onChange(draftRange);
                                        setOpen(false);
                                    }}
                                >
                                    Apply
                                </StateAction>
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
