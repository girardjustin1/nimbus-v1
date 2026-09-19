import type { Meta, StoryObj } from "@storybook/react-vite";
import { PaceLabel, StatusDot } from "../das-shell";

/** Round 1 · Campaign status dot and pace label. */
const meta = {
    title: "Deal Activation System/Round 1 Concepts/Components/Status & Pace",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Statuses: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            {(["Running", "Scheduled", "Paused", "Complete", "Draft"] as const).map((s) => (
                <StatusDot key={s} status={s} />
            ))}
        </div>
    ),
};

export const PaceLabels: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            {(["on track", "ahead", "behind", "not started", "no budget"] as const).map((s) => (
                <PaceLabel key={s} state={s} />
            ))}
        </div>
    ),
};
