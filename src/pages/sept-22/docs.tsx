import { PINK, TEAL } from "../deal-activation-system/das-shell";
import { type FeedbackItem, items } from "./feedback";

/**
 * Sept 22 — documentation blocks.
 *
 * The MDX pages render these instead of repeating the quotes inline, so every quote and
 * decision has exactly one home (feedback.ts) and the docs cannot drift from the note
 * shown on the screens themselves.
 */

const GRAY = "#98A2B3";

export const StatusPill = ({ status }: { status: FeedbackItem["status"] }) => {
    const asked = status === "Asked for";
    return (
        <span
            style={{
                display: "inline-block",
                padding: "2px 10px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                color: asked ? "#A94579" : "#475467",
                background: asked ? `${PINK}24` : "#F2F4F7",
            }}
        >
            {status}
        </span>
    );
};

const Quote = ({ children }: { children: React.ReactNode }) => (
    <blockquote style={{ margin: "10px 0", padding: "10px 0 10px 16px", borderLeft: `3px solid ${PINK}66`, fontStyle: "italic", color: "#344054", fontSize: 15 }}>
        {children}
    </blockquote>
);

const H = ({ children }: { children: React.ReactNode }) => (
    <h3 style={{ fontSize: 13, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4, color: "#667085", margin: "28px 0 8px" }}>{children}</h3>
);

const List = ({ rows, mono }: { rows: string[]; mono?: boolean }) => (
    <ul style={{ margin: "8px 0", paddingLeft: 20, color: "#344054", fontSize: mono ? 13 : 15, lineHeight: 1.65 }}>
        {rows.map((r, i) => (
            <li key={i} style={mono ? { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" } : undefined}>
                {r}
            </li>
        ))}
    </ul>
);

/** The full record for one feedback item: what was said, what we decided, what changes. */
export const ItemDoc = ({ n }: { n: number }) => {
    const item = items.find((i) => i.n === n);
    if (!item) return <p>No Sept 22 item numbered {n}.</p>;
    return (
        <div style={{ maxWidth: 820 }}>
            <p style={{ margin: "0 0 4px" }}>
                <StatusPill status={item.status} />
            </p>

            <H>What was said</H>
            {item.quotes.map((q, i) => (
                <Quote key={i}>“{q}”</Quote>
            ))}
            <p style={{ fontSize: 13, color: "#667085", margin: 0 }}>Product, September 22 design review.</p>

            <H>What we're doing</H>
            <List rows={item.decision} />

            {item.notDoing && (
                <>
                    <H>Considered and not doing</H>
                    <p style={{ fontSize: 15, color: "#344054", margin: "8px 0" }}>{item.notDoing}</p>
                </>
            )}

            <H>Files that change when this is adopted</H>
            <List rows={item.touches} mono />

            <p style={{ fontSize: 14, color: "#667085", marginTop: 24, paddingTop: 16, borderTop: "1px solid #EAECF0" }}>
                Not applied yet. The revised version lives in this folder; the screens in Deal Activation System are still exactly as they were reviewed.
            </p>
        </div>
    );
};

/** Compact table of the whole batch, for the overview page. */
export const Batch = () => (
    <div style={{ overflowX: "auto", border: "1px solid #EAECF0", borderRadius: 12, margin: "12px 0 24px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", margin: 0 }}>
            <thead>
                <tr>
                    {["#", "Change", "Status", "What it comes from"].map((h) => (
                        <th key={h} style={{ textAlign: "left", fontSize: 12, fontWeight: 700, color: "#475467", padding: "10px 14px", borderBottom: "1px solid #EAECF0", background: "#F9FAFB" }}>
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {items.map((i) => (
                    <tr key={i.n}>
                        <td style={{ ...cell, width: 32, color: "#667085", fontWeight: 700 }}>{i.n}</td>
                        <td style={{ ...cell, fontWeight: 600 }}>{i.title}</td>
                        <td style={cell}>
                            <StatusPill status={i.status} />
                        </td>
                        <td style={{ ...cell, fontStyle: "italic", color: "#667085" }}>“{truncate(i.quotes[0], 110)}”</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const cell = { fontSize: 14, color: "#344054", padding: "12px 14px", borderBottom: "1px solid #EAECF0", verticalAlign: "top" } as const;

const truncate = (s: string, n: number) => (s.length <= n ? s : `${s.slice(0, n).trimEnd()}…`);

/** Legend explaining the two annotation colours used across this folder. */
export const NoteKey = () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", margin: "12px 0 24px", fontSize: 14, color: "#344054" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: PINK }} /> Pink — what the Sep 22 review asked us to change
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: TEAL }} /> Teal — what a concept explores
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: GRAY }} /> Gray — the version reviewed on Sep 22
        </span>
    </div>
);
