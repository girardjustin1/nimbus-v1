import { type CSSProperties, type ReactNode, useState } from "react";
import { BODY, INK, LINE, MUTED, PINK_DARK, PINK_SOFT, TEAL_DARK, TEAL_SOFT, WARM, proto, story } from "../../intro/tokens";
import { CardGrid, Chip, Cta, CtaRow, MiniCard, PageHeader } from "../../intro/ui";
import panelsArt from "../art/hero-panels.jpg";
import stackArt from "../art/hero-stack.jpg";
import { BOARD, ITEMS, type TransitionItem } from "../data";
import { FINDINGS, type Finding, RECHECK, STYLES } from "../round-1-styles";
import { NAV_OFFSET, PAGES, at } from "./round-pages";

/**
 * Storybook › Transition › Round 1 › Summary and › Before and after.
 *
 * Summary: the round in numbers, a picture of every item, the questions still open, what
 * the second read after the Nov 18 release found, and one card per R1 item with what
 * staging showed and what v2 does. Before and after: the same element of the full
 * application in v1 (before Round 1) and v2 (staging's styles), side by side.
 *
 * Everything is read from ../data.ts and ../round-1-styles.ts. The pictures come from
 * scripts/capture-round-1-shots.mjs (sample data only; staging itself is never pictured).
 * Docs text holds the 15px floor.
 */

const FONT = '"proxima-nova", "Proxima Nova", system-ui, sans-serif';

const CHANGES = ITEMS.filter((i) => i.round === "Round 1");
const item = (id: string) => CHANGES.find((i) => i.id === id) as TransitionItem;
const style = (id: string) => STYLES.find((s) => s.id === id)!;
const OPEN = FINDINGS.filter((f) => f.open);

/* ---------------------------------------------------------------- Pictures --- */

const SHOTS = import.meta.glob<string>("./shots/*.jpg", { eager: true, import: "default" });

/** The pictures of an item, in order: [before, after] pairs. */
const pairsOf = (id: string) => {
    const pairs: { n: number; v1: string; v2: string }[] = [];
    for (let n = 1; n < 5; n++) {
        const key = (v: string) => `./shots/${id.toLowerCase()}-${n}-${v}.jpg`;
        if (SHOTS[key("v1")] && SHOTS[key("v2")]) pairs.push({ n, v1: SHOTS[key("v1")], v2: SHOTS[key("v2")] });
    }
    return pairs;
};

/** Items whose pictures are wider than half the page: shown one above the other. */
const WIDE = new Set(["R1-01", "R1-02", "R1-08", "R1-11", "R1-12", "R1-13", "R1-15"]);

/* -------------------------------------------------------------------- Bits --- */

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

const Label = ({ children, color = MUTED }: { children: ReactNode; color?: string }) => (
    <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color, marginBottom: 2 }}>{children}</div>
);

const Card = ({ id, children, tone = "plain" }: { id?: string; children: ReactNode; tone?: "plain" | "warm" }) => (
    <section
        id={id}
        style={{
            border: `1px solid ${LINE}`,
            borderRadius: 16,
            padding: "18px 22px",
            margin: "14px 0",
            background: tone === "warm" ? WARM : "#FFFFFF",
            fontFamily: FONT,
            scrollMarginTop: NAV_OFFSET,
        }}
    >
        {children}
    </section>
);

const ItemTitle = ({ id }: { id: string }) => (
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: MUTED }}>{id}</span>
        <span style={{ fontSize: 19, fontWeight: 800, color: INK, lineHeight: 1.3 }}>{item(id).title}</span>
    </div>
);

const ItemChips = ({ id }: { id: string }) => {
    const s = style(id);
    const f = FINDINGS.find((x) => x.id === id);
    return (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "10px 0 4px" }}>
            <Chip>{item(id).kind}</Chip>
            <Chip>{item(id).area}</Chip>
            {s.belowFloor && <Chip tone="pink">Under 15px in v2</Chip>}
            {f?.open && <Chip tone="ink">Open question</Chip>}
        </div>
    );
};

/* ----------------------------------------------------------------- Summary --- */

const below = STYLES.filter((s) => s.belowFloor).length;

export const SummaryHeader = () => (
    <PageHeader
        art={stackArt}
        eyebrow="Transition · Round 1 · Summary"
        title="What staging showed, item by item, and what v2 does."
        lead="Product's Round 1 list of Nov 17 has 16 items. On Nov 18 every dashboard page on staging was read, the full application was forked to v2 and given those styles, and staging was read again after that day's release. Every value held."
        chips={["Read Nov 18, 2026", "Re-checked after the Nov 18 release"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(PAGES.beforeAfter)}>
                    Before and after
                </Cta>
                <Cta kind="secondary" href={proto("app/v2", "realtime")}>
                    Open v2
                </Cta>
                <Cta href={story(PAGES.styleGuide)}>Style guide</Cta>
                <Cta href={BOARD}>The monday.com board</Cta>
            </CtaRow>
        }
    />
);

const Stat = ({ n, label, tone = "plain", href }: { n: number; label: string; tone?: "plain" | "pink" | "teal"; href?: string }) => {
    const color = tone === "pink" ? PINK_DARK : tone === "teal" ? TEAL_DARK : INK;
    const body = (
        <>
            <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color, fontVariantNumeric: "tabular-nums" }}>{n}</div>
            <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, color: BODY, marginTop: 8 }}>{label}</div>
        </>
    );
    const box: CSSProperties = {
        display: "block",
        border: `1px solid ${LINE}`,
        borderRadius: 16,
        padding: "18px 18px 16px",
        background: tone === "pink" ? PINK_SOFT : tone === "teal" ? TEAL_SOFT : "#FFFFFF",
        fontFamily: FONT,
        textDecoration: "none",
    };
    return href ? (
        <a href={href} className="sb-unstyled" style={box}>
            {body}
        </a>
    ) : (
        <div style={box}>{body}</div>
    );
};

/** The round in five numbers, and how far along it is. */
export const Scoreboard = () => {
    const ready = CHANGES.filter((i) => i.status === "Ready for review").length;
    const approved = CHANGES.filter((i) => ["Approved", "Ported", "On staging", "Live", "Done"].includes(i.status)).length;
    const count = (kind: TransitionItem["kind"]) => CHANGES.filter((i) => i.kind === kind).length;
    return (
        <div style={{ margin: "0 0 8px", fontFamily: FONT }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 12 }}>
                <Stat n={CHANGES.length} label="changes on product's list" />
                <Stat n={count("Back to current style")} label="go back to the current style" />
                <Stat n={count("Adjustment")} label="adjustments that apply everywhere" />
                <Stat n={OPEN.length} label="open questions" tone="pink" href="#open-questions" />
                <Stat n={ready + approved} label={approved ? `built in v2, ${approved} approved` : "built in v2, ready for review"} tone="teal" />
            </div>
            <div
                role="img"
                aria-label={`${ready} of ${CHANGES.length} ready for review, ${approved} approved`}
                style={{ display: "flex", gap: 3, marginTop: 14 }}
            >
                {CHANGES.map((i) => (
                    <span
                        key={i.id}
                        title={`${i.id} · ${i.status}`}
                        style={{
                            flex: "1 1 0",
                            height: 8,
                            borderRadius: 99,
                            background: ["Approved", "Ported", "On staging", "Live", "Done"].includes(i.status)
                                ? TEAL_DARK
                                : i.status === "Ready for review"
                                  ? "#F5B63F"
                                  : "#E4E7EC",
                        }}
                    />
                ))}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px", fontSize: 15, color: MUTED, marginTop: 8 }}>
                <span>
                    <b style={{ color: INK }}>
                        {ready} of {CHANGES.length}
                    </b>{" "}
                    ready for review
                </span>
                <span>
                    <b style={{ color: INK }}>{approved}</b> approved
                </span>
            </div>
        </div>
    );
};

/** Every item as a picture of the result in v2: the page's index. */
export const ItemGallery = () => (
    <div className="sb-unstyled" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(228px, 1fr))", gap: 14, margin: "16px 0 8px", fontFamily: FONT }}>
        {CHANGES.map((i) => {
            const shot = pairsOf(i.id)[0]?.v2;
            const open = OPEN.some((f) => f.id === i.id);
            return (
                <a
                    key={i.id}
                    href={`#${i.id}`}
                    style={{ display: "flex", flexDirection: "column", border: `1px solid ${LINE}`, borderRadius: 14, overflow: "hidden", background: "#FFFFFF", textDecoration: "none" }}
                >
                    {/* The picture at its true size, cropped to the tile: a real piece of the screen, not a scaled one. It was captured at 2x, and with no 1x source the browser halves it. */}
                    <span style={{ display: "flex", alignItems: "safe center", height: 112, padding: "0 12px", background: "#FFFFFF", borderBottom: `1px solid ${LINE}`, overflow: "hidden" }}>
                        {shot && <img srcSet={`${shot} 2x`} alt="" loading="lazy" style={{ display: "block", flex: "0 0 auto", maxWidth: "none", maxHeight: "none" }} />}
                    </span>
                    <span style={{ display: "block", padding: "10px 14px 12px" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ fontSize: 15, fontWeight: 700, color: MUTED }}>{i.id}</span>
                            {open && <span style={{ fontSize: 15, fontWeight: 700, color: PINK_DARK }}>Open question</span>}
                        </span>
                        <span style={{ display: "block", fontSize: 17, fontWeight: 800, lineHeight: 1.25, color: INK, marginTop: 2 }}>{i.title}</span>
                        <span style={{ display: "block", fontSize: 15, color: BODY, marginTop: 4 }}>{i.area}</span>
                    </span>
                </a>
            );
        })}
    </div>
);

/** The findings that cut across items. */
export const KeyFindings = () => (
    <CardGrid min={220}>
        <MiniCard eyebrow="R1-01 to R1-13" title="The current styles are smaller" tone="warm">
            Staging sets most labels at 10 to 13px. Going back to them puts {below} items under the 15px floor from Oct 5. v2 does this only for those items; v1
            and everything else keep the floor.
        </MiniCard>
        <MiniCard eyebrow="R1-04" title="Four label styles became one" tone="warm">
            Staging has four small upper case labels (10, 11 and 12px, two weights, two spacings). v2 uses one: 12px, weight 800, 0.75px.
        </MiniCard>
        <MiniCard eyebrow="R1-09" title="Staging's buttons render in Arial" tone="warm">
            The button rule sets no font, so the browser falls back to Arial. v2 keeps Proxima Nova and centres the label, which fixes the 1px-high text.
        </MiniCard>
        <MiniCard eyebrow="R1-15" title="Two different column shifts" tone="warm">
            Staging's headers start 26px right of their values. v1 right-aligned number columns. v2 aligns every column left.
        </MiniCard>
    </CardGrid>
);

const Line = ({ label, children, color }: { label: string; children: ReactNode; color?: string }) => (
    <div style={{ display: "grid", gridTemplateColumns: "150px minmax(0, 1fr)", gap: 12, padding: "8px 0", borderTop: `1px solid ${LINE}` }}>
        <Label color={color}>{label}</Label>
        <div style={{ fontSize: 15, lineHeight: 1.55, color: INK }}>{children}</div>
    </div>
);

const SEGMENT: CSSProperties = {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 1.2,
    padding: "5px 12px",
    borderRadius: 999,
    border: 0,
    cursor: "pointer",
};

/** One frame, two pictures: the same element before and after, switched in place. */
const Flip = ({ v1, v2, what }: { v1: string; v2: string; what: string }) => {
    const [side, setSide] = useState<"v1" | "v2">("v2");
    const img = (src: string, on: boolean, label: string): ReactNode => (
        <img
            src={src}
            alt={on ? `${what}, ${label}` : ""}
            aria-hidden={!on}
            loading="lazy"
            style={{ gridArea: "1 / 1", alignSelf: "start", display: "block", width: "100%", height: "auto", opacity: on ? 1 : 0, transition: "opacity 140ms" }}
        />
    );
    return (
        <figure className="sb-unstyled" style={{ margin: 0, minWidth: 0 }}>
            <div role="group" aria-label="Version shown" style={{ display: "inline-flex", gap: 2, padding: 3, borderRadius: 999, background: "#F2F4F7", marginBottom: 8 }}>
                <button
                    type="button"
                    aria-pressed={side === "v1"}
                    onClick={() => setSide("v1")}
                    style={{ ...SEGMENT, background: side === "v1" ? "#FFFFFF" : "transparent", color: side === "v1" ? INK : MUTED, boxShadow: side === "v1" ? "0 1px 2px rgba(16,24,40,0.12)" : undefined }}
                >
                    Before · v1
                </button>
                <button
                    type="button"
                    aria-pressed={side === "v2"}
                    onClick={() => setSide("v2")}
                    style={{ ...SEGMENT, background: side === "v2" ? TEAL_DARK : "transparent", color: side === "v2" ? "#FFFFFF" : MUTED }}
                >
                    After · v2
                </button>
            </div>
            <div
                onClick={() => setSide(side === "v1" ? "v2" : "v1")}
                style={{ display: "grid", border: `1px solid ${LINE}`, borderRadius: 10, overflow: "hidden", background: "#FFFFFF", cursor: "pointer" }}
            >
                {img(v1, side === "v1", "before, in v1")}
                {img(v2, side === "v2", "after, in v2")}
            </div>
        </figure>
    );
};

const FindingCard = ({ f }: { f: Finding }) => {
    const pair = pairsOf(f.id)[0];
    const wide = WIDE.has(f.id);
    const lines = (
        <div>
            <Line label="Product asked">{item(f.id).request}</Line>
            <Line label="Staging today">{f.found}</Line>
            <Line label="In v2" color={TEAL_DARK}>
                {f.v2}
            </Line>
            {f.open && (
                <Line label="Open" color={PINK_DARK}>
                    {f.open}
                </Line>
            )}
        </div>
    );
    return (
        <Card id={f.id}>
            <ItemTitle id={f.id} />
            <ItemChips id={f.id} />
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: wide || !pair ? "minmax(0, 1fr)" : "minmax(0, 1fr) minmax(0, 360px)",
                    gap: wide ? 14 : 24,
                    alignItems: "start",
                    marginTop: 10,
                }}
            >
                {pair && wide && <Flip v1={pair.v1} v2={pair.v2} what={item(f.id).title} />}
                {lines}
                {pair && !wide && <Flip v1={pair.v1} v2={pair.v2} what={item(f.id).title} />}
            </div>
            <div style={{ marginTop: 10 }}>
                <CtaRow>
                    <Cta href={at("beforeAfter", f.id)}>Before and after</Cta>
                    <Cta href={at("styleGuide", f.id)}>Values and CSS</Cta>
                    <Cta href={proto("app/v2", item(f.id).where[0][1])}>Open in v2</Cta>
                </CtaRow>
            </div>
        </Card>
    );
};

export const FindingList = ({ kind }: { kind: TransitionItem["kind"] }) => (
    <>
        {FINDINGS.filter((f) => item(f.id).kind === kind).map((f) => (
            <FindingCard key={f.id} f={f} />
        ))}
    </>
);

/** The questions still open, in one place. */
export const OpenQuestions = () => (
    <div className="sb-unstyled" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 12, margin: "14px 0 0", fontFamily: FONT }}>
        {OPEN.map((f) => (
            <a
                key={f.id}
                href={`#${f.id}`}
                style={{ display: "grid", gridTemplateColumns: "40px minmax(0, 1fr)", gap: 14, background: PINK_SOFT, borderRadius: 16, padding: "16px 18px", textDecoration: "none" }}
            >
                <span
                    aria-hidden="true"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40, borderRadius: 99, background: PINK_DARK, color: "#FFFFFF", fontSize: 22, fontWeight: 800 }}
                >
                    ?
                </span>
                <span>
                    <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: PINK_DARK }}>
                        {f.id} · {item(f.id).title}
                    </span>
                    <span style={{ display: "block", fontSize: 17, lineHeight: 1.45, color: INK, marginTop: 2 }}>{f.open}</span>
                </span>
            </a>
        ))}
    </div>
);

const RECHECK_COLS = "64px minmax(0, 1fr) minmax(0, 1fr)";

/** What the second read, after the Nov 18 release, found. */
export const Recheck = () => (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden", margin: "14px 0", fontFamily: FONT }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: TEAL_SOFT, padding: "16px 20px" }}>
            <span
                aria-hidden="true"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto", width: 40, height: 40, borderRadius: 99, background: TEAL_DARK, color: "#FFFFFF", fontSize: 20, fontWeight: 800 }}
            >
                ✓
            </span>
            <div>
                <div style={{ fontSize: 19, fontWeight: 800, color: INK, lineHeight: 1.25 }}>Every Round 1 value held.</div>
                <div style={{ fontSize: 15, lineHeight: 1.5, color: BODY, marginTop: 2 }}>
                    Staging was read a second time after the Nov 18 release: every page, its computed styles and its stylesheet, compared element by element with the
                    first read.
                </div>
            </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: RECHECK_COLS, gap: 16, padding: "10px 20px", background: WARM, borderTop: `1px solid ${LINE}` }}>
            <Label>Item</Label>
            <Label>What the release changed</Label>
            <Label color={TEAL_DARK}>For Round 1</Label>
        </div>
        {RECHECK.map((r) => (
            <div key={r.change} style={{ display: "grid", gridTemplateColumns: RECHECK_COLS, gap: 16, padding: "12px 20px", borderTop: `1px solid ${LINE}` }}>
                <div>
                    {r.id ? (
                        <a href={`#${r.id}`} className="sb-unstyled" style={{ fontSize: 15, fontWeight: 700, color: PINK_DARK, textDecoration: "none" }}>
                            {r.id}
                        </a>
                    ) : (
                        <span style={{ fontSize: 15, color: MUTED }}>All</span>
                    )}
                </div>
                <div style={{ fontSize: 15, lineHeight: 1.55, color: INK }}>{r.change}</div>
                <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY }}>{r.effect}</div>
            </div>
        ))}
    </div>
);

/* --------------------------------------------------------- Before and after --- */

export const BeforeAfterHeader = () => (
    <PageHeader
        art={panelsArt}
        eyebrow="Transition · Round 1 · Before and after"
        title="v1 next to v2, item by item."
        lead="Before: the full application as reviewed on Nov 13 (v1). After: the same element in v2, with the styles the dashboard uses today. Under each pair, the values staging uses. Pictures of the prototype, with sample data."
        chips={[`${CHANGES.length} items`, "Before · v1", "After · v2 = staging's styles"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto("app/v2", "realtime")}>
                    Open v2
                </Cta>
                <Cta kind="secondary" href={proto("app/v1", "realtime")}>
                    Open v1
                </Cta>
            </CtaRow>
        }
    />
);

const FRAME: CSSProperties = { display: "block", width: "100%", height: "auto", border: `1px solid ${LINE}`, borderRadius: 10, background: "#FFFFFF" };

const Shot = ({ src, label, tone }: { src: string; label: string; tone: "before" | "after" }) => (
    <figure style={{ margin: 0, minWidth: 0 }}>
        <div
            style={{
                display: "inline-block",
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                padding: "2px 10px",
                borderRadius: 999,
                marginBottom: 6,
                color: tone === "after" ? TEAL_DARK : MUTED,
                background: tone === "after" ? TEAL_SOFT : "#F2F4F7",
            }}
        >
            {label}
        </div>
        <img src={src} alt={`${label}`} loading="lazy" style={FRAME} />
    </figure>
);

/** Wide pictures stack; narrow ones sit side by side. */
const Pair = ({ v1, v2, wide }: { v1: string; v2: string; wide: boolean }) => (
    <div style={{ display: "grid", gridTemplateColumns: wide ? "minmax(0, 1fr)" : "repeat(2, minmax(0, 1fr))", gap: 14, margin: "12px 0" }}>
        <Shot src={v1} label="Before · v1" tone="before" />
        <Shot src={v2} label="After · v2" tone="after" />
    </div>
);

const StagingValues = ({ id }: { id: string }) => (
    <div style={{ background: WARM, border: `1px solid ${LINE}`, borderRadius: 12, padding: "10px 14px", fontFamily: FONT }}>
        <Label>Staging today</Label>
        <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 2 }}>
            {style(id).measures.map((m) => (
                <li key={m.label} style={{ fontSize: 15, lineHeight: 1.5, color: INK }}>
                    <b>{m.label}:</b> {m.staging}
                    <span style={{ color: MUTED }}> · v1 {m.v1} · v2 {m.v2}</span>
                </li>
            ))}
        </ul>
    </div>
);

const BeforeAfterCard = ({ id }: { id: string }) => {
    const f = FINDINGS.find((x) => x.id === id)!;
    return (
        <Card id={id}>
            <ItemTitle id={id} />
            <ItemChips id={id} />
            <Text>{f.v2}</Text>
            {pairsOf(id).map((p) => (
                <Pair key={p.n} v1={p.v1} v2={p.v2} wide={WIDE.has(id)} />
            ))}
            {id === "R1-16" && <Text>Both pictures show the pointer over the first option of the section.</Text>}
            <StagingValues id={id} />
            <div style={{ marginTop: 10 }}>
                <CtaRow>
                    <Cta href={at("summary", id)}>Finding</Cta>
                    <Cta href={at("styleGuide", id)}>Values and CSS</Cta>
                    <Cta href={proto("app/v1", item(id).where[0][1])}>Open in v1</Cta>
                    <Cta href={proto("app/v2", item(id).where[0][1])}>Open in v2</Cta>
                </CtaRow>
            </div>
        </Card>
    );
};

export const BeforeAfterList = ({ kind }: { kind: TransitionItem["kind"] }) => (
    <>
        {CHANGES.filter((i) => i.kind === kind).map((i) => (
            <BeforeAfterCard key={i.id} id={i.id} />
        ))}
    </>
);
