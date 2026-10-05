import type { Meta, StoryObj } from "@storybook/react-vite";
import { CreativeSection } from "../../../../prototypes/das/v3/screens/campaign-setup";
import { Setup, Surface } from "./harness";

/**
 * Creative — search the asset library on the page; chosen creatives land in a table.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Sections/Creative",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** No creatives. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <Setup preset="empty">{(s) => <CreativeSection form={s.form} set={s.set} />}</Setup>
        </Surface>
    ),
};

/** Two HTML creatives. */
export const Chosen: Story = {
    name: "Chosen",
    render: () => (
        <Surface>
            <Setup preset="ready">{(s) => <CreativeSection form={s.form} set={s.set} />}</Setup>
        </Surface>
    ),
};

/** HTML and VAST together, which a campaign can't hold. */
export const Mixed: Story = {
    name: "Mixed types",
    render: () => (
        <Surface>
            <Setup preset="mixedCreative" attempted>{(s) => <CreativeSection form={s.form} set={s.set} />}</Setup>
        </Surface>
    ),
};
