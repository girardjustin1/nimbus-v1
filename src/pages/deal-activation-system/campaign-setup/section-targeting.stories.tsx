import type { Meta, StoryObj } from "@storybook/react-vite";
import { TargetingSectionV3 } from "../../../../prototypes/das/v3/screens/targeting-section";
import { Setup, Surface } from "./harness";

/**
 * Targeting — Geos, Platform, Apps, Ad Unit and Keywords as five cards at the same level. Each card is itemised under Targeting.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Targeting",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing targeted — the campaign runs everywhere. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <TargetingSectionV3 form={s.form} set={s.set} empty />}</Setup>
        </Surface>
    ),
};

/** A target in every card. */
export const Filled: Story = {
    name: "Filled",
    render: () => (
        <Surface>
            <Setup preset="ready">{(s) => <TargetingSectionV3 form={s.form} set={s.set} empty={false} />}</Setup>
        </Surface>
    ),
};
