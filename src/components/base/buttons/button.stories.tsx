import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "@/components/base/buttons/button";

const meta = {
    title: "Design System/Base Components/Buttons",
    component: Button,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    args: { children: "Button CTA" },
    argTypes: {
        size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
        color: {
            control: "select",
            options: ["primary", "primary-pink", "secondary", "tertiary", "link-color", "link-gray", "primary-destructive"],
        },
        isDisabled: { control: "boolean" },
    },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Primary button — uses the Nimbus brand-solid (teal) token. */
export const Primary: Story = {
    args: { color: "primary", size: "md" },
};

/** Pink primary variant (#DA6EA3) — an alternate accent alongside the teal primary. */
export const PrimaryPink: Story = {
    args: { color: "primary-pink", size: "md" },
};

/** Teal vs pink primary side by side. */
export const PrimaryVariants: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            <Button {...args} color="primary">Teal primary</Button>
            <Button {...args} color="primary-pink">Pink primary</Button>
        </div>
    ),
    args: { size: "md" },
};

export const Secondary: Story = {
    args: { color: "secondary", size: "md" },
};

export const Tertiary: Story = {
    args: { color: "tertiary", size: "md" },
};

/** All brand colors side by side — quick visual check of the custom theme. */
export const AllColors: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            <Button {...args} color="primary">Primary</Button>
            <Button {...args} color="secondary">Secondary</Button>
            <Button {...args} color="tertiary">Tertiary</Button>
            <Button {...args} color="link-color">Link</Button>
            <Button {...args} color="primary-destructive">Destructive</Button>
        </div>
    ),
    args: { size: "md" },
};

/** All sizes of the primary (teal) button. */
export const AllSizes: Story = {
    render: (args) => (
        <div className="flex flex-wrap items-center gap-3">
            <Button {...args} size="xs">Extra small</Button>
            <Button {...args} size="sm">Small</Button>
            <Button {...args} size="md">Medium</Button>
            <Button {...args} size="lg">Large</Button>
            <Button {...args} size="xl">Extra large</Button>
        </div>
    ),
    args: { color: "primary" },
};
