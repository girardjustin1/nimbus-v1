import type { ReactNode } from "react";
import { AlertTriangle, ArrowRight, CheckCircle, Clock, Copy01, Edit03, PauseCircle, PlayCircle, TrendUp01 } from "@untitledui/icons";
import { Area, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "./type-rules";
import { cx } from "@/utils/cx";
import {
    type Campaign,
    HEALTH_COLOR,
    HEALTH_LABEL,
    HEALTH_MEANING,
    appName,
    appsSummary,
    compact,
    daysLeft,
    elapsedDays,
    flightRange,
    healthOf,
    neededPerDay,
    usd,
} from "./campaign-data";
import { BreadcrumbStrip, ChartTooltip, HealthDot, StatChip } from "./campaign-ui";
import { DasShell, DeliveryBar, KeywordChip, PINK, Section, StatusDot, TEAL } from "./das-shell";
import { axis, dailyDelivery, effectiveEcpm, flightDay, useCampaign } from "./campaign-series";
import { V3_NAV_ITEMS } from "./nav";
import { LABEL } from "./type-rules";

/**
 * Deal Activation System → a campaign, once it exists. Round 4 (16 Oct review).
 *
 * Product picked Round 3's one-page view (A) and asked for it tightened:
 *   - The breadcrumb moves into its own strip, in the convention the dashboard already
 *     uses ("← Demand : Add Demand Sources").
 *   - The title is the campaign's name and nothing else. Under it, the things you need
 *     at a glance: running or not, the rule, flight dates, platform and apps. Ad unit and
 *     creative count leave the header.
 *   - One summary, not two. Round 3 had a Live delivery rail and Performance had cards
 *     saying the same things. Which one stays is open, so `summary` switches between them.
 *   - The delivery chart stays, with dollars back in its tooltip, and links to Full
 *     performance — the third screen, where the breakdowns live.
 *   - No creative previews. The Creative section lists the creatives by name.
 *   - Targeting: Platform (singular) and an Apps row; no "ANY of" (match logic was
 *     dropped on 1 Oct).
 *
 * Any link may carry ?c=<campaign id>, e.g. #/view-a?c=c2.
 */

export type SummaryVariant = "cards" | "sidebar";

/* ------------------------------------------------------------- Figures --- */

/** Cumulative delivery against the straight line that spends the budget. */
const series = (c: Campaign) => {
    const daily = dailyDelivery(c);
    let run = 0;
    return Array.from({ length: c.flightDays }, (_, i) => {
        if (i < daily.length) run += daily[i];
        return {
            day: flightDay(c, i),
            n: i + 1,
            Spend: i < daily.length ? Math.round(run) : undefined,
            "On pace": c.budget ? Math.round((c.budget * (i + 1)) / c.flightDays) : undefined,
        };
    });
};

/** "Daily Scores (iOS)", "Daily Scores (Android)" → "Daily Scores (iOS, Android)". */
const groupedApps = (apps: string[]) => {
    const by = new Map<string, string[]>();
    for (const a of apps) {
        const platform = a.match(/\((iOS|Android)\)$/)?.[1];
        const list = by.get(appName(a)) ?? [];
        if (platform) list.push(platform);
        by.set(appName(a), list);
    }
    return [...by].map(([name, p]) => (p.length ? `${name} (${p.join(", ")})` : name));
};

/* ---------------------------------------------------------- Shared bits --- */

const Fact = ({ label, children, title }: { label: string; children: ReactNode; title?: string }) => (
    <div className="flex flex-col gap-0.5">
        <dt className={LABEL}>{label}</dt>
        <dd className="text-md text-secondary" title={title}>
            {children}
        </dd>
    </div>
);

/** Name, state, and the five things Product wants read at a glance. */
const ViewHeader = ({ c }: { c: Campaign }) => (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-display-xs font-extrabold text-primary">{c.name}</h2>
                <StatusDot status={c.status} />
                <span className="rounded-md bg-secondary px-2 py-0.5 text-md font-semibold text-secondary">{c.rule}</span>
            </div>
            <dl className="flex flex-wrap gap-x-10 gap-y-3">
                <Fact label="Flight dates">{flightRange(c)} (UTC)</Fact>
                <Fact label="Platform">{c.platforms}</Fact>
                <Fact label="Apps" title={groupedApps(c.apps).join("\n")}>
                    {appsSummary(c.apps)}
                </Fact>
            </dl>
        </div>
        <div className="flex flex-wrap gap-3">
            {c.status === "Paused" ? (
                <Button color="secondary" iconLeading={PlayCircle}>
                    Resume
                </Button>
            ) : c.status === "Running" ? (
                <Button color="secondary" iconLeading={PauseCircle}>
                    Pause
                </Button>
            ) : null}
            <Button color="secondary" iconLeading={Copy01} href="#/setup-duplicate">
                Duplicate
            </Button>
            <Button color="primary-pink" iconLeading={Edit03} href="#/setup-ready">
                Edit campaign
            </Button>
        </div>
    </div>
);

const Banner = ({ tone, icon, children, action }: { tone: "warn" | "info"; icon: ReactNode; children: ReactNode; action?: ReactNode }) => (
    <div className={cx("flex flex-col gap-3 rounded-xl p-4 text-md sm:flex-row sm:items-center sm:justify-between", tone === "warn" && "bg-warning-primary")} style={tone === "info" ? { backgroundColor: `${TEAL}10` } : undefined}>
        <span className="flex items-start gap-3 text-secondary">
            <span className={tone === "warn" ? "text-fg-warning-secondary" : ""} style={tone === "info" ? { color: TEAL } : undefined}>
                {icon}
            </span>
            <span>{children}</span>
        </span>
        {action}
    </div>
);

const StatusBanner = ({ c }: { c: Campaign }) => {
    const health = healthOf(c);
    if (c.status === "Paused")
        return (
            <Banner tone="warn" icon={<PauseCircle className="size-5" aria-hidden="true" />} action={<Button size="sm" color="secondary">Resume</Button>}>
                <strong>Paused since Sep 12.</strong> The flight keeps running, so {daysLeft(c)} days are left to spend {usd(c.budget - c.spend)}. That's {usd(neededPerDay(c))} a day to finish on budget.
            </Banner>
        );
    if (c.status === "Scheduled")
        return (
            <Banner tone="info" icon={<Clock className="size-5" aria-hidden="true" />}>
                <strong>Queued. Starts {c.start}.</strong> Delivery and performance appear here once the first impressions are served.
            </Banner>
        );
    if (health === "behind" || health === "at risk") {
        const today = c.spend / Math.max(1, elapsedDays(c));
        return (
            <Banner
                tone="warn"
                icon={<AlertTriangle className="size-5" aria-hidden="true" />}
                action={
                    <Button size="sm" color="secondary" iconLeading={TrendUp01}>
                        Raise eCPM
                    </Button>
                }
            >
                <strong>{health === "at risk" ? "At risk." : "Behind, but can catch up."}</strong> {Math.round((c.spend / c.budget) * 100)}% spent with {c.flightElapsed}% of the flight gone. Finishing on budget
                needs {usd(neededPerDay(c))} a day; it's spending {usd(today)}.{health === "at risk" && " Under-delivery on a deal can breach its terms."}
            </Banner>
        );
    }
    return null;
};

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="grid grid-cols-[minmax(88px,180px)_1fr] gap-4 py-2.5 text-md">
        <dt className="text-tertiary">{label}</dt>
        <dd className="font-medium text-primary">{children}</dd>
    </div>
);

const Keywords = ({ c }: { c: Campaign }) =>
    c.keywords.length ? (
        <span className="inline-flex flex-wrap items-center gap-1">
            {c.keywords.map((k) => (
                <KeywordChip key={k} value={k} />
            ))}
        </span>
    ) : (
        <span className="text-tertiary">Everyone (no keyword targeting)</span>
    );

const PaceChart = ({ c, height = 280 }: { c: Campaign; height?: number }) => {
    const data = series(c);
    const fallback = c.rule === "Fallback";
    return (
        <div style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                    <defs>
                        <linearGradient id={`pace-${c.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={TEAL} stopOpacity={0.3} />
                            <stop offset="100%" stopColor={TEAL} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                    <XAxis dataKey="day" {...axis} interval={Math.max(1, Math.round(c.flightDays / 6) - 1)} />
                    <YAxis {...axis} width={64} tickFormatter={(v: number) => (fallback ? compact(v) : `$${compact(v)}`)} />
                    <Tooltip
                        content={
                            <ChartTooltip
                                format={(v) => (fallback ? `${v.toLocaleString("en-US")} impressions` : usd(v))}
                                title={(label) => {
                                    const n = data.findIndex((d) => d.day === label) + 1;
                                    return `${label} · day ${n} of ${c.flightDays}`;
                                }}
                            />
                        }
                    />
                    <Area type="monotone" dataKey="Spend" name={fallback ? "Impressions" : "Spend"} stroke={TEAL} strokeWidth={2} fill={`url(#pace-${c.id})`} isAnimationActive={false} connectNulls={false} />
                    {!fallback && <Line type="linear" dataKey="On pace" stroke={PINK} strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

const Legend = ({ c }: { c: Campaign }) => (
    <div className="flex flex-wrap gap-4 text-md text-tertiary">
        <span className="inline-flex items-center gap-1.5">
            <span className="h-0.5 w-4 rounded" style={{ backgroundColor: TEAL }} /> {c.rule === "Fallback" ? "Cumulative impressions" : "Cumulative spend"}
        </span>
        {c.rule !== "Fallback" && (
            <span className="inline-flex items-center gap-1.5">
                <span className="h-0 w-4 border-t-2 border-dashed" style={{ borderColor: PINK }} /> On pace to spend the budget
            </span>
        )}
    </div>
);

const EmptyDelivery = ({ c }: { c: Campaign }) => (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-secondary px-6 py-12 text-center">
        <Clock className="size-6 text-fg-quaternary" aria-hidden="true" />
        <p className="text-md font-semibold text-primary">No delivery yet</p>
        <p className="max-w-sm text-md text-tertiary">
            {c.name} starts {c.start}. The chart fills in daily from then{c.budget ? `, against a target of ${usd(c.budget / c.flightDays)} a day` : ""}.
        </p>
    </div>
);

const EditLink = () => (
    <a href="#/setup-ready" className="text-md font-semibold whitespace-nowrap uppercase" style={{ color: PINK }}>
        Edit
    </a>
);

export const FullPerformanceLink = ({ c }: { c: Campaign }) => (
    <a href={`#/view-d?c=${c.id}`} className="inline-flex items-center gap-1 text-md font-semibold whitespace-nowrap uppercase" style={{ color: PINK }}>
        Full performance <ArrowRight className="size-4" aria-hidden="true" />
    </a>
);

/* ------------------------------------------------------------ Summary --- */

const HealthValue = ({ c }: { c: Campaign }) => {
    const h = healthOf(c);
    if (!h) return <span className="text-tertiary">—</span>;
    return (
        <span className="inline-flex items-center gap-2" style={{ color: HEALTH_COLOR[h] }}>
            <HealthDot health={h} size={12} />
            {HEALTH_LABEL[h]}
        </span>
    );
};

const healthSub = (c: Campaign) => {
    const h = healthOf(c);
    if (h) return HEALTH_MEANING[h];
    if (c.status === "Scheduled") return `Queued · starts ${c.start}`;
    if (c.status === "Paused") return "Paused, so not pacing";
    if (c.rule === "Fallback") return "Fallback has no budget to pace against";
    return "Not pacing";
};

/** Concept B — the summary as a row of cards above the chart. */
const SummaryCards = ({ c }: { c: Campaign }) => {
    const fallback = c.rule === "Fallback";
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {fallback ? (
                <StatChip label="Impressions" sub="No budget: fills what open marketplace leaves">
                    {compact(c.impressions)}
                </StatChip>
            ) : (
                <StatChip
                    label="Spend"
                    sub={
                        <span className="flex flex-col gap-2">
                            {Math.round((c.spend / c.budget) * 100)}% of {usd(c.budget)}
                            <DeliveryBar campaign={c} showLabels={false} />
                        </span>
                    }
                >
                    {usd(c.spend)}
                </StatChip>
            )}
            <StatChip label="Campaign Health" sub={healthSub(c)}>
                <HealthValue c={c} />
            </StatChip>
            {fallback ? (
                <StatChip label="Daily cap" sub="Impressions per day">
                    {c.dailyCap ? compact(c.dailyCap) : "None"}
                </StatChip>
            ) : (
                <StatChip label="Impressions" sub={c.impressions ? `Effective eCPM ${usd(effectiveEcpm(c), 2)}` : `Bid ${usd(c.ecpm, 2)}`}>
                    {c.impressions ? compact(c.impressions) : "—"}
                </StatChip>
            )}
            <StatChip label="Days left" sub={`of ${c.flightDays} · ends ${c.end}`}>
                {c.status === "Scheduled" ? c.flightDays : daysLeft(c)}
            </StatChip>
        </div>
    );
};

/** Concept A — Round 3's Live delivery rail, beside the chart. */
const SummaryRail = ({ c }: { c: Campaign }) => (
    <aside className="flex flex-col gap-4 rounded-2xl bg-primary p-5 shadow-sm ring-1 ring-secondary xl:sticky xl:top-14 xl:self-start">
        <h3 className="text-lg font-extrabold text-primary">Live delivery</h3>
        {c.rule !== "Fallback" && (
            // Without the bar's own pace label: Campaign Health below says it, in Round 4's words.
            <div className="flex flex-col gap-1.5">
                <span className="text-md text-secondary">
                    <span className="font-semibold text-primary">{c.budget ? Math.round((c.spend / c.budget) * 100) : 0}%</span> spent
                </span>
                <DeliveryBar campaign={c} showLabels={false} />
            </div>
        )}
        <dl className="divide-y divide-secondary border-y border-secondary">
            {c.rule !== "Fallback" && (
                <Row label="Spend">
                    {usd(c.spend)} <span className="text-tertiary">of {usd(c.budget)}</span>
                </Row>
            )}
            <Row label="Health">
                <HealthValue c={c} />
            </Row>
            <Row label="Impressions">{c.impressions ? compact(c.impressions) : "—"}</Row>
            {c.rule !== "Fallback" && <Row label="Effective eCPM">{c.impressions ? usd(effectiveEcpm(c), 2) : "—"}</Row>}
            <Row label="Days left">
                {c.status === "Scheduled" ? c.flightDays : daysLeft(c)} of {c.flightDays}
            </Row>
        </dl>
        <p className="text-md text-tertiary">{healthSub(c)}</p>
    </aside>
);

/* ============================================================ Overview === */

export const ViewOnePage = ({ id = "c1", published = false, summary = "cards" }: { id?: string; published?: boolean; summary?: SummaryVariant }) => {
    const c = useCampaign(id);
    const scheduled = c.status === "Scheduled";
    const fallback = c.rule === "Fallback";
    return (
        <DasShell
            navItems={V3_NAV_ITEMS}
            navKey="manage campaigns"
            concept={{
                label: summary === "cards" ? "Overview · cards" : "Overview · sidebar",
                title: summary === "cards" ? "Campaign overview, summary as cards" : "Campaign overview, summary in a sidebar",
                notes: [
                    "Breadcrumb in its own strip, the way Manage active demand does it.",
                    "The header is the campaign's name, whether it's running, its rule, flight dates, platform and apps. Ad unit and creative count moved down into the sections.",
                    summary === "cards"
                        ? "One summary: four cards across the top, so the chart gets the full width."
                        : "One summary: Round 3's Live delivery rail beside the chart, now with Campaign Health in it.",
                    "The chart's tooltip shows dollars. Full performance, the third screen, is linked from the chart.",
                    "No creative previews — the Creative section lists the creatives by name.",
                ],
            }}
        >
            <BreadcrumbStrip trail={[{ label: "Campaigns", href: "#/campaigns" }, { label: c.name }]} />
            <div className="flex flex-col gap-6 px-8 py-8">
                {published && (
                    <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-md" style={{ backgroundColor: `${TEAL}14`, color: "#1F7F80" }}>
                        <span className="inline-flex items-center gap-2">
                            <CheckCircle className="size-5" aria-hidden="true" />
                            <span>
                                <strong>Published.</strong> {c.name} is queued and starts {c.start} (UTC). You can still edit anything until then.
                            </span>
                        </span>
                        <a href="#/setup-duplicate" className="font-semibold uppercase" style={{ color: PINK }}>
                            Duplicate
                        </a>
                    </div>
                )}
                <ViewHeader c={c} />
                <StatusBanner c={c} />
                {summary === "cards" && <SummaryCards c={c} />}

                <div className={cx("grid grid-cols-1 gap-8", summary === "sidebar" && "xl:grid-cols-[minmax(0,1fr)_320px]")}>
                    <div className="min-w-0">
                        <Section
                            id="v-delivery"
                            title="Delivery"
                            description={fallback ? "Fallback campaigns have no budget, so delivery is shown as impressions." : "Cumulative spend against the straight line that spends the full budget."}
                            trailing={scheduled ? undefined : <FullPerformanceLink c={c} />}
                        >
                            {scheduled ? (
                                <EmptyDelivery c={c} />
                            ) : (
                                <>
                                    <PaceChart c={c} />
                                    <Legend c={c} />
                                </>
                            )}
                        </Section>
                        <Section id="v-deal" title="General" trailing={<EditLink />}>
                            <dl className="divide-y divide-secondary">
                                <Row label="Deal">
                                    {c.dealName} · {c.dealId}
                                </Row>
                                <Row label="Campaign name">{c.name}</Row>
                            </dl>
                        </Section>
                        <Section id="v-rules" title="Auction rules" trailing={<EditLink />}>
                            <dl className="divide-y divide-secondary">
                                <Row label="Rule">{c.rule}</Row>
                                <Row label="Priority">Even distribution</Row>
                            </dl>
                        </Section>
                        <Section id="v-budget" title="Budget" trailing={<EditLink />}>
                            <dl className="divide-y divide-secondary">
                                {!fallback && <Row label="Budget">{usd(c.budget)}</Row>}
                                {!fallback && <Row label="Bid Amount (eCPM)">{usd(c.ecpm, 2)}</Row>}
                                <Row label="Flight dates">{flightRange(c)} (UTC)</Row>
                                <Row label="Daily impression cap">{c.dailyCap ? c.dailyCap.toLocaleString("en-US") : "Disabled"}</Row>
                            </dl>
                        </Section>
                        <Section id="v-targeting" title="Targeting" trailing={<EditLink />}>
                            <dl className="divide-y divide-secondary">
                                <Row label="Geos">{c.geos}</Row>
                                <Row label="Platform">{c.platforms}</Row>
                                <Row label="Apps">{c.apps.length ? groupedApps(c.apps).join(", ") : "All apps"}</Row>
                                <Row label="Ad Unit">{c.adUnits.join(", ") || "All units"}</Row>
                                <Row label="Keywords">
                                    <Keywords c={c} />
                                </Row>
                            </dl>
                        </Section>
                        <Section
                            id="v-creative"
                            title="Creative"
                            description={
                                <>
                                    {c.creativeList.length} from your asset library.{" "}
                                    <a href="#/asset-view" className="font-semibold" style={{ color: TEAL }}>
                                        Manage assets
                                    </a>
                                </>
                            }
                            trailing={<EditLink />}
                        >
                            <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                                <table className="w-full text-left text-md">
                                    <thead className="bg-secondary">
                                        <tr>
                                            {["Creative", "Ad Type", "Ad Size"].map((h) => (
                                                <th key={h} scope="col" className="px-4 py-2.5 font-bold text-primary">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-secondary">
                                        {c.creativeList.map((cr) => (
                                            <tr key={cr.name}>
                                                <td className="px-4 py-3 font-medium text-primary">{cr.name}</td>
                                                <td className="px-4 py-3 text-secondary">{cr.type}</td>
                                                <td className="px-4 py-3 text-secondary">{cr.size}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Section>
                    </div>
                    {summary === "sidebar" && <SummaryRail c={c} />}
                </div>
            </div>
        </DasShell>
    );
};
