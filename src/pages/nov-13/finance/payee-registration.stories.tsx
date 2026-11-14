import type { Meta, StoryObj } from "@storybook/react-vite";
import { FinanceScreen } from "../../../../prototypes/app/v1/screens/account/finance";

/** Finance · Payee registration — the payments provider's frame inside our chrome, and staging's no-permission state. */
const meta = {
    title: "Prototypes/Full application/Finance/Payee registration",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Payee registration with access: the embedded third-party frame (placeholder content), after staging "Screenshot 2026-11-13 at 9.15.26 PM". */
export const Default: Story = { render: () => <FinanceScreen page="payee" /> };

/** Rebuilds staging "Screenshot 2026-11-13 at 9.15.26 PM" (no permission). */
export const NoPermission: Story = { name: "No permission", render: () => <FinanceScreen page="payee" permission={false} /> };
