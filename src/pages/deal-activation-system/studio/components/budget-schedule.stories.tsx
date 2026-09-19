import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type BudgetScheduleValue, BudgetSchedule } from "./budget-schedule";

/** Studio · Budget & schedule — daily or lifetime budget, calendar pickers, optional end date. */
const meta = { title: "Deal Activation System/Studio Concept/Components/Budget & Schedule" } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const Demo = ({ initial, errors, hideBudget, openCalendar }: { initial: BudgetScheduleValue; errors?: Record<string, string>; hideBudget?: boolean; openCalendar?: "start" | "end" }) => {
    const [v, setV] = useState(initial);
    return <BudgetSchedule value={v} onChange={(p) => setV((x) => ({ ...x, ...p }))} days={31} errors={errors} hideBudget={hideBudget} openCalendar={openCalendar} />;
};
const filled: BudgetScheduleValue = { budgetType: "lifetime", budget: 25000, start: "2026-10-01", end: "2026-10-31", hasEnd: true };

export const Lifetime: Story = { render: () => <Demo initial={filled} /> };
export const Daily: Story = { render: () => <Demo initial={{ ...filled, budgetType: "daily", budget: 800 }} /> };
export const NoEndDate: Story = { render: () => <Demo initial={{ ...filled, hasEnd: false }} /> };
export const Empty: Story = { render: () => <Demo initial={{ budgetType: "lifetime", hasEnd: true }} /> };
export const Errors: Story = { render: () => <Demo initial={{ budgetType: "lifetime", hasEnd: true }} errors={{ budget: "Set a budget", start: "Pick a start date", end: "Pick an end date" }} /> };
export const Fallback: Story = { render: () => <Demo initial={filled} hideBudget /> };
