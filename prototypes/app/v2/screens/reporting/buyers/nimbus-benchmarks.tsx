import { type ReactNode, useMemo, useState } from "react";
import { HelpCircle } from "@untitledui/icons";
import { Button as AriaButton, Tooltip as AriaTooltip, TooltipTrigger as AriaTooltipTrigger } from "react-aria-components";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { axis } from "../../campaign-series";
import { ChartTooltip, StatChip } from "../../campaign-ui";
import { DasShell, PINK } from "../../das-shell";
import { ROUTES } from "../../nav";
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
    PageTabs,
    REPORT_STRIPE,
    SortTh,
    TABLE,
    TEAL_DARK,
    TOTAL_CELL,
    TOTAL_ROW,
    tableHead,
} from "../../nimbus-ui";
import { dayLabel } from "../../sample-data";
import { StatLookContext } from "../../stat-look";
import { useTableSort } from "../../table-sort";
import { HEADLINE, LABEL } from "../../type-rules";
import {
    BENCH_COLOR,
    BENCH_FILTER_DIMS,
    BENCH_INTERVALS,
    BENCH_METRICS,
    BENCH_NAME,
    BENCH_RANGES,
    type BenchInterval,
    type BenchMetric,
    type BenchPoint,
    type BenchRange,
    DEFAULT_BENCH_METRICS,
    LEADER_FILTER_DIMS,
    LEADER_RANGES,
    type Leader,
    type LeaderRange,
    axisBench,
    benchAverage,
    benchSeries,
    ecpmLeaders,
    formatBench,
    leaderDates,
    longDate,
    rangeDays,
    shareOfVoice,
} from "./benchmark-data";
import { R1 } from "../../round-1";

/**
 * Reporting · Nimbus benchmarks (staging, 13 Nov: reference/111326 9.11.39 PM and 9.11.49 PM).
 *
 * Two tabs, each its own screen as on staging:
 *   Nimbus Performance  the publisher's eCPM, win rate and CTR beside the exchange's: a
 *                       date row (range, By Day), metric checkboxes, Filters with the
 *                       chart / table switch, paired tiles (Nimbus vs mine), the chart and
 *                       a sortable report table.
 *   Nimbus Leaderboard  "Top Performers in the Nimbus Exchange": Share of Voice and eCPM,
 *                       two ranked lists side by side.
 *
 * Staging draws every metric on one chart with a $ axis and a % axis. Here each ticked
 * metric gets its own small chart on one axis (dashed = Nimbus, solid = mine), so no line
 * is read against the wrong scale.
 */

const TABS = [
    { id: "performance", label: "Nimbus Performance", href: ROUTES.benchmarks },
    { id: "leaderboard", label: "Nimbus Leaderboard", href: ROUTES.leaderboard },
];

type PerfView = "line" | "table";
const VIEWS: ChartTypeOption<PerfView>[] = [
    { id: "line", label: "Line", icon: DEFAULT_CHART_ICONS.line },
    { id: "table", label: "Table", icon: DEFAULT_CHART_ICONS.table },
];

/** Filters band with the chart type switch at its right edge, filling the band's height. */
const FiltersBand = ({
    value,
    onChange,
    dims,
    trailing,
}: {
    value: FilterState;
    onChange: (f: FilterState) => void;
    dims: typeof BENCH_FILTER_DIMS;
    trailing?: ReactNode;
}) => (
    <div className="grid grid-cols-1 gap-x-6 px-8 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-stretch">
        <span className={cx(LABEL, "pt-4 md:flex md:items-center md:pt-0")}>Filters:</span>
        <div className="min-w-0 py-4">
            <FilterControl dims={dims} value={value} onChange={onChange} />
        </div>
        {trailing ? <div className="-mr-8 flex items-start justify-end border-l border-secondary">{trailing}</div> : <span className="hidden md:block" />}
    </div>
);

/** The tile's marker: hollow for Nimbus (the dashed line), filled for mine (the solid one). */
const Marker = ({ color, hollow }: { color: string; hollow?: boolean }) => (
    <span
        className="inline-block size-2.5 shrink-0 rounded-full"
        style={hollow ? { boxShadow: `inset 0 0 0 2px ${color}` } : { backgroundColor: color }}
        aria-hidden="true"
    />
);

const LineKey = ({ color, dashed, children }: { color: string; dashed?: boolean; children: ReactNode }) => (
    <span className="inline-flex items-center gap-2 text-md text-secondary">
        <svg width="24" height="4" aria-hidden="true">
            <line x1="0" y1="2" x2="24" y2="2" stroke={color} strokeWidth="2" strokeDasharray={dashed ? "5 4" : undefined} />
        </svg>
        {children}
    </span>
);

const pointLabel = (p: BenchPoint, interval: BenchInterval) => (interval === "day" ? dayLabel(p.interval) : `Week of ${dayLabel(p.interval)}`);

const MetricChart = ({ metric, points, interval }: { metric: BenchMetric; points: BenchPoint[]; interval: BenchInterval }) => {
    const color = BENCH_COLOR[metric];
    const name = BENCH_NAME[metric];
    const data = points.map((p) => ({ label: pointLabel(p, interval), Nimbus: +p.nimbus[metric].toFixed(4), Mine: +p.mine[metric].toFixed(4) }));
    return (
        <figure className="flex flex-col gap-3">
            <figcaption className="flex flex-col gap-1">
                <span className={cx("text-lg text-primary", HEADLINE)}>{name}</span>
                <span className="flex flex-wrap gap-x-5 gap-y-1">
                    <LineKey color={color}>My {name}</LineKey>
                    <LineKey color={color} dashed>
                        Nimbus {name}
                    </LineKey>
                </span>
            </figcaption>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 8, right: 28, bottom: 0, left: 0 }}>
                        <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                        <XAxis dataKey="label" {...axis} interval={Math.max(0, Math.ceil(data.length / 4) - 1)} />
                        <YAxis {...axis} width={64} domain={[0, "auto"]} tickFormatter={(v: number) => axisBench(metric, v)} />
                        <Tooltip content={<ChartTooltip format={(v) => formatBench(metric, v)} />} />
                        <Line dataKey="Mine" name={`My ${name}`} stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
                        <Line
                            dataKey="Nimbus"
                            name={`Nimbus ${name}`}
                            stroke={color}
                            strokeWidth={2}
                            strokeDasharray="6 5"
                            dot={false}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </figure>
    );
};

export const NimbusPerformance = ({ empty = false }: { empty?: boolean }) => {
    const [range, setRange] = useState<BenchRange>("7");
    const [interval, setPeriod] = useState<BenchInterval>("day");
    const [metrics, setMetrics] = useState<BenchMetric[]>(DEFAULT_BENCH_METRICS);
    const [filters, setFilters] = useState<FilterState>({});
    const [view, setView] = useState<PerfView>("line");

    const filterKey = JSON.stringify(filters);
    const points = useMemo(() => benchSeries(range, interval, { empty, filterKey }), [range, interval, empty, filterKey]);
    const days = rangeDays(range);
    const ordered = BENCH_METRICS.filter((m) => metrics.includes(m));
    const table = useTableSort(
        points,
        (p, id) => (id === "interval" ? p.interval : id.startsWith("n:") ? p.nimbus[id.slice(2) as BenchMetric] : p.mine[id.slice(2) as BenchMetric]),
        { id: "interval", dir: -1 },
    );
    const toggle = (m: BenchMetric) => setMetrics((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

    return (
        <DasShell navKey="nimbus benchmarks" account="publisher">
            <PageTabs tabs={TABS} active="performance" />
            <div className="flex flex-col gap-8 px-8 pb-12">
                <Bands className="border-t-0">
                    <DateRow>
                        <DateCell label="Start date">{longDate(days[0])}</DateCell>
                        <DateCell label="End date">{longDate(days[days.length - 1])}</DateCell>
                        <BareSelect label="Date range" value={range} onChange={setRange} options={BENCH_RANGES} />
                        <BareSelect label="Interval" value={interval} onChange={setPeriod} options={BENCH_INTERVALS} />
                    </DateRow>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-8 py-4">
                        {BENCH_METRICS.map((m) => (
                            <Checkbox
                                key={m}
                                size="md"
                                label={<span style={R1.checkboxText}>{m}</span>}
                                isSelected={metrics.includes(m)}
                                onChange={() => toggle(m)}
                            />
                        ))}
                    </div>
                    <FiltersBand
                        dims={BENCH_FILTER_DIMS}
                        value={filters}
                        onChange={setFilters}
                        trailing={<ChartTypeBar options={VIEWS} value={view} onChange={setView} />}
                    />
                </Bands>

                {ordered.length === 0 ? (
                    <p className="text-md text-tertiary">Select at least one metric.</p>
                ) : (
                    <>
                        <StatLookContext.Provider value="flat">
                            <div className="flex flex-wrap gap-x-6 gap-y-4">
                                {ordered.map((m) => (
                                    <div key={m} className="flex gap-6 border-l border-secondary pl-4">
                                        <StatChip
                                            className="border-l-0 pl-0"
                                            label={
                                                <span className="inline-flex items-center gap-2">
                                                    <Marker color={BENCH_COLOR[m]} hollow /> Nimbus {BENCH_NAME[m]}
                                                </span>
                                            }
                                        >
                                            {formatBench(m, benchAverage(points, "nimbus", m))}
                                        </StatChip>
                                        <StatChip
                                            className="border-l-0 pl-0"
                                            label={
                                                <span className="inline-flex items-center gap-2">
                                                    <Marker color={BENCH_COLOR[m]} /> My {BENCH_NAME[m]}
                                                </span>
                                            }
                                        >
                                            {formatBench(m, benchAverage(points, "mine", m))}
                                        </StatChip>
                                    </div>
                                ))}
                            </div>
                        </StatLookContext.Provider>

                        {view === "line" && (
                            <div className="grid grid-cols-1 gap-x-10 gap-y-10 lg:grid-cols-2 xl:grid-cols-3">
                                {ordered.map((m) => (
                                    <MetricChart key={m} metric={m} points={points} interval={interval} />
                                ))}
                            </div>
                        )}

                        <div className={TABLE.bleed}>
                            <table className={TABLE.table}>
                                <thead style={tableHead("report")}>
                                    <tr>
                                        <SortTh id="interval" kind="report" sort={table.sort} onSort={table.onSort}>
                                            Interval
                                        </SortTh>
                                        {ordered.flatMap((m) => [
                                            <SortTh key={`n:${m}`} id={`n:${m}`} kind="report" align="right" sort={table.sort} onSort={table.onSort}>
                                                Nimbus {BENCH_NAME[m]}
                                            </SortTh>,
                                            <SortTh key={`m:${m}`} id={`m:${m}`} kind="report" align="right" sort={table.sort} onSort={table.onSort}>
                                                {BENCH_NAME[m]}
                                            </SortTh>,
                                        ])}
                                    </tr>
                                </thead>
                                <tbody>
                                    {table.rows.map((p, i) => (
                                        <tr key={p.interval} style={i % 2 === 1 ? { backgroundColor: REPORT_STRIPE } : undefined}>
                                            <td className={cx(TABLE.report.td, "tabular-nums")}>{interval === "day" ? p.interval : `Week of ${p.interval}`}</td>
                                            {ordered.flatMap((m) => [
                                                <td key={`n:${m}`} className={cx(TABLE.report.td, "text-right text-secondary tabular-nums")}>
                                                    {formatBench(m, p.nimbus[m])}
                                                </td>,
                                                <td key={`m:${m}`} className={cx(TABLE.report.td, "text-right tabular-nums")}>
                                                    {formatBench(m, p.mine[m])}
                                                </td>,
                                            ])}
                                        </tr>
                                    ))}
                                </tbody>
                                {/* R1-08: staging added this totals row in the Nov 18 release, in the shared total style. */}
                                <tfoot style={TOTAL_ROW}>
                                    <tr>
                                        <td className={cx(TABLE.report.td, "uppercase")} style={TOTAL_CELL}>
                                            Total
                                        </td>
                                        {ordered.flatMap((m) => [
                                            <td key={`n:${m}`} className={cx(TABLE.report.td, "text-right tabular-nums")} style={TOTAL_CELL}>
                                                {formatBench(m, benchAverage(points, "nimbus", m))}
                                            </td>,
                                            <td key={`m:${m}`} className={cx(TABLE.report.td, "text-right tabular-nums")} style={TOTAL_CELL}>
                                                {formatBench(m, benchAverage(points, "mine", m))}
                                            </td>,
                                        ])}
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </DasShell>
    );
};

/* ------------------------------------------------------------ Leaderboard --- */

const SOV_HELP = "Each demand partner's share of the impressions won across the Nimbus Exchange in the date range.";

const HelpTip = ({ text }: { text: string }) => (
    <AriaTooltipTrigger delay={200} closeDelay={0}>
        <AriaButton aria-label="What is Share of Voice?" className="inline-flex cursor-help rounded-full outline-focus-ring focus-visible:outline-2">
            <HelpCircle className="size-5" style={{ color: PINK }} aria-hidden="true" />
        </AriaButton>
        <AriaTooltip offset={6} placement="top" className="z-50">
            <div className="max-w-xs rounded-lg bg-primary-solid px-3 py-2.5 text-md text-white shadow-lg">{text}</div>
        </AriaTooltip>
    </AriaTooltipTrigger>
);

const RankedList = ({ title, help, items, color }: { title: string; help?: string; items: Leader[]; color: string }) => (
    <section className="flex flex-col gap-4">
        <h3 className={cx("flex items-center gap-2 text-xl text-primary", HEADLINE)}>
            {title}:{help && <HelpTip text={help} />}
        </h3>
        <ol className="divide-y divide-secondary border-b border-secondary">
            {items.map((x, i) => (
                <li key={x.name} className="grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-2 py-3 text-md">
                    <span className="text-right font-bold tabular-nums" style={{ color }}>
                        {i + 1}.
                    </span>
                    <span className="truncate text-secondary">{x.name}</span>
                    <span className="pr-2 font-bold tabular-nums" style={{ color }}>
                        {x.value}
                    </span>
                </li>
            ))}
        </ol>
    </section>
);

export const NimbusLeaderboard = () => {
    const [range, setRange] = useState<LeaderRange>("7");
    const [filters, setFilters] = useState<FilterState>({});
    const dates = leaderDates(range);
    const seed = `${range}:${JSON.stringify(filters)}`;
    const sov = useMemo(() => shareOfVoice(seed), [seed]);
    const ecpm = useMemo(() => ecpmLeaders(seed), [seed]);

    return (
        <DasShell navKey="nimbus benchmarks" account="publisher">
            <PageTabs tabs={TABS} active="leaderboard" />
            <div className="flex flex-col gap-8 px-8 pb-12">
                <Bands className="border-t-0">
                    <DateRow>
                        <DateCell label="Start date">{dates.start}</DateCell>
                        <DateCell label="End date">{dates.end}</DateCell>
                        <BareSelect label="Date range" value={range} onChange={setRange} options={LEADER_RANGES} />
                    </DateRow>
                    <FiltersBand dims={LEADER_FILTER_DIMS} value={filters} onChange={setFilters} />
                </Bands>

                <h2 className={cx("text-display-xs text-primary", HEADLINE)}>Top Performers in the Nimbus Exchange</h2>
                <div className="grid grid-cols-1 gap-y-10 md:grid-cols-2 md:divide-x md:divide-secondary">
                    <div className="md:pr-10">
                        <RankedList title="Share of Voice" help={SOV_HELP} items={sov} color="#2E5AAC" />
                    </div>
                    <div className="md:pl-10">
                        <RankedList title="eCPM" items={ecpm} color={TEAL_DARK} />
                    </div>
                </div>
            </div>
        </DasShell>
    );
};
