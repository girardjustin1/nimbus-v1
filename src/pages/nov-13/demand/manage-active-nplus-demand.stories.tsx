import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManageActiveDemand } from "../../../../prototypes/app/v1/screens/demand/active-demand";
import { NPLUS_DEMAND_ONE } from "../../../../prototypes/app/v1/screens/demand/demand-data";

/** Demand → manage active n+ demand: integrated Nimbus+ partners and Third-Party Viewability. */
const meta = {
    title: "November 13th, 2026/Demand/Manage Active n+ Demand",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds "Screenshot 2026-11-13 at 9.12.41 PM" with a few Nimbus+ partners. */
export const Default: Story = { render: () => <ManageActiveDemand nplus /> };

/** Rebuilds "Screenshot 2026-11-13 at 9.12.41 PM" as staging shows it: one partner. */
export const OnePartner: Story = { name: "One partner", render: () => <ManageActiveDemand nplus rows={NPLUS_DEMAND_ONE} /> };
