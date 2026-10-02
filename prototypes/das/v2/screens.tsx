import type { ProtoScreen } from "../../shared/prototype-frame";
import { ViewDeliveryFirst, ViewOnePage, ViewPerformance, ViewSentence } from "../v1/screens/campaign-view";
import { CompareCampaigns, ManageCampaignsDelivery } from "../v1/screens/manage-campaigns";
import { AssetDetail } from "./screens/asset-detail";
import { AssetSetup, ViewAllAssets } from "./screens/asset-library";
import { CampaignSetup } from "./screens/campaign-setup";
import { BulkAddKeywords } from "./screens/keyword-bulk-add";
import { KeywordDetail } from "./screens/keyword-detail";
import { KeywordHealth } from "./screens/keyword-health";
import { KeywordSetup, ViewAllKeywords } from "./screens/keyword-library-v2";

/**
 * DAS prototype v2 — Round 2.
 *
 * The structure the product actually has: an asset library and a keyword library you
 * keep, a setup flow that pulls from both, and the campaigns that come out. Setup is one
 * page with a single rail on the right; the duplicated left rail is gone.
 *
 * Screens shared with v1 (campaign view, manage campaigns) are imported rather than
 * copied, so terminology stays identical between the two rounds.
 */

const s = (area: string) => (screen: Omit<ProtoScreen, "area">): ProtoScreen => ({ area, ...screen });

const setup = s("1 · Deal activation setup");
const rail = s("2 · Right rail: two concepts");
const assets = s("3 · Manage assets");
const keywords = s("4 · Manage keywords");
const campaigns = s("5 · Manage campaigns");
const view = s("6 · After publishing");

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
        description: "Creatives pulled from the asset library, with a preview of the format.",
        render: () => <CampaignSetup preset="ready" focus="creative" screenId="step-creative" />,
    }),
    setup({
        id: "setup-ready",
        title: "Ready to review",
        description: "Everything filled in. Review sends it to be checked; Publish stays inactive until it comes back.",
        render: () => <CampaignSetup preset="ready" screenId="setup-ready" />,
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
        title: "Asset Setup · filled, with preview",
        description: "Choosing an Ad Size shows where the creative sits in an app.",
        render: () => <AssetSetup filled />,
    }),
    assets({
        id: "asset-setup-invalid",
        title: "Edge case · markup that doesn't parse",
        description: "The paste doesn't look like HTML or VAST.",
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
        description: "One keyword: its note, the campaigns matching on it, whether it's arriving, and its history.",
        render: () => <KeywordDetail id="k1" />,
    }),
    keywords({
        id: "keyword-detail-unseen",
        title: "Keyword detail · never arrived",
        description: "Defined, spelled fine, and no app has ever sent it — so it can't match. Why, and where to look.",
        render: () => <KeywordDetail id="k5" />,
    }),
    keywords({
        id: "keyword-bulk-add",
        title: "Bulk add",
        description: "Paste a list out of your remote config and see what happens to every line before anything saves.",
        render: () => <BulkAddKeywords preset="good" />,
    }),
    keywords({
        id: "keyword-bulk-add-problems",
        title: "Edge case · a paste with problems",
        description: "Duplicates, a casing collision, bad characters, over length, already in the library, and one nothing is sending.",
        render: () => <BulkAddKeywords preset="problems" />,
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
    keywords({
        id: "keyword-health",
        title: "Keyword Health",
        description: "What your apps actually send against what you've defined. Aggregates only — no per-keyword charts.",
        render: () => <KeywordHealth />,
    }),

    /* 5 · Campaigns — shared with v1 so the wording can't drift. */
    campaigns({ id: "campaigns", title: "Delivery view", description: "Campaigns under their deal, delivery first.", render: () => <ManageCampaignsDelivery /> }),
    campaigns({ id: "campaigns-search", title: "Searching", description: "Live search across deals, campaigns and keywords.", render: () => <ManageCampaignsDelivery search="sports" /> }),
    campaigns({ id: "campaigns-compare", title: "Compare", description: "Two or three campaigns side by side.", render: () => <CompareCampaigns /> }),

    /* 6 · After publishing. */
    view({ id: "view-a", title: "A · One page, read-only", render: () => <ViewOnePage /> }),
    view({ id: "view-b", title: "B · Delivery first", render: () => <ViewDeliveryFirst /> }),
    view({ id: "view-c", title: "C · The campaign as one sentence", render: () => <ViewSentence /> }),
    view({ id: "view-d", title: "D · Performance", render: () => <ViewPerformance /> }),
];
