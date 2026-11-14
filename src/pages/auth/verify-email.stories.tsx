import type { Meta, StoryObj } from "@storybook/react-vite";
import { VerifyEmailPage } from "./verify-email";

const meta = {
    title: "Design System/Account Login/Verify Email",
    component: VerifyEmailPage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof VerifyEmailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Centered "Check your email" verification card: mail FeaturedIcon, heading,
 * supporting text, a 4-digit PIN code input, a full-width "Verify email"
 * button, a "Resend" action, and a "Back to log in" link.
 */
export const Default: Story = {};
