import type { Meta, StoryObj } from "@storybook/react-vite";
import { BillingRateModal, BillingSetupScreen } from "./billing-setup";

const meta = {
    title: "Archive/App Screens/Billing Setup",
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/**
 * Account → Billing Setup: Global Nav + top bar + billing-rate tables
 * (Creative / DAS Billing Rates / Unfilled / DAS Fallback) built from the
 * Nimbus theme with pink Add controls and teal Edit / Delete pills.
 */
export const Default: Story = {
    render: () => <BillingSetupScreen />,
};

/**
 * "Set Core Billing Rate" dialog — Fixed rate variant, shown open. Billing
 * Type + Filled Rate fields with a disabled Save until the form is complete.
 */
export const SetCoreBillingRateFixed: Story = {
    render: () => <BillingRateModal rateType="fixed" />,
};

/**
 * "Set Core Billing Rate" dialog — Tiered rate variant, shown open. Adds the
 * Set Tiers rows, the apply-to-all checkbox, an info banner and an active
 * pink Save.
 */
export const SetCoreBillingRateTiered: Story = {
    render: () => <BillingRateModal rateType="tiered" />,
};
