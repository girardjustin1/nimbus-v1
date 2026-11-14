import { useMemo, useState } from "react";
import { ZoomIn, ZoomOut } from "@untitledui/icons";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { downloadCsv } from "../../batch-data";
import { ChartTooltip, StatChip } from "../../campaign-ui";
import { DasShell, TEAL } from "../../das-shell";
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
    filterExcluded,
    tableHead,
} from "../../nimbus-ui";
import { StatLookContext } from "../../stat-look";
import { useTableSort } from "../../table-sort";
import { HEADLINE, LABEL } from "../../type-rules";
import {
    BUYER_FILTER_DIMS,
    BUYER_METRICS,
    BUYER_RANGES,
    type BuyerMetric,
    type BuyerRange,
    DEFAULT_BUYER_METRICS,
    DONUT_TITLE,
    type Slice,
    buyerRows,
    csvMetric,
    formatMetric,
    metricValue,
    partnerColor,
    rangeDates,
    slicesFor,
    totalOf,
} from "./buyer-data";

/**
 * Reporting · Buyer breakdown (staging, 13 Nov: reference/111326 9.11.29 PM).
 *
 * The publisher's demand partners for a date range: a date row with Download .CSV, metric
 * checkboxes (ECPM, Wins, Impressions, Clicks, Revenue), Filters with + ADD and the
 * chart / table switch, the summary tiles, then one "Demand …" donut per ticked metric.
 * Each donut's title zooms it to the full width with its figures alongside. The table
 * switch shows the same figures as a sortable report, one row per partner.
 *
 * Donuts keep to eight slices — six named partners, the rest as "Other" — with one shared
 * legend, and a partner keeps its colour across every donut.
 */

export type BuyerView = "pie" | "table";

const VIEWS: ChartTypeOption<BuyerView>[] = [
    { id: "pie", label: "Pie", icon: DEFAULT_CHART_ICONS.pie },
    { id: "table", label: "Table", icon: DEFAULT_CHART_ICONS.table },
];

const share = (s: Slice, all: Slice[]) => {
    const total = all.reduce((t, x) => t + x.value, 0) || 1;
    return `${((s.value / total) * 100).toFixed(1)}%`;
};

const Donut = ({ metric, slices, zoomed, onZoom }: { metric: BuyerMetric; slices: Slice[]; zoomed: boolean; onZoom: () => void }) => {
    const Icon = zoomed ? ZoomOut : ZoomIn;
    return (
        <figure className={cx("flex flex-col items-center gap-4", zoomed && "md:col-span-3")}>
            <div className={cx("flex w-full items-center gap-10", zoomed ? "flex-col md:flex-row md:justify-center" : "justify-center")}>
                <div className={cx("aspect-square w-full", zoomed ? "max-w-md" : "max-w-72")}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Tooltip content={<ChartTooltip format={(v) => formatMetric(metric, v)} />} />
                            <Pie
                                data={slices}
                                dataKey="value"
                                nameKey="name"
                                innerRadius="58%"
                                outerRadius="98%"
                                startAngle={90}
                                endAngle={-270}
                                stroke="#FFFFFF"
                                strokeWidth={2}
                                isAnimationActive={false}
                            >
                                {slices.map((s) => (
                                    <Cell key={s.name} fill={s.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                {zoomed && (
                    <ul className="flex min-w-72 flex-col divide-y divide-secondary">
                        {slices.map((s) => (
                            <li key={s.name} className="flex items-center gap-3 py-2 text-md">
                                <span className="size-3 shrink-0 rounded-sm" style={{ backgroundColor: s.color }} aria-hidden="true" />
                                <span className="text-primary">{s.name}</span>
                                <span className="ml-auto pl-6 font-semibold text-primary tabular-nums">{formatMetric(metric, s.value)}</span>
                                {metric !== "ECPM" && <span className="w-16 text-right text-tertiary tabular-nums">{share(s, slices)}</span>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <figcaption>
                <button
                    type="button"
                    onClick={onZoom}
                    aria-pressed={zoomed}
                    className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-lg text-primary transition duration-100 ease-linear hover:bg-secondary"
                >
                    <Icon className="size-6" style={{ color: TEAL }} aria-hidden="true" />
                    <span className={HEADLINE}>{DONUT_TITLE[metric]}</span>
                </button>
            </figcaption>
        </figure>
    );
};

export const BuyerBreakdown = ({ view: initialView = "pie" }: { view?: BuyerView }) => {
    const [range, setRange] = useState<BuyerRange>("yesterday");
    const [metrics, setMetrics] = useState<BuyerMetric[]>(DEFAULT_BUYER_METRICS);
    const [filters, setFilters] = useState<FilterState>({});
    const [view, setView] = useState<BuyerView>(initialView);
    const [zoom, setZoom] = useState<BuyerMetric | null>(null);

    const excluded = useMemo(() => filterExcluded(BUYER_FILTER_DIMS, filters), [filters]);
    const rows = useMemo(() => buyerRows(range, excluded), [range, excluded]);
    const total = totalOf(rows);
    const ordered = BUYER_METRICS.filter((m) => metrics.includes(m));
    const dates = rangeDates(range);
    const table = useTableSort(rows, (r, id) => (id === "partner" ? r.partner : metricValue(id as BuyerMetric, r)));

    const toggle = (m: BuyerMetric) => setMetrics((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));
    const exportCsv = () =>
        downloadCsv(
            "buyer-breakdown",
            ["Demand Partner", ...ordered],
            rows.map((r) => [r.partner, ...ordered.map((m) => csvMetric(m, metricValue(m, r)))]),
        );

    // One legend for every donut: the partners on screen, in their fixed colour order.
    const legend = slicesFor("Revenue", rows);
    // A zoomed donut leads its row, so it opens where you clicked rather than at the end.
    const donuts = zoom && ordered.includes(zoom) ? [zoom, ...ordered.filter((m) => m !== zoom)] : ordered;

    return (
        <DasShell navKey="buyer breakdown" account="publisher">
            <div className="flex flex-col gap-8 px-8 pb-12">
                <Bands className="border-t-0">
                    <DateRow
                        trailing={
                            <>
                                <span className="text-md font-semibold text-tertiary">All reports are in UTC.</span>
                                <StateAction disabled={ordered.length === 0} onPress={exportCsv}>
                                    Download .CSV
                                </StateAction>
                            </>
                        }
                    >
                        <DateCell label="Start date">{dates.start}</DateCell>
                        <DateCell label="End date">{dates.end}</DateCell>
                        <BareSelect label="Date range" value={range} onChange={setRange} options={BUYER_RANGES} />
                    </DateRow>

                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 px-8 py-4">
                        {BUYER_METRICS.map((m) => (
                            <Checkbox
                                key={m}
                                size="md"
                                label={<span className={LABEL}>{m}</span>}
                                isSelected={metrics.includes(m)}
                                onChange={() => toggle(m)}
                            />
                        ))}
                    </div>

                    <div className="grid grid-cols-1 gap-x-6 px-8 md:grid-cols-[150px_minmax(0,1fr)_auto] md:items-stretch">
                        <span className={cx(LABEL, "pt-4 md:flex md:items-center md:pt-0")}>Filters:</span>
                        <div className="min-w-0 py-4">
                            <FilterControl dims={BUYER_FILTER_DIMS} value={filters} onChange={setFilters} />
                        </div>
                        <div className="-mr-8 flex items-start justify-end border-l border-secondary">
                            <ChartTypeBar options={VIEWS} value={view} onChange={setView} />
                        </div>
                    </div>
                </Bands>

                {ordered.length === 0 ? (
                    <p className="text-md text-tertiary">Select at least one metric.</p>
                ) : (
                    <>
                        <StatLookContext.Provider value="flat">
                            <div className="flex flex-wrap gap-x-6 gap-y-4">
                                {ordered.map((m) => (
                                    <StatChip key={m} label={m}>
                                        {formatMetric(m, metricValue(m, total))}
                                    </StatChip>
                                ))}
                            </div>
                        </StatLookContext.Provider>

                        {rows.length === 0 ? (
                            <p className="text-md text-tertiary">No demand for these filters.</p>
                        ) : view === "pie" ? (
                            <div className="flex flex-col gap-8">
                                <ul className="flex flex-wrap gap-x-6 gap-y-2" aria-label="Demand partners">
                                    {legend.map((s) => (
                                        <li key={s.name} className="inline-flex items-center gap-2 text-md text-secondary">
                                            <span className="size-3 rounded-sm" style={{ backgroundColor: s.color }} aria-hidden="true" />
                                            {s.name}
                                        </li>
                                    ))}
                                </ul>
                                <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-3">
                                    {donuts.map((m) => (
                                        <Donut
                                            key={m}
                                            metric={m}
                                            slices={slicesFor(m, rows)}
                                            zoomed={zoom === m}
                                            onZoom={() => setZoom((cur) => (cur === m ? null : m))}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className={TABLE.bleed}>
                                <table className={TABLE.table}>
                                    <thead style={tableHead("report")}>
                                        <tr>
                                            <SortTh id="partner" kind="report" sort={table.sort} onSort={table.onSort}>
                                                Demand Partner
                                            </SortTh>
                                            {ordered.map((m) => (
                                                <SortTh key={m} id={m} kind="report" align="right" sort={table.sort} onSort={table.onSort}>
                                                    {m}
                                                </SortTh>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((r, i) => (
                                            <tr key={r.partner} style={i % 2 === 1 ? { backgroundColor: REPORT_STRIPE } : undefined}>
                                                <td className={TABLE.report.td}>
                                                    <span className="inline-flex items-center gap-2">
                                                        <span
                                                            className="size-3 shrink-0 rounded-sm"
                                                            style={{ backgroundColor: partnerColor(r.partner) }}
                                                            aria-hidden="true"
                                                        />
                                                        {r.partner}
                                                    </span>
                                                </td>
                                                {ordered.map((m) => (
                                                    <td key={m} className={cx(TABLE.report.td, "text-right tabular-nums")}>
                                                        {formatMetric(m, metricValue(m, r))}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className={TABLE.report.foot}>
                                        <tr>
                                            <td className={cx(TABLE.report.td, "font-bold")}>Total</td>
                                            {ordered.map((m) => (
                                                <td key={m} className={cx(TABLE.report.td, "text-right font-bold tabular-nums")}>
                                                    {formatMetric(m, metricValue(m, total))}
                                                </td>
                                            ))}
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DasShell>
    );
};
