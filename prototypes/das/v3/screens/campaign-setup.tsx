import { type ReactNode, useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Circle, InfoCircle, XClose } from "@untitledui/icons";
import { Button } from "./type-rules";
import { cx } from "@/utils/cx";
import { currentFillMode, useRegisterPageFill } from "../../../shared/demo-fill";
import { useScreenNotes } from "../../../shared/screen-notes";
import { FrequencyCapSection, PrioritySection } from "./priority-frequency";
import type { FieldError, Setter } from "../../v1/screens/campaign-setup-one-page";
import { RulesSectionV3 } from "./rules-section";
import { BudgetSectionV3, FlightDatesSection } from "./budget-section";
import { CampaignNameSection, DealSectionV3 } from "./deal-section";
import { type DealDraft, dealDisplayId, dealDisplayName, dealDraftFor } from "./deal-draft";
import { MILESTONES_V3, type IssueV3, milestoneState, milestoneTarget, validateV3 } from "./setup-sections";
import { DasShell, JumpLink, PINK, Section, TEAL } from "./das-shell";
import { TargetingSectionV3 } from "./targeting-section";
import type { KeywordEntry } from "./keyword-target";
import { type CreativeEntry, CreativeTargetBlock } from "./creative-target";
import { DuplicateHandoff, PublishFooter, type PublishMode } from "./publish-duplicate";
import { libraryByName } from "./asset-data";
import { AssetPicker } from "./asset-picker";
import { V3_NAV_ITEMS } from "./nav";
import { ORIGINAL } from "./copy-deck";
import { Copy } from "./copy-deck-ui";
import {
    type SetupForm,
    type SetupPreset,
    allPresets,
    fillAll,
    flightDays,
    spoilAll,
} from "../../v1/screens/setup-data";
import { useSetupDraft } from "../../v1/screens/setup-store";

/**
 * Round 3 — Campaign Setup.
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

const Missing = () => (
    <span className="text-quaternary">
        <Copy>Not Specified</Copy>
    </span>
);

/** Staging's only validation message is the one about creatives. */
const issueOriginal = (issue: IssueV3) => (issue.text === "Add at least one creative" ? ORIGINAL.creativeRequired : undefined);

/** The rail's step names that staging also uses, word for word. */
const STAGING_STEP: Partial<Record<string, string>> = { general: ORIGINAL.reviewGeneral, budget: ORIGINAL.reviewBudget };

const Row = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
    <div className="flex items-start justify-between gap-3 py-2 text-md">
        <span className="shrink-0 text-tertiary">{label}</span>
        <span className="text-right font-medium text-primary">{children}</span>
    </div>
);

/** Pink dashed marker for wording with no equivalent in the product today. */
const Added = () => (
    <span
        title="Our wording — no equivalent in DAS today"
        className="ml-1.5 rounded-full border border-dashed px-1.5 py-px text-md font-bold uppercase"
        style={{ color: "#A94579", borderColor: `${PINK}99` }}
    >
        Added
    </span>
);

/* ------------------------------------------------------------------ Rail --- */

const ProblemList = ({ issues, attempted }: { issues: IssueV3[]; attempted: boolean }) => (
    <ul className="flex flex-col gap-1.5">
        {issues.map((issue) => (
            <li key={issue.field + issue.text}>
                <JumpLink
                    to={issue.section}
                    className={cx(
                        "flex items-center gap-2 rounded-lg px-3 py-2 text-md font-medium transition-colors",
                        attempted ? "text-error-primary" : "bg-secondary/60 text-secondary hover:bg-primary_hover",
                    )}
                    style={attempted ? { backgroundColor: `${PINK}14` } : undefined}
                >
                    {attempted ? <AlertCircle className="size-4 shrink-0" aria-hidden="true" /> : <Circle className="size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />}
                    <Copy original={issueOriginal(issue)}>{issue.text}</Copy>
                </JumpLink>
            </li>
        ))}
    </ul>
);

/**
 * The rail that replaced the left nav, listing the product's five steps rather than the
 * page's nine headings. Each one jumps to where it starts, so this is also how you move
 * around. Review is the exception: it is not a place on the page, it is the state of
 * being finished, so it reads as a step without being a link.
 */
const MilestoneList = ({ form, deal, issues, attempted }: { form: SetupForm; deal: DealDraft; issues: IssueV3[]; attempted: boolean }) => (
    <ul className="flex flex-col gap-0.5">
        {MILESTONES_V3.map((m, i) => {
            const { issues: bad, done } = milestoneState(form, deal, issues, m);
            const state = bad && attempted ? "error" : done ? "done" : "todo";
            const target = milestoneTarget(m);
            const className = cx(
                "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-md font-medium",
                state === "error" ? "text-error-primary" : state === "done" ? "text-primary" : "text-tertiary",
                target && "transition-colors hover:bg-primary_hover",
            );
            const body = (
                <>
                    {state === "error" ? (
                        <AlertCircle className="size-5 shrink-0 text-fg-error-secondary" aria-hidden="true" />
                    ) : state === "done" ? (
                        <CheckCircle className="size-5 shrink-0" style={{ color: TEAL }} aria-hidden="true" />
                    ) : (
                        <span className="flex size-5 shrink-0 items-center justify-center rounded-full border-[1.5px] border-dashed border-fg-quaternary text-md leading-none font-bold text-quaternary" aria-hidden="true">
                            {i + 1}
                        </span>
                    )}
                    <Copy original={STAGING_STEP[m.id]}>{m.title}</Copy>
                    {state === "error" && <span className="ml-auto text-md">{bad}</span>}
                </>
            );
            return <li key={m.id}>{target ? <JumpLink to={target} className={className}>{body}</JumpLink> : <span className={className}>{body}</span>}</li>;
        })}
    </ul>
);

const Rail = ({
    mode,
    form,
    deal,
    issues,
    attempted,
    onPrimary,
}: {
    mode: RailMode;
    form: SetupForm;
    issues: IssueV3[];
    attempted: boolean;
    onPrimary: () => void;
    deal: DealDraft;
}) => {
    const states = MILESTONES_V3.map((m) => milestoneState(form, deal, issues, m));
    const blank = states.every((s) => !s.started);
    const done = states.filter((s) => s.done).length;

    return (
        <aside className="flex flex-col gap-5 rounded-2xl bg-primary p-5 shadow-sm ring-1 ring-secondary xl:sticky xl:top-14">
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-primary">
                        <Copy>{mode === "summary" ? "Campaign summary" : "Ready to publish?"}</Copy>
                    </h2>
                    <span className="text-md font-semibold" style={{ color: issues.length ? PINK : TEAL }}>
                        {done}/{MILESTONES_V3.length}
                    </span>
                </div>
                <div className="flex gap-1">
                    {MILESTONES_V3.map((m, i) => {
                        const st = states[i];
                        return (
                            <span
                                key={m.id}
                                className="h-1.5 flex-1 rounded-full"
                                style={{ backgroundColor: st.issues && attempted ? PINK : st.done ? TEAL : "#EAECF0" }}
                                title={m.title}
                            />
                        );
                    })}
                </div>
            </div>

            {/* This replaced the left-hand rail. */}
            <MilestoneList form={form} deal={deal} issues={issues} attempted={attempted} />

            {blank && !attempted ? (
                <p className="rounded-xl border border-dashed border-secondary p-4 text-md text-tertiary">
                    <Copy>As you fill in the form, each choice shows up below. Start with the deal.</Copy>
                </p>
            ) : issues.length > 0 ? (
                <div className="flex flex-col gap-2">
                    <span className="text-md font-semibold text-tertiary uppercase">
                        <Copy>{attempted ? "Fix before publishing" : `${issues.length} left to finish`}</Copy>
                    </span>
                    <ProblemList issues={issues} attempted={attempted} />
                </div>
            ) : mode === "validation" ? (
                <p className="flex items-center gap-2 text-md font-medium" style={{ color: TEAL }}>
                    <CheckCircle className="size-4" aria-hidden="true" /> <Copy>Everything checks out.</Copy>
                    <Added />
                </p>
            ) : null}

            <div className="divide-y divide-secondary border-y border-secondary">
                {/* Row labels: staging's Review page uses the first seven, word for word. */}
                <Row label={<Copy original={ORIGINAL.rowDealName}>Deal Name</Copy>}>{dealDisplayName(form, deal) ?? <Missing />}</Row>
                <Row label={<Copy original={ORIGINAL.rowDealId}>Deal ID</Copy>}>
                    {dealDisplayId(form, deal) ?? (deal.mode === "generate" ? <Copy original={ORIGINAL.valueDealIdAuto}>Assigned by Nimbus</Copy> : <Missing />)}
                </Row>
                <Row label={<Copy original={ORIGINAL.rowCampaignName}>Campaign Name</Copy>}>{form.name || <Missing />}</Row>
                <Row label={<Copy original={ORIGINAL.rowAuctionRules}>Auction Rules</Copy>}>{form.rule ?? <Missing />}</Row>
                <Row label={<Copy original={ORIGINAL.rowPriority}>Priority</Copy>}>
                    {form.priority ? `${form.priority}${form.priority === 1 ? " — highest" : ""}` : <Copy original={ORIGINAL.valuePriorityOff}>Even distribution</Copy>}
                </Row>
                {form.rule !== "Fallback" && (
                    <>
                        <Row label={<Copy original={ORIGINAL.rowBudget}>Budget</Copy>}>{form.budget ? `$${form.budget.replace(/\.00$/, "")}` : <Missing />}</Row>
                        <Row label={<Copy original={ORIGINAL.rowBidAmount}>Bid Amount (eCPM)</Copy>}>{form.ecpm ? `$${form.ecpm}` : <Missing />}</Row>
                    </>
                )}
                <Row label={<Copy>Frequency Cap</Copy>}>{form.freqCap ? `${form.freqCap} per user / 24h` : <Copy>No cap</Copy>}</Row>
                <Row label={<Copy>Flight Dates</Copy>}>{form.start || form.end ? `${fmtDate(form.start) ?? "?"} – ${fmtDate(form.end) ?? "?"} (UTC)` : <Missing />}</Row>
                <Row label={<Copy>Ad Unit</Copy>}>{form.adUnits.length ? form.adUnits.join(", ") : <Copy>All units</Copy>}</Row>
                <Row label={<Copy>Keywords</Copy>}>{form.keywords.length ? `${form.keywords.length}` : <Missing />}</Row>
                <Row label={<Copy>Campaign Creative</Copy>}>{form.creatives.length ? `${form.creatives.length} × ${[...new Set(form.creatives.map((c) => c.type))].join(" + ")}` : <Missing />}</Row>
                {mode === "validation" && form.rule && form.rule !== "Fallback" && form.budget && flightDays(form) && (
                    <Row label={<Copy>Est. delivery</Copy>}>
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
                        <Copy original={ORIGINAL.toReview}>Review</Copy>
                    </Button>
                    <p className="text-md text-tertiary">
                        <Copy>
                            {issues.length
                                ? "Review checks the campaign. Anything missing is flagged on the page."
                                : "Review sends the campaign to be checked. Nothing goes live until you approve it."}
                        </Copy>
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                    <Button color="primary-pink" className="uppercase" onClick={onPrimary}>
                        <Copy>Publish</Copy>
                    </Button>
                    <Button color="secondary" className="uppercase" onClick={onPrimary}>
                        <Copy>Publish & Duplicate</Copy>
                    </Button>
                    <p className="text-md text-tertiary">
                        <Copy>Publish checks everything first. Anything missing is flagged on the page.</Copy>
                    </p>
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

const ReviewModal = ({
    form,
    onCancel,
    onPublish,
    onPublishDuplicate,
}: {
    form: SetupForm;
    onCancel: () => void;
    onPublish: () => void;
    onPublishDuplicate: () => void;
}) => {
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
                        <h2 className="text-lg font-extrabold text-primary">
                            <Copy original={ORIGINAL.reviewTitle}>Review campaign</Copy>
                        </h2>
                        <p className="text-md text-tertiary">{form.name || <Copy>Untitled campaign</Copy>}</p>
                    </div>
                    <button type="button" aria-label="Close" onClick={onCancel} className="rounded-md p-1.5 text-fg-quaternary hover:bg-secondary">
                        <XClose className="size-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex flex-col gap-4 px-6 py-5">
                    <p className="flex items-center gap-2 rounded-xl px-4 py-3 text-md font-semibold" style={{ backgroundColor: `${TEAL}14`, color: "#1F7F80" }}>
                        <CheckCircle className="size-5 shrink-0" aria-hidden="true" />
                        <Copy>Checked — nothing blocking.</Copy>
                    </p>

                    {advisories.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <span className="text-md font-semibold text-tertiary uppercase">
                                <Copy>Worth knowing</Copy>
                            </span>
                            <ul className="flex flex-col gap-2">
                                {advisories.map((a) => (
                                    <li key={a} className="flex items-start gap-2 text-md text-secondary">
                                        <InfoCircle className="mt-0.5 size-4 shrink-0 text-fg-quaternary" aria-hidden="true" />
                                        <Copy>{a}</Copy>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <p className="text-md text-tertiary">
                        {/* Reworded from staging's Review page intro, which is the same job: the last thing read before Publish. */}
                        <Copy original={ORIGINAL.reviewDescription}>
                            Publishing sends the campaign live. You can pause or edit it afterwards. Publish & Duplicate also opens a second campaign started from this one.
                        </Copy>
                    </p>
                </div>

                {/* Decided on 3 Oct: both publish actions live here rather than in a
                    footer under the form. This is already the moment you have stopped
                    editing and committed to the campaign — which is exactly when "and
                    another one like it" is the thing you want, and it keeps the form
                    itself free of a second set of primary actions. */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-secondary px-6 py-4">
                    {/* Cancel is backing out, not a third way forward. Keeping it away
                        from the two publish actions means the thing that undoes this
                        is never sitting next to the thing that commits it. */}
                    <Button color="secondary" className="uppercase" onClick={onCancel}>
                        <Copy>Cancel</Copy>
                    </Button>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button color="secondary" className="uppercase" onClick={onPublishDuplicate}>
                            <Copy>Publish & Duplicate</Copy>
                        </Button>
                        <Button color="primary-pink" className="uppercase" onClick={onPublish}>
                            <Copy>Publish</Copy>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ------------------------------------------------------- Walkthrough --- */

/** Steps through the flow. Rendered by the toolbar's Info button, not in the page. */
const WALKTHROUGH = [
    { id: "setup-empty", label: "Empty" },
    { id: "step-general", label: "Deal" },
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
    focus?: string;
    screenId?: string;
    /** Which right-rail concept to show. Summary is the default. */
    rail?: RailMode;
    /** Start with Review already pressed, so Publish is live. */
    reviewed?: boolean;
    /** Which search-and-select proposal the Keywords module uses. */
    keywordEntry?: KeywordEntry;
    /** Which Publish proposal the rail and review use. */
    publishMode?: PublishMode;
    /** Which search-and-select proposal the Creative section uses. */
    creativeEntry?: CreativeEntry;
}

export const CampaignSetup = ({
    preset = "ready",
    attempted: initialAttempted = false,
    calendarOpen,
    focus,
    screenId,
    rail = "summary",
    reviewed: initialReviewed = false,
    browsing: initialBrowsing = false,
    keywordEntry = "inline",
    publishMode = "modal",
    creativeEntry = "inline",
}: CampaignSetupProps) => {
    const { form, update } = useSetupDraft(allPresets[preset]);
    const [attempted, setAttempted] = useState(initialAttempted);
    const [reviewing, setReviewing] = useState(initialReviewed);
    const [browsing, setBrowsing] = useState(initialBrowsing);
    const [duplicating, setDuplicating] = useState(false);
    const set: Setter = (p) => {
        update(p);
        setReviewing(false); // any edit invalidates the check
    };
    const [deal, setDeal] = useState<DealDraft>(() => dealDraftFor(form));
    const issues = validateV3(form, deal);
    const error: FieldError = (field) => (attempted ? issues.find((i) => i.field === field)?.text : undefined);

    // Commentary lives in the toolbar's Info button, not in the screen.
    useScreenNotes({
        label: "Round 3",
        title: rail === "summary" ? "One page, with a summary rail that ends in Review" : "One page, with a validation rail that ends in Publish",
        notes: [
            "The rail counts the product's five steps — General, Budget, Targeting, Creative, Review — not the nine headings on the page. It also jumps you to anything that needs fixing. The left “On this page” rail is gone; it said the same thing twice.",
            rail === "summary"
                ? "Review sends the campaign to the backend to be checked, the way DAS works today. Publish only lights up once that comes back clean, and any edit resets it."
                : "Everything validates as you type and Publish is always live. This assumes the client can validate on its own — the open question for engineering.",
            "Deal asks only for what the option needs: a name to generate an ID, a name and an ID to create one, or a search to join an existing deal, which fills both in. Campaign Name and Flight Dates are sections of their own now, level with Auction Rules.",
            "Six places pull from a library you already built — deal, priority, frequency cap, geos, apps, keywords, creative — and they all behave the same way. Click or press ↓ to see the whole list alphabetically, type to narrow it, ↑ ↓ and Enter to pick. The header counts what matched, and the page holds still until you choose.",
            "Apps and Keywords both end in a table rather than chips, because a column can say which of two identically-named apps you are looking at and whether a keyword is arriving in traffic. Chips cannot.",
            "Geos keeps a tree, since taking a whole region is the common case. The checkbox selects and opens the region; double-click a row to open or close it. Creative previews render once a search is down to twelve or fewer, and any chosen creative can be opened full size.",
            "Auction rule cards are clickable end to end, not just the dot. Ad Unit has a ? that shows what each of the four units looks like in an app.",
            "Wording follows the product; anything we invented carries an ADDED chip. Daily Impression Cap has been removed — as a dollar amount it was a spend cap, and it needs a decision about what it counts before it comes back.",
        ],
        walkthrough: WALKTHROUGH,
        currentStep: screenId,
    });

    useRegisterPageFill(() => {
        const bad = currentFillMode() === "bad";
        update(bad ? spoilAll(form) : fillAll(form));
        // `fillAll` only knows about SetupForm, and the deal's own name and id sit
        // beside it. Without this the page looked completely filled in while Review
        // stayed grey, still waiting on "Name the deal". Bad mode leaves them empty
        // on purpose — that is one of the problems it exists to show.
        if (!bad) {
            setDeal((d) =>
                d.mode === "existing" ? d : { ...d, name: d.name.trim() || "Autumn Drive", id: d.mode === "create" ? d.id.trim() || "D-11204" : d.id },
            );
        }
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
        if (calendarOpen) document.getElementById("flight")?.scrollIntoView({ block: "center" });
        else if (focus) document.getElementById(focus)?.scrollIntoView({ block: "start" });
    }, [calendarOpen, focus]);

    // Never blocked: pressing Review while something is missing runs the check and flags
    // each problem in place. Only a clean campaign opens the modal.
    const review = () => {
        setAttempted(true);
        if (issues.length) window.scrollTo({ top: 0, behavior: "smooth" });
        else setReviewing(true);
    };
    /**
     * Publish, then start a second campaign from this one.
     *
     * Hands off to the confirm rather than jumping straight to a fresh form: "you have
     * to confirm you wanted to do that, and then it brings you back into the
     * beginning". Publishing and starting another are two things, and doing both off
     * one press with no acknowledgement leaves you unsure the first one went out.
     */
    const publishDuplicate = () => {
        setReviewing(false);
        setDuplicating(true);
    };
    const publish = () => {
        if (issues.length) {
            setAttempted(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.location.hash = "#/setup-published";
        }
    };

    // No tabs. "View All Campaigns" duplicated the nav's own manage campaigns entry —
    // the same destination offered twice, one of them pretending that setup and the
    // list are two halves of one thing. Deal activation setup is setup.
    return (
        <DasShell navItems={V3_NAV_ITEMS} navKey="deal activation setup">
            <div className="grid grid-cols-1 gap-8 px-8 py-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="flex min-w-0 flex-col gap-6">
                    <div>
                        {attempted && issues.length > 0 && (
                            <div role="alert" className="mb-6 flex flex-col gap-3 rounded-xl p-4 ring-1 ring-error_subtle" style={{ backgroundColor: `${PINK}0f` }}>
                                <p className="flex items-center gap-2 text-md font-semibold text-error-primary">
                                    <AlertCircle className="size-5" aria-hidden="true" />
                                    <Copy>{`${rail === "summary" ? "Review found" : "Can't publish yet:"} ${issues.length} ${issues.length === 1 ? "thing" : "things"} to fix`}</Copy>
                                </p>
                                <ul className="flex flex-wrap gap-2">
                                    {issues.map((i) => (
                                        <li key={i.field + i.text}>
                                            <JumpLink to={i.section} className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-md font-medium text-error-primary ring-1 ring-error_subtle">
                                                <Copy original={issueOriginal(i)}>{i.text}</Copy> →
                                            </JumpLink>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <DealSectionV3 form={form} set={set} error={error} deal={deal} setDeal={setDeal} />
                        <CampaignNameSection form={form} set={set} error={error} />
                        <RulesSectionV3 form={form} set={set} error={error} />
                        <PrioritySection form={form} set={set} />
                        <BudgetSectionV3 form={form} set={set} error={error} />
                        <FlightDatesSection form={form} set={set} error={error} calendarOpen={calendarOpen} />
                        <FrequencyCapSection form={form} set={set} />
                        <TargetingSectionV3 form={form} set={set} empty={preset === "empty"} keywordEntry={keywordEntry} screenId={screenId} />
                        {/* Creative and Keywords use the same search-and-select shape.
                            The 2 Oct review was explicit that the two should behave
                            alike — "I want the two sections to kind of be similar" —
                            and having one of them browse while the other searches is
                            the exact inconsistency that prompted it. */}
                        <Section
                            id="creative"
                            /* Staging's Creative step is headed "Add Existing Asset", with its own instruction line. */
                            title={<Copy original={ORIGINAL.creativeTitle}>Creative</Copy>}
                            /* "For another format or language, use Publish & Duplicate." was cut
                               in the 5 Oct review (C6). */
                            description={
                                <Copy original={ORIGINAL.creativeDescription}>
                                    Add creatives from your asset library. A campaign can hold many creatives, all of the same type.
                                </Copy>
                            }
                        >
                            <CreativeTargetBlock
                                value={form.creatives}
                                onChange={(creatives) => set({ creatives })}
                                entry={creativeEntry}
                                screenId={screenId}
                            />
                        </Section>
                        {/* Proposal: staging keeps both publish actions in a footer under
                            the form rather than behind Review. */}
                        {publishMode === "staging" && (
                            <PublishFooter
                                issues={issues.length}
                                onPublish={publish}
                                onPublishDuplicate={() => setDuplicating(true)}
                                onCancel={() => window.location.assign("#/campaigns")}
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Rail mode={rail} form={form} deal={deal} issues={issues} attempted={attempted} onPrimary={rail === "summary" ? review : publish} />
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
            {reviewing && <ReviewModal form={form} onCancel={() => setReviewing(false)} onPublish={publish} onPublishDuplicate={publishDuplicate} />}
            {duplicating && (
                <DuplicateHandoff
                    onContinue={() => {
                        setDuplicating(false);
                        // Back to the top with the original's values still in the draft,
                        // which is what makes this worth having over starting fresh.
                        window.location.assign("#/setup-duplicate");
                    }}
                />
            )}
        </DasShell>
    );
};

export default CampaignSetup;
