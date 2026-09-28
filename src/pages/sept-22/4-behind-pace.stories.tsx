import type { Meta, StoryObj } from "@storybook/react-vite";
import { items } from "./feedback";
import { BeforeAfter, ReviewPage } from "./review-note";
import { KpiStripAfter, KpiStripBefore } from "./revised/kpi-strip";

/**
 * Sept 22 · 4 — Behind pace becomes a link.
 *
 * The tile names the campaign that is behind but gives you no way to reach it, which is
 * exactly the problem on an account running fifty campaigns.
 */
const meta = {
    title: "Sept 22/4 Behind pace is clickable",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Four inert tiles, then the same four with two of them linked. */
export const BeforeAndAfter: Story = {
    name: "Summary tiles · before and after",
    render: () => (
        <ReviewPage item={items[3]}>
            <BeforeAfter
                stacked
                before={<KpiStripBefore />}
                after={<KpiStripAfter />}
                note="Hover the last two tiles in the revised strip. Live campaigns and Spend this flight stay inert — they describe the whole account, so there is nowhere specific to send anyone."
            />
        </ReviewPage>
    ),
};

/** The revised strip on its own. */
export const Revised: Story = {
    name: "Revised tiles",
    render: () => (
        <div className="min-h-screen bg-secondary p-8">
            <KpiStripAfter />
        </div>
    ),
};
