import type { Meta, StoryObj } from "@storybook/react-vite";
import { FullPerformance } from "../../../../prototypes/das/v4/screens/full-performance";
import { bySlug } from "../feedback";
import { Compare } from "../note";

/**
 * Oct 17 · where Full performance's controls sit. Same controls, same output.
 */
const meta = {
    title: "Oct 17/Concepts/Full Performance Layout",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const item = bySlug("full-performance");

export const OnTop: Story = {
    name: "A · Builder across the top",
    render: () => (
        <Compare item={item} quote={1} kind="A" title="Performance Insights' arrangement: labelled rows above the chart. Familiar; pushes the chart below the fold">
            <FullPerformance layout="top" breakdown={["Creative", "Platform"]} />
        </Compare>
    ),
};

export const OnTheLeft: Story = {
    name: "B · Builder down the left",
    render: () => (
        <Compare item={item} quote={1} kind="B" title="A panel beside the chart. Change a control and watch the chart move; narrower chart">
            <FullPerformance layout="side" breakdown={["Creative", "Platform"]} />
        </Compare>
    ),
};
