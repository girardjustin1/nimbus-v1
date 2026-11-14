import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    CompletedPaymentsDetailed,
    CompletedPaymentsSimple,
    CompletedPaymentsWithAdjustments,
    NimbusPaymentsScreen,
    OverviewMonthlyPayouts,
} from "./nimbus-payments";

const meta = {
    title: "Archive/App Screens/Nimbus+ Payments",
    component: NimbusPaymentsScreen,
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof NimbusPaymentsScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Nimbus+ Payments (Publisher): a "Your Account" statement view with a running
 * balance summary and month-by-month payout tables. Running demand partners are
 * highlighted and prompt the publisher to update bank info; settled months show
 * a Total Paid.
 */
export const Default: Story = {};

/**
 * Redesigned "Completed Payments" view with a saved-query tab strip and the
 * Period / App / Demand Partner / Gross Amount Tipalti settlement table
 * (reference Screen.png).
 */
export const CompletedPaymentsSimpleView: Story = {
    render: () => <CompletedPaymentsSimple />,
};

/**
 * The completed-payments variant that pairs the Tipalti settlement table with a
 * secondary "Adjustments" table of negative reconciliations (reference
 * Screen-3.png).
 */
export const CompletedPaymentsWithAdjustmentsView: Story = {
    render: () => <CompletedPaymentsWithAdjustments />,
};

/**
 * Detailed completed-payments view under the Overview / Completed Payments tab
 * strip: Payment Date, Method, Gross, Tipalti Fees and Net Payment columns with
 * a per-row DETAILS pill (reference Screen-2.png).
 */
export const CompletedPaymentsDetailedView: Story = {
    render: () => <CompletedPaymentsDetailed />,
};

/**
 * Overview tab: month-by-month demand-partner payouts with Unsubmitted/Complete
 * status dots, sortable columns and a teal TOTAL summary row (reference
 * Screen-4.png).
 */
export const OverviewMonthlyPayoutsView: Story = {
    render: () => <OverviewMonthlyPayouts />,
};
