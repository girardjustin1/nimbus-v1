import type { Meta, StoryObj } from "@storybook/react-vite";
import { CampaignNameSection } from "../../../../prototypes/das/v3/screens/deal-section";
import { Setup, Surface } from "./harness";

/**
 * Campaign Name — its own section, level with Auction Rules.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Campaign Name",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing entered. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <CampaignNameSection form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** Named. */
export const Filled: Story = {
    name: "Filled",
    render: () => (
        <Surface>
            <Setup preset="ready">{(s) => <CampaignNameSection form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};

/** After Review with no name. */
export const WithError: Story = {
    name: "With error",
    render: () => (
        <Surface>
            <Setup preset="empty" attempted>{(s) => <CampaignNameSection form={s.form} set={s.set} error={s.error} />}</Setup>
        </Surface>
    ),
};
