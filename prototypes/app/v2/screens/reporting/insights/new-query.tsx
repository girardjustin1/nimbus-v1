import { useMemo, useState } from "react";
import { XClose } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { readHashParams } from "../../../../../das/v1/screens/route";
import { downloadCsv } from "../../batch-data";
import { DasShell, PINK } from "../../das-shell";
import { ROUTES } from "../../nav";
import {
    Band,
    Bands,
    BareSelect,
    ChartTypeBar,
    type ChartTypeOption,
    CollapseButton,
    DEFAULT_CHART_ICONS,
    DateCell,
    DateRow,
    FilterControl,
    type FilterState,
    PageTabs,
    REPORT_STRIPE,
    SortTh,
    StateAction,
    TABLE,
    filterExcluded,
    tableHead,
} from "../../nimbus-ui";
import { useTableSort } from "../../table-sort";
import { LABEL } from "../../type-rules";
import {
    type ChartKind,
    DIMS,
    DIM_VALUES,
    type Dim,
    INTERVALS,
    type Interval,
    METRICS,
    type Metric,
    PI_TABS,
    RANGES,
    type Range,
    addSavedQuery,
    csvMetric,
    findQuery,
    formatMetric,
    longDate,
    metricOf,
    rangeDays,
    runQuery,
} from "./insights-data";
import { QueryChart } from "./query-chart";
import { R1 } from "../../round-1";

/**
 * Performance Insights · New Query — Nov 13 style guide, rebuilt from staging
 * (reference/111326, 9.10.54–9.11.20 PM) in Full performance's pieces: the date row with
 * START DATE / END DATE, range and interval, SAVE QUERY and DOWNLOAD .CSV; full-bleed bands
 * for Metrics (✕ clears them), Breakdown, Filters (+ ADD) and Compare; the chart type bar
 * with Totals Only (table) or Show legend (charts); then the report.
 *
 * Ticking a metric or breakdown adds its column; Collapse hides the bands. A saved query
 * opens here with its settings (`#/pi-query?q=<id>`).
 */

const CHART_TYPES: ChartTypeOption<ChartKind>[] = [
    { id: "table", label: "Table", icon: DEFAULT_CHART_ICONS.table },
    { id: "line", label: "Line", icon: DEFAULT_CHART_ICONS.line },
    { id: "area", label: "Area", icon: DEFAULT_CHART_ICONS.area },
    { id: "bar", label: "Bar", icon: DEFAULT_CHART_ICONS.bar },
    { id: "stacked", label: "Stacked Bar", icon: DEFAULT_CHART_ICONS.stacked },
    { id: "pie", label: "Pie", icon: DEFAULT_CHART_ICONS.pie },
];

const FILTER_DIMS = DIMS.map((d) => ({ id: d, label: d, values: DIM_VALUES[d] }));

export const NewQuery = ({
    chart: initialChart = "table",
    metrics: initialMetrics = ["Requests", "CTR"],
    breakdown: initialBreakdown = [],
}: {
    chart?: ChartKind;
    metrics?: Metric[];
    breakdown?: Dim[];
}) => {
    // A saved query opened from Saved Queries brings its own settings.
    const [opened] = useState(() => findQuery(readHashParams().get("q")));
    const [range, setRange] = useState<Range>(opened?.range ?? "7");
    const [interval, setInterval] = useState<Interval>(opened?.interval ?? "day");
    const [metrics, setMetrics] = useState<Metric[]>(opened?.metrics ?? initialMetrics);
    const [breakdown, setBreakdown] = useState<Dim[]>(opened?.breakdown ?? initialBreakdown);
    const [filters, setFilters] = useState<FilterState>({});
    const [compare, setCompare] = useState("");
    const [chart, setChart] = useState<ChartKind>(opened?.chart ?? initialChart);
    const [totalsOnly, setTotalsOnly] = useState(false);
    const [showLegend, setShowLegend] = useState(true);
    const [collapsed, setCollapsed] = useState(false);
    const [naming, setNaming] = useState(false);
    const [name, setName] = useState(opened?.name ?? "");
    const [savedAs, setSavedAs] = useState<string | null>(null);

    const ordered = METRICS.filter((m) => metrics.includes(m));
    const dims = useMemo(() => DIMS.filter((d) => breakdown.includes(d)), [breakdown]);
    const compareDays = Number(compare) > 0 ? Number(compare) : undefined;
    const excluded = useMemo(() => filterExcluded(FILTER_DIMS, filters) as Partial<Record<Dim, string[]>>, [filters]);
    const tableTotals = chart === "table" && totalsOnly;
    const rows = useMemo(
        () => runQuery({ range, interval, breakdown: dims, excluded, totalsOnly: tableTotals, compare: chart === "table" ? compareDays : undefined }),
        [range, interval, dims, excluded, tableTotals, compareDays, chart],
    );
    const days = rangeDays(range);

    const table = useTableSort(rows, (r, id) => {
        if (id === "date") return r.period;
        if (id.startsWith("d:")) return r.combo.values[Number(id.slice(2))];
        if (id.startsWith("p:")) return r.prev ? metricOf(id.slice(2) as Metric, r.prev) : undefined;
        return metricOf(id as Metric, r.t);
    });

    const toggleMetric = (m: Metric) => setMetrics((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));
    const toggleDim = (d: Dim) => setBreakdown((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));

    const prevLabel = (m: Metric) => `${m} (${compareDays} Days Ago)`;
    const exportCsv = () =>
        downloadCsv(
            "performance-insights",
            ["Date", ...dims, ...ordered, ...(compareDays ? ordered.map(prevLabel) : [])],
            table.rows.map((r) => [
                r.period,
                ...r.combo.values,
                ...ordered.map((m) => csvMetric(m, r.t)),
                ...(compareDays && r.prev ? ordered.map((m) => csvMetric(m, r.prev!)) : []),
            ]),
        );
    const save = () => {
        const q = addSavedQuery({ name: name.trim() || "Untitled query", range, interval, metrics: ordered, breakdown: dims, chart });
        setSavedAs(q.name);
        setNaming(false);
    };

    return (
        <DasShell navKey="performance insights" account="exchange">
            <PageTabs
                tabs={PI_TABS}
                active="query"
                trailing={
                    <>
                        <span className="text-md font-semibold text-tertiary">All reports are in UTC.</span>
                        <CollapseButton collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
                    </>
                }
            />
            <div className="flex flex-col px-8 pb-12">
                <Bands className="border-t-0">
                    {/* The quick pickers run a little narrower than the shared w-56, so SAVE QUERY
                        and DOWNLOAD .CSV stay on the date row at 1440px, as on staging. */}
                    <div className="[&_label]:w-44">
                        <DateRow
                            trailing={
                                <>
                                    <StateAction disabled={ordered.length === 0} onPress={() => setNaming(true)}>
                                        Save Query
                                    </StateAction>
                                    <StateAction disabled={ordered.length === 0} onPress={exportCsv}>
                                        Download .CSV
                                    </StateAction>
                                </>
                            }
                        >
                            <DateCell label="Start date">{longDate(days[0])}</DateCell>
                            <DateCell label="End date">{longDate(days[days.length - 1])}</DateCell>
                            <BareSelect label="Date range" value={range} onChange={setRange} options={RANGES} />
                            <BareSelect label="Interval" value={interval} onChange={setInterval} options={INTERVALS} />
                        </DateRow>
                    </div>

                    {naming && (
                        <Band label="Query Name">
                            <div className="flex flex-wrap items-center gap-3">
                                <Input aria-label="Query name" size="md" placeholder="Query name" value={name} onChange={setName} wrapperClassName="w-96" />
                                <StateAction quiet onPress={() => setNaming(false)}>
                                    Cancel
                                </StateAction>
                                <StateAction onPress={save}>Save</StateAction>
                            </div>
                        </Band>
                    )}
                    {savedAs && !naming && (
                        <div className="flex items-center gap-2 px-8 py-3 text-md text-secondary">
                            Saved “{savedAs}” to
                            <a href={ROUTES.piSaved} className="font-bold underline" style={{ color: PINK }}>
                                Saved Queries
                            </a>
                        </div>
                    )}

                    {!collapsed && (
                        <>
                            <Band
                                label="Metrics"
                                trailing={
                                    <span className="flex self-stretch border-l border-secondary pl-4">
                                        <button
                                            type="button"
                                            aria-label="Clear metrics"
                                            title="Clear metrics"
                                            onClick={() => setMetrics([])}
                                            className="rounded-md p-1 transition duration-100 ease-linear hover:bg-secondary"
                                            style={{ color: PINK }}
                                        >
                                            <XClose className="size-6" aria-hidden="true" />
                                        </button>
                                    </span>
                                }
                            >
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                    {METRICS.map((m) => (
                                        <Checkbox
                                            key={m}
                                            size="md"
                                            label={<span style={R1.checkboxText}>{m}</span>}
                                            isSelected={metrics.includes(m)}
                                            onChange={() => toggleMetric(m)}
                                        />
                                    ))}
                                </div>
                            </Band>

                            <Band label="Breakdown">
                                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                                    {DIMS.map((d) => (
                                        <Checkbox
                                            key={d}
                                            size="md"
                                            label={<span style={R1.checkboxText}>{d}</span>}
                                            isSelected={breakdown.includes(d)}
                                            onChange={() => toggleDim(d)}
                                        />
                                    ))}
                                </div>
                            </Band>

                            <Band label="Filters">
                                <FilterControl dims={FILTER_DIMS} value={filters} onChange={setFilters} />
                            </Band>

                            <Band label="Compare">
                                <div className="flex items-center gap-4">
                                    <div className="w-64 shrink-0">
                                        <Input
                                            aria-label="Compare to days ago"
                                            size="md"
                                            inputMode="numeric"
                                            value={compare}
                                            onChange={(v) => setCompare(v.replace(/\D/g, "").slice(0, 3))}
                                        />
                                    </div>
                                    <span className={cx(LABEL, "whitespace-nowrap")}>Days Ago</span>
                                </div>
                            </Band>

                            <Band
                                label="Chart Type"
                                flush
                                trailing={
                                    <span className="flex items-center gap-3 py-3">
                                        <span className={LABEL}>{chart === "table" ? "Totals Only" : "Show legend"}</span>
                                        <Toggle
                                            size="md"
                                            aria-label={chart === "table" ? "Totals Only" : "Show legend"}
                                            isSelected={chart === "table" ? totalsOnly : showLegend}
                                            onChange={chart === "table" ? setTotalsOnly : setShowLegend}
                                        />
                                    </span>
                                }
                            >
                                <ChartTypeBar options={CHART_TYPES} value={chart} onChange={setChart} />
                            </Band>
                        </>
                    )}
                </Bands>

                {ordered.length === 0 ? (
                    <p className="py-8 text-md text-tertiary">Select at least one metric.</p>
                ) : chart !== "table" ? (
                    <div className="py-8">
                        <QueryChart rows={rows} metrics={ordered} hasBreakdown={dims.length > 0} chart={chart} interval={interval} showLegend={showLegend} />
                    </div>
                ) : (
                    <div className={cx(TABLE.bleed, "border-t-0")}>
                        <table className={TABLE.table}>
                            <thead style={tableHead("report")}>
                                <tr>
                                    <SortTh id="date" kind="report" sort={table.sort} onSort={table.onSort}>
                                        Date
                                    </SortTh>
                                    {dims.map((d, i) => (
                                        <SortTh key={d} id={`d:${i}`} kind="report" sort={table.sort} onSort={table.onSort}>
                                            {d}
                                        </SortTh>
                                    ))}
                                    {ordered.map((m) => (
                                        <SortTh key={m} id={m} kind="report" align="right" sort={table.sort} onSort={table.onSort}>
                                            {m}
                                        </SortTh>
                                    ))}
                                    {compareDays &&
                                        ordered.map((m) => (
                                            <SortTh key={`p:${m}`} id={`p:${m}`} kind="report" align="right" sort={table.sort} onSort={table.onSort}>
                                                {prevLabel(m)}
                                            </SortTh>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((r, ri) => (
                                    <tr key={r.id} style={ri % 2 === 1 ? { backgroundColor: REPORT_STRIPE } : undefined}>
                                        <td className={cx(TABLE.report.td, "whitespace-nowrap tabular-nums")}>{r.period}</td>
                                        {r.combo.values.map((v, i) => (
                                            <td key={i} className={cx(TABLE.report.td, "whitespace-nowrap")}>
                                                {v}
                                            </td>
                                        ))}
                                        {ordered.map((m) => (
                                            <td key={m} className={cx(TABLE.report.td, "text-right whitespace-nowrap tabular-nums")}>
                                                {formatMetric(m, metricOf(m, r.t))}
                                            </td>
                                        ))}
                                        {compareDays &&
                                            ordered.map((m) => (
                                                <td key={`p:${m}`} className={cx(TABLE.report.td, "text-right whitespace-nowrap text-secondary tabular-nums")}>
                                                    {r.prev ? formatMetric(m, metricOf(m, r.prev)) : "—"}
                                                </td>
                                            ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DasShell>
    );
};
