import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/base/buttons/button";
import { Tooltip } from "@/components/base/tooltip/tooltip";

const meta = {
    title: "Design System/Base Components/Tooltip",
    component: Tooltip,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    args: {
        title: "This is a tooltip",
        children: <Button color="secondary">Hover me</Button>,
    },
    argTypes: {
        placement: {
            control: "inline-radio",
            options: ["top", "bottom", "left", "right"],
        },
        arrow: { control: "boolean" },
    },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default tooltip — Nimbus-styled solid background, shown on hover. */
export const Default: Story = {
    args: { title: "This is a tooltip", placement: "top" },
};

/** Tooltip with a title and supporting description. */
export const WithDescription: Story = {
    args: {
        title: "Nimbus tooltip",
        description: "Supporting text that explains the action in more detail.",
        placement: "top",
    },
};

/** Tooltip with the arrow pointer enabled. */
export const WithArrow: Story = {
    args: { title: "Tooltip with arrow", arrow: true, placement: "top" },
};

/** All four placements around a trigger. */
export const Placements: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-8 p-16">
            <Tooltip {...args} placement="top" title="Top">
                <Button color="secondary">Top</Button>
            </Tooltip>
            <Tooltip {...args} placement="bottom" title="Bottom">
                <Button color="secondary">Bottom</Button>
            </Tooltip>
            <Tooltip {...args} placement="left" title="Left">
                <Button color="secondary">Left</Button>
            </Tooltip>
            <Tooltip {...args} placement="right" title="Right">
                <Button color="secondary">Right</Button>
            </Tooltip>
        </div>
    ),
    args: { arrow: true },
};
