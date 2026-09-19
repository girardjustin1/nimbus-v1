import { useState } from "react";
import { InfoCircle } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "../../das-shell";
import { type Estimate, type Likelihood, type Period, compact, periodFactor, range, usd2 } from "../studio-data";

/**
 * EstimatePanel — the sticky right-hand panel that answers "will this spend?" while
 * you build. Delivery likelihood leads; estimated impressions, reach and eCPM follow,
 * switchable per day, week or month.
 */

const likelihoodTone: Record<Likelihood, { fg: string; bg: string; bar: number }> = {
    High: { fg: "#1F7F80", bg: `${TEAL}24`, bar: 3 },
    Medium: { fg: "#B54708", bg: "#FEF0C7", bar: 2 },
    Low: { fg: "#A94579", bg: `${PINK}24`, bar: 1 },
};

export const LikelihoodMeter = ({ value }: { value: Likelihood }) => {
    const t = likelihoodTone[value];
    return (
        <span className="inline-flex items-center gap-2">
            <span className="rounded-md px-2 py-0.5 text-xs font-bold" style={{ color: t.fg, backgroundColor: t.bg }}>
                {value}
            </span>
            <span className="flex gap-0.5" aria-hidden="true">
                {[1, 2, 3].map((i) => (
                    <span key={i} className="h-1.5 w-5 rounded-full" style={{ backgroundColor: i <= t.bar ? t.fg : "#EAECF0" }} />
                ))}
            </span>
        </span>
    );
};

export const EstimatePanel = ({ estimate, fallback, empty, initialPeriod = "monthly" }: { estimate: Estimate; fallback?: boolean; empty?: boolean; initialPeriod?: Period }) => {
    const [period, setPeriod] = useState<Period>(initialPeriod);
    const k = periodFactor[period];
    return (
        <aside className="flex flex-col gap-4" aria-label="Estimates">
            <div className="flex flex-col gap-2 rounded-2xl bg-secondary p-4">
                <span className="text-sm font-semibold text-primary">Delivery likelihood</span>
                {empty ? <span className="text-sm text-tertiary">Appears once you set a budget and audience.</span> : <LikelihoodMeter value={estimate.likelihood} />}
                {!empty && (
                    <p className="flex gap-2 text-sm text-secondary">
                        <span className="mt-2 size-1 shrink-0 rounded-full bg-fg-secondary" aria-hidden="true" />
                        {estimate.advice}
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl bg-secondary p-4">
                <span className="text-sm font-semibold text-primary">Estimated results</span>
                <div className="flex gap-1" role="tablist" aria-label="Period">
                    {(["monthly", "weekly", "daily"] as Period[]).map((p) => (
                        <button
                            key={p}
                            type="button"
                            role="tab"
                            aria-selected={period === p}
                            onClick={() => setPeriod(p)}
                            className={cx("rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors", period === p ? "bg-[#101828] text-white" : "bg-primary text-secondary hover:bg-primary_hover")}
                        >
                            {p}
                        </button>
                    ))}
                </div>
                <dl className="flex flex-col gap-3">
                    {[
                        { k: "Impressions", v: empty ? "—" : range([estimate.impressions[0] * k, estimate.impressions[1] * k]), tip: "Ads shown, given your audience, bid and budget." },
                        { k: "Reach", v: empty ? "—" : range([estimate.reach[0] * k, estimate.reach[1] * k]), tip: "Unique devices that see the ad at least once." },
                        { k: "eCPM", v: empty ? "—" : fallback ? "Not applicable" : range(estimate.ecpm, usd2), tip: "What you're likely to clear per thousand impressions." },
                        ...(fallback || empty ? [] : [{ k: "Spend", v: `$${compact(estimate.dailySpend * k)}`, tip: "Budget spread evenly across the flight." }]),
                    ].map((row) => (
                        <div key={row.k} className="flex items-start justify-between gap-2">
                            <div>
                                <dt className="text-xs text-tertiary">{row.k}</dt>
                                <dd className="text-sm font-semibold text-primary">{row.v}</dd>
                            </div>
                            <span title={row.tip}>
                                <InfoCircle className="size-4 text-fg-quaternary" aria-label={row.tip} />
                            </span>
                        </div>
                    ))}
                </dl>
                <p className="text-xs text-quaternary">Estimates aren't a guarantee of delivery.</p>
            </div>
        </aside>
    );
};
