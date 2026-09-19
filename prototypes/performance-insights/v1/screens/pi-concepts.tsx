import { type ReactNode, useState } from "react";
import { BookmarkCheck, ChevronDown, ChevronRight, Download01, Play, Plus, RefreshCcw01, SearchLg } from "@untitledui/icons";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "./das-shell";
import { demandSources, demandTotals, revenueByDay, seriesColors, templates, usd } from "./pi-data";
import { AccountChip, Delta, DialogFrame, PiShell, RecommendedPill, Sparkline, Toast, TypeBadge } from "./pi-shared";
import { savedQueryList } from "./sq-data";

/**
 * Performance Insights — screen concepts.
 *
 * Kickoff: PI is "old school" — every metric and breakdown is an always-visible
 * checkbox, data is loaded up front (slow), and keyword/DAS dimensions will make the
 * breakdown list unbounded. Three directions:
 *   A. Start page — begin from templates and saved queries instead of a blank form.
 *   B. Question bar — the query reads as one editable sentence; nothing loads until Run.
 *   C. Explorer — a pivot-table model (rows / columns / values) with drill-down (explorer.tsx).
 */

const axisProps = { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#667085" } } as const;

/* ============================================================ A · Start page === */

const starterSaved = savedQueryList.filter((q) => q.source === "saved").slice(0, 4);

/** `search` pre-fills the finder (deep link: #/start-search). */
export const StartPage = ({ search = "" }: { search?: string }) => {
    const [query, setQuery] = useState(search);
    const q = query.trim().toLowerCase();
    const match = (text: string) => !q || text.toLowerCase().includes(q);
    const shownTemplates = templates.filter((t) => match(t.title) || t.tags.some(match));
    const shownSaved = (q ? savedQueryList : starterSaved).filter((s) => match(s.name) || match(s.type));

    return (
        <PiShell
            active="Start"
            concept={{
                label: "Concept A",
                title: "Start from a question, not a blank form",
                notes: [
                    "Most visits repeat a handful of questions. Templates and saved queries open a ready-made query, which is faster than ticking 13 metrics and 30 breakdowns.",
                    "Each card previews its trend, so the start page is useful before anything is clicked.",
                    "One search box covers templates and every saved or recommended query. Blank query stays one click away for power users.",
                ],
            }}
        >
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-display-xs font-semibold text-primary">Performance Insights</h2>
                    <p className="text-md text-tertiary">What do you want to look at today?</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                    <Input
                        aria-label="Find a report"
                        size="sm"
                        icon={SearchLg}
                        placeholder="Find a template or saved query"
                        wrapperClassName="sm:w-80"
                        value={query}
                        onChange={setQuery}
                    />
                    <Button color="primary-pink" iconLeading={Plus} href="#/question-bar-draft">
                        Blank query
                    </Button>
                </div>
            </div>

            {q && (
                <p className="text-sm text-tertiary">
                    {shownTemplates.length + shownSaved.length} results for <span className="font-semibold text-primary">“{query.trim()}”</span> ·{" "}
                    <button type="button" className="font-semibold" style={{ color: PINK }} onClick={() => setQuery("")}>
                        Clear
                    </button>
                </p>
            )}

            {q && !shownTemplates.length && !shownSaved.length ? (
                <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-secondary px-6 py-12 text-center">
                    <SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />
                    <p className="text-md font-semibold text-primary">Nothing matches “{query.trim()}”</p>
                    <p className="max-w-md text-sm text-tertiary">Try a metric (“eCPM”), a breakdown (“country”) or a report type, or build it from scratch.</p>
                    <Button color="secondary" size="sm" iconLeading={Plus} href="#/question-bar-draft">
                        Build “{query.trim()}” as a new query
                    </Button>
                </div>
            ) : (
                <>
                    {shownTemplates.length > 0 && (
                        <section className="flex flex-col gap-3">
                            <h3 className="text-lg font-semibold text-primary">Start from a template</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                                {shownTemplates.map((t, i) => (
                                    <a
                                        key={t.title}
                                        href="#/question-bar"
                                        className="group flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-secondary transition-shadow hover:shadow-md"
                                    >
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
                    )}

                    {shownSaved.length > 0 && (
                        <section className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-primary">{q ? "Saved & recommended queries" : "Saved queries"}</h3>
                                <a href="#/saved" className="text-sm font-semibold uppercase" style={{ color: PINK }}>
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
                                        {shownSaved.map((s) => (
                                            <tr key={s.id} className="border-t border-secondary">
                                                <td className="px-5 py-3">
                                                    <a
                                                        href={`#/preview?q=${s.id}`}
                                                        className="inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                                                        style={{ color: TEAL }}
                                                    >
                                                        <BookmarkCheck className="size-4" aria-hidden="true" />
                                                        {s.name}
                                                    </a>
                                                    {s.source === "recommended" && (
                                                        <span className="ml-2">
                                                            <RecommendedPill />
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3 text-sm text-secondary">{s.owner}</td>
                                                <td className="px-5 py-3 text-sm text-tertiary">{s.lastRun ?? "—"}</td>
                                                <td className="px-5 py-3 text-sm text-tertiary">{s.schedule ?? "—"}</td>
                                                <td className="px-5 py-3 text-right">
                                                    <Button color="secondary" size="sm" iconLeading={Play} href="#/question-bar">
                                                        Open
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>
                    )}
                </>
            )}
        </PiShell>
    );
};

/* ========================================================== B · Question bar === */

const Slot = ({ children, tone = "teal", add, href, open }: { children: ReactNode; tone?: "teal" | "pink" | "gray"; add?: boolean; href?: string; open?: boolean }) => {
    const style = add
        ? { color: PINK, borderColor: `${PINK}80`, backgroundColor: open ? `${PINK}14` : undefined }
        : tone === "teal"
          ? { color: "#1F7F80", backgroundColor: `${TEAL}24` }
          : tone === "pink"
            ? { color: "#A94579", backgroundColor: `${PINK}24` }
            : { color: "#344054", backgroundColor: "#F2F4F7" };
    return (
        <a
            href={href}
            aria-expanded={open}
            className={cx(
                "mx-0.5 inline-flex cursor-pointer items-center gap-1 rounded-lg px-2 py-0.5 align-baseline font-semibold transition-colors",
                add && "border border-dashed",
                open && "ring-2 ring-offset-1",
            )}
            style={{ ...style, ["--tw-ring-color" as string]: `${PINK}66` }}
        >
            {add && <Plus className="size-4" aria-hidden="true" />}
            {children}
            {!add && <ChevronDown className="size-4 opacity-60" aria-hidden="true" />}
        </a>
    );
};

const metricGroups = [
    { group: "Money", items: ["Revenue", "eCPM", "Spend"] },
    { group: "Volume", items: ["Impressions", "Requests", "Clicks"] },
    { group: "Rates", items: ["Fill Rate", "Win Rate", "CTR"] },
];

/** Metric picker opened from the “+ metric” slot. Search + grouped checklist; chosen ones stay pinned on top. */
const MetricPicker = () => {
    const [chosen, setChosen] = useState(["Revenue", "eCPM", "Fill Rate"]);
    const [find, setFind] = useState("");
    return (
        <div className="absolute top-full left-24 z-30 mt-2 flex w-80 flex-col gap-3 rounded-xl bg-primary p-3 shadow-xl ring-1 ring-secondary">
            <Input aria-label="Find a metric" size="sm" icon={SearchLg} placeholder="Find a metric" value={find} onChange={setFind} />
            <div className="flex max-h-72 flex-col gap-3 overflow-y-auto">
                {metricGroups.map((g) => {
                    const items = g.items.filter((m) => m.toLowerCase().includes(find.trim().toLowerCase()));
                    if (!items.length) return null;
                    return (
                        <div key={g.group} className="flex flex-col gap-0.5">
                            <span className="px-2 text-xs font-semibold text-tertiary uppercase">{g.group}</span>
                            {items.map((m) => (
                                <Checkbox
                                    key={m}
                                    className="rounded-md px-2 py-1.5 hover:bg-primary_hover"
                                    label={
                                        <span className="flex w-full items-center justify-between gap-2">
                                            {m}
                                            {m === "Fill Rate" && <span className="text-xs font-medium" style={{ color: PINK }}>added</span>}
                                        </span>
                                    }
                                    isSelected={chosen.includes(m)}
                                    onChange={(on) => setChosen((c) => (on ? [...c, m] : c.filter((x) => x !== m)))}
                                />
                            ))}
                        </div>
                    );
                })}
            </div>
            <div className="flex items-center justify-between border-t border-secondary pt-3">
                <span className="text-xs text-tertiary">{chosen.length} metrics</span>
                <Button size="sm" color="primary-pink" href="#/question-bar-draft">
                    Done
                </Button>
            </div>
        </div>
    );
};

export interface QuestionBarProps {
    /** Query edited but not run: results dim until Run. */
    draft?: boolean;
    /** The “+ metric” picker is open. */
    picker?: boolean;
    /** The Save dialog is open. */
    saving?: boolean;
    /** Just saved: confirmation toast. */
    saved?: boolean;
}

export const QuestionBar = ({ draft = false, picker = false, saving = false, saved = false }: QuestionBarProps) => {
    const [hidden, setHidden] = useState<string[]>([]);
    const [rolling, setRolling] = useState(true);
    const stale = draft || picker;
    return (
        <PiShell
            active="New Query"
            concept={{
                label: "Concept B",
                title: "The query as one editable sentence",
                notes: [
                    "Metrics, breakdown, date range, filters and comparison read as one sentence, and each highlighted part opens its picker. The checkbox walls go away.",
                    "Nothing loads until Run, and edits mark the results as stale instead of re-querying on every click, which addresses the slow up-front loading.",
                    "Saving asks the one question that matters later: should the date range roll forward, or stay fixed?",
                ],
            }}
        >
            <div className="relative flex flex-col gap-4 rounded-2xl p-6 ring-1 ring-secondary">
                <p className="text-xl leading-[1.9] text-primary">
                    Show <Slot tone="pink">Revenue</Slot>
                    <Slot tone="pink">eCPM</Slot>
                    {stale && <Slot tone="pink">Fill Rate</Slot>}
                    <Slot add href={picker ? "#/question-bar" : "#/question-bar-picker"} open={picker}>
                        metric
                    </Slot>{" "}
                    by <Slot>Demand Source</Slot>
                    <Slot add>breakdown</Slot> for <Slot tone="gray">Last 7 days</Slot> where <Slot tone="gray">App is Pocket Garden (iOS)</Slot>
                    <Slot add>filter</Slot>, compared with <Slot tone="gray">the previous 7 days</Slot>.
                </p>
                {picker && <MetricPicker />}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary pt-4">
                    <span className="text-sm text-tertiary">
                        {stale ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="size-2 rounded-full bg-warning-solid" aria-hidden="true" />
                                Changed: added Fill Rate · results are out of date
                            </span>
                        ) : (
                            "Last run 9:14 AM UTC · 35 rows · 0.8s"
                        )}
                    </span>
                    <div className="flex gap-3">
                        <Button color="secondary" iconLeading={BookmarkCheck} href={saved ? "#/saved" : "#/question-bar-save"}>
                            {saved ? "Saved" : "Save"}
                        </Button>
                        <Button color="secondary" iconLeading={Download01}>
                            CSV
                        </Button>
                        <Button color="primary-pink" iconLeading={stale ? Play : RefreshCcw01} href="#/question-bar">
                            {stale ? "Run query" : "Re-run"}
                        </Button>
                    </div>
                </div>
            </div>

            {saving && (
                <DialogFrame
                    title="Save query"
                    description="Saved queries appear in Saved Queries for everyone on this account."
                    footer={
                        <>
                            <Button color="secondary" href="#/question-bar">
                                Cancel
                            </Button>
                            <Button color="primary-pink" href="#/question-bar-saved">
                                Save query
                            </Button>
                        </>
                    }
                >
                    <Input label="Name" defaultValue="Revenue & eCPM by demand source" size="sm" />
                    <fieldset className="flex flex-col gap-2">
                        <legend className="mb-1.5 text-sm font-medium text-secondary">Date range when it runs later</legend>
                        {[
                            { on: true, title: "Rolling: always the last 7 days", hint: "Next Monday it shows Sep 15 – Sep 21." },
                            { on: false, title: "Fixed: Sep 12 – Sep 18, 2026", hint: "Always these exact dates. Good for recaps." },
                        ].map((o) => {
                            const selected = o.on === rolling;
                            return (
                                <button
                                    key={o.title}
                                    type="button"
                                    onClick={() => setRolling(o.on)}
                                    aria-pressed={selected}
                                    className={cx("flex items-start gap-3 rounded-xl p-3 text-left ring-1", selected ? "ring-2" : "ring-secondary")}
                                    style={selected ? { ["--tw-ring-color" as string]: PINK, backgroundColor: `${PINK}0d` } : undefined}
                                >
                                    <span
                                        className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full ring-1 ring-secondary"
                                        style={selected ? { backgroundColor: PINK } : undefined}
                                        aria-hidden="true"
                                    >
                                        {selected && <span className="size-1.5 rounded-full bg-white" />}
                                    </span>
                                    <span className="flex flex-col">
                                        <span className="text-sm font-semibold text-primary">{o.title}</span>
                                        <span className="text-sm text-tertiary">{o.hint}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </fieldset>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex flex-col gap-1.5">
                            <span className="font-medium text-secondary">Account</span>
                            <span className="rounded-lg px-3 py-2 ring-1 ring-secondary">
                                <AccountChip account="Pocket Garden Media" />
                            </span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <span className="font-medium text-secondary">Report type</span>
                            <span className="rounded-lg px-3 py-2 ring-1 ring-secondary">
                                <TypeBadge type="Demand" />
                            </span>
                        </div>
                    </div>
                </DialogFrame>
            )}

            {saved && (
                <Toast>
                    <span>
                        Saved <strong>Revenue &amp; eCPM by demand source</strong> to Saved Queries.
                    </span>
                    <a href="#/saved?new=1" className="font-semibold whitespace-nowrap" style={{ color: "#F4A3C9" }}>
                        View →
                    </a>
                </Toast>
            )}

            <div className={cx("flex flex-col gap-6 transition-opacity", stale && "pointer-events-none opacity-40")} aria-hidden={stale}>
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
