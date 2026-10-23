import type { Meta, StoryObj } from "@storybook/react-vite";
import {
    AdjustmentTableExample,
    DetailedPaymentsTable,
    MonthlyOverviewTableExamples,
    PaymentMonthTableExamples,
    SimplePaymentTableExample,
} from "@/pages/app-screens/nimbus-payments";

const meta = {
    title: "Application UI/Table/102326/Payments",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "All five payment views: monthly status/totals, simple payments, adjustments, gross/fee/net details and demand overview. Source fixtures and totals are reproduced as supplied. These examples render the components and fixtures used by App Screens, without page navigation.",
            },
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen overflow-x-auto bg-primary p-4 md:p-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta;
export default meta;
type Story = StoryObj;

export const MonthlyPayouts: Story = { render: () => <PaymentMonthTableExamples /> };
export const Completed: Story = { render: () => <SimplePaymentTableExample /> };
export const Adjustments: Story = { render: () => <AdjustmentTableExample /> };
export const Detailed: Story = { render: () => <DetailedPaymentsTable /> };
export const MonthlyOverview: Story = { render: () => <MonthlyOverviewTableExamples /> };
