import type { Meta, StoryObj } from "@storybook/react-vite";
import { BillingSetupTableExamples } from "@/pages/app-screens/billing-setup";

const meta = {
    title: "Application UI/Table/102326/Billing Setup",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Four custom HTML rate tables, including the fallback group with no row controls. Sort icons and add/edit/delete actions are illustrative. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const AllRateGroups: Story = { render: () => <BillingSetupTableExamples /> };
