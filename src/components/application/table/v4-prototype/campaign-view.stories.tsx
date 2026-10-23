import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewOnePage } from "../../../../../prototypes/das/v4/screens/campaign-view";
import { PrototypeTableContext } from "./context";

const meta = {
    title: "Application UI/Table/V4 Prototype/Campaign Creatives",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "The current v4 component in its screen context. The annotation links its exact prototype location, the closest existing design-system table and a charcoal-header reference. This is the existing v4 appearance.",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;
export const Current: Story = {
    render: () => (
        <PrototypeTableContext id="creatives">
            <ViewOnePage {...{}} />
        </PrototypeTableContext>
    ),
};
