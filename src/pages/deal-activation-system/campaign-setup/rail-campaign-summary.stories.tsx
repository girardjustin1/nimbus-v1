import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rail } from "../../../../prototypes/das/v3/screens/campaign-setup";
import { Setup, Surface } from "./harness";

/**
 * Campaign summary — the right rail: the product's five steps, what has been chosen so far, and Review.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Rail/Campaign Summary",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** On arrival. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <div className="w-[300px]">
                <Setup preset="empty">{(s) => <Rail mode="summary" form={s.form} deal={s.deal} issues={s.issues} attempted={false} onPrimary={() => {}} />}</Setup>
            </div>
        </Surface>
    ),
};

/** Five of five. */
export const Filled: Story = {
    name: "Ready to review",
    render: () => (
        <Surface>
            <div className="w-[300px]">
                <Setup preset="ready">{(s) => <Rail mode="summary" form={s.form} deal={s.deal} issues={s.issues} attempted={false} onPrimary={() => {}} />}</Setup>
            </div>
        </Surface>
    ),
};

/** After Review: each problem links to its field. */
export const WithErrors: Story = {
    name: "With errors",
    render: () => (
        <Surface>
            <div className="w-[300px]">
                <Setup preset="errors" attempted>{(s) => <Rail mode="summary" form={s.form} deal={s.deal} issues={s.issues} attempted onPrimary={() => {}} />}</Setup>
            </div>
        </Surface>
    ),
};

/** The other proposal: live validation ending in Publish. */
export const Validation: Story = {
    name: "Validation mode",
    render: () => (
        <Surface>
            <div className="w-[300px]">
                <Setup preset="ready">{(s) => <Rail mode="validation" form={s.form} deal={s.deal} issues={s.issues} attempted={false} onPrimary={() => {}} />}</Setup>
            </div>
        </Surface>
    ),
};
