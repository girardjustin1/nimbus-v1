import { useMemo, useState } from "react";
import { SearchLg } from "@untitledui/icons";
import { Bar, CartesianGrid, ComposedChart, Line, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { downloadCsv } from "../../batch-data";
import { axis } from "../../campaign-series";
import { ChartTooltip, StatChip } from "../../campaign-ui";
import { DasShell } from "../../das-shell";
import {
    Bands,
    BareSelect,
    ChartTypeBar,
    type ChartTypeOption,
    DEFAULT_CHART_ICONS,
    DateCell,
    DateRow,
    FilterControl,
    type FilterState,
    REPORT_STRIPE,
    SortTh,
    StateAction,
    TABLE,
    TEAL_DARK,
    TOTAL_CELL,
    TOTAL_ROW,
    filterExcluded,
    tableHead,
} from "../../nimbus-ui";
import { R1 } from "../../round-1";
import { dayLabel } from "../../sample-data";
import { StatLookContext } from "../../stat-look";
import { useTableSort } from "../../table-sort";
import {
    ACTIVITY,
    COLUMN_LABEL,
    DASHED,
    FILTER_DIMS,
    GROUP_OPTIONS,
    METRIC_COLOR,
    RANGE_OPTIONS,
    RT_METRICS,
    RT_PLATFORMS,
    type RtGroup,
    type RtMetric,
    type RtPlatform,
    type RtRange,
    type RtRow,
    type RtUnit,
    UNIT,
    cellDate,
    daysIn,
    formatAxis,
    formatFull,
    formatTile,
    longDate,
    metricOf,
    ordered as orderMetrics,
    platformColor,
    rtRows,
    sumAll,
    tint,
} from "./dashboard-data";

/**
 * Reporting · realtime dashboard — one publisher's last days at a glance.
 *
 * Staging's page on the Performance Insights pieces: the date row (START DATE / END DATE,
 * range, interval, UTC note, Download .CSV), the metric checkboxes with Show Activity, a
 * row for Totals Only, Platform and Filters with the chart / table switch, the flat
 * summary tiles, a combo chart (revenue as stacked bars by platform, the other metrics as
 * lines on their own axes, as staging draws it), then a searchable, sortable report.
 *
 * v2 · Round 1: R1-05 / R1-06 the metric blocks, R1-11 the row heights, R1-12 the row
 * labels, R1-13 the check box text, R1-08 the totals row (values in ../../round-1).
 */

export type RealtimeView = "chart" | "table";

const VIEWS: ChartTypeOption<RealtimeView>[] = [
    { id: "chart", label: "Chart", icon: DEFAULT_CHART_ICONS.bar },
    { id: "table", label: "Table", icon: DEFAULT_CHART_ICONS.table },
];

/** Staging's checkboxes on first load. */
const DEFAULT_METRICS: RtMetric[] = ["Revenue", "Requests", "Impressions", "ECPM"];

/** Axes by unit: revenue on the left, the rest on the right (money nearest the plot, as staging), only those in use. */
const AXIS_ORDER: RtUnit[] = ["revenue", "price", "rate", "count"];
/** Recharts stacks right-hand axes by id, so the id carries the order. */
const axisId = (u: RtUnit) => `${AXIS_ORDER.indexOf(u)}-${u}`;

const Dot = ({ color, square }: { color: string; square?: boolean }) => (
    <span className={cx("inline-block size-2.5 shrink-0", square ? "rounded-[2px]" : "rounded-full")} style={{ backgroundColor: color }} aria-hidden="true" />
);

export const RealtimeDashboard = ({ view: initialView = "chart", totalsOnly: initialTotals = false }: { view?: RealtimeView; totalsOnly?: boolean }) => {
    const [range, setRange] = useState<RtRange>("7");
    const [group, setGroup] = useState<RtGroup>("day");
    const [metrics, setMetrics] = useState<RtMetric[]>(DEFAULT_METRICS);
    const [activity, setActivity] = useState(false);
    const [totalsOnly, setTotalsOnly] = useState(initialTotals);
    const [platforms, setPlatforms] = useState<RtPlatform[]>([...RT_PLATFORMS]);
    const [filters, setFilters] = useState<FilterState>({});
    const [view, setView] = useState<RealtimeView>(initialView);
    const [query, setQuery] = useState("");

    const days = daysIn(range);
    const excluded = useMemo(() => filterExcluded(FILTER_DIMS, filters), [filters]);
    const rows = useMemo(() => rtRows({ range, group, platforms, excluded, totalsOnly }), [range, group, platforms, excluded, totalsOnly]);
    const byPlatform = useMemo(() => rtRows({ range, group: "day", platforms, excluded, totalsOnly: false }), [range, platforms, excluded]);
    const shownMetrics = orderMetrics(metrics);
    // Staging lists Android above iPhone wherever the two sit together.
    const platformsShown = [...platforms].sort((a, b) => a.localeCompare(b));
    const series = totalsOnly ? ["Total"] : platformsShown;

    const toggleMetric = (m: RtMetric) => setMetrics((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));
    // A platform can't be unticked down to none.
    const togglePlatform = (p: RtPlatform) => setPlatforms((cur) => (cur.includes(p) ? (cur.length > 1 ? cur.filter((x) => x !== p) : cur) : [...cur, p]));

    /* -------- table -------- */

    const q = query.trim().toLowerCase();
    const searched = q ? rows.filter((r) => r.date.includes(q) || r.platform.toLowerCase().includes(q)) : rows;
    const total = sumAll(searched);
    const table = useTableSort<RtRow>(searched, (r, id) => (id === "date" ? r.date : id === "platform" ? r.platform : metricOf(id as RtMetric, r)));
    const grouped = !table.sort && !totalsOnly;
    const dateText = (iso: string) => (group === "week" ? `Week of ${iso}` : iso);

    const exportCsv = () =>
        downloadCsv(
            "realtime-dashboard",
            ["Date", ...(totalsOnly ? [] : ["Platform"]), ...shownMetrics.map((m) => COLUMN_LABEL[m] ?? m)],
            rows.map((r) => [
                dateText(r.date),
                ...(totalsOnly ? [] : [r.platform]),
                ...shownMetrics.map((m) => metricOf(m, r).toFixed(UNIT[m] === "count" ? 0 : 2)),
            ]),
        );

    /* -------- chart -------- */

    const buckets = [...new Set(rows.map((r) => r.date))].sort();
    const labelOf = (iso: string) => (group === "week" ? `Week of ${dayLabel(iso)}` : dayLabel(iso));
    const titleOf = new Map(buckets.map((iso) => [labelOf(iso), group === "week" ? `Week of ${longDate(iso)}` : longDate(iso)]));
    const chartData = buckets.map((iso) => {
        const point: Record<string, string | number> = { label: labelOf(iso) };
        for (const r of rows.filter((x) => x.date === iso))
            for (const m of shownMetrics) point[totalsOnly ? m : `${m} · ${r.platform}`] = +metricOf(m, r).toFixed(UNIT[m] === "count" ? 0 : 4);
        return point;
    });
    const units = AXIS_ORDER.filter((u) => shownMetrics.some((m) => UNIT[m] === u));
    const lineMetrics = shownMetrics.filter((m) => m !== "Revenue");
    const seriesName = (m: RtMetric, p: string) => (totalsOnly ? m : `${m} · ${p}`);
    const colorOf = (m: RtMetric, p: string) => (totalsOnly ? METRIC_COLOR[m] : platformColor(m, p));
    // Revenue bars are drawn lighter than the lines so the lines stay readable; its tile dots match the bars.
    const barColor = (p: string) => tint(colorOf("Revenue", p), 0.45);
    const metricOfName = (name: string) => RT_METRICS.find((m) => name === m || name.startsWith(`${m} · `)) ?? "Revenue";
    const marks = group === "day" ? ACTIVITY.filter((a) => days.includes(a.day)) : [];

    /* -------- tiles -------- */

    const tileTotals = sumAll(byPlatform);
    const platformTotals = platformsShown.map((p) => ({ p, t: sumAll(byPlatform.filter((r) => r.platform === p)) }));

    return (
        <DasShell navKey="realtime dashboard" account="publisher">
            <div className="flex flex-col px-8 pb-8">
                <Bands className="border-t-0">
                    <DateRow
                        trailing={
                            <>
                                <span className="text-md font-semibold text-tertiary">All reports are in UTC.</span>
                                <StateAction disabled={shownMetrics.length === 0} onPress={exportCsv}>
                                    Download .CSV
                                </StateAction>
                            </>
                        }
                    >
                        <DateCell label="Start date">{cellDate(days[0])}</DateCell>
                        <DateCell label="End date">{cellDate(days[days.length - 1])}</DateCell>
                        {/* The pickers run a little narrower than BareSelect's default so the UTC note and
                            Download .CSV stay on the date row at 1440px, as on staging. */}
                        <div className="flex [&>label:first-child]:w-44 [&>label:last-child]:w-40">
                            <BareSelect label="Date range" value={range} options={RANGE_OPTIONS} onChange={setRange} />
                            <BareSelect label="Interval" value={group} options={GROUP_OPTIONS} onChange={setGroup} />
                        </div>
                    </DateRow>

                    {/* R1-11: staging's 42px checkbox row. R1-13: its check box text. */}
                    <div className="flex flex-wrap items-stretch" style={{ minHeight: R1.checkboxRowHeight }}>
                        <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-1 px-8 [&>label]:gap-2">
                            {RT_METRICS.map((m) => (
                                <Checkbox
                                    key={m}
                                    size="md"
                                    label={<span style={R1.checkboxText}>{m}</span>}
                                    isSelected={metrics.includes(m)}
                                    onChange={() => toggleMetric(m)}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-3 border-l border-secondary px-6">
                            <span style={R1.showActivityLabel}>Show Activity:</span>
                            <Toggle size="sm" aria-label="Show Activity" isSelected={activity} onChange={setActivity} />
                        </div>
                    </div>

                    {/* R1-11: staging's 43px row. R1-12: its section labels. */}
                    <div className="flex flex-wrap items-stretch" style={{ minHeight: R1.filterRowHeight }}>
                        <div className="flex items-center gap-3 border-r border-secondary pr-6 pl-8">
                            <span style={R1.filterLabel}>Totals Only</span>
                            <Toggle size="sm" aria-label="Totals Only" isSelected={totalsOnly} onChange={setTotalsOnly} />
                        </div>
                        <div className="flex items-center gap-6 border-r border-secondary px-6">
                            <span style={R1.filterLabel}>Platform</span>
                            {RT_PLATFORMS.map((p) => (
                                <Checkbox
                                    key={p}
                                    size="md"
                                    label={<span style={R1.checkboxText}>{p}</span>}
                                    isSelected={platforms.includes(p)}
                                    onChange={() => togglePlatform(p)}
                                />
                            ))}
                        </div>
                        <div className="flex min-w-0 flex-1 items-center gap-6 px-6 py-1.5">
                            <span style={R1.filterLabel}>Filters:</span>
                            <div className="min-w-0 flex-1">
                                <FilterControl dims={FILTER_DIMS} value={filters} onChange={setFilters} />
                            </div>
                        </div>
                        <div className="border-l border-secondary">
                            {/* R1-11: the switch takes the row's height instead of setting its own (staging's row is 43px). */}
                            <ChartTypeBar options={VIEWS} value={view} onChange={setView} className="h-full [&_[role=radio]]:py-0" />
                        </div>
                    </div>
                </Bands>

                {shownMetrics.length === 0 ? (
                    <p className="py-8 text-md text-tertiary">Select at least one metric.</p>
                ) : (
                    <>
                        <StatLookContext.Provider value="flat">
                            <div className="flex flex-wrap gap-x-6 gap-y-4 py-6">
                                {shownMetrics.map((m) => (
                                    <StatChip
                                        key={m}
                                        label={
                                            <span className="inline-flex items-center gap-2">
                                                <Dot color={m === "Revenue" ? barColor("Total") : METRIC_COLOR[m]} square={m === "Revenue"} />
                                                {m}
                                            </span>
                                        }
                                        sub={
                                            totalsOnly ? undefined : (
                                                <span className="flex flex-col">
                                                    {platformTotals.map(({ p, t }) => (
                                                        // R1-06: the platform in the tab label style at regular weight, its number bold.
                                                        <span key={p} className="inline-flex items-center gap-2">
                                                            <Dot color={m === "Revenue" ? barColor(p) : platformColor(m, p)} square={m === "Revenue"} />
                                                            <span style={R1.rtPlatformLabel}>{p}</span>
                                                            <span style={R1.rtPlatformValue}>{formatTile(m, metricOf(m, t))}</span>
                                                        </span>
                                                    ))}
                                                </span>
                                            )
                                        }
                                    >
                                        {formatTile(m, metricOf(m, tileTotals))}
                                    </StatChip>
                                ))}
                            </div>
                        </StatLookContext.Provider>

                        {view === "chart" && (
                            <div className="h-[30rem] pb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart data={chartData} margin={{ top: 24, right: 0, bottom: 0, left: 0 }} barCategoryGap="30%">
                                        <CartesianGrid vertical={false} yAxisId={axisId(units[0])} className="[&_line]:stroke-border-secondary" />
                                        <XAxis dataKey="label" {...axis} />
                                        {units.map((u) => (
                                            <YAxis
                                                key={u}
                                                yAxisId={axisId(u)}
                                                {...axis}
                                                orientation={u === "revenue" ? "left" : "right"}
                                                width={u === "revenue" ? 72 : 64}
                                                tick={{ ...axis.tick, fill: u === "revenue" ? TEAL_DARK : axis.tick.fill }}
                                                tickFormatter={(v: number) => formatAxis(u, v)}
                                            />
                                        ))}
                                        <Tooltip
                                            cursor={{ fill: "#F2F4F7" }}
                                            content={
                                                <ChartTooltip
                                                    title={(label) => titleOf.get(label) ?? label}
                                                    format={(v, name) => formatFull(metricOfName(name), v)}
                                                />
                                            }
                                        />
                                        {shownMetrics.includes("Revenue") &&
                                            [...series]
                                                .reverse()
                                                .map((p) => (
                                                    <Bar
                                                        key={p}
                                                        yAxisId={axisId("revenue")}
                                                        dataKey={seriesName("Revenue", p)}
                                                        stackId="revenue"
                                                        fill={barColor(p)}
                                                        isAnimationActive={false}
                                                    />
                                                ))}
                                        {lineMetrics.flatMap((m) =>
                                            series.map((p) => (
                                                <Line
                                                    key={seriesName(m, p)}
                                                    yAxisId={axisId(UNIT[m])}
                                                    dataKey={seriesName(m, p)}
                                                    stroke={colorOf(m, p)}
                                                    strokeWidth={2}
                                                    strokeDasharray={DASHED.includes(m) ? "6 4" : undefined}
                                                    dot={false}
                                                    activeDot={{ r: 5 }}
                                                    isAnimationActive={false}
                                                />
                                            )),
                                        )}
                                        {activity &&
                                            marks.map((a) => (
                                                <ReferenceLine
                                                    key={a.day}
                                                    yAxisId={axisId(units[0])}
                                                    x={dayLabel(a.day)}
                                                    stroke="#667085"
                                                    strokeDasharray="3 3"
                                                    label={{ value: a.label, position: "top", fontSize: 15, fill: "#475467" }}
                                                />
                                            ))}
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <Input
                                aria-label="Search"
                                size="md"
                                icon={SearchLg}
                                placeholder="Search"
                                wrapperClassName="w-80"
                                value={query}
                                onChange={setQuery}
                            />
                            <div className={TABLE.bleed}>
                                <table className={TABLE.table}>
                                    <thead style={tableHead("report")}>
                                        <tr>
                                            <SortTh id="date" kind="report" sort={table.sort} onSort={table.onSort}>
                                                Date
                                            </SortTh>
                                            {!totalsOnly && (
                                                <SortTh id="platform" kind="report" sort={table.sort} onSort={table.onSort}>
                                                    Platform
                                                </SortTh>
                                            )}
                                            {shownMetrics.map((m) => (
                                                <SortTh key={m} id={m} kind="report" align="right" sort={table.sort} onSort={table.onSort}>
                                                    {COLUMN_LABEL[m] ?? m}
                                                </SortTh>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((r, i) => {
                                            const first = i === 0 || table.rows[i - 1].date !== r.date;
                                            return (
                                                <tr
                                                    key={`${r.date}|${r.platform}`}
                                                    className={cx(grouped && first && i > 0 && "border-t-2 border-secondary")}
                                                    style={i % 2 === 1 ? { backgroundColor: REPORT_STRIPE } : undefined}
                                                >
                                                    <td className={cx(TABLE.report.td, "text-secondary tabular-nums")}>
                                                        {!grouped || first ? dateText(r.date) : ""}
                                                    </td>
                                                    {!totalsOnly && <td className={cx(TABLE.report.td, "text-secondary")}>{r.platform}</td>}
                                                    {shownMetrics.map((m) => (
                                                        <td
                                                            key={m}
                                                            className={cx(
                                                                TABLE.report.td,
                                                                "text-right tabular-nums",
                                                                m === "Revenue" ? "font-bold" : "text-secondary",
                                                            )}
                                                            style={m === "Revenue" ? { color: TEAL_DARK } : undefined}
                                                        >
                                                            {formatFull(m, metricOf(m, r))}
                                                        </td>
                                                    ))}
                                                </tr>
                                            );
                                        })}
                                        {table.rows.length === 0 && (
                                            <tr>
                                                <td colSpan={shownMetrics.length + 2} className={cx(TABLE.report.td, "text-tertiary")}>
                                                    No rows match “{query}”.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                    <tfoot style={TOTAL_ROW}>
                                        <tr>
                                            <td colSpan={totalsOnly ? 1 : 2} className={cx(TABLE.report.td, "uppercase")} style={TOTAL_CELL}>
                                                Total
                                            </td>
                                            {shownMetrics.map((m) => (
                                                <td key={m} className={TABLE.report.td} style={TOTAL_CELL}>
                                                    {formatFull(m, metricOf(m, total))}
                                                </td>
                                            ))}
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DasShell>
    );
};
