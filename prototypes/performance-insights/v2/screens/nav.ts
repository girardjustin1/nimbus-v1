import { type GlobalNavItem, type GlobalNavSection, navSections } from "@/components/application/global-nav/config";

/**
 * The full application's Global Nav — Nov 13 style guide.
 *
 * Every item leads to its rebuilt screen, in the order and with the names the live
 * dashboard uses (reference/111326). Items for pages outside the rebuild ("log out")
 * stay labels, as on staging.
 *
 * Screens link to each other by these routes, so they live in one place: a screen file
 * imports ROUTES rather than spelling "#/…" itself.
 */
export const ROUTES = {
    // Reporting
    keyMetrics: "#/key-metrics",
    realtime: "#/realtime",
    piSaved: "#/pi-saved",
    piQuery: "#/pi-query",
    buyerBreakdown: "#/buyer-breakdown",
    benchmarks: "#/benchmarks",
    leaderboard: "#/benchmarks-leaderboard",
    // Demand
    configureDemand: "#/demand-configure",
    configurePartner: "#/demand-configure-partner",
    activeDemand: "#/demand-active",
    nplusDemand: "#/demand-nplus",
    nplusPayments: "#/nplus-payments",
    nplusCompleted: "#/nplus-payments-completed",
    // Deal Activation System (from DAS Round 6)
    assets: "#/asset-view",
    keywords: "#/keyword-view",
    setup: "#/setup-empty",
    campaigns: "#/campaigns",
    // AdOps
    adBlocking: "#/ad-blocking",
    floors: "#/floors",
    floorsConfigure: "#/floors-configure",
    testMode: "#/test-mode",
    discrepancy: "#/discrepancy-reports",
    activity: "#/activity",
    // SDK & Docs
    sdks: "#/sdks",
    // Finance
    payee: "#/finance-payee",
    payments: "#/finance-payments",
    invoices: "#/finance-invoices",
    // Settings
    settings: "#/settings",
    reportingApi: "#/settings-api",
} as const;

/** The DAS items (kept for the DAS screens forked from Round 6, which pass them to DasShell). */
export const V3_NAV_ITEMS: GlobalNavItem[] = [
    { key: "manage assets", label: "manage assets", href: ROUTES.assets },
    { key: "keyword library", label: "manage keywords", href: ROUTES.keywords },
    { key: "deal activation setup", label: "deal activation setup", href: ROUTES.setup },
    { key: "manage campaigns", label: "manage campaigns", href: ROUTES.campaigns },
];

const reference = Object.fromEntries(navSections.flatMap((s) => s.items).map((i) => [i.key, i]));
/** Keep the reference nav's icon for an item, drop its badge (the live dashboard shows none). */
const item = (key: string, label: string, href?: string): GlobalNavItem => ({ key, label, href, icon: reference[key]?.icon });

const ALL_NAV_SECTIONS: GlobalNavSection[] = [
    {
        id: "reporting",
        label: "Reporting",
        items: [
            item("key metrics", "key metrics", ROUTES.keyMetrics),
            item("realtime dashboard", "realtime dashboard", ROUTES.realtime),
            item("performance insights", "performance insights", ROUTES.piSaved),
            item("buyer breakdown", "buyer breakdown", ROUTES.buyerBreakdown),
            item("nimbus benchmarks", "nimbus benchmarks", ROUTES.benchmarks),
        ],
    },
    {
        id: "demand",
        label: "Demand",
        items: [
            item("configure demand", "configure demand", ROUTES.configureDemand),
            item("manage active demand", "manage active demand", ROUTES.activeDemand),
            item("manage active n+ demand", "manage active n+ demand", ROUTES.nplusDemand),
            item("n+ payments", "n+ payments", ROUTES.nplusPayments),
        ],
    },
    { id: "das", label: "Deal Activation System", items: V3_NAV_ITEMS },
    {
        id: "adops",
        label: "AdOps",
        items: [
            item("ad blocking", "ad blocking", ROUTES.adBlocking),
            item("floors", "floors", ROUTES.floors),
            item("manage test mode", "manage test mode", ROUTES.testMode),
            item("discrepancy reports", "discrepancy reports", ROUTES.discrepancy),
            item("activity", "activity", ROUTES.activity),
        ],
    },
    {
        id: "sdk",
        label: "SDK & Docs",
        items: [item("SDKs", "SDKs", ROUTES.sdks), item("documentation", "documentation")],
    },
    {
        id: "finance",
        label: "Finance",
        items: [
            item("n+ payee registration", "n+ payee registration", ROUTES.payee),
            item("n+ payment history", "n+ payment history", ROUTES.payments),
            item("n+ invoice history", "n+ invoice history", ROUTES.invoices),
        ],
    },
    {
        id: "settings",
        label: "Settings",
        items: [item("settings", "settings", ROUTES.settings), item("log out", "log out")],
    },
];

/**
 * Round 2 is about Performance Insights only (owner, Nov 24): every other item stays in the
 * nav, as in the app, but as a label that goes nowhere. The shell dims them (das-shell.tsx).
 */
export const APP_NAV_SECTIONS: GlobalNavSection[] = ALL_NAV_SECTIONS.map((section) => ({
    ...section,
    items: section.items.map((i) => (i.key === "performance insights" ? i : { ...i, href: undefined })),
}));

/** Nimbus staff see the admin bar across the top; its pages are outside the rebuild, so its items are labels. */
export const ADMIN_LINKS = [
    "Nimbus Publishers",
    "Nimbus Demand",
    "Nimbus Revenue",
    "Configure Rates",
    "Nimbus+ Payouts",
    "Users",
    "Demand Requests",
    "Ops Reports",
    "Configure Banner",
];
