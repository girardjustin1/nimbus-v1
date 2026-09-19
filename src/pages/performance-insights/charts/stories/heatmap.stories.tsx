import type { Meta, StoryObj } from "@storybook/react-vite";
import { heatmapRows, heatmapWeeks } from "../chart-data";
import { ChartCard } from "../chart-kit";
import { Heatmap } from "../reporting-charts";

/** Heatmap (Nimbus extra) — two dimensions at once; darker cells earn more. */
const meta = { title: "Performance Insights/Charts/Heatmap", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const cols = heatmapWeeks.map((w) => `Week of ${w}`);

export const Teal: Story = {
    render: () => (
        <ChartCard title="Revenue by app and week" subtitle="Aug 24 – Sep 20">
            <Heatmap rows={heatmapRows} columns={cols} />
        </ChartCard>
    ),
};
export const Pink: Story = { render: () => <Heatmap rows={heatmapRows} columns={cols} tone="pink" /> };
export const NoValues: Story = { render: () => <Heatmap rows={heatmapRows} columns={cols} showValues={false} /> };
