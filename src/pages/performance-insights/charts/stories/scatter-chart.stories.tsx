import type { Meta, StoryObj } from "@storybook/react-vite";
import { adUnits } from "../chart-data";
import { ChartCard, Legend } from "../chart-kit";
import { colorAt } from "../chart-theme";
import { NimbusScatterChart } from "../reporting-charts";

/** Scatter / bubble (Nimbus extra) — eCPM against fill rate; bubble size is revenue. */
const meta = { title: "Performance Insights/Charts/Scatter Chart", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const formats = [...new Set(adUnits.map((a) => a.format))];

export const Bubbles: Story = {
    render: () => (
        <ChartCard title="Ad units: price vs fill" subtitle="Bubble size = revenue, last 7 days" legend={<Legend items={formats.map((f, i) => ({ label: f, color: colorAt(i) }))} />}>
            <NimbusScatterChart data={adUnits} xKey="fill" yKey="ecpm" sizeKey="revenue" groupKey="format" xFmt="pct" yFmt="usd2" xLabel="Fill rate" yLabel="eCPM" />
        </ChartCard>
    ),
};

export const Plain: Story = { render: () => <NimbusScatterChart data={adUnits} xKey="fill" yKey="ecpm" xFmt="pct" yFmt="usd2" height={260} /> };
