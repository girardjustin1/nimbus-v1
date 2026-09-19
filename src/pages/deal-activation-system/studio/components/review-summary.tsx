import type { ReactNode } from "react";
import { AlertCircle, Calendar, Eye, Image01, Target04, Wallet02 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { PINK, TEAL } from "../../das-shell";
import { type StudioDraft, appOptions, formatById, geoOptions, goals, shortDate, usd0, usd2 } from "../studio-data";
import { AdPreview } from "./ad-preview";

/**
 * ReviewSummary — the final check before publishing: a hero card with the flight and
 * budget next to a small render of the ad, then one section per step with its own
 * Edit link. Sections with problems are outlined and say what's wrong.
 */

export const ReviewHero = ({ draft, previewHref }: { draft: StudioDraft; previewHref?: string }) => (
    <div className="flex overflow-hidden rounded-2xl" style={{ background: `linear-gradient(120deg, ${TEAL}33, ${PINK}26)` }}>
        <div className="flex flex-1 flex-col gap-4 p-6">
            <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-tertiary uppercase">{goals.find((g) => g.id === draft.goal)?.title ?? "No goal yet"}</span>
                <h2 className="text-display-xs font-semibold text-primary">{draft.campaignName || "Untitled campaign"}</h2>
                <span className="text-sm text-secondary">{draft.dealName || "No deal"}</span>
            </div>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <div>
                    <dt className="text-xs text-tertiary">Schedule</dt>
                    <dd className="font-semibold text-primary">
                        {shortDate(draft.start)} – {draft.hasEnd ? shortDate(draft.end) : "no end"}
                    </dd>
                </div>
                {draft.goal !== "fallback" && (
                    <div>
                        <dt className="text-xs text-tertiary">{draft.budgetType === "daily" ? "Daily budget" : "Total budget"}</dt>
                        <dd className="font-semibold text-primary">{draft.budget ? usd0(draft.budget) : "—"}</dd>
                    </div>
                )}
                <div>
                    <dt className="text-xs text-tertiary">Format</dt>
                    <dd className="font-semibold text-primary">{formatById(draft.format).label}</dd>
                </div>
            </dl>
            {previewHref && (
                <div>
                    <Button color="secondary" size="sm" iconLeading={Eye} href={previewHref}>
                        Preview ad
                    </Button>
                </div>
            )}
        </div>
        <div className="hidden items-end px-6 pt-6 md:flex">
            <div className="h-[190px] overflow-hidden">
                <AdPreview format={draft.format} creative={draft.creative} scale={0.42} />
            </div>
        </div>
    </div>
);

export const ReviewSection = ({ icon, title, editHref, problems = [], children }: { icon: ReactNode; title: string; editHref?: string; problems?: string[]; children: ReactNode }) => (
    <section className={cx("flex flex-col gap-3 rounded-2xl p-5 ring-1", problems.length ? "ring-2 ring-error_subtle" : "ring-secondary")}>
        <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-md font-semibold text-primary">
                <span className="text-fg-quaternary">{icon}</span>
                {title}
            </h3>
            {editHref && (
                <a href={editHref} className="text-sm font-semibold" style={{ color: PINK }}>
                    Edit
                </a>
            )}
        </div>
        {problems.map((p) => (
            <p key={p} className="flex items-center gap-2 text-sm font-medium text-error-primary">
                <AlertCircle className="size-4" aria-hidden="true" /> {p}
            </p>
        ))}
        <dl className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">{children}</dl>
    </section>
);

export const ReviewItem = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex flex-col gap-0.5 text-sm">
        <dt className="text-xs text-tertiary">{label}</dt>
        <dd className="font-medium text-primary">{children}</dd>
    </div>
);

/** All review sections for a draft; `problemsFor` maps a step to its issues. */
export const ReviewSections = ({ draft, problemsFor = () => [], hrefFor }: { draft: StudioDraft; problemsFor?: (step: "deal" | "audience" | "budget" | "creative") => string[]; hrefFor?: (step: string) => string }) => {
    const fallback = draft.goal === "fallback";
    return (
        <div className="flex flex-col gap-4">
            <ReviewSection icon={<Target04 className="size-5" />} title="Audience" editHref={hrefFor?.("audience")} problems={problemsFor("audience")}>
                <ReviewItem label="Geos">{draft.geos.length ? draft.geos.map((g) => geoOptions.find((o) => o.id === g)?.label).join(", ") : "Everywhere"}</ReviewItem>
                <ReviewItem label="Platforms">{draft.platforms.join(", ") || "—"}</ReviewItem>
                <ReviewItem label="Apps">{draft.apps.length ? `${draft.apps.length} of ${appOptions.length}` : "All apps"}</ReviewItem>
                <ReviewItem label="Keywords">{draft.keywords.length ? `${draft.match} of ${draft.keywords.join(", ")}` : "None"}</ReviewItem>
            </ReviewSection>
            <ReviewSection icon={<Wallet02 className="size-5" />} title="Budget & bid" editHref={hrefFor?.("budget")} problems={problemsFor("budget")}>
                <ReviewItem label="Budget">{fallback ? "None (fallback)" : draft.budget ? `${usd0(draft.budget)} ${draft.budgetType}` : "—"}</ReviewItem>
                <ReviewItem label="Bid (eCPM)">{fallback ? "Not applicable" : draft.bid ? usd2(draft.bid) : "—"}</ReviewItem>
                <ReviewItem label="Pacing">Even</ReviewItem>
                <ReviewItem label="Frequency cap">3 a day per device</ReviewItem>
            </ReviewSection>
            <ReviewSection icon={<Calendar className="size-5" />} title="Schedule" editHref={hrefFor?.("budget")}>
                <ReviewItem label="Starts">{shortDate(draft.start)} · 00:00 UTC</ReviewItem>
                <ReviewItem label="Ends">{draft.hasEnd ? `${shortDate(draft.end)} · 23:59 UTC` : "When paused"}</ReviewItem>
            </ReviewSection>
            <ReviewSection icon={<Image01 className="size-5" />} title="Creative" editHref={hrefFor?.("creative")} problems={problemsFor("creative")}>
                <ReviewItem label="Format">{formatById(draft.format).label}</ReviewItem>
                <ReviewItem label="Advertiser">{draft.creative.brand || "—"}</ReviewItem>
                <ReviewItem label="Headline">{draft.creative.headline || "—"}</ReviewItem>
                <ReviewItem label="Call to action">{draft.creative.cta}</ReviewItem>
            </ReviewSection>
        </div>
    );
};
