import type { CSSProperties, ReactNode } from "react";
import { BODY, INK, LINE, MUTED, PINK_DARK, PINK_SOFT, TEAL_DARK, TEAL_SOFT, WARM, proto, story } from "../intro/tokens";
import { CardGrid, Chip, Cta, CtaRow, Feature, Hero, PageHeader, ShotCard } from "../intro/ui";
import heroArt from "../transition/art/hero-panels.jpg";
import stackArt from "../transition/art/hero-stack.jpg";
import { CONSTRAINTS, HEARD, MOBBIN_COLLECTION, PATTERNS, TIERS } from "./research";
import { CONCEPTS, type Concept, GROUPS, REACH_NOTE, type Reach } from "./round-2";
import shotV1 from "./screens/pi-v1.jpg";
import shotKeyMetrics from "./screens/pi-v2-key-metrics.jpg";
import shotQuery from "./screens/pi-v2-query.jpg";
import shotRealtime from "./screens/pi-v2-realtime.jpg";

/**
 * Storybook › Prototypes › Performance Insights: the rounds (same shape as the DAS rounds
 * page) and the research behind Round 2. Everything is read from ./round-2.ts and
 * ./research.ts. Docs text holds the 15px floor.
 */

const FONT = '"proxima-nova", "Proxima Nova", system-ui, sans-serif';
const V2 = "performance-insights/v2";
const RESEARCH = "prototypes-performance-insights-research--docs";
const ROUNDS = "prototypes-performance-insights-rounds--docs";

const Text = ({ children }: { children: ReactNode }) => (
    <div style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.6, color: BODY, margin: "8px 0 12px", maxWidth: 860 }}>{children}</div>
);

/** A section heading at weight 800 (an MDX `##` renders at 400). */
export const Heading = ({ children, id }: { children: ReactNode; id?: string }) => (
    <h2
        id={id}
        className="sb-unstyled"
        style={{
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 800,
            lineHeight: 1.25,
            color: INK,
            margin: "40px 0 10px",
            paddingBottom: 8,
            borderBottom: `1px solid ${LINE}`,
        }}
    >
        {children}
    </h2>
);

/* ------------------------------------------------------------------ Rounds --- */

export const PiHero = () => (
    <Hero
        eyebrow="Performance Insights"
        title="One reporting page, organised before it is redesigned."
        lead="Performance Insights is near real time now and will replace the realtime dashboard. Round 2 works out how it opens, how filters behave, and where 90 fields live, on the design system settled through DAS and Round 1."
        chips={[
            "Round 2 · started Nov 24",
            `${CONCEPTS.filter((c) => c.id !== "C0" && c.screen).length} of ${CONCEPTS.length - 1} concepts built`,
            "Sample data only",
        ]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto(V2, "pi-query")}>
                    Open Round 2
                </Cta>
                <Cta kind="secondary" href={story(RESEARCH)}>
                    The research
                </Cta>
            </CtaRow>
        }
        shots={[
            { src: shotQuery, label: "Performance Insights today", href: proto(V2, "pi-query") },
            { src: shotRealtime, label: "Realtime dashboard" },
            { src: shotKeyMetrics, label: "Key metrics" },
        ]}
        caption="Round 2 starts from the full application with the Round 1 styles; its prototype holds only Performance Insights, the control every concept is judged against. Sample data."
    />
);

export const RoundTwo = () => (
    <Feature
        art={stackArt}
        eyebrow="Round 2 · current · Nov 24, 2026"
        title="Organise the filters, then open on something"
        what="The 24 Nov sync asked for organisation, not a redesign: make the filter band intentional, give a chip one behaviour, finish the flow from adding a filter to removing it, and open the page on realtime's view now that Performance Insights replaces it."
        point="Three groups, each judged against today's page (C0): fixes that keep today's layout and answer one problem from the sync, the same parts reorganised around realtime and the field tiers, and three new concepts with a different layout (C14 to C16). The prototype holds only Performance Insights: its toolbar picks a concept, then that concept's main screen or one of its edge cases, and has a Data menu that fills every concept with the same query, minimal, busy, worst case, empty or random, to see each one under stress."
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto(V2, "c16-workspace")}>
                    Open the newest concept, C16
                </Cta>
                <Cta href="#concepts">The concepts</Cta>
                <Cta href={story(RESEARCH)}>Research</Cta>
            </CtaRow>
        }
        shots={[
            { src: shotQuery, alt: "Round 2, Performance Insights as it is today" },
            { src: shotRealtime, alt: "Round 2, the realtime dashboard it replaces" },
        ]}
    />
);

export const EarlierRounds = () => (
    <CardGrid>
        <ShotCard
            shot={shotV1}
            eyebrow="Round 1 · Sep 22"
            title="Templates, a question bar and a pivot explorer"
            body="Start from a template or saved query, build the question as one readable sentence that runs only when asked, and drill from app to demand source in a pivot view."
            href={proto("performance-insights/v1")}
            cta="Open Round 1"
            links={[["Round 1 concepts", story("archive-performance-insights-concepts-overview--docs")]]}
        />
    </CardGrid>
);

/* ---------------------------------------------------------------- Concepts --- */

const REACH_TONE: Record<Reach, CSSProperties> = {
    Restyle: { background: TEAL_SOFT, color: TEAL_DARK },
    Rework: { background: "#FEF0C7", color: "#93370D" },
    Rethink: { background: PINK_SOFT, color: PINK_DARK },
};

const Pill = ({ children, style }: { children: ReactNode; style: CSSProperties }) => (
    <span style={{ display: "inline-block", fontSize: 15, fontWeight: 700, padding: "3px 11px", borderRadius: 999, whiteSpace: "nowrap", ...style }}>
        {children}
    </span>
);

const patternTitle = (id: string) => PATTERNS.find((p) => p.id === id)?.title ?? id;

/** A picture of each built concept (scripts in reference/, sample data only). */
const CONCEPT_SHOTS = import.meta.glob<string>("./screens/concepts/*.jpg", { eager: true, import: "default" });
const shotOf = (id: string) => CONCEPT_SHOTS[`./screens/concepts/${id.toLowerCase()}.jpg`];

const ConceptCard = ({ c }: { c: Concept }) => (
    <section
        id={c.id}
        style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            border: `1px solid ${LINE}`,
            borderRadius: 16,
            padding: "16px 18px",
            background: "#FFFFFF",
            fontFamily: FONT,
            scrollMarginTop: 16,
        }}
    >
        {shotOf(c.id) && c.screen && (
            <a
                href={proto(V2, c.screen)}
                target="_blank"
                rel="noreferrer"
                style={{
                    display: "block",
                    margin: "-16px -18px 6px",
                    borderBottom: `1px solid ${LINE}`,
                    borderRadius: "16px 16px 0 0",
                    overflow: "hidden",
                    background: WARM,
                }}
            >
                <img
                    src={shotOf(c.id)}
                    alt={`${c.id}, ${c.title}`}
                    loading="lazy"
                    style={{ display: "block", width: "100%", height: 150, objectFit: "cover", objectPosition: "left top" }}
                />
            </a>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: MUTED }}>{c.id}</span>
            <Pill style={REACH_TONE[c.reach]}>{c.reach}</Pill>
            <Pill style={{ background: "#F2F4F7", color: "#344054" }}>{c.status}</Pill>
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, color: INK, lineHeight: 1.25 }}>{c.title}</div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: MUTED }}>{c.problem}</div>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: INK }}>{c.idea}</div>
        {c.patterns.length > 0 && (
            <div style={{ fontSize: 15, color: MUTED }}>
                Research:{" "}
                {c.patterns.map((p, i) => (
                    <span key={p}>
                        {i > 0 && ", "}
                        <a href={`${story(RESEARCH)}#${p}`} target="_top" style={{ color: PINK_DARK, fontWeight: 700, textDecoration: "none" }}>
                            {patternTitle(p)}
                        </a>
                    </span>
                ))}
            </div>
        )}
        <div style={{ marginTop: "auto", paddingTop: 4 }}>
            {c.screen ? (
                <CtaRow>
                    <Cta href={proto(V2, c.screen)}>Open in Round 2</Cta>
                    {c.states?.map(([label, route]) => (
                        <Cta key={route} href={proto(V2, route)}>
                            {label}
                        </Cta>
                    ))}
                </CtaRow>
            ) : (
                <span style={{ fontSize: 15, color: MUTED }}>Not built yet</span>
            )}
        </div>
    </section>
);

const GroupHeading = ({ title, count, note }: { title: string; count: number; note: string }) => (
    <div style={{ margin: "26px 0 12px", fontFamily: FONT }}>
        <h3 className="sb-unstyled" style={{ fontSize: 20, fontWeight: 800, color: INK, margin: 0 }}>
            {title} <span style={{ fontWeight: 600, color: MUTED }}>· {count}</span>
        </h3>
        <p className="sb-unstyled" style={{ fontSize: 15, lineHeight: 1.55, color: BODY, margin: "6px 0 0", maxWidth: 760 }}>
            {note}
        </p>
    </div>
);

const Grid = ({ children }: { children: ReactNode }) => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>{children}</div>
);

export const ConceptList = () => (
    <>
        <Text>
            Every concept is one screen in the Round 2 prototype, read against today's page, the control. They come in three groups: fixes that keep today's
            layout, the same parts reorganised, and new concepts with a different layout. The colour on each card says how far it reaches against engineering's
            constraints. Nothing is built for real until it is agreed.
        </Text>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 18px", margin: "4px 0 14px", fontFamily: FONT }}>
            {(Object.keys(REACH_NOTE) as Reach[]).map((r) => (
                <div key={r} style={{ display: "flex", gap: 8, alignItems: "baseline", maxWidth: 520 }}>
                    <Pill style={REACH_TONE[r]}>{r}</Pill>
                    <span style={{ fontSize: 15, color: BODY, lineHeight: 1.5 }}>{REACH_NOTE[r]}</span>
                </div>
            ))}
        </div>
        <GroupHeading title="The control" count={1} note="Performance Insights as it is today. Every concept below is judged against it." />
        <Grid>
            {CONCEPTS.filter((c) => !c.group).map((c) => (
                <ConceptCard key={c.id} c={c} />
            ))}
        </Grid>
        {GROUPS.map((g) => {
            const list = CONCEPTS.filter((c) => c.group === g.id).sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
            return (
                <div key={g.id} id={`concepts-${g.id.toLowerCase().replace(/\s+/g, "-")}`}>
                    <GroupHeading title={g.title} count={list.length} note={g.note} />
                    <Grid>
                        {list.map((c) => (
                            <ConceptCard key={c.id} c={c} />
                        ))}
                    </Grid>
                </div>
            );
        })}
    </>
);

/* ---------------------------------------------------------------- Research --- */

export const ResearchHeader = () => (
    <PageHeader
        art={stackArt}
        eyebrow="Prototypes · Performance Insights · Research"
        title="What we heard, what we have to work with, and what others do."
        lead="The 24 Nov PI sync, the field tiers from the data inventory, engineering's constraints for the filter band, and the patterns found on Mobbin, each tied to the concepts it shapes."
        chips={[`${HEARD.length} points from the sync`, `${TIERS.length} field tiers`, `${PATTERNS.length} patterns`]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(ROUNDS)}>
                    The concepts
                </Cta>
                <Cta kind="secondary" href={MOBBIN_COLLECTION}>
                    Mobbin collection
                </Cta>
            </CtaRow>
        }
    />
);

const Card = ({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "warm" }) => (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: "16px 18px", background: tone === "warm" ? WARM : "#FFFFFF", fontFamily: FONT }}>
        {children}
    </div>
);

export const Heard = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, margin: "14px 0" }}>
        {HEARD.map((h) => (
            <Card key={h.title} tone="warm">
                <div style={{ fontSize: 17, fontWeight: 800, color: INK, lineHeight: 1.3 }}>{h.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY, marginTop: 6 }}>{h.body}</div>
            </Card>
        ))}
    </div>
);

export const Tiers = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 10, margin: "14px 0", fontFamily: FONT }}>
        {TIERS.map((t, i) => (
            <div
                key={t.name}
                style={{
                    border: `1px solid ${LINE}`,
                    borderTop: `4px solid ${i < 3 ? TEAL_DARK : i === 3 ? "#B54708" : MUTED}`,
                    borderRadius: 12,
                    padding: "14px 14px 16px",
                }}
            >
                <div style={{ fontSize: 15, fontWeight: 700, color: MUTED }}>Tier {i + 1}</div>
                <div style={{ fontSize: 19, fontWeight: 800, color: INK, marginTop: 2 }}>{t.name}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: INK, lineHeight: 1.1, margin: "6px 0", fontVariantNumeric: "tabular-nums" }}>{t.count}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: i === 3 ? "#B54708" : TEAL_DARK }}>{t.who}</div>
                <div style={{ fontSize: 15, lineHeight: 1.5, color: BODY, marginTop: 6 }}>{t.what}</div>
            </div>
        ))}
    </div>
);

export const Constraints = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14, margin: "14px 0" }}>
        {CONSTRAINTS.map((c) => (
            <Card key={c.title}>
                <div style={{ fontSize: 17, fontWeight: 800, color: INK, lineHeight: 1.3 }}>{c.title}</div>
                <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY, marginTop: 6 }}>{c.body}</div>
            </Card>
        ))}
    </div>
);

export const Patterns = () => (
    <>
        <Text>
            Screens from Mobbin, grouped by pattern. The pictures stay in the team's{" "}
            <a href={MOBBIN_COLLECTION} target="_blank" rel="noreferrer" style={{ color: PINK_DARK, fontWeight: 700, textDecoration: "none" }}>
                Mobbin collection
            </a>{" "}
            (team sign-in); each link opens the screen there.
        </Text>
        {PATTERNS.map((p) => {
            const uses = CONCEPTS.filter((c) => c.patterns.includes(p.id));
            return (
                <section
                    key={p.id}
                    id={p.id}
                    style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: "18px 20px", margin: "14px 0", fontFamily: FONT, scrollMarginTop: 16 }}
                >
                    <div style={{ fontSize: 19, fontWeight: 800, color: INK }}>{p.title}</div>
                    <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY, margin: "6px 0 10px", maxWidth: 860 }}>{p.takeaway}</div>
                    <div style={{ display: "grid", gap: 8 }}>
                        {p.refs.map((r) => (
                            <div
                                key={r.url}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "170px minmax(0, 1fr)",
                                    gap: 12,
                                    padding: "8px 0",
                                    borderTop: `1px solid ${LINE}`,
                                }}
                            >
                                <a
                                    href={r.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: 15, fontWeight: 700, color: PINK_DARK, textDecoration: "none" }}
                                >
                                    {r.app} ↗
                                </a>
                                <span style={{ fontSize: 15, lineHeight: 1.5, color: INK }}>{r.note}</span>
                            </div>
                        ))}
                    </div>
                    {uses.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", marginTop: 10 }}>
                            <span style={{ fontSize: 15, color: MUTED, marginRight: 4 }}>Shapes</span>
                            {uses.map((c) => (
                                <a key={c.id} href={`${story(ROUNDS)}#${c.id}`} target="_top" style={{ textDecoration: "none" }}>
                                    <Chip>
                                        {c.id} · {c.title}
                                    </Chip>
                                </a>
                            ))}
                        </div>
                    )}
                </section>
            );
        })}
    </>
);
