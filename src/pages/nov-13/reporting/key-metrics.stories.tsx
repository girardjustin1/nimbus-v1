import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyMetrics } from "../../../../prototypes/app/v1/screens/reporting/dashboard/key-metrics";

/** November 13th, 2026 · Reporting · Key metrics — the all-publisher view (prototypes/app/v1, #/key-metrics). */
const meta = {
    title: "November 13th, 2026/Reporting/Key metrics",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds staging "Screenshot 2026-11-13 at 9.09.52 PM": nine cards, every tab strip live. */
export const Default: Story = { render: () => <KeyMetrics /> };
