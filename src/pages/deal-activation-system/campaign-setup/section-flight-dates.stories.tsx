import type { Meta, StoryObj } from "@storybook/react-vite";
import { FlightDatesSection } from "../../../../prototypes/das/v3/screens/budget-section";
import { Setup, Surface } from "./harness";

/**
 * Flight Dates — dates only (5 Oct review). Start and End side by side, length underneath.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Flight Dates",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** No dates. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <FlightDatesSection form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** A 30-day flight. */
export const Filled: Story = {
    name: "Filled",
    render: () => (
        <Surface>
            <Setup preset="ready">{(s) => <FlightDatesSection form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** The Start calendar open. */
export const CalendarOpen: Story = {
    name: "Calendar open",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <FlightDatesSection form={s.form} set={s.set} error={s.error} calendarOpen />}</Setup>
        </Surface>
    ),
};

/** The dates contradict each other. */
export const Invalid: Story = {
    name: "End before start",
    render: () => (
        <Surface>
            <Setup preset="datesInvalid" attempted>{(s) => <FlightDatesSection form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};
