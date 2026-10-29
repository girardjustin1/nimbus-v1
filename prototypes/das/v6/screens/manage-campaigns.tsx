import { type ReactNode, useState } from "react";
import { ArrowRight, ChevronDown, ChevronSelectorVertical, ChevronUp, Plus, SearchLg, XClose } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { readHashParams, writeHashParams } from "../../v1/screens/route";
import {
    type Campaign,
    PACE_LABEL,
    PACE_MEANING,
    PACE_ORDER,
    appName,
    campaigns,
    formatPct,
    longDate,
    notPacingShort,
    paceCounts,
    paceOf,
    pacingPct,
    usd,
} from "./campaign-data";
import { PaceBadge, PaceDot, StatChip, TrueUp } from "./campaign-ui";
import { DasShell, PINK, StatusDot, TEAL } from "./das-shell";
import { V3_NAV_ITEMS } from "./nav";
import { TABLE } from "./nimbus-ui";
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
 *   3. Total spend — links to Performance Insights, the Full performance screen (26 Oct:
 *      was "Detailed reporting"; linked 27 Oct)
 *   4. Campaign Health — was "Behind pace", now a traffic light
 *
 * Live, Queued and Campaign Health also filter the table when clicked.
 *
 * 19 Oct: Campaign Health reads as counts by colour (`health="counts"`), and the table
 * stays exactly staging's, with no health column. The other variants (`health`,
 * `healthColumn`) stay so Storybook › Oct 17 can show what was compared.
 *
 * 26 Oct: the table is a list, so it takes the list style (light header, bold black
 * labels, column rules) and runs full bleed like staging's; the search bar sits at the
 * top left at the same width as the asset and keyword libraries (SEARCH_WIDTH).
 *
 * 27 Oct review: search runs the full width of the page ("you might as well make it across
 * all the way"). Where buttons sit to its right (assets, keywords) they stay inline and
 * the search takes the rest of the row (SEARCH_FILL).
 *
 * 28 Oct review (Round 6):
 *   - Campaign Health is Pacing, and it moves up into the list as a column beside Status.
 *     It sorts worst first on the first click, so the campaigns that need attention rise
 *     to the top; campaigns that aren't pacing always sort last.
 *   - Spend is the trued-up number, the one Performance Insights shows. The Spend column
 *     and Total spend carry "Subject to true-up"; nothing says real time.
 *   - `delivery="lifecycle"` explores one Campaign Delivery column that changes with the
 *     campaign's stage: pacing while in flight, then final budget and spend, still two
 *     sortable columns, once it's complete. A badly paced campaign doesn't stay red
 *     forever. Product wants to talk this one through before it's settled.
 *
 * Round 4's other chip variants (bar, attention) stay in v5 for Storybook › Oct 17.
 */

/** Search with nothing beside it: the full width of the content area. */
export const SEARCH_WIDTH = "w-full";
/** Search sharing its row with buttons: it fills whatever the buttons leave. */
export const SEARCH_FILL = "min-w-0 flex-1";

export type DeliveryVariant = "pacing" | "lifecycle";
type Filter = "live" | "queued" | "attention";

const live = (c: Campaign) => c.status === "Running";
const queued = (c: Campaign) => c.status === "Scheduled";
const needsAttention = (c: Campaign) => {
    const h = paceOf(c);
    return h === "behind" || h === "at risk";
};

const FILTERS: Record<Filter, { label: string; test: (c: Campaign) => boolean }> = {
    live: { label: "Live", test: live },
    queued: { label: "Queued", test: queued },
    attention: { label: "Behind or at risk", test: needsAttention },
};

/* ------------------------------------------------------- Pacing chip --- */

/** Pacing (was Campaign Health): counts by colour; a click filters to behind and at risk. */
const PacingChip = ({ active, onPress }: { active: boolean; onPress: () => void }) => {
    const counts = paceCounts(campaigns);
    return (
        <StatChip
            label="Pacing"
            onPress={onPress}
            active={active}
            sub={PACE_ORDER.map((h) => `${counts[h].length} ${PACE_LABEL[h].toLowerCase()}`).join(" · ")}
        >
            <span className="flex items-center gap-4">
                {PACE_ORDER.map((h) => (
                    <span key={h} className="inline-flex items-center gap-2" title={PACE_MEANING[h]}>
                        <PaceDot health={h} size={12} />
                        {counts[h].length}
                    </span>
                ))}
            </span>
        </StatChip>
    );
};

/* ------------------------------------------------------------- Table --- */

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dateKey = (short: string) => {
    const [m, d] = short.split(" ");
    return MONTH.indexOf(m) * 100 + Number(d);
};

const na = <span className="text-tertiary">N/A</span>;
const lines = (values: string[]) =>
    values.length
        ? values.map((v) => (
              <span key={v} className="block whitespace-nowrap">
                  {v}
              </span>
          ))
        : na;

interface Column {
    id: string;
    label: string;
    /** Undefined sorts last in both directions: campaigns that aren't pacing stay at the bottom. */
    sort: (c: Campaign) => string | number | undefined;
    cell: (c: Campaign, query: string) => ReactNode;
    width?: string;
    /** Sits beside the sort button in the header, e.g. the true-up hint on Spend. */
    hint?: ReactNode;
    /** Lifecycle concept: the header these columns share, in a row above their own. */
    group?: string;
    /** Lifecycle concept: when this returns a node, it fills this column and the next. */
    span?: (c: Campaign) => ReactNode | undefined;
}

/** In flight = live or paused inside its flight; complete and queued campaigns aren't. */
const inFlight = (c: Campaign) => (c.status === "Running" || c.status === "Paused") && c.budget > 0;

/** The lifecycle cell while a campaign is in flight: "In flight · on target", and its pacing. */
const InFlight = ({ c }: { c: Campaign }) => {
    const pace = paceOf(c);
    const pct = pacingPct(c);
    if (!pace || pct === undefined) return <span className="text-md whitespace-nowrap text-tertiary">In flight · {notPacingShort(c).toLowerCase()}</span>;
    return (
        <span className="inline-flex items-center gap-2 text-md whitespace-nowrap text-primary" title={PACE_MEANING[pace]}>
            <PaceDot health={pace} />
            <span>
                <span className="font-semibold">In flight · {PACE_LABEL[pace].toLowerCase()}</span>
                <span className="text-tertiary tabular-nums"> · {formatPct(pct)} pacing</span>
            </span>
        </span>
    );
};

const pacingSort = (c: Campaign) => pacingPct(c);

const columns = (delivery: DeliveryVariant): Column[] => {
    const lifecycle = delivery === "lifecycle";
    // Lifecycle: budget and spend only once the campaign is complete; until then the pair
    // of cells reads as one, saying how it's pacing. Budget and Spend sort completed rows.
    const settled = (c: Campaign) => !inFlight(c);
    const list: Column[] = [
        { id: "status", label: "Status", sort: (c) => c.status, cell: (c) => <StatusDot status={c.status} /> },
        ...(lifecycle ? [] : [{ id: "pacing", label: "Pacing", sort: pacingSort, cell: (c: Campaign) => <PaceBadge campaign={c} /> }]),
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
        {
            id: "budget",
            label: "Budget",
            sort: (c) => (lifecycle && !settled(c) ? undefined : c.budget),
            cell: (c) => (c.budget ? usd(c.budget, 2) : na),
            ...(lifecycle ? { group: "Campaign Delivery", span: (c: Campaign) => (inFlight(c) ? <InFlight c={c} /> : undefined) } : {}),
        },
        {
            id: "spend",
            label: "Spend",
            sort: (c) => (lifecycle && !settled(c) ? undefined : c.spend),
            cell: (c) => (c.budget ? usd(c.spend, 2) : na),
            hint: <TrueUp />,
            ...(lifecycle ? { group: "Campaign Delivery" } : {}),
        },
        { id: "bid", label: "Bid Amount", sort: (c) => c.ecpm, cell: (c) => (c.ecpm ? usd(c.ecpm, 2) : na) },
        { id: "start", label: "Start Date", sort: (c) => dateKey(c.start), cell: (c) => longDate(c.start), width: "min-w-44" },
        { id: "end", label: "End Date", sort: (c) => dateKey(c.end), cell: (c) => longDate(c.end), width: "min-w-44" },
        {
            id: "cap",
            label: "Campaign Daily Impression Cap",
            sort: (c) => c.dailyCap ?? -1,
            cell: (c) => (c.dailyCap ? c.dailyCap.toLocaleString("en-US") : "Disabled"),
        },
    ];
    // The lifecycle column takes Pacing's place, beside Status, so it's read first.
    if (!lifecycle) return list;
    return [list[0], ...list.filter((c) => c.group), ...list.slice(1).filter((c) => !c.group)];
};

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

const searchText = (c: Campaign) =>
    [c.name, c.dealName, c.dealId, c.status, queued(c) ? "Queued" : "", c.rule, c.geos, c.platforms, ...c.apps, ...c.adUnits, ...c.languages, ...c.keywords]
        .join(" ")
        .toLowerCase();

/* -------------------------------------------------------------- Page --- */

export const ManageCampaigns = ({
    search = "",
    delivery = "pacing",
    filter: initialFilter,
    sortBy,
}: {
    search?: string;
    delivery?: DeliveryVariant;
    filter?: Filter;
    /** Open sorted, e.g. by pacing worst first, for the Storybook stills. */
    sortBy?: string;
}) => {
    const [query, setQuery] = useState(() => readHashParams().get("q") ?? search);
    const [filter, setFilter] = useState<Filter | undefined>(initialFilter);
    const [sort, setSort] = useState<{ id: string; dir: 1 | -1 } | null>(sortBy ? { id: sortBy, dir: 1 } : null);
    const cols = columns(delivery);
    const lifecycle = delivery === "lifecycle";

    const q = query.trim().toLowerCase();
    let rows = campaigns.filter((c) => (!q || searchText(c).includes(q)) && (!filter || FILTERS[filter].test(c)));
    if (sort) {
        // The lifecycle concept's Campaign Delivery header sorts by pacing.
        const col = sort.id === "delivery" ? { sort: pacingSort } : cols.find((c) => c.id === sort.id)!;
        rows = [...rows].sort((a, b) => {
            const x = col.sort(a);
            const y = col.sort(b);
            if (x === undefined || y === undefined) return x === y ? 0 : x === undefined ? 1 : -1;
            return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
        });
    }

    const onSearch = (v: string) => {
        setQuery(v);
        writeHashParams({ q: v.trim() || undefined });
    };
    const toggleFilter = (f: Filter) => setFilter((cur) => (cur === f ? undefined : f));
    const onSort = (id: string) => setSort((cur) => (cur?.id !== id ? { id, dir: 1 } : cur.dir === 1 ? { id, dir: -1 } : null));

    const ariaSort = (id: string) => (sort?.id === id ? (sort.dir === 1 ? "ascending" : "descending") : "none");
    const sortButton = (col: Pick<Column, "id" | "label" | "hint">) => {
        const on = sort?.id === col.id;
        const Icon = !on ? ChevronSelectorVertical : sort.dir === 1 ? ChevronUp : ChevronDown;
        return (
            <span className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => onSort(col.id)}
                    className="flex min-w-0 flex-1 items-center justify-between gap-3 font-bold whitespace-nowrap text-primary"
                >
                    {col.label}
                    <Icon className={cx("size-4 shrink-0", on ? TABLE.list.sortIconOn : TABLE.list.sortIcon)} aria-hidden="true" />
                </button>
                {col.hint}
            </span>
        );
    };

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
                label: lifecycle ? "Round 6 · Concept" : "Round 6",
                title: lifecycle ? "One Campaign Delivery column that changes with the campaign" : "Pacing in the list, one spend number",
                notes: lifecycle
                    ? [
                          "In flight, the Campaign Delivery column reads as one cell: “In flight · on target” or “behind”, with the pacing percentage, instead of budget and spend.",
                          "Once a campaign is complete it settles to its final budget and spend, still two columns so each sorts. A badly paced campaign doesn't stay red forever.",
                          "Click Campaign Delivery to sort by pacing, worst first. Budget and Spend sort the completed campaigns; campaigns in flight follow them.",
                          "To talk through with Product before it's settled.",
                      ]
                    : [
                          "Campaign Health is now Pacing, a column beside Status. The first click sorts it worst first, so campaigns that need attention rise to the top.",
                          "Pacing is real time: the share of budget delivered against the share of the flight gone, to the nearest 0.5%. 100% is on pace.",
                          "Green, yellow and red use placeholder cut-offs (95% and 80%) until Product sets them.",
                          "Spend is the trued-up number Performance Insights shows, so Spend and Total spend say “Subject to true-up”. Nothing says real time.",
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
                        label={
                            <TrueUp>
                                <span>Total spend</span>
                            </TrueUp>
                        }
                        sub={
                            <a href="#/view-d" className="inline-flex items-center gap-1 font-semibold uppercase" style={{ color: PINK }}>
                                Performance Insights <ArrowRight className="size-4" aria-hidden="true" />
                            </a>
                        }
                    >
                        <span className="flex flex-wrap items-baseline gap-x-2">
                            {usd(totalSpend)}
                            <span className="text-md font-normal text-tertiary">of {usd(booked)} booked</span>
                        </span>
                    </StatChip>
                    <PacingChip active={filter === "attention"} onPress={() => toggleFilter("attention")} />
                </div>

                <div className="flex flex-col gap-3">
                    <Input
                        aria-label="Search campaigns"
                        size="md"
                        icon={SearchLg}
                        placeholder="Search Campaigns"
                        wrapperClassName={SEARCH_WIDTH}
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
                        <p className="max-w-md text-md text-tertiary">
                            Search looks at campaign and deal names, deal IDs, status, auction rule, geos, platforms, apps, ad units and keywords.
                        </p>
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
                    <div className={TABLE.bleed}>
                        <table className={TABLE.table}>
                            <thead>
                                {lifecycle && (
                                    <tr>
                                        {cols.map((col, i) => {
                                            if (!col.group)
                                                return (
                                                    <th
                                                        key={col.id}
                                                        scope="col"
                                                        rowSpan={2}
                                                        aria-sort={ariaSort(col.id)}
                                                        className={cx(TABLE.list.th, col.width, "align-bottom")}
                                                    >
                                                        {sortButton(col)}
                                                    </th>
                                                );
                                            if (cols[i - 1]?.group === col.group) return null;
                                            return (
                                                <th
                                                    key={col.group}
                                                    scope="colgroup"
                                                    colSpan={cols.filter((x) => x.group === col.group).length}
                                                    aria-sort={ariaSort("delivery")}
                                                    className={cx(TABLE.list.th, "min-w-80")}
                                                >
                                                    {sortButton({ id: "delivery", label: col.group })}
                                                </th>
                                            );
                                        })}
                                    </tr>
                                )}
                                <tr>
                                    {cols
                                        .filter((col) => !lifecycle || col.group)
                                        .map((col) => (
                                            <th key={col.id} scope="col" aria-sort={ariaSort(col.id)} className={cx(TABLE.list.th, col.width)}>
                                                {sortButton(col)}
                                            </th>
                                        ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((c, i) => (
                                    <tr key={c.id} className={cx("align-top", i % 2 === 1 && TABLE.list.stripe)}>
                                        {cols.map((col, j) => {
                                            if (cols[j - 1]?.span?.(c)) return null;
                                            const spanned = col.span?.(c);
                                            return (
                                                <td key={col.id} colSpan={spanned ? 2 : undefined} className={cx(TABLE.list.td, col.width)}>
                                                    {spanned ?? col.cell(c, query)}
                                                </td>
                                            );
                                        })}
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
