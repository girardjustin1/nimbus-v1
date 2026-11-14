import type { Meta, StoryObj } from "@storybook/react-vite";
import { RealtimeDashboard } from "../../../../prototypes/app/v1/screens/reporting/dashboard/realtime";

/** November 13th, 2026 · Reporting · Realtime dashboard — one publisher (prototypes/app/v1, #/realtime). */
const meta = {
    title: "November 13th, 2026/Reporting/Realtime dashboard",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds staging "Screenshot 2026-11-13 at 9.10.23 PM" and "9.10.40 PM" (chart tooltip on hover). */
export const Default: Story = { render: () => <RealtimeDashboard /> };

/** Rebuilds staging "Screenshot 2026-11-13 at 9.10.26 PM" with the table switch on: chart hidden. */
export const TableView: Story = { name: "Table view", render: () => <RealtimeDashboard view="table" /> };

/** Staging's Totals Only toggle on (9.10.23 PM controls): platforms combined. */
export const TotalsOnly: Story = { name: "Totals only", render: () => <RealtimeDashboard totalsOnly /> };
