import type { ReactNode } from "react";
import { ArrowNarrowRight } from "@untitledui/icons";
import { cx } from "@/utils/cx";
import { type Campaign, campaigns, paceOf, usd } from "../../deal-activation-system/das-data";
import { PINK } from "../../deal-activation-system/das-shell";

/**
 * Sept 22 · item 4 — the Manage Campaigns summary tiles, before and after.
 *
 * "Behind pace" and "Ending in 7 days" name a campaign but gave you no way to reach it,
 * which is the whole problem on an account running fifty of them. They become links.
 * "Live campaigns" and "Spend this flight" describe the account as a whole, so they stay
 * inert — there is no single thing to open.
 */

/**
 * The sample data describes a 14-day window ending Sep 18, 2026, so "ending in 7 days" is
 * measured from there rather than from the real clock. Otherwise the tile would quietly
 * change meaning every time someone opened the prototype.
 */
const REPORT_DATE = new Date("Sep 18, 2026");
const DAY = 24 * 60 * 60 * 1000;

const daysUntilEnd = (c: Campaign) => Math.round((new Date(`${c.end}, 2026`).getTime() - REPORT_DATE.getTime()) / DAY);

const live = campaigns.filter((c) => c.status === "Running");
const behind = campaigns.filter((c) => c.status === "Running" && paceOf(c) === "behind");
const endingSoon = campaigns.filter((c) => c.status !== "Complete" && daysUntilEnd(c) >= 0 && daysUntilEnd(c) <= 7);

const spend = campaigns.reduce((s, c) => s + c.spend, 0);
const booked = campaigns.reduce((s, c) => s + c.budget, 0);
const dealCount = new Set(campaigns.map((c) => c.dealId)).size;

/* ------------------------------------------------------------------ Tile --- */

const Kpi = ({ label, value, sub, tone, href, action }: { label: string; value: string; sub?: ReactNode; tone?: "warn"; href?: string; action?: string }) => {
    const body = (
        <>
            <span className="text-sm text-tertiary">{label}</span>
            <span className="text-display-xs font-semibold" style={{ color: tone === "warn" ? PINK : undefined }}>
                {value}
            </span>
            {sub && <span className="text-xs text-tertiary">{sub}</span>}
            {href && action && (
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold uppercase" style={{ color: PINK }}>
                    {action}
                    <ArrowNarrowRight className="size-3.5 transition-transform duration-100 group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
            )}
        </>
    );
    const className = "flex flex-col gap-1 rounded-xl p-4 ring-1 ring-secondary";
    return href ? (
        <a href={href} className={cx(className, "group transition-colors duration-100 hover:bg-secondary/60 hover:ring-brand-solid")}>
            {body}
        </a>
    ) : (
        <div className={className}>{body}</div>
    );
};

/* ------------------------------------------------------------- Variants --- */

const names = (list: Campaign[]) => list.map((c) => c.name).join(", ") || "None";

/** What was reviewed on Sep 22: four tiles, none of them clickable. */
export const KpiStripBefore = () => (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi label="Live campaigns" value={String(live.length)} sub={`${campaigns.length} total across ${dealCount} deals`} />
        <Kpi label="Spend this flight" value={usd(spend)} sub={`of ${usd(booked)} booked`} />
        <Kpi label="Behind pace" value={String(behind.length)} sub={names(behind)} tone={behind.length ? "warn" : undefined} />
        <Kpi label="Ending in 7 days" value="1" sub="Over 21 · Midwest (Sep 24)" />
    </div>
);

/**
 * Revised: the two tiles that name a campaign link to it. One match goes straight to the
 * campaign; more than one goes to the list filtered to them, rather than guessing which
 * was meant.
 */
export const KpiStripAfter = ({
    campaignHref = (c: Campaign) => `#/view-a?c=${c.id}`,
    listHref = (query: string) => `#/campaigns?q=${encodeURIComponent(query)}`,
}: {
    campaignHref?: (c: Campaign) => string;
    listHref?: (query: string) => string;
} = {}) => {
    const linkFor = (list: Campaign[], query: string) => (list.length === 0 ? undefined : list.length === 1 ? campaignHref(list[0]) : listHref(query));
    const actionFor = (list: Campaign[]) => (list.length === 0 ? undefined : list.length === 1 ? "Go to campaign" : `See all ${list.length}`);

    return (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Kpi label="Live campaigns" value={String(live.length)} sub={`${campaigns.length} total across ${dealCount} deals`} />
            <Kpi label="Spend this flight" value={usd(spend)} sub={`of ${usd(booked)} booked`} />
            <Kpi
                label="Behind pace"
                value={String(behind.length)}
                sub={names(behind)}
                tone={behind.length ? "warn" : undefined}
                href={linkFor(behind, "behind")}
                action={actionFor(behind)}
            />
            <Kpi
                label="Ending in 7 days"
                value={String(endingSoon.length)}
                sub={endingSoon.map((c) => `${c.name} (${c.end})`).join(", ") || "None"}
                href={linkFor(endingSoon, "ending")}
                action={actionFor(endingSoon)}
            />
        </div>
    );
};
