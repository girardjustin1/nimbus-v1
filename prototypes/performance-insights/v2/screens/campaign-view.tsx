import type { ReactNode } from "react";
import { ArrowRight, CheckCircle, Clock, Copy01, Edit03, PauseCircle, PlayCircle } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import {
    type Campaign,
    PACE_LABEL,
    PACE_MEANING,
    PACE_TEXT,
    appName,
    appPlatform,
    appsSummary,
    compact,
    daysLeft,
    flightRange,
    formatPct,
    notPacing,
    paceDetail,
    paceOf,
    pacingPct,
    usd,
} from "./campaign-data";
import { DELIVERY_DESCRIPTION, type DeliveryVariant, effectiveEcpm, useCampaign } from "./campaign-series";
import { BreadcrumbStrip, PaceDot, StatChip, TrueUp } from "./campaign-ui";
import { DasShell, DeliveryBar, KeywordChip, PINK, Section, StatusDot, TEAL } from "./das-shell";
import { DeliveryChart } from "./delivery-chart";
import { V3_NAV_ITEMS } from "./nav";
import { SortTh, TABLE } from "./nimbus-ui";
import { useTableSort } from "./table-sort";
import { languageLabel } from "./target-data";
import { Button } from "./type-rules";
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
 *   - Targeting: Platform (singular) and an Apps row; no "ANY of" — keywords match on
 *     ANY with no toggle (confirmed 19 Oct). Device Language is back (19 Oct).
 *
 * 28 Oct review (Round 6):
 *   - Campaign Health is Pacing: a real-time percentage to the nearest 0.5%, with the
 *     colour slot beside it (placeholder thresholds until Product sets them).
 *   - The delivery chart plots expected against actual as a share of the goal (0–100%),
 *     not dollars, since spend is no longer real time.
 *   - Every spend figure is the trued-up one and says "Subject to true-up"; the summary
 *     rail is "Delivery", not "Live delivery".
 *
 * Any link may carry ?c=<campaign id>, e.g. #/view-a?c=c2.
 */

export type SummaryVariant = "cards" | "sidebar";

/* ------------------------------------------------------------- Figures --- */

/** "Daily Scores (iOS)", "Daily Scores (Android)" → "Daily Scores (iOS, Android)". */
const groupedApps = (apps: string[]) => {
    const by = new Map<string, string[]>();
    for (const a of apps) {
        const platform = appPlatform(a);
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
    <div
        className={cx("flex flex-col gap-3 rounded-xl p-4 text-md sm:flex-row sm:items-center sm:justify-between", tone === "warn" && "bg-warning-primary")}
        style={tone === "info" ? { backgroundColor: `${TEAL}10` } : undefined}
    >
        <span className="flex items-start gap-3 text-secondary">
            <span className={tone === "warn" ? "text-fg-warning-secondary" : ""} style={tone === "info" ? { color: TEAL } : undefined}>
                {icon}
            </span>
            <span>{children}</span>
        </span>
        {action}
    </div>
);

/**
 * 6 Nov (Product): no coaching — the page states what the data is and never tells the
 * publisher what to do. So no pacing warning strip (pacing lives in its card and the
 * Delivery chart), and no daily target or Resume prompt on a paused campaign.
 */
const StatusBanner = ({ c }: { c: Campaign }) => {
    if (c.status === "Paused")
        return (
            <Banner tone="info" icon={<PauseCircle className="size-5" aria-hidden="true" />}>
                <strong>Paused since Sep 12.</strong> {daysLeft(c)} days left in the flight; {usd(c.budget - c.spend)} of the budget not yet spent.
            </Banner>
        );
    if (c.status === "Scheduled")
        return (
            <Banner tone="info" icon={<Clock className="size-5" aria-hidden="true" />}>
                <strong>Queued. Starts {c.start}.</strong> Delivery and performance appear here once the first impressions are served.
            </Banner>
        );
    return null;
};

const Row = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
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

/** Real-time pacing: the percentage, its colour slot and its word. */
const PacingValue = ({ c }: { c: Campaign }) => {
    const h = paceOf(c);
    const pct = pacingPct(c);
    if (!h || pct === undefined) return <span className="text-tertiary">—</span>;
    return (
        <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1" title={PACE_MEANING[h]}>
            <span className="inline-flex items-center gap-2 tabular-nums">
                <PaceDot health={h} size={12} />
                {formatPct(pct)}
            </span>
            <span className="text-lg font-bold" style={{ color: PACE_TEXT[h] }}>
                {PACE_LABEL[h]}
            </span>
        </span>
    );
};

const pacingSub = (c: Campaign) => (paceOf(c) ? `Live · ${paceDetail(c)}` : notPacing(c));

const SpendLabel = () => (
    <TrueUp>
        <span>Spend</span>
    </TrueUp>
);

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
                    label={<SpendLabel />}
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
            <StatChip label="Pacing" sub={pacingSub(c)}>
                <PacingValue c={c} />
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
        <h3 className="text-lg font-extrabold text-primary">Delivery</h3>
        {c.rule !== "Fallback" && (
            // Without the bar's own pace label: Pacing below says it.
            <div className="flex flex-col gap-1.5">
                <span className="text-md text-secondary">
                    <span className="font-semibold text-primary">{c.budget ? Math.round((c.spend / c.budget) * 100) : 0}%</span> spent
                </span>
                <DeliveryBar campaign={c} showLabels={false} />
            </div>
        )}
        <dl className="divide-y divide-secondary border-y border-secondary">
            {c.rule !== "Fallback" && (
                <Row label={<SpendLabel />}>
                    {usd(c.spend)} <span className="text-tertiary">of {usd(c.budget)}</span>
                </Row>
            )}
            <Row label="Pacing">
                <PacingValue c={c} />
            </Row>
            <Row label="Impressions">{c.impressions ? compact(c.impressions) : "—"}</Row>
            {c.rule !== "Fallback" && <Row label="Effective eCPM">{c.impressions ? usd(effectiveEcpm(c), 2) : "—"}</Row>}
            <Row label="Days left">
                {c.status === "Scheduled" ? c.flightDays : daysLeft(c)} of {c.flightDays}
            </Row>
        </dl>
        <p className="text-md text-tertiary">{pacingSub(c)}</p>
    </aside>
);

/* ============================================================ Overview === */

export const ViewOnePage = ({
    id = "c1",
    published = false,
    summary = "cards",
    delivery = "overlay",
}: {
    id?: string;
    published?: boolean;
    summary?: SummaryVariant;
    /** 6 Nov: the Delivery chart is A (actual numbers, one chart). Storybook passes the other concepts. */
    delivery?: DeliveryVariant;
}) => {
    const chart = delivery;
    const c = useCampaign(id);
    // 6 Nov: every table sorts, the creative list included.
    const creatives = useTableSort(c.creativeList, (cr, key) => cr[key as "name" | "type" | "size"]);
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
                        : "One summary: Round 3's delivery rail beside the chart, with Pacing in it.",
                    "Pacing is real time, to the nearest 0.5%: the share of budget delivered against the share of the flight gone. Colours use placeholder thresholds.",
                    "The chart plots expected against actual delivery as a share of the goal (0–100%). Spend is trued up, so it says “Subject to true-up”.",
                    "No creative previews — the Creative section lists the creatives by name.",
                ],
            }}
        >
            <BreadcrumbStrip trail={[{ label: "Campaigns", href: "#/campaigns" }, { label: c.name }]} />
            <div className="flex flex-col gap-6 px-8 py-8">
                {published && (
                    <div
                        role="status"
                        className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-md"
                        style={{ backgroundColor: `${TEAL}14`, color: "#1F7F80" }}
                    >
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
                            description={
                                fallback
                                    ? "Fallback campaigns have no budget, so delivery is shown as impressions, with the opportunity each day below."
                                    : DELIVERY_DESCRIPTION[chart]
                            }
                            trailing={scheduled ? undefined : <FullPerformanceLink c={c} />}
                        >
                            {scheduled ? <EmptyDelivery c={c} /> : <DeliveryChart c={c} variant={chart} />}
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
                                <Row label="Device Language">{c.languages.length ? c.languages.map(languageLabel).join(", ") : "All languages"}</Row>
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
                            {/* 26 Oct: a list inside a section — list header and column rules, framed rather than full bleed. */}
                            <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                                <table className={TABLE.table}>
                                    <thead>
                                        <tr>
                                            {(
                                                [
                                                    ["name", "Creative"],
                                                    ["type", "Ad Type"],
                                                    ["size", "Ad Size"],
                                                ] as const
                                            ).map(([id, h]) => (
                                                <SortTh key={id} id={id} sort={creatives.sort} onSort={creatives.onSort} className="first:pl-4 last:pr-4">
                                                    {h}
                                                </SortTh>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {creatives.rows.map((cr, i) => (
                                            <tr key={cr.name} className={cx(i % 2 === 1 && TABLE.list.stripe)}>
                                                <td className={cx(TABLE.list.td, "py-3 font-medium text-primary first:pl-4 last:pr-4")}>{cr.name}</td>
                                                <td className={cx(TABLE.list.td, "py-3 first:pl-4 last:pr-4")}>{cr.type}</td>
                                                <td className={cx(TABLE.list.td, "py-3 first:pl-4 last:pr-4")}>{cr.size}</td>
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
