import type { Meta, StoryObj } from "@storybook/react-vite";
import { Home01 } from "@untitledui/icons";
import { Breadcrumbs } from "@/components/application/breadcrumbs/breadcrumbs";

const Trail = () => (
    <>
        <Breadcrumbs.Item href="#" icon={Home01} />
        <Breadcrumbs.Item href="#">Blog</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">Product</Breadcrumbs.Item>
        <Breadcrumbs.Item href="#">The Nimbus Dynamic Unit</Breadcrumbs.Item>
    </>
);

/**
 * Components → Breadcrumbs
 * Nimbus breadcrumbs, Nimbus-themed (current item uses the teal brand color).
 */
const meta = {
    title: "Design System/Application UI/Breadcrumbs",
    component: Breadcrumbs,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        divider: { control: "inline-radio", options: ["chevron", "slash"] },
        type: { control: "inline-radio", options: ["text", "text-line", "button"] },
    },
    args: { divider: "chevron", type: "text", children: <Trail /> },
} satisfies Meta<typeof Breadcrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const SlashDivider: Story = { args: { divider: "slash" } };

export const Types: Story = {
    render: (args) => (
        <div className="flex flex-col gap-6">
            <Breadcrumbs {...args} type="text" />
            <Breadcrumbs {...args} type="text-line" />
            <Breadcrumbs {...args} type="button" />
        </div>
    ),
};
