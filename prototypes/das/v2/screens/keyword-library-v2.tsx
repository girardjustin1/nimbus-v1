import { useState, useSyncExternalStore } from "react";
import { InfoCircle, SearchLg, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { currentFillMode, useRegisterPageFill } from "../../../shared/demo-fill";
import { Fillable } from "../../../shared/demo-fill-ui";
import { DasShell, KeywordChip, PINK, PinkAction, TEAL } from "../../v1/screens/das-shell";
import { peekReturn } from "./asset-data";

/**
 * Manage keywords — Keyword Setup and View All Keywords.
 *
 * Deliberately the same shape as Manage assets: a library you keep, a setup form that
 * adds to it, and the same way in and out of a campaign. The 1 Oct review asked for the
 * two to feel like one pattern even though the things themselves are different.
 *
 * Every term on this screen carries an ADDED chip at the page level: keywords do not
 * exist in DAS today, so none of this wording can be checked against the product.
 */

export interface Keyword {
    id: string;
    value: string;
    note: string;
    campaigns: number;
    liveCampaigns: number;
    seenInTraffic: boolean;
    updated: string;
}

const seed: Keyword[] = [
    { id: "k1", value: "sports", note: "Follows 2+ teams", campaigns: 4, liveCampaigns: 2, seenInTraffic: true, updated: "Sep 12, 2026" },
    { id: "k2", value: "over21", note: "Age-gated; alcohol eligible", campaigns: 3, liveCampaigns: 1, seenInTraffic: true, updated: "Sep 10, 2026" },
    { id: "k3", value: "power-user", note: "7+ sessions / week", campaigns: 2, liveCampaigns: 2, seenInTraffic: true, updated: "Sep 8, 2026" },
    { id: "k4", value: "night-owl", note: "Active after 11pm", campaigns: 1, liveCampaigns: 0, seenInTraffic: true, updated: "Sep 2, 2026" },
    { id: "k5", value: "tailgate", note: "Seasonal, pre-game", campaigns: 0, liveCampaigns: 0, seenInTraffic: false, updated: "Aug 28, 2026" },
];

let keywords: Keyword[] = seed;
const listeners = new Set<() => void>();
const addKeywords = (values: { value: string; note: string }[]) => {
    keywords = [
        ...values.map((v, i) => ({ id: `k-new-${Date.now()}-${i}`, value: v.value, note: v.note, campaigns: 0, liveCampaigns: 0, seenInTraffic: false, updated: "Just now" })),
        ...keywords,
    ];
    listeners.forEach((l) => l());
};
const useKeywords = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => keywords);

/** Everything here is our wording — keywords have no presence in DAS today. */
const AddedPageBanner = () => (
    <p className="flex items-center gap-2 rounded-xl border border-dashed px-4 py-2.5 text-sm" style={{ borderColor: `${PINK}66`, backgroundColor: `${PINK}08`, color: "#A94579" }}>
        <span className="rounded-full border border-dashed px-1.5 py-px text-[10px] font-bold uppercase" style={{ borderColor: `${PINK}99` }}>
            Added
        </span>
        Keywords are new in the Extended Targeting charter. Every label on this page is ours — there is nothing in DAS today to match it against.
    </p>
);

const Tabs = ({ active }: { active: "setup" | "view" }) => (
    <div className="flex border-b border-secondary px-8">
        {[
            { id: "setup", label: "Keyword Setup", href: "#/keyword-setup" },
            { id: "view", label: "View All Keywords", href: "#/keyword-view" },
        ].map((t) => (
            <a
                key={t.id}
                href={t.href}
                aria-current={active === t.id ? "page" : undefined}
                className={cx("-mb-px border-b-2 px-6 py-4 text-md font-semibold transition-colors", active === t.id ? "border-current" : "border-transparent hover:opacity-80")}
                style={{ color: TEAL, backgroundColor: active === t.id ? `${TEAL}14` : undefined }}
            >
                {t.label}
            </a>
        ))}
    </div>
);

/* ---------------------------------------------------------- Keyword Setup --- */

export const KeywordSetup = ({ filled = false }: { filled?: boolean }) => {
    const [text, setText] = useState(filled ? "commuter\nweekend-warrior" : "");
    const [note, setNote] = useState(filled ? "Autumn campaign segments" : "");
    const [saved, setSaved] = useState(0);
    const ret = peekReturn();

    const tokens = [...new Set(text.split(/[\n,]/).map((t) => t.trim().toLowerCase()).filter(Boolean))];
    const existing = tokens.filter((t) => keywords.some((k) => k.value === t));
    const fresh = tokens.filter((t) => !existing.includes(t));

    useRegisterPageFill(() => {
        const bad = currentFillMode() === "bad";
        setText(bad ? "sports\nSPORTS\n   " : "commuter\nweekend-warrior");
        setNote(bad ? "" : "Autumn campaign segments");
    });

    const save = () => {
        if (!fresh.length) return;
        addKeywords(fresh.map((value) => ({ value, note })));
        setSaved(fresh.length);
        setText("");
        if (ret) window.location.hash = `${ret.href}?keep=1&addedkw=${encodeURIComponent(fresh.join(","))}`;
    };

    return (
        <DasShell navKey="keyword library">
            <Tabs active="setup" />
            <div className="flex flex-col gap-6 px-8 py-8">
                <AddedPageBanner />
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

                        <div className="flex max-w-md flex-col gap-1.5">
                            <span className="text-sm font-semibold text-primary">Note</span>
                            <Fillable filled={Boolean(note)} onFill={() => setNote("Autumn campaign segments")}>
                                <Input aria-label="Note" size="md" value={note} onChange={setNote} placeholder="What this segment means" />
                            </Fillable>
                            <span className="text-sm text-tertiary">For your team. Nimbus never interprets the keyword itself.</span>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button color="secondary" className="uppercase" onClick={() => { setText(""); setNote(""); setSaved(0); }}>
                                Clear Form
                            </Button>
                            <Button color="primary-pink" className="uppercase" isDisabled={!fresh.length} onClick={save}>
                                Add Keywords
                            </Button>
                            {saved > 0 && !ret && (
                                <span className="self-center text-sm font-medium" style={{ color: "#1F7F80" }}>
                                    {saved} keyword{saved === 1 ? "" : "s"} added.
                                </span>
                            )}
                        </div>
                    </div>

                    <aside className="flex flex-col gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary xl:sticky xl:top-14">
                        <h2 className="text-lg font-semibold text-primary">Preview ({tokens.length})</h2>
                        {tokens.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-secondary p-6 text-center text-sm text-tertiary">Type above to see what gets added.</p>
                        ) : (
                            <>
                                <div className="flex flex-wrap gap-1.5">
                                    {fresh.map((t) => (
                                        <KeywordChip key={t} value={t} />
                                    ))}
                                    {existing.map((t) => (
                                        <KeywordChip key={t} value={t} muted />
                                    ))}
                                </div>
                                {existing.length > 0 && <p className="text-sm text-tertiary">{existing.length} already in the library — they won't be duplicated.</p>}
                            </>
                        )}
                    </aside>
                </div>
            </div>
        </DasShell>
    );
};

/* ------------------------------------------------------ View All Keywords --- */

export const ViewAllKeywords = ({ search = "" }: { search?: string }) => {
    const rows = useKeywords();
    const [query, setQuery] = useState(search);
    const q = query.trim().toLowerCase();
    const shown = q ? rows.filter((k) => `${k.value} ${k.note}`.toLowerCase().includes(q)) : rows;
    const th = "px-3 py-2.5 text-left text-xs font-semibold text-tertiary";
    const td = "px-3 py-3 text-sm text-secondary";

    return (
        <DasShell navKey="keyword library">
            <Tabs active="view" />
            <div className="flex flex-col gap-5 px-8 py-8">
                <AddedPageBanner />
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-display-xs font-semibold text-primary">Keywords</h2>
                    <div className="flex items-center gap-3">
                        <Input aria-label="Search Keywords" size="md" icon={SearchLg} placeholder="Search Keywords" value={query} onChange={setQuery} wrapperClassName="w-72" />
                        <Button color="primary-pink" className="uppercase" onClick={() => (window.location.hash = "#/keyword-setup")}>
                            Add Keywords
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-secondary">
                            <tr>
                                {["Status", "Keyword", "Note", "Associated Campaigns", "In Traffic", "Updated", ""].map((h) => (
                                    <th key={h} className={th}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {shown.map((k) => (
                                <tr key={k.id} className="border-t border-secondary">
                                    <td className={td}>
                                        <span className="inline-flex items-center gap-2">
                                            <span className="size-2 rounded-full" style={{ backgroundColor: k.liveCampaigns ? TEAL : "#98A2B3" }} aria-hidden="true" />
                                            {k.liveCampaigns ? "Running" : "Paused"}
                                        </span>
                                    </td>
                                    <td className={cx(td, "font-mono font-medium text-primary")}>{k.value}</td>
                                    <td className={td}>{k.note || "—"}</td>
                                    <td className={td}>{k.campaigns ? `${k.campaigns} · ${k.liveCampaigns} live` : "None"}</td>
                                    <td className={td}>{k.seenInTraffic ? "Seen last 7 days" : <span className="text-warning-primary">Not seen</span>}</td>
                                    <td className={td}>{k.updated}</td>
                                    <td className={cx(td, "whitespace-nowrap")}>
                                        <PinkAction icon={XClose}>Remove</PinkAction>
                                    </td>
                                </tr>
                            ))}
                            {shown.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="px-3 py-10 text-center text-sm text-tertiary">
                                        No keywords match “{query}”.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DasShell>
    );
};
