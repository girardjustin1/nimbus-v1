import type { Meta, StoryObj } from "@storybook/react-vite";
import { items } from "./feedback";
import { BeforeAfter, ReviewPage } from "./review-note";
import { RevenueByDayAfter, RevenueByDayBefore } from "./revised/revenue-by-day";

/**
 * Sept 22 · 3 — Revenue by day stacks by campaign.
 *
 * The chart showed DAS as one block while the table underneath listed the campaigns
 * inside it, so the two could not be read against each other.
 */
const meta = {
    title: "Sept 22/3 Stacked revenue chart",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** One teal block, then the same block split per campaign. */
export const BeforeAndAfter: Story = {
    name: "Revenue by day · before and after",
    render: () => (
        <ReviewPage item={items[2]}>
            <BeforeAfter
                stacked
                before={<RevenueByDayBefore />}
                after={<RevenueByDayAfter />}
                note="Switch the revised chart to “Share of total” to put Open Marketplace back on top. Either way the daily totals are unchanged, so the DAS revenue and share-of-total tiles still read $35,250 and 14%."
            />
        </ReviewPage>
    ),
};

/** The revised chart on its own, scaled to DAS so the campaigns are legible. */
export const Revised: Story = {
    name: "Revised chart · DAS campaigns",
    render: () => (
        <div className="min-h-screen bg-secondary p-8">
            <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary">
                <RevenueByDayAfter />
            </div>
        </div>
    ),
};

/** Why the toggle exists: at full scale the campaign segments are a few pixels tall. */
export const ShareOfTotal: Story = {
    name: "Revised chart · Share of total",
    render: () => (
        <div className="min-h-screen bg-secondary p-8">
            <div className="rounded-2xl bg-primary p-5 ring-1 ring-secondary">
                <RevenueByDayAfter view="share" />
            </div>
        </div>
    ),
};
