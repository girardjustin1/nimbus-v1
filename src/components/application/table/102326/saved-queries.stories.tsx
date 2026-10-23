import type { Meta, StoryObj } from "@storybook/react-vite";
import { SavedQueriesTable } from "@/pages/app-screens/saved-queries";

const meta = {
    title: "Application UI/Table/102326/Saved Queries",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The shared Table saved-report list, including teal report names, circular add/delete actions and a visible delete tooltip. Sort headers are exposed without a data-sorting handler. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const Reports: Story = { render: () => <SavedQueriesTable /> };
