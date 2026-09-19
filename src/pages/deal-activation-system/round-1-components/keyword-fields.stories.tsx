import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { MatchLogic } from "../das-data";
import { KeywordChipInput, MatchLogicField } from "../keyword-targeting";

/**
 * Round 1 · Keyword chip input and match logic. Enter or comma adds a keyword,
 * Backspace on empty removes the last; ANY / ALL explains its consequence in words.
 */
const meta = {
    title: "Deal Activation System/Round 1 Concepts/Components/Keyword Fields",
    decorators: [(Story) => <div className="max-w-2xl">{Story()}</div>],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChipInput: Story = { render: () => <KeywordChipInput initial={["sports", "power-user"]} /> };
export const ChipInputWithWarnings: Story = { render: () => <KeywordChipInput initial={["over21", "77541", "tailgate"]} /> };
export const ChipInputEmpty: Story = { render: () => <KeywordChipInput /> };

const MatchDemo = ({ initial, count }: { initial: MatchLogic; count: number }) => {
    const [v, setV] = useState<MatchLogic>(initial);
    return <MatchLogicField value={v} onChange={setV} count={count} />;
};
export const MatchAny: Story = { render: () => <MatchDemo initial="ANY" count={3} /> };
export const MatchAll: Story = { render: () => <MatchDemo initial="ALL" count={3} /> };
