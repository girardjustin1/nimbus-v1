import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { GoalId } from "../studio-data";
import { GoalTiles } from "./goal-tiles";

/** Studio · Goal tiles — the first decision, as four visual tiles. */
const meta = { title: "Deal Activation System/Studio Concept/Components/Goal Tiles" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ initial, invalid }: { initial?: GoalId; invalid?: boolean }) => {
    const [v, setV] = useState<GoalId | undefined>(initial);
    return <GoalTiles value={v} onChange={setV} invalid={invalid && !v} />;
};
export const Empty: Story = { render: () => <Demo /> };
export const Selected: Story = { render: () => <Demo initial="priority" /> };
export const Invalid: Story = { render: () => <Demo invalid /> };
