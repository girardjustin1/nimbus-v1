import type { Meta, StoryObj } from "@storybook/react-vite";
import { IntegratedDemandPartnersTable } from "@/pages/app-screens/manage-active-demand";

const meta = {
    title: "Application UI/Table/102326/Demand Partners",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The current partner rows, running/capped/paused status dots, enable toggles, cap add/change/save modes and placement links. Toggles and inputs change locally; actions do not persist. These examples render the components and fixtures used by App Screens, without page navigation.",
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

export const IntegratedPartners: Story = { render: () => <IntegratedDemandPartnersTable /> };
