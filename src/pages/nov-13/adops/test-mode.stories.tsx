import type { Meta, StoryObj } from "@storybook/react-vite";
import { TestMode } from "../../../../prototypes/app/v1/screens/adops/test-mode";

/** AdOps › manage test mode — Nov 13 style guide (prototype screens "test-mode", "test-mode-empty"). */
const meta = {
    title: "November 13th, 2026/AdOps/Manage test mode",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds reference/111326 "Screenshot 2026-11-13 at 9.13.32 PM" with two fictional overrides. */
export const Default: Story = { render: () => <TestMode /> };

/** Rebuilds 9.13.32 PM as staging shows it: no active overrides. */
export const Empty: Story = { render: () => <TestMode empty /> };
