import { useMemo, useState } from "react";
import { XClose } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { readHashParams } from "../../../../../das/v1/screens/route";
import { downloadCsv } from "../../batch-data";
import { StatChip } from "../../campaign-ui";
import { DasShell, PINK, TEAL } from "../../das-shell";
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
    TEAL_DARK,
    filterExcluded,
    tableHead,
} from "../../nimbus-ui";
import { R1 } from "../../round-1";
import { compactNum } from "../../sample-data";
import { StatLookContext } from "../../stat-look";
import { useTableSort } from "../../table-sort";
import { LABEL } from "../../type-rules";
import { AskButton, AskRow, AssistantPanel } from "./assistant";
import type { QuestionId, ReportChange } from "./assistant-questions";
import { FilterBand } from "./filter-band";
import { type BandLook, bandExcluded } from "./filter-state";
import { InsightNotes } from "./insight-notes";
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
    UNIT,
    addSavedQuery,
    csvMetric,
    findQuery,
    formatMetric,
    longDate,
    metricOf,
    rangeDays,
    runQuery,
} from "./insights-data";
import { LONG_ADVERTISERS, TOP_ADVERTISERS } from "./long-lists";
import { QueryChart } from "./query-chart";
import type { ScenarioQuery } from "./scenarios";

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

/** C8: the same categories with Advertiser's long list, opening search first on its top values. */
const LONG_FILTER_DIMS = FILTER_DIMS.map((d) => (d.id === "Advertiser" ? { ...d, values: LONG_ADVERTISERS, top: TOP_ADVERTISERS } : d));

/** C4: the Default tier, which realtime opens on today. */
const DEFAULT_VIEW = { metrics: ["Revenue", "Requests", "Impressions", "ECPM"] as Metric[], breakdown: ["Platform"] as Dim[], chart: "line" as ChartKind };

export const NewQuery = ({
    chart: initialChart = "table",
    metrics: initialMetrics = ["Requests", "CTR"],
    breakdown: initialBreakdown = [],
    band,
    filters: initialFilters = {},
    openFilterOn,
    defaultView,
    panel,
    panelQuery,
    longLists,
    blocksDriveChart,
    charted: initialCharted,
    assistant,
    assistantAsk,
    insightNotes,
    scenario,
}: {
    chart?: ChartKind;
    metrics?: Metric[];
    breakdown?: Dim[];
    /** Round 2 · C1–C3: the filter band concept. Left out, the band is today's (the control). */
    band?: BandLook;
    /** Filters already saved when the screen opens (C1–C3 states). */
    filters?: FilterState;
    /** Opens the filter panel on this category (C3 states). */
    openFilterOn?: string;
    /** Round 2 · C4: opens on realtime's view, with its metric blocks over the chart. */
    defaultView?: boolean;
    /** Round 2 · C7: the polished filter panel (C8's search first comes with it). */
    panel?: "today" | "polished";
    /** Round 2 · C8: a search already typed in the panel. */
    panelQuery?: string;
    /** Round 2 · C8: Advertiser carries the full long list and opens search first. */
    longLists?: boolean;
    /** Round 2 · C10: the metric blocks pick what the chart shows (one, or two to compare). */
    blocksDriveChart?: boolean;
    /** Round 2 · C10: the metrics charted when the screen opens. */
    charted?: Metric[];
    /** Round 2 · C14: the AI layer: Ask in the tabs, questions under the chart, the panel. */
    assistant?: boolean | "open";
    /** Round 2 · C14: a question already asked when the screen opens. */
    assistantAsk?: QuestionId;
    /** Round 2 · C15: what changed, beside the chart. */
    insightNotes?: boolean;
    /** Round 2: the data scenario picked in the prototype's toolbar (null: the screen's own). */
    scenario?: ScenarioQuery | null;
}) => {
    // A saved query opened from Saved Queries brings its own settings.
    const [opened] = useState(() => findQuery(readHashParams().get("q")));
    // Round 2: a data scenario (prototype toolbar) replaces the screen's own query when one is picked.
    const sc = scenario ?? undefined;
    const [range, setRange] = useState<Range>(sc?.range ?? opened?.range ?? "7");
    const [interval, setInterval] = useState<Interval>(sc?.interval ?? opened?.interval ?? "day");
    const [metrics, setMetrics] = useState<Metric[]>(sc?.metrics ?? opened?.metrics ?? (defaultView ? DEFAULT_VIEW.metrics : initialMetrics));
    const [breakdown, setBreakdown] = useState<Dim[]>(sc?.breakdown ?? opened?.breakdown ?? (defaultView ? DEFAULT_VIEW.breakdown : initialBreakdown));
    const [filters, setFilters] = useState<FilterState>(sc?.filters ?? initialFilters);
    const [compare, setCompare] = useState(sc?.compare ? String(rangeDays(sc.range).length) : "");
    const [chart, setChart] = useState<ChartKind>(sc?.chart ?? opened?.chart ?? (defaultView ? DEFAULT_VIEW.chart : initialChart));
    const [totalsOnly, setTotalsOnly] = useState(false);
    const [showLegend, setShowLegend] = useState(true);
    // C4 opens like realtime: the report first, the builder one click away (Expand).
    const [collapsed, setCollapsed] = useState(Boolean(defaultView));
    const [naming, setNaming] = useState(false);
    const [name, setName] = useState(opened?.name ?? "");
    const [savedAs, setSavedAs] = useState<string | null>(null);

    // C4 leads with Revenue, as realtime does: the first metric is the one charted.
    const ordered = METRICS.filter((m) => metrics.includes(m)).sort((a, b) => (defaultView ? Number(b === "Revenue") - Number(a === "Revenue") : 0));
    const dims = useMemo(() => DIMS.filter((d) => breakdown.includes(d)), [breakdown]);
    const compareDays = Number(compare) > 0 ? Number(compare) : undefined;
    const excluded = useMemo(
        () => (band ? bandExcluded(FILTER_DIMS, filters) : filterExcluded(FILTER_DIMS, filters)) as Partial<Record<Dim, string[]>>,
        [filters, band],
    );
    const tableTotals = chart === "table" && totalsOnly;
    const rows = useMemo(
        () => runQuery({ range, interval, breakdown: dims, excluded, totalsOnly: tableTotals, compare: chart === "table" ? compareDays : undefined }),
        [range, interval, dims, excluded, tableTotals, compareDays, chart],
    );
    const days = rangeDays(range);

    // C10: the blocks pick the charted metrics, one (split by platform) or two (compared on two axes).
    const [chartedPick, setChartedPick] = useState<Metric[]>(initialCharted ?? []);
    const charted = blocksDriveChart
        ? chartedPick.filter((m) => ordered.includes(m)).length
            ? chartedPick.filter((m) => ordered.includes(m))
            : ordered.slice(0, 1)
        : ordered;
    const comparing = blocksDriveChart && charted.length > 1;
    const totalRows = useMemo(
        () => (comparing ? runQuery({ range, interval, breakdown: [], excluded, totalsOnly: false }) : rows),
        [comparing, range, interval, excluded, rows],
    );
    // C14: the panel, and a question asked from the row under the chart.
    const [askOpen, setAskOpen] = useState(assistant === "open" || Boolean(assistantAsk));
    const [pending, setPending] = useState<QuestionId | null>(assistantAsk ?? null);
    const askFromReport = (q: QuestionId) => {
        setAskOpen(true);
        setPending(q);
    };
    const applyChange = (c: ReportChange) => {
        if (c.metrics) setMetrics(c.metrics);
        if (c.breakdown) setBreakdown(c.breakdown);
        if (c.chart) setChart(c.chart);
        if (c.charted) setChartedPick(c.charted);
    };

    const pickCharted = (m: Metric) =>
        setChartedPick(() => {
            const cur = charted;
            if (cur.includes(m)) return cur.length > 1 ? cur.filter((x) => x !== m) : cur;
            return cur.length < 2 ? [...cur, m] : [cur[0], m];
        });

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
        <DasShell navKey="performance insights" account={defaultView ? "publisher" : "exchange"}>
            <PageTabs
                tabs={PI_TABS}
                active="query"
                trailing={
                    <>
                        <span className="text-md font-semibold text-tertiary">All reports are in UTC.</span>
                        <CollapseButton collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} />
                        {assistant && <AskButton open={askOpen} onPress={() => setAskOpen((v) => !v)} />}
                    </>
                }
            />
            <div>
                <div className="flex min-w-0 flex-col px-8 pb-12">
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
                                    {band ? (
                                        <FilterBand
                                            look={band}
                                            dims={longLists ? LONG_FILTER_DIMS : FILTER_DIMS}
                                            value={filters}
                                            onChange={setFilters}
                                            openOn={openFilterOn}
                                            panel={panel}
                                            panelQuery={panelQuery}
                                        />
                                    ) : (
                                        <FilterControl dims={FILTER_DIMS} value={filters} onChange={setFilters} />
                                    )}
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

                    {/* C14: the panel sits beside the report, under the date row, so the date row keeps its width. */}
                    <div className={askOpen ? "-mr-8 grid grid-cols-[minmax(0,1fr)_400px] items-start" : undefined}>
                        <div className="min-w-0">
                            {defaultView && ordered.length > 0 && (
                                <MetricBlocks
                                    metrics={ordered}
                                    range={range}
                                    excluded={excluded}
                                    charted={blocksDriveChart ? charted : undefined}
                                    onPick={blocksDriveChart ? pickCharted : undefined}
                                />
                            )}

                            {ordered.length === 0 ? (
                                <p className="py-8 text-md text-tertiary">Select at least one metric.</p>
                            ) : chart !== "table" ? (
                                <div className={cx("py-8", insightNotes && "grid grid-cols-[minmax(0,1fr)_300px] items-start gap-8")}>
                                    <div className="flex min-w-0 flex-col gap-4">
                                        <QueryChart
                                            rows={comparing ? totalRows : rows}
                                            metrics={blocksDriveChart ? charted : ordered}
                                            hasBreakdown={!comparing && dims.length > 0}
                                            chart={chart}
                                            interval={interval}
                                            showLegend={showLegend}
                                            dualAxis={comparing}
                                        />
                                        {assistant && <AskRow onAsk={askFromReport} />}
                                    </div>
                                    {insightNotes && <InsightNotes range={range} excluded={excluded} />}
                                </div>
                            ) : (
                                <>
                                    {assistant && (
                                        <div className="py-4">
                                            <AskRow onAsk={askFromReport} />
                                        </div>
                                    )}
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
                                                            <SortTh
                                                                key={`p:${m}`}
                                                                id={`p:${m}`}
                                                                kind="report"
                                                                align="right"
                                                                sort={table.sort}
                                                                onSort={table.onSort}
                                                            >
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
                                                                <td
                                                                    key={`p:${m}`}
                                                                    className={cx(TABLE.report.td, "text-right whitespace-nowrap text-secondary tabular-nums")}
                                                                >
                                                                    {r.prev ? formatMetric(m, metricOf(m, r.prev)) : "—"}
                                                                </td>
                                                            ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                        {askOpen && (
                            <AssistantPanel
                                range={range}
                                excluded={excluded}
                                onApply={applyChange}
                                onClose={() => setAskOpen(false)}
                                pending={pending}
                                onPendingTaken={() => setPending(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </DasShell>
    );
};

/**
 * C4: realtime's metric blocks over the report: each metric's total for the range, and a
 * line per platform under it (R1-05 number, R1-06 platform lines), as realtime shows them.
 */
/** Realtime's block numbers: counts compact (26.11B), money and rates in full. */
const blockValue = (m: Metric, v: number) => (UNIT[m] === "count" ? compactNum(v) : formatMetric(m, v));

const MetricBlocks = ({
    metrics,
    range,
    excluded,
    charted,
    onPick,
}: {
    metrics: Metric[];
    range: Range;
    excluded: Partial<Record<Dim, string[]>>;
    /** C10: the metrics the chart shows; the blocks become its tabs. */
    charted?: Metric[];
    onPick?: (m: Metric) => void;
}) => {
    const span = rangeDays(range).length;
    const totalRow = runQuery({ range, interval: "day", breakdown: [], excluded, totalsOnly: true, compare: onPick ? span : undefined })[0];
    const byPlatform = runQuery({ range, interval: "day", breakdown: ["Platform"], excluded, totalsOnly: true });
    if (!totalRow) return null;
    const total = totalRow.t;
    const sorted = [...metrics].sort((a, b) => (b === "Revenue" ? 1 : 0) - (a === "Revenue" ? 1 : 0));
    return (
        <StatLookContext.Provider value="flat">
            <div className="flex flex-wrap gap-x-6 gap-y-4 pt-6" role={onPick ? "group" : undefined} aria-label={onPick ? "Metrics to chart" : undefined}>
                {sorted.map((m) => {
                    const slot = charted?.indexOf(m) ?? -1;
                    const prev = totalRow.prev ? metricOf(m, totalRow.prev) : undefined;
                    const change = prev ? (metricOf(m, total) - prev) / prev : undefined;
                    return (
                        <StatChip
                            key={m}
                            onPress={onPick ? () => onPick(m) : undefined}
                            active={slot >= 0}
                            label={
                                <span className="inline-flex items-center gap-2">
                                    {onPick && (
                                        <span
                                            aria-hidden="true"
                                            className="inline-block h-1 w-4 rounded-full"
                                            style={{ backgroundColor: slot === 0 ? TEAL : slot === 1 ? PINK : "#D0D5DD" }}
                                        />
                                    )}
                                    {m}
                                </span>
                            }
                            sub={
                                <span className="flex flex-col">
                                    {change !== undefined && (
                                        <span style={{ ...R1.rtPlatformValue, color: change >= 0 ? TEAL_DARK : "#B42318" }}>
                                            {change >= 0 ? "▲" : "▼"} {Math.abs(change * 100).toFixed(1)}% vs previous {span === 1 ? "day" : `${span} days`}
                                        </span>
                                    )}
                                    {byPlatform.map((r) => (
                                        <span key={r.id} className="inline-flex items-center gap-2">
                                            <span style={R1.rtPlatformLabel}>{r.combo.values[0]}</span>
                                            <span style={R1.rtPlatformValue}>{blockValue(m, metricOf(m, r.t))}</span>
                                        </span>
                                    ))}
                                </span>
                            }
                        >
                            {blockValue(m, metricOf(m, total))}
                        </StatChip>
                    );
                })}
            </div>
        </StatLookContext.Provider>
    );
};
