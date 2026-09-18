import { type ReactNode, useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    BookmarkCheck,
    ChevronDown,
    ChevronRight,
    Clock,
    DotsGrid,
    Download01,
    Play,
    Plus,
    RefreshCcw01,
    SearchLg,
    Share07,
} from "@untitledui/icons";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { DasShell, PINK, TEAL } from "../deal-activation-system/das-shell";
import { demandSources, demandTotals, pivot, revenueByDay, savedQueries, seriesColors, templates, usd, weeks } from "./pi-data";

/**
 * Performance Insights — screen concepts.
 *
 * Kickoff: PI is "old school" — every metric and breakdown is an always-visible
 * checkbox, data is loaded up front (slow), and keyword/DAS dimensions will make the
 * breakdown list unbounded. Three directions:
 *   A. Start page — begin from templates and saved queries instead of a blank form.
 *   B. Question bar — the query reads as one editable sentence; nothing loads until Run.
 *   C. Explorer — a pivot-table model (rows / columns / values) with drill-down.
 */

const axisProps = { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#667085" } } as const;

const PiShell = ({
    concept,
    tabs,
    children,
}: {
    concept: Parameters<typeof DasShell>[0]["concept"];
    tabs?: { label: string; active?: boolean }[];
    children: ReactNode;
}) => (
    <DasShell navKey="performance insights" concept={concept} tabs={tabs}>
        <div className="flex flex-col gap-6 px-8 py-8">{children}</div>
    </DasShell>
);

const Sparkline = ({ points, color = TEAL }: { points: number[]; color?: string }) => {
    const max = Math.max(...points);
    const d = points.map((p, i) => `${i === 0 ? "M" : "L"}${(i / (points.length - 1)) * 100},${30 - (p / max) * 26}`).join(" ");
    return (
        <svg viewBox="0 0 100 32" className="h-10 w-full" preserveAspectRatio="none" aria-hidden="true">
            <path d={d} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
        </svg>
    );
};

const Delta = ({ now, prev, digits = 0 }: { now: number; prev: number; digits?: number }) => {
    const pct = ((now - prev) / prev) * 100;
    const up = pct >= 0;
    const Icon = up ? ArrowUp : ArrowDown;
    return (
        <span className={cx("inline-flex items-center gap-0.5 text-xs font-semibold", up ? "text-success-primary" : "text-error-primary")}>
            <Icon className="size-3" aria-hidden="true" />
            {Math.abs(pct).toFixed(digits || 1)}%
        </span>
    );
};

/* ============================================================ A · Start page === */

export const StartPage = () => (
    <PiShell
        tabs={[{ label: "Start", active: true }, { label: "Saved Queries" }, { label: "New Query" }]}
        concept={{
            label: "Concept A",
            title: "Start from a question, not a blank form",
            notes: [
                "Most visits repeat a handful of questions. Templates and saved queries open a ready-made query, which is faster than ticking 13 metrics and 30 breakdowns.",
                "Each card previews its trend, so the start page is useful before anything is clicked.",
                "Blank query stays one click away for power users.",
            ],
        }}
    >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-1">
                <h2 className="text-display-xs font-semibold text-primary">Performance Insights</h2>
                <p className="text-md text-tertiary">What do you want to look at today?</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
                <Input aria-label="Find a report" size="sm" icon={SearchLg} placeholder="Find a template or saved query" wrapperClassName="sm:w-80" />
                <Button color="primary-pink" iconLeading={Plus}>
                    Blank query
                </Button>
            </div>
        </div>

        <section className="flex flex-col gap-3">
            <h3 className="text-lg font-semibold text-primary">Start from a template</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {templates.map((t, i) => (
                    <a key={t.title} href="#" className="group flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-secondary transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between gap-3">
                            <span className="text-md font-semibold text-primary">{t.title}</span>
                            <ChevronRight className="size-5 text-fg-quaternary transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                        </div>
                        <Sparkline points={t.trend} color={i % 2 ? PINK : TEAL} />
                        <div className="flex flex-wrap gap-1.5">
                            {t.tags.map((tag) => (
                                <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </a>
                ))}
            </div>
        </section>

        <section className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Saved queries</h3>
                <a href="#" className="text-sm font-semibold uppercase" style={{ color: PINK }}>
                    View all
                </a>
            </div>
            <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                <table className="w-full min-w-[720px] text-left">
                    <thead className="bg-secondary">
                        <tr>
                            {["Name", "Owner", "Last run", "Schedule", ""].map((h) => (
                                <th key={h} className="px-5 py-3 text-xs font-semibold text-tertiary">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {savedQueries.map((q) => (
                            <tr key={q.name} className="border-t border-secondary">
                                <td className="px-5 py-3">
                                    <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: TEAL }}>
                                        <BookmarkCheck className="size-4" aria-hidden="true" />
                                        {q.name}
                                    </span>
                                </td>
                                <td className="px-5 py-3 text-sm text-secondary">{q.owner}</td>
                                <td className="px-5 py-3 text-sm text-tertiary">{q.lastRun}</td>
                                <td className="px-5 py-3 text-sm text-tertiary">{q.schedule}</td>
                                <td className="px-5 py-3 text-right">
                                    <Button color="secondary" size="sm" iconLeading={Play}>
                                        Open
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    </PiShell>
);

/* ========================================================== B · Question bar === */

const Slot = ({ children, tone = "teal", add }: { children: ReactNode; tone?: "teal" | "pink" | "gray"; add?: boolean }) => {
    const style = add
        ? { color: PINK, borderColor: `${PINK}80` }
        : tone === "teal"
          ? { color: "#1F7F80", backgroundColor: `${TEAL}24` }
          : tone === "pink"
            ? { color: "#A94579", backgroundColor: `${PINK}24` }
            : { color: "#344054", backgroundColor: "#F2F4F7" };
    return (
        <button
            type="button"
            className={cx(
                "mx-0.5 inline-flex items-center gap-1 rounded-lg px-2 py-0.5 align-baseline font-semibold transition-colors",
                add && "border border-dashed",
            )}
            style={style}
        >
            {add && <Plus className="size-4" aria-hidden="true" />}
            {children}
            {!add && <ChevronDown className="size-4 opacity-60" aria-hidden="true" />}
        </button>
    );
};

export const QuestionBar = ({ draft = false }: { draft?: boolean }) => {
    const [hidden, setHidden] = useState<string[]>([]);
    return (
        <PiShell
            tabs={[{ label: "Start" }, { label: "Saved Queries" }, { label: "New Query", active: true }]}
            concept={{
                label: "Concept B",
                title: "The query as one editable sentence",
                notes: [
                    "Metrics, breakdown, date range, filters and comparison read as one sentence, and each highlighted part opens its picker. The checkbox walls go away.",
                    "Nothing loads until Run, and edits mark the results as stale instead of re-querying on every click, which addresses the slow up-front loading.",
                    "The comparison is built in: every total shows its change against the previous period.",
                ],
            }}
        >
            <div className="flex flex-col gap-4 rounded-2xl p-6 ring-1 ring-secondary">
                <p className="text-xl leading-[1.9] text-primary">
                    Show <Slot tone="pink">Revenue</Slot>
                    <Slot tone="pink">eCPM</Slot>
                    <Slot add>metric</Slot> by <Slot>Demand Source</Slot>
                    <Slot add>breakdown</Slot> for <Slot tone="gray">Last 7 days</Slot> where <Slot tone="gray">App is Pocket Garden (iOS)</Slot>
                    <Slot add>filter</Slot>, compared with <Slot tone="gray">the previous 7 days</Slot>.
                </p>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-4">
                    <span className="text-sm text-tertiary">{draft ? "Changed: added eCPM · about 35 rows" : "Last run 9:14 AM UTC · 35 rows · 0.8s"}</span>
                    <div className="flex gap-3">
                        <Button color="secondary" iconLeading={BookmarkCheck}>
                            Save
                        </Button>
                        <Button color="secondary" iconLeading={Download01}>
                            CSV
                        </Button>
                        <Button color="primary-pink" iconLeading={draft ? Play : RefreshCcw01}>
                            {draft ? "Run query" : "Re-run"}
                        </Button>
                    </div>
                </div>
            </div>

            <div className={cx("flex flex-col gap-6 transition-opacity", draft && "pointer-events-none opacity-40")} aria-hidden={draft}>
                <div className="rounded-2xl p-5 ring-1 ring-secondary">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                        {demandSources.map((s) => {
                            const off = hidden.includes(s);
                            return (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setHidden((h) => (off ? h.filter((x) => x !== s) : [...h, s]))}
                                    className={cx(
                                        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1 ring-secondary",
                                        off && "opacity-40",
                                    )}
                                >
                                    <span className="size-2.5 rounded-full" style={{ backgroundColor: seriesColors[s] }} aria-hidden="true" />
                                    {s}
                                </button>
                            );
                        })}
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenueByDay} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                                <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                                <XAxis dataKey="day" {...axisProps} />
                                <YAxis {...axisProps} width={52} tickFormatter={(v: number) => `$${v / 1000}k`} />
                                <Tooltip content={<ChartTooltipContent />} />
                                {demandSources
                                    .filter((s) => !hidden.includes(s))
                                    .map((s) => (
                                        <Line
                                            key={s}
                                            type="monotone"
                                            dataKey={s}
                                            name={s}
                                            stroke={seriesColors[s]}
                                            strokeWidth={2}
                                            dot={false}
                                            isAnimationActive={false}
                                        />
                                    ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                    <table className="w-full min-w-[720px] text-left">
                        <thead className="bg-secondary">
                            <tr>
                                {["Demand Source", "Revenue", "vs prev.", "eCPM", "vs prev.", "Fill rate"].map((h, i) => (
                                    <th key={i} className={cx("px-5 py-3 text-xs font-semibold text-tertiary", i > 0 && "text-right")}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {demandTotals.map((r) => (
                                <tr key={r.source} className="border-t border-secondary">
                                    <td className="px-5 py-3 text-sm font-medium text-primary">
                                        <span className="inline-flex items-center gap-2">
                                            <span
                                                className="size-2.5 rounded-full"
                                                style={{ backgroundColor: seriesColors[r.source as keyof typeof seriesColors] }}
                                                aria-hidden="true"
                                            />
                                            {r.source}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right text-sm font-semibold text-primary">{usd(r.revenue)}</td>
                                    <td className="px-5 py-3 text-right">
                                        <Delta now={r.revenue} prev={r.prev} />
                                    </td>
                                    <td className="px-5 py-3 text-right text-sm text-secondary">{usd(r.ecpm, 2)}</td>
                                    <td className="px-5 py-3 text-right">
                                        <Delta now={r.ecpm} prev={r.prevEcpm} />
                                    </td>
                                    <td className="px-5 py-3 text-right text-sm text-secondary">{Math.round(r.fill * 100)}%</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </PiShell>
    );
};

/* ============================================================== C · Explorer === */

const fieldGroups = [
    { group: "Metrics", items: ["Revenue", "Impressions", "eCPM", "Fill Rate", "Requests", "Win Rate", "Clicks", "CTR"] },
    { group: "Dimensions", items: ["App", "Demand Source", "Country", "Platform", "Ad Unit", "Ad Size", "DAS Campaign", "SDK Version"] },
    { group: "Time", items: ["Day", "Week", "Month", "Quarter"] },
];

const inUse = new Set(["Revenue", "App", "Demand Source", "Week"]);

const Zone = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-xl border border-dashed border-secondary px-3 py-2">
        <span className="w-16 text-xs font-semibold text-tertiary uppercase">{label}</span>
        {children}
    </div>
);

const Pill = ({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "pink" }) => (
    <span
        className="inline-flex items-center gap-1 rounded-lg py-1 pr-2.5 pl-1.5 text-sm font-medium"
        style={tone === "teal" ? { color: "#1F7F80", backgroundColor: `${TEAL}24` } : { color: "#A94579", backgroundColor: `${PINK}24` }}
    >
        <DotsGrid className="size-3.5 opacity-60" aria-hidden="true" />
        {children}
    </span>
);

/** Background tint scaled to the cell's share of the column max — a lightweight heatmap. */
const tint = (v: number, max: number) => ({ backgroundColor: `rgba(55,182,183,${(0.06 + (v / max) * 0.3).toFixed(2)})` });

export const Explorer = () => {
    const [open, setOpen] = useState<string[]>(["Pocket Garden (iOS)"]);
    const colMax = weeks.map((_, i) => Math.max(...pivot.map((r) => r.values[i])));
    return (
        <PiShell
            tabs={[{ label: "Start" }, { label: "Saved Queries" }, { label: "New Query", active: true }]}
            concept={{
                label: "Concept C",
                title: "Explorer: pivot-table model with drill-down",
                notes: [
                    "A familiar spreadsheet model: drag fields into Rows, Columns and Values. The field list is searchable and only fields in use load data.",
                    "Nested rows (App → Demand Source) give granular views without a separate query per breakdown. Expand only what you need.",
                    "Cells tint by value like a light heatmap, so outliers stand out without a chart.",
                ],
            }}
        >
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
                <aside className="flex flex-col gap-4 rounded-2xl p-4 ring-1 ring-secondary xl:self-start">
                    <Input aria-label="Search fields" size="sm" icon={SearchLg} placeholder="Search fields" />
                    {fieldGroups.map((g) => (
                        <div key={g.group} className="flex flex-col gap-1">
                            <span className="px-1 text-xs font-semibold text-tertiary uppercase">{g.group}</span>
                            {g.items.map((item) => (
                                <span
                                    key={item}
                                    className={cx(
                                        "flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                                        inUse.has(item) ? "font-semibold" : "text-secondary hover:bg-primary_hover",
                                    )}
                                    style={inUse.has(item) ? { color: "#1F7F80" } : undefined}
                                >
                                    <DotsGrid className="size-3.5 text-fg-quaternary" aria-hidden="true" />
                                    {item}
                                </span>
                            ))}
                        </div>
                    ))}
                </aside>

                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <Zone label="Rows">
                            <Pill>App</Pill>
                            <ChevronRight className="size-4 text-fg-quaternary" aria-hidden="true" />
                            <Pill>Demand Source</Pill>
                        </Zone>
                        <Zone label="Columns">
                            <Pill>Week</Pill>
                        </Zone>
                        <Zone label="Values">
                            <Pill tone="pink">Revenue</Pill>
                        </Zone>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-sm text-tertiary">
                            <Clock className="size-4" aria-hidden="true" /> Aug 24 – Sep 20, 2026 · UTC
                        </span>
                        <div className="flex gap-3">
                            <Button color="secondary" size="sm" iconLeading={Share07}>
                                Share
                            </Button>
                            <Button color="secondary" size="sm" iconLeading={Download01}>
                                CSV
                            </Button>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                        <table className="w-full min-w-[760px] text-left">
                            <thead className="bg-secondary">
                                <tr>
                                    <th className="px-5 py-3 text-xs font-semibold text-tertiary">App › Demand Source</th>
                                    {weeks.map((w) => (
                                        <th key={w} className="px-5 py-3 text-right text-xs font-semibold text-tertiary">
                                            Week of {w}
                                        </th>
                                    ))}
                                    <th className="px-5 py-3 text-right text-xs font-semibold text-tertiary">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pivot.map((row) => {
                                    const isOpen = open.includes(row.app);
                                    return [
                                        <tr key={row.app} className="border-t border-secondary">
                                            <td className="px-5 py-3">
                                                {row.children.length ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => setOpen((o) => (isOpen ? o.filter((x) => x !== row.app) : [...o, row.app]))}
                                                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                                                        aria-expanded={isOpen}
                                                    >
                                                        {isOpen ? (
                                                            <ChevronDown className="size-4" aria-hidden="true" />
                                                        ) : (
                                                            <ChevronRight className="size-4" aria-hidden="true" />
                                                        )}
                                                        {row.app}
                                                    </button>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 pl-5.5 text-sm font-semibold text-primary">
                                                        {row.app}
                                                    </span>
                                                )}
                                            </td>
                                            {row.values.map((v, i) => (
                                                <td key={i} className="px-5 py-3 text-right text-sm font-semibold text-primary" style={tint(v, colMax[i])}>
                                                    {usd(v)}
                                                </td>
                                            ))}
                                            <td className="px-5 py-3 text-right text-sm font-semibold text-primary">
                                                {usd(row.values.reduce((a, b) => a + b, 0))}
                                            </td>
                                        </tr>,
                                        ...(isOpen
                                            ? row.children.map((c) => (
                                                  <tr key={row.app + c.source} className="border-t border-secondary bg-secondary/30">
                                                      <td className="py-2.5 pr-5 pl-12 text-sm text-secondary">{c.source}</td>
                                                      {c.values.map((v, i) => (
                                                          <td key={i} className="px-5 py-2.5 text-right text-sm text-secondary">
                                                              {usd(v)}
                                                          </td>
                                                      ))}
                                                      <td className="px-5 py-2.5 text-right text-sm text-secondary">
                                                          {usd(c.values.reduce((a, b) => a + b, 0))}
                                                      </td>
                                                  </tr>
                                              ))
                                            : []),
                                    ];
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PiShell>
    );
};
