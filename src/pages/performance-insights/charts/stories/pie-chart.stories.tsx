import type { Meta, StoryObj } from "@storybook/react-vite";
import { revenueShare } from "../chart-data";
import { ChartCard } from "../chart-kit";
import { NimbusPieChart } from "../radial-charts";

/** Pie chart — share of a whole, with values and percentages beside it. */
const meta = { title: "Performance Insights/Charts/Pie Chart", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => (
        <ChartCard title="Revenue share by demand source" subtitle="Last 7 days" className="max-w-2xl">
            <NimbusPieChart data={revenueShare} />
        </ChartCard>
    ),
};

export const ChartOnly: Story = { render: () => <NimbusPieChart data={revenueShare} showList={false} size={180} /> };
