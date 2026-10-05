import type { Meta, StoryObj } from "@storybook/react-vite";
import { GEO_REGIONS } from "../../../../prototypes/das/v1/screens/geo-data";
import { TaxonomyPicker, type TaxonomyNode } from "../../../../prototypes/das/v3/screens/taxonomy-picker";
import { Surface, Value } from "./harness";

const tree: TaxonomyNode[] = GEO_REGIONS.map((g) => ({ id: g.region, label: g.region, children: g.countries.map((c) => ({ id: c, label: c })) }));

/**
 * Geo tree picker — a two-level tree: take a whole region or single countries. Type to narrow, ↑ ↓ to move, double-click a region to open or close it, Done to close.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Geo Tree Picker",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing chosen. Click the field to open the tree. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <div className="min-h-[640px] max-w-2xl">
                <Value<string[]> initial={[]}>{(v, set) => <TaxonomyPicker label="Region" nodes={tree} value={v} onChange={set} placeholder="Search countries…" noun="countries" one="country" />}</Value>
            </div>
        </Surface>
    ),
};

/** A whole region plus one country. */
export const WithSelection: Story = {
    name: "With selection",
    render: () => (
        <Surface>
            <div className="min-h-[640px] max-w-2xl">
                <Value<string[]> initial={["United States", "Canada", "France"]}>{(v, set) => <TaxonomyPicker label="Region" nodes={tree} value={v} onChange={set} placeholder="Search countries…" noun="countries" one="country" />}</Value>
            </div>
        </Surface>
    ),
};
