import type { Meta, StoryObj } from "@storybook/react-vite";
import { BadgeGroup } from "@/components/base/badges/badge-groups";

/**
 * Components → Badge Groups
 * Badge + label combos (e.g. announcement pills). brand = Nimbus pink.
 */
const meta = {
    title: "Design System/Base Components/Badge Groups",
    component: BadgeGroup,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    args: { addonText: "New", color: "brand", size: "md", theme: "light", children: "We just shipped the blog" },
    argTypes: {
        color: { control: "select", options: ["brand", "warning", "error", "gray", "success"] },
        size: { control: "inline-radio", options: ["md", "lg"] },
        theme: { control: "inline-radio", options: ["light", "modern"] },
        align: { control: "inline-radio", options: ["leading", "trailing"] },
    },
} satisfies Meta<typeof BadgeGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORS = ["brand", "warning", "error", "gray", "success"] as const;

export const Default: Story = {};

export const Colors: Story = {
    render: (args) => (
        <div className="flex flex-col items-start gap-3">
            {COLORS.map((color) => (
                <BadgeGroup key={color} {...args} color={color} addonText={color}>
                    We just shipped the blog
                </BadgeGroup>
            ))}
        </div>
    ),
};

export const Themes: Story = {
    render: (args) => (
        <div className="flex flex-col items-start gap-3">
            <BadgeGroup {...args} theme="light">Light theme</BadgeGroup>
            <BadgeGroup {...args} theme="modern">Modern theme</BadgeGroup>
        </div>
    ),
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col items-start gap-3">
            <BadgeGroup {...args} size="md">Medium</BadgeGroup>
            <BadgeGroup {...args} size="lg">Large</BadgeGroup>
        </div>
    ),
};
