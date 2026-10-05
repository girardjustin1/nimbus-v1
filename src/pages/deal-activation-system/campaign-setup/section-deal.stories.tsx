import type { Meta, StoryObj } from "@storybook/react-vite";
import { DealSectionV3 } from "../../../../prototypes/das/v3/screens/deal-section";
import { Setup, Surface } from "./harness";

/**
 * Deal — generate an ID, create one, or add to an existing deal. Each row asks only for what that choice needs.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Deal",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default for a new deal: name it, Nimbus assigns the ID. */
export const GenerateNewId: Story = {
    name: "Generate new ID",
    render: () => (
        <Surface>
            <Setup preset="empty" deal={{ mode: "generate" }}>{(s) => <DealSectionV3 form={s.form} set={s.set} error={s.error} deal={s.deal} setDeal={s.setDeal} />}</Setup>
        </Surface>
    ),
};

/** Name and ID both supplied. */
export const CreateNewId: Story = {
    name: "Create new ID",
    render: () => (
        <Surface>
            <Setup preset="empty" deal={{ mode: "create" }}>{(s) => <DealSectionV3 form={s.form} set={s.set} error={s.error} deal={s.deal} setDeal={s.setDeal} />}</Setup>
        </Surface>
    ),
};

/** An existing deal chosen; its name and ID show read-only. */
export const AddToExisting: Story = {
    name: "Add to existing",
    render: () => (
        <Surface>
            <Setup preset="ready">{(s) => <DealSectionV3 form={s.form} set={s.set} error={s.error} deal={s.deal} setDeal={s.setDeal} />}</Setup>
        </Surface>
    ),
};

/** After Review with nothing entered. */
export const WithErrors: Story = {
    name: "With errors",
    render: () => (
        <Surface>
            <Setup preset="empty" deal={{ mode: "create" }} attempted>{(s) => <DealSectionV3 form={s.form} set={s.set} error={s.error} deal={s.deal} setDeal={s.setDeal} />}</Setup>
        </Surface>
    ),
};
