import type { Meta, StoryObj } from "@storybook/react-vite";
import { campaigns } from "../das-data";
import { DeliveryBar } from "../das-shell";

/**
 * Round 1 · Delivery bar — spend vs budget, with a tick where spend should be for the
 * share of the flight that has passed, and a pace label.
 */
const meta = {
    title: "Archive/DAS early concepts/Round 1/Components/Delivery Bar",
    component: DeliveryBar,
    args: { campaign: campaigns[0] },
    decorators: [(Story) => <div className="w-72">{Story()}</div>],
} satisfies Meta<typeof DeliveryBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnTrack: Story = {};
export const Behind: Story = { args: { campaign: campaigns[1] } };
export const NotStarted: Story = { args: { campaign: campaigns[5] } };
export const Fallback: Story = { args: { campaign: campaigns[4] } };
export const BarOnly: Story = { args: { showLabels: false } };
