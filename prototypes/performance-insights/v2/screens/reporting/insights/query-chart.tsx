import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axis } from "../../campaign-series";
import { ChartTooltip } from "../../campaign-ui";
import { PINK, TEAL } from "../../das-shell";
import { dayLabel } from "../../sample-data";
import {
    ADDITIVE,
    type ChartKind,
    type Interval,
    type Metric,
    type ReportRow,
    type Totals,
    UNIT,
    type Unit,
    axisTick,
    formatMetric,
    fullDate,
    metricOf,
    sumTotals,
} from "./insights-data";

/**
 * The New Query chart: the same report as the table, drawn as Line, Area, Bar, Stacked Bar
 * or Pie. With no breakdown each ticked metric is a series; counts and money take the left
 * axis and rates the right, so Requests and CTR read together as on staging. With a
 * breakdown the first ticked metric is drawn per value, the largest six and "Other".
 */

const COLORS = [TEAL, PINK, "#2E5AAC", "#854A0E", "#7F56D9", "#F79009"];
const OTHER = "#98A2B3";
const MAX_SERIES = COLORS.length;

interface Series {
    key: string;
    metric: Metric;
    color: string;
    axis: "left" | "right";
}

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const tick = (interval: Interval, p: string) => (interval === "month" ? `${MONTH_NAMES[Number(p.slice(5, 7)) - 1]} ${p.slice(0, 4)}` : dayLabel(p));
const title = (interval: Interval, p: string) => (interval === "month" ? tick(interval, p) : interval === "week" ? `Week of ${fullDate(p)}` : fullDate(p));

export const QueryChart = ({
    rows,
    metrics,
    hasBreakdown,
    chart,
    interval,
    showLegend,
    dualAxis,
    comparePrev,
    height = "h-[28rem]",
}: {
    rows: ReportRow[];
    metrics: Metric[];
    hasBreakdown: boolean;
    chart: Exclude<ChartKind, "table">;
    interval: Interval;
    showLegend: boolean;
    /** Round 2 · C10: two metrics compared always take an axis each, even in the same unit. */
    dualAxis?: boolean;
    /** Round 2 · C16: each line drawn again, faded and dashed, for the previous period (rows carry `prev`). */
    comparePrev?: boolean;
    /** The plot's height class. */
    height?: string;
}) => {
    const periods = [...new Set(rows.map((r) => r.period))].reverse();
    const comboKeys = [...new Set(rows.map((r) => r.combo.key))];
    const byCombo = (key: string) => rows.filter((r) => r.combo.key === key);
    const top = comboKeys.slice(0, MAX_SERIES);
    const rest = comboKeys.slice(MAX_SERIES);
    // The grey seventh series is "Other" when it folds several values, else that one value.
    const otherKey = rest.length === 1 ? rest[0] : "Other";

    /* -------- series -------- */

    const series: Series[] = hasBreakdown
        ? [
              ...top.map((key, i) => ({ key, metric: metrics[0], color: COLORS[i], axis: "left" as const })),
              ...(rest.length ? [{ key: otherKey, metric: metrics[0], color: OTHER, axis: "left" as const }] : []),
          ]
        : metrics.slice(0, MAX_SERIES).map((m, i) => ({ key: m, metric: m, color: COLORS[i], axis: "left" as const }));
    const leftUnit: Unit = UNIT[series[0].metric];
    for (const s of series) s.axis = UNIT[s.metric] === leftUnit ? "left" : "right";
    if (dualAxis && !hasBreakdown && series.length === 2) series[1].axis = "right";
    const rightUnit = series.find((s) => s.axis === "right") ? UNIT[series.find((s) => s.axis === "right")!.metric] : undefined;

    const cell = (period: string, keys: string[]): Totals => sumTotals(rows.filter((r) => r.period === period && keys.includes(r.combo.key)).map((r) => r.t));
    const prevCell = (period: string, keys: string[]): Totals =>
        sumTotals(rows.filter((r) => r.period === period && keys.includes(r.combo.key) && r.prev).map((r) => r.prev!));
    const withPrev = Boolean(comparePrev) && chart === "line" && rows.some((r) => r.prev);
    const PREV = " · previous";
    const data = periods.map((p) => {
        const row: Record<string, string | number> = { period: p };
        if (hasBreakdown) {
            top.forEach((key) => (row[key] = metricOf(metrics[0], cell(p, [key]))));
            if (rest.length) row[otherKey] = metricOf(metrics[0], cell(p, rest));
            if (withPrev) {
                top.forEach((key) => (row[key + PREV] = metricOf(metrics[0], prevCell(p, [key]))));
                if (rest.length) row[otherKey + PREV] = metricOf(metrics[0], prevCell(p, rest));
            }
        } else {
            const t = cell(p, comboKeys);
            series.forEach((s) => (row[s.key] = metricOf(s.metric, t)));
            if (withPrev) {
                const pt = prevCell(p, comboKeys);
                series.forEach((s) => (row[s.key + PREV] = metricOf(s.metric, pt)));
            }
        }
        return row;
    });

    const metricFor = (name: string) => series.find((s) => s.key === name.replace(PREV, ""))?.metric ?? metrics[0];
    const tooltip = <ChartTooltip format={(v, name) => formatMetric(metricFor(name), v)} title={(p) => title(interval, p)} />;
    const xAxis = (
        <XAxis
            dataKey="period"
            {...axis}
            padding={chart === "line" || chart === "area" ? { left: 32, right: 32 } : undefined}
            tickFormatter={(p: string) => tick(interval, p)}
            interval={Math.max(0, Math.ceil(periods.length / 8) - 1)}
        />
    );
    const yAxes = (
        <>
            <YAxis yAxisId="left" {...axis} width={72} tickFormatter={(v: number) => axisTick(leftUnit, v)} />
            {rightUnit && <YAxis yAxisId="right" orientation="right" {...axis} width={72} tickFormatter={(v: number) => axisTick(rightUnit, v)} />}
        </>
    );
    const grid = <CartesianGrid vertical={false} yAxisId="left" className="[&_line]:stroke-border-secondary" />;
    const margin = { top: 8, right: 8, bottom: 0, left: 0 };

    /* -------- pie -------- */

    const pieMetric = metrics.find((m) => ADDITIVE.includes(m));
    const pieData = (() => {
        if (!pieMetric) return [];
        if (hasBreakdown)
            return [
                ...top.map((key, i) => ({ name: key, value: metricOf(pieMetric, sumTotals(byCombo(key).map((r) => r.t))), color: COLORS[i] })),
                ...(rest.length ? [{ name: otherKey, value: metricOf(pieMetric, sumTotals(rest.flatMap(byCombo).map((r) => r.t))), color: OTHER }] : []),
            ];
        const newest = [...periods].reverse();
        const slices = newest
            .slice(0, MAX_SERIES)
            .map((p, i) => ({ name: tick(interval, p), value: metricOf(pieMetric, cell(p, comboKeys)), color: COLORS[i] }));
        const older = newest.slice(MAX_SERIES);
        return older.length
            ? [
                  ...slices,
                  {
                      name: older.length === 1 ? tick(interval, older[0]) : "Other",
                      value: metricOf(pieMetric, sumTotals(older.map((p) => cell(p, comboKeys)))),
                      color: OTHER,
                  },
              ]
            : slices;
    })();

    const body = (() => {
        if (chart === "line")
            return (
                <LineChart data={data} margin={margin}>
                    {grid}
                    {xAxis}
                    {yAxes}
                    <Tooltip content={tooltip} />
                    {series.map((s) => (
                        <Line key={s.key} yAxisId={s.axis} dataKey={s.key} stroke={s.color} strokeWidth={2.5} dot={false} isAnimationActive={false} />
                    ))}
                    {withPrev &&
                        series.map((s) => (
                            <Line
                                key={s.key + PREV}
                                yAxisId={s.axis}
                                dataKey={s.key + PREV}
                                stroke={s.color}
                                strokeOpacity={0.45}
                                strokeDasharray="6 5"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        ))}
                </LineChart>
            );
        if (chart === "area")
            return (
                <AreaChart data={data} margin={margin}>
                    {grid}
                    {xAxis}
                    {yAxes}
                    <Tooltip content={tooltip} />
                    {/* The first series draws last, so its fill sits on top. */}
                    {[...series].reverse().map((s) => (
                        <Area
                            key={s.key}
                            yAxisId={s.axis}
                            dataKey={s.key}
                            stroke={s.color}
                            fill={s.color}
                            fillOpacity={0.15}
                            strokeWidth={2.5}
                            isAnimationActive={false}
                        />
                    ))}
                </AreaChart>
            );
        if (chart === "bar" || chart === "stacked")
            return (
                <BarChart data={data} margin={margin}>
                    {grid}
                    {xAxis}
                    {yAxes}
                    <Tooltip content={tooltip} cursor={{ fill: "#F2F4F7" }} />
                    {series.map((s) => (
                        <Bar
                            key={s.key}
                            yAxisId={s.axis}
                            dataKey={s.key}
                            fill={s.color}
                            // Rates don't add up, so only counts and money stack.
                            stackId={chart === "stacked" && UNIT[s.metric] !== "pct" ? s.axis : undefined}
                            maxBarSize={56}
                            isAnimationActive={false}
                        />
                    ))}
                </BarChart>
            );
        return (
            <PieChart>
                <Tooltip content={<ChartTooltip format={(v) => (pieMetric ? formatMetric(pieMetric, v) : String(v))} />} />
                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius="45%" outerRadius="80%" paddingAngle={1} isAnimationActive={false}>
                    {pieData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                    ))}
                </Pie>
            </PieChart>
        );
    })();

    const legend = chart === "pie" ? pieData.map((d) => ({ key: d.name, color: d.color })) : series.map((s) => ({ key: s.key, color: s.color }));
    const uncharted = hasBreakdown ? 0 : Math.max(0, metrics.length - MAX_SERIES);

    if (chart === "pie" && !pieMetric)
        return (
            <p className="rounded-xl border border-dashed border-secondary px-6 py-10 text-center text-md text-tertiary">
                Pie charts show metrics that add up: Requests, Wins, Impressions, Revenue or Clicks.
            </p>
        );

    return (
        <div className="flex flex-col gap-4">
            {chart === "pie" && <h3 className="text-lg font-extrabold text-primary">{pieMetric}</h3>}
            <div className={height}>
                <ResponsiveContainer width="100%" height="100%">
                    {body}
                </ResponsiveContainer>
            </div>
            {showLegend && (
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-md text-tertiary">
                    {legend.map((l) => (
                        <span key={l.key} className="inline-flex items-center gap-2">
                            <span className="size-3 rounded-full" style={{ backgroundColor: l.color }} aria-hidden="true" />
                            {l.key}
                        </span>
                    ))}
                    {withPrev && (
                        <span className="inline-flex items-center gap-2">
                            <svg width="22" height="4" aria-hidden="true">
                                <line x1="0" y1="2" x2="22" y2="2" stroke="#98A2B3" strokeWidth="2" strokeDasharray="5 4" />
                            </svg>
                            Previous period
                        </span>
                    )}
                    {uncharted > 0 && <span>+{uncharted} more in Table</span>}
                </div>
            )}
        </div>
    );
};
