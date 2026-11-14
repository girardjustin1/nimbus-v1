import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { Selection } from "react-aria-components";
import { MultiSelect } from "@/components/base/select/multi-select";
import type { SelectItemType } from "@/components/base/select/select";

const items: SelectItemType[] = [
    { id: "olivia", label: "Olivia Rhye", supportingText: "olivia@nimbus.com" },
    { id: "phoenix", label: "Phoenix Baker", supportingText: "phoenix@nimbus.com" },
    { id: "lana", label: "Lana Steiner", supportingText: "lana@nimbus.com" },
    { id: "demi", label: "Demi Wilkinson", supportingText: "demi@nimbus.com" },
    { id: "candice", label: "Candice Wu", supportingText: "candice@nimbus.com" },
];

const meta = {
    title: "Design System/Base Components/Multi Select",
    component: MultiSelect,
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
        showSearch: { control: "boolean" },
        showFooter: { control: "boolean" },
    },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof MultiSelect>;

/** Basic multi-select with searchable options and a reset/select-all footer. */
export const Default: Story = {
    args: {
        label: "Team members",
        placeholder: "Select team members",
        size: "md",
        items,
    },
    render: (args) => {
        const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<string>());

        return (
            <MultiSelect
                {...args}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onReset={() => setSelectedKeys(new Set<string>())}
                onSelectAll={() => setSelectedKeys(new Set(items.map((item) => String(item.id))))}
            >
                {(item) => (
                    <MultiSelect.Item id={item.id} supportingText={item.supportingText}>
                        {item.label}
                    </MultiSelect.Item>
                )}
            </MultiSelect>
        );
    },
};

/** Starts with two members pre-selected. */
export const WithPreselection: Story = {
    args: {
        label: "Team members",
        placeholder: "Select team members",
        size: "md",
        items,
    },
    render: (args) => {
        const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(["olivia", "lana"]));

        return (
            <MultiSelect
                {...args}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onReset={() => setSelectedKeys(new Set<string>())}
                onSelectAll={() => setSelectedKeys(new Set(items.map((item) => String(item.id))))}
            >
                {(item) => (
                    <MultiSelect.Item id={item.id} supportingText={item.supportingText}>
                        {item.label}
                    </MultiSelect.Item>
                )}
            </MultiSelect>
        );
    },
};

/** Compact variant with the search input and footer hidden. */
export const Minimal: Story = {
    args: {
        label: "Team members",
        placeholder: "Select team members",
        size: "sm",
        showSearch: false,
        showFooter: false,
        items,
    },
    render: (args) => {
        const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set<string>());

        return (
            <MultiSelect {...args} selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                {(item) => (
                    <MultiSelect.Item id={item.id} supportingText={item.supportingText}>
                        {item.label}
                    </MultiSelect.Item>
                )}
            </MultiSelect>
        );
    },
};
