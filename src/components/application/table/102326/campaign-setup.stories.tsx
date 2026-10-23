import type { Meta, StoryObj } from "@storybook/react-vite";
import { CampaignCreativeTable, ReviewCreativeTable } from "@/pages/app-screens/campaign-setup";

const meta = {
    title: "Application UI/Table/102326/Campaign Setup",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Creative selection uses shared Table; review uses a striped HTML table. The error variant flags invalid HTML in the first row. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const Creative: Story = { render: () => <CampaignCreativeTable /> };
export const Review: Story = { render: () => <ReviewCreativeTable /> };
export const ReviewErrors: Story = { render: () => <ReviewCreativeTable firstRowError /> };
