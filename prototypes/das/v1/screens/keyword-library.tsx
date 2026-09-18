import { type ReactNode, useState } from "react";
import { AlertTriangle, CheckCircle, Download01, Edit05, Hash02, Plus, SearchLg, Trash01, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TextArea } from "@/components/base/textarea/textarea";
import { cx } from "@/utils/cx";
import { type Keyword, keywords, trafficSuggestions } from "./das-data";
import { DasShell, KeywordChip, PINK, TEAL } from "./das-shell";

/**
 * Deal Activation System → Keyword Library.
 *
 * The publisher-level list of keywords ("buckets") that campaigns target. Nimbus stores
 * them as opaque, case-insensitive tokens — it never knows what they mean. States:
 *   Default · Add keywords (bulk paste) · Delete guard (keyword used by a live
 *   campaign) · Empty (first run).
 */

type Filter = "all" | "live" | "unseen" | "unused";

const filters: { id: Filter; label: string; test: (k: Keyword) => boolean }[] = [
    { id: "all", label: "All", test: () => true },
    { id: "live", label: "In live campaigns", test: (k) => k.liveCampaigns > 0 },
    { id: "unseen", label: "Not in traffic", test: (k) => !k.seenInTraffic },
    { id: "unused", label: "Unused", test: (k) => k.campaigns === 0 },
];

/* ------------------------------------------------------------ Explainer --- */

const HowItWorks = () => (
    <div className="grid grid-cols-1 gap-4 rounded-2xl bg-secondary/50 p-5 md:grid-cols-3">
        {[
            {
                n: "1",
                title: "Your app sends keywords",
                body: (
                    <>
                        Set them in the SDK (hardcoded or remote config) as <code className="font-mono text-xs">user.keywords</code>, e.g.{" "}
                        <code className="font-mono text-xs">sports,over21</code>.
                    </>
                ),
            },
            {
                n: "2",
                title: "Add them here",
                body: "List the words your app sends. Nimbus doesn't interpret them: “plant”, “77541” or any code you've agreed with an advertiser.",
            },
            { n: "3", title: "Target campaigns", body: "Pick keywords in campaign targeting with ANY or ALL matching. Matching is case-insensitive." },
        ].map((step) => (
            <div key={step.n} className="flex gap-3">
                <span
                    className="flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: TEAL }}
                >
                    {step.n}
                </span>
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-primary">{step.title}</span>
                    <span className="text-sm text-tertiary">{step.body}</span>
                </div>
            </div>
        ))}
    </div>
);

/* ---------------------------------------------------------------- Table --- */

const TrafficCell = ({ seen }: { seen: boolean }) =>
    seen ? (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: TEAL }}>
            <CheckCircle className="size-4" aria-hidden="true" /> Seen last 7 days
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-warning-primary">
            <AlertTriangle className="size-4" aria-hidden="true" /> Not seen
        </span>
    );

const KeywordTable = ({ rows }: { rows: Keyword[] }) => (
    <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
        <table className="w-full min-w-[860px] text-left">
            <thead className="bg-secondary">
                <tr>
                    {["Keyword", "Note", "Campaigns", "In traffic", "Updated", ""].map((h) => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-tertiary">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((k, i) => (
                    <tr key={k.id} className={cx("border-t border-secondary", i % 2 === 1 && "bg-secondary/30")}>
                        <td className="px-5 py-4">
                            <KeywordChip value={k.value} />
                        </td>
                        <td className="max-w-64 px-5 py-4 text-sm text-tertiary">{k.note ?? <span className="text-quaternary">—</span>}</td>
                        <td className="px-5 py-4 text-sm text-secondary">
                            {k.campaigns === 0 ? (
                                <span className="text-quaternary">Unused</span>
                            ) : (
                                <a href="#" className="font-semibold" style={{ color: TEAL }}>
                                    {k.campaigns} campaign{k.campaigns === 1 ? "" : "s"}
                                    {k.liveCampaigns > 0 && <span className="font-normal text-tertiary"> · {k.liveCampaigns} live</span>}
                                </a>
                            )}
                        </td>
                        <td className="px-5 py-4">
                            <TrafficCell seen={k.seenInTraffic} />
                        </td>
                        <td className="px-5 py-4 text-sm whitespace-nowrap text-tertiary">
                            {k.updated}
                            <span className="block text-xs text-quaternary">{k.createdBy}</span>
                        </td>
                        <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-1">
                                <button
                                    type="button"
                                    aria-label={`Edit note for ${k.value}`}
                                    className="rounded-md p-2 text-fg-quaternary transition-colors hover:bg-primary_hover hover:text-fg-secondary"
                                >
                                    <Edit05 className="size-4" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Delete ${k.value}`}
                                    className="rounded-md p-2 text-fg-quaternary transition-colors hover:bg-primary_hover hover:text-fg-error-secondary"
                                >
                                    <Trash01 className="size-4" aria-hidden="true" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

/* -------------------------------------------------------------- Toolbar --- */

const Toolbar = ({ filter, setFilter, onAdd }: { filter: Filter; setFilter: (f: Filter) => void; onAdd: () => void }) => (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => {
                const active = f.id === filter;
                const count = keywords.filter(f.test).length;
                return (
                    <button
                        key={f.id}
                        type="button"
                        onClick={() => setFilter(f.id)}
                        className={cx(
                            "rounded-full px-3 py-1.5 text-sm font-semibold ring-1 transition-colors",
                            active ? "text-white ring-transparent" : "text-secondary ring-secondary hover:bg-primary_hover",
                        )}
                        style={active ? { backgroundColor: TEAL } : undefined}
                    >
                        {f.label} <span className={active ? "opacity-80" : "text-tertiary"}>{count}</span>
                    </button>
                );
            })}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input aria-label="Search keywords" size="sm" icon={SearchLg} placeholder="Search keywords or notes" wrapperClassName="sm:w-72" />
            <Button color="secondary" size="md" iconLeading={Download01}>
                Export CSV
            </Button>
            <Button color="primary-pink" size="md" iconLeading={Plus} onClick={onAdd}>
                Add keywords
            </Button>
        </div>
    </div>
);

/* ------------------------------------------------------------ Overlays --- */

const Overlay = ({ children }: { children: ReactNode }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-primary shadow-xl">{children}</div>
    </div>
);

const AddKeywordsPanel = ({ onClose }: { onClose?: () => void }) => {
    const [text, setText] = useState("Sports\nnight-owl, commuter\nover21");
    const tokens = [
        ...new Set(
            text
                .split(/[\n,]/)
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean),
        ),
    ];
    const existing = new Set(keywords.map((k) => k.value));
    return (
        <Overlay>
            <div className="flex items-start justify-between gap-4 border-b border-secondary px-6 py-5">
                <div className="flex gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${TEAL}1f` }}>
                        <Hash02 className="size-5" style={{ color: TEAL }} aria-hidden="true" />
                    </span>
                    <div>
                        <h2 className="text-lg font-semibold text-primary">Add keywords</h2>
                        <p className="text-sm text-tertiary">Paste one per line or comma-separated. They're saved lower-case.</p>
                    </div>
                </div>
                <button type="button" aria-label="Close" onClick={onClose} className="rounded-md p-1 text-fg-quaternary hover:bg-primary_hover">
                    <XClose className="size-5" aria-hidden="true" />
                </button>
            </div>
            <div className="flex flex-col gap-4 px-6 py-5">
                <TextArea aria-label="Keywords" rows={4} value={text} onChange={setText} textAreaClassName="font-mono" />
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-secondary">Preview ({tokens.length})</span>
                    <div className="flex flex-wrap gap-1.5">
                        {tokens.map((t) => (
                            <span key={t} className="inline-flex items-center gap-1">
                                <KeywordChip value={t} muted={existing.has(t)} />
                                {existing.has(t) && <span className="text-xs text-tertiary">already added</span>}
                            </span>
                        ))}
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-secondary/50 p-3">
                    <span className="text-sm font-medium text-secondary">Seen in your traffic, not yet in the library</span>
                    <div className="flex flex-wrap gap-1.5">
                        {trafficSuggestions.map((s) => (
                            <button
                                key={s}
                                type="button"
                                onClick={() => setText((t) => `${t}\n${s}`)}
                                className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 font-mono text-xs font-medium ring-1 ring-secondary hover:bg-primary_hover"
                            >
                                <Plus className="size-3" aria-hidden="true" />
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-secondary px-6 py-4">
                <Button color="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button color="primary-pink">Add {tokens.filter((t) => !existing.has(t)).length} keywords</Button>
            </div>
        </Overlay>
    );
};

const DeleteGuard = () => (
    <Overlay>
        <div className="flex flex-col gap-4 px-6 py-6">
            <span className="flex size-12 items-center justify-center rounded-full" style={{ backgroundColor: `${PINK}1f` }}>
                <AlertTriangle className="size-6" style={{ color: PINK }} aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-primary">
                    Delete <span className="font-mono">over21</span>?
                </h2>
                <p className="text-sm text-tertiary">
                    It's targeted by 3 campaigns, 1 of them live. Removing it changes who those campaigns reach, which may affect delivery you've promised an
                    advertiser.
                </p>
            </div>
            <ul className="divide-y divide-secondary rounded-xl ring-1 ring-secondary">
                {[
                    { name: "Over 21 · Midwest", status: "Running", note: "ALL of over21, midwest. Would become midwest only." },
                    { name: "Holiday Spirits", status: "Complete", note: "No effect" },
                    { name: "Game Day Brews", status: "Draft", note: "Keyword removed from draft" },
                ].map((c) => (
                    <li key={c.name} className="flex items-center justify-between gap-3 px-4 py-3">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-primary">{c.name}</span>
                            <span className="text-xs text-tertiary">{c.note}</span>
                        </div>
                        <span
                            className={cx("text-xs font-semibold uppercase", c.status === "Running" ? "" : "text-quaternary")}
                            style={c.status === "Running" ? { color: TEAL } : undefined}
                        >
                            {c.status}
                        </span>
                    </li>
                ))}
            </ul>
            <p className="text-sm text-tertiary">
                Renaming isn't possible for keywords in live campaigns, because the app would have to send the new word. Add the new keyword, switch campaigns
                over, then delete this one.
            </p>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-secondary px-6 py-4 sm:flex-row sm:justify-end">
            <Button color="secondary">Cancel</Button>
            <Button color="secondary">Pause live campaign first</Button>
            <Button color="primary-pink">Remove &amp; delete</Button>
        </div>
    </Overlay>
);

/* ---------------------------------------------------------------- Empty --- */

const EmptyLibrary = () => (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 py-16 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${TEAL}1f` }}>
            <Hash02 className="size-7" style={{ color: TEAL }} aria-hidden="true" />
        </span>
        <div className="flex flex-col gap-2">
            <h2 className="text-display-xs font-semibold text-primary">Target campaigns with your own keywords</h2>
            <p className="text-md text-tertiary">
                You know your audience. Tag requests in your app with keywords, add them here, and run direct deals against them: “sports fans”, “over 21”, or
                any segment you've agreed with an advertiser.
            </p>
        </div>
        <pre className="w-full overflow-x-auto rounded-xl bg-[#0C111D] px-5 py-4 text-left font-mono text-sm text-[#E4E7EC]">
            <code>{`// Sent on every ad request (OpenRTB) — set via the Nimbus SDK
"user": { "keywords": "sports,over21,power-user" }`}</code>
        </pre>
        <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-tertiary">We've already seen these in your requests:</span>
            <div className="flex flex-wrap justify-center gap-1.5">
                {trafficSuggestions.map((s) => (
                    <KeywordChip key={s} value={s} />
                ))}
            </div>
        </div>
        <div className="flex gap-3">
            <Button color="secondary">Read the SDK guide</Button>
            <Button color="primary-pink" iconLeading={Plus}>
                Add keywords
            </Button>
        </div>
    </div>
);

/* ------------------------------------------------------------------ Page --- */

export type KeywordLibraryView = "default" | "add" | "delete" | "empty";

export const KeywordLibrary = ({ view = "default" }: { view?: KeywordLibraryView }) => {
    const [filter, setFilter] = useState<Filter>("all");
    const [adding, setAdding] = useState(view === "add");
    const rows = keywords.filter(filters.find((f) => f.id === filter)!.test);

    return (
        <DasShell
            navKey="keyword library"
            concept={{
                label: "Concept",
                title: "Keyword Library: a new DAS page",
                notes: [
                    "Keywords get their own home next to Manage Assets: the same “set up first, then assign in a campaign” flow recommended for creatives.",
                    "Each keyword shows how many campaigns use it (and how many are live), plus whether the app is actually sending it, to catch typos and SDK gaps before launch.",
                    "Deleting a keyword used by a live campaign shows the impact first. Rename is blocked because the app would need to send the new word.",
                    "Open question: is the library per account (shown here) or per app?",
                ],
            }}
        >
            <div className="flex flex-col gap-6 px-8 py-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-display-xs font-semibold text-primary">Keyword Library</h2>
                    <p className="text-md text-tertiary">Keywords your apps send with ad requests, for targeting DAS campaigns.</p>
                </div>

                {view === "empty" ? (
                    <EmptyLibrary />
                ) : (
                    <>
                        <HowItWorks />
                        <Toolbar filter={filter} setFilter={setFilter} onAdd={() => setAdding(true)} />
                        <KeywordTable rows={rows} />
                        <p className="text-sm text-tertiary">{keywords.length} keywords · library applies to every app in this account.</p>
                    </>
                )}
            </div>

            {adding && <AddKeywordsPanel onClose={() => setAdding(false)} />}
            {view === "delete" && <DeleteGuard />}
        </DasShell>
    );
};

export default KeywordLibrary;
