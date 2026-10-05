import type { Meta, StoryObj } from "@storybook/react-vite";
import { adUnitTypes } from "../../../../prototypes/das/v1/screens/das-data";
import { AdUnitCard } from "../../../../prototypes/das/v3/screens/ad-unit";
import { Surface, Value } from "./harness";

/**
 * Ad unit card — one ad unit type as a checkbox card. The whole card toggles it.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Ad Unit Card",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Not ticked. */
export const Off: Story = {
    name: "Off",
    render: () => (
        <Surface>
            <Value initial={false}>{(on, set) => <div className="max-w-xs"><AdUnitCard unit={adUnitTypes[0]} on={on} onToggle={() => set(!on)} /></div>}</Value>
        </Surface>
    ),
};

/** Ticked. */
export const On: Story = {
    name: "On",
    render: () => (
        <Surface>
            <Value initial={true}>{(on, set) => <div className="max-w-xs"><AdUnitCard unit={adUnitTypes[0]} on={on} onToggle={() => set(!on)} /></div>}</Value>
        </Surface>
    ),
};
