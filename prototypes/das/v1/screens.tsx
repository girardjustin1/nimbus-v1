import type { ProtoScreen } from "../../shared/prototype-frame";
import { CampaignSetupOnePage } from "./screens/campaign-setup-one-page";
import { ViewDeliveryFirst, ViewOnePage, ViewPerformance, ViewSentence } from "./screens/campaign-view";
import { KeywordLibrary } from "./screens/keyword-library";
import { AudienceSentence, KeywordTargetingInline, KeywordTargetingLibrary } from "./screens/keyword-targeting";
import { CompareCampaigns, ManageCampaignsDelivery } from "./screens/manage-campaigns";
import { DasOverview, QueryBuilder } from "./screens/reporting";

/**
 * DAS prototype v1 — screen registry (frozen copy of the Round 1 concepts).
 * Order here is the order of the toolbar's previous/next arrows.
 */
export const screens: ProtoScreen[] = [
    {
        id: "setup-ready",
        area: "Campaign Setup (One Page)",
        title: "Ready to publish",
        description: "Five sections, calendar pickers for the flight, live summary rail. Publish goes live.",
        render: () => <CampaignSetupOnePage />,
    },
    {
        id: "setup-empty",
        area: "Campaign Setup (One Page)",
        title: "Empty form",
        description: "Nothing filled in: “On this page” and the summary rail in their empty states.",
        render: () => <CampaignSetupOnePage preset="empty" />,
    },
    {
        id: "setup-empty-errors",
        area: "Campaign Setup (One Page)",
        title: "Empty form, Publish pressed",
        description: "Every required field flagged; banner links to each.",
        render: () => <CampaignSetupOnePage preset="empty" attempted />,
    },
    {
        id: "setup-calendar",
        area: "Campaign Setup (One Page)",
        title: "Flight calendar open",
        description: "Start-date picker open; past dates can't be picked.",
        render: () => <CampaignSetupOnePage calendarOpen="start" />,
    },
    {
        id: "setup-dates-invalid",
        area: "Campaign Setup (One Page)",
        title: "Invalid flight dates",
        description: "Start in the past and end before start, after Publish.",
        render: () => <CampaignSetupOnePage preset="datesInvalid" attempted />,
    },
    {
        id: "setup-errors",
        area: "Campaign Setup (One Page)",
        title: "With errors",
        description: "Missing budget and mixed creatives, after Publish.",
        render: () => <CampaignSetupOnePage preset="errors" attempted />,
    },
    {
        id: "setup-fallback",
        area: "Campaign Setup (One Page)",
        title: "Fallback rule",
        description: "Budget and eCPM hide. End date and creative still missing: press Publish.",
        render: () => <CampaignSetupOnePage preset="fallback" />,
    },
    {
        id: "setup-fallback-errors",
        area: "Campaign Setup (One Page)",
        title: "Fallback rule, Publish pressed",
        description: "Missing end date and creative flagged in place and in the rail.",
        render: () => <CampaignSetupOnePage preset="fallback" attempted />,
    },
    {
        id: "setup-published",
        area: "Campaign Setup (One Page)",
        title: "Published",
        description: "Lands on View campaign with a confirmation.",
        render: () => <ViewOnePage id="new" published />,
    },

    {
        id: "targeting-chips",
        area: "Targeting",
        title: "A · Inline keyword chips",
        description: "Type keywords; ANY/ALL match; ad unit type and device language.",
        render: () => <KeywordTargetingInline />,
    },
    {
        id: "targeting-warnings",
        area: "Targeting",
        title: "A · ALL match + warnings",
        description: "Keywords not seen in traffic, or new to the library.",
        render: () => <KeywordTargetingInline match="ALL" initial={["over21", "77541", "tailgate"]} />,
    },
    {
        id: "targeting-library",
        area: "Targeting",
        title: "B · Pick from library",
        description: "Choose saved keywords with usage and traffic signals.",
        render: () => <KeywordTargetingLibrary />,
    },
    {
        id: "targeting-sentence",
        area: "Targeting",
        title: "C · Audience sentence",
        description: "The whole target as one editable sentence.",
        render: () => <AudienceSentence />,
    },

    {
        id: "library",
        area: "Keyword Library",
        title: "Default",
        description: "Keywords with campaign usage and traffic status.",
        render: () => <KeywordLibrary />,
    },
    {
        id: "library-add",
        area: "Keyword Library",
        title: "Add keywords",
        description: "Bulk paste with duplicates and suggestions.",
        render: () => <KeywordLibrary view="add" />,
    },
    {
        id: "library-delete",
        area: "Keyword Library",
        title: "Delete keyword in use",
        description: "Impact shown before a live campaign changes.",
        render: () => <KeywordLibrary view="delete" />,
    },
    {
        id: "library-empty",
        area: "Keyword Library",
        title: "Empty state",
        description: "First run: what keywords are and how the app sends them.",
        render: () => <KeywordLibrary view="empty" />,
    },

    {
        id: "campaigns",
        area: "Manage Campaigns",
        title: "A · Delivery view",
        description: "Deals group campaigns; delivery vs flight first.",
        render: () => <ManageCampaignsDelivery />,
    },
    {
        id: "campaigns-selected",
        area: "Manage Campaigns",
        title: "A · Selected for compare",
        description: "Compare / duplicate tray.",
        render: () => <ManageCampaignsDelivery preselected={["c1", "c2"]} />,
    },
    {
        id: "campaigns-compare",
        area: "Manage Campaigns",
        title: "B · Compare",
        description: "Side by side, differences highlighted.",
        render: () => <CompareCampaigns />,
    },

    {
        id: "reporting",
        area: "Reporting",
        title: "A · DAS overview",
        description: "DAS vs Open Marketplace, campaign delivery, keyword aggregates.",
        render: () => <DasOverview />,
    },
    {
        id: "reporting-builder",
        area: "Reporting",
        title: "B · Query builder",
        description: "Metrics, breakdowns and filters as chips.",
        render: () => <QueryBuilder />,
    },
    {
        id: "reporting-picker",
        area: "Reporting",
        title: "B · Breakdown picker open",
        description: "Grouped, searchable picker; Keyword locked to CSV/API.",
        render: () => <QueryBuilder pickerOpen />,
    },

    { id: "view-a", area: "View Campaign", title: "A · One page (running)", description: "Setup's sections read-only, with a live delivery rail.", render: () => <ViewOnePage /> },
    { id: "view-a-behind", area: "View Campaign", title: "A · Behind pace", description: "Banner with projected shortfall and a fix.", render: () => <ViewOnePage id="c2" /> },
    { id: "view-a-paused", area: "View Campaign", title: "A · Paused", description: "What's left to spend per day to finish.", render: () => <ViewOnePage id="c4" /> },
    { id: "view-a-scheduled", area: "View Campaign", title: "A · Scheduled", description: "Empty delivery state before it starts.", render: () => <ViewOnePage id="c6" /> },
    { id: "view-a-fallback", area: "View Campaign", title: "A · Fallback", description: "No budget: delivery as impressions.", render: () => <ViewOnePage id="c5" /> },
    { id: "view-b", area: "View Campaign", title: "B · Delivery first", description: "KPIs, projected finish and pace chart lead.", render: () => <ViewDeliveryFirst /> },
    { id: "view-b-behind", area: "View Campaign", title: "B · Delivery first, behind", description: "Projected finish shown in red.", render: () => <ViewDeliveryFirst id="c2" /> },
    { id: "view-b-scheduled", area: "View Campaign", title: "B · Delivery first, scheduled", description: "Target per day before launch.", render: () => <ViewDeliveryFirst id="c6" /> },
    { id: "view-c", area: "View Campaign", title: "C · Campaign sentence", description: "The whole campaign as one readable sentence.", render: () => <ViewSentence /> },
    { id: "view-c-fallback", area: "View Campaign", title: "C · Sentence, fallback", description: "How a fallback reads back.", render: () => <ViewSentence id="c5" /> },
    { id: "view-d", area: "View Campaign", title: "D · Performance vs open marketplace", description: "eCPM premium, keyword split.", render: () => <ViewPerformance /> },
    { id: "view-d-empty", area: "View Campaign", title: "D · Performance, no data yet", description: "Explains what will appear once it delivers.", render: () => <ViewPerformance id="c6" /> },
];
