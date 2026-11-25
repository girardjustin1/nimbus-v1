import { useState } from "react";
import { ChevronRight, Plus, XClose } from "@untitledui/icons";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "../../das-shell";
import { type FilterState, StateAction, TEAL_DARK } from "../../nimbus-ui";
import { R1 } from "../../round-1";
import { type PanelDim, PolishedPanel } from "./filter-panel";
import { type BandLook, bandCounts, searchValues } from "./filter-state";
import { ValueText } from "./value-tag";

/**
 * Performance Insights · Round 2 · the filter band concepts (24 Nov PI sync).
 *
 * Built on engineering's model for the band, which the control (nimbus-ui FilterControl)
 * already follows: Save in the panel builds the chips; a chip's checkbox takes it in or out
 * of the query and leaves it on the row; Clear all removes every chip. Same FilterState.
 *
 *   C1 "tight"  Restyle. + Filter is always the first item; each category is one bordered
 *               group of its values on a fixed grid; Clear all ends the row. A category with
 *               more than three values shows three and “+N”, which opens the panel there.
 *   C2 "chips"  Rework. One rule for every chip: the checkbox applies it, × removes it, and
 *               a category's name opens the panel to edit it. A category can be paused down
 *               to nothing (it then filters nothing), instead of the control's “last value
 *               stays on”. The row says how many filters the report is using.
 *   C3          Both looks share one panel with the whole flow: add, edit a category from
 *               its chip, Cancel (the draft is dropped), Save, Clear Selections.
 *
 * The two-pane panel is today's (category rail, values, Cancel / Save); C7 polishes it.
 */

/** Shapes shared by every chip, so the row sits on one grid. */
const CHIP_H = "h-9";

const FilterButton = ({ open, onPress }: { open: boolean; onPress: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        aria-expanded={open}
        className={cx(CHIP_H, "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 transition duration-100 ease-linear hover:bg-secondary")}
        style={{ ...R1.button, color: PINK, boxShadow: `inset 0 0 0 1px ${PINK}66` }}
    >
        <Plus className="size-4" aria-hidden="true" /> Filter
    </button>
);

const ClearAll = ({ onPress }: { onPress: () => void }) => (
    <button type="button" onClick={onPress} className="ml-auto shrink-0 text-md font-bold underline" style={{ color: PINK }}>
        Clear all
    </button>
);

export const FilterBand = ({
    look,
    dims,
    value,
    onChange,
    openOn,
    panel = "today",
    panelQuery,
}: {
    look: BandLook;
    dims: PanelDim[];
    value: FilterState;
    onChange: (next: FilterState) => void;
    /** Opens the panel on this category when the screen loads (for the flow's states). */
    openOn?: string;
    /** Today's two-pane panel, or C7's polished one (which does C8's search first). */
    panel?: "today" | "polished";
    /** A search already typed in the polished panel (C8 states). */
    panelQuery?: string;
}) => {
    const [open, setOpen] = useState(Boolean(openOn));
    const [draft, setDraft] = useState<FilterState>(value);
    const [cat, setCat] = useState(openOn ?? dims[0]?.id);
    const [query, setQuery] = useState("");
    const current = dims.find((d) => d.id === cat) ?? dims[0];
    const shown = dims.filter((d) => value[d.id]?.values.length);
    const { chips, applied } = bandCounts(value);

    const openPanel = (on?: string) => {
        setDraft(value);
        setCat(on ?? dims[0]?.id);
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
        // C1 keeps the control's rule (the last value on stays on); C2 lets a category pause.
        if (look === "tight" && off.length >= f.values.length) return;
        onChange({ ...value, [dim]: { ...f, off } });
    };
    const remove = (dim: string, v?: string) => {
        const f = value[dim];
        const values = v ? f.values.filter((x) => x !== v) : [];
        const next = { ...value, [dim]: { values, off: f.off.filter((x) => values.includes(x)) } };
        onChange(Object.fromEntries(Object.entries(next).filter(([, x]) => x.values.length)));
    };
    const changed = JSON.stringify(draft) !== JSON.stringify(value);
    const save = () => {
        onChange(Object.fromEntries(Object.entries(draft).filter(([, f]) => f.values.length)));
        setOpen(false);
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
                <FilterButton open={open} onPress={() => (open ? setOpen(false) : openPanel())} />

                {look === "tight" &&
                    shown.map((d) => {
                        const f = value[d.id];
                        const extra = f.values.length - 3;
                        return (
                            <span
                                key={d.id}
                                className={cx(CHIP_H, "inline-flex items-center gap-4 rounded-full px-4 ring-1 ring-secondary [&>label]:gap-2")}
                                role="group"
                                aria-label={`${d.label} filter`}
                            >
                                <span className="text-md font-semibold text-tertiary">{d.label}</span>
                                {f.values.slice(0, 3).map((v) => (
                                    <Checkbox
                                        key={v}
                                        size="sm"
                                        label={<span style={R1.checkboxText}>{v}</span>}
                                        isSelected={!f.off.includes(v)}
                                        onChange={() => toggle(d.id, v)}
                                    />
                                ))}
                                {extra > 0 && (
                                    <button type="button" onClick={() => openPanel(d.id)} className="text-md font-bold" style={{ color: TEAL_DARK }}>
                                        +{extra}
                                    </button>
                                )}
                            </span>
                        );
                    })}

                {look === "chips" &&
                    shown.map((d) => {
                        const f = value[d.id];
                        const paused = f.values.every((v) => f.off.includes(v));
                        return (
                            <span key={d.id} className="inline-flex flex-wrap items-center gap-1.5" role="group" aria-label={`${d.label} filter`}>
                                <button
                                    type="button"
                                    onClick={() => openPanel(d.id)}
                                    title={`Edit ${d.label}`}
                                    className={cx(
                                        CHIP_H,
                                        "rounded-full px-3 text-md font-bold hover:bg-secondary",
                                        paused ? "text-quaternary line-through" : "text-primary",
                                    )}
                                >
                                    {d.label}
                                </button>
                                {f.values.map((v) => {
                                    const on = !f.off.includes(v);
                                    return (
                                        <span
                                            key={v}
                                            className={cx(
                                                CHIP_H,
                                                "inline-flex items-center gap-1 rounded-full pr-1 pl-3 transition duration-100 ease-linear [&>label]:gap-2",
                                            )}
                                            style={
                                                on
                                                    ? { backgroundColor: `${TEAL}1f`, boxShadow: `inset 0 0 0 1px ${TEAL}66` }
                                                    : { backgroundColor: "#FFFFFF", boxShadow: "inset 0 0 0 1px #D0D5DD", opacity: 0.7 }
                                            }
                                        >
                                            <Checkbox
                                                size="sm"
                                                aria-label={`${on ? "Pause" : "Apply"} ${d.label}: ${v}`}
                                                label={
                                                    <span style={{ ...R1.checkboxText, color: on ? TEAL_DARK : undefined }}>
                                                        <ValueText value={v} />
                                                    </span>
                                                }
                                                isSelected={on}
                                                onChange={() => toggle(d.id, v)}
                                            />
                                            <button
                                                type="button"
                                                aria-label={`Remove ${d.label}: ${v}`}
                                                title="Remove"
                                                onClick={() => remove(d.id, v)}
                                                className="rounded-full p-1 text-fg-quaternary hover:bg-primary hover:text-fg-secondary"
                                            >
                                                <XClose className="size-4" aria-hidden="true" />
                                            </button>
                                        </span>
                                    );
                                })}
                            </span>
                        );
                    })}

                {chips > 0 && (
                    <>
                        {look === "chips" && (
                            <span className="ml-auto text-md font-semibold whitespace-nowrap text-tertiary">
                                {applied === chips ? `${chips} applied` : `${applied} of ${chips} applied`}
                            </span>
                        )}
                        <span className={look === "chips" ? "" : "ml-auto"}>
                            <ClearAll onPress={() => onChange({})} />
                        </span>
                    </>
                )}
            </div>

            {open && current && panel === "polished" && (
                <PolishedPanel
                    dims={dims}
                    draft={draft}
                    setDraft={setDraft}
                    cat={current.id}
                    setCat={setCat}
                    changed={changed}
                    onCancel={() => setOpen(false)}
                    onSave={save}
                    initialQuery={panelQuery}
                />
            )}

            {open && current && panel === "today" && (
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
                                            onClick={() => {
                                                setCat(d.id);
                                                setQuery("");
                                            }}
                                            aria-current={on ? "true" : undefined}
                                            className={cx(
                                                "flex w-full items-center justify-between px-4 py-2 text-left text-md",
                                                on ? "font-bold" : "text-secondary hover:bg-secondary",
                                            )}
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
                            {current.values.length > 7 && (
                                <input
                                    type="search"
                                    aria-label={`Search ${current.label}`}
                                    placeholder="Search"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="mx-4 my-2 h-11 max-w-[530px] rounded-md border border-[#efedec] px-4 text-md text-primary outline-none placeholder:text-[#c4c4c4] focus:border-[#7bcacd]"
                                />
                            )}
                            <ul className="max-h-72 overflow-y-auto py-1" aria-label={`${current.label} values`}>
                                {searchValues({ values: current.values }, query).values.map((v) => {
                                    const chosen = draft[current.id]?.values.includes(v) ?? false;
                                    return (
                                        <li key={v}>
                                            <button
                                                type="button"
                                                aria-pressed={chosen}
                                                onClick={() => pick(current.id, v)}
                                                className={cx(
                                                    "w-full px-4 py-2 text-left text-md",
                                                    chosen ? "font-semibold" : "text-secondary hover:bg-secondary",
                                                )}
                                                style={chosen ? { color: TEAL_DARK, backgroundColor: `${TEAL}1f` } : undefined}
                                            >
                                                <ValueText value={v} />
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                            {searchValues({ values: current.values }, query).more > 0 && (
                                <p className="border-t border-secondary px-4 py-2 text-md text-tertiary">
                                    Showing 1,000 of {(1000 + searchValues({ values: current.values }, query).more).toLocaleString("en-US")}. Search to find the
                                    rest.
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 border-t border-secondary px-4 py-3">
                        {changed && <span className="mr-auto text-md font-semibold text-tertiary">Not saved yet</span>}
                        <StateAction quiet onPress={() => setOpen(false)}>
                            Cancel
                        </StateAction>
                        <StateAction disabled={!changed} onPress={save}>
                            Save
                        </StateAction>
                    </div>
                </div>
            )}
        </div>
    );
};
