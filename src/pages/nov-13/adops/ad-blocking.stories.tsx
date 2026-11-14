import type { Meta, StoryObj } from "@storybook/react-vite";
import { AdBlocking } from "../../../../prototypes/app/v1/screens/adops/ad-blocking";

/** AdOps › ad blocking — Nov 13 style guide (prototype screens "ad-blocking", "ad-blocking-empty"). */
const meta = {
    title: "November 13th, 2026/AdOps/Ad blocking",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds reference/111326 "Screenshot 2026-11-13 at 9.13.16 PM" and "9.13.22 PM", with a few fictional blocked entries. */
export const Default: Story = { render: () => <AdBlocking /> };

/** Rebuilds 9.13.16 / 9.13.22 PM as staging shows it: every block list at zero. */
export const Empty: Story = { render: () => <AdBlocking empty /> };
