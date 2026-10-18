import { useState } from "react";
import type { CalendarDate } from "@internationalized/date";
import { Calendar as CalendarIcon, ChevronDown } from "@untitledui/icons";
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
 * Laid out as the design system's own date picker: a full-width field that opens a
 * calendar with the typed date and Today above the grid, and Cancel / Apply as two equal
 * buttons below. Round 1 put those in a footer beside its times column; with the column
 * gone that footer was cramped and the panel came out narrow and tall.
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
                        "flex h-11 w-full items-center gap-2.5 rounded-lg bg-primary px-3.5 text-md shadow-xs ring-1 transition duration-100 ease-linear ring-inset outline-hidden",
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
                <ChevronDown className="ml-auto size-5 shrink-0 text-fg-quaternary" aria-hidden="true" />
            </AriaButton>
            <AriaPopover placement="bottom start" offset={8}>
                {/* The popover renders outside the page shell, so the 15px minimum is
                    applied here rather than inherited: the calendar's own text is 13–14px. */}
                <AriaDialog aria-label={label} className="rounded-2xl bg-primary shadow-xl ring ring-secondary_alt outline-hidden **:text-md">
                    {({ close }) => (
                        <>
                            <div className="px-6 py-5">
                                <Calendar aria-label={`${label} date`} value={draft ?? null} onChange={(d) => setDraft(d as CalendarDate)} minValue={minValue}>
                                    {/* The design system's row above the grid — a typed date and
                                        Today — with Today pinned to the prototype's date. */}
                                    <div className="flex gap-3">
                                        <AriaDateField
                                            aria-label={`${label} date`}
                                            value={draft ?? null}
                                            onChange={(d) => d && setDraft(d as CalendarDate)}
                                            minValue={minValue}
                                            className="flex-1"
                                        >
                                            <AriaDateInput className="flex h-10 w-full items-center rounded-lg bg-primary px-3 text-md text-primary shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:[--tw-ring-color:#DA6EA3]">
                                                {(segment) => <AriaDateSegment segment={segment} className={({ isFocused, isPlaceholder }) => segmentClass({ isFocused, isPlaceholder, type: segment.type })} />}
                                            </AriaDateInput>
                                        </AriaDateField>
                                        <Button
                                            // Not one of the calendar's previous/next slots.
                                            slot={null}
                                            size="sm"
                                            color="secondary"
                                            isDisabled={Boolean(minValue && today.compare(minValue) < 0)}
                                            onClick={() => setDraft(today)}
                                        >
                                            <Copy>Today</Copy>
                                        </Button>
                                    </div>
                                </Calendar>
                            </div>
                            {/* Two equal buttons, as in the design system's picker. */}
                            <div className="grid grid-cols-2 gap-3 border-t border-secondary p-4">
                                <Button size="md" color="secondary" onClick={close}>
                                    <Copy>Cancel</Copy>
                                </Button>
                                <Button
                                    size="md"
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
                        </>
                    )}
                </AriaDialog>
            </AriaPopover>
        </AriaDialogTrigger>
    );
};
