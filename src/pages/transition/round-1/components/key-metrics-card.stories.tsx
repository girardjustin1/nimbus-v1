import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyMetrics as KeyMetricsV1 } from "../../../../../prototypes/app/v1/screens/reporting/dashboard/key-metrics";
import { KeyMetrics as KeyMetricsV2 } from "../../../../../prototypes/app/v2/screens/reporting/dashboard/key-metrics";
import { BeforeAfter, Crop } from "./frame";

/**
 * Round 1 · Components · Key metrics card (R1-03, R1-04 tabs).
 * The key metrics screen cropped to its first two rows of cards: the main numbers, card
 * titles, Today / High lines and the tab strips. v1 against v2.
 */
const meta = {
    title: "Transition/Round 1/Components/Key metrics card",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const IDS = ["R1-03", "R1-04"];
/** The card grid, down to the bottom of the first (two rows tall) card, plus most of the grid gap below it. */
const CARDS = { selector: "main > .flex-1 > div", to: "main > .flex-1 > div > section", padBottom: 20, fallbackHeight: 640 };

const V1 = () => (
    <Crop {...CARDS}>
        <KeyMetricsV1 />
    </Crop>
);

const V2 = () => (
    <Crop {...CARDS}>
        <KeyMetricsV2 />
    </Crop>
);

/** R1-03, R1-04 in v1: 36px extra bold numbers, 15px grey Today / High lines, 15px bold tab labels. */
export const Before: Story = { render: () => <V1 /> };

/** R1-03, R1-04 in v2: staging's 40px bold numbers, 14px Today / High lines, and the 12px small upper case tab labels in a 43px row. */
export const After: Story = { render: () => <V2 /> };

/** R1-03, R1-04: v1 above v2. */
export const SideBySide: Story = {
    name: "Side by side",
    render: () => <BeforeAfter ids={IDS} bleed before={<V1 />} after={<V2 />} />,
};
