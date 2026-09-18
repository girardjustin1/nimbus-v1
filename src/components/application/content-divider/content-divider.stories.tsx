import type { FC } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ContentDivider } from "@/components/application/content-divider/content-divider";

/**
 * Application UI → Dividers
 *
 * Nimbus-themed content divider. The `type` prop switches between the three
 * supported layouts — `single-line` (a centered label flanked by rules),
 * `dual-line` (a label inside a top-and-bottom border band), and
 * `background-fill` (a label on a filled pill). Borders and fills follow the
 * globally-applied Nimbus theme automatically.
 */

const meta = {
    title: "Application UI/Dividers",
    component: ContentDivider,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta<typeof ContentDivider>;

export default meta;

// ContentDivider requires `type` and `children`, so type render-only stories
// as a no-prop component to avoid the "required args" error.
type Story = StoryObj<FC>;

/** Single-line divider with a centered label — the classic "OR" separator. */
export const Default: Story = {
    render: () => (
        <div className="max-w-2xl">
            <ContentDivider type="single-line">
                <span className="text-sm font-medium text-tertiary">OR</span>
            </ContentDivider>
        </div>
    ),
};

/** Dual-line divider: the label sits inside a top-and-bottom border band. */
export const DualLine: Story = {
    render: () => (
        <div className="max-w-2xl">
            <ContentDivider type="dual-line">
                <span className="text-sm font-medium text-tertiary">Continue below</span>
            </ContentDivider>
        </div>
    ),
};

/** Background-fill divider: the label rests on a filled pill background. */
export const BackgroundFill: Story = {
    render: () => (
        <div className="max-w-2xl">
            <ContentDivider type="background-fill">
                <span className="text-sm font-medium text-tertiary">Recommended</span>
            </ContentDivider>
        </div>
    ),
};

/** All three supported divider types, stacked for comparison. */
export const Variants: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-col gap-8">
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-quaternary uppercase">single-line</p>
                <ContentDivider type="single-line">
                    <span className="text-sm font-medium text-tertiary">OR</span>
                </ContentDivider>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-quaternary uppercase">dual-line</p>
                <ContentDivider type="dual-line">
                    <span className="text-sm font-medium text-tertiary">Continue below</span>
                </ContentDivider>
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-xs font-semibold text-quaternary uppercase">background-fill</p>
                <ContentDivider type="background-fill">
                    <span className="text-sm font-medium text-tertiary">Recommended</span>
                </ContentDivider>
            </div>
        </div>
    ),
};
