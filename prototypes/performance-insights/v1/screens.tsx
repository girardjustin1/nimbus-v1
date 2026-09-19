import type { ProtoScreen } from "../../shared/prototype-frame";
import { Explorer } from "./screens/explorer";
import { QuestionBar, StartPage } from "./screens/pi-concepts";
import { Cards, SavedToday, SmartTable, SplitPreview, Timeline } from "./screens/saved-queries";

/**
 * Performance Insights prototype v1 — screen registry.
 * Every state has its own link (…/#/<id>); order here is the toolbar's previous/next order.
 */
export const screens: ProtoScreen[] = [
    /* A · Start page */
    { id: "start", area: "A · Start page", title: "Templates & saved queries", description: "Begin from a ready-made question instead of a blank form.", render: () => <StartPage /> },
    { id: "start-search", area: "A · Start page", title: "Searching “fill”", description: "One search across templates and saved or recommended queries.", render: () => <StartPage search="fill" /> },
    { id: "start-search-empty", area: "A · Start page", title: "Search with no results", description: "Suggests other terms and offers to build it as a new query.", render: () => <StartPage search="sdk crash" /> },

    /* B · Question bar */
    { id: "question-bar", area: "B · Question bar", title: "Results", description: "The query as one sentence; deltas vs the previous period.", render: () => <QuestionBar /> },
    { id: "question-bar-picker", area: "B · Question bar", title: "Metric picker open", description: "“+ metric” opens a searchable, grouped checklist.", render: () => <QuestionBar picker /> },
    { id: "question-bar-draft", area: "B · Question bar", title: "Edited, not yet run", description: "Results go stale; nothing reloads until Run.", render: () => <QuestionBar draft /> },
    { id: "question-bar-save", area: "B · Question bar", title: "Save dialog", description: "Name it, and choose a rolling or fixed date range.", render: () => <QuestionBar saving /> },
    { id: "question-bar-saved", area: "B · Question bar", title: "Saved confirmation", description: "Toast with a link to the new saved query.", render: () => <QuestionBar saved /> },

    /* C · Explorer (interactive) */
    { id: "explorer", area: "C · Explorer (drag to build)", title: "App › Demand Source by week", description: "Drag fields from the right rail; the table rebuilds live.", render: () => <Explorer /> },
    {
        id: "explorer-country",
        area: "C · Explorer (drag to build)",
        title: "Country by platform, two metrics",
        description: "Revenue and eCPM side by side under each platform.",
        render: () => <Explorer preset={{ rows: ["Country"], columns: ["Platform"], values: ["Revenue", "eCPM"], filters: {} }} />,
    },
    {
        id: "explorer-filtered",
        area: "C · Explorer (drag to build)",
        title: "Filtered to US & Canada",
        description: "A Country filter with its value picker open.",
        render: () => (
            <Explorer preset={{ rows: ["App", "Ad Unit"], columns: ["Month"], values: ["Revenue", "Fill Rate"], filters: { Country: ["United States", "Canada"] } }} filterOpen="Country" />
        ),
    },
    {
        id: "explorer-no-columns",
        area: "C · Explorer (drag to build)",
        title: "No columns: metric table",
        description: "Five metrics per demand source, no time split.",
        render: () => <Explorer preset={{ rows: ["Demand Source"], columns: [], values: ["Revenue", "Impressions", "eCPM", "Fill Rate", "Win Rate"], filters: {} }} />,
    },
    {
        id: "explorer-too-wide",
        area: "C · Explorer (drag to build)",
        title: "Too many columns",
        description: "Week × Country × 2 metrics; offers to move Country to Rows.",
        render: () => <Explorer preset={{ rows: ["App"], columns: ["Week", "Country"], values: ["Revenue", "eCPM"], filters: {} }} />,
    },
    {
        id: "explorer-empty",
        area: "C · Explorer (drag to build)",
        title: "Empty: nothing placed yet",
        description: "Zones explain themselves; quick-add a metric.",
        render: () => <Explorer preset={{ rows: [], columns: [], values: [], filters: {} }} />,
    },
    { id: "explorer-rail-collapsed", area: "C · Explorer (drag to build)", title: "Rail collapsed", description: "Fields tucked away to give the table room.", render: () => <Explorer railCollapsed /> },

    /* Saved Queries */
    { id: "saved-today", area: "Saved Queries · today (reference)", title: "Current page", description: "Five text columns, two checkboxes, no empty state.", render: () => <SavedToday /> },

    { id: "saved", area: "D · Saved Queries: smart table", title: "Saved + recommended", description: "Range bars, trend column, type badges, row actions.", render: () => <SmartTable /> },
    { id: "saved-only-saved", area: "D · Saved Queries: smart table", title: "Saved only", description: "Recommended filter off.", render: () => <SmartTable show={{ saved: true, recommended: false }} /> },
    { id: "saved-only-recommended", area: "D · Saved Queries: smart table", title: "Recommended only", description: "Saved filter off; Save instead of Run.", render: () => <SmartTable show={{ saved: false, recommended: true }} /> },
    { id: "saved-none", area: "D · Saved Queries: smart table", title: "Both filters off", description: "A way back instead of an empty header row.", render: () => <SmartTable show={{ saved: false, recommended: false }} /> },
    { id: "saved-grouped", area: "D · Saved Queries: smart table", title: "Grouped by report type", description: "Collapsible groups with counts.", render: () => <SmartTable groupBy="type" /> },
    { id: "saved-search", area: "D · Saved Queries: smart table", title: "Searching “ecpm”", description: "Search covers names, metrics, accounts and types.", render: () => <SmartTable search="ecpm" /> },
    { id: "saved-search-empty", area: "D · Saved Queries: smart table", title: "Search with no results", description: "Clear search or build a new query.", render: () => <SmartTable search="sdk version" /> },
    { id: "saved-first-run", area: "D · Saved Queries: smart table", title: "First run: nothing saved yet", description: "Recommendations become the starter set.", render: () => <SmartTable firstRun /> },
    { id: "saved-loading", area: "D · Saved Queries: smart table", title: "Loading", description: "Skeleton rows while queries load.", render: () => <SmartTable loading /> },
    { id: "saved-selected", area: "D · Saved Queries: smart table", title: "Two rows selected", description: "Bulk bar: run, share, schedule, delete.", render: () => <SmartTable selected={["exec", "android-fill"]} /> },
    { id: "saved-row-menu", area: "D · Saved Queries: smart table", title: "Row menu open", description: "Run, edit, duplicate, schedule, copy link, delete.", render: () => <SmartTable menuFor="android-fill" /> },
    { id: "saved-schedule", area: "D · Saved Queries: smart table", title: "Email schedule", description: "Frequency, recipients, only-when-it-changes.", render: () => <SmartTable menuFor="android-fill" dialog="schedule" /> },
    { id: "saved-delete", area: "D · Saved Queries: smart table", title: "Delete confirmation", description: "Warns that a scheduled email will stop.", render: () => <SmartTable menuFor="android-fill" dialog="delete" /> },
    { id: "saved-delete-many", area: "D · Saved Queries: smart table", title: "Bulk delete confirmation", description: "Lists what goes and which emails stop.", render: () => <SmartTable selected={["exec", "android-fill"]} dialog="delete-many" /> },
    { id: "saved-deleted", area: "D · Saved Queries: smart table", title: "Deleted, with undo", description: "Toast confirms and offers Undo.", render: () => <SmartTable deleted /> },

    { id: "cards", area: "E · Saved Queries: preview cards", title: "All queries", description: "Headline number, change and trend on every card.", render: () => <Cards /> },
    { id: "cards-type", area: "E · Saved Queries: preview cards", title: "Filtered to Demand", description: "Report type as a filter row with counts.", render: () => <Cards type="Demand" /> },
    { id: "cards-why", area: "E · Saved Queries: preview cards", title: "“Why this?” open", description: "The reason behind a recommendation, with Save or Not useful.", render: () => <Cards whyFor="rec-android-drop" /> },
    { id: "cards-dismissed", area: "E · Saved Queries: preview cards", title: "Recommendation dismissed", description: "Card removed; toast with Undo.", render: () => <Cards dismissed="rec-android-drop" /> },

    { id: "timeline", area: "F · Saved Queries: date-range timeline", title: "Lanes by account", description: "Each query's dates as a bar; rolling vs fixed.", render: () => <Timeline /> },
    { id: "timeline-by-type", area: "F · Saved Queries: date-range timeline", title: "Lanes by report type", description: "Same bars, grouped by type.", render: () => <Timeline lanes="type" /> },
    { id: "timeline-selected", area: "F · Saved Queries: date-range timeline", title: "Bar selected", description: "Details, trend and actions for one query.", render: () => <Timeline selectedId="q3-country" /> },
    { id: "timeline-stale", area: "F · Saved Queries: date-range timeline", title: "Ended ranges highlighted", description: "Offers to roll stale queries forward.", render: () => <Timeline stale /> },

    { id: "preview", area: "G · Saved Queries: list + preview", title: "Saved query selected", description: "Sentence, metadata, KPIs and trend beside the list.", render: () => <SplitPreview /> },
    { id: "preview-recommended", area: "G · Saved Queries: list + preview", title: "Recommendation selected", description: "Why it's suggested, and Save to my queries.", render: () => <SplitPreview initialId="rec-android-drop" /> },
    { id: "preview-ended", area: "G · Saved Queries: list + preview", title: "Fixed range has ended", description: "Keep as a recap, or roll forward.", render: () => <SplitPreview initialId="bts-recap" /> },
    { id: "preview-loading", area: "G · Saved Queries: list + preview", title: "Loading", description: "Skeleton KPIs and chart while it runs.", render: () => <SplitPreview loading /> },
    { id: "preview-share", area: "G · Saved Queries: list + preview", title: "Share popover", description: "Copied link and who can open it.", render: () => <SplitPreview share /> },
];
