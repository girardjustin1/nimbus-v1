import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tag, TagGroup, TagList } from "@/components/base/tags/tags";

/**
 * Components → Tags
 * Selectable / removable labels built on React Aria's TagGroup. The Nimbus
 * theme is applied globally, so the dot, checkbox, and count accents are
 * already brand-styled.
 */
const meta = {
    title: "Design System/Base Components/Tags",
    component: TagGroup,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        selectionMode: { control: "inline-radio", options: ["none", "single", "multiple"] },
    },
    args: { label: "Tags", size: "md", selectionMode: "none" },
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: (args) => (
        <TagGroup {...args}>
            <TagList className="flex flex-wrap gap-2">
                <Tag id="design">Design</Tag>
                <Tag id="product">Product</Tag>
                <Tag id="engineering">Engineering</Tag>
            </TagList>
        </TagGroup>
    ),
};

/** Multi-select tags render an inline checkbox. */
export const Selectable: Story = {
    args: { selectionMode: "multiple", label: "Categories" },
    render: (args) => (
        <TagGroup {...args} defaultSelectedKeys={["product"]}>
            <TagList className="flex flex-wrap gap-2">
                <Tag id="design">Design</Tag>
                <Tag id="product">Product</Tag>
                <Tag id="engineering">Engineering</Tag>
            </TagList>
        </TagGroup>
    ),
};

/** Tags with status dots and count badges. */
export const WithDotAndCount: Story = {
    args: { label: "Statuses" },
    render: (args) => (
        <TagGroup {...args}>
            <TagList className="flex flex-wrap gap-2">
                <Tag id="active" dot count={12}>
                    Active
                </Tag>
                <Tag id="pending" dot dotClassName="text-fg-warning-secondary" count={4}>
                    Pending
                </Tag>
                <Tag id="removable" onClose={() => {}}>
                    Removable
                </Tag>
                <Tag id="disabled" isDisabled>
                    Disabled
                </Tag>
            </TagList>
        </TagGroup>
    ),
};

/** All three sizes. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col items-start gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
                <TagGroup key={size} {...args} size={size} label={`${size} tags`}>
                    <TagList className="flex flex-wrap gap-2">
                        <Tag id="design">Design</Tag>
                        <Tag id="product" count={8}>
                            Product
                        </Tag>
                        <Tag id="engineering" dot>
                            Engineering
                        </Tag>
                    </TagList>
                </TagGroup>
            ))}
        </div>
    ),
};
