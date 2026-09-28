import { useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { cx } from "@/utils/cx";
import { dailyRevenue } from "../../deal-activation-system/das-data";
import { TEAL } from "../../deal-activation-system/das-shell";
import { dailyRevenueByCampaign, dasSeries } from "./revenue-data";

/**
 * Sept 22 · item 3 — Revenue by day, before and after.
 *
 * Before: one teal DAS block against gray Open Marketplace. After: the same teal block
 * subdivided per campaign, so a reader can tell which campaign the DAS share belongs to
 * and match it against the delivery table below. Open Marketplace is untouched — the ask
 * was to subdivide DAS, not to change the comparison.
 */

const OMP_GRAY = "#98A2B3";
const axisProps = { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#667085" } } as const;
const gridProps = { vertical: false, className: "[&_line]:stroke-border-secondary" } as const;

const Legend = ({ items }: { items: { label: string; color: string; opacity?: number }[] }) => (
    <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-secondary">
        {items.map((s) => (
            <span key={s.label} className="inline-flex items-center gap-2">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color, opacity: s.opacity ?? 1 }} aria-hidden="true" />
                {s.label}
            </span>
        ))}
    </div>
);

const Frame = ({ children }: { children: React.ReactNode }) => <div className="h-72 w-full">{children}</div>;

/** What was reviewed on Sep 22: DAS as a single teal block. */
export const RevenueByDayBefore = () => (
    <div className="flex flex-col gap-4">
        <Frame>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyRevenue} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                    <CartesianGrid {...gridProps} />
                    <XAxis dataKey="day" {...axisProps} />
                    <YAxis {...axisProps} width={56} tickFormatter={(v: number) => `$${v / 1000}k`} />
                    <Tooltip content={<ChartTooltipContent />} cursor={{ className: "fill-secondary" }} />
                    <Bar dataKey="das" name="DAS campaigns" stackId="rev" fill={TEAL} />
                    <Bar dataKey="omp" name="Open Marketplace" stackId="rev" fill={OMP_GRAY} fillOpacity={0.45} radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </Frame>
        <Legend
            items={[
                { label: "DAS campaigns", color: TEAL },
                { label: "Open Marketplace", color: OMP_GRAY, opacity: 0.45 },
            ]}
        />
    </div>
);

/**
 * Revised: one segment per DAS campaign.
 *
 * DAS is about 14% of total revenue, so stacking the campaigns inside the full-height bar
 * makes each one two or three pixels tall — less legible than the single block it
 * replaced, which is the opposite of what the change was for. So the chart gets two views:
 *
 *   DAS campaigns   — scaled to DAS, where the campaigns are actually readable. Default.
 *   Share of total  — the same stack with Open Marketplace on top, which keeps the
 *                     comparison the original chart existed to make.
 *
 * Both are the same data; only the axis changes.
 */
export type RevenueView = "das" | "share";

export const RevenueByDayAfter = ({ view: initialView = "das" }: { view?: RevenueView } = {}) => {
    const [view, setView] = useState<RevenueView>(initialView);
    const withOmp = view === "share";
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-1 self-start rounded-lg bg-secondary p-0.5" role="radiogroup" aria-label="Chart view">
                {(
                    [
                        { id: "das", label: "DAS campaigns" },
                        { id: "share", label: "Share of total" },
                    ] as const
                ).map((v) => (
                    <button
                        key={v.id}
                        type="button"
                        role="radio"
                        aria-checked={view === v.id}
                        onClick={() => setView(v.id)}
                        className={cx(
                            "rounded-md px-3 py-1.5 text-sm font-semibold transition-colors",
                            view === v.id ? "bg-primary text-primary shadow-xs" : "text-tertiary hover:text-secondary",
                        )}
                    >
                        {v.label}
                    </button>
                ))}
            </div>
            <Frame>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dailyRevenueByCampaign} margin={{ top: 8, right: 8, bottom: 0, left: 8 }}>
                        <CartesianGrid {...gridProps} />
                        <XAxis dataKey="day" {...axisProps} />
                        <YAxis {...axisProps} width={56} tickFormatter={(v: number) => `$${v / 1000}k`} />
                        <Tooltip content={<ChartTooltipContent />} cursor={{ className: "fill-secondary" }} />
                        {dasSeries.map((s, i) => (
                            <Bar
                                key={s.id}
                                dataKey={s.id}
                                name={s.name}
                                stackId="rev"
                                fill={s.color}
                                radius={!withOmp && i === dasSeries.length - 1 ? [4, 4, 0, 0] : undefined}
                            />
                        ))}
                        {withOmp && <Bar dataKey="omp" name="Open Marketplace" stackId="rev" fill={OMP_GRAY} fillOpacity={0.45} radius={[4, 4, 0, 0]} />}
                    </BarChart>
                </ResponsiveContainer>
            </Frame>
            <Legend
                items={[
                    ...dasSeries.map((s) => ({ label: s.name, color: s.color })),
                    ...(withOmp ? [{ label: "Open Marketplace", color: OMP_GRAY, opacity: 0.45 }] : []),
                ]}
            />
        </div>
    );
};
