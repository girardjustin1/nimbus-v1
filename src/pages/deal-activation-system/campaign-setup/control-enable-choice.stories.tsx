import type { Meta, StoryObj } from "@storybook/react-vite";
import { EnableChoice, NumberPicker } from "../../../../prototypes/das/v3/screens/priority-frequency";
import { Surface, Value } from "./harness";

/**
 * Enable choice — Do not enable / Enable, the pair Priority and Frequency Cap share. The control sits on the Enable row.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Enable Choice",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Off: the radio says what off means. */
export const Off: Story = {
    name: "Do not enable",
    render: () => (
        <Surface>
            <Value<number | undefined> initial={undefined}>
                {(n, set) => (
                    <EnableChoice enabled={n !== undefined} onToggle={(on) => set(on ? 1 : undefined)} label="Nimbus defaults to even distribution.">
                        <NumberPicker name="Priority" labelFor={String} value={n} onChange={set} disabled={n === undefined} />
                    </EnableChoice>
                )}
            </Value>
        </Surface>
    ),
};

/** On, with a value. */
export const On: Story = {
    name: "Enabled",
    render: () => (
        <Surface>
            <Value<number | undefined> initial={1}>
                {(n, set) => (
                    <EnableChoice enabled={n !== undefined} onToggle={(on) => set(on ? 1 : undefined)} label="Nimbus defaults to even distribution.">
                        <NumberPicker name="Priority" labelFor={String} value={n} onChange={set} disabled={n === undefined} />
                    </EnableChoice>
                )}
            </Value>
        </Surface>
    ),
};
