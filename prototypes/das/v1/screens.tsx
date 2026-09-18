import type { ProtoScreen } from "../../shared/prototype-frame";
import { CampaignSetupOnePage } from "./screens/campaign-setup-one-page";
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
        description: "Five wizard steps as one page with a live summary rail.",
        render: () => <CampaignSetupOnePage />,
    },
    {
        id: "setup-errors",
        area: "Campaign Setup (One Page)",
        title: "With errors",
        description: "Missing budget and mixed creatives; Publish disabled.",
        render: () => <CampaignSetupOnePage state="errors" />,
    },
    {
        id: "setup-fallback",
        area: "Campaign Setup (One Page)",
        title: "Fallback rule",
        description: "Budget and eCPM hide when they don't apply.",
        render: () => <CampaignSetupOnePage initialRule="Fallback" />,
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
];
