import { type ReactNode, useState } from "react";
import { Calendar, Download01, FilterLines, Lock01, Plus, SearchLg, XClose } from "@untitledui/icons";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { type Campaign, campaigns, compact, dailyRevenue, dimensionGroups, usd } from "./das-data";
import { DasShell, DeliveryBar, PINK, TEAL } from "./das-shell";

/**
 * Deal Activation System → Reporting concepts.
 *
 * Kickoff: Performance Insights is checkbox walls; DAS breakdowns read as a confusing
 * "Open Marketplace" wall; keywords would add unbounded dimensions. Charter guardrail:
 * the dashboard shows aggregate keyword metrics (keyword-targeted yes/no + matched
 * keyword count); per-keyword breakdowns only via CSV/API; no per-keyword charts.
 *   A. DAS overview — a purpose-built DAS reporting home: DAS vs OMP clearly split,
 *      campaign delivery, keyword-targeting aggregates, CSV hand-off.
 *   B. Query builder — metrics and breakdowns added on the fly as chips from a
 *      searchable picker instead of ~45 checkboxes.
 */

const OMP_GRAY = "#98A2B3";
const axisProps = { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#667085" } } as const;
const gridProps = { vertical: false, className: "[&_line]:stroke-border-secondary" } as const;

/* ------------------------------------------------------------ Shared --- */

const DateRange = ({ label = "Last 14 days", range = "Sep 5 – Sep 18, 2026" }: { label?: string; range?: string }) => (
    <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary shadow-xs ring-1 ring-primary ring-inset hover:bg-primary_hover"
    >
        <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
        {label} · {range} <span className="font-normal text-tertiary">UTC</span>
    </button>
);

const Tile = ({ label, value, sub }: { label: string; value: string; sub?: ReactNode }) => (
    <div className="flex flex-col gap-1 rounded-xl p-4 ring-1 ring-secondary">
        <span className="text-sm text-tertiary">{label}</span>
        <span className="text-display-xs font-semibold text-primary">{value}</span>
        {sub && <span className="text-xs text-tertiary">{sub}</span>}
    </div>
);

const Card = ({
    title,
    description,
    trailing,
    children,
    className,
}: {
    title: string;
    description?: ReactNode;
    trailing?: ReactNode;
    children: ReactNode;
    className?: string;
}) => (
    <section className={cx("flex flex-col gap-4 rounded-2xl p-5 ring-1 ring-secondary", className)}>
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                {description && <p className="text-sm text-tertiary">{description}</p>}
            </div>
            {trailing}
        </div>
        {children}
    </section>
);

/* =========================================================== Concept A === */

const dasTotal = dailyRevenue.reduce((s, d) => s + d.das, 0);
const ompTotal = dailyRevenue.reduce((s, d) => s + d.omp, 0);

const KeywordAggregateCell = ({ c }: { c: Campaign }) =>
    c.keywords.length ? (
        <span className="text-sm text-secondary">
            Yes · <span className="font-semibold text-primary">{c.keywords.length}</span> keyword{c.keywords.length === 1 ? "" : "s"} ({c.match})
        </span>
    ) : (
        <span className="text-sm text-quaternary">No</span>
    );

export const DasOverview = () => (
    <DasShell
        navKey="performance insights"
        concept={{
            label: "Concept A",
            title: "DAS overview: a purpose-built reporting home",
            notes: [
                "DAS revenue is split from Open Marketplace in every view, which fixes the “Open Marketplace / Open Marketplace” rows seen in PI.",
                "Keyword reporting follows the charter guardrail: targeted yes/no plus matched keyword count on screen, per-keyword detail as a CSV.",
                "Delivery (spend vs budget vs flight) links reporting back to the promise made to the advertiser.",
            ],
        }}
    >
        <div className="flex flex-col gap-6 px-8 py-8">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-display-xs font-semibold text-primary">Deal Activation performance</h2>
                    <p className="text-md text-tertiary">Sourced campaigns across all apps in this account.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DateRange />
                    <Button color="secondary" iconLeading={Download01}>
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Tile label="DAS revenue" value={usd(dasTotal)} sub="Last 14 days" />
                <Tile
                    label="Share of total revenue"
                    value={`${Math.round((dasTotal / (dasTotal + ompTotal)) * 100)}%`}
                    sub={`Open Marketplace ${usd(ompTotal)}`}
                />
                <Tile label="DAS impressions" value={compact(campaigns.reduce((s, c) => s + c.impressions, 0))} sub="Fallback included" />
                <Tile
                    label="Keyword-targeted campaigns"
                    value={`${campaigns.filter((c) => c.keywords.length).length} of ${campaigns.length}`}
                    sub="Aggregate only. Per-keyword detail via CSV"
                />
            </div>

            <Card
                title="Revenue by day"
                description="DAS campaigns vs Open Marketplace (programmatic). Hourly front-loaded pacing makes intraday charts spiky; daily totals are steady."
            >
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dailyRevenue} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                            <CartesianGrid {...gridProps} />
                            <XAxis dataKey="day" {...axisProps} />
                            <YAxis {...axisProps} width={56} tickFormatter={(v: number) => `$${v / 1000}k`} />
                            <Tooltip content={<ChartTooltipContent />} cursor={{ className: "fill-secondary" }} />
                            <Bar dataKey="das" name="DAS campaigns" stackId="rev" fill={TEAL} radius={[0, 0, 0, 0]} />
                            <Bar dataKey="omp" name="Open Marketplace" stackId="rev" fill={OMP_GRAY} fillOpacity={0.45} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 text-sm text-secondary">
                    {[
                        { label: "DAS campaigns", color: TEAL, opacity: 1 },
                        { label: "Open Marketplace", color: OMP_GRAY, opacity: 0.45 },
                    ].map((s) => (
                        <span key={s.label} className="inline-flex items-center gap-2">
                            <span className="size-2.5 rounded-full" style={{ backgroundColor: s.color, opacity: s.opacity }} aria-hidden="true" />
                            {s.label}
                        </span>
                    ))}
                </div>
            </Card>

            <Card
                title="Campaign delivery"
                description="Is each campaign keeping its promise? The tick marks where spend should be today."
                trailing={
                    <Button color="secondary" size="sm" iconLeading={Download01}>
                        Per-keyword CSV
                    </Button>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left">
                        <thead>
                            <tr className="border-b border-secondary">
                                {["Campaign", "Delivery", "Revenue (flight to date)", "Impressions", "eCPM", "Keyword-targeted", "Units"].map((h) => (
                                    <th key={h} className="px-3 py-2.5 text-xs font-semibold text-tertiary">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns
                                .filter((c) => c.status !== "Scheduled")
                                .map((c) => (
                                    <tr key={c.id} className="border-b border-secondary last:border-b-0">
                                        <td className="px-3 py-3">
                                            <span className="block text-sm font-semibold" style={{ color: TEAL }}>
                                                {c.name}
                                            </span>
                                            <span className="block text-xs text-tertiary">{c.dealName}</span>
                                        </td>
                                        <td className="w-56 px-3 py-3">
                                            <DeliveryBar campaign={c} />
                                        </td>
                                        <td className="px-3 py-3 text-sm font-semibold text-primary">{usd(c.rule === "Fallback" ? 1480 : c.spend)}</td>
                                        <td className="px-3 py-3 text-sm text-secondary">{compact(c.impressions)}</td>
                                        <td className="px-3 py-3 text-sm text-secondary">{c.rule === "Fallback" ? usd(1.82, 2) : usd(c.ecpm, 2)}</td>
                                        <td className="px-3 py-3">
                                            <KeywordAggregateCell c={c} />
                                        </td>
                                        <td className="px-3 py-3 text-sm text-tertiary">{c.adUnits.join(", ")}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <p className="flex items-center gap-2 text-sm text-tertiary">
                    <Lock01 className="size-4" aria-hidden="true" /> Per-keyword performance is available as a CSV export or through the API, not as charts, so
                    reports stay fast however many keywords you use.
                </p>
            </Card>
        </div>
    </DasShell>
);

/* =========================================================== Concept B === */

const Chip = ({ children, tone = "teal", onRemove }: { children: ReactNode; tone?: "teal" | "pink" | "gray"; onRemove?: boolean }) => {
    const styles = {
        teal: { color: "#1F7F80", backgroundColor: `${TEAL}24` },
        pink: { color: "#A94579", backgroundColor: `${PINK}24` },
        gray: { color: "#344054", backgroundColor: "#F2F4F7" },
    }[tone];
    return (
        <span className="inline-flex items-center gap-1 rounded-lg py-1 pr-1.5 pl-2.5 text-sm font-medium" style={styles}>
            {children}
            {onRemove !== false && (
                <button type="button" aria-label="Remove" className="rounded p-0.5 hover:bg-black/5">
                    <XClose className="size-3.5" aria-hidden="true" />
                </button>
            )}
        </span>
    );
};

const AddChip = ({ label, onPress, active }: { label: string; onPress?: () => void; active?: boolean }) => (
    <button
        type="button"
        onClick={onPress}
        className={cx(
            "inline-flex items-center gap-1 rounded-lg border border-dashed px-2.5 py-1 text-sm font-semibold transition-colors",
            active ? "bg-secondary" : "hover:bg-primary_hover",
        )}
        style={{ color: PINK, borderColor: `${PINK}80` }}
    >
        <Plus className="size-3.5" aria-hidden="true" /> {label}
    </button>
);

const BuilderRow = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="grid grid-cols-1 items-start gap-2 border-b border-secondary py-3 last:border-b-0 md:grid-cols-[120px_1fr]">
        <span className="pt-1 text-sm font-semibold text-secondary">{label}</span>
        <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
);

const dimensionCount = dimensionGroups.reduce((n, g) => n + g.items.length, 0);

/** PROPOSED — grouped, searchable dimension picker (replaces the breakdown checkbox wall). */
const DimensionPicker = () => (
    <div className="absolute top-full left-0 z-20 mt-2 w-[min(560px,90vw)] overflow-hidden rounded-xl bg-primary shadow-xl ring-1 ring-secondary">
        <div className="border-b border-secondary p-3">
            <Input aria-label="Search dimensions" size="sm" icon={SearchLg} placeholder={`Search ${dimensionCount} dimensions…`} />
        </div>
        <div className="grid max-h-80 grid-cols-1 gap-x-4 overflow-y-auto p-3 sm:grid-cols-2">
            {dimensionGroups.map((g) => (
                <div key={g.group} className="flex flex-col py-1">
                    <span className="px-2 py-1 text-xs font-semibold text-tertiary uppercase">{g.group}</span>
                    {g.items.map((item) => {
                        const inUse = item === "DAS Campaign" || item === "Ad Unit Type";
                        return (
                            <button
                                key={item}
                                type="button"
                                disabled={inUse}
                                className={cx(
                                    "rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                                    inUse ? "text-quaternary" : "text-secondary hover:bg-primary_hover",
                                )}
                            >
                                {item}
                                {inUse && <span className="ml-1 text-xs">· added</span>}
                            </button>
                        );
                    })}
                    {g.group === "Deal Activation" && (
                        <span
                            className="flex items-start gap-1.5 rounded-md px-2 py-1.5 text-left text-sm text-quaternary"
                            title="Per-keyword breakdowns are available via CSV export or API"
                        >
                            <Lock01 className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
                            <span>
                                Keyword <span className="block text-xs">CSV / API only</span>
                            </span>
                        </span>
                    )}
                </div>
            ))}
        </div>
    </div>
);

const resultRows = [
    { campaign: "Sports fans · Interstitial", unit: "Interstitial", kw: "Yes · 2", revenue: 14500, imps: 1705882, ecpm: 8.5 },
    { campaign: "Sports fans · Inline (ES)", unit: "Inline", kw: "Yes · 1", revenue: 3120, imps: 499200, ecpm: 6.25 },
    { campaign: "Over 21 · Midwest", unit: "Interstitial", kw: "Yes · 2", revenue: 19870, imps: 1655833, ecpm: 12 },
    { campaign: "Over 21 · Midwest", unit: "Rewarded", kw: "Yes · 2", revenue: 10630, imps: 885834, ecpm: 12 },
    { campaign: "Plant lovers · Always on", unit: "Inline", kw: "Yes · 1", revenue: 1980, imps: 482927, ecpm: 4.1 },
    { campaign: "Plant lovers · Always on", unit: "Dynamic Unit", kw: "Yes · 1", revenue: 670, imps: 163414, ecpm: 4.1 },
];

export const QueryBuilder = ({ pickerOpen = false }: { pickerOpen?: boolean }) => {
    const [open, setOpen] = useState(pickerOpen);
    return (
        <DasShell
            navKey="performance insights"
            tabs={[{ label: "Saved Queries" }, { label: "New Query", active: true }]}
            concept={{
                label: "Concept B",
                title: "Build breakdowns on the fly",
                notes: [
                    "Metrics, breakdowns and filters become chips. “+ Breakdown” opens a grouped, searchable picker instead of ~30 always-visible checkboxes, so data loads only for what's chosen.",
                    "DAS dimensions (Deal, Campaign, Asset, Auction Rule, Ad Unit Type, Device Language, Keyword-targeted) are a first-class group.",
                    "Keyword is visible but locked with the reason, so the charter guardrail reads as a design decision, not a missing feature.",
                ],
            }}
        >
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <h2 className="text-display-xs font-semibold text-primary">New query</h2>
                    <div className="flex flex-wrap gap-3">
                        <DateRange label="This month" range="Sep 1 – Sep 18, 2026" />
                        <Button color="secondary">Save query</Button>
                        <Button color="secondary" iconLeading={Download01}>
                            CSV
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl px-5 py-2 ring-1 ring-secondary">
                    <BuilderRow label="Metrics">
                        <Chip tone="pink">Revenue</Chip>
                        <Chip tone="pink">Impressions</Chip>
                        <Chip tone="pink">eCPM</Chip>
                        <AddChip label="Metric" />
                    </BuilderRow>
                    <BuilderRow label="Break down by">
                        <Chip>DAS Campaign</Chip>
                        <Chip>Ad Unit Type</Chip>
                        <Chip>Keyword-targeted</Chip>
                        <span className="relative">
                            <AddChip label="Breakdown" onPress={() => setOpen((o) => !o)} active={open} />
                            {open && <DimensionPicker />}
                        </span>
                    </BuilderRow>
                    <BuilderRow label="Filters">
                        <Chip tone="gray">
                            <FilterLines className="size-3.5" aria-hidden="true" /> Revenue source = DAS
                        </Chip>
                        <Chip tone="gray">Platform = iOS, Android</Chip>
                        <AddChip label="Filter" />
                    </BuilderRow>
                    <BuilderRow label="Show as">
                        {["Table", "Line", "Bar", "Stacked bar"].map((t, i) => (
                            <button
                                key={t}
                                type="button"
                                className={cx(
                                    "rounded-lg px-3 py-1 text-sm font-semibold ring-1",
                                    i === 0 ? "text-white ring-transparent" : "text-secondary ring-secondary hover:bg-primary_hover",
                                )}
                                style={i === 0 ? { backgroundColor: TEAL } : undefined}
                            >
                                {t}
                            </button>
                        ))}
                        <span className="ml-auto text-sm text-tertiary">Interval: Total · Day · Week · Month</span>
                    </BuilderRow>
                </div>

                <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                    <table className="w-full min-w-[820px] text-left">
                        <thead className="bg-secondary">
                            <tr>
                                {["DAS Campaign", "Ad Unit Type", "Keyword-targeted", "Revenue", "Impressions", "eCPM"].map((h, i) => (
                                    <th key={h} className={cx("px-5 py-3 text-xs font-semibold text-tertiary", i > 2 && "text-right")}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {resultRows.map((r, i) => (
                                <tr key={i} className={cx("border-t border-secondary", i % 2 === 1 && "bg-secondary/30")}>
                                    <td className="px-5 py-3 text-sm font-medium text-primary">{r.campaign}</td>
                                    <td className="px-5 py-3 text-sm text-secondary">{r.unit}</td>
                                    <td className="px-5 py-3 text-sm text-secondary">{r.kw}</td>
                                    <td className="px-5 py-3 text-right text-sm font-semibold text-primary">{usd(r.revenue)}</td>
                                    <td className="px-5 py-3 text-right text-sm text-secondary">{r.imps.toLocaleString("en-US")}</td>
                                    <td className="px-5 py-3 text-right text-sm text-secondary">{usd(r.ecpm, 2)}</td>
                                </tr>
                            ))}
                            <tr className="border-t-2 border-secondary bg-secondary/60">
                                <td className="px-5 py-3 text-sm font-semibold text-primary" colSpan={3}>
                                    Total
                                </td>
                                <td className="px-5 py-3 text-right text-sm font-semibold text-primary">
                                    {usd(resultRows.reduce((s, r) => s + r.revenue, 0))}
                                </td>
                                <td className="px-5 py-3 text-right text-sm font-semibold text-primary">
                                    {resultRows.reduce((s, r) => s + r.imps, 0).toLocaleString("en-US")}
                                </td>
                                <td className="px-5 py-3 text-right text-sm font-semibold text-primary">—</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DasShell>
    );
};
