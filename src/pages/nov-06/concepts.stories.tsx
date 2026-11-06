import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { campaigns } from "../../../prototypes/das/v6/screens/campaign-data";
import type { DeliveryVariant } from "../../../prototypes/das/v6/screens/campaign-series";
import { ViewOnePage } from "../../../prototypes/das/v6/screens/campaign-view";
import { DeliveryChart } from "../../../prototypes/das/v6/screens/delivery-chart";
import { bySlug } from "./feedback";
import { ReviewNote, Variant } from "./note";

/**
 * Nov 6 Edits · Chart Concepts — five ways to put requests and daily active users beside pacing.
 *
 * Every concept uses the same campaign and the same numbers: Sports fans (Spanish), the
 * at-risk sample, which lost about half its users from day 6. A good concept makes that
 * the first thing you see. Hover any chart for the day's figures.
 */
const meta = {
    title: "Nov 6 Edits/Chart Concepts",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const atRisk = campaigns.find((c) => c.id === "c2")!;
const behind = campaigns.find((c) => c.id === "c8")!;

interface Concept {
    variant: DeliveryVariant;
    letter: string;
    title: string;
    how: string;
    good: string[];
    watch: string[];
}

const CONCEPTS: Concept[] = [
    {
        variant: "overlay",
        letter: "A",
        title: "Four lines, one chart",
        how: "What was asked on the call: actual and expected pacing on the left axis, requests and active users as two more lines on a right-hand axis.",
        good: ["Everything in one place; closest to the request.", "No new space on the page."],
        watch: [
            "Two scales on one chart: every line has to be matched to its axis before it means anything.",
            "Lines cross where the scales happen to meet, not where anything happens, which invites the wrong reading.",
            "Cumulative pacing climbs while daily requests go up and down, so the shapes don't compare.",
        ],
    },
    {
        variant: "bars",
        letter: "B",
        title: "Users as bars, pacing as lines",
        how: "The layout offered on the call: active users as bars (a volume), requests and pacing as lines — the same mix as the realtime dashboard.",
        good: ["Bars read as 'how much', lines as 'how it's going'.", "Familiar from the realtime dashboard."],
        watch: ["Still two scales on one chart, with the same risks as A.", "Busy: three kinds of mark in one plot."],
    },
    {
        variant: "stacked",
        letter: "C",
        title: "Two charts, one timeline",
        how: "Pacing above, unchanged from Round 6; below it, the day's opportunity — requests as bars, active users as a line — on its own axis. One hover shows both.",
        good: [
            "One scale per chart, so each reads on its own and the days line up exactly.",
            "Pacing keeps its Round 6 look; opportunity is added, not mixed in.",
            "The dip is obvious: the bars drop the same day the pacing line flattens.",
        ],
        watch: ["Taller: about 180px more than Round 6.", "Users and requests share an axis, so users sit low (they're a quarter of requests)."],
    },
    {
        variant: "indexed",
        letter: "D",
        title: "Everything against normal",
        how: "One chart, one axis. Each line is a percentage of normal: the day's delivery against the daily plan, requests and users against a normal day for the campaign. 100% is on plan.",
        good: ["The cause and effect are one picture: all three lines fall together.", "No second axis, and the shortest of the five."],
        watch: [
            "Drops the cumulative pacing line, so 'are we on track for the goal?' moves to the Pacing card above.",
            "'Normal' needs defining (here: a busy-but-ordinary day of the flight so far).",
        ],
    },
    {
        variant: "strip",
        letter: "E",
        title: "Pacing with a heat strip",
        how: "The Round 6 pacing chart, with a strip beneath it: one cell a day for requests and one for users, darker when busier. Hover a cell for the figures.",
        good: ["Lightest touch: the chart Product and sales liked stays as it is.", "Compact, and a weak stretch shows as a band of pale cells."],
        watch: ["Shade is approximate; the exact figures are on hover.", "Two hues to learn, and shade is harder to compare than height."],
    },
];

const Card = ({ concept, c = atRisk }: { concept: Concept; c?: typeof atRisk }) => (
    <Variant
        kind={concept.variant === "stacked" ? "6 Nov" : "Concept"}
        title={`${concept.letter} · ${concept.title}${concept.variant === "stacked" ? " (the overview's default)" : ""}`}
    >
        <div className="flex flex-col gap-5 rounded-2xl bg-primary p-6 ring-1 ring-secondary">
            <p className="max-w-[820px] text-md text-secondary">{concept.how}</p>
            <DeliveryChart c={c} variant={concept.variant} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <p className="text-md font-bold text-primary">Works because</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-md text-secondary">
                        {concept.good.map((g) => (
                            <li key={g}>{g}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-md font-bold text-primary">Watch for</p>
                    <ul className="mt-1 list-disc space-y-0.5 pl-5 text-md text-secondary">
                        {concept.watch.map((w) => (
                            <li key={w}>{w}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </Variant>
);

const Page = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-6 bg-secondary p-6">{children}</div>;

const concept = (variant: DeliveryVariant) => CONCEPTS.find((k) => k.variant === variant)!;

export const AllFive: Story = {
    name: "0 · All five, side by side",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("chart-concepts")} />
            <Variant kind="Round 6" title="Round 6 · pacing only, as reviewed on 29 Oct">
                <div className="rounded-2xl bg-primary p-6 ring-1 ring-secondary">
                    <DeliveryChart c={atRisk} variant="pacing" />
                </div>
            </Variant>
            {CONCEPTS.map((k) => (
                <Card key={k.variant} concept={k} />
            ))}
        </Page>
    ),
};

export const Overlay: Story = {
    name: "A · Four lines, one chart",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("requests")} />
            <Card concept={concept("overlay")} />
        </Page>
    ),
};

export const Bars: Story = {
    name: "B · Users as bars",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("chart-concepts")} />
            <Card concept={concept("bars")} />
        </Page>
    ),
};

export const Stacked: Story = {
    name: "C · Two charts, one timeline",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("chart-concepts")} />
            <Card concept={concept("stacked")} />
        </Page>
    ),
};

export const Indexed: Story = {
    name: "D · Everything against normal",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("chart-concepts")} />
            <Card concept={concept("indexed")} />
        </Page>
    ),
};

export const Strip: Story = {
    name: "E · Heat strip",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("chart-concepts")} />
            <Card concept={concept("strip")} />
        </Page>
    ),
};

export const SameUsersFewerSlots: Story = {
    name: "Users or slots? · C and D on a different dip",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("daus")} quote={0} />
            <p className="max-w-[820px] text-md text-secondary">
                Morning commuters is behind for a different reason: its users kept coming, but they reached fewer ad slots. With both lines on the chart, the
                two cases look different — users flat, requests down — which is what Product wanted DAUs for.
            </p>
            <Card concept={concept("stacked")} c={behind} />
            <Card concept={concept("indexed")} c={behind} />
        </Page>
    ),
};

export const InThePage: Story = {
    name: "In the page · C on the campaign overview",
    render: () => <ViewOnePage id="c2" delivery="stacked" />,
};
