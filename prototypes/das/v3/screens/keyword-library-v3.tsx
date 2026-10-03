import { useState } from "react";
import { Activity, CheckSquare, ChevronDown, Download01, Edit03, InfoCircle, Plus, SearchLg, Trash01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { currentFillMode, useRegisterPageFill } from "../../../shared/demo-fill";
import { Fillable } from "../../../shared/demo-fill-ui";
import { DasShell, KeywordChip, PinkAction, TEAL } from "../../v1/screens/das-shell";
import { V3_NAV_ITEMS } from "./nav";
import { peekReturn } from "./asset-data";
import { Card, IntegrationGuide, KeywordTabs } from "./keyword-common";
import { type Keyword, addKeywords, deleteKeyword, liveCampaigns, parseKeywordList, useKeywords } from "./keyword-data";
import { BatchAction, BatchBar, BatchBlocked, BatchCell, BatchDanger, BatchHeadCell } from "./batch-actions";
import { downloadCsv, useBatch } from "./batch-data";

/**
 * Manage keywords — Keyword Setup and View All Keywords.
 *
 * Deliberately the same shape as Manage assets: a library you keep, a setup form that
 * adds to it, and the same way in and out of a campaign. The 1 Oct review asked for the
 * two to feel like one pattern even though the things themselves are different.
 *
 * FROM THE CHARTER: keywords arrive on `user.keywords`, `app.keywords` and
 * `content.keywords`, comma-separated, and the backend collapses them into one list;
 * matching is exact and case-insensitive, so everything is stored lower-case; and the
 * integration guidance on the empty state is the charter's, which specifies remote
 * config and nothing else.
 *
 * DESIGN DECISIONS: the library itself — the charter only asks for a keyword field on
 * campaign setup. Rows link to a detail page, and Remove goes through a guard rather
 * than deleting.
 *
 * KILLED ON 2 OCT, do not reintroduce: the separate Bulk add page, which did what this
 * form already does — a long paste is checked line by line here. And the Note field:
 * it was one note against however many keywords you pasted, which is not a thing a note
 * can mean.
 *
 * KILLED ON 1 OCT, do not reintroduce: ANY/ALL match logic, and device language.
 *
 * Every term on this screen carries an ADDED chip at the page level: keywords do not
 * exist in DAS today, so none of this wording can be checked against the product.
 */

export type { Keyword };

/* ---------------------------------------------------------- Keyword Setup --- */

export const KeywordSetup = ({ filled = false }: { filled?: boolean }) => {
    const library = useKeywords();
    const [text, setText] = useState(filled ? "commuter\nweekend-warrior" : "");
    const [saved, setSaved] = useState(0);
    const ret = peekReturn();

    const parsed = parseKeywordList(text, library);
    const fresh = parsed.filter((p) => p.outcome === "add");
    const existing = parsed.filter((p) => p.outcome === "skip");
    const blocked = parsed.filter((p) => p.outcome === "block");

    useRegisterPageFill(() => {
        const bad = currentFillMode() === "bad";
        setText(bad ? "sports\nSPORTS\nnight owl" : "commuter\nweekend-warrior");
    });

    const save = () => {
        if (!fresh.length || blocked.length) return;
        const values = fresh.map((p) => p.value);
        addKeywords(values.map((value) => ({ value })));
        setSaved(values.length);
        setText("");
        // location.assign rather than `location.hash =`: same navigation, but the
        // compiler lint reads a property write here as mutating a value it doesn't own.
        if (ret) window.location.assign(`${ret.href}?keep=1&addedkw=${encodeURIComponent(values.join(","))}`);
    };

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
            <KeywordTabs active="setup" />
            <div className="flex flex-col gap-6 px-8 py-8">
                {ret && (
                    <p className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: `${TEAL}0f`, color: "#1F7F80" }}>
                        <InfoCircle className="size-4 shrink-0" aria-hidden="true" />
                        Adding keywords for the campaign you were setting up. Saving brings you straight back to it.
                    </p>
                )}

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="flex min-w-0 flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-primary">Keywords *</span>
                            <Fillable filled={Boolean(text)} onFill={() => setText("commuter\nweekend-warrior")} hint="Click to fill">
                                <textarea
                                    aria-label="Keywords"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    rows={8}
                                    spellCheck={false}
                                    placeholder={"One per line, or comma-separated\ne.g. commuter, night-owl"}
                                    className="w-full rounded-lg bg-primary px-3.5 py-3 font-mono text-sm text-primary shadow-xs ring-1 ring-primary ring-inset outline-none focus:ring-2 focus:ring-brand"
                                />
                            </Fillable>
                            <span className="text-sm text-tertiary">
                                Saved lower-case. Matching is exact and case-insensitive, against <code className="font-mono text-xs">user.keywords</code> in the request.
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button color="secondary" className="uppercase" onClick={() => { setText(""); setSaved(0); }}>
                                Clear Form
                            </Button>
                            <Button color="primary-pink" className="uppercase" isDisabled={!fresh.length || blocked.length > 0} onClick={save}>
                                Add Keywords
                            </Button>
                            {saved > 0 && !ret && (
                                <span className="self-center text-sm font-medium" style={{ color: "#1F7F80" }}>
                                    {saved} keyword{saved === 1 ? "" : "s"} added.
                                </span>
                            )}
                        </div>

                        {/* Bulk add was a second page doing what this one already does.
                            Every line is checked here — casing, characters, duplicates,
                            and whether your apps are actually sending it. */}
                        <p className="text-sm text-tertiary">
                            Paste as many as you like, one per line or comma-separated. Every line is checked — casing, characters, duplicates, and whether your apps are
                            actually sending it.
                        </p>
                    </div>

                    <aside className="flex flex-col gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary xl:sticky xl:top-14">
                        <h2 className="text-lg font-semibold text-primary">Preview ({parsed.length})</h2>
                        {parsed.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-secondary p-6 text-center text-sm text-tertiary">Type above to see what gets added.</p>
                        ) : (
                            <>
                                <div className="flex flex-wrap gap-1.5">
                                    {fresh.map((p) => (
                                        <KeywordChip key={p.raw} value={p.value} />
                                    ))}
                                    {existing.map((p) => (
                                        <KeywordChip key={p.raw} value={p.value} muted />
                                    ))}
                                </div>
                                {existing.length > 0 && <p className="text-sm text-tertiary">{existing.length} already covered — they won't be duplicated.</p>}
                                {blocked.length > 0 && (
                                    <div className="flex flex-col gap-1.5 text-sm text-error-primary">
                                        {blocked.map((p) => (
                                            <span key={p.raw}>
                                                <span className="font-mono">{p.raw}</span> — {p.problems[0]?.text}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </DasShell>
    );
};

/* ------------------------------------------------------ View All Keywords --- */

export const ViewAllKeywords = ({ search = "", empty = false }: { search?: string; empty?: boolean }) => {
    const stored = useKeywords();
    const rows = empty ? [] : stored;
    const [query, setQuery] = useState(search);
    const q = query.trim().toLowerCase();
    const shown = q ? rows.filter((k) => k.value.toLowerCase().includes(q)) : rows;
    const batch = useBatch(shown);
    const visible = batch.onlySelected ? batch.selected : shown;
    // A keyword on a live campaign can't be removed in bulk — the same guard the single
    // Remove enforces, applied before the batch rather than after it.
    const removable = batch.selected.filter((k) => liveCampaigns(k).length === 0);
    const blocked = batch.selected.filter((k) => liveCampaigns(k).length > 0);
    const [showBlocked, setShowBlocked] = useState(false);
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
            <KeywordTabs active="view" />
            <div className="flex flex-col gap-5 px-8 py-8">
                {rows.length === 0 && !q ? (
                    <EmptyLibrary />
                ) : (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-display-xs font-semibold text-primary">Keywords</h2>
                            <div className="flex items-center gap-3">
                                <Input aria-label="Search Keywords" size="md" icon={SearchLg} placeholder="Search Keywords" value={query} onChange={setQuery} wrapperClassName="w-72" />
                                {/* Everything that acts on the table lives behind Actions, so
                                    the header carries one verb and one named menu rather than
                                    a row of competing buttons. Export follows the search —
                                    exporting 400 keywords when you filtered to 6 is never
                                    what you meant. */}
                                <Dropdown.Root>
                                    <Button color="secondary" className="uppercase" iconTrailing={ChevronDown}>
                                        Actions
                                    </Button>
                                    <Dropdown.Popover className="w-60">
                                        <Dropdown.Menu>
                                            <Dropdown.Item icon={CheckSquare} onAction={batch.start}>
                                                Batch actions
                                            </Dropdown.Item>
                                            <Dropdown.Item icon={Download01} onAction={() => keywordCsv(shown)}>
                                                {q ? `Export ${shown.length} shown (CSV)` : `Export all ${shown.length} (CSV)`}
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown.Popover>
                                </Dropdown.Root>
                                <Button color="primary-pink" className="uppercase" onClick={() => (window.location.hash = "#/keyword-setup")}>
                                    Add Keywords
                                </Button>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                            {batch.on && (
                                <BatchBar
                                    batch={batch}
                                    actions={
                                        <BatchAction icon={Download01} onClick={() => keywordCsv(batch.selected)}>
                                            Export selected
                                        </BatchAction>
                                    }
                                    menu={
                                        <BatchDanger
                                            onAction={() => {
                                                if (blocked.length) return setShowBlocked(true);
                                                removable.forEach((k) => deleteKeyword(k.id));
                                                batch.stop();
                                            }}
                                        >
                                            Remove {batch.selected.length} {batch.selected.length === 1 ? "keyword" : "keywords"}
                                        </BatchDanger>
                                    }
                                />
                            )}
                            <table className="w-full min-w-[900px]">
                                <thead className="bg-secondary">
                                    <tr>
                                        {batch.on && <BatchHeadCell batch={batch} />}
                                        {["Status", "Keyword", "Associated Campaigns", "In Traffic", "Updated", ""].map((h) => (
                                            <th key={h} className={th}>
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {visible.map((k) => {
                                        const live = liveCampaigns(k).length;
                                        return (
                                            <tr key={k.id} className="border-t border-secondary">
                                                {batch.on && <BatchCell batch={batch} id={k.id} label={k.value} />}
                                                <td className={td}>
                                                    <span className="inline-flex items-center gap-2">
                                                        <span className="size-2 rounded-full" style={{ backgroundColor: live ? TEAL : "#98A2B3" }} aria-hidden="true" />
                                                        {live ? "Running" : "Paused"}
                                                    </span>
                                                </td>
                                                <td className={cx(td, "font-mono font-medium")}>
                                                    <a href={`#/keyword-detail?k=${k.id}`} className="font-semibold" style={{ color: TEAL }}>
                                                        {k.value}
                                                    </a>
                                                </td>
                                                <td className={td}>{k.campaigns.length ? `${k.campaigns.length} · ${live} live` : "None"}</td>
                                                <td className={td}>{k.seenInTraffic ? "Seen last 7 days" : <span className="text-warning-primary">Not seen</span>}</td>
                                                <td className={td}>{k.updated}</td>
                                                <td className={cx(td, "whitespace-nowrap")}>
                                                    {/* Same shape as the asset table: one action in the open,
                                                        the destructive one behind the dots. Removing a keyword
                                                        can quietly narrow a live campaign's targeting, so it
                                                        shouldn't sit next to the button you press most. */}
                                                    <span className="flex items-center justify-end gap-3">
                                                        <PinkAction icon={Activity} onPress={() => (window.location.hash = "#/keyword-health")}>
                                                            Check Traffic
                                                        </PinkAction>
                                                        <Dropdown.Root>
                                                            <Dropdown.DotsButton />
                                                            <Dropdown.Popover className="w-48">
                                                                <Dropdown.Menu>
                                                                    <Dropdown.Item icon={Edit03} onAction={() => window.location.assign(`#/keyword-detail?k=${k.id}`)}>
                                                                        Edit keyword
                                                                    </Dropdown.Item>
                                                                    <Dropdown.Item icon={Trash01} onAction={() => window.location.assign(`#/keyword-delete-guard?k=${k.id}`)}>
                                                                        Remove
                                                                    </Dropdown.Item>
                                                                </Dropdown.Menu>
                                                            </Dropdown.Popover>
                                                        </Dropdown.Root>
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                    {visible.length === 0 && (
                                        <tr>
                                            <td colSpan={batch.on ? 7 : 6} className="px-3 py-10 text-center text-sm text-tertiary">
                                                No keywords match “{query}”.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
            {showBlocked && (
                <BatchBlocked
                    title={`${blocked.length} ${blocked.length === 1 ? "keyword is" : "keywords are"} on a live campaign`}
                    lead="Removing one would quietly narrow that campaign's targeting while it is serving, so these have to come off their campaigns first. Nothing was removed — deselect them and try again."
                    names={blocked.map((k) => k.value)}
                    onClose={() => setShowBlocked(false)}
                />
            )}
        </DasShell>
    );
};

/* -------------------------------------------------------------- Empty state --- */

/**
 * Nothing in the library yet. The charter never describes this state, but it implies
 * all of it: the only way a keyword means anything is if an app is already sending it,
 * so the first screen a publisher sees is about the integration, not about typing.
 */
/** The columns a keyword export carries. */
const keywordCsv = (rows: Keyword[]) =>
    downloadCsv(
        "keywords",
        ["Keyword", "Status", "Associated Campaigns", "Live Campaigns", "In Traffic", "Updated"],
        rows.map((k) => {
            const live = liveCampaigns(k).length;
            return [k.value, live ? "Running" : "Paused", k.campaigns.length, live, k.seenInTraffic ? "Seen last 7 days" : "Not seen", k.updated];
        }),
    );

const EmptyLibrary = () => (
    <div className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-4 rounded-2xl border border-dashed border-secondary p-8">
            <h2 className="text-display-xs font-semibold text-primary">No keywords yet</h2>
            <p className="max-w-2xl text-md text-tertiary">
                A keyword is a word your app puts on the bid request — a segment you already know about, like <code className="font-mono text-sm">over21</code> or{" "}
                <code className="font-mono text-sm">power-user</code>. Define it here and a DAS campaign can target it. Nimbus doesn't invent keywords and can't read them from
                anywhere else.
            </p>
            <div className="flex flex-wrap gap-3">
                <Button color="primary-pink" iconLeading={Plus} className="uppercase" onClick={() => (window.location.hash = "#/keyword-setup")}>
                    Add Keywords
                </Button>
                <Button color="secondary" className="uppercase" onClick={() => (window.location.hash = "#/keyword-health")}>
                    See What's Arriving
                </Button>
            </div>
            <p className="text-sm text-tertiary">
                Not sure what your apps already send? Keyword Health lists every keyword Nimbus has seen in the last 7 days — starting there is usually faster than typing.
            </p>
        </div>

        <Card title="Before you start">
            <IntegrationGuide />
        </Card>
    </div>
);
