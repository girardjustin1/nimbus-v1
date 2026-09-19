import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeywordChip } from "../das-shell";

/** Round 1 · Keyword chip — mono, teal, optionally removable. Used in Targeting, Keyword Library and Manage Campaigns. */
const meta = {
    title: "Deal Activation System/Round 1 Concepts/Components/Keyword Chip",
    component: KeywordChip,
    args: { value: "sports" },
} satisfies Meta<typeof KeywordChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Removable: Story = { args: { onRemove: () => {} } };
export const Muted: Story = { args: { value: "77541", muted: true } };
export const Group: Story = {
    render: () => (
        <div className="flex flex-wrap gap-1.5">
            {["sports", "over21", "power-user", "midwest"].map((k) => (
                <KeywordChip key={k} value={k} onRemove={() => {}} />
            ))}
        </div>
    ),
};
