import type { Meta, StoryObj } from "@storybook/react-vite";
import { ForgotPasswordPage } from "./forgot-password";

const meta = {
    title: "Design System/Account Login/Forgot Password",
    component: ForgotPasswordPage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof ForgotPasswordPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Centered "Forgot password?" card: key FeaturedIcon, heading, supporting text,
 * an email input, a full-width "Reset password" button, and a "Back to log in"
 * link.
 */
export const Default: Story = {};
