import type { CSSProperties, ReactNode } from "react";
import { BODY, INK, LINE, MUTED, PINK_DARK, PINK_SOFT, TEAL_DARK, TEAL_SOFT, WARM, proto, story } from "../intro/tokens";
import { Callout, CardGrid, Chip, Cta, CtaRow, Eyebrow, MiniCard, More, PageHeader, Points, Steps } from "../intro/ui";
import { BOARD, ITEMS, type Kind, type Owner, ROUNDS, STEPS, type Status, type TransitionItem } from "./data";

/**
 * Storybook › Transition — how the reviewed styles get from the prototype to the dashboard,
 * one list at a time. Everything here is drawn from ./data.ts, the same list that is
 * imported into the monday.com board.
 */

const FONT = '"proxima-nova", "Proxima Nova", system-ui, sans-serif';
const APP = "app/v1";

/* -------------------------------------------------------------------- Text --- */

/** A line of running text at the 15px floor (a paragraph written straight into MDX renders at 14px). */
const Text = ({ children }: { children: ReactNode }) => (
    <div style={{ fontFamily: FONT, fontSize: 15, lineHeight: 1.6, color: BODY, margin: "8px 0 12px", maxWidth: 860 }}>{children}</div>
);

/* ------------------------------------------------------------------ Status --- */

const STATUS_TONE: Record<Status, CSSProperties> = {
    "To do": { background: "#F2F4F7", color: "#344054" },
    "In design": { background: PINK_SOFT, color: PINK_DARK },
    "Ready for review": { background: "#FEF0C7", color: "#93370D" },
    "Changes requested": { background: "#FEE4E2", color: "#B42318" },
    Approved: { background: TEAL_SOFT, color: TEAL_DARK },
    Ported: { background: TEAL_SOFT, color: TEAL_DARK },
    "On staging": { background: TEAL_SOFT, color: TEAL_DARK },
    Live: { background: INK, color: "#FFFFFF" },
    Done: { background: TEAL_SOFT, color: TEAL_DARK },
};

const StatusChip = ({ status }: { status: Status }) => (
    <span
        style={{
            display: "inline-block",
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 700,
            padding: "3px 11px",
            borderRadius: 999,
            whiteSpace: "nowrap",
            ...STATUS_TONE[status],
        }}
    >
        {status}
    </span>
);

const tally = (items: TransitionItem[]) => {
    const counts = new Map<Status, number>();
    for (const i of items) counts.set(i.status, (counts.get(i.status) ?? 0) + 1);
    return [...counts].map(([status, n]) => `${n} ${status.toLowerCase()}`);
};

/* ---------------------------------------------------------------- Overview --- */

export const TransitionHeader = () => (
    <PageHeader
        eyebrow="Transition"
        title="From the reviewed prototype to the dashboard, one list at a time."
        lead="Product reviews the prototype against the current dashboard and sends a short list. Design makes those changes here. Product looks again. When a list comes back with nothing on it, engineering ports."
        chips={[`${ROUNDS.length} round so far`, `${ITEMS.length} changes`, ...tally(ITEMS)]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story(ROUNDS[ROUNDS.length - 1].page)}>
                    Open the current round
                </Cta>
                <Cta kind="secondary" href={BOARD}>
                    The monday.com board
                </Cta>
                <Cta href={story("start-here-process-roadmap--docs")}>The four-step process</Cta>
            </CtaRow>
        }
    />
);

export const Loop = () => (
    <>
        <Text>This is step 1 of the four-step process, “Finish Storybook”, broken into rounds.</Text>
        <Steps
            items={[
                {
                    label: "1",
                    state: "done",
                    title: "Product sends a list",
                    body: "A short list from comparing the prototype with the current dashboard. Small rounds, not one sweep.",
                    meta: "Product",
                },
                {
                    label: "2",
                    state: "now",
                    title: "Design changes the prototype",
                    body: "Each item is changed in the full application and in the tokens behind it, then marked Ready for review.",
                    meta: "Design",
                },
                {
                    label: "3",
                    state: "next",
                    title: "Product reviews",
                    body: "Each item is looked at in the prototype and marked Approved or Changes requested.",
                    meta: "Product",
                },
                {
                    label: "4",
                    state: "next",
                    title: "Next list, or port",
                    body: "Another list starts the next round. An empty one means Storybook is final and the port begins.",
                    meta: "Product, then engineering",
                },
            ]}
        />
    </>
);

export const TwoTools = () => (
    <CardGrid min={300}>
        <MiniCard eyebrow="monday.com" title="Who owes what, one item per round" href={BOARD} cta="Open the board" tone="warm">
            Each round is one item. Under it, a subitem for each area the round touches and for each step another team owes, with an owner and a status.
        </MiniCard>
        <MiniCard
            eyebrow="Storybook"
            title="Every change, and what it looks like"
            href={story(ROUNDS[ROUNDS.length - 1].page)}
            cta="Open the current round"
            tone="warm"
        >
            The change-by-change list: what was asked, the screens it touches, its status, and the result in the prototype. This is what gets ported.
        </MiniCard>
        <MiniCard eyebrow="The link between them" title="A subitem is an area of the round" tone="warm">
            A subitem is named for its area and carries the IDs of its changes: Buttons (R1-09, R1-10). The round's page shows the same area beside each change.
        </MiniCard>
    </CardGrid>
);

export const OneList = () => (
    <Callout>
        <b>One list feeds both.</b> The changes on this page and the subitems on the board come from the same file in this repository, so a title cannot say one
        thing here and another there.
    </Callout>
);

const CODE: CSSProperties = { fontSize: 15, background: "#F2F4F7", borderRadius: 6, padding: "1px 6px" };

export const SyncNotes = () => (
    <More title="How the list gets to the board, and back">
        <Text>
            <b style={{ color: INK }}>To the board.</b> <code style={CODE}>npm run monday:export</code> writes one file with a row per subitem: its name and its
            owner. monday.com imports rows as items, so it takes two moves. First, New item ▾ → Import items, into the round's group. Then tick the new items,
            choose Convert, pick the round's item as the parent, and match Owner to Owner.
        </Text>
        <Text>
            <b style={{ color: INK }}>Back from the board.</b> The board is updated by hand. When a subitem is approved or sent back there, the statuses of its
            changes are set here to match, and the pages follow.
        </Text>
    </More>
);

const OWNERS: Owner[] = ["Engineering", "Design", "Product"];

export const TeamTodo = () => (
    <>
        <Text>The steps that move the current round along, by team.</Text>
        <TodoColumns />
    </>
);

const TodoColumns = () => (
    <CardGrid min={280}>
        {OWNERS.map((owner) => {
            const mine = STEPS.filter((s) => s.owner === owner);
            return (
                <div key={owner} style={{ border: `1px solid ${LINE}`, borderRadius: 16, padding: "16px 18px", background: "#FFFFFF", fontFamily: FONT }}>
                    <Eyebrow>{owner}</Eyebrow>
                    <ol style={{ listStyle: "none", margin: "10px 0 0", padding: 0, display: "grid", gap: 14 }}>
                        {mine.map((s) => (
                            <li key={s.id}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                    <span style={{ fontSize: 15, fontWeight: 700, color: MUTED }}>{s.id}</span>
                                    <StatusChip status={s.status} />
                                </div>
                                <div style={{ fontSize: 17, fontWeight: 800, color: INK, lineHeight: 1.3, margin: "6px 0 4px" }}>{s.title}</div>
                                <div style={{ fontSize: 15, lineHeight: 1.55, color: BODY }}>{s.request}</div>
                            </li>
                        ))}
                    </ol>
                </div>
            );
        })}
    </CardGrid>
);

export const RoundCards = () => (
    <CardGrid min={300}>
        {ROUNDS.map((r) => {
            const items = ITEMS.filter((i) => i.round === r.name);
            return (
                <MiniCard key={r.id} eyebrow={`${r.name} · ${r.date}`} title={`${items.length} changes`} href={story(r.page)} cta={`Open ${r.name}`}>
                    {r.summary}
                    <span style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                        {tally(items).map((t) => (
                            <Chip key={t}>{t}</Chip>
                        ))}
                    </span>
                </MiniCard>
            );
        })}
    </CardGrid>
);

export const StatusKey = () => (
    <Points
        items={[
            ["To do", "on the list, not started."],
            ["In design", "being changed in the prototype."],
            ["Ready for review", "changed, waiting for product."],
            ["Changes requested", "product looked and wants something different; the note on the board subitem says what."],
            ["Approved", "final in Storybook. Nothing changes after this without a new item."],
            ["Ported, On staging, Live", "engineering's three steps once the port begins."],
        ]}
    />
);

export const Rules = () => (
    <Points
        items={[
            ["One list at a time.", "A round is finished before the next list is started."],
            ["One item, one change.", "Each item can be approved or sent back without holding up the others."],
            ["An ID never changes.", "It is how the board's notes, Storybook and the code refer to the same change."],
            ["Approved means frozen.", "Changing an approved style takes a new item in a later round."],
            ["Storybook is the source for the port.", "Engineering ports what is here, so nothing is settled anywhere else."],
        ]}
    />
);

/* ------------------------------------------------------------------- Round --- */

export const RoundHeader = ({ round }: { round: string }) => {
    const r = ROUNDS.find((x) => x.id === round)!;
    const items = ITEMS.filter((i) => i.round === r.name);
    const count = (kind: Kind) => items.filter((i) => i.kind === kind).length;
    return (
        <PageHeader
            eyebrow={`Transition · ${r.name} · ${r.date}`}
            title={`${items.length} changes from product's first pass.`}
            lead={r.summary}
            chips={[`${count("Back to current style")} back to current style`, `${count("Adjustment")} adjustments`, ...tally(items)]}
            actions={
                <CtaRow>
                    <Cta kind="primary" href={proto(APP, "key-metrics")}>
                        Open the full application
                    </Cta>
                    <Cta kind="secondary" href={BOARD}>
                        The monday.com board
                    </Cta>
                    <Cta href={story("transition-overview--docs")}>How the transition works</Cta>
                </CtaRow>
            }
        />
    );
};

export const ProductQuote = () => (
    <blockquote style={{ margin: "0 0 24px", padding: "4px 0 4px 18px", borderLeft: `4px solid ${PINK_DARK}`, fontFamily: FONT }}>
        <div style={{ fontSize: 17, lineHeight: 1.55, color: INK }}>
            “Let's start with these as a first round and then I'll assess again. I think incremental steps will be more effective than broad sweeping updates
            all at once.”
        </div>
        <div style={{ fontSize: 15, color: MUTED, marginTop: 6 }}>Product, Nov 17, 2026</div>
    </blockquote>
);

const INTRO: Record<Exclude<Kind, "Step">, string> = {
    "Back to current style": "Where the prototype moved away from the current dashboard and goes back to it.",
    Adjustment: "Changes that apply everywhere, in the prototype and in the current dashboard alike.",
};

export const LockupNote = () => (
    <Callout>
        <b>The lockup in R1-05 and R1-06.</b> Product's list included a picture of the current realtime metric block: a small upper case label beside its colour
        key, the large number under it, then one line per platform with the platform name in regular upper case and its number in bold.
    </Callout>
);

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
const TD: CSSProperties = { padding: "14px", borderBottom: `1px solid ${LINE}`, verticalAlign: "top", fontSize: 15, lineHeight: 1.55, color: BODY };

export const ItemTable = ({ round, kind }: { round: string; kind: Exclude<Kind, "Step"> }) => {
    const r = ROUNDS.find((x) => x.id === round)!;
    const items = ITEMS.filter((i) => i.round === r.name && i.kind === kind);
    return (
        <>
            <Text>{INTRO[kind]}</Text>
            <div style={{ border: `1px solid ${LINE}`, borderRadius: 16, overflow: "hidden", margin: "16px 0 24px", fontFamily: FONT }}>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: 0 }}>
                    <thead>
                        <tr>
                            <th style={TH}>ID</th>
                            <th style={TH}>Change</th>
                            <th style={TH}>Where it shows</th>
                            <th style={TH}>Board subitem</th>
                            <th style={TH}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((i) => (
                            <tr key={i.id} id={i.id}>
                                <td style={{ ...TD, fontWeight: 700, color: INK, whiteSpace: "nowrap" }}>{i.id}</td>
                                <td style={TD}>
                                    <div style={{ fontSize: 17, fontWeight: 800, color: INK, lineHeight: 1.3 }}>{i.title}</div>
                                    <div style={{ marginTop: 4 }}>
                                        <b style={{ color: INK }}>Product:</b> {i.request}
                                    </div>
                                </td>
                                <td style={{ ...TD, minWidth: 190 }}>
                                    <div style={{ display: "grid", gap: 2 }}>
                                        {i.where.map(([label, screen]) => (
                                            <Cta key={screen} href={proto(APP, screen)}>
                                                {label}
                                            </Cta>
                                        ))}
                                    </div>
                                </td>
                                <td style={{ ...TD, whiteSpace: "nowrap" }}>{i.area}</td>
                                <td style={TD}>
                                    <StatusChip status={i.status} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};
