import { readHashParams, writeHashParams } from "../../../../../das/v1/screens/route";
import type { FilterState } from "../../nimbus-ui";
import { DATA_TODAY, DIMS, DIM_VALUES, type Dim, type Interval, METRICS, type Metric, type Range, customRange } from "./insights-data";
import { LONG_ADVERTISERS } from "./long-lists";

/**
 * Performance Insights · Round 2 · data scenarios for every concept screen (prototype tool).
 *
 * The concepts were built on one comfortable query. These fill any concept with the same
 * query, so the team can see each one at its smallest, its busiest and its emptiest:
 *
 *   screen    each screen's own query (no scenario)
 *   minimal   one metric, no breakdown, one day, no filters
 *   many      four metrics, two breakdowns, a few filters, 14 days, compared
 *   worst     every metric, two large breakdowns, filters in six categories (25 advertisers),
 *             30 days, compared: the most a publisher could ask for at once
 *   empty     filters that match nothing
 *   random    a different query for every seed (Shuffle)
 *
 * The choice is kept in the address (`?scenario=worst`, `&seed=` for random) and for the
 * browser tab, so it follows you from concept to concept.
 */

export type ScenarioId = "screen" | "minimal" | "many" | "worst" | "empty" | "random";
export type ScenarioChart = "table" | "line" | "area" | "bar" | "stacked";

export interface ScenarioQuery {
    metrics: Metric[];
    breakdown: Dim[];
    filters: FilterState;
    range: Range;
    interval: Interval;
    compare: boolean;
    /** Only the random scenario sets a chart type; the others keep each screen's own. */
    chart?: ScenarioChart;
}

export const SCENARIOS: { id: ScenarioId; label: string; title: string }[] = [
    { id: "screen", label: "Screen", title: "Each screen's own query" },
    { id: "minimal", label: "Minimal", title: "One metric, no breakdown, one day, no filters" },
    { id: "many", label: "Many", title: "Four metrics, two breakdowns, a few filters, 14 days, compared" },
    { id: "worst", label: "Worst case", title: "Every metric, two large breakdowns, filters in six categories, 30 days, compared" },
    { id: "empty", label: "No data", title: "Filters that match nothing" },
    { id: "random", label: "Random", title: "A different query each Shuffle" },
];

const f = (values: string[]): { values: string[]; off: string[] } => ({ values, off: [] });

/** A small seeded generator (mulberry32), so a seed always gives the same query. */
const rng = (seed: number) => {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = a;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

const sample = <T>(list: readonly T[], n: number, r: () => number): T[] => {
    const pool = [...list];
    const out: T[] = [];
    while (out.length < n && pool.length) out.push(pool.splice(Math.floor(r() * pool.length), 1)[0]);
    return out;
};

const DAY = 86_400_000;
const back = (n: number) => new Date(Date.parse(`${DATA_TODAY}T00:00:00Z`) - n * DAY).toISOString().slice(0, 10);

export const scenarioQuery = (id: ScenarioId, seed = 1): ScenarioQuery | null => {
    switch (id) {
        case "screen":
            return null;
        case "minimal":
            return { metrics: ["Revenue"], breakdown: [], filters: {}, range: "yesterday", interval: "day", compare: false };
        case "many":
            return {
                metrics: ["Revenue", "Requests", "Impressions", "ECPM"],
                breakdown: ["Platform", "Ad Type"],
                filters: { Country: f(["United States", "Canada", "United Kingdom"]), "Ad Type": f(["Static", "Video"]) },
                range: "14",
                interval: "day",
                compare: true,
            };
        case "worst":
            return {
                metrics: [...METRICS],
                breakdown: ["Country", "Demand Source"],
                filters: {
                    Country: f(DIM_VALUES.Country.slice(0, 6)),
                    "Ad Type": f([...DIM_VALUES["Ad Type"]]),
                    Platform: f([...DIM_VALUES.Platform]),
                    App: f([...DIM_VALUES.App]),
                    "Account Manager": f([...DIM_VALUES["Account Manager"]]),
                    // The data's five advertisers and twenty from the long tail: the longest chip rows.
                    Advertiser: f([...DIM_VALUES.Advertiser, ...LONG_ADVERTISERS.filter((a) => a.endsWith("plus.example")).slice(0, 20)]),
                },
                range: "30",
                interval: "day",
                compare: true,
            };
        case "empty":
            return {
                metrics: ["Revenue", "Impressions"],
                breakdown: ["Platform"],
                // An advertiser the sample data never serves: nothing matches.
                filters: { Advertiser: f(["bluearcadeplus.example"]) },
                range: "7",
                interval: "day",
                compare: false,
            };
        case "random": {
            const r = rng(seed);
            const metrics = sample(METRICS, 1 + Math.floor(r() * 6), r);
            const breakdown = sample(DIMS, Math.floor(r() * 3), r);
            const filters: FilterState = {};
            for (const d of sample(DIMS, Math.floor(r() * 4), r))
                filters[d] = f(sample(DIM_VALUES[d], 1 + Math.floor(r() * Math.min(4, DIM_VALUES[d].length)), r));
            const presets: Range[] = ["yesterday", "7", "14", "30"];
            const end = Math.floor(r() * 20);
            const range = r() < 0.6 ? presets[Math.floor(r() * presets.length)] : customRange(back(end + 3 + Math.floor(r() * 25)), back(end));
            const charts: ScenarioChart[] = ["table", "line", "area", "bar", "stacked"];
            return {
                metrics,
                breakdown,
                filters,
                range,
                interval: r() < 0.75 ? "day" : "week",
                compare: r() < 0.5,
                chart: charts[Math.floor(r() * charts.length)],
            };
        }
    }
};

/* ------------------------------------------------------------- the choice --- */

export interface ScenarioChoice {
    id: ScenarioId;
    seed: number;
}

const KEY = "pi-v2-scenario";
const EVENT = "pi-v2-scenario";
const valid = (id: string | null | undefined): id is ScenarioId => SCENARIOS.some((s) => s.id === id);

let current: ScenarioChoice | null = null;

/** The scenario in use: the address first (a shared link), then the browser tab's last choice. */
export const getScenario = (): ScenarioChoice => {
    if (current) return current;
    const params = typeof window === "undefined" ? new URLSearchParams() : readHashParams();
    const fromUrl = params.get("scenario");
    if (valid(fromUrl)) current = { id: fromUrl, seed: Number(params.get("seed")) || 1 };
    else {
        try {
            const saved = JSON.parse(sessionStorage.getItem(KEY) ?? "null") as ScenarioChoice | null;
            current = saved && valid(saved.id) ? saved : { id: "screen", seed: 1 };
        } catch {
            current = { id: "screen", seed: 1 };
        }
    }
    return current;
};

export const setScenario = (next: ScenarioChoice) => {
    current = next;
    try {
        sessionStorage.setItem(KEY, JSON.stringify(next));
    } catch {
        /* the address still carries it */
    }
    const params = Object.fromEntries(readHashParams());
    writeHashParams({ ...params, scenario: next.id === "screen" ? undefined : next.id, seed: next.id === "random" ? String(next.seed) : undefined });
    window.dispatchEvent(new Event(EVENT));
};

export const subscribeScenario = (onChange: () => void) => {
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
};
