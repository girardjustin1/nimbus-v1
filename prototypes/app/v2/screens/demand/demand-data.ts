import { DEMAND_PARTNERS, seeded } from "../sample-data";

/**
 * Demand — sample data for Configure Demand, Manage Active Demand, Manage Active n+ Demand
 * and n+ Payments (reference/111326, 9.12.10–9.13.06 PM).
 *
 * Fictional throughout: the shared partners from sample-data.ts, plus a few more so the
 * configure list runs as long as staging's (~25). Endpoints use example.com.
 */

/** Extra fictional partners, so the configure list is as long as staging's. */
const MORE_PARTNERS = [
    "Aster Media",
    "Beacon RTB",
    "Cedar Exchange",
    "Driftwood DSP",
    "Ember Ads",
    "Fallback",
    "Granite Demand",
    "Halcyon Ads",
    "Ironbark SSP",
    "Juniper RTB",
    "Kestrel Media",
    "Meridian DSP",
];

/** Partners that also run as Nimbus+ demand: staging marks them "(+)" in the configure list. */
const PLUS = new Set(["Bluefin Exchange", "Cedar Exchange", "Harbor Media", "Juniper RTB", "Lumen RTB", "Quarry Demand", "Vantage RTB", "Zephyr DSP"]);

/** Partners whose demand template hasn't been set, so their configuration can't load. */
const NO_TEMPLATE = new Set(["Aster Media", "Granite Demand", "Kestrel Media"]);

export interface DemandPartner {
    name: string;
    /** Staging's lowercase id, used in the configuration error ("acceleratedsp"). */
    slug: string;
    plus: boolean;
    template: boolean;
    /** Draft Configuration: when a draft was last saved, if there is one. */
    draft?: string;
    /** Ready to Publish: the draft is validated. */
    ready?: boolean;
}

export const slugOf = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

const DRAFTS: Record<string, { draft: string; ready?: boolean }> = {
    "Harbor Media": { draft: "Nov 12, 2026", ready: true },
    "Lumen RTB": { draft: "Nov 10, 2026" },
    "Zephyr DSP": { draft: "Nov 04, 2026", ready: true },
};

export const PARTNERS: DemandPartner[] = [...DEMAND_PARTNERS.filter((p) => p !== "Nimbus+"), ...MORE_PARTNERS]
    .sort((a, b) => a.localeCompare(b))
    .map((name) => ({ name, slug: slugOf(name), plus: PLUS.has(name), template: !NO_TEMPLATE.has(name), ...DRAFTS[name] }));

export const partnerBySlug = (slug: string | null | undefined) => PARTNERS.find((p) => p.slug === slug);

/** The partner the configuration screen opens on by default, and the one whose config fails. */
export const DEFAULT_PARTNER = "harbormedia";
export const ERROR_PARTNER = "astermedia";

/* ------------------------------------------------------------ Endpoints --- */

export const ENDPOINT_GEOS = ["Asia Pacific", "Europe", "Universal", "US East", "US West", "Fallback"] as const;
export type EndpointGeo = (typeof ENDPOINT_GEOS)[number];

/** A partner's saved endpoints: US East and Fallback always, other geos for some partners. */
export const endpointsOf = (p: DemandPartner): Record<EndpointGeo, string> => {
    const url = `http://rtb.${p.slug}.example.com/bid`;
    return {
        "Asia Pacific": seeded(`${p.slug}:apac`) > 0.6 ? `http://apac.${p.slug}.example.com/bid` : "",
        Europe: seeded(`${p.slug}:eu`) > 0.5 ? `http://eu.${p.slug}.example.com/bid` : "",
        Universal: "",
        "US East": url,
        "US West": seeded(`${p.slug}:usw`) > 0.5 ? `http://usw.${p.slug}.example.com/bid` : "",
        Fallback: url,
    };
};

/** Additional Configuration Data: the fields a partner's template asks for. */
export const CONFIG_FIELDS = ["pid"];

/* --------------------------------------------------------- Whitelisted geos --- */

export const REGIONS: { id: string; countries: string[] }[] = [
    { id: "AFRICA", countries: ["Egypt", "Ghana", "Kenya", "Morocco", "Nigeria", "South Africa"] },
    { id: "APAC", countries: ["Australia", "India", "Indonesia", "Japan", "New Zealand", "Philippines", "Singapore", "South Korea"] },
    { id: "EUROPE", countries: ["France", "Germany", "Ireland", "Italy", "Netherlands", "Poland", "Spain", "Sweden", "United Kingdom"] },
    { id: "LATAM", countries: ["Argentina", "Brazil", "Chile", "Colombia", "Mexico", "Peru"] },
    { id: "MIDDLE EAST", countries: ["Israel", "Qatar", "Saudi Arabia", "Turkey", "United Arab Emirates"] },
    { id: "NORTH AMERICA", countries: ["Canada", "United States"] },
];

/* ---------------------------------------------------------- Active demand --- */

export interface ActiveDemand {
    id: string;
    source: string;
    status: "Running" | "Paused";
    /** Undefined: the row has no toggle (Nimbus+ in Manage Active Demand, as on staging). */
    enabled?: boolean;
    /** Daily impression cap; undefined shows "+ ADD". */
    cap?: number;
    type?: string;
    placements?: boolean;
    unpublish?: "on" | "off";
}

/** Manage Active Demand. Nimbus+ heads the list with its other cells empty, as on staging. */
export const ACTIVE_DEMAND: ActiveDemand[] = [
    { id: "nplus", source: "Nimbus+", status: "Running" },
    { id: "northwind", source: "Northwind DSP", status: "Running", enabled: true, cap: 250000, type: "oRTB", placements: true, unpublish: "on" },
    { id: "bluefin", source: "Bluefin Exchange", status: "Running", enabled: true, type: "oRTB", placements: true, unpublish: "on" },
    { id: "pinecrest", source: "Pinecrest SSP", status: "Running", enabled: true, cap: 1000000, type: "oRTB", placements: true, unpublish: "on" },
    { id: "tidewater", source: "Tidewater Ads", status: "Paused", enabled: false, type: "oRTB", placements: true, unpublish: "on" },
];

/** Staging's state: Nimbus+ alone. */
export const ACTIVE_DEMAND_ONE = ACTIVE_DEMAND.slice(0, 1);

/** Manage Active n+ Demand. Unpublish is inactive, as on staging. */
export const NPLUS_DEMAND: ActiveDemand[] = [
    { id: "vantage", source: "Vantage RTB", status: "Running", enabled: true, type: "oRTB", placements: true, unpublish: "off" },
    { id: "harbor", source: "Harbor Media", status: "Running", enabled: true, cap: 500000, type: "oRTB", placements: true, unpublish: "off" },
    { id: "quarry", source: "Quarry Demand", status: "Running", enabled: false, type: "oRTB", placements: true, unpublish: "off" },
];

export const NPLUS_DEMAND_ONE = NPLUS_DEMAND.slice(0, 1);

/* --------------------------------------------------------------- Payments --- */

export type PaymentStatus = "Unsubmitted" | "Submitted" | "Paid";

export interface Payment {
    id: string;
    demand: string;
    status: PaymentStatus;
    amount: number;
    /** ISO date, shown "March 3, 2027". */
    date: string;
}

export interface PaymentMonth {
    /** "2026-11" */
    id: string;
    label: string;
    payments: Payment[];
}

const PAYERS = [
    "Northwind DSP",
    "Bluefin Exchange",
    "Harbor Media",
    "Lumen RTB",
    "Pinecrest SSP",
    "Quarry Demand",
    "Redwood Bidder",
    "Summit Exchange",
    "Vantage RTB",
    "Willow Demand",
    "Zephyr DSP",
    "Cobalt Ads",
];

/** A wide spread like staging's ($0.03 to $25,956.90): most small, a few large. */
const amountOf = (key: string) => Math.round(seeded(key) ** 4 * 30000 * 100) / 100;

const month = (id: string, label: string, status: PaymentStatus, date: string, count: number): PaymentMonth => ({
    id,
    label,
    payments: PAYERS.slice(0, count).map((demand) => ({ id: `${id}:${demand}`, demand, status, amount: amountOf(`${id}:${demand}`), date })),
});

/** Overview: months not yet paid, newest first. */
export const OPEN_MONTHS: PaymentMonth[] = [
    month("2026-11", "November 2026", "Unsubmitted", "2027-03-03", 12),
    month("2026-10", "October 2026", "Submitted", "2027-02-02", 11),
    month("2026-09", "September 2026", "Submitted", "2027-01-05", 10),
];

/** Completed Payments, newest first. */
export const PAID_MONTHS: PaymentMonth[] = [month("2026-08", "August 2026", "Paid", "2026-11-04", 10), month("2026-07", "July 2026", "Paid", "2026-10-06", 9)];

export const longDate = (iso: string) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
