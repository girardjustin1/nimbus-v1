import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "@/components/base/select/select";
import type { SelectItemType } from "@/components/base/select/select";

const items: SelectItemType[] = [
    { id: "olivia", label: "Olivia Rhye", supportingText: "olivia@nimbus.com" },
    { id: "phoenix", label: "Phoenix Baker", supportingText: "phoenix@nimbus.com" },
    { id: "lana", label: "Lana Steiner", supportingText: "lana@nimbus.com" },
    { id: "demi", label: "Demi Wilkinson", supportingText: "demi@nimbus.com" },
    { id: "candice", label: "Candice Wu", supportingText: "candice@nimbus.com" },
];

const meta = {
    title: "Design System/Base Components/Select",
    component: Select,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        isDisabled: { control: "boolean" },
        isRequired: { control: "boolean" },
    },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

/** Basic Select with label, placeholder and the render-child Select.Item pattern. */
export const Default: Story = {
    args: {
        label: "Team member",
        placeholder: "Select team member",
        size: "md",
        items,
    },
    render: (args) => (
        <Select {...args}>
            {(item) => (
                <Select.Item id={item.id} supportingText={item.supportingText}>
                    {item.label}
                </Select.Item>
            )}
        </Select>
    ),
};

/** Searchable variant using the compound Select.ComboBox. */
export const ComboBox: Story = {
    args: {
        label: "Team member",
        size: "md",
    },
    render: (args) => (
        <Select.ComboBox label={args.label} size={args.size} placeholder="Search team member" items={items}>
            {(item) => (
                <Select.Item id={item.id} supportingText={item.supportingText}>
                    {item.label}
                </Select.Item>
            )}
        </Select.ComboBox>
    ),
};

/** With a helper hint below the field. */
export const WithHint: Story = {
    args: {
        label: "Team member",
        placeholder: "Select team member",
        hint: "This person will be notified of changes.",
        size: "md",
        items,
    },
    render: (args) => (
        <Select {...args}>
            {(item) => (
                <Select.Item id={item.id} supportingText={item.supportingText}>
                    {item.label}
                </Select.Item>
            )}
        </Select>
    ),
};

/** All three sizes stacked for a quick visual check. */
export const Sizes: Story = {
    args: {
        label: "Team member",
        placeholder: "Select team member",
        items,
    },
    render: (args) => (
        <div className="flex flex-col gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
                <Select key={size} {...args} size={size} label={`Team member (${size})`}>
                    {(item) => (
                        <Select.Item id={item.id} supportingText={item.supportingText}>
                            {item.label}
                        </Select.Item>
                    )}
                </Select>
            ))}
        </div>
    ),
};
