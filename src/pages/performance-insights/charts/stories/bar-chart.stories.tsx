import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusBarChart } from "../cartesian-charts";
import { demandSources, revenueByApp, revenueByDay } from "../chart-data";
import { ChartCard, Legend } from "../chart-kit";
import { colorAt, nimbus } from "../chart-theme";

/** Bar chart — grouped to compare, stacked to show the mix, horizontal for long labels. */
const meta = { title: "Performance Insights/Charts/Bar Chart", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const platforms = <Legend items={[{ label: "iOS", color: nimbus.pink }, { label: "Android", color: nimbus.teal }]} />;

export const Grouped: Story = {
    render: () => (
        <ChartCard title="Revenue by app" subtitle="Week of Sep 14 · iOS vs Android" legend={platforms}>
            <NimbusBarChart data={revenueByApp} xKey="app" fmt="usd" series={[{ key: "iOS" }, { key: "Android" }]} />
        </ChartCard>
    ),
};

export const Stacked: Story = {
    render: () => (
        <ChartCard title="Daily revenue by demand source" subtitle="Sep 12 – Sep 18" legend={<Legend items={demandSources.map((s, i) => ({ label: s, color: colorAt(i) }))} />}>
            <NimbusBarChart data={revenueByDay} xKey="day" fmt="usd" variant="stacked" series={demandSources.map((key) => ({ key }))} />
        </ChartCard>
    ),
};

export const Horizontal: Story = {
    render: () => (
        <ChartCard title="Revenue by app" subtitle="Stacked by platform" legend={platforms}>
            <NimbusBarChart data={revenueByApp} xKey="app" fmt="usd" variant="horizontal" height={240} series={[{ key: "iOS" }, { key: "Android" }]} />
        </ChartCard>
    ),
};
