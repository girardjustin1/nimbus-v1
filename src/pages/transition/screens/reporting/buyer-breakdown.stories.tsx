import type { Meta, StoryObj } from "@storybook/react-vite";
import { BuyerBreakdown } from "../../../../../prototypes/app/v2/screens/reporting/buyers/buyer-breakdown";

/** Round 1 · Reporting · Buyer breakdown — renders v2, with the Round 1 styles (prototypes/app/v2, #/buyer-breakdown). */
const meta = {
    title: "Transition/Round 1/Screens/Reporting/Buyer breakdown",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tiles and the four Demand donuts, in v2. */
export const Default: Story = { render: () => <BuyerBreakdown /> };

/** The same figures as a sortable report, with its totals row, in v2. */
export const Table: Story = { render: () => <BuyerBreakdown view="table" /> };
