import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManageCampaigns } from "../../../../../prototypes/das/v5/screens/manage-campaigns";
import { PrototypeTableContext } from "./context";

const meta = {
    title: "Application UI/Table/V5 Prototype/Manage Campaigns",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The current v5 (Round 5) component in its screen context, styled by the 26 Oct list-vs-report rule. The annotation links its exact prototype location, the closest existing design-system table and a charcoal-header reference.",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Current: Story = {
    render: () => (
        <PrototypeTableContext id="campaigns">
            <ManageCampaigns {...{}} />
        </PrototypeTableContext>
    ),
};
