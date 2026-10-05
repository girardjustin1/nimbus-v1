import type { Meta, StoryObj } from "@storybook/react-vite";
import { FrequencyCapSection } from "../../../../prototypes/das/v3/screens/priority-frequency";
import { Setup, Surface } from "./harness";

/**
 * Frequency Cap — off by default (no cap); on, impressions per user per 24 hours.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Frequency Cap",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** No cap. */
export const Off: Story = {
    name: "Do not enable",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <FrequencyCapSection form={s.form} set={s.set} />}</Setup>
        </Surface>
    ),
};

/** Three a day. */
export const On: Story = {
    name: "Enabled",
    render: () => (
        <Surface>
            <Setup preset="empty" patch={{ freqCap: "3" }}>{(s) => <FrequencyCapSection form={s.form} set={s.set} />}</Setup>
        </Surface>
    ),
};
