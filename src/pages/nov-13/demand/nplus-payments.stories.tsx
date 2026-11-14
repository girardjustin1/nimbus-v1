import type { Meta, StoryObj } from "@storybook/react-vite";
import { NplusPayments } from "../../../../prototypes/app/v1/screens/demand/nplus-payments";

/** Demand → n+ payments: Overview and Completed Payments tabs. */
const meta = {
    title: "November 13th, 2026/Demand/n+ Payments",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds "Screenshot 2026-11-13 at 9.12.47 PM" — Overview, a section per month. */
export const Default: Story = { render: () => <NplusPayments /> };

/** Completed Payments with payments made (staging's tab, 9.13.06 PM, filled in). */
export const CompletedPayments: Story = { name: "Completed Payments", render: () => <NplusPayments tab="completed" /> };

/** Rebuilds "Screenshot 2026-11-13 at 9.13.06 PM" — no completed payments yet. */
export const Empty: Story = { render: () => <NplusPayments tab="completed" months={[]} /> };
