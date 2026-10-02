import { type KeyboardEvent, type ReactNode, useEffect, useRef, useState } from "react";
import { AlertTriangle, BookOpen01, CheckCircle, ChevronDown, Plus, SearchLg, XClose } from "@untitledui/icons";
import type { Selection } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { RadioButton, RadioGroup } from "@/components/base/radio-buttons/radio-buttons";
import { MultiSelect } from "@/components/base/select/multi-select";
import { cx } from "@/utils/cx";
import { type AdUnitType, type MatchLogic, adUnitTypes, apps, languages, keywords as libraryKeywords, trafficSuggestions } from "./das-data";
import { DasShell, KeywordChip, NewFieldBadge, PINK, PinkAction, Section, TEAL } from "./das-shell";
import { GEO_REGIONS } from "./geo-data";
import { type TaxonomyNode, TaxonomyPicker } from "./taxonomy-picker";

/**
 * Deal Activation System → Targeting concepts.
 *
 * Three ways to express the Extended Targeting charter's new fields — publisher-defined
 * keywords (ANY/ALL) plus the standard targets Ad Unit Type and Device Language:
 *   A. Inline keyword chips — the charter's field, typed free-text.
 *   B. Pick from the Keyword Library — select saved keywords, create new inline.
 *   C. Audience sentence — the whole target read back as one editable sentence.
 * The field components are exported so the one-page setup concept can reuse them.
 */

const libraryIndex = new Map(libraryKeywords.map((k) => [k.value, k]));
const normalize = (raw: string) => raw.trim().toLowerCase();

/* ================================================================ Fields === */

/** Match logic: ANY (default) or ALL, with a plain-language consequence line. */
export const MatchLogicField = ({ value, onChange, count }: { value: MatchLogic; onChange: (v: MatchLogic) => void; count: number }) => (
    <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-secondary">Match logic</span>
        <RadioGroup size="sm" value={value} onChange={(v) => onChange(v as MatchLogic)} className="flex-row flex-wrap gap-6" aria-label="Match logic">
            <RadioButton value="ANY" label="ANY keyword matches" />
            <RadioButton value="ALL" label="ALL keywords must match" />
        </RadioGroup>
        <p className="text-sm text-tertiary">
            {count === 0
                ? "No keywords — this campaign isn't keyword-targeted."
                : value === "ANY"
                  ? `Serves when the request includes at least one of these ${count} keyword${count === 1 ? "" : "s"}.`
                  : `Serves only when the request includes all ${count} keywords. Each one narrows reach.`}
        </p>
    </div>
);

/**
 * Concept A field — free-text chips. Enter or comma adds; Backspace on empty removes the
 * last chip. Keywords are stored lower-case (matching is case-insensitive). Chips that
 * aren't in the library or haven't been seen in traffic get a warning.
 */
export const KeywordChipInput = ({
    initial = [] as string[],
    onCountChange,
    value,
    onChange,
}: {
    initial?: string[];
    onCountChange?: (count: number) => void;
    /** Controlled mode — the campaign form owns the keywords. */
    value?: string[];
    onChange?: (values: string[]) => void;
}) => {
    const [own, setOwn] = useState<string[]>(initial);
    const values = value ?? own;
    const setValues = (next: string[] | ((prev: string[]) => string[])) => {
        const resolved = typeof next === "function" ? next(values) : next;
        if (onChange) onChange(resolved);
        else setOwn(resolved);
    };
    const [draft, setDraft] = useState("");
    useEffect(() => onCountChange?.(values.length), [values.length, onCountChange]);

    const commit = (raw: string) => {
        const parts = raw.split(",").map(normalize).filter(Boolean);
        if (parts.length) setValues((prev) => [...prev, ...parts.filter((p) => !prev.includes(p))]);
        setDraft("");
    };

    const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commit(draft);
        } else if (e.key === "Backspace" && !draft && values.length) {
            setValues((prev) => prev.slice(0, -1));
        }
    };

    const unknown = values.filter((v) => !libraryIndex.has(v));
    const unseen = values.filter((v) => libraryIndex.has(v) && !libraryIndex.get(v)!.seenInTraffic);

    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor="kw-input" className="text-sm font-medium text-secondary">
                Keywords
            </label>
            <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-lg bg-primary px-3 py-2 shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:ring-brand">
                {values.map((v) => (
                    <KeywordChip key={v} value={v} onRemove={() => setValues((prev) => prev.filter((x) => x !== v))} />
                ))}
                <input
                    id="kw-input"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={() => draft && commit(draft)}
                    placeholder={values.length ? "" : "Type a keyword, press Enter"}
                    className="min-w-32 flex-1 bg-transparent font-mono text-sm text-primary outline-none placeholder:font-sans placeholder:text-placeholder"
                />
            </div>
            <p className="text-sm text-tertiary">
                Case-insensitive · matched against <code className="font-mono text-xs">user.keywords</code>,{" "}
                <code className="font-mono text-xs">app.keywords</code> and <code className="font-mono text-xs">content.keywords</code> in the request.
            </p>
            {unknown.length > 0 && (
                <p className="flex items-center gap-1.5 text-sm text-secondary">
                    <Plus className="size-4" style={{ color: TEAL }} aria-hidden="true" />
                    {unknown.map((u) => `“${u}”`).join(", ")} will be added to your Keyword Library.
                </p>
            )}
            {unseen.length > 0 && (
                <p className="flex items-center gap-1.5 text-sm text-warning-primary">
                    <AlertTriangle className="size-4" aria-hidden="true" />
                    {unseen.map((u) => `“${u}”`).join(", ")} hasn't appeared in your app's requests in the last 7 days.
                </p>
            )}
            <input type="hidden" name="keywords" value={values.join(",")} />
        </div>
    );
};

/** Ad Unit — which publisher placement the campaign targets. Staging calls this "Ad Unit";
 * it is NOT staging's "Ad Type", which is how a creative is encoded (HTML / VAST (xml)). */
export const AdUnitTypeField = ({
    initial = ["Interstitial"] as AdUnitType[],
    value,
    onChange,
}: {
    initial?: AdUnitType[];
    /** Controlled mode — the campaign form owns the selection. */
    value?: AdUnitType[];
    onChange?: (v: AdUnitType[]) => void;
}) => {
    const [own, setOwn] = useState<AdUnitType[]>(initial);
    const selected = value ?? own;
    const toggle = (id: AdUnitType) => {
        const next = selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id];
        if (onChange) onChange(next);
        else setOwn(next);
    };
    return (
        <div className="flex flex-col gap-2">
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {adUnitTypes.map((unit) => {
                    const isOn = selected.includes(unit.id);
                    return (
                        <label
                            key={unit.id}
                            className={cx(
                                "flex cursor-pointer items-start gap-3 rounded-xl p-4 ring-1 transition-colors duration-100",
                                isOn ? "ring-2" : "ring-secondary hover:bg-primary_hover",
                            )}
                            style={
                                isOn ? { boxShadow: `inset 0 0 0 1px ${TEAL}`, backgroundColor: `${TEAL}0f`, ["--tw-ring-color" as string]: TEAL } : undefined
                            }
                        >
                            <Checkbox size="sm" isSelected={isOn} onChange={() => toggle(unit.id)} aria-label={unit.id} />
                            <span className="flex flex-col">
                                <span className="text-sm font-semibold text-primary">{unit.id}</span>
                                <span className="text-sm text-tertiary">{unit.hint}</span>
                            </span>
                        </label>
                    );
                })}
            </div>
            <p className="text-sm text-tertiary">
                Targets the publisher's ad units, not creative sizes.{" "}
                {selected.length === 0 && <span className="text-error-primary">Select at least one.</span>}
            </p>
        </div>
    );
};

/** Device Language — ISO 639-1 multi-select; empty means all languages. */
export const DeviceLanguageField = ({
    initial = ["en"],
    value,
    onChange,
}: {
    initial?: string[];
    /** Controlled mode — the campaign form owns the selection. */
    value?: string[];
    onChange?: (v: string[]) => void;
}) => {
    const [own, setOwn] = useState<Selection>(new Set(initial));
    const selectedKeys: Selection = value ? new Set(value) : own;
    const setSelectedKeys = (next: Selection) => {
        if (onChange) onChange(next === "all" ? languages.map((l) => l.id) : [...next].map(String));
        else setOwn(next);
    };
    const count = selectedKeys === "all" ? languages.length : selectedKeys.size;
    return (
        <div className="flex max-w-md flex-col gap-1.5">
            <MultiSelect
                label="Device language"
                placeholder="All languages"
                size="md"
                items={languages}
                selectedKeys={selectedKeys}
                onSelectionChange={setSelectedKeys}
                onReset={() => setSelectedKeys(new Set<string>())}
                onSelectAll={() => setSelectedKeys(new Set(languages.map((l) => l.id)))}
            >
                {(item) => (
                    <MultiSelect.Item id={item.id} supportingText={item.supportingText}>
                        {item.label}
                    </MultiSelect.Item>
                )}
            </MultiSelect>
            <p className="text-sm text-tertiary">
                {count === 0 ? "No restriction — serves in every device language." : "From the device's OS locale (ISO 639-1)."}
            </p>
        </div>
    );
};

/* ---------------------------------------------------- Existing targets --- */

/**
 * Pick from a list: click the field and every option is there with a checkbox, or type
 * to narrow it.
 *
 * Chips stay in the field rather than living only inside the menu, so what a campaign
 * targets is readable without opening anything — which was the point of doing this
 * inline instead of behind an Edit button. Options are grouped where the list is long
 * enough that alphabetical order stops helping.
 */
export const ChipPicker = ({
    label,
    groups,
    value,
    onChange,
    placeholder,
    noun,
}: {
    label: string;
    /** Grouped options. One group with an empty name renders without headings. */
    groups: { region: string; countries: string[] }[];
    value: string[];
    onChange: (v: string[]) => void;
    placeholder: string;
    noun: string;
}) => {
    const [query, setQuery] = useState("");
    const [open, setOpen] = useState(false);
    const box = useRef<HTMLDivElement>(null);
    const all = groups.flatMap((g) => g.countries);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: globalThis.MouseEvent) => {
            if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDown);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    const q = query.trim().toLowerCase();
    const shown = groups
        .map((g) => ({ ...g, countries: g.countries.filter((c) => !q || c.toLowerCase().includes(q)) }))
        .filter((g) => g.countries.length > 0);
    const matches = shown.flatMap((g) => g.countries);

    const toggle = (o: string) => onChange(value.includes(o) ? value.filter((x) => x !== o) : [...value, o]);

    return (
        <div ref={box} className="relative flex flex-col gap-1.5">
            <div
                className="flex min-h-11 cursor-text flex-wrap items-center gap-1.5 rounded-lg bg-primary px-3 py-2 shadow-xs ring-1 ring-primary ring-inset focus-within:ring-2 focus-within:ring-brand"
                onClick={() => setOpen(true)}
            >
                {value.map((v) => (
                    <span key={v} className="inline-flex items-center gap-1 rounded-md py-0.5 pr-1 pl-2 text-sm" style={{ color: "#1F7F80", backgroundColor: `${TEAL}24` }}>
                        {v}
                        <button
                            type="button"
                            aria-label={`Remove ${v}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(value.filter((x) => x !== v));
                            }}
                            className="rounded p-0.5 hover:bg-black/5"
                        >
                            <XClose className="size-3" aria-hidden="true" />
                        </button>
                    </span>
                ))}
                <input
                    aria-label={label}
                    aria-expanded={open}
                    value={query}
                    onFocus={() => setOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && matches.length) {
                            e.preventDefault();
                            toggle(matches[0]);
                            setQuery("");
                        }
                    }}
                    placeholder={value.length ? "" : placeholder}
                    className="min-w-32 flex-1 bg-transparent text-sm text-primary outline-none placeholder:text-placeholder"
                />
                <ChevronDown className={cx("size-4 shrink-0 text-fg-quaternary transition-transform", open && "rotate-180")} aria-hidden="true" />
            </div>

            {open && (
                <div className="absolute top-full right-0 left-0 z-30 mt-1 overflow-hidden rounded-lg bg-primary shadow-xl ring-1 ring-secondary">
                    <div className="flex items-center justify-between gap-3 border-b border-secondary px-3 py-2 text-xs">
                        <span className="font-semibold text-tertiary">
                            {value.length} of {all.length} selected
                        </span>
                        <span className="flex gap-3">
                            <button type="button" className="font-semibold" style={{ color: PINK }} onClick={() => onChange(matches)}>
                                {q ? `Select ${matches.length}` : "Select all"}
                            </button>
                            {value.length > 0 && (
                                <button type="button" className="font-semibold text-tertiary" onClick={() => onChange([])}>
                                    Clear
                                </button>
                            )}
                        </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1" role="listbox" aria-multiselectable="true" aria-label={label}>
                        {matches.length === 0 ? (
                            <p className="px-3 py-6 text-center text-sm text-tertiary">No {noun} match “{query}”.</p>
                        ) : (
                            shown.map((g) => (
                                <div key={g.region}>
                                    {g.region && <span className="block px-3 pt-2 pb-1 text-xs font-semibold text-tertiary uppercase">{g.region}</span>}
                                    {g.countries.map((c) => {
                                        const on = value.includes(c);
                                        return (
                                            <button
                                                key={c}
                                                type="button"
                                                role="option"
                                                aria-selected={on}
                                                onClick={() => toggle(c)}
                                                className="flex w-full items-center gap-2.5 px-3 py-1.5 text-left text-sm text-secondary hover:bg-primary_hover"
                                            >
                                                <Checkbox size="sm" isSelected={on} onChange={() => toggle(c)} aria-label={c} />
                                                {c}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <p className="text-sm text-tertiary">
                {value.length === 0 ? `Not Specified — includes every ${noun.replace(/s$/, "")}.` : `${value.length} of ${all.length} selected`}
            </p>
        </div>
    );
};

/**
 * Geos, Platform and Apps as three peer modules — the Oct 1 review asked for these to sit
 * at the same level as Keywords and Ad Unit rather than as loose rows above them.
 */
/** Region → country. Ids are the country names, which is what a campaign stores. */
const GEO_TREE: TaxonomyNode[] = GEO_REGIONS.map((g) => ({ id: g.region, label: g.region, children: g.countries.map((c) => ({ id: c, label: c })) }));

/** Apps are flat: the product documents no grouping above them, so we don't invent one. */
const APP_NODES: TaxonomyNode[] = apps.map((a) => ({ id: a, label: a }));

/**
 * A targeting module: title on the left, and Clear all on the right once there is
 * something to clear.
 *
 * The action only appears when it would do something. A permanently visible Clear all
 * on an empty module is a button that does nothing, and it reads as the way to start
 * rather than the way to undo.
 */
const TargetCard = ({ title, onClear, children }: { title: string; onClear?: () => void; children: ReactNode }) => (
    <div className="flex flex-col gap-4 rounded-xl p-5 ring-1 ring-secondary">
        <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-primary">{title}</h3>
            {onClear && <PinkAction onPress={onClear}>Clear all</PinkAction>}
        </div>
        {children}
    </div>
);

export const ExistingTargets = ({ empty = false }: { empty?: boolean }) => {
    const [geos, setGeos] = useState<string[]>(empty ? [] : ["United States", "Canada"]);
    const [platforms, setPlatforms] = useState<string[]>(empty ? [] : ["iOS", "Android"]);
    const [appList, setAppList] = useState<string[]>(empty ? [] : apps.slice(0, 2));
    const togglePlatform = (p: string) => setPlatforms((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
    return (
        <>
            <TargetCard title="Geos" onClear={geos.length ? () => setGeos([]) : undefined}>
                <TaxonomyPicker label="Region" nodes={GEO_TREE} value={geos} onChange={setGeos} placeholder="Search countries…" noun="countries" one="country" />
            </TargetCard>
            <TargetCard title="Platform" onClear={platforms.length ? () => setPlatforms([]) : undefined}>
                <div className="flex gap-6">
                    {["iOS", "Android"].map((p) => (
                        <Checkbox key={p} size="sm" label={p} isSelected={platforms.includes(p)} onChange={() => togglePlatform(p)} />
                    ))}
                </div>
                <p className="text-sm text-tertiary">{platforms.length === 0 ? "Not Specified — includes every platform." : `${platforms.join(", ")}`}</p>
            </TargetCard>
            <TargetCard title="Apps" onClear={appList.length ? () => setAppList([]) : undefined}>
                <TaxonomyPicker label="Apps" nodes={APP_NODES} value={appList} onChange={setAppList} placeholder="Search apps…" noun="apps" one="app" />
            </TargetCard>
        </>
    );
};

/* =========================================================== Concept A === */

const TargetingPage = ({ children, concept }: { children: ReactNode; concept: Parameters<typeof DasShell>[0]["concept"] }) => (
    <DasShell navKey="deal activation setup" concept={concept}>
        <div className="mx-auto w-full max-w-5xl px-8 py-8">{children}</div>
    </DasShell>
);

export const KeywordTargetingInline = ({ match: initialMatch = "ANY" as MatchLogic, initial = ["sports", "over21", "power-user"] }) => {
    const [match, setMatch] = useState<MatchLogic>(initialMatch);
    const [count, setCount] = useState(initial.length);
    return (
        <TargetingPage
            concept={{
                label: "Concept A",
                title: "Inline keyword chips (charter pattern)",
                notes: [
                    "Type a keyword and press Enter or comma; each becomes a removable chip. Stored lower-case because matching is case-insensitive.",
                    "No trip to a separate screen. New words are added to the library automatically, so the library still grows.",
                    "Warnings catch typos early: a keyword that hasn't shown up in the app's requests for 7 days probably won't deliver.",
                ],
            }}
        >
            <Section title="Targeting" description="Who this campaign serves to. Leave a target empty to include everyone.">
                <ExistingTargets />
            </Section>

            <Section
                title="Keyword targeting"
                badge={<NewFieldBadge />}
                description="Words or codes your app sends with each ad request. Nimbus doesn't interpret them. It serves this campaign when they match."
            >
                <KeywordChipInput initial={initial} onCountChange={setCount} />
                <MatchLogicField value={match} onChange={setMatch} count={count} />
            </Section>

            <Section title="Standard targets" badge={<NewFieldBadge />}>
                <AdUnitTypeField />
                <DeviceLanguageField />
            </Section>
        </TargetingPage>
    );
};

/* =========================================================== Concept B === */

export const KeywordLibraryPicker = ({
    initial = ["sports", "power-user"],
    onCountChange,
}: {
    initial?: string[];
    onCountChange?: (count: number) => void;
}) => {
    const [selected, setSelected] = useState<string[]>(initial);
    useEffect(() => onCountChange?.(selected.length), [selected.length, onCountChange]);
    const [query, setQuery] = useState("");
    const q = normalize(query);
    const filtered = libraryKeywords.filter((k) => !q || k.value.includes(q) || k.note?.toLowerCase().includes(q));
    const canCreate = q && !libraryIndex.has(q);
    const toggle = (v: string) => setSelected((prev) => (prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]));

    return (
        <div className="overflow-hidden rounded-xl ring-1 ring-secondary">
            <div className="flex flex-col gap-3 border-b border-secondary bg-secondary/40 p-4">
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-sm font-medium text-secondary">Selected ({selected.length})</span>
                    {selected.length === 0 && <span className="text-sm text-tertiary">None yet</span>}
                    {selected.map((v) => (
                        <KeywordChip key={v} value={v} onRemove={() => toggle(v)} />
                    ))}
                </div>
                <Input
                    aria-label="Search keywords"
                    size="md"
                    icon={SearchLg}
                    placeholder="Search your keyword library or type a new one"
                    value={query}
                    onChange={setQuery}
                />
            </div>

            <ul className="max-h-80 divide-y divide-secondary overflow-y-auto">
                {canCreate && (
                    <li>
                        <button
                            type="button"
                            onClick={() => {
                                toggle(q);
                                setQuery("");
                            }}
                            className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-primary_hover"
                        >
                            <Plus className="size-4" style={{ color: PINK }} aria-hidden="true" />
                            <span>
                                Create <span className="font-mono font-semibold">“{q}”</span> and add it to the library
                            </span>
                        </button>
                    </li>
                )}
                {filtered.map((k) => (
                    <li key={k.id} className="flex items-center gap-3 px-4 py-3">
                        <Checkbox size="sm" isSelected={selected.includes(k.value)} onChange={() => toggle(k.value)} aria-label={k.value} />
                        <div className="flex min-w-0 flex-1 flex-col">
                            <span className="font-mono text-sm font-medium text-primary">{k.value}</span>
                            {k.note && <span className="truncate text-sm text-tertiary">{k.note}</span>}
                        </div>
                        <span className="hidden text-sm text-tertiary sm:inline">
                            {k.campaigns} campaign{k.campaigns === 1 ? "" : "s"}
                        </span>
                        {k.seenInTraffic ? (
                            <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: TEAL }}>
                                <CheckCircle className="size-3.5" aria-hidden="true" /> In traffic
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-warning-primary">
                                <AlertTriangle className="size-3.5" aria-hidden="true" /> Not seen 7d
                            </span>
                        )}
                    </li>
                ))}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-secondary px-4 py-3">
                <span className="text-sm text-tertiary">
                    Seen in traffic but not in the library:{" "}
                    {trafficSuggestions.map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => toggle(s)}
                            className="mr-1.5 font-mono text-sm underline decoration-dotted underline-offset-2"
                            style={{ color: TEAL }}
                        >
                            {s}
                        </button>
                    ))}
                </span>
                <PinkAction icon={BookOpen01}>Manage library</PinkAction>
            </div>
        </div>
    );
};

export const KeywordTargetingLibrary = () => {
    const [match, setMatch] = useState<MatchLogic>("ANY");
    const [count, setCount] = useState(2);
    return (
        <TargetingPage
            concept={{
                label: "Concept B",
                title: "Pick from the Keyword Library",
                notes: [
                    "Keywords are chosen from a publisher-level library, the same way countries are picked today: search, check, done.",
                    "Each row shows its note, how many campaigns use it, and whether the app is actually sending it.",
                    "Type something new to create it inline. Tokens seen in traffic but missing from the library are suggested.",
                ],
            }}
        >
            <Section
                title="Keyword targeting"
                badge={<NewFieldBadge />}
                description="Choose from the keywords your app sends. Nimbus serves this campaign when the request matches."
            >
                <KeywordLibraryPicker onCountChange={setCount} />
                <MatchLogicField value={match} onChange={setMatch} count={count} />
            </Section>
            <Section title="Standard targets" badge={<NewFieldBadge />}>
                <AdUnitTypeField initial={["Interstitial", "Rewarded"]} />
                <DeviceLanguageField initial={["en", "es"]} />
            </Section>
        </TargetingPage>
    );
};

/* =========================================================== Concept C === */

/** Tappable token inside the audience sentence. */
const Token = ({ children, tone = "teal", empty }: { children: ReactNode; tone?: "teal" | "pink"; empty?: boolean }) => {
    const color = tone === "teal" ? TEAL : PINK;
    return (
        <button
            type="button"
            className={cx(
                "mx-0.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 align-baseline font-semibold transition-colors",
                empty ? "border border-dashed" : "",
            )}
            style={empty ? { color, borderColor: color } : { color: tone === "teal" ? "#1F7F80" : "#A94579", backgroundColor: `${color}24` }}
        >
            {children}
        </button>
    );
};

export const AudienceSentence = () => (
    <TargetingPage
        concept={{
            label: "Concept C",
            title: "Audience sentence",
            notes: [
                "The full target reads back as one sentence. Every highlighted token opens its picker (the same fields as A and B).",
                "Makes ANY vs ALL impossible to misread, and doubles as the review summary on a one-page setup.",
                "Good for a friendly-publisher test: can someone who has never seen DAS say who this campaign reaches?",
            ],
        }}
    >
        <Section title="Who sees this campaign" description="Tap any highlighted part to change it.">
            <p className="max-w-3xl text-display-xs leading-[1.6] text-primary">
                Serve to people using <Token>Sample App (iOS)</Token> or <Token>Sample App (Android)</Token> in <Token>United States</Token> or{" "}
                <Token>Canada</Token>, whose app sends <Token tone="pink">any</Token> of <Token>sports</Token>,<Token>power-user</Token>, on{" "}
                <Token>Interstitial</Token> units, with a device language of <Token>English</Token>.
            </p>
            <p className="max-w-3xl text-lg text-tertiary">
                Not limiting by <Token empty>+ platform</Token> <Token empty>+ another keyword</Token>
            </p>
        </Section>

        <Section title="What this means" className="gap-3">
            <ul className="flex max-w-3xl flex-col gap-2 text-sm text-secondary">
                <li className="flex gap-2">
                    <CheckCircle className="mt-0.5 size-4 shrink-0" style={{ color: TEAL }} aria-hidden="true" />A request tagged{" "}
                    <code className="font-mono">sports</code> alone qualifies (ANY).
                </li>
                <li className="flex gap-2">
                    <CheckCircle className="mt-0.5 size-4 shrink-0" style={{ color: TEAL }} aria-hidden="true" />
                    Inline and rewarded units won't receive this campaign's creatives.
                </li>
                <li className="flex gap-2">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-fg-warning-secondary" aria-hidden="true" />
                    Spanish-language devices in the US are excluded. Add Spanish, or duplicate the campaign with Spanish creative.
                </li>
            </ul>
            <div>
                <Button color="secondary" size="sm">
                    Switch to form view
                </Button>
            </div>
        </Section>
    </TargetingPage>
);
