import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "@/components/base/input/input";
import { Field as FieldV1 } from "../../../../../prototypes/app/v1/screens/das-shell";
import { DateCell as DateCellV1, DateRow as DateRowV1 } from "../../../../../prototypes/app/v1/screens/nimbus-ui";
import { Field as FieldV2 } from "../../../../../prototypes/app/v2/screens/das-shell";
import { DateCell as DateCellV2, DateRow as DateRowV2 } from "../../../../../prototypes/app/v2/screens/nimbus-ui";
import { BeforeAfter, V2Scope } from "./frame";

/**
 * Round 1 · Components · Small upper case labels (R1-04).
 * The start and end date labels in the date row, and a form label. The key metrics tab
 * labels are in Key metrics card; the realtime metric block labels in Realtime metric block.
 */
const meta = {
    title: "Transition/Round 1/Components/Small upper case labels",
    parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const IDS = ["R1-04"];

const V1 = () => (
    <div className="flex flex-col gap-8">
        <div className="border-y border-secondary">
            <DateRowV1>
                <DateCellV1 label="Start date">Nov 01, 2026</DateCellV1>
                <DateCellV1 label="End date">Nov 07, 2026</DateCellV1>
            </DateRowV1>
        </div>
        <div className="max-w-md">
            <FieldV1 label="Campaign Name" required hint="How you'll find this campaign later.">
                <Input aria-label="Campaign Name" size="md" defaultValue="Sample Campaign" />
            </FieldV1>
        </div>
    </div>
);

const V2 = () => (
    <V2Scope>
        <div className="flex flex-col gap-8">
            <div className="border-y border-secondary">
                <DateRowV2>
                    <DateCellV2 label="Start date">Nov 01, 2026</DateCellV2>
                    <DateCellV2 label="End date">Nov 07, 2026</DateCellV2>
                </DateRowV2>
            </div>
            <div className="max-w-md">
                <FieldV2 label="Campaign Name" required hint="How you'll find this campaign later.">
                    <Input aria-label="Campaign Name" size="md" defaultValue="Sample Campaign" />
                </FieldV2>
            </div>
        </div>
    </V2Scope>
);

/** R1-04 in v1: date labels at 15px semibold, form labels at 15px bold. */
export const Before: Story = { render: () => <V1 /> };

/** R1-04 in v2: both take the one small upper case style (12px, weight 800, 0.75px). */
export const After: Story = { render: () => <V2 /> };

/** R1-04: v1 above v2. */
export const SideBySide: Story = {
    name: "Side by side",
    parameters: { layout: "fullscreen" },
    render: () => (
        <BeforeAfter
            ids={IDS}
            note="Tab labels: see Key metrics card. Metric block labels: see Realtime metric block."
            before={<V1 />}
            after={<V2 />}
        />
    ),
};
