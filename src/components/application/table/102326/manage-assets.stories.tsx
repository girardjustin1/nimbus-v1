import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssetCampaignsTable, SelectedAssetsTable } from "@/pages/app-screens/manage-assets";

const meta = {
    title: "Application UI/Table/102326/Manage Assets",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Selected creative rows and live campaign rows. Live campaign sorting is wired, including numeric tracker and cap values; other actions are demo affordances. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const SelectedAssets: Story = { render: () => <SelectedAssetsTable /> };
export const LiveCampaigns: Story = { render: () => <AssetCampaignsTable /> };
