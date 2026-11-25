import { type CSSProperties, type MouseEvent, type ReactNode, useState } from "react";
import { ChevronDown, Lightbulb02, XClose } from "@untitledui/icons";
import type { GlobalNavItem } from "@/components/application/global-nav/config";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { cx } from "@/utils/cx";
import { type Campaign, type CampaignStatus, type PaceState, paceOf } from "../../../das/v1/screens/das-data";
import { useScreenNotes } from "../../../shared/screen-notes";
import { ADMIN_LINKS, APP_NAV_SECTIONS } from "./nav";
import { NAV_SECTION, R1 } from "./round-1";
import { FIELD_TYPE_R1, HEADLINE } from "./type-rules";

/**
 * The full application's shell — v2: the Nov 13 style guide with product's Round 1 list
 * (17 Nov 2026) applied. Round 1 values come from ./round-1 (R1-01 staff bar, R1-02
 * account name and badge, R1-14 tabular figures everywhere, R1-16 the one option hover).
 *
 * Every screen in the app renders inside <DasShell/>: the Global Nav (every item linked,
 * ./nav.ts), the admin bar Nimbus staff see, the announcement banner set in Configure
 * Banner, and the page header — an account (Test Publisher, or Nimbus Exchange for the
 * all-publisher view) or, for pages that aren't per account, the page's own title.
 *
 * Deal Activation System — shared prototype chrome and building blocks.
 *
 * Forked from v1 for Prototype 3 so the 5 Oct type rules (./type-rules) can apply
 * without changing the screens Rounds 1 and 2 were reviewed on.
 *
 * Every DAS concept screen renders inside <DasShell/> so the Global Nav, account header
 * and optional tab strip / sticky footer stay identical across concepts. The small
 * pieces below (keyword chip, delivery bar, status dot, concept note) are reused by
 * several concepts; the ones marked PROPOSED are candidates for the design system.
 */

export const PINK = "#DA6EA3";
const STAGING_BLACK = "#000000";
export const TEAL = "#37B6B7";

/* ------------------------------------------------------------------ Nav --- */

/** A Global Nav item key (./nav.ts APP_NAV_SECTIONS). */
export type DasNavKey = string;

/** Whose data the page shows: one publisher account, or the whole exchange (Nimbus staff). */
export type Account = "publisher" | "exchange";

const ACCOUNTS: Record<Account, { name: string; badge?: string }> = {
    publisher: { name: "Test Publisher", badge: "TP" },
    exchange: { name: "Nimbus Exchange" },
};

/* ---------------------------------------------------------------- Shell --- */

/**
 * Round 1 values Tailwind classes need (labels, buttons, the option hover), as CSS
 * variables on the shell: classes read var(--r1-…), the numbers stay in ./round-1.
 */
export const R1_VARS = {
    "--r1-option-hover": R1.optionHover.backgroundColor,
    "--r1-label-size": `${R1.smallUpper.fontSize}px`,
    "--r1-label-weight": String(R1.smallUpper.fontWeight),
    "--r1-label-spacing": R1.smallUpper.letterSpacing,
    "--r1-button-size": `${R1.button.fontSize}px`,
    "--r1-button-weight": String(R1.button.fontWeight),
    "--r1-button-spacing": R1.button.letterSpacing,
    "--r1-button-height": `${R1.button.height}px`,
    "--nav-section-size": `${NAV_SECTION.fontSize}px`,
    "--nav-section-weight": String(NAV_SECTION.fontWeight),
    "--nav-section-spacing": NAV_SECTION.letterSpacing,
    "--nav-section-color": NAV_SECTION.color,
} as CSSProperties;

/** The type specimen's sidebar section titles, set on the design system's nav from outside it (25 Nov 2026). */
const NAV_SECTION_TYPE =
    "[&_nav>button]:text-(length:--nav-section-size) [&_nav>button]:font-(--nav-section-weight) [&_nav>button]:tracking-(--nav-section-spacing) [&_nav>button]:text-(--nav-section-color) [&_nav>button]:uppercase [&_nav>div]:text-(length:--nav-section-size) [&_nav>div]:font-(--nav-section-weight) [&_nav>div]:tracking-(--nav-section-spacing) [&_nav>div]:text-(--nav-section-color) [&_nav>div]:uppercase";

export interface DasShellProps {
    /** Global Nav item to highlight. */
    navKey: DasNavKey;
    /** Optional tab strip under the account header. */
    tabs?: { label: string; active?: boolean; href?: string }[];
    /** Optional sticky footer (actions). */
    footer?: ReactNode;
    /** Concept annotation shown above the page body. */
    concept?: ConceptNoteProps;
    /** Kept for the DAS screens forked from Round 6; the app's nav is APP_NAV_SECTIONS. */
    navItems?: GlobalNavItem[];
    /** Header: an account (default publisher), or set `title` for a page that isn't per account. */
    account?: Account;
    title?: string;
    /** false for pages staging shows with tabs straight under the banner (Settings). */
    header?: boolean;
    children: ReactNode;
}

/** Admin pages are outside the rebuild, so the bar's items are labels. R1-01: staging's bar (50px, 13px bold links). */
const AdminBar = () => (
    <nav
        aria-label="Nimbus admin"
        className="flex shrink-0 items-center overflow-x-auto px-8"
        style={{ height: R1.staffBar.height, backgroundColor: R1.staffBar.backgroundColor, borderBottom: R1.staffBar.borderBottom, columnGap: R1.staffBar.gap }}
    >
        {ADMIN_LINKS.map((label) => (
            <span key={label} className="whitespace-nowrap" style={R1.staffLink}>
                {label}
            </span>
        ))}
    </nav>
);

/** The announcement Nimbus sets in Configure Banner. Sample text; it can be closed for the session. */
let bannerClosed = false;
const AnnouncementBanner = () => {
    const [open, setOpen] = useState(!bannerClosed);
    if (!open) return null;
    return (
        <div className="relative flex items-center justify-center gap-2 px-12 py-2.5 text-[16px] leading-[19.2px] text-white" style={{ backgroundColor: PINK }}>
            {/* Staging's banner text: 16px, 500; its link 700 (type scrape, 25 Nov). */}
            <span className="font-medium">Announcement set in Configure Banner.</span>
            <a href="#" onClick={(e) => e.preventDefault()} className="font-bold underline">
                Read more
            </a>
            <button
                type="button"
                aria-label="Close announcement"
                onClick={() => {
                    bannerClosed = true;
                    setOpen(false);
                }}
                className="absolute right-4 rounded p-1 hover:bg-white/15"
            >
                <XClose className="size-4" aria-hidden="true" />
            </button>
        </div>
    );
};

/**
 * The concept annotation is registered with the toolbar's Info button rather than
 * rendered in the page. It is commentary about a design, not part of it — in the page it
 * ate the width the form needed and baked our notes into every screenshot.
 */
export const DasShell = ({ navKey, tabs, footer, concept, account = "publisher", title, header = true, children }: DasShellProps) => {
    useScreenNotes(concept ? { label: concept.label, title: concept.title, notes: concept.notes.map(String) } : null);
    return (
        // The shared Global Nav sets its footer links at 13px; the 15px minimum is applied
        // from here rather than by editing the shared component.
        // R1-14: every number in the app uses tabular figures, set once here. R1-16: the one option hover, as a variable.
        <div className="flex min-h-screen bg-secondary [&_footer]:text-md" style={{ ...R1.numbers, ...R1_VARS }}>
            {/* Only Performance Insights links anywhere in this prototype: the other items are labels, dimmed and inert. */}
            <div className={cx("contents [&_a[href='#']]:pointer-events-none [&_a[href='#']]:opacity-40", NAV_SECTION_TYPE)}>
                <GlobalNav sections={APP_NAV_SECTIONS} defaultActiveKey={navKey} />
            </div>

            <main className={cx("flex min-w-0 flex-1 flex-col bg-primary", FIELD_TYPE_R1)}>
                <AdminBar />
                <AnnouncementBanner />
                <header className={cx("flex items-center justify-between gap-4 border-b border-secondary px-8 py-5", !header && "sr-only")}>
                    <div className="flex min-w-0 items-center gap-3">
                        {/* R1-02: staging's account name (26px, weight 700) and badge (the R1-04 small upper case label). A page title keeps v1's headline. */}
                        <h1 className={cx("truncate", title ? cx("text-display-xs text-primary", HEADLINE) : undefined)} style={title ? undefined : R1.pubName}>
                            {title ?? ACCOUNTS[account].name}
                        </h1>
                        {!title && ACCOUNTS[account].badge && <span style={R1.pubBadge}>{ACCOUNTS[account].badge}</span>}
                    </div>
                    {!title && (
                        <button type="button" aria-label="Switch account" className="transition duration-100 ease-linear hover:opacity-80">
                            <ChevronDown className="size-6" style={{ color: PINK }} aria-hidden="true" />
                        </button>
                    )}
                </header>

                {tabs && (
                    <div className="flex border-b border-secondary px-8">
                        {tabs.map((tab) => (
                            <a
                                key={tab.label}
                                href={tab.href}
                                aria-current={tab.active ? "page" : undefined}
                                className={cx(
                                    "-mb-px border-b-2 px-6 py-4 text-md font-semibold transition-colors duration-100 ease-linear",
                                    tab.active ? "border-current" : "border-transparent hover:opacity-80",
                                )}
                                style={{ color: TEAL, backgroundColor: tab.active ? `${TEAL}14` : undefined }}
                            >
                                {tab.label}
                            </a>
                        ))}
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
};

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
            <p className="text-md font-semibold text-primary">
                <span style={{ color: TEAL }}>{label}</span> · {title}
            </p>
            <ul className="list-disc space-y-0.5 pl-4 text-md text-tertiary">
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
    title: ReactNode;
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
                    {/* R1-07: staging's section label (20px, weight 700, -0.13px). */}
                    <h2 style={R1.sectionLabel}>{title}</h2>
                    {badge}
                </div>
                {description && <p className="max-w-3xl text-md text-tertiary">{description}</p>}
            </div>
            {trailing}
        </div>
        {children}
    </section>
);

/**
 * A field's label, its instruction directly underneath, then the control — the order
 * staging uses ("Budget *" / "Total campaign spend." / field). Product's 5 Oct review
 * (C1): instructions go above the control, where an open dropdown can't cover them.
 * Errors still go under the control, next to the thing they are about — pass them as
 * the control's own hint.
 */
export const Field = ({ label, required, hint, children }: { label?: ReactNode; required?: boolean; hint?: ReactNode; children: ReactNode }) => (
    <div className="flex flex-col gap-1.5">
        {/* R1-04: form labels use the one small upper case style. */}
        {label && (
            <span style={{ ...R1.smallUpper, color: STAGING_BLACK }}>
                {label}
                {required && <span className="ml-0.5 text-brand-tertiary">*</span>}
            </span>
        )}
        {hint && <p className="text-md text-tertiary">{hint}</p>}
        {children}
    </div>
);

/** Pink uppercase text action (Edit, Remove, Clear all). */
export const PinkAction = ({ children, icon: Icon, onPress }: { children: ReactNode; icon?: typeof XClose; onPress?: () => void }) => (
    <button
        type="button"
        onClick={onPress}
        className="inline-flex items-center gap-1.5 text-md font-semibold whitespace-nowrap uppercase transition-opacity duration-100 hover:opacity-80"
        style={{ color: PINK }}
    >
        {Icon && <Icon className="size-4" aria-hidden="true" />}
        {children}
    </button>
);

/**
 * "NEW" marker for fields added by the Extended Targeting charter — a real product
 * addition, signed off. Teal and solid.
 */
export const NewFieldBadge = () => (
    <span className="rounded-full px-2 py-0.5 text-md font-semibold uppercase" style={{ color: TEAL, backgroundColor: `${TEAL}1f` }}>
        New
    </span>
);

/**
 * "ADDED" marker for wording with no equivalent in the product today — a term we
 * invented. Deliberately unlike NewFieldBadge: pink and dashed, so a charter field and a
 * made-up word are never mistaken for each other.
 *
 * Every term is catalogued in src/pages/deal-activation-system/terminology.ts.
 */
export const AddedTermBadge = ({ title = "Our wording — no equivalent in DAS today" }: { title?: string }) => (
    <span
        title={title}
        className="rounded-full border border-dashed px-2 py-0.5 text-md font-semibold uppercase"
        style={{ color: "#A94579", borderColor: `${PINK}99`, backgroundColor: `${PINK}0f` }}
    >
        Added
    </span>
);

/** PROPOSED — teal keyword chip, optionally removable. Matches the charter's tag-style chips. */
export const KeywordChip = ({ value, onRemove, muted }: { value: string; onRemove?: () => void; muted?: boolean }) => (
    <span
        className={cx("inline-flex items-center gap-1 rounded-md py-0.5 pr-1 pl-2 font-mono text-md font-medium", !onRemove && "pr-2")}
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

/**
 * What a status reads as. Round 4 (19 Oct): a campaign scheduled to start later reads
 * "Queued", the word Product uses and the Manage campaigns chip uses, so the chip and
 * the table say the same thing. The data value stays "Scheduled".
 */
const statusLabel: Partial<Record<CampaignStatus, string>> = { Scheduled: "Queued" };

export const StatusDot = ({ status }: { status: CampaignStatus }) => (
    <span className={cx("inline-flex items-center gap-2 text-md whitespace-nowrap", status === "Paused" ? "font-medium text-error-primary" : "text-primary")}>
        <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: statusDot[status] }} aria-hidden="true" />
        {statusLabel[status] ?? status}
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
    <span className="text-md font-semibold uppercase" style={{ color: paceColor[state] }}>
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
                <div className="flex items-center justify-between gap-3 text-md">
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

/* ------------------------------------------------------------ Jump link --- */

/**
 * In-page link to a section id. Screens use hash routing (#/screen), so a plain
 * href="#section" would change the screen; this scrolls instead.
 */
export const JumpLink = ({ to, className, style, children }: { to: string; className?: string; style?: CSSProperties; children: ReactNode }) => (
    <a
        href={`#${to}`}
        className={className}
        style={style}
        onClick={(e: MouseEvent) => {
            e.preventDefault();
            document.getElementById(to)?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
    >
        {children}
    </a>
);
