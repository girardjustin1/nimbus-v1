import { type CSSProperties, type ReactNode, useState } from "react";
import { Activity, BarChart07, BarChart10, ChevronDown, ChevronRight, ChevronUp, LineChartUp01, PieChart01, Plus, Table, XClose } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "./das-shell";
import { LABEL } from "./type-rules";
import "./nimbus-controls.css";

/**
 * Nimbus UI tokens — Round 5 (26 Oct review with Product).
 *
 * "Once DAS tokens are locked, one rule change fixes everything." Every piece Product
 * listed on the call lives here once, so DAS and the Performance Insights redesign draw
 * from the same source:
 *
 *   PageTabs          tabs across the top of a page (bold; teal fill + rule when active)
 *   TABLE / tableHead table styles by context: "list" (light header) vs "report" (charcoal)
 *   Bands / Band      full-span sections of UI with a band label ("Metrics:", "Filters:")
 *   DateCell          a date shown in Performance Insights' START DATE / END DATE layout,
 *                     selectable or not
 *   BareSelect        the quick picker ("Last 7 days") and group-by ("By Day") dropdowns
 *   UiControlButton   buttons that only change the UI ("Collapse") — name to confirm with Berna
 *   StateAction       actions on the current state ("Save Query", "Download .CSV"),
 *                     inactive when there is no state — name to confirm with Berna
 *   TealControls      checkboxes and radios as on staging: pale teal fill with a teal
 *                     check; a teal ring around a solid teal dot (nimbus-controls.css)
 *   ChartTypeBar      chart type buttons that fill the band, with swappable icons
 *   FilterControl     Performance Insights' filter menu: + ADD → category / values →
 *                     SAVE; chosen values become checkboxes to toggle; ✕ clears all
 *
 * Type stays at the 15px floor (Storybook › Audits › Typography Rules), so labels can't
 * drop to staging's 10–12px; sizes and weights otherwise follow staging.
 */

export const TEAL_DARK = "#1F7F80";
export const CHARCOAL = "#101828";
/** Reports alternate rows in a warm off-white ("the alternating tan"). */
export const REPORT_STRIPE = "#F8F6F1";

/* -------------------------------------------------------------- Selection --- */

/**
 * Teal checkboxes and radios. The base components fill with the theme's brand colour
 * (pink); overriding the two utility variables on a wrapper recolours every checkbox,
 * radio and tag-checkbox inside it without touching pink buttons or toggles.
 */
export const tealControls = {
    // Marks the region for nimbus-controls.css (staging's checkbox and radio shapes).
    "--nimbus-controls": "on",
    "--background-color-brand-solid": TEAL,
    "--ring-color-brand-solid": TEAL,
    "--border-color-brand-solid": TEAL,
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
    table: "w-full border-collapse text-left text-md",
    list: {
        th: "border-r border-b-2 border-secondary px-4 py-3 align-bottom font-bold whitespace-nowrap text-primary first:pl-8 last:border-r-0 last:pr-8",
        td: "border-r border-secondary px-4 py-4 text-secondary first:pl-8 last:border-r-0 last:pr-8",
        stripe: "bg-secondary/40",
        sortIcon: "text-fg-quaternary",
        sortIconOn: "text-fg-primary",
    },
    report: {
        th: "border-r border-white/15 px-4 py-3 align-bottom font-bold whitespace-nowrap text-white first:pl-8 last:border-r-0 last:pr-8",
        td: "border-r border-secondary px-4 py-3 text-primary first:pl-8 last:border-r-0 last:pr-8",
        stripe: "bg-[#F8F6F1]",
        sortIcon: "text-white/50",
        sortIconOn: "text-white",
        foot: "border-t-2 border-secondary font-bold text-primary",
    },
} as const;

/** The <thead> style for a table kind (charcoal for reports). */
export const tableHead = (kind: TableKind): CSSProperties | undefined => (kind === "report" ? { backgroundColor: CHARCOAL } : undefined);

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
    <div className={cx("grid grid-cols-1 gap-x-6 px-8 md:grid-cols-[150px_minmax(0,1fr)_auto]", flush ? "md:items-stretch" : "gap-y-3 py-4 md:items-start")}>
        <span className={cx(LABEL, flush ? "pt-4 md:flex md:items-center md:pt-0" : "md:pt-1")}>{label}:</span>
        <div className="min-w-0">{children}</div>
        {trailing ? <div className={cx("flex items-start justify-end", flush ? "md:items-center" : "")}>{trailing}</div> : <span className="hidden md:block" />}
    </div>
);

/* ------------------------------------------------------------------ Dates --- */

/**
 * A date in Performance Insights' layout — small uppercase label over the value, divided
 * from its neighbour by a rule. The same token whether or not it opens a picker (Berna's
 * React date picker replaces the picker itself in the build).
 */
export const DateCell = ({ label, children, onPress }: { label: string; children: ReactNode; onPress?: () => void }) => {
    const body = (
        <>
            <span className="text-md font-semibold tracking-wide text-tertiary uppercase">{label}:</span>
            <span className="text-md font-bold text-primary">{children}</span>
        </>
    );
    // The first cell takes the page padding, so it lines up with the band labels below.
    const cls = "flex w-48 flex-col justify-center gap-0.5 border-r border-secondary px-6 py-3 text-left first:w-52 first:pl-8";
    return onPress ? (
        <button type="button" onClick={onPress} className={cx(cls, "hover:bg-secondary")}>
            {body}
        </button>
    ) : (
        <div className={cls}>{body}</div>
    );
};

/** Performance Insights' bare dropdowns: the quick picker ("Last 7 days") and group-by ("By Day"). */
export const BareSelect = <T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) => (
    <label className="relative flex w-56 items-center border-r border-secondary">
        <span className="sr-only">{label}</span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="h-full w-full cursor-pointer appearance-none bg-transparent py-3 pr-10 pl-6 text-md font-bold text-primary outline-focus-ring focus-visible:outline-2"
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
    <div className="flex flex-wrap items-stretch justify-between">
        <div className="flex flex-wrap items-stretch">{children}</div>
        {trailing && <div className="flex flex-wrap items-center gap-3 px-8 py-3">{trailing}</div>}
    </div>
);

/* ---------------------------------------------------------------- Buttons --- */

/** Buttons that only change the UI, not the data ("Collapse" / "Expand"). Grey outline pill. */
export const UiControlButton = ({ children, icon: Icon, onPress, pressed }: { children: ReactNode; icon?: typeof ChevronUp; onPress: () => void; pressed?: boolean }) => (
    <button
        type="button"
        aria-pressed={pressed}
        onClick={onPress}
        className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-md font-bold whitespace-nowrap text-tertiary uppercase ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary"
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
export const StateAction = ({ children, onPress, disabled, quiet }: { children: ReactNode; onPress: () => void; disabled?: boolean; quiet?: boolean }) => (
    <button
        type="button"
        onClick={onPress}
        disabled={disabled}
        className={cx(
            "rounded-full px-5 py-2 text-md font-bold whitespace-nowrap uppercase transition duration-100 ease-linear disabled:cursor-not-allowed disabled:opacity-35",
            quiet ? "bg-transparent ring-1 enabled:hover:bg-secondary" : "text-white enabled:hover:opacity-90",
        )}
        style={quiet ? { color: PINK, ["--tw-ring-color" as string]: `${PINK}66` } : { backgroundColor: PINK }}
    >
        {children}
    </button>
);

/* ------------------------------------------------------------- Chart type --- */

export interface ChartTypeOption<T extends string> {
    id: T;
    label: string;
    /** Swap in the Sketch-file chart icons here when they arrive. */
    icon: typeof Table;
}

export const DEFAULT_CHART_ICONS = { table: Table, line: LineChartUp01, area: Activity, bar: BarChart07, stacked: BarChart10, pie: PieChart01 };

/** Chart type buttons that fill the band's height; the chosen one is teal on a teal tint. */
export const ChartTypeBar = <T extends string>({ options, value, onChange }: { options: ChartTypeOption<T>[]; value: T; onChange: (v: T) => void }) => (
    <div role="radiogroup" aria-label="Chart type" className="flex h-full flex-wrap items-stretch">
        {options.map((t) => {
            const on = value === t.id;
            return (
                <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onChange(t.id)}
                    className={cx("inline-flex items-center gap-2 px-4 py-4 text-md font-bold whitespace-nowrap uppercase transition duration-100 ease-linear", !on && "hover:bg-secondary")}
                    style={on ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f` } : { color: PINK }}
                >
                    <t.icon className="size-5" aria-hidden="true" />
                    {t.label}
                </button>
            );
        })}
    </div>
);

/* ----------------------------------------------------------------- Filters --- */

export interface FilterDim {
    id: string;
    label: string;
    values: string[];
}

/** Per dimension: the values chosen in the menu, and which of those are toggled off. */
export type FilterState = Record<string, { values: string[]; off: string[] }>;

/**
 * What a FilterState leaves out, per dimension: every value that isn't chosen and on.
 * Dimensions with nothing chosen leave nothing out.
 */
export const filterExcluded = (dims: FilterDim[], state: FilterState): Record<string, string[]> =>
    Object.fromEntries(
        dims.map((d) => {
            const f = state[d.id];
            if (!f?.values.length) return [d.id, []];
            const kept = f.values.filter((v) => !f.off.includes(v));
            return [d.id, d.values.filter((v) => !kept.includes(v))];
        }),
    );

export const hasFilters = (state: FilterState) => Object.values(state).some((f) => f.values.length);

/**
 * Performance Insights' filter menu (staging, 26 Oct):
 *   + ADD opens a two-pane menu — categories on the left, that category's values on the
 *   right with Clear Selections — and CANCEL / SAVE. Saved values sit in the Filters band
 *   as checkboxes, so you can add iOS and Android and toggle one off to compare; the ✕ at
 *   the far right clears every filter.
 * A dimension can't be toggled down to nothing: the last value on stays on.
 */
export const FilterControl = ({ dims, value, onChange }: { dims: FilterDim[]; value: FilterState; onChange: (next: FilterState) => void }) => {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState<FilterState>(value);
    const [cat, setCat] = useState(dims[0]?.id);
    const current = dims.find((d) => d.id === cat) ?? dims[0];
    const any = hasFilters(value);

    const openMenu = () => {
        setDraft(value);
        setCat(dims[0]?.id);
        setOpen(true);
    };
    const pick = (dim: string, v: string) =>
        setDraft((cur) => {
            const f = cur[dim] ?? { values: [], off: [] };
            const values = f.values.includes(v) ? f.values.filter((x) => x !== v) : [...f.values, v];
            return { ...cur, [dim]: { values, off: f.off.filter((x) => values.includes(x)) } };
        });
    const toggle = (dim: string, v: string) => {
        const f = value[dim];
        const off = f.off.includes(v) ? f.off.filter((x) => x !== v) : [...f.off, v];
        if (off.length >= f.values.length) return;
        onChange({ ...value, [dim]: { ...f, off } });
    };
    const changed = JSON.stringify(draft) !== JSON.stringify(value);

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <button type="button" onClick={() => (open ? setOpen(false) : openMenu())} aria-expanded={open} className="inline-flex items-center gap-1 text-md font-bold uppercase" style={{ color: PINK }}>
                    <Plus className="size-4" aria-hidden="true" /> Add
                </button>
                {dims.map((d) => {
                    const f = value[d.id];
                    if (!f?.values.length) return null;
                    return (
                        <span key={d.id} className="inline-flex flex-wrap items-center gap-x-4 gap-y-2">
                            <span className="text-md font-semibold text-tertiary">{d.label}</span>
                            {f.values.map((v) => (
                                <Checkbox key={v} size="md" label={<span className="text-md text-primary">{v}</span>} isSelected={!f.off.includes(v)} onChange={() => toggle(d.id, v)} />
                            ))}
                        </span>
                    );
                })}
                {any && (
                    <button type="button" aria-label="Clear all filters" title="Clear all filters" onClick={() => onChange({})} className="ml-auto rounded-md p-1 transition duration-100 ease-linear hover:bg-secondary" style={{ color: PINK }}>
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                )}
            </div>

            {open && current && (
                <div className="overflow-hidden rounded-lg ring-1 ring-secondary">
                    <div className="grid grid-cols-[240px_minmax(0,1fr)]">
                        <ul className="max-h-80 overflow-y-auto border-r border-secondary py-1" aria-label="Filter categories">
                            {dims.map((d) => {
                                const on = d.id === current.id;
                                const n = draft[d.id]?.values.length ?? 0;
                                return (
                                    <li key={d.id}>
                                        <button
                                            type="button"
                                            onClick={() => setCat(d.id)}
                                            aria-current={on ? "true" : undefined}
                                            className={cx("flex w-full items-center justify-between px-4 py-2 text-left text-md", on ? "font-bold" : "text-secondary hover:bg-secondary")}
                                            style={on ? { color: TEAL_DARK, backgroundColor: `${TEAL}14` } : undefined}
                                        >
                                            <span>
                                                {d.label}
                                                {n > 0 && <span className="ml-1.5 text-tertiary">({n})</span>}
                                            </span>
                                            <ChevronRight className="size-4 text-fg-quaternary" aria-hidden="true" />
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                        <div className="flex min-w-0 flex-col">
                            <div className="flex items-center justify-between px-4 pt-3 pb-1">
                                <span className="text-md font-bold text-primary">{current.label}</span>
                                <button
                                    type="button"
                                    onClick={() => setDraft((cur) => ({ ...cur, [current.id]: { values: [], off: [] } }))}
                                    className="text-md font-semibold underline"
                                    style={{ color: PINK }}
                                >
                                    Clear Selections
                                </button>
                            </div>
                            <ul className="max-h-72 overflow-y-auto py-1" aria-label={`${current.label} values`}>
                                {current.values.map((v) => {
                                    const chosen = draft[current.id]?.values.includes(v) ?? false;
                                    return (
                                        <li key={v}>
                                            <button
                                                type="button"
                                                aria-pressed={chosen}
                                                onClick={() => pick(current.id, v)}
                                                className={cx("w-full px-4 py-2 text-left text-md", chosen ? "font-semibold" : "text-secondary hover:bg-secondary")}
                                                style={chosen ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f` } : undefined}
                                            >
                                                {v}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
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
