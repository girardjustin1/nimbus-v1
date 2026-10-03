import type { CSSProperties, ReactNode } from "react";
import "./type-audit.css";

/**
 * Presentation for the typography audit page.
 *
 * Everything here is docs furniture — it renders the audit's findings, it is not
 * part of the Nimbus design system and nothing in it is exported for product use.
 * Styles are inline or scoped to `.type-audit` (see type-audit.css) so a document
 * about a different application's CSS cannot leak into ours.
 */

const SEVERITY: Record<string, { bg: string; fg: string }> = {
    High: { bg: "#FEE4E2", fg: "#B42318" },
    Medium: { bg: "#FEF0C7", fg: "#B54708" },
    Low: { bg: "#F2F4F7", fg: "#475467" },
};

export const Severity = ({ level }: { level: "High" | "Medium" | "Low" }) => {
    const tone = SEVERITY[level];
    return (
        <span
            style={{
                background: tone.bg,
                color: tone.fg,
                borderRadius: 999,
                padding: "2px 10px",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: 0.4,
                textTransform: "uppercase",
                whiteSpace: "nowrap",
            }}
        >
            {level}
        </span>
    );
};

export const Chip = ({ children, bg = "#F2F4F7", fg = "#475467" }: { children: ReactNode; bg?: string; fg?: string }) => (
    <span style={{ background: bg, color: fg, borderRadius: 999, padding: "1px 8px", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{children}</span>
);

/** The headline numbers at the top of the page. */
export const Stat = ({ value, label, tone = "#101828" }: { value: string; label: string; tone?: string }) => (
    <div style={{ flex: "1 1 150px", background: "#FFFFFF", border: "1px solid #EAECF0", borderRadius: 14, padding: "16px 18px" }}>
        <div style={{ fontSize: 30, fontWeight: 700, color: tone, fontVariantNumeric: "tabular-nums", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 13, color: "#667085", marginTop: 4 }}>{label}</div>
    </div>
);

/**
 * One token from the finalized system: what it is, what it looks like, what it is
 * for, and the mess it replaces.
 */
export const TypeSpecimen = ({
    token,
    spec,
    sample,
    useFor,
    replaces,
}: {
    token: string;
    spec: string;
    sample: string;
    useFor: string;
    replaces: string;
}) => (
    <div style={{ border: "1px solid #EAECF0", borderRadius: 14, padding: "18px 20px", margin: "0 0 12px", background: "#FFFFFF" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 8 }}>
            <code style={{ fontSize: 13, fontWeight: 700, color: "#A94579", background: "#FCE7F1", padding: "2px 8px", borderRadius: 6 }}>{token}</code>
            <span style={{ fontSize: 12, color: "#667085", fontVariantNumeric: "tabular-nums" }}>{spec}</span>
        </div>
        <div style={{ borderTop: "1px solid #F2F4F7", borderBottom: "1px solid #F2F4F7", margin: "14px 0", padding: "16px 0", overflowX: "auto" }}>
            <span className={token}>{sample}</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 24px", fontSize: 13, lineHeight: 1.55 }}>
            <div style={{ flex: "1 1 260px" }}>
                <span style={{ fontWeight: 700, color: "#101828" }}>Use for </span>
                <span style={{ color: "#475467" }}>{useFor}</span>
            </div>
            <div style={{ flex: "1 1 260px" }}>
                <span style={{ fontWeight: 700, color: "#101828" }}>Replaces </span>
                <span style={{ color: "#667085" }}>{replaces}</span>
            </div>
        </div>
    </div>
);

/**
 * A style as the dashboard renders it today, beside the token that replaces it.
 * The "before" is set from the computed values in the audit, so it is what is on
 * the screen rather than an impression of it.
 */
export const BeforeAfter = ({ before, beforeStyle, after, afterToken, note }: { before: string; beforeStyle: CSSProperties; after: string; afterToken: string; note?: string }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, margin: "14px 0" }}>
        {[
            { tag: "Today", body: <span className="ta-before" style={beforeStyle}>{before}</span>, edge: "#FDA29B" },
            { tag: "Proposed", body: <span className={afterToken}>{after}</span>, edge: "#6CE9A6" },
        ].map((side) => (
            <div key={side.tag} style={{ flex: "1 1 260px", border: "1px solid #EAECF0", borderLeft: `4px solid ${side.edge}`, borderRadius: 12, padding: "14px 16px", background: "#FFFFFF" }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "#667085", marginBottom: 10 }}>{side.tag}</div>
                <div style={{ overflowX: "auto" }}>{side.body}</div>
            </div>
        ))}
        {note && <div style={{ flexBasis: "100%", fontSize: 12, color: "#667085" }}>{note}</div>}
    </div>
);

/**
 * A markdown table, rendered.
 *
 * This Storybook's MDX has no GFM table support — the other data-heavy docs page in
 * the repo builds its table in JSX for the same reason. Turning the plugin on globally
 * would change how every existing page parses, which is not a thing an audit of a
 * different application should do, so the parsing lives here instead.
 *
 * It handles exactly what this document uses: links, bold, inline code, and a bare hex
 * value, which becomes a swatch.
 */
const HEX = /^#[0-9A-Fa-f]{6}$/;

const inline = (text: string): ReactNode[] => {
    const out: ReactNode[] = [];
    const re = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;
    let last = 0;
    let key = 0;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
        if (m.index > last) out.push(text.slice(last, m.index));
        if (m[1] !== undefined) {
            out.push(
                <a key={key++} href={m[2]} target="_blank" rel="noreferrer">
                    {m[1]}
                </a>,
            );
        } else if (m[3] !== undefined) {
            out.push(<strong key={key++}>{m[3]}</strong>);
        } else {
            out.push(
                <code key={key++} style={{ fontSize: "0.92em" }}>
                    {m[4]}
                </code>,
            );
        }
        last = m.index + m[0].length;
    }
    if (last < text.length) out.push(text.slice(last));
    return out;
};

const cells = (line: string) =>
    line
        .trim()
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());

export const MdTable = ({ md }: { md: string }) => {
    const rows = md
        .trim()
        .split("\n")
        .filter((l) => l.trim().startsWith("|"));
    if (rows.length < 2) return null;
    const head = cells(rows[0]);
    const body = rows.slice(2).map(cells);

    const th: CSSProperties = {
        textAlign: "left",
        fontSize: 12,
        fontWeight: 700,
        color: "#475467",
        padding: "9px 12px",
        borderBottom: "1px solid #EAECF0",
        background: "#F9FAFB",
        whiteSpace: "nowrap",
    };
    const td: CSSProperties = { fontSize: 13, color: "#344054", padding: "9px 12px", borderBottom: "1px solid #F2F4F7", verticalAlign: "top", lineHeight: 1.5 };

    return (
        <div style={{ overflowX: "auto", border: "1px solid #EAECF0", borderRadius: 12, margin: "14px 0 22px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                <thead>
                    <tr>
                        {head.map((h, i) => (
                            <th key={i} style={th}>
                                {inline(h)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {body.map((row, r) => (
                        <tr key={r}>
                            {row.map((c, i) => (
                                <td key={i} style={td}>
                                    {HEX.test(c) ? <Swatch value={c} /> : inline(c)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

/** A text-colour role with its swatch and measured contrast. */
export const Swatch = ({ value }: { value: string }) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>
        <span style={{ width: 14, height: 14, borderRadius: 4, background: value, border: "1px solid #D0D5DD", display: "inline-block" }} />
        <code style={{ fontSize: 12 }}>{value}</code>
    </span>
);

export const Callout = ({ title, children, tone = "#F9FAFB", edge = "#D0D5DD" }: { title?: string; children: ReactNode; tone?: string; edge?: string }) => (
    <div style={{ background: tone, border: `1px solid ${edge}`, borderRadius: 14, padding: "16px 20px", margin: "16px 0" }}>
        {title && <div style={{ fontSize: 13, fontWeight: 700, color: "#101828", marginBottom: 6 }}>{title}</div>}
        <div style={{ fontSize: 14, lineHeight: 1.65, color: "#475467" }}>{children}</div>
    </div>
);

/** Wraps one finding so the heading, severity and body stay together. */
export const Finding = ({ n, title, level, children }: { n: number; title: string; level: "High" | "Medium" | "Low"; children: ReactNode }) => (
    <div style={{ border: "1px solid #EAECF0", borderRadius: 16, padding: "20px 22px", margin: "0 0 18px", background: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#98A2B3", fontVariantNumeric: "tabular-nums" }}>{String(n).padStart(2, "0")}</span>
            <span style={{ fontSize: 18, fontWeight: 700, color: "#101828" }}>{title}</span>
            <Severity level={level} />
        </div>
        {children}
    </div>
);
