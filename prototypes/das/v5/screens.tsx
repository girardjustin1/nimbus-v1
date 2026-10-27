import type { ProtoScreen } from "../../shared/prototype-frame";
import { screens as piRound1 } from "../../performance-insights/v1/screens";
import { DasOverview, QueryBuilder } from "../v1/screens/reporting";
import { ViewOnePage } from "./screens/campaign-view";
import { FullPerformance } from "./screens/full-performance";
import { ManageCampaigns } from "./screens/manage-campaigns";
import { AssetDetail } from "./screens/asset-detail";
import { AssetSetup, ViewAllAssets } from "./screens/asset-library";
import { CampaignSetup } from "./screens/campaign-setup";
import { KeywordDetail } from "./screens/keyword-detail";
import { KeywordSetup, ViewAllKeywords } from "./screens/keyword-library-v3";

/**
 * DAS prototype v5 — Round 5 (copied from Round 4 on 26 Oct; edit here, v4 stays frozen).
 *
 * Round 3 carried forward, with the 16 Oct review applied: creative previews removed
 * everywhere, Manage campaigns back to the staging table with four highlight chips, a
 * tightened campaign overview, and a new Full performance screen behind it.
 *
 * Where the review left a choice open, the alternatives are screens of their own here
 * and side by side in Storybook › Oct 17.
 */

const s = (area: string) => (screen: Omit<ProtoScreen, "area">): ProtoScreen => ({ area, ...screen });

const setup = s("1 · Deal activation setup");
const rail = s("2 · Right rail: two concepts");
const assets = s("3 · Manage assets");
const keywords = s("4 · Manage keywords");
const campaigns = s("5 · Manage campaigns");
const view = s("6 · After publishing");
const dasReporting = s("7 · Early Performance Insights · DAS Round 1 reporting");

/**
 * 7 · The early Performance Insights concepts, so they can be walked from v5 (27 Oct).
 *
 * Reused as they were reviewed, not copied: the Performance Insights Round 1 prototype
 * (22 Sep: start page, question bar, explorer, saved queries) and DAS Round 1's reporting
 * concepts. They keep their own screen ids, because their buttons link to each other by
 * id (#/start, #/question-bar, #/saved…); none clash with v5's. The sidebar's
 * "performance insights" item opens the first of them.
 */
const earlyPerformanceInsights: ProtoScreen[] = [
    ...piRound1.map((screen) => ({ ...screen, area: `7 · Early Performance Insights · ${screen.area}` })),
    dasReporting({ id: "reporting", title: "A · DAS overview", description: "DAS vs Open Marketplace, campaign delivery, keyword aggregates.", render: () => <DasOverview /> }),
    dasReporting({ id: "reporting-builder", title: "B · Query builder", description: "Metrics, breakdowns and filters as chips.", render: () => <QueryBuilder /> }),
    dasReporting({ id: "reporting-picker", title: "B · Breakdown picker open", description: "Grouped, searchable picker; Keyword locked to CSV/API.", render: () => <QueryBuilder pickerOpen /> }),
];

export const screens: ProtoScreen[] = [
    /* 1 · Setup, empty to ready. Click any field to fill it, or use Fill page. */
    setup({
        id: "setup-empty",
        title: "Empty form",
        description: "Nothing filled in. Click any field to populate it, or press Fill page in the toolbar.",
        render: () => <CampaignSetup preset="empty" screenId="setup-empty" />,
    }),
    setup({
        id: "step-general",
        title: "General",
        description: "Deal chosen and campaign named. The rail ticks General off.",
        render: () => <CampaignSetup preset="stepDeal" focus="deal" screenId="step-general" />,
    }),
    setup({
        id: "step-rules",
        title: "Auction Rules",
        description: "An auction rule picked. Fallback hides Budget and Bid Amount.",
        render: () => <CampaignSetup preset="stepRules" focus="rules" screenId="step-rules" />,
    }),
    setup({
        id: "step-budget",
        title: "Budget",
        description: "Budget, Bid Amount (eCPM) and Flight Dates set.",
        render: () => <CampaignSetup preset="stepBudget" focus="budget" screenId="step-budget" />,
    }),
    setup({
        id: "step-targeting",
        title: "Targeting",
        description: "Geos, Platform, Apps, Ad Unit and Keywords as five modules at the same level. The geo and app pickers work.",
        render: () => <CampaignSetup preset="stepTargeting" focus="targeting" screenId="step-targeting" />,
    }),
    setup({
        id: "step-creative",
        title: "Creative",
        description: "Creatives pulled from the asset library by name, Ad Type and Ad Size. No previews (16 Oct).",
        render: () => <CampaignSetup preset="ready" focus="creative" screenId="step-creative" />,
    }),
    setup({
        id: "setup-ready",
        title: "Ready to review",
        description: "Everything filled in. Review sends it to be checked; Publish stays inactive until it comes back.",
        render: () => <CampaignSetup preset="ready" screenId="setup-ready" />,
    }),
    setup({
        id: "setup-keywords-modal",
        title: "Proposal B · keywords in a modal",
        description: "The same search behind a button, so the section stays short and several keywords commit on one pass.",
        render: () => <CampaignSetup preset="ready" screenId="setup-keywords-modal" keywordEntry="modal" />,
    }),
    setup({
        id: "setup-publish-footer",
        title: "Proposal A · Publish & Duplicate in a footer",
        description: "The footer the product uses today, carried onto the one-page form. Both publish actions in the open.",
        render: () => <CampaignSetup preset="ready" screenId="setup-publish-footer" publishMode="staging" />,
    }),
    setup({
        id: "setup-duplicate",
        title: "After Publish & Duplicate",
        description: "Where the duplicate hand-off lands: the top of setup, with everything the original had still in the form.",
        render: () => <CampaignSetup preset="ready" screenId="setup-duplicate" />,
    }),
    setup({
        id: "setup-reviewed",
        title: "Review modal",
        description: "Review is the only button in the rail, and only goes pink when nothing is missing. Pressing it opens what the check came back with; Publish lives in there.",
        render: () => <CampaignSetup preset="ready" reviewed screenId="setup-ready" />,
    }),
    setup({
        id: "setup-errors",
        title: "Edge case · Review found problems",
        description: "Problems are listed in the rail and in a banner, each one a link to the field.",
        render: () => <CampaignSetup preset="errors" attempted />,
    }),
    setup({
        id: "setup-dates-invalid",
        title: "Edge case · End before the start",
        description: "The flight dates contradict each other.",
        render: () => <CampaignSetup preset="datesInvalid" attempted focus="budget" />,
    }),
    setup({
        id: "setup-published",
        title: "Published",
        description: "The campaign as it reads once live.",
        render: () => <ViewOnePage id="new" published />,
    }),

    /* 2 · The open question for engineering. */
    rail({
        id: "rail-summary",
        title: "A · Summary → Review → Publish",
        description: "Matches the backend round-trip DAS does today: Review posts the campaign to be checked, and Publish only lights up once it comes back clean.",
        render: () => <CampaignSetup preset="ready" rail="summary" />,
    }),
    rail({
        id: "rail-validation",
        title: "B · Live validation → Publish",
        description: "Everything checks on the client as you type and Publish is always live. Assumes validation can happen without the backend.",
        render: () => <CampaignSetup preset="ready" rail="validation" />,
    }),
    rail({
        id: "rail-validation-errors",
        title: "B · Live validation, with problems",
        description: "The same rail with a campaign that doesn't pass.",
        render: () => <CampaignSetup preset="errors" rail="validation" attempted />,
    }),

    /* 3 · Assets — the half of DAS that had no prototype until now. */
    assets({
        id: "asset-setup",
        title: "Asset Setup · empty",
        description: "A creative is markup you paste, not a file you upload. Fields and buttons are the product's own.",
        render: () => <AssetSetup />,
    }),
    assets({
        id: "asset-setup-filled",
        title: "Asset Setup · filled",
        description: "Name, Ad Type, Ad Size, markup and trackers. The preview beside the form came out on 16 Oct.",
        render: () => <AssetSetup filled />,
    }),
    assets({
        id: "asset-setup-checked",
        title: "Validation · markup checks out",
        description: "Validate Markup reads the paste line by line. A clean tag gets a verdict rather than silence.",
        render: () => <AssetSetup filled checked />,
    }),
    assets({
        id: "asset-setup-invalid",
        title: "Validation · four faults, located by line",
        description: "An unterminated tag, an unquoted href, a macro over http://, and a document.write(). Each is reported against the line it is on; click one to put the caret there.",
        render: () => <AssetSetup filled invalid />,
    }),
    assets({
        id: "asset-setup-macros",
        title: "Edge case · markup contains macros",
        description: "The charter forbids macros in creatives and in trackers — Nimbus never substitutes them, so they would serve as literal text.",
        render: () => <AssetSetup filled macros />,
    }),
    assets({
        id: "asset-view",
        title: "View All Assets",
        description: "The library: status, associated campaigns, Ad Type, Ad Size and tracker counts.",
        render: () => <ViewAllAssets />,
    }),
    assets({
        id: "asset-view-search",
        title: "View All Assets · searching",
        description: "Filtering the library by name, type or campaign.",
        render: () => <ViewAllAssets search="mrec" />,
    }),

    assets({
        id: "asset-detail",
        title: "Asset detail · edit",
        description: "Change an asset, or add a tracker to it. Not in the charter — it is in the product, and was asked for on 1 Oct.",
        render: () => <AssetDetail id="a4" />,
    }),
    assets({
        id: "asset-detail-live",
        title: "Asset detail · serving now",
        description: "An asset in a live campaign. Changes take effect on the next ad request; there is no publish step for an asset.",
        render: () => <AssetDetail id="a1" />,
    }),
    assets({
        id: "asset-delete-guard",
        title: "Edge case · can't delete a live asset",
        description: "Blocked, not warned, while a campaign still uses it — the same rule as a keyword in use.",
        render: () => <AssetDetail id="a1" confirmingDelete />,
    }),

    /* 4 · Keywords — the same pattern, deliberately. */
    keywords({
        id: "keyword-setup",
        title: "Keyword Setup · empty",
        description: "Mirrors Asset Setup: a form that adds to a library you keep.",
        render: () => <KeywordSetup />,
    }),
    keywords({
        id: "keyword-setup-filled",
        title: "Keyword Setup · filled",
        description: "The preview separates what's new from what's already in the library.",
        render: () => <KeywordSetup filled />,
    }),
    keywords({
        id: "keyword-view",
        title: "View All Keywords",
        description: "The library, laid out like View All Assets. Every row opens.",
        render: () => <ViewAllKeywords />,
    }),
    keywords({
        id: "keyword-empty",
        title: "View All Keywords · nothing yet",
        description: "The first screen a publisher sees: what a keyword is, the three ways to send one, and the request Nimbus reads it from.",
        render: () => <ViewAllKeywords empty />,
    }),
    keywords({
        id: "keyword-detail",
        title: "Keyword detail",
        description: "One keyword: the campaigns matching on it, and its history. Delete sits top right.",
        render: () => <KeywordDetail id="k1" />,
    }),
    keywords({
        id: "keyword-delete-guard",
        title: "Edge case · delete blocked by a live campaign",
        description: "A keyword a running campaign targets can't be deleted — it would narrow that campaign with nothing to say why.",
        render: () => <KeywordDetail id="k1" confirmDelete />,
    }),
    keywords({
        id: "keyword-delete-ok",
        title: "Delete · nothing live is using it",
        description: "The same guard when the keyword is free. Reporting already written keeps it.",
        render: () => <KeywordDetail id="k5" confirmDelete />,
    }),

    /* 5 · Campaigns — the staging table, with four highlight chips (16 Oct). Campaign Health as counts (19 Oct). */
    campaigns({ id: "campaigns", title: "Campaigns table", description: "Staging's table, with Live, Queued, Total spend and Campaign Health above it.", render: () => <ManageCampaigns /> }),
    campaigns({ id: "campaigns-search", title: "Searching", description: "The search bar narrows the table.", render: () => <ManageCampaigns search="sports" /> }),
    campaigns({ id: "campaigns-attention", title: "Campaign Health, filtered", description: "Clicking Campaign Health leaves only the campaigns behind or at risk.", render: () => <ManageCampaigns filter="attention" /> }),

    /* 6 · A campaign, then its full performance. Cards and the builder on top, in Performance Insights' style (19 Oct). */
    view({ id: "view-a", title: "Overview", render: () => <ViewOnePage /> }),
    view({ id: "view-a-at-risk", title: "Overview · at risk", description: "A campaign that can't catch up.", render: () => <ViewOnePage id="c2" /> }),
    view({ id: "view-a-behind", title: "Overview · behind, can catch up", render: () => <ViewOnePage id="c8" /> }),
    view({ id: "view-a-queued", title: "Overview · queued", render: () => <ViewOnePage id="c6" /> }),
    view({ id: "view-d", title: "Full performance", description: "Styled like Performance Insights. Break down by creative, platform, geo, app, keyword and device language; download the view as CSV.", render: () => <FullPerformance /> }),
    view({ id: "view-d-pivot", title: "Full performance · pivot", description: "Creative against Platform.", render: () => <FullPerformance breakdown={["Creative", "Platform"]} /> }),
    view({ id: "view-d-keywords", title: "Full performance · by keyword", description: "Keywords match on ANY and report on screen, one row each (19 Oct).", render: () => <FullPerformance id="c3" breakdown={["Keyword"]} /> }),

    /* 7 · Early Performance Insights concepts (27 Oct). */
    ...earlyPerformanceInsights,
];
