import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eye, Package, Users01, Zap } from "@untitledui/icons";
import {
    MetricsChart01,
    MetricsChart02,
    MetricsChart03,
    MetricsChart04,
    MetricsIcon01,
    MetricsIcon02,
    MetricsIcon03,
    MetricsIcon04,
    MetricsSimple,
} from "@/components/application/metrics/metrics";

/**
 * Application UI → Metrics
 *
 * Nimbus-themed metric cards. The theme is applied globally, so the sparklines,
 * featured icons, and trend indicators all pick up the Nimbus teal brand
 * automatically — the stories just render each variant with realistic data.
 */

const meta = {
    title: "Design System/Application UI/Metrics",
    component: MetricsSimple,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta<typeof MetricsSimple>;

export default meta;

// Render-only stories: type against a rendered component so required args aren't demanded.
type Story = StoryObj<typeof MetricsSimple>;

/** The default headline metric card with a simple trend indicator. */
export const Default: Story = {
    render: () => (
        <div className="max-w-sm">
            <MetricsSimple subtitle="Active demand" title="$48.2k" type="simple" trend="positive" change="12%" />
        </div>
    ),
};

/** The three change-indicator styles (simple, trend, modern) as used across the metric cards. */
export const Simple: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <MetricsSimple subtitle="Active demand" title="$48.2k" type="simple" trend="positive" change="12%" />
            <MetricsSimple subtitle="Fill rate" title="94.6%" type="trend" trend="positive" change="3.2%" />
            <MetricsSimple subtitle="Avg. response time" title="1.4s" type="modern" trend="negative" change="8%" />
        </div>
    ),
};

/** Featured-icon metric variants (Icon01–Icon04) with Nimbus supply/demand data. */
export const WithIcons: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MetricsIcon01 subtitle="Requests served" title="128,940" />
            <MetricsIcon02 subtitle="Automation runs" title="9,214" />
            <MetricsIcon03 subtitle="Active partners" title="482" change="12%" changeTrend="positive" icon={Users01} />
            <MetricsIcon04 subtitle="Fulfilled orders" title="$48.2k" change="8%" changeTrend="positive" icon={Package} />
        </div>
    ),
};

/** Sparkline metric cards — the area chart renders in the Nimbus brand color. */
export const WithCharts: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <MetricsChart01 subtitle="Active demand" title="$48.2k" change="12%" changeDescription="vs last month" trend="positive" />
            <MetricsChart02 subtitle="Page views" title="128,940" change="9.3%" changeTrend="positive" icon={Eye} />
            <MetricsChart03 subtitle="Conversion rate" title="4.8%" change="2.1%" changeTrend="positive" changeDescription="vs last week" />
            <MetricsChart04 subtitle="Monthly revenue" title="$102.4k" change="14%" changeTrend="positive" changeDescription="vs last month" />
        </div>
    ),
};

/** A full dashboard-style KPI row mixing several variants together. */
export const MetricRow: Story = {
    render: () => (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            <MetricsIcon03 subtitle="Active users" title="24,061" change="12%" changeTrend="positive" icon={Users01} actions={false} />
            <MetricsIcon03 subtitle="Automation runs" title="9,214" change="4%" changeTrend="positive" icon={Zap} actions={false} />
            <MetricsChart01 subtitle="Active demand" title="$48.2k" change="12%" changeDescription="vs last month" trend="positive" actions={false} />
            <MetricsChart01 subtitle="Error rate" title="0.4%" change="6%" changeDescription="vs last month" trend="negative" actions={false} />
        </div>
    ),
};
