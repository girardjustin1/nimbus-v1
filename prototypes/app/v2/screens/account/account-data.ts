import { money } from "../sample-data";

/**
 * Sample data for SDK & Docs, Finance and Settings (Nov 13 style guide).
 *
 * Fictional throughout: the accounts, endpoints, payments and invoices below stand in for
 * the staging account's real ones. Endpoints live on api.example.com.
 */

/* ------------------------------------------------------------------ SDKs --- */

export interface Sdk {
    id: "ios" | "android";
    name: string;
    description: string;
    version: string;
}

export const SDKS: Sdk[] = [
    { id: "ios", name: "iOS SDK", description: "The iOS SDK can be integrated manually or via CocoaPods.", version: "2.1.1" },
    { id: "android", name: "Android SDK", description: "The Android SDK can be integrated manually or via Gradle.", version: "2.1.0" },
];

/* --------------------------------------------------------------- Finance --- */

/** The three Finance pages; each embeds the payments provider's frame in production. */
export type FinancePage = "payee" | "payments" | "invoices";

export const FINANCE_TITLES: Record<FinancePage, string> = {
    payee: "Payee registration",
    payments: "Payment history",
    invoices: "Invoice history",
};

export const NO_PERMISSION =
    "You do not have permission to access this page. If you feel you've reached this page in error, please contact your Nimbus Account Manager.";

export type PaymentStatus = "Paid" | "Processing" | "Scheduled";

export interface Payment {
    id: string;
    date: string;
    method: string;
    amount: number;
    status: PaymentStatus;
}

/** Monthly Nimbus+ payouts to the sample publisher, newest first. */
export const PAYMENTS: Payment[] = [
    { id: "PMT-20461", date: "2026-11-15", method: "ACH", amount: 18240.55, status: "Scheduled" },
    { id: "PMT-20388", date: "2026-10-15", method: "ACH", amount: 17105.2, status: "Processing" },
    { id: "PMT-20217", date: "2026-09-15", method: "ACH", amount: 16488.9, status: "Paid" },
    { id: "PMT-20064", date: "2026-08-15", method: "ACH", amount: 15932.14, status: "Paid" },
    { id: "PMT-19893", date: "2026-07-15", method: "Wire transfer", amount: 14710.06, status: "Paid" },
    { id: "PMT-19731", date: "2026-06-15", method: "Wire transfer", amount: 13995.48, status: "Paid" },
    { id: "PMT-19570", date: "2026-05-15", method: "Wire transfer", amount: 12850.0, status: "Paid" },
];

export type InvoiceStatus = "Paid" | "Approved" | "Pending approval";

export interface Invoice {
    id: string;
    date: string;
    period: string;
    amount: number;
    status: InvoiceStatus;
}

export const INVOICES: Invoice[] = [
    { id: "INV-1042", date: "2026-11-01", period: "Oct 2026", amount: 18240.55, status: "Pending approval" },
    { id: "INV-1031", date: "2026-10-01", period: "Sep 2026", amount: 17105.2, status: "Approved" },
    { id: "INV-1019", date: "2026-09-01", period: "Aug 2026", amount: 16488.9, status: "Paid" },
    { id: "INV-1007", date: "2026-08-01", period: "Jul 2026", amount: 15932.14, status: "Paid" },
    { id: "INV-0994", date: "2026-07-01", period: "Jun 2026", amount: 14710.06, status: "Paid" },
    { id: "INV-0982", date: "2026-06-01", period: "May 2026", amount: 13995.48, status: "Paid" },
    { id: "INV-0970", date: "2026-05-01", period: "Apr 2026", amount: 12850.0, status: "Paid" },
];

/** "Nov 15, 2026". */
export const shortDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

export const usd = (n: number) => money(n);

/** The payee form the provider shows, as placeholder fields (label, sample value). */
export const PAYEE_FIELDS: [string, string][] = [
    ["Payee type", "Company"],
    ["Legal name", "Test Publisher LLC"],
    ["Country", "United States"],
    ["Tax form", "W-9"],
    ["Payment method", "ACH"],
    ["Bank account", "•••• 4821"],
];

/* -------------------------------------------------------------- Settings --- */

/** Reporting API accounts: a display name and the account slug the endpoint takes. */
export const API_ACCOUNTS: { name: string; slug: string }[] = [
    { name: "Test Publisher", slug: "testpublisher" },
    { name: "Daily Scores", slug: "dailyscores" },
    { name: "Match Report", slug: "matchreport" },
    { name: "Xtra Innings", slug: "xtrainnings" },
    { name: "Puzzle Parade", slug: "puzzleparade" },
    { name: "Garden Planner", slug: "gardenplanner" },
    { name: "Acorn Games", slug: "acorngames" },
    { name: "Beacon Weather", slug: "beaconweather" },
    { name: "Cedar Studios", slug: "cedarstudios" },
    { name: "Dune Radio", slug: "duneradio" },
    { name: "Ember Reader", slug: "emberreader" },
    { name: "Fjord Fitness", slug: "fjordfitness" },
    { name: "Glacier Maps", slug: "glaciermaps" },
    { name: "Harbor Puzzles", slug: "harborpuzzles" },
    { name: "Iris Photo", slug: "irisphoto" },
    { name: "Juniper Recipes", slug: "juniperrecipes" },
    { name: "Kestrel News", slug: "kestrelnews" },
    { name: "Lantern Trivia", slug: "lanterntrivia" },
    { name: "Meadow Music", slug: "meadowmusic" },
    { name: "Nova Chess", slug: "novachess" },
];

export const endpointFor = (slug: string) => `api.example.com/v2/external/reports/[REPORT_KEY]?account=${slug}`;

/** A fictional key: Generate API Key reveals it masked, with a copy button. */
export const SAMPLE_API_KEY = "nmb_live_7c2e9a41f0b84d36a5e1c9d27b603f9a";
export const maskKey = (key: string) => `${key.slice(0, 9)}${"•".repeat(24)}${key.slice(-4)}`;
