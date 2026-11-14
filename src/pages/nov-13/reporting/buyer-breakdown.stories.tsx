import type { Meta, StoryObj } from "@storybook/react-vite";
import { BuyerBreakdown } from "../../../../prototypes/app/v1/screens/reporting/buyers/buyer-breakdown";

/**
 * Reporting · Buyer breakdown — the publisher's demand partners, rebuilt from staging
 * (13 Nov) in the Nov 13 style guide. Same component as the prototype's
 * #/buyer-breakdown and #/buyer-breakdown-table screens.
 */
const meta = {
    title: "November 13th, 2026/Reporting/Buyer breakdown",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds "Screenshot 2026-11-13 at 9.11.29 PM.png": Yesterday, tiles and the four Demand donuts. */
export const Default: Story = {
    render: () => <BuyerBreakdown />,
};

/** The table icon on 9.11.29 PM: the same figures as a sortable report, one row per demand partner. */
export const Table: Story = {
    render: () => <BuyerBreakdown view="table" />,
};
