import type { CSSProperties } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MessageChatCircle } from "@untitledui/icons";
import { AvatarNotification, IconNotification, ImageNotification } from "@/components/application/notifications/notifications";

/**
 * Application UI → Notifications
 *
 * Nimbus-themed toast notifications. These render with the Nimbus theme out of
 * the box — supply a title/content, an optional confirm action, and an
 * `onClose` handler for the dismiss button.
 *
 * Three layouts are exported:
 * - `IconNotification` — featured icon, optional colored variant and progress bar.
 * - `AvatarNotification` — sender avatar with name, timestamp, and message.
 * - `ImageNotification` — thumbnail-led notification for richer promos.
 *
 * Each toast reads `--width` from its container to size itself on wider screens.
 */

const meta = {
    title: "Design System/Application UI/Notifications",
    component: IconNotification,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-md" style={{ "--width": "400px" } as CSSProperties}>
                <Story />
            </div>
        ),
    ],
} satisfies Meta<typeof IconNotification>;

export default meta;

type Story = StoryObj<typeof IconNotification>;

const noop = () => {};

/** Default icon notification with a brand-colored featured icon and two actions. */
export const Default: Story = {
    args: {
        color: "brand",
        title: "New feature available",
        description: "Real-time collaboration is now live across all Nimbus workspaces.",
        confirmLabel: "Try it out",
        dismissLabel: "Dismiss",
        onClose: noop,
        onConfirm: noop,
    },
};

/** Success variant confirming a completed task. */
export const Success: Story = {
    args: {
        color: "success",
        title: "Export complete",
        description: "Your report has finished exporting and is ready to download.",
        confirmLabel: "Download",
        dismissLabel: "Dismiss",
        onClose: noop,
        onConfirm: noop,
    },
};

/** Icon notification with an in-progress upload bar. */
export const WithProgress: Story = {
    args: {
        color: "brand",
        title: "Uploading assets",
        description: "Hang tight while we finish uploading your files to the workspace.",
        progress: 60,
        hideDismissLabel: true,
        confirmLabel: "Cancel",
        onClose: noop,
        onConfirm: noop,
    },
};

/** Avatar notification for a message or mention from a teammate. */
export const WithAvatar: StoryObj<typeof AvatarNotification> = {
    render: () => (
        <AvatarNotification
            name="Phoenix Baker"
            date="2 min ago"
            content="Mentioned you in the “Q3 launch plan” doc — can you review the timeline?"
            avatar="https://www.untitledui.com/images/avatars/phoenix-baker?fm=webp&q=80"
            confirmLabel="Reply"
            dismissLabel="Dismiss"
            onClose={noop}
            onConfirm={noop}
        />
    ),
};

/** Image-led notification, useful for announcements and promos. */
export const WithImage: StoryObj<typeof ImageNotification> = {
    decorators: [
        (Story) => (
            <div className="mx-auto max-w-lg" style={{ "--width": "496px" } as CSSProperties}>
                <Story />
            </div>
        ),
    ],
    render: () => (
        <ImageNotification
            title="Introducing the Nimbus dashboard"
            description="A cleaner home for your metrics, activity, and shortcuts."
            imageMobile="https://www.untitledui.com/images/placeholders/portrait?fm=webp&q=80"
            imageDesktop="https://www.untitledui.com/images/placeholders/landscape?fm=webp&q=80"
            confirmLabel="Take a tour"
            dismissLabel="Dismiss"
            onClose={noop}
            onConfirm={noop}
        />
    ),
};

/** Icon notification using a custom icon instead of the color's default. */
export const CustomIcon: Story = {
    args: {
        color: "gray",
        icon: MessageChatCircle,
        title: "You have a new comment",
        description: "Marc replied to your thread in the design review channel.",
        confirmLabel: "View comment",
        dismissLabel: "Dismiss",
        onClose: noop,
        onConfirm: noop,
    },
};
