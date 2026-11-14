import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignUpPage } from "./sign-up";

const meta = {
    title: "Design System/Account Login/Sign up",
    component: SignUpPage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof SignUpPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Centered "Sign up" auth card: Nimbus logo, heading, name + email + password
 * inputs (with a password hint), a full-width "Get started" button, a Google
 * social button, and a "Log in" footer link.
 */
export const Default: Story = {};
