import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "@/components/base/badges/badges";

/**
 * Foundations → Badges
 * Category tags / labels used throughout the blog UI (article categories, etc.).
 */
const meta = {
    title: "Design System/Base Components/Badges",
    component: Badge,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    args: { children: "Label", color: "brand", size: "md", type: "pill-color" },
    argTypes: {
        type: { control: "inline-radio", options: ["pill-color", "color", "modern"] },
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        color: {
            control: "select",
            options: ["gray", "brand", "error", "warning", "success", "slate", "sky", "blue", "indigo", "purple", "pink", "orange"],
        },
    },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

const COLORS = ["gray", "brand", "error", "warning", "success", "slate", "sky", "blue", "indigo", "purple", "pink", "orange"] as const;

export const Default: Story = {};

/** All badge colors (pill style) — brand is Nimbus pink. */
export const AllColors: Story = {
    render: (args) => (
        <div className="flex max-w-xl flex-wrap items-center gap-2">
            {COLORS.map((color) => (
                <Badge key={color} {...args} color={color}>
                    {color}
                </Badge>
            ))}
        </div>
    ),
};

/** The three badge styles side by side (gray is valid across all types). */
export const Types: Story = {
    render: () => (
        <div className="flex items-center gap-3">
            <Badge type="pill-color" color="gray" size="md">Pill</Badge>
            <Badge type="color" color="gray" size="md">Color</Badge>
            <Badge type="modern" color="gray" size="md">Modern</Badge>
        </div>
    ),
};

export const Sizes: Story = {
    render: (args) => (
        <div className="flex items-center gap-3">
            <Badge {...args} size="sm">Small</Badge>
            <Badge {...args} size="md">Medium</Badge>
            <Badge {...args} size="lg">Large</Badge>
        </div>
    ),
};
