import type { Meta, StoryObj } from "@storybook/react-vite";
import { DasRateTableExamples } from "@/pages/app-screens/das-billing-rates";

const meta = {
    title: "Application UI/Table/102326/DAS Billing Rates",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The shared Table version of creative and DAS rates. Edit and delete pills retain their existing styling; modal flows are available in the linked App Screens stories. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const CreativeAndDasRates: Story = { render: () => <DasRateTableExamples /> };
