import { type ReactNode, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Circle, InfoCircle, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { currentFillMode, useRegisterPageFill } from "../../../shared/demo-fill";
import { useScreenNotes } from "../../../shared/screen-notes";
import { FrequencyCapSection, PrioritySection } from "../../v1/screens/priority-frequency";
import {
    BudgetSection,
    CreativeSection,
    DealSection,
    type FieldError,
    RulesSection,
    type Setter,
} from "../../v1/screens/campaign-setup-one-page";
import { DasShell, JumpLink, PINK, TEAL } from "../../v1/screens/das-shell";
import { TargetingSectionV2 } from "./targeting-section";
import { libraryByName, setReturnTo } from "./asset-data";
import { AssetPicker } from "./asset-picker";
import { V2_NAV_ITEMS } from "./nav";
import {
    type Issue,
    SECTIONS,
    type SectionId,
    type SetupForm,
    type SetupPreset,
    allPresets,
    deals,
    fillAll,
    flightDays,
    spoilAll,
    started,
    validate,
} from "../../v1/screens/setup-data";
import { useSetupDraft } from "../../v1/screens/setup-store";

/**
 * Round 2 — Campaign Setup.
 *
 * Same five sections as Round 1, using the same components so the two rounds can never
 * drift apart. What changed came out of the 1 Oct review:
 *
 *   - The left "On this page" rail is gone. It repeated what the right rail already
 *     said, and it was eating the width the form needed. The right rail now does both
 *     jobs: it summarises the campaign AND jumps you to anything that needs fixing.
 *   - Two rail variants, because whether the client can validate on its own is an open
 *     question for engineering. "Summary" ends in Review, matching the backend
 *     round-trip DAS does today. "Validation" checks as you type and ends in Publish.
 *   - Targeting is five peer modules (Geos, Platform, Apps, Ad Unit, Keywords) rather
 *     than loose rows plus two cards.
 */

export type RailMode = "summary" | "validation";

const fmtDate = (c?: { year: number; month: number; day: number }) =>
    c ? new Date(Date.UTC(c.year, c.month - 1, c.day)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" }) : undefined;

const Missing = () => <span className="text-quaternary">Not Specified</span>;

const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex items-start justify-between gap-3 py-2 text-sm">
        <span className="shrink-0 text-tertiary">{label}</span>
        <span className="text-right font-medium text-primary">{children}</span>
    </div>
);

/** Pink dashed marker for wording with no equivalent in the product today. */
const Added = () => (
    <span
        title="Our wording — no equivalent in DAS today"
        className="ml-1.5 rounded-full border border-dashed px-1.5 py-px text-[10px] font-bold uppercase"
        style={{ color: "#A94579", borderColor: `${PINK}99` }}
    >
        Added
    </span>
);

/* ------------------------------------------------------------------ Rail --- */

const ProblemList = ({ issues, attempted }: { issues: Issue[]; attempted: boolean }) => (
    <ul className="flex flex-col gap-1.5">
        {issues.map((issue) => (
            <li key={issue.field + issue.text}>
                <JumpLink
                    to={issue.section}
                    className={cx(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        attempted ? "text-error-primary" : "bg-secondary/60 text-secondary hover:bg-primary_hover",
                    )}
                    style={attempted ? { backgroundColor: `${PINK}14` } : undefined}
                >
                    {attempted ? <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> : <Circle className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />}
                    {issue.text}
                </JumpLink>
            </li>
        ))}
    </ul>
);

/**
 * The rail that replaced the left nav: every section is a jump link, so this is also how
 * you move around the page.
 */
const SectionJumpList = ({ form, issues, attempted }: { form: SetupForm; issues: Issue[]; attempted: boolean }) => (
    <ul className="flex flex-col gap-0.5">
        {SECTIONS.map((s, i) => {
            const bad = issues.filter((x) => x.section === s.id);
            const done = started(form, s.id) && bad.length === 0;
            const state = bad.length && attempted ? "error" : done ? "done" : "todo";
            return (
                <li key={s.id}>
                    <JumpLink
                        to={s.id}
                        className={cx(
                            "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors hover:bg-primary_hover",
                            state === "error" ? "text-error-primary" : state === "done" ? "text-primary" : "text-tertiary",
                        )}
                    >
                        {state === "error" ? (
                            <AlertCircle className="size-4 shrink-0 text-fg-error-secondary" aria-hidden="true" />
                        ) : state === "done" ? (
                            <CheckCircle className="size-4 shrink-0" style={{ color: TEAL }} aria-hidden="true" />
                        ) : (
                            <span className="flex size-4 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-fg-quaternary text-[9px] font-bold text-quaternary" aria-hidden="true">
                                {i + 1}
                            </span>
                        )}
                        {s.title}
                        {state === "error" && <span className="ml-auto text-xs">{bad.length}</span>}
                    </JumpLink>
                </li>
            );
        })}
    </ul>
);

const Rail = ({
    mode,
    form,
    issues,
    attempted,
    onPrimary,
}: {
    mode: RailMode;
    form: SetupForm;
    issues: Issue[];
    attempted: boolean;
    onPrimary: () => void;
}) => {
    const deal = deals.find((x) => x.id === form.dealId);
    const blank = SECTIONS.every((s) => !started(form, s.id));
    const done = SECTIONS.filter((s) => started(form, s.id) && !issues.some((i) => i.section === s.id)).length;

    return (
        <aside className="flex flex-col gap-5 rounded-2xl bg-primary p-5 shadow-sm ring-1 ring-secondary xl:sticky xl:top-14">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-primary">{mode === "summary" ? "Campaign summary" : "Ready to publish?"}</h2>
                    <span className="text-sm font-semibold" style={{ color: issues.length ? PINK : TEAL }}>
                        {done}/{SECTIONS.length}
                    </span>
                </div>
                <div className="flex gap-1">
                    {SECTIONS.map((s) => {
                        const bad = issues.some((i) => i.section === s.id);
                        const ok = started(form, s.id) && !bad;
                        return <span key={s.id} className="h-1.5 flex-1 rounded-full" style={{ backgroundColor: bad && attempted ? PINK : ok ? TEAL : "#EAECF0" }} title={s.title} />;
                    })}
                </div>
            </div>

            {/* This replaced the left-hand rail. */}
            <SectionJumpList form={form} issues={issues} attempted={attempted} />

            {blank && !attempted ? (
                <p className="rounded-xl border border-dashed border-secondary p-4 text-sm text-tertiary">
                    As you fill in the form, each choice shows up below. Start with General.
                </p>
            ) : issues.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold text-tertiary uppercase">
                        {attempted ? "Fix before publishing" : `${issues.length} left to finish`}
                    </span>
                    <ProblemList issues={issues} attempted={attempted} />
                </div>
            ) : mode === "validation" ? (
                <p className="flex items-center gap-2 text-sm font-medium" style={{ color: TEAL }}>
                    <CheckCircle className="size-4" aria-hidden="true" /> Everything checks out.
                    <Added />
                </p>
            ) : null}

            <div className="divide-y divide-secondary border-y border-secondary">
                <Row label="Deal Name">{deal?.label ?? <Missing />}</Row>
                <Row label="Auction Rules">{form.rule ?? <Missing />}</Row>
                <Row label="Priority">{form.priority ? `${form.priority}${form.priority === 1 ? " — highest" : ""}` : "Even distribution"}</Row>
                {form.rule !== "Fallback" && (
                    <>
                        <Row label="Budget">{form.budget ? `$${form.budget.replace(/\.00$/, "")}` : <Missing />}</Row>
                        <Row label="Bid Amount (eCPM)">{form.ecpm ? `$${form.ecpm}` : <Missing />}</Row>
                    </>
                )}
                <Row label="Frequency Cap">{form.freqCap ? `${form.freqCap} per user / 24h` : "No cap"}</Row>
                <Row label="Flight Dates">{form.start || form.end ? `${fmtDate(form.start) ?? "?"} – ${fmtDate(form.end) ?? "?"} (UTC)` : <Missing />}</Row>
                <Row label="Ad Unit">{form.adUnits.length ? form.adUnits.join(", ") : "All units"}</Row>
                <Row label="Keywords">{form.keywords.length ? `${form.keywords.length}` : <Missing />}</Row>
                <Row label="Campaign Creative">{form.creatives.length ? `${form.creatives.length} × ${[...new Set(form.creatives.map((c) => c.type))].join(" + ")}` : <Missing />}</Row>
                {mode === "validation" && form.rule && form.rule !== "Fallback" && form.budget && flightDays(form) && (
                    <Row label="Est. delivery">
                        ≈ 2.9M impressions · $806/day
                        <Added />
                    </Row>
                )}
            </div>

            {mode === "summary" ? (
                <div className="flex flex-col gap-2">
                    {/* One button. Grey until everything required is in, but never blocked:
                        pressing it while incomplete runs the check and flags each problem. */}
                    <Button color={issues.length ? "secondary" : "primary-pink"} className="uppercase" onClick={onPrimary}>
                        Review
                    </Button>
                    <p className="text-xs text-tertiary">
                        {issues.length
                            ? "Review checks the campaign. Anything missing is flagged on the page."
                            : "Review sends the campaign to be checked. Nothing goes live until you approve it."}
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <Button color="primary-pink" className="uppercase" onClick={onPrimary}>
                        Publish
                    </Button>
                    <Button color="secondary" className="uppercase" onClick={onPrimary}>
                        Publish &amp; Duplicate
                    </Button>
                    <p className="text-xs text-tertiary">Publish checks everything first. Anything missing is flagged on the page.</p>
                </div>
            )}
        </aside>
    );
};


/* ----------------------------------------------------------- Review modal --- */

/**
 * What the check came back with, then Publish.
 *
 * Deliberately short. The campaign itself is already summarised in the rail behind this,
 * so repeating it here would make the modal the thing Kristen objected to — somewhere you
 * have to work rather than somewhere you confirm. What this adds is the one thing the
 * page cannot tell you: what the backend said.
 *
 * Advisories are things worth knowing that do not block: they are not errors, and the
 * publisher can go ahead regardless.
 */
const advisoriesFor = (f: SetupForm): string[] => {
    const out: string[] = [];
    if (!f.keywords.length) out.push("No keywords — this campaign isn't keyword-targeted, so it can serve to anyone the other targets allow.");
    if (!f.adUnits.length) out.push("No ad unit chosen — it will serve on all units.");
    if (f.rule !== "Fallback" && !f.end) out.push("No end date — it runs until you pause it.");
    // Both are off by default, and the default is a behaviour worth stating out loud.
    if (f.priority === undefined) out.push("Priority not set — this campaign gets even distribution against other active campaigns.");
    else if (f.priority === 1) out.push("Priority 1 — this campaign is served ahead of every other active campaign.");
    if (f.freqCap === undefined) out.push("No frequency cap — one user can see this campaign any number of times a day.");
    const days = flightDays(f);
    if (f.rule !== "Fallback" && f.budget && days)
        out.push(`${f.creatives.length} creative${f.creatives.length === 1 ? "" : "s"} over a ${days}-day flight. Pacing is front-loaded hourly.`);
    return out;
};

const ReviewModal = ({ form, onCancel, onPublish }: { form: SetupForm; onCancel: () => void; onPublish: () => void }) => {
    const advisories = advisoriesFor(form);
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [onCancel]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onCancel}>
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Review campaign"
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-primary shadow-2xl"
            >
                <div className="flex items-start justify-between gap-4 border-b border-secondary px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-lg font-semibold text-primary">Review campaign</h2>
                        <p className="text-sm text-tertiary">{form.name || "Untitled campaign"}</p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onCancel} className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-6 py-5">
                    <p className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: `${TEAL}14`, color: "#1F7F80" }}>
                        <CheckCircle className="size-5 shrink-0" aria-hidden="true" />
                        Checked — nothing blocking.
                    </p>

                    {advisories.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-tertiary uppercase">Worth knowing</span>
                            <ul className="flex flex-col gap-2">
                                {advisories.map((a) => (
                                    <li key={a} className="flex items-start gap-2 text-sm text-secondary">
                                        <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                        {a}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <p className="text-xs text-tertiary">Publishing sends the campaign live. You can pause or edit it afterwards.</p>
                </div>

                <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
                    <Button color="secondary" className="uppercase" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button color="primary-pink" className="uppercase" onClick={onPublish}>
                        Publish
                    </Button>
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------- Walkthrough --- */

/** Steps through the flow. Rendered by the toolbar's Info button, not in the page. */
const WALKTHROUGH = [
    { id: "setup-empty", label: "Empty" },
    { id: "step-general", label: "General" },
    { id: "step-rules", label: "Rules" },
    { id: "step-budget", label: "Budget" },
    { id: "step-targeting", label: "Targeting" },
    { id: "step-creative", label: "Creative" },
    { id: "setup-ready", label: "Ready" },
];


/* ------------------------------------------------------------------ Page --- */

export interface CampaignSetupProps {
    /** Open the asset browser on load. */
    browsing?: boolean;
    preset?: SetupPreset;
    attempted?: boolean;
    calendarOpen?: boolean;
    focus?: SectionId;
    screenId?: string;
    /** Which right-rail concept to show. Summary is the default. */
    rail?: RailMode;
    /** Start with Review already pressed, so Publish is live. */
    reviewed?: boolean;
}

export const CampaignSetup = ({ preset = "ready", attempted: initialAttempted = false, calendarOpen, focus, screenId, rail = "summary", reviewed: initialReviewed = false, browsing: initialBrowsing = false }: CampaignSetupProps) => {
    const { form, update } = useSetupDraft(allPresets[preset]);
    const [attempted, setAttempted] = useState(initialAttempted);
    const [reviewing, setReviewing] = useState(initialReviewed);
    const [browsing, setBrowsing] = useState(initialBrowsing);
    const set: Setter = (p) => {
        update(p);
        setReviewing(false); // any edit invalidates the check
    };
    const issues = validate(form);
    const error: FieldError = (field) => (attempted ? issues.find((i) => i.field === field)?.text : undefined);

    // Commentary lives in the toolbar's Info button, not in the screen.
    useScreenNotes({
        label: "Round 2",
        title: rail === "summary" ? "One page, with a summary rail that ends in Review" : "One page, with a validation rail that ends in Publish",
        notes: [
            "The “On this page” rail is gone — it repeated the right rail. The right rail now jumps between sections and to anything that needs fixing.",
            rail === "summary"
                ? "Review sends the campaign to the backend to be checked, the way DAS works today. Publish only lights up once that comes back clean, and any edit resets it."
                : "Everything validates as you type and Publish is always live. This assumes the client can validate on its own — the open question for engineering.",
            "Geos, Platform, Apps, Ad Unit and Keywords are five modules at the same level. Wording follows the product; anything we invented carries an ADDED chip.",
        ],
        walkthrough: WALKTHROUGH,
        currentStep: screenId,
    });

    useRegisterPageFill(() => {
        const bad = currentFillMode() === "bad";
        update(bad ? spoilAll(form) : fillAll(form));
        if (bad) setAttempted(true);
        setReviewing(false);
    });

    // Coming back from Asset Setup: attach the creative that was just made.
    useEffect(() => {
        const name = new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("added");
        if (!name) return;
        const made = libraryByName(name);
        if (made && !form.creatives.some((c) => c.name === made.name)) update({ creatives: [...form.creatives, made] });
        // Drop the param so a refresh doesn't attach it twice.
        window.history.replaceState(null, "", window.location.hash.replace(/([?&])added=[^&]*/, "$1").replace(/[?&]$/, ""));
        // Runs once per arrival.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Deep-linking to a step opens the page at that section.
    useEffect(() => {
        if (calendarOpen) document.getElementById("budget")?.scrollIntoView({ block: "center" });
        else if (focus) document.getElementById(focus)?.scrollIntoView({ block: "start" });
    }, [calendarOpen, focus]);

    // Never blocked: pressing Review while something is missing runs the check and flags
    // each problem in place. Only a clean campaign opens the modal.
    const review = () => {
        setAttempted(true);
        if (issues.length) window.scrollTo({ top: 0, behavior: "smooth" });
        else setReviewing(true);
    };
    const publish = () => {
        if (issues.length) {
            setAttempted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.location.hash = "#/setup-published";
        }
    };

    return (
        <DasShell
            navItems={V2_NAV_ITEMS}
            navKey="deal activation setup"
            tabs={[
                { label: "Campaign Setup", active: true, href: "#/setup-empty" },
                { label: "View All Campaigns", href: "#/campaigns" },
            ]}
        >
            <div className="grid grid-cols-1 gap-8 px-8 py-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex min-w-0 flex-col gap-6">
                    <div>
                        {attempted && issues.length > 0 && (
                            <div role="alert" className="mb-6 flex flex-col gap-3 rounded-xl p-4 ring-1 ring-error_subtle" style={{ backgroundColor: `${PINK}0f` }}>
                                <p className="flex items-center gap-2 text-sm font-semibold text-error-primary">
                                    <AlertCircle className="size-5" aria-hidden="true" />
                                    {rail === "summary" ? "Review found" : "Can't publish yet:"} {issues.length} {issues.length === 1 ? "thing" : "things"} to fix
                                </p>
                                <ul className="flex flex-wrap gap-2">
                                    {issues.map((i) => (
                                        <li key={i.field + i.text}>
                                            <JumpLink to={i.section} className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-sm font-medium text-error-primary ring-1 ring-error_subtle">
                                                {i.text} →
                                            </JumpLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <DealSection form={form} set={set} error={error} extended />
                        <RulesSection form={form} set={set} error={error} />
                        <PrioritySection form={form} set={set} />
                        <BudgetSection form={form} set={set} error={error} calendarOpen={calendarOpen} />
                        <FrequencyCapSection form={form} set={set} />
                        <TargetingSectionV2 form={form} set={set} empty={preset === "empty"} />
                        <CreativeSection
                            form={form}
                            set={set}
                            error={error}
                            extended
                            onBrowse={() => setBrowsing(true)}
                            onUploadNew={() => {
                                setReturnTo(`#/${screenId ?? "setup-ready"}`);
                                window.location.assign("#/asset-setup");
                            }}
                        />
                    </div>
                </div>
                <div>
                    <Rail mode={rail} form={form} issues={issues} attempted={attempted} onPrimary={rail === "summary" ? review : publish} />
                </div>
            </div>
            {browsing && (
                <AssetPicker
                    chosen={form.creatives}
                    returnHref={`#/${screenId ?? "setup-ready"}`}
                    onClose={() => setBrowsing(false)}
                    onAdd={(added) => update({ creatives: [...form.creatives, ...added] })}
                />
            )}
            {reviewing && <ReviewModal form={form} onCancel={() => setReviewing(false)} onPublish={publish} />}
        </DasShell>
    );
};

export default CampaignSetup;
