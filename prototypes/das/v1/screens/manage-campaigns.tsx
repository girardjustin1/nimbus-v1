import { type ReactNode, useState } from "react";
import { AlertTriangle, ChevronDown, Columns03, Copy01, Plus, SearchLg, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { type Campaign, campaigns, compact, paceOf, usd } from "./das-data";
import { DasShell, DeliveryBar, KeywordChip, PINK, PaceLabel, StatusDot, TEAL } from "./das-shell";
import { readHashParams, writeHashParams } from "./route";

/**
 * Deal Activation System → Manage Campaigns.
 *
 * Kickoff: publishers need to see "how done is my campaign?" — under-delivering on a
 * promised deal is a breach of contract — and campaigns should be comparable and show
 * their key values. Today's table is one very wide scroll with Spend = N/A.
 *   A. Delivery view — deals group their campaigns; spend vs budget vs flight elapsed
 *      is the first thing you read; targeting (incl. keywords) summarized per row.
 *   B. Compare — pick 2–3 campaigns and see them side by side, differences highlighted.
 */

/* ----------------------------------------------------------------- KPIs --- */

const Kpi = ({ label, value, sub, tone }: { label: string; value: string; sub?: ReactNode; tone?: "warn" }) => (
    <div className="flex flex-col gap-1 rounded-xl p-4 ring-1 ring-secondary">
        <span className="text-sm text-tertiary">{label}</span>
        <span className="text-display-xs font-semibold" style={{ color: tone === "warn" ? PINK : undefined }}>
            {value}
        </span>
        {sub && <span className="text-xs text-tertiary">{sub}</span>}
    </div>
);

const KpiStrip = () => {
    const live = campaigns.filter((c) => c.status === "Running");
    const behind = campaigns.filter((c) => c.status === "Running" && paceOf(c) === "behind");
    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi
                label="Live campaigns"
                value={String(live.length)}
                sub={`${campaigns.length} total across ${new Set(campaigns.map((c) => c.dealId)).size} deals`}
            />
            <Kpi
                label="Spend this flight"
                value={usd(campaigns.reduce((s, c) => s + c.spend, 0))}
                sub={`of ${usd(campaigns.reduce((s, c) => s + c.budget, 0))} booked`}
            />
            <Kpi
                label="Behind pace"
                value={String(behind.length)}
                sub={behind.map((c) => c.name).join(", ") || "None"}
                tone={behind.length ? "warn" : undefined}
            />
            <Kpi label="Ending in 7 days" value="1" sub="Over 21 · Midwest (Sep 24)" />
        </div>
    );
};

/* ------------------------------------------------------------- Search --- */

/** Wraps the part of `text` that matches `query` in a soft pink highlight. */
const Highlight = ({ text, query }: { text: string; query: string }) => {
    const q = query.trim().toLowerCase();
    const i = q ? text.toLowerCase().indexOf(q) : -1;
    if (i < 0) return <>{text}</>;
    return (
        <>
            {text.slice(0, i)}
            <mark className="rounded-sm px-0.5 text-inherit" style={{ backgroundColor: `${PINK}33` }}>
                {text.slice(i, i + q.length)}
            </mark>
            {text.slice(i + q.length)}
        </>
    );
};

const campaignText = (c: Campaign) => [c.name, c.status, c.rule, c.geos, c.platforms, ...c.adUnits, ...c.languages, ...c.keywords].join(" ").toLowerCase();
const dealText = (c: Campaign) => `${c.dealName} ${c.dealId}`.toLowerCase();

/* -------------------------------------------------------------- Rows --- */

const TargetSummary = ({ c }: { c: Campaign }) => (
    <div className="flex flex-col gap-1.5">
        <span className="text-xs text-tertiary">
            {c.geos} · {c.platforms} · {c.adUnits.join(", ")}
            {c.languages.length > 0 && ` · ${c.languages.join(", ")}`}
        </span>
        {c.keywords.length > 0 ? (
            <span className="flex flex-wrap items-center gap-1">
                <span className="text-xs font-semibold text-tertiary">{c.match}</span>
                {c.keywords.map((k) => (
                    <KeywordChip key={k} value={k} />
                ))}
            </span>
        ) : (
            <span className="text-xs text-quaternary">No keyword targeting</span>
        )}
    </div>
);

const CampaignRow = ({ c, selected, onToggle, query = "" }: { c: Campaign; selected: boolean; onToggle: () => void; query?: string }) => (
    <div
        className={cx(
            "grid grid-cols-[28px_minmax(220px,1.4fr)_minmax(200px,1fr)_minmax(240px,1.3fr)_110px_64px] items-center gap-4 px-5 py-4",
            selected && "bg-[color:var(--sel)]",
        )}
        style={{ ["--sel" as string]: `${TEAL}0f` }}
    >
        <Checkbox size="sm" isSelected={selected} onChange={onToggle} aria-label={`Compare ${c.name}`} />
        <div className="flex min-w-0 flex-col gap-1">
            <a href={`#/view-a?c=${c.id}`} className="truncate text-sm font-semibold hover:underline" style={{ color: TEAL }}>
                <Highlight text={c.name} query={query} />
            </a>
            <span className="flex items-center gap-2 text-xs text-tertiary">
                <StatusDot status={c.status} /> · {c.rule}
            </span>
        </div>
        <div className="flex flex-col gap-1">
            <DeliveryBar campaign={c} />
            <span className="text-xs text-tertiary">
                {c.budget ? `${usd(c.spend)} of ${usd(c.budget)}` : `${compact(c.impressions)} impressions`} · {c.start} – {c.end}
            </span>
        </div>
        <TargetSummary c={c} />
        <span className="text-sm text-secondary">{c.rule === "Fallback" ? "—" : `${usd(c.ecpm, 2)} eCPM`}</span>
        <Toggle size="sm" defaultSelected={c.status === "Running" || c.status === "Scheduled"} aria-label={`Enable ${c.name}`} />
    </div>
);

const DealGroup = ({
    dealId,
    rows,
    total,
    selected,
    toggle,
    open,
    onOpenChange,
    query,
}: {
    dealId: string;
    rows: Campaign[];
    /** Campaigns in the deal before search filtering. */
    total: number;
    selected: string[];
    toggle: (id: string) => void;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    query: string;
}) => {
    const budget = rows.reduce((s, c) => s + c.budget, 0);
    const spend = rows.reduce((s, c) => s + c.spend, 0);
    const behind = rows.filter((c) => c.status === "Running" && paceOf(c) === "behind").length;
    const panelId = `deal-${dealId}`;
    return (
        <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-secondary/60 px-5 py-3">
                <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => onOpenChange(!open)} className="flex items-center gap-3 rounded-md text-left outline-focus-ring focus-visible:outline-2">
                    <ChevronDown className={cx("size-4 text-fg-quaternary transition-transform duration-150", !open && "-rotate-90")} aria-hidden="true" />
                    <span className="text-sm font-semibold text-primary">
                        <Highlight text={rows[0].dealName} query={query} />
                    </span>
                    <span className="font-mono text-xs text-tertiary">
                        <Highlight text={dealId} query={query} />
                    </span>
                    {!open && behind > 0 && (
                        <span className="rounded-full px-2 py-0.5 text-xs font-semibold" style={{ color: "#A94579", backgroundColor: `${PINK}24` }}>
                            {behind} behind pace
                        </span>
                    )}
                </button>
                <div className="flex items-center gap-4 text-xs text-tertiary">
                    <span>
                        {rows.length === total ? `${total} campaign${total === 1 ? "" : "s"}` : `${rows.length} of ${total} campaigns`}
                    </span>
                    {budget > 0 && (
                        <span>
                            {usd(spend)} / {usd(budget)}
                        </span>
                    )}
                    <a href="#/setup-empty" className="inline-flex items-center gap-1 font-semibold uppercase" style={{ color: PINK }}>
                        <Plus className="size-3.5" aria-hidden="true" /> Campaign
                    </a>
                </div>
            </div>
            {open && (
                <div id={panelId} className="divide-y divide-secondary">
                    {rows.map((c) => (
                        <CampaignRow key={c.id} c={c} selected={selected.includes(c.id)} onToggle={() => toggle(c.id)} query={query} />
                    ))}
                </div>
            )}
        </div>
    );
};

const CompareTray = ({ selected, clear }: { selected: Campaign[]; clear: () => void }) => (
    <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-primary">{selected.length} selected</span>
            {selected.map((c) => (
                <span key={c.id} className="rounded-md bg-secondary px-2 py-1 text-xs font-medium text-secondary">
                    {c.name}
                </span>
            ))}
            <button type="button" onClick={clear} className="text-sm font-semibold uppercase" style={{ color: PINK }}>
                Clear
            </button>
        </div>
        <div className="flex gap-3">
            <Button color="secondary" iconLeading={Copy01}>
                Duplicate
            </Button>
            <Button color="primary-pink" iconLeading={Columns03} isDisabled={selected.length < 2}>
                Compare {selected.length}
            </Button>
        </div>
    </div>
);

export const ManageCampaignsDelivery = ({ preselected = [] as string[], search = "", collapsed: initialCollapsed = [] as string[] }) => {
    const [selected, setSelected] = useState<string[]>(preselected);
    const [query, setQuery] = useState(() => readHashParams().get("q") ?? search);
    const [collapsed, setCollapsed] = useState<string[]>(initialCollapsed);
    const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    const deals = [...new Set(campaigns.map((c) => c.dealId))];

    const q = query.trim().toLowerCase();
    // A deal-name match shows the whole deal; otherwise only the campaigns that match.
    const groups = deals
        .map((d) => {
            const all = campaigns.filter((c) => c.dealId === d);
            const rows = !q || dealText(all[0]).includes(q) ? all : all.filter((c) => campaignText(c).includes(q));
            return { d, all, rows };
        })
        .filter((g) => g.rows.length > 0);
    const matchCount = groups.reduce((n, g) => n + g.rows.length, 0);
    const allCollapsed = collapsed.length === deals.length;

    const onSearch = (v: string) => {
        setQuery(v);
        writeHashParams({ q: v.trim() || undefined });
    };

    return (
        <DasShell
            navKey="manage campaigns"
            concept={{
                label: "Concept A",
                title: "Delivery-first campaign list",
                notes: [
                    "Campaigns sit under their deal. Each row leads with delivery: % of budget spent, a tick for how much should be spent by now, and an on-track / behind / ahead label.",
                    "Targeting reads as one line plus the keyword chips, so key values show without the 20-column horizontal scroll.",
                    "Select campaigns to compare them or duplicate as a batch.",
                ],
            }}
            footer={selected.length > 0 ? <CompareTray selected={campaigns.filter((c) => selected.includes(c.id))} clear={() => setSelected([])} /> : undefined}
        >
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-display-xs font-semibold text-primary">Campaigns</h2>
                        <p className="text-md text-tertiary">Delivery is shown against the flight. The tick marks where spend should be today.</p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Input
                            aria-label="Search campaigns"
                            size="sm"
                            icon={SearchLg}
                            placeholder="Search deals, campaigns, keywords"
                            wrapperClassName="sm:w-80"
                            value={query}
                            onChange={onSearch}
                        />
                        <Button color="primary-pink" iconLeading={Plus} href="#/setup-empty">
                            New campaign
                        </Button>
                    </div>
                </div>

                <KpiStrip />

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-tertiary" aria-live="polite">
                        {q ? (
                            <>
                                <span className="font-semibold text-primary">{matchCount}</span> campaign{matchCount === 1 ? "" : "s"} in{" "}
                                <span className="font-semibold text-primary">{groups.length}</span> deal{groups.length === 1 ? "" : "s"} match “{query.trim()}” ·{" "}
                                <button type="button" onClick={() => onSearch("")} className="font-semibold" style={{ color: PINK }}>
                                    Clear
                                </button>
                            </>
                        ) : (
                            <>
                                {campaigns.length} campaigns in {deals.length} deals
                            </>
                        )}
                    </p>
                    <button type="button" onClick={() => setCollapsed(allCollapsed ? [] : deals)} className="text-sm font-semibold uppercase" style={{ color: PINK }}>
                        {allCollapsed ? "Expand all" : "Collapse all"}
                    </button>
                </div>

                {groups.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-secondary px-6 py-14 text-center">
                        <SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />
                        <p className="text-md font-semibold text-primary">No campaigns match “{query.trim()}”</p>
                        <p className="max-w-md text-sm text-tertiary">Search looks at deal names and IDs, campaign names, status, auction rule, geos, platforms, ad units, languages and keywords.</p>
                        <div className="flex gap-3">
                            <Button size="sm" color="secondary" onClick={() => onSearch("")}>
                                Clear search
                            </Button>
                            <Button size="sm" color="primary-pink" iconLeading={Plus} href="#/setup-empty">
                                New campaign
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="flex min-w-[1000px] flex-col gap-4">
                            {groups.map(({ d, all, rows }) => (
                                <DealGroup
                                    key={d}
                                    dealId={d}
                                    rows={rows}
                                    total={all.length}
                                    selected={selected}
                                    toggle={toggle}
                                    // Searching opens every deal that has a match.
                                    open={Boolean(q) || !collapsed.includes(d)}
                                    onOpenChange={(open) => setCollapsed((c) => (open ? c.filter((x) => x !== d) : [...c, d]))}
                                    query={query}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DasShell>
    );
};

/* ============================================================ Concept B === */

const compareFields: { label: string; get: (c: Campaign) => ReactNode; key: (c: Campaign) => string }[] = [
    { label: "Status", get: (c) => <StatusDot status={c.status} />, key: (c) => c.status },
    { label: "Deal", get: (c) => c.dealName, key: (c) => c.dealName },
    { label: "Auction rule", get: (c) => c.rule, key: (c) => c.rule },
    { label: "eCPM", get: (c) => usd(c.ecpm, 2), key: (c) => String(c.ecpm) },
    { label: "Budget", get: (c) => usd(c.budget), key: (c) => String(c.budget) },
    { label: "Flight", get: (c) => `${c.start} – ${c.end}`, key: (c) => c.start + c.end },
    { label: "Geos", get: (c) => c.geos, key: (c) => c.geos },
    { label: "Platform", get: (c) => c.platforms, key: (c) => c.platforms },
    { label: "Ad unit type", get: (c) => c.adUnits.join(", "), key: (c) => c.adUnits.join() },
    { label: "Device language", get: (c) => c.languages.join(", ") || "All", key: (c) => c.languages.join() },
    {
        label: "Keywords",
        get: (c) => (
            <span className="flex flex-wrap items-center gap-1">
                <span className="text-xs font-semibold text-tertiary">{c.match}</span>
                {c.keywords.map((k) => (
                    <KeywordChip key={k} value={k} />
                ))}
            </span>
        ),
        key: (c) => c.match + c.keywords.join(),
    },
    { label: "Creatives", get: (c) => String(c.creatives), key: (c) => String(c.creatives) },
];

export const CompareCampaigns = ({ ids = ["c1", "c2", "c3"] }: { ids?: string[] }) => {
    const cols = campaigns.filter((c) => ids.includes(c.id));
    return (
        <DasShell
            navKey="manage campaigns"
            concept={{
                label: "Concept B",
                title: "Side-by-side compare",
                notes: [
                    "Delivery and results first, setup second. Rows where the campaigns differ are highlighted, so a sibling made with Publish & Duplicate shows exactly what changed.",
                    "Useful for the English vs Spanish or interstitial vs inline splits from the kickoff.",
                ],
            }}
        >
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-display-xs font-semibold text-primary">Compare campaigns</h2>
                    <Button color="secondary" iconLeading={XClose}>
                        Close
                    </Button>
                </div>

                <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                    <table className="w-full min-w-[900px] table-fixed text-left">
                        <thead>
                            <tr className="bg-secondary">
                                <th className="w-44 px-5 py-4" />
                                {cols.map((c) => (
                                    <th key={c.id} className="px-5 py-4 align-top">
                                        <span className="block text-sm font-semibold" style={{ color: TEAL }}>
                                            {c.name}
                                        </span>
                                        <span className="block text-xs font-normal text-tertiary">{c.dealId}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-t border-secondary">
                                <td className="px-5 py-4 text-sm font-semibold text-primary">Delivery</td>
                                {cols.map((c) => (
                                    <td key={c.id} className="px-5 py-4">
                                        <DeliveryBar campaign={c} />
                                    </td>
                                ))}
                            </tr>
                            {[
                                { label: "Spend", get: (c: Campaign) => usd(c.spend) },
                                { label: "Impressions", get: (c: Campaign) => compact(c.impressions) },
                                { label: "Pace", get: (c: Campaign) => <PaceLabel state={paceOf(c)} /> },
                            ].map((m) => (
                                <tr key={m.label} className="border-t border-secondary">
                                    <td className="px-5 py-3 text-sm text-tertiary">{m.label}</td>
                                    {cols.map((c) => (
                                        <td key={c.id} className="px-5 py-3 text-md font-semibold text-primary">
                                            {m.get(c)}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                            <tr className="border-t-4 border-secondary">
                                <td colSpan={cols.length + 1} className="px-5 pt-4 pb-1 text-xs font-semibold text-tertiary uppercase">
                                    Setup
                                </td>
                            </tr>
                            {compareFields.map((f) => {
                                const differs = new Set(cols.map(f.key)).size > 1;
                                return (
                                    <tr key={f.label} className="border-t border-secondary" style={differs ? { backgroundColor: `${PINK}0d` } : undefined}>
                                        <td className="px-5 py-3 text-sm text-tertiary">
                                            <span className="flex items-center gap-1.5">
                                                {differs && <span className="size-1.5 rounded-full" style={{ backgroundColor: PINK }} aria-label="Differs" />}
                                                {f.label}
                                            </span>
                                        </td>
                                        {cols.map((c) => (
                                            <td key={c.id} className="px-5 py-3 text-sm text-secondary">
                                                {f.get(c)}
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <p className="flex items-center gap-2 text-sm text-tertiary">
                    <AlertTriangle className="size-4 text-fg-warning-secondary" aria-hidden="true" /> Budgets are per campaign and don't know about each other,
                    even within the same deal.
                </p>
            </div>
        </DasShell>
    );
};
