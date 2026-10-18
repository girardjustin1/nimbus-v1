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

/** Daily spend (impressions for Fallback) so far, summing to the campaign's total. */
export const dailyDelivery = (c: Campaign) => {
    const n = elapsedDays(c);
    const total = c.rule === "Fallback" ? c.impressions : c.spend;
    const raw = Array.from({ length: n }, (_, i) => wobble(i));
    const scale = total / (raw.reduce((a, b) => a + b, 0) || 1);
    return raw.map((r) => r * scale);
};

export const effectiveEcpm = (c: Campaign) => (c.impressions ? (c.spend / c.impressions) * 1000 : 0);

export const axis = { tickLine: false, axisLine: false, tick: { fontSize: 15, fill: "#667085" } } as const;

