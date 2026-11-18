import type { CSSProperties, ReactNode } from "react";
import { BODY, INK, LINE, MUTED, PINK_DARK, PINK_SOFT, TEAL_DARK, TEAL_SOFT, WARM, proto, story } from "../../intro/tokens";
import { CardGrid, Chip, Cta, CtaRow, MiniCard, PageHeader } from "../../intro/ui";
import { BOARD, ITEMS, type TransitionItem } from "../data";
import { FINDINGS, type Finding, STYLES } from "../round-1-styles";

/**
 * Storybook › Transition › Round 1 › Summary and › Before and after.
 *
 * Summary: every finding from the Nov 18 staging capture, one card per R1 item, with what
 * v2 does and what is still open. Before and after: the same element of the full
 * application in v1 (before Round 1) and v2 (staging's styles), side by side.
 *
 * Everything is read from ../data.ts and ../round-1-styles.ts. The pictures come from
 * scripts/capture-round-1-shots.mjs (sample data only; staging itself is never pictured).
 * Docs text holds the 15px floor.
 */

const FONT = '"proxima-nova", "Proxima Nova", system-ui, sans-serif';

const PAGES = {
    summary: "transition-round-1-summary--docs",
    changes: "transition-round-1-changes--docs",
    beforeAfter: "transition-round-1-before-and-after--docs",
    styleGuide: "transition-round-1-style-guide--docs",
    components: "transition-round-1-components-about--docs",
} as const;

const at = (page: keyof typeof PAGES, id: string) => `${story(PAGES[page])}#${id}`;

const CHANGES = ITEMS.filter((i) => i.round === "Round 1");
const item = (id: string) => CHANGES.find((i) => i.id === id) as TransitionItem;
const style = (id: string) => STYLES.find((s) => s.id === id)!;
const OPEN = FINDINGS.filter((f) => f.open);

/* -------------------------------------------------------------------- Bits --- */

const Text = ({ children }: { children: ReactNode }) => (
    <div style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.6, color: BODY, margin: "8px 0 12px", maxWidth: 860 }}>{children}</div>
);

export const Heading = ({ children, id }: { children: ReactNode; id?: string }) => (
    <div
        id={id}
        style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, color: INK, margin: "36px 0 8px", paddingBottom: 8, borderBottom: `1px solid ${LINE}` }}
    >
        {children}
    </div>
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
            scrollMarginTop: 16,
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
        eyebrow="Transition · Round 1 · Summary"
        title="What staging showed, item by item, and what v2 does."
        lead="Product's Round 1 list of Nov 17 has 16 items. On Nov 18 every dashboard page on staging was read: the browser's computed styles and the stylesheet behind them. The full application was forked to v2 and given those styles. v1 stays as it was reviewed."
        chips={[`${CHANGES.length} items`, `${OPEN.length} open questions`, `${below} under 15px in v2`, "Read Nov 18, 2026"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(PAGES.beforeAfter)}>
                    Before and after
                </Cta>
                <Cta kind="secondary" href={proto("app/v2", "realtime")}>
                    Open v2
                </Cta>
                <Cta href={story(PAGES.styleGuide)}>Style guide</Cta>
                <Cta href={story(PAGES.components)}>Components</Cta>
                <Cta href={BOARD}>The monday.com board</Cta>
            </CtaRow>
        }
    />
);

/** The findings that cut across items. */
export const KeyFindings = () => (
    <CardGrid min={280}>
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

const FindingCard = ({ f }: { f: Finding }) => (
    <Card id={f.id}>
        <ItemTitle id={f.id} />
        <ItemChips id={f.id} />
        <div style={{ marginTop: 8 }}>
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
        <CtaRow>
            <Cta href={at("beforeAfter", f.id)}>Before and after</Cta>
            <Cta href={at("styleGuide", f.id)}>Values and CSS</Cta>
            <Cta href={proto("app/v2", item(f.id).where[0][1])}>Open in v2</Cta>
        </CtaRow>
    </Card>
);

export const FindingList = ({ kind }: { kind: TransitionItem["kind"] }) => (
    <>
        {FINDINGS.filter((f) => item(f.id).kind === kind).map((f) => (
            <FindingCard key={f.id} f={f} />
        ))}
    </>
);

/** The questions still open, in one place. */
export const OpenQuestions = () => (
    <div style={{ display: "grid", gap: 10 }}>
        {OPEN.map((f) => (
            <div key={f.id} style={{ background: PINK_SOFT, borderRadius: 12, padding: "12px 16px", fontFamily: FONT }}>
                <span style={{ fontSize: 15, fontWeight: 800, color: PINK_DARK }}>{f.id}</span>{" "}
                <span style={{ fontSize: 15, color: INK }}>{f.open}</span>
            </div>
        ))}
    </div>
);

/** A jump list of the 16 items. */
export const ItemJump = ({ page }: { page: keyof typeof PAGES }) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 18px", margin: "12px 0 4px", fontFamily: FONT }}>
        {CHANGES.map((i) => (
            <a key={i.id} href={at(page, i.id)} target="_top" style={{ fontSize: 15, fontWeight: 700, color: INK, textDecoration: "none" }}>
                {i.id}
            </a>
        ))}
    </div>
);

/* --------------------------------------------------------- Before and after --- */

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

export const BeforeAfterHeader = () => (
    <PageHeader
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
                <Cta href={story(PAGES.summary)}>Summary</Cta>
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

/** Items whose pictures are wider than half the page: shown one above the other. */
const WIDE = new Set(["R1-01", "R1-02", "R1-08", "R1-11", "R1-12", "R1-13", "R1-15"]);

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
