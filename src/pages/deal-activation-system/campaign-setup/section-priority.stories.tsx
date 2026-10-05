import type { Meta, StoryObj } from "@storybook/react-vite";
import { PrioritySection } from "../../../../prototypes/das/v3/screens/priority-frequency";
import { Setup, Surface } from "./harness";

/**
 * Priority — off by default (even distribution); on, a number from 1 to 100.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Priority",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default. */
export const Off: Story = {
    name: "Do not enable",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <PrioritySection form={s.form} set={s.set} />}</Setup>
        </Surface>
    ),
};

/** Priority 1, served first. */
export const On: Story = {
    name: "Enabled",
    render: () => (
        <Surface>
            <Setup preset="empty" patch={{ priority: 1 }}>{(s) => <PrioritySection form={s.form} set={s.set} />}</Setup>
        </Surface>
    ),
};
