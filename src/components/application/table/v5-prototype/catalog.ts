/**
 * Table locations in the current v5 prototype (Round 5) and the closest existing DS examples.
 * `kind` is the 26 Oct rule: reports get the charcoal header, lists keep a light one
 * (Storybook › Application UI › Table › List vs Report).
 */
export const tableCatalog = [
    {
        id: "campaigns",
        title: "Manage campaigns",
        route: "campaigns",
        section: "Main campaign grid below Live, Queued, Total spend and Campaign Health.",
        source: "manage-campaigns.tsx · ManageCampaigns",
        kind: "list",
        header: "List: light header, bold black labels, vertical column rules; full bleed under the search bar.",
        match: "View All Campaigns",
        matchId: "application-ui-table-102326-view-all-campaigns--all-columns",
        reason: "Closest campaign-column and inline-control reference. Its columns differ; v5 has 14 staging columns, sortable headers and the health filter above the table.",
        ownId: "application-ui-table-v5-prototype-manage-campaigns--current",
        charcoal: "ReportingMetrics",
    },
    {
        id: "creatives",
        title: "Campaign creative summary",
        route: "view-a",
        section: "Campaign overview → Creative section, below the performance chart and Targeting.",
        source: "campaign-view.tsx · ViewOnePage",
        kind: "list",
        header: "List: light header, bold black labels, vertical column rules; read-only, inside the overview.",
        match: "Campaign Setup · Creative",
        matchId: "application-ui-table-102326-campaign-setup--creative",
        reason: "Same creative name / type / size vocabulary. The DS example adds a cap and row removal; the overview is read-only.",
        ownId: "application-ui-table-v5-prototype-campaign-creatives--current",
        charcoal: "ReportingMetrics",
    },
    {
        id: "performance",
        title: "Full performance / pivot",
        route: "view-d",
        section: "Campaign overview → Full performance → results table below the builder and chart. Also view-d-pivot and view-d-keywords.",
        source: "full-performance.tsx · FullPerformance",
        kind: "report",
        header: "Report: charcoal #101828 header with white labels, warm alternating rows, totals row; full bleed below the chart.",
        match: "Performance Insights · Metrics",
        matchId: "application-ui-table-102326-performance-insights--metrics",
        reason: "Closest charcoal header, reporting typography, teal values and totals. V5 adds breakdowns, filtering, share bars and CSV export; it does not import this DS table.",
        ownId: "application-ui-table-v5-prototype-full-performance--table",
        charcoal: "ReportingMetrics",
    },
    {
        id: "assets",
        title: "Asset library",
        route: "asset-view",
        section: "Manage assets → View all assets. Search, selection mode and bulk actions surround the table.",
        source: "asset-library.tsx · ViewAllAssets",
        kind: "list",
        header: "List: light header, bold black labels, vertical column rules; full bleed under the left-aligned search.",
        match: "Manage Assets · Live campaigns",
        matchId: "application-ui-table-102326-manage-assets--live-campaigns",
        reason: "Closest status, creative/type/size, tracker counts and row actions. V5 has asset-specific associations, validation and bulk selection.",
        ownId: "application-ui-table-v5-prototype-asset-library--current",
        charcoal: "SavedQueries",
    },
    {
        id: "keywords",
        title: "Keyword library",
        route: "keyword-view",
        section: "Manage keywords → View all keywords. Also keyword-empty for its empty state.",
        source: "keyword-library-v3.tsx · ViewAllKeywords",
        kind: "list",
        header: "List: light header, bold black labels, vertical column rules; full bleed under the left-aligned search.",
        match: "Saved Queries · Reports",
        matchId: "application-ui-table-102326-saved-queries--reports",
        reason: "Closest library/list table, linked names and row actions. Keyword usage, traffic, updated timestamps and bulk operations are specific to v5.",
        ownId: "application-ui-table-v5-prototype-keyword-library--current",
        charcoal: "SavedQueries",
    },
    {
        id: "health",
        title: "Keyword health by app",
        route: "keyword-health",
        section: "Manage keywords → Keyword Health → app integration table.",
        source: "keyword-health.tsx · KeywordHealth",
        kind: "list",
        header: "Diagnostic list of apps; see List vs Report for how it reads.",
        match: "Benchmarks · Metrics",
        matchId: "application-ui-table-102326-benchmarks--metrics",
        reason: "Closest charcoal data-table header and app/metric rows. Health reports request volume, population, SDK and arriving fields rather than win rate or eCPM.",
        ownId: "application-ui-table-v5-prototype-keyword-health--current",
        charcoal: "Benchmarks",
    },
    {
        id: "chosen",
        title: "Selected apps, languages, keywords and creatives",
        route: "setup-ready",
        section: "Campaign setup → Apps, Device Language, Keywords and Creative. Step-targeting and step-creative focus these sections.",
        source: "search-select.tsx · ChosenTable",
        kind: "list",
        header: "List inside a form: light header, removable rows; not full bleed (it sits in a setup section).",
        match: "Campaign Setup · Chosen Table",
        matchId: "deal-activation-system-campaign-setup-controls-chosen-table--with-rows",
        reason: "Exact component reuse: this existing DS story already imports the prototype's ChosenTable. Column sets vary by caller; a list, so a light header.",
        ownId: "application-ui-table-v5-prototype-selected-items--apps",
        charcoal: "SavedQueries",
    },
] as const;

export const charcoalStories = {
    ReportingMetrics: "application-ui-table-v5-prototype-charcoal-references--reporting-metrics",
    SavedQueries: "application-ui-table-v5-prototype-charcoal-references--saved-queries",
    Benchmarks: "application-ui-table-v5-prototype-charcoal-references--benchmarks",
} as const;

export const storyHref = (id: string, docs = false) => `./?path=/${docs ? "docs" : "story"}/${id}`;
export const prototypeHref = (route: string) => {
    const local = typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    return `${local ? "http://localhost:5190/" : "./"}das/v5/#/${route}`;
};
