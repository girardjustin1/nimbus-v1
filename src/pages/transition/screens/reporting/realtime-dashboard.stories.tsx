import type { Meta, StoryObj } from "@storybook/react-vite";
import { RealtimeDashboard } from "../../../../../prototypes/app/v2/screens/reporting/dashboard/realtime";

/** Round 1 · Reporting · Realtime dashboard — renders v2, with the Round 1 styles (prototypes/app/v2, #/realtime). */
const meta = {
    title: "Transition/Round 1/Screens/Reporting/Realtime dashboard",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The chart view, in v2. */
export const Default: Story = { render: () => <RealtimeDashboard /> };

/** The table switch on: chart hidden, in v2. */
export const TableView: Story = { name: "Table view", render: () => <RealtimeDashboard view="table" /> };

/** Totals Only on: platforms combined, in v2. */
export const TotalsOnly: Story = { name: "Totals only", render: () => <RealtimeDashboard totalsOnly /> };
