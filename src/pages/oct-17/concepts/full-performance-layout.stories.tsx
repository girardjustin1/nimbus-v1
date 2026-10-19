import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullPerformance } from "../../../../prototypes/das/v4/screens/full-performance";
import { bySlug } from "../feedback";
import { Compare } from "../note";

/**
 * Oct 17 · where Full performance's controls sit. Decided 19 Oct: across the top, in
 * Performance Insights' look. The panel-on-the-left option was dropped.
 */
const meta = {
    title: "Oct 17/Concepts/Full Performance Layout",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const item = bySlug("full-performance");

export const Decided: Story = {
    name: "Chosen · Across the top, like Performance Insights",
    render: () => (
        <Compare item={item} quote={3} kind="Chosen" title="Date row, then Metrics, Breakdown, Filters (+ ADD) and Chart Type — Performance Insights' layout and styling">
            <FullPerformance breakdown={["Creative", "Platform"]} />
        </Compare>
    ),
};

export const StackedBar: Story = {
    name: "Chosen · Another chart type",
    render: () => (
        <Compare item={item} quote={3} kind="Chosen" title="The same builder with another chart type: spend stacked by creative">
            <FullPerformance breakdown={["Creative"]} metrics={["Spend"]} chart="stacked" />
        </Compare>
    ),
};
