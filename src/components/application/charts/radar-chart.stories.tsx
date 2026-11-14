import type { Meta, StoryObj } from "@storybook/react-vite";
import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartLegendContent, ChartTooltipContent } from "@/components/application/charts/charts-base";

/**
 * Application UI → Radar Charts
 *
 * Recharts-based radar charts wired up with the Nimbus chart helpers
 * (`ChartTooltipContent`, `ChartLegendContent`). Series colors reference the brand
 * utility CSS variables, so they automatically pick up the Nimbus brand color in
 * both light and dark modes.
 */

// Capability comparison across six axes for two products.
const data = [
    { capability: "Speed", current: 120, target: 150 },
    { capability: "Reliability", current: 98, target: 130 },
    { capability: "Comfort", current: 86, target: 130 },
    { capability: "Safety", current: 99, target: 100 },
    { capability: "Efficiency", current: 85, target: 90 },
    { capability: "Design", current: 65, target: 85 },
];

// Series colors pick up the Nimbus brand automatically.
const brand = "var(--color-utility-brand-600)";
const brandAlt = "var(--color-utility-brand-300)";

const ChartFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="h-80 w-full max-w-md rounded-xl bg-primary p-4">
        <ResponsiveContainer width="100%" height="100%">
            {children}
        </ResponsiveContainer>
    </div>
);

const meta = {
    title: "Design System/Application UI/Radar Charts",
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof RadarChart>;

export const Default: Story = {
    name: "Radar chart",
    render: () => (
        <ChartFrame>
            <RadarChart data={data} outerRadius="70%">
                <PolarGrid className="[&_line]:stroke-border-secondary [&_polygon]:stroke-border-secondary" />
                <PolarAngleAxis dataKey="capability" className="text-xs text-tertiary" stroke="currentColor" tickLine={false} />
                <Tooltip content={<ChartTooltipContent />} cursor={{ className: "stroke-border-secondary" }} />
                <Legend content={<ChartLegendContent className="pt-4" />} />
                <Radar name="Current" dataKey="current" stroke={brand} fill={brand} fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Target" dataKey="target" stroke={brandAlt} fill={brandAlt} fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
        </ChartFrame>
    ),
};

export const SingleSeries: Story = {
    name: "Radar chart (single series)",
    render: () => (
        <ChartFrame>
            <RadarChart data={data} outerRadius="70%">
                <PolarGrid className="[&_line]:stroke-border-secondary [&_polygon]:stroke-border-secondary" />
                <PolarAngleAxis dataKey="capability" className="text-xs text-tertiary" stroke="currentColor" tickLine={false} />
                <Tooltip content={<ChartTooltipContent />} cursor={{ className: "stroke-border-secondary" }} />
                <Legend content={<ChartLegendContent className="pt-4" />} />
                <Radar name="Current" dataKey="current" stroke={brand} fill={brand} fillOpacity={0.3} strokeWidth={2} />
            </RadarChart>
        </ChartFrame>
    ),
};
