import type { Meta, StoryObj } from "@storybook/react-vite";
import { RealtimeDashboard as RealtimeV1 } from "../../../../../prototypes/app/v1/screens/reporting/dashboard/realtime";
import { RealtimeDashboard as RealtimeV2 } from "../../../../../prototypes/app/v2/screens/reporting/dashboard/realtime";
import { BeforeAfter, Crop } from "./frame";

/**
 * Round 1 · Components · Report controls (R1-11, R1-12, R1-13).
 * The realtime dashboard cropped to its controls: the date row, the metric check box row
 * with Show Activity, and the Totals Only / Platform / Filters row. Live: the controls work.
 */
const meta = {
    title: "Transition/Round 1/Components/Report controls",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const IDS = ["R1-11", "R1-12", "R1-13"];
/** The screen's first block under the page header: the bands of controls. */
const CONTROLS = { selector: "main > .flex-1 > div > :first-child", fallbackHeight: 240 };

const V1 = () => (
    <Crop {...CONTROLS}>
        <RealtimeV1 />
    </Crop>
);

const V2 = () => (
    <Crop {...CONTROLS}>
        <RealtimeV2 />
    </Crop>
);

/** R1-11, R1-12, R1-13 in v1: 75px date row, a check box row that wraps to two lines, 56px filter row; 15px labels and check box text. */
export const Before: Story = { render: () => <V1 /> };

/** R1-11, R1-12, R1-13 in v2: staging's 62px, 42px and 43px rows; 16px bold section labels; 13px bold grey check box text. */
export const After: Story = { render: () => <V2 /> };

/** R1-11, R1-12, R1-13: v1 above v2. */
export const SideBySide: Story = {
    name: "Side by side",
    render: () => <BeforeAfter ids={IDS} bleed before={<V1 />} after={<V2 />} />,
};
