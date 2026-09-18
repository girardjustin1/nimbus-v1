import type { FC, ReactNode } from "react";
import {
    Activity,
    BarChart01,
    BarChartSquare02,
    ChevronDown,
    ChevronUp,
    Folder,
    PieChart01,
    Plus,
    Table as TableIcon,
    TrendUp01,
    XClose,
} from "@untitledui/icons";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";

/**
 * Nimbus Exchange — Performance Insights (Reporting → performance insights).
 *
 * Rebuilds the reference "Your Account" reporting query-builder
 * (reference/screens - batch 3/Nimbus Key Metrics Dashboard - Design Update/).
 * NOTE: the reference folder is misnamed — its content is a Performance
 * Insights query builder, not a metrics dashboard.
 *
 * The screen is a query-configuration panel (dates, filters, metrics,
 * breakdowns, compare, chart-type selector) sitting above a large data
 * visualization. A single `chartType` prop drives which chart-type button is
 * active and what renders below it (line / table / bar / stacked-bar / pie).
 * The `tab` and `showSaveModal` props expose the "Save Queries" list and the
 * "Save Query" modal states.
 *
 * All charts are lightweight inline SVG (area + smooth multi-series lines,
 * axis labels, gridlines) in the Nimbus pink/magenta palette — at this size
 * hand-drawn paths track the reference more closely and stay dependency-free.
 */

/* ----------------------------------------------------------- Accent colors --- */

const TEAL = "#37b6b7";
const PINK = "#c33f79";
const PINK_DEEP = "#c01574";

/** Chart series — dark magenta / mid pink / light pink. */
const S1 = "#9d1150";
const S2 = "#d94f92";
const S3 = "#f0a3c6";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* ------------------------------------------------------------------- Types --- */

export type ChartType = "table" | "stacked-line" | "bar" | "stacked-bar" | "pie" | "line";

export interface PerformanceInsightsScreenProps {
    /** Active chart-type button + the visualization rendered below. `null` = nothing selected (empty state). */
    chartType?: ChartType | null;
    /** Which top tab is active. */
    tab?: "new" | "saved";
    /** Overlay the "Save Query" modal on top of the screen. */
    showSaveModal?: boolean;
}

/* ----------------------------------------------------------- Chart datasets --- */

const N = 49; // ~weekly resolution across 12 months for rich wiggle

/** Deterministic trended series with high-frequency wiggle, clamped to 0..1000. */
const makeSeries = (base: number, rise: number, amp: number, phase: number): number[] =>
    Array.from({ length: N }, (_, i) => {
        const t = i / (N - 1);
        const trend = base + rise * t;
        const wiggle = amp * Math.sin(t * Math.PI * 11 + phase) + amp * 0.5 * Math.sin(t * Math.PI * 23 + phase * 2);
        return Math.max(0, Math.min(1000, trend + wiggle));
    });

const lineSeries: number[][] = [
    makeSeries(430, 470, 42, 0.4), // S1 dark, top
    makeSeries(315, 190, 30, 1.6), // S2 mid
    makeSeries(115, 190, 26, 2.9), // S3 light, bottom
];

/* ----------------------------------------------------------- Big line chart --- */

const CW = 1200;
const CH = 520;
const PL = 64; // left pad (y labels)
const PR = 24;
const PT = 24;
const PB = 48; // bottom pad (x labels)
const Y_MAX = 1000;

const px = (i: number, n: number) => PL + (i * (CW - PL - PR)) / (n - 1);
const py = (v: number) => PT + (CH - PT - PB) * (1 - v / Y_MAX);

const smoothPath = (data: number[]): string => {
    const pts = data.map((d, i) => [px(i, data.length), py(d)] as const);
    let path = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i - 1] ?? pts[i];
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const p3 = pts[i + 2] ?? p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        path += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return path;
};

const yTicks = [0, 200, 400, 600, 800, 1000];

const LineTooltip = () => (
    <div className="absolute top-2 left-[30%] z-10 w-64 rounded-lg bg-primary shadow-lg ring-1 ring-secondary_alt">
        <div className="flex gap-3 p-4">
            <div className="w-1 shrink-0 rounded-full" style={{ backgroundColor: TEAL }} />
            <div>
                <p className="text-md font-bold text-primary">Revenue</p>
                <p className="text-sm text-secondary">United States</p>
                <p className="text-sm text-secondary">Android</p>
            </div>
        </div>
        <div className="border-t border-secondary px-4 py-3">
            <p className="text-xs font-semibold tracking-wide text-tertiary">JUNE 1, 2022 13:00UTC</p>
            <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wide text-tertiary">REVENUE:</span>
                <span className="text-md font-bold text-primary">$81,983.71</span>
            </div>
            <div className="mt-1.5 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold tracking-wide text-tertiary">PREVIOUS DAY:</span>
                <span className="flex items-center gap-2">
                    <span className="text-md font-bold text-primary">$71,458.92</span>
                    <span className="flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold" style={{ backgroundColor: "#d6f0ef", color: TEAL }}>
                        <TrendUp01 className="size-3" aria-hidden="true" /> 14.7%
                    </span>
                </span>
            </div>
        </div>
    </div>
);

const LineChart = ({ withTooltip = true }: { withTooltip?: boolean }) => {
    const top = lineSeries[0];
    const areaPath = `${smoothPath(top)} L${px(N - 1, N).toFixed(1)},${py(0).toFixed(1)} L${px(0, N).toFixed(1)},${py(0).toFixed(1)} Z`;

    return (
        <div className="relative px-6 py-6">
            {/* Legend */}
            <div className="absolute top-2 right-8 z-10 flex items-center gap-4 text-sm text-secondary">
                {[
                    ["Series 1", S1],
                    ["Series 2", S2],
                    ["Series 3", S3],
                ].map(([label, color]) => (
                    <span key={label} className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full" style={{ backgroundColor: color }} />
                        {label}
                    </span>
                ))}
            </div>

            {withTooltip && <LineTooltip />}

            <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full" role="img" aria-label="Multi-series line chart of active users by month">
                {/* Gridlines + y labels */}
                {yTicks.map((v) => (
                    <g key={v}>
                        <line x1={PL} y1={py(v)} x2={CW - PR} y2={py(v)} stroke="#e9eaeb" strokeWidth={1} />
                        <text x={PL - 12} y={py(v) + 4} textAnchor="end" fontSize={13} fill="#717680">
                            {v.toLocaleString()}
                        </text>
                    </g>
                ))}

                {/* x labels */}
                {MONTHS.map((m, i) => (
                    <text key={m} x={PL + (i + 0.5) * ((CW - PL - PR) / 12)} y={CH - 16} textAnchor="middle" fontSize={13} fill="#717680">
                        {m}
                    </text>
                ))}

                {/* Axis titles */}
                <text transform={`translate(18 ${(PT + CH - PB) / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} fill="#717680">
                    Active users
                </text>
                <text x={CW / 2} y={CH - 2} textAnchor="middle" fontSize={12} fill="#717680">
                    Month
                </text>

                {/* Area under top series */}
                <path d={areaPath} fill="rgba(157,17,80,0.05)" stroke="none" />

                {/* Series */}
                {[
                    [top, S1],
                    [lineSeries[1], S2],
                    [lineSeries[2], S3],
                ].map(([data, color], i) => (
                    <path key={i} d={smoothPath(data as number[])} fill="none" stroke={color as string} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
                ))}
            </svg>
        </div>
    );
};

/* ------------------------------------------------------------- Bar charts --- */

const barMonthly = [320, 410, 380, 520, 480, 640, 600, 720, 690, 810, 860, 940];
const barStack: [number, number, number][] = [
    [180, 110, 60],
    [220, 140, 70],
    [200, 130, 65],
    [280, 170, 90],
    [260, 150, 85],
    [340, 210, 110],
    [320, 190, 100],
    [400, 240, 130],
    [380, 220, 120],
    [450, 270, 150],
    [480, 290, 160],
    [530, 320, 180],
];

const BarAxis = ({ children }: { children: ReactNode }) => (
    <div className="px-6 py-6">
        <svg viewBox={`0 0 ${CW} ${CH}`} className="h-auto w-full" role="img" aria-label="Bar chart of active users by month">
            {yTicks.map((v) => (
                <g key={v}>
                    <line x1={PL} y1={py(v)} x2={CW - PR} y2={py(v)} stroke="#e9eaeb" strokeWidth={1} />
                    <text x={PL - 12} y={py(v) + 4} textAnchor="end" fontSize={13} fill="#717680">
                        {v.toLocaleString()}
                    </text>
                </g>
            ))}
            {MONTHS.map((m, i) => (
                <text key={m} x={PL + (i + 0.5) * ((CW - PL - PR) / 12)} y={CH - 16} textAnchor="middle" fontSize={13} fill="#717680">
                    {m}
                </text>
            ))}
            <text transform={`translate(18 ${(PT + CH - PB) / 2}) rotate(-90)`} textAnchor="middle" fontSize={12} fill="#717680">
                Active users
            </text>
            <text x={CW / 2} y={CH - 2} textAnchor="middle" fontSize={12} fill="#717680">
                Month
            </text>
            {children}
        </svg>
    </div>
);

const BarChart = () => {
    const band = (CW - PL - PR) / 12;
    const bw = band * 0.5;
    return (
        <BarAxis>
            {barMonthly.map((v, i) => {
                const x = PL + i * band + (band - bw) / 2;
                return <rect key={i} x={x} y={py(v)} width={bw} height={py(0) - py(v)} rx={3} fill={S2} />;
            })}
        </BarAxis>
    );
};

const StackedBarChart = () => {
    const band = (CW - PL - PR) / 12;
    const bw = band * 0.5;
    const colors = [S1, S2, S3];
    return (
        <BarAxis>
            {barStack.map((stack, i) => {
                const x = PL + i * band + (band - bw) / 2;
                let acc = 0;
                return (
                    <g key={i}>
                        {stack.map((v, j) => {
                            const yTop = py(acc + v);
                            const h = py(acc) - py(acc + v);
                            acc += v;
                            return <rect key={j} x={x} y={yTop} width={bw} height={h} fill={colors[j]} />;
                        })}
                    </g>
                );
            })}
        </BarAxis>
    );
};

/* -------------------------------------------------------------- Pie chart --- */

const pieData: [string, number, string][] = [
    ["Series 1", 42, S1],
    ["Series 2", 33, S2],
    ["Series 3", 25, S3],
];

const PieChart = () => {
    const cx0 = 300;
    const cy0 = 260;
    const r = 190;
    const total = pieData.reduce((s, d) => s + d[1], 0);
    // Start/end angle of each slice, computed up front so render stays pure.
    const slices = pieData.map((d, i) => {
        const before = pieData.slice(0, i).reduce((s, p) => s + p[1], 0);
        const start = -Math.PI / 2 + (before / total) * Math.PI * 2;
        return { start, end: start + (d[1] / total) * Math.PI * 2 };
    });

    return (
        <div className="px-6 py-10">
            <div className="flex flex-col items-center gap-10 md:flex-row md:justify-center">
                <svg viewBox="0 0 600 520" className="h-80 w-full max-w-xl" role="img" aria-label="Pie chart of series distribution">
                    {pieData.map(([, , color], i) => {
                        const { start, end } = slices[i];
                        const x1 = cx0 + r * Math.cos(start);
                        const y1 = cy0 + r * Math.sin(start);
                        const x2 = cx0 + r * Math.cos(end);
                        const y2 = cy0 + r * Math.sin(end);
                        const large = end - start > Math.PI ? 1 : 0;
                        return (
                            <path key={i} d={`M${cx0},${cy0} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`} fill={color} />
                        );
                    })}
                </svg>
                <div className="flex flex-col gap-3">
                    {pieData.map(([label, value, color]) => (
                        <span key={label} className="flex items-center gap-2 text-md text-secondary">
                            <span className="size-3 rounded-full" style={{ backgroundColor: color }} />
                            {label} <span className="font-semibold text-primary">{value}%</span>
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------------- Data table --- */

const SortIcon = () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0" aria-hidden="true">
        <path d="M4 5.5L7 2.5L10 5.5M4 8.5L7 11.5L10 8.5" stroke={TEAL} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const TH = ({ children, first }: { children: ReactNode; first?: boolean }) => (
    <th className={cx("px-6 py-3.5 text-left text-sm font-semibold text-white", first && "rounded-tl-lg")}>
        <span className="flex items-center justify-between gap-2">
            {children}
            <SortIcon />
        </span>
    </th>
);

const tableRows = [
    ["2019-06-11", "AOL", "1,000,000", "80.00%", "$10.00", "$Amount"],
    ["2019-06-12", "AOL", "1,000,000", "80.00%", "$10.00", "$Amount"],
];

const DataTable = () => (
    <div className="px-6 py-6">
        <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg ring-1 ring-secondary">
            <thead style={{ backgroundColor: "#101828" }}>
                <tr>
                    <TH first>Date</TH>
                    <TH>Demand Source</TH>
                    <TH>Impressions</TH>
                    <TH>Render Rate</TH>
                    <TH>ECPM</TH>
                    <TH>Revenue</TH>
                </tr>
            </thead>
            <tbody>
                {tableRows.map((row, i) => (
                    <tr key={i} className={cx("border-b border-secondary", i % 2 === 1 && "bg-secondary")}>
                        {row.map((cell, j) => (
                            <td key={j} className={cx("border-b border-secondary px-6 py-4 text-sm", j === 5 ? "font-medium" : "text-secondary")} style={j === 5 ? { color: TEAL } : undefined}>
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
                <tr>
                    {["TOTAL", "", "Amount", "Amount%", "$Amount", "$Amount"].map((cell, j) => (
                        <td key={j} className="px-6 py-4 text-sm font-semibold" style={cell ? { color: TEAL } : undefined}>
                            {cell}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    </div>
);

/* ------------------------------------------------ Chart-type button config --- */

const chartTypes: { id: ChartType; label: string; icon: FC<{ className?: string }> }[] = [
    { id: "table", label: "TABLE", icon: TableIcon },
    { id: "stacked-line", label: "STACKED LINE", icon: Activity },
    { id: "bar", label: "BAR", icon: BarChart01 },
    { id: "stacked-bar", label: "STACKED BAR", icon: BarChartSquare02 },
    { id: "pie", label: "PIE", icon: PieChart01 },
    { id: "line", label: "LINE", icon: Activity },
];

/* --------------------------------------------------------- Shared bits --- */

/** Pink dropdown-style label used for Group By / Quick Date Select / Days Ago / More Options. */
const PinkDropdown = ({ label }: { label: string }) => (
    <button type="button" className="flex items-center gap-2 text-md font-semibold transition duration-100 ease-linear" style={{ color: PINK_DEEP }}>
        {label}
        <ChevronDown className="size-5" aria-hidden="true" />
    </button>
);

const RowLabel = ({ children }: { children: ReactNode }) => <span className="w-28 shrink-0 text-md font-semibold text-primary">{children}</span>;

/* ------------------------------------------------------- Config panel --- */

const ConfigPanel = ({ chartType }: { chartType: ChartType | null }) => {
    const isEmpty = chartType === null;

    return (
        <div className="divide-y divide-secondary border-b border-secondary">
            {/* Date / group-by row */}
            <div className="flex flex-wrap">
                <div className="w-52 border-r border-secondary px-6 py-4">
                    <p className="text-sm text-tertiary">Start Date:</p>
                    <p className="text-md font-bold text-primary">June 1, 2021</p>
                </div>
                <div className="w-52 border-r border-secondary px-6 py-4">
                    <p className="text-sm text-tertiary">Start Date:</p>
                    <p className="text-md font-bold text-primary">June 1, 2021</p>
                </div>
                <div className="flex w-56 items-center border-r border-secondary px-6 py-4">
                    <PinkDropdown label="Group By" />
                </div>
                <div className="flex w-64 items-center border-r border-secondary px-6 py-4">
                    <PinkDropdown label="Quick Date Select" />
                </div>
                <div className="flex-1" />
            </div>

            {/* Filter row */}
            <div className="flex items-center gap-6 px-6 py-4">
                <RowLabel>Filter:</RowLabel>
                <button type="button" className="flex items-center gap-1.5 text-sm font-semibold tracking-wide uppercase transition duration-100 ease-linear" style={{ color: PINK_DEEP }}>
                    <Plus className="size-4" aria-hidden="true" /> Add
                </button>
            </div>

            {/* Metrics row */}
            <div className="flex gap-6 px-6 py-4">
                <RowLabel>Metrics:</RowLabel>
                <div className="flex flex-wrap gap-x-8 gap-y-3">
                    {["Revenue", "eCPM", "Requests", "Impressions", "Wins", "Win Rate", "Render Rate", "Clicks", "CTR", "rCPM", "Avg. Winning Bid"].map((m) => (
                        <Checkbox key={m} label={m} />
                    ))}
                </div>
            </div>

            {/* Breakdown row */}
            <div className="flex">
                <div className="flex flex-1 gap-6 px-6 py-4">
                    <RowLabel>Breakdown:</RowLabel>
                    <div className="flex flex-wrap gap-x-8 gap-y-3">
                        {["Platform", "Position", "Ad Type", "Ad ID", "Demand Source", "Geo Region", "Geo: Country"].map((b) => (
                            <Checkbox key={b} label={b} />
                        ))}
                    </div>
                </div>
                <div className="flex w-56 items-center justify-center border-l border-secondary px-6">
                    <PinkDropdown label="More Options" />
                </div>
            </div>

            {/* Compare row */}
            <div className="flex items-center">
                <div className="flex flex-1 items-center gap-6 px-6 py-4">
                    <RowLabel>Compare:</RowLabel>
                    <div className="w-64">
                        <Input size="md" placeholder="input value" aria-label="Compare value" />
                    </div>
                    <PinkDropdown label={isEmpty ? "Select" : "Days Ago"} />
                </div>
                <button type="button" aria-label="Remove compare" className="flex w-56 items-center justify-end px-8 transition duration-100 ease-linear" style={{ color: PINK_DEEP }}>
                    <XClose className="size-5" aria-hidden="true" />
                </button>
            </div>

            {/* Chart type row */}
            <div className="flex flex-wrap items-center">
                <div className="flex flex-1 flex-wrap items-center gap-6 px-6 py-4">
                    <RowLabel>Chart Type:</RowLabel>
                    <div className="flex flex-wrap items-center gap-2">
                        {chartTypes.map(({ id, label, icon: Icon }) => {
                            const active = id === chartType;
                            return (
                                <button
                                    key={id}
                                    type="button"
                                    aria-pressed={active}
                                    className={cx(
                                        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold tracking-wide whitespace-nowrap uppercase transition duration-100 ease-linear",
                                        active ? "text-[#37b6b7]" : "hover:bg-secondary_hover",
                                    )}
                                    style={active ? { backgroundColor: "#e0f5f4" } : { color: PINK_DEEP }}
                                >
                                    <Icon className="size-5" aria-hidden="true" />
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                    {!isEmpty && (
                        <div className="flex items-center gap-3">
                            <span className="text-md font-semibold text-primary">Show Activity:</span>
                            <Toggle aria-label="Show activity" />
                        </div>
                    )}
                </div>
                <div className="flex w-56 items-center justify-center border-l border-secondary px-6 py-3">
                    <button
                        type="button"
                        disabled={isEmpty}
                        className={cx(
                            "rounded-full px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap uppercase transition duration-100 ease-linear",
                            isEmpty ? "cursor-not-allowed bg-secondary text-tertiary opacity-70" : "text-white",
                        )}
                        style={isEmpty ? undefined : { backgroundColor: PINK }}
                    >
                        Download .CSV
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ----------------------------------------------------- Saved queries view --- */

const savedHeaders = ["Impressions", "Report Date Range", "Created by", "Date Created", "Report Type"];
const savedRows: { saved: boolean }[] = [{ saved: true }, { saved: true }, { saved: true }, { saved: false }, { saved: false }, { saved: false }];

const SavedQueriesView = () => (
    <div className="px-6 py-6">
        <div className="mb-5 flex items-center gap-6">
            <span className="text-md font-semibold text-primary">Breakdown:</span>
            <Checkbox label="Saved" isSelected />
            <Checkbox label="Recommended" isSelected />
        </div>

        <table className="w-full border-separate border-spacing-0 overflow-hidden rounded-lg ring-1 ring-secondary">
            <thead style={{ backgroundColor: "#101828" }}>
                <tr>
                    {savedHeaders.map((h, i) => (
                        <th key={h} className={cx("px-6 py-4 text-left text-sm font-semibold text-white", i === 0 && "rounded-tl-lg")}>
                            <span className="flex items-center justify-between gap-2">
                                {h}
                                <SortIcon />
                            </span>
                        </th>
                    ))}
                    <th className="w-20 rounded-tr-lg" />
                </tr>
            </thead>
            <tbody>
                {savedRows.map((row, i) => (
                    <tr key={i} className={cx(i % 2 === 1 && "bg-secondary")}>
                        <td className="border-b border-secondary px-6 py-4 text-sm font-medium" style={{ color: TEAL }}>
                            Report Name
                        </td>
                        {savedHeaders.slice(1).map((_, j) => (
                            <td key={j} className="border-b border-secondary px-6 py-4 text-sm text-secondary">
                                Data
                            </td>
                        ))}
                        <td className="border-b border-secondary px-6 py-4">
                            {row.saved ? (
                                <button type="button" aria-label="Delete" className="flex size-8 items-center justify-center rounded-full text-white transition duration-100 ease-linear" style={{ backgroundColor: "#e5484d" }}>
                                    <XClose className="size-4" aria-hidden="true" />
                                </button>
                            ) : (
                                <button type="button" aria-label="Add to saved" className="flex size-8 items-center justify-center rounded-full text-white transition duration-100 ease-linear" style={{ backgroundColor: PINK }}>
                                    <Plus className="size-4" aria-hidden="true" />
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/* ------------------------------------------------------- Save query modal --- */

const SaveQueryModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-overlay p-4">
        <div className="w-full max-w-md rounded-2xl bg-primary p-6 shadow-xl">
            <div className="flex items-start justify-between">
                <div className="relative flex size-12 items-center justify-center rounded-xl text-white" style={{ background: `linear-gradient(135deg, ${S2}, ${PINK})` }}>
                    <Folder className="size-6" aria-hidden="true" />
                </div>
                <button type="button" aria-label="Close" className="text-fg-quaternary transition duration-100 ease-linear hover:text-fg-tertiary">
                    <XClose className="size-6" aria-hidden="true" />
                </button>
            </div>

            <div className="mt-4">
                <h2 className="text-md font-bold text-primary">Save Query</h2>
                <p className="text-sm text-tertiary">Please enter a name for this project.</p>
            </div>

            <div className="mt-5 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-secondary" htmlFor="query-name">
                    Query Name
                </label>
                <Input id="query-name" size="md" placeholder="e.g. Website query" aria-label="Query Name" />
            </div>

            <RadioGroup defaultValue="update" aria-label="Date handling" className="mt-4 flex flex-row gap-6">
                <RadioButton value="update" label="Update Date Range on Load" />
                <RadioButton value="exact" label="Save Exact Dates" />
            </RadioGroup>

            <div className="mt-4">
                <Checkbox label="Private Report" />
            </div>

            <div className="mt-6 flex gap-3">
                <Button color="primary-pink" size="lg" className="rounded-full">
                    Continue
                </Button>
                <Button color="secondary" size="lg" className="rounded-full">
                    Cancel
                </Button>
            </div>
        </div>
    </div>
);

/* ---------------------------------------------------------------- Screen --- */

export const PerformanceInsightsScreen = ({ chartType = "line", tab = "new", showSaveModal = false }: PerformanceInsightsScreenProps) => {
    const isEmpty = tab === "new" && chartType === null;
    const canSave = !isEmpty;

    const renderChart = () => {
        switch (chartType) {
            case "line":
            case "stacked-line":
                return <LineChart />;
            case "table":
                return <DataTable />;
            case "bar":
                return <BarChart />;
            case "stacked-bar":
                return <StackedBarChart />;
            case "pie":
                return <PieChart />;
            default:
                return null;
        }
    };

    return (
        <div className="flex min-h-screen bg-secondary">
            <GlobalNav defaultActiveKey="performance insights" />

            <main className="relative flex-1 overflow-x-hidden bg-primary">
                {/* App header */}
                <header className="flex items-center justify-between border-b border-secondary px-8 py-6">
                    <h1 className="text-display-xs font-semibold text-primary">Your Account</h1>
                    <button
                        type="button"
                        aria-label="Account options"
                        className="inline-flex size-9 items-center justify-center rounded-full transition duration-100 ease-linear hover:bg-[#fdf2f7]"
                        style={{ color: "#DA6EA3" }}
                    >
                        <ChevronDown className="size-6" aria-hidden="true" />
                    </button>
                </header>

                {/* Tab strip */}
                <div className="flex items-center border-b border-secondary">
                    <div className="flex">
                        {[
                            { key: "new" as const, label: "New Query" },
                            { key: "saved" as const, label: "Save Queries" },
                        ].map(({ key, label }) => {
                            const active = key === tab;
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    aria-pressed={active}
                                    className={cx("border-r border-secondary px-12 py-4 text-md font-semibold transition duration-100 ease-linear", active && "bg-[#e0f5f4]")}
                                    style={{ color: TEAL }}
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="ml-auto flex items-center gap-3 px-6">
                        <button
                            type="button"
                            disabled={!canSave}
                            className={cx(
                                "rounded-full px-5 py-2 text-sm font-semibold tracking-wide uppercase transition duration-100 ease-linear",
                                canSave ? "text-white" : "cursor-not-allowed bg-secondary text-tertiary opacity-70",
                            )}
                            style={canSave ? { backgroundColor: PINK } : undefined}
                        >
                            Save Query
                        </button>
                        <span className="flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-semibold tracking-wide text-tertiary uppercase">
                            <ChevronUp className="size-4" aria-hidden="true" /> Collapse
                        </span>
                    </div>
                </div>

                {/* Body */}
                {tab === "saved" ? (
                    <SavedQueriesView />
                ) : (
                    <>
                        <ConfigPanel chartType={chartType} />
                        {renderChart()}
                    </>
                )}

                {showSaveModal && <SaveQueryModal />}
            </main>
        </div>
    );
};

export default PerformanceInsightsScreen;
