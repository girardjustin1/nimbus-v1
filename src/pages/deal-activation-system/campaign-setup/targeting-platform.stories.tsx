import type { Meta, StoryObj } from "@storybook/react-vite";
import { PlatformTarget } from "../../../../prototypes/das/v3/screens/existing-targets";
import { Surface, Value } from "./harness";

/**
 * Platform — iOS and Android.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Targeting/Platform",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every platform. */
export const None: Story = {
    name: "None",
    render: () => (
        <Surface>
            <Value<string[]> initial={[]}>{(v, set) => <PlatformTarget value={v} onChange={set} />}</Value>
        </Surface>
    ),
};

/** Both chosen. */
export const Both: Story = {
    name: "Both",
    render: () => (
        <Surface>
            <Value<string[]> initial={["iOS", "Android"]}>{(v, set) => <PlatformTarget value={v} onChange={set} />}</Value>
        </Surface>
    ),
};
