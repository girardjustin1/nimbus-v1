import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "@/components/base/slider/slider";

/**
 * Components → Slider
 * Range slider built on React Aria's Slider. The filled track and handle use
 * the Nimbus brand-solid (teal) token applied globally.
 */
const meta = {
    title: "Design System/Base Components/Slider",
    component: Slider,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    argTypes: {
        labelPosition: { control: "inline-radio", options: ["default", "bottom", "top-floating"] },
    },
    args: { labelPosition: "default", minValue: 0, maxValue: 100 },
    decorators: [
        (Story) => (
            <div className="mx-auto w-full max-w-md py-8">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { defaultValue: 40 },
};

/** A range slider with two thumbs — the fill spans between them. */
export const Range: Story = {
    args: { defaultValue: [25, 75] },
};

/** Floating value label shown above the handle. */
export const FloatingLabel: Story = {
    args: { defaultValue: 60, labelPosition: "top-floating" },
};

/** Persistent label rendered below the handle. */
export const BottomLabel: Story = {
    args: { defaultValue: 50, labelPosition: "bottom" },
};
