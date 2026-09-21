import { type ReactNode, useState } from "react";
import { AlertCircle, CheckCircle, Eye, Plus, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { KeywordChip, PINK, TEAL } from "../das-shell";
import { AdPreview, type PreviewMoment } from "./components/ad-preview";
import { BidRangeField } from "./components/bid-range-field";
import { BudgetSchedule } from "./components/budget-schedule";
import { CreativeFields } from "./components/creative-fields";
import { EstimatePanel } from "./components/estimate-panel";
import { FormatPicker } from "./components/format-picker";
import { GoalTiles } from "./components/goal-tiles";
import { PreviewStage } from "./components/preview-stage";
import { ReviewHero, ReviewSections } from "./components/review-summary";
import { StepRail, type StepState } from "./components/step-rail";
import { StudioShell } from "./components/studio-shell";
import { parseDate } from "@internationalized/date";
import { formatTime12, longDay, toTime } from "../dates";
import { stepHref, useStudioDraft } from "./draft-store";
import {
    type FormatId,
    type StepId,
    type StudioDraft,
    appOptions,
    estimate,
    flightDays,
    formatById,
    geoOptions,
    sampleDraft,
    steps,
    validateDraft,
} from "./studio-data";

/**
 * DAS Studio — screen concept.
 *
 * A focused builder that walks goal → deal → audience → budget → creative → review, with
 * two things always in view: a live estimate while you set up delivery, and a live
 * render of the ad while you build the creative. The review ends with the same render,
 * and a full-screen preview steps through every moment of the format.
 */

const ORDER: StepId[] = steps.map((s) => s.id);
const next = (s: StepId) => ORDER[ORDER.indexOf(s) + 1];
const prev = (s: StepId) => ORDER[ORDER.indexOf(s) - 1];

const railStates = (d: StudioDraft, current: StepId, attempted: boolean): Partial<Record<StepId, StepState>> => {
    const issues = validateDraft(d);
    const idx = ORDER.indexOf(current);
    return Object.fromEntries(
        ORDER.map((s, i) => {
            const bad = issues.some((x) => x.step === s);
            return [s, bad ? (attempted || i < idx ? "error" : "todo") : i < idx || attempted ? "done" : "todo"];
        }),
    );
};

const Rail = ({ d, current, attempted = false }: { d: StudioDraft; current: StepId; attempted?: boolean }) => (
    <StepRail current={current} states={railStates(d, current, attempted)} dealName={d.dealName} campaignName={d.campaignName} hrefFor={stepHref} />
);

const Heading = ({ title, description }: { title: string; description?: ReactNode }) => (
    <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-display-xs font-semibold text-primary">{title}</h1>
        {description && <p className="text-md text-tertiary">{description}</p>}
    </div>
);

const Card = ({ title, description, children }: { title?: string; description?: ReactNode; children: ReactNode }) => (
    <section className="flex flex-col gap-4 rounded-2xl p-6 ring-1 ring-secondary">
        {title && (
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">{title}</h2>
                {description && <p className="text-sm text-tertiary">{description}</p>}
            </div>
        )}
        {children}
    </section>
);

const Estimates = ({ d }: { d: StudioDraft }) => <EstimatePanel estimate={estimate(d)} fallback={d.goal === "fallback"} empty={d.goal !== "fallback" && !d.budget} />;

/* ================================================================== Goal === */

export const GoalScreen = ({ preset = sampleDraft, attempted = false }: { preset?: StudioDraft; attempted?: boolean }) => {
    const { draft: d, update } = useStudioDraft(preset);
    const [tried, setTried] = useState(attempted);
    return (
        <StudioShell
            title="New deal campaign"
            closeHref="#/"
            rail={<Rail d={d} current="goal" />}
            onNext={() => (d.goal ? (window.location.hash = stepHref("deal")) : setTried(true))}
            footerNote="Step 1 of 6"
        >
            <Heading title="What should this campaign do?" description="Pick the goal first. It sets how the campaign competes and what we measure it on." />
            <div className="flex flex-col gap-4">
                <div className="flex w-max gap-1 rounded-full bg-secondary p-1 text-sm font-semibold">
                    <span className="rounded-full bg-primary px-4 py-1.5 text-primary shadow-xs">Programmatic deal</span>
                    <span className="px-4 py-1.5 text-quaternary">Direct IO (soon)</span>
                </div>
                <GoalTiles value={d.goal} onChange={(goal) => update({ goal })} invalid={tried && !d.goal} />
                {tried && !d.goal && (
                    <p className="flex items-center gap-2 text-sm font-medium text-error-primary">
                        <AlertCircle className="size-4" aria-hidden="true" /> Choose a goal to continue.
                    </p>
                )}
            </div>
        </StudioShell>
    );
};

/* ================================================================== Deal === */

export const DealScreen = ({ preset = sampleDraft }: { preset?: StudioDraft }) => {
    const { draft: d, update } = useStudioDraft(preset);
    return (
        <StudioShell title="New deal campaign" closeHref="#/" rail={<Rail d={d} current="deal" />} aside={<Estimates d={d} />} backHref={stepHref(prev("deal"))} nextHref={stepHref(next("deal"))} footerNote="Step 2 of 6">
            <Heading title="Deal & campaign" description="A deal holds one or more campaigns. Budgets belong to the campaign." />
            <div className="flex flex-col gap-4">
                <Card title="Deal">
                    <div className="flex gap-1 text-sm font-semibold">
                        {["Add to an existing deal", "New deal"].map((t, i) => (
                            <span key={t} className={cx("rounded-full px-4 py-1.5", i === 0 ? "bg-[#101828] text-white" : "bg-secondary text-secondary")}>
                                {t}
                            </span>
                        ))}
                    </div>
                    <Input label="Deal" size="md" value={d.dealName} onChange={(dealName) => update({ dealName })} placeholder="Search deals by name or ID" hint="D-10482 · 3 other campaigns · Summit Sportswear" />
                </Card>
                <Card title="Campaign">
                    <Input label="Campaign name" size="md" value={d.campaignName} onChange={(campaignName) => update({ campaignName: campaignName.slice(0, 60) })} placeholder="e.g. Fall Launch · Sports fans" hint={`${d.campaignName.length}/60`} />
                </Card>
            </div>
        </StudioShell>
    );
};

/* ============================================================== Audience === */

const Chip = ({ on, children, onClick }: { on: boolean; children: ReactNode; onClick: () => void }) => (
    <button type="button" aria-pressed={on} onClick={onClick} className={cx("rounded-full px-3 py-1.5 text-sm font-semibold transition-colors", on ? "bg-[#101828] text-white" : "bg-secondary text-secondary hover:bg-tertiary")}>
        {children}
    </button>
);

const toggle = <T,>(xs: T[], x: T) => (xs.includes(x) ? xs.filter((y) => y !== x) : [...xs, x]);

export const AudienceScreen = ({ preset = sampleDraft }: { preset?: StudioDraft }) => {
    const { draft: d, update } = useStudioDraft(preset);
    const [kw, setKw] = useState("");
    const add = () => {
        const v = kw.trim().toLowerCase();
        if (v && !d.keywords.includes(v)) update({ keywords: [...d.keywords, v] });
        setKw("");
    };
    return (
        <StudioShell title="New deal campaign" closeHref="#/" rail={<Rail d={d} current="audience" />} aside={<Estimates d={d} />} backHref={stepHref(prev("audience"))} nextHref={stepHref(next("audience"))} footerNote="Step 3 of 6">
            <Heading title="Who should see it?" description="Start broad. Every limit you add narrows reach, and the estimate on the right shows by how much." />
            <div className="flex flex-col gap-4">
                <Card title="Location" description="Leave empty to serve everywhere.">
                    <div className="flex flex-wrap gap-2">
                        {geoOptions.map((g) => (
                            <Chip key={g.id} on={d.geos.includes(g.id)} onClick={() => update({ geos: toggle(d.geos, g.id) })}>
                                {g.label}
                            </Chip>
                        ))}
                    </div>
                </Card>
                <Card title="Apps & platforms">
                    <div className="flex gap-6">
                        {(["iOS", "Android"] as const).map((p) => (
                            <Checkbox key={p} label={p} isSelected={d.platforms.includes(p)} onChange={() => update({ platforms: toggle(d.platforms, p) })} />
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {appOptions.map((a) => (
                            <Chip key={a} on={d.apps.includes(a)} onClick={() => update({ apps: toggle(d.apps, a) })}>
                                {a}
                            </Chip>
                        ))}
                    </div>
                    <span className="text-xs text-tertiary">{d.apps.length ? `${d.apps.length} of ${appOptions.length} apps` : "All apps"}</span>
                </Card>
                <Card title="Keywords" description="Values your app sends with each request. Matching ignores case.">
                    <div className="flex flex-wrap items-center gap-2 rounded-lg px-3 py-2 ring-1 ring-secondary">
                        {d.keywords.map((k) => (
                            <KeywordChip key={k} value={k} onRemove={() => update({ keywords: d.keywords.filter((x) => x !== k) })} />
                        ))}
                        <input
                            aria-label="Add keyword"
                            value={kw}
                            onChange={(e) => setKw(e.target.value)}
                            onKeyDown={(e) => (e.key === "Enter" || e.key === ",") && (e.preventDefault(), add())}
                            placeholder={d.keywords.length ? "Add another" : "Type a keyword and press Enter"}
                            className="min-w-40 flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-placeholder"
                        />
                    </div>
                    <div className="flex gap-2">
                        {(["ANY", "ALL"] as const).map((m) => (
                            <Chip key={m} on={d.match === m} onClick={() => update({ match: m })}>
                                {m === "ANY" ? "Match any" : "Match all"}
                            </Chip>
                        ))}
                    </div>
                    <span className="text-xs text-tertiary">
                        {d.keywords.length < 2 ? "Add two or more keywords to choose any or all." : d.match === "ANY" ? "Serves if the request has at least one of these." : `Serves only if the request has all ${d.keywords.length}. This narrows reach a lot.`}
                    </span>
                </Card>
            </div>
        </StudioShell>
    );
};

/* ================================================================ Budget === */

export const BudgetScreen = ({ preset = sampleDraft, openCalendar }: { preset?: StudioDraft; openCalendar?: "start" | "end" }) => {
    const { draft: d, update } = useStudioDraft(preset);
    const f = formatById(d.format);
    const fallback = d.goal === "fallback";
    return (
        <StudioShell title="New deal campaign" closeHref="#/" rail={<Rail d={d} current="budget" />} aside={<Estimates d={d} />} backHref={stepHref(prev("budget"))} nextHref={stepHref(next("budget"))} footerNote="Step 4 of 6">
            <Heading title="Budget, bid & schedule" description={fallback ? "Fallback campaigns have no budget or bid. Set when it runs." : "How much to spend, what to bid, and when it runs."} />
            <div className="flex flex-col gap-4">
                <Card title="Format" description="Sets the recommended bid and which ad units it can serve on.">
                    <FormatPicker value={d.format} onChange={(format: FormatId) => update({ format })} />
                </Card>
                {!fallback && (
                    <Card title="Bid">
                        <BidRangeField value={d.bid} onChange={(bid) => update({ bid })} recommended={f.bid} />
                    </Card>
                )}
                <Card title="Budget & schedule">
                    <BudgetSchedule value={d} onChange={update} days={flightDays(d)} hideBudget={fallback} openCalendar={openCalendar} />
                </Card>
            </div>
        </StudioShell>
    );
};

/* ============================================================== Creative === */

export const CreativeScreen = ({ preset = sampleDraft, moment = "default" }: { preset?: StudioDraft; moment?: PreviewMoment }) => {
    const { draft: d, update, updateCreative } = useStudioDraft(preset);
    const [m, setM] = useState<PreviewMoment>(moment);
    const moments: { id: PreviewMoment; label: string }[] =
        d.format === "banner"
            ? [
                  { id: "default", label: "320×50" },
                  { id: "mrec", label: "300×250" },
              ]
            : d.format === "rewarded"
              ? [
                    { id: "default", label: "Playing" },
                    { id: "end-card", label: "End card" },
                ]
              : [];
    return (
        <StudioShell
            title="New deal campaign"
            closeHref="#/"
            rail={<Rail d={d} current="creative" />}
            wideAside
            aside={
                <div className="flex flex-col items-center gap-3">
                    <div className="flex w-full items-center justify-between">
                        <span className="text-sm font-semibold text-primary">Live preview</span>
                        <a href={stepHref("preview")} className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: PINK }}>
                            <Eye className="size-4" aria-hidden="true" /> Full screen
                        </a>
                    </div>
                    {moments.length > 0 && (
                        <div className="flex gap-1 rounded-full bg-secondary p-1 text-xs font-semibold">
                            {moments.map((x) => (
                                <button key={x.id} type="button" aria-pressed={m === x.id} onClick={() => setM(x.id)} className={cx("rounded-full px-3 py-1", m === x.id ? "bg-primary text-primary shadow-xs" : "text-tertiary")}>
                                    {x.label}
                                </button>
                            ))}
                        </div>
                    )}
                    <AdPreview format={d.format} creative={d.creative} moment={moments.some((x) => x.id === m) ? m : "default"} scale={1.1} />
                    <span className="text-xs text-tertiary">Updates as you type</span>
                </div>
            }
            backHref={stepHref(prev("creative"))}
            nextHref={stepHref(next("creative"))}
            footerNote="Step 5 of 6"
        >
            <Heading title="Build the creative" description="What you add here is exactly what renders on the right, in a real app screen." />
            <div className="flex flex-col gap-4">
                <Card title="Format">
                    <FormatPicker value={d.format} onChange={(format) => update({ format })} />
                </Card>
                <Card>
                    <CreativeFields format={d.format} value={d.creative} onChange={updateCreative} />
                </Card>
            </div>
        </StudioShell>
    );
};

/* ================================================================ Review === */

export const ReviewScreen = ({ preset = sampleDraft, attempted = false }: { preset?: StudioDraft; attempted?: boolean }) => {
    const { draft: d } = useStudioDraft(preset);
    const [tried, setTried] = useState(attempted);
    const issues = validateDraft(d);
    const blocking = tried ? issues : [];
    return (
        <StudioShell
            title="Review & publish"
            closeHref="#/"
            rail={<Rail d={d} current="review" attempted={tried} />}
            backHref={stepHref(prev("review"))}
            nextLabel="Publish"
            onNext={() => (issues.length ? setTried(true) : (window.location.hash = "#/published"))}
            footerNote={tried && issues.length ? <span className="font-medium text-error-primary">{issues.length} to fix before publishing</span> : "Nothing goes live until you publish"}
        >
            <div className="flex flex-col gap-4">
                {blocking.length > 0 && (
                    <div role="alert" className="flex flex-col gap-2 rounded-xl p-4 ring-1 ring-error_subtle" style={{ backgroundColor: `${PINK}0f` }}>
                        <p className="flex items-center gap-2 text-sm font-semibold text-error-primary">
                            <AlertCircle className="size-5" aria-hidden="true" /> Fix {blocking.length} {blocking.length === 1 ? "thing" : "things"} to publish
                        </p>
                        <ul className="flex flex-wrap gap-2">
                            {blocking.map((i) => (
                                <li key={i.text}>
                                    <a href={stepHref(i.step)} className="inline-flex rounded-md bg-primary px-2.5 py-1 text-sm font-medium text-error-primary ring-1 ring-error_subtle">
                                        {i.text} →
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <ReviewHero draft={d} previewHref={stepHref("preview")} />
                <ReviewSections
                    draft={d}
                    hrefFor={stepHref}
                    problemsFor={(s) => blocking.filter((i) => i.step === s || (s === "deal" && i.step === "goal")).map((i) => i.text)}
                />
            </div>
        </StudioShell>
    );
};

/* =============================================================== Preview === */

export const PreviewScreen = ({ preset = sampleDraft, device = "phone", moment = 0, status = "ready" }: { preset?: StudioDraft; device?: "phone" | "tablet"; moment?: number; status?: "processing" | "ready" }) => {
    const { draft: d } = useStudioDraft(preset);
    return <PreviewStage format={d.format} creative={d.creative} title={d.campaignName || "Untitled campaign"} initialDevice={device} initialMoment={moment} status={status} closeHref={stepHref("review")} />;
};

/* ============================================================= Published === */

export const PublishedScreen = ({ preset = sampleDraft }: { preset?: StudioDraft }) => {
    const { draft: d } = useStudioDraft(preset);
    return (
        <StudioShell title="Published" closeHref="#/" rail={<StepRail current="review" states={Object.fromEntries(ORDER.map((s) => [s, "done"]))} dealName={d.dealName} campaignName={d.campaignName} />} nextLabel="Go to campaign" nextHref="#/" backHref={stepHref("review")}>
            <div className="flex flex-col items-center gap-6 py-6 text-center">
                <span className="flex size-14 items-center justify-center rounded-full" style={{ backgroundColor: `${TEAL}24` }}>
                    <CheckCircle className="size-7" style={{ color: TEAL }} aria-hidden="true" />
                </span>
                <div className="flex flex-col gap-1">
                    <h1 className="text-display-xs font-semibold text-primary">{d.campaignName || "Your campaign"} is scheduled</h1>
                    <p className="text-md text-tertiary">
                        It goes live {d.start ? longDay(parseDate(d.start)) : "when it starts"} at {formatTime12(toTime(d.startTime))} UTC. You can edit anything until then.
                    </p>
                </div>
                <AdPreview format={d.format} creative={d.creative} scale={0.8} />
                <div className="flex gap-3">
                    <Button color="secondary" iconLeading={Plus} href="#/goal">
                        Add another campaign to this deal
                    </Button>
                    <Button color="secondary" iconLeading={XClose} href="#/">
                        Close
                    </Button>
                </div>
            </div>
        </StudioShell>
    );
};
