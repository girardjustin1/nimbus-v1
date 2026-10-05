import type { Meta, StoryObj } from "@storybook/react-vite";
import { GeoTarget } from "../../../../prototypes/das/v3/screens/existing-targets";
import { Surface, Value } from "./harness";

/**
 * Geos — a region tree you can take whole, type to narrow, A–Z, double-click a region to open or close it, and Done.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Targeting/Geos",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every country. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Value<string[]> initial={[]}>{(v, set) => <GeoTarget value={v} onChange={set} />}</Value>
        </Surface>
    ),
};

/** NORAM taken whole. */
export const Selected: Story = {
    name: "Selected",
    render: () => (
        <Surface>
            <Value<string[]> initial={["United States", "Canada"]}>{(v, set) => <GeoTarget value={v} onChange={set} />}</Value>
        </Surface>
    ),
};
