import type { Meta, StoryObj } from "@storybook/react-vite";
import { PinkAction } from "../../../../prototypes/das/v3/screens/das-shell";
import { DoneButton, KeyHint, TrafficBadge } from "../../../../prototypes/das/v3/screens/search-select";
import { Surface } from "./harness";

/**
 * The small pieces: Done closes a picker panel, the pink text action (Clear all, Add keyword, Browse), the keyboard hint in panel footers, and the traffic badge in the Keywords table.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Actions & Hints",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Same as clicking away from a panel. */
export const Done: Story = {
    name: "Done button",
    render: () => (
        <Surface>
            <DoneButton onPress={() => {}} />
        </Surface>
    ),
};

/** Uppercase pink text action. */
export const PinkActionStory: Story = {
    name: "Pink action",
    render: () => (
        <Surface>
            <PinkAction onPress={() => {}}>Clear all</PinkAction>
        </Surface>
    ),
};

/** The keyboard line at the foot of every picker panel. */
export const KeyHintStory: Story = {
    name: "Key hint",
    render: () => (
        <Surface>
            <KeyHint />
        </Surface>
    ),
};

/** Whether a keyword is arriving in traffic. */
export const Traffic: Story = {
    name: "Traffic badge",
    render: () => (
        <Surface>
            <div className="flex gap-3">
                <TrafficBadge seen />
                <TrafficBadge seen={false} />
            </div>
        </Surface>
    ),
};
