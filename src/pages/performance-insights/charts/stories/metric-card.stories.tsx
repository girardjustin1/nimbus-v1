import type { Meta, StoryObj } from "@storybook/react-vite";
import { kpis } from "../chart-data";
import { colorAt } from "../chart-theme";
import { MetricCard } from "../reporting-charts";

/** Metric card — the headline number, its change, and an optional 7-day trend. */
const meta = { title: "Performance Insights/Charts/Metric Card", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithTrend: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k, i) => (
                <MetricCard key={k.label} label={k.label} value={k.value} prev={k.prev} fmt={k.fmt} trend={k.trend} color={colorAt(i)} />
            ))}
        </div>
    ),
};

export const Simple: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {kpis.map((k) => (
                <MetricCard key={k.label} label={k.label} value={k.value} prev={k.prev} fmt={k.fmt} variant="simple" />
            ))}
        </div>
    ),
};

export const LowerIsBetter: Story = { render: () => <div className="max-w-xs"><MetricCard label="Timeout rate" value={0.031} prev={0.038} fmt="pct" trend={[3.8, 3.6, 3.5, 3.4, 3.3, 3.2, 3.1]} invert /></div> };
