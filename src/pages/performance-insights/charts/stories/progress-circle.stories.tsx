import type { Meta, StoryObj } from "@storybook/react-vite";
import { nimbus } from "../chart-theme";
import { ProgressCircle } from "../radial-charts";

/** Progress circle — one value against a goal, as a full or half ring. */
const meta = { title: "Performance Insights/Charts/Progress Circle", component: ProgressCircle, args: { value: 72, label: "Fill rate goal" } } satisfies Meta<typeof ProgressCircle>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Sizes: Story = {
    render: () => (
        <div className="flex items-end gap-8">
            <ProgressCircle value={40} size="sm" label="Small" />
            <ProgressCircle value={65} size="md" label="Medium" color={nimbus.teal} />
            <ProgressCircle value={91} size="lg" label="Large" color={nimbus.indigo} />
        </div>
    ),
};
export const HalfCircle: Story = {
    render: () => (
        <div className="flex items-end gap-8">
            <ProgressCircle value={78} half size="md" label="Revenue goal" />
            <ProgressCircle value={62} half size="lg" label="Fill rate goal" color={nimbus.teal} />
        </div>
    ),
};
