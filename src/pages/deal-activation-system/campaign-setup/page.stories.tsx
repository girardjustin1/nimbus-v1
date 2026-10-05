import type { Meta, StoryObj } from "@storybook/react-vite";
import { CampaignSetup } from "../../../../prototypes/das/v3/screens/campaign-setup";
import { NoFill } from "./harness";

/**
 * The whole setup page — prototype 3, #/setup-empty and its states. Everything below this entry is a piece of it.
 */
const meta = {
    title: "Deal Activation System/Campaign Setup/Page",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nothing filled in — what the page looks like on arrival. */
export const Empty: Story = {
    name: "Empty",
    render: () => (
        <NoFill>
            <CampaignSetup preset="empty" />
        </NoFill>
    ),
};

/** Every section filled; the rail is complete and Review is live. */
export const ReadyToReview: Story = {
    name: "Ready to review",
    render: () => (
        <NoFill>
            <CampaignSetup preset="ready" />
        </NoFill>
    ),
};

/** Review pressed on a campaign that doesn't pass: the banner, the rail and each field say what's wrong. */
export const WithErrors: Story = {
    name: "With errors",
    render: () => (
        <NoFill>
            <CampaignSetup preset="errors" attempted />
        </NoFill>
    ),
};

/** The Review modal over a clean campaign: Publish and Publish & Duplicate. */
export const ReviewOpen: Story = {
    name: "Review open",
    render: () => (
        <NoFill>
            <CampaignSetup preset="ready" reviewed />
        </NoFill>
    ),
};

/** The other rail proposal: live validation, ending in Publish. */
export const ValidationRail: Story = {
    name: "Validation rail",
    render: () => (
        <NoFill>
            <CampaignSetup preset="ready" rail="validation" />
        </NoFill>
    ),
};
