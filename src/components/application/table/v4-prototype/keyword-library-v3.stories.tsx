import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewAllKeywords } from "../../../../../prototypes/das/v4/screens/keyword-library-v3";
import { PrototypeTableContext } from "./context";

const meta = {
    title: "Application UI/Table/V4 Prototype/Keyword Library",
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
        <PrototypeTableContext id="keywords">
            <ViewAllKeywords {...{}} />
        </PrototypeTableContext>
    ),
};
export const Empty: Story = {
    render: () => (
        <PrototypeTableContext id="keywords">
            <ViewAllKeywords {...{ empty: true }} />
        </PrototypeTableContext>
    ),
};
