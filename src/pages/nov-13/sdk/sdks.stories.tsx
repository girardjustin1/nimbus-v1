import type { Meta, StoryObj } from "@storybook/react-vite";
import { SdksPage } from "../../../../prototypes/app/v1/screens/account/sdks";

/** SDK & Docs · SDKs — the Nimbus SDKs page, rebuilt on the Nov 13 style guide. */
const meta = {
    title: "Prototypes/Full application/SDK & Docs/SDKs",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds staging "Screenshot 2026-11-13 at 9.14.56 PM" (Nimbus SDKs). */
export const Default: Story = { render: () => <SdksPage /> };
