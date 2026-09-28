import { useState } from "react";
import type { CalendarDate } from "@internationalized/date";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { nextMonth, todayDate } from "../deal-activation-system/dates";
import { items } from "./feedback";
import { BeforeAfter, ReviewPage } from "./review-note";
import { DatePicker } from "./revised/date-picker";
import { FlightDatesAfter, FlightDatesBefore } from "./revised/flight-dates";

/**
 * Sept 22 · 2 — Flight dates lose the time of day.
 *
 * The backend has no time of day on a flight yet, so the setup flows ask for two dates.
 * The date and time picker is kept as the target state for when that changes.
 */
const meta = {
    title: "Sept 22/2 Date only, no time",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The flight row as reviewed, next to the revised one. */
export const FlightDates: Story = {
    name: "Flight dates · before and after",
    render: () => (
        <ReviewPage item={items[1]}>
            <BeforeAfter
                before={<FlightDatesBefore />}
                after={<FlightDatesAfter />}
                note="Open either picker to compare the panels. The revised one drops the Available times column; everything else — calendar, typed date, Today, Cancel, Apply — is unchanged."
            />
        </ReviewPage>
    ),
};

const Demo = ({ open }: { open?: boolean }) => {
    const [date, setDate] = useState<CalendarDate | undefined>(nextMonth().start);
    return (
        <div className="flex min-h-[560px] flex-col gap-4 bg-secondary p-8">
            <DatePicker label="Start" value={date} onChange={setDate} minValue={todayDate()} defaultOpen={open} placeholder="Select start" />
        </div>
    );
};

/** The revised picker on its own. */
export const Picker: Story = { name: "Date picker", render: () => <Demo /> };

/** The panel open: calendar, then typed date, Today, Cancel and Apply. */
export const PickerOpen: Story = { name: "Date picker · open", render: () => <Demo open /> };
