import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";

/**
 * Application UI → Loading Indicator
 *
 * Nimbus-themed spinners. The `type` prop selects the visual style
 * (`line-simple`, `line-spinner`, `dot-circle`); `size` scales it from
 * `sm` to `xl`. The active arc uses the Nimbus teal brand color.
 */
const meta = {
    title: "Design System/Application UI/Loading Indicator",
    component: LoadingIndicator,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
        type: { control: "inline-radio", options: ["line-simple", "line-spinner", "dot-circle"] },
        size: { control: "inline-radio", options: ["sm", "md", "lg", "xl"] },
        label: { control: "text" },
    },
    args: { type: "line-simple", size: "lg" },
} satisfies Meta<typeof LoadingIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default line spinner. */
export const Default: Story = {};

/** With a text label below the spinner. */
export const WithLabel: Story = {
    args: { label: "Loading…" },
};

/** All three visual types side by side. */
export const Types: Story = {
    render: (args) => (
        <div className="flex items-center gap-16">
            <LoadingIndicator {...args} type="line-simple" label="line-simple" />
            <LoadingIndicator {...args} type="line-spinner" label="line-spinner" />
            <LoadingIndicator {...args} type="dot-circle" label="dot-circle" />
        </div>
    ),
};

/** The full size scale. */
export const Sizes: Story = {
    render: (args) => (
        <div className="flex items-end gap-16">
            <LoadingIndicator {...args} size="sm" label="sm" />
            <LoadingIndicator {...args} size="md" label="md" />
            <LoadingIndicator {...args} size="lg" label="lg" />
            <LoadingIndicator {...args} size="xl" label="xl" />
        </div>
    ),
};
