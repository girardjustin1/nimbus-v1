import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartLegendContent, ChartTooltipContent } from "@/components/application/charts/charts-base";

/**
 * Application UI → Pie Charts
 *
 * Recharts-based pie/donut charts wired up with the Nimbus chart helpers
 * (`ChartTooltipContent`, `ChartLegendContent`). Slice colors reference the brand
 * utility CSS variables, so they automatically pick up the Nimbus brand color in
 * both light and dark modes.
 */

// Demand mix by ad format — a few slices on-brand plus neutral grays.
const data = [
    { name: "Display", value: 42, className: "text-utility-brand-600" },
    { name: "Video", value: 28, className: "text-utility-brand-400" },
    { name: "Native", value: 18, className: "text-utility-brand-200" },
    { name: "Audio", value: 12, className: "text-utility-gray-300" },
];

// Slice fills pick up the Nimbus brand automatically; extra slices use neutral grays.
const sliceColors = [
    "var(--color-utility-brand-600)",
    "var(--color-utility-brand-400)",
    "var(--color-utility-brand-200)",
    "var(--color-utility-gray-300)",
];

const ChartFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="h-80 w-full max-w-md rounded-xl bg-primary p-4">
        <ResponsiveContainer width="100%" height="100%">
            {children}
        </ResponsiveContainer>
    </div>
);

const meta = {
    title: "Design System/Application UI/Pie Charts",
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof PieChart>;

export const Default: Story = {
    name: "Pie chart",
    render: () => (
        <ChartFrame>
            <PieChart>
                <Tooltip content={<ChartTooltipContent isPieChart />} cursor={{ className: "fill-utility-brand-50/40" }} />
                <Legend content={<ChartLegendContent className="pt-4" />} />
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} strokeWidth={2} className="stroke-bg-primary">
                    {data.map((entry, index) => (
                        <Cell key={entry.name} fill={sliceColors[index % sliceColors.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ChartFrame>
    ),
};

export const Donut: Story = {
    name: "Donut chart",
    render: () => (
        <ChartFrame>
            <PieChart>
                <Tooltip content={<ChartTooltipContent isPieChart />} cursor={{ className: "fill-utility-brand-50/40" }} />
                <Legend content={<ChartLegendContent className="pt-4" />} />
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={100}
                    paddingAngle={2}
                    strokeWidth={2}
                    className="stroke-bg-primary"
                >
                    {data.map((entry, index) => (
                        <Cell key={entry.name} fill={sliceColors[index % sliceColors.length]} />
                    ))}
                </Pie>
            </PieChart>
        </ChartFrame>
    ),
};
