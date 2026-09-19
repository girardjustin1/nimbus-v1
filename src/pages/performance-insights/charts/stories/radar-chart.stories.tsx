import type { Meta, StoryObj } from "@storybook/react-vite";
import { partnerScores } from "../chart-data";
import { ChartCard, Legend } from "../chart-kit";
import { colorAt } from "../chart-theme";
import { NimbusRadarChart } from "../radial-charts";

/** Radar chart — compare a few partners across several scored dimensions (0–100). */
const meta = { title: "Performance Insights/Charts/Radar Chart", parameters: { layout: "padded" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const partners = ["Nimbus+", "Magnite", "Index Exchange"];

export const ThreePartners: Story = {
    render: () => (
        <ChartCard title="Demand partner scorecard" subtitle="Scored 0–100, last 30 days" className="max-w-2xl" legend={<Legend items={partners.map((p, i) => ({ label: p, color: colorAt(i) }))} />}>
            <NimbusRadarChart data={partnerScores} angleKey="metric" series={partners.map((key) => ({ key }))} />
        </ChartCard>
    ),
};

export const SingleSeries: Story = {
    render: () => (
        <ChartCard title="Nimbus+ scorecard" className="max-w-xl">
            <NimbusRadarChart data={partnerScores} angleKey="metric" series={[{ key: "Nimbus+" }]} height={280} />
        </ChartCard>
    ),
};
