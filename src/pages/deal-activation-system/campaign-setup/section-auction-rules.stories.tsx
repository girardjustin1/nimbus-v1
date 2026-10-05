import type { Meta, StoryObj } from "@storybook/react-vite";
import { RulesSectionV3 } from "../../../../prototypes/das/v3/screens/rules-section";
import { Setup, Surface } from "./harness";

/**
 * Auction Rules — four rule cards, two across. The whole card is the target.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Auction Rules",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** No rule chosen. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <RulesSectionV3 form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** CPM Priority chosen. */
export const Selected: Story = {
    name: "Selected",
    render: () => (
        <Surface>
            <Setup preset="ready">{(s) => <RulesSectionV3 form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** After Review with no rule. */
export const WithError: Story = {
    name: "With error",
    render: () => (
        <Surface>
            <Setup preset="empty" attempted>{(s) => <RulesSectionV3 form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};
