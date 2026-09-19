import { useId } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { NimbusTooltip } from "./chart-kit";
import { type Fmt, type SeriesDef, activeDot, axis, barCursor, colorAt, format, grid, lineCursor, nimbus } from "./chart-theme";

/**
 * Cartesian charts in the Nimbus style: line, area, bar (grouped, stacked, horizontal)
 * and a bar + line combo. Each renders the chart only; wrap it in <ChartCard> for the
 * title, headline value and legend.
 */

type Row = Record<string, string | number>;

interface BaseProps {
    data: Row[];
    xKey: string;
    series: SeriesDef[];
    fmt?: Fmt;
    height?: number;
}

const colorOf = (s: SeriesDef, i: number) => s.color ?? colorAt(i);

/* ---------------------------------------------------------------- Line --- */

export const NimbusLineChart = ({ data, xKey, series, fmt = "num", height = 280 }: BaseProps) => (
    <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <CartesianGrid {...grid} />
                <XAxis dataKey={xKey} {...axis} />
                <YAxis {...axis} width={56} tickFormatter={(v: number) => format(v, fmt)} />
                <Tooltip cursor={lineCursor} content={<NimbusTooltip fmt={fmt} />} />
                {series.map((s, i) => (
                    <Line
                        key={s.key}
                        type="monotone"
                        dataKey={s.key}
                        stroke={colorOf(s, i)}
                        strokeWidth={2.5}
                        strokeDasharray={s.dashed ? "6 5" : undefined}
                        dot={false}
                        activeDot={s.dashed ? false : activeDot(colorOf(s, i))}
                        isAnimationActive={false}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    </div>
);

/* ---------------------------------------------------------------- Area --- */

export const NimbusAreaChart = ({ data, xKey, series, fmt = "num", height = 280, stacked = false }: BaseProps & { stacked?: boolean }) => {
    const id = useId().replace(/:/g, "");
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                        {series.map((s, i) => (
                            <linearGradient key={s.key} id={`${id}-${i}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={colorOf(s, i)} stopOpacity={stacked ? 0.55 : 0.32} />
                                <stop offset="100%" stopColor={colorOf(s, i)} stopOpacity={stacked ? 0.15 : 0} />
                            </linearGradient>
                        ))}
                    </defs>
                    <CartesianGrid {...grid} />
                    <XAxis dataKey={xKey} {...axis} minTickGap={24} />
                    <YAxis {...axis} width={56} tickFormatter={(v: number) => format(v, fmt)} />
                    <Tooltip cursor={lineCursor} content={<NimbusTooltip fmt={fmt} />} />
                    {series.map((s, i) => (
                        <Area
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            stackId={stacked ? "a" : undefined}
                            stroke={colorOf(s, i)}
                            strokeWidth={2}
                            fill={`url(#${id}-${i})`}
                            activeDot={activeDot(colorOf(s, i))}
                            isAnimationActive={false}
                        />
                    ))}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

/* ----------------------------------------------------------------- Bar --- */

export type BarVariant = "grouped" | "stacked" | "horizontal";

export const NimbusBarChart = ({ data, xKey, series, fmt = "num", height = 280, variant = "grouped" }: BaseProps & { variant?: BarVariant }) => {
    const horizontal = variant === "horizontal";
    const stacked = variant === "stacked" || horizontal;
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barGap={4} barCategoryGap={horizontal ? "28%" : "22%"}>
                    <CartesianGrid {...grid} vertical={horizontal} horizontal={!horizontal} />
                    {horizontal ? (
                        <>
                            <XAxis type="number" {...axis} tickFormatter={(v: number) => format(v, fmt)} />
                            <YAxis type="category" dataKey={xKey} {...axis} width={110} />
                        </>
                    ) : (
                        <>
                            <XAxis dataKey={xKey} {...axis} />
                            <YAxis {...axis} width={56} tickFormatter={(v: number) => format(v, fmt)} />
                        </>
                    )}
                    <Tooltip cursor={barCursor} content={<NimbusTooltip fmt={fmt} />} />
                    {series.map((s, i) => {
                        const last = i === series.length - 1;
                        const r = 6;
                        const radius: [number, number, number, number] = !stacked ? [r, r, 0, 0] : last ? (horizontal ? [0, r, r, 0] : [r, r, 0, 0]) : [0, 0, 0, 0];
                        return (
                            <Bar
                                key={s.key}
                                dataKey={s.key}
                                stackId={stacked ? "a" : undefined}
                                fill={colorOf(s, i)}
                                radius={radius}
                                maxBarSize={horizontal ? 22 : 36}
                                isAnimationActive={false}
                            />
                        );
                    })}
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

/* --------------------------------------------------------------- Combo --- */

/** Bars on the left axis (e.g. revenue) with a line on the right axis (e.g. eCPM). */
export const NimbusComboChart = ({
    data,
    xKey,
    bar,
    line,
    barFmt = "usd",
    lineFmt = "usd2",
    height = 300,
}: {
    data: Row[];
    xKey: string;
    bar: SeriesDef;
    line: SeriesDef;
    barFmt?: Fmt;
    lineFmt?: Fmt;
    height?: number;
}) => (
    <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                <CartesianGrid {...grid} />
                <XAxis dataKey={xKey} {...axis} minTickGap={24} />
                <YAxis yAxisId="bar" {...axis} width={56} tickFormatter={(v: number) => format(v, barFmt)} />
                <YAxis yAxisId="line" orientation="right" {...axis} width={48} tickFormatter={(v: number) => format(v, lineFmt)} domain={["auto", "auto"]} />
                <Tooltip cursor={barCursor} content={<NimbusTooltip fmt={{ [bar.key]: barFmt, [line.key]: lineFmt }} />} />
                <Bar yAxisId="bar" dataKey={bar.key} fill={bar.color ?? nimbus.teal} radius={[4, 4, 0, 0]} maxBarSize={18} isAnimationActive={false} />
                <Line yAxisId="line" type="monotone" dataKey={line.key} stroke={line.color ?? nimbus.pink} strokeWidth={2.5} dot={false} activeDot={activeDot(line.color ?? nimbus.pink)} isAnimationActive={false} />
            </ComposedChart>
        </ResponsiveContainer>
    </div>
);
