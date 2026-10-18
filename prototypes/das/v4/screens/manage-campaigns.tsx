import { type ReactNode, useState } from "react";
import { ArrowRight, ChevronDown, ChevronSelectorVertical, ChevronUp, Plus, SearchLg, XClose } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { type Campaign, HEALTH_COLOR, HEALTH_LABEL, HEALTH_MEANING, HEALTH_ORDER, appName, campaigns, healthCounts, healthOf, longDate, usd } from "./campaign-data";
import { HealthBadge, HealthDot, StatChip } from "./campaign-ui";
import { DasShell, PINK, StatusDot, TEAL } from "./das-shell";
import { readHashParams, writeHashParams } from "../../v1/screens/route";
import { V3_NAV_ITEMS } from "./nav";
import { Button } from "./type-rules";

/**
 * Deal Activation System → Manage campaigns, Round 4 (16 Oct review).
 *
 * Round 3 grouped campaigns under their deal as delivery cards. Product kept the table
 * staging has today instead: with the number of campaigns a publisher runs, the table is
 * what lets you scan and compare. So the default page is that table, column for column,
 * with the search bar, and four highlight chips above it:
 *
 *   1. Live campaigns
 *   2. Queued campaigns — replaces "Ending in 7 days"
 *   3. Total spend — leads into detailed reporting
 *   4. Campaign Health — was "Behind pace", now a traffic light
 *
 * Live, Queued and Campaign Health also filter the table when clicked. How Campaign
 * Health should look is open, so it comes in three variants (`health`), and whether the
 * table gains a health column is open too (`healthColumn`). Storybook › Oct 17 shows
 * them side by side.
 */

export type HealthVariant = "counts" | "bar" | "attention";
type Filter = "live" | "queued" | "attention";

const live = (c: Campaign) => c.status === "Running";
const queued = (c: Campaign) => c.status === "Scheduled";
const needsAttention = (c: Campaign) => {
    const h = healthOf(c);
    return h === "behind" || h === "at risk";
};

const FILTERS: Record<Filter, { label: string; test: (c: Campaign) => boolean }> = {
    live: { label: "Live", test: live },
    queued: { label: "Queued", test: queued },
    attention: { label: "Behind or at risk", test: needsAttention },
};

/* ------------------------------------------------------ Health chip --- */

/**
 * Three ways to show Campaign Health in one chip. Same data, same click (it filters the
 * table to the campaigns that need attention); they differ in what you read first.
 */
const HealthChip = ({ variant, active, onPress }: { variant: HealthVariant; active: boolean; onPress: () => void }) => {
    const counts = healthCounts(campaigns);
    const paced = HEALTH_ORDER.reduce((n, h) => n + counts[h].length, 0);
    const attention = [...counts["at risk"], ...counts.behind];

    if (variant === "bar")
        return (
            <StatChip label="Campaign Health" onPress={onPress} active={active} sub={<HealthLegend counts={counts} />}>
                <span className="flex flex-col gap-2">
                    <span>
                        {counts["on pace"].length} of {paced} on pace
                    </span>
                    <span className="flex h-2.5 w-full overflow-hidden rounded-full bg-quaternary" aria-hidden="true">
                        {HEALTH_ORDER.map((h) => (
                            <span key={h} style={{ width: `${(counts[h].length / Math.max(1, paced)) * 100}%`, backgroundColor: HEALTH_COLOR[h] }} />
                        ))}
                    </span>
                </span>
            </StatChip>
        );

    if (variant === "attention")
        return (
            <StatChip
                label="Campaign Health"
                onPress={onPress}
                active={active}
                sub={
                    attention.length ? (
                        <span className="flex flex-col gap-0.5">
                            {attention.map((c) => {
                                const h = healthOf(c)!;
                                return (
                                    <span key={c.id} className="flex items-center gap-2 truncate">
                                        <HealthDot health={h} size={8} />
                                        <span className="truncate">{c.name}</span>
                                    </span>
                                );
                            })}
                        </span>
                    ) : (
                        "Every live campaign is on pace"
                    )
                }
            >
                <span className="flex items-center gap-2" style={{ color: attention.length ? HEALTH_COLOR[counts["at risk"].length ? "at risk" : "behind"] : HEALTH_COLOR["on pace"] }}>
                    {attention.length ? `${attention.length} need attention` : "All on pace"}
                </span>
            </StatChip>
        );

    return (
        <StatChip label="Campaign Health" onPress={onPress} active={active} sub={HEALTH_ORDER.map((h) => `${counts[h].length} ${HEALTH_LABEL[h].toLowerCase()}`).join(" · ")}>
            <span className="flex items-center gap-4">
                {HEALTH_ORDER.map((h) => (
                    <span key={h} className="inline-flex items-center gap-2" title={HEALTH_MEANING[h]}>
                        <HealthDot health={h} size={12} />
                        {counts[h].length}
                    </span>
                ))}
            </span>
        </StatChip>
    );
};

const HealthLegend = ({ counts }: { counts: ReturnType<typeof healthCounts> }) => (
    <span className="flex flex-wrap gap-x-3 gap-y-0.5">
        {HEALTH_ORDER.map((h) => (
            <span key={h} className="inline-flex items-center gap-1.5">
                <HealthDot health={h} size={8} />
                {counts[h].length} {HEALTH_LABEL[h].toLowerCase()}
            </span>
        ))}
    </span>
);

/* ------------------------------------------------------------- Table --- */

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dateKey = (short: string) => {
    const [m, d] = short.split(" ");
    return MONTH.indexOf(m) * 100 + Number(d);
};

const na = <span className="text-tertiary">N/A</span>;
const lines = (values: string[]) => (values.length ? values.map((v) => <span key={v} className="block whitespace-nowrap">{v}</span>) : na);

interface Column {
    id: string;
    label: string;
    sort: (c: Campaign) => string | number;
    cell: (c: Campaign, query: string) => ReactNode;
    width?: string;
}

const columns = (withHealth: boolean): Column[] => [
    { id: "status", label: "Status", sort: (c) => c.status, cell: (c) => <StatusDot status={c.status} /> },
    ...(withHealth
        ? [{ id: "health", label: "Campaign Health", sort: (c: Campaign) => HEALTH_ORDER.indexOf(healthOf(c) ?? "on pace") + (healthOf(c) ? 0 : 9), cell: (c: Campaign) => <HealthBadge campaign={c} /> }]
        : []),
    { id: "dealId", label: "Deal ID", sort: (c) => c.dealId, cell: (c, q) => <Highlight text={c.dealId} query={q} /> },
    { id: "dealName", label: "Deal Name", sort: (c) => c.dealName, cell: (c, q) => <Highlight text={c.dealName} query={q} />, width: "min-w-56" },
    {
        id: "name",
        label: "Campaign Name",
        sort: (c) => c.name,
        width: "min-w-52",
        cell: (c, q) => (
            <a href={`#/view-a?c=${c.id}`} className="font-semibold hover:underline" style={{ color: TEAL }}>
                <Highlight text={c.name} query={q} />
            </a>
        ),
    },
    { id: "geos", label: "Geos", sort: (c) => c.geos, cell: (c) => (c.geos === "All" ? na : lines(c.geos.split(", "))), width: "min-w-44" },
    { id: "platform", label: "Platform", sort: (c) => c.platforms, cell: (c) => lines(c.platforms.split(", ")) },
    {
        id: "apps",
        label: "Apps",
        sort: (c) => c.apps.length,
        width: "min-w-44",
        cell: (c) => {
            const names = [...new Set(c.apps.map(appName))];
            if (!names.length) return na;
            return (
                <>
                    {lines(names.slice(0, 2))}
                    {names.length > 2 && <span className="block text-tertiary">+{names.length - 2} more</span>}
                </>
            );
        },
    },
    { id: "units", label: "Ad Units", sort: (c) => c.adUnits.join(), cell: (c) => (c.adUnits.length === 4 ? "All units" : lines(c.adUnits)) },
    { id: "budget", label: "Budget", sort: (c) => c.budget, cell: (c) => (c.budget ? usd(c.budget, 2) : na) },
    { id: "spend", label: "Spend", sort: (c) => c.spend, cell: (c) => (c.budget ? usd(c.spend, 2) : na) },
    { id: "bid", label: "Bid Amount", sort: (c) => c.ecpm, cell: (c) => (c.ecpm ? usd(c.ecpm, 2) : na) },
    { id: "start", label: "Start Date", sort: (c) => dateKey(c.start), cell: (c) => longDate(c.start), width: "min-w-44" },
    { id: "end", label: "End Date", sort: (c) => dateKey(c.end), cell: (c) => longDate(c.end), width: "min-w-44" },
    { id: "cap", label: "Campaign Daily Impression Cap", sort: (c) => c.dailyCap ?? -1, cell: (c) => (c.dailyCap ? c.dailyCap.toLocaleString("en-US") : "Disabled") },
];

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

const searchText = (c: Campaign) => [c.name, c.dealName, c.dealId, c.status, c.rule, c.geos, c.platforms, ...c.apps, ...c.adUnits, ...c.keywords].join(" ").toLowerCase();

/* -------------------------------------------------------------- Page --- */

export const ManageCampaigns = ({
    search = "",
    health = "counts",
    healthColumn = false,
    filter: initialFilter,
}: {
    search?: string;
    health?: HealthVariant;
    healthColumn?: boolean;
    filter?: Filter;
}) => {
    const [query, setQuery] = useState(() => readHashParams().get("q") ?? search);
    const [filter, setFilter] = useState<Filter | undefined>(initialFilter);
    const [sort, setSort] = useState<{ id: string; dir: 1 | -1 } | null>(null);
    const cols = columns(healthColumn);

    const q = query.trim().toLowerCase();
    let rows = campaigns.filter((c) => (!q || searchText(c).includes(q)) && (!filter || FILTERS[filter].test(c)));
    if (sort) {
        const col = cols.find((c) => c.id === sort.id)!;
        rows = [...rows].sort((a, b) => {
            const x = col.sort(a);
            const y = col.sort(b);
            return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
        });
    }

    const onSearch = (v: string) => {
        setQuery(v);
        writeHashParams({ q: v.trim() || undefined });
    };
    const toggleFilter = (f: Filter) => setFilter((cur) => (cur === f ? undefined : f));
    const onSort = (id: string) => setSort((cur) => (cur?.id !== id ? { id, dir: 1 } : cur.dir === 1 ? { id, dir: -1 } : null));

    const liveList = campaigns.filter(live);
    const queuedList = campaigns.filter(queued);
    const nextUp = [...queuedList].sort((a, b) => dateKey(a.start) - dateKey(b.start))[0];
    const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
    const booked = campaigns.reduce((s, c) => s + c.budget, 0);

    return (
        <DasShell
            navItems={V3_NAV_ITEMS}
            navKey="manage campaigns"
            concept={{
                label: "Round 4",
                title: "The staging table, with four highlight chips",
                notes: [
                    "The table is staging's, column for column. Round 3's deal-grouped delivery cards are gone: with the number of campaigns a publisher runs, a table is what you can scan and compare.",
                    "Chips, in Product's order: Live, Queued (replaces Ending in 7 days), Total spend (leads into reporting), Campaign Health (was Behind pace).",
                    "Campaign Health is a traffic light. Green on pace; orange behind with time to catch up; red behind without it. The maths is a placeholder until Product and engineering settle it.",
                    "Live, Queued and Campaign Health filter the table when clicked. Total spend opens reporting.",
                ],
            }}
        >
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <h2 className="text-display-xs font-extrabold text-primary">Campaigns</h2>
                    <Button color="primary-pink" iconLeading={Plus} href="#/setup-empty">
                        New campaign
                    </Button>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <StatChip label="Live campaigns" onPress={() => toggleFilter("live")} active={filter === "live"} sub={`of ${campaigns.length} campaigns`}>
                        {liveList.length}
                    </StatChip>
                    <StatChip
                        label="Queued campaigns"
                        onPress={() => toggleFilter("queued")}
                        active={filter === "queued"}
                        sub={nextUp ? `Next: ${nextUp.name}, ${nextUp.start}` : "Nothing scheduled"}
                    >
                        {queuedList.length}
                    </StatChip>
                    <StatChip
                        label="Total spend"
                        sub={
                            <a
                                href="#/campaigns"
                                onClick={(e) => e.preventDefault()}
                                title="Opens Performance Insights, outside this prototype"
                                className="inline-flex items-center gap-1 font-semibold uppercase"
                                style={{ color: PINK }}
                            >
                                Detailed reporting <ArrowRight className="size-4" aria-hidden="true" />
                            </a>
                        }
                    >
                        <span className="flex flex-wrap items-baseline gap-x-2">
                            {usd(totalSpend)}
                            <span className="text-md font-normal text-tertiary">of {usd(booked)} booked</span>
                        </span>
                    </StatChip>
                    <HealthChip variant={health} active={filter === "attention"} onPress={() => toggleFilter("attention")} />
                </div>

                <div className="flex flex-col gap-3">
                    <Input
                        aria-label="Search campaigns"
                        size="md"
                        icon={SearchLg}
                        placeholder="Search Campaigns"
                        wrapperClassName="max-w-xl"
                        value={query}
                        onChange={onSearch}
                    />
                    <p className="flex flex-wrap items-center gap-2 text-md text-tertiary" aria-live="polite">
                        {q || filter ? (
                            <>
                                <span>
                                    <span className="font-semibold text-primary">{rows.length}</span> of {campaigns.length} campaigns
                                    {q && <> match “{query.trim()}”</>}
                                </span>
                                {filter && (
                                    <button
                                        type="button"
                                        onClick={() => setFilter(undefined)}
                                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold"
                                        style={{ color: "#1F7F80", backgroundColor: `${TEAL}1f` }}
                                    >
                                        {FILTERS[filter].label}
                                        <XClose className="size-4" aria-label="Clear filter" />
                                    </button>
                                )}
                            </>
                        ) : (
                            <>{campaigns.length} campaigns</>
                        )}
                    </p>
                </div>

                {rows.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-secondary px-6 py-14 text-center">
                        <SearchLg className="size-6 text-fg-quaternary" aria-hidden="true" />
                        <p className="text-md font-semibold text-primary">No campaigns match</p>
                        <p className="max-w-md text-md text-tertiary">Search looks at campaign and deal names, deal IDs, status, auction rule, geos, platforms, apps, ad units and keywords.</p>
                        <Button
                            size="sm"
                            color="secondary"
                            onClick={() => {
                                onSearch("");
                                setFilter(undefined);
                            }}
                        >
                            Clear search and filters
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-secondary">
                        <table className="w-full text-left text-md">
                            <thead>
                                <tr className="border-b-2 border-secondary">
                                    {cols.map((col) => {
                                        const on = sort?.id === col.id;
                                        const Icon = !on ? ChevronSelectorVertical : sort.dir === 1 ? ChevronUp : ChevronDown;
                                        return (
                                            <th
                                                key={col.id}
                                                scope="col"
                                                aria-sort={on ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                                                className={cx("border-r border-secondary px-4 py-3 align-bottom last:border-r-0", col.width)}
                                            >
                                                <button type="button" onClick={() => onSort(col.id)} className="flex w-full items-center justify-between gap-3 font-bold whitespace-nowrap text-primary">
                                                    {col.label}
                                                    <Icon className={cx("size-4 shrink-0", on ? "text-fg-primary" : "text-fg-quaternary")} aria-hidden="true" />
                                                </button>
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((c, i) => (
                                    <tr key={c.id} className={cx("align-top", i % 2 === 1 && "bg-secondary/40")}>
                                        {cols.map((col) => (
                                            <td key={col.id} className={cx("border-r border-secondary px-4 py-4 text-secondary last:border-r-0", col.width)}>
                                                {col.cell(c, query)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DasShell>
    );
};
