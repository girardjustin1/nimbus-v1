import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Check, ChevronDown, LayoutRight, Minus, Plus, SearchLg, Stars02, XClose } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Toggle } from "@/components/base/toggle/toggle";
import { cx } from "@/utils/cx";
import { DasShell, PINK, TEAL } from "../../das-shell";
import { type FilterState, PageTabs, StateAction, TABLE, TEAL_DARK, tableHead } from "../../nimbus-ui";
import { R1 } from "../../round-1";
import { AssistantPanel } from "./assistant";
import type { ReportChange } from "./assistant-questions";
import { bandExcluded, searchValues } from "./filter-state";
import {
    type ChartKind,
    DIMS,
    DIM_VALUES,
    type Dim,
    INTERVALS,
    type Interval,
    METRICS,
    type Metric,
    PI_TABS,
    type Range,
    formatMetric,
    metricOf,
    runQuery,
} from "./insights-data";
import { LONG_ADVERTISERS, TOP_ADVERTISERS } from "./long-lists";
import { type ChartSegment, QueryChart } from "./query-chart";
import { QueryMenu, Toast } from "./query-menu";
import { RangePicker } from "./range-picker";
import { spanOf } from "./report-facts";
import type { ScenarioQuery } from "./scenarios";

/**
 * Performance Insights · Round 2 · C16: the query beside the report (24 Nov).
 *
 * After Mixpanel's Insights builder (Mobbin flow “Comparing insight (time periods)”), in the
 * Nimbus design system: the query lives in a panel on the right, in three sections —
 * Metrics as lettered cards, Filter as one card per category (“Country is United States or
 * Canada”), Breakdown as one card per field — each added with its own “+”. The toolbar over
 * the chart holds the dates, quick ranges, Compare and the interval; a comparison shows as a
 * chip and draws the previous period faded. Under the chart: chart, both or table; the table
 * pivots metric × breakdown values against the dates, each cell with its change.
 *
 * Filters follow engineering's rules (custom lists, checkboxes, search and a cap), with
 * C8's search first for Advertiser. Breakdowns show their top 12 values.
 */

type View = "both" | "chart" | "table";
type Picker =
    { kind: "metric"; replace?: Metric } | { kind: "breakdown" } | { kind: "filter-field" } | { kind: "filter-values"; dim: Dim; draft: string[] } | null;

const LETTERS = "ABCDEFGHIJKLM";
/** How many rows the chart draws while segments are dynamic. */
const DYNAMIC_N = 6;
/** One colour per table row, shared by its checkbox and its line. */
const SEGMENT_COLORS = [TEAL, PINK, "#2E5AAC", "#B54708", "#7F56D9", "#0BA5EC", "#B42318", "#4CA30D", "#DD2590", "#6172F3", "#854A0E", "#667085"];
const TOP_N = 12;
const CHART_KINDS: { id: Exclude<ChartKind, "table" | "pie">; label: string }[] = [
    { id: "line", label: "Line" },
    { id: "area", label: "Area" },
    { id: "bar", label: "Bar" },
    { id: "stacked", label: "Stacked bar" },
];
const QUICK: { id: Range; label: string }[] = [
    { id: "yesterday", label: "Yesterday" },
    { id: "7", label: "7D" },
    { id: "14", label: "14D" },
    { id: "30", label: "30D" },
];

/** The categories a filter can use; Advertiser carries its full list, searched first (C8). */
const FILTER_DIMS = DIMS.map((d) =>
    d === "Advertiser" ? { id: d, label: d, values: LONG_ADVERTISERS, top: TOP_ADVERTISERS } : { id: d, label: d, values: DIM_VALUES[d] },
);
const dimOf = (d: Dim) => FILTER_DIMS.find((x) => x.id === d)!;

/* ----------------------------------------------------------------- Bits --- */

const PILL =
    "inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-md font-semibold text-secondary ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary";

const Segmented = <T extends string>({
    value,
    options,
    onChange,
    label,
}: {
    value: T;
    options: { id: T; label: string }[];
    onChange: (v: T) => void;
    label: string;
}) => (
    <div role="radiogroup" aria-label={label} className="inline-flex h-9 items-stretch overflow-hidden rounded-full ring-1 ring-secondary">
        {options.map((o, i) => {
            const on = o.id === value;
            return (
                <button
                    key={o.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => onChange(o.id)}
                    className={cx(
                        "px-3.5 text-md font-semibold transition duration-100 ease-linear",
                        i > 0 && "border-l border-secondary",
                        on ? "" : "text-secondary hover:bg-secondary",
                    )}
                    style={on ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f` } : undefined}
                >
                    {o.label}
                </button>
            );
        })}
    </div>
);

const PillSelect = <T extends string>({
    value,
    options,
    onChange,
    label,
}: {
    value: T;
    options: { id: T; label: string }[];
    onChange: (v: T) => void;
    label: string;
}) => (
    <label className={cx(PILL, "relative pr-8")}>
        <span className="sr-only">{label}</span>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value as T)}
            className="cursor-pointer appearance-none bg-transparent font-semibold text-secondary outline-none"
        >
            {options.map((o) => (
                <option key={o.id} value={o.id}>
                    {o.label}
                </option>
            ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2.5 size-4 text-fg-quaternary" aria-hidden="true" />
    </label>
);

const Change = ({ now, before, only }: { now: number; before: number | undefined; only?: boolean }) => {
    if (before === undefined || !before) return only ? <span className="text-tertiary">—</span> : null;
    const c = (now - before) / before;
    const up = c >= 0;
    return (
        <span
            className="inline-flex items-center rounded px-1.5 tabular-nums"
            style={{ ...R1.rtPlatformValue, color: up ? TEAL_DARK : "#B42318", backgroundColor: up ? `${TEAL}1f` : "#FEE4E2" }}
        >
            {up ? "+" : "−"}
            {Math.abs(c * 100).toFixed(1)}%
        </span>
    );
};

const SectionHead = ({ title, onAdd, addLabel }: { title: string; onAdd: () => void; addLabel: string }) => (
    <div className="flex items-center justify-between">
        <span style={R1.filterLabel}>{title}</span>
        <button type="button" aria-label={addLabel} title={addLabel} onClick={onAdd} className="rounded-md p-1 hover:bg-secondary" style={{ color: PINK }}>
            <Plus className="size-5" aria-hidden="true" />
        </button>
    </div>
);

const Card = ({
    children,
    onPress,
    onRemove,
    removeLabel,
    label,
}: {
    children: ReactNode;
    onPress?: () => void;
    onRemove: () => void;
    removeLabel: string;
    label: string;
}) => (
    <div className="group flex items-start gap-2 rounded-lg bg-primary px-3 py-2.5 ring-1 ring-secondary">
        <button type="button" onClick={onPress} aria-label={label} className="flex min-w-0 flex-1 flex-col items-start gap-0.5 text-left">
            {children}
        </button>
        <button
            type="button"
            aria-label={removeLabel}
            title="Remove"
            onClick={onRemove}
            className="rounded-md p-1 text-fg-quaternary hover:bg-secondary hover:text-fg-secondary"
        >
            <XClose className="size-4" aria-hidden="true" />
        </button>
    </div>
);

/* --------------------------------------------------------------- Picker --- */

const PickerPopover = ({
    picker,
    setPicker,
    metrics,
    breakdown,
    filters,
    onPickMetric,
    onPickBreakdown,
    onSaveFilter,
}: {
    picker: Exclude<Picker, null>;
    setPicker: (p: Picker) => void;
    metrics: Metric[];
    breakdown: Dim[];
    filters: FilterState;
    onPickMetric: (m: Metric) => void;
    onPickBreakdown: (d: Dim) => void;
    onSaveFilter: (d: Dim, values: string[]) => void;
}) => {
    const [query, setQuery] = useState("");
    const box = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const key = (e: KeyboardEvent) => e.key === "Escape" && setPicker(null);
        const down = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setPicker(null);
        window.addEventListener("keydown", key);
        window.addEventListener("mousedown", down);
        return () => {
            window.removeEventListener("keydown", key);
            window.removeEventListener("mousedown", down);
        };
    }, [setPicker]);

    const q = query.trim().toLowerCase();
    const search = (placeholder: string) => (
        <label className="relative flex items-center">
            <SearchLg className="pointer-events-none absolute left-3 size-5 text-fg-quaternary" aria-hidden="true" />
            <input
                autoFocus
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="h-10 w-full rounded-md bg-secondary pr-3 pl-10 text-md text-primary outline-focus-ring placeholder:text-placeholder focus-visible:outline-2"
            />
        </label>
    );
    const list = (items: string[], onPick: (v: string) => void, empty: string) => (
        <ul className="max-h-72 overflow-y-auto py-1" role="listbox">
            {items.length === 0 && <li className="px-3 py-2 text-md text-tertiary">{empty}</li>}
            {items.map((v) => (
                <li key={v}>
                    <button
                        type="button"
                        onClick={() => onPick(v)}
                        className="w-full rounded-md px-3 py-2 text-left text-md text-secondary hover:bg-secondary hover:text-primary"
                    >
                        {v}
                    </button>
                </li>
            ))}
        </ul>
    );

    let body: ReactNode;
    if (picker.kind === "metric") {
        const items = METRICS.filter((m) => (picker.replace ? m === picker.replace || !metrics.includes(m) : !metrics.includes(m))).filter((m) =>
            m.toLowerCase().includes(q),
        );
        body = (
            <>
                {search("Search metrics")}
                {list(items, (m) => onPickMetric(m as Metric), "No metric matches.")}
            </>
        );
    } else if (picker.kind === "breakdown" || picker.kind === "filter-field") {
        const taken = picker.kind === "breakdown" ? breakdown : (Object.keys(filters) as Dim[]);
        const items = DIMS.filter((d) => !taken.includes(d)).filter((d) => d.toLowerCase().includes(q));
        body = (
            <>
                {search(picker.kind === "breakdown" ? "Break down by…" : "Filter by…")}
                {list(
                    items,
                    (d) =>
                        picker.kind === "breakdown"
                            ? onPickBreakdown(d as Dim)
                            : setPicker({ kind: "filter-values", dim: d as Dim, draft: filters[d]?.values ?? [] }),
                    "No field matches.",
                )}
            </>
        );
    } else {
        const dim = dimOf(picker.dim);
        const found = searchValues(dim, query);
        const pick = (v: string) => setPicker({ ...picker, draft: picker.draft.includes(v) ? picker.draft.filter((x) => x !== v) : [...picker.draft, v] });
        const shown = dim.top ? [...picker.draft, ...found.values.filter((v) => !picker.draft.includes(v))] : found.values;
        body = (
            <>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        aria-label="Back to fields"
                        onClick={() => setPicker({ kind: "filter-field" })}
                        className="rounded-md p-1 hover:bg-secondary"
                    >
                        <ArrowLeft className="size-5 text-fg-secondary" aria-hidden="true" />
                    </button>
                    <span className="text-md font-bold text-primary">{dim.label}</span>
                    <span className="text-md text-tertiary">is any of</span>
                </div>
                {search(`Search ${dim.label}`)}
                <div
                    className="flex max-h-72 flex-col gap-2 overflow-y-auto px-1 py-2"
                    style={{ ["--background-color-brand-solid" as string]: TEAL, ["--border-color-brand-solid" as string]: TEAL }}
                >
                    {shown.map((v) => (
                        <Checkbox
                            key={v}
                            size="md"
                            label={<span style={R1.checkboxText}>{v}</span>}
                            isSelected={picker.draft.includes(v)}
                            onChange={() => pick(v)}
                        />
                    ))}
                    {shown.length === 0 && <span className="text-md text-tertiary">No {dim.label.toLowerCase()} matches.</span>}
                    {dim.top && !query && (
                        <span className="text-md text-tertiary">
                            Top {dim.top.length} of {dim.values.length.toLocaleString("en-US")}. Search to reach the rest.
                        </span>
                    )}
                    {found.more > 0 && <span className="text-md text-tertiary">First 50 of {(found.more + 50).toLocaleString("en-US")}. Keep typing.</span>}
                </div>
                <div className="flex items-center justify-end gap-2 border-t border-secondary pt-3">
                    <span className="mr-auto text-md font-semibold text-tertiary">{picker.draft.length} picked</span>
                    <StateAction quiet onPress={() => setPicker(null)}>
                        Cancel
                    </StateAction>
                    <StateAction disabled={picker.draft.length === 0} onPress={() => onSaveFilter(picker.dim, picker.draft)}>
                        Apply
                    </StateAction>
                </div>
            </>
        );
    }

    return (
        <div ref={box} className="absolute inset-x-4 z-20 mt-2 flex flex-col gap-2 rounded-xl bg-primary p-3 shadow-xl ring-1 ring-secondary">
            {body}
        </div>
    );
};

/**
 * Keeps a panel exactly as tall as the window below its top edge, so whatever sits at its
 * bottom (the Ask tab's message box) is always on screen: before the page scrolls, while it
 * scrolls, and once the panel sticks to the top.
 */
const useFitToWindow = (on: boolean) => {
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (!on) {
            el.style.height = "";
            return;
        }
        let frame = 0;
        const fit = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                el.style.height = `${Math.max(0, window.innerHeight - Math.max(0, el.getBoundingClientRect().top))}px`;
            });
        };
        fit();
        window.addEventListener("scroll", fit, { passive: true });
        window.addEventListener("resize", fit);
        // The page above can still settle (fonts, charts drawing), which moves the panel's top.
        const settle = new ResizeObserver(fit);
        settle.observe(document.body);
        return () => {
            cancelAnimationFrame(frame);
            settle.disconnect();
            window.removeEventListener("scroll", fit);
            window.removeEventListener("resize", fit);
            el.style.height = "";
        };
    }, [on]);
    return ref;
};

/* ---------------------------------------------------------------- Screen --- */

export const QueryWorkspace = ({
    metrics: initialMetrics = ["Revenue", "ECPM"],
    breakdown: initialBreakdown = ["Platform"],
    filters: initialFilters = { Country: { values: ["United States", "Canada"], off: [] } },
    compare: initialCompare = false,
    view: initialView = "both",
    open,
    tab: initialTab = "query",
    ask: firstAsk,
    manual: initialManual,
    datesOpen,
    scenario,
    panel: initialPanel = true,
    menuOpen,
}: {
    metrics?: Metric[];
    breakdown?: Dim[];
    filters?: FilterState;
    compare?: boolean;
    view?: View;
    /** A picker open when the screen loads (for the flow's states). */
    open?: Picker;
    tab?: "query" | "chart" | "ask";
    /** Typed into the Ask tab when the screen opens (for the prototype's states). */
    ask?: string;
    /** Rows ticked by hand when the screen opens (ids "Metric|value"). */
    manual?: string[];
    /** The date picker open when the screen loads. */
    datesOpen?: boolean;
    /** Round 2: the data scenario picked in the prototype's toolbar (null: the screen's own). */
    scenario?: ScenarioQuery | null;
    /** The Query / Chart / Ask panel shown (false: hidden, the report full width). */
    panel?: boolean;
    /** The ⋯ menu beside Save Query open when the screen loads. */
    menuOpen?: boolean;
}) => {
    // Round 2: a data scenario (prototype toolbar) replaces the screen's own query when one is picked.
    const sc = scenario ?? undefined;
    const [range, setRange] = useState<Range>(sc?.range ?? "7");
    const [interval, setInterval] = useState<Interval>(sc?.interval ?? "day");
    const [metrics, setMetrics] = useState<Metric[]>(sc?.metrics ?? initialMetrics);
    const [breakdown, setBreakdown] = useState<Dim[]>(sc?.breakdown.slice(0, 2) ?? initialBreakdown);
    const [filters, setFilters] = useState<FilterState>(sc?.filters ?? initialFilters);
    const [compare, setCompare] = useState(sc?.compare ?? initialCompare);
    const [compareMenu, setCompareMenu] = useState(false);
    const [changeOnly, setChangeOnly] = useState(false);
    const [view, setView] = useState<View>(sc?.chart === "table" ? "table" : initialView);
    const [chart, setChart] = useState<Exclude<ChartKind, "table" | "pie">>(sc?.chart && sc.chart !== "table" ? sc.chart : "line");
    const [legend, setLegend] = useState(true);
    const [tab, setTab] = useState(initialTab);
    const [panelOpen, setPanelOpen] = useState(initialPanel);
    const askPanel = useFitToWindow(panelOpen && tab === "ask");

    /** C16's chat: a built chart replaces the query, and every card, the chart and the table follow. */
    const applyChange = (c: ReportChange) => {
        if (c.metrics) setMetrics(c.metrics);
        if (c.breakdown) setBreakdown(c.breakdown.slice(0, 2));
        if (c.filters) setFilters(c.filters);
        if (c.range) setRange(c.range);
        if (c.compare !== undefined) setCompare(c.compare);
        if (c.chart === "table") setView("table");
        else if (c.chart && c.chart !== "pie") {
            setChart(c.chart);
            setView((v) => (v === "table" ? "both" : v));
        }
        setManual(null);
        setSearch("");
    };
    const [picker, setPicker] = useState<Picker>(open ?? null);
    const [search, setSearch] = useState("");
    // Rows charted: null follows the query (the top rows, dynamic); a list is the rows ticked by hand.
    const [manual, setManual] = useState<string[] | null>(sc ? null : (initialManual ?? null));
    const [segmentMenu, setSegmentMenu] = useState(false);

    /* -------- the ⋯ menu: name, undo, refresh, export -------- */

    const [name, setName] = useState("Untitled query");
    const [toast, setToast] = useState<{ text: string; undo?: boolean } | null>(null);
    const [dataAge, setDataAge] = useState(15);
    const [refreshing, setRefreshing] = useState(false);
    // Undo steps back through every change to the query (cards, dates, chart, rows, name).
    type Snap = {
        name: string;
        range: Range;
        interval: Interval;
        metrics: Metric[];
        breakdown: Dim[];
        filters: FilterState;
        compare: boolean;
        view: View;
        chart: typeof chart;
        manual: string[] | null;
    };
    const snap: Snap = { name, range, interval, metrics, breakdown, filters, compare, view, chart, manual };
    const snapKey = JSON.stringify(snap);
    const history = useRef<{ last: string | null; stack: string[]; restoring: boolean }>({ last: null, stack: [], restoring: false });
    const [undoCount, setUndoCount] = useState(0);
    useEffect(() => {
        const h = history.current;
        if (h.last !== null && h.last !== snapKey && !h.restoring) {
            h.stack.push(h.last);
            setUndoCount(h.stack.length);
        }
        h.restoring = false;
        h.last = snapKey;
    }, [snapKey]);
    const undo = () => {
        const h = history.current;
        const prev = h.stack.pop();
        if (!prev) return;
        h.restoring = true;
        setUndoCount(h.stack.length);
        const q = JSON.parse(prev) as Snap;
        setName(q.name);
        setRange(q.range);
        setInterval(q.interval);
        setMetrics(q.metrics);
        setBreakdown(q.breakdown);
        setFilters(q.filters);
        setCompare(q.compare);
        setView(q.view);
        setChart(q.chart);
        setManual(q.manual);
        setToast(null);
    };
    const undoRef = useRef(undo);
    useEffect(() => {
        undoRef.current = undo;
    });
    useEffect(() => {
        const key = (e: KeyboardEvent) => {
            const t = e.target as HTMLElement;
            if (t.closest("input, textarea, select, [contenteditable]")) return;
            if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === "z") {
                e.preventDefault();
                undoRef.current();
            }
        };
        window.addEventListener("keydown", key);
        return () => window.removeEventListener("keydown", key);
    }, []);
    const blank = (nextName: string) => {
        setName(nextName);
        setMetrics([]);
        setBreakdown([]);
        setFilters({});
        setRange("7");
        setInterval("day");
        setCompare(false);
        setView("both");
        setChart("line");
        setManual(null);
        setSearch("");
        setPicker(null);
    };
    const refresh = () => {
        setRefreshing(true);
        window.setTimeout(() => {
            setRefreshing(false);
            setDataAge(0);
        }, 900);
    };
    const [pickerAt, setPickerAt] = useState<"metrics" | "filter" | "breakdown">(
        open?.kind === "metric" ? "metrics" : open?.kind === "breakdown" ? "breakdown" : "filter",
    );

    const span = spanOf(range);
    const excluded = useMemo(() => bandExcluded(FILTER_DIMS, filters) as Partial<Record<Dim, string[]>>, [filters]);
    const rows = useMemo(
        () => runQuery({ range, interval, breakdown, excluded, compare: compare ? span : undefined }),
        [range, interval, breakdown, excluded, compare, span],
    );
    const totals = useMemo(
        () => runQuery({ range, interval, breakdown, excluded, totalsOnly: true, compare: compare ? span : undefined }),
        [range, interval, breakdown, excluded, compare, span],
    );

    const openPicker = (p: Picker, at: typeof pickerAt) => {
        setPickerAt(at);
        setPicker(p);
    };

    /* -------- the table: metric × top values, against the dates -------- */

    const periods = [...new Set(rows.map((r) => r.period))].reverse();
    const byKey = new Map(rows.map((r) => [`${r.period}|${r.combo.key}`, r]));
    const first = metrics[0];
    const ranked = [...totals].sort((a, b) => (first ? metricOf(first, b.t) - metricOf(first, a.t) : 0)).slice(0, TOP_N);
    // With two breakdowns, rows group under the first one's values (largest group first), as blocks.
    const groupTotal = (v: string) => ranked.filter((r) => r.combo.values[0] === v).reduce((n, r) => n + (first ? metricOf(first, r.t) : 0), 0);
    const combos =
        breakdown.length > 1
            ? [...ranked].sort(
                  (a, b) =>
                      groupTotal(b.combo.values[0]) - groupTotal(a.combo.values[0]) ||
                      a.combo.values[0].localeCompare(b.combo.values[0]) ||
                      (first ? metricOf(first, b.t) - metricOf(first, a.t) : 0),
              )
            : ranked;
    const shown = combos.filter((r) => !search || r.combo.values.join(" ").toLowerCase().includes(search.toLowerCase()));

    /* -------- segments: every table row is a line the chart can draw -------- */

    const segments = metrics.flatMap((m, mi) =>
        combos.map((c) => ({
            id: `${m}|${c.combo.key}`,
            metric: m,
            mi,
            comboKey: c.combo.key,
            group: c.combo.values[0],
            label: breakdown.length ? `${LETTERS[mi]} · ${c.combo.values.join(" · ")}` : `${LETTERS[mi]}. ${m}`,
        })),
    );
    const colorOf = new Map(segments.map((g, i) => [g.id, SEGMENT_COLORS[i % SEGMENT_COLORS.length]]));
    const dynamicIds = segments.slice(0, DYNAMIC_N).map((g) => g.id);
    const picked = manual ? manual.filter((id) => colorOf.has(id)) : dynamicIds;
    const isOn = (id: string) => picked.includes(id);
    const toggleSegment = (id: string) => setManual(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);
    /** A group block shows only its rows; pressing it again brings every row back. */
    const isolate = (ids: string[]) => setManual(picked.length === ids.length && ids.every(isOn) ? segments.map((g) => g.id) : ids);
    const isolated = (ids: string[]) => picked.length === ids.length && ids.every(isOn);
    const allOn = segments.length > 0 && segments.every((g) => isOn(g.id));
    const someOn = picked.length > 0 && !allOn;
    const chartSegments: ChartSegment[] = segments
        .filter((g) => isOn(g.id))
        .map((g) => ({ label: g.label, metric: g.metric, comboKey: g.comboKey, color: colorOf.get(g.id)! }));

    /** Export: the table as it stands (every row, not just the ones searched), as a CSV file. */
    const downloadCsv = () => {
        const cell = (v: string | number) => (typeof v === "number" ? String(Math.round(v * 10_000) / 10_000) : /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
        const lines = [["Metric", ...breakdown, "Total", ...periods]];
        for (const m of metrics)
            for (const c of combos)
                lines.push([m, ...c.combo.values, metricOf(m, c.t), ...periods.map((d) => (byKey.get(`${d}|${c.combo.key}`) ? metricOf(m, byKey.get(`${d}|${c.combo.key}`)!.t) : ""))].map(cell) as string[]);
        const url = URL.createObjectURL(new Blob([lines.map((l) => l.join(",")).join("\n")], { type: "text/csv" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = `${name.replace(/[^\w-]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "query"}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        setToast({ text: `Downloaded ${a.download}` });
    };

    const filterSummary = (d: Dim) => {
        const v = filters[d]?.values ?? [];
        return v.length <= 2 ? v.join(" or ") : `${v.slice(0, 2).join(", ")} or ${v.length - 2} more`;
    };

    return (
        <DasShell navKey="performance insights" account="publisher">
            <PageTabs
                tabs={PI_TABS}
                active="query"
                trailing={
                    <>
                        <span className="text-md font-semibold text-tertiary">All reports are in UTC.</span>
                        <QueryMenu
                            name={name}
                            canUndo={undoCount > 0}
                            dataAge={dataAge}
                            refreshing={refreshing}
                            onRename={(n) => {
                                setName(n);
                                setToast({ text: `Renamed to “${n}”`, undo: true });
                            }}
                            onDuplicate={() => {
                                setName(`${name} (copy)`);
                                setToast({ text: "Duplicated. You're editing the copy.", undo: true });
                            }}
                            onUndo={undo}
                            onNew={() => {
                                blank("Untitled query");
                                setToast({ text: "New query", undo: true });
                            }}
                            onDelete={() => {
                                setToast({ text: `Deleted “${name}”`, undo: true });
                                blank("Untitled query");
                            }}
                            onDownloadCsv={downloadCsv}
                            onCopyLink={() => {
                                void navigator.clipboard?.writeText(window.location.href).catch(() => {});
                                setToast({ text: "Link copied" });
                            }}
                            onRefresh={refresh}
                            defaultOpen={menuOpen}
                        />
                        <StateAction disabled={metrics.length === 0} onPress={() => {}}>
                            Save Query
                        </StateAction>
                        {/* Hides or shows the Query / Chart / Ask panel; the report takes the room. */}
                        <button
                            type="button"
                            aria-label={panelOpen ? "Hide panel" : "Show panel"}
                            title={panelOpen ? "Hide panel" : "Show panel"}
                            aria-pressed={panelOpen}
                            aria-controls="query-panel"
                            onClick={() => setPanelOpen((o) => !o)}
                            className="inline-flex size-9 items-center justify-center rounded-lg ring-1 ring-secondary transition duration-100 ease-linear hover:bg-secondary"
                            style={panelOpen ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f`, boxShadow: `inset 0 0 0 1px ${TEAL}66` } : undefined}
                        >
                            <LayoutRight className={cx("size-5", !panelOpen && "text-fg-quaternary")} aria-hidden="true" />
                        </button>
                    </>
                }
            />
            <div className={cx("grid items-start", panelOpen ? "grid-cols-[minmax(0,1fr)_360px]" : "grid-cols-1")}>
                {/* ---------------- report ---------------- */}
                <div className="flex min-w-0 flex-col gap-4 px-8 py-5">
                    <h2 className="text-lg font-bold text-primary" aria-live="polite">
                        {name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                        <RangePicker value={range} onChange={setRange} defaultOpen={datesOpen} />
                        <Segmented label="Date range" value={range} options={QUICK} onChange={setRange} />
                        <span className="ml-auto flex items-center gap-2">
                            <PillSelect label="Interval" value={interval} options={INTERVALS} onChange={setInterval} />
                            <PillSelect label="Chart type" value={chart} options={CHART_KINDS} onChange={setChart} />
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="relative">
                            <button type="button" className={PILL} aria-expanded={compareMenu} onClick={() => setCompareMenu((v) => !v)}>
                                Compare <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />
                            </button>
                            {compareMenu && (
                                <div
                                    className="absolute top-11 left-0 z-20 flex w-64 flex-col rounded-xl bg-primary p-1.5 shadow-xl ring-1 ring-secondary"
                                    role="menu"
                                >
                                    {[
                                        { on: true, label: span === 1 ? "The day before" : `The previous ${span} days` },
                                        { on: false, label: "No comparison" },
                                    ].map((o) => (
                                        <button
                                            key={o.label}
                                            type="button"
                                            role="menuitemradio"
                                            aria-checked={compare === o.on}
                                            onClick={() => {
                                                setCompare(o.on);
                                                setCompareMenu(false);
                                            }}
                                            className="rounded-md px-3 py-2 text-left text-md text-secondary hover:bg-secondary"
                                            style={compare === o.on ? { color: TEAL_DARK, fontWeight: 700 } : undefined}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {compare && (
                            <>
                                <span
                                    className="inline-flex h-9 items-center gap-1 rounded-full pr-1 pl-3.5 text-md font-semibold"
                                    style={{ color: TEAL_DARK, backgroundColor: `${TEAL}1f` }}
                                >
                                    Compared with {span === 1 ? "the day before" : `the previous ${span} days`}
                                    <button
                                        type="button"
                                        aria-label="Stop comparing"
                                        onClick={() => setCompare(false)}
                                        className="rounded-full p-1 hover:bg-white/60"
                                    >
                                        <XClose className="size-4" aria-hidden="true" />
                                    </button>
                                </span>
                                <Segmented
                                    label="Table shows"
                                    value={changeOnly ? "pct" : "value"}
                                    options={[
                                        { id: "value", label: "Values" },
                                        { id: "pct", label: "% change" },
                                    ]}
                                    onChange={(v) => setChangeOnly(v === "pct")}
                                />
                            </>
                        )}
                    </div>

                    {metrics.length === 0 ? (
                        <p className="rounded-xl border border-dashed border-secondary px-6 py-10 text-center text-md text-tertiary">
                            Add a metric in the query panel.
                        </p>
                    ) : (
                        <>
                            {view !== "table" &&
                                (chartSegments.length === 0 ? (
                                    <p className="rounded-xl border border-dashed border-secondary px-6 py-16 text-center text-md text-tertiary">
                                        {totals.length === 0 ? "No data for these dates and filters." : "No rows ticked. Tick a row in the table to chart it."}
                                    </p>
                                ) : (
                                    <QueryChart
                                        rows={rows}
                                        metrics={metrics}
                                        hasBreakdown={breakdown.length > 0}
                                        chart={chart}
                                        interval={interval}
                                        showLegend={legend}
                                        comparePrev={compare}
                                        segments={chartSegments}
                                        height={view === "chart" ? "h-[34rem]" : "h-[20rem]"}
                                    />
                                ))}

                            <div className="flex items-center justify-center border-t border-secondary pt-3">
                                <Segmented
                                    label="Show"
                                    value={view}
                                    options={[
                                        { id: "chart", label: "Chart" },
                                        { id: "both", label: "Chart and table" },
                                        { id: "table", label: "Table" },
                                    ]}
                                    onChange={setView}
                                />
                            </div>

                            {view !== "chart" && (
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        {breakdown.length > 0 && (
                                            <label className="relative flex w-72 items-center">
                                                <SearchLg className="pointer-events-none absolute left-3 size-5 text-fg-quaternary" aria-hidden="true" />
                                                <input
                                                    type="search"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    placeholder={`Search ${breakdown.join(", ")}`}
                                                    aria-label="Search the table"
                                                    className="h-10 w-full rounded-md bg-secondary pr-3 pl-10 text-md text-primary outline-focus-ring placeholder:text-placeholder focus-visible:outline-2"
                                                />
                                            </label>
                                        )}
                                        <div className="relative">
                                            <button type="button" className={PILL} aria-expanded={segmentMenu} onClick={() => setSegmentMenu((v) => !v)}>
                                                {manual ? "Manual segments" : "Dynamic segments"}
                                                <ChevronDown className="size-4 text-fg-quaternary" aria-hidden="true" />
                                            </button>
                                            {segmentMenu && (
                                                <div
                                                    className="absolute top-11 left-0 z-20 flex w-80 flex-col rounded-xl bg-primary p-1.5 shadow-xl ring-1 ring-secondary"
                                                    role="menu"
                                                >
                                                    {[
                                                        {
                                                            on: !manual,
                                                            title: "Dynamic segments",
                                                            body: `The top ${DYNAMIC_N} rows are charted, and follow the query.`,
                                                            pick: () => setManual(null),
                                                        },
                                                        {
                                                            on: Boolean(manual),
                                                            title: "Manual segments",
                                                            body: "The rows you tick are charted. Ticking a row switches to this.",
                                                            pick: () => setManual(picked),
                                                        },
                                                    ].map((o) => (
                                                        <button
                                                            key={o.title}
                                                            type="button"
                                                            role="menuitemradio"
                                                            aria-checked={o.on}
                                                            onClick={() => {
                                                                o.pick();
                                                                setSegmentMenu(false);
                                                            }}
                                                            className="flex flex-col gap-0.5 rounded-md px-3 py-2 text-left hover:bg-secondary"
                                                        >
                                                            <span className="text-md font-bold" style={{ color: o.on ? TEAL_DARK : undefined }}>
                                                                {o.title}
                                                            </span>
                                                            <span className="text-md text-tertiary">{o.body}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <span className="text-md font-semibold text-tertiary">
                                            {picked.length} of {segments.length} rows charted
                                        </span>
                                    </div>
                                    <div className="overflow-x-auto rounded-lg ring-1 ring-secondary">
                                        <table className={TABLE.table}>
                                            <thead style={tableHead("report")}>
                                                <tr>
                                                    {["Metric", ...breakdown].map((h, hi, all) => (
                                                        <th key={h} className={TABLE.report.th}>
                                                            <span className="inline-flex items-center gap-2.5">
                                                                {hi === all.length - 1 && (
                                                                    <SegmentBox
                                                                        label={allOn ? "Chart no rows" : "Chart every row"}
                                                                        color={TEAL}
                                                                        checked={allOn}
                                                                        mixed={someOn}
                                                                        onPress={() => setManual(allOn ? [] : segments.map((g) => g.id))}
                                                                    />
                                                                )}
                                                                {h}
                                                                {hi > 0 && <span className="font-semibold text-white/60">top {TOP_N}</span>}
                                                            </span>
                                                        </th>
                                                    ))}
                                                    <th className={TABLE.report.th}>Whole range</th>
                                                    {periods.map((p) => (
                                                        <th key={p} className={cx(TABLE.report.th, "whitespace-nowrap")}>
                                                            {p}
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {shown.length === 0 && (
                                                    <tr>
                                                        <td
                                                            colSpan={2 + breakdown.length + periods.length}
                                                            className="px-8 py-10 text-center text-md text-tertiary"
                                                        >
                                                            {totals.length === 0 ? "No data for these dates and filters." : "No rows match the search."}
                                                        </td>
                                                    </tr>
                                                )}
                                                {metrics.flatMap((m, mi) => {
                                                    const mine = segments.filter((g) => g.mi === mi);
                                                    return shown.map((c, ci) => {
                                                        const id = `${m}|${c.combo.key}`;
                                                        const group = c.combo.values[0];
                                                        const groupStart = breakdown.length > 1 && (ci === 0 || shown[ci - 1].combo.values[0] !== group);
                                                        const groupRows = shown.filter((x) => x.combo.values[0] === group).length;
                                                        const groupIds = mine.filter((g) => g.group === group).map((g) => g.id);
                                                        const checkbox = (
                                                            <SegmentBox
                                                                label={`Chart ${segments.find((g) => g.id === id)?.label}`}
                                                                color={colorOf.get(id)!}
                                                                checked={isOn(id)}
                                                                onPress={() => toggleSegment(id)}
                                                            />
                                                        );
                                                        return (
                                                            <tr key={id} className="border-t border-secondary">
                                                                {ci === 0 &&
                                                                    (breakdown.length === 0 ? (
                                                                        <td className={cx(TABLE.report.td, "font-bold whitespace-nowrap")}>
                                                                            <span className="inline-flex items-center gap-2.5">
                                                                                {checkbox}
                                                                                <LetterBadge i={mi} />
                                                                                {m}
                                                                            </span>
                                                                        </td>
                                                                    ) : (
                                                                        <td rowSpan={shown.length} className="h-px border-r border-secondary p-1.5 align-top">
                                                                            <GroupBlock
                                                                                label={`Show only ${m}`}
                                                                                active={isolated(mine.map((g) => g.id))}
                                                                                onPress={() => isolate(mine.map((g) => g.id))}
                                                                            >
                                                                                <LetterBadge i={mi} />
                                                                                {m}
                                                                            </GroupBlock>
                                                                        </td>
                                                                    ))}
                                                                {groupStart && (
                                                                    <td rowSpan={groupRows} className="h-px border-r border-secondary p-1.5 align-top">
                                                                        <GroupBlock
                                                                            label={`Show only ${m}, ${group}`}
                                                                            active={isolated(groupIds)}
                                                                            onPress={() => isolate(groupIds)}
                                                                        >
                                                                            {group}
                                                                        </GroupBlock>
                                                                    </td>
                                                                )}
                                                                {breakdown.length > 0 && (
                                                                    <td className={cx(TABLE.report.td, "whitespace-nowrap")}>
                                                                        <span className="inline-flex items-center gap-2.5">
                                                                            {checkbox}
                                                                            {c.combo.values[c.combo.values.length - 1]}
                                                                        </span>
                                                                    </td>
                                                                )}
                                                                <td className={cx(TABLE.report.td, "font-bold whitespace-nowrap tabular-nums")}>
                                                                    <Cell
                                                                        m={m}
                                                                        now={metricOf(m, c.t)}
                                                                        before={c.prev ? metricOf(m, c.prev) : undefined}
                                                                        compare={compare}
                                                                        changeOnly={changeOnly}
                                                                    />
                                                                </td>
                                                                {periods.map((p) => {
                                                                    const r = byKey.get(`${p}|${c.combo.key}`);
                                                                    return (
                                                                        <td key={p} className={cx(TABLE.report.td, "whitespace-nowrap tabular-nums")}>
                                                                            {r ? (
                                                                                <Cell
                                                                                    m={m}
                                                                                    now={metricOf(m, r.t)}
                                                                                    before={r.prev ? metricOf(m, r.prev) : undefined}
                                                                                    compare={compare}
                                                                                    changeOnly={changeOnly}
                                                                                />
                                                                            ) : (
                                                                                "—"
                                                                            )}
                                                                        </td>
                                                                    );
                                                                })}
                                                            </tr>
                                                        );
                                                    });
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* ---------------- query panel ---------------- */}
                <aside
                    ref={askPanel}
                    id="query-panel"
                    aria-label="Query"
                    hidden={!panelOpen}
                    className={cx(
                        "sticky top-0 flex-col border-l border-secondary",
                        panelOpen ? "flex" : "hidden",
                        tab === "ask" ? "bg-primary" : "max-h-screen min-h-[40rem] self-stretch bg-secondary/40",
                    )}
                >
                    <div className="flex border-b border-secondary px-4" role="tablist">
                        {(["query", "chart", "ask"] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                role="tab"
                                aria-selected={tab === t}
                                onClick={() => setTab(t)}
                                className={cx(
                                    "-mb-px border-b-2 px-3 py-3 text-md font-bold capitalize",
                                    tab === t ? "" : "border-transparent text-tertiary hover:text-secondary",
                                )}
                                style={tab === t ? { color: TEAL_DARK, borderColor: TEAL } : undefined}
                            >
                                {t === "ask" ? (
                                    <span className="inline-flex items-center gap-1.5">
                                        <Stars02 className="size-4" style={{ color: tab === t ? TEAL_DARK : PINK }} aria-hidden="true" />
                                        Ask
                                    </span>
                                ) : (
                                    t
                                )}
                            </button>
                        ))}
                    </div>

                    {tab === "ask" && <AssistantPanel builder embedded range={range} excluded={excluded} onApply={applyChange} firstAsk={firstAsk} />}

                    <div className={cx("min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4", tab === "ask" ? "hidden" : "flex")}>
                        {tab === "chart" ? (
                            <div className="flex flex-col gap-4">
                                <span style={R1.filterLabel}>Chart type</span>
                                <div className="flex flex-col gap-1">
                                    {CHART_KINDS.map((k) => (
                                        <button
                                            key={k.id}
                                            type="button"
                                            onClick={() => setChart(k.id)}
                                            aria-pressed={chart === k.id}
                                            className="rounded-md px-3 py-2 text-left text-md text-secondary hover:bg-secondary"
                                            style={chart === k.id ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f`, fontWeight: 700 } : undefined}
                                        >
                                            {k.label}
                                        </button>
                                    ))}
                                </div>
                                <span className="flex items-center justify-between">
                                    <span className="text-md font-semibold text-secondary">Show legend</span>
                                    <Toggle size="md" aria-label="Show legend" isSelected={legend} onChange={setLegend} />
                                </span>
                            </div>
                        ) : (
                            <>
                                <section className="relative flex flex-col gap-2">
                                    <SectionHead title="Metrics" addLabel="Add metric" onAdd={() => openPicker({ kind: "metric" }, "metrics")} />
                                    {metrics.map((m, i) => (
                                        <Card
                                            key={m}
                                            label={`Change metric ${LETTERS[i]}: ${m}`}
                                            onPress={() => openPicker({ kind: "metric", replace: m }, "metrics")}
                                            onRemove={() => setMetrics((cur) => cur.filter((x) => x !== m))}
                                            removeLabel={`Remove ${m}`}
                                        >
                                            <span className="inline-flex items-center gap-2 text-md font-bold text-primary">
                                                <LetterBadge i={i} />
                                                {m}
                                            </span>
                                        </Card>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => openPicker({ kind: "metric" }, "metrics")}
                                        className="ring-dashed inline-flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-md font-semibold text-tertiary ring-1 ring-secondary hover:bg-primary"
                                        style={{ outline: "1px dashed #D0D5DD", outlineOffset: -1 }}
                                    >
                                        <span className="inline-flex size-6 items-center justify-center rounded-md bg-secondary font-bold">
                                            {LETTERS[metrics.length]}
                                        </span>
                                        Add metric
                                    </button>
                                    {picker && pickerAt === "metrics" && (
                                        <PickerHost
                                            picker={picker}
                                            setPicker={setPicker}
                                            metrics={metrics}
                                            breakdown={breakdown}
                                            filters={filters}
                                            setMetrics={setMetrics}
                                            setBreakdown={setBreakdown}
                                            setFilters={setFilters}
                                        />
                                    )}
                                </section>

                                <section className="relative flex flex-col gap-2">
                                    <SectionHead title="Filter" addLabel="Add filter" onAdd={() => openPicker({ kind: "filter-field" }, "filter")} />
                                    {(Object.keys(filters) as Dim[]).map((d) => (
                                        <Card
                                            key={d}
                                            label={`Edit ${d} filter`}
                                            onPress={() => openPicker({ kind: "filter-values", dim: d, draft: filters[d].values }, "filter")}
                                            onRemove={() => setFilters((cur) => Object.fromEntries(Object.entries(cur).filter(([k]) => k !== d)))}
                                            removeLabel={`Remove ${d} filter`}
                                        >
                                            <span className="text-md font-bold text-primary">{d}</span>
                                            <span className="text-md text-tertiary">
                                                is <span className="font-semibold text-secondary">{filterSummary(d)}</span>
                                            </span>
                                        </Card>
                                    ))}
                                    {Object.keys(filters).length === 0 && (
                                        <span className="text-md text-tertiary">No filters. Every value is in the report.</span>
                                    )}
                                    {picker && pickerAt === "filter" && (
                                        <PickerHost
                                            picker={picker}
                                            setPicker={setPicker}
                                            metrics={metrics}
                                            breakdown={breakdown}
                                            filters={filters}
                                            setMetrics={setMetrics}
                                            setBreakdown={setBreakdown}
                                            setFilters={setFilters}
                                        />
                                    )}
                                </section>

                                <section className="relative flex flex-col gap-2">
                                    <SectionHead title="Breakdown" addLabel="Add breakdown" onAdd={() => openPicker({ kind: "breakdown" }, "breakdown")} />
                                    {breakdown.map((d) => (
                                        <Card
                                            key={d}
                                            label={d}
                                            onRemove={() => setBreakdown((cur) => cur.filter((x) => x !== d))}
                                            removeLabel={`Remove ${d} breakdown`}
                                        >
                                            <span className="text-md font-bold text-primary">{d}</span>
                                            <span className="text-md text-tertiary">Top {TOP_N} values</span>
                                        </Card>
                                    ))}
                                    {breakdown.length === 0 && <span className="text-md text-tertiary">No breakdown. The report shows totals.</span>}
                                    {picker && pickerAt === "breakdown" && (
                                        <PickerHost
                                            picker={picker}
                                            setPicker={setPicker}
                                            metrics={metrics}
                                            breakdown={breakdown}
                                            filters={filters}
                                            setMetrics={setMetrics}
                                            setBreakdown={setBreakdown}
                                            setFilters={setFilters}
                                        />
                                    )}
                                </section>
                            </>
                        )}
                    </div>
                </aside>
            </div>
            {toast && (
                <Toast
                    text={toast.text}
                    onUndo={toast.undo ? undo : undefined}
                    onClose={() => setToast(null)}
                />
            )}
        </DasShell>
    );
};

const LetterBadge = ({ i }: { i: number }) => (
    <span
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-md font-bold text-white"
        style={{ backgroundColor: i === 0 ? TEAL_DARK : i === 1 ? PINK : "#475467", fontSize: 15 }}
    >
        {LETTERS[i]}
    </span>
);

const Cell = ({ m, now, before, compare, changeOnly }: { m: Metric; now: number; before: number | undefined; compare: boolean; changeOnly: boolean }) =>
    compare && changeOnly ? (
        <Change now={now} before={before} only />
    ) : (
        <span className="inline-flex items-center gap-2">
            {formatMetric(m, now)}
            {compare && <Change now={now} before={before} />}
        </span>
    );

/** The picker, wired to the query's state. */
const PickerHost = ({
    picker,
    setPicker,
    metrics,
    breakdown,
    filters,
    setMetrics,
    setBreakdown,
    setFilters,
}: {
    picker: Exclude<Picker, null>;
    setPicker: (p: Picker) => void;
    metrics: Metric[];
    breakdown: Dim[];
    filters: FilterState;
    setMetrics: (f: (cur: Metric[]) => Metric[]) => void;
    setBreakdown: (f: (cur: Dim[]) => Dim[]) => void;
    setFilters: (f: (cur: FilterState) => FilterState) => void;
}) => (
    // Keyed by kind: moving from fields to values starts a fresh search.
    <PickerPopover
        key={picker.kind}
        picker={picker}
        setPicker={setPicker}
        metrics={metrics}
        breakdown={breakdown}
        filters={filters}
        onPickMetric={(m) => {
            const replace = picker.kind === "metric" ? picker.replace : undefined;
            setMetrics((cur) => (replace ? cur.map((x) => (x === replace ? m : x)) : [...cur, m]));
            setPicker(null);
        }}
        onPickBreakdown={(d) => {
            setBreakdown((cur) => [...cur, d].slice(-2));
            setPicker(null);
        }}
        onSaveFilter={(d, values) => {
            setFilters((cur) => ({ ...cur, [d]: { values, off: [] } }));
            setPicker(null);
        }}
    />
);

/**
 * A row's checkbox in the row's own colour (its line on the chart): filled when the row is
 * charted, an outline when not. `mixed` shows a dash, for the header when some rows are on.
 */
const SegmentBox = ({ label, color, checked, mixed, onPress }: { label: string; color: string; checked: boolean; mixed?: boolean; onPress: () => void }) => (
    <button
        type="button"
        role="checkbox"
        aria-checked={mixed ? "mixed" : checked}
        aria-label={label}
        title={label}
        onClick={onPress}
        className="inline-flex size-5 shrink-0 items-center justify-center rounded transition duration-100 ease-linear"
        style={checked || mixed ? { backgroundColor: color, color: "#FFFFFF" } : { backgroundColor: "#FFFFFF", boxShadow: `inset 0 0 0 2px ${color}` }}
    >
        {checked ? <Check className="size-3.5" aria-hidden="true" /> : mixed ? <Minus className="size-3.5" aria-hidden="true" /> : null}
    </button>
);

/** A grey block that groups rows (a metric, or a first-breakdown value); pressing it charts only its rows. */
const GroupBlock = ({ children, label, active, onPress }: { children: ReactNode; label: string; active: boolean; onPress: () => void }) => (
    <button
        type="button"
        aria-pressed={active}
        title={active ? "Show every row" : label}
        aria-label={label}
        onClick={onPress}
        className="flex h-full min-h-11 w-full items-start gap-2 rounded-md px-3 py-2.5 text-left text-md font-bold whitespace-nowrap text-primary transition duration-100 ease-linear hover:bg-[#EAECF0]"
        style={active ? { backgroundColor: `${TEAL}1f`, boxShadow: `inset 0 0 0 2px ${TEAL}`, color: TEAL_DARK } : { backgroundColor: "#F2F4F7" }}
    >
        {children}
    </button>
);
