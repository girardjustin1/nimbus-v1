import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTable, SavedQueriesView } from "@/pages/app-screens/performance-insights";

const meta = {
    title: "Application UI/Table/102326/Performance Insights",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "Both existing HTML styles: dark reporting metric headers with alternating rows, and rounded saved-query tables with add/delete actions and saved/recommended filters. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const Metrics: Story = { render: () => <DataTable /> };
export const SavedQueries: Story = { render: () => <SavedQueriesView /> };
