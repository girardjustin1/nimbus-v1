import type { CalendarDate, Time } from "@internationalized/date";
import { END_OF_DAY, START_OF_DAY, nextMonth, todayDate } from "@/pages/deal-activation-system/dates";
import { byMode, rotate } from "../../../shared/demo-fill";
import type { AdUnitType, AuctionRule, MatchLogic } from "./das-data";

/**
 * Campaign Setup — the form model, its presets, and the demo fill data.
 *
 * Split out from the screen so the shared draft store can import the shape without a
 * circular import, the way Studio's draft-store imports from studio-data.
 */

/**
 * Section names use the product's own words (see ../../../src/pages/deal-activation-system/
 * terminology.ts). Staging calls these General / Budget / Targeting / Creative; Auction
 * Rules is a row inside General there, but a section here because the one-page design
 * gives it room.
 */
export const SECTIONS = [
    { id: "deal", title: "General" },
    { id: "rules", title: "Auction Rules" },
    { id: "budget", title: "Budget" },
    { id: "targeting", title: "Targeting" },
    { id: "creative", title: "Creative" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const rules: { id: AuctionRule; hint: string }[] = [
    { id: "Guaranteed", hint: "Prioritize this campaign over open-marketplace (OMP) auctions." },
    { id: "CPM Priority", hint: "Compare this campaign's eCPM to the winning OMP bid and serve whichever is higher." },
    { id: "Always-on CPM Priority", hint: "Like CPM Priority, always competing. The eCPM is the selling value, not a floor." },
    { id: "Fallback", hint: "Serve only when OMP has no fill. No budget or eCPM." },
];

export const deals = [
    { id: "D-10482", label: "Test Deal — Fall Launch", supportingText: "D-10482" },
    { id: "D-10517", label: "Test Deal — 21+", supportingText: "D-10517" },
    { id: "D-10533", label: "Test Deal — Garden", supportingText: "D-10533" },
];

/** `type` is staging's Ad Type, `size` its Ad Size — both verbatim, including casing. */
export interface Creative {
    name: string;
    type: "HTML" | "VAST (xml)";
    size: "Full screen" | "Medium Rectangle" | "Banner" | "N/A";
}

export const library: Creative[] = [
    { name: "SampleApp_Interstitial_A", type: "HTML", size: "Full screen" },
    { name: "SampleApp_Interstitial_B", type: "HTML", size: "Full screen" },
    { name: "SampleApp_Video_15s", type: "VAST (xml)", size: "N/A" },
    { name: "SampleApp_Interstitial_C", type: "HTML", size: "Medium Rectangle" },
];

/** Today is the real date; sample flights run next month so they never go stale. */
export const TODAY = todayDate();
export const FLIGHT = nextMonth();

/* ----------------------------------------------------------------- Form --- */

export interface SetupForm {
    dealId?: string;
    name: string;
    rule?: AuctionRule;
    budget: string;
    ecpm: string;
    start?: CalendarDate;
    end?: CalendarDate;
    /** Start and end times (UTC); default to the whole day. */
    startTime?: Time;
    endTime?: Time;
    keywords: string[];
    /** ANY = match any keyword, ALL = every keyword must be present. */
    match: MatchLogic;
    adUnits: AdUnitType[];
    languages: string[];
    creatives: Creative[];
}

const base = { match: "ANY" as MatchLogic, adUnits: [] as AdUnitType[], languages: [] as string[] };
const targeted = { match: "ANY" as MatchLogic, adUnits: ["Interstitial"] as AdUnitType[], languages: ["en"] };

export const presets = {
    ready: {
        ...targeted,
        dealId: "D-10482",
        name: "Sports fans · Interstitial",
        rule: "CPM Priority",
        budget: "25,000.00",
        ecpm: "8.50",
        start: FLIGHT.start,
        end: FLIGHT.end,
        keywords: ["sports", "power-user"],
        creatives: library.slice(0, 2),
    },
    errors: {
        ...targeted,
        dealId: "D-10482",
        name: "Sports fans · Interstitial",
        rule: "CPM Priority",
        budget: "",
        ecpm: "8.50",
        start: FLIGHT.start,
        end: FLIGHT.end,
        keywords: ["sports", "power-user"],
        creatives: library.slice(0, 3),
    },
    fallback: {
        ...targeted,
        dealId: "D-10482",
        name: "Fallback · Sports fans",
        rule: "Fallback",
        budget: "",
        ecpm: "",
        start: FLIGHT.start,
        end: undefined,
        keywords: ["sports"],
        creatives: [],
    },
    datesInvalid: {
        ...targeted,
        dealId: "D-10482",
        name: "Sports fans · Interstitial",
        rule: "CPM Priority",
        budget: "25,000.00",
        ecpm: "8.50",
        start: FLIGHT.start.add({ days: 14 }),
        end: FLIGHT.start.add({ days: 9 }),
        keywords: ["sports", "power-user"],
        creatives: library.slice(0, 2),
    },
    empty: { ...base, name: "", budget: "", ecpm: "", keywords: [], creatives: [] },
} satisfies Record<string, SetupForm>;

/* Step-by-step progress through the form (empty → ready), and edge cases where exactly
   one thing is wrong on an otherwise complete form. */
const ready = presets.ready as SetupForm;
const stepPresets = {
    stepDeal: { ...presets.empty, dealId: ready.dealId, name: ready.name },
    stepRules: { ...presets.empty, dealId: ready.dealId, name: ready.name, rule: ready.rule },
    stepBudget: { ...ready, keywords: [], creatives: [], ...base },
    stepTargeting: { ...ready, creatives: [] },
    noName: { ...ready, name: "" },
    noBudget: { ...ready, budget: "" },
    noKeywords: { ...ready, keywords: [] },
    noCreative: { ...ready, creatives: [] },
    mixedCreative: { ...ready, creatives: library.slice(0, 3) },
    fallbackReady: { ...ready, name: "Fallback · Sports fans", rule: "Fallback", budget: "", ecpm: "", creatives: library.slice(0, 2) },
} satisfies Record<string, SetupForm>;

export const allPresets: Record<string, SetupForm> = { ...presets, ...stepPresets };

export type SetupPreset = keyof typeof presets | keyof typeof stepPresets;

/* ------------------------------------------------------------ Validation --- */

export interface Issue {
    section: SectionId;
    field: string;
    text: string;
}

export const validate = (f: SetupForm): Issue[] => {
    const issues: Issue[] = [];
    if (!f.dealId) issues.push({ section: "deal", field: "deal", text: "Choose a deal" });
    if (!f.name.trim()) issues.push({ section: "deal", field: "name", text: "Name the campaign" });
    if (!f.rule) issues.push({ section: "rules", field: "rule", text: "Pick an auction rule" });
    if (f.rule && f.rule !== "Fallback") {
        if (!f.budget.trim()) issues.push({ section: "budget", field: "budget", text: "Budget is required" });
        if (!f.ecpm.trim()) issues.push({ section: "budget", field: "ecpm", text: "eCPM is required" });
    }
    const startAt = f.start && { d: f.start, t: f.startTime ?? START_OF_DAY };
    const endAt = f.end && { d: f.end, t: f.endTime ?? END_OF_DAY };
    if (!startAt) issues.push({ section: "budget", field: "start", text: "Pick a start date and time" });
    else if (startAt.d.compare(TODAY) < 0) issues.push({ section: "budget", field: "start", text: "Start is in the past" });
    if (!endAt) issues.push({ section: "budget", field: "end", text: "Pick an end date and time" });
    else if (startAt && (endAt.d.compare(startAt.d) < 0 || (endAt.d.compare(startAt.d) === 0 && endAt.t.compare(startAt.t) <= 0)))
        issues.push({ section: "budget", field: "end", text: "End is before the start" });
    if (!f.creatives.length) issues.push({ section: "creative", field: "creatives", text: "Add at least one creative" });
    else if (new Set(f.creatives.map((c) => c.type)).size > 1) issues.push({ section: "creative", field: "creatives", text: "Creatives mix HTML and VAST (xml)" });
    return issues;
};

/** A section is "started" once any of its inputs has a value — drives the empty-state rail. */
export const started = (f: SetupForm, s: SectionId) =>
    s === "deal"
        ? Boolean(f.dealId || f.name)
        : s === "rules"
          ? Boolean(f.rule)
          : s === "budget"
            ? Boolean(f.budget || f.ecpm || f.start || f.end)
            : s === "targeting"
              ? f.keywords.length > 0 || f.adUnits.length > 0 || f.languages.length > 0
              : f.creatives.length > 0;

export const flightDays = (f: SetupForm) => (f.start && f.end && f.end.compare(f.start) >= 0 ? f.end.compare(f.start) + 1 : undefined);

/* ----------------------------------------------------------- Demo fill --- */

/**
 * What a click puts in each field.
 *
 * **Good** is valid and lets the flow proceed. **Bad** breaks a rule the validator
 * actually checks, so the error states appear on demand: a name that is only spaces, a
 * start in the past, an end before the start, and creatives that mix HTML with VAST.
 */
export const fill = {
    dealId: () => rotate(deals).id,
    name: () => byMode(rotate(["Sports fans · Interstitial", "Night owls · Rewarded", "Commuters · Inline"]), "   "),
    rule: (): AuctionRule => byMode("CPM Priority", "CPM Priority"),
    budget: () => byMode(rotate(["25,000.00", "40,000.00", "12,500.00"]), "25,000.00"),
    ecpm: () => byMode(rotate(["8.50", "12.00", "6.25"]), "8.50"),
    /** Bad: a start already in the past, which the validator rejects. */
    start: () => byMode(FLIGHT.start, TODAY.subtract({ days: 7 })),
    /** Bad: an end five days before the start. */
    end: () => byMode(FLIGHT.end, FLIGHT.start.subtract({ days: 5 })),
    keywords: () => byMode(rotate([["sports", "power-user"], ["night-owl", "commuter"], ["over21", "midwest"]]), ["sports"]),
    adUnits: (): AdUnitType[] => byMode(["Interstitial"], ["Interstitial"]),
    languages: () => byMode(["en"], ["en"]),
    /** Bad: HTML plus a VAST video in one campaign. */
    creatives: () => byMode(library.slice(0, 2), [library[0], library[2]]),
};

/** Everything a blank form needs, in one go. Used by the toolbar's "Fill page". */
export const fillAll = (f: SetupForm): Partial<SetupForm> => {
    const next: Partial<SetupForm> = {};
    if (!f.dealId) next.dealId = fill.dealId();
    if (!f.name.trim()) next.name = fill.name();
    if (!f.rule) next.rule = fill.rule();
    const rule = next.rule ?? f.rule;
    if (rule !== "Fallback") {
        if (!f.budget) next.budget = fill.budget();
        if (!f.ecpm) next.ecpm = fill.ecpm();
    }
    if (!f.start) next.start = fill.start();
    if (!f.end && rule !== "Fallback") next.end = fill.end();
    if (!f.keywords.length) next.keywords = fill.keywords();
    if (!f.adUnits.length) next.adUnits = fill.adUnits();
    if (!f.languages.length) next.languages = fill.languages();
    if (!f.creatives.length) next.creatives = fill.creatives();
    return next;
};

/** In bad mode, overwrite the fields whose wrong values are the point. */
export const spoilAll = (f: SetupForm): Partial<SetupForm> => ({
    ...fillAll(f),
    name: fill.name(),
    start: fill.start(),
    end: fill.end(),
    creatives: fill.creatives(),
});
