import type { ProtoScreen } from "../../shared/prototype-frame";
import { CampaignSetupOnePage } from "./screens/campaign-setup-one-page";
import { ViewDeliveryFirst, ViewOnePage, ViewPerformance, ViewSentence } from "./screens/campaign-view";
import { KeywordLibrary } from "./screens/keyword-library";
import { AudienceSentence, KeywordTargetingInline, KeywordTargetingLibrary } from "./screens/keyword-targeting";
import { CompareCampaigns, ManageCampaignsDelivery } from "./screens/manage-campaigns";
import { DasOverview, QueryBuilder } from "./screens/reporting";

/**
 * DAS prototype v1 — screen registry, laid out as the steps a publisher takes from an
 * empty form to a published campaign. Each step opens the same one-page form, filled in
 * up to that point and scrolled to that section; the states under it are its edge cases.
 * Order here is the order of the toolbar's previous/next arrows. Screen ids never change,
 * so earlier links keep working.
 */

const s = (area: string) => (screen: Omit<ProtoScreen, "area">): ProtoScreen => ({ area, ...screen });

const start = s("1 · Start: empty form");
const deal = s("2 · Deal & campaign");
const rules = s("3 · Auction rules");
const budget = s("4 · Budget & flight");
const targeting = s("5 · Targeting");
const creative = s("6 · Creative");
const publish = s("7 · Review & publish");
const view = s("8 · After publishing: View campaign");
const library = s("Other areas · Keyword Library");
const campaigns = s("Other areas · Manage Campaigns");
const reporting = s("Other areas · Reporting");

export const screens: ProtoScreen[] = [
    /* 1 · Start */
    start({ id: "setup-empty", title: "Empty form", description: "Nothing filled in. “On this page” and the summary rail show their empty states (0/5).", render: () => <CampaignSetupOnePage preset="empty" /> }),
    start({ id: "setup-empty-errors", title: "Edge case · Publish pressed on an empty form", description: "Every required field is flagged; the banner links to each.", render: () => <CampaignSetupOnePage preset="empty" attempted /> }),

    /* 2 · Deal & campaign */
    deal({ id: "step-deal", title: "Deal chosen and campaign named", description: "Deal & campaign ticks off (1/5). Rules, budget and creative still to do.", render: () => <CampaignSetupOnePage preset="stepDeal" focus="deal" /> }),
    deal({ id: "edge-no-name", title: "Edge case · Campaign name left blank", description: "Everything else is complete; Publish flags only the name.", render: () => <CampaignSetupOnePage preset="noName" attempted focus="deal" /> }),

    /* 3 · Auction rules */
    rules({ id: "step-rules", title: "Auction rule picked (CPM Priority)", description: "Rule ticks off (2/5). Budget and eCPM appear because the rule needs them.", render: () => <CampaignSetupOnePage preset="stepRules" focus="rules" /> }),
    rules({ id: "setup-fallback", title: "Edge case · Fallback rule", description: "Budget and eCPM disappear. End date and creative still missing: press Publish.", render: () => <CampaignSetupOnePage preset="fallback" focus="rules" /> }),
    rules({ id: "setup-fallback-errors", title: "Edge case · Fallback, Publish pressed", description: "Missing end date and creative flagged in place and in the rail.", render: () => <CampaignSetupOnePage preset="fallback" attempted /> }),
    rules({ id: "edge-fallback-ready", title: "Edge case · Fallback, complete", description: "A fallback campaign with dates and creative: ready without a budget.", render: () => <CampaignSetupOnePage preset="fallbackReady" focus="budget" /> }),

    /* 4 · Budget & flight */
    budget({ id: "step-budget", title: "Budget, eCPM and flight set", description: "Budget & flight ticks off (3/5); estimated delivery appears in the summary.", render: () => <CampaignSetupOnePage preset="stepBudget" focus="budget" /> }),
    budget({ id: "setup-calendar", title: "Start date & time picker open", description: "Calendar with a UTC time field and quick times underneath; past dates can't be picked.", render: () => <CampaignSetupOnePage preset="stepBudget" calendarOpen focus="budget" /> }),
    budget({ id: "edge-no-budget", title: "Edge case · Budget left blank", description: "Everything else is complete; Publish flags only the budget.", render: () => <CampaignSetupOnePage preset="noBudget" attempted focus="budget" /> }),
    budget({ id: "setup-dates-invalid", title: "Edge case · End before start", description: "End date set before the start date is flagged after Publish.", render: () => <CampaignSetupOnePage preset="datesInvalid" attempted focus="budget" /> }),

    /* 5 · Targeting */
    targeting({ id: "step-targeting", title: "Keywords added (ANY match)", description: "Targeting ticks off (4/5). Only creative is left.", render: () => <CampaignSetupOnePage preset="stepTargeting" focus="targeting" /> }),
    targeting({ id: "edge-no-keywords", title: "Edge case · No keywords (everyone)", description: "Targeting is optional: the campaign reaches everyone and can still publish.", render: () => <CampaignSetupOnePage preset="noKeywords" focus="targeting" /> }),
    targeting({ id: "targeting-chips", title: "Alternative A · Inline keyword chips", description: "Type keywords; ANY/ALL match; ad unit type and device language.", render: () => <KeywordTargetingInline /> }),
    targeting({ id: "targeting-warnings", title: "Alternative A · ALL match + warnings", description: "Keywords not seen in traffic, or new to the library.", render: () => <KeywordTargetingInline match="ALL" initial={["over21", "77541", "tailgate"]} /> }),
    targeting({ id: "targeting-library", title: "Alternative B · Pick from library", description: "Choose saved keywords with usage and traffic signals.", render: () => <KeywordTargetingLibrary /> }),
    targeting({ id: "targeting-sentence", title: "Alternative C · Audience sentence", description: "The whole target as one editable sentence.", render: () => <AudienceSentence /> }),

    /* 6 · Creative */
    creative({ id: "step-creative", title: "Creatives added", description: "Creative ticks off (5/5): the form is complete.", render: () => <CampaignSetupOnePage preset="ready" focus="creative" /> }),
    creative({ id: "edge-no-creative", title: "Edge case · No creative", description: "Everything else is complete; Publish flags the empty creative list.", render: () => <CampaignSetupOnePage preset="noCreative" attempted focus="creative" /> }),
    creative({ id: "edge-mixed-creative", title: "Edge case · HTML and VAST mixed", description: "One campaign, one creative type: the VAST row is flagged.", render: () => <CampaignSetupOnePage preset="mixedCreative" attempted focus="creative" /> }),

    /* 7 · Review & publish */
    publish({ id: "setup-ready", title: "Ready to publish", description: "5/5 in the rail and the summary, “Everything checks out”. Publish goes live.", render: () => <CampaignSetupOnePage /> }),
    publish({ id: "setup-errors", title: "Edge case · Publish pressed with several problems", description: "Missing budget and mixed creatives flagged together.", render: () => <CampaignSetupOnePage preset="errors" attempted /> }),
    publish({ id: "setup-published", title: "Published", description: "Lands on View campaign with a confirmation.", render: () => <ViewOnePage id="new" published /> }),

    /* 8 · After publishing: View campaign */
    view({ id: "view-a", title: "A · One page (running)", description: "Setup's sections read-only, with a live delivery rail.", render: () => <ViewOnePage /> }),
    view({ id: "view-a-behind", title: "A · Behind pace", description: "Banner with projected shortfall and a fix.", render: () => <ViewOnePage id="c2" /> }),
    view({ id: "view-a-paused", title: "A · Paused", description: "What's left to spend per day to finish.", render: () => <ViewOnePage id="c4" /> }),
    view({ id: "view-a-scheduled", title: "A · Scheduled", description: "Empty delivery state before it starts.", render: () => <ViewOnePage id="c6" /> }),
    view({ id: "view-a-fallback", title: "A · Fallback", description: "No budget: delivery as impressions.", render: () => <ViewOnePage id="c5" /> }),
    view({ id: "view-b", title: "B · Delivery first", description: "KPIs, projected finish and pace chart lead.", render: () => <ViewDeliveryFirst /> }),
    view({ id: "view-b-behind", title: "B · Delivery first, behind", description: "Projected finish shown in red.", render: () => <ViewDeliveryFirst id="c2" /> }),
    view({ id: "view-b-scheduled", title: "B · Delivery first, scheduled", description: "Target per day before launch.", render: () => <ViewDeliveryFirst id="c6" /> }),
    view({ id: "view-c", title: "C · Campaign sentence", description: "The whole campaign as one readable sentence.", render: () => <ViewSentence /> }),
    view({ id: "view-c-fallback", title: "C · Sentence, fallback", description: "How a fallback reads back.", render: () => <ViewSentence id="c5" /> }),
    view({ id: "view-d", title: "D · Performance vs open marketplace", description: "eCPM premium, keyword split.", render: () => <ViewPerformance /> }),
    view({ id: "view-d-empty", title: "D · Performance, no data yet", description: "Explains what will appear once it delivers.", render: () => <ViewPerformance id="c6" /> }),

    /* Other areas */
    library({ id: "library", title: "Default", description: "Keywords with campaign usage and traffic status.", render: () => <KeywordLibrary /> }),
    library({ id: "library-add", title: "Add keywords", description: "Bulk paste with duplicates and suggestions.", render: () => <KeywordLibrary view="add" /> }),
    library({ id: "library-delete", title: "Delete keyword in use", description: "Impact shown before a live campaign changes.", render: () => <KeywordLibrary view="delete" /> }),
    library({ id: "library-empty", title: "Empty state", description: "First run: what keywords are and how the app sends them.", render: () => <KeywordLibrary view="empty" /> }),
    campaigns({ id: "campaigns", title: "A · Delivery view", description: "Deals group campaigns; delivery vs flight first.", render: () => <ManageCampaignsDelivery /> }),
    campaigns({ id: "campaigns-collapsed", title: "A · Deals collapsed", description: "Each deal folds to one line; a behind-pace badge stays visible.", render: () => <ManageCampaignsDelivery collapsed={["D-10482", "D-10517", "D-10533", "D-10540", "D-10551"]} /> }),
    campaigns({ id: "campaigns-search", title: "A · Searching “sports”", description: "Live filter across deals, campaigns and keywords, with matches highlighted.", render: () => <ManageCampaignsDelivery search="sports" /> }),
    campaigns({ id: "campaigns-search-empty", title: "A · Search with no results", description: "Explains what search covers; clear or start a new campaign.", render: () => <ManageCampaignsDelivery search="tennis" /> }),
    campaigns({ id: "campaigns-selected", title: "A · Selected for compare", description: "Compare / duplicate tray.", render: () => <ManageCampaignsDelivery preselected={["c1", "c2"]} /> }),
    campaigns({ id: "campaigns-compare", title: "B · Compare", description: "Side by side, differences highlighted.", render: () => <CompareCampaigns /> }),
    reporting({ id: "reporting", title: "A · DAS overview", description: "DAS vs Open Marketplace, campaign delivery, keyword aggregates.", render: () => <DasOverview /> }),
    reporting({ id: "reporting-builder", title: "B · Query builder", description: "Metrics, breakdowns and filters as chips.", render: () => <QueryBuilder /> }),
    reporting({ id: "reporting-picker", title: "B · Breakdown picker open", description: "Grouped, searchable picker; Keyword locked to CSV/API.", render: () => <QueryBuilder pickerOpen /> }),
];
