import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, SearchLg } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { KeywordChip, PINK } from "./das-shell";

/**
 * Taxonomy picker — pick leaves out of a parent/child tree.
 *
 * Replaces the flat grouped checkbox list. Three things that list got wrong, which the
 * 2 Oct storyboard fixes:
 *
 * 1. **Groups were headings, not things you could pick.** Targeting all of LATAM is the
 *    common case, and it meant ticking twenty-five boxes. A branch is now selectable in
 *    its own right, and shows a dash when only some of its children are in.
 * 2. **Everything was open at once**, so finding a country meant scrolling past a
 *    hundred. Branches collapse, and searching expands only what matched.
 * 3. **The field and the tree disagreed.** Chips are the same state as the checkboxes,
 *    so removing a chip unticks its box and a fully-selected branch collapses to one
 *    chip rather than twenty-five.
 *
 * The tree is n-level, though Geos only uses two. Apps and any later taxonomy can nest
 * deeper without this needing to change.
 */

export interface TaxonomyNode {
    id: string;
    label: string;
    children?: TaxonomyNode[];
}

const matches = (node: TaxonomyNode, q: string): boolean => node.label.toLowerCase().includes(q) || Boolean(node.children?.some((c) => matches(c, q)));

/**
 * The leaves under a node — all of them, or only the ones a search is showing.
 *
 * The filtered form is what makes ticking a branch safe while searching. Type "ger",
 * tick AFRICA, and you get Algeria and Nigeria: the two rows you can see. Taking all
 * thirteen African countries off the back of a two-row list would be a nasty surprise,
 * and you would not notice until Review.
 *
 * A branch that matched on its own name keeps all its children, because searching
 * "LATAM" means you want LATAM, not nothing.
 */
const leavesOf = (node: TaxonomyNode, q = ""): string[] => {
    if (!node.children?.length) return [node.id];
    const own = Boolean(q) && node.label.toLowerCase().includes(q);
    const kids = q && !own ? node.children.filter((c) => matches(c, q)) : node.children;
    return kids.flatMap((c) => leavesOf(c, own ? "" : q));
};

/** A branch is checked when every leaf under it is, indeterminate when only some are. */
const stateOf = (node: TaxonomyNode, selected: Set<string>, q = ""): "on" | "off" | "some" => {
    const leaves = leavesOf(node, q);
    const n = leaves.filter((l) => selected.has(l)).length;
    return n === 0 ? "off" : n === leaves.length ? "on" : "some";
};

/**
 * What to show in the field: the applied selections, in the taxonomy's own order.
 *
 * A branch with every child selected becomes one chip for the branch. "AFRICA" is what
 * you chose and what you would say out loud; thirteen country chips is the same fact,
 * spelled out, taking thirteen times the room. Partially-selected branches list their
 * countries under a heading naming the parent, because "Georgia" means different things
 * under EUROPE and NORAM.
 */
export interface AppliedGroup {
    /** e.g. ["LATAM"] — rendered as the breadcrumb heading above its chips. */
    path: string[];
    items: { id: string; label: string }[];
}

interface Applied {
    /** Fully-selected branches, one chip each. */
    whole: { id: string; label: string; ids: string[] }[];
    /** Everything else, grouped by the path it sits under. */
    partial: AppliedGroup[];
}

const appliedFor = (nodes: TaxonomyNode[], selected: Set<string>, path: string[] = []): Applied => {
    const whole: Applied["whole"] = [];
    const partial: AppliedGroup[] = [];
    // Leaves at this level come before anything nested, matching the storyboard's order.
    const direct = nodes.filter((n) => !n.children?.length && selected.has(n.id)).map((n) => ({ id: n.id, label: n.label }));
    if (direct.length) partial.push({ path, items: direct });
    for (const node of nodes) {
        if (!node.children?.length) continue;
        const state = stateOf(node, selected);
        if (state === "on") {
            whole.push({ id: node.id, label: node.label, ids: leavesOf(node) });
        } else if (state === "some") {
            const sub = appliedFor(node.children, selected, [...path, node.label]);
            whole.push(...sub.whole);
            partial.push(...sub.partial);
        }
    }
    return { whole, partial };
};

/** How many chips a partially-selected group shows before it folds. */
const COLLAPSE_AT = 12;

const Row = ({
    node,
    depth,
    selected,
    expanded,
    onToggleExpand,
    onToggleSelect,
    query,
}: {
    node: TaxonomyNode;
    depth: number;
    selected: Set<string>;
    expanded: Set<string>;
    onToggleExpand: (id: string) => void;
    onToggleSelect: (node: TaxonomyNode) => void;
    query: string;
}) => {
    const branch = Boolean(node.children?.length);
    const state = stateOf(node, selected, query);
    // While searching, a branch that matched is open so its hits are visible.
    const open = branch && (expanded.has(node.id) || Boolean(query));
    const kids = query ? (node.children ?? []).filter((c) => matches(c, query)) : (node.children ?? []);

    return (
        <>
            <div
                className={cx("flex items-center gap-1 rounded-md py-1.5 pr-2 hover:bg-secondary", state !== "off" && "bg-secondary/40")}
                style={{ paddingLeft: 8 + depth * 20 }}
            >
                {branch ? (
                    <button
                        type="button"
                        aria-label={open ? `Collapse ${node.label}` : `Expand ${node.label}`}
                        aria-expanded={open}
                        onClick={() => onToggleExpand(node.id)}
                        className="rounded p-0.5 text-fg-quaternary hover:bg-tertiary"
                    >
                        <ChevronRight className={cx("size-4 transition-transform", open && "rotate-90")} aria-hidden="true" />
                    </button>
                ) : (
                    <span className="w-5 shrink-0" aria-hidden="true" />
                )}
                <Checkbox
                    size="sm"
                    label={node.label}
                    isSelected={state === "on"}
                    isIndeterminate={state === "some"}
                    onChange={() => onToggleSelect(node)}
                    className={cx("min-w-0 flex-1", branch && "font-semibold")}
                />
                {branch && <span className="shrink-0 text-xs text-tertiary">{leavesOf(node, query).filter((l) => selected.has(l)).length || ""}</span>}
            </div>
            {open &&
                kids.map((child) => (
                    <Row
                        key={child.id}
                        node={child}
                        depth={depth + 1}
                        selected={selected}
                        expanded={expanded}
                        onToggleExpand={onToggleExpand}
                        onToggleSelect={onToggleSelect}
                        query={query}
                    />
                ))}
        </>
    );
};

export const TaxonomyPicker = ({
    label,
    nodes,
    value,
    onChange,
    placeholder,
    noun,
    one,
    emptyHint,
}: {
    label: string;
    nodes: TaxonomyNode[];
    value: string[];
    onChange: (next: string[]) => void;
    placeholder: string;
    /** Plural, for counts: "countries", "apps". */
    noun: string;
    /** Singular, for the empty state. Chopping an "s" off "countries" gives "countrie". */
    one: string;
    emptyHint?: ReactNode;
}) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [expanded, setExpanded] = useState<Set<string>>(new Set());
    const [unfolded, setUnfolded] = useState<Set<string>>(new Set());
    const box = useRef<HTMLDivElement>(null);

    const selected = useMemo(() => new Set(value), [value]);
    const allLeaves = useMemo(() => nodes.flatMap((n) => leavesOf(n)), [nodes]);
    const applied = useMemo(() => appliedFor(nodes, selected), [nodes, selected]);
    const anyApplied = applied.whole.length > 0 || applied.partial.length > 0;

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const q = query.trim().toLowerCase();
    const shown = q ? nodes.filter((n) => matches(n, q)) : nodes;
    const visibleLeaves = useMemo(() => new Set(shown.flatMap((n) => leavesOf(n, q))), [shown, q]);

    /** Ticking a branch takes all of it; unticking takes all of it away. */
    const toggleNode = (node: TaxonomyNode) => {
        const leaves = leavesOf(node, q);
        const turnOff = stateOf(node, selected, q) === "on";
        const next = new Set(selected);
        leaves.forEach((l) => (turnOff ? next.delete(l) : next.add(l)));
        onChange(allLeaves.filter((l) => next.has(l)));
    };

    const remove = (id: string) => onChange(value.filter((v) => v !== id));
    const removeIds = (ids: string[]) => onChange(value.filter((v) => !ids.includes(v)));

    return (
        <div ref={box} className="flex flex-col gap-1.5">
            <div className="relative">
                {/* A border, not an inset ring: an inset ring is painted beneath child
                    backgrounds, so the scrolling chip area drew straight over the focus
                    outline. The focus state is an outline, which sits outside the box and
                    cannot be overlapped, and overflow-hidden keeps chips inside the radius. */}
                <div
                    className="flex w-full flex-col overflow-hidden rounded-lg border border-secondary bg-primary shadow-xs"
                    style={open ? { outline: `2px solid ${PINK}` } : undefined}
                >
                    {anyApplied && (
                        <div className="flex max-h-60 flex-col gap-2 overflow-y-auto p-2">
                            {applied.whole.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {/* "(All)" so a region chip can't be mistaken for a place
                                        that happens to share the region's name. */}
                                    {applied.whole.map((w) => (
                                        <KeywordChip key={w.id} value={`${w.label} (All)`} onRemove={() => removeIds(w.ids)} />
                                    ))}
                                </div>
                            )}
                            {applied.partial.map((g) => {
                                const key = g.path.join("|") || "_";
                                const folded = g.items.length > COLLAPSE_AT && !unfolded.has(key);
                                const items = folded ? g.items.slice(0, COLLAPSE_AT) : g.items;
                                return (
                                    <div key={key} className="flex flex-col gap-1">
                                        {g.path.length > 0 && (
                                            <span className="truncate px-0.5 text-xs font-semibold" style={{ color: "#1F7F80" }}>
                                                {g.path.join(" › ")}
                                            </span>
                                        )}
                                        <div className="flex flex-wrap items-center gap-1.5">
                                            {items.map((item) => (
                                                <KeywordChip key={item.id} value={item.label} onRemove={() => remove(item.id)} />
                                            ))}
                                            {g.items.length > COLLAPSE_AT && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setUnfolded((prev) => {
                                                            const next = new Set(prev);
                                                            if (!next.delete(key)) next.add(key);
                                                            return next;
                                                        })
                                                    }
                                                    className="px-1 text-xs font-semibold"
                                                    style={{ color: PINK }}
                                                >
                                                    {folded ? `+${g.items.length - COLLAPSE_AT} more` : "Show fewer"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* The search and Browse sit under the applied chips, as in the storyboard. */}
                    <div className={cx("flex items-center gap-2 px-3 py-2", anyApplied && "border-t border-secondary")}>
                        <SearchLg className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                        <input
                            aria-label={`Search ${noun}`}
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setOpen(true);
                            }}
                            onFocus={() => setOpen(true)}
                            placeholder={placeholder}
                            className="min-w-0 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-placeholder"
                        />
                        <button
                            type="button"
                            onClick={() => setOpen((o) => !o)}
                            aria-expanded={open}
                            className="shrink-0 rounded-md px-1 text-sm font-semibold uppercase transition-opacity hover:opacity-80"
                            style={{ color: PINK }}
                        >
                            Browse
                        </button>
                    </div>
                </div>

                {open && (
                    <div className="absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-xl bg-primary shadow-lg ring-1 ring-secondary">
                        <div className="flex items-center justify-between gap-3 border-b border-secondary px-3 py-2">
                            <span className="text-xs font-semibold text-tertiary uppercase">{label}</span>
                            <span className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => onChange(allLeaves.filter((l) => !q || visibleLeaves.has(l) || selected.has(l)))}
                                    className="text-sm font-semibold"
                                    style={{ color: PINK }}
                                >
                                    {q ? "Select these" : "Select all"}
                                </button>
                                <button type="button" onClick={() => onChange([])} className="text-sm font-semibold text-secondary hover:text-primary">
                                    Clear
                                </button>
                            </span>
                        </div>
                        <div className="max-h-72 overflow-y-auto py-1">
                            {shown.length === 0 ? (
                                <p className="px-3 py-6 text-center text-sm text-tertiary">Nothing matches “{query}”.</p>
                            ) : (
                                shown.map((node) => (
                                    <Row
                                        key={node.id}
                                        node={node}
                                        depth={0}
                                        selected={selected}
                                        expanded={expanded}
                                        query={q}
                                        onToggleExpand={(id) =>
                                            setExpanded((prev) => {
                                                const next = new Set(prev);
                                                if (!next.delete(id)) next.add(id);
                                                return next;
                                            })
                                        }
                                        onToggleSelect={toggleNode}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
            <span className="text-sm text-tertiary">
                {value.length === 0 ? (emptyHint ?? `Not Specified — includes every ${one}.`) : `${value.length} of ${allLeaves.length} ${noun} selected`}
            </span>
        </div>
    );
};
