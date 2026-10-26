import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewAllAssets } from "../../../../../prototypes/das/v5/screens/asset-library";
import { PrototypeTableContext } from "./context";

const meta = {
    title: "Application UI/Table/V5 Prototype/Asset Library",
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
        <PrototypeTableContext id="assets">
            <ViewAllAssets {...{}} />
        </PrototypeTableContext>
    ),
};
