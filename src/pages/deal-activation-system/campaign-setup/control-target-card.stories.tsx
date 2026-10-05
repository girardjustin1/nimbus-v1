import type { Meta, StoryObj } from "@storybook/react-vite";
import { TargetBlock } from "../../../../prototypes/das/v3/screens/search-select";
import { Surface } from "./harness";

/**
 * Target card — the frame every targeting module sits in. When the content opens with an instruction (data-intro), the title closes up onto it.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Target Card",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Title, instruction, control. */
export const WithInstruction: Story = {
    name: "With instruction",
    render: () => (
        <Surface>
            <TargetBlock title="Keywords">
                <p data-intro className="mb-1 text-md text-tertiary">
                    50 keywords in your library. Type to filter, or press ↓ to see them all.
                </p>
                <div className="h-11 rounded-lg border border-dashed border-secondary" />
            </TargetBlock>
        </Surface>
    ),
};

/** Title straight onto the control. */
export const WithoutInstruction: Story = {
    name: "Without instruction",
    render: () => (
        <Surface>
            <TargetBlock title="Geos">
                <div className="h-11 rounded-lg border border-dashed border-secondary" />
            </TargetBlock>
        </Surface>
    ),
};
