import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextArea } from "@/components/base/textarea/textarea";

const meta = {
    title: "Design System/Base Components/Textarea",
    component: TextArea,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    args: {
        label: "Message",
        placeholder: "Leave us a message...",
        rows: 4,
    },
    argTypes: {
        size: { control: "inline-radio", options: ["sm", "md"] },
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
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default textarea with a label and placeholder — Nimbus theme applied globally. */
export const Default: Story = {
    args: { size: "md" },
};

/** Textarea with a helper hint below the field. */
export const WithHint: Story = {
    args: {
        size: "md",
        hint: "Please keep your message under 500 characters.",
    },
};

/** Invalid state with an error hint. */
export const Invalid: Story = {
    args: {
        size: "md",
        isInvalid: true,
        hint: "This field is required.",
    },
};

/** Disabled textarea. */
export const Disabled: Story = {
    args: { size: "md", isDisabled: true },
};
