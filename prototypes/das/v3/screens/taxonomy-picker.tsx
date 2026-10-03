import { type ReactNode, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, SearchLg } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { KeywordChip, PINK } from "../../v1/screens/das-shell";
import { activeRowStyle, resultCount, useListCursor } from "./arrow-keys";
import { usePanelPlacement } from "./panel-placement";
import { useScrollLock } from "./scroll-lock";
import { KeyHint } from "./search-select";

/**
 * Taxonomy picker — pick leaves out of a parent/child tree.
 *
 * Forked from Round 1 so the two earlier rounds keep rendering exactly as they were
 * reviewed. What Round 3 adds is the keyboard: Down opens the tree and walks it, Right
 * and Left open and close a branch, Enter ticks whatever is highlighted. Geos and Apps
 * are two of the six search-and-select surfaces, and the whole point of the 2 Oct
 * feedback was that those six should not each behave differently. The tree also now
 * says how many rows are under you, because "AFRICA" tells you nothing about whether
 * opening it costs you thirteen rows or a hundred.
 *
 * **A region row and a country row answer to different gestures**, because they are
 * asked different questions. A region is somewhere you go; a country is something you
 * pick.
 *
 *   Region   the checkbox takes the whole region. Everything else on the row is for
 *            navigation: one click twirls it down, a double-click rolls it up.
 *   Country  click it anywhere. There is nothing to open, so the whole row is the
 *            checkbox and the name is as good a target as the box.
 *
 * Splitting them is what makes both work. While a region row selected on click it had
 * nowhere left to put "open this", and double-click was unusable — the two clicks
 * selected and deselected on the way through, and since selecting a region opens it,
 * the toggle at the end always landed on "close".
 *
 * **Ticking a region opens it.** It used to select thirteen countries and show you
 * none of them, so the next thing anybody did was open it anyway to check, or to drop
 * the two they didn't want. Selecting and inspecting are one gesture now: tick the box
 * and you see what you took. Unticking leaves it open, so "all of them except these"
 * is a tick and two unticks rather than a tick, an expand, and two unticks.
 *
 * **Click opens, double-click closes.** A single click on a closed region opens it; a
 * double-click on an open one closes it. Each gesture does one thing and only in the
 * direction that makes sense, so a click can never close a region out from under you
 * and the first click of a double-click is never a change you have to undo. The
 * chevron still toggles either way for anyone who prefers it.
 *
 * **Nothing moves while the list is open.** The chips sit above the search row, so
 * every country you add used to make the field taller and push the whole dropdown
 * down the page — the rows slid out from under the cursor mid-selection, which is the
 * single most irritating thing a picker can do. The strip is measured once, when the
 * panel opens, and holds that height until it closes; chips added after that scroll
 * inside it. The list below can grow freely, because growing downwards moves nothing
 * you are pointing at.
 *
 * **The list grows once something is open, and the page moves to make room.** Seven
 * regions fit in a short panel; seven regions with LATAM twirled down do not, and
 * scrolling a 288-pixel window through twenty-five countries is the browsing problem
 * this picker exists to avoid. Growing it is only half the job — Geos sits in the
 * middle of a three-thousand-pixel form, so a taller list just runs off the bottom of
 * the window. Opening the first region therefore lifts the picker to a fifth of the
 * way down the viewport, which is as far up as it can go while the field it belongs
 * to is still visible above it. Once per opening, not once per region: lifting the
 * page every time you twirled something would be its own kind of jumping about.
 *
 * **The chip strip holds its height while the list is open.** It has to. The chips
 * live above the search row, so the first selection used to make the field forty
 * pixels taller and shove the whole dropdown down with it — and deselecting shoved it
 * back up. The row under your cursor changed after every click, which made a
 * double-click land on two different rows and made ordinary rapid selection a game of
 * chance. Reserving the space costs an empty strip while the list is open and buys a
 * list that stays where you are pointing.
 *
 * Everything below this line is Round 1's, unchanged in substance:
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

/** Where the top of the picker lands when a region opens — a fifth down the window. */
const TOP_OFFSET = 0.2;

/** The least room the chip strip is frozen at: two rows, so the first few don't scroll. */
const STRIP_FLOOR = 68;

interface FlatRow {
    node: TaxonomyNode;
    depth: number;
    branch: boolean;
    open: boolean;
}

/**
 * The tree as it is actually painted, top to bottom — which is also the order the arrow
 * keys walk. Deriving both from one list is the only way the two can't disagree, and a
 * highlight that lands somewhere other than where it appears to is worse than no
 * keyboard support at all.
 */
const flatten = (nodes: TaxonomyNode[], expanded: Set<string>, q: string, depth = 0): FlatRow[] =>
    nodes.flatMap((node) => {
        const branch = Boolean(node.children?.length);
        // While searching, a branch that matched is open so its hits are visible.
        const open = branch && (expanded.has(node.id) || Boolean(q));
        const kids = q ? (node.children ?? []).filter((c) => matches(c, q)) : (node.children ?? []);
        return [{ node, depth, branch, open }, ...(open ? flatten(kids, expanded, q, depth + 1) : [])];
    });

const Row = ({
    row,
    selected,
    query,
    active,
    onHover,
    onToggleExpand,
    onToggleSelect,
}: {
    row: FlatRow;
    selected: Set<string>;
    query: string;
    active: boolean;
    /** Fired on real pointer movement — see arrow-keys.ts. */
    onHover: () => void;
    onToggleExpand: (id: string) => void;
    onToggleSelect: (node: TaxonomyNode) => void;
}) => {
    const { node, depth, branch, open } = row;
    const state = stateOf(node, selected, query);
    return (
        <div
            data-active={active}
            onMouseMove={onHover}
            // The chevron and the checkbox handle their own clicks and are left alone.
            // Beyond those: a country row selects, a region row navigates — and the
            // region's two gestures go one way each, so neither can undo the other.
            onClick={(e) => {
                if ((e.target as Element).closest(".taxo-arrow, .taxo-box")) return;
                if (!branch) onToggleSelect(node);
                else if (!open) onToggleExpand(node.id);
            }}
            onDoubleClick={(e) => {
                if (!branch || !open || (e.target as Element).closest(".taxo-arrow, .taxo-box")) return;
                onToggleExpand(node.id);
            }}
            className={cx(
                "flex items-center gap-1 rounded-md py-1.5 pr-2 select-none",
                !active && "hover:bg-secondary",
                state !== "off" && !active && "bg-secondary/40",
                branch && "cursor-pointer",
            )}
            style={{ paddingLeft: 8 + depth * 20, ...(active ? activeRowStyle(PINK) : {}) }}
        >
            {branch ? (
                <button
                    type="button"
                    aria-label={open ? `Collapse ${node.label}` : `Expand ${node.label}`}
                    aria-expanded={open}
                    onClick={() => onToggleExpand(node.id)}
                    className="taxo-arrow rounded p-0.5 text-fg-quaternary hover:bg-tertiary"
                >
                    <ChevronRight className={cx("size-4 transition-transform", open && "rotate-90")} aria-hidden="true" />
                </button>
            ) : (
                <span className="w-5 shrink-0" aria-hidden="true" />
            )}
            <Checkbox
                size="sm"
                aria-label={node.label}
                isSelected={state === "on"}
                isIndeterminate={state === "some"}
                onChange={() => onToggleSelect(node)}
                className="taxo-box shrink-0"
            />
            {/* Text, not a label: clicking it must not select. Double-clicking the row
                — name included — is how you open and close. */}
            <span className={cx("min-w-0 flex-1 truncate text-sm text-secondary", branch && "font-semibold")}>{node.label}</span>
            {branch && (
                <span className="shrink-0 text-xs text-tertiary tabular-nums">
                    {leavesOf(node, query).filter((l) => selected.has(l)).length || ""}
                    <span className="text-quaternary">/{leavesOf(node, query).length}</span>
                </span>
            )}
        </div>
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
    const stripRef = useRef<HTMLDivElement>(null);
    const lifted = useRef(false);
    const listRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const selected = useMemo(() => new Set(value), [value]);
    const allLeaves = useMemo(() => nodes.flatMap((n) => leavesOf(n)), [nodes]);
    const applied = useMemo(() => appliedFor(nodes, selected), [nodes, selected]);
    const anyApplied = applied.whole.length > 0 || applied.partial.length > 0;

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open]);

    const q = query.trim().toLowerCase();
    const shown = q ? nodes.filter((n) => matches(n, q)) : nodes;
    const visibleLeaves = useMemo(() => new Set(shown.flatMap((n) => leavesOf(n, q))), [shown, q]);
    const flat = useMemo(() => flatten(shown, expanded, q), [shown, expanded, q]);
    /** A list of regions is short; a list of regions with one twirled down is not. */
    const anyOpen = flat.some((r) => r.open);
    /** Leaves a search is showing — the honest answer to "how many results". */
    const matchedLeaves = q ? visibleLeaves.size : allLeaves.length;

    /**
     * Freeze the chip strip at the height it had when the panel opened.
     *
     * Written straight onto the element rather than held in state: it is a
     * measurement, it changes nothing else on the screen, and routing it through a
     * render would re-measure the thing it had just resized.
     */
    useLayoutEffect(() => {
        const el = stripRef.current;
        if (!el) return;
        if (!open) {
            el.style.height = "";
            return;
        }
        el.style.height = "";
        el.style.height = `${Math.max(el.offsetHeight, STRIP_FLOOR)}px`;
    }, [open]);

    /**
     * Opening the first region lifts the picker near the top of the window.
     *
     * A layout effect, and an instant scroll, both deliberately: `usePanelPlacement`
     * runs straight after this one and measures where the panel has ended up. A smooth
     * scroll finishes long after that, so placement would decide against the old
     * position and flip a list upwards that was about to have plenty of room below.
     *
     * Once per opening. `lifted` is the guard; without it, collapsing and reopening a
     * region would drag the page about every single time.
     */
    useLayoutEffect(() => {
        if (!open) {
            lifted.current = false;
            return;
        }
        if (!anyOpen || lifted.current) return;
        const el = box.current;
        if (!el) return;
        lifted.current = true;
        const target = window.scrollY + el.getBoundingClientRect().top - window.innerHeight * TOP_OFFSET;
        window.scrollTo(0, Math.max(0, target));
    }, [open, anyOpen]);

    // Placed after `anyOpen`: twirling a region down makes the panel taller, and the
    // placement has to be reconsidered or a grown list runs off the bottom of the window.
    usePanelPlacement(open, panelRef, anyOpen ? "tall" : "short");
    useScrollLock(open, panelRef);

    /**
     * Ticking a branch takes all of it; unticking takes all of it away. Either way it
     * opens, and never closes — see the note at the top of the file.
     */
    const toggleNode = (node: TaxonomyNode) => {
        const leaves = leavesOf(node, q);
        const turnOff = stateOf(node, selected, q) === "on";
        const next = new Set(selected);
        leaves.forEach((l) => (turnOff ? next.delete(l) : next.add(l)));
        onChange(allLeaves.filter((l) => next.has(l)));
        if (node.children?.length) setExpanded((prev) => (prev.has(node.id) ? prev : new Set(prev).add(node.id)));
    };

    const toggleExpand = (id: string) =>
        setExpanded((prev) => {
            const next = new Set(prev);
            if (!next.delete(id)) next.add(id);
            return next;
        });

    // The query is the only thing that re-orders the list from the top. Opening a
    // branch inserts rows *below* the highlighted one, so its index still points at
    // the same row — and resetting here would throw the highlight back to AFRICA every
    // time you pressed Enter on something further down.
    const cursor = useListCursor({
        length: flat.length,
        resetKey: q,
        listRef,
        isOpen: open,
        onOpen: () => setOpen(true),
        onEnter: (i) => toggleNode(flat[i].node),
        extraKeys: (e, active) => {
            if (e.key === "Escape") {
                setOpen(false);
                return true;
            }
            const row = flat[active];
            // Right opens a branch, Left closes it — the one tree convention everybody
            // already knows. While searching every branch is forced open, so Left is
            // simply inert rather than fighting the filter.
            if (e.key === "ArrowRight" && row?.branch && !row.open) {
                e.preventDefault();
                toggleExpand(row.node.id);
                return true;
            }
            if (e.key === "ArrowLeft" && row?.open) {
                e.preventDefault();
                toggleExpand(row.node.id);
                return true;
            }
            return false;
        },
    });

    const remove = (id: string) => onChange(value.filter((v) => v !== id));
    const removeIds = (ids: string[]) => onChange(value.filter((v) => !ids.includes(v)));

    return (
        <div ref={box} className="flex flex-col gap-1.5" onKeyDownCapture={cursor.onKeyDown}>
            <div className="relative">
                {/* A border, not an inset ring: an inset ring is painted beneath child
                    backgrounds, so the scrolling chip area drew straight over the focus
                    outline. The focus state is an outline, which sits outside the box and
                    cannot be overlapped, and overflow-hidden keeps chips inside the radius. */}
                <div
                    className="flex w-full flex-col overflow-hidden rounded-lg border border-secondary bg-primary shadow-xs"
                    style={open ? { outline: `2px solid ${PINK}` } : undefined}
                >
                    {(anyApplied || open) && (
                        <div ref={stripRef} className={cx("flex flex-col gap-2 overflow-y-auto overscroll-contain p-2", open ? "min-h-10" : "max-h-60")}>
                            {applied.whole.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {/* "(All)" so a region chip can't be mistaken for a place
                                        that happens to share the region's name. */}
                                    {applied.whole.map((w) => (
                                        <KeywordChip key={w.id} value={`${w.label} (All)`} onRemove={() => removeIds(w.ids)} />
                                    ))}
                                </div>
                            )}
                            {!anyApplied && <span className="px-0.5 text-sm text-placeholder">Nothing selected yet — pick a region or a country below.</span>}
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
                    <div className={cx("flex items-center gap-2 px-3 py-2", (anyApplied || open) && "border-t border-secondary")}>
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
                    <div ref={panelRef} className="absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-xl bg-primary shadow-lg ring-1 ring-secondary">
                        <div className="flex items-center justify-between gap-3 border-b border-secondary px-3 py-2">
                            <span className="flex items-baseline gap-2">
                                <span className="text-xs font-semibold text-tertiary uppercase">{label}</span>
                                <span className="text-xs font-medium text-tertiary tabular-nums">{resultCount(matchedLeaves, allLeaves.length, noun, Boolean(q))}</span>
                            </span>
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
                        <div ref={listRef} className={cx("overflow-y-auto overscroll-contain py-1", anyOpen ? "max-h-[28rem]" : "max-h-72")}>
                            {flat.length === 0 ? (
                                <p className="px-3 py-6 text-center text-sm text-tertiary">Nothing matches “{query}”.</p>
                            ) : (
                                flat.map((row, i) => (
                                    <Row
                                        key={`${row.node.id}-${row.depth}`}
                                        row={row}
                                        selected={selected}
                                        query={q}
                                        active={i === cursor.active}
                                        onHover={() => cursor.move(i)}
                                        onToggleExpand={toggleExpand}
                                        onToggleSelect={toggleNode}
                                    />
                                ))
                            )}
                        </div>
                        <div className="border-t border-secondary px-3 py-2">
                            <KeyHint extra="click a country to add it · click a region to open it, double-click to close · → ← also work" />
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
