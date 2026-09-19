import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { BidRangeField } from "./bid-range-field";

/** Studio · Bid range field — the bid drawn on its recommended range. */
const meta = { title: "Deal Activation System/Studio Concept/Components/Bid Range Field" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ initial, error }: { initial?: number; error?: string }) => {
    const [v, setV] = useState<number | undefined>(initial);
    return <BidRangeField value={v} onChange={setV} recommended={[7.5, 9.5]} error={error} />;
};
export const WithinRange: Story = { render: () => <Demo initial={8.9} /> };
export const BelowRange: Story = { render: () => <Demo initial={5.25} /> };
export const AboveRange: Story = { render: () => <Demo initial={12} /> };
export const Empty: Story = { render: () => <Demo /> };
export const WithError: Story = { render: () => <Demo error="Set a bid to publish." /> };
