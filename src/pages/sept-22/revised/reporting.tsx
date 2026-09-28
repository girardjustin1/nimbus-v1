import type { ReactNode } from "react";
import { Calendar, ChevronDown, Download01, Lock01 } from "@untitledui/icons";
import { type GlobalNavSection, navSections } from "@/components/application/global-nav/config";
import { GlobalNav } from "@/components/application/global-nav/global-nav";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { type Campaign, campaigns, compact, dailyRevenue, usd } from "../../deal-activation-system/das-data";
import { DeliveryBar, PINK, TEAL } from "../../deal-activation-system/das-shell";
import { ReviewNote } from "../review-note";
import { items } from "../feedback";
import { RevenueByDayAfter } from "./revenue-by-day";

/**
 * Sept 22 · items 1 and 3 — the DAS reporting home, revised.
 *
 * Two changes land on this screen together:
 *   1. It no longer renders with Performance Insights highlighted in the product nav.
 *      That highlight is what made it look like a Performance Insights proposal. The nav
 *      entry shown here — "reporting" under Deal Activation System — is PROPOSED, not an
 *      existing page, and is the product-side half of moving these concepts out of PI.
 *   3. Revenue by day is stacked per campaign so it matches the delivery table below.
 *
 * Everything else is the screen as reviewed. Kept separate from the original so the two
 * can be compared before anything is adopted.
 */

/* --------------------------------------------------------------- Shell --- */

/** Reference nav plus the proposed DAS entries: keyword library, and reporting. */
const navWithDasReporting: GlobalNavSection[] = navSections.map((section) =>
    section.id === "das"
        ? {
              ...section,
              items: [
                  { key: "manage assets", label: "manage assets" },
                  { key: "keyword library", label: "keyword library", badge: "new" as const },
                  { key: "deal activation setup", label: "deal activation setup" },
                  { key: "manage campaigns", label: "manage campaigns" },
                  { key: "das reporting", label: "reporting", badge: "new" as const },
              ],
          }
        : section,
);

const ReportingShell = ({ children }: { children: ReactNode }) => (
    <div className="flex min-h-screen bg-secondary">
        <GlobalNav sections={navWithDasReporting} defaultActiveKey="das reporting" />
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
            <div className="flex-1">{children}</div>
        </main>
    </div>
);

/* --------------------------------------------------------------- Parts --- */

const DateRange = ({ label = "Last 14 days", range = "Sep 5 – Sep 18, 2026" }: { label?: string; range?: string }) => (
    <button
        type="button"
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2.5 text-sm font-semibold text-secondary shadow-xs ring-1 ring-primary ring-inset hover:bg-primary_hover"
    >
        <Calendar className="size-4 text-fg-quaternary" aria-hidden="true" />
        {label} · {range} <span className="font-normal text-tertiary">UTC</span>
    </button>
);

const Tile = ({ label, value, sub }: { label: string; value: string; sub?: ReactNode }) => (
    <div className="flex flex-col gap-1 rounded-xl p-4 ring-1 ring-secondary">
        <span className="text-sm text-tertiary">{label}</span>
        <span className="text-display-xs font-semibold text-primary">{value}</span>
        {sub && <span className="text-xs text-tertiary">{sub}</span>}
    </div>
);

const Card = ({
    title,
    description,
    trailing,
    children,
    className,
}: {
    title: string;
    description?: ReactNode;
    trailing?: ReactNode;
    children: ReactNode;
    className?: string;
}) => (
    <section className={cx("flex flex-col gap-4 rounded-2xl p-5 ring-1 ring-secondary", className)}>
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex flex-col gap-0.5">
                <h3 className="text-lg font-semibold text-primary">{title}</h3>
                {description && <p className="text-sm text-tertiary">{description}</p>}
            </div>
            {trailing}
        </div>
        {children}
    </section>
);

const KeywordAggregateCell = ({ c }: { c: Campaign }) =>
    c.keywords.length ? (
        <span className="text-sm text-secondary">
            Yes · <span className="font-semibold text-primary">{c.keywords.length}</span> keyword{c.keywords.length === 1 ? "" : "s"} ({c.match})
        </span>
    ) : (
        <span className="text-sm text-quaternary">No</span>
    );

const dasTotal = dailyRevenue.reduce((s, d) => s + d.das, 0);
const ompTotal = dailyRevenue.reduce((s, d) => s + d.omp, 0);

/* --------------------------------------------------------------- Screen --- */

export const DasOverviewRevised = ({ annotate = true }: { annotate?: boolean }) => (
    <ReportingShell>
        <div className="flex flex-col gap-6 px-8 py-8">
            {annotate && (
                <div className="flex flex-col gap-3">
                    <ReviewNote item={items[0]} compact />
                    <ReviewNote item={items[2]} compact />
                </div>
            )}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col gap-1">
                    <h2 className="text-display-xs font-semibold text-primary">Deal Activation performance</h2>
                    <p className="text-md text-tertiary">Sourced campaigns across all apps in this account.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <DateRange />
                    <Button color="secondary" iconLeading={Download01}>
                        Export CSV
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                <Tile label="DAS revenue" value={usd(dasTotal)} sub="Last 14 days" />
                <Tile label="Share of total revenue" value={`${Math.round((dasTotal / (dasTotal + ompTotal)) * 100)}%`} sub={`Open Marketplace ${usd(ompTotal)}`} />
                <Tile label="DAS impressions" value={compact(campaigns.reduce((s, c) => s + c.impressions, 0))} sub="Fallback included" />
                <Tile
                    label="Keyword-targeted campaigns"
                    value={`${campaigns.filter((c) => c.keywords.length).length} of ${campaigns.length}`}
                    sub="Aggregate only. Per-keyword detail via CSV"
                />
            </div>

            <Card
                title="Revenue by day"
                description="Each DAS campaign against Open Marketplace (programmatic). Hourly front-loaded pacing makes intraday charts spiky; daily totals are steady."
            >
                <RevenueByDayAfter />
            </Card>

            <Card
                title="Campaign delivery"
                description="Is each campaign keeping its promise? The tick marks where spend should be today."
                trailing={
                    <Button color="secondary" size="sm" iconLeading={Download01}>
                        Per-keyword CSV
                    </Button>
                }
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[980px] text-left">
                        <thead>
                            <tr className="border-b border-secondary">
                                {["Campaign", "Delivery", "Revenue (flight to date)", "Impressions", "eCPM", "Keyword-targeted", "Units"].map((h) => (
                                    <th key={h} className="px-3 py-2.5 text-xs font-semibold text-tertiary">
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {campaigns
                                .filter((c) => c.status !== "Scheduled")
                                .map((c) => (
                                    <tr key={c.id} className="border-b border-secondary last:border-b-0">
                                        <td className="px-3 py-3">
                                            <span className="block text-sm font-semibold" style={{ color: TEAL }}>
                                                {c.name}
                                            </span>
                                            <span className="block text-xs text-tertiary">{c.dealName}</span>
                                        </td>
                                        <td className="w-56 px-3 py-3">
                                            <DeliveryBar campaign={c} />
                                        </td>
                                        <td className="px-3 py-3 text-sm font-semibold text-primary">{usd(c.rule === "Fallback" ? 1480 : c.spend)}</td>
                                        <td className="px-3 py-3 text-sm text-secondary">{compact(c.impressions)}</td>
                                        <td className="px-3 py-3 text-sm text-secondary">{c.rule === "Fallback" ? usd(1.82, 2) : usd(c.ecpm, 2)}</td>
                                        <td className="px-3 py-3">
                                            <KeywordAggregateCell c={c} />
                                        </td>
                                        <td className="px-3 py-3 text-sm text-tertiary">{c.adUnits.join(", ")}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
                <p className="flex items-center gap-2 text-sm text-tertiary">
                    <Lock01 className="size-4" aria-hidden="true" /> Per-keyword performance is available as a CSV export or through the API, not as charts, so
                    reports stay fast however many keywords you use.
                </p>
            </Card>
        </div>
    </ReportingShell>
);
