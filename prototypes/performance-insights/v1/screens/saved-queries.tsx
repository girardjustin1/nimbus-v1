import { type ReactNode, useState } from "react";
import {
    AlertTriangle,
    ArrowRight,
    BookmarkCheck,
    Calendar,
    CalendarDate,
    Check,
    ChevronDown,
    ChevronRight,
    Clock,
    Copy01,
    DotsHorizontal,
    Edit03,
    Link01,
    Mail01,
    Play,
    Plus,
    RefreshCcw01,
    SearchLg,
    Share07,
    Star01,
    Trash01,
    XClose,
} from "@untitledui/icons";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "./das-shell";
import { AccountChip, Delta, DialogFrame, PiShell, RecommendedPill, Skeleton, Sparkline, Toast, TypeBadge } from "./pi-shared";
import { readHashParams, writeHashParams } from "./route";
import {
    type ReportType,
    type SavedQuery,
    TODAY,
    endedDaysAgo,
    fmt,
    hasEnded,
    longDate,
    queryById,
    rangeBounds,
    rangeDetail,
    rangeLabel,
    relativeDay,
    reportTypes,
    savedQueryList,
    toTime,
    trendDays,
    typeColors,
} from "./sq-data";

/**
 * Saved Queries — screen concepts.
 *
 * Today's page is a black-header table with five text columns (Report Name, Report Date
 * Range, Date Created, Account, Report Type) and two checkboxes (Saved, Recommended).
 * It shows nothing about what a query returns, and nothing when both boxes are off.
 * The concepts keep those five columns and make each one visual:
 *   D. Smart table — same table, richer cells (range bar, trend, type badge), row actions.
 *   E. Preview cards — each query shows its latest number and trend before it's opened.
 *   F. Date-range timeline — ranges drawn on a calendar, so overlaps and stale ranges show.
 *   G. List + preview — pick on the left, see the result on the right.
 */

const go = (id: string) => {
    window.location.hash = `#/${id}`;
};

const saved = savedQueryList.filter((q) => q.source === "saved");
const recommended = savedQueryList.filter((q) => q.source === "recommended");

/* ================================================================= Today === */

/** Reference: the current page, as the screenshot shows it (fictional account name). */
export const SavedToday = () => (
    <PiShell
        active="Saved Queries"
        bodyClassName="gap-0 px-0 py-0"
        concept={{
            label: "Reference",
            title: "Saved Queries today",
            notes: [
                "Five text columns and two checkboxes. The table gives no hint of what each query shows, how fresh its dates are, or what to do next.",
                "With nothing saved, the page is just a black header row. There's no empty state and no way forward.",
                "The concepts that follow keep these five columns and make each one visual.",
            ],
        }}
    >
        <div className="flex items-center gap-10 px-14 py-5">
            <span className="text-lg font-bold text-primary">Show:</span>
            {["Saved", "Recommended"].map((label) => (
                <Checkbox key={label} size="md" label={label} defaultSelected />
            ))}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left">
                <thead>
                    <tr className="bg-[#141414] text-white">
                        {["", "Report Name", "Report Date Range", "Date Created", "Account", "Report Type", ""].map((h, i) => (
                            <th key={i} className="border-r border-white/40 px-14 py-6 text-md font-semibold last:border-r-0">
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>
        </div>
        <div className="h-96" />
    </PiShell>
);

/* ========================================================== Shared cells === */

const WINDOW_START = toTime("2026-04-01");
const WINDOW_END = toTime("2026-09-30");
const pos = (t: number) => ((t - WINDOW_START) / (WINDOW_END - WINDOW_START)) * 100;

/** Where a query's dates sit in the last six months. Striped = rolling (moves with today). */
const RangeBar = ({ q, className }: { q: SavedQuery; className?: string }) => {
    const { start, end } = rangeBounds(q.range);
    const color = hasEnded(q.range) ? "#F79009" : typeColors[q.type].solid;
    const left = Math.max(0, pos(start));
    const width = Math.max(1.5, pos(end) - left);
    return (
        <div className={cx("relative h-1.5 rounded-full bg-quaternary", className)} aria-hidden="true">
            <span
                className="absolute inset-y-0 rounded-full"
                style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    background: q.range.kind === "rolling" ? `repeating-linear-gradient(-45deg, ${color}, ${color} 3px, ${color}99 3px, ${color}99 6px)` : color,
                }}
            />
            <span className="absolute -top-1 h-3.5 w-px bg-fg-primary" style={{ left: `${pos(toTime(TODAY))}%` }} />
        </div>
    );
};

const RangeCell = ({ q }: { q: SavedQuery }) => (
    <div className="flex min-w-48 flex-col gap-1.5">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            {q.range.kind === "rolling" ? (
                <RefreshCcw01 className="size-3.5 text-fg-quaternary" aria-hidden="true" />
            ) : (
                <CalendarDate className="size-3.5 text-fg-quaternary" aria-hidden="true" />
            )}
            {rangeLabel(q.range)}
        </span>
        <RangeBar q={q} />
        {hasEnded(q.range) ? (
            <span className="text-xs font-medium text-warning-primary">Ended {endedDaysAgo(q.range)} days ago</span>
        ) : (
            <span className="text-xs text-tertiary">{rangeDetail(q.range)}</span>
        )}
    </div>
);

const TrendCell = ({ q }: { q: SavedQuery }) => {
    const k = q.kpis[0];
    return (
        <div className="flex min-w-40 items-center gap-3">
            <Sparkline points={q.trend} color={typeColors[q.type].solid} className="h-8 w-16 shrink-0" />
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-primary">{fmt(k.value, k.format)}</span>
                <span className="flex items-center gap-1 text-xs text-tertiary">
                    {k.label} <Delta now={k.value} prev={k.prev} />
                </span>
            </div>
        </div>
    );
};

const summary = (q: SavedQuery) => `${q.metrics.join(", ")} by ${q.breakdown.join(" › ")}`;

/* ======================================================= D · Smart table === */

export interface SmartTableProps {
    show?: { saved: boolean; recommended: boolean };
    groupBy?: "none" | "type";
    search?: string;
    loading?: boolean;
    /** No saved queries yet — recommendations become the starter set. */
    firstRun?: boolean;
    selected?: string[];
    /** Row whose ⋯ menu is open. */
    menuFor?: string;
    dialog?: "delete" | "delete-many" | "schedule";
    /** Toast after a delete. */
    deleted?: boolean;
}

const filterRoute = (s: boolean, r: boolean) => (s && r ? "saved" : s ? "saved-only-saved" : r ? "saved-only-recommended" : "saved-none");

const RowMenu = ({ q }: { q: SavedQuery }) => (
    <div role="menu" className="absolute top-full right-4 z-30 mt-1 flex w-52 flex-col rounded-xl bg-primary py-1.5 text-left shadow-xl ring-1 ring-secondary">
        {[
            { icon: Play, label: "Run", href: "#/question-bar" },
            { icon: Edit03, label: "Edit query", href: "#/question-bar-draft" },
            { icon: Copy01, label: "Duplicate" },
            { icon: Mail01, label: q.schedule ? "Edit schedule" : "Schedule email", href: "#/saved-schedule" },
            { icon: Link01, label: "Copy link" },
        ].map((item) => (
            <a key={item.label} role="menuitem" href={item.href} className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-secondary hover:bg-primary_hover">
                <item.icon className="size-4 text-fg-quaternary" aria-hidden="true" />
                {item.label}
            </a>
        ))}
        <div className="my-1 border-t border-secondary" />
        <a role="menuitem" href="#/saved-delete" className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-error-primary hover:bg-error-primary">
            <Trash01 className="size-4" aria-hidden="true" />
            Delete
        </a>
    </div>
);

const TableRow = ({ q, checked, onCheck, menuOpen }: { q: SavedQuery; checked: boolean; onCheck: (on: boolean) => void; menuOpen: boolean }) => (
    <tr className={cx("group border-t border-secondary align-middle transition-colors", checked ? "bg-[#E3F5F5]/60" : "hover:bg-primary_hover")}>
        <td className="py-4 pr-2 pl-5">
            <Checkbox aria-label={`Select ${q.name}`} isSelected={checked} onChange={onCheck} />
        </td>
        <td className="px-4 py-4">
            <div className="flex min-w-64 flex-col gap-1">
                <span className="flex flex-wrap items-center gap-2">
                    <a href={`#/preview?q=${q.id}`} className="text-sm font-semibold text-primary hover:underline">
                        {q.name}
                    </a>
                    {q.pinned && <Star01 className="size-3.5 fill-current" style={{ color: "#F79009" }} aria-label="Pinned" />}
                    {q.source === "recommended" && <RecommendedPill />}
                </span>
                <span className="text-xs text-tertiary">{summary(q)}</span>
            </div>
        </td>
        <td className="px-4 py-4">
            <RangeCell q={q} />
        </td>
        <td className="px-4 py-4">
            <div className="flex flex-col whitespace-nowrap">
                <span className="text-sm text-primary">{q.source === "recommended" ? "Suggested" : longDate(q.created)}</span>
                <span className="text-xs text-tertiary">{q.source === "recommended" ? relativeDay(q.created) : `${relativeDay(q.created)} · ${q.owner}`}</span>
            </div>
        </td>
        <td className="px-4 py-4">
            <AccountChip account={q.account} />
        </td>
        <td className="px-4 py-4">
            <TypeBadge type={q.type} />
        </td>
        <td className="px-4 py-4">
            <TrendCell q={q} />
        </td>
        <td className="relative py-4 pr-5 pl-2">
            <div className="flex items-center justify-end gap-1">
                {q.source === "recommended" ? (
                    <Button size="sm" color="secondary" iconLeading={BookmarkCheck}>
                        Save
                    </Button>
                ) : (
                    <Button size="sm" color="secondary" iconLeading={Play} href="#/question-bar">
                        Run
                    </Button>
                )}
                <a
                    href={menuOpen ? "#/saved" : "#/saved-row-menu"}
                    aria-label={`More actions for ${q.name}`}
                    aria-expanded={menuOpen}
                    className={cx("rounded-md p-1.5 text-fg-quaternary hover:bg-secondary", menuOpen && "bg-secondary text-fg-secondary")}
                >
                    <DotsHorizontal className="size-5" aria-hidden="true" />
                </a>
            </div>
            {menuOpen && <RowMenu q={q} />}
        </td>
    </tr>
);

const FilterChip = ({ label, count, on, onToggle }: { label: string; count: number; on: boolean; onToggle: () => void }) => (
    <button
        type="button"
        aria-pressed={on}
        onClick={onToggle}
        className={cx("inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold ring-1 transition-colors", on ? "ring-transparent" : "text-tertiary ring-secondary hover:bg-primary_hover")}
        style={on ? { color: "#1F7F80", backgroundColor: `${TEAL}1f` } : undefined}
    >
        <span className={cx("flex size-4 items-center justify-center rounded", !on && "ring-1 ring-secondary")} style={on ? { backgroundColor: TEAL } : undefined} aria-hidden="true">
            {on && <Check className="size-3 text-white" />}
        </span>
        {label}
        <span className="rounded-full bg-primary px-1.5 text-xs font-medium text-tertiary">{count}</span>
    </button>
);

const Segmented = <T extends string>({ label, value, options }: { label: string; value: T; options: { value: T; label: string; href: string }[] }) => (
    <div className="flex items-center gap-2 text-sm">
        <span className="text-tertiary">{label}</span>
        <div className="flex rounded-lg bg-secondary p-0.5">
            {options.map((o) => (
                <a
                    key={o.value}
                    href={o.href}
                    aria-current={o.value === value ? "true" : undefined}
                    className={cx("rounded-md px-3 py-1 font-semibold", o.value === value ? "bg-primary text-primary shadow-xs" : "text-tertiary hover:text-secondary")}
                >
                    {o.label}
                </a>
            ))}
        </div>
    </div>
);

const headers = ["Report Name", "Report Date Range", "Date Created", "Account", "Report Type", "Last 7 days"];

export const SmartTable = ({
    show = { saved: true, recommended: true },
    groupBy = "none",
    search = "",
    loading = false,
    firstRun = false,
    selected: initialSelected = [],
    menuFor,
    dialog,
    deleted = false,
}: SmartTableProps) => {
    const [query, setQuery] = useState(search);
    const [selected, setSelected] = useState<string[]>(initialSelected);
    const [collapsed, setCollapsed] = useState<ReportType[]>([]);
    const isNew = readHashParams().get("new") === "1";

    const pool = (firstRun ? recommended : savedQueryList).filter((q) => (q.source === "saved" ? show.saved : show.recommended));
    const q = query.trim().toLowerCase();
    const rows = pool.filter((r) => !q || [r.name, r.type, r.account, ...r.metrics, ...r.breakdown].some((t) => t.toLowerCase().includes(q)));
    const savedCount = firstRun ? 0 : saved.length;

    const groups: { key: string; type?: ReportType; rows: SavedQuery[] }[] =
        groupBy === "type" ? reportTypes.map((t) => ({ key: t, type: t, rows: rows.filter((r) => r.type === t) })).filter((g) => g.rows.length) : [{ key: "all", rows }];

    const toggle = (id: string, on: boolean) => setSelected((s) => (on ? [...s, id] : s.filter((x) => x !== id)));
    const allOn = rows.length > 0 && rows.every((r) => selected.includes(r.id));
    const menuQuery = menuFor ? queryById(menuFor) : undefined;

    return (
        <PiShell
            active="Saved Queries"
            concept={{
                label: "Concept D",
                title: "Smart table: the same five columns, made visual",
                notes: [
                    "Report Date Range becomes a bar on a six-month track: striped bars roll with today, solid ones are fixed, and amber means the range has ended.",
                    "A “Last 7 days” column shows each query's headline number and trend, so you can see what changed without opening anything.",
                    "Saved and Recommended become filter chips with counts. Turning both off shows a way back instead of an empty black header.",
                ],
            }}
        >
            {isNew && (
                <div className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: `${TEAL}14`, color: "#1F7F80" }}>
                    <Check className="size-4" aria-hidden="true" />
                    <span>
                        <strong>Revenue &amp; eCPM by demand source</strong> was saved. It rolls forward and always shows the last 7 days.
                    </span>
                </div>
            )}

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                    <span className="text-sm font-semibold text-primary">Show</span>
                    <FilterChip label="Saved" count={savedCount} on={show.saved} onToggle={() => go(filterRoute(!show.saved, show.recommended))} />
                    <FilterChip label="Recommended" count={recommended.length} on={show.recommended} onToggle={() => go(filterRoute(show.saved, !show.recommended))} />
                    <Input aria-label="Search saved queries" size="sm" icon={SearchLg} placeholder="Search name, metric, account…" wrapperClassName="w-72" value={query} onChange={setQuery} />
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <Segmented
                        label="Group"
                        value={groupBy}
                        options={[
                            { value: "none", label: "None", href: "#/saved" },
                            { value: "type", label: "Report type", href: "#/saved-grouped" },
                        ]}
                    />
                    <Button color="primary-pink" iconLeading={Plus} href="#/question-bar-draft">
                        New query
                    </Button>
                </div>
            </div>

            {selected.length > 0 && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#101828] px-4 py-2.5 text-sm text-white">
                    <span className="font-semibold">{selected.length} selected</span>
                    <div className="flex items-center gap-2">
                        {[
                            { icon: Play, label: "Run all" },
                            { icon: Share07, label: "Share" },
                            { icon: Mail01, label: "Schedule", href: "#/saved-schedule" },
                            { icon: Trash01, label: "Delete", href: "#/saved-delete-many" },
                        ].map((a) => (
                            <a key={a.label} href={a.href} className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-semibold hover:bg-white/10">
                                <a.icon className="size-4 opacity-70" aria-hidden="true" />
                                {a.label}
                            </a>
                        ))}
                        <button type="button" aria-label="Clear selection" onClick={() => setSelected([])} className="rounded-md p-1 hover:bg-white/10">
                            <XClose className="size-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>
            )}

            {firstRun && show.recommended && (
                <div className="flex items-start gap-4 rounded-2xl p-5 ring-1 ring-secondary" style={{ background: `linear-gradient(90deg, ${PINK}14, ${TEAL}10)` }}>
                    <BookmarkCheck className="mt-0.5 size-6 shrink-0" style={{ color: PINK }} aria-hidden="true" />
                    <div className="flex flex-col gap-1">
                        <p className="text-md font-semibold text-primary">You haven't saved a query yet</p>
                        <p className="text-sm text-secondary">
                            Save any query from New Query and it lands here with its date range, owner and latest numbers. These four are picked for Pocket Garden Media to get you started.
                        </p>
                    </div>
                </div>
            )}

            {!show.saved && !show.recommended ? (
                <EmptyBlock
                    icon={<BookmarkCheck className="size-6" style={{ color: TEAL }} aria-hidden="true" />}
                    title="Nothing to show"
                    body="Saved and Recommended are both turned off. Turn one back on to see your queries."
                    actions={
                        <>
                            <Button color="secondary" size="sm" href="#/saved-only-saved">
                                Show saved ({saved.length})
                            </Button>
                            <Button color="secondary" size="sm" href="#/saved">
                                Show everything
                            </Button>
                        </>
                    }
                />
            ) : !loading && rows.length === 0 ? (
                <EmptyBlock
                    icon={<SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />}
                    title={`No queries match “${query.trim()}”`}
                    body="Search looks at names, metrics, breakdowns, accounts and report types."
                    actions={
                        <>
                            <Button color="secondary" size="sm" onClick={() => setQuery("")}>
                                Clear search
                            </Button>
                            <Button color="primary-pink" size="sm" iconLeading={Plus} href="#/question-bar-draft">
                                Build a new query
                            </Button>
                        </>
                    }
                />
            ) : (
                <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                    <table className="w-full min-w-[1180px] text-left">
                        <thead className="bg-[#101828] text-white">
                            <tr>
                                <th className="w-10 py-3 pr-2 pl-5">
                                    <Checkbox
                                        aria-label="Select all"
                                        isSelected={allOn}
                                        isIndeterminate={!allOn && rows.some((r) => selected.includes(r.id))}
                                        onChange={(on) => setSelected(on ? rows.map((r) => r.id) : [])}
                                    />
                                </th>
                                {headers.map((h, i) => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap uppercase">
                                        <span className="inline-flex items-center gap-1">
                                            {h}
                                            {i === 2 && <ChevronDown className="size-3.5 opacity-60" aria-label="Sorted newest first" />}
                                        </span>
                                    </th>
                                ))}
                                <th className="py-3 pr-5 pl-2" />
                            </tr>
                        </thead>
                        {loading ? (
                            <tbody>
                                {Array.from({ length: 6 }, (_, i) => (
                                    <tr key={i} className="border-t border-secondary">
                                        <td className="py-5 pr-2 pl-5">
                                            <Skeleton className="size-4" />
                                        </td>
                                        {[64, 44, 28, 36, 24, 36].map((w, j) => (
                                            <td key={j} className="px-4 py-5">
                                                <Skeleton className="h-3.5" />
                                                <Skeleton className="mt-2 h-2.5" />
                                                <span className="sr-only">{w}</span>
                                            </td>
                                        ))}
                                        <td />
                                    </tr>
                                ))}
                            </tbody>
                        ) : (
                            groups.map((g) => {
                                const isCollapsed = g.type && collapsed.includes(g.type);
                                return (
                                    <tbody key={g.key}>
                                        {g.type && (
                                            <tr className="border-t border-secondary bg-secondary">
                                                <td colSpan={8} className="px-5 py-2">
                                                    <button
                                                        type="button"
                                                        aria-expanded={!isCollapsed}
                                                        onClick={() => setCollapsed((c) => (isCollapsed ? c.filter((x) => x !== g.type) : [...c, g.type!]))}
                                                        className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
                                                    >
                                                        {isCollapsed ? <ChevronRight className="size-4" aria-hidden="true" /> : <ChevronDown className="size-4" aria-hidden="true" />}
                                                        <TypeBadge type={g.type} />
                                                        <span className="text-tertiary">{g.rows.length}</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        )}
                                        {!isCollapsed &&
                                            g.rows.map((r) => (
                                                <TableRow key={r.id} q={r} checked={selected.includes(r.id)} onCheck={(on) => toggle(r.id, on)} menuOpen={menuFor === r.id} />
                                            ))}
                                    </tbody>
                                );
                            })
                        )}
                    </table>
                </div>
            )}

            {!loading && rows.length > 0 && (
                <div className="flex flex-wrap items-center gap-5 text-xs text-tertiary">
                    <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-6 rounded-full" style={{ background: `repeating-linear-gradient(-45deg, ${TEAL}, ${TEAL} 3px, ${TEAL}99 3px, ${TEAL}99 6px)` }} />
                        Rolling range
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-6 rounded-full" style={{ backgroundColor: TEAL }} />
                        Fixed range
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-6 rounded-full bg-[#F79009]" />
                        Fixed range that has ended
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-3 w-px bg-fg-primary" /> Today · track shows Apr – Sep 2026
                    </span>
                </div>
            )}

            {dialog === "delete" && menuQuery && (
                <DialogFrame
                    title={`Delete “${menuQuery.name}”?`}
                    description={
                        <>
                            It's emailed <strong>{menuQuery.schedule}</strong> and was last run {menuQuery.lastRun?.toLowerCase()}. Deleting it stops the email for everyone who gets it.
                        </>
                    }
                    footer={
                        <>
                            <Button color="secondary" href="#/saved">
                                Cancel
                            </Button>
                            <Button color="primary-destructive" iconLeading={Trash01} href="#/saved-deleted">
                                Delete query
                            </Button>
                        </>
                    }
                />
            )}
            {dialog === "delete-many" && (
                <DialogFrame
                    title={`Delete ${selected.length} queries?`}
                    description="One of them has a scheduled email. Deleting stops it."
                    footer={
                        <>
                            <Button color="secondary" href="#/saved-selected">
                                Cancel
                            </Button>
                            <Button color="primary-destructive" iconLeading={Trash01} href="#/saved-deleted">
                                Delete {selected.length} queries
                            </Button>
                        </>
                    }
                >
                    <ul className="flex flex-col gap-2 rounded-xl bg-secondary p-3">
                        {selected.map((id) => {
                            const s = queryById(id);
                            return (
                                <li key={id} className="flex items-center justify-between gap-3 text-sm">
                                    <span className="font-medium text-primary">{s.name}</span>
                                    {s.schedule ? (
                                        <span className="inline-flex items-center gap-1 text-xs font-medium text-warning-primary">
                                            <Mail01 className="size-3.5" aria-hidden="true" /> {s.schedule}
                                        </span>
                                    ) : (
                                        <TypeBadge type={s.type} />
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </DialogFrame>
            )}
            {dialog === "schedule" && menuQuery && <ScheduleDialog q={menuQuery} />}
            {deleted && (
                <Toast>
                    <span>
                        Deleted <strong>Android fill-rate watch</strong>. Its daily email is stopped.
                    </span>
                    <a href="#/saved" className="font-semibold" style={{ color: "#F4A3C9" }}>
                        Undo
                    </a>
                </Toast>
            )}
        </PiShell>
    );
};

const EmptyBlock = ({ icon, title, body, actions }: { icon: ReactNode; title: string; body: string; actions: ReactNode }) => (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-secondary px-6 py-14 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary">{icon}</span>
        <p className="text-md font-semibold text-primary">{title}</p>
        <p className="max-w-md text-sm text-tertiary">{body}</p>
        <div className="flex flex-wrap justify-center gap-3">{actions}</div>
    </div>
);

const ScheduleDialog = ({ q }: { q: SavedQuery }) => {
    const [freq, setFreq] = useState("Daily");
    return (
        <DialogFrame
            title="Email schedule"
            description={
                <>
                    Sends <strong>{q.name}</strong> as a PDF summary and CSV. The date range rolls forward, so each email covers {rangeLabel(q.range).toLowerCase()}.
                </>
            }
            footer={
                <>
                    <Button color="secondary" href="#/saved">
                        Cancel
                    </Button>
                    <Button color="primary-pink" href="#/saved">
                        Save schedule
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-secondary">How often</span>
                <div className="flex rounded-lg bg-secondary p-0.5">
                    {["Off", "Daily", "Weekly", "Monthly"].map((f) => (
                        <button
                            key={f}
                            type="button"
                            aria-pressed={f === freq}
                            onClick={() => setFreq(f)}
                            className={cx("flex-1 rounded-md px-3 py-1.5 text-sm font-semibold", f === freq ? "bg-primary text-primary shadow-xs" : "text-tertiary")}
                        >
                            {f}
                        </button>
                    ))}
                </div>
                <span className="text-xs text-tertiary">
                    {freq === "Off" ? "No emails." : freq === "Daily" ? "Every day at 8:00 AM UTC." : freq === "Weekly" ? "Mondays at 8:00 AM UTC." : "The 1st of each month at 8:00 AM UTC."}
                </span>
            </div>
            <div className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-secondary">Send to</span>
                <div className="flex flex-wrap items-center gap-2 rounded-lg px-2.5 py-2 ring-1 ring-secondary">
                    {["luis@pocketgarden.example", "ad-ops@pocketgarden.example"].map((e) => (
                        <span key={e} className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary">
                            {e}
                            <XClose className="size-3 text-fg-quaternary" aria-hidden="true" />
                        </span>
                    ))}
                    <span className="text-sm text-placeholder">Add email…</span>
                </div>
            </div>
            <Checkbox label="Only send when a number changes by more than 10%" defaultSelected />
        </DialogFrame>
    );
};

/* ===================================================== E · Preview cards === */

export interface CardsProps {
    type?: ReportType | "All";
    /** Recommendation whose “why” is expanded. */
    whyFor?: string;
    /** Recommendation that was just dismissed. */
    dismissed?: string;
}

const QueryCard = ({ q, why, onWhy }: { q: SavedQuery; why?: boolean; onWhy?: () => void }) => {
    const k = q.kpis[0];
    const color = typeColors[q.type].solid;
    return (
        <article className={cx("relative flex flex-col gap-4 rounded-2xl bg-primary p-5 ring-1 transition-shadow hover:shadow-md", q.source === "recommended" ? "ring-[#F4C1DA]" : "ring-secondary")}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <TypeBadge type={q.type} size="xs" />
                        {q.source === "recommended" && <RecommendedPill />}
                    </div>
                    <a href={`#/preview?q=${q.id}`} className="text-md font-semibold text-primary hover:underline">
                        {q.name}
                    </a>
                </div>
                {q.pinned ? <Star01 className="size-4 shrink-0 fill-current" style={{ color: "#F79009" }} aria-label="Pinned" /> : <AccountChip account={q.account} compact />}
            </div>

            <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col">
                    <span className="text-xs font-medium text-tertiary">{k.label}</span>
                    <span className="text-display-xs font-semibold text-primary">{fmt(k.value, k.format)}</span>
                    <span className="flex items-center gap-1 text-xs text-tertiary">
                        <Delta now={k.value} prev={k.prev} /> vs previous period
                    </span>
                </div>
                <Sparkline points={q.trend} color={color} fill className="h-14 w-32" />
            </div>

            {q.kpis.length > 1 && (
                <div className="flex gap-4 border-t border-secondary pt-3">
                    {q.kpis.slice(1).map((x) => (
                        <div key={x.label} className="flex flex-col">
                            <span className="text-xs text-tertiary">{x.label}</span>
                            <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                                {fmt(x.value, x.format)} <Delta now={x.value} prev={x.prev} />
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-xs text-tertiary">
                <span className={cx("inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-medium", hasEnded(q.range) ? "bg-warning-primary text-warning-primary" : "bg-secondary text-secondary")}>
                    {q.range.kind === "rolling" ? <RefreshCcw01 className="size-3" aria-hidden="true" /> : <Calendar className="size-3" aria-hidden="true" />}
                    {rangeLabel(q.range)}
                    {hasEnded(q.range) && " · ended"}
                </span>
                {q.source === "recommended" ? (
                    <button type="button" onClick={onWhy} className="font-semibold" style={{ color: PINK }} aria-expanded={why}>
                        Why this?
                    </button>
                ) : (
                    <span>
                        {q.owner} · {relativeDay(q.created)}
                    </span>
                )}
            </div>

            {why && (
                <div className="absolute inset-x-3 top-full z-20 -mt-2 flex flex-col gap-3 rounded-xl bg-primary p-4 shadow-xl ring-1 ring-secondary">
                    <p className="text-sm font-semibold text-primary">Why you're seeing this</p>
                    <p className="text-sm text-secondary">{q.reason}</p>
                    <div className="flex gap-2">
                        <Button size="sm" color="primary-pink" iconLeading={BookmarkCheck}>
                            Save to my queries
                        </Button>
                        <Button size="sm" color="secondary" href={`#/cards-dismissed`}>
                            Not useful
                        </Button>
                    </div>
                </div>
            )}
        </article>
    );
};

export const Cards = ({ type = "All", whyFor, dismissed }: CardsProps) => {
    const [filter, setFilter] = useState<ReportType | "All">(type);
    const [why, setWhy] = useState(whyFor);
    const visible = (list: SavedQuery[]) => list.filter((q) => (filter === "All" || q.type === filter) && q.id !== dismissed);
    const pinned = visible(saved.filter((q) => q.pinned));
    const recs = visible(recommended);
    const rest = visible(saved.filter((q) => !q.pinned));

    const section = (title: string, list: SavedQuery[], hint?: ReactNode) =>
        list.length > 0 && (
            <section className="flex flex-col gap-3">
                <div className="flex items-baseline gap-3">
                    <h3 className="text-lg font-semibold text-primary">{title}</h3>
                    <span className="text-sm text-tertiary">{hint ?? list.length}</span>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
                    {list.map((q) => (
                        <QueryCard key={q.id} q={q} why={why === q.id} onWhy={() => setWhy(why === q.id ? undefined : q.id)} />
                    ))}
                </div>
            </section>
        );

    return (
        <PiShell
            active="Saved Queries"
            concept={{
                label: "Concept E",
                title: "Preview cards: see the answer before opening the query",
                notes: [
                    "Each card leads with the query's headline number, its change and a trend, so the list works as a lightweight dashboard.",
                    "Pinned queries sit on top. Recommendations are a separate row with a “Why this?” explanation and one-click Save or dismiss.",
                    "Report Type becomes a filter row with counts. Account and date range move into each card's footer.",
                ],
            }}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filter by report type">
                    {(["All", ...reportTypes] as const).map((t) => {
                        const n = t === "All" ? savedQueryList.length : savedQueryList.filter((q) => q.type === t).length;
                        const on = filter === t;
                        return (
                            <button
                                key={t}
                                type="button"
                                aria-pressed={on}
                                onClick={() => setFilter(t)}
                                className={cx("inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ring-1", on ? "text-white ring-transparent" : "text-secondary ring-secondary hover:bg-primary_hover")}
                                style={on ? { backgroundColor: t === "All" ? "#101828" : typeColors[t].solid } : undefined}
                            >
                                {t}
                                <span className={cx("text-xs", on ? "text-white/80" : "text-tertiary")}>{n}</span>
                            </button>
                        );
                    })}
                </div>
                <div className="flex gap-3">
                    <Input aria-label="Search" size="sm" icon={SearchLg} placeholder="Search queries" wrapperClassName="w-60" />
                    <Button color="primary-pink" iconLeading={Plus} href="#/question-bar-draft">
                        New query
                    </Button>
                </div>
            </div>

            {section("Pinned", pinned)}
            {section("Recommended for you", recs, "Based on what Pocket Garden Media looks at most")}
            {section("Your saved queries", rest)}
            {!pinned.length && !recs.length && !rest.length && (
                <EmptyBlock
                    icon={<SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />}
                    title={`No ${filter} queries yet`}
                    body="Build one from New Query and save it, and it shows up here."
                    actions={
                        <Button color="secondary" size="sm" onClick={() => setFilter("All")}>
                            Show all types
                        </Button>
                    }
                />
            )}

            {dismissed && (
                <Toast>
                    <span>
                        Dismissed <strong>{queryById(dismissed).name}</strong>. We'll suggest fewer like it.
                    </span>
                    <a href="#/cards" className="font-semibold" style={{ color: "#F4A3C9" }}>
                        Undo
                    </a>
                </Toast>
            )}
        </PiShell>
    );
};

/* ================================================= F · Date-range timeline === */

const MONTH_TICKS = ["2026-04-01", "2026-05-01", "2026-06-01", "2026-07-01", "2026-08-01", "2026-09-01"];
const MONTH_NAMES = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

export interface TimelineProps {
    lanes?: "account" | "type";
    selectedId?: string;
    /** Highlight fixed ranges that have ended. */
    stale?: boolean;
}

export const Timeline = ({ lanes = "account", selectedId, stale = false }: TimelineProps) => {
    const [selected, setSelected] = useState(selectedId);
    const laneKeys = lanes === "account" ? [...new Set(savedQueryList.map((q) => q.account))] : reportTypes;
    const laneOf = (q: SavedQuery) => (lanes === "account" ? q.account : q.type);
    const ended = saved.filter((q) => hasEnded(q.range));
    const sel = selected ? queryById(selected) : undefined;

    return (
        <PiShell
            active="Saved Queries"
            concept={{
                label: "Concept F",
                title: "Date-range timeline: the Report Date Range column as a calendar",
                notes: [
                    "Each query is a bar across the months it covers. Rolling ranges (striped) end at today and move with it. Fixed ranges stay put.",
                    "Overlaps, gaps and stale recaps show up at a glance, which a column of date strings can't do. ◆ marks the day each query was created.",
                    "Lanes switch between Account and Report Type, so the same view answers “what does each account track?” and “what kind of reports do we keep?”",
                ],
            }}
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Segmented
                    label="Lanes"
                    value={lanes}
                    options={[
                        { value: "account", label: "Account", href: "#/timeline" },
                        { value: "type", label: "Report type", href: "#/timeline-by-type" },
                    ]}
                />
                <div className="flex flex-wrap items-center gap-3">
                    <a
                        href={stale ? "#/timeline" : "#/timeline-stale"}
                        aria-pressed={stale}
                        className={cx("inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold ring-1", stale ? "bg-warning-primary text-warning-primary ring-transparent" : "text-secondary ring-secondary")}
                    >
                        <AlertTriangle className="size-4" aria-hidden="true" />
                        {ended.length} ranges have ended
                    </a>
                    <Button color="primary-pink" iconLeading={Plus} href="#/question-bar-draft">
                        New query
                    </Button>
                </div>
            </div>

            {stale && (
                <div className="flex flex-col gap-3 rounded-2xl bg-warning-primary p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warning-primary" aria-hidden="true" />
                        <div className="flex flex-col gap-0.5">
                            <p className="text-sm font-semibold text-primary">{ended.length} saved queries still point at dates that have passed</p>
                            <p className="text-sm text-secondary">Roll them forward to keep them current, or keep them fixed as recaps.</p>
                        </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                        <Button size="sm" color="secondary" href="#/timeline">
                            Keep as recaps
                        </Button>
                        <Button size="sm" color="primary-pink" iconLeading={RefreshCcw01} href="#/timeline">
                            Roll forward…
                        </Button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto rounded-2xl ring-1 ring-secondary">
                <div className="min-w-[980px]">
                    <div className="grid grid-cols-[280px_1fr] border-b border-secondary bg-secondary text-xs font-semibold text-tertiary">
                        <span className="px-5 py-3">{lanes === "account" ? "Account › Query" : "Report type › Query"}</span>
                        <div className="relative">
                            {MONTH_TICKS.map((m, i) => (
                                <span key={m} className="absolute top-3 -translate-x-0" style={{ left: `calc(${pos(toTime(m))}% + 6px)` }}>
                                    {MONTH_NAMES[i]}
                                </span>
                            ))}
                            <span className="absolute top-1.5 -translate-x-1/2 rounded bg-[#101828] px-1.5 py-0.5 text-[10px] text-white" style={{ left: `${pos(toTime(TODAY))}%` }}>
                                Today
                            </span>
                        </div>
                    </div>

                    {laneKeys.map((lane) => {
                        const list = savedQueryList.filter((q) => laneOf(q) === lane);
                        if (!list.length) return null;
                        return (
                            <div key={lane} className="border-b border-secondary last:border-b-0">
                                <div className="grid grid-cols-[280px_1fr] bg-primary">
                                    <span className="px-5 pt-3 pb-1">
                                        {lanes === "account" ? <AccountChip account={lane} /> : <TypeBadge type={lane as ReportType} />}
                                    </span>
                                    <span />
                                </div>
                                {list.map((q) => {
                                    const { start, end } = rangeBounds(q.range);
                                    const isEnded = hasEnded(q.range);
                                    const color = stale && isEnded ? "#F79009" : typeColors[q.type].solid;
                                    const dim = stale && !isEnded;
                                    const isSel = selected === q.id;
                                    return (
                                        <div key={q.id} className={cx("grid grid-cols-[280px_1fr] items-center", isSel && "bg-[#E3F5F5]/50")}>
                                            <button type="button" onClick={() => setSelected(isSel ? undefined : q.id)} className={cx("flex min-w-0 items-center gap-2 py-2 pr-3 pl-12 text-left text-sm", dim ? "text-quaternary" : "text-secondary")}>
                                                <span className="truncate font-medium">{q.name}</span>
                                                {q.source === "recommended" && <span className="shrink-0 text-xs" style={{ color: PINK }}>✦</span>}
                                            </button>
                                            <div className="relative h-10">
                                                {MONTH_TICKS.map((m) => (
                                                    <span key={m} className="absolute inset-y-0 w-px bg-border-secondary" style={{ left: `${pos(toTime(m))}%` }} />
                                                ))}
                                                <span className="absolute inset-y-0 w-0.5 bg-fg-primary/70" style={{ left: `${pos(toTime(TODAY))}%` }} />
                                                <button
                                                    type="button"
                                                    aria-label={`${q.name}: ${rangeLabel(q.range)}`}
                                                    onClick={() => setSelected(isSel ? undefined : q.id)}
                                                    className={cx("absolute top-1/2 h-4 -translate-y-1/2 rounded-full transition-opacity", dim && "opacity-25", isSel && "ring-2 ring-offset-2")}
                                                    style={{
                                                        left: `${pos(start)}%`,
                                                        width: `max(10px, ${pos(end) - pos(start)}%)`,
                                                        background: q.range.kind === "rolling" ? `repeating-linear-gradient(-45deg, ${color}, ${color} 4px, ${color}99 4px, ${color}99 8px)` : color,
                                                        ["--tw-ring-color" as string]: color,
                                                    }}
                                                />
                                                {q.source === "saved" && (
                                                    <span className={cx("absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-fg-secondary", dim && "opacity-25")} style={{ left: `${pos(toTime(q.created))}%` }} title={`Created ${longDate(q.created)}`} />
                                                )}
                                                {stale && isEnded && (
                                                    <span className="absolute top-1/2 -translate-y-1/2 pl-2 text-xs font-semibold text-warning-primary" style={{ left: `${pos(end)}%` }}>
                                                        ended {endedDaysAgo(q.range)}d ago
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>

            {sel && (
                <div className="flex flex-col gap-4 rounded-2xl p-5 ring-2 lg:flex-row lg:items-center lg:justify-between" style={{ ["--tw-ring-color" as string]: typeColors[sel.type].solid }}>
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <TypeBadge type={sel.type} size="xs" />
                            <span className="text-md font-semibold text-primary">{sel.name}</span>
                        </div>
                        <span className="text-sm text-tertiary">
                            {rangeLabel(sel.range)} · {rangeDetail(sel.range)} · {sel.source === "saved" ? `created ${longDate(sel.created)} by ${sel.owner}` : "recommended"}
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <TrendCell q={sel} />
                        <Button size="sm" color="secondary" iconLeading={ArrowRight} href={`#/preview?q=${sel.id}`}>
                            Preview
                        </Button>
                        <Button size="sm" color="primary-pink" iconLeading={Play} href="#/question-bar">
                            Run
                        </Button>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap items-center gap-5 text-xs text-tertiary">
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-6 rounded-full" style={{ background: `repeating-linear-gradient(-45deg, #667085, #667085 3px, #66708599 3px, #66708599 6px)` }} />
                    Rolling (moves with today)
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="h-2.5 w-6 rounded-full bg-fg-quaternary" /> Fixed
                </span>
                <span className="inline-flex items-center gap-2">
                    <span className="size-2 rotate-45 bg-fg-secondary" /> Created
                </span>
                <span style={{ color: PINK }}>✦ Recommended</span>
                <span className="ml-auto">Colour = report type · click a bar for details</span>
            </div>
        </PiShell>
    );
};

/* ================================================== G · List + preview === */

export interface SplitPreviewProps {
    /** Query shown on load; `?q=` in the link wins. */
    initialId?: string;
    loading?: boolean;
    share?: boolean;
}

const axisProps = { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#667085" } } as const;

export const SplitPreview = ({ initialId = "exec", loading = false, share = false }: SplitPreviewProps) => {
    const [id, setId] = useState(() => {
        const fromLink = readHashParams().get("q");
        return fromLink && savedQueryList.some((q) => q.id === fromLink) ? fromLink : initialId;
    });
    const [tab, setTab] = useState<"all" | "saved" | "recommended">("all");
    const [rolled, setRolled] = useState(false);
    const q = queryById(id);
    const list = savedQueryList.filter((x) => tab === "all" || x.source === tab);
    const pick = (next: string) => {
        setId(next);
        setRolled(false);
        writeHashParams({ q: next });
    };
    const k0 = q.kpis[0];
    const chartData = trendDays.map((day, i) => ({ day, [k0.label]: q.trend[i] }));
    const ended = hasEnded(q.range) && !rolled;

    return (
        <PiShell
            active="Saved Queries"
            bodyClassName="gap-4"
            concept={{
                label: "Concept G",
                title: "List + preview: pick on the left, see the answer on the right",
                notes: [
                    "A compact list keeps the five columns as two lines per row. Selecting one previews its sentence, KPIs and trend with no page load.",
                    "The preview handles the in-between states: a recommendation to save, a fixed range that has ended, a query still loading, and sharing.",
                    "Every selection updates the link (…/#/preview?q=…), so a preview can be shared as-is.",
                ],
            }}
        >
            <div className="grid min-h-[640px] grid-cols-1 overflow-hidden rounded-2xl ring-1 ring-secondary lg:grid-cols-[360px_minmax(0,1fr)]">
                <aside className="flex flex-col border-b border-secondary bg-secondary/40 lg:border-r lg:border-b-0">
                    <div className="flex flex-col gap-3 border-b border-secondary p-4">
                        <Input aria-label="Search" size="sm" icon={SearchLg} placeholder="Search queries" />
                        <div className="flex rounded-lg bg-secondary p-0.5 text-sm">
                            {(["all", "saved", "recommended"] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    aria-pressed={tab === t}
                                    onClick={() => setTab(t)}
                                    className={cx("flex-1 rounded-md px-2 py-1 font-semibold capitalize", tab === t ? "bg-primary text-primary shadow-xs" : "text-tertiary")}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ul className="flex-1 overflow-y-auto">
                        {list.map((x) => {
                            const on = x.id === id;
                            return (
                                <li key={x.id}>
                                    <button
                                        type="button"
                                        onClick={() => pick(x.id)}
                                        aria-current={on}
                                        className={cx("flex w-full flex-col gap-1 border-l-[3px] px-4 py-3 text-left transition-colors", on ? "bg-primary" : "border-transparent hover:bg-primary/60")}
                                        style={on ? { borderColor: typeColors[x.type].solid } : undefined}
                                    >
                                        <span className="flex items-center justify-between gap-2">
                                            <span className="truncate text-sm font-semibold text-primary">{x.name}</span>
                                            {x.source === "recommended" ? <span style={{ color: PINK }}>✦</span> : x.pinned && <Star01 className="size-3.5 shrink-0 fill-current" style={{ color: "#F79009" }} aria-hidden="true" />}
                                        </span>
                                        <span className="flex items-center gap-2 text-xs text-tertiary">
                                            <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: typeColors[x.type].solid }} aria-hidden="true" />
                                            <span className={cx(hasEnded(x.range) && "font-medium text-warning-primary")}>{rangeLabel(x.range)}</span>·<span className="truncate">{x.account}</span>
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                <section className="relative flex min-w-0 flex-col gap-5 p-6">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex flex-col gap-1.5">
                            <div className="flex flex-wrap items-center gap-2">
                                <TypeBadge type={q.type} />
                                {q.source === "recommended" && <RecommendedPill />}
                            </div>
                            <h2 className="text-display-xs font-semibold text-primary">{q.name}</h2>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {q.source === "recommended" ? (
                                <Button color="primary-pink" iconLeading={BookmarkCheck}>
                                    Save to my queries
                                </Button>
                            ) : (
                                <>
                                    <Button color="secondary" iconLeading={Share07} href={share ? "#/preview" : "#/preview-share"}>
                                        Share
                                    </Button>
                                    <Button color="secondary" iconLeading={Mail01} href="#/saved-schedule">
                                        {q.schedule ? "Schedule" : "Email me"}
                                    </Button>
                                </>
                            )}
                            <Button color={q.source === "recommended" ? "secondary" : "primary-pink"} iconLeading={Play} href="#/question-bar">
                                Open in query builder
                            </Button>
                        </div>
                    </div>

                    {share && (
                        <div className="absolute top-24 right-6 z-20 flex w-96 flex-col gap-4 rounded-xl bg-primary p-4 shadow-xl ring-1 ring-secondary">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-primary">Share “{q.name}”</span>
                                <a href="#/preview" aria-label="Close" className="text-fg-quaternary">
                                    <XClose className="size-4" />
                                </a>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-xs text-secondary">
                                <Link01 className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                <span className="truncate">nimbus.example/insights/q/{q.id}</span>
                                <span className="ml-auto shrink-0 font-semibold" style={{ color: TEAL }}>
                                    Copied ✓
                                </span>
                            </div>
                            <div className="flex flex-col gap-2 text-sm">
                                <span className="font-medium text-secondary">Who can open it</span>
                                {[
                                    { label: "Everyone at Pocket Garden Media", on: true },
                                    { label: "Only people I add", on: false },
                                ].map((o) => (
                                    <span key={o.label} className="flex items-center gap-2 text-secondary">
                                        <span className="flex size-4 items-center justify-center rounded-full ring-1 ring-secondary" style={o.on ? { backgroundColor: PINK } : undefined}>
                                            {o.on && <span className="size-1.5 rounded-full bg-white" />}
                                        </span>
                                        {o.label}
                                    </span>
                                ))}
                            </div>
                            <p className="text-xs text-tertiary">People see the numbers when they open it. The date range rolls forward for them too.</p>
                        </div>
                    )}

                    {q.source === "recommended" && (
                        <div className="flex items-start gap-3 rounded-xl p-4 text-sm" style={{ backgroundColor: `${PINK}12` }}>
                            <span style={{ color: PINK }}>✦</span>
                            <span className="text-secondary">
                                <strong className="text-primary">Why this is recommended.</strong> {q.reason}
                            </span>
                        </div>
                    )}
                    {ended && (
                        <div className="flex flex-col gap-3 rounded-xl bg-warning-primary p-4 sm:flex-row sm:items-center sm:justify-between">
                            <span className="flex items-start gap-3 text-sm text-secondary">
                                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-primary" aria-hidden="true" />
                                <span>
                                    <strong className="text-primary">This range ended {endedDaysAgo(q.range)} days ago.</strong> You're seeing {rangeLabel(q.range)}. Keep it as a recap, or roll it forward to the last 30 days.
                                </span>
                            </span>
                            <div className="flex shrink-0 gap-2">
                                <Button size="sm" color="secondary">
                                    Keep as recap
                                </Button>
                                <Button size="sm" color="primary-pink" iconLeading={RefreshCcw01} onClick={() => setRolled(true)}>
                                    Roll forward
                                </Button>
                            </div>
                        </div>
                    )}

                    <p className="rounded-xl bg-secondary px-4 py-3 text-md leading-relaxed text-secondary">
                        Show <strong className="text-primary">{q.metrics.join(", ")}</strong> by <strong className="text-primary">{q.breakdown.join(" › ")}</strong> for{" "}
                        <strong className="text-primary">{rolled ? "the last 30 days" : rangeLabel(q.range).replace(/^Last/, "the last")}</strong> in <strong className="text-primary">{q.account}</strong>.
                    </p>

                    <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm md:grid-cols-4">
                        {[
                            { k: "Date range", v: rolled ? "Last 30 days · rolling" : `${rangeLabel(q.range)} · ${q.range.kind}` },
                            { k: q.source === "recommended" ? "Suggested" : "Created", v: `${longDate(q.created)} · ${q.owner}` },
                            { k: "Last run", v: q.lastRun ?? "Never" },
                            { k: "Email", v: q.schedule ?? "Off" },
                        ].map((d) => (
                            <div key={d.k} className="flex flex-col gap-0.5">
                                <dt className="text-xs font-medium text-tertiary">{d.k}</dt>
                                <dd className="font-medium text-primary">{d.v}</dd>
                            </div>
                        ))}
                    </dl>

                    {loading ? (
                        <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading preview">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                {[0, 1, 2].map((i) => (
                                    <div key={i} className="flex flex-col gap-2 rounded-xl p-4 ring-1 ring-secondary">
                                        <Skeleton className="h-3 w-20" />
                                        <Skeleton className="h-7 w-28" />
                                        <Skeleton className="h-3 w-16" />
                                    </div>
                                ))}
                            </div>
                            <Skeleton className="h-60 w-full rounded-xl" />
                            <p className="inline-flex items-center gap-2 text-sm text-tertiary">
                                <Clock className="size-4" aria-hidden="true" /> Running {q.name}… usually about 2 seconds.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                {q.kpis.map((k) => (
                                    <div key={k.label} className="flex flex-col gap-1 rounded-xl p-4 ring-1 ring-secondary">
                                        <span className="text-xs font-medium text-tertiary">{k.label}</span>
                                        <span className="text-display-xs font-semibold text-primary">{fmt(k.value, k.format)}</span>
                                        <span className="flex items-center gap-1 text-xs text-tertiary">
                                            <Delta now={k.value} prev={k.prev} /> vs previous period
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="h-60 rounded-xl p-4 ring-1 ring-secondary">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                                        <defs>
                                            <linearGradient id="sq-fill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor={typeColors[q.type].solid} stopOpacity={0.3} />
                                                <stop offset="100%" stopColor={typeColors[q.type].solid} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                                        <XAxis dataKey="day" {...axisProps} />
                                        <YAxis {...axisProps} width={56} domain={["auto", "auto"]} tickFormatter={(v: number) => fmt(v, k0.format)} />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Area type="monotone" dataKey={k0.label} stroke={typeColors[q.type].solid} strokeWidth={2} fill="url(#sq-fill)" isAnimationActive={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <span className="text-xs text-tertiary">Daily {k0.label.toLowerCase()}, Sep 12 – Sep 18 · figures are fictional sample data</span>
                        </>
                    )}
                </section>
            </div>
        </PiShell>
    );
};
