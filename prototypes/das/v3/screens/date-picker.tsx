import { useState } from "react";
import type { CalendarDate } from "@internationalized/date";
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
import { longDay, todayDate } from "@/pages/deal-activation-system/dates";
import { cx } from "@/utils/cx";
import { Copy } from "./copy-deck-ui";
import { Button } from "./type-rules";

/**
 * Date picker for Prototype 3 — Round 1's date & time picker with the time half taken
 * out. Product's 5 Oct review (C2): "you got to take the times away. Remember, it's
 * dates only." A flight runs from the start of its first day to the end of its last, in
 * UTC, which is what validation already assumes when no time is set.
 *
 * Same trigger, calendar and footer (typed date, Today, Cancel, Apply), so it reads as
 * the control that was reviewed, minus the column of times.
 */

const PINK = "#DA6EA3";

const segmentClass = ({ isFocused, isPlaceholder, type }: { isFocused: boolean; isPlaceholder: boolean; type: string }) =>
    cx("rounded px-0.5 tabular-nums outline-hidden", type === "literal" && "text-quaternary", isPlaceholder && "text-placeholder", isFocused && "bg-[#FCE7F1] text-[#A94579]");

export const DatePicker = ({
    label,
    value,
    onChange,
    minValue,
    today = todayDate(),
    invalid,
    defaultOpen,
    placeholder = "Select date",
}: {
    label: string;
    value?: CalendarDate;
    onChange: (date: CalendarDate) => void;
    /** Earliest selectable day. */
    minValue?: CalendarDate;
    /** What the Today button jumps to; defaults to the real date. */
    today?: CalendarDate;
    invalid?: boolean;
    defaultOpen?: boolean;
    placeholder?: string;
}) => {
    const [open, setOpen] = useState(Boolean(defaultOpen));
    const [draft, setDraft] = useState<CalendarDate | undefined>(value);

    const onOpenChange = (next: boolean) => {
        if (next) setDraft(value);
        setOpen(next);
    };

    return (
        <AriaDialogTrigger isOpen={open} onOpenChange={onOpenChange}>
            <AriaButton
                aria-label={`${label}: ${value ? longDay(value) : "not set"}`}
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
                {value ? (
                    <span className="font-semibold whitespace-nowrap text-secondary">{longDay(value)}</span>
                ) : (
                    <span className="font-medium text-placeholder">{placeholder}</span>
                )}
            </AriaButton>
            <AriaPopover placement="bottom start" offset={8}>
                {/* The popover renders outside the page shell, so the 15px minimum is
                    applied here rather than inherited: the calendar's own text is 13–14px. */}
                <AriaDialog aria-label={label} className="rounded-2xl bg-primary shadow-xl ring ring-secondary_alt outline-hidden **:text-md">
                    {({ close }) => (
                        <>
                            <div className="px-6 py-5">
                                <Calendar aria-label={`${label} date`} value={draft ?? null} onChange={(d) => setDraft(d as CalendarDate)} minValue={minValue}>
                                    {/* The typed date and Today live in the footer instead of above the grid. */}
                                    <span hidden />
                                </Calendar>
                            </div>
                            <div className="flex items-center justify-between gap-3 border-t border-secondary p-4">
                                <div className="flex items-center gap-3">
                                    <AriaDateField aria-label={`${label} date`} value={draft ?? null} onChange={(d) => d && setDraft(d as CalendarDate)} minValue={minValue}>
                                        <AriaDateInput className="flex h-10 w-36 items-center rounded-lg bg-primary px-3 text-md text-primary shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:[--tw-ring-color:#DA6EA3]">
                                            {(segment) => <AriaDateSegment segment={segment} className={({ isFocused, isPlaceholder }) => segmentClass({ isFocused, isPlaceholder, type: segment.type })} />}
                                        </AriaDateInput>
                                    </AriaDateField>
                                    <Button size="sm" color="secondary" isDisabled={Boolean(minValue && today.compare(minValue) < 0)} onClick={() => setDraft(today)}>
                                        <Copy>Today</Copy>
                                    </Button>
                                </div>
                                <div className="flex gap-3">
                                    <Button size="sm" color="secondary" onClick={close}>
                                        <Copy>Cancel</Copy>
                                    </Button>
                                    <Button
                                        size="sm"
                                        color="primary-pink"
                                        isDisabled={!draft}
                                        onClick={() => {
                                            if (draft) onChange(draft);
                                            close();
                                        }}
                                    >
                                        <Copy>Apply</Copy>
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
