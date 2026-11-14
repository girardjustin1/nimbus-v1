import type { Meta, StoryObj } from "@storybook/react-vite";
import { FinanceScreen } from "../../../../prototypes/app/v1/screens/account/finance";

/** Finance · Payment history — the payments provider's frame inside our chrome, and staging's no-permission state. */
const meta = {
    title: "November 13th, 2026/Finance/Payment history",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Payment history with access: the embedded third-party frame (placeholder content), after staging "Screenshot 2026-11-13 at 9.15.32 PM". */
export const Default: Story = { render: () => <FinanceScreen page="payments" /> };

/** Rebuilds staging "Screenshot 2026-11-13 at 9.15.32 PM" (no permission). */
export const NoPermission: Story = { name: "No permission", render: () => <FinanceScreen page="payments" permission={false} /> };
