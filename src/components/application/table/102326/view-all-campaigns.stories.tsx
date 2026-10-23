import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewCampaignsTable } from "@/pages/app-screens/view-all-campaigns";

const meta = {
    title: "Application UI/Table/102326/View All Campaigns",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The full 17-column campaign table, with inline priority fields, enable toggles and duplicate actions. Scroll horizontally to inspect every column. Sort chevrons are decorative. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const AllColumns: Story = { render: () => <ViewCampaignsTable /> };
