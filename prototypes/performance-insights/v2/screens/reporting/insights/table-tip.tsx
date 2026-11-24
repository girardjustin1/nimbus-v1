import { type RefObject, useEffect, useState } from "react";
import { TEAL_DARK } from "../../nimbus-ui";

/**
 * Performance Insights · Round 2 · C16: the card that follows the mouse over the table
 * (after GA4's). Its heading is the row (“CANADA · NIMBUS+”), then what the cell holds:
 * metric and column, the value, and its change when the report is compared.
 *
 * Cells carry their card as data attributes (TipData); this listens on the table body, so
 * only the card re-renders as the mouse moves, never the table.
 */

export type TipData = {
    "data-tip-head": string;
    "data-tip-col": string;
    "data-tip-value": string;
    "data-tip-change": string;
};

type Shown = { x: number; y: number; head: string; col: string; value: string; change: string };

const GAP = 16;
const WIDTH = 288;

export const TableTip = ({ target }: { target: RefObject<HTMLElement | null> }) => {
    const [tip, setTip] = useState<Shown | null>(null);

    useEffect(() => {
        const el = target.current;
        if (!el) return;
        const move = (e: MouseEvent) => {
            const td = (e.target as Element).closest<HTMLElement>("td[data-tip-head]");
            // Checkboxes and group blocks are controls: no card over them.
            if (!td || (e.target as Element).closest("button")) return setTip(null);
            const d = td.dataset;
            setTip({
                x: e.clientX,
                y: e.clientY,
                head: d.tipHead ?? "",
                col: d.tipCol ?? "",
                value: d.tipValue ?? "",
                change: d.tipChange ?? "",
            });
        };
        const leave = () => setTip(null);
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", leave);
        window.addEventListener("scroll", leave, { passive: true });
        return () => {
            el.removeEventListener("mousemove", move);
            el.removeEventListener("mouseleave", leave);
            window.removeEventListener("scroll", leave);
        };
    }, [target]);

    if (!tip) return null;
    // Below and right of the pointer, flipped when it would leave the window.
    const left = tip.x + GAP + WIDTH > window.innerWidth ? tip.x - GAP - WIDTH : tip.x + GAP;
    const top = tip.y + GAP + 120 > window.innerHeight ? tip.y - GAP - 120 : tip.y + GAP;
    const up = tip.change.startsWith("+");

    return (
        <div
            role="tooltip"
            className="pointer-events-none fixed z-50 flex flex-col gap-1 rounded-xl bg-primary px-4 py-3 shadow-xl ring-1 ring-secondary"
            style={{ left, top, width: WIDTH }}
        >
            <span className="truncate text-md font-semibold tracking-wide text-tertiary uppercase">{tip.head}</span>
            <span className="text-md text-secondary">{tip.col}</span>
            <span className="text-lg font-bold text-primary tabular-nums">{tip.value}</span>
            {tip.change && (
                <span className="text-md font-semibold tabular-nums" style={{ color: up ? TEAL_DARK : "#B42318" }}>
                    {tip.change}
                </span>
            )}
        </div>
    );
};
