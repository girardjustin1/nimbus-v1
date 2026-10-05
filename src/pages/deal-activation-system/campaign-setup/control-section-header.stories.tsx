import type { Meta, StoryObj } from "@storybook/react-vite";
import { Section } from "../../../../prototypes/das/v3/screens/das-shell";
import { Surface } from "./harness";

/**
 * Section header — the extra-bold headline with its one line of instruction underneath. Every section on the page opens with one.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Section Header",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The usual shape. */
export const WithDescription: Story = {
    name: "Headline and description",
    render: () => (
        <Surface>
            <Section title="Auction Rules" description="How this campaign competes with open-marketplace auctions.">
                <div className="h-16 rounded-xl border border-dashed border-secondary" />
            </Section>
        </Surface>
    ),
};

/** When there is nothing to explain. */
export const HeadlineOnly: Story = {
    name: "Headline only",
    render: () => (
        <Surface>
            <Section title="Budget">
                <div className="h-16 rounded-xl border border-dashed border-secondary" />
            </Section>
        </Surface>
    ),
};
