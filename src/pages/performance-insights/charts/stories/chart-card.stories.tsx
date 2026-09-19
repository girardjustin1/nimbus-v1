import type { Meta, StoryObj } from "@storybook/react-vite";
import { Change, ChartCard, Legend, NimbusTooltip } from "../chart-kit";
import { nimbus } from "../chart-theme";

/** Chart card, legend, change badge and tooltip — the chrome every chart shares. */
const meta = { title: "Performance Insights/Charts/Chart Card & Legend", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Card: Story = {
    render: () => (
        <ChartCard title="Revenue" subtitle="Last 7 days" value="$55,330" change={0.023} legend={<Legend items={[{ label: "This week", color: nimbus.pink }, { label: "Previous week", color: nimbus.gray, dashed: true }]} />}>
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-secondary text-sm text-tertiary">Chart goes here</div>
        </ChartCard>
    ),
};
export const ChangeBadges: Story = {
    render: () => (
        <div className="flex gap-3">
            <Change value={0.052} />
            <Change value={-0.031} />
            <Change value={-0.031} invert />
        </div>
    ),
};
export const Tooltip: Story = {
    render: () => (
        <NimbusTooltip
            active
            label="Sep 14"
            fmt="usd"
            payload={[
                { name: "Nimbus+", value: 3990, color: nimbus.pink },
                { name: "Magnite", value: 1910, color: nimbus.teal },
                { name: "Index Exchange", value: 1570, color: nimbus.indigo },
            ]}
        />
    ),
};
