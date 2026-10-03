import { AlertTriangle, CheckCircle, Plus } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { DasShell, KeywordChip, TEAL } from "../../v1/screens/das-shell";
import { V3_NAV_ITEMS } from "./nav";
import { Card, ExportCsv, IntegrationGuide, KeywordTabs, Metric, PatternBadge, ReportingGuardrail, SourceChips } from "./keyword-common";
import { appTraffic, fmtInt, fmtPct, incoming, totals, useKeywords } from "./keyword-data";

/**
 * Keyword Health — what your apps are actually sending, against what you have defined.
 *
 * This is the screen that earns the library its place. A creative either renders or it
 * doesn't; a keyword can be spelled perfectly, saved, targeted by a live campaign, and
 * still match nothing, forever, because no app ever sends it. Nothing else in DAS would
 * tell you that.
 *
 * FROM THE CHARTER:
 *   - The three RTB fields and the fact that the backend collapses them into one list.
 *     We report them separately only as a diagnostic — which field an app populates is
 *     the quickest way to spot a half-finished integration.
 *   - The integration pattern each app appears to use. Remote config is the only one
 *     we recommend, but an app that hardcoded its keywords still behaves that way and
 *     the publisher needs to see it. The charter is explicit that this is a publisher
 *     implementation choice and not a Nimbus platform distinction, so this screen
 *     infers the pattern from observed behaviour and never offers to change it.
 *   - "Keywords are free-text and could generate unlimited unique values." The
 *     arriving-but-undefined panel is that risk made visible.
 *   - Reporting guardrail: aggregates on screen, per-keyword detail by CSV or API, and
 *     no per-keyword charting. Honoured literally — there is not a single chart here.
 *
 * DESIGN DECISIONS:
 *   - Request volume counts as integration health, not reporting. We show how often a
 *     keyword reaches Nimbus; we never show impressions, revenue or fill rate per
 *     keyword, and we say so on screen so the distinction isn't inferred.
 *   - Only the highest-volume undefined keywords are listed; the rest go to CSV. That
 *     keeps the guardrail intact on a page whose whole job is unbounded cardinality.
 *   - "Not detected" is a real state for an app, deliberately louder than a zero.
 *   - Everything is a seven-day window, because a keyword that stopped arriving three
 *     days ago is the case worth catching.
 *
 * KILLED ON 1 OCT, do not reintroduce: ANY/ALL match logic, and device language.
 *
 * KILLED ON 2 OCT: Bulk add. "Add Some" therefore goes to Keyword Setup, which takes a
 * pasted list on its own — the link still pointed at the deleted page until 3 Oct.
 */

export const KeywordHealth = () => {
    const keywords = useKeywords();
    const t = totals();

    const defined = new Set(keywords.map((k) => k.value));
    const notArriving = keywords.filter((k) => !k.seenInTraffic);
    const undefinedIncoming = incoming.filter((i) => !defined.has(i.value)).sort((a, b) => b.requests7d - a.requests7d);
    const quietApps = appTraffic.filter((a) => a.withKeywords === 0);

    const th = "px-3 py-2.5 text-left text-xs font-semibold text-tertiary";
    const td = "px-3 py-3 text-sm text-secondary";

    return (
        <DasShell
            navItems={V3_NAV_ITEMS}
            navKey="keyword library"
            concept={{
                label: "Round 3 · Added",
                title: "Manage keywords",
                notes: [
                    "Keywords are new in the Extended Targeting charter. Every label on these screens is ours — there is nothing in DAS today to match it against.",
                    "Deliberately the same shape as Manage assets: a library you keep, a setup form that adds to it, and the same way in and out of a campaign.",
                    "Matching is exact and case-insensitive. No ANY/ALL — that was dropped on 1 Oct, though the charter still specifies it.",
                ],
            }}
        >
            <KeywordTabs active="health" />
            <div className="flex flex-col gap-6 px-8 py-8">

                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-display-xs font-semibold text-primary">Keyword Health</h2>
                        <p className="max-w-2xl text-sm text-tertiary">
                            What Test Publisher's apps sent in the last 7 days, against what is in your library. A keyword only matches if an app is actually sending it.
                        </p>
                    </div>
                    <ExportCsv label="Export full keyword CSV" />
                </div>

                {/* Aggregates only — the charter's reporting guardrail. */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
                    <Metric label="Requests, 7 days" value={fmtInt(t.requests)} />
                    <Metric label="Carrying a keyword" value={fmtPct(t.keywordShare)} hint={`${fmtInt(Math.round(t.withKeywords))} requests`} />
                    <Metric label="Distinct keywords seen" value={fmtInt(t.distinctSeen)} hint="Free text — this can grow without limit" />
                    <Metric label="In your library" value={fmtInt(t.defined)} />
                    <Metric
                        label="Defined, never arriving"
                        value={fmtInt(t.definedNotSeen)}
                        tone={t.definedNotSeen > 0 ? "warning" : undefined}
                        hint={t.definedNotSeen > 0 ? "These can't match anything" : "All of them are arriving"}
                    />
                    <Metric label="Arriving, not defined" value={fmtInt(t.seenNotDefined)} hint="No campaign can target these yet" />
                </div>
                <ReportingGuardrail />

                {/* ---------------------------------------------------- Apps --- */}
                <Card
                    title="What your apps are sending"
                    trailing={
                        quietApps.length > 0 ? (
                            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warning-primary">
                                <AlertTriangle className="size-4" aria-hidden="true" />
                                {quietApps.length} app sending no keywords at all
                            </span>
                        ) : undefined
                    }
                >
                    <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                        <table className="w-full min-w-[920px]">
                            <thead className="bg-secondary">
                                <tr>
                                    {["App", "Platform", "How they're populated", "SDK", "Requests", "With a keyword", "Fields arriving", "Distinct"].map((h) => (
                                        <th key={h} className={th}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {appTraffic.map((a) => (
                                    <tr key={`${a.app}-${a.platform}`} className="border-t border-secondary">
                                        <td className={cx(td, "font-medium text-primary")}>{a.app}</td>
                                        <td className={td}>{a.platform}</td>
                                        <td className={td}>
                                            <PatternBadge pattern={a.pattern} />
                                        </td>
                                        <td className={cx(td, "font-mono text-xs")}>{a.sdk}</td>
                                        <td className={td}>{fmtInt(a.requests7d)}</td>
                                        <td className={cx(td, a.withKeywords === 0 && "font-semibold text-warning-primary", a.withKeywords > 0 && a.withKeywords < 0.8 && "text-warning-primary")}>
                                            {fmtPct(a.withKeywords)}
                                        </td>
                                        <td className={td}>
                                            <SourceChips sources={a.sources} />
                                        </td>
                                        <td className={td}>{a.distinctKeywords || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-tertiary">
                        The pattern is inferred from how the values behave, not configured here — Nimbus receives the same request whichever way you populate it. An app whose
                        keywords never change between releases reads as hardcoded; one that changes mid-version reads as remote config.
                    </p>
                </Card>

                <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-2">
                    {/* ------------------------------ defined but silent --- */}
                    <Card title={`Defined, but not arriving (${notArriving.length})`}>
                        {notArriving.length === 0 ? (
                            <p className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#1F7F80" }}>
                                <CheckCircle className="size-4" aria-hidden="true" />
                                Every keyword in your library is arriving from at least one app.
                            </p>
                        ) : (
                            <>
                                <p className="text-sm text-tertiary">
                                    These are in your library and can be targeted, but no app has sent them in the last 7 days. A campaign targeting one will never match.
                                </p>
                                <ul className="flex flex-col divide-y divide-secondary">
                                    {notArriving.map((k) => (
                                        <li key={k.id} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                            <span className="flex min-w-0 items-center gap-3">
                                                <KeywordChip value={k.value} muted />
                                                <span className="truncate text-sm text-tertiary">
                                                    {k.campaigns.length ? `${k.campaigns.length} campaign${k.campaigns.length === 1 ? "" : "s"}` : "No campaign targets it"}
                                                </span>
                                            </span>
                                            <span className="flex items-center gap-3">
                                                <span className="text-sm whitespace-nowrap text-warning-primary">
                                                    {k.campaigns.length ? `${k.campaigns.length} campaign${k.campaigns.length === 1 ? "" : "s"} waiting` : "No campaign"}
                                                </span>
                                                <a href={`#/keyword-detail?k=${k.id}`} className="text-sm font-semibold whitespace-nowrap" style={{ color: TEAL }}>
                                                    Open →
                                                </a>
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xs text-tertiary">
                                    Usually the remote config hasn't propagated, the build carrying it hasn't shipped, or it's spelled differently in the app. Matching is
                                    exact, so a stray space or a different separator is enough.
                                </p>
                            </>
                        )}
                    </Card>

                    {/* ------------------------- arriving but undefined --- */}
                    <Card
                        title={`Arriving, but not defined (${t.seenNotDefined})`}
                        trailing={
                            <Button color="secondary" size="sm" iconLeading={Plus} className="uppercase" onClick={() => (window.location.hash = "#/keyword-setup")}>
                                Add Some
                            </Button>
                        }
                    >
                        <p className="text-sm text-tertiary">
                            Your apps send these, but nothing in the library matches them, so no campaign can target them. Highest volume first;
                            the CSV has every field and the full history.
                        </p>
                        <ul className="flex flex-col divide-y divide-secondary">
                            {undefinedIncoming.map((i) => (
                                <li key={i.value} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                    <span className="flex min-w-0 flex-col gap-1">
                                        <code className="font-mono text-sm font-medium text-primary">{i.value}</code>
                                        <span className="truncate text-xs text-tertiary">{i.apps.join(", ")}</span>
                                    </span>
                                    <span className="flex items-center gap-3">
                                        <SourceChips sources={i.sources} />
                                        <span className="text-sm whitespace-nowrap text-secondary">{fmtInt(i.requests7d)}</span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p className="flex items-start gap-2 text-xs text-warning-primary">
                            <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                            <span>
                                <code className="font-mono">user_7f3a91c2</code> looks like a per-user identifier and <code className="font-mono">promo-2026-10-01</code> like a
                                dated one-off. Values like these are never worth targeting and make the keyword CSV unusable as they accumulate.
                            </span>
                        </p>
                    </Card>
                </div>

                <Card title="Getting keywords arriving">
                    <IntegrationGuide compact />
                </Card>
            </div>
        </DasShell>
    );
};
