import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "@/components/base/toggle/toggle";

/**
 * Components → Toggle
 * Staging's look (27 Oct): on is a pink track with a white check and a pink-ringed knob; off is a light grey track with a white ✕ and a grey-ringed knob.
 */
const meta = {
    title: "Base Components/Toggle",
    component: Toggle,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    args: { label: "Enable notifications", size: "sm" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md"] },
        slim: { control: "boolean" },
        isSelected: { control: "boolean" },
        isDisabled: { control: "boolean" },
    },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** Toggle with a label and supporting hint text. */
export const WithHint: Story = {
    args: {
        size: "md",
        label: "Enable notifications",
        hint: "Receive email updates about your account activity.",
    },
};

/** Both sizes, default and slim variants. */
export const Variants: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <Toggle {...args} size="sm" label="Small" isSelected />
            <Toggle {...args} size="md" label="Medium" isSelected />
            <Toggle {...args} size="md" slim label="Slim" isSelected />
        </div>
    ),
    args: { label: undefined, hint: undefined },
};

/** Off, on, and disabled states. */
export const States: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <Toggle {...args} label="Off" />
            <Toggle {...args} label="On" isSelected />
            <Toggle {...args} label="Disabled off" isDisabled />
            <Toggle {...args} label="Disabled on" isDisabled isSelected />
        </div>
    ),
    args: { size: "md" },
};
