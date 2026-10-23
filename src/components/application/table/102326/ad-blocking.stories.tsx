import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdBlockingTableExamples } from "@/pages/app-screens/ad-blocking";

const meta = {
    title: "Application UI/Table/102326/Ad Blocking",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Three standard blocklist sections, with the existing search, download, unblock and load-all controls. Column sorting is wired in this version. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const Standard: Story = { render: () => <AdBlockingTableExamples /> };
