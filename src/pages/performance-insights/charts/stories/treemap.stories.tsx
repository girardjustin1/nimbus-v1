import type { Meta, StoryObj } from "@storybook/react-vite";
import { revenueShare } from "../chart-data";
import { ChartCard } from "../chart-kit";
import { NimbusTreemap } from "../reporting-charts";

/** Treemap (Nimbus extra) — share of a whole as areas; reads well with many parts. */
const meta = { title: "Performance Insights/Charts/Treemap", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const RevenueShare: Story = {
    render: () => (
        <ChartCard title="Revenue share by demand source" subtitle="Last 7 days">
            <NimbusTreemap data={revenueShare} />
        </ChartCard>
    ),
};
