import type { Meta, StoryObj } from "@storybook/react-vite";
import type { CalendarDate } from "@internationalized/date";
import { TODAY } from "../../../../prototypes/das/v1/screens/setup-data";
import { DatePicker } from "../../../../prototypes/das/v3/screens/date-picker";
import { Surface, Value } from "./harness";

/**
 * Date picker — dates only. A full-width field opening the design system's calendar layout: typed date and Today above the grid, Cancel and Apply below.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Date Picker",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** No date. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <div className="max-w-sm">
                <Value<CalendarDate | undefined> initial={undefined}>{(d, set) => <DatePicker label="Start" value={d} onChange={set} minValue={TODAY} today={TODAY} placeholder="Select start" />}</Value>
            </div>
        </Surface>
    ),
};

/** A date chosen. */
export const WithDate: Story = {
    name: "With date",
    render: () => (
        <Surface>
            <div className="max-w-sm">
                <Value<CalendarDate | undefined> initial={TODAY.add({ days: 27 })}>{(d, set) => <DatePicker label="Start" value={d} onChange={set} minValue={TODAY} today={TODAY} />}</Value>
            </div>
        </Surface>
    ),
};

/** The calendar panel. */
export const Open: Story = {
    name: "Open",
    render: () => (
        <Surface>
            <div className="min-h-[560px] max-w-sm">
                <Value<CalendarDate | undefined> initial={TODAY.add({ days: 27 })}>{(d, set) => <DatePicker label="Start" value={d} onChange={set} minValue={TODAY} today={TODAY} defaultOpen />}</Value>
            </div>
        </Surface>
    ),
};

/** An end before the start. */
export const Invalid: Story = {
    name: "Invalid",
    render: () => (
        <Surface>
            <div className="max-w-sm">
                <DatePicker label="End" value={TODAY} onChange={() => {}} today={TODAY} invalid />
            </div>
        </Surface>
    ),
};
