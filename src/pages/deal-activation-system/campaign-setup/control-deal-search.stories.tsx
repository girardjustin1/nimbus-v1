import type { Meta, StoryObj } from "@storybook/react-vite";
import { SingleSearchSelect } from "../../../../prototypes/das/v3/screens/search-select";
import { deals } from "../../../../prototypes/das/v3/screens/deal-data";
import { Surface, Value } from "./harness";

const rows = deals.map((d) => ({ id: d.id, label: d.label, meta: d.supportingText }));

/**
 * Deal search — pick exactly one from a library (Add to existing deal). Shows what you chose rather than what you typed.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Deal Search",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing chosen. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <div className="max-w-xl">
                <Value<string | undefined> initial={undefined}>{(v, set) => <SingleSearchSelect label="Existing deal" placeholder="Search your deals" noun="deals" rows={rows} value={v} onChange={set} />}</Value>
            </div>
        </Surface>
    ),
};

/** A deal chosen. */
export const Chosen: Story = {
    name: "Chosen",
    render: () => (
        <Surface>
            <div className="max-w-xl">
                <Value<string | undefined> initial={rows[0].id}>{(v, set) => <SingleSearchSelect label="Existing deal" placeholder="Search your deals" noun="deals" rows={rows} value={v} onChange={set} />}</Value>
            </div>
        </Surface>
    ),
};

/** After Review with no deal. */
export const WithError: Story = {
    name: "With error",
    render: () => (
        <Surface>
            <div className="max-w-xl">
                <SingleSearchSelect label="Existing deal" placeholder="Search your deals" noun="deals" rows={rows} onChange={() => {}} isInvalid hint="Choose a deal" />
            </div>
        </Surface>
    ),
};
