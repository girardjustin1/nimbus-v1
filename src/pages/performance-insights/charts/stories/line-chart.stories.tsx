import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusLineChart } from "../cartesian-charts";
import { demandSources, revenueByDay, revenueVsPrevious } from "../chart-data";
import { ChartCard, Legend } from "../chart-kit";
import { colorAt, nimbus } from "../chart-theme";

/** Line chart — trends over time; a dashed series marks the comparison period. */
const meta = { title: "Performance Insights/Charts/Line Chart", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const VsPreviousPeriod: Story = {
    render: () => (
        <ChartCard title="Revenue" subtitle="Last 7 days vs the 7 days before" value="$55,330" change={0.023} legend={<Legend items={[{ label: "This week", color: nimbus.pink }, { label: "Previous week", color: nimbus.gray, dashed: true }]} />}>
            <NimbusLineChart data={revenueVsPrevious} xKey="day" fmt="usd" series={[{ key: "This week" }, { key: "Previous week", color: nimbus.gray, dashed: true }]} />
        </ChartCard>
    ),
};

export const MultiSeries: Story = {
    render: () => (
        <ChartCard title="Revenue by demand source" subtitle="Sep 12 – Sep 18" legend={<Legend items={demandSources.map((s, i) => ({ label: s, color: colorAt(i) }))} />}>
            <NimbusLineChart data={revenueByDay} xKey="day" fmt="usd" series={demandSources.map((key) => ({ key }))} />
        </ChartCard>
    ),
};
