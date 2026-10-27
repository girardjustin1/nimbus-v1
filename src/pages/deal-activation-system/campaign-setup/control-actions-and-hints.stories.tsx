import type { Meta, StoryObj } from "@storybook/react-vite";
import { PinkAction } from "../../../../prototypes/das/v5/screens/das-shell";
import { DoneButton, KeyHint } from "../../../../prototypes/das/v5/screens/search-select";
import { Surface } from "./harness";

/**
 * The small pieces: Done closes a picker panel, the pink text action (Clear all, Add keyword, Browse), and the keyboard hint in panel footers. (The traffic badge in the Keywords table was removed on 27 Oct.)
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
