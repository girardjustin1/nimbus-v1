import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeyMetrics } from "../../../../../prototypes/app/v2/screens/reporting/dashboard/key-metrics";

/** Round 1 · Reporting · Key metrics — renders v2, with the Round 1 styles (prototypes/app/v2, #/key-metrics). */
const meta = {
    title: "Transition/Round 1/Screens/Reporting/Key metrics",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nine cards, every tab strip live, in v2. */
export const Default: Story = { render: () => <KeyMetrics /> };
