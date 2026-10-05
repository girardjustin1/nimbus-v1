import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberPicker } from "../../../../prototypes/das/v3/screens/priority-frequency";
import { Surface, Value } from "./harness";

/**
 * Number picker — 1 to 100. Type to jump to a number, or ↑ ↓ to step; the list opens under it.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Number Picker",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing picked. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Value<number | undefined> initial={undefined}>{(n, set) => <NumberPicker name="Priority" labelFor={String} value={n} onChange={set} />}</Value>
        </Surface>
    ),
};

/** A value, shown with its unit. */
export const WithValue: Story = {
    name: "With value",
    render: () => (
        <Surface>
            <Value<number | undefined> initial={3}>{(n, set) => <NumberPicker name="Frequency cap" labelFor={(v) => `${v} a day`} value={n} onChange={set} />}</Value>
        </Surface>
    ),
};

/** While its Enable radio is off. */
export const Disabled: Story = {
    name: "Disabled",
    render: () => (
        <Surface>
            <NumberPicker name="Priority" labelFor={String} value={undefined} onChange={() => {}} disabled />
        </Surface>
    ),
};
