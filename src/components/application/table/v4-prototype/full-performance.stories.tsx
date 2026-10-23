import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullPerformance } from "../../../../../prototypes/das/v4/screens/full-performance";
import { PrototypeTableContext } from "./context";

const meta = {
    title: "Application UI/Table/V4 Prototype/Full Performance",
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
export const Table: Story = {
    render: () => (
        <PrototypeTableContext id="performance">
            <FullPerformance {...{ chart: "table" }} />
        </PrototypeTableContext>
    ),
};
export const Pivot: Story = {
    render: () => (
        <PrototypeTableContext id="performance">
            <FullPerformance {...{ chart: "table", breakdown: ["Creative", "Platform"] }} />
        </PrototypeTableContext>
    ),
};
export const Keywords: Story = {
    render: () => (
        <PrototypeTableContext id="performance">
            <FullPerformance {...{ id: "c3", chart: "table", breakdown: ["Keyword"] }} />
        </PrototypeTableContext>
    ),
};
