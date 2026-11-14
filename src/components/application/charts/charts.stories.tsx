import type { Meta, StoryObj } from "@storybook/react-vite";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartActiveDot, ChartLegendContent, ChartTooltipContent } from "@/components/application/charts/charts-base";

/**
 * Application UI → Charts
 *
 * Recharts-based charts wired up with the Nimbus chart helpers
 * (`ChartTooltipContent`, `ChartLegendContent`, `ChartActiveDot`). Series colors
 * reference the brand utility CSS variables, so they automatically pick up the
 * Nimbus brand color in both light and dark modes.
 */

// Realistic monthly sample dataset with two series.
const data = [
    { month: "Jan", revenue: 4200, orders: 2400 },
    { month: "Feb", revenue: 5100, orders: 2210 },
    { month: "Mar", revenue: 4800, orders: 2290 },
    { month: "Apr", revenue: 6300, orders: 3000 },
    { month: "May", revenue: 7200, orders: 3480 },
    { month: "Jun", revenue: 6900, orders: 3100 },
    { month: "Jul", revenue: 8400, orders: 4100 },
    { month: "Aug", revenue: 9100, orders: 4600 },
    { month: "Sep", revenue: 8700, orders: 4300 },
    { month: "Oct", revenue: 10200, orders: 5200 },
    { month: "Nov", revenue: 11500, orders: 5800 },
    { month: "Dec", revenue: 12800, orders: 6400 },
];

// Brand series color picks up Nimbus automatically; second series uses a muted brand tint.
const brand = "var(--color-utility-brand-600)";
const brandAlt = "var(--color-utility-brand-300)";

const axisProps = {
    tickLine: false,
    axisLine: false,
    className: "text-xs text-tertiary",
    stroke: "currentColor",
} as const;

const gridProps = {
    vertical: false,
    className: "text-utility-gray-100 [&_line]:stroke-border-secondary",
} as const;

const ChartFrame = ({ children }: { children: React.ReactNode }) => (
    <div className="h-80 w-full max-w-3xl rounded-xl bg-primary p-4">
        <ResponsiveContainer width="100%" height="100%">
            {children}
        </ResponsiveContainer>
    </div>
);

const meta = {
    title: "Design System/Application UI/Charts",
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof LineChart>;

export const LineChartExample: Story = {
    name: "Line chart",
    render: () => (
        <ChartFrame>
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} width={40} />
                <Tooltip content={<ChartTooltipContent />} cursor={{ className: "stroke-border-secondary" }} />
                <Legend content={<ChartLegendContent className="pt-4" />} />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke={brand}
                    strokeWidth={2}
                    dot={false}
                    activeDot={<ChartActiveDot />}
                />
                <Line
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke={brandAlt}
                    strokeWidth={2}
                    dot={false}
                    activeDot={<ChartActiveDot />}
                />
            </LineChart>
        </ChartFrame>
    ),
};

export const AreaChartExample: Story = {
    name: "Area chart",
    render: () => (
        <ChartFrame>
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                    <linearGradient id="nimbus-area-revenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={brand} stopOpacity={0.3} />
                        <stop offset="100%" stopColor={brand} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} width={40} />
                <Tooltip content={<ChartTooltipContent />} cursor={{ className: "stroke-border-secondary" }} />
                <Legend content={<ChartLegendContent className="pt-4" />} />
                <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke={brand}
                    strokeWidth={2}
                    fill="url(#nimbus-area-revenue)"
                    activeDot={<ChartActiveDot />}
                />
            </AreaChart>
        </ChartFrame>
    ),
};

export const BarChartExample: Story = {
    name: "Bar chart",
    render: () => (
        <ChartFrame>
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid {...gridProps} />
                <XAxis dataKey="month" {...axisProps} />
                <YAxis {...axisProps} width={40} />
                <Tooltip content={<ChartTooltipContent />} cursor={{ className: "fill-utility-brand-50/40" }} />
                <Legend content={<ChartLegendContent className="pt-4" />} />
                <Bar dataKey="revenue" name="Revenue" fill={brand} radius={[4, 4, 0, 0]} />
                <Bar dataKey="orders" name="Orders" fill={brandAlt} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartFrame>
    ),
};
