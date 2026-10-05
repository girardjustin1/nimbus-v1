import type { ReactNode } from "react";
import { ChevronDown } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { type CopySet, type NewView, PINK, fate, setCopySet, setNewView, useCopySet, useNewView } from "./copy-deck";

/** The rendering half of the copy deck — see ./copy-deck for what the modes mean. */

const markClass = "rounded-[3px] [box-decoration-break:clone]";
const markStyle = { backgroundColor: `${PINK}2e`, color: "inherit" } as const;

/**
 * One piece of copy. `children` is Prototype 3's wording; `original` is staging's, when
 * staging has one. Pass `original={children}` when the two are identical.
 */
export const Copy = ({ children, original }: { children: ReactNode; original?: string }) => {
    const set = useCopySet();
    const view = useNewView();
    const text = typeof children === "string" ? children : undefined;
    switch (fate(set, view, text, original)) {
        case "hide":
            return null;
        case "original":
            return <>{original}</>;
        case "mark-new":
            return (
                <mark className={markClass} style={markStyle} title="New — not on staging">
                    {children}
                </mark>
            );
        case "mark-reworded":
            return (
                <mark className={cx(markClass, "underline decoration-dotted underline-offset-4")} style={markStyle} title={`On staging: ${original}`}>
                    {children}
                </mark>
            );
        default:
            return <>{children}</>;
    }
};

/* ------------------------------------------------------------- Toolbar --- */

const sets: { id: CopySet; label: string; title: string }[] = [
    { id: "original", label: "Original", title: "Staging's copy only — anything staging has no copy for is left out" },
    { id: "new", label: "New", title: "Prototype 3's copy, as built" },
];

const views: { id: NewView; label: string }[] = [
    { id: "plain", label: "Show all" },
    { id: "highlight", label: "Highlight new" },
    { id: "hide", label: "Hide new" },
];

const segment = (active: boolean) =>
    `rounded px-2 py-0.5 text-xs font-semibold transition-colors ${active ? "bg-white text-[#101828]" : "text-white/60 hover:text-white"}`;

/** Sits in the dark prototype toolbar beside Fill/Type. Prototype 3 only. */
export const CopyDeckControls = () => {
    const set = useCopySet();
    const view = useNewView();
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white/60">Copy</span>
            <div className="flex items-center gap-0.5 rounded-md bg-white/10 p-0.5" role="radiogroup" aria-label="Copy deck">
                {sets.map((s) => (
                    <button key={s.id} type="button" role="radio" aria-checked={set === s.id} title={s.title} onClick={() => setCopySet(s.id)} className={segment(set === s.id)}>
                        {s.label}
                    </button>
                ))}
            </div>
            {set === "new" && (
                // The native arrow is hidden (appearance-none) and drawn instead: Chrome's
                // sits flush against the edge and doesn't follow the text colour.
                <div className="relative flex items-center">
                    <select
                        aria-label="New copy view"
                        title="Highlight new tints every string that isn't staging's word for word (hover a reworded one to read staging's version). Hide new drops every string staging has no equivalent for."
                        value={view}
                        onChange={(e) => setNewView(e.target.value as NewView)}
                        className="cursor-pointer appearance-none rounded-md border border-white/15 py-1 pr-7 pl-2 text-xs font-semibold outline-none focus:border-white/40"
                        style={view === "plain" ? { backgroundColor: "rgb(255 255 255 / 0.05)", color: "white" } : { backgroundColor: PINK, color: "#101828", borderColor: PINK }}
                    >
                        {views.map((v) => (
                            <option key={v.id} value={v.id} className="bg-white text-black">
                                {v.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown
                        className="pointer-events-none absolute right-2 size-3.5"
                        style={{ color: view === "plain" ? "white" : "#101828" }}
                        aria-hidden="true"
                    />
                </div>
            )}
        </div>
    );
};
