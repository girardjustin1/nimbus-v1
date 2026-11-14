import type { Meta, StoryObj } from "@storybook/react-vite";
import { SignInSettings } from "../../../../prototypes/app/v1/screens/account/settings";

/** Settings · Sign In — name, email and Account Security, rebuilt on the Nov 13 style guide. */
const meta = {
    title: "Prototypes/Full application/Settings/Sign In",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds staging "Screenshot 2026-11-13 at 9.15.46 PM" (Settings, Sign In tab). */
export const Default: Story = { render: () => <SignInSettings /> };

/** CHANGE PASSWORD opened, from staging "Screenshot 2026-11-13 at 9.15.46 PM". */
export const ChangePassword: Story = { name: "Change password", render: () => <SignInSettings modal="password" /> };

/** TWO-FACTOR AUTHENTICATION opened, from staging "Screenshot 2026-11-13 at 9.15.46 PM". */
export const TwoFactor: Story = { name: "Two-factor authentication", render: () => <SignInSettings modal="two-factor" /> };
