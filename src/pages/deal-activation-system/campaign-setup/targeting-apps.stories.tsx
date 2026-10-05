import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppTargetBlock } from "../../../../prototypes/das/v3/screens/app-target";
import { APP_LIST } from "../../../../prototypes/das/v3/screens/target-data";
import { Surface, Value } from "./harness";

/**
 * Apps — search the app library on the page; chosen apps land in a table with platform and bundle ID.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Targeting/Apps",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every app. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Value<string[]> initial={[]}>{(v, set) => <AppTargetBlock value={v} onChange={set} />}</Value>
        </Surface>
    ),
};

/** One app on both platforms. */
export const Chosen: Story = {
    name: "Chosen",
    render: () => (
        <Surface>
            <Value<string[]> initial={APP_LIST.slice(0, 2).map((a) => a.id)}>{(v, set) => <AppTargetBlock value={v} onChange={set} />}</Value>
        </Surface>
    ),
};
