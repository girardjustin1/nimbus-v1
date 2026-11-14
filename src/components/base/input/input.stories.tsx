import type { Meta, StoryObj } from "@storybook/react-vite";
import { Mail01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { InputGroup } from "@/components/base/input/input-group";

const meta = {
    title: "Design System/Base Components/Input",
    component: Input,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    args: {
        label: "Email",
        placeholder: "olivia@untitledui.com",
    },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md", "lg"] },
        isRequired: { control: "boolean" },
        isInvalid: { control: "boolean" },
        isDisabled: { control: "boolean" },
    },
    decorators: [
        (Story) => (
            <div className="max-w-sm">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default input with a label and placeholder — Nimbus theme applied globally. */
export const Default: Story = {
    args: { size: "md" },
};

/** Input with a leading icon. */
export const WithIcon: Story = {
    args: { size: "md", icon: Mail01 },
};

/** All three sizes stacked. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4">
            <Input {...args} size="sm" label="Small" />
            <Input {...args} size="md" label="Medium" />
            <Input {...args} size="lg" label="Large" />
        </div>
    ),
    args: { icon: Mail01 },
};

/** Required field — shows the required indicator on the label. */
export const Required: Story = {
    args: { size: "md", isRequired: true },
};

/** Invalid state with an error hint below the field. */
export const Invalid: Story = {
    args: {
        size: "md",
        isInvalid: true,
        hint: "Please enter a valid email address.",
    },
};

/** Disabled input. */
export const Disabled: Story = {
    args: { size: "md", isDisabled: true },
};

/** InputGroup with a trailing button addon. */
export const WithGroup: Story = {
    render: () => (
        <InputGroup
            label="Website"
            trailingAddon={
                <Button size="md" color="secondary">
                    Copy
                </Button>
            }
        >
            <Input placeholder="www.untitledui.com" />
        </InputGroup>
    ),
};
