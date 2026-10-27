import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";

/**
 * Components → Radio Buttons
 * Staging's look (26 Oct): a very light grey ring when off; a thin teal ring, white gap and solid teal dot when selected. Sizing is set on the
 * RadioGroup and shared with its RadioButton children via context.
 */
const meta = {
    title: "Base Components/Radio Buttons",
    component: RadioGroup,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    args: { size: "sm" },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md"] },
    },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
    render: (args) => (
        <RadioGroup {...args} defaultValue="starter" aria-label="Plan">
            <RadioButton value="starter" label="Starter" />
            <RadioButton value="pro" label="Pro" />
            <RadioButton value="enterprise" label="Enterprise" />
        </RadioGroup>
    ),
};

/** Radio options with supporting hint text. */
export const WithHints: Story = {
    render: (args) => (
        <RadioGroup {...args} defaultValue="pro" aria-label="Plan">
            <RadioButton value="starter" label="Starter" hint="Up to 5 team members." />
            <RadioButton value="pro" label="Pro" hint="Up to 20 team members." />
            <RadioButton value="enterprise" label="Enterprise" hint="Unlimited team members." />
        </RadioGroup>
    ),
    args: { size: "md" },
};

/** Both sizes side by side. */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-start gap-12">
            <RadioGroup size="sm" defaultValue="a" aria-label="Small">
                <RadioButton value="a" label="Small option" />
                <RadioButton value="b" label="Another option" />
            </RadioGroup>
            <RadioGroup size="md" defaultValue="a" aria-label="Medium">
                <RadioButton value="a" label="Medium option" />
                <RadioButton value="b" label="Another option" />
            </RadioGroup>
        </div>
    ),
};

/** A disabled option renders at 50% opacity. */
export const Disabled: Story = {
    render: (args) => (
        <RadioGroup {...args} defaultValue="pro" aria-label="Plan">
            <RadioButton value="starter" label="Starter" />
            <RadioButton value="pro" label="Pro" />
            <RadioButton value="enterprise" label="Enterprise" isDisabled />
        </RadioGroup>
    ),
    args: { size: "md" },
};
