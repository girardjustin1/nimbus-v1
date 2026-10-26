import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeywordHealth } from "../../../../../prototypes/das/v5/screens/keyword-health";
import { PrototypeTableContext } from "./context";

const meta = {
    title: "Application UI/Table/V5 Prototype/Keyword Health",
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
        <PrototypeTableContext id="health">
            <KeywordHealth {...{}} />
        </PrototypeTableContext>
    ),
};
