import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeywordTargetBlock } from "../../../../prototypes/das/v3/screens/keyword-target";
import { Surface, Value } from "./harness";

/**
 * Keywords — search the keyword library on the page; chosen keywords land in a table that says whether each is arriving in traffic.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Targeting/Keywords",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Not keyword-targeted. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Value<string[]> initial={[]}>{(v, set) => <KeywordTargetBlock value={v} onChange={set} />}</Value>
        </Surface>
    ),
};

/** Two keywords. */
export const Chosen: Story = {
    name: "Chosen",
    render: () => (
        <Surface>
            <Value<string[]> initial={["sports", "power-user"]}>{(v, set) => <KeywordTargetBlock value={v} onChange={set} />}</Value>
        </Surface>
    ),
};
