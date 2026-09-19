import { type ReactNode, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle, ChevronRight, Clock, Copy01, Edit03, PauseCircle, PlayCircle, TrendUp01 } from "@untitledui/icons";
import { Area, CartesianGrid, ComposedChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartTooltipContent } from "@/components/application/charts/charts-base";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { type Campaign, campaigns, compact, paceOf, usd } from "./das-data";
import { DasShell, DeliveryBar, JumpLink, KeywordChip, PINK, PaceLabel, PinkAction, Section, StatusDot, TEAL } from "./das-shell";
import { readHashParams } from "./route";

/**
 * Deal Activation System → View campaign.
 *
 * A read view for one campaign, drawn in the style of each Round 1 direction so they
 * can be compared like-for-like:
 *   A. One page — the setup page's sections, read-only, with a live delivery rail.
 *   B. Delivery first — pace chart and KPIs lead; settings sit underneath.
 *   C. Campaign sentence — the whole campaign read back as one sentence.
 *   D. Performance — this campaign against open-marketplace, by keyword and unit.
 * Any view accepts ?c=<campaign id> in the link, e.g. #/view-a?c=c3.
 */

/** The campaign just published from Campaign Setup (it isn't in the sample list yet). */
const justPublished: Campaign = {
    id: "new",
    dealId: "D-10482",
    dealName: "Summit Sportswear — Fall Launch",
    name: "Sports fans · Interstitial (Oct)",
    status: "Scheduled",
    rule: "CPM Priority",
    ecpm: 8.5,
    budget: 25000,
    spend: 0,
    impressions: 0,
    start: "Oct 1",
    end: "Oct 31",
    flightElapsed: 0,
    geos: "United States, Canada",
    platforms: "iOS, Android",
    adUnits: ["Interstitial"],
    languages: ["en"],
    keywords: ["sports", "power-user"],
    match: "ANY",
    creatives: 2,
};

const all = [...campaigns, justPublished];

const useCampaign = (fallbackId: string) => {
    const [id] = useState(() => readHashParams().get("c") ?? fallbackId);
    return all.find((c) => c.id === id) ?? all.find((c) => c.id === fallbackId)!;
};

/* ------------------------------------------------------------- Figures --- */

const FLIGHT_DAYS = 30;
const elapsedDays = (c: Campaign) => Math.round((FLIGHT_DAYS * c.flightElapsed) / 100);
const daysLeft = (c: Campaign) => FLIGHT_DAYS - elapsedDays(c);
const wobble = (i: number) => 1 + Math.sin(i * 1.7) * 0.12 + Math.cos(i * 0.6) * 0.06;

/** Cumulative spend (or impressions for Fallback) against the straight-line ideal. */
const series = (c: Campaign) => {
    const n = elapsedDays(c);
    const total = c.rule === "Fallback" ? c.impressions : c.spend;
    const raw = Array.from({ length: n }, (_, i) => wobble(i));
    const scale = total / (raw.reduce((a, b) => a + b, 0) || 1);
    let run = 0;
    return Array.from({ length: FLIGHT_DAYS }, (_, i) => {
        if (i < n) run += raw[i] * scale;
        return {
            day: `Day ${i + 1}`,
            Actual: i < n ? Math.round(run) : undefined,
            "On pace": c.budget ? Math.round((c.budget * (i + 1)) / FLIGHT_DAYS) : undefined,
        };
    });
};

const effectiveEcpm = (c: Campaign) => (c.impressions ? (c.spend / c.impressions) * 1000 : 0);

const axis = { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: "#667085" } } as const;

/* ---------------------------------------------------------- Shared bits --- */

const ViewShell = ({ c, concept, children, published }: { c: Campaign; concept: Parameters<typeof DasShell>[0]["concept"]; children: ReactNode; published?: boolean }) => (
    <DasShell
        navKey="manage campaigns"
        tabs={[
            { label: "Create Campaign", href: "#/setup-empty" },
            { label: "View Campaigns", active: true, href: "#/campaigns" },
        ]}
        concept={concept}
    >
        <div className="flex flex-col gap-6 px-8 py-8">
            {published && (
                <div role="status" className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: `${TEAL}14`, color: "#1F7F80" }}>
                    <span className="inline-flex items-center gap-2">
                        <CheckCircle className="size-5" aria-hidden="true" />
                        <span>
                            <strong>Published.</strong> {c.name} is scheduled and starts {c.start} at 00:00 UTC. You can still edit anything until then.
                        </span>
                    </span>
                    <a href="#/setup-ready" className="font-semibold uppercase" style={{ color: PINK }}>
                        Publish &amp; duplicate
                    </a>
                </div>
            )}
            <ViewHeader c={c} />
            <StatusBanner c={c} />
            {children}
        </div>
    </DasShell>
);

const ViewHeader = ({ c }: { c: Campaign }) => (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex flex-col gap-2">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-tertiary">
                <a href="#/campaigns" className="inline-flex items-center gap-1 font-medium hover:text-secondary">
                    <ArrowLeft className="size-4" aria-hidden="true" /> Campaigns
                </a>
                <ChevronRight className="size-4 text-fg-quaternary" aria-hidden="true" />
                <span>
                    {c.dealName} · {c.dealId}
                </span>
            </nav>
            <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-display-xs font-semibold text-primary">{c.name}</h2>
                <StatusDot status={c.status} />
                <span className="rounded-md bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary">{c.rule}</span>
            </div>
            <span className="text-sm text-tertiary">
                {c.start} – {c.end} (UTC) · {c.adUnits.join(", ")} · {c.creatives} creatives
            </span>
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
            <Button color="secondary" iconLeading={Copy01} href="#/setup-ready">
                Duplicate
            </Button>
            <Button color="primary-pink" iconLeading={Edit03} href="#/setup-ready">
                Edit campaign
            </Button>
        </div>
    </div>
);

const StatusBanner = ({ c }: { c: Campaign }) => {
    const pace = paceOf(c);
    if (c.status === "Paused")
        return (
            <Banner tone="warn" icon={<PauseCircle className="size-5" aria-hidden="true" />} action={<Button size="sm" color="secondary">Resume</Button>}>
                <strong>Paused since Sep 12.</strong> The flight keeps running, so {daysLeft(c)} days are left to spend {usd(c.budget - c.spend)}. That's {usd((c.budget - c.spend) / Math.max(1, daysLeft(c)))} a day to finish on budget.
            </Banner>
        );
    if (c.status === "Scheduled")
        return (
            <Banner tone="info" icon={<Clock className="size-5" aria-hidden="true" />}>
                <strong>Starts {c.start}.</strong> Delivery, pace and performance appear here once the first impressions are served.
            </Banner>
        );
    if (c.status === "Running" && pace === "behind")
        return (
            <Banner tone="warn" icon={<AlertTriangle className="size-5" aria-hidden="true" />} action={<Button size="sm" color="secondary" iconLeading={TrendUp01}>Raise eCPM</Button>}>
                <strong>Behind pace.</strong> {Math.round((c.spend / c.budget) * 100)}% spent with {c.flightElapsed}% of the flight gone. At this rate it finishes around {usd((c.spend / c.flightElapsed) * 100)} of {usd(c.budget)}. Under-delivery on a deal can breach its terms.
            </Banner>
        );
    return null;
};

const Banner = ({ tone, icon, children, action }: { tone: "warn" | "info"; icon: ReactNode; children: ReactNode; action?: ReactNode }) => (
    <div className={cx("flex flex-col gap-3 rounded-xl p-4 text-sm sm:flex-row sm:items-center sm:justify-between", tone === "warn" ? "bg-warning-primary" : "")} style={tone === "info" ? { backgroundColor: `${TEAL}10` } : undefined}>
        <span className={cx("flex items-start gap-3", tone === "warn" ? "text-secondary" : "text-secondary")}>
            <span className={tone === "warn" ? "text-fg-warning-secondary" : ""} style={tone === "info" ? { color: TEAL } : undefined}>
                {icon}
            </span>
            <span>{children}</span>
        </span>
        {action}
    </div>
);

const Kpi = ({ label, value, sub, tone }: { label: string; value: string; sub?: ReactNode; tone?: "warn" }) => (
    <div className="flex flex-col gap-1 rounded-xl p-4 ring-1 ring-secondary">
        <span className="text-sm text-tertiary">{label}</span>
        <span className="text-display-xs font-semibold" style={{ color: tone === "warn" ? PINK : undefined }}>
            {value}
        </span>
        {sub && <span className="text-xs text-tertiary">{sub}</span>}
    </div>
);

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="grid grid-cols-[minmax(88px,180px)_1fr] gap-4 py-2.5 text-sm">
        <dt className="text-tertiary">{label}</dt>
        <dd className="font-medium text-primary">{children}</dd>
    </div>
);

const Keywords = ({ c }: { c: Campaign }) =>
    c.keywords.length ? (
        <span className="inline-flex flex-wrap items-center gap-1">
            <span className="text-xs font-semibold text-tertiary">{c.match} of</span>
            {c.keywords.map((k) => (
                <KeywordChip key={k} value={k} />
            ))}
        </span>
    ) : (
        <span className="text-tertiary">Everyone (no keyword targeting)</span>
    );

const PaceChart = ({ c, height = 260 }: { c: Campaign; height?: number }) => {
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
                    <XAxis dataKey="day" {...axis} interval={4} />
                    <YAxis {...axis} width={56} tickFormatter={(v: number) => (fallback ? compact(v) : `$${compact(v)}`)} />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="Actual" name={fallback ? "Impressions" : "Spend"} stroke={TEAL} strokeWidth={2} fill={`url(#pace-${c.id})`} isAnimationActive={false} connectNulls={false} />
                    {!fallback && <Line type="linear" dataKey="On pace" stroke={PINK} strokeDasharray="5 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />}
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
};

const Legend = ({ c }: { c: Campaign }) => (
    <div className="flex gap-4 text-xs text-tertiary">
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
        <p className="text-sm font-semibold text-primary">No delivery yet</p>
        <p className="max-w-sm text-sm text-tertiary">
            {c.name} starts {c.start}. The pace chart fills in daily from then{c.budget ? `, against a target of ${usd(c.budget / FLIGHT_DAYS)} a day` : ""}.
        </p>
    </div>
);

/* ============================================================ A · One page === */

const VIEW_SECTIONS = [
    { id: "v-delivery", title: "Delivery" },
    { id: "v-deal", title: "Deal & campaign" },
    { id: "v-rules", title: "Auction rules" },
    { id: "v-budget", title: "Budget & flight" },
    { id: "v-targeting", title: "Targeting" },
    { id: "v-creative", title: "Creative" },
];

export const ViewOnePage = ({ id = "c1", published = false }: { id?: string; published?: boolean }) => {
    const c = useCampaign(id);
    const scheduled = c.status === "Scheduled";
    return (
        <ViewShell
            c={c}
            published={published}
            concept={{
                label: "View · A",
                title: "One page, read-only, with a live delivery rail",
                notes: [
                    "Same sections as the one-page setup, so reading a campaign looks like creating one. Each section has its own Edit.",
                    "The right rail swaps the pre-publish checklist for live delivery: spend against budget, a tick for where spend should be, days left.",
                    "Status (paused, behind, scheduled) is a banner above everything, with the fix next to it.",
                ],
            }}
        >
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[170px_minmax(0,1fr)_320px]">
                <nav aria-label="Campaign sections" className="hidden flex-col gap-1 xl:sticky xl:top-14 xl:flex xl:self-start">
                    <span className="mb-2 px-3 text-xs font-semibold text-tertiary uppercase">On this page</span>
                    {VIEW_SECTIONS.map((s) => (
                        <JumpLink key={s.id} to={s.id} className="rounded-lg px-3 py-2 text-sm font-medium text-secondary hover:bg-primary_hover">
                            {s.title}
                        </JumpLink>
                    ))}
                </nav>

                <div className="min-w-0">
                    <Section id="v-delivery" title="Delivery" description={c.rule === "Fallback" ? "Fallback campaigns have no budget, so delivery is shown as impressions." : "Cumulative spend against the straight line that spends the full budget."}>
                        {scheduled ? (
                            <EmptyDelivery c={c} />
                        ) : (
                            <>
                                <PaceChart c={c} />
                                <Legend c={c} />
                            </>
                        )}
                    </Section>
                    <Section id="v-deal" title="Deal & campaign" trailing={<EditLink />}>
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
                    <Section id="v-budget" title="Budget & flight" trailing={<EditLink />}>
                        <dl className="divide-y divide-secondary">
                            {c.rule !== "Fallback" && <Row label="Total budget">{usd(c.budget)}</Row>}
                            {c.rule !== "Fallback" && <Row label="eCPM (bid)">{usd(c.ecpm, 2)}</Row>}
                            <Row label="Flight">
                                {c.start} 00:00 – {c.end} 23:59 (UTC)
                            </Row>
                        </dl>
                    </Section>
                    <Section id="v-targeting" title="Targeting" trailing={<EditLink />}>
                        <dl className="divide-y divide-secondary">
                            <Row label="Geos">{c.geos}</Row>
                            <Row label="Platforms">{c.platforms}</Row>
                            <Row label="Keywords">
                                <Keywords c={c} />
                            </Row>
                            <Row label="Ad unit types">{c.adUnits.join(", ")}</Row>
                            <Row label="Device language">{c.languages.length ? c.languages.join(", ") : "Any"}</Row>
                        </dl>
                    </Section>
                    <Section id="v-creative" title="Creative" trailing={<EditLink />}>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {Array.from({ length: Math.min(c.creatives, 6) }, (_, i) => (
                                <div key={i} className="flex flex-col gap-2 rounded-xl p-3 ring-1 ring-secondary">
                                    <div className="flex aspect-[9/14] items-end rounded-lg p-2 text-xs font-semibold text-white" style={{ background: `linear-gradient(160deg, ${i % 2 ? PINK : TEAL}, #101828)` }}>
                                        {c.adUnits[0]}
                                    </div>
                                    <span className="truncate text-xs font-medium text-secondary">
                                        {c.dealName.split(" ")[0]}_{c.adUnits[0]}_{String.fromCharCode(65 + i)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Section>
                </div>

                <aside className="flex flex-col gap-4 rounded-2xl bg-primary p-5 shadow-sm ring-1 ring-secondary xl:sticky xl:top-14 xl:self-start">
                    <h3 className="text-lg font-semibold text-primary">Live delivery</h3>
                    {c.rule !== "Fallback" && <DeliveryBar campaign={c} />}
                    <dl className="divide-y divide-secondary border-y border-secondary">
                        {c.rule !== "Fallback" && (
                            <Row label="Spend">
                                {usd(c.spend)} <span className="text-tertiary">of {usd(c.budget)}</span>
                            </Row>
                        )}
                        <Row label="Impressions">{compact(c.impressions)}</Row>
                        {c.rule !== "Fallback" && <Row label="Effective eCPM">{c.impressions ? usd(effectiveEcpm(c), 2) : "—"}</Row>}
                        <Row label="Days left">{daysLeft(c)} of {FLIGHT_DAYS}</Row>
                    </dl>
                    {c.rule !== "Fallback" && c.status === "Running" && (
                        <p className="text-xs text-tertiary">
                            Pace <PaceLabel state={paceOf(c)} />: the black tick marks where spend should be at {c.flightElapsed}% of the flight.
                        </p>
                    )}
                    <a href="#/view-d" className="text-sm font-semibold uppercase" style={{ color: PINK }}>
                        Full performance →
                    </a>
                </aside>
            </div>
        </ViewShell>
    );
};

const EditLink = () => (
    <a href="#/setup-ready" className="text-sm font-semibold whitespace-nowrap uppercase" style={{ color: PINK }}>
        Edit
    </a>
);

/* ======================================================= B · Delivery first === */

export const ViewDeliveryFirst = ({ id = "c1" }: { id?: string }) => {
    const c = useCampaign(id);
    const scheduled = c.status === "Scheduled";
    const pace = paceOf(c);
    return (
        <ViewShell
            c={c}
            concept={{
                label: "View · B",
                title: "Delivery first",
                notes: [
                    "Answers “how done is it, and will it finish?” before anything else: four numbers and a pace chart.",
                    "Settings shrink to one card underneath. You rarely re-read them, and Edit is one click away.",
                    "Projected finish turns pacing into a dollar figure a sales team can act on.",
                ],
            }}
        >
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                {c.rule === "Fallback" ? (
                    <Kpi label="Impressions" value={compact(c.impressions)} sub="No budget: serves only when open marketplace doesn't fill" />
                ) : (
                    <Kpi label="Spent" value={usd(c.spend)} sub={`${Math.round((c.spend / (c.budget || 1)) * 100)}% of ${usd(c.budget)}`} />
                )}
                <Kpi label="Flight elapsed" value={`${c.flightElapsed}%`} sub={`${daysLeft(c)} days left · ends ${c.end}`} />
                {c.rule !== "Fallback" && (
                    <Kpi
                        label="Projected finish"
                        value={scheduled ? "—" : usd(Math.min(c.budget, (c.spend / Math.max(1, c.flightElapsed)) * 100))}
                        sub={scheduled ? "Starts " + c.start : <PaceLabel state={pace} />}
                        tone={pace === "behind" ? "warn" : undefined}
                    />
                )}
                <Kpi label="Effective eCPM" value={c.impressions && c.rule !== "Fallback" ? usd(effectiveEcpm(c), 2) : "—"} sub={c.rule === "Fallback" ? "Not applicable" : `Bid ${usd(c.ecpm, 2)}`} />
            </div>

            <div className="flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-secondary">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-semibold text-primary">Pace</h3>
                    <Legend c={c} />
                </div>
                {scheduled ? <EmptyDelivery c={c} /> : <PaceChart c={c} height={300} />}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl p-5 ring-1 ring-secondary">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-primary">Settings</h3>
                    <EditLink />
                </div>
                <dl className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
                    <Row label="Rule · bid">
                        {c.rule}
                        {c.rule !== "Fallback" && ` · ${usd(c.ecpm, 2)}`}
                    </Row>
                    <Row label="Flight">
                        {c.start} – {c.end} (UTC)
                    </Row>
                    <Row label="Where">
                        {c.geos} · {c.platforms}
                    </Row>
                    <Row label="Units · language">
                        {c.adUnits.join(", ")} · {c.languages.join(", ") || "Any"}
                    </Row>
                    <Row label="Keywords">
                        <Keywords c={c} />
                    </Row>
                    <Row label="Creatives">{c.creatives}</Row>
                </dl>
            </div>
        </ViewShell>
    );
};

/* ===================================================== C · Campaign sentence === */

const Token = ({ children, tone = "teal" }: { children: ReactNode; tone?: "teal" | "pink" }) => (
    <a
        href="#/setup-ready"
        className="mx-0.5 inline-flex items-center rounded-md px-1.5 py-0.5 align-baseline font-semibold hover:underline"
        style={{ color: tone === "teal" ? "#1F7F80" : "#A94579", backgroundColor: `${tone === "teal" ? TEAL : PINK}24` }}
    >
        {children}
    </a>
);

export const ViewSentence = ({ id = "c1" }: { id?: string }) => {
    const c = useCampaign(id);
    const fallback = c.rule === "Fallback";
    return (
        <ViewShell
            c={c}
            concept={{
                label: "View · C",
                title: "The campaign as one sentence",
                notes: [
                    "Everything that decides who sees the ad and what it earns, read as one sentence. Each highlighted part opens its setting.",
                    "Easy to paste into an email to an advertiser, and hard to misread (ANY vs ALL, fallback vs guaranteed).",
                    "Delivery sits right under the sentence as plain words, not just a bar.",
                ],
            }}
        >
            <div className="flex flex-col gap-6 rounded-2xl p-6 ring-1 ring-secondary">
                <p className="max-w-4xl text-display-xs leading-[1.6] text-primary">
                    <Token>{c.name}</Token> runs <Token>{c.start}</Token> to <Token>{c.end}</Token> for <Token>{c.dealName}</Token>.{" "}
                    {fallback ? (
                        <>
                            It's a <Token tone="pink">fallback</Token>, so it only serves when the open marketplace has no fill, with no budget.{" "}
                        </>
                    ) : (
                        <>
                            It competes as <Token tone="pink">{c.rule}</Token> at <Token tone="pink">{usd(c.ecpm, 2)}</Token> eCPM with a <Token tone="pink">{usd(c.budget)}</Token> budget.{" "}
                        </>
                    )}
                    It reaches people in <Token>{c.geos}</Token> on <Token>{c.platforms}</Token>
                    {c.keywords.length > 0 ? (
                        <>
                            {" "}
                            whose app sends <Token tone="pink">{c.match === "ANY" ? "any" : "all"}</Token> of{" "}
                            {c.keywords.map((k, i) => (
                                <span key={k}>
                                    {i > 0 && (i === c.keywords.length - 1 ? " and " : ", ")}
                                    <Token>{k}</Token>
                                </span>
                            ))}
                        </>
                    ) : (
                        <> with no keyword targeting</>
                    )}
                    , on <Token>{c.adUnits.join(", ")}</Token> units.
                </p>
                <div className="flex flex-col gap-2 border-t border-secondary pt-5">
                    <p className="text-lg text-secondary">
                        {c.status === "Scheduled" ? (
                            <>Nothing has served yet. It starts {c.start}.</>
                        ) : fallback ? (
                            <>
                                So far it has filled <strong className="text-primary">{compact(c.impressions)}</strong> impressions that would otherwise have gone unsold.
                            </>
                        ) : (
                            <>
                                So far it has spent <strong className="text-primary">{usd(c.spend)}</strong> ({Math.round((c.spend / c.budget) * 100)}%) with {c.flightElapsed}% of the flight gone, which is{" "}
                                <PaceLabel state={paceOf(c)} />.
                            </>
                        )}
                    </p>
                    {!fallback && c.status !== "Scheduled" && (
                        <div className="max-w-md">
                            <DeliveryBar campaign={c} showLabels={false} />
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-3">
                <Button color="secondary" size="sm" iconLeading={Copy01}>
                    Copy as text
                </Button>
                <Button color="secondary" size="sm" href="#/view-a">
                    Switch to form view
                </Button>
            </div>
        </ViewShell>
    );
};

/* ========================================================= D · Performance === */

const keywordSplit = (c: Campaign) => {
    const weights = [0.58, 0.29, 0.13];
    return c.keywords.map((k, i) => ({ keyword: k, impressions: Math.round(c.impressions * (weights[i] ?? 0.1)), share: weights[i] ?? 0.1 }));
};

const ecpmSeries = (c: Campaign) =>
    Array.from({ length: 14 }, (_, i) => ({
        day: `Sep ${5 + i}`,
        "This campaign": +(effectiveEcpm(c) * (0.94 + 0.08 * wobble(i))).toFixed(2),
        "Open marketplace": +(effectiveEcpm(c) * 0.62 * (0.95 + 0.07 * wobble(i + 3))).toFixed(2),
    }));

export const ViewPerformance = ({ id = "c3" }: { id?: string }) => {
    const c = useCampaign(id);
    const hasData = c.impressions > 0 && c.rule !== "Fallback";
    return (
        <ViewShell
            c={c}
            concept={{
                label: "View · D",
                title: "Performance: is this deal worth more than open marketplace?",
                notes: [
                    "Puts this campaign's effective eCPM next to what open marketplace paid for the same inventory. That's the question a publisher asks before renewing a deal.",
                    "Keyword and ad-unit splits show which part of the targeting actually delivered.",
                    "Before any delivery, it explains what will appear instead of showing empty charts.",
                ],
            }}
        >
            {!hasData ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-secondary px-6 py-16 text-center">
                    <TrendUp01 className="size-6 text-fg-quaternary" aria-hidden="true" />
                    <p className="text-md font-semibold text-primary">{c.rule === "Fallback" ? "Fallback campaigns aren't compared on price" : "Performance appears after the first day of delivery"}</p>
                    <p className="max-w-md text-sm text-tertiary">
                        {c.rule === "Fallback"
                            ? "They only fill what open marketplace leaves unsold, so there's no eCPM to compare. See impressions in the Delivery view."
                            : `From ${c.start} you'll see eCPM against open marketplace, plus impressions by keyword and ad unit.`}
                    </p>
                    <Button size="sm" color="secondary" href="#/view-b">
                        Go to delivery view
                    </Button>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                        <Kpi label="Effective eCPM" value={usd(effectiveEcpm(c), 2)} sub={`Bid ${usd(c.ecpm, 2)}`} />
                        <Kpi label="Open marketplace eCPM" value={usd(effectiveEcpm(c) * 0.62, 2)} sub="Same apps & units, same days" />
                        <Kpi label="Premium over OMP" value="+61%" sub={`≈ ${usd(c.spend - c.spend * 0.62)} extra revenue`} />
                        <Kpi label="Impressions" value={compact(c.impressions)} sub={`${c.flightElapsed}% of flight`} />
                    </div>
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                        <div className="flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-secondary">
                            <h3 className="text-lg font-semibold text-primary">eCPM vs open marketplace, last 14 days</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={ecpmSeries(c)} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                                        <CartesianGrid vertical={false} className="[&_line]:stroke-border-secondary" />
                                        <XAxis dataKey="day" {...axis} interval={2} />
                                        <YAxis {...axis} width={48} tickFormatter={(v: number) => `$${v}`} />
                                        <Tooltip content={<ChartTooltipContent />} />
                                        <Line dataKey="This campaign" stroke={TEAL} strokeWidth={2} dot={false} isAnimationActive={false} />
                                        <Line dataKey="Open marketplace" stroke="#98A2B3" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-secondary">
                            <h3 className="text-lg font-semibold text-primary">By keyword</h3>
                            {c.keywords.length ? (
                                <ul className="flex flex-col gap-3">
                                    {keywordSplit(c).map((k) => (
                                        <li key={k.keyword} className="flex flex-col gap-1.5">
                                            <span className="flex items-center justify-between text-sm">
                                                <KeywordChip value={k.keyword} />
                                                <span className="font-semibold text-primary">{compact(k.impressions)}</span>
                                            </span>
                                            <span className="h-2 rounded-full bg-quaternary">
                                                <span className="block h-full rounded-full" style={{ width: `${k.share * 100}%`, backgroundColor: TEAL }} />
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-tertiary">No keyword targeting on this campaign.</p>
                            )}
                            <p className="text-xs text-tertiary">{c.match === "ALL" ? "ALL match: every impression carried every keyword. Shares show which keyword was listed first." : "ANY match: an impression counts under the first keyword it matched."}</p>
                            <PinkAction>Export by keyword (CSV)</PinkAction>
                        </div>
                    </div>
                </>
            )}
        </ViewShell>
    );
};
