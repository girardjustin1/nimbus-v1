import { useState } from "react";
import { nextMonth, shortDay } from "@/pages/deal-activation-system/dates";
import { readHashParams } from "../../v1/screens/route";
import { type Campaign, campaigns, elapsedDays } from "./campaign-data";

/**
 * Round 4 — the figures behind the campaign overview and Full performance: which
 * campaign a link points at, and its day-by-day delivery. Kept out of the screen files
 * so those export components only.
 */

/** The campaign just published from Campaign Setup (it isn't in the sample list yet). */
const justPublished: Campaign = {
    ...campaigns[0],
    id: "new",
    name: `Sports fans (${shortDay(nextMonth().start).split(" ")[0]})`,
    status: "Scheduled",
    spend: 0,
    impressions: 0,
    start: shortDay(nextMonth().start),
    end: shortDay(nextMonth().end),
    flightElapsed: 0,
    creatives: 2,
    creativeList: campaigns[0].creativeList.slice(0, 2),
};

const all = [...campaigns, justPublished];

export const useCampaign = (fallbackId: string) => {
    const [id] = useState(() => readHashParams().get("c") ?? fallbackId);
    return all.find((c) => c.id === id) ?? all.find((c) => c.id === fallbackId)!;
};

/* ------------------------------------------------------------- Figures --- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** The calendar date of day `i` (0-based) of a flight. */
export const flightDay = (c: Campaign, i: number) => {
    const [m, d] = c.start.split(" ");
    const date = new Date(2026, MONTHS.indexOf(m), Number(d) + i);
    return `${MONTHS[date.getMonth()]} ${date.getDate()}`;
};

export const wobble = (i: number) => 1 + Math.sin(i * 1.7) * 0.12 + Math.cos(i * 0.6) * 0.06;

/* --------------------------------------------------------- Opportunity --- */

/**
 * 6 Nov review — the context behind pacing. Requests are ad requests: a user reached a
 * place in the app where an ad can serve. DAUs are daily active users. Together they're
 * the day's opportunity, so a publisher can see whether a pacing dip came from fewer
 * users, or from the same users opening fewer ad slots (frequency caps make the second
 * matter).
 *
 * Requests are in Performance Insights today; DAUs are sample until the backend feed
 * lands. The sample gives each under-delivering campaign its reason: c2 lost users, c8
 * kept its users but they reached fewer ad slots, c3 had a short dip in both.
 */
interface Dip {
    from: number;
    to: number;
    /** Multiplier on users. */
    users: number;
    /** Multiplier on requests per user. */
    perUser: number;
}
const DIPS: Record<string, Dip> = {
    c2: { from: 5, to: 16, users: 0.55, perUser: 0.95 },
    c8: { from: 2, to: 7, users: 0.97, perUser: 0.6 },
    c3: { from: 14, to: 19, users: 0.8, perUser: 0.88 },
};

const dipOn = (c: Campaign, i: number) => {
    const d = DIPS[c.id];
    return d && i >= d.from && i <= d.to ? d : undefined;
};

const weekdayOf = (c: Campaign, i: number) => {
    const [m, d] = c.start.split(" ");
    return new Date(2026, MONTHS.indexOf(m), Number(d) + i).getDay();
};

/** "Sat" — day `i` (0-based) of a flight. */
export const flightWeekday = (c: Campaign, i: number) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][weekdayOf(c, i)];

/** Saturdays are the busiest day in the sample, as in Performance Insights (6 Nov call). */
const dayLift = (c: Campaign, i: number) => {
    const weekday = weekdayOf(c, i);
    return weekday === 6 ? 1.32 : weekday === 0 ? 1.08 : weekday === 5 ? 1.04 : 1;
};

export interface OpportunityDay {
    day: string;
    n: number;
    requests?: number;
    daus?: number;
}

/** Requests and DAUs for each day of the flight; days not reached yet have none. */
export const dailyOpportunity = (c: Campaign): OpportunityDay[] => {
    const elapsed = elapsedDays(c);
    const baseUsers = 600_000 + c.apps.length * 140_000;
    return Array.from({ length: c.flightDays }, (_, i) => {
        const day = flightDay(c, i);
        if (i >= elapsed) return { day, n: i + 1 };
        const dip = dipOn(c, i);
        const users = baseUsers * dayLift(c, i) * (1 + Math.sin(i * 1.1) * 0.04) * (dip?.users ?? 1);
        const perUser = 4.2 * (1 + Math.cos(i * 0.8) * 0.05) * (dip?.perUser ?? 1);
        return { day, n: i + 1, daus: Math.round(users), requests: Math.round(users * perUser) };
    });
};

/** Daily spend (impressions for Fallback) so far, summing to the campaign's total. */
export const dailyDelivery = (c: Campaign) => {
    const n = elapsedDays(c);
    const total = c.rule === "Fallback" ? c.impressions : c.spend;
    // Delivery follows opportunity: the day's lift and any dip, with a little noise.
    const raw = Array.from({ length: n }, (_, i) => {
        const dip = dipOn(c, i);
        return (0.85 + 0.15 * wobble(i)) * dayLift(c, i) * (dip ? dip.users * dip.perUser : 1);
    });
    const scale = total / (raw.reduce((a, b) => a + b, 0) || 1);
    return raw.map((r) => r * scale);
};

export const effectiveEcpm = (c: Campaign) => (c.impressions ? (c.spend / c.impressions) * 1000 : 0);

export const axis = { tickLine: false, axisLine: false, tick: { fontSize: 15, fill: "#667085" } } as const;

/* ------------------------------------------------------ Delivery chart --- */

/**
 * The campaign overview's Delivery chart: Round 6 and the 6 Nov concepts (delivery-chart.tsx).
 * 6 Nov (Product): A, actual numbers on one chart, is the one the overview shows; the
 * others stay in Storybook › Nov 6 Edits for reference.
 */
export type DeliveryVariant = "pacing" | "overlay" | "bars" | "stacked" | "indexed" | "strip" | "labelled" | "backdrop" | "scaled" | "bands";

/** What each variant is, for the overview's section description. */
export const DELIVERY_DESCRIPTION: Record<DeliveryVariant, string> = {
    pacing: "Expected against actual delivery, as a share of the goal.",
    overlay: "Expected against actual delivery, with the day's requests and active users on the right-hand axis.",
    bars: "Expected against actual delivery; bars are the day's active users, the navy line its requests.",
    stacked: "Expected against actual delivery, and below it the opportunity each day: ad requests and active users.",
    indexed: "Each day against normal: delivery against the daily plan, requests and active users against a normal day.",
    strip: "Expected against actual delivery, with each day's requests and active users beneath it.",
    labelled: "Expected against actual delivery as a share of the goal (left), with the day's requests and active users (right).",
    backdrop: "Expected against actual delivery, with the day's requests and active users faint behind it.",
    scaled: "One scale: delivery as a share of the goal; requests and active users as a share of a normal day.",
    bands: "Expected against actual delivery. Shaded days had fewer requests or active users than normal.",
};
