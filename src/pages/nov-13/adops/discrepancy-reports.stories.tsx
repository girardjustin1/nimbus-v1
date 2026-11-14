import type { Meta, StoryObj } from "@storybook/react-vite";
import { DiscrepancyReports } from "../../../../prototypes/app/v1/screens/adops/discrepancy-reports";

/** AdOps › discrepancy reports — Nov 13 style guide (prototype screens "discrepancy-reports", "discrepancy-reports-report"). */
const meta = {
    title: "November 13th, 2026/AdOps/Discrepancy reports",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds reference/111326 "Screenshot 2026-11-13 at 9.13.48 PM": date row, hero and Using Our Template. */
export const Default: Story = { render: () => <DiscrepancyReports /> };

/** 9.13.48 PM after SEE REPORT: the per-partner report table (no screenshot of this state). */
export const Report: Story = { render: () => <DiscrepancyReports report /> };
