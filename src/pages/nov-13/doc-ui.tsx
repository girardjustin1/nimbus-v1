import type { ReactNode } from "react";
import { Cta } from "../intro/ui";

/**
 * Building blocks for the full application's docs pages (screen index, Nov 13 review, constraints). Inline styles,
 * not Tailwind: docs render inside Storybook's own stylesheet. Type holds the 15px floor.
 */

export const protoUrl = (route = "") =>
    (typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname) ? "http://localhost:5195/app/v1/" : "./app/v1/") +
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

/** Links on these pages use the one shared call to action (../intro/ui): bold pink text, ↗ for a prototype, → within Storybook. */
export const Pill = ({ href, children }: { href: string; children: ReactNode; kind?: "proto" | "story" }) => <Cta href={href}>{children}</Cta>;

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
