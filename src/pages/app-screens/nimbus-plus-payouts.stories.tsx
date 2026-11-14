import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    NimbusPlusPayoutsOverview,
    NimbusPlusPayoutsPublisherBilling,
    NimbusPlusPayoutsPublisherComplete,
    NimbusPlusPayoutsPublisherIssue,
    NimbusPlusPayoutsPublisherUnsubmitted,
} from "./nimbus-plus-payouts";

/**
 * Nimbus+ Payouts — internal admin payouts tool.
 *
 * The reference flow (MVP January 2024) rebuilt on the Nimbus pink/teal theme
 * with the Global Nav + Untitled UI components. Every state shares the same
 * chrome: dark Global Nav, an internal admin top nav bar, the "Your App"
 * header, and the teal "Publish Payouts / TBD" sub-tab strip.
 *
 *   - Overview                      — monthly payout tables
 *   - PublisherPaymentsUnsubmitted  — Moloco drill-down, unsubmitted + submit CTA
 *   - PublisherPaymentsComplete     — Moloco drill-down, all complete
 *   - PublisherPaymentsBilling      — Moloco drill-down, current billing period
 *   - PublisherPaymentsIssue        — Moloco drill-down, 1 issue + resubmit
 */
const meta = {
    title: "Archive/App Screens/Nimbus+ Payouts",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;
type Story = StoryObj;

/** Overview — January 2024 (1 issue) + December 2023 monthly payout tables. */
export const Overview: Story = {
    render: () => <NimbusPlusPayoutsOverview />,
};

/** Publisher payments for Moloco with unsubmitted rows and the submit CTA. */
export const PublisherPaymentsUnsubmitted: Story = {
    render: () => <NimbusPlusPayoutsPublisherUnsubmitted />,
};

/** Publisher payments for Moloco once every row is complete (no submit CTA). */
export const PublisherPaymentsComplete: Story = {
    render: () => <NimbusPlusPayoutsPublisherComplete />,
};

/** Publisher payments for Moloco while still in the current billing period. */
export const PublisherPaymentsBilling: Story = {
    render: () => <NimbusPlusPayoutsPublisherBilling />,
};

/** Publisher payments for Moloco with one failed payment to resubmit. */
export const PublisherPaymentsIssue: Story = {
    render: () => <NimbusPlusPayoutsPublisherIssue />,
};
