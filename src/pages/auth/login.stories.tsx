import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoginPage } from "./login";

const meta = {
    title: "Design System/Account Login/Log in",
    component: LoginPage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Centered "Log in" auth card: Nimbus logo, heading, email + password inputs,
 * a "Remember me" checkbox with a "Forgot password" link, a full-width primary
 * "Sign in" button, a Google social button, and a "Sign up" footer link.
 */
export const Default: Story = {};
