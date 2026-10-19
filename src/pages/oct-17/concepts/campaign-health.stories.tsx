import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManageCampaigns } from "../../../../prototypes/das/v4/screens/manage-campaigns";
import { bySlug } from "../feedback";
import { Compare } from "../note";

/**
 * Oct 17 · Campaign Health. Decided 19 Oct: A, counts by colour. B and C stay here as
 * the record of what was compared.
 *
 * Three ways to show the traffic light in the fourth chip.
 * Same data and the same click in all three: it filters the table to the campaigns
 * behind or at risk. Click a chip to try it.
 */
const meta = {
    title: "Oct 17/Concepts/Campaign Health",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const item = bySlug("campaign-health");

export const Counts: Story = {
    name: "A · Counts by colour — chosen",
    render: () => (
        <Compare item={item} kind="Chosen" title="A · Three dots and three numbers — chosen on 19 Oct">
            <ManageCampaigns health="counts" />
        </Compare>
    ),
};

export const Bar: Story = {
    name: "B · One segmented bar",
    render: () => (
        <Compare item={item} kind="B" title="“2 of 4 on pace” over a bar in the three colours. Reads as a share of the account">
            <ManageCampaigns health="bar" />
        </Compare>
    ),
};

export const ToDo: Story = {
    name: "C · What needs attention",
    render: () => (
        <Compare item={item} quote={1} kind="C" title="Leads with how many need attention, then names them. Turns green when nothing does">
            <ManageCampaigns health="attention" />
        </Compare>
    ),
};

export const Filtered: Story = {
    name: "D · Clicked",
    render: () => (
        <Compare item={item} kind="Chosen" title="Clicking Campaign Health filters the table to the campaigns behind or at risk">
            <ManageCampaigns filter="attention" />
        </Compare>
    ),
};
