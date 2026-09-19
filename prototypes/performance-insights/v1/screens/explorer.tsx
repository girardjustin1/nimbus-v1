import { type DragEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import {
    AlertTriangle,
    ChevronDown,
    ChevronLeftDouble,
    ChevronRight,
    ChevronRightDouble,
    Clock,
    DotsGrid,
    Download01,
    FilterLines,
    RefreshCcw01,
    SearchLg,
    Share07,
    SwitchVertical01,
    XClose,
} from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "./das-shell";
import {
    type Dimension,
    type Field,
    type Layout,
    type Metric,
    type PivotNode,
    buildPivot,
    dimensionValues,
    dimensions,
    formatMetric,
    isMetric,
    layoutFromParams,
    layoutToParams,
    metricValue,
    metrics,
    timeDimensions,
} from "./explorer-data";
import { PiShell } from "./pi-shared";
import { readHashParams, writeHashParams } from "./route";

/**
 * Concept C · Explorer — a working pivot builder.
 *
 * Drag fields from the rail (right, collapsible) into Rows, Columns, Values or Filters,
 * or click a field to drop it in its usual zone. Pills can be dragged between zones and
 * reordered. The table re-aggregates on every change, and the layout is written to the
 * link (…/#/explorer?rows=…&cols=…&vals=…) so any view can be shared.
 */

type Zone = "rows" | "columns" | "values" | "filters";

const zoneMeta: Record<Zone, { label: string; hint: string }> = {
    rows: { label: "Rows", hint: "Drop dimensions to group rows. Order sets the nesting." },
    columns: { label: "Columns", hint: "Drop a dimension (often time) to spread across columns." },
    values: { label: "Values", hint: "Drop metrics to show in each cell." },
    filters: { label: "Filters", hint: "Drop a dimension to limit which data is included." },
};

const accepts = (zone: Zone, field: Field) => (zone === "values" ? isMetric(field) : !isMetric(field));

const defaultLayout: Layout = { rows: ["App", "Demand Source"], columns: ["Week"], values: ["Revenue"], filters: {} };

const fieldGroups: { group: string; items: Field[] }[] = [
    { group: "Metrics", items: [...metrics] },
    { group: "Dimensions", items: dimensions.filter((d) => !timeDimensions.includes(d)) },
    { group: "Time", items: timeDimensions },
];

const MAX_VALUE_COLUMNS = 30;

/* --------------------------------------------------------------- Layout ops --- */

const without = (l: Layout, field: Field, from?: Zone): Layout => {
    const next: Layout = { rows: l.rows.filter((f) => f !== field), columns: l.columns.filter((f) => f !== field), values: l.values.filter((f) => f !== field), filters: { ...l.filters } };
    if (from === "filters") delete next.filters[field as Dimension];
    return next;
};

const place = (l: Layout, field: Field, zone: Zone, index: number, from?: Zone): Layout => {
    if (!accepts(zone, field)) return l;
    if (zone === "filters") {
        const base = from && from !== "filters" ? without(l, field, from) : l;
        return { ...base, filters: { ...base.filters, [field]: base.filters[field as Dimension] ?? [...dimensionValues[field as Dimension]] } };
    }
    // Reordering within the same zone: account for the pill's own slot.
    const current = zone === "values" ? l.values : zone === "rows" ? l.rows : l.columns;
    const oldIndex = (current as Field[]).indexOf(field);
    const at = oldIndex !== -1 && oldIndex < index ? index - 1 : index;
    const next = without(l, field, from === "filters" ? "filters" : undefined);
    const insert = <T extends Field>(xs: T[]) => [...xs.slice(0, at), field as T, ...xs.slice(at)];
    if (zone === "values") return { ...next, values: insert(next.values) };
    if (zone === "rows") return { ...next, rows: insert(next.rows) };
    return { ...next, columns: insert(next.columns) };
};

const zoneOf = (l: Layout, field: Field): Zone | undefined =>
    l.rows.includes(field as Dimension) ? "rows" : l.columns.includes(field as Dimension) ? "columns" : l.values.includes(field as Metric) ? "values" : undefined;

const defaultZone = (field: Field): Zone => (isMetric(field) ? "values" : timeDimensions.includes(field as Dimension) ? "columns" : "rows");

/* ------------------------------------------------------------------ Pieces --- */

const pillStyle = (field: Field) => (isMetric(field) ? { color: "#A94579", backgroundColor: `${PINK}24` } : { color: "#1F7F80", backgroundColor: `${TEAL}24` });

const Pill = ({
    field,
    children,
    onRemove,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    dragging,
    caret,
}: {
    field: Field;
    children?: ReactNode;
    onRemove: () => void;
    onDragStart: (e: DragEvent) => void;
    onDragEnd: () => void;
    onDragOver: (e: DragEvent) => void;
    onDrop: (e: DragEvent) => void;
    dragging: boolean;
    caret: boolean;
}) => (
    <span className="relative inline-flex">
        {caret && <span className="absolute -left-1.5 top-0 bottom-0 w-0.5 rounded-full" style={{ backgroundColor: PINK }} aria-hidden="true" />}
        <span
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className={cx("inline-flex cursor-grab items-center gap-1 rounded-lg py-1 pr-1 pl-1.5 text-sm font-medium select-none active:cursor-grabbing", dragging && "opacity-40")}
            style={pillStyle(field)}
        >
            <DotsGrid className="size-3.5 opacity-60" aria-hidden="true" />
            {children ?? field}
            <button type="button" aria-label={`Remove ${field}`} onClick={onRemove} className="rounded p-0.5 transition-colors hover:bg-black/10">
                <XClose className="size-3.5" aria-hidden="true" />
            </button>
        </span>
    </span>
);

const FilterMenu = ({ dim, selected, onChange, onClose }: { dim: Dimension; selected: string[]; onChange: (v: string[]) => void; onClose: () => void }) => {
    const all = dimensionValues[dim] as readonly string[];
    return (
        <div className="absolute top-full left-0 z-30 mt-2 flex w-64 flex-col gap-2 rounded-xl bg-primary p-3 shadow-xl ring-1 ring-secondary">
            <div className="flex items-center justify-between text-xs font-semibold text-tertiary uppercase">
                {dim}
                <button type="button" className="normal-case" style={{ color: PINK }} onClick={() => onChange(selected.length === all.length ? [] : [...all])}>
                    {selected.length === all.length ? "Clear all" : "Select all"}
                </button>
            </div>
            {all.map((v) => (
                <Checkbox key={v} label={v} isSelected={selected.includes(v)} onChange={(on) => onChange(on ? all.filter((x) => x === v || selected.includes(x)) : selected.filter((x) => x !== v))} />
            ))}
            <Button size="sm" color="secondary" onClick={onClose}>
                Done
            </Button>
        </div>
    );
};

/* ------------------------------------------------------------------- Table --- */

const tint = (v: number, max: number, metric: Metric) => {
    const rgb = isMetric(metric) && ["Revenue", "Impressions", "Requests", "Clicks"].includes(metric) ? "55,182,183" : "218,110,163";
    return { backgroundColor: `rgba(${rgb},${(0.05 + (max ? v / max : 0) * 0.3).toFixed(2)})` };
};

const PivotTable = ({ layout }: { layout: Layout }) => {
    const result = useMemo(() => buildPivot(layout), [layout]);
    const [expanded, setExpanded] = useState<Set<string>>(() => new Set(result.rows.slice(0, 1).map((r) => r.key)));
    const { columnKeys, rows, grand } = result;
    const vals = layout.values;
    const hasCols = layout.columns.length > 0;
    const nested = layout.rows.length > 1;

    /* Column maxima across top-level rows, for the heatmap tint. */
    const maxima = new Map<string, number>();
    for (const ck of columnKeys)
        for (const m of vals) maxima.set(`${ck.key}|${m}`, Math.max(0, ...rows.map((r) => (r.cells.get(ck.key) ? metricValue(m, r.cells.get(ck.key)!) : 0))));

    const toggle = (key: string) => setExpanded((s) => (s.has(key) ? new Set([...s].filter((k) => k !== key)) : new Set([...s, key])));
    const allKeys = (nodes: PivotNode[]): string[] => nodes.flatMap((n) => (n.children.length ? [n.key, ...allKeys(n.children)] : []));

    const renderRow = (node: PivotNode): ReactNode[] => {
        const open = expanded.has(node.key);
        const top = node.depth === 0;
        return [
            <tr key={node.key} className={cx("border-t border-secondary", !top && "bg-secondary/30")}>
                <th scope="row" className="sticky left-0 z-10 bg-inherit px-5 py-2.5 text-left font-normal" style={{ paddingLeft: 20 + node.depth * 22 }}>
                    <span className={cx("absolute inset-0 -z-10", top ? "bg-primary" : "bg-[#FBFBFC]")} aria-hidden="true" />
                    {node.children.length ? (
                        <button type="button" onClick={() => toggle(node.key)} aria-expanded={open} className={cx("inline-flex items-center gap-1.5 text-sm whitespace-nowrap", top ? "font-semibold text-primary" : "font-medium text-secondary")}>
                            {open ? <ChevronDown className="size-4" aria-hidden="true" /> : <ChevronRight className="size-4" aria-hidden="true" />}
                            {node.label}
                            <span className="text-xs font-normal text-quaternary">{node.children.length}</span>
                        </button>
                    ) : (
                        <span className={cx("inline-block text-sm whitespace-nowrap", nested && "pl-5.5", top ? "font-semibold text-primary" : "text-secondary")}>{node.label}</span>
                    )}
                </th>
                {columnKeys.flatMap((ck) =>
                    vals.map((m) => {
                        const cell = node.cells.get(ck.key);
                        const v = cell ? metricValue(m, cell) : undefined;
                        return (
                            <td
                                key={`${ck.key}|${m}`}
                                className={cx("px-4 py-2.5 text-right text-sm whitespace-nowrap tabular-nums", top ? "font-semibold text-primary" : "text-secondary")}
                                style={top && v !== undefined ? tint(v, maxima.get(`${ck.key}|${m}`) ?? 0, m) : undefined}
                            >
                                {v === undefined ? <span className="text-quaternary">—</span> : formatMetric(m, v)}
                            </td>
                        );
                    }),
                )}
                {hasCols &&
                    vals.map((m) => (
                        <td key={`total|${m}`} className={cx("border-l border-secondary px-4 py-2.5 text-right text-sm whitespace-nowrap tabular-nums", top ? "font-semibold text-primary" : "text-secondary")}>
                            {formatMetric(m, metricValue(m, node.total))}
                        </td>
                    ))}
            </tr>,
            ...(open ? node.children.flatMap(renderRow) : []),
        ];
    };

    return (
        <div className="flex flex-col gap-2">
            {nested && (
                <div className="flex gap-3 text-xs font-semibold">
                    <button type="button" style={{ color: PINK }} onClick={() => setExpanded(new Set(allKeys(rows)))}>
                        Expand all
                    </button>
                    <button type="button" style={{ color: PINK }} onClick={() => setExpanded(new Set())}>
                        Collapse all
                    </button>
                </div>
            )}
            <div className="max-h-[560px] overflow-auto rounded-xl ring-1 ring-secondary">
                <table className="w-full border-separate border-spacing-0 text-left">
                    <thead className="sticky top-0 z-20 bg-secondary">
                        <tr>
                            <th rowSpan={hasCols && vals.length > 1 ? 2 : 1} className="sticky left-0 z-10 bg-secondary px-5 py-3 text-xs font-semibold whitespace-nowrap text-tertiary">
                                {layout.rows.join(" › ") || "All data"}
                            </th>
                            {hasCols
                                ? [...columnKeys, { key: "__total", labels: ["Total"] }].map((ck) => (
                                      <th
                                          key={ck.key}
                                          colSpan={vals.length}
                                          className={cx("px-4 py-3 text-right text-xs font-semibold whitespace-nowrap text-tertiary", ck.key === "__total" && "border-l border-secondary text-primary", vals.length > 1 && "text-center")}
                                      >
                                          {ck.labels.join(" · ")}
                                      </th>
                                  ))
                                : vals.map((m) => (
                                      <th key={m} className="px-4 py-3 text-right text-xs font-semibold whitespace-nowrap text-tertiary">
                                          {m}
                                      </th>
                                  ))}
                        </tr>
                        {hasCols && vals.length > 1 && (
                            <tr>
                                {[...columnKeys, { key: "__total" }].flatMap((ck) =>
                                    vals.map((m, i) => (
                                        <th key={`${ck.key}|${m}`} className={cx("px-4 pb-2 text-right text-[11px] font-medium whitespace-nowrap text-quaternary", ck.key === "__total" && i === 0 && "border-l border-secondary")}>
                                            {m}
                                        </th>
                                    )),
                                )}
                            </tr>
                        )}
                    </thead>
                    <tbody>{rows.flatMap(renderRow)}</tbody>
                    <tfoot className="sticky bottom-0 z-10 bg-secondary">
                        <tr className="border-t-2 border-secondary">
                            <th scope="row" className="sticky left-0 bg-secondary px-5 py-3 text-left text-sm font-semibold text-primary">
                                {layout.rows.length ? "Grand total" : "Total"}
                            </th>
                            {columnKeys.flatMap((ck) =>
                                vals.map((m) => (
                                    <td key={`${ck.key}|${m}`} className="px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-primary tabular-nums">
                                        {grand.cells.get(ck.key) ? formatMetric(m, metricValue(m, grand.cells.get(ck.key)!)) : "—"}
                                    </td>
                                )),
                            )}
                            {hasCols &&
                                vals.map((m) => (
                                    <td key={`g|${m}`} className="border-l border-secondary px-4 py-3 text-right text-sm font-semibold whitespace-nowrap text-primary tabular-nums">
                                        {formatMetric(m, metricValue(m, grand.total))}
                                    </td>
                                ))}
                        </tr>
                    </tfoot>
                </table>
            </div>
            <span className="text-xs text-tertiary">
                {rows.length} {layout.rows[0] ?? "row"} groups · {columnKeys.length * vals.length} value columns · {result.factCount.toLocaleString("en-US")} source rows aggregated in the browser · fictional data
            </span>
        </div>
    );
};

/* ------------------------------------------------------------------ Screen --- */

export interface ExplorerProps {
    preset?: Layout;
    railCollapsed?: boolean;
    /** Filter menu open for this dimension. */
    filterOpen?: Dimension;
}

export const Explorer = ({ preset = defaultLayout, railCollapsed = false, filterOpen }: ExplorerProps) => {
    const [layout, setLayout] = useState<Layout>(() => layoutFromParams(readHashParams()) ?? preset);
    const [collapsed, setCollapsed] = useState(() => (readHashParams().has("rail") ? readHashParams().get("rail") === "closed" : railCollapsed));
    const [drag, setDrag] = useState<{ field: Field; from?: Zone } | null>(null);
    const [over, setOver] = useState<{ zone: Zone; index: number } | null>(null);
    const [openFilter, setOpenFilter] = useState<Dimension | undefined>(filterOpen);
    const [find, setFind] = useState("");

    useEffect(() => {
        writeHashParams({ ...layoutToParams(layout), rail: collapsed ? "closed" : undefined });
    }, [layout, collapsed]);

    const endDrag = () => {
        setDrag(null);
        setOver(null);
    };
    const start = (field: Field, from?: Zone) => (e: DragEvent) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", field);
        setDrag({ field, from });
    };
    const dragOver = (zone: Zone, index: number) => (e: DragEvent) => {
        if (!drag || !accepts(zone, drag.field)) return;
        e.preventDefault();
        e.stopPropagation();
        if (over?.zone !== zone || over.index !== index) setOver({ zone, index });
    };
    const drop = (zone: Zone, index: number) => (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (drag) {
            setLayout((l) => place(l, drag.field, zone, index, drag.from));
            if (zone === "filters" && drag.from !== "filters") setOpenFilter(drag.field as Dimension);
        }
        endDrag();
    };
    /* Dropping a pill back on the rail removes it. */
    const dropOnRail = (e: DragEvent) => {
        e.preventDefault();
        if (drag?.from) setLayout((l) => without(l, drag.field, drag.from));
        endDrag();
    };

    const clickField = (field: Field) => {
        const zone = zoneOf(layout, field);
        setLayout((l) => (zone ? without(l, field) : place(l, field, defaultZone(field), Number.MAX_SAFE_INTEGER)));
    };

    const zoneItems = (zone: Zone): Field[] => (zone === "filters" ? (Object.keys(layout.filters) as Dimension[]) : zone === "values" ? layout.values : zone === "rows" ? layout.rows : layout.columns);

    const valueColumns = buildColumnsCount(layout);
    const lastColumn = layout.columns[layout.columns.length - 1];

    const renderZone = (zone: Zone) => {
        const items = zoneItems(zone);
        const ok = drag ? accepts(zone, drag.field) : false;
        const hot = over?.zone === zone;
        return (
            <div
                key={zone}
                onDragOver={dragOver(zone, items.length)}
                onDrop={drop(zone, items.length)}
                onDragLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver((o) => (o?.zone === zone ? null : o));
                }}
                className={cx(
                    "relative flex min-h-13 flex-wrap items-center gap-2 rounded-xl border border-dashed px-3 py-2 transition-colors",
                    drag && !ok && "opacity-40",
                    hot ? "border-solid" : "border-secondary",
                )}
                style={hot ? { borderColor: isMetric(drag!.field) ? PINK : TEAL, backgroundColor: isMetric(drag!.field) ? `${PINK}0f` : `${TEAL}0f` } : drag && ok ? { borderColor: `${TEAL}99` } : undefined}
            >
                <span className="flex w-20 shrink-0 items-center gap-1.5 text-xs font-semibold text-tertiary uppercase">
                    {zone === "filters" && <FilterLines className="size-3.5" aria-hidden="true" />}
                    {zoneMeta[zone].label}
                </span>
                {items.length === 0 && !hot && <span className="text-sm text-quaternary">{zoneMeta[zone].hint}</span>}
                {items.map((field, i) => {
                    const pill = (
                        <Pill
                            key={field}
                            field={field}
                            dragging={drag?.field === field && drag.from === zone}
                            caret={hot && over!.index === i && drag?.field !== field}
                            onRemove={() => setLayout((l) => without(l, field, zone))}
                            onDragStart={start(field, zone)}
                            onDragEnd={endDrag}
                            onDragOver={dragOver(zone, i)}
                            onDrop={drop(zone, i)}
                        >
                            {zone === "filters" ? (
                                <button type="button" onClick={() => setOpenFilter(openFilter === field ? undefined : (field as Dimension))} className="inline-flex items-center gap-1">
                                    {field}:{" "}
                                    <span className="font-semibold">
                                        {layout.filters[field as Dimension]!.length === dimensionValues[field as Dimension].length
                                            ? "All"
                                            : layout.filters[field as Dimension]!.length === 1
                                              ? layout.filters[field as Dimension]![0]
                                              : `${layout.filters[field as Dimension]!.length} of ${dimensionValues[field as Dimension].length}`}
                                    </span>
                                    <ChevronDown className="size-3.5 opacity-60" aria-hidden="true" />
                                </button>
                            ) : undefined}
                        </Pill>
                    );
                    return zone === "rows" && i > 0 ? (
                        <span key={field} className="inline-flex items-center gap-2">
                            <ChevronRight className="size-4 text-fg-quaternary" aria-hidden="true" />
                            {pill}
                        </span>
                    ) : (
                        pill
                    );
                })}
                {hot && over!.index === items.length && <span className="h-7 w-0.5 rounded-full" style={{ backgroundColor: PINK }} aria-hidden="true" />}
                {zone === "filters" && openFilter && layout.filters[openFilter] && (
                    <div className="absolute top-full left-24 z-30">
                        <FilterMenu
                            dim={openFilter}
                            selected={layout.filters[openFilter]!}
                            onChange={(v) => setLayout((l) => ({ ...l, filters: { ...l.filters, [openFilter]: v } }))}
                            onClose={() => setOpenFilter(undefined)}
                        />
                    </div>
                )}
            </div>
        );
    };

    const q = find.trim().toLowerCase();

    return (
        <PiShell
            active="New Query"
            concept={{
                label: "Concept C",
                title: "Explorer: build the query by dragging fields",
                notes: [
                    "Drag fields from the rail on the right into Rows, Columns, Values or Filters, or click a field to drop it in its usual place. Drag pills to reorder or move them, and drop one back on the rail to remove it.",
                    "The table re-aggregates on every change: nested rows expand and collapse, cells tint like a heatmap, and totals stay correct for rate metrics such as eCPM and Fill Rate.",
                    "The rail collapses to give the table room. The whole layout lives in the link, so any view you build can be shared.",
                ],
            }}
        >
            <div className={cx("grid grid-cols-1 gap-6", collapsed ? "xl:grid-cols-[minmax(0,1fr)_52px]" : "xl:grid-cols-[minmax(0,1fr)_280px]")}>
                <div className="flex min-w-0 flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        {renderZone("rows")}
                        <div className="relative">
                            {renderZone("columns")}
                            {(layout.rows.length > 0 || layout.columns.length > 0) && (
                                <button
                                    type="button"
                                    onClick={() => setLayout((l) => ({ ...l, rows: l.columns, columns: l.rows }))}
                                    className="absolute top-1/2 right-2 inline-flex -translate-y-1/2 items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-tertiary hover:bg-primary_hover"
                                    title="Swap rows and columns"
                                >
                                    <SwitchVertical01 className="size-3.5" aria-hidden="true" /> Swap
                                </button>
                            )}
                        </div>
                        {renderZone("values")}
                        {renderZone("filters")}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-sm text-tertiary">
                            <Clock className="size-4" aria-hidden="true" /> Aug 24 – Sep 20, 2026 · UTC
                        </span>
                        <div className="flex gap-3">
                            <Button color="secondary" size="sm" iconLeading={RefreshCcw01} onClick={() => setLayout(defaultLayout)}>
                                Reset
                            </Button>
                            <Button color="secondary" size="sm" iconLeading={Share07}>
                                Share
                            </Button>
                            <Button color="secondary" size="sm" iconLeading={Download01}>
                                CSV
                            </Button>
                        </div>
                    </div>

                    {valueColumns > MAX_VALUE_COLUMNS && lastColumn && (
                        <div className="flex flex-col gap-3 rounded-xl bg-warning-primary p-4 sm:flex-row sm:items-center sm:justify-between">
                            <span className="flex items-start gap-3 text-sm text-secondary">
                                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-primary" aria-hidden="true" />
                                <span>
                                    <strong className="text-primary">{valueColumns} value columns</strong> is a lot to scan. Moving {lastColumn} to Rows keeps the table narrow.
                                </span>
                            </span>
                            <Button size="sm" color="secondary" onClick={() => setLayout((l) => place(l, lastColumn, "rows", l.rows.length, "columns"))}>
                                Move {lastColumn} to Rows
                            </Button>
                        </div>
                    )}

                    {layout.values.length === 0 ? (
                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-secondary px-6 py-16 text-center">
                            <span className="flex size-12 items-center justify-center rounded-full" style={{ backgroundColor: `${PINK}1f` }}>
                                <DotsGrid className="size-6" style={{ color: PINK }} aria-hidden="true" />
                            </span>
                            <p className="text-md font-semibold text-primary">Add a metric to see numbers</p>
                            <p className="max-w-md text-sm text-tertiary">Drag Revenue, eCPM or any other metric into Values. Add a dimension to Rows to break it down.</p>
                            <div className="mt-2 flex flex-wrap justify-center gap-2">
                                {(["Revenue", "eCPM", "Fill Rate"] as Metric[]).map((m) => (
                                    <Button key={m} size="sm" color="secondary" onClick={() => setLayout((l) => place(l, m, "values", l.values.length))}>
                                        + {m}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <PivotTable key={`${layout.rows.join()}|${layout.columns.join()}`} layout={layout} />
                    )}
                </div>

                <aside
                    onDragOver={(e) => drag?.from && e.preventDefault()}
                    onDrop={dropOnRail}
                    className={cx("flex flex-col gap-4 rounded-2xl ring-1 ring-secondary xl:sticky xl:top-14 xl:self-start", collapsed ? "items-center p-2" : "p-4", drag?.from && "ring-2 ring-dashed")}
                    style={drag?.from ? { ["--tw-ring-color" as string]: PINK } : undefined}
                    aria-label="Fields"
                >
                    {collapsed ? (
                        <>
                            <button type="button" onClick={() => setCollapsed(false)} aria-label="Show fields" className="rounded-md p-1.5 text-fg-quaternary hover:bg-primary_hover">
                                <ChevronLeftDouble className="size-5" aria-hidden="true" />
                            </button>
                            <span className="text-xs font-semibold tracking-wider text-tertiary uppercase [writing-mode:vertical-rl]">Fields · {metrics.length + dimensions.length}</span>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-primary">Fields</span>
                                <button type="button" onClick={() => setCollapsed(true)} aria-label="Hide fields" className="rounded-md p-1 text-fg-quaternary hover:bg-primary_hover">
                                    <ChevronRightDouble className="size-5" aria-hidden="true" />
                                </button>
                            </div>
                            <Input aria-label="Search fields" size="sm" icon={SearchLg} placeholder="Search fields" value={find} onChange={setFind} />
                            <p className="text-xs text-tertiary">{drag?.from ? "Drop here to remove it." : "Drag into a zone, or click to add or remove."}</p>
                            {fieldGroups.map((g) => {
                                const items = g.items.filter((f) => f.toLowerCase().includes(q));
                                if (!items.length) return null;
                                return (
                                    <div key={g.group} className="flex flex-col gap-0.5">
                                        <span className="px-1 text-xs font-semibold text-tertiary uppercase">{g.group}</span>
                                        {items.map((field) => {
                                            const zone = zoneOf(layout, field) ?? (layout.filters[field as Dimension] ? "filters" : undefined);
                                            return (
                                                <button
                                                    key={field}
                                                    type="button"
                                                    draggable
                                                    onDragStart={start(field)}
                                                    onDragEnd={endDrag}
                                                    onClick={() => clickField(field)}
                                                    className={cx("flex cursor-grab items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm active:cursor-grabbing", zone ? "font-semibold" : "text-secondary hover:bg-primary_hover")}
                                                    style={zone ? pillStyle(field) : undefined}
                                                >
                                                    <DotsGrid className="size-3.5 shrink-0 opacity-50" aria-hidden="true" />
                                                    <span className="flex-1">{field}</span>
                                                    {zone && <span className="text-[10px] font-semibold tracking-wide uppercase opacity-70">{zoneMeta[zone].label}</span>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </>
                    )}
                </aside>
            </div>
        </PiShell>
    );
};

const buildColumnsCount = (l: Layout) => l.columns.reduce((n, c) => n * dimensionValues[c].length, 1) * Math.max(1, l.values.length);
