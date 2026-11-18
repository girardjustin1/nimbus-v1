import type { CSSProperties, ReactNode } from "react";
import { BODY, INK, LINE, MUTED, WARM, proto, story } from "../intro/tokens";
import { Callout, Chip, Cta, CtaRow, PageHeader } from "../intro/ui";
import { ITEMS, type Kind } from "./data";
import { type RoundOneStyle, STAGING, STYLES, TOKENS } from "./round-1-styles";

/**
 * Storybook › Transition › Round 1 › Style guide: for each Round 1 item, the style the
 * dashboard uses today (read from staging on Nov 18, 2026), next to v1 and v2.
 * Everything is drawn from ./round-1-styles.ts, the file v2 reads its styles from.
 *
 * Docs text holds the 15px floor. Specimens show v2's real sizes, some under 15px,
 * inside a framed box marked `data-specimen`.
 */

const FONT = '"proxima-nova", "Proxima Nova", system-ui, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';
const ROUND_PAGE = "transition-round-1-changes--docs";

/** A link to an item's row on the Round 1 page (its anchor id is the item id). */
const roundLink = (id: string) => `${story(ROUND_PAGE)}#${id}`;

/* -------------------------------------------------------------------- Text --- */

/** Running text at the 15px floor (a paragraph written straight into MDX renders at 14px). */
const Text = ({ children }: { children: ReactNode }) => (
    <div style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.6, color: BODY, margin: "8px 0 12px", maxWidth: 860 }}>{children}</div>
);

const LABEL: CSSProperties = { fontFamily: FONT, fontSize: 15, fontWeight: 700, color: MUTED };

/* ------------------------------------------------------------------ Header --- */

const below = STYLES.filter((s) => s.belowFloor).length;

export const StyleGuideHeader = () => (
    <PageHeader
        eyebrow="Transition · Round 1 · Style guide"
        title="The current dashboard's styles, item by item."
        lead="For each Round 1 item: the style the dashboard uses today, read from staging on Nov 18, 2026, next to v1 and v2 of the full application. v2 is v1 with the Round 1 styles."
        chips={[`${STYLES.length} items`, "Read Nov 18, 2026", `${below} with sizes under 15px in v2`]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto("app/v2", "realtime")}>
                    Open v2
                </Cta>
                <Cta kind="secondary" href={story(ROUND_PAGE)}>
                    Round 1 changes
                </Cta>
                <Cta href={proto("app/v1", "realtime")}>v1 for comparison</Cta>
            </CtaRow>
        }
    />
);

export const FloorNote = () => (
    <Callout>
        <b>Sizes under 15px.</b> v2 uses a size under 15px only where Round 1 asks for the current style and the current style is smaller. Those {below} items
        carry a “Under 15px in v2” chip. v1 keeps the 15px floor.
    </Callout>
);

export const SourceNote = () => (
    <Text>
        Staging values are the browser's computed style of each element and the stylesheet rule that sets it. Engineering confirmed staging carries the current
        production version. The first read, on Nov 18, had engineering's DAS port in place of production DAS. After that day's release put production DAS
        back, staging was read again and every value held. v1 values were measured in the v1 prototype the same day. In the v2 column, bold marks a value that
        differs from staging.
    </Text>
);

/** A section heading at weight 800 (an MDX `##` renders at 400). */
export const Heading = ({ children }: { children: ReactNode }) => (
    <h2
        className="sb-unstyled"
        style={{
            fontFamily: FONT,
            fontSize: 26,
            fontWeight: 800,
            lineHeight: 1.25,
            color: INK,
            margin: "36px 0 8px",
            paddingBottom: 8,
            borderBottom: `1px solid ${LINE}`,
        }}
    >
        {children}
    </h2>
);

/* -------------------------------------------------------------- Specimens --- */

/** The framed box that may show v2's real sizes, under the 15px floor. */
const Specimen = ({ children, caption }: { children: ReactNode; caption?: string }) => (
    <figure style={{ margin: "14px 0 0" }}>
        <div
            data-specimen=""
            className="sb-unstyled"
            style={{
                border: `1px dashed #D0D5DD`,
                borderRadius: 12,
                background: "#FFFFFF",
                padding: 18,
                fontFamily: FONT,
                color: STAGING.black,
                overflowX: "auto",
            }}
        >
            {children}
        </div>
        <figcaption style={{ ...LABEL, fontWeight: 600, marginTop: 6 }}>{caption ?? "Specimen: v2's style, sample text."}</figcaption>
    </figure>
);

const Row = ({ children, gap = 18 }: { children: ReactNode; gap?: number }) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap }}>{children}</div>
);

const checkbox = (on: boolean): CSSProperties => ({
    width: 20,
    height: 20,
    borderRadius: 3,
    border: `1px solid ${STAGING.checkboxLine}`,
    background: on ? STAGING.checkboxOnFill : "#FFFFFF",
    display: "inline-block",
    flex: "0 0 auto",
});

/** Cell padding in the table specimens: v2 keeps v1's table padding, so no Round 1 token sets it. */
const CELL_PAD = 16;

const SPECIMENS: Record<string, () => ReactNode> = {
    "R1-01": () => (
        <div style={{ ...TOKENS.staffBar, display: "flex", alignItems: "center", padding: "0 20px", boxSizing: "border-box" }}>
            {["Accounts", "Users", "Exchange tools", "Audit log"].map((l) => (
                <span key={l} style={TOKENS.staffLink}>
                    {l}
                </span>
            ))}
        </div>
    ),
    "R1-02": () => (
        <Row gap={12}>
            <span style={TOKENS.pubName}>Sample Publisher</span>
            <span style={TOKENS.pubBadge}>Publisher</span>
        </Row>
    ),
    "R1-03": () => (
        <div style={{ display: "grid", gap: 6, maxWidth: 320 }}>
            <span style={TOKENS.kmTitle}>Impressions</span>
            <span style={{ ...TOKENS.kmNumber, ...TOKENS.numbers }}>1,284,503</span>
            <span style={{ ...TOKENS.kmNote, ...TOKENS.numbers }}>
                Today: <span style={TOKENS.kmNoteValue}>48,210</span>
            </span>
            <span style={{ ...TOKENS.kmNote, ...TOKENS.numbers }}>
                High: <span style={TOKENS.kmNoteValue}>61,904</span>
            </span>
        </div>
    ),
    "R1-04": () => (
        <div style={{ display: "grid", gap: 14 }}>
            <Row gap={4}>
                {["Day", "Week", "Month"].map((t, i) => (
                    <span key={t} style={{ ...TOKENS.kmTab, color: i === 0 ? STAGING.teal : STAGING.grey }}>
                        {t}
                    </span>
                ))}
            </Row>
            <Row gap={28}>
                <span style={{ ...TOKENS.smallUpper, color: STAGING.greyLight }}>Start date</span>
                <span style={{ ...TOKENS.smallUpper, color: STAGING.greyLight }}>End date</span>
                <span style={{ ...TOKENS.smallUpper, color: STAGING.black }}>Requests</span>
                <span style={{ ...TOKENS.smallUpper, color: STAGING.black }}>Campaign name</span>
            </Row>
        </div>
    ),
    "R1-05": () => (
        <div style={{ display: "grid", gap: 4 }}>
            <span style={{ ...TOKENS.smallUpper, color: STAGING.black }}>Requests</span>
            <span style={{ ...TOKENS.rtNumber, ...TOKENS.numbers }}>12,480,112</span>
        </div>
    ),
    "R1-06": () => (
        <div style={{ display: "grid", gap: 4 }}>
            <span style={{ ...TOKENS.smallUpper, color: STAGING.black }}>Requests</span>
            <span style={{ ...TOKENS.rtNumber, ...TOKENS.numbers }}>12,480,112</span>
            {[
                ["Android", "7,302,418"],
                ["iPhone", "5,177,694"],
            ].map(([p, n]) => (
                <Row key={p} gap={6}>
                    <span style={TOKENS.rtPlatformLabel}>{p}</span>
                    <span style={{ ...TOKENS.rtPlatformValue, ...TOKENS.numbers }}>{n}</span>
                </Row>
            ))}
        </div>
    ),
    "R1-07": () => <span style={TOKENS.sectionLabel}>Campaign Name</span>,
    "R1-08": () => (
        <table style={{ borderCollapse: "collapse", minWidth: 360, margin: 0 }}>
            <tbody>
                {[
                    ["Buyer A", "604,118"],
                    ["Buyer B", "600,213"],
                ].map(([b, n]) => (
                    <tr key={b}>
                        <td style={{ fontSize: 14, padding: `10px ${CELL_PAD}px`, border: "none" }}>{b}</td>
                        <td style={{ fontSize: 14, padding: `10px ${CELL_PAD}px`, border: "none", ...TOKENS.numbers }}>{n}</td>
                    </tr>
                ))}
                <tr>
                    <td
                        style={{
                            ...TOKENS.tableTotal,
                            padding: `12px ${CELL_PAD}px`,
                            borderLeft: "none",
                            borderRight: "none",
                            borderBottom: "none",
                        }}
                    >
                        Total
                    </td>
                    <td
                        style={{
                            ...TOKENS.tableTotal,
                            ...TOKENS.numbers,
                            padding: `12px ${CELL_PAD}px`,
                            borderLeft: "none",
                            borderRight: "none",
                            borderBottom: "none",
                        }}
                    >
                        1,204,331
                    </td>
                </tr>
            </tbody>
        </table>
    ),
    "R1-09": () => <ButtonSpecimen />,
    "R1-10": () => <ButtonSpecimen />,
    "R1-11": () => (
        <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
            {(
                [
                    ["Date bar", TOKENS.dateRowHeight],
                    ["Checkbox row", TOKENS.checkboxRowHeight],
                    ["Totals, platform and filters row", TOKENS.filterRowHeight],
                ] as const
            ).map(([l, h]) => (
                <div
                    key={l}
                    style={{
                        height: h,
                        boxSizing: "border-box",
                        border: `1px solid ${STAGING.tableLine}`,
                        borderRadius: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 14px",
                        background: WARM,
                    }}
                >
                    <span style={TOKENS.filterLabel}>{l}</span>
                    <span style={{ ...TOKENS.checkboxText, ...TOKENS.numbers }}>{h}px</span>
                </div>
            ))}
        </div>
    ),
    "R1-12": () => (
        <Row gap={28}>
            {["Totals Only", "Platform", "Filters:"].map((l) => (
                <span key={l} style={TOKENS.filterLabel}>
                    {l}
                </span>
            ))}
        </Row>
    ),
    "R1-13": () => (
        <Row gap={20}>
            {(
                [
                    ["Android", true],
                    ["iPhone", true],
                    ["Web", false],
                ] as const
            ).map(([l, on]) => (
                <Row key={l} gap={8}>
                    <span style={checkbox(on)} aria-hidden="true" />
                    <span style={TOKENS.checkboxText}>{l}</span>
                </Row>
            ))}
            <span style={TOKENS.showActivityLabel}>Show activity</span>
        </Row>
    ),
    "R1-14": () => (
        <div style={{ display: "grid", gap: 4, fontSize: 18, fontWeight: 700 }}>
            {["1,111,111", "8,808,080", "4,170,512"].map((n) => (
                <span key={n} style={TOKENS.numbers}>
                    {n}
                </span>
            ))}
        </div>
    ),
    "R1-15": () => (
        <table style={{ borderCollapse: "collapse", minWidth: 360, margin: 0, textAlign: "left" }}>
            <thead>
                <tr>
                    {["Date", "Requests", "CTR"].map((h) => (
                        <th
                            key={h}
                            style={{
                                ...TOKENS.smallUpper,
                                color: STAGING.grey,
                                textAlign: "left",
                                padding: `10px ${CELL_PAD}px`,
                                borderBottom: `1px solid ${STAGING.tableLine}`,
                            }}
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {[
                    ["Nov 1", "402,118", "1.24%"],
                    ["Nov 2", "398,640", "1.31%"],
                ].map((r) => (
                    <tr key={r[0]}>
                        {r.map((c) => (
                            <td key={c} style={{ fontSize: 14, textAlign: "left", padding: `10px ${CELL_PAD}px`, border: "none", ...TOKENS.numbers }}>
                                {c}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    ),
    "R1-16": () => (
        <div style={{ display: "grid", gap: 6, maxWidth: 360 }}>
            {[
                ["Private auction", false],
                ["Preferred deal", true],
                ["Open auction", false],
            ].map(([l, hover]) => (
                <div
                    key={String(l)}
                    style={{
                        border: `1px solid ${STAGING.tableLine}`,
                        borderRadius: 6,
                        padding: "10px 14px",
                        fontSize: 15,
                        fontWeight: 600,
                        display: "flex",
                        justifyContent: "space-between",
                        ...(hover ? TOKENS.optionHover : { backgroundColor: "#FFFFFF" }),
                    }}
                >
                    <span>{l}</span>
                    {hover && <span style={{ color: STAGING.grey, fontWeight: 400 }}>hover</span>}
                </div>
            ))}
        </div>
    ),
};

const ButtonSpecimen = () => (
    <Row gap={12}>
        <span style={{ ...TOKENS.button, background: STAGING.pink, color: "#FFFFFF" }}>Run query</span>
        <span style={{ ...TOKENS.button, background: "#FFFFFF", color: STAGING.pink, boxShadow: `inset 0 0 0 1px ${STAGING.pink}` }}>Save</span>
        <span style={{ ...LABEL, fontSize: 15 }}>{TOKENS.button.height}px tall</span>
    </Row>
);

/* --------------------------------------------------------- Tokens per item --- */

type TokenName = keyof typeof TOKENS;

/** Which Round 1 item each token belongs to (typed, so a new token must be listed here). */
const TOKEN_ITEM = {
    staffBar: "R1-01",
    staffLink: "R1-01",
    pubName: "R1-02",
    pubBadge: "R1-02",
    kmNumber: "R1-03",
    kmTitle: "R1-03",
    kmNote: "R1-03",
    kmNoteValue: "R1-03",
    smallUpper: "R1-04",
    kmTab: "R1-04",
    rtNumber: "R1-05",
    rtPlatformLabel: "R1-06",
    rtPlatformValue: "R1-06",
    sectionLabel: "R1-07",
    tableTotal: "R1-08",
    button: "R1-09",
    dateRowHeight: "R1-11",
    checkboxRowHeight: "R1-11",
    filterRowHeight: "R1-11",
    filterLabel: "R1-12",
    showActivityLabel: "R1-12",
    checkboxText: "R1-13",
    numbers: "R1-14",
    optionHover: "R1-16",
} as const satisfies Record<TokenName, string>;

const tokensFor = (id: string) => (Object.keys(TOKEN_ITEM) as TokenName[]).filter((k) => TOKEN_ITEM[k] === id || (id === "R1-10" && k === "button"));

/** Properties written in px when given as a number. */
const UNITLESS = new Set(["fontWeight", "lineHeight", "opacity", "zIndex", "flex"]);
const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

/** A token as CSS: an object becomes declarations, a number becomes px. */
const toCss = (value: CSSProperties | number): string => {
    if (typeof value === "number") return `${value}px`;
    return Object.entries(value)
        .map(([k, v]) => `${kebab(k)}: ${typeof v === "number" && !UNITLESS.has(k) ? `${v}px` : String(v)};`)
        .join(" ");
};

/* ---------------------------------------------------------------- Sections --- */

const TH: CSSProperties = {
    textAlign: "left",
    fontSize: 15,
    fontWeight: 700,
    color: MUTED,
    padding: "10px 14px",
    borderBottom: `1px solid ${LINE}`,
    background: WARM,
    whiteSpace: "nowrap",
};
const TD: CSSProperties = { padding: "10px 14px", borderBottom: `1px solid ${LINE}`, verticalAlign: "top", fontSize: 15, lineHeight: 1.5, color: BODY };

const MeasureTable = ({ s }: { s: RoundOneStyle }) => (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 12, overflow: "hidden", marginTop: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", margin: 0, fontFamily: FONT }}>
            <thead>
                <tr>
                    <th style={TH}>What</th>
                    <th style={TH}>Staging today</th>
                    <th style={TH}>v1</th>
                    <th style={TH}>v2</th>
                </tr>
            </thead>
            <tbody>
                {s.measures.map((m) => (
                    <tr key={m.label}>
                        <td style={{ ...TD, fontWeight: 700, color: INK }}>{m.label}</td>
                        <td style={{ ...TD, color: INK }}>{m.staging}</td>
                        <td style={TD}>{m.v1}</td>
                        <td style={{ ...TD, color: INK, fontWeight: m.v2 === m.staging ? 400 : 700 }}>{m.v2}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const Code = ({ children }: { children: string }) => (
    <pre
        style={{
            fontFamily: MONO,
            fontSize: 15,
            lineHeight: 1.55,
            color: INK,
            background: "#F2F4F7",
            borderRadius: 10,
            padding: "12px 14px",
            margin: "14px 0 0",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere",
        }}
    >
        {children}
    </pre>
);

const StyleSection = ({ s }: { s: RoundOneStyle }) => {
    const item = ITEMS.find((i) => i.id === s.id);
    const screen = item?.where[0];
    const same = s.measures.every((m) => m.v2 === m.staging);
    const tokens = tokensFor(s.id);
    const specimen = SPECIMENS[s.id];
    return (
        <section
            id={s.id}
            style={{
                border: `1px solid ${LINE}`,
                borderRadius: 16,
                padding: "18px 22px 20px",
                margin: "16px 0",
                background: "#FFFFFF",
                fontFamily: FONT,
                scrollMarginTop: 16,
            }}
        >
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "4px 12px" }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: MUTED }}>{s.id}</span>
                <div style={{ fontSize: 21, fontWeight: 800, color: INK, lineHeight: 1.3 }}>{s.element}</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                <Chip>Staging: {s.page}</Chip>
                <Chip tone={same ? "teal" : "plain"}>{same ? "v2 matches staging" : "v2 differs from staging"}</Chip>
                {s.belowFloor && <Chip tone="pink">Under 15px in v2</Chip>}
            </div>
            <MeasureTable s={s} />
            <Code>{s.css}</Code>
            {s.note && (
                <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY, marginTop: 12 }}>
                    <b style={{ color: INK }}>Note:</b> {s.note}
                </div>
            )}
            {tokens.length > 0 && (
                <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY, marginTop: 10 }}>
                    <b style={{ color: INK }}>v2 tokens:</b>{" "}
                    {tokens.map((t, i) => (
                        <span key={t}>
                            {i > 0 && ", "}
                            <code style={{ fontFamily: MONO, fontSize: 15 }}>{t}</code>
                        </span>
                    ))}
                </div>
            )}
            {specimen && <Specimen>{specimen()}</Specimen>}
            <div style={{ marginTop: 14 }}>
                <CtaRow>
                    {screen && <Cta href={proto("app/v2", screen[1])}>Open in v2 ({screen[0]})</Cta>}
                    <Cta href={roundLink(s.id)}>Change on the Round 1 page</Cta>
                </CtaRow>
            </div>
        </section>
    );
};

/** The items of one kind, in list order. */
export const StyleList = ({ kind }: { kind: Exclude<Kind, "Step"> }) => {
    const ids = new Set(ITEMS.filter((i) => i.kind === kind).map((i) => i.id));
    return (
        <>
            {STYLES.filter((s) => ids.has(s.id)).map((s) => (
                <StyleSection key={s.id} s={s} />
            ))}
        </>
    );
};

/** Jump links to every item. */
export const ItemIndex = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", margin: "4px 0 16px", fontFamily: FONT }}>
        {STYLES.map((s) => (
            <a key={s.id} href={`#${s.id}`} style={{ fontSize: 15, fontWeight: 700, color: INK, textDecoration: "none" }}>
                {s.id}
            </a>
        ))}
    </div>
);

/* ------------------------------------------------------------------ Tokens --- */

export const TokenList = () => (
    <>
        <Text>
            v2's Round 1 values as CSS, one per element. The v2 prototype reads these same values from <code style={{ fontSize: 15 }}>round-1-styles.ts</code>.
        </Text>
        <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden", margin: "12px 0 24px", fontFamily: FONT }}>
            {(Object.keys(TOKENS) as TokenName[]).map((name, i) => (
                <div
                    key={name}
                    style={{
                        display: "grid",
                        gridTemplateColumns: "190px minmax(0, 1fr) 64px",
                        gap: 14,
                        alignItems: "baseline",
                        padding: "10px 16px",
                        borderTop: i ? `1px solid ${LINE}` : undefined,
                        background: i % 2 ? WARM : "#FFFFFF",
                    }}
                >
                    <code style={{ fontFamily: MONO, fontSize: 15, fontWeight: 700, color: INK }}>{name}</code>
                    <code style={{ fontFamily: MONO, fontSize: 15, color: BODY, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{toCss(TOKENS[name])}</code>
                    <a href={`#${TOKEN_ITEM[name]}`} style={{ fontSize: 15, fontWeight: 700, color: INK, textDecoration: "none", justifySelf: "end" }}>
                        {TOKEN_ITEM[name]}
                    </a>
                </div>
            ))}
        </div>
    </>
);

export const ColourList = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 10, margin: "12px 0 24px", fontFamily: FONT }}>
        {Object.entries(STAGING).map(([name, value]) => (
            <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${LINE}`, borderRadius: 12, padding: "8px 10px" }}>
                <span
                    style={{ width: 32, height: 32, borderRadius: 8, background: value, flex: "0 0 auto", boxShadow: "inset 0 0 0 1px rgba(16,24,40,0.12)" }}
                    aria-hidden="true"
                />
                <span style={{ fontSize: 15, lineHeight: 1.35, color: BODY }}>
                    <b style={{ color: INK }}>{name}</b>
                    <br />
                    <code style={{ fontFamily: MONO, fontSize: 15 }}>{value}</code>
                </span>
            </div>
        ))}
    </div>
);
