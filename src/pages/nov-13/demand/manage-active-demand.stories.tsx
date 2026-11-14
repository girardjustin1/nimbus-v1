import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManageActiveDemand } from "../../../../prototypes/app/v1/screens/demand/active-demand";
import { ACTIVE_DEMAND_ONE } from "../../../../prototypes/app/v1/screens/demand/demand-data";

/** Demand → manage active demand: integrated partners and Third-Party Viewability. */
const meta = {
    title: "Prototypes/Full application/Demand/Manage Active Demand",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds "Screenshot 2026-11-13 at 9.12.35 PM" with a few partners integrated. */
export const Default: Story = { render: () => <ManageActiveDemand /> };

/** Rebuilds "Screenshot 2026-11-13 at 9.12.35 PM" as staging shows it: Nimbus+ only. */
export const NimbusPlusOnly: Story = { name: "Nimbus+ only", render: () => <ManageActiveDemand rows={ACTIVE_DEMAND_ONE} /> };
