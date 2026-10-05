import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChosenTable } from "../../../../prototypes/das/v3/screens/search-select";
import { Surface, Value } from "./harness";

const ROWS = [
    { id: "a", cells: ["Aurora Alarm", "iOS", "com.testpublisher.auroraalarm"] },
    { id: "b", cells: ["Aurora Alarm", "Android", "com.testpublisher.auroraalarm"] },
];

/**
 * Chosen table — where picks land, instead of chips. A column can say which of two same-named apps you mean.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Chosen Table",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two rows, each removable. */
export const WithRows: Story = {
    name: "With rows",
    render: () => (
        <Surface>
            <Value initial={ROWS}>{(rows, set) => <ChosenTable columns={["App", "Platform", "Bundle ID"]} rows={rows} onRemove={(id) => set(rows.filter((r) => r.id !== id))} empty="No apps yet." />}</Value>
        </Surface>
    ),
};

/** Says what empty means. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <Surface>
            <ChosenTable columns={["App", "Platform", "Bundle ID"]} rows={[]} onRemove={() => {}} empty="No apps yet — the campaign runs on all of them. Search above to narrow it." />
        </Surface>
    ),
};
