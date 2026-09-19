import type { Meta, StoryObj } from "@storybook/react-vite";
import { goals } from "../chart-data";
import { ChartCard, Legend } from "../chart-kit";
import { colorAt } from "../chart-theme";
import { ActivityGauge } from "../radial-charts";

/** Activity gauge — concentric rings for progress against several goals. */
const meta = { title: "Performance Insights/Charts/Activity Gauge", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const MonthlyGoals: Story = {
    render: () => (
        <ChartCard title="September goals" subtitle="18 of 30 days gone" className="max-w-xl">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
                <ActivityGauge data={goals} centerLabel="of revenue goal" />
                <Legend className="flex-col items-start" items={goals.map((g, i) => ({ label: `${g.name} · ${g.target}`, color: colorAt(i), value: `${g.value}%` }))} />
            </div>
        </ChartCard>
    ),
};

export const Small: Story = { render: () => <ActivityGauge data={goals} size={160} /> };
