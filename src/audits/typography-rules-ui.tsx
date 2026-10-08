import { type CSSProperties, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { Unstyled } from "@storybook/addon-docs/blocks";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { Button, FIELD_TYPE } from "../../prototypes/das/v3/screens/type-rules";
import { EDGE_CASES, TEXT_STYLES, type TextStyle } from "./typography-rules-data";

/**
 * Specimens and the developer matrix for Audits › Typography Rules.
 *
 * Every specimen renders the real Prototype 3 classes in Proxima Nova and reads its
 * computed style back from the browser, so the size, line height, weight and colour shown
 * are measured, not typed.
 */

/** Any CSS colour (rgb, oklch…) as #RRGGBB, by painting it into a 1×1 canvas. */
const toHex = (c: string) => {
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return c;
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase()}`;
};

interface Measured {
    size: string;
    line: string;
    weight: string;
    color: string;
    family: string;
}

const useMeasure = <T extends HTMLElement>() => {
    const ref = useRef<T>(null);
    const [m, setM] = useState<Measured | null>(null);
    useLayoutEffect(() => {
        const read = () => {
            if (!ref.current) return;
            const c = getComputedStyle(ref.current);
            setM({ size: c.fontSize, line: c.lineHeight, weight: c.fontWeight, color: toHex(c.color), family: c.fontFamily.split(",")[0].replace(/"/g, "") });
        };
        read();
        // Re-read once the webfont has loaded, in case metrics shifted.
        document.fonts?.ready.then(read);
    }, []);
    return { ref, m };
};

const Spec = ({ m }: { m: Measured | null }) =>
    m ? (
        <code style={{ fontSize: 12, color: "#475467" }}>
            {m.size} / {m.line} · {m.weight} · {m.color} · {m.family}
        </code>
    ) : null;

const surface = cx(FIELD_TYPE, "antialiased");
/** Storybook's docs styles set their own font and 16px on text; specimens opt out so they render as the product does. */
const bodyFont: CSSProperties = { fontFamily: "var(--font-body)" };
const Plain = ({ children }: { children: ReactNode }) => <Unstyled>{children}</Unstyled>;

/** One named style, rendered and measured. */
export const Specimen = ({ s }: { s: TextStyle }) => {
    const { ref, m } = useMeasure<HTMLSpanElement>();
    return (
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 16, alignItems: "baseline", padding: "14px 0", borderBottom: "1px solid #EAECF0" }}>
            <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#101828" }}>{s.name}</div>
                <div style={{ fontSize: 12, color: "#667085" }}>{s.use}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div className={surface} style={{ ...bodyFont, background: s.dark ? "#1A1A1A" : undefined, padding: s.dark ? "6px 12px" : 0, borderRadius: 8, alignSelf: "flex-start" }}>
                    <span ref={ref} className={s.className} style={s.color ? { color: s.color } : undefined}>
                        {s.sample}
                    </span>
                </div>
                <Spec m={m} />
            </div>
        </div>
    );
};

export const SpecimenList = () => (
    <Plain>
        <div>
            {TEXT_STYLES.map((s) => (
                <Specimen key={s.name} s={s} />
            ))}
        </div>
    </Plain>
);

/** The developer matrix: one row per style, with the measured numbers alongside the code. */
const MatrixRow = ({ s }: { s: TextStyle }) => {
    const { ref, m } = useMeasure<HTMLSpanElement>();
    const td = { padding: "8px 10px", borderBottom: "1px solid #EAECF0", verticalAlign: "top" as const, fontSize: 13, color: "#344054" };
    return (
        <tr>
            <td style={{ ...td, fontWeight: 700, color: "#101828" }}>{s.name}</td>
            <td style={td}>
                <span className={surface} style={{ ...bodyFont, display: "inline-block", background: s.dark ? "#1A1A1A" : undefined, padding: s.dark ? "2px 8px" : 0, borderRadius: 6 }}>
                    <span ref={ref} className={s.className} style={s.color ? { color: s.color } : undefined}>
                        {s.sample.length > 22 ? `${s.sample.slice(0, 22)}…` : s.sample}
                    </span>
                </span>
            </td>
            <td style={{ ...td, whiteSpace: "nowrap" }}>{m ? `${m.size} / ${m.line}` : "…"}</td>
            <td style={td}>{m?.weight ?? "…"}</td>
            <td style={{ ...td, whiteSpace: "nowrap" }}>
                {m && <span style={{ display: "inline-block", width: 10, height: 10, borderRadius: 3, background: m.color, marginRight: 6, verticalAlign: "middle", border: "1px solid #D0D5DD" }} />}
                {m?.color}
            </td>
            <td style={td}>
                <code style={{ fontSize: 12 }}>{s.className}</code>
                {s.color && <div style={{ fontSize: 12, color: "#667085" }}>colour set inline: {s.color}</div>}
            </td>
            <td style={{ ...td, fontSize: 12, color: "#667085" }}>{s.source}</td>
        </tr>
    );
};

export const StyleMatrix = () => {
    const th = { textAlign: "left" as const, fontSize: 12, fontWeight: 700, color: "#475467", padding: "8px 10px", borderBottom: "1px solid #EAECF0", background: "#F9FAFB", whiteSpace: "nowrap" as const };
    return (
        <Plain>
        <div style={{ overflowX: "auto", border: "1px solid #EAECF0", borderRadius: 12, margin: "12px 0 24px", fontFamily: "Nunito Sans, sans-serif" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", margin: 0 }}>
                <thead>
                    <tr>
                        {["Style", "Renders as", "Size / line height", "Weight", "Colour", "Classes", "In the code"].map((h) => (
                            <th key={h} style={th}>
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {TEXT_STYLES.map((s) => (
                        <MatrixRow key={s.name} s={s} />
                    ))}
                </tbody>
            </table>
        </div>
        </Plain>
    );
};

export const EdgeCaseTable = () => {
    const th = { textAlign: "left" as const, fontSize: 12, fontWeight: 700, color: "#475467", padding: "8px 10px", borderBottom: "1px solid #EAECF0", background: "#F9FAFB" };
    const td = { padding: "8px 10px", borderBottom: "1px solid #EAECF0", verticalAlign: "top" as const, fontSize: 13, color: "#344054" };
    return (
        <div style={{ overflowX: "auto", border: "1px solid #EAECF0", borderRadius: 12, margin: "12px 0 24px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", margin: 0 }}>
                <thead>
                    <tr>
                        <th style={th}>Case</th>
                        <th style={th}>Rule</th>
                        <th style={th}>How it's done</th>
                    </tr>
                </thead>
                <tbody>
                    {EDGE_CASES.map((e) => (
                        <tr key={e.case} style={e.case.startsWith("Exception") ? { background: "#FFFBEB" } : undefined}>
                            <td style={{ ...td, fontWeight: 700, color: "#101828" }}>{e.case}</td>
                            <td style={td}>{e.rule}</td>
                            <td style={{ ...td, fontSize: 12 }}>
                                <code style={{ fontSize: 12, whiteSpace: "normal" }}>{e.how}</code>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/** The three rules on a real field, at real size. */
export const RulesInContext = () => (
    <Plain>
    <div className={cx(surface, "flex flex-col gap-5 rounded-xl border border-secondary bg-primary p-6")} style={bodyFont}>
        <div className="flex flex-col gap-1">
            <h2 className="text-xl font-extrabold text-primary">Budget</h2>
            <p className="text-md text-tertiary">Pacing is front-loaded hourly: up to 1/24th of the daily budget spends at the start of each hour.</p>
        </div>
        <div className="flex max-w-sm flex-col gap-1.5">
            <span className="text-md font-bold text-primary">
                Bid Amount (eCPM)<span className="ml-0.5 text-brand-tertiary">*</span>
            </span>
            <p className="text-md text-tertiary">Selling value, not a floor.</p>
            <Input aria-label="Bid Amount" size="md" placeholder="0.00" isInvalid hint="Bid Amount is required" />
        </div>
        <div>
            <Button color="primary-pink" className="uppercase">
                Review
            </Button>
        </div>
    </div>
    </Plain>
);
