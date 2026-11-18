import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { R1_VARS } from "../../../../../prototypes/app/v2/screens/das-shell";
import { R1 } from "../../../../../prototypes/app/v2/screens/round-1";
import { ITEMS } from "../../data";

/**
 * Shared frames for Storybook › Transition › Round 1 › Components: each group shows the
 * same piece from the full application v1 (before) and v2 (after, Round 1 applied).
 */

const INK = "#101828";
const MUTED = "#667085";
const LINE = "#EAECF0";

/**
 * v2 sets its Round 1 CSS variables (labels, buttons, the option hover) and tabular
 * figures on the shell. A v2 piece shown outside the shell needs the same, so it gets them here.
 */
export const V2Scope = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
    <div style={{ ...R1.numbers, ...R1_VARS, ...style }}>{children}</div>
);

interface Box {
    top: number;
    left: number;
    height: number;
}

/**
 * Shows one region of a full screen: the element `selector` matches, down to the bottom of
 * `to` (default: the same element) plus `padBottom`. The screen keeps its own layout; the
 * frame crops it, so a screen whose markup isn't exported can still be shown in part.
 */
export const Crop = ({
    selector,
    to,
    padBottom = 0,
    fallbackHeight = 240,
    children,
}: {
    selector: string;
    to?: string;
    padBottom?: number;
    fallbackHeight?: number;
    children: ReactNode;
}) => {
    const inner = useRef<HTMLDivElement>(null);
    const [box, setBox] = useState<Box | null>(null);

    useLayoutEffect(() => {
        const root = inner.current;
        if (!root) return;
        const measure = () => {
            const el = root.querySelector(selector);
            const end = to ? root.querySelector(to) : el;
            if (!el || !end) return;
            const a = root.getBoundingClientRect();
            const b = el.getBoundingClientRect();
            const c = end.getBoundingClientRect();
            const next = { top: Math.round(b.top - a.top), left: Math.round(b.left - a.left), height: Math.round(c.bottom - b.top + padBottom) };
            setBox((cur) => (cur && cur.top === next.top && cur.left === next.left && cur.height === next.height ? cur : next));
        };
        const frame = requestAnimationFrame(measure);
        const ro = new ResizeObserver(() => measure());
        ro.observe(root);
        const el = root.querySelector(selector);
        const end = to ? root.querySelector(to) : null;
        if (el) ro.observe(el);
        if (end) ro.observe(end);
        document.fonts?.ready.then(measure);
        return () => {
            cancelAnimationFrame(frame);
            ro.disconnect();
        };
    }, [selector, to, padBottom]);

    return (
        <div className="r1-crop" style={{ overflow: "hidden", height: box?.height ?? fallbackHeight, position: "relative" }}>
            {/* The Global Nav's collapse button hangs over the page's left edge; it isn't part of a cropped region. */}
            <style>{".r1-crop aside[aria-label='Primary'] button[aria-label$='navigation'] { visibility: hidden; }"}</style>
            <div
                ref={inner}
                style={{ marginTop: -(box?.top ?? 0), marginLeft: -(box?.left ?? 0), width: `calc(100% + ${box?.left ?? 0}px)` }}
            >
                {children}
            </div>
        </div>
    );
};

/** A small caption over a specimen. */
export const Caption = ({ children }: { children: ReactNode }) => (
    <p style={{ fontSize: 15, fontWeight: 700, color: MUTED, margin: "0 0 8px", fontFamily: "inherit" }}>{children}</p>
);

/** The R1 items a group covers, with their titles from the transition list. */
export const Covers = ({ ids }: { ids: string[] }) => (
    <ul style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
        {ids.map((id) => (
            <li key={id} style={{ fontSize: 15, color: INK, border: `1px solid ${LINE}`, borderRadius: 999, padding: "3px 12px", background: "#FFFFFF" }}>
                <b>{id}</b> · {ITEMS.find((i) => i.id === id)?.title ?? ""}
            </li>
        ))}
    </ul>
);

export const BEFORE = "Before · v1 (Nov 13 style guide)";
export const AFTER = "After · v2 (staging's styles, Round 1)";

const Specimen = ({ caption, children, bleed }: { caption: string; children: ReactNode; bleed?: boolean }) => (
    <figure style={{ margin: 0 }}>
        <Caption>{caption}</Caption>
        <div style={{ border: `1px solid ${LINE}`, background: "#FFFFFF", padding: bleed ? 0 : 24, overflow: "hidden" }}>{children}</div>
    </figure>
);

/** Before above after, each captioned, with the R1 items they cover on top. `bleed` drops the inner padding for cropped screens. */
export const BeforeAfter = ({ ids, before, after, note, bleed }: { ids: string[]; before: ReactNode; after: ReactNode; note?: ReactNode; bleed?: boolean }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: 24, background: "#F9FAFB", minHeight: "100vh", boxSizing: "border-box" }}>
        <Covers ids={ids} />
        {note && <p style={{ fontSize: 15, color: MUTED, margin: 0, maxWidth: 820 }}>{note}</p>}
        <Specimen caption={BEFORE} bleed={bleed}>
            {before}
        </Specimen>
        <Specimen caption={AFTER} bleed={bleed}>
            {after}
        </Specimen>
    </div>
);
