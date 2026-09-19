import type { Meta, StoryObj } from "@storybook/react-vite";
import { revenueShare } from "../chart-data";
import { ChartCard } from "../chart-kit";
import { nimbus } from "../chart-theme";
import { NimbusPieChart } from "../radial-charts";

/** Donut chart — like the pie, with the total in the middle. */
const meta = { title: "Performance Insights/Charts/Donut Chart", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <ChartCard title="Revenue share by demand source" subtitle="Last 7 days" className="max-w-2xl">
            <NimbusPieChart data={revenueShare} donut centerLabel="Total revenue" />
        </ChartCard>
    ),
};

export const TwoPart: Story = {
    render: () => (
        <ChartCard title="Deal vs open marketplace" subtitle="Share of impressions, last 7 days" className="max-w-2xl">
            <NimbusPieChart data={[{ name: "DAS deals", value: 0.18, color: nimbus.teal }, { name: "Open marketplace", value: 0.82, color: nimbus.pink }]} donut fmt="pct" centerLabel="of impressions" />
        </ChartCard>
    ),
};
