import { useState } from "react";
import { AlertTriangle, CheckCircle, ClockRewind, InfoCircle, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";
import { useRegisterPageFill } from "../../../shared/demo-fill";
import { DasShell, KeywordChip, PINK, PinkAction, TEAL } from "../../v1/screens/das-shell";
import { V3_NAV_ITEMS } from "./nav";
import { BackLink, Card, ExportCsv, KeywordTabs, ReportingGuardrail, SourceChips } from "./keyword-common";
import { type Keyword, deleteKeyword, fmtInt, getKeyword, liveCampaigns, useKeywords } from "./keyword-data";

/**
 * Keyword detail / edit, and the delete guard.
 *
 * FROM THE CHARTER:
 *   - The traffic card reports which RTB fields the keyword arrived on
 *     (`user.keywords`, `app.keywords`, `content.keywords`) and restates that the
 *     backend collapses them into one list, so the source never changes what matches.
 *   - Matching is exact and case-insensitive, which is why the value is shown as the
 *     canonical lower-case form and cannot be edited into a different one.
 *   - Reporting guardrail: the card shows request volume only, and sends you to CSV for
 *     per-keyword delivery. Nothing on this page is charted.
 *   - Deleting cannot reach back into reporting: the charter records that data already
 *     written to impression trackers can't be deleted after processing.
 *
 * DESIGN DECISIONS:
 *   - A keyword is its value, so the value is read-only. Renaming would silently change
 *     what every campaign using it matches; you add the new one and remove the old.
 *   - Nothing here is editable. The note went on 2 Oct, and the value itself cannot
 *     stays readable.
 *   - The delete guard: a keyword used by a live campaign cannot be deleted at all. We
 *     block rather than warn because deleting it would narrow a running campaign's
 *     targeting with no trace on the campaign itself.
 *   - History is a local activity log. The charter does not ask for one; it is here
 *     because "who added this and when" is the first question asked about free text.
 *
 * KILLED ON 1 OCT, do not reintroduce: ANY/ALL match logic, and device language.
 */

/** Read `#/keyword-detail?k=k3` so the library table can link to a specific row. */
const idFromHash = () => new URLSearchParams(window.location.hash.split("?")[1] ?? "").get("k") ?? undefined;

export interface KeywordDetailProps {
    /** Which keyword to show. A `?k=` in the hash wins, so table rows can deep-link. */
    id?: string;
    /** Open the delete guard straight away, for the deep-linked edge-case screens. */
    confirmDelete?: boolean;
}

export const KeywordDetail = ({ id = "k1", confirmDelete = false }: KeywordDetailProps) => {
    const rows = useKeywords();
    const [activeId] = useState(() => idFromHash() ?? id);
    const keyword = rows.find((k) => k.id === activeId) ?? getKeyword(id);

    if (!keyword) {
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
                <KeywordTabs active="view" />
                <div className="flex flex-col gap-5 px-8 py-8">
                    <p className="rounded-xl border border-dashed border-secondary p-10 text-center text-sm text-tertiary">
                        That keyword is no longer in the library. <a href="#/keyword-view" className="font-semibold" style={{ color: TEAL }}>View All Keywords</a>
                    </p>
                </div>
            </DasShell>
        );
    }

    return <Detail keyword={keyword} confirmDelete={confirmDelete} />;
};

const Detail = ({ keyword, confirmDelete }: { keyword: Keyword; confirmDelete: boolean }) => {
    const [confirming, setConfirming] = useState(confirmDelete);

    const live = liveCampaigns(keyword);

    // Nothing on this page is editable now that the note is gone, so there is nothing
    // for Fill page to fill. The keyword, its campaigns and its traffic are all facts.
    useRegisterPageFill(null);


    const label = "text-xs font-semibold tracking-wide text-tertiary uppercase";

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
            <KeywordTabs active="view" />
            <div className="flex flex-col gap-6 px-8 py-8">
                <BackLink href="#/keyword-view">All keywords</BackLink>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <h2 className="font-mono text-display-xs font-semibold text-primary">{keyword.value}</h2>
                        <span className="inline-flex items-center gap-2 text-sm text-secondary">
                            <span className="size-2 rounded-full" style={{ backgroundColor: live.length ? TEAL : "#98A2B3" }} aria-hidden="true" />
                            {live.length ? `Running in ${live.length} campaign${live.length === 1 ? "" : "s"}` : "Not in a live campaign"}
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportCsv label="Export keyword CSV" />
                        <Button color="secondary" iconLeading={Trash01} className="uppercase" onClick={() => setConfirming(true)}>
                            Delete Keyword
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
                    <div className="flex min-w-0 flex-col gap-6">
                        <Card title="Keyword">
                            <div className="flex flex-col gap-1.5">
                                <span className={label}>Value</span>
                                <div className="flex flex-wrap items-center gap-3">
                                    <KeywordChip value={keyword.value} />
                                    <span className="text-sm text-tertiary">
                                        Stored lower-case. Matching is exact and case-insensitive, so{" "}
                                        <code className="font-mono text-xs">{keyword.value.toUpperCase()}</code> in a request matches this too.
                                    </span>
                                </div>
                                <span className="text-sm text-tertiary">
                                    The value can't be edited — every campaign below matches on it. To change it, add the new keyword and remove this one.
                                </span>
                            </div>
                        </Card>

                        <Card title={`Campaigns using this keyword (${keyword.campaigns.length})`} trailing={<PinkAction>Add to a campaign</PinkAction>}>
                            {keyword.campaigns.length === 0 ? (
                                <p className="rounded-xl border border-dashed border-secondary p-6 text-center text-sm text-tertiary">
                                    No campaign targets this keyword yet, so it is not changing what serves.
                                </p>
                            ) : (
                                <ul className="flex flex-col divide-y divide-secondary">
                                    {keyword.campaigns.map((c) => (
                                        <li key={c.name} className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                                            <span className="flex min-w-0 flex-col">
                                                <a href="#/campaigns" className="truncate text-sm font-semibold" style={{ color: TEAL }}>
                                                    {c.name}
                                                </a>
                                                <span className="truncate text-xs text-tertiary">{c.deal}</span>
                                            </span>
                                            <span className="inline-flex items-center gap-2 text-sm whitespace-nowrap text-secondary">
                                                <span className="size-2 rounded-full" style={{ backgroundColor: c.live ? TEAL : "#98A2B3" }} aria-hidden="true" />
                                                {c.live ? "Running" : "Paused"}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Card>

                        <Card
                            title={
                                <span className="flex items-center gap-2">
                                    <ClockRewind className="size-5 text-fg-quaternary" aria-hidden="true" />
                                    History
                                </span>
                            }
                        >
                            <ol className="flex flex-col gap-0">
                                {keyword.history.map((e, i) => (
                                    <li key={`${e.when}-${i}`} className="flex gap-3 border-l border-secondary pb-4 pl-4 last:pb-0">
                                        <span className="-ml-[21px] mt-1.5 size-2 shrink-0 rounded-full bg-quaternary" aria-hidden="true" />
                                        <span className="flex min-w-0 flex-col">
                                            <span className="text-sm text-primary">{e.what}</span>
                                            <span className="text-xs text-tertiary">
                                                {e.when} · {e.who}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ol>
                        </Card>
                    </div>

                    <aside className="flex flex-col gap-6">
                        <Card title="In traffic" className="xl:sticky xl:top-14">
                            {keyword.seenInTraffic ? (
                                <>
                                    <p className="inline-flex items-center gap-2 text-sm font-medium" style={{ color: "#1F7F80" }}>
                                        <CheckCircle className="size-4 shrink-0" aria-hidden="true" />
                                        Arriving. Last seen {keyword.lastSeen}.
                                    </p>
                                    <dl className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-1">
                                            <dt className={label}>Requests carrying it, last 7 days</dt>
                                            <dd className="text-display-xs font-semibold text-primary">{fmtInt(keyword.requests7d)}</dd>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <dt className={label}>Arriving on</dt>
                                            <dd>
                                                <SourceChips sources={keyword.sources} />
                                            </dd>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <dt className={label}>From</dt>
                                            <dd className="text-sm text-secondary">{keyword.apps.join(", ")}</dd>
                                        </div>
                                    </dl>
                                    <p className="text-xs text-tertiary">
                                        All three fields are collapsed into one list before matching, so where it arrives makes no difference to what serves.
                                    </p>
                                </>
                            ) : (
                                <>
                                    <p className="inline-flex items-start gap-2 text-sm font-medium text-warning-primary">
                                        <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                        No app has sent this keyword in the last 7 days.
                                    </p>
                                    <p className="text-sm text-tertiary">
                                        A campaign targeting it will never match until one does. The usual causes, in order:
                                    </p>
                                    <ul className="list-disc space-y-1 pl-5 text-sm text-tertiary">
                                        <li>It isn't in your remote config yet, or the change hasn't propagated.</li>
                                        <li>It's hardcoded in a build your users haven't installed.</li>
                                        <li>Your server sets it for a cohort no one is in right now.</li>
                                        <li>It's spelled differently in the app — matching is exact.</li>
                                    </ul>
                                    <a href="#/keyword-health" className="text-sm font-semibold" style={{ color: TEAL }}>
                                        Check Keyword Health →
                                    </a>
                                </>
                            )}
                            <ReportingGuardrail />
                        </Card>

                        <Card title="Deleting this keyword">
                            <p className="text-sm text-tertiary">
                                Campaigns stop matching on it immediately. Reporting already written keeps it — impression data can't be removed after it's processed.
                            </p>
                            {live.length > 0 && (
                                <p className="flex items-start gap-2 rounded-xl p-3 text-sm" style={{ backgroundColor: `${PINK}0f`, color: "#A94579" }}>
                                    <InfoCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                    {live.length} live campaign{live.length === 1 ? "" : "s"} still target{live.length === 1 ? "s" : ""} it, so it can't be deleted yet.
                                </p>
                            )}
                        </Card>
                    </aside>
                </div>
            </div>

            {confirming && <DeleteGuard keyword={keyword} onClose={() => setConfirming(false)} />}
        </DasShell>
    );
};

/* ----------------------------------------------------------- Delete guard --- */

const DeleteGuard = ({ keyword, onClose }: { keyword: Keyword; onClose: () => void }) => {
    const live = liveCampaigns(keyword);
    const blocked = live.length > 0;

    const remove = () => {
        deleteKeyword(keyword.id);
        window.location.hash = "#/keyword-view";
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div role="alertdialog" aria-modal="true" aria-label={`Delete ${keyword.value}`} className="flex w-full max-w-lg flex-col gap-5 rounded-2xl bg-primary p-6 shadow-xl">
                <div className="flex items-start gap-3">
                    <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-full"
                        style={blocked ? { backgroundColor: "#FEF0C7", color: "#B54708" } : { backgroundColor: `${PINK}1f`, color: "#A94579" }}
                    >
                        {blocked ? <AlertTriangle className="size-5" aria-hidden="true" /> : <Trash01 className="size-5" aria-hidden="true" />}
                    </span>
                    <div className="flex min-w-0 flex-col gap-1">
                        <h2 className="text-lg font-semibold text-primary">
                            {blocked ? "This keyword is in a live campaign" : "Delete "}
                            {!blocked && <span className="font-mono">{keyword.value}</span>}
                            {!blocked && "?"}
                        </h2>
                        <p className="text-sm text-tertiary">
                            {blocked ? (
                                <>
                                    <span className="font-mono text-xs">{keyword.value}</span> can't be deleted while a running campaign targets it. Deleting it would quietly
                                    narrow what that campaign matches, with nothing on the campaign to say why.
                                </>
                            ) : (
                                <>
                                    Nothing live targets it, so this is safe. Reporting already written keeps the keyword — impression data can't be removed after it's
                                    processed.
                                </>
                            )}
                        </p>
                    </div>
                </div>

                {blocked && (
                    <div className="flex flex-col gap-2 rounded-xl bg-secondary p-4">
                        <span className="text-xs font-semibold tracking-wide text-tertiary uppercase">Remove it from these first</span>
                        <ul className="flex flex-col gap-2">
                            {live.map((c) => (
                                <li key={c.name} className="flex items-center justify-between gap-3">
                                    <a href="#/campaigns" className="truncate text-sm font-semibold" style={{ color: TEAL }}>
                                        {c.name}
                                    </a>
                                    <span className="text-xs whitespace-nowrap text-tertiary">{c.deal}</span>
                                </li>
                            ))}
                        </ul>
                        {keyword.campaigns.length > live.length && (
                            <span className="text-xs text-tertiary">
                                {keyword.campaigns.length - live.length} paused campaign{keyword.campaigns.length - live.length === 1 ? "" : "s"} also target it. Those don't
                                block the delete.
                            </span>
                        )}
                    </div>
                )}

                <div className={cx("flex flex-wrap justify-end gap-3")}>
                    <Button color="secondary" className="uppercase" onClick={onClose}>
                        {blocked ? "Close" : "Cancel"}
                    </Button>
                    {blocked ? (
                        <Button color="primary-pink" className="uppercase" onClick={() => (window.location.hash = "#/campaigns")}>
                            Go To Campaigns
                        </Button>
                    ) : (
                        <Button color="primary-pink" iconLeading={Trash01} className="uppercase" onClick={remove}>
                            Delete Keyword
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
