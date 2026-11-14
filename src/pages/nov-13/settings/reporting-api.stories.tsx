import type { Meta, StoryObj } from "@storybook/react-vite";
import { ReportingApiSettings } from "../../../../prototypes/app/v1/screens/account/settings";

/** Settings · Reporting API — API key and the accounts' reporting endpoints (fictional, api.example.com). */
const meta = {
    title: "November 13th, 2026/Settings/Reporting API",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds staging "Screenshot 2026-11-13 at 9.15.55 PM" (Settings, Reporting API tab). */
export const Default: Story = { render: () => <ReportingApiSettings /> };

/** After GENERATE API KEY, from staging "Screenshot 2026-11-13 at 9.15.55 PM": the masked key with Copy. */
export const KeyGenerated: Story = { name: "Key generated", render: () => <ReportingApiSettings generated /> };
