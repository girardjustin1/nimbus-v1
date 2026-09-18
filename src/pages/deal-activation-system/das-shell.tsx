import type { ReactNode } from "react";
import { ChevronDown, Lightbulb02, XClose } from "@untitledui/icons";
import { type GlobalNavSection, navSections } from "@/components/application/global-nav/config";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { cx } from "@/utils/cx";
import { type Campaign, type CampaignStatus, type PaceState, paceOf } from "./das-data";

/**
 * Deal Activation System — shared prototype chrome and building blocks.
 *
 * Every DAS concept screen renders inside <DasShell/> so the Global Nav, account header
 * and optional tab strip / sticky footer stay identical across concepts. The small
 * pieces below (keyword chip, delivery bar, status dot, concept note) are reused by
 * several concepts; the ones marked PROPOSED are candidates for the design system.
 */

export const PINK = "#DA6EA3";
export const TEAL = "#37B6B7";

/* ------------------------------------------------------------------ Nav --- */

/** Reference nav + a proposed "keyword library" entry under Deal Activation System. */
const dasNavSections: GlobalNavSection[] = navSections.map((section) =>
    section.id === "das"
        ? {
              ...section,
              items: [
                  { key: "manage assets", label: "manage assets" },
                  { key: "keyword library", label: "keyword library", badge: "new" },
                  { key: "deal activation setup", label: "deal activation setup" },
                  { key: "manage campaigns", label: "manage campaigns" },
              ],
          }
        : section,
);

export type DasNavKey = "manage assets" | "keyword library" | "deal activation setup" | "manage campaigns" | "performance insights" | "realtime dashboard";

/* ---------------------------------------------------------------- Shell --- */

export interface DasShellProps {
    /** Global Nav item to highlight. */
    navKey: DasNavKey;
    /** Optional tab strip under the account header. */
    tabs?: { label: string; active?: boolean }[];
    /** Optional sticky footer (actions). */
    footer?: ReactNode;
    /** Concept annotation shown above the page body. */
    concept?: ConceptNoteProps;
    children: ReactNode;
}

export const DasShell = ({ navKey, tabs, footer, concept, children }: DasShellProps) => (
    <div className="flex min-h-screen bg-secondary">
        <GlobalNav sections={dasNavSections} defaultActiveKey={navKey} />

        <main className="flex min-w-0 flex-1 flex-col bg-primary">
            <header className="flex items-center justify-between gap-4 border-b border-secondary px-8 py-5">
                <div className="flex min-w-0 items-center gap-3">
                    <h1 className="truncate text-display-xs font-semibold text-primary">Pocket Garden Media</h1>
                    <span className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ color: TEAL, backgroundColor: `${TEAL}1f` }}>
                        PGM
                    </span>
                </div>
                <button type="button" aria-label="Switch account" className="transition duration-100 ease-linear hover:opacity-80">
                    <ChevronDown className="size-6" style={{ color: PINK }} aria-hidden="true" />
                </button>
            </header>

            {tabs && (
                <div className="flex border-b border-secondary px-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.label}
                            type="button"
                            aria-current={tab.active ? "page" : undefined}
                            className={cx(
                                "-mb-px border-b-2 px-6 py-4 text-md font-semibold transition-colors duration-100 ease-linear",
                                tab.active ? "border-current" : "border-transparent hover:opacity-80",
                            )}
                            style={{ color: TEAL, backgroundColor: tab.active ? `${TEAL}14` : undefined }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {concept && (
                <div className="px-8 pt-6">
                    <ConceptNote {...concept} />
                </div>
            )}

            <div className="flex-1">{children}</div>

            {footer && (
                <footer className="sticky bottom-0 z-10 border-t border-secondary bg-primary px-8 py-4 shadow-[0_-1px_2px_rgba(10,13,18,0.05)]">
                    {footer}
                </footer>
            )}
        </main>
    </div>
);

/* --------------------------------------------------------- Concept note --- */

export interface ConceptNoteProps {
    /** e.g. "Concept A". */
    label: string;
    title: string;
    /** Short rationale bullets — what this concept is testing. */
    notes: ReactNode[];
}

/** Review annotation: what a concept is exploring. Not product UI. */
export const ConceptNote = ({ label, title, notes }: ConceptNoteProps) => (
    <aside className="flex gap-3 rounded-xl border border-dashed px-4 py-3" style={{ borderColor: `${TEAL}80`, backgroundColor: `${TEAL}0d` }}>
        <Lightbulb02 className="mt-0.5 size-5 shrink-0" style={{ color: TEAL }} aria-hidden="true" />
        <div className="flex min-w-0 flex-col gap-1">
            <p className="text-sm font-semibold text-primary">
                <span style={{ color: TEAL }}>{label}</span> · {title}
            </p>
            <ul className="list-disc space-y-0.5 pl-4 text-sm text-tertiary">
                {notes.map((note, i) => (
                    <li key={i}>{note}</li>
                ))}
            </ul>
        </div>
    </aside>
);

/* -------------------------------------------------------------- Pieces --- */

export const Section = ({
    title,
    description,
    trailing,
    badge,
    id,
    children,
    className,
}: {
    title: string;
    description?: ReactNode;
    trailing?: ReactNode;
    badge?: ReactNode;
    id?: string;
    children: ReactNode;
    className?: string;
}) => (
    <section id={id} className={cx("flex scroll-mt-6 flex-col gap-5 border-b border-secondary py-8 first:pt-0 last:border-b-0", className)}>
        <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-primary">{title}</h2>
                    {badge}
                </div>
                {description && <p className="max-w-3xl text-sm text-tertiary">{description}</p>}
            </div>
            {trailing}
        </div>
        {children}
    </section>
);

/** Pink uppercase text action (Edit, Remove, Clear all). */
export const PinkAction = ({ children, icon: Icon, onPress }: { children: ReactNode; icon?: typeof XClose; onPress?: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        className="inline-flex items-center gap-1.5 text-sm font-semibold whitespace-nowrap uppercase transition-opacity duration-100 hover:opacity-80"
        style={{ color: PINK }}
    >
        {Icon && <Icon className="size-4" aria-hidden="true" />}
        {children}
    </button>
);

/** "NEW" marker for fields added by the Extended Targeting charter. */
export const NewFieldBadge = () => (
    <span className="rounded-full px-2 py-0.5 text-xs font-semibold uppercase" style={{ color: TEAL, backgroundColor: `${TEAL}1f` }}>
        New
    </span>
);

/** PROPOSED — teal keyword chip, optionally removable. Matches the charter's tag-style chips. */
export const KeywordChip = ({ value, onRemove, muted }: { value: string; onRemove?: () => void; muted?: boolean }) => (
    <span
        className={cx("inline-flex items-center gap-1 rounded-md py-0.5 pr-1 pl-2 font-mono text-xs font-medium", !onRemove && "pr-2")}
        style={muted ? { color: "#667085", backgroundColor: "#F2F4F7" } : { color: "#1F7F80", backgroundColor: `${TEAL}24` }}
    >
        {value}
        {onRemove && (
            <button type="button" aria-label={`Remove ${value}`} onClick={onRemove} className="rounded p-0.5 transition-colors hover:bg-black/5">
                <XClose className="size-3" aria-hidden="true" />
            </button>
        )}
    </span>
);

const statusDot: Record<CampaignStatus, string> = {
    Running: TEAL,
    Scheduled: "#F79009",
    Paused: "#D92D20",
    Complete: "#98A2B3",
    Draft: "#98A2B3",
};

export const StatusDot = ({ status }: { status: CampaignStatus }) => (
    <span className={cx("inline-flex items-center gap-2 text-sm whitespace-nowrap", status === "Paused" ? "font-medium text-error-primary" : "text-primary")}>
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: statusDot[status] }} aria-hidden="true" />
        {status}
    </span>
);

/* ------------------------------------------------------------ Delivery --- */

const paceColor: Record<PaceState, string> = {
    "on track": TEAL,
    ahead: "#F79009",
    behind: "#D92D20",
    "not started": "#98A2B3",
    "no budget": "#98A2B3",
};

export const PaceLabel = ({ state }: { state: PaceState }) => (
    <span className="text-xs font-semibold uppercase" style={{ color: paceColor[state] }}>
        {state}
    </span>
);

/**
 * PROPOSED — delivery bar: spend vs budget, with a tick at "where spend should be" for
 * the elapsed share of the flight. Answers "how done is this campaign, and is it on pace?"
 */
export const DeliveryBar = ({ campaign, showLabels = true }: { campaign: Campaign; showLabels?: boolean }) => {
    const pct = campaign.budget ? Math.min(100, (campaign.spend / campaign.budget) * 100) : 0;
    const state = paceOf(campaign);
    return (
        <div className="flex min-w-44 flex-col gap-1.5">
            {showLabels && (
                <div className="flex items-center justify-between gap-3 text-xs">
                    <span className="text-secondary">
                        {campaign.budget ? (
                            <>
                                <span className="font-semibold text-primary">{Math.round(pct)}%</span> spent
                            </>
                        ) : (
                            "Fallback · no budget"
                        )}
                    </span>
                    <PaceLabel state={state} />
                </div>
            )}
            <div className="relative h-2 rounded-full bg-quaternary">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: paceColor[state] }} />
                {campaign.budget > 0 && campaign.flightElapsed > 0 && (
                    <span
                        className="absolute -top-1 h-4 w-0.5 rounded-full bg-fg-primary"
                        style={{ left: `calc(${campaign.flightElapsed}% - 1px)` }}
                        title={`${campaign.flightElapsed}% of flight elapsed`}
                    />
                )}
            </div>
        </div>
    );
};
