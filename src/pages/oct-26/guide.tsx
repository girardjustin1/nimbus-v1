import type { ReactNode } from "react";

/**
 * Building blocks for Oct 26 › Introduction, the review guide for Round 5: numbered
 * steps in the order Product should walk v5, each with a screenshot, what changed, why,
 * how to check it, and links to the prototype, the before/after story and the token.
 *
 * Inline styles, not Tailwind: docs pages render inside Storybook's own stylesheet, and
 * these must look the same in both docs and canvas. Type holds the 15px floor.
 */

const TEAL_DARK = "#1F7F80";
const PINK_DARK = "#A94579";

export const protoUrl = (route: string) =>
    (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? "http://localhost:5190/das/v5/" : "./das/v5/") + `#/${route}`;
export const docUrl = (id: string) => (id.endsWith("--docs") ? `./?path=/docs/${id}` : `./?path=/story/${id}`);

const pill = (kind: "proto" | "story" | "token") => ({
    display: "inline-block",
    whiteSpace: "nowrap" as const,
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 999,
    color: kind === "proto" ? PINK_DARK : kind === "story" ? TEAL_DARK : "#344054",
    background: kind === "proto" ? "#FCE7F1" : kind === "story" ? "#E6F6F6" : "#F2F4F7",
});

export const Pill = ({ kind, href, children }: { kind: "proto" | "story" | "token"; href: string; children: ReactNode }) => (
    <a href={href} target={kind === "proto" ? "_blank" : "_top"} rel="noreferrer" style={pill(kind)}>
        {children}
        {kind === "proto" ? " ↗" : " →"}
    </a>
);

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, margin: "4px 0" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#667085", textTransform: "uppercase", letterSpacing: 0.4, minWidth: 104 }}>{label}</span>
        {children}
    </div>
);

/** A link row block for a step: where to open it, before/after, and the tokens it uses. */
export const Links = ({ proto = [], compare = [], tokens = [] }: { proto?: [string, string][]; compare?: [string, string][]; tokens?: [string, string][] }) => (
    <div style={{ margin: "12px 0 4px" }}>
        {proto.length > 0 && (
            <Row label="Prototype">
                {proto.map(([t, r]) => (
                    <Pill key={t} kind="proto" href={protoUrl(r)}>
                        {t}
                    </Pill>
                ))}
            </Row>
        )}
        {compare.length > 0 && (
            <Row label="Round 4 → 5">
                {compare.map(([t, id]) => (
                    <Pill key={t} kind="story" href={docUrl(id)}>
                        {t}
                    </Pill>
                ))}
            </Row>
        )}
        {tokens.length > 0 && (
            <Row label="Components">
                {tokens.map(([t, id]) => (
                    <Pill key={t} kind="token" href={docUrl(id)}>
                        {t}
                    </Pill>
                ))}
            </Row>
        )}
    </div>
);

/** A numbered review step. */
export const Step = ({ n, title, time, children }: { n: number; title: string; time?: string; children: ReactNode }) => (
    <section id={`step-${n}`} style={{ margin: "40px 0 0", paddingTop: 28, borderTop: "1px solid #EAECF0", scrollMarginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: 8 }}>
            <span style={{ flex: "none", display: "inline-grid", placeItems: "center", width: 36, height: 36, borderRadius: 999, background: TEAL_DARK, color: "#fff", fontSize: 17, fontWeight: 800 }}>{n}</span>
            <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.25, fontWeight: 800, color: "#101828", border: 0 }}>{title}</h2>
            {time && <span style={{ fontSize: 15, color: "#667085", whiteSpace: "nowrap" }}>{time}</span>}
        </div>
        {children}
    </section>
);

/** A screenshot of v5, framed, with a caption. */
export const Shot = ({ src, caption }: { src: string; caption: ReactNode }) => (
    <figure style={{ margin: "16px 0" }}>
        <img src={src} alt={typeof caption === "string" ? caption : ""} style={{ display: "block", width: "100%", borderRadius: 10, border: "1px solid #EAECF0", boxShadow: "0 1px 3px rgb(16 24 40 / 0.08)" }} />
        <figcaption style={{ marginTop: 8, fontSize: 15, color: "#667085" }}>{caption}</figcaption>
    </figure>
);

/** Two screenshots side by side (e.g. menu open / saved). */
export const ShotPair = ({ children }: { children: ReactNode }) => <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>{children}</div>;

/** What changed, as a short list of plain statements. */
export const Changed = ({ children }: { children: ReactNode }) => (
    <div style={{ margin: "12px 0" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#101828", marginBottom: 4 }}>What changed</div>
        <div style={{ fontSize: 16, lineHeight: 1.6, color: "#344054" }}>{children}</div>
    </div>
);

/** The steps Product takes to check a change, numbered. */
export const Check = ({ children }: { children: ReactNode }) => (
    <div style={{ margin: "12px 0", padding: "12px 16px", borderRadius: 10, background: "#F6FBFB", border: "1px solid #CDEBEB" }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: TEAL_DARK, marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.4 }}>How to check it</div>
        {/* Storybook's docs stylesheet drops list markers; the steps need their numbers. */}
        <style>{".r5-check ol { list-style: decimal; padding-left: 24px; margin: 0; } .r5-check li { margin: 2px 0; }"}</style>
        <div className="r5-check" style={{ fontSize: 16, lineHeight: 1.6, color: "#344054" }}>
            {children}
        </div>
    </div>
);

/** A line from a review call: the 26 Oct call with the minute it was said, or another day. */
export const Said = ({ at, day = "26 Oct", children }: { at?: string; day?: string; children: ReactNode }) => (
    <blockquote style={{ margin: "12px 0", padding: "4px 0 4px 14px", borderLeft: `3px solid ${PINK_DARK}`, fontSize: 16, lineHeight: 1.55, color: "#475467" }}>
        “{children}”
        <span style={{ marginLeft: 8, fontSize: 15, color: "#98A2B3", whiteSpace: "nowrap" }}>
            — Product, {day}
            {at && ` · ${at}`}
        </span>
    </blockquote>
);

/** A status chip: Applied, Kept, To confirm, Pending. */
export const Status = ({ tone }: { tone: "Applied" | "Kept" | "To confirm" | "Pending" }) => {
    const c = { Applied: ["#E6F6F6", TEAL_DARK], Kept: ["#F2F4F7", "#475467"], "To confirm": ["#FBE9F1", PINK_DARK], Pending: ["#FFF4E5", "#B54708"] }[tone];
    return <span style={{ background: c[0], color: c[1], borderRadius: 999, padding: "1px 9px", fontSize: 15, fontWeight: 700, whiteSpace: "nowrap" }}>{tone}</span>;
};

export const th = { textAlign: "left" as const, fontSize: 15, fontWeight: 700, color: "#101828", padding: "9px 12px", borderBottom: "1px solid #EAECF0", background: "#F9FAFB" };
export const td = { fontSize: 15, color: "#344054", padding: "10px 12px", borderBottom: "1px solid #EAECF0", verticalAlign: "top" as const };
