import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusAreaChart, NimbusBarChart, NimbusComboChart, NimbusLineChart } from "../cartesian-charts";
import { adUnits, auctionFunnel, goals, heatmapRows, heatmapWeeks, kpis, partnerScores, revenueAndEcpm, revenueByApp, revenueShare, revenueVsPrevious } from "../chart-data";
import { ChartCard, Legend } from "../chart-kit";
import { colorAt, nimbus } from "../chart-theme";
import { ActivityGauge, NimbusPieChart, NimbusRadarChart, ProgressCircle } from "../radial-charts";
import { Funnel, Heatmap, MetricCard, NimbusScatterChart, NimbusTreemap } from "../reporting-charts";

/**
 * Every Nimbus chart on one page, laid out like a Performance Insights dashboard,
 * so the family can be judged together.
 */
const meta = { title: "Performance Insights/Charts/Gallery", parameters: { layout: "fullscreen" } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {
    render: () => (
        <div className="flex flex-col gap-6 bg-secondary p-8">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {kpis.map((k, i) => (
                    <MetricCard key={k.label} label={k.label} value={k.value} prev={k.prev} fmt={k.fmt} trend={k.trend} color={colorAt(i)} />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <ChartCard className="xl:col-span-2" title="Revenue" subtitle="This week vs last" value="$55,330" change={0.023} legend={<Legend items={[{ label: "This week", color: nimbus.pink }, { label: "Previous week", color: nimbus.gray, dashed: true }]} />}>
                    <NimbusLineChart data={revenueVsPrevious} xKey="day" fmt="usd" series={[{ key: "This week" }, { key: "Previous week", color: nimbus.gray, dashed: true }]} />
                </ChartCard>
                <ChartCard title="Revenue share" subtitle="By demand source">
                    <NimbusPieChart data={revenueShare} donut centerLabel="Total" size={180} />
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ChartCard title="Revenue and eCPM" subtitle="Last 30 days" legend={<Legend items={[{ label: "Revenue", color: nimbus.teal }, { label: "eCPM", color: nimbus.pink }]} />}>
                    <NimbusComboChart data={revenueAndEcpm} xKey="day" bar={{ key: "Revenue" }} line={{ key: "eCPM" }} height={260} />
                </ChartCard>
                <ChartCard title="Revenue, 30 days" subtitle="Area">
                    <NimbusAreaChart data={revenueAndEcpm} xKey="day" fmt="usd" series={[{ key: "Revenue" }]} height={260} />
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <ChartCard title="Revenue by app" subtitle="iOS vs Android" legend={<Legend items={[{ label: "iOS", color: nimbus.pink }, { label: "Android", color: nimbus.teal }]} />}>
                    <NimbusBarChart data={revenueByApp} xKey="app" fmt="usd" series={[{ key: "iOS" }, { key: "Android" }]} height={240} />
                </ChartCard>
                <ChartCard title="September goals" subtitle="Activity gauge">
                    <div className="flex justify-center">
                        <ActivityGauge data={goals} size={220} centerLabel="of revenue goal" />
                    </div>
                </ChartCard>
                <ChartCard title="Partner scorecard" subtitle="Radar" legend={<Legend items={["Nimbus+", "Magnite"].map((p, i) => ({ label: p, color: colorAt(i) }))} />}>
                    <NimbusRadarChart data={partnerScores} angleKey="metric" series={[{ key: "Nimbus+" }, { key: "Magnite" }]} height={240} />
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <ChartCard title="Revenue by app and week" subtitle="Heatmap">
                    <Heatmap rows={heatmapRows} columns={heatmapWeeks} />
                </ChartCard>
                <ChartCard title="Auction funnel" subtitle="Last 7 days">
                    <Funnel stages={auctionFunnel} />
                </ChartCard>
            </div>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <ChartCard className="xl:col-span-2" title="Ad units: price vs fill" subtitle="Bubble size = revenue">
                    <NimbusScatterChart data={adUnits} xKey="fill" yKey="ecpm" sizeKey="revenue" groupKey="format" xFmt="pct" yFmt="usd2" xLabel="Fill rate" yLabel="eCPM" height={280} />
                </ChartCard>
                <ChartCard title="Goals" subtitle="Progress circles">
                    <div className="flex flex-wrap items-end justify-around gap-4">
                        <ProgressCircle value={78} label="Revenue" />
                        <ProgressCircle value={62} half label="Fill rate" color={nimbus.teal} />
                    </div>
                </ChartCard>
            </div>
            <ChartCard title="Revenue share" subtitle="Treemap">
                <NimbusTreemap data={revenueShare} height={260} />
            </ChartCard>
        </div>
    ),
};
