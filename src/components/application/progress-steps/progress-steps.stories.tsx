import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreditCard01, Flag01, Settings01, UserPlus01 } from "@untitledui/icons";
import { Progress } from "@/components/application/progress-steps/progress-steps";
import type { ProgressFeaturedIconType, ProgressIconType } from "@/components/application/progress-steps/progress-types";

/**
 * Application UI → Progress Steps
 *
 * Nimbus-themed progress steppers. The theme is applied globally, so the
 * completed/current step markers, connectors, and brand text pick up the
 * Nimbus teal automatically. The `Progress` object exposes the step layouts
 * (`IconsWithText`, `MinimalIcons`, `MinimalIconsConnected`, `TextWithLine`).
 */

const items: ProgressIconType[] = [
    { title: "Create account", description: "Set up your workspace", status: "complete" },
    { title: "Invite team", description: "Add your teammates", status: "complete" },
    { title: "Add billing", description: "Choose a plan", status: "current" },
    { title: "Go live", description: "Launch your project", status: "incomplete" },
];

const featuredItems: ProgressFeaturedIconType[] = [
    { title: "Create account", description: "Set up your workspace", status: "complete", icon: UserPlus01 },
    { title: "Invite team", description: "Add your teammates", status: "complete", icon: Settings01 },
    { title: "Add billing", description: "Choose a plan", status: "current", icon: CreditCard01 },
    { title: "Go live", description: "Launch your project", status: "incomplete", icon: Flag01 },
];

const meta = {
    title: "Design System/Application UI/Progress Steps",
    component: Progress.IconsWithText,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
} satisfies Meta<typeof Progress.IconsWithText>;

export default meta;

// Render-only stories: type against the rendered layout so required args aren't demanded.
type Story = StoryObj<typeof Progress.IconsWithText>;

/** Default horizontal stepper with numbered markers and titles. */
export const Default: Story = {
    render: () => (
        <div className="max-w-2xl">
            <Progress.IconsWithText type="number" orientation="horizontal" items={items} />
        </div>
    ),
};

/** Vertical stepper showing completed, current, and upcoming states with icon dots. */
export const Vertical: Story = {
    render: () => (
        <div className="max-w-2xl">
            <Progress.IconsWithText type="icon" orientation="vertical" items={items} />
        </div>
    ),
};

/** Horizontal stepper using featured icons for each step. */
export const FeaturedIcons: Story = {
    render: () => (
        <div className="max-w-2xl">
            <Progress.IconsWithText type="featured-icon" orientation="horizontal" items={featuredItems} />
        </div>
    ),
};

/** Minimal dot indicators — with a connected line and a plain "Step X of Y" variant. */
export const Minimal: Story = {
    render: () => (
        <div className="flex max-w-2xl flex-col gap-10">
            <Progress.MinimalIconsConnected items={items} orientation="horizontal" />
            <Progress.MinimalIcons items={items} text />
        </div>
    ),
};

/** Text-with-top-line layout, a compact horizontal stepper. */
export const TextWithLine: Story = {
    render: () => (
        <div className="max-w-2xl">
            <Progress.TextWithLine items={items} orientation="horizontal" />
        </div>
    ),
};
