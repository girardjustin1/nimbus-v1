import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProgressBar } from "@/components/base/progress-indicators/progress-indicators";
import { ProgressBarCircle, ProgressBarHalfCircle } from "@/components/base/progress-indicators/progress-circles";

const meta = {
    title: "Design System/Base Components/Progress Indicators",
    component: ProgressBar,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    args: { value: 50, labelPosition: "right" },
    argTypes: {
        value: { control: { type: "range", min: 0, max: 100, step: 1 } },
        labelPosition: {
            control: "inline-radio",
            options: ["right", "bottom", "top-floating", "bottom-floating"],
        },
    },
    decorators: [
        (Story) => (
            <div className="w-80">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default progress bar — teal Nimbus fill with the value label to the right. */
export const Default: Story = {
    args: { value: 50, labelPosition: "right" },
};

/** Progress bars at 25%, 50%, and 75%. */
export const Values: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-6">
            <ProgressBar value={25} labelPosition="right" />
            <ProgressBar value={50} labelPosition="right" />
            <ProgressBar value={75} labelPosition="right" />
        </div>
    ),
};

/** Label position variants. */
export const LabelPositions: Story = {
    render: () => (
        <div className="flex w-80 flex-col gap-10">
            <ProgressBar value={40} labelPosition="right" />
            <ProgressBar value={60} labelPosition="bottom" />
            <ProgressBar value={70} labelPosition="top-floating" />
        </div>
    ),
};

/** Circular and half-circle progress indicators. */
export const Circles: Story = {
    render: () => (
        <div className="flex items-center gap-10">
            <ProgressBarCircle value={75} size="xs" />
            <ProgressBarCircle value={60} size="sm" label="Storage" />
            <ProgressBarHalfCircle value={40} size="sm" label="Usage" />
        </div>
    ),
};
