import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity } from "../../../../prototypes/app/v1/screens/adops/activity";

/** AdOps › activity — Nov 13 style guide (prototype screens "activity", "activity-empty"). */
const meta = {
    title: "Prototypes/Full application/AdOps/Activity",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds reference/111326 "Screenshot 2026-11-13 at 9.14.44 PM" with a fictional week of activity. */
export const Default: Story = { render: () => <Activity /> };

/** Rebuilds 9.14.44 PM as staging shows it: "No data to display in this date range." */
export const Empty: Story = { render: () => <Activity empty /> };
