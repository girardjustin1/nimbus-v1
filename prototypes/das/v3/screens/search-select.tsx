import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus, SearchLg, XClose } from "@untitledui/icons";
import { Button } from "./type-rules";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { useCopy } from "./copy-deck";
import { Copy } from "./copy-deck-ui";
import { PINK, TEAL } from "./das-shell";
import { type ListCursor, activeRowStyle, resultCount, useListCursor } from "./arrow-keys";
import { usePanelPlacement } from "./panel-placement";
import { useScrollLock } from "./scroll-lock";

/**
 * Search and select — Kristen's name for it, on 2 Oct.
 *
 * Six places in setup pull from a list the publisher has already built: Add to existing
 * deal, Priority, Geos, Apps, Keywords and Creative. Today each one does it differently,
 * and two of them assume you will browse. Her objection was concrete rather than
 * aesthetic: Locket Labs has about 150 assets, a publisher can have a thousand apps, and
 * nobody is going to scroll that. "I'm not going to look through any list at all. I'm
 * going to do a type ahead and then it's going to filter down my giant list for me."
 *
 * So the pattern is: type first, choose from what matched, and see what you have chosen
 * in a table underneath — not as chips. Chips were fine for five keywords and stop being
 * fine at fifty; a table also has room for the columns that make the choice, like
 * whether a keyword is actually arriving in traffic.
 *
 * Type-ahead is the default, not the only way in. Clicking the field — or pressing
 * Down on it — opens the whole library, alphabetically, because "I don't know what
 * it's called" is a real state and the answer to it cannot be "then you can't have
 * it". The list scrolls rather than truncating, and the header says how many rows are
 * under you, so browsing stays a choice you make knowing the size of the thing.
 *
 * Two entry points are offered here because the right one is a judgement call and she
 * asked for a recommendation rather than a menu. `InlineSearchSelect` keeps everything
 * on the page; `ModalSearchSelect` puts the search behind a button. Both end in the same
 * table, so switching between them later costs nothing. `SingleSearchSelect` is the
 * one-and-only-one variant, for Add to existing deal.
 */

export interface SelectableRow {
    id: string;
    label: string;
    /** Secondary line under the label in the results list. */
    meta?: string;
    /** Rendered at the right of a result row — a status, a count, a preview. */
    trailing?: ReactNode;
    /** Blocks selection, with the reason as a tooltip. */
    disabledReason?: string;
}

/**
 * A ceiling, not a page size. Every match renders and the list scrolls; this only stops
 * a library that has grown past anything we have seen from locking the tab up. If a real
 * publisher ever hits it, the fix is to virtualise the list, not to lower the number.
 */
const MAX_RENDERED = 200;

const matches = (row: SelectableRow, q: string) => `${row.label} ${row.meta ?? ""}`.toLowerCase().includes(q);

/**
 * How good a match is, lowest first. Type "z" and you mean Zero Spend Winback, not
 * PuZZle Players; type "d" and you mean the two deals called D-something, not the
 * forty-eight whose id happens to begin "D-". A plain substring filter gets both of
 * those backwards, and the row you wanted is the one you have to scroll for.
 *
 * Four bands, because that is as much as the distinction is worth here:
 *   0  the name starts with it
 *   1  a word in the name starts with it
 *   2  the name contains it somewhere
 *   3  only the secondary line matched — an id, an ad type, a campaign count
 */
const rank = (row: SelectableRow, q: string) => {
    const label = row.label.toLowerCase();
    if (label.startsWith(q)) return 0;
    if (label.split(/[^a-z0-9]+/).some((word) => word.startsWith(q))) return 1;
    return label.includes(q) ? 2 : 3;
};

/**
 * What a query actually shows. The rendered list and the arrow keys both read this, so
 * "the next one down" can never mean a row other than the one you are looking at.
 */
const byName = (a: SelectableRow, b: SelectableRow) => a.label.localeCompare(b.label, "en", { numeric: true, sensitivity: "base" });

const hitsFor = (rows: SelectableRow[], query: string, browsing: boolean) => {
    const q = query.trim().toLowerCase();
    // A copy, always: `rows` belongs to the caller and these lists get sorted.
    const hits = q ? rows.filter((r) => matches(r, q)) : browsing ? [...rows] : [];
    /**
     * Browsing is alphabetical, full stop — there is no query to be relevant to, and a
     * list you are scanning rather than filtering has exactly one useful order.
     * Searching ranks first and alphabetises inside each band, so "z" still puts Zero
     * Spend Winback at the top instead of burying it under every row with a z in its id.
     */
    hits.sort(q ? (a, b) => rank(a, q) - rank(b, q) || byName(a, b) : byName);
    return { q, hits, shown: hits.slice(0, MAX_RENDERED) };
};

const pickable = (row: SelectableRow | undefined, chosen: Set<string>) => Boolean(row) && !chosen.has(row!.id) && !row!.disabledReason;

/** Closes the panel on a click anywhere outside it. */
const useClickAway = (open: boolean, close: () => void) => {
    const box = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) close();
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [open, close]);
    return box;
};

/* ------------------------------------------------------- The panel chrome --- */

/** The count lives here, in the panel's own header, where it answers "how long is this?". */
const PanelHeader = ({ label, matched, total, noun, filtering }: { label: string; matched: number; total: number; noun: string; filtering: boolean }) => (
    <div className="flex items-center justify-between gap-3 border-b border-secondary px-4 py-2">
        <span className="text-md font-semibold text-tertiary uppercase">
            <Copy>{label}</Copy>
        </span>
        <span className="text-md font-medium text-tertiary tabular-nums">
            <Copy>{resultCount(matched, total, noun, filtering)}</Copy>
        </span>
    </div>
);

/* ------------------------------------------------------------ Results list --- */

const Results = ({
    shown,
    hits,
    query,
    chosen,
    onPick,
    cursor,
    listRef,
    showTrailing = true,
}: {
    shown: SelectableRow[];
    hits: SelectableRow[];
    query: string;
    chosen: Set<string>;
    onPick: (row: SelectableRow) => void;
    cursor: ListCursor;
    listRef: React.RefObject<HTMLDivElement | null>;
    showTrailing?: boolean;
}) => {
    const copy = useCopy();
    if (shown.length === 0)
        return (
            <div className="px-4 py-6 text-center text-md text-tertiary">
                <Copy>{`Nothing matches “${query}”.`}</Copy>
            </div>
        );
    return (
        <>
            <div ref={listRef} className="max-h-72 overflow-y-auto overscroll-contain">
                <ul className="divide-y divide-secondary">
                    {shown.map((row, i) => {
                        const already = chosen.has(row.id);
                        const blocked = Boolean(row.disabledReason);
                        const active = i === cursor.active;
                        return (
                            <li key={row.id}>
                                <button
                                    type="button"
                                    data-active={active}
                                    disabled={already || blocked}
                                    title={row.disabledReason && copy.text(row.disabledReason)}
                                    onMouseMove={() => cursor.move(i)}
                                    onClick={() => onPick(row)}
                                    style={active ? activeRowStyle(PINK) : undefined}
                                    className={cx(
                                        "flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors",
                                        already || blocked ? "cursor-not-allowed opacity-50" : !active && "hover:bg-secondary",
                                    )}
                                >
                                    <span className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate text-md font-medium text-primary">{row.label}</span>
                                        {row.meta && <span className="truncate text-md text-tertiary">{row.meta}</span>}
                                    </span>
                                    {showTrailing && row.trailing}
                                    <span className="shrink-0 text-md font-semibold" style={{ color: already ? "#98A2B3" : PINK }}>
                                        {already ? <Copy>Added</Copy> : blocked ? "—" : <Copy>Add</Copy>}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {hits.length > shown.length && (
                <p className="border-t border-secondary px-4 py-2 text-md text-tertiary">
                    <Copy>{`Showing the first ${shown.length} of ${hits.length}. Keep typing to narrow it.`}</Copy>
                </p>
            )}
        </>
    );
};

/** The one line everybody needs and nobody is told: the keys work. */
export const KeyHint = ({ className, extra }: { className?: string; extra?: string }) => (
    <span className={cx("text-md text-quaternary", className)}>
        <Copy>{`↑ ↓ to move · Enter to select · Esc to close${extra ? ` · ${extra}` : ""}`}</Copy>
    </span>
);

/* --------------------------------------------------------- Chosen, as rows --- */

export const ChosenTable = ({
    rows,
    columns,
    onRemove,
    empty,
}: {
    rows: { id: string; cells: ReactNode[]; invalid?: boolean }[];
    columns: string[];
    onRemove: (id: string) => void;
    empty: ReactNode;
}) => {
    if (rows.length === 0)
        return (
            <div className="rounded-xl border border-dashed border-secondary px-6 py-8 text-center text-md text-tertiary">
                {/* Callers pass a literal or their own <Copy>; only the literal is wrapped here, so nothing is marked twice. */}
                {typeof empty === "string" ? <Copy>{empty}</Copy> : empty}
            </div>
        );
    return (
        <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
            <table className="w-full">
                <thead className="bg-secondary">
                    <tr>
                        {columns.map((c, i) => (
                            // By position: headers can repeat (one is blank) and callers may pass "" when copy is hidden.
                            <th key={i} className="px-4 py-2.5 text-left text-md font-semibold text-tertiary">
                                <Copy>{c}</Copy>
                            </th>
                        ))}
                        <th className="w-10 px-4 py-2.5" />
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.id} className={cx("border-t border-secondary", r.invalid && "bg-error-primary")}>
                            {r.cells.map((cell, i) => (
                                <td key={i} className="px-4 py-3 text-md text-secondary">
                                    {cell}
                                </td>
                            ))}
                            <td className="px-4 py-3 text-right">
                                <button
                                    type="button"
                                    aria-label={`Remove ${r.id}`}
                                    onClick={() => onRemove(r.id)}
                                    className="rounded p-1 text-fg-quaternary hover:bg-secondary hover:text-primary"
                                >
                                    <XClose className="size-4" aria-hidden="true" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/* ------------------------------------------------------------------- A --- */

/**
 * Proposal A — the search sits on the page.
 *
 * Nothing is hidden behind a button: you land on the section, type, and the matches
 * appear directly beneath the field. Fewest clicks, and the thing you are building
 * stays visible the whole time.
 *
 * The cost is vertical space, and a results list that overlaps what is below it while
 * open.
 */
export const InlineSearchSelect = ({
    label,
    placeholder,
    rows,
    chosenIds,
    onPick,
    noun,
    createLabel,
    onCreate,
    maxTrailing,
}: {
    label: string;
    placeholder: string;
    rows: SelectableRow[];
    chosenIds: string[];
    onPick: (row: SelectableRow) => void;
    noun: string;
    /** The "I haven't made this yet" escape hatch, e.g. "Add keyword". */
    createLabel?: string;
    onCreate?: () => void;
    /**
     * The most rows that may draw their `trailing` slot. Above it the slot is dropped
     * and the search is left to do its job. Creative sets it: the preview is the one
     * thing in a row that costs something to draw, and drawing fifty of them on the
     * letter "a" is exactly what the search was meant to stop. Omit for no ceiling —
     * a status chip or a count is free.
     */
    maxTrailing?: number;
}) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const copy = useCopy();
    const chosen = useMemo(() => new Set(chosenIds), [chosenIds]);
    const box = useClickAway(open, () => setOpen(false));
    const listRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    usePanelPlacement(open, panelRef);
    useScrollLock(open, panelRef);

    const { q, hits, shown } = hitsFor(rows, query, open);
    const cursor = useListCursor({
        length: shown.length,
        resetKey: q,
        listRef,
        isOpen: open,
        onOpen: () => setOpen(true),
        isPickable: (i) => pickable(shown[i], chosen),
        onEnter: (i) => onPick(shown[i]),
        extraKeys: (e) => {
            if (e.key !== "Escape") return false;
            setOpen(false);
            return true;
        },
    });

    return (
        <div ref={box} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-end gap-3">
                <div className="relative min-w-56 flex-1" onKeyDownCapture={cursor.onKeyDown}>
                    <Input
                        aria-label={label}
                        size="md"
                        icon={SearchLg}
                        className={copy.mark({ placeholder: [placeholder] })}
                        placeholder={copy.text(placeholder)}
                        value={query}
                        onFocus={() => setOpen(true)}
                        onChange={(next) => {
                            setQuery(next);
                            setOpen(true);
                        }}
                    />
                    {open && (
                        <div ref={panelRef} className="absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-xl bg-primary shadow-lg ring-1 ring-secondary">
                            <PanelHeader label={label} matched={hits.length} total={rows.length} noun={noun} filtering={Boolean(q)} />
                            <Results
                                shown={shown}
                                hits={hits}
                                query={query}
                                chosen={chosen}
                                onPick={onPick}
                                cursor={cursor}
                                listRef={listRef}
                                showTrailing={maxTrailing === undefined || hits.length <= maxTrailing}
                            />
                            <div className="flex items-center justify-between gap-3 border-t border-secondary px-4 py-2">
                                <KeyHint />
                                {createLabel && onCreate && (
                                    <button type="button" onClick={onCreate} className="text-md font-semibold uppercase" style={{ color: PINK }}>
                                        <Copy>{createLabel}</Copy>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                {createLabel && onCreate && (
                    <Button color="secondary" iconLeading={Plus} className="uppercase" onClick={onCreate}>
                        <Copy>{createLabel}</Copy>
                    </Button>
                )}
            </div>
            <span className="text-md text-tertiary">
                <Copy>
                    {q
                        ? `${hits.length} of ${rows.length} ${noun} match “${query}”.`
                        : `${rows.length} ${noun} in your library. Type to filter, or press ↓ to see them all.`}
                </Copy>
            </span>
        </div>
    );
};

/* -------------------------------------------------------- One and only one --- */

/**
 * Pick exactly one — Add to existing deal, and anything else that is a choice rather
 * than a basket.
 *
 * The field shows what you chose rather than what you typed, so it reads as a value
 * once it is set. Three deals does not need a type-ahead today; it gets one anyway,
 * because the point of the 2 Oct feedback was that these six controls should not each
 * behave differently, and "it's short for now" is how that happens.
 */
export const SingleSearchSelect = ({
    label,
    placeholder,
    rows,
    value,
    onChange,
    noun,
    isDisabled,
    isInvalid,
    hint,
}: {
    label: string;
    placeholder: string;
    rows: SelectableRow[];
    value?: string;
    onChange: (id: string | undefined) => void;
    noun: string;
    isDisabled?: boolean;
    isInvalid?: boolean;
    hint?: ReactNode;
}) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const copy = useCopy();
    const box = useClickAway(open, () => setOpen(false));
    const listRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    usePanelPlacement(open, panelRef);
    useScrollLock(open, panelRef);
    const current = rows.find((r) => r.id === value);

    const { q, hits, shown } = hitsFor(rows, query, open);

    const choose = (row: SelectableRow) => {
        onChange(row.id);
        setQuery("");
        setOpen(false);
    };

    const cursor = useListCursor({
        length: shown.length,
        resetKey: q,
        listRef,
        isOpen: open,
        onOpen: () => setOpen(true),
        // Opening a field that already says a deal should land on that deal.
        initialIndex: shown.findIndex((r) => r.id === value),
        isPickable: (i) => !shown[i]?.disabledReason,
        onEnter: (i) => choose(shown[i]),
        extraKeys: (e) => {
            if (e.key !== "Escape") return false;
            setQuery("");
            setOpen(false);
            return true;
        },
    });

    return (
        <div ref={box} className="flex flex-col gap-1.5">
            <div className="relative" onKeyDownCapture={cursor.onKeyDown}>
                <Input
                    aria-label={label}
                    size="md"
                    icon={SearchLg}
                    isDisabled={isDisabled}
                    isInvalid={isInvalid}
                    className={copy.mark({ placeholder: [placeholder] })}
                    placeholder={copy.text(placeholder)}
                    value={open ? query : (current?.label ?? "")}
                    onChange={(next) => {
                        setQuery(next);
                        setOpen(true);
                    }}
                />
                {!open && (
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-fg-quaternary" aria-hidden="true" />
                )}
                {open && !isDisabled && (
                    <div ref={panelRef} className="absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-xl bg-primary shadow-lg ring-1 ring-secondary">
                        <PanelHeader label={label} matched={hits.length} total={rows.length} noun={noun} filtering={Boolean(q)} />
                        {shown.length === 0 ? (
                            <div className="px-4 py-6 text-center text-md text-tertiary">
                                <Copy>{`Nothing matches “${query}”.`}</Copy>
                            </div>
                        ) : (
                            <div ref={listRef} className="max-h-72 overflow-y-auto overscroll-contain py-1">
                                {shown.map((row, i) => {
                                    const active = i === cursor.active;
                                    const chosenOne = row.id === value;
                                    return (
                                        <button
                                            key={row.id}
                                            type="button"
                                            data-active={active}
                                            onMouseMove={() => cursor.move(i)}
                                            onClick={() => choose(row)}
                                            style={active ? activeRowStyle(PINK) : undefined}
                                            className={cx("flex w-full flex-col items-start px-4 py-2 text-left", !active && "hover:bg-secondary")}
                                        >
                                            <span className={cx("text-md text-primary", chosenOne && "font-semibold")} style={chosenOne ? { color: TEAL } : undefined}>
                                                {row.label}
                                            </span>
                                            {row.meta && <span className="text-md text-tertiary">{row.meta}</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                        <div className="flex items-center justify-between gap-3 border-t border-secondary px-4 py-2">
                            <KeyHint />
                            {value && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange(undefined);
                                        setQuery("");
                                        setOpen(false);
                                    }}
                                    className="text-md font-semibold text-secondary uppercase hover:text-primary"
                                >
                                    <Copy>Clear</Copy>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            {hint && <span className={cx("text-md", isInvalid ? "text-error-primary" : "text-tertiary")}>{hint}</span>}
        </div>
    );
};

/* ------------------------------------------------------------------- B --- */

/**
 * Proposal B — the search is a modal.
 *
 * The section stays short whatever happens, which matters on a one-page setup with six
 * other sections under it, and the modal has room for checkboxes so you can take several
 * things in one pass and commit them with a button. That button is also the answer to
 * her other complaint about geos: "the fact that to enter is to click somewhere else on
 * the page is just a weird UI."
 *
 * The cost is a click to get started, and the form disappearing behind an overlay.
 */
export const ModalSearchSelect = ({
    title,
    placeholder,
    rows,
    chosenIds,
    onAdd,
    onClose,
    noun,
    createLabel,
    onCreate,
    maxTrailing,
}: {
    title: string;
    placeholder: string;
    rows: SelectableRow[];
    chosenIds: string[];
    onAdd: (picked: SelectableRow[]) => void;
    onClose: () => void;
    noun: string;
    createLabel?: string;
    onCreate?: () => void;
    /** See `InlineSearchSelect`. */
    maxTrailing?: number;
}) => {
    const [query, setQuery] = useState("");
    const [picked, setPicked] = useState<string[]>([]);
    const copy = useCopy();
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const chosen = useMemo(() => new Set(chosenIds), [chosenIds]);
    useScrollLock(true, listRef);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // The list is open the moment the modal is — you came here to look.
    const { q, hits, shown } = hitsFor(rows, query, true);

    const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

    const cursor = useListCursor({
        length: shown.length,
        resetKey: q,
        listRef,
        isPickable: (i) => pickable(shown[i], chosen),
        onEnter: (i) => toggle(shown[i].id),
        extraKeys: (e) => {
            if (e.key !== "Escape") return false;
            onClose();
            return true;
        },
    });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8" onClick={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={(e) => e.stopPropagation()}
                onKeyDownCapture={cursor.onKeyDown}
                className="flex max-h-full w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-secondary px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-extrabold text-primary">
                            <Copy>{title}</Copy>
                        </h2>
                        <p className="text-md text-tertiary">
                            <Copy>{q ? `${hits.length} of ${rows.length} ${noun} match “${query}”.` : `${rows.length} ${noun} in your library.`}</Copy>
                        </p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="border-b border-secondary px-6 py-3">
                    <Input
                        ref={inputRef}
                        aria-label={title}
                        size="md"
                        icon={SearchLg}
                        className={copy.mark({ placeholder: [placeholder] })}
                        placeholder={copy.text(placeholder)}
                        value={query}
                        onChange={setQuery}
                    />
                </div>

                <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    {shown.length === 0 ? (
                        <p className="px-6 py-10 text-center text-md text-tertiary">
                            <Copy>{`Nothing matches “${query}”.`}</Copy>
                        </p>
                    ) : (
                        <ul className="divide-y divide-secondary">
                            {shown.map((row, i) => {
                                const already = chosen.has(row.id);
                                const blocked = Boolean(row.disabledReason);
                                const active = i === cursor.active;
                                return (
                                    <li
                                        key={row.id}
                                        data-active={active}
                                        onMouseMove={() => cursor.move(i)}
                                        style={active ? activeRowStyle(PINK) : undefined}
                                        className={cx("flex items-center gap-3 px-6 py-3", (already || blocked) && "opacity-50")}
                                    >
                                        <Checkbox
                                            size="sm"
                                            aria-label={row.label}
                                            isSelected={already || picked.includes(row.id)}
                                            isDisabled={already || blocked}
                                            onChange={() => toggle(row.id)}
                                        />
                                        <span className="flex min-w-0 flex-1 flex-col">
                                            <span className="truncate text-md font-medium text-primary">{row.label}</span>
                                            {row.meta && <span className="truncate text-md text-tertiary">{row.meta}</span>}
                                        </span>
                                        {(maxTrailing === undefined || hits.length <= maxTrailing) && row.trailing}
                                        {already && (
                                            <span className="shrink-0 text-md font-semibold text-tertiary">
                                                <Copy>Already added</Copy>
                                            </span>
                                        )}
                                        {blocked && (
                                            <span className="shrink-0 text-md font-semibold" style={{ color: "#B54708" }}>
                                                <Copy>{row.disabledReason}</Copy>
                                            </span>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    {hits.length > shown.length && (
                        <p className="border-t border-secondary px-6 py-2 text-md text-tertiary">
                            <Copy>{`Showing the first ${shown.length} of ${hits.length}. Keep typing to narrow it.`}</Copy>
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-secondary px-6 py-4">
                    {createLabel && onCreate ? (
                        <Button color="link-color" iconLeading={Plus} onClick={onCreate}>
                            <Copy>{createLabel}</Copy>
                        </Button>
                    ) : (
                        <KeyHint />
                    )}
                    <div className="flex gap-3">
                        <Button color="secondary" className="uppercase" onClick={onClose}>
                            <Copy>Cancel</Copy>
                        </Button>
                        <Button
                            color="primary-pink"
                            className="uppercase"
                            isDisabled={picked.length === 0}
                            onClick={() => {
                                onAdd(rows.filter((r) => picked.includes(r.id)));
                                onClose();
                            }}
                        >
                            <Copy>{picked.length ? `Add ${picked.length}` : "Add"}</Copy>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/** Shared chrome so both proposals sit in an identically-titled block. */
export const TargetBlock = ({ title, trailing, children }: { title: string; trailing?: ReactNode; children: ReactNode }) => (
    <div className="flex flex-col gap-4 rounded-xl p-5 ring-1 ring-secondary">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-primary">
                <Copy>{title}</Copy>
            </h3>
            {trailing}
        </div>
        {children}
    </div>
);

export const TrafficBadge = ({ seen }: { seen: boolean }) => (
    <span
        className="shrink-0 rounded-md px-2 py-0.5 text-md font-semibold whitespace-nowrap"
        style={seen ? { color: "#1F7F80", backgroundColor: `${TEAL}1f` } : { color: "#B54708", backgroundColor: "#FEF0C7" }}
    >
        <Copy>{seen ? "In traffic" : "Not seen"}</Copy>
    </span>
);
