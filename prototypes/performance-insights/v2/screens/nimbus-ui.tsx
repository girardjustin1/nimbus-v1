import { type CSSProperties, type ReactNode, useState } from "react";
import { ChevronDown, ChevronRight, ChevronSelectorVertical, ChevronUp, Plus, XClose } from "@untitledui/icons";
import { NIMBUS_CHART_ICONS } from "@/components/application/chart-type-bar/chart-type-bar";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "./das-shell";
import { DATE_LABEL, R1 } from "./round-1";
import { type SortState, ariaSort } from "./table-sort";

/**
 * Nimbus UI tokens — Round 5 (26 Oct review with Product).
 *
 * "Once DAS tokens are locked, one rule change fixes everything." Every piece Product
 * listed on the call lives here once, so DAS and the Performance Insights redesign draw
 * from the same source:
 *
 *   PageTabs          tabs across the top of a page (bold; teal fill + rule when active)
 *   TABLE / tableHead table styles by context: "list" (light header) vs "report" (charcoal)
 *   SortTh            a sortable column header; every table sorts (6 Nov)
 *   Bands / Band      full-span sections of UI with a band label ("Metrics:", "Filters:")
 *   DateCell          a date shown in Performance Insights' START DATE / END DATE layout,
 *                     selectable or not
 *   BareSelect        the quick picker ("Last 7 days") and group-by ("By Day") dropdowns
 *   UiControlButton   buttons that only change the UI ("Collapse") — name to confirm with engineering
 *   StateAction       actions on the current state ("Save Query", "Download .CSV"),
 *                     inactive when there is no state — name to confirm with engineering
 *   TealControls      teal for the controls in a region; the checkbox and radio shapes
 *                     themselves (staging's) now live in the base components
 *   ChartTypeBar      staging's chart type tabs and Sketch chart icons (shared component)
 *   FilterControl     Performance Insights' filter menu: + ADD → category / values →
 *                     SAVE; chosen values become checkboxes to toggle; ✕ clears all
 *
 * v2 · Round 1 (17 Nov 2026): where product asked for the current style, these pieces take
 * staging's values from ./round-1, under 15px where staging is (R1-04 date labels, R1-08
 * totals row, R1-09/10 buttons, R1-11 row heights, R1-12 band labels, R1-15 every
 * column left aligned). Everything else keeps the 15px floor.
 */

export const TEAL_DARK = "#1F7F80";
export const CHARCOAL = "#101828";
/**
 * Every striped table alternates white (#FFF) and this warm off-white, as on staging
 * (27 Oct). Lists and reports use the same pair.
 */
export const ROW_STRIPE = "#FCFAF9";
/** The report stripe; the same colour as ROW_STRIPE. */
export const REPORT_STRIPE = ROW_STRIPE;

/* -------------------------------------------------------------- Selection --- */

/**
 * Teal checkboxes and radios. The base components fill with the theme's brand colour
 * (pink); overriding the two utility variables on a wrapper recolours every checkbox,
 * radio and tag-checkbox inside it without touching pink buttons or toggles.
 */
export const tealControls = {
    "--background-color-brand-solid": TEAL,
    "--ring-color-brand-solid": TEAL,
    "--border-color-brand-solid": TEAL,
} as CSSProperties;

/**
 * Performance Insights' toggles (staging, 25 Nov): teal where the rest of the app keeps
 * pink. Set on the page's wrapper, so Show legend and Totals Only both take it.
 */
export const tealToggles = {
    "--toggle-on": TEAL,
    "--toggle-on-hover": "#2E9FA0",
} as CSSProperties;

export const TealControls = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={className} style={tealControls}>
        {children}
    </div>
);

/* ------------------------------------------------------------------- Tabs --- */

export interface PageTab {
    id: string;
    label: string;
    href: string;
}

/**
 * Tabs across the top of a page, as on staging (Saved Queries / New Query, Asset Setup /
 * View All Assets): bold labels, thin rules between tabs, and the active tab filled teal
 * with a teal rule under it. Inactive tabs read pink, like staging's links.
 */
export const PageTabs = ({ tabs, active, trailing }: { tabs: PageTab[]; active: string; trailing?: ReactNode }) => (
    <div className="flex items-stretch border-b border-secondary px-8">
        <div className="flex items-stretch border-x border-secondary">
            {tabs.map((t, i) => {
                const on = t.id === active;
                return (
                    <a
                        key={t.id}
                        href={t.href}
                        aria-current={on ? "page" : undefined}
                        className={cx(
                            "-mb-px flex items-center border-b-2 px-8 py-4 text-md font-bold whitespace-nowrap transition duration-100 ease-linear",
                            i > 0 && "border-l border-l-secondary",
                            on ? "border-b-current" : "border-b-transparent hover:bg-secondary",
                        )}
                        style={on ? { color: TEAL_DARK, backgroundColor: `${TEAL}1a` } : { color: PINK }}
                    >
                        {t.label}
                    </a>
                );
            })}
        </div>
        {trailing && <div className="ml-auto flex items-center gap-3 py-2">{trailing}</div>}
    </div>
);

/* ----------------------------------------------------------------- Tables --- */

export type TableKind = "list" | "report";

/**
 * Table styles by context (Product, 26 Oct):
 *   - report → charcoal header with white labels, warm alternating rows. Anything that
 *     reports numbers: Performance Insights, Full performance, keyword reporting.
 *   - list   → light header, bold black labels. An organised list of things: campaigns,
 *     assets, keywords, selected items.
 * Both have vertical rules between columns and run full bleed: `bleed` cancels the page's
 * px-8 so the table meets both edges of the content area, like staging; the first and last
 * cells take the page padding back so text still lines up with everything above.
 */
export const TABLE = {
    bleed: "-mx-8 overflow-x-auto border-y border-secondary",
    // R1-15: every column label and value aligns left, numbers included (v1 right-aligned number columns).
    table: "w-full border-collapse text-left text-md [&_td]:text-left! [&_th]:text-left!",
    list: {
        th: "border-r border-b-2 border-secondary px-4 py-3 align-bottom font-bold whitespace-nowrap text-primary first:pl-8 last:border-r-0 last:pr-8",
        td: "border-r border-secondary px-4 py-4 text-secondary first:pl-8 last:border-r-0 last:pr-8",
        stripe: "bg-[#FCFAF9]",
        sortIcon: "text-fg-quaternary",
        sortIconOn: "text-fg-primary",
    },
    report: {
        th: "border-r border-white/15 px-4 py-3 align-bottom font-bold whitespace-nowrap text-white first:pl-8 last:border-r-0 last:pr-8",
        td: "border-r border-secondary px-4 py-3 text-primary first:pl-8 last:border-r-0 last:pr-8",
        stripe: "bg-[#FCFAF9]",
        sortIcon: "text-white/50",
        sortIconOn: "text-white",
        // R1-08: staging's totals row — 3px grey rule above, 14px, weight 600, lighter teal (TOTAL_ROW sets the values).
        foot: "",
    },
} as const;

/** R1-08: the totals row of a report, as staging draws it: the rule goes on the <tfoot>, the type on each cell. */
export const TOTAL_ROW: CSSProperties = { borderTop: R1.tableTotal.borderTop };
export const TOTAL_CELL: CSSProperties = { fontSize: R1.tableTotal.fontSize, fontWeight: R1.tableTotal.fontWeight, color: R1.tableTotal.color };

/** The <thead> style for a table kind (charcoal for reports). */
export const tableHead = (kind: TableKind): CSSProperties | undefined => (kind === "report" ? { backgroundColor: CHARCOAL } : undefined);

/**
 * A sortable column header (6 Nov: every table sorts). The whole label is the button; the
 * chevrons show the state — both when unsorted, one when sorted. Logic lives in table-sort.ts.
 * R1-15: every label sits on the left, over the start of its column; `align` is kept for
 * the screens forked from v1 but no longer moves a label.
 */
export const SortTh = ({
    id,
    sort,
    onSort,
    kind = "list",
    className,
    hint,
    children,
}: {
    id: string;
    sort: SortState;
    onSort: (id: string) => void;
    kind?: TableKind;
    align?: "left" | "right";
    className?: string;
    hint?: ReactNode;
    children: ReactNode;
}) => {
    const on = sort?.id === id;
    const Icon = !on ? ChevronSelectorVertical : sort.dir === 1 ? ChevronUp : ChevronDown;
    return (
        <th scope="col" aria-sort={ariaSort(sort, id)} className={cx(TABLE[kind].th, className)}>
            <span className="flex items-center gap-1.5">
                <button type="button" onClick={() => onSort(id)} className="flex min-w-0 flex-1 items-center justify-between gap-3 font-bold">
                    {children}
                    <Icon className={cx("size-4 shrink-0", on ? TABLE[kind].sortIconOn : TABLE[kind].sortIcon)} aria-hidden="true" />
                </button>
                {hint}
            </span>
        </th>
    );
};

/* ------------------------------------------------------------------ Bands --- */

/** A stack of full-span bands: full bleed, one rule between each. */
export const Bands = ({ children, className }: { children: ReactNode; className?: string }) => (
    <div className={cx("-mx-8 divide-y divide-secondary border-y border-secondary", className)} style={tealControls}>
        {children}
    </div>
);

/**
 * One band: the label in its own column, then the controls. `flush` drops the vertical
 * padding so the controls can fill the band's height (the chart type bar does).
 */
export const Band = ({ label, children, flush, trailing }: { label: string; children: ReactNode; flush?: boolean; trailing?: ReactNode }) => (
    <div className={cx("grid grid-cols-1 gap-x-6 px-8 md:grid-cols-[190px_minmax(0,1fr)_auto]", flush ? "md:items-stretch" : "gap-y-3 py-4 md:items-start")}>
        {/* R1-12: filter and breakdown section labels at staging's 16px bold. */}
        <span className={cx(flush ? "pt-4 md:flex md:items-center md:pt-0" : "md:pt-1")} style={R1.filterLabel}>
            {label}:
        </span>
        <div className="min-w-0">{children}</div>
        {trailing ? <div className={cx("flex items-start justify-end", flush ? "md:items-center" : "")}>{trailing}</div> : <span className="hidden md:block" />}
    </div>
);

/* ------------------------------------------------------------------ Dates --- */

/**
 * A date in Performance Insights' layout — small uppercase label over the value, divided
 * from its neighbour by a rule. The same token whether or not it opens a picker (engineering's
 * React date picker replaces the picker itself in the build).
 */
export const DateCell = ({ label, children, onPress }: { label: string; children: ReactNode; onPress?: () => void }) => {
    const body = (
        <>
            {/* R1-04: the start / end date label takes the small upper case style, at staging's 11px for this label (type scrape, 25 Nov). */}
            <span style={DATE_LABEL}>{label}:</span>
            <span className="text-md font-bold text-[#101828]">{children}</span>
        </>
    );
    // The first cell takes the page padding, so it lines up with the band labels below.
    // R1-11: no vertical padding; the date row sets staging's 62px height.
    const cls = "flex w-48 flex-col justify-center gap-1 border-r border-secondary px-6 text-left first:w-52 first:pl-8";
    return onPress ? (
        <button type="button" onClick={onPress} className={cx(cls, "hover:bg-secondary")}>
            {body}
        </button>
    ) : (
        <div className={cls}>{body}</div>
    );
};

/** Performance Insights' bare dropdowns: the quick picker ("Last 7 days") and group-by ("By Day"). */
export const BareSelect = <T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: { id: T; label: string }[];
    onChange: (v: T) => void;
}) => (
    // 13 Nov: w-44, not w-56 — at 1440 the wider pickers pushed the UTC note and the actions onto a second line.
    <label className="relative flex w-44 items-center border-r border-secondary">
        <span className="sr-only">{label}</span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="h-full w-full cursor-pointer appearance-none bg-transparent pr-10 pl-6 text-md font-bold text-primary outline-focus-ring focus-visible:outline-2"
        >
            {options.map((o) => (
                <option key={o.id} value={o.id}>
                    {o.label}
                </option>
            ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 size-5 text-fg-quaternary" aria-hidden="true" />
    </label>
);

/** The date row: dates and dropdowns on the left, notes and actions on the right. */
export const DateRow = ({ children, trailing }: { children: ReactNode; trailing?: ReactNode }) => (
    // R1-11: staging's date bar is 62px tall.
    <div className="flex flex-wrap items-stretch justify-between">
        <div className="flex flex-wrap items-stretch" style={{ minHeight: R1.dateRowHeight }}>
            {children}
        </div>
        {trailing && (
            <div className="flex shrink-0 items-center gap-3 px-8 whitespace-nowrap" style={{ minHeight: R1.dateRowHeight }}>
                {trailing}
            </div>
        )}
    </div>
);

/* ---------------------------------------------------------------- Buttons --- */

/** Buttons that only change the UI, not the data ("Collapse" / "Expand"). Grey outline pill. */
export const UiControlButton = ({
    children,
    icon: Icon,
    onPress,
    pressed,
}: {
    children: ReactNode;
    icon?: typeof ChevronUp;
    onPress: () => void;
    pressed?: boolean;
}) => (
    <button
        type="button"
        aria-pressed={pressed}
        onClick={onPress}
        // R1-09, R1-10: staging's button text and height; #667085 is staging's colour (type scrape, 25 Nov).
        className="gap-1.5 whitespace-nowrap text-[#667085] ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary"
        style={R1.button}
    >
        {Icon && <Icon className="size-4" aria-hidden="true" />}
        {children}
    </button>
);

/** The collapse / expand control for a builder. */
export const CollapseButton = ({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) => (
    <UiControlButton icon={collapsed ? ChevronDown : ChevronUp} onPress={onToggle} pressed={collapsed}>
        {collapsed ? "Expand" : "Collapse"}
    </UiControlButton>
);

/**
 * Actions on the current state ("Save Query", "Download .CSV"). Pink pill; inactive (pale,
 * not clickable) while there's no state to act on, as on staging before a metric is picked.
 */
/** Staging's disabled button fill (Save Query, Download .CSV with nothing to save). */
const DISABLED_FILL = "#E2DEDD";

export const StateAction = ({ children, onPress, disabled, quiet }: { children: ReactNode; onPress: () => void; disabled?: boolean; quiet?: boolean }) => (
    <button
        type="button"
        onClick={onPress}
        disabled={disabled}
        className={cx(
            "whitespace-nowrap transition duration-100 ease-linear disabled:cursor-not-allowed",
            quiet ? "bg-transparent ring-1 enabled:hover:bg-secondary disabled:opacity-35" : "text-white enabled:hover:opacity-90",
        )}
        // R1-09, R1-10: staging's button text (13px, weight 800, upper case), 33px tall, the label centred.
        // Disabled, a filled button turns warm grey with white text, as on staging (25 Nov), not a faded pink.
        style={{
            ...R1.button,
            ...(quiet ? { color: PINK, ["--tw-ring-color" as string]: `${PINK}66` } : { backgroundColor: disabled ? DISABLED_FILL : PINK }),
        }}
    >
        {children}
    </button>
);

/* ------------------------------------------------------------- Chart type --- */

/**
 * The staging chart type tabs (27 Oct): one shared component, also used by v4's Full
 * performance and the App Screens replicas. The Sketch-file chart icons are in.
 */
export { ChartTypeBar } from "@/components/application/chart-type-bar/chart-type-bar";
export type { ChartTypeBarOption as ChartTypeOption } from "@/components/application/chart-type-bar/chart-type-bar";
export const DEFAULT_CHART_ICONS = NIMBUS_CHART_ICONS;

/* ----------------------------------------------------------------- Filters --- */

export interface FilterDim {
    id: string;
    label: string;
    values: string[];
    /**
     * A two-level list (staging: Country by region, App by account): each value's group. The
     * panel lists the groups in a middle pane, then the open group's values.
     */
    group?: { label: string; of: Record<string, string> };
    /** A note beside the values (staging's DAS: data is subject to true-up). */
    note?: string;
}

/** Per dimension: the values chosen in the menu, and which of those are toggled off. */
export type FilterState = Record<string, { values: string[]; off: string[] }>;

/**
 * What a FilterState leaves out, per dimension: every value that isn't chosen and on.
 * Dimensions with nothing chosen leave nothing out, and so do dimensions with every value
 * toggled off: on staging an unticked chip stays on the row but drops out of the query.
 */
export const filterExcluded = (dims: FilterDim[], state: FilterState): Record<string, string[]> =>
    Object.fromEntries(
        dims.map((d) => {
            const f = state[d.id];
            const kept = f ? f.values.filter((v) => !f.off.includes(v)) : [];
            if (!kept.length) return [d.id, []];
            return [d.id, d.values.filter((v) => !kept.includes(v))];
        }),
    );

export const hasFilters = (state: FilterState) => Object.values(state).some((f) => f.values.length);

/** Staging's panel (25 Nov): lists longer than this get a search box and two columns. */
const SEARCH_OVER = 7;
/** Staging draws at most this many values; search reaches the rest. */
const DRAW_CAP = 1000;
/** “Country” → “countries”, “Region” → “regions” (for search labels). */
const plural = (word: string, keepCase = false) => {
    const w = keepCase ? word : word.toLowerCase();
    return /[^aeiou]y$/i.test(w) ? `${w.slice(0, -1)}ies` : `${w}s`;
};
/** Selected rows and the open category: teal at 8%, as on staging. */
const TEAL_ROW = "rgba(55, 182, 183, 0.08)";

const PanelRow = ({ on, onPress, children, arrow }: { on?: boolean; onPress: () => void; children: ReactNode; arrow?: boolean }) => (
    <li>
        <button
            type="button"
            onClick={onPress}
            aria-pressed={arrow ? undefined : on}
            aria-current={arrow && on ? "true" : undefined}
            className={cx("flex h-10 w-full items-center justify-between gap-2 px-4 text-left text-md", on ? "" : "text-secondary hover:bg-secondary")}
            style={on ? { color: TEAL_DARK, backgroundColor: TEAL_ROW, fontWeight: arrow ? 700 : 400 } : undefined}
        >
            <span className="min-w-0 truncate">{children}</span>
            {arrow && <ChevronRight className={cx("size-4 shrink-0", on ? "" : "text-fg-quaternary")} aria-hidden="true" />}
        </button>
    </li>
);

const PanelSearch = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => (
    <input
        type="search"
        aria-label={label}
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mx-4 my-2 h-11 w-[calc(100%-2rem)] max-w-[530px] shrink-0 rounded-md border border-[#efedec] px-4 text-md text-primary outline-none placeholder:text-[#c4c4c4] focus:border-[#7bcacd] focus:ring-2 focus:ring-[#7bcacd66]"
    />
);

/**
 * Performance Insights' filter control, as on staging (25 Nov); shared with Buyer Breakdown,
 * Benchmarks and Realtime.
 *
 *   Band     + ADD in the 190px column, then each saved category: its name in grey (190px)
 *            and its values as checkboxes. Unticking a value keeps it on the row and drops it
 *            from the query (every value may be unticked). ✕, behind a rule, clears them all.
 *   Panel    a fixed 360px body: the category rail (picked count in brackets), then the
 *            category's values with Clear Selections. Lists over seven values get a search
 *            box and two columns; "All" picks every value; picks are teal rows, not boxes.
 *            Grouped lists (Country by region, App by account) add a middle pane. At most
 *            1,000 values are drawn; search reaches the rest. CANCEL / SAVE.
 */
export const FilterControl = ({
    dims,
    value,
    onChange,
    openOn,
    openGroup,
    query: initialQuery = "",
}: {
    dims: FilterDim[];
    value: FilterState;
    onChange: (next: FilterState) => void;
    /** Opens the panel on this category when the screen loads (prototype states). */
    openOn?: string;
    /** With openOn: the group open in a grouped list. */
    openGroup?: string;
    /** With openOn: a search already typed. */
    query?: string;
}) => {
    const [open, setOpen] = useState(Boolean(openOn));
    const [draft, setDraft] = useState<FilterState>(value);
    const [cat, setCat] = useState(openOn ?? dims[0]?.id);
    const [query, setQuery] = useState(initialQuery);
    const [group, setGroup] = useState<string | undefined>(openGroup);
    const current = dims.find((d) => d.id === cat) ?? dims[0];
    const groupOf = (v: string) => current?.group?.of[v] ?? "Other";
    const groups = current?.group ? [...new Set(current.values.map(groupOf))] : [];
    const openGroupName = group && groups.includes(group) ? group : groups[0];
    const any = hasFilters(value);

    const openMenu = () => {
        setDraft(value);
        setCat(dims[0]?.id);
        setGroup(undefined);
        setQuery("");
        setOpen(true);
    };
    const pickCat = (id: string) => {
        setCat(id);
        setGroup(undefined);
        setQuery("");
    };
    const picked = (dim: string) => draft[dim]?.values ?? [];
    const setPicked = (dim: string, values: string[]) =>
        setDraft((cur) => ({ ...cur, [dim]: { values, off: (cur[dim]?.off ?? []).filter((x) => values.includes(x)) } }));
    const pick = (dim: string, v: string) => {
        const now = picked(dim);
        setPicked(dim, now.includes(v) ? now.filter((x) => x !== v) : [...now, v]);
    };
    const pickAll = (dim: string, of: string[]) => {
        const now = picked(dim);
        const all = of.every((v) => now.includes(v));
        setPicked(dim, all ? now.filter((v) => !of.includes(v)) : [...new Set([...now, ...of])]);
    };
    const toggle = (dim: string, v: string) => {
        const f = value[dim];
        onChange({ ...value, [dim]: { ...f, off: f.off.includes(v) ? f.off.filter((x) => x !== v) : [...f.off, v] } });
    };
    const changed = JSON.stringify(draft) !== JSON.stringify(value);

    const q = query.trim().toLowerCase();
    const matches = (v: string) => !q || v.toLowerCase().includes(q);
    const searchable = Boolean(current && (current.group || current.note || current.values.length > SEARCH_OVER));
    // Grouped: the middle pane keeps groups whose name or values match; the right, the open group's values.
    const shownGroups = groups.filter((g) => !q || g.toLowerCase().includes(q) || current.values.some((v) => groupOf(v) === g && matches(v)));
    const listed = !current
        ? []
        : current.group
          ? current.values.filter((v) => groupOf(v) === openGroupName && (matches(v) || Boolean(openGroupName?.toLowerCase().includes(q))))
          : current.values.filter(matches);
    const drawn = listed.slice(0, DRAW_CAP);
    const allOn = listed.length > 0 && listed.every((v) => picked(current.id).includes(v));

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-stretch gap-4">
                <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-6 gap-y-3">
                    <span className="w-[190px] shrink-0">
                        <button
                            type="button"
                            onClick={() => (open ? setOpen(false) : openMenu())}
                            aria-expanded={open}
                            className="inline-flex items-center gap-1 font-bold uppercase"
                            style={{ color: PINK, fontSize: 15, letterSpacing: "0.75px" }}
                        >
                            <Plus className="size-4" aria-hidden="true" /> Add
                        </button>
                    </span>
                    {dims.map((d) => {
                        const f = value[d.id];
                        if (!f?.values.length) return null;
                        return (
                            <span key={d.id} className="inline-flex flex-wrap items-center gap-x-6 gap-y-3">
                                <span className="w-[190px] shrink-0 font-bold" style={{ fontSize: 15, color: "#667085" }}>
                                    {d.label}
                                </span>
                                {f.values.map((v) => (
                                    <Checkbox
                                        key={v}
                                        size="md"
                                        label={<span style={R1.checkboxText}>{v}</span>}
                                        isSelected={!f.off.includes(v)}
                                        onChange={() => toggle(d.id, v)}
                                    />
                                ))}
                            </span>
                        );
                    })}
                </div>
                {any && (
                    <span className="flex w-10 shrink-0 items-center justify-center self-stretch border-l border-secondary">
                        <button
                            type="button"
                            aria-label="Clear all filters"
                            title="Clear all filters"
                            onClick={() => onChange({})}
                            className="rounded-md p-1 transition duration-100 ease-linear hover:bg-secondary"
                            style={{ color: PINK }}
                        >
                            <XClose className="size-6" aria-hidden="true" />
                        </button>
                    </span>
                )}
            </div>

            {open && current && (
                <div className="overflow-hidden rounded-lg bg-primary ring-1 ring-secondary">
                    <div className="flex h-[360px]">
                        <ul className="w-[240px] shrink-0 overflow-y-auto border-r border-secondary py-1" aria-label="Filter categories">
                            {dims.map((d) => {
                                const n = draft[d.id]?.values.length ?? 0;
                                return (
                                    <PanelRow key={d.id} arrow on={d.id === current.id} onPress={() => pickCat(d.id)}>
                                        {d.label}
                                        {n > 0 && <span className={cx("ml-1.5", d.id === current.id ? "" : "text-tertiary")}>({n})</span>}
                                    </PanelRow>
                                );
                            })}
                        </ul>

                        {current.group && (
                            <div className="flex w-[240px] shrink-0 flex-col border-r border-secondary">
                                <PanelSearch value={query} onChange={setQuery} label={`Filter ${plural(current.group.label)} and ${plural(current.label)}`} />
                                <ul className="min-h-0 flex-1 overflow-y-auto py-1" aria-label={plural(current.group.label, true)}>
                                    {!q && (
                                        <PanelRow on={current.values.every((v) => picked(current.id).includes(v))} onPress={() => pickAll(current.id, current.values)}>
                                            All
                                        </PanelRow>
                                    )}
                                    {shownGroups.map((g) => (
                                        <PanelRow key={g} arrow on={g === openGroupName} onPress={() => setGroup(g)}>
                                            {g}
                                        </PanelRow>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className={cx("flex min-w-0 flex-col", current.note ? "w-[200px] shrink-0 border-r border-secondary" : "flex-1")}>
                            {!current.note && (
                                <div className="flex items-center justify-between px-4 pt-3 pb-1">
                                    <span className="text-md font-bold text-primary">{current.label}</span>
                                    <button type="button" onClick={() => setPicked(current.id, [])} className="text-md font-bold underline" style={{ color: PINK }}>
                                        Clear Selections
                                    </button>
                                </div>
                            )}
                            {searchable && !current.group && <PanelSearch value={query} onChange={setQuery} label={`Search ${current.label}`} />}
                            <ul
                                className={cx(
                                    "min-h-0 flex-1 overflow-y-auto py-1",
                                    searchable && !current.note && "grid auto-rows-min grid-cols-2 [&>li:nth-child(even)]:border-l [&>li:nth-child(even)]:border-secondary",
                                )}
                                aria-label={`${current.label} values`}
                            >
                                {!q && (
                                    <PanelRow on={allOn} onPress={() => pickAll(current.id, listed)}>
                                        All
                                    </PanelRow>
                                )}
                                {drawn.map((v) => (
                                    <PanelRow key={v} on={picked(current.id).includes(v)} onPress={() => pick(current.id, v)}>
                                        {v}
                                    </PanelRow>
                                ))}
                                {listed.length === 0 && <li className="px-4 py-2 text-md text-tertiary">No matches</li>}
                            </ul>
                            {listed.length > DRAW_CAP && (
                                <p className="border-t border-secondary px-4 py-2 text-md text-tertiary">
                                    Showing {DRAW_CAP.toLocaleString()} of {listed.length.toLocaleString()}. Search to find the rest.
                                </p>
                            )}
                        </div>
                        {current.note && <p className="w-[220px] shrink-0 p-3 text-md font-bold text-primary">{current.note}</p>}
                    </div>
                    <div className="flex justify-end gap-3 border-t border-secondary px-4 py-3">
                        <StateAction quiet onPress={() => setOpen(false)}>
                            Cancel
                        </StateAction>
                        <StateAction
                            disabled={!changed}
                            onPress={() => {
                                onChange(Object.fromEntries(Object.entries(draft).filter(([, f]) => f.values.length)));
                                setOpen(false);
                            }}
                        >
                            Save
                        </StateAction>
                    </div>
                </div>
            )}
        </div>
    );
};
