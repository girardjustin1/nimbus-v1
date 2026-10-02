import { useSyncExternalStore } from "react";

/**
 * The keyword library's data layer — the same shape as asset-data.ts, deliberately.
 *
 * FROM THE CHARTER (das-extended-targeting.md):
 *   - Keywords arrive on `user.keywords`, `app.keywords` and `content.keywords` in the
 *     RTB request, comma-separated. The backend collapses all three into one matching
 *     list, so nothing downstream distinguishes them. We keep the source fields only as
 *     a diagnostic — "is this actually arriving, and from where" — never as a target.
 *   - Matching is case-insensitive membership, so a keyword is stored lower-case and two
 *     spellings that differ only in case are the same keyword.
 *   - Keywords are free text, so unbounded cardinality is a real risk. That risk is what
 *     the health view and the bulk-add validation exist to surface.
 *   - Publishers populate keywords three ways: remote config (recommended), hardcoded
 *     (simplest, most labour) or server-side. Nimbus receives the same request either
 *     way, so the pattern is something we detect and report, not something we configure.
 *   - Reporting guardrail: aggregate metrics on screen; per-keyword delivery metrics via
 *     CSV/API only; no per-keyword charting.
 *
 * DESIGN DECISIONS (nothing in the charter settles these):
 *   - The character rule. Keywords travel inside a comma-separated string, so a comma
 *     can never survive the trip, and leading/trailing whitespace is a silent mismatch.
 *     We allow a–z, 0–9, dot, colon, hyphen and underscore, and require the first
 *     character to be alphanumeric.
 *   - The 64-character ceiling, as a cheap first brake on cardinality.
 *   - The severity split: a malformed keyword is blocked, a redundant one is skipped,
 *     and one that no app has ever sent is only a warning — it may be shipping next week.
 *   - Request volume per keyword is treated as integration health, not reporting. We
 *     show counts of requests carrying a keyword; we never show impressions, revenue or
 *     fill rate per keyword, and we never chart a keyword.
 *   - Every number below is invented sample data for a fictional "Test Publisher".
 *
 * KILLED ON 1 OCT, do not reintroduce: ANY/ALL match logic, and device language.
 */

/** Which RTB field a keyword was observed on. Diagnostic only — matching ignores it. */
export type KeywordSource = "user.keywords" | "app.keywords" | "content.keywords";

/** How a publisher puts keywords into the request. The charter's three patterns. */
export type IntegrationPattern = "Remote config" | "Hardcoded" | "Server-side" | "Not detected";

export interface KeywordEvent {
    when: string;
    what: string;
    who: string;
}

export interface KeywordCampaign {
    name: string;
    deal: string;
    live: boolean;
}

export interface Keyword {
    id: string;
    /** Always lower-case: matching is case-insensitive, so this is the canonical form. */
    value: string;
    note: string;
    campaigns: KeywordCampaign[];
    /** Observed in an RTB request in the last 7 days. */
    seenInTraffic: boolean;
    lastSeen: string | null;
    /** Requests carrying this keyword, last 7 days. Integration health, not delivery. */
    requests7d: number;
    sources: KeywordSource[];
    apps: string[];
    updated: string;
    history: KeywordEvent[];
}

export const liveCampaigns = (k: Keyword) => k.campaigns.filter((c) => c.live);

const seed: Keyword[] = [
    {
        id: "k1",
        value: "sports",
        note: "Follows 2+ teams",
        campaigns: [
            { name: "Sports fans · Interstitial", deal: "Test Deal — Fall Launch", live: true },
            { name: "Sports fans · Inline (ES)", deal: "Test Deal — Fall Launch", live: true },
            { name: "Over 21 · Midwest", deal: "Test Deal — 21+", live: false },
            { name: "Runners · Rewarded", deal: "Test Deal — Outdoor", live: false },
        ],
        seenInTraffic: true,
        lastSeen: "2 minutes ago",
        requests7d: 1284902,
        sources: ["user.keywords", "content.keywords"],
        apps: ["Sample App", "Sample App Lite", "Test Sports App"],
        updated: "Sep 12, 2026",
        history: [
            { when: "Sep 12, 2026", what: "Note changed to “Follows 2+ teams”", who: "you@testpublisher.example" },
            { when: "Sep 2, 2026", what: "Added to Sports fans · Inline (ES)", who: "you@testpublisher.example" },
            { when: "Aug 19, 2026", what: "First seen in traffic from Sample App", who: "Nimbus" },
            { when: "Aug 18, 2026", what: "Added to the library", who: "you@testpublisher.example" },
        ],
    },
    {
        id: "k2",
        value: "over21",
        note: "Age-gated; alcohol eligible",
        campaigns: [
            { name: "Over 21 · Midwest", deal: "Test Deal — 21+", live: true },
            { name: "Fallback · All users", deal: "Test Deal — Fallback", live: false },
            { name: "Sports fans · Inline (ES)", deal: "Test Deal — Fall Launch", live: false },
        ],
        seenInTraffic: true,
        lastSeen: "4 minutes ago",
        requests7d: 612430,
        sources: ["user.keywords"],
        apps: ["Sample App", "Test Sports App"],
        updated: "Sep 10, 2026",
        history: [
            { when: "Sep 10, 2026", what: "Added to Over 21 · Midwest", who: "you@testpublisher.example" },
            { when: "Aug 21, 2026", what: "First seen in traffic from Test Sports App", who: "Nimbus" },
            { when: "Aug 20, 2026", what: "Added to the library", who: "you@testpublisher.example" },
        ],
    },
    {
        id: "k3",
        value: "power-user",
        note: "7+ sessions / week",
        campaigns: [
            { name: "Runners · Rewarded", deal: "Test Deal — Outdoor", live: true },
            { name: "Plant lovers · Always on", deal: "Test Deal — Garden", live: true },
        ],
        seenInTraffic: true,
        lastSeen: "11 minutes ago",
        requests7d: 340118,
        sources: ["user.keywords"],
        apps: ["Sample App"],
        updated: "Sep 8, 2026",
        history: [
            { when: "Sep 8, 2026", what: "Added to Plant lovers · Always on", who: "you@testpublisher.example" },
            { when: "Aug 30, 2026", what: "First seen in traffic from Sample App", who: "Nimbus" },
            { when: "Aug 29, 2026", what: "Added to the library", who: "you@testpublisher.example" },
        ],
    },
    {
        id: "k4",
        value: "night-owl",
        note: "Active after 11pm",
        campaigns: [{ name: "Plant lovers · Always on", deal: "Test Deal — Garden", live: false }],
        seenInTraffic: true,
        lastSeen: "1 hour ago",
        requests7d: 88204,
        sources: ["user.keywords"],
        apps: ["Sample App Lite"],
        updated: "Sep 2, 2026",
        history: [
            { when: "Sep 2, 2026", what: "Added to the library", who: "you@testpublisher.example" },
            { when: "Sep 2, 2026", what: "First seen in traffic from Sample App Lite", who: "Nimbus" },
        ],
    },
    {
        id: "k5",
        value: "tailgate",
        note: "Seasonal, pre-game",
        campaigns: [],
        seenInTraffic: false,
        lastSeen: null,
        requests7d: 0,
        sources: [],
        apps: [],
        updated: "Aug 28, 2026",
        history: [{ when: "Aug 28, 2026", what: "Added to the library", who: "you@testpublisher.example" }],
    },
];

/* ----------------------------------------------------------------- Store --- */

let keywords: Keyword[] = seed;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const useKeywords = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => keywords);

/** Read without subscribing — for validation that runs inside a render or a click. */
export const allKeywords = () => keywords;

export const getKeyword = (id: string) => keywords.find((k) => k.id === id);

export const addKeywords = (values: { value: string; note: string }[]) => {
    const now = Date.now();
    keywords = [
        ...values.map(
            (v, i): Keyword => ({
                id: `k-new-${now}-${i}`,
                value: v.value,
                note: v.note,
                campaigns: [],
                seenInTraffic: incomingByValue(v.value) !== undefined,
                lastSeen: incomingByValue(v.value) ? "just now" : null,
                requests7d: incomingByValue(v.value)?.requests7d ?? 0,
                sources: incomingByValue(v.value)?.sources ?? [],
                apps: incomingByValue(v.value)?.apps ?? [],
                updated: "Just now",
                history: [{ when: "Just now", what: "Added to the library", who: "you@testpublisher.example" }],
            }),
        ),
        ...keywords,
    ];
    emit();
};

export const updateKeyword = (id: string, patch: Partial<Pick<Keyword, "note">>, event?: string) => {
    keywords = keywords.map((k) =>
        k.id === id
            ? {
                  ...k,
                  ...patch,
                  updated: "Just now",
                  history: event ? [{ when: "Just now", what: event, who: "you@testpublisher.example" }, ...k.history] : k.history,
              }
            : k,
    );
    emit();
};

export const deleteKeyword = (id: string) => {
    keywords = keywords.filter((k) => k.id !== id);
    emit();
};

export const resetKeywords = () => {
    keywords = seed;
    emit();
};

/* ------------------------------------------------------------- Validation --- */

/** A keyword can never contain a comma — it travels inside a comma-separated string. */
export const KEYWORD_PATTERN = /^[a-z0-9][a-z0-9._:-]*$/;
export const MAX_KEYWORD_LENGTH = 64;

export type ProblemCode = "invalid-characters" | "too-long" | "duplicate-in-paste" | "casing-collision" | "already-in-library" | "not-in-traffic";

export type Severity = "blocked" | "skipped" | "warning";

export interface Problem {
    code: ProblemCode;
    severity: Severity;
    text: string;
}

export interface ParsedKeyword {
    /** Exactly what was typed, before normalising. */
    raw: string;
    /** What would be stored: trimmed and lower-cased. */
    value: string;
    problems: Problem[];
    /** Blocked lines must be fixed; skipped lines are dropped; warnings still save. */
    outcome: "add" | "skip" | "block";
}

const problemText: Record<ProblemCode, string> = {
    "invalid-characters": "Only a–z, 0–9, dot, colon, hyphen and underscore. A keyword can't contain a comma or a space.",
    "too-long": `Longer than ${MAX_KEYWORD_LENGTH} characters.`,
    "duplicate-in-paste": "Listed more than once in this paste.",
    "casing-collision": "Differs only by case from another keyword. Matching is case-insensitive, so these are the same keyword.",
    "already-in-library": "Already in your library.",
    "not-in-traffic": "No app has sent this in the last 7 days. It won't match anything until one does.",
};

const severityOf: Record<ProblemCode, Severity> = {
    "invalid-characters": "blocked",
    "too-long": "blocked",
    "duplicate-in-paste": "skipped",
    "casing-collision": "skipped",
    "already-in-library": "skipped",
    "not-in-traffic": "warning",
};

const problem = (code: ProblemCode): Problem => ({ code, severity: severityOf[code], text: problemText[code] });

/**
 * Turn a pasted blob into a decision per line. Splits on newlines and commas, because a
 * publisher copying out of their remote config will have one or the other.
 */
export const parseKeywordList = (text: string, existing: Keyword[] = keywords): ParsedKeyword[] => {
    const raws = text
        .split(/[\n,]/)
        .map((t) => t.trim())
        .filter(Boolean);

    const seenExact = new Set<string>();
    const seenNormalised = new Set<string>();

    return raws.map((raw) => {
        const value = raw.toLowerCase();
        const problems: Problem[] = [];

        if (value.length > MAX_KEYWORD_LENGTH) problems.push(problem("too-long"));
        if (!KEYWORD_PATTERN.test(value)) problems.push(problem("invalid-characters"));

        const malformed = problems.length > 0;

        if (seenExact.has(raw)) problems.push(problem("duplicate-in-paste"));
        else if (seenNormalised.has(value)) problems.push(problem("casing-collision"));
        else if (existing.some((k) => k.value === value)) problems.push(problem("already-in-library"));
        // A malformed keyword obviously isn't in traffic; saying so twice is just noise.
        else if (!malformed && !incomingByValue(value)) problems.push(problem("not-in-traffic"));

        seenExact.add(raw);
        seenNormalised.add(value);

        const outcome = problems.some((p) => p.severity === "blocked") ? "block" : problems.some((p) => p.severity === "skipped") ? "skip" : "add";
        return { raw, value, problems, outcome };
    });
};

/* ---------------------------------------------------------------- Traffic --- */

export interface AppTraffic {
    app: string;
    platform: "iOS" | "Android";
    pattern: IntegrationPattern;
    sdk: string;
    requests7d: number;
    /** Share of this app's requests that carried at least one keyword. */
    withKeywords: number;
    sources: KeywordSource[];
    distinctKeywords: number;
}

/** Sample integration picture. One app deliberately sends nothing at all. */
export const appTraffic: AppTraffic[] = [
    { app: "Sample App", platform: "iOS", pattern: "Remote config", sdk: "2.28.0", requests7d: 4210880, withKeywords: 0.978, sources: ["user.keywords", "content.keywords"], distinctKeywords: 34 },
    { app: "Sample App", platform: "Android", pattern: "Remote config", sdk: "2.28.0", requests7d: 3884112, withKeywords: 0.964, sources: ["user.keywords", "content.keywords"], distinctKeywords: 31 },
    { app: "Sample App Lite", platform: "iOS", pattern: "Hardcoded", sdk: "2.19.4", requests7d: 1102340, withKeywords: 0.612, sources: ["user.keywords"], distinctKeywords: 6 },
    { app: "Test Sports App", platform: "Android", pattern: "Server-side", sdk: "2.27.1", requests7d: 2004556, withKeywords: 0.889, sources: ["user.keywords", "app.keywords"], distinctKeywords: 18 },
    { app: "Test Puzzle App", platform: "iOS", pattern: "Not detected", sdk: "2.12.0", requests7d: 940221, withKeywords: 0, sources: [], distinctKeywords: 0 },
];

export interface IncomingKeyword {
    value: string;
    requests7d: number;
    sources: KeywordSource[];
    apps: string[];
}

/**
 * Keywords Nimbus has actually seen. The ones with no matching library entry are the
 * cardinality warning the charter asks us to take seriously — `user_7f3a91c2` is a
 * per-user id leaking into a targeting field, which would explode reporting.
 */
export const incoming: IncomingKeyword[] = [
    { value: "sports", requests7d: 1284902, sources: ["user.keywords", "content.keywords"], apps: ["Sample App", "Sample App Lite", "Test Sports App"] },
    { value: "over21", requests7d: 612430, sources: ["user.keywords"], apps: ["Sample App", "Test Sports App"] },
    { value: "power-user", requests7d: 340118, sources: ["user.keywords"], apps: ["Sample App"] },
    { value: "night-owl", requests7d: 88204, sources: ["user.keywords"], apps: ["Sample App Lite"] },
    { value: "soccer", requests7d: 220114, sources: ["content.keywords"], apps: ["Sample App", "Test Sports App"] },
    { value: "fantasy-football", requests7d: 180002, sources: ["user.keywords"], apps: ["Test Sports App"] },
    { value: "user_7f3a91c2", requests7d: 96445, sources: ["user.keywords"], apps: ["Sample App"] },
    { value: "promo-2026-10-01", requests7d: 54210, sources: ["app.keywords"], apps: ["Test Sports App"] },
    { value: "midwest", requests7d: 41880, sources: ["user.keywords"], apps: ["Sample App Lite"] },
];

export const incomingByValue = (value: string) => incoming.find((i) => i.value === value.toLowerCase());

/**
 * How many distinct keywords Nimbus saw, derived from `incoming` rather than stated.
 *
 * This was a larger fixed number, so that "showing the highest-volume handful, the rest
 * are in the CSV" described something real. It read as a bug instead — the headline count
 * never matched the rows on screen — so the counts now follow the data.
 */
export const DISTINCT_SEEN_7D = incoming.length;

export const totals = () => {
    const requests = appTraffic.reduce((s, a) => s + a.requests7d, 0);
    const withKeywords = appTraffic.reduce((s, a) => s + a.requests7d * a.withKeywords, 0);
    const defined = keywords.length;
    const definedNotSeen = keywords.filter((k) => !k.seenInTraffic).length;
    return {
        requests,
        withKeywords,
        keywordShare: requests ? withKeywords / requests : 0,
        distinctSeen: DISTINCT_SEEN_7D,
        defined,
        definedNotSeen,
        seenNotDefined: DISTINCT_SEEN_7D - (defined - definedNotSeen),
    };
};

/* -------------------------------------------------------------- Formatting --- */

export const fmtInt = (n: number) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });
export const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
