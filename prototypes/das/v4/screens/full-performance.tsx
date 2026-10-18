import { type ReactNode, useMemo, useState } from "react";
import { BarChart07, Download01, LineChartUp01, Table, TrendUp01 } from "@untitledui/icons";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cx } from "@/utils/cx";
import { downloadCsv } from "./batch-data";
import { type Campaign, compact, flightRange, usd } from "./campaign-data";
import { BreadcrumbStrip, ChartTooltip } from "./campaign-ui";
import { axis, dailyDelivery, flightDay, useCampaign, wobble } from "./campaign-series";
import { DasShell, PINK, TEAL } from "./das-shell";
import { V3_NAV_ITEMS } from "./nav";
import { Button, LABEL } from "./type-rules";

/**
 * Full performance — the third screen: Manage campaigns → campaign overview → this.
 * Round 4 (16 Oct review).
 *
 * The overview answers "how is it pacing?". This answers "where?": a chart you can break
 * down by everything the campaign targets and every creative in it — creative, platform,
 * geo, app and keywords — and pivot two at a time ("how is this creative doing on this
 * platform?", "where am I underspending?"). No summary panel; the overview has one. The
 * controls follow Performance Insights' query builder, and Export CSV takes whatever view
 * is on screen.
 *
 * Open, so switchable:
 *   - `layout`: the builder across the top (Performance Insights' arrangement) or as a
 *     panel down the left.
 *   - `keywordMode`: Product's reading is that a campaign's keywords match all-or-nothing,
 *     so they report as one set. The charter specifies an ANY / ALL toggle defaulting to
 *     ANY, and limits per-keyword breakdowns to CSV and the API at launch. "each" shows
 *     what per-keyword reporting would look like, for comparison.
 *
 * All figures are synthesised from the campaign's totals so every breakdown adds up.
 */

export type PerfLayout = "top" | "side";
export type KeywordMode = "set" | "each";
export type Dim = "Creative" | "Platform" | "Geo" | "App" | "Keywords";
type Metric = "Spend" | "Impressions" | "eCPM";
type Range = "flight" | "14" | "7";
type ChartKind = "line" | "bar" | "table";

const DIMS: Dim[] = ["Creative", "Platform", "Geo", "App", "Keywords"];
const SERIES_COLORS = [TEAL, PINK, "#7F56D9", "#F79009", "#2E90FA", "#667085"];
const MAX_BREAKDOWN = 2;

/* ------------------------------------------------------------ The cube --- */

/** Deterministic 0–1 from a string, so the same slice always gets the same share. */
const hash01 = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
    return ((h >>> 0) % 1000) / 1000;
};

const dimValues = (c: Campaign, dim: Dim, keywordMode: KeywordMode): string[] => {
    switch (dim) {
        case "Creative":
            return c.creativeList.map((cr) => cr.name);
        case "Platform":
            return c.platforms.split(", ");
        case "Geo":
            return c.geos === "All" ? ["United States", "Canada", "Other"] : c.geos.split(", ");
        case "App":
            return c.apps.length ? c.apps : ["All apps"];
        case "Keywords":
            if (!c.keywords.length) return ["No keyword targeting"];
            return keywordMode === "set" ? [c.keywords.join(" + ")] : c.keywords;
    }
};

type Cell = Record<Dim, string> & { weight: number; ecpm: number };

/**
 * Every combination of the campaign's targeting, each with its share of delivery. An app
 * only runs on its own platform, so "Daily Scores (iOS)" never meets Android.
 */
const buildCube = (c: Campaign, keywordMode: KeywordMode): Cell[] => {
    let rows: Partial<Cell>[] = [{}];
    for (const dim of DIMS) rows = rows.flatMap((r) => dimValues(c, dim, keywordMode).map((v) => ({ ...r, [dim]: v })));
    const cells = rows
        .filter((r) => {
            const p = r.App?.match(/\((iOS|Android)\)$/)?.[1];
            return !p || p === r.Platform;
        })
        .map((r) => {
            const w = DIMS.reduce((acc, d) => acc * (0.5 + hash01(`${d}:${r[d]}`)), 1);
            return { ...(r as Record<Dim, string>), weight: w, ecpm: c.ecpm * (0.85 + 0.3 * hash01(DIMS.map((d) => r[d]).join("|"))) };
        });
    const total = cells.reduce((s, x) => s + x.weight, 0) || 1;
    return cells.map((x) => ({ ...x, weight: x.weight / total }));
};

interface Group {
    key: string;
    values: string[];
    weight: number;
    spend: number;
    impressions: number;
    daily: { spend: number; impressions: number }[];
}

const aggregate = (c: Campaign, cube: Cell[], breakdown: Dim[], excluded: Record<Dim, string[]>, range: Range) => {
    const fallback = c.rule === "Fallback";
    const daily = dailyDelivery(c);
    const from = range === "flight" ? 0 : Math.max(0, daily.length - Number(range));
    const days = daily.slice(from).map((v, i) => ({ v, i: i + from }));
    const kept = cube.filter((cell) => DIMS.every((d) => !excluded[d].includes(cell[d])));
    // Each slice wobbles day to day; normalising per day over the whole cube keeps every
    // breakdown summing to the campaign's real total.
    const wob = (cell: Cell, i: number) => cell.weight * (0.9 + 0.2 * wobble(i + cell.weight * 1000));
    const dayNorm = days.map(({ i }) => cube.reduce((s, cell) => s + wob(cell, i), 0) || 1);

    const groups = new Map<string, Group>();
    for (const cell of kept) {
        const values = breakdown.map((d) => cell[d]);
        const key = values.join(" · ") || "All delivery";
        const g = groups.get(key) ?? { key, values, weight: 0, spend: 0, impressions: 0, daily: days.map(() => ({ spend: 0, impressions: 0 })) };
        g.weight += cell.weight;
        days.forEach(({ v, i }, j) => {
            const share = wob(cell, i) / dayNorm[j];
            const spend = fallback ? 0 : v * share;
            const impressions = fallback ? v * share : (spend / cell.ecpm) * 1000;
            g.daily[j].spend += spend;
            g.daily[j].impressions += impressions;
            g.spend += spend;
            g.impressions += impressions;
        });
        groups.set(key, g);
    }
    return { groups: [...groups.values()].sort((a, b) => (fallback ? b.impressions - a.impressions : b.spend - a.spend)), days };
};

const metricOf = (m: Metric, spend: number, impressions: number) => (m === "Spend" ? spend : m === "Impressions" ? impressions : impressions ? (spend / impressions) * 1000 : 0);
const formatMetric = (m: Metric, v: number) => (m === "Spend" ? usd(v) : m === "Impressions" ? Math.round(v).toLocaleString("en-US") : usd(v, 2));
const axisMetric = (m: Metric, v: number) => (m === "Impressions" ? compact(v) : m === "Spend" ? `$${compact(v)}` : `$${v.toFixed(2)}`);

/* ------------------------------------------------------------ Controls --- */

const Segmented = <T extends string>({ value, options, onChange, label }: { value: T; options: { id: T; label: string; icon?: typeof Table; disabled?: boolean }[]; onChange: (v: T) => void; label: string }) => (
    <div role="radiogroup" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-lg bg-secondary p-1">
        {options.map((o) => (
            <button
                key={o.id}
                type="button"
                role="radio"
                aria-checked={value === o.id}
                disabled={o.disabled}
                onClick={() => onChange(o.id)}
                className={cx(
                    "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-md font-semibold transition duration-100 ease-linear disabled:cursor-not-allowed disabled:opacity-50",
                    value === o.id ? "bg-primary text-primary shadow-xs" : "text-tertiary hover:text-secondary",
                )}
            >
                {o.icon && <o.icon className="size-4" aria-hidden="true" />}
                {o.label}
            </button>
        ))}
    </div>
);

const Toggle = ({ on, onPress, children, disabled, title }: { on: boolean; onPress: () => void; children: ReactNode; disabled?: boolean; title?: string }) => (
    <button
        type="button"
        aria-pressed={on}
        disabled={disabled}
        title={title}
        onClick={onPress}
        className={cx(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-md font-semibold ring-1 transition duration-100 ease-linear disabled:cursor-not-allowed disabled:opacity-50",
            on ? "ring-transparent" : "text-tertiary ring-secondary hover:bg-secondary/60",
        )}
        style={on ? { color: "#1F7F80", backgroundColor: `${TEAL}24` } : undefined}
    >
        {children}
    </button>
);

/* --------------------------------------------------------------- Page --- */

export const FullPerformance = ({
    id = "c1",
    layout = "top",
    keywordMode = "set",
    breakdown: initialBreakdown = ["Creative"],
}: {
    id?: string;
    layout?: PerfLayout;
    keywordMode?: KeywordMode;
    breakdown?: Dim[];
}) => {
    const c = useCampaign(id);
    const fallback = c.rule === "Fallback";
    const [range, setRange] = useState<Range>("flight");
    const [metric, setMetric] = useState<Metric>(fallback ? "Impressions" : "Spend");
    const [breakdown, setBreakdown] = useState<Dim[]>(initialBreakdown);
    const [excluded, setExcluded] = useState<Record<Dim, string[]>>({ Creative: [], Platform: [], Geo: [], App: [], Keywords: [] });
    const [chart, setChart] = useState<ChartKind>("line");

    const cube = useMemo(() => buildCube(c, keywordMode), [c, keywordMode]);
    const { groups, days } = useMemo(() => aggregate(c, cube, breakdown, excluded, range), [c, cube, breakdown, excluded, range]);
    const shown = groups.slice(0, SERIES_COLORS.length);
    const totalSpend = groups.reduce((s, g) => s + g.spend, 0);
    const totalImps = groups.reduce((s, g) => s + g.impressions, 0);
    const filtered = DIMS.some((d) => excluded[d].length);

    const toggleDim = (d: Dim) => setBreakdown((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : cur.length >= MAX_BREAKDOWN ? cur : [...cur, d]));
    const toggleValue = (d: Dim, v: string) =>
        setExcluded((cur) => {
            const list = cur[d].includes(v) ? cur[d].filter((x) => x !== v) : [...cur[d], v];
            // Never filter a dimension down to nothing.
            if (list.length >= dimValues(c, d, keywordMode).length) return cur;
            return { ...cur, [d]: list };
        });

    const exportCsv = () =>
        downloadCsv(
            `${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-performance`,
            [...(breakdown.length ? breakdown : ["Slice"]), "Spend", "Impressions", "eCPM", "Share of spend"],
            groups.map((g) => [
                ...(breakdown.length ? g.values : [g.key]),
                g.spend.toFixed(2),
                Math.round(g.impressions),
                metricOf("eCPM", g.spend, g.impressions).toFixed(2),
                totalSpend ? `${((g.spend / totalSpend) * 100).toFixed(1)}%` : "",
            ]),
        );

    if (c.status === "Scheduled")
        return (
            <DasShell navItems={V3_NAV_ITEMS} navKey="manage campaigns">
                <BreadcrumbStrip trail={[{ label: "Campaigns", href: "#/campaigns" }, { label: c.name, href: `#/view-a?c=${c.id}` }, { label: "Full performance" }]} />
                <div className="px-8 py-8">
                    <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-secondary px-6 py-16 text-center">
                        <TrendUp01 className="size-6 text-fg-quaternary" aria-hidden="true" />
                        <p className="text-md font-semibold text-primary">Performance appears after the first day of delivery</p>
                        <p className="max-w-md text-md text-tertiary">{c.name} starts {c.start}. From then you can break it down by creative, platform, geo, app and keywords.</p>
                    </div>
                </div>
            </DasShell>
        );

    /* -------- controls -------- */

    const controls: { label: string; body: ReactNode }[] = [
        {
            label: "Date range",
            body: (
                <Segmented
                    label="Date range"
                    value={range}
                    onChange={setRange}
                    options={[
                        { id: "flight", label: "Flight to date" },
                        { id: "14", label: "Last 14 days" },
                        { id: "7", label: "Last 7 days" },
                    ]}
                />
            ),
        },
        {
            label: "Metric",
            body: (
                <Segmented
                    label="Metric"
                    value={metric}
                    onChange={setMetric}
                    options={[
                        { id: "Spend", label: "Spend", disabled: fallback },
                        { id: "Impressions", label: "Impressions" },
                        { id: "eCPM", label: "eCPM", disabled: fallback },
                    ]}
                />
            ),
        },
        {
            label: "Break down by",
            body: (
                <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                        {DIMS.map((d) => {
                            const on = breakdown.includes(d);
                            const full = !on && breakdown.length >= MAX_BREAKDOWN;
                            return (
                                <Toggle key={d} on={on} onPress={() => toggleDim(d)} disabled={full} title={full ? "Two at a time — remove one first" : undefined}>
                                    {on && <span className="font-bold">{breakdown.indexOf(d) + 1}</span>}
                                    {d}
                                </Toggle>
                            );
                        })}
                    </div>
                    <span className="text-md text-tertiary">Up to two at once, to pivot one against the other.</span>
                </div>
            ),
        },
        {
            label: "Filters",
            body: (
                <div className="flex flex-col gap-2">
                    {DIMS.map((d) => (
                        <div key={d} className="flex flex-wrap items-center gap-2">
                            <span className="w-24 shrink-0 text-md font-semibold text-secondary">{d}</span>
                            {dimValues(c, d, keywordMode).map((v) => (
                                <Toggle key={v} on={!excluded[d].includes(v)} onPress={() => toggleValue(d, v)}>
                                    {d === "Keywords" ? <span className="font-mono">{v}</span> : v}
                                </Toggle>
                            ))}
                        </div>
                    ))}
                    {filtered && (
                        <button
                            type="button"
                            onClick={() => setExcluded({ Creative: [], Platform: [], Geo: [], App: [], Keywords: [] })}
                            className="self-start text-md font-semibold uppercase"
                            style={{ color: PINK }}
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ),
        },
        {
            label: "Chart type",
            body: (
                <Segmented
                    label="Chart type"
                    value={chart}
                    onChange={setChart}
                    options={[
                        { id: "line", label: "Line", icon: LineChartUp01 },
                        { id: "bar", label: "Bar", icon: BarChart07 },
                        { id: "table", label: "Table", icon: Table },
                    ]}
                />
            ),
        },
    ];

    /* -------- output -------- */

    const lineData = days.map(({ i }, j) => {
        const row: Record<string, string | number> = { day: flightDay(c, i) };
        for (const g of shown) row[g.key] = +metricOf(metric, g.daily[j].spend, g.daily[j].impressions).toFixed(2);
        return row;
    });
    const barData = shown.map((g) => ({ name: g.key, value: +metricOf(metric, g.spend, g.impressions).toFixed(2) }));
    const tooltip = <ChartTooltip format={(v) => formatMetric(metric, v)} />;

    const output = (
        <div className="flex min-w-0 flex-col gap-5">
            {chart !== "table" && (
                <div className="flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-secondary">
                    <h3 className="text-lg font-extrabold text-primary">
                        {metric} {metric === "eCPM" ? "" : "per day"} {breakdown.length ? `by ${breakdown.join(" and ")}` : ""}
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            {chart === "line" ? (
                                <LineChart data={lineData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                                    <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                                    <XAxis dataKey="day" {...axis} interval={Math.max(0, Math.round(days.length / 6) - 1)} />
                                    <YAxis {...axis} width={64} tickFormatter={(v: number) => axisMetric(metric, v)} />
                                    <Tooltip content={tooltip} />
                                    {shown.map((g, i) => (
                                        <Line key={g.key} dataKey={g.key} stroke={SERIES_COLORS[i]} strokeWidth={2} dot={false} isAnimationActive={false} />
                                    ))}
                                </LineChart>
                            ) : (
                                <BarChart data={barData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                                    <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                                    <XAxis dataKey="name" {...axis} interval={0} tickFormatter={(v: string) => (v.length > 22 ? `${v.slice(0, 21)}…` : v)} />
                                    <YAxis {...axis} width={64} tickFormatter={(v: number) => axisMetric(metric, v)} />
                                    <Tooltip content={tooltip} cursor={{ fill: "#F2F4F7" }} />
                                    <Bar dataKey="value" name={metric} fill={TEAL} radius={[6, 6, 0, 0]} isAnimationActive={false} />
                                </BarChart>
                            )}
                        </ResponsiveContainer>
                    </div>
                    {chart === "line" && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-md text-tertiary">
                            {shown.map((g, i) => (
                                <span key={g.key} className="inline-flex items-center gap-1.5">
                                    <span className="h-0.5 w-4 rounded" style={{ backgroundColor: SERIES_COLORS[i] }} /> {g.key}
                                </span>
                            ))}
                            {groups.length > shown.length && <span>+{groups.length - shown.length} more in the table</span>}
                        </div>
                    )}
                </div>
            )}

            <div className="overflow-x-auto rounded-xl border border-secondary">
                <table className="w-full text-left text-md">
                    <thead className="bg-secondary">
                        <tr>
                            {(breakdown.length ? breakdown : ["Slice"]).map((d) => (
                                <th key={d} scope="col" className="px-4 py-3 font-bold text-primary">
                                    {d}
                                </th>
                            ))}
                            {(fallback ? ["Impressions", "Share"] : ["Spend", "Impressions", "eCPM", "Share of spend"]).map((h) => (
                                <th key={h} scope="col" className="px-4 py-3 text-right font-bold whitespace-nowrap text-primary">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-secondary">
                        {groups.map((g) => {
                            const share = fallback ? g.impressions / (totalImps || 1) : g.spend / (totalSpend || 1);
                            return (
                                <tr key={g.key}>
                                    {(breakdown.length ? g.values : [g.key]).map((v, i) => (
                                        <td key={i} className={cx("px-4 py-3 text-primary", breakdown[i] === "Keywords" && "font-mono")}>
                                            {v}
                                        </td>
                                    ))}
                                    {!fallback && <td className="px-4 py-3 text-right font-semibold text-primary tabular-nums">{usd(g.spend)}</td>}
                                    <td className="px-4 py-3 text-right text-secondary tabular-nums">{Math.round(g.impressions).toLocaleString("en-US")}</td>
                                    {!fallback && <td className="px-4 py-3 text-right text-secondary tabular-nums">{usd(metricOf("eCPM", g.spend, g.impressions), 2)}</td>}
                                    <td className="px-4 py-3 text-right text-secondary tabular-nums">
                                        <span className="inline-flex items-center justify-end gap-2">
                                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-quaternary">
                                                <span className="block h-full rounded-full" style={{ width: `${share * 100}%`, backgroundColor: TEAL }} />
                                            </span>
                                            {(share * 100).toFixed(1)}%
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="border-t-2 border-secondary bg-secondary/40">
                        <tr>
                            <td colSpan={Math.max(1, breakdown.length)} className="px-4 py-3 font-bold text-primary">
                                Total{filtered && " (filtered)"}
                            </td>
                            {!fallback && <td className="px-4 py-3 text-right font-bold text-primary tabular-nums">{usd(totalSpend)}</td>}
                            <td className="px-4 py-3 text-right font-bold text-primary tabular-nums">{Math.round(totalImps).toLocaleString("en-US")}</td>
                            {!fallback && <td className="px-4 py-3 text-right font-bold text-primary tabular-nums">{usd(metricOf("eCPM", totalSpend, totalImps), 2)}</td>}
                            <td className="px-4 py-3 text-right font-bold text-primary">100%</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            {breakdown.includes("Keywords") && (
                <p className="text-md text-tertiary">
                    {keywordMode === "set"
                        ? "A campaign's keywords match together, so they report as one set."
                        : "An impression counts under the first keyword it matched."}
                </p>
            )}
        </div>
    );

    return (
        <DasShell
            navItems={V3_NAV_ITEMS}
            navKey="manage campaigns"
            concept={{
                label: `Full performance · ${layout === "top" ? "builder on top" : "builder on the left"}`,
                title: "Break the campaign down by everything it targets",
                notes: [
                    "Third screen: Manage campaigns → overview → this. No summary panel; the overview has one.",
                    "Break down by Creative, Platform, Geo, App and Keywords — two at a time to pivot one against the other — and filter any of them. Modelled on Performance Insights' query builder.",
                    "Export CSV downloads exactly the table on screen.",
                    keywordMode === "set"
                        ? "Keywords report as one set, on Product's reading that they match all-or-nothing. Still to confirm: the charter specifies ANY / ALL defaulting to ANY, and keeps per-keyword breakdowns to CSV and the API at launch."
                        : "Per-keyword view, for comparison. The charter keeps per-keyword breakdowns to CSV and the API at launch, so this can't ship as drawn without a change to the charter.",
                ],
            }}
        >
            <BreadcrumbStrip trail={[{ label: "Campaigns", href: "#/campaigns" }, { label: c.name, href: `#/view-a?c=${c.id}` }, { label: "Full performance" }]} />
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-display-xs font-extrabold text-primary">Full performance</h2>
                        <p className="text-md text-tertiary">
                            {c.name} · {flightRange(c)} · all figures in UTC
                        </p>
                    </div>
                    <Button color="secondary" iconLeading={Download01} onClick={exportCsv}>
                        Export CSV
                    </Button>
                </div>

                {layout === "top" ? (
                    <>
                        <div className="divide-y divide-secondary rounded-2xl ring-1 ring-secondary">
                            {controls.map((ctl) => (
                                <div key={ctl.label} className="grid grid-cols-1 gap-2 px-5 py-4 md:grid-cols-[160px_minmax(0,1fr)] md:items-start md:gap-6">
                                    <span className={cx(LABEL, "md:pt-1.5")}>{ctl.label}</span>
                                    {ctl.body}
                                </div>
                            ))}
                        </div>
                        {output}
                    </>
                ) : (
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                        <aside className="flex flex-col divide-y divide-secondary self-start rounded-2xl ring-1 ring-secondary xl:sticky xl:top-14">
                            {controls.map((ctl) => (
                                <div key={ctl.label} className="flex flex-col gap-2.5 px-5 py-4">
                                    <span className={LABEL}>{ctl.label}</span>
                                    {ctl.body}
                                </div>
                            ))}
                        </aside>
                        {output}
                    </div>
                )}
            </div>
        </DasShell>
    );
};
