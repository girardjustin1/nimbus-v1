import { type CSSProperties, type ReactNode, useEffect, useState } from "react";
import { BODY, INK, LINE, MUTED, PINK, PINK_DARK, PINK_SOFT, TEAL, TEAL_DARK, TEAL_SOFT, WARM } from "./tokens";

/**
 * Building blocks for Storybook's introduction pages (Full Application, DAS Prototypes).
 *
 * One layout language for all of them: a hero card with real screens, shot cards that
 * open a prototype, a step strip, feature cards, a milestone track — and ONE set of
 * calls to action (see `Cta`), so buttons and links look and behave the same everywhere.
 *
 * Inline styles, not Tailwind: docs pages render inside Storybook's own stylesheet.
 * Type holds the 15px floor, in Proxima Nova like the product.
 */

const FONT = '"proxima-nova", "Proxima Nova", system-ui, sans-serif';

/* -------------------------------------------------------------------- CTA --- */

type CtaKind = "primary" | "secondary" | "link";

const CTA_BASE: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.2,
    textDecoration: "none",
    whiteSpace: "nowrap",
    borderRadius: 999,
};
const CTA_KIND: Record<CtaKind, CSSProperties> = {
    primary: { background: PINK_DARK, color: "#FFFFFF", padding: "11px 20px", border: `1px solid ${PINK_DARK}` },
    secondary: { background: "#FFFFFF", color: INK, padding: "11px 20px", border: "1px solid #D0D5DD" },
    link: { color: PINK_DARK, padding: "4px 0" },
};

/**
 * The one call to action. Three weights, one rule each:
 *   primary    the main thing to do in a section (at most one): filled pink pill
 *   secondary  an alternative of equal standing: white pill with a grey outline
 *   link       everything else: bold pink text
 * The arrow says where it goes: ↗ opens a prototype (or another site) in a new tab,
 * → stays in Storybook.
 */
export const Cta = ({ href, kind = "link", children }: { href: string; kind?: CtaKind; children: ReactNode }) => {
    const inStorybook = href.startsWith("./?path=") || href.startsWith("#");
    return (
        <a href={href} target={inStorybook ? "_top" : "_blank"} rel="noreferrer" style={{ ...CTA_BASE, ...CTA_KIND[kind] }}>
            {children}
            <span aria-hidden="true">{inStorybook ? "→" : "↗"}</span>
        </a>
    );
};

export const CtaRow = ({ children, center }: { children: ReactNode; center?: boolean }) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 18px", justifyContent: center ? "center" : undefined }}>{children}</div>
);

/* ------------------------------------------------------------------ Basics --- */

export const Page = ({ children }: { children: ReactNode }) => <div style={{ maxWidth: 1040, fontFamily: FONT }}>{children}</div>;

export const Chip = ({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "pink" | "teal" | "ink" }) => {
    const tones = {
        plain: { background: "#FFFFFF", color: "#344054", border: "1px solid #D0D5DD" },
        pink: { background: PINK_SOFT, color: PINK_DARK, border: `1px solid ${PINK_SOFT}` },
        teal: { background: TEAL_SOFT, color: TEAL_DARK, border: `1px solid ${TEAL_SOFT}` },
        ink: { background: INK, color: "#FFFFFF", border: `1px solid ${INK}` },
    } as const;
    return (
        <span
            style={{
                display: "inline-block",
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                ...tones[tone],
            }}
        >
            {children}
        </span>
    );
};

export const Eyebrow = ({ children, color = PINK_DARK }: { children: ReactNode; color?: string }) => (
    <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", color }}>{children}</div>
);

/** A div, not a p: MDX wraps multi-line children in its own paragraph. */
export const Lead = ({ children }: { children: ReactNode }) => (
    <div style={{ fontFamily: FONT, fontSize: 17, lineHeight: 1.6, color: BODY, margin: "8px 0 20px", maxWidth: 860 }}>{children}</div>
);

/** A screenshot in a plain browser window, so a picture of a screen reads as a screen. */
export const BrowserFrame = ({ src, alt, style }: { src: string; alt: string; style?: CSSProperties }) => (
    <div
        style={{
            background: "#FFFFFF",
            border: `1px solid ${LINE}`,
            borderRadius: 10,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(16,24,40,0.12)",
            ...style,
        }}
    >
        <div style={{ display: "flex", gap: 5, padding: "7px 10px", background: "#F2F4F7", borderBottom: `1px solid ${LINE}` }} aria-hidden="true">
            {["#F97066", "#FDB022", "#32D583"].map((c) => (
                <span key={c} style={{ width: 8, height: 8, borderRadius: 99, background: c }} />
            ))}
        </div>
        <img src={src} alt={alt} style={{ display: "block", width: "100%" }} />
    </div>
);

/* -------------------------------------------------------------------- Hero --- */

export interface HeroShot {
    src: string;
    label: string;
    href?: string;
}

/** The page's opening card: what this is, in one headline, over the art, with real screens beneath. */
export const Hero = ({
    eyebrow,
    title,
    lead,
    chips = [],
    art,
    actions,
    shots = [],
    caption,
}: {
    eyebrow: string;
    title: string;
    lead: ReactNode;
    chips?: string[];
    art: string;
    actions?: ReactNode;
    shots?: HeroShot[];
    caption?: string;
}) => (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 22, overflow: "hidden", margin: "8px 0 28px", fontFamily: FONT, background: "#FBF7F7" }}>
        <div
            style={{
                backgroundImage: `linear-gradient(90deg, rgba(251,247,247,0.98) 0%, rgba(251,247,247,0.94) 40%, rgba(251,247,247,0) 66%), url(${art})`,
                backgroundSize: "cover",
                backgroundPosition: "right center",
                padding: "40px 36px 36px",
            }}
        >
            <div style={{ maxWidth: 470 }}>
                <Eyebrow>{eyebrow}</Eyebrow>
                <div style={{ fontSize: 38, fontWeight: 800, lineHeight: 1.12, color: INK, margin: "10px 0 14px" }}>{title}</div>
                <div style={{ fontSize: 17, lineHeight: 1.55, color: BODY }}>{lead}</div>
                {chips.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 18 }}>
                        {chips.map((c) => (
                            <Chip key={c}>{c}</Chip>
                        ))}
                    </div>
                )}
                {actions && <div style={{ marginTop: 22 }}>{actions}</div>}
            </div>
        </div>
        {shots.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${shots.length}, minmax(0, 1fr))`, gap: 16, padding: "0 28px 22px", marginTop: -6 }}>
                {shots.map((s) => {
                    const frame = (
                        <>
                            <BrowserFrame src={s.src} alt={s.label} />
                            <div style={{ fontSize: 15, fontWeight: 700, color: INK, textAlign: "center", marginTop: 10 }}>{s.label}</div>
                        </>
                    );
                    return s.href ? (
                        <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                            {frame}
                        </a>
                    ) : (
                        <div key={s.label}>{frame}</div>
                    );
                })}
            </div>
        )}
        {caption && <div style={{ borderTop: `1px solid ${LINE}`, background: "#FFFFFF", padding: "12px 36px", fontSize: 15, color: MUTED }}>{caption}</div>}
    </div>
);

/* -------------------------------------------------------------- Shot cards --- */

export interface ShotCardProps {
    shot: string;
    eyebrow: string;
    title: string;
    body: ReactNode;
    /** A second, quieter paragraph: what to look for. */
    note?: ReactNode;
    href: string;
    cta: string;
    links?: [string, string][];
    badge?: string;
}

/** A card that leads somewhere: a real screen, what it is, one link. The whole picture is clickable. */
export const ShotCard = ({ shot, eyebrow, title, body, note, href, cta, links = [], badge }: ShotCardProps) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            border: `1px solid ${LINE}`,
            borderRadius: 18,
            padding: 16,
            background: "#FFFFFF",
            fontFamily: FONT,
        }}
    >
        <a
            href={href}
            target={href.startsWith("./?path=") ? "_top" : "_blank"}
            rel="noreferrer"
            style={{ display: "block", background: "#F6F3F6", borderRadius: 12, padding: "18px 18px 0", overflow: "hidden", position: "relative" }}
        >
            <BrowserFrame src={shot} alt={title} style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: "none" }} />
            {badge && (
                <span
                    style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        background: PINK_DARK,
                        color: "#FFFFFF",
                        fontSize: 15,
                        fontWeight: 700,
                        padding: "2px 10px",
                        borderRadius: 999,
                    }}
                >
                    {badge}
                </span>
            )}
        </a>
        <div style={{ padding: "14px 4px 4px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
            <Eyebrow>{eyebrow}</Eyebrow>
            <div style={{ fontSize: 19, fontWeight: 800, color: INK, lineHeight: 1.25 }}>{title}</div>
            <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY }}>{body}</div>
            {note && <div style={{ fontSize: 15, lineHeight: 1.55, color: MUTED }}>{note}</div>}
            <div style={{ marginTop: "auto", paddingTop: 10 }}>
                <CtaRow>
                    <Cta href={href}>{cta}</Cta>
                    {links.map(([label, h]) => (
                        <Cta key={label} href={h}>
                            {label}
                        </Cta>
                    ))}
                </CtaRow>
            </div>
        </div>
    </div>
);

export const CardGrid = ({ children, min = 300 }: { children: ReactNode; min?: number }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 16, margin: "16px 0 24px" }}>{children}</div>
);

/* ------------------------------------------------------------------- Steps --- */

export interface StepItem {
    label: string;
    title: string;
    body: ReactNode;
    /** done = behind us, now = where we are, next = ahead. */
    state?: "done" | "now" | "next";
    meta?: string;
}

/** A strip of steps read left to right. The current one is filled. */
export const Steps = ({ items }: { items: StepItem[] }) => (
    <div
        style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`,
            border: `1px solid ${LINE}`,
            borderRadius: 18,
            overflow: "hidden",
            margin: "16px 0 24px",
            fontFamily: FONT,
        }}
    >
        {items.map((s, i) => {
            const now = s.state === "now";
            return (
                <div
                    key={s.title}
                    style={{ padding: "20px 20px 22px", borderLeft: i ? `1px solid ${LINE}` : undefined, background: now ? PINK_SOFT : "#FFFFFF" }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Eyebrow color={now ? PINK_DARK : s.state === "done" ? TEAL_DARK : MUTED}>{s.label}</Eyebrow>
                        {s.state && (
                            <Chip tone={now ? "ink" : s.state === "done" ? "teal" : "plain"}>{now ? "Now" : s.state === "done" ? "Done" : "Next"}</Chip>
                        )}
                    </div>
                    <div style={{ fontSize: 19, fontWeight: 800, color: INK, margin: "10px 0 6px", lineHeight: 1.25 }}>{s.title}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY }}>{s.body}</div>
                    {s.meta && <div style={{ fontSize: 15, color: MUTED, marginTop: 8 }}>{s.meta}</div>}
                </div>
            );
        })}
    </div>
);

/* ----------------------------------------------------------------- Feature --- */

/** A large card for one thing we made: the art across the top, what it is, the point, and its screens. */
export const Feature = ({
    art,
    eyebrow,
    title,
    what,
    point,
    actions,
    shots,
}: {
    art: string;
    eyebrow: string;
    title: string;
    what: ReactNode;
    point: ReactNode;
    actions: ReactNode;
    shots: { src: string; alt: string }[];
}) => (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 22, overflow: "hidden", margin: "16px 0 24px", background: "#FFFFFF", fontFamily: FONT }}>
        <div
            style={{
                backgroundImage: `linear-gradient(90deg, rgba(251,247,247,0.98) 0%, rgba(251,247,247,0.92) 55%, rgba(251,247,247,0) 88%), url(${art})`,
                backgroundSize: "cover",
                backgroundPosition: "right 62%",
                padding: "44px 28px 18px",
            }}
        >
            <Eyebrow>{eyebrow}</Eyebrow>
            <div style={{ fontSize: 28, fontWeight: 800, color: INK, marginTop: 6, lineHeight: 1.2 }}>{title}</div>
        </div>
        <div style={{ padding: "22px 28px 26px", display: "grid", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 28 }}>
                <div>
                    <Eyebrow color={MUTED}>What it is</Eyebrow>
                    <div style={{ fontSize: 17, lineHeight: 1.55, color: INK, marginTop: 6 }}>{what}</div>
                </div>
                <div>
                    <Eyebrow color={MUTED}>The point</Eyebrow>
                    <div style={{ fontSize: 17, lineHeight: 1.55, color: BODY, marginTop: 6 }}>{point}</div>
                </div>
            </div>
            <div>{actions}</div>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${shots.length}, minmax(0, 1fr))`,
                    gap: 16,
                    background: "#F6F3F6",
                    borderRadius: 14,
                    padding: 16,
                }}
            >
                {shots.map((s) => (
                    <BrowserFrame key={s.alt} src={s.src} alt={s.alt} style={{ boxShadow: "0 6px 16px rgba(16,24,40,0.1)" }} />
                ))}
            </div>
        </div>
    </div>
);

/* ---------------------------------------------------------------- Timeline --- */

export interface Milestone {
    date: string;
    title: string;
    body: ReactNode;
    state: "done" | "now" | "next";
    href?: string;
    cta?: string;
    shot?: string;
}

/** Milestones on a track, oldest first: teal dots are behind us, the pink one is now, hollow ones are ahead. */
export const Timeline = ({ items }: { items: Milestone[] }) => (
    <div style={{ position: "relative", margin: "20px 0 28px", fontFamily: FONT }}>
        <div
            style={{
                position: "absolute",
                left: 13,
                top: 8,
                bottom: 8,
                width: 3,
                background: `linear-gradient(${TEAL} 0%, ${TEAL} 62%, ${PINK} 78%, #D0D5DD 100%)`,
                borderRadius: 3,
            }}
            aria-hidden="true"
        />
        <div style={{ display: "grid", gap: 14 }}>
            {items.map((m) => {
                const color = m.state === "done" ? TEAL : m.state === "now" ? PINK_DARK : "#98A2B3";
                return (
                    <div key={m.title} style={{ display: "grid", gridTemplateColumns: "30px minmax(0, 1fr)", gap: 16, alignItems: "start" }}>
                        <span
                            aria-hidden="true"
                            style={{
                                width: 29,
                                height: 29,
                                borderRadius: 99,
                                background: m.state === "next" ? "#FFFFFF" : color,
                                border: `3px solid ${color}`,
                                boxShadow: m.state === "now" ? `0 0 0 6px ${PINK_SOFT}` : "0 0 0 4px #FFFFFF",
                                boxSizing: "border-box",
                                marginTop: 14,
                                position: "relative",
                            }}
                        />
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: m.shot ? "minmax(0, 1fr) 220px" : "minmax(0, 1fr)",
                                gap: 18,
                                alignItems: "center",
                                border: `1px solid ${m.state === "now" ? PINK : LINE}`,
                                background: m.state === "now" ? "#FFF7FB" : "#FFFFFF",
                                borderRadius: 16,
                                padding: "16px 18px",
                            }}
                        >
                            <div>
                                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                                    <Eyebrow color={m.state === "done" ? TEAL_DARK : m.state === "now" ? PINK_DARK : MUTED}>{m.date}</Eyebrow>
                                    <Chip tone={m.state === "done" ? "teal" : m.state === "now" ? "pink" : "plain"}>
                                        {m.state === "done" ? "Done" : m.state === "now" ? "Now" : "Next"}
                                    </Chip>
                                </div>
                                <div style={{ fontSize: 19, fontWeight: 800, color: INK, margin: "8px 0 4px", lineHeight: 1.25 }}>{m.title}</div>
                                <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY }}>{m.body}</div>
                                {m.href && m.cta && (
                                    <div style={{ marginTop: 8 }}>
                                        <Cta href={m.href}>{m.cta}</Cta>
                                    </div>
                                )}
                            </div>
                            {m.shot && <BrowserFrame src={m.shot} alt={m.title} style={{ boxShadow: "0 6px 16px rgba(16,24,40,0.1)" }} />}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

/* ------------------------------------------------------------ Split example --- */

/** Text on one side, a real screen on the other: a rule or a step, with its proof beside it. */
export const Split = ({
    n,
    eyebrow,
    title,
    children,
    shot,
    caption,
    actions,
    flip,
}: {
    n?: number | string;
    eyebrow?: string;
    title: string;
    children: ReactNode;
    shot: string;
    caption: string;
    actions?: ReactNode;
    flip?: boolean;
}) => (
    <div
        style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
            gap: 28,
            alignItems: "center",
            border: `1px solid ${LINE}`,
            borderRadius: 20,
            padding: 22,
            margin: "16px 0",
            background: "#FFFFFF",
            fontFamily: FONT,
        }}
    >
        <div style={{ order: flip ? 2 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {n !== undefined && (
                    <span
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 34,
                            height: 34,
                            borderRadius: 99,
                            background: INK,
                            color: "#FFFFFF",
                            fontSize: 17,
                            fontWeight: 800,
                        }}
                    >
                        {n}
                    </span>
                )}
                {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, color: INK, margin: "10px 0 8px", lineHeight: 1.2 }}>{title}</div>
            <div style={{ fontSize: 15, lineHeight: 1.6, color: BODY }}>{children}</div>
            {actions && <div style={{ marginTop: 14 }}>{actions}</div>}
        </div>
        <figure style={{ margin: 0, order: flip ? 1 : 2 }}>
            <div style={{ background: "#F6F3F6", borderRadius: 14, padding: 14 }}>
                <BrowserFrame src={shot} alt={caption} />
            </div>
            <figcaption style={{ fontSize: 15, color: MUTED, marginTop: 8, textAlign: "center" }}>{caption}</figcaption>
        </figure>
    </div>
);

/** A short list inside a Split: bold lead-in, then the rule. */
export const Points = ({ items }: { items: [string, ReactNode][] }) => (
    <ul style={{ margin: "6px 0 0", padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
        {items.map(([lead, text]) => (
            <li key={lead} style={{ display: "grid", gridTemplateColumns: "10px minmax(0,1fr)", gap: 10, alignItems: "baseline" }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: TEAL, display: "inline-block" }} aria-hidden="true" />
                <span>
                    <b style={{ color: INK }}>{lead}</b> {text}
                </span>
            </li>
        ))}
    </ul>
);

/* ----------------------------------------------------------- Decision cards --- */

/** An open decision as two options side by side: what's built, and the alternative. */
export const Decision = ({
    title,
    built,
    alternative,
    href,
    cta,
}: {
    title: string;
    built: ReactNode;
    alternative: ReactNode;
    href?: string;
    cta?: string;
}) => (
    <div
        style={{
            border: `1px solid ${LINE}`,
            borderRadius: 16,
            padding: 18,
            background: "#FFFFFF",
            fontFamily: FONT,
            display: "flex",
            flexDirection: "column",
            gap: 12,
        }}
    >
        <div style={{ fontSize: 19, fontWeight: 800, color: INK, lineHeight: 1.25 }}>{title}</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: TEAL_SOFT, borderRadius: 12, padding: "10px 12px" }}>
                <Eyebrow color={TEAL_DARK}>Built as</Eyebrow>
                <div style={{ fontSize: 15, lineHeight: 1.5, color: INK, marginTop: 4 }}>{built}</div>
            </div>
            <div style={{ background: "#F2F4F7", borderRadius: 12, padding: "10px 12px" }}>
                <Eyebrow color={MUTED}>Or</Eyebrow>
                <div style={{ fontSize: 15, lineHeight: 1.5, color: INK, marginTop: 4 }}>{alternative}</div>
            </div>
        </div>
        {href && cta && (
            <div style={{ marginTop: "auto" }}>
                <Cta href={href}>{cta}</Cta>
            </div>
        )}
    </div>
);

/* ------------------------------------------------------------------- Stats --- */

export const Stats = ({ items }: { items: [string, string][] }) => (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(150px, 1fr))`, gap: 12, margin: "16px 0 24px", fontFamily: FONT }}>
        {items.map(([value, label]) => (
            <div key={label} style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: "16px 18px", background: WARM }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: TEAL_DARK, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 15, color: BODY, marginTop: 6 }}>{label}</div>
            </div>
        ))}
    </div>
);

export const Callout = ({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "pink" }) => (
    <div
        style={{
            background: tone === "teal" ? TEAL_SOFT : PINK_SOFT,
            borderLeft: `4px solid ${tone === "teal" ? TEAL_DARK : PINK_DARK}`,
            borderRadius: 12,
            padding: "14px 18px",
            margin: "16px 0",
            fontFamily: FONT,
            fontSize: 15,
            lineHeight: 1.55,
            color: INK,
        }}
    >
        {children}
    </div>
);

/* -------------------------------------------------------------- Mini cards --- */

/** A small card for one short point, optionally leading somewhere. */
export const MiniCard = ({
    eyebrow,
    title,
    children,
    href,
    cta,
    tone = "plain",
}: {
    eyebrow?: string;
    title: string;
    children: ReactNode;
    href?: string;
    cta?: string;
    tone?: "plain" | "warm";
}) => (
    <div
        style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            border: `1px solid ${LINE}`,
            borderRadius: 16,
            padding: "16px 18px",
            background: tone === "warm" ? WARM : "#FFFFFF",
            fontFamily: FONT,
        }}
    >
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <div style={{ fontSize: 19, fontWeight: 800, color: INK, lineHeight: 1.25 }}>{title}</div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY }}>{children}</div>
        {href && cta && (
            <div style={{ marginTop: "auto", paddingTop: 6 }}>
                <Cta href={href}>{cta}</Cta>
            </div>
        )}
    </div>
);

export const Swatch = ({ hex, name, use }: { hex: string; name: string; use: string }) => (
    <div
        style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: `1px solid ${LINE}`,
            borderRadius: 14,
            padding: "12px 14px",
            background: "#FFFFFF",
            fontFamily: FONT,
        }}
    >
        <span style={{ width: 44, height: 44, borderRadius: 10, background: hex, flex: "0 0 auto", boxShadow: "inset 0 0 0 1px rgba(16,24,40,0.08)" }} />
        <span style={{ fontSize: 15, lineHeight: 1.45, color: BODY }}>
            <b style={{ color: INK }}>{name}</b> · {hex}
            <br />
            {use}
        </span>
    </div>
);

/* --------------------------------------------------------------- Story map --- */

interface IndexEntry {
    title: string;
    type: string;
}

/**
 * A map of this Storybook, read from its own index at view time, so it can't drift:
 * one card per top-level section, each page or component with its number of states.
 */
export const StoryMap = ({ sections }: { sections: string[] }) => {
    const [entries, setEntries] = useState<IndexEntry[] | null>(null);
    useEffect(() => {
        fetch("./index.json")
            .then((r) => r.json())
            .then((d: { entries: Record<string, IndexEntry> }) => setEntries(Object.values(d.entries)))
            .catch(() => setEntries([]));
    }, []);
    if (!entries) return <p style={{ fontFamily: FONT, fontSize: 15, color: MUTED }}>Loading the map…</p>;
    if (entries.length === 0) return null;
    return (
        <>
            <div style={{ columnWidth: 300, columnGap: 16, margin: "16px 0 8px", fontFamily: FONT }}>
                {sections.map((section) => {
                    const inSection = entries.filter((e) => e.title === section || e.title.startsWith(`${section}/`));
                    if (inSection.length === 0) return null;
                    const groups = new Map<string, number>();
                    for (const e of inSection) {
                        const name =
                            e.title === section
                                ? section
                                : e.title
                                      .slice(section.length + 1)
                                      .split("/")
                                      .slice(0, 2)
                                      .join(" / ");
                        groups.set(name, (groups.get(name) ?? 0) + (e.type === "story" ? 1 : 0));
                    }
                    return (
                        <div
                            key={section}
                            style={{
                                breakInside: "avoid",
                                border: `1px solid ${LINE}`,
                                borderRadius: 14,
                                padding: "14px 16px",
                                marginBottom: 16,
                                background: "#FFFFFF",
                            }}
                        >
                            <div style={{ fontSize: 17, fontWeight: 800, color: INK, marginBottom: 6 }}>{section}</div>
                            {[...groups].slice(0, 14).map(([name, states]) => (
                                <div key={name} style={{ fontSize: 15, lineHeight: 1.6, color: INK }}>
                                    <b>{name}</b>
                                    {states > 1 && <span style={{ color: MUTED }}> · {states} states</span>}
                                </div>
                            ))}
                            {groups.size > 14 && <div style={{ fontSize: 15, color: MUTED }}>+ {groups.size - 14} more</div>}
                        </div>
                    );
                })}
            </div>
            <p style={{ fontFamily: FONT, fontSize: 15, color: MUTED, textAlign: "right", margin: 0 }}>
                {entries.filter((e) => e.type === "story").length} stories in total.
            </p>
        </>
    );
};
