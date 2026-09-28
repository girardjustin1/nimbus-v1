import { campaigns, dailyRevenue } from "../../deal-activation-system/das-data";

/**
 * Sept 22 · item 3 — daily revenue split per DAS campaign.
 *
 * The review asked for the teal DAS block to be stacked by campaign so the chart matches
 * the delivery table underneath it. The series are derived from the same `campaigns`
 * array that table reads, so the two can never disagree about which campaigns exist.
 *
 * Each day's per-campaign values still add up to exactly the `das` figure in the original
 * `dailyRevenue`, so the DAS revenue and share-of-total tiles are unchanged. Only the
 * breakdown is new; the totals are the ones already reviewed.
 */

/** Scheduled campaigns have not run yet, so they contribute nothing to a past window. */
const reported = campaigns.filter((c) => c.status !== "Scheduled");

/** Rough share of the last 14 days, by campaign. Fictional, like everything else here. */
const share: Record<string, number> = { c1: 0.28, c2: 0.09, c3: 0.42, c4: 0.08, c5: 0.13 };

/**
 * Dark to light teal, so the stack still reads as one DAS block against the gray band.
 * The steps are spread wide rather than evenly: adjacent segments sit against each other
 * in the stack, so neighbouring shades need to be told apart at two pixels of separation.
 */
const ramp = ["#0A5455", "#17797A", "#37B6B7", "#79D2D2", "#C2EAEA"];

export interface DasSeries {
    id: string;
    name: string;
    color: string;
}

export const dasSeries: DasSeries[] = reported.map((c, i) => ({ id: c.id, name: c.name, color: ramp[i % ramp.length] }));

export interface DailyRow {
    day: string;
    omp: number;
    /** Revenue for each DAS campaign id (c1, c2, …). */
    [campaignId: string]: string | number;
}

/**
 * Split each day's DAS total across the campaigns. The wobble is a fixed sine, not a
 * random number, so the chart is identical on every render and in every screenshot.
 */
export const dailyRevenueByCampaign: DailyRow[] = dailyRevenue.map((d, dayIndex) => {
    const weights = dasSeries.map((s, i) => (share[s.id] ?? 0.1) * (1 + 0.18 * Math.sin((dayIndex + 1) * (i + 2))));
    const total = weights.reduce((a, b) => a + b, 0);
    const values = weights.map((w) => Math.round((w / total) * d.das));

    // Rounding drift goes on the largest campaign, so the day still totals exactly d.das.
    const drift = d.das - values.reduce((a, b) => a + b, 0);
    values[values.indexOf(Math.max(...values))] += drift;

    const row: DailyRow = { day: d.day, omp: d.omp };
    dasSeries.forEach((s, i) => {
        row[s.id] = values[i];
    });
    return row;
});
