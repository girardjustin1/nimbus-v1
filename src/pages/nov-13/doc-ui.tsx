import type { ReactNode } from "react";

/**
 * November 13th, 2026 — building blocks for this category's docs pages. Inline styles,
 * not Tailwind: docs render inside Storybook's own stylesheet. Type holds the 15px floor.
 */

export const protoUrl = (route = "") =>
    (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? "http://localhost:5190/app/v1/" : "./app/v1/") +
    (route ? `#/${route}` : "");

export const th = {
    textAlign: "left" as const,
    fontSize: 15,
    fontWeight: 700,
    color: "#101828",
    padding: "9px 12px",
    borderBottom: "1px solid #EAECF0",
    background: "#F9FAFB",
};
export const td = { fontSize: 15, color: "#344054", padding: "10px 12px", borderBottom: "1px solid #EAECF0", verticalAlign: "top" as const };

export const Pill = ({ href, children, kind = "proto" }: { href: string; children: ReactNode; kind?: "proto" | "story" }) => (
    <a
        href={href}
        target={kind === "proto" ? "_blank" : "_top"}
        rel="noreferrer"
        style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            textDecoration: "none",
            fontSize: 15,
            fontWeight: 600,
            padding: "2px 10px",
            borderRadius: 999,
            color: kind === "proto" ? "#A94579" : "#1F7F80",
            background: kind === "proto" ? "#FCE7F1" : "#E6F6F6",
        }}
    >
        {children}
        {kind === "proto" ? " ↗" : " →"}
    </a>
);

export const Callout = ({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "pink" }) => (
    <div
        style={{
            background: tone === "teal" ? "#E6F6F6" : "#FCE7F1",
            borderLeft: `4px solid ${tone === "teal" ? "#1F7F80" : "#A94579"}`,
            borderRadius: 10,
            padding: "12px 16px",
            margin: "16px 0",
            fontSize: 15,
            color: "#101828",
        }}
    >
        {children}
    </div>
);

export const Said = ({ who, children }: { who: "Product" | "Engineering"; children: ReactNode }) => (
    <blockquote style={{ borderLeft: "3px solid #F7D6E6", margin: "10px 0", padding: "4px 14px", fontSize: 15, color: "#475467", fontStyle: "italic" }}>
        {children}
        <div style={{ fontStyle: "normal", color: "#667085", marginTop: 4 }}>{who}, 13 Nov call</div>
    </blockquote>
);
