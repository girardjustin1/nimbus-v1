import { useEffect, useRef, useState } from "react";
import { type CalendarDate, Time } from "@internationalized/date";
import { Calendar as CalendarIcon } from "@untitledui/icons";
import {
    Button as AriaButton,
    DateField as AriaDateField,
    DateInput as AriaDateInput,
    DateSegment as AriaDateSegment,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Popover as AriaPopover,
} from "react-aria-components";
import { Calendar } from "@/components/application/date-picker/calendar";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/**
 * Date & time picker (Nimbus) — the trigger shows the date in bold and the time muted
 * ("Oct 1, 2026 12:00 AM"). The panel puts the design-system calendar beside a
 * scrolling list of available times (every 30 minutes, UTC), with a typed date, Today,
 * Cancel and Apply along the bottom. Nothing changes until Apply.
 */

const PINK = "#DA6EA3";
const PINK_DEEP = "#A94579";
const PINK_SOFT = "#FCE7F1";

const formatDate = (d: CalendarDate) => new Date(Date.UTC(d.year, d.month - 1, d.day)).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const formatTime = (t: Time) => {
    const h = t.hour % 12 || 12;
    return `${h}:${String(t.minute).padStart(2, "0")} ${t.hour < 12 ? "AM" : "PM"}`;
};

/** Every 30 minutes, plus 11:59 PM so a flight can run to the end of the day. */
const SLOTS: Time[] = [...Array.from({ length: 48 }, (_, i) => new Time(Math.floor(i / 2), (i % 2) * 30)), new Time(23, 59)];

export interface DateTimeValue {
    date?: CalendarDate;
    time: Time;
}

const segmentClass = ({ isFocused, isPlaceholder, type }: { isFocused: boolean; isPlaceholder: boolean; type: string }) =>
    cx("rounded px-0.5 tabular-nums outline-hidden", type === "literal" && "text-quaternary", isPlaceholder && "text-placeholder", isFocused && "bg-[#FCE7F1] text-[#A94579]");

export const DateTimePicker = ({
    label,
    value,
    onChange,
    minValue,
    today,
    notBefore,
    invalid,
    defaultOpen,
    placeholder = "Select date",
}: {
    label: string;
    value: DateTimeValue;
    onChange: (v: DateTimeValue) => void;
    /** Earliest selectable day. */
    minValue?: CalendarDate;
    /** What the Today button jumps to (the prototype's fixed "today"). */
    today?: CalendarDate;
    /** Times on this day at or before this time are unavailable (e.g. an end before the start). */
    notBefore?: { date: CalendarDate; time: Time };
    invalid?: boolean;
    defaultOpen?: boolean;
    placeholder?: string;
}) => {
    const [open, setOpen] = useState(Boolean(defaultOpen));
    const [draftDate, setDraftDate] = useState<CalendarDate | undefined>(value.date);
    const [draftTime, setDraftTime] = useState<Time>(value.time);
    const listRef = useRef<HTMLDivElement>(null);

    const onOpenChange = (next: boolean) => {
        if (next) {
            setDraftDate(value.date);
            setDraftTime(value.time);
        }
        setOpen(next);
    };

    // Bring the chosen time into view when the panel opens.
    useEffect(() => {
        if (open) listRef.current?.querySelector<HTMLElement>("[aria-selected='true']")?.scrollIntoView({ block: "center" });
    }, [open]);

    const unavailable = (t: Time) => Boolean(notBefore && draftDate && draftDate.compare(notBefore.date) === 0 && t.compare(notBefore.time) <= 0);

    return (
        <AriaDialogTrigger isOpen={open} onOpenChange={onOpenChange}>
            <AriaButton
                aria-label={`${label}: ${value.date ? `${formatDate(value.date)} ${formatTime(value.time)}` : "not set"}`}
                className={({ isFocusVisible, isHovered }) =>
                    cx(
                        "inline-flex h-11 items-center gap-2.5 rounded-lg bg-primary px-3.5 text-md shadow-xs ring-1 transition duration-100 ease-linear ring-inset outline-hidden",
                        invalid ? "ring-error_subtle" : open || isFocusVisible ? "ring-2" : "ring-primary",
                        isHovered && !open && !invalid && "bg-primary_hover",
                    )
                }
                style={open && !invalid ? { ["--tw-ring-color" as string]: PINK } : undefined}
            >
                <CalendarIcon className="size-5 text-fg-quaternary" aria-hidden="true" />
                {value.date ? (
                    <span className="flex items-baseline gap-1.5 whitespace-nowrap">
                        <span className="font-semibold text-secondary">{formatDate(value.date)}</span>
                        <span className="font-medium text-tertiary">{formatTime(value.time)}</span>
                    </span>
                ) : (
                    <span className="font-medium text-placeholder">{placeholder}</span>
                )}
            </AriaButton>
            <AriaPopover placement="bottom start" offset={8}>
                <AriaDialog aria-label={label} className="rounded-2xl bg-primary shadow-xl ring ring-secondary_alt outline-hidden">
                    {({ close }) => (
                        <>
                            <div className="flex">
                                <div className="px-6 py-5">
                                    <Calendar
                                        aria-label={`${label} date`}
                                        value={draftDate ?? null}
                                        onChange={(d) => setDraftDate(d as CalendarDate)}
                                        minValue={minValue}
                                    >
                                        {/* The typed date and Today live in the footer instead of above the grid. */}
                                        <span hidden />
                                    </Calendar>
                                </div>
                                <div className="flex w-44 flex-col border-l border-secondary py-5">
                                    <span className="px-4 pb-3 text-center text-sm font-semibold text-secondary">Available times</span>
                                    <div ref={listRef} role="listbox" aria-label={`${label} time (UTC)`} className="flex h-[272px] flex-col gap-2 overflow-y-auto px-4 pb-1 [mask-image:linear-gradient(to_bottom,black_85%,transparent)]">
                                        {SLOTS.map((t) => {
                                            const on = draftTime.compare(t) === 0;
                                            const off = unavailable(t);
                                            return (
                                                <button
                                                    key={`${t.hour}:${t.minute}`}
                                                    type="button"
                                                    role="option"
                                                    aria-selected={on}
                                                    disabled={off}
                                                    onClick={() => setDraftTime(t)}
                                                    className={cx(
                                                        "shrink-0 rounded-lg py-2 text-sm font-semibold shadow-xs ring-1 transition-colors ring-inset",
                                                        on ? "ring-2" : "text-secondary ring-primary hover:bg-primary_hover",
                                                        off && "cursor-not-allowed text-disabled opacity-50 shadow-none hover:bg-transparent",
                                                    )}
                                                    style={on ? { color: PINK_DEEP, backgroundColor: PINK_SOFT, ["--tw-ring-color" as string]: PINK } : undefined}
                                                >
                                                    {formatTime(t)}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <span className="px-4 pt-2 text-center text-xs text-tertiary">All times UTC</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-3 border-t border-secondary p-4">
                                <div className="flex items-center gap-3">
                                    <AriaDateField aria-label={`${label} date`} value={draftDate ?? null} onChange={(d) => d && setDraftDate(d as CalendarDate)} minValue={minValue}>
                                        <AriaDateInput className="flex h-10 w-36 items-center rounded-lg bg-primary px-3 text-md text-primary shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:[--tw-ring-color:#DA6EA3]">
                                            {(segment) => <AriaDateSegment segment={segment} className={({ isFocused, isPlaceholder }) => segmentClass({ isFocused, isPlaceholder, type: segment.type })} />}
                                        </AriaDateInput>
                                    </AriaDateField>
                                    {today && (
                                        <Button size="sm" color="secondary" isDisabled={Boolean(minValue && today.compare(minValue) < 0)} onClick={() => setDraftDate(today)}>
                                            Today
                                        </Button>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Button size="sm" color="secondary" onClick={close}>
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="primary-pink"
                                        isDisabled={!draftDate || unavailable(draftTime)}
                                        onClick={() => {
                                            onChange({ date: draftDate, time: draftTime });
                                            close();
                                        }}
                                    >
                                        Apply
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDialogTrigger>
    );
};
