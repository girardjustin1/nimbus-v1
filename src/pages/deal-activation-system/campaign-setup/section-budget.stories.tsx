import type { Meta, StoryObj } from "@storybook/react-vite";
import { BudgetSectionV3 } from "../../../../prototypes/das/v3/screens/budget-section";
import { Setup, Surface } from "./harness";

/**
 * Budget — Budget and Bid Amount (eCPM), each with its instruction under the label.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Budget",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing entered. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <BudgetSectionV3 form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** Both set. */
export const Filled: Story = {
    name: "Filled",
    render: () => (
        <Surface>
            <Setup preset="ready">{(s) => <BudgetSectionV3 form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** After Review with both blank. */
export const WithErrors: Story = {
    name: "With errors",
    render: () => (
        <Surface>
            <Setup preset="empty" attempted>{(s) => <BudgetSectionV3 form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** Fallback campaigns have no budget or eCPM. */
export const Fallback: Story = {
    name: "Fallback rule",
    render: () => (
        <Surface>
            <Setup preset="fallback">{(s) => <BudgetSectionV3 form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};
