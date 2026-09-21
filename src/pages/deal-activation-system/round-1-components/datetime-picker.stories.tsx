import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Time } from "@internationalized/date";
import { END_OF_DAY, START_OF_DAY, nextMonth, todayDate } from "../dates";
import { type DateTimeValue, DateTimePicker } from "./datetime-picker";

/**
 * Date & time picker — the trigger shows the date in bold and the time muted. The panel
 * pairs the calendar with a list of available times (every 30 minutes plus 11:59 PM,
 * UTC), with a typed date, Today, Cancel and Apply. Used for campaign start and end in
 * the DAS prototype and DAS Studio.
 */
const meta = {
    title: "Deal Activation System/Round 1 Concepts/Components/Date & Time Picker",
    parameters: { layout: "padded" },
    decorators: [(Story) => <div className="min-h-[520px]">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ initial, label = "Start", ...rest }: { initial: DateTimeValue; label?: string } & Partial<Parameters<typeof DateTimePicker>[0]>) => {
    const [v, setV] = useState(initial);
    return <DateTimePicker label={label} value={v} onChange={setV} minValue={todayDate()} {...rest} />;
};

export const Empty: Story = { render: () => <Demo initial={{ time: START_OF_DAY }} placeholder="Select start" /> };

export const Filled: Story = { render: () => <Demo initial={{ date: nextMonth().start, time: new Time(9, 30) }} /> };

export const Open: Story = { render: () => <Demo initial={{ date: nextMonth().start, time: new Time(9, 30) }} defaultOpen /> };

/** End picker on the same day as a 9:30 AM start: earlier times are unavailable. */
export const EndLimitedByStart: Story = {
    render: () => (
        <Demo
            label="End"
            initial={{ date: nextMonth().start, time: END_OF_DAY }}
            minValue={nextMonth().start}
            notBefore={{ date: nextMonth().start, time: new Time(9, 30) }}
            defaultOpen
        />
    ),
};

export const WithError: Story = {
    render: () => (
        <div className="flex flex-col gap-1.5">
            <Demo label="End" initial={{ time: END_OF_DAY }} invalid placeholder="Select end" />
            <span className="text-sm text-error-primary">Pick an end date and time</span>
        </div>
    ),
};

/** Start → end pair, as used in Budget & flight. */
export const StartAndEnd: Story = {
    render: () => {
        const Pair = () => {
            const [start, setStart] = useState<DateTimeValue>({ date: nextMonth().start, time: START_OF_DAY });
            const [end, setEnd] = useState<DateTimeValue>({ date: nextMonth().end, time: END_OF_DAY });
            return (
                <div className="flex items-start gap-4">
                    <DateTimePicker label="Start" value={start} onChange={setStart} minValue={todayDate()} />
                    <span className="pt-2.5 text-quaternary">→</span>
                    <DateTimePicker label="End" value={end} onChange={setEnd} minValue={start.date} notBefore={start.date ? { date: start.date, time: start.time } : undefined} />
                </div>
            );
        };
        return <Pair />;
    },
};
