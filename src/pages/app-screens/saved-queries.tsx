import type { ReactNode } from "react";
import { ChevronDown, ChevronLeft, Folder, Plus, SearchLg, X } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Toggle } from "@/components/base/toggle/toggle";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Table, TableCard } from "@/components/application/table/table";
import { ChartTypeBar, type ChartTypeBarOption, NIMBUS_CHART_ICONS } from "@/components/application/chart-type-bar/chart-type-bar";
import { cx } from "@/utils/cx";

/**
 * Nimbus Exchange — Saved Queries (Reporting → performance insights).
 *
 * Rebuilds the reference query-builder "Save Queries" flow
 * (reference/screens - batch 3/Nimbus Key Metrics Dashboard - Saved Queries
 * Update/). The screen shares the reporting tool chrome — a tab strip, a grid
 * of query-config rows (dates, Group By, Filter, Metrics, Breakdown, Compare,
 * Chart Type) and a large full-width multi-series line chart with a floating
 * tooltip card.
 *
 * Four states are exposed via the `variant` prop and rendered as separate
 * Storybook stories:
 *   - "builder"        the query builder + line chart
 *   - "breakdown-open" builder with the Breakdown "More Options" popover open
 *   - "save-modal"     the "Save Query" naming dialog
 *   - "saved-list"     the "Queries" tab with the saved / recommended table
 *
 * The chart is hand-drawn inline SVG (area + jagged multi-series lines, month
 * axis, faint vertical gridlines) adapted from the key-metrics-dashboard
 * Sparkline — at this size the hand-drawn paths match the reference and keep
 * the screen dependency-free.
 */

/* ----------------------------------------------------------- Accent colors --- */

const PINK_DEEP = "#c01574";
const MAGENTA = "#a51458";
const PINK_LIGHT = "#f0a9cb";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ---------------------------------------------------------- Line chart data --- */

/** Deterministic jagged series: base trend + reproducible per-point jitter. */
const buildSeries = (start: number, end: number, amplitude: number, seed: number, points = 48): number[] => {
    const out: number[] = [];
    for (let i = 0; i < points; i++) {
        const t = i / (points - 1);
        const trend = start + (end - start) * t;
        // Reproducible pseudo-random in [-1, 1].
        const noise = Math.sin(seed + i * 1.7) * 0.6 + Math.sin(seed * 2 + i * 0.9) * 0.4;
        out.push(Math.max(0, Math.min(1000, trend + noise * amplitude)));
    }
    return out;
};

const CHART_SERIES = [
    { id: "series-1", label: "Series 1", color: MAGENTA, data: buildSeries(560, 790, 22, 1.3) },
    { id: "series-2", label: "Series 2", color: PINK_LIGHT, data: buildSeries(315, 550, 16, 4.1) },
    { id: "series-3", label: "Series 3", color: PINK_DEEP, data: buildSeries(200, 445, 20, 7.7) },
];

/* --------------------------------------------------------------- Line chart --- */

const CW = 1040;
const CH = 560;
const M = { top: 20, right: 24, bottom: 40, left: 56 };
const PW = CW - M.left - M.right;
const PH = CH - M.top - M.bottom;
const Y_MAX = 1000;
const Y_TICKS = [0, 200, 400, 600, 800, 1000];

const px = (i: number, n: number) => M.left + (i * PW) / (n - 1);
const py = (v: number) => M.top + PH * (1 - v / Y_MAX);

const linePath = (data: number[]) =>
    "M" + data.map((d, i) => `${px(i, data.length).toFixed(1)},${py(d).toFixed(1)}`).join(" L");

const areaPath = (data: number[]) => {
    const n = data.length;
    return `${linePath(data)} L${px(n - 1, n).toFixed(1)},${py(0).toFixed(1)} L${px(0, n).toFixed(1)},${py(0).toFixed(1)} Z`;
};

const LineChart = ({ tooltip }: { tooltip?: boolean }) => (
    <div className="relative">
        <svg viewBox={`0 0 ${CW} ${CH}`} className="w-full" role="img" aria-label="Active users by month, three series">
            {/* Horizontal grid + Y axis labels */}
            {Y_TICKS.map((t) => (
                <g key={t}>
                    <line x1={M.left} y1={py(t)} x2={CW - M.right} y2={py(t)} stroke="#e9eaeb" strokeWidth={1} />
                    <text x={M.left - 12} y={py(t) + 4} textAnchor="end" className="fill-tertiary" fontSize={13}>
                        {t.toLocaleString()}
                    </text>
                </g>
            ))}

            {/* Faint vertical gridlines at each month */}
            {MONTHS.map((_, i) => {
                const x = M.left + (i * PW) / (MONTHS.length - 1);
                return <line key={i} x1={x} y1={M.top} x2={x} y2={M.top + PH} stroke="#f2f2f3" strokeWidth={1} />;
            })}

            {/* Area under the top series */}
            <path d={areaPath(CHART_SERIES[0].data)} fill="rgba(218,110,163,0.06)" stroke="none" />

            {/* Series lines */}
            {CHART_SERIES.map((s) => (
                <path key={s.id} d={linePath(s.data)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            ))}

            {/* X axis month labels */}
            {MONTHS.map((mo, i) => {
                const x = M.left + (i * PW) / (MONTHS.length - 1);
                return (
                    <text key={mo} x={x} y={CH - 14} textAnchor="middle" className="fill-tertiary" fontSize={13}>
                        {mo}
                    </text>
                );
            })}

            {/* Y axis title */}
            <text transform={`translate(16 ${M.top + PH / 2}) rotate(-90)`} textAnchor="middle" className="fill-tertiary" fontSize={12}>
                Active users
            </text>
            <text x={CW / 2} y={CH - 0.5} textAnchor="middle" className="fill-tertiary" fontSize={12}>
                Month
            </text>
        </svg>

        {/* Legend */}
        <div className="pointer-events-none absolute top-1 right-2 flex items-center gap-4">
            {CHART_SERIES.map((s) => (
                <span key={s.id} className="flex items-center gap-1.5 text-xs text-tertiary">
                    <span className="size-2 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
                    {s.label}
                </span>
            ))}
        </div>

        {/* Floating tooltip card */}
        {tooltip && (
            <div className="absolute top-6 left-[46%] w-72 rounded-lg border-l-4 border-[#0e2f5c] bg-primary p-4 shadow-lg ring-1 ring-secondary">
                <p className="text-md font-semibold text-primary">Revenue</p>
                <p className="text-sm text-secondary">United States</p>
                <p className="text-sm text-secondary">Android</p>
                <hr className="my-3 border-secondary" />
                <p className="text-xs font-semibold tracking-wide text-tertiary uppercase">June 1, 2022 13:00UTC</p>
                <dl className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <dt className="text-xs font-semibold tracking-wide text-tertiary uppercase">Revenue:</dt>
                        <dd className="text-md font-bold text-primary">$81,983.71</dd>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                        <dt className="text-xs font-semibold tracking-wide text-tertiary uppercase">Previous day:</dt>
                        <dd className="flex items-center gap-2">
                            <span className="text-md font-bold text-primary">$71,458.92</span>
                            <span className="rounded bg-[#37b6b7]/15 px-1.5 py-0.5 text-xs font-semibold text-[#37b6b7]">↑ 14.7%</span>
                        </dd>
                    </div>
                </dl>
            </div>
        )}
    </div>
);

/* ------------------------------------------------------------ Shared chrome --- */

const AccountHeader = () => (
    <header className="flex items-center justify-between border-b border-secondary bg-primary px-8 py-6">
        <h1 className="text-display-xs font-semibold text-primary">Your Account</h1>
        <button
            type="button"
            aria-label="Account options"
            className="inline-flex size-9 items-center justify-center rounded-full text-[#DA6EA3] transition duration-100 ease-linear hover:bg-[#fdf2f7]"
        >
            <ChevronDown className="size-6" aria-hidden="true" />
        </button>
    </header>
);

interface TabStripProps {
    /** Label + active flag for the second tab ("Save Queries" or "Queries"). */
    secondLabel: string;
    activeTab: "new" | "second";
    /** Show the SAVE QUERY / COLLAPSE controls on the right (builder only). */
    showActions?: boolean;
}

const Tab = ({ label, active }: { label: string; active: boolean }) => (
    <button
        type="button"
        className={cx(
            "border-r border-secondary px-10 py-6 text-md font-semibold whitespace-nowrap transition duration-100 ease-linear",
            active ? "bg-[#37b6b7]/8 text-[#37b6b7]" : "text-[#37b6b7] hover:bg-secondary_hover",
        )}
    >
        {label}
    </button>
);

const TabStrip = ({ secondLabel, activeTab, showActions }: TabStripProps) => (
    <div className="flex items-stretch justify-between border-b border-secondary bg-primary">
        <div className="flex items-stretch">
            <Tab label="New Query" active={activeTab === "new"} />
            <Tab label={secondLabel} active={activeTab === "second"} />
        </div>
        {showActions && (
            <div className="flex items-center gap-3 pr-6">
                <button
                    type="button"
                    className="rounded-full bg-[#DA6EA3] px-6 py-2.5 text-xs font-bold tracking-wide text-white uppercase shadow-xs transition duration-100 ease-linear hover:bg-[#c01574]"
                >
                    Save Query
                </button>
                <button
                    type="button"
                    className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-6 py-2.5 text-xs font-bold tracking-wide text-tertiary uppercase transition duration-100 ease-linear hover:bg-secondary_hover"
                >
                    <ChevronLeft className="size-4" aria-hidden="true" />
                    Collapse
                </button>
            </div>
        )}
    </div>
);

/** A row in the config grid: fixed-width label + free content, bottom border. */
const ConfigRow = ({ label, children, className }: { label: string; children: ReactNode; className?: string }) => (
    <div className={cx("flex items-center gap-4 border-b border-secondary px-8 py-4", className)}>
        <span className="w-28 shrink-0 text-md font-semibold text-primary">{label}</span>
        {children}
    </div>
);

/** Pink dropdown pill used for Group By / Quick Date Select / Days Ago. */
const PinkDropdown = ({ label }: { label: string }) => (
    <button
        type="button"
        className="inline-flex items-center justify-between gap-6 text-md font-bold text-[#DA6EA3] transition duration-100 ease-linear hover:text-[#c01574]"
    >
        {label}
        <ChevronDown className="size-5" aria-hidden="true" />
    </button>
);

const MetricCheckbox = ({ label }: { label: string }) => <Checkbox size="md" label={label} />;

const METRICS = ["Revenue", "eCPM", "Requests", "Impressions", "Wins", "Win Rate", "Render Rate", "Clicks", "CTR", "rCPM", "Avg. Winning Bid"];
const BREAKDOWNS = ["Platform", "Position", "Ad Type", "Ad ID", "Demand Source", "Geo Region", "Geo: Country"];

// 27 Oct: staging's chart type tabs and Sketch icons (the shared ChartTypeBar).
const CHART_TYPES: ChartTypeBarOption<string>[] = [
    { id: "table", label: "Table", icon: NIMBUS_CHART_ICONS.table },
    { id: "stacked-line", label: "Stacked Line", icon: NIMBUS_CHART_ICONS.area },
    { id: "bar", label: "Bar", icon: NIMBUS_CHART_ICONS.bar },
    { id: "stacked-bar", label: "Stacked Bar", icon: NIMBUS_CHART_ICONS.stacked },
    { id: "pie", label: "Pie", icon: NIMBUS_CHART_ICONS.pie },
    { id: "line", label: "Line", icon: NIMBUS_CHART_ICONS.line },
];

/** The Breakdown "More Options" / "+2 More" popover with a Version search. */
const MoreOptionsPopover = ({ label }: { label: string }) => (
    <div className="relative">
        <button type="button" className="inline-flex items-center gap-2 text-md font-bold text-[#DA6EA3]">
            {label}
            <ChevronDown className="size-5" aria-hidden="true" />
        </button>
        <div className="absolute top-9 right-0 z-10 w-80 rounded-lg bg-primary p-3 shadow-lg ring-1 ring-secondary">
            <div className="flex items-center gap-2 rounded-lg px-3 py-2.5 ring-1 ring-primary">
                <SearchLg className="size-5 text-fg-quaternary" aria-hidden="true" />
                <input
                    type="text"
                    defaultValue="Version"
                    className="w-full bg-transparent text-md text-primary outline-hidden placeholder:text-placeholder"
                    aria-label="Search breakdown options"
                />
            </div>
            <div className="mt-2 flex flex-col gap-3 px-1 py-2">
                <Checkbox size="md" isSelected label={<span className="font-semibold text-[#37b6b7]">App Version</span>} />
                <Checkbox size="md" isSelected label={<span className="font-semibold text-[#37b6b7]">App Version</span>} />
            </div>
        </div>
    </div>
);

/* ------------------------------------------------------------ Builder view --- */

const QueryBuilderView = ({ tooltip, breakdownOpen, moreLabel }: { tooltip?: boolean; breakdownOpen?: boolean; moreLabel: string }) => (
    <main className="flex-1 overflow-x-hidden">
        <AccountHeader />
        <TabStrip secondLabel="Save Queries" activeTab="second" showActions />

        {/* Dates + Group By + Quick Date Select */}
        <div className="grid grid-cols-4 border-b border-secondary bg-primary">
            {[
                { label: "Start Date:", value: "June 1, 2021" },
                { label: "Start Date:", value: "June 1, 2021" },
            ].map((d, i) => (
                <div key={i} className="border-r border-secondary px-8 py-5">
                    <p className="text-xs font-medium text-tertiary">{d.label}</p>
                    <p className="mt-1 text-lg font-bold text-primary">{d.value}</p>
                </div>
            ))}
            <div className="flex items-center border-r border-secondary px-8 py-5">
                <PinkDropdown label="Group By" />
            </div>
            <div className="flex items-center px-8 py-5">
                <PinkDropdown label="Quick Date Select" />
            </div>
        </div>

        {/* Filter */}
        <ConfigRow label="Filter:">
            <Button size="sm" color="link-color" iconLeading={Plus} className="uppercase">
                Add
            </Button>
            <span className="text-sm text-tertiary">(pre-populate filter for app with selected home publisher only)</span>
        </ConfigRow>

        {/* Metrics */}
        <ConfigRow label="Metrics:" className="items-start">
            <div className="flex flex-1 flex-wrap gap-x-6 gap-y-3">
                {METRICS.map((m) => (
                    <MetricCheckbox key={m} label={m} />
                ))}
            </div>
        </ConfigRow>

        {/* Breakdown */}
        <div className="flex items-center gap-4 border-b border-secondary px-8 py-4">
            <span className="w-28 shrink-0 text-md font-semibold text-primary">Breakdown:</span>
            <div className="flex flex-1 flex-wrap gap-x-6 gap-y-3">
                {BREAKDOWNS.map((b) => (
                    <MetricCheckbox key={b} label={b} />
                ))}
            </div>
            {breakdownOpen ? <MoreOptionsPopover label={moreLabel} /> : <PinkDropdown label="More Options" />}
        </div>

        {/* Compare */}
        <ConfigRow label="Compare:">
            <div className="flex w-72 items-center rounded-lg px-3.5 py-2.5 ring-1 ring-primary">
                <span className="text-md text-placeholder">input value</span>
            </div>
            <div className="ml-4">
                <PinkDropdown label="Days Ago" />
            </div>
            <button type="button" aria-label="Remove comparison" className="ml-auto text-[#DA6EA3] transition duration-100 ease-linear hover:text-[#c01574]">
                <X className="size-5" aria-hidden="true" />
            </button>
        </ConfigRow>

        {/* Chart type + Show activity */}
        <div className="flex items-stretch gap-6 border-b border-secondary px-8">
            <span className="flex w-28 shrink-0 items-center text-md font-semibold text-primary">Chart Type:</span>
            <ChartTypeBar options={CHART_TYPES} value="line" className="flex-1" />
            <div className="flex items-center gap-3">
                <span className="text-md font-semibold text-primary">Show Activity:</span>
                <Toggle size="md" aria-label="Show activity" />
            </div>
        </div>

        {/* Chart */}
        <div className="bg-primary px-8 py-8">
            <LineChart tooltip={tooltip} />
        </div>
    </main>
);

/* --------------------------------------------------------- Saved-list view --- */

interface SavedQueryRow {
    id: string;
    name: string;
    dateRange: string;
    createdBy: string;
    dateCreated: string;
    reportType: string;
    /** true = "delete" (red ✕), false = "add" (pink +). */
    isDelete: boolean;
    /** Show the "Delete" tooltip bubble on this row (top delete row in reference). */
    showTooltip?: boolean;
}

const savedRows: SavedQueryRow[] = [
    { id: "r1", name: "Report Name", dateRange: "Data", createdBy: "Data", dateCreated: "Data", reportType: "Data", isDelete: true },
    { id: "r2", name: "Report Name", dateRange: "Data", createdBy: "Data", dateCreated: "Data", reportType: "Data", isDelete: true, showTooltip: true },
    { id: "r3", name: "Report Name", dateRange: "Data", createdBy: "Data", dateCreated: "Data", reportType: "Data", isDelete: true },
    { id: "r4", name: "Report Name", dateRange: "Data", createdBy: "Data", dateCreated: "Data", reportType: "Data", isDelete: false },
    { id: "r5", name: "Report Name", dateRange: "Data", createdBy: "Data", dateCreated: "Data", reportType: "Data", isDelete: false },
    { id: "r6", name: "Report Name", dateRange: "Data", createdBy: "Data", dateCreated: "Data", reportType: "Data", isDelete: false },
];

export const RowAction = ({ row }: { row: SavedQueryRow }) => (
    <div className="relative flex justify-end">
        {row.showTooltip && (
            <span className="absolute top-1/2 right-12 -translate-y-1/2 rounded-md bg-primary-solid px-2.5 py-1 text-xs font-medium text-white">
                Delete
            </span>
        )}
        <button
            type="button"
            aria-label={row.isDelete ? "Delete report" : "Add report"}
            className={cx(
                "inline-flex size-8 items-center justify-center rounded-full text-white shadow-xs transition duration-100 ease-linear",
                row.isDelete ? "bg-error-solid hover:bg-error-solid_hover" : "bg-[#DA6EA3] hover:bg-[#c01574]",
            )}
        >
            {row.isDelete ? <X className="size-4" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
        </button>
    </div>
);

const SavedListView = () => (
    <main className="flex-1 overflow-x-hidden">
        <AccountHeader />
        <TabStrip secondLabel="Queries" activeTab="second" />

        {/* Saved / Recommended filter */}
        <div className="flex items-center gap-8 border-b border-secondary bg-primary px-8 py-4">
            <span className="text-md font-semibold text-primary">Breakdown:</span>
            <Checkbox size="md" isSelected label="Saved" />
            <Checkbox size="md" isSelected label="Recommended" />
        </div>

        {/* Saved queries table */}
        <div className="px-8 py-8">
            <SavedQueriesTable />
        </div>
    </main>
);

/* ------------------------------------------------------- Save-query modal --- */

const SaveQueryModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-overlay p-6">
        <div className="w-full max-w-lg rounded-2xl bg-primary p-6 shadow-xl">
            <div className="flex items-start justify-between">
                <span
                    className="inline-flex size-12 items-center justify-center rounded-xl text-white"
                    style={{ background: "linear-gradient(135deg, #DA6EA3, #c01574)" }}
                    aria-hidden="true"
                >
                    <Folder className="size-6" />
                </span>
                <button type="button" aria-label="Close" className="text-fg-quaternary transition duration-100 ease-linear hover:text-fg-quaternary_hover">
                    <X className="size-6" aria-hidden="true" />
                </button>
            </div>

            <div className="mt-4">
                <h2 className="text-lg font-bold text-primary">Save Query</h2>
                <p className="mt-1 text-sm text-tertiary">Please enter a name for this project.</p>
            </div>

            <div className="mt-5">
                <label htmlFor="query-name" className="text-sm font-medium text-secondary">
                    Query Name
                </label>
                <div className="mt-1.5 flex items-center rounded-lg px-3.5 py-2.5 ring-1 ring-primary">
                    <input
                        id="query-name"
                        type="text"
                        placeholder="e.g. Website query"
                        className="w-full bg-transparent text-md text-primary outline-hidden placeholder:text-placeholder"
                    />
                </div>
            </div>

            <div className="mt-4 flex items-center gap-8">
                <label className="flex cursor-pointer items-center gap-2">
                    <span className="flex size-4 items-center justify-center rounded-full ring-1 ring-[#DA6EA3]">
                        <span className="size-2 rounded-full bg-[#DA6EA3]" />
                    </span>
                    <span className="text-sm text-secondary">Update Date Range on Load</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2">
                    <span className="size-4 rounded-full ring-1 ring-primary" />
                    <span className="text-sm text-secondary">Save Exact Dates</span>
                </label>
            </div>

            <div className="mt-4">
                <Checkbox size="md" label="Private Report" />
            </div>

            <div className="mt-6 flex items-center gap-3">
                <button
                    type="button"
                    className="rounded-full bg-[#DA6EA3] px-8 py-3 text-xs font-bold tracking-wide text-white uppercase shadow-xs transition duration-100 ease-linear hover:bg-[#c01574]"
                >
                    Contiue
                </button>
                <button
                    type="button"
                    className="rounded-full bg-primary px-8 py-3 text-xs font-bold tracking-wide text-secondary uppercase ring-1 ring-primary transition duration-100 ease-linear hover:bg-secondary_hover"
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
);

/* --------------------------------------------------------------- The screen --- */

export type SavedQueriesVariant = "builder" | "breakdown-open" | "save-modal" | "saved-list";

export interface SavedQueriesScreenProps {
    variant?: SavedQueriesVariant;
}

export const SavedQueriesScreen = ({ variant = "saved-list" }: SavedQueriesScreenProps) => {
    if (variant === "save-modal") {
        // The modal sits over the query-builder chrome.
        return (
            <div className="relative flex min-h-screen bg-secondary">
                <GlobalNav defaultActiveKey="performance insights" />
                <QueryBuilderView tooltip moreLabel="More Options" />
                <SaveQueryModal />
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-secondary">
            <GlobalNav defaultActiveKey="performance insights" />
            {variant === "saved-list" ? (
                <SavedListView />
            ) : (
                <QueryBuilderView
                    tooltip
                    breakdownOpen={variant === "breakdown-open"}
                    moreLabel={variant === "breakdown-open" ? "+2 More" : "More Options"}
                />
            )}
        </div>
    );
};

export default SavedQueriesScreen;

/** The table used by SavedListView, exposed without page navigation for the 102326 audit. */
export const SavedQueriesTable = () => {
    return (
        <TableCard.Root>
            <Table aria-label="Saved queries" selectionMode="none">
                <Table.Header>
                    <Table.Head id="name" isRowHeader label="Impressions" allowsSorting />
                    <Table.Head id="range" label="Report Date Range" allowsSorting />
                    <Table.Head id="createdBy" label="Created by" allowsSorting />
                    <Table.Head id="created" label="Date Created" allowsSorting />
                    <Table.Head id="type" label="Report Type" allowsSorting />
                    <Table.Head id="action" label="" />
                </Table.Header>
                <Table.Body>
                    {savedRows.map((row) => (
                        <Table.Row key={row.id} id={row.id}>
                            <Table.Cell>
                                <span className="text-sm font-semibold text-[#37b6b7]">{row.name}</span>
                            </Table.Cell>
                            <Table.Cell>{row.dateRange}</Table.Cell>
                            <Table.Cell>{row.createdBy}</Table.Cell>
                            <Table.Cell>{row.dateCreated}</Table.Cell>
                            <Table.Cell>{row.reportType}</Table.Cell>
                            <Table.Cell className="text-right">
                                <RowAction row={row} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </TableCard.Root>
    );
};
