import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyMetrics } from "../../../../prototypes/app/v1/screens/reporting/dashboard/key-metrics";

/** Full application · Reporting · Key metrics — the all-publisher view (prototypes/app/v1, #/key-metrics). */
const meta = {
    title: "Prototypes/Full application/Reporting/Key metrics",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds staging "Screenshot 2026-11-13 at 9.09.52 PM": nine cards, every tab strip live. */
export const Default: Story = { render: () => <KeyMetrics /> };
