import type { Meta, StoryObj } from "@storybook/react-vite";
import { DetailedBlocklistTableExamples } from "@/pages/app-screens/ad-blocking-blocklists";

const meta = {
    title: "Application UI/Table/102326/Detailed Blocklists",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Four detailed OpenRTB blocklists. Teal sort chevrons and action pills are visual controls in the current screen. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const AllLists: Story = { render: () => <DetailedBlocklistTableExamples /> };
