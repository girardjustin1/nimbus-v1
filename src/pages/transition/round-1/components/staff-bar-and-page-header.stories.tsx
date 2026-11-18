import type { Meta, StoryObj } from "@storybook/react-vite";
import { DasShell as DasShellV1 } from "../../../../../prototypes/app/v1/screens/das-shell";
import { DasShell as DasShellV2 } from "../../../../../prototypes/app/v2/screens/das-shell";
import { BeforeAfter, Crop } from "./frame";

/**
 * Round 1 · Components · Staff bar and page header (R1-01, R1-02).
 * The app shell cropped to its top: the staff bar, the announcement banner and the
 * page header with the account name and badge. v1 against v2.
 */
const meta = {
    title: "Transition/Round 1/Components/Staff bar and page header",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const IDS = ["R1-01", "R1-02"];
const TOP = { selector: "main", to: "main > header" };

const V1 = () => (
    <Crop {...TOP}>
        <DasShellV1 navKey="realtime dashboard" account="publisher">
            <div className="p-8" />
        </DasShellV1>
    </Crop>
);

const V2 = () => (
    <Crop {...TOP}>
        <DasShellV2 navKey="realtime dashboard" account="publisher">
            <div className="p-8" />
        </DasShellV2>
    </Crop>
);

/** R1-01, R1-02 in v1: a 45px staff bar with 15px links, and a 24px account name with a 15px badge. */
export const Before: Story = { render: () => <V1 /> };

/** R1-01, R1-02 in v2: staging's 50px staff bar with 13px bold links, and a 26px account name with the small upper case badge. */
export const After: Story = { render: () => <V2 /> };

/** R1-01, R1-02: v1 above v2. */
export const SideBySide: Story = {
    name: "Side by side",
    render: () => <BeforeAfter ids={IDS} bleed before={<V1 />} after={<V2 />} />,
};
