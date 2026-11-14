import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "@/components/base/avatar/avatar";

/**
 * Foundations → Avatars
 * Author avatars used in blog cards and post bylines.
 */
const meta = {
    title: "Design System/Base Components/Avatars",
    component: Avatar,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    args: { size: "md", initials: "NB", alt: "Nimbus" },
    argTypes: {
        size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl", "2xl"] },
        status: { control: "inline-radio", options: [undefined, "online", "offline"] },
    },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SIZES = ["xs", "sm", "md", "lg", "xl", "2xl"] as const;

export const Default: Story = {};

/** All sizes, initials fallback. */
export const Sizes: Story = {
    render: () => (
        <div className="flex items-end gap-4">
            {SIZES.map((size) => (
                <Avatar key={size} size={size} initials="NB" alt="Nimbus" />
            ))}
        </div>
    ),
};

/** With a status indicator (used for online authors). */
export const WithStatus: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Avatar size="lg" initials="JG" alt="Justin" status="online" />
            <Avatar size="lg" initials="AB" alt="Author" status="offline" />
        </div>
    ),
};
