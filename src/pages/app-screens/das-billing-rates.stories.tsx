import type { ReactElement } from "react";
import type { Meta } from "@storybook/react-vite";
import { BillingRatesScreen, BillingRatesScreenWithModal } from "./das-billing-rates";

const meta = {
    title: "Archive/App Screens/DAS – Billing Rates",
    component: BillingRatesScreen,
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof BillingRatesScreen>;

export default meta;

// Render-only stories — typed loosely so they don't require component args.
type Story = { render: () => ReactElement };

/**
 * DAS Billing Rates admin screen: top link bar, "Your Account" header and one
 * billing-rate table per rate group (Creative / DAS Billing Rates) with
 * Edit/Delete controls.
 */
export const Default: Story = {
    render: () => <BillingRatesScreen />,
};

/** "Set Core Billing Rate" — minimal add form (reference Modal.png). */
export const AddRateModal: Story = {
    render: () => <BillingRatesScreenWithModal modal="add" />,
};

/** "Set Core Billing Rate" — tiered rate form with tiers + apply-all (reference Modal-1.png). */
export const TieredRateModal: Story = {
    render: () => <BillingRatesScreenWithModal modal="tiered" />,
};

/** "Set Core Billing Rate" — fixed rate form with billing type + filled rate (reference Modal-2.png). */
export const FixedRateModal: Story = {
    render: () => <BillingRatesScreenWithModal modal="fixed" />,
};
