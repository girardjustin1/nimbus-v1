import type { ReactNode } from "react";
import { BarChart10, ChevronDown, ChevronRight, ChevronSelectorVertical, HelpCircle, Plus, Table as TableIcon, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Toggle } from "@/components/base/toggle/toggle";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { cx } from "@/utils/cx";

/**
 * Nimbus Benchmarks (Reporting → nimbus benchmarks).
 *
 * Rebuilds the reference screens (reference/screens - batch 3/Nimbus-Pro-Benchmarks):
 * a "Your App" benchmarking tool that compares an app's performance against the
 * Nimbus Exchange. The screen has several distinct states, selected via the
 * `state` prop and surfaced as separate Storybook stories:
 *
 *  - "config"      the comparison-config multi-column selector panel
 *  - "results"     the summary metric row + multi-series line chart + benchmarks table
 *  - "empty"       results with a "cannot display app data" tooltip and "-" placeholders
 *  - "leaderboard" the Nimbus Leaderboard "Top Performers" ranked lists
 *
 * Charts are hand-rolled inline SVG (multi-series lines + gridlines + axes),
 * adapted from the Sparkline pattern in key-metrics-dashboard.tsx — at this size
 * a bespoke path matches the reference more closely and stays dependency-free.
 * The chart tooltip and the empty-state tooltip are absolutely-positioned HTML
 * cards over a relative chart container.
 */

/* ----------------------------------------------------------- Accent colors --- */

const TEAL = "#37b6b7";
const CYAN = "#2ec4e6";
const PINK = "#c01574";
const PINK_MID = "#dc4f92";
const PINK_LIGHT = "#ef8fbc";
const OLIVE = "#a6c13c"; // yellow-green (eCPM series)
const BLUE = "#2e90d8"; // blue (win % series)
const RED = "#e5484d"; // red (CTR series)

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/* --------------------------------------------------------------- Chart data --- */

const makeSeries = (base: number, top: number, amp: number, seed: number): number[] => {
    const n = 53;
    const out: number[] = [];
    let s = seed;
    const rand = () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
    for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const trend = base + (top - base) * t;
        const noise = (rand() - 0.5) * amp;
        out.push(Math.round(trend + noise));
    }
    return out;
};

interface Series {
    data: number[];
    color: string;
}

const chartSeries: Series[] = [
    { data: makeSeries(560, 790, 45, 7), color: PINK }, // Series 1 (top, darkest magenta)
    { data: makeSeries(310, 550, 40, 31), color: PINK_LIGHT }, // Series 2 (light pink, middle)
    { data: makeSeries(200, 440, 45, 53), color: PINK_MID }, // Series 3 (magenta, bottom)
];

/* --------------------------------------------------------------- Line chart --- */

const CW = 920;
const CH = 470;
const PL = 58;
const PR = 14;
const PT = 20;
const PB = 46;
const PLOT_W = CW - PL - PR;
const PLOT_H = CH - PT - PB;
const Y_MAX = 1000;
const Y_TICKS = [0, 200, 400, 600, 800, 1000];

const xAt = (i: number, n: number) => PL + (i * PLOT_W) / (n - 1);
const yAt = (v: number) => PT + PLOT_H * (1 - v / Y_MAX);

const linePath = (data: number[]): string => {
    const n = data.length;
    return "M" + data.map((v, i) => `${xAt(i, n).toFixed(1)},${yAt(v).toFixed(1)}`).join(" L");
};

const BenchmarkChart = () => {
    const n = chartSeries[0].data.length;
    return (
        <svg viewBox={`0 0 ${CW} ${CH}`} className="h-[470px] w-full" role="img" aria-label="Active users benchmark chart">
            {/* faint vertical gridlines (weekly) */}
            {Array.from({ length: n }).map((_, i) => (
                <line key={`v${i}`} x1={xAt(i, n)} y1={PT} x2={xAt(i, n)} y2={PT + PLOT_H} stroke="#f0f0f1" strokeWidth={1} />
            ))}

            {/* horizontal gridlines + y labels */}
            {Y_TICKS.map((t) => (
                <g key={`y${t}`}>
                    <line x1={PL} y1={yAt(t)} x2={PL + PLOT_W} y2={yAt(t)} stroke="#e9eaeb" strokeWidth={1} />
                    <text x={PL - 12} y={yAt(t) + 4} textAnchor="end" className="fill-tertiary text-[13px]">
                        {t.toLocaleString()}
                    </text>
                </g>
            ))}

            {/* series lines */}
            {chartSeries.map((s, i) => (
                <path key={i} d={linePath(s.data)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            ))}

            {/* x axis month labels */}
            {MONTHS.map((m, i) => (
                <text key={m} x={PL + (i * PLOT_W) / (MONTHS.length - 1)} y={CH - 22} textAnchor="middle" className="fill-tertiary text-[13px]">
                    {m}
                </text>
            ))}
            <text x={PL + PLOT_W / 2} y={CH - 4} textAnchor="middle" className="fill-tertiary text-[12px]">
                Month
            </text>

            {/* y axis title */}
            <text x={16} y={PT + PLOT_H / 2} textAnchor="middle" transform={`rotate(-90 16 ${PT + PLOT_H / 2})`} className="fill-tertiary text-[12px]">
                Active users
            </text>
        </svg>
    );
};

const ChartLegend = () => (
    <div className="flex items-center gap-5 text-sm text-tertiary">
        {[
            { label: "Series 1", color: PINK },
            { label: "Series 2", color: PINK_LIGHT },
            { label: "Series 3", color: PINK_MID },
        ].map((s) => (
            <span key={s.label} className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color }} aria-hidden="true" />
                {s.label}
            </span>
        ))}
    </div>
);

/* ----------------------------------------------------------- Chart tooltip --- */

const chartTooltipRows: { label: string; value: string; color: string }[] = [
    { label: "NIMBUS ECPM", value: "$18.66", color: OLIVE },
    { label: "MY ECPM:", value: "$14.98", color: OLIVE },
    { label: "NIMBUS WIN %", value: "45%", color: BLUE },
    { label: "MY WIN %:", value: "38%", color: BLUE },
    { label: "NIMBUS CTR", value: "40%", color: RED },
    { label: "MY CTR:", value: "37%", color: RED },
];

const ChartTooltipCard = () => (
    <div className="absolute top-[16%] left-[45%] w-[330px] rounded-xl bg-primary px-6 py-4 shadow-lg ring-1 ring-secondary_alt">
        <p className="mb-1 text-md font-semibold text-primary">Monday, June 10, 2020:</p>
        <dl>
            {chartTooltipRows.map((r) => (
                <div key={r.label} className="flex items-center justify-between border-b border-secondary py-2.5 last:border-b-0">
                    <dt className="text-sm font-medium tracking-wide text-tertiary uppercase">{r.label}</dt>
                    <dd className="text-md font-bold" style={{ color: r.color }}>
                        {r.value}
                    </dd>
                </div>
            ))}
        </dl>
        {/* pointer */}
        <div className="absolute -bottom-2 left-1/2 size-4 -translate-x-1/2 rotate-45 rounded-[2px] bg-primary ring-1 ring-secondary_alt" aria-hidden="true" />
    </div>
);

/* --------------------------------------------------------- Summary metrics --- */

interface SummaryMetric {
    label: string;
    value: string;
    marker: string;
    filled: boolean;
    /** Render the value as a "-" placeholder with a help icon (empty state). */
    placeholder?: boolean;
}

const summaryMetrics: SummaryMetric[] = [
    { label: "NIMBUS ECPM", value: "$15.91", marker: OLIVE, filled: false },
    { label: "MY ECPM", value: "$17.80", marker: OLIVE, filled: true },
    { label: "NIMBUS WIN%", value: "80%", marker: BLUE, filled: false },
    { label: "MY WIN%", value: "60%", marker: BLUE, filled: true },
    { label: "NIMBUS CTR", value: "40%", marker: RED, filled: false },
    { label: "MY CTR", value: "39%", marker: RED, filled: true },
];

const MarkerDot = ({ color, filled }: { color: string; filled: boolean }) => (
    <svg viewBox="0 0 12 12" className="size-3 shrink-0" aria-hidden="true">
        <circle cx={6} cy={6} r={4.5} fill={filled ? color : "none"} stroke={color} strokeWidth={1.5} />
    </svg>
);

const SummaryRow = ({ emptyForMine = false }: { emptyForMine?: boolean }) => (
    <div className="flex flex-wrap items-stretch">
        {summaryMetrics.map((m, i) => {
            const isMine = m.label.startsWith("MY");
            const showPlaceholder = emptyForMine && isMine;
            return (
                <div key={m.label} className={cx("flex flex-col gap-1 px-6 py-3", i > 0 && "border-l border-secondary")}>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-tertiary uppercase">
                        <MarkerDot color={m.marker} filled={m.filled} />
                        {m.label}
                    </span>
                    {showPlaceholder ? (
                        <span className="inline-flex items-center gap-1.5">
                            <span className="text-display-xs font-bold text-tertiary">-</span>
                            <HelpCircle className="size-4 text-[#DA6EA3]" aria-label="Why is this empty?" />
                        </span>
                    ) : (
                        <span className="text-display-xs font-bold" style={{ color: TEAL }}>
                            {m.value}
                        </span>
                    )}
                </div>
            );
        })}
    </div>
);

const EmptyStateTooltipCard = () => (
    <div className="absolute top-full left-4 z-10 mt-1 w-[300px] rounded-lg bg-[#0c111d] px-4 py-3 text-sm text-white shadow-lg">
        We cannot display app data because your filters include a demand source that is not connected to your ad stack.
        <div className="absolute -top-1.5 left-8 size-3 rotate-45 bg-[#0c111d]" aria-hidden="true" />
    </div>
);

/* ---------------------------------------------------------------- Config bar --- */

const DateColumn = ({ date }: { date: string }) => (
    <div className="flex flex-col justify-center gap-0.5 border-r border-secondary px-6 py-3">
        <span className="text-xs text-tertiary">Start Date:</span>
        <span className="text-md font-bold text-primary">{date}</span>
    </div>
);

const DropdownButton = ({ label }: { label: string }) => (
    <button
        type="button"
        className="flex items-center justify-between gap-6 border-r border-secondary px-6 py-3 text-md font-bold text-[#DA6EA3] transition duration-100 ease-linear hover:bg-[#fdf2f7]"
    >
        {label}
        <ChevronDown className="size-5" aria-hidden="true" />
    </button>
);

const LeaderboardPill = () => (
    <button
        type="button"
        className="rounded-full px-6 py-2.5 text-sm font-semibold tracking-wide text-white uppercase shadow-xs transition duration-100 ease-linear hover:brightness-95"
        style={{ backgroundColor: CYAN }}
    >
        Nimbus Leaderboard
    </button>
);

const ConfigBar = () => (
    <div className="flex items-stretch justify-between border-b border-secondary bg-primary">
        <div className="flex items-stretch">
            <DateColumn date="June 1, 2020" />
            <DateColumn date="June 13, 2020" />
            <DropdownButton label="Group By" />
            <DropdownButton label="Quick Date Select" />
        </div>
        <div className="flex items-center pr-8 pl-6">
            <LeaderboardPill />
        </div>
    </div>
);

/* ------------------------------------------------------------- Filter rows --- */

const MetricCheckboxRow = () => (
    <div className="flex items-center gap-6 border-b border-secondary bg-primary px-8 py-3">
        <Checkbox defaultSelected label="eCPM" />
        <Checkbox defaultSelected label="Wins" />
        <Checkbox defaultSelected label="CTR" />
    </div>
);

const FilterDataRow = () => (
    <div className="flex items-center gap-5 border-b border-secondary bg-primary px-8 py-3">
        <span className="text-md font-semibold text-primary">Totals only:</span>
        <Toggle aria-label="Totals only" />

        <span className="ml-2 text-md font-semibold text-primary">Filter Data:</span>
        <Button size="sm" color="link-color" iconLeading={Plus} className="font-semibold uppercase">
            Add
        </Button>

        <div className="flex items-center gap-5">
            <Checkbox defaultSelected label="Demand Source" />
            <Checkbox defaultSelected label="Ad Type" />
            <Checkbox defaultSelected label="Ad ID" />
            <Checkbox defaultSelected label="Platform" />
        </div>

        <div className="ml-auto flex items-center gap-4">
            <button type="button" aria-label="Clear filters" className="text-[#DA6EA3] transition duration-100 ease-linear hover:text-[#c01574]">
                <XClose className="size-5" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Table view" className="text-[#DA6EA3] transition duration-100 ease-linear hover:text-[#c01574]">
                <TableIcon className="size-5" aria-hidden="true" />
            </button>
            <button type="button" aria-label="Bar chart view" className="text-[#c01574]">
                <BarChart10 className="size-5" aria-hidden="true" />
            </button>
        </div>
    </div>
);

/* ------------------------------------------------------ Comparison config --- */

const dimensions = [
    { label: "Platform", active: false },
    { label: "Ad Type", active: false },
    { label: "Ad ID", active: false },
    { label: "Demand Resource", active: true },
];

const comparisonOptions = [
    {
        title: "Entire Nimbus Exchange",
        desc: "Compares your app's performance against the performance of the entire Nimbus Exchange.",
    },
    {
        title: "My Ad Stack",
        desc: "Include only your app's demand benchmarks sources when calculating exchange.",
    },
    {
        title: "Individual Partners",
        desc: "Select specific partners to see how they perform in the Exchange overall.",
    },
];

const partnersA = ["Acuity", "Admixer", "APS", "Baidu", "Chartboost", "Conversant", "Dataseat"];
const partnersB = ["A9", "Ad Colony", "AdView", "Arity", "Beachfront", "Chocolate", "Criteo"];

const SelectorRow = ({ children, className }: { children: ReactNode; className?: string }) => (
    <button
        type="button"
        className={cx(
            "flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition duration-100 ease-linear hover:bg-secondary_hover",
            className,
        )}
    >
        {children}
        <ChevronRight className="size-5 shrink-0 text-[#DA6EA3]" aria-hidden="true" />
    </button>
);

const ComparisonConfigPanel = () => (
    <div className="bg-primary">
        <div className="grid grid-cols-1 lg:grid-cols-4">
            {/* Column 1: dimensions */}
            <div className="border-secondary lg:border-r">
                {dimensions.map((d) => (
                    <SelectorRow key={d.label} className={cx(d.active && "bg-[#e6f6f6]")}>
                        <span className={cx("text-md", d.active ? "font-semibold text-primary" : "text-secondary")}>{d.label}</span>
                    </SelectorRow>
                ))}
            </div>

            {/* Column 2: comparison options */}
            <div className="border-secondary lg:border-r">
                {comparisonOptions.map((o) => (
                    <SelectorRow key={o.title} className="items-start">
                        <span className="flex flex-col gap-1">
                            <span className="text-md font-semibold text-primary">{o.title}</span>
                            <span className="max-w-[280px] text-sm text-tertiary">{o.desc}</span>
                        </span>
                    </SelectorRow>
                ))}
            </div>

            {/* Column 3: partner list A */}
            <div className="border-secondary py-2 lg:border-r">
                {partnersA.map((p) => (
                    <div key={p} className="px-6 py-3 text-md text-secondary">
                        {p}
                    </div>
                ))}
            </div>

            {/* Column 4: partner list B */}
            <div className="py-2">
                {partnersB.map((p) => (
                    <div key={p} className="px-6 py-3 text-md text-secondary">
                        {p}
                    </div>
                ))}
            </div>
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-3 border-t border-secondary px-8 py-4">
            <button
                type="button"
                className="rounded-full bg-secondary px-6 py-2.5 text-sm font-semibold tracking-wide text-tertiary uppercase ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary_hover"
            >
                Cancel
            </button>
            <button
                type="button"
                className="rounded-full px-8 py-2.5 text-sm font-semibold tracking-wide text-white uppercase shadow-xs transition duration-100 ease-linear hover:brightness-95"
                style={{ backgroundColor: "#DA6EA3" }}
            >
                Save
            </button>
        </div>
    </div>
);

/* ------------------------------------------------------- Benchmarks table --- */

interface BenchmarkRow {
    date: string;
    app: string;
    win: string;
    ctr: string;
    ecpm: string;
}

const benchmarkRows: BenchmarkRow[] = [
    { date: "2019-06-07", app: "Nimbus", win: "80%", ctr: "40%", ecpm: "$10.18" },
    { date: "2019-06-07", app: "Your App", win: "60%", ctr: "39%", ecpm: "$9.98" },
    { date: "2019-06-08", app: "Nimbus", win: "80%", ctr: "40%", ecpm: "$9.91" },
    { date: "2019-06-08", app: "Your App", win: "60%", ctr: "39%", ecpm: "$13.69" },
    { date: "2019-06-09", app: "Nimbus", win: "80%", ctr: "40%", ecpm: "$1.84" },
    { date: "2019-06-09", app: "Your App", win: "60%", ctr: "39%", ecpm: "$12.95" },
];

const tableColumns = ["Date", "App", "Win%", "CTR", "eCPM"];

export const BenchmarksTable = () => (
    <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
            <thead>
                <tr className="bg-[#101828]">
                    {tableColumns.map((col) => (
                        <th key={col} scope="col" className="px-6 py-5 text-md font-semibold text-white">
                            <span className="flex items-center justify-between gap-4">
                                {col}
                                <ChevronSelectorVertical className="size-4" style={{ color: TEAL }} aria-hidden="true" />
                            </span>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {benchmarkRows.map((row, i) => (
                    <tr key={i} className={cx("border-b border-secondary", i % 2 === 1 && "bg-[#FCFAF9]")}>
                        <td className="px-6 py-5 text-md text-primary">{row.date}</td>
                        <td className="px-6 py-5 text-md text-secondary">{row.app}</td>
                        <td className="px-6 py-5 text-md text-secondary">{row.win}</td>
                        <td className="px-6 py-5 text-md text-secondary">{row.ctr}</td>
                        <td className="px-6 py-5 text-md text-secondary">{row.ecpm}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/* -------------------------------------------------------------- Leaderboard --- */

const shareOfVoice: { rank: number; name: string; value: string }[] = [
    { rank: 1, name: "Amazon", value: "21%" },
    { rank: 2, name: "UnrulyX", value: "15%" },
    { rank: 3, name: "Magnite", value: "12%" },
    { rank: 4, name: "Facebook", value: "9%" },
    { rank: 5, name: "PubMatic", value: "8%" },
    { rank: 6, name: "PubMatic", value: "7%" },
    { rank: 7, name: "PubMatic", value: "6%" },
    { rank: 8, name: "PubMatic", value: "5%" },
    { rank: 9, name: "PubMatic", value: "4%" },
    { rank: 10, name: "PubMatic", value: "3%" },
    { rank: 11, name: "PubMatic", value: "2%" },
    { rank: 12, name: "PubMatic", value: "1%" },
];

const ecpmRank: { rank: number; name: string; value: string }[] = [
    { rank: 1, name: "Amazon", value: "$27" },
    { rank: 2, name: "UnrulyX", value: "$19" },
    { rank: 3, name: "Magnite", value: "$18" },
    { rank: 4, name: "Facebook", value: "$12" },
    { rank: 5, name: "PubMatic", value: "$9" },
    { rank: 6, name: "PubMatic", value: "$8" },
    { rank: 7, name: "PubMatic", value: "$7" },
    { rank: 8, name: "PubMatic", value: "$6" },
    { rank: 9, name: "PubMatic", value: "$5" },
    { rank: 10, name: "PubMatic", value: "$4" },
    { rank: 11, name: "PubMatic", value: "$3" },
    { rank: 12, name: "PubMatic", value: "$2" },
];

const RankList = ({
    title,
    rows,
    valueColor,
}: {
    title: string;
    rows: { rank: number; name: string; value: string }[];
    valueColor: string;
}) => (
    <div className="flex-1">
        <h3 className="mb-2 text-md font-semibold text-tertiary">{title}</h3>
        <dl>
            {rows.map((r) => (
                <div key={r.rank} className="flex items-center gap-4 border-b border-secondary py-2.5">
                    <span className="w-6 text-sm font-bold" style={{ color: BLUE }}>
                        {r.rank}
                    </span>
                    <dt className="flex-1 text-md text-secondary">{r.name}</dt>
                    <dd className="text-md font-bold" style={{ color: valueColor }}>
                        {r.value}
                    </dd>
                </div>
            ))}
        </dl>
    </div>
);

const LeaderboardTabs = () => (
    <div className="flex items-stretch border-b border-secondary bg-primary">
        <button type="button" className="border-r border-secondary px-10 py-6 text-lg font-semibold text-[#DA6EA3]">
            Nimnbus Performance
        </button>
        <button type="button" className="border-r border-secondary bg-[#e6f6f6] px-10 py-6 text-lg font-semibold" style={{ color: TEAL }}>
            Nimbus Leaderboard
        </button>
    </div>
);

const LeaderboardConfigBar = () => (
    <div className="flex items-stretch border-b border-secondary bg-primary">
        <DateColumn date="June 7, 2020" />
        <DateColumn date="June 13, 2020" />
        <DropdownButton label="Quick Date Select" />
    </div>
);

/* --------------------------------------------------------------- The screen --- */

type BenchmarksState = "config" | "results" | "empty" | "leaderboard";

const AppHeader = () => (
    <header className="flex items-center justify-between border-b border-secondary bg-primary px-8 py-6">
        <h1 className="text-display-xs font-semibold text-primary">Your App</h1>
        <button
            type="button"
            aria-label="Account options"
            className="inline-flex size-9 items-center justify-center rounded-full text-[#DA6EA3] transition duration-100 ease-linear hover:bg-[#fdf2f7]"
        >
            <ChevronDown className="size-6" aria-hidden="true" />
        </button>
    </header>
);

export const NimbusBenchmarksScreen = ({ state = "results" }: { state?: BenchmarksState }) => {
    return (
        <div className="flex min-h-screen bg-secondary">
            <GlobalNav defaultActiveKey="nimbus benchmarks" />

            <main className="flex-1 overflow-x-hidden">
                <AppHeader />

                {state === "leaderboard" ? (
                    <>
                        <LeaderboardTabs />
                        <LeaderboardConfigBar />
                        <div className="px-8 py-8">
                            <h2 className="mb-8 text-display-xs font-semibold text-primary">Top Performers in the Nimbus Exchange</h2>
                            <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
                                <RankList title="Share of Voice:" rows={shareOfVoice} valueColor={BLUE} />
                                <RankList title="eCPM:" rows={ecpmRank} valueColor={OLIVE} />
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <ConfigBar />
                        <MetricCheckboxRow />

                        {state === "empty" ? (
                            <div className="relative">
                                <FilterDataRow />
                                <EmptyStateTooltipCard />
                            </div>
                        ) : (
                            <FilterDataRow />
                        )}

                        {state === "config" ? (
                            <ComparisonConfigPanel />
                        ) : (
                            <>
                                <SummaryRow emptyForMine={state === "empty"} />

                                <div className="border-y border-secondary bg-primary px-8 pt-4 pb-8">
                                    <div className="mb-2 flex justify-end">
                                        <ChartLegend />
                                    </div>
                                    <div className="relative">
                                        <BenchmarkChart />
                                        <ChartTooltipCard />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Benchmarks table (shown under every non-leaderboard state) */}
                        <BenchmarksTable />
                    </>
                )}
            </main>
        </div>
    );
};

export default NimbusBenchmarksScreen;

/** Ranked definition-list rows from the leaderboard screen. */
export const BenchmarkRankExamples = () => (
    <div className="flex flex-col gap-8 md:flex-row">
        <RankList title="Share of Voice:" rows={shareOfVoice} valueColor={BLUE} />
        <RankList title="eCPM:" rows={ecpmRank} valueColor={OLIVE} />
    </div>
);
