import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActiveFloors, ConfigureFloors } from "../../../../prototypes/app/v1/screens/adops/floors";

/** AdOps › floors — Nov 13 style guide (prototype screens "floors", "floors-empty", "floors-configure"). */
const meta = {
    title: "November 13th, 2026/AdOps/Floors",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds reference/111326 "Screenshot 2026-11-13 at 9.13.27 PM" (Active Floors) with default and custom floors set. */
export const Default: Story = { render: () => <ActiveFloors /> };

/** Rebuilds 9.13.27 PM as staging shows it: NOT SET tiles, no custom floors. */
export const Empty: Story = { render: () => <ActiveFloors empty /> };

/** Configure Floors tab — no screenshot; built from the 13 Nov call (Default Floors, New Custom Floor). */
export const Configure: Story = { name: "Configure Floors", render: () => <ConfigureFloors /> };
