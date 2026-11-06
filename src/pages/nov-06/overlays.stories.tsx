import type { ReactNode } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { campaigns } from "../../../prototypes/das/v6/screens/campaign-data";
import type { DeliveryVariant } from "../../../prototypes/das/v6/screens/campaign-series";
import { ViewOnePage } from "../../../prototypes/das/v6/screens/campaign-view";
import { ConceptCard as Card, type Concept } from "./concept-card";
import { bySlug } from "./feedback";
import { ReviewNote } from "./note";

/**
 * Nov 6 Edits · On One Chart — the second batch, after Product asked: "Can we overlay
 * them on the same chart rather than 2 separate? Or am I missing an alternate version?"
 *
 * A and B in the first batch already overlay, on a second axis. F to I keep everything
 * on one chart and each answer the second axis a different way. Same campaign, same
 * numbers as the first batch; hover any chart for the day's figures.
 */
const meta = {
    title: "Nov 6 Edits/On One Chart",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const behind = campaigns.find((c) => c.id === "c8")!;

const OVERLAYS: Concept[] = [
    {
        variant: "labelled",
        letter: "F",
        title: "One chart, labelled axes",
        how: "A, made to read. The left axis is titled “% of goal” and tinted teal like the pacing lines; the right is titled “Per day” and tinted navy like requests. Requests sit as a soft area so pacing stays on top, and the two buttons above switch requests and users on and off.",
        good: [
            "Everything on one chart, as asked.",
            "Each axis says what it measures and wears its series' colour.",
            "Switch requests or users off to read pacing alone.",
        ],
        watch: ["Still two scales: where the lines cross means nothing.", "The busiest of the four when everything is on."],
    },
    {
        variant: "backdrop",
        letter: "G",
        title: "Opportunity behind pacing",
        how: "Requests as faint bars and users as a faint line behind the pacing chart, with no second axis. They show the shape of each day's opportunity; the figures are on hover. Pacing keeps its Round 6 look in front.",
        good: [
            "One visible scale, so nothing to match up.",
            "Pacing stays the hero; opportunity is the backdrop.",
            "The dip reads at a glance: the bars halve where the line flattens.",
        ],
        watch: ["No numbers on the chart for requests or users, only on hover.", "Bar height is relative to the busiest day, not to anything on the axis."],
    },
    {
        variant: "scaled",
        letter: "H",
        title: "One scale for all four",
        how: "One % axis for every line. Pacing is a share of the goal, as in Round 6; requests and users are a share of a normal day for the campaign, so 100% is an ordinary day and 50% is half of one.",
        good: ["All four lines on one honest axis.", "Keeps the cumulative pacing line, unlike D.", "A 50% day reads as 50% without a second axis."],
        watch: [
            "Two meanings of “%” on one axis; the legend and hover have to carry the difference.",
            "“Normal” needs defining (here: a busy-but-ordinary day of the flight so far).",
        ],
    },
    {
        variant: "bands",
        letter: "I",
        title: "Shaded dips",
        how: "The Round 6 pacing chart, with the days opportunity fell shaded and labelled, e.g. “Requests −45% · users −43%”. Hover any day for its requests and users.",
        good: [
            "The answer, not the data: it says why pacing slowed, in words.",
            "The quietest overlay; pacing is untouched.",
            "Tells the two kinds of dip apart: users fell, or only requests did.",
        ],
        watch: ["Only the dips are marked; an ordinary day shows no opportunity at all.", "The 20% cut-off for a dip is ours to set."],
    },
];

const Page = ({ children }: { children: ReactNode }) => <div className="flex flex-col gap-6 bg-secondary p-6">{children}</div>;
const overlay = (variant: DeliveryVariant) => OVERLAYS.find((k) => k.variant === variant)!;

export const AllFour: Story = {
    name: "0 · All four, side by side",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("one-chart")} />
            {OVERLAYS.map((k) => (
                <Card key={k.variant} concept={k} />
            ))}
        </Page>
    ),
};

export const Labelled: Story = {
    name: "F · One chart, labelled axes",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("one-chart")} />
            <Card concept={overlay("labelled")} />
        </Page>
    ),
};

export const Backdrop: Story = {
    name: "G · Opportunity behind pacing",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("one-chart")} />
            <Card concept={overlay("backdrop")} />
        </Page>
    ),
};

export const Scaled: Story = {
    name: "H · One scale for all four",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("one-chart")} />
            <Card concept={overlay("scaled")} />
        </Page>
    ),
};

export const Bands: Story = {
    name: "I · Shaded dips",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("one-chart")} />
            <Card concept={overlay("bands")} />
        </Page>
    ),
};

export const OtherDip: Story = {
    name: "Users or slots? · G and I on a different dip",
    render: () => (
        <Page>
            <ReviewNote item={bySlug("daus")} />
            <p className="max-w-[820px] text-md text-secondary">
                Morning commuters is behind because its users reached fewer ad slots, not because users left. On one chart the difference still shows: in G the
                faint line holds while the bars drop; in I the label says “users steady”.
            </p>
            <Card concept={overlay("backdrop")} c={behind} />
            <Card concept={overlay("bands")} c={behind} />
        </Page>
    ),
};

export const InThePage: Story = {
    name: "In the page · F on the campaign overview",
    render: () => <ViewOnePage id="c2" delivery="labelled" />,
};
