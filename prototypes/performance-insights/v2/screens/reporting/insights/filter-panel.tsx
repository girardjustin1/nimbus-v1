import { useMemo, useState } from "react";
import { SearchLg } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "../../das-shell";
import { type FilterDim, type FilterState, StateAction, TEAL_DARK } from "../../nimbus-ui";
import { R1 } from "../../round-1";
import { SEARCH_CAP, searchValues } from "./filter-state";

/**
 * Performance Insights · Round 2 · the panel, polished (C7) and search first (C8).
 *
 * The same two panes, Cancel and Save as today's panel, within engineering's rules: custom
 * lists with checkboxes, search and a cap for long lists, no endless scroll.
 *
 *   C7  The category rail counts what is picked in each category. The value pane leads with
 *       search, then Select all (for what the search shows), then the values as checkboxes.
 *       The footer says what is picked in all, and keeps Cancel and Save.
 *   C8  A category with a long list (`top` set) opens on search and its top values. Typing
 *       shows the first matches, up to a cap, and says how many more there are. Picked
 *       values stay listed above, so they can be unpicked without searching again.
 */

export interface PanelDim extends FilterDim {
    /** Search first: the values the list opens on before anything is typed (C8). */
    top?: string[];
}

export const PolishedPanel = ({
    dims,
    draft,
    setDraft,
    cat,
    setCat,
    changed,
    onCancel,
    onSave,
    initialQuery = "",
}: {
    dims: PanelDim[];
    draft: FilterState;
    setDraft: (next: (cur: FilterState) => FilterState) => void;
    cat: string;
    setCat: (id: string) => void;
    changed: boolean;
    onCancel: () => void;
    onSave: () => void;
    initialQuery?: string;
}) => {
    const current = dims.find((d) => d.id === cat) ?? dims[0];
    const [query, setQuery] = useState(initialQuery);
    const picked = draft[current.id]?.values ?? [];
    const searchFirst = Boolean(current.top);

    const listed = useMemo(() => searchValues(current, query), [current, query]);
    const total = Object.values(draft).reduce((n, f) => n + f.values.length, 0);
    const categories = Object.values(draft).filter((f) => f.values.length).length;

    const setPicked = (values: string[]) =>
        setDraft((cur) => {
            const f = cur[current.id] ?? { values: [], off: [] };
            return { ...cur, [current.id]: { values, off: f.off.filter((x) => values.includes(x)) } };
        });
    const pick = (v: string) => setPicked(picked.includes(v) ? picked.filter((x) => x !== v) : [...picked, v]);
    const allShown = listed.values.length > 0 && listed.values.every((v) => picked.includes(v));
    const selectShown = () => setPicked(allShown ? picked.filter((v) => !listed.values.includes(v)) : [...new Set([...picked, ...listed.values])]);
    const switchTo = (id: string) => {
        setCat(id);
        setQuery("");
    };

    // Search first keeps the picks in view; the list below skips them.
    const pinned = searchFirst ? picked : [];
    const rows = searchFirst ? listed.values.filter((v) => !picked.includes(v)) : listed.values;

    return (
        <div className="overflow-hidden rounded-lg bg-primary ring-1 ring-secondary">
            <div className="grid grid-cols-[260px_minmax(0,1fr)]">
                <ul className="max-h-[26rem] overflow-y-auto border-r border-secondary py-2" aria-label="Filter categories">
                    {dims.map((d) => {
                        const on = d.id === current.id;
                        const n = draft[d.id]?.values.length ?? 0;
                        return (
                            <li key={d.id}>
                                <button
                                    type="button"
                                    onClick={() => switchTo(d.id)}
                                    aria-current={on ? "true" : undefined}
                                    className={cx(
                                        "flex w-full items-center justify-between gap-3 border-l-4 px-4 py-2 text-left text-md",
                                        on ? "font-bold" : "border-transparent text-secondary hover:bg-secondary",
                                    )}
                                    style={on ? { color: TEAL_DARK, backgroundColor: `${TEAL}14`, borderLeftColor: TEAL } : undefined}
                                >
                                    <span className="truncate">{d.label}</span>
                                    {n > 0 && (
                                        <span
                                            className="inline-flex min-w-6 shrink-0 items-center justify-center rounded-full px-1.5 tabular-nums"
                                            style={{ ...R1.checkboxText, color: "#FFFFFF", backgroundColor: TEAL_DARK, height: 22 }}
                                        >
                                            {n}
                                        </span>
                                    )}
                                </button>
                            </li>
                        );
                    })}
                </ul>

                <div className="flex min-w-0 flex-col">
                    <div className="flex flex-col gap-3 border-b border-secondary px-4 pt-3 pb-3">
                        <div className="flex items-baseline justify-between gap-4">
                            <span className="text-md font-bold text-primary">
                                {current.label}
                                <span className="ml-2 font-semibold text-tertiary tabular-nums">
                                    {picked.length > 0
                                        ? `${picked.length} picked`
                                        : searchFirst
                                          ? `${current.values.length.toLocaleString("en-US")} values`
                                          : `${current.values.length} values`}
                                </span>
                            </span>
                            {picked.length > 0 && (
                                <button type="button" onClick={() => setPicked([])} className="text-md font-semibold underline" style={{ color: PINK }}>
                                    Clear Selections
                                </button>
                            )}
                        </div>
                        <label className="relative flex items-center">
                            <SearchLg className="pointer-events-none absolute left-3 size-5 text-fg-quaternary" aria-hidden="true" />
                            <input
                                type="search"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                autoFocus={searchFirst}
                                placeholder={
                                    searchFirst
                                        ? `Search ${current.values.length.toLocaleString("en-US")} ${current.label.toLowerCase()}s`
                                        : `Search ${current.label}`
                                }
                                aria-label={`Search ${current.label}`}
                                className="h-10 w-full rounded-md bg-secondary pr-3 pl-10 text-md text-primary outline-focus-ring placeholder:text-placeholder focus-visible:outline-2"
                            />
                        </label>
                    </div>

                    <div
                        className="max-h-[19rem] overflow-y-auto px-4 py-2"
                        style={{ ["--background-color-brand-solid" as string]: TEAL, ["--border-color-brand-solid" as string]: TEAL }}
                    >
                        {pinned.length > 0 && (
                            <div className="flex flex-col gap-2 border-b border-secondary pt-1 pb-3">
                                <span className="text-md font-semibold text-tertiary">Picked</span>
                                {pinned.map((v) => (
                                    <Checkbox key={v} size="md" label={<span style={R1.checkboxText}>{v}</span>} isSelected onChange={() => pick(v)} />
                                ))}
                            </div>
                        )}

                        {searchFirst && !query && (
                            <div className="pt-3 pb-1 text-md font-semibold text-tertiary">Top {current.label.toLowerCase()}s by revenue</div>
                        )}

                        {!searchFirst && rows.length > 1 && (
                            <div className="border-b border-secondary py-2">
                                <Checkbox
                                    size="md"
                                    label={<span className="text-md font-bold text-primary">{query ? `Select all ${rows.length} shown` : "Select all"}</span>}
                                    isSelected={allShown}
                                    isIndeterminate={!allShown && rows.some((v) => picked.includes(v))}
                                    onChange={selectShown}
                                />
                            </div>
                        )}

                        <div className={cx("flex flex-col gap-2 py-2", !searchFirst && current.values.length > 8 && "grid grid-cols-2 gap-x-6")}>
                            {rows.map((v) => (
                                <Checkbox
                                    key={v}
                                    size="md"
                                    label={<span style={R1.checkboxText}>{v}</span>}
                                    isSelected={picked.includes(v)}
                                    onChange={() => pick(v)}
                                />
                            ))}
                        </div>

                        {rows.length === 0 && (
                            <p className="py-3 text-md text-tertiary">
                                No {current.label.toLowerCase()} matches “{query}”.
                            </p>
                        )}

                        {searchFirst && (
                            <p className="py-2 text-md text-tertiary">
                                {query
                                    ? listed.more > 0
                                        ? `First ${SEARCH_CAP} of ${(listed.more + SEARCH_CAP).toLocaleString("en-US")} matches. Keep typing to narrow it.`
                                        : null
                                    : `Showing the top ${current.top!.length} of ${current.values.length.toLocaleString("en-US")}. Search to reach the rest.`}
                            </p>
                        )}
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-secondary px-4 py-3">
                <span className="mr-auto text-md font-semibold text-tertiary">
                    {total === 0 ? "Nothing picked" : `${total} picked in ${categories} ${categories === 1 ? "category" : "categories"}`}
                    {changed && " · not saved yet"}
                </span>
                <StateAction quiet onPress={onCancel}>
                    Cancel
                </StateAction>
                <StateAction disabled={!changed} onPress={onSave}>
                    Save
                </StateAction>
            </div>
        </div>
    );
};
