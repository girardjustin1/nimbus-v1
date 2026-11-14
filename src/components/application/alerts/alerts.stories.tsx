import type { Meta, StoryObj } from "@storybook/react-vite";
import { AlertFloating, AlertFullWidth } from "@/components/application/alerts/alerts";

/**
 * Application UI → Alerts
 *
 * Nimbus-themed inline alerts. These render with the Nimbus theme (pink brand,
 * teal secondary) out of the box — just supply a title, description, and the
 * confirm / dismiss handlers. The `color` prop drives the featured icon and its
 * semantic styling: default, brand, gray, error, warning, and success.
 *
 * Two layouts are exported:
 * - `AlertFloating` — a rounded, self-contained card alert.
 * - `AlertFullWidth` — an edge-to-edge banner spanning the container width.
 */

const meta = {
    title: "Design System/Application UI/Alerts",
    component: AlertFloating,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="mx-auto flex max-w-lg flex-col gap-4">
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof AlertFloating>;

export default meta;

type Story = StoryObj<typeof AlertFloating>;

const noop = () => {};

/** Floating card alert with a confirm and a dismiss action. */
export const Default: Story = {
    args: {
        color: "brand",
        title: "We've just released a new update!",
        description: "Check out the all-new dashboard view. Pages and exports now load faster.",
        confirmLabel: "Changelog",
        dismissLabel: "Dismiss",
        onClose: noop,
        onConfirm: noop,
    },
};

/** Success alert confirming a completed action. */
export const Success: Story = {
    args: {
        color: "success",
        title: "Payment received",
        description: "Your annual Nimbus subscription has been renewed successfully.",
        confirmLabel: "View receipt",
        dismissLabel: "Dismiss",
        onClose: noop,
        onConfirm: noop,
    },
};

/** Warning alert prompting the user to act before something expires. */
export const Warning: Story = {
    args: {
        color: "warning",
        title: "Your trial ends in 3 days",
        description: "Upgrade now to keep your projects, teammates, and integrations active.",
        confirmLabel: "Upgrade plan",
        dismissLabel: "Remind me later",
        onClose: noop,
        onConfirm: noop,
    },
};

/** Error alert surfacing a failed operation. */
export const Error: Story = {
    args: {
        color: "error",
        title: "We couldn't process your payment",
        description: "The card on file was declined. Update your billing details to continue.",
        confirmLabel: "Update billing",
        dismissLabel: "Dismiss",
        onClose: noop,
        onConfirm: noop,
    },
};

/** Every color rendered together for a quick visual reference. */
export const AllColors: Story = {
    render: () => (
        <>
            <AlertFloating
                color="brand"
                title="New workspace features are live"
                description="Explore shared views and saved filters across your team."
                confirmLabel="Learn more"
                onClose={noop}
                onConfirm={noop}
            />
            <AlertFloating
                color="success"
                title="Backup completed"
                description="Your workspace was backed up 2 minutes ago."
                confirmLabel="View details"
                onClose={noop}
                onConfirm={noop}
            />
            <AlertFloating
                color="warning"
                title="Storage is almost full"
                description="You're using 92% of your available storage."
                confirmLabel="Manage storage"
                onClose={noop}
                onConfirm={noop}
            />
            <AlertFloating
                color="error"
                title="Sync failed"
                description="We couldn't reach your connected repository."
                confirmLabel="Retry"
                onClose={noop}
                onConfirm={noop}
            />
            <AlertFloating
                color="gray"
                title="Scheduled maintenance"
                description="Nimbus will be briefly unavailable on Sunday at 02:00 UTC."
                confirmLabel="Read notice"
                onClose={noop}
                onConfirm={noop}
            />
        </>
    ),
};

type FullWidthStory = StoryObj<typeof AlertFullWidth>;

/**
 * Edge-to-edge banner variant. Uses `layout: fullscreen` so it can stretch the
 * full width, and defaults to `button`-style actions.
 */
export const FullWidth: FullWidthStory = {
    parameters: { layout: "fullscreen" },
    decorators: [
        (Story) => (
            <div className="bg-secondary py-8">
                <Story />
            </div>
        ),
    ],
    render: () => (
        <AlertFullWidth
            color="brand"
            title="We've just launched Nimbus 2.0"
            description="A faster editor, real-time collaboration, and a redesigned dashboard."
            confirmLabel="See what's new"
            dismissLabel="Dismiss"
            onClose={noop}
            onConfirm={noop}
        />
    ),
};

/** Full-width banner with link-style actions. */
export const FullWidthLinkActions: FullWidthStory = {
    parameters: { layout: "fullscreen" },
    decorators: [
        (Story) => (
            <div className="bg-secondary py-8">
                <Story />
            </div>
        ),
    ],
    render: () => (
        <AlertFullWidth
            color="warning"
            actionType="link"
            title="Action required: verify your email"
            description="Confirm your address to unlock exports and team invites."
            confirmLabel="Resend email"
            dismissLabel="Dismiss"
            onClose={noop}
            onConfirm={noop}
        />
    ),
};
