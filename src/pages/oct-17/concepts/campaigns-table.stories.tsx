import type { Meta, StoryObj } from "@storybook/react-vite";
import { ManageCampaigns } from "../../../../prototypes/das/v4/screens/manage-campaigns";
import { bySlug } from "../feedback";
import { Compare } from "../note";

/**
 * Oct 17 · the campaigns table. Product asked for staging's table exactly. The one open
 * question is whether a table with a health chip above it should say which row is which.
 */
const meta = {
    title: "Oct 17/Concepts/Campaigns Table",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const item = bySlug("campaigns-table");

export const AsStaging: Story = {
    name: "A · Exactly staging's columns",
    render: () => (
        <Compare item={item} quote={1} kind="A" title="What was asked for. Health lives only in the chip; click it to filter">
            <ManageCampaigns />
        </Compare>
    ),
};

export const HealthColumn: Story = {
    name: "B · Plus a Campaign Health column",
    render: () => (
        <Compare item={item} kind="B" title="One extra column after Status, so each row shows its own traffic light. Sorts worst-last or worst-first">
            <ManageCampaigns healthColumn />
        </Compare>
    ),
};
