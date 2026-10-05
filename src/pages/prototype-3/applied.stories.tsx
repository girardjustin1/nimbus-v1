import type { Meta, StoryObj } from "@storybook/react-vite";
import { KeywordSetup as KeywordSetupV2, ViewAllKeywords as ViewAllKeywordsV2 } from "../../../prototypes/das/v2/screens/keyword-library-v2";
import { KeywordSetup as KeywordSetupV3, ViewAllKeywords as ViewAllKeywordsV3 } from "../../../prototypes/das/v3/screens/keyword-library-v3";
import { IntegrationGuide as IntegrationGuideV2 } from "../../../prototypes/das/v2/screens/keyword-common";
import { IntegrationGuide as IntegrationGuideV3 } from "../../../prototypes/das/v3/screens/keyword-common";
import { CampaignSetup as CampaignSetupV2 } from "../../../prototypes/das/v2/screens/campaign-setup";
import { CampaignSetup as CampaignSetupV3 } from "../../../prototypes/das/v3/screens/campaign-setup";
import { Compare } from "./note";
import { bySlug } from "./feedback";

/**
 * Prototype 3 · the changes that were decided on the call.
 *
 * These had no competing options, so they are already applied. They are recorded here
 * anyway, because "we removed it" is much easier to reverse when you can still see what
 * was removed. Round 2 is the before in every pair and is untouched.
 */
const meta = {
    title: "Prototype 3/Applied Changes",
    tags: ["!dev"],
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const setup = bySlug("keyword-setup");
const chrome = bySlug("campaign-chrome");
const integration = bySlug("keyword-integration");

/* ------------------------------------------------- Keyword Setup: the note --- */

export const NoteBefore: Story = {
    name: "Note · Round 2, one note for many keywords",
    render: () => (
        <Compare item={setup} kind="Original" title="Two keywords, one Note — which of them is it about?">
            <KeywordSetupV2 filled />
        </Compare>
    ),
};

export const NoteAfter: Story = {
    name: "Note · applied, removed",
    render: () => (
        <Compare item={setup} quote={1} kind="Applied" title="No note. A keyword is the string your app sends.">
            <KeywordSetupV3 filled />
        </Compare>
    ),
};

export const NoteColumnBefore: Story = {
    name: "Note column · Round 2",
    render: () => (
        <Compare item={setup} kind="Original" title="The library carried a Note column">
            <ViewAllKeywordsV2 />
        </Compare>
    ),
};

export const NoteColumnAfter: Story = {
    name: "Note column · applied, and 50 keywords",
    render: () => (
        <Compare item={setup} quote={2} kind="Applied" title="No Note column — and the library is the length a real one is">
            <ViewAllKeywordsV3 />
        </Compare>
    ),
};

/* --------------------------------------------------------- The setup tabs --- */

export const TabsBefore: Story = {
    name: "Setup tabs · Round 2",
    render: () => (
        <Compare item={chrome} kind="Original" title="Campaign Setup | View All Campaigns — the nav already goes there">
            <CampaignSetupV2 preset="empty" />
        </Compare>
    ),
};

export const TabsAfter: Story = {
    name: "Setup tabs · applied, removed",
    render: () => (
        <Compare item={chrome} kind="Applied" title="Setup only">
            <CampaignSetupV3 preset="empty" />
        </Compare>
    ),
};

/* ------------------------------------------------- Integration patterns --- */

export const IntegrationBefore: Story = {
    name: "Integration · Round 2, three patterns",
    render: () => (
        <Compare item={integration} kind="Original" title="Three ways in, presented as equals">
            <div className="p-6">
                <IntegrationGuideV2 />
            </div>
        </Compare>
    ),
};

export const IntegrationAfter: Story = {
    name: "Integration · applied, remote config only",
    render: () => (
        <Compare item={integration} kind="Applied" title="One supported pattern, and the reason">
            <div className="p-6">
                <IntegrationGuideV3 />
            </div>
        </Compare>
    ),
};
