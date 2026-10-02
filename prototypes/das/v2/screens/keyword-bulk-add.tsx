import { useState } from "react";
import { AlertTriangle, CheckCircle, InfoCircle, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { currentFillMode, useRegisterPageFill } from "../../../shared/demo-fill";
import { Fillable } from "../../../shared/demo-fill-ui";
import { DasShell, PINK, TEAL } from "../../v1/screens/das-shell";
import { V2_NAV_ITEMS } from "./nav";
import { BackLink, Card, KeywordTabs } from "./keyword-common";
import { MAX_KEYWORD_LENGTH, type ParsedKeyword, type Severity, addKeywords, parseKeywordList, useKeywords } from "./keyword-data";

/**
 * Bulk add — paste a list, see what will happen to every line before anything is saved.
 *
 * FROM THE CHARTER:
 *   - Keywords arrive comma-separated, so a pasted list splits on commas as well as
 *     newlines: this is how a publisher's remote config value actually looks.
 *   - Matching is case-insensitive, so two lines differing only in case are one keyword.
 *     That is why a casing collision is reported rather than silently accepted.
 *   - "Keywords are free-text and could generate unlimited unique values" — the
 *     cardinality warning is the charter's reporting-explosion risk, caught at the point
 *     the values are created rather than after they are in reporting.
 *   - A keyword nothing is sending can never match, which is why the traffic check runs
 *     here against what Nimbus has actually seen.
 *
 * DESIGN DECISIONS:
 *   - Three severities rather than valid/invalid. Blocked lines (bad characters, over
 *     length) stop the save; skipped lines (duplicate, casing collision, already in the
 *     library) are dropped quietly and counted; warnings (not seen in traffic) save
 *     anyway, because a keyword can legitimately be defined before the app ships it.
 *   - Nothing is auto-corrected. We show "stored as" beside the raw line so a publisher
 *     can see the lower-casing happen rather than discovering it later.
 *   - The character rule and the 64-character ceiling are ours; see keyword-data.ts.
 *
 * KILLED ON 1 OCT, do not reintroduce: ANY/ALL match logic, and device language.
 */

const GOOD_PASTE = `commuter
weekend-warrior
fantasy-football
soccer`;

/** Every problem class the validator knows about, in one paste. */
const BAD_PASTE = `sports
SPORTS
over21
night owl
weekend-warrior,weekend-warrior
-leading-hyphen
a-keyword-name-so-long-that-nobody-would-ever-type-it-on-purpose-and-it-runs-right-past-the-limit
tailgate`;

const TONE: Record<Severity | "add", { label: string; color: string; bg: string }> = {
    add: { label: "Will be added", color: "#1F7F80", bg: `${TEAL}1f` },
    warning: { label: "Added with a warning", color: "#B54708", bg: "#FEF0C7" },
    skipped: { label: "Skipped", color: "#475467", bg: "#F2F4F7" },
    blocked: { label: "Blocked", color: "#A94579", bg: `${PINK}1f` },
};

const rowTone = (row: ParsedKeyword): Severity | "add" =>
    row.outcome === "block" ? "blocked" : row.outcome === "skip" ? "skipped" : row.problems.length ? "warning" : "add";

export interface BulkAddKeywordsProps {
    /** Start with a clean list, a list full of problems, or nothing. */
    preset?: "empty" | "good" | "problems";
}

export const BulkAddKeywords = ({ preset = "empty" }: BulkAddKeywordsProps) => {
    const library = useKeywords();
    const [text, setText] = useState(preset === "good" ? GOOD_PASTE : preset === "problems" ? BAD_PASTE : "");
    const [note, setNote] = useState(preset === "good" ? "Autumn campaign segments" : "");
    const [added, setAdded] = useState(0);

    useRegisterPageFill(() => {
        const bad = currentFillMode() === "bad";
        setText(bad ? BAD_PASTE : GOOD_PASTE);
        setNote(bad ? "" : "Autumn campaign segments");
        setAdded(0);
    });

    const rows = parseKeywordList(text, library);
    const toAdd = rows.filter((r) => r.outcome === "add");
    const skipped = rows.filter((r) => r.outcome === "skip");
    const blocked = rows.filter((r) => r.outcome === "block");
    const warned = toAdd.filter((r) => r.problems.length > 0);

    const dropBlocked = () => setText(rows.filter((r) => r.outcome !== "block").map((r) => r.raw).join("\n"));

    const save = () => {
        if (blocked.length || !toAdd.length) return;
        addKeywords(toAdd.map((r) => ({ value: r.value, note })));
        setAdded(toAdd.length);
        setText("");
    };

    const th = "px-3 py-2.5 text-left text-xs font-semibold text-tertiary";
    const td = "px-3 py-3 align-top text-sm break-words text-secondary";

    return (
        <DasShell
            navItems={V2_NAV_ITEMS}
            navKey="keyword library"
            concept={{
                label: "Round 2 · Added",
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
                <BackLink href="#/keyword-setup">Keyword Setup</BackLink>

                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <h2 className="text-display-xs font-semibold text-primary">Bulk add keywords</h2>
                        <p className="max-w-2xl text-sm text-tertiary">
                            Paste the list straight out of your remote config. Commas and new lines both work, because that is how the value arrives on the request. Nothing is
                            saved until every line below is accounted for.
                        </p>
                    </div>
                    {added > 0 && (
                        <span className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium" style={{ backgroundColor: `${TEAL}0f`, color: "#1F7F80" }}>
                            <CheckCircle className="size-4" aria-hidden="true" />
                            {added} keyword{added === 1 ? "" : "s"} added to the library.
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-primary">Paste keywords *</span>
                            <Fillable filled={Boolean(text)} onFill={() => setText(GOOD_PASTE)} hint="Click to paste a sample list">
                                <textarea
                                    aria-label="Paste keywords"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    rows={14}
                                    spellCheck={false}
                                    placeholder={"sports, over21, power-user\nor one per line"}
                                    className="w-full rounded-lg bg-primary px-3.5 py-3 font-mono text-sm text-primary shadow-xs ring-1 ring-primary ring-inset outline-none focus:ring-2 focus:ring-brand"
                                />
                            </Fillable>
                            <span className="text-sm text-tertiary">
                                a–z, 0–9, dot, colon, hyphen and underscore, up to {MAX_KEYWORD_LENGTH} characters. Everything is stored lower-case.
                            </span>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-sm font-semibold text-primary">Note for all of them</span>
                            <Fillable filled={Boolean(note)} onFill={() => setNote("Autumn campaign segments")}>
                                <Input aria-label="Note for all of them" size="md" value={note} onChange={setNote} placeholder="What this batch is for" />
                            </Fillable>
                            <span className="text-sm text-tertiary">Applied to every keyword added here. You can change each one afterwards.</span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button color="secondary" className="uppercase" onClick={() => { setText(""); setNote(""); setAdded(0); }}>
                                Clear Form
                            </Button>
                            <Button color="primary-pink" className="uppercase" isDisabled={blocked.length > 0 || toAdd.length === 0} onClick={save}>
                                Add {toAdd.length || ""} Keyword{toAdd.length === 1 ? "" : "s"}
                            </Button>
                        </div>
                        {blocked.length > 0 && (
                            <p className="flex items-start gap-2 text-sm text-error-primary">
                                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                {blocked.length} line{blocked.length === 1 ? "" : "s"} can't be saved. Fix {blocked.length === 1 ? "it" : "them"} or{" "}
                                <button type="button" onClick={dropBlocked} className="font-semibold underline underline-offset-2">
                                    remove {blocked.length === 1 ? "it" : "them"}
                                </button>
                                .
                            </p>
                        )}
                    </div>

                    <Card title={`What will happen (${rows.length} line${rows.length === 1 ? "" : "s"})`}>
                        {rows.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-secondary p-10 text-center text-sm text-tertiary">
                                Paste a list to see every line checked before anything is saved.
                            </p>
                        ) : (
                            <>
                                <div className="flex flex-wrap gap-2">
                                    <Summary tone="add" n={toAdd.length} text="will be added" />
                                    <Summary tone="warning" n={warned.length} text="of those, not seen in traffic" />
                                    <Summary tone="skipped" n={skipped.length} text="skipped" />
                                    <Summary tone="blocked" n={blocked.length} text="blocked" />
                                </div>

                                <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                                    <table className="w-full min-w-[460px]">
                                        <thead className="bg-secondary">
                                            <tr>
                                                {["Line", "Stored as", "Outcome", "Why"].map((h) => (
                                                    <th key={h} className={th}>
                                                        {h}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((r, i) => {
                                                const tone = TONE[rowTone(r)];
                                                return (
                                                    <tr key={`${r.raw}-${i}`} className="border-t border-secondary">
                                                        <td className={cx(td, "font-mono text-primary")}>{r.raw}</td>
                                                        <td className={cx(td, "font-mono")}>{r.outcome === "block" ? "—" : r.value}</td>
                                                        <td className={td}>
                                                            <span className="inline-flex rounded-md px-2 py-0.5 text-xs font-semibold whitespace-nowrap" style={{ color: tone.color, backgroundColor: tone.bg }}>
                                                                {tone.label}
                                                            </span>
                                                        </td>
                                                        <td className={td}>
                                                            {r.problems.length === 0 ? (
                                                                <span className="text-tertiary">Looks good — and your apps are already sending it.</span>
                                                            ) : (
                                                                <ul className="flex flex-col gap-1">
                                                                    {r.problems.map((p) => (
                                                                        <li key={p.code} className={cx(p.severity === "blocked" && "text-error-primary", p.severity === "warning" && "text-warning-primary")}>
                                                                            {p.text}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="flex items-start gap-2 text-xs text-tertiary">
                                    <InfoCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                                    Keywords are free text, so every new one is a new value in reporting. Adding a few hundred one-off values — a per-user id, a dated promo
                                    code — makes the CSV export unusable long before it affects what serves.
                                </p>
                            </>
                        )}
                    </Card>
                </div>
            </div>
        </DasShell>
    );
};

const Summary = ({ tone, n, text }: { tone: Severity | "add"; n: number; text: string }) => {
    const t = TONE[tone];
    return (
        <span
            className={cx("inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold", n === 0 && "opacity-40")}
            style={{ color: t.color, backgroundColor: t.bg }}
        >
            {tone === "blocked" && n > 0 && <XClose className="size-4" aria-hidden="true" />}
            {n} {text}
        </span>
    );
};
