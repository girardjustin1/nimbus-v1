import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineSearchSelect } from "../../../../prototypes/das/v3/screens/search-select";
import { APP_LIST } from "../../../../prototypes/das/v3/screens/target-data";
import { Surface, Value } from "./harness";

const rows = APP_LIST.map((a) => ({ id: a.id, label: a.name, meta: a.platform }));

/**
 * Library search — the search-on-the-page shape Apps, Keywords and Creative share. The library line sits above; results open under the field with a Done button.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Controls/Library Search",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Click or press ↓ to see the whole library. */
export const Default: Story = {
    name: "Default",
    render: () => (
        <Surface>
            <div className="min-h-[560px] max-w-2xl">
                <Value<string[]> initial={[]}>
                    {(ids, set) => <InlineSearchSelect label="Search apps" placeholder="Search your apps" rows={rows} chosenIds={ids} onPick={(r) => set([...ids, r.id])} noun="apps" />}
                </Value>
            </div>
        </Surface>
    ),
};

/** When the library can grow from here (Keywords, Creative). */
export const WithCreate: Story = {
    name: "With create action",
    render: () => (
        <Surface>
            <div className="min-h-[560px] max-w-2xl">
                <Value<string[]> initial={[]}>
                    {(ids, set) => (
                        <InlineSearchSelect label="Search keywords" placeholder="Search your keyword library" rows={rows} chosenIds={ids} onPick={(r) => set([...ids, r.id])} noun="keywords" createLabel="Add keyword" onCreate={() => {}} />
                    )}
                </Value>
            </div>
        </Surface>
    ),
};
