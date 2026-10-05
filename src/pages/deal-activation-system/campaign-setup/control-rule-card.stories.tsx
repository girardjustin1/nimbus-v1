import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { rules } from "../../../../prototypes/das/v1/screens/setup-data";
import { RuleCard } from "../../../../prototypes/das/v3/screens/rules-section";
import { Surface } from "./harness";

/**
 * Rule card — one auction rule. The whole card is the target, with the text fields' edge.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Rule Card",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Resting. */
export const Unselected: Story = {
    name: "Unselected",
    render: () => (
        <Surface>
            <RadioGroup size="md" value={null} aria-label="Auction rule" className="max-w-md">
                <RuleCard rule={rules[0]} selected={false} />
            </RadioGroup>
        </Surface>
    ),
};

/** Chosen: teal edge and tint. */
export const Selected: Story = {
    name: "Selected",
    render: () => (
        <Surface>
            <RadioGroup size="md" value={rules[1].id} aria-label="Auction rule" className="max-w-md">
                <RuleCard rule={rules[1]} selected />
            </RadioGroup>
        </Surface>
    ),
};

/** After Review with no rule chosen. */
export const Invalid: Story = {
    name: "Invalid",
    render: () => (
        <Surface>
            <RadioGroup size="md" value={null} aria-label="Auction rule" className="max-w-md">
                <RuleCard rule={rules[0]} selected={false} invalid />
            </RadioGroup>
        </Surface>
    ),
};
