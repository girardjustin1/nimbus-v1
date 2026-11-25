import { useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { cx } from "@/utils/cx";
import { axis } from "../../campaign-series";
import { ChartTooltip } from "../../campaign-ui";
import { DasShell, TEAL } from "../../das-shell";
import { R1, STAGING } from "../../round-1";
import { KM_CARDS, type KmCard, type KmTone, kmAxis, kmValue } from "./dashboard-data";

/**
 * Reporting · key metrics — the all-publisher view (Nimbus Exchange).
 *
 * Staging's grid of nine cards, restyled as the "contained" summary card (27 Oct: bold
 * black title, a light rule and a soft shadow, square corners). Each card's tab strip
 * switches the period or segment and changes the figure (and chart) shown.
 *
 * v2 · Round 1: R1-03 the main numbers, card titles and Today / High lines, and R1-04 the
 * tab labels, go back to staging's (values in ../../round-1).
 */

const NAVY = "#2E5AAC";
/** R1-03: staging's number colours (teal #039C9E, blue #0275AF, black). */
const STAGING_BLUE = "#0275AF";

const VALUE_COLOR: Record<KmTone, string> = { teal: STAGING.teal, navy: STAGING_BLUE, charcoal: STAGING.black };
const LINE_COLOR: Record<KmTone, string> = { teal: TEAL, navy: NAVY, charcoal: TEAL };

/** Staging's layout: three columns, the charted cards two rows tall. */
const PLACE: Record<string, string> = {
    yesterday: "lg:col-start-1 lg:row-start-1 lg:row-span-2",
    arr: "lg:col-start-2 lg:row-start-1",
    gross: "lg:col-start-2 lg:row-start-2",
    "take-rate": "lg:col-start-3 lg:row-start-1 lg:row-span-2",
    "cost-per-auction": "lg:col-start-1 lg:row-start-3 lg:row-span-2",
    proxy: "lg:col-start-2 lg:row-start-3",
    connections: "lg:col-start-3 lg:row-start-3",
    ndr: "lg:col-start-2 lg:row-start-4",
    potential: "lg:col-start-3 lg:row-start-4",
};

const MetricCard = ({ card }: { card: KmCard }) => {
    const [tab, setTab] = useState(card.initial ?? card.tabs[0] ?? "");
    const f = card.figures[tab];
    const unit = card.chart;
    return (
        <section
            aria-label={card.title}
            className={cx("flex min-w-0 flex-col rounded-sm border border-[#E4E4E4] bg-primary shadow-[0_1px_4px_rgba(16,24,40,0.08)]", PLACE[card.id])}
        >
            <div className="flex flex-1 flex-col gap-3 p-6">
                <h2 style={R1.kmTitle}>{card.title}</h2>
                <p style={{ ...R1.kmNumber, color: VALUE_COLOR[card.tone] }}>{f.value}</p>
                {(f.today || f.high) && (
                    <div className="flex flex-col" style={R1.kmNote}>
                        {f.today && (
                            <span>
                                Today: <span style={R1.kmNoteValue}>{f.today}</span>
                            </span>
                        )}
                        {f.high && (
                            <span>
                                High: {f.high.date} <span style={R1.kmNoteValue}>{f.high.value}</span>
                            </span>
                        )}
                    </div>
                )}
                {unit && f.series && (
                    <div className="mt-auto h-64 pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={f.series} margin={{ top: 8, right: 0, bottom: 0, left: 0 }}>
                                <CartesianGrid className="[&_line]:stroke-border-secondary" />
                                <XAxis dataKey="label" {...axis} interval="preserveStartEnd" minTickGap={24} padding={{ left: 24, right: 24 }} tickMargin={8} />
                                <YAxis
                                    {...axis}
                                    orientation="right"
                                    width={unit === "cost" ? 96 : 64}
                                    domain={["auto", "auto"]}
                                    tickFormatter={(v: number) => kmAxis(unit, v)}
                                />
                                <Tooltip content={<ChartTooltip format={(v) => kmValue(unit, v)} />} />
                                <Line dataKey="v" name={card.title} stroke={LINE_COLOR[card.tone]} strokeWidth={2.5} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
            {card.tabs.length > 0 && (
                <div role="tablist" aria-label={`${card.title} period`} className="flex border-t border-secondary">
                    {card.tabs.map((t, i) => {
                        const on = t === tab;
                        return (
                            <button
                                key={t}
                                type="button"
                                role="tab"
                                aria-selected={on}
                                onClick={() => setTab(t)}
                                className={cx(
                                    "flex-1 whitespace-nowrap outline-focus-ring transition-colors duration-100 ease-linear focus-visible:outline-2 focus-visible:-outline-offset-2",
                                    i > 0 && "border-l border-secondary",
                                    !on && "hover:bg-secondary",
                                )}
                                // R1-04: staging's tab label (12px, weight 800, 0.75px, upper case, 43px row).
                                style={{ ...R1.kmTab, ...(on ? { color: STAGING.teal, backgroundColor: `${TEAL}1a` } : { color: STAGING.pink }) }}
                            >
                                {t}
                            </button>
                        );
                    })}
                </div>
            )}
        </section>
    );
};

export const KeyMetrics = () => (
    <DasShell navKey="key metrics" account="exchange">
        <div className="grid grid-cols-1 gap-6 p-8 md:grid-cols-2 lg:grid-cols-3">
            {KM_CARDS.map((card) => (
                <MetricCard key={card.id} card={card} />
            ))}
        </div>
    </DasShell>
);
