import type { FilterState } from "../../nimbus-ui";
import type { ReportChange } from "./assistant-questions";
import { DATA_TODAY, DIMS, DIM_VALUES, type Dim, type Metric, type Range, customRange } from "./insights-data";

/**
 * Performance Insights · Round 2 · C16: reading a chart request typed into the chat.
 *
 * A prototype's stand-in for a model: plain rules over the report's own vocabulary. It finds
 * metrics (with the names people use: “ecpm”, “fill”, “win rate”), breakdowns after “by” or
 * “per”, filter values named in the request (“on iOS”, “in Canada”, a demand partner), dates
 * (“yesterday”, “last 30 days”, “this month”, “past 10 days”), a comparison (“vs”,
 * “compared”, “previous”) and a chart type. What it finds is listed back before anything is
 * built, so a wrong reading is seen and never applied silently.
 */

export interface BuildRequest {
    change: ReportChange;
    /** What was understood, line by line, for the answer. */
    read: [string, string][];
}

/** Longest names first, so “win rate” is read before “wins”. */
const METRIC_WORDS: [RegExp, Metric][] = [
    [/\baverage winning bid( price)?\b|\bwinning bid\b|\bbid price\b/, "Average Winning Bid Price"],
    [/\b(impression )?bid floors?\b|\bfloors?\b/, "Average Impression Bid Floor"],
    [/\bfill( rate)?\b/, "Fill Rate"],
    [/\bwin ?rate\b/, "Win Rate"],
    [/\brender( rate)?\b/, "Render Rate"],
    [/\bctr\b|\bclick[- ]through( rate)?\b/, "CTR"],
    [/\brcpm\b/, "RCPM"],
    [/\becpm\b|\bcpm\b/, "ECPM"],
    [/\brevenue\b|\bearnings\b|\bmoney\b/, "Revenue"],
    [/\brequests?\b/, "Requests"],
    [/\bimpressions?\b|\bimps\b/, "Impressions"],
    [/\bclicks\b/, "Clicks"],
    [/\bwins\b/, "Wins"],
];

/** Names a breakdown goes by, plural included. */
const DIM_WORDS: [RegExp, Dim][] = [
    [/account managers?/, "Account Manager"],
    [/accounts?/, "Account"],
    [/ad ids?/, "Ad ID"],
    [/common ad sizes?/, "Common Ad Size"],
    [/ad sizes?|sizes?/, "Ad Size"],
    [/ad types?|formats?/, "Ad Type"],
    [/ad units?|units?/, "Ad Unit"],
    [/advertisers?|brands?/, "Advertiser"],
    [/app bundles?|bundles?/, "App Bundle"],
    [/app categor(y|ies)|categor(y|ies)/, "App Category"],
    [/app versions?/, "App Version"],
    [/apps?/, "App"],
    [/countr(y|ies)|geos?/, "Country"],
    [/das assets?|assets?/, "DAS Asset"],
    [/das campaigns?|campaigns?/, "DAS Campaign"],
    [/das deals?|deals?/, "DAS Deal"],
    [/demand source pools?|pools?/, "Demand Source Pool"],
    [/demand source types?/, "Demand Source Type"],
    [/internal demand sources?/, "Internal Demand Source"],
    [/demand sources?|demand partners?|partners?|networks?|bidders?/, "Demand Source"],
    [/integration types?|integrations?/, "Integration Type"],
    [/placements?/, "Placement"],
    [/platforms?|os|devices?/, "Platform"],
    [/positions?/, "Position"],
    [/regions?/, "Region"],
    [/sdk versions?|sdks?/, "SDK Version"],
    [/days?|dates?|daily/, "__date" as Dim],
];

/** Values too general to read as a filter on their own. */
const SKIP_VALUES = new Set(["None", "Present", "Absent", "Other", "RTB", "API", "SDK"]);

const DAY = 86_400_000;
const back = (n: number) => new Date(Date.parse(`${DATA_TODAY}T00:00:00Z`) - n * DAY).toISOString().slice(0, 10);
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const rangeOf = (t: string): [Range, string] | null => {
    if (/\byesterday\b/.test(t)) return ["yesterday", "Yesterday"];
    if (/\btoday\b/.test(t)) return [customRange(DATA_TODAY, DATA_TODAY), "Today"];
    if (/\bthis month\b/.test(t)) return [customRange(`${DATA_TODAY.slice(0, 8)}01`, DATA_TODAY), "This month"];
    const n = t.match(/\b(?:last|past|previous)?\s*(\d{1,3})\s*days?\b/);
    if (n) {
        const days = Math.max(1, Math.min(180, Number(n[1])));
        return [customRange(back(days - 1), DATA_TODAY), `Last ${days} days`];
    }
    if (/\b(last|past) (two|2) weeks\b|\bfortnight\b/.test(t)) return ["14", "Last 14 days"];
    if (/\b(last|past|this) week\b|\bweekly\b/.test(t)) return ["7", "Last 7 days"];
    if (/\b(last|past) month\b|\bmonthly\b/.test(t)) return ["30", "Last 30 days"];
    return null;
};

export const parseRequest = (text: string): BuildRequest | null => {
    let t = ` ${text
        .toLowerCase()
        .replace(/[“”"?!]/g, " ")
        .replace(/\s+/g, " ")} `;
    const read: [string, string][] = [];
    const change: ReportChange = {};

    // Dates first: “30 days” is a range, never a breakdown by day.
    const range = rangeOf(t);
    if (range) {
        change.range = range[0];
        read.push(["Dates", range[1]]);
        t = t.replace(
            /\b(?:last|past|previous)?\s*\d{1,3}\s*days?\b|\byesterday\b|\btoday\b|\bthis month\b|\b(last|past|this) (two |2 )?(week|weeks|month)\b/g,
            " ",
        );
    }

    // Breakdowns: whatever follows “by”, “per”, “for each” or “across”, up to two.
    const breakdown: Dim[] = [];
    const after = t.match(/\b(?:by|per|for each|for every|across|split by|broken down by)\s+([a-z0-9 ,&+]+)/);
    if (after) {
        const phrase = after[1].split(/\b(?:for|in|on|from|over|during|as|vs|versus|compared|with|where|only|excluding|last|past|this)\b/)[0];
        for (const part of phrase.split(/,|&|\+|\band\b|\bthen\b/)) {
            const hit = DIM_WORDS.find(([re]) => new RegExp(`^\\s*(the )?(${re.source})\\s*$`).test(part));
            if (hit && hit[1] !== ("__date" as Dim) && !breakdown.includes(hit[1])) breakdown.push(hit[1]);
        }
        // Take out only “by …” up to where the breakdown ends, so the rest (“on iOS”, “compared”) is still read.
        const keyword = after[0].slice(0, after[0].length - after[1].length);
        t = t.replace(keyword + phrase, " ");
    }

    // Metrics, longest names first; each match is taken out so “win rate” is not also “wins”.
    // Each is kept with where it was typed, so they come back in the order they were asked for.
    const found: [number, Metric][] = [];
    for (const [re, m] of METRIC_WORDS) {
        const g = new RegExp(re.source, "g");
        const at = t.search(g);
        if (at >= 0) {
            if (!found.some(([, x]) => x === m)) found.push([at, m]);
            t = t.replace(g, (w) => " ".repeat(w.length));
        }
    }
    const metrics = found.sort((a, b) => a[0] - b[0]).map(([, m]) => m);

    // Filters: any value of any category named in the request.
    const filters: FilterState = {};
    for (const d of DIMS) {
        for (const v of DIM_VALUES[d]) {
            if (SKIP_VALUES.has(v) || v.length < 3) continue;
            if (new RegExp(`(^|[^a-z0-9])${escape(v.toLowerCase())}([^a-z0-9]|$)`).test(t)) {
                filters[d] = { values: [...(filters[d]?.values ?? []), v], off: [] };
            }
        }
    }

    const compare = /\b(compar\w*|vs\.?|versus|previous|prior|week over week|wow|change)\b/.test(t);
    const chart = /\bstacked\b/.test(t)
        ? "stacked"
        : /\bbars?\b|\bcolumns?\b/.test(t)
          ? "bar"
          : /\barea\b/.test(t)
            ? "area"
            : /\blines?\b|\btrend\b/.test(t)
              ? "line"
              : /\btable\b|\bgrid\b|\bspreadsheet\b/.test(t)
                ? "table"
                : undefined;

    if (!metrics.length && !breakdown.length) return null;

    if (metrics.length) {
        change.metrics = metrics;
        read.unshift(["Metrics", metrics.join(", ")]);
    }
    if (breakdown.length) {
        change.breakdown = breakdown.slice(0, 2);
        read.push(["Breakdown", change.breakdown.join(", then ")]);
    } else if (metrics.length) {
        change.breakdown = [];
        read.push(["Breakdown", "None, totals only"]);
    }
    const filterLines = Object.entries(filters).map(([d, f]) => `${d} is ${f.values.join(" or ")}`);
    change.filters = filters;
    read.push(["Filters", filterLines.length ? filterLines.join("; ") : "None"]);
    if (compare) {
        change.compare = true;
        read.push(["Compare", "With the period before"]);
    }
    if (chart) {
        change.chart = chart;
        read.push(["Chart", chart === "table" ? "Table" : chart === "stacked" ? "Stacked bar" : `${chart[0].toUpperCase()}${chart.slice(1)}`]);
    }
    return { change, read };
};

/** Requests offered before anything is typed. */
export const BUILD_EXAMPLES = [
    "Revenue and eCPM by country for the last 30 days, compared",
    "Fill rate by ad type on iOS as a bar chart",
    "Impressions by demand source and platform this month",
];
