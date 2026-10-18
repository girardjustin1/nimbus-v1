import type { Meta, StoryObj } from "@storybook/react-vite";
import { ViewOnePage } from "../../../../prototypes/das/v4/screens/campaign-view";
import { bySlug } from "../feedback";
import { Compare } from "../note";

/**
 * Oct 17 · the summary on a campaign's overview. Product: pick one, not both.
 */
const meta = {
    title: "Oct 17/Concepts/Overview Summary",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const item = bySlug("overview-summary");

export const Sidebar: Story = {
    name: "A · Sidebar",
    render: () => (
        <Compare item={item} kind="A" title="Round 3's Live delivery rail, now with Campaign Health. Stays in view as you scroll the settings">
            <ViewOnePage summary="sidebar" />
        </Compare>
    ),
};

export const Cards: Story = {
    name: "B · Cards (the prototype's default)",
    render: () => (
        <Compare item={item} kind="B" title="Four cards above the chart. The chart gets the full width, and the cards match Manage campaigns">
            <ViewOnePage summary="cards" />
        </Compare>
    ),
};

export const CardsAtRisk: Story = {
    name: "C · Cards, on a campaign at risk",
    render: () => (
        <Compare item={item} kind="B" title="The same cards when the campaign can't catch up: red health, and a banner with the daily spend it would need">
            <ViewOnePage id="c2" summary="cards" />
        </Compare>
    ),
};
