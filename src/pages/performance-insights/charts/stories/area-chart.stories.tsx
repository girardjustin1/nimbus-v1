import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusAreaChart } from "../cartesian-charts";
import { demandSources, revenueAndEcpm, revenueByDay } from "../chart-data";
import { ChartCard, Legend } from "../chart-kit";
import { colorAt } from "../chart-theme";

/** Area chart — volume over time with a soft gradient; stacked shows the mix. */
const meta = { title: "Performance Insights/Charts/Area Chart", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Single: Story = {
    render: () => (
        <ChartCard title="Revenue" subtitle="Last 30 days" value="$231,400" change={0.052}>
            <NimbusAreaChart data={revenueAndEcpm} xKey="day" fmt="usd" series={[{ key: "Revenue" }]} />
        </ChartCard>
    ),
};

export const Stacked: Story = {
    render: () => (
        <ChartCard title="Revenue mix by demand source" subtitle="Sep 12 – Sep 18" legend={<Legend items={demandSources.map((s, i) => ({ label: s, color: colorAt(i) }))} />}>
            <NimbusAreaChart data={revenueByDay} xKey="day" fmt="usd" stacked series={demandSources.map((key) => ({ key }))} />
        </ChartCard>
    ),
};
