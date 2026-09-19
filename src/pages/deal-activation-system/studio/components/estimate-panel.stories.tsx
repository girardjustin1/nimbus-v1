import type { Meta, StoryObj } from "@storybook/react-vite";
import { estimate, studioPresets } from "../studio-data";
import { EstimatePanel, LikelihoodMeter } from "./estimate-panel";

/** Studio · Estimate panel — delivery likelihood plus impressions, reach, eCPM and spend by period. */
const meta = {
    title: "Deal Activation System/Studio Concept/Components/Estimate Panel",
    component: EstimatePanel,
    args: { estimate: estimate(studioPresets.sample) },
    decorators: [(Story) => <div className="w-80">{Story()}</div>],
} satisfies Meta<typeof EstimatePanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const HighLikelihood: Story = {};
export const LowBid: Story = { args: { estimate: estimate(studioPresets.lowBid) } };
export const NarrowAudience: Story = { args: { estimate: estimate(studioPresets.narrow) } };
export const Fallback: Story = { args: { estimate: estimate(studioPresets.fallback), fallback: true } };
export const NoBudgetYet: Story = { args: { estimate: estimate(studioPresets.empty), empty: true } };
export const Meter: Story = {
    render: () => (
        <div className="flex flex-col gap-2">
            <LikelihoodMeter value="High" />
            <LikelihoodMeter value="Medium" />
            <LikelihoodMeter value="Low" />
        </div>
    ),
};
