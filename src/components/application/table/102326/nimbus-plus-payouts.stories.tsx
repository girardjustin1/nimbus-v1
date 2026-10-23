import type { Meta, StoryObj } from "@storybook/react-vite";
import { PayoutOverviewTableExamples, PublisherPaymentsTable } from "@/pages/app-screens/nimbus-plus-payouts";

const meta = {
    title: "Application UI/Table/102326/Payout Administration",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Overview and all four publisher states, including issue highlighting, resubmit actions and total rows. These are sample financial records; actions do not transfer funds. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const Overview: Story = { render: () => <PayoutOverviewTableExamples /> };
export const Unsubmitted: Story = { render: () => <PublisherPaymentsTable state="unsubmitted" /> };
export const Complete: Story = { render: () => <PublisherPaymentsTable state="complete" /> };
export const BillingPeriod: Story = { render: () => <PublisherPaymentsTable state="billing" /> };
export const Issue: Story = { render: () => <PublisherPaymentsTable state="issue" /> };
