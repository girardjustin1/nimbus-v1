import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusComboChart } from "../cartesian-charts";
import { revenueAndEcpm } from "../chart-data";
import { ChartCard, Legend } from "../chart-kit";
import { nimbus } from "../chart-theme";

/** Combo chart (Nimbus extra) — revenue bars with eCPM as a line on its own axis. */
const meta = { title: "Performance Insights/Charts/Combo Chart", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const RevenueAndEcpm: Story = {
    render: () => (
        <ChartCard title="Revenue and eCPM" subtitle="Last 30 days · bars on the left axis, line on the right" legend={<Legend items={[{ label: "Revenue", color: nimbus.teal }, { label: "eCPM", color: nimbus.pink }]} />}>
            <NimbusComboChart data={revenueAndEcpm} xKey="day" bar={{ key: "Revenue" }} line={{ key: "eCPM" }} />
        </ChartCard>
    ),
};
