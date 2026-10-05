import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle, CheckDone01, CheckSquare, ChevronDown, Download01, Edit03, InfoCircle, PlayCircle, SearchLg, Trash01, XCircle } from "@untitledui/icons";
import { Button } from "./type-rules";
import { Dropdown } from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { AdFormatDemo } from "./type-rules";
import { cx } from "@/utils/cx";
import { currentFillMode, useRegisterPageFill } from "../../../shared/demo-fill";
import { Fillable } from "../../../shared/demo-fill-ui";
import { DasShell, PINK, PinkAction, TEAL } from "./das-shell";
import { V3_NAV_ITEMS } from "./nav";
import { BatchAction, BatchBar, BatchBlocked, BatchCell, BatchDanger, BatchHeadCell } from "./batch-actions";
import { downloadCsv, useBatch } from "./batch-data";
import { AD_SIZES, AD_TYPES, type AdSize, type AdType, type Asset, type MarkupIssue, addAsset, deleteAsset, findMacros, isWrappedVast, peekReturn, previewFor, useAssets, validateMarkup } from "./asset-data";

/**
 * Manage assets — Asset Setup and View All Assets.
 *
 * Transcribed from the staging screen: the field labels, the Ad Size options, the button
 * labels and the table columns are the product's own words. A creative is not a file
 * upload — you paste VAST or HTML markup, and third-party trackers are URLs that get
 * embedded into that markup by the Nimbus renderer.
 *
 * What we add: the preview beside the form, so you can see the format you are creating
 * before you save it. It is an approximation of the placement, not a render of the markup.
 */

/**
 * The good scenario: a tag that passes every check.
 *
 * Every attribute quoted, every URL https, nothing that needs substituting, and the
 * elements balanced — so Validate Markup comes back clean and you can see what clean
 * looks like before you see what broken looks like.
 */
const SAMPLE_HTML = `<div id="autumn-mrec" style="width:300px;height:250px">
  <a href="https://example.com/click?cid=10482&cr=mrec-autumn" target="_blank">
    <img src="https://cdn.example.com/creative/300x250-autumn.png" width="300" height="250" alt="Autumn sale" />
  </a>
</div>`;

const SAMPLE_VAST = `<VAST version="4.0">
  <Ad id="sample-15s">
    <InLine>
      <AdTitle>Sample 15s</AdTitle>
      <Creatives>…</Creatives>
    </InLine>
  </Ad>
</VAST>`;

/** The bad VAST scenario: no version, wrapped rather than inline, and a macro. */
const BAD_VAST = `<VAST>
  <Ad id="autumn-15s">
    <Wrapper>
      <VASTAdTagURI>https://adserver.example.com/vast?cb=[CACHEBUSTER]</VASTAdTagURI>
    </Wrapper>
  </Ad>
</VAST>`;

/**
 * The bad scenario: five distinct faults, each on its own line.
 *
 * Deliberately not gibberish. Every one of these is a real mistake that arrives in a
 * pasted tag, and each is on a different line so the report has something to point at:
 *
 *   1  the <div> is never closed with ">", so the rest is swallowed into the tag
 *   2  href isn't quoted, so the URL is truncated at the "&"
 *   3  loaded over http:// (blocked as mixed content) and carries a macro
 *   5  document.write(), which silently does nothing once a webview has loaded
 */
const BAD_MARKUP = `<div id="autumn-mrec"
  <a href=https://example.com/click?cid=10482&cr=mrec-autumn>
    <img src="http://cdn.example.com/300x250.png?cb=\${CACHEBUSTER}" alt="Autumn sale" />
  </a>
  <script>document.write('<img src="https://track.example.com/imp" />');</script>
</div>`;

/**
 * Markup that would be rejected for containing macros.
 *
 * The charter is unambiguous: static creatives "must not include macros", VAST creatives
 * "must not include macros", and "macros are not supported in any third-party trackers".
 * Nimbus does not substitute them — a creative pasted with macros in it serves them as
 * literal text, so the cachebuster never busts and the click tracker never resolves.
 */
const MACRO_MARKUP = `<div id="sample-creative">
  <a href="https://adserver.example.com/click?cb=\${CACHEBUSTER}&redirect=\${CLICK_URL_ENC}">
    <img src="https://cdn.example.com/300x250.png?ts=[TIMESTAMP]" alt="" />
  </a>
  <img src="https://track.example.com/imp?id=%%CACHEBUSTER%%" width="1" height="1" />
</div>`;

/**
 * Sample tracker URLs. Three of each, because that is what the real form offers and
 * publishers routinely stack them: their own measurement, the advertiser's verification
 * vendor, and an agency pixel. None carry macros — the charter forbids those here too.
 */
const SAMPLE_IMPRESSION_URLS = [
    "https://track.example.com/imp?cid=10482&cr=mrec-autumn",
    "https://verify.example-dsp.com/pixel/imp/9f31c2",
    "https://agency.example.net/t/i?campaign=fall-launch",
];

const SAMPLE_CLICK_URLS = [
    "https://track.example.com/clk?cid=10482&cr=mrec-autumn",
    "https://verify.example-dsp.com/pixel/clk/9f31c2",
    "https://agency.example.net/t/c?campaign=fall-launch",
];

/** In bad mode: one macro, one missing its scheme, one fine — so all three errors show. */
const BAD_IMPRESSION_URLS = ["https://track.example.com/imp?cb=%%CACHEBUSTER%%", "track.example.com/imp?id=2", "https://agency.example.net/t/i?campaign=fall-launch"];
const BAD_CLICK_URLS = ["https://track.example.com/clk?ts=[TIMESTAMP]", "clk.example.com/go", ""];


const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <span className="text-md font-semibold text-primary">
        {children}
        {required && " *"}
    </span>
);

/** Prototype chrome: marks wording with no equivalent in the product. */
const Added = () => (
    <span
        title="Our wording — no equivalent in DAS today"
        className="ml-2 rounded-full border border-dashed px-1.5 py-px text-md font-bold uppercase"
        style={{ color: "#A94579", borderColor: `${PINK}99` }}
    >
        Added
    </span>
);

const Tabs = ({ active }: { active: "setup" | "view" }) => (
    <div className="flex border-b border-secondary px-8">
        {[
            { id: "setup", label: "Asset Setup", href: "#/asset-setup" },
            { id: "view", label: "View All Assets", href: "#/asset-view" },
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

/* ------------------------------------------------------ Add Markup field --- */

/** The gutter, the stripes and the textarea all have to agree on this. */
const LINE_HEIGHT = 20;

const RED = "#D92D20";
const AMBER = "#B54708";

export interface MarkupReport {
    /** The exact text this report was produced from, so we can tell when it goes stale. */
    at: string;
    issues: MarkupIssue[];
}

/**
 * The Add Markup field: line-located feedback, without pretending to be a code editor.
 *
 * Two kinds of checking, deliberately separated.
 *
 * **Live, as you type** — only the properties of a *paste*: macros, a wrapped VAST tag,
 * VAST sitting in an HTML slot. Each is true the instant the text lands and doesn't
 * depend on the markup being finished.
 *
 * **On demand, via Validate Markup** — the structural pass that reads line by line.
 * Running that on every keystroke would be hostile, because markup is malformed for as
 * long as you are halfway through typing it. It also runs on blur, so you find out
 * without having to know the button is there.
 *
 * A report is tied to the exact text it ran against. Edit afterwards and it is marked
 * stale rather than leaving a green tick over markup that has since changed.
 */
const MarkupField = ({
    value,
    onChange,
    type,
    liveError,
    report,
    onReport,
}: {
    value: string;
    onChange: (next: string) => void;
    type: AdType | undefined;
    /** The live, paste-level problem, if any. */
    liveError?: string;
    report: MarkupReport | null;
    onReport: (r: MarkupReport | null) => void;
}) => {
    const taRef = useRef<HTMLTextAreaElement>(null);
    const gutterRef = useRef<HTMLDivElement>(null);
    const stripesRef = useRef<HTMLDivElement>(null);

    const lines = value.split("\n");
    const stale = report !== null && report.at !== value;
    const issues = report && !stale ? report.issues : [];
    const errors = issues.filter((i) => i.severity === "error");
    const warnings = issues.filter((i) => i.severity === "warning");

    const toneOf = (line: number) =>
        issues.some((i) => i.line === line && i.severity === "error") ? "error" : issues.some((i) => i.line === line) ? "warning" : null;

    // Keep the gutter and the highlight stripes locked to the textarea's own scrolling.
    const syncScroll = () => {
        const top = taRef.current?.scrollTop ?? 0;
        if (gutterRef.current) gutterRef.current.scrollTop = top;
        if (stripesRef.current) stripesRef.current.style.transform = `translateY(${-top}px)`;
    };

    const run = () => onReport({ at: value, issues: validateMarkup(value, type ?? "HTML") });

    /** Put the caret on the offending line and select it, so the report is actionable. */
    const jumpTo = (line: number) => {
        const ta = taRef.current;
        if (!ta) return;
        const start = lines.slice(0, line - 1).reduce((n, l) => n + l.length + 1, 0);
        ta.focus();
        ta.setSelectionRange(start, start + (lines[line - 1]?.length ?? 0));
        ta.scrollTop = Math.max(0, (line - 1) * LINE_HEIGHT - LINE_HEIGHT * 3);
        syncScroll();
    };

    const sample = (kind: "good" | "bad") => {
        const isVast = type === "VAST (xml)";
        onChange(kind === "good" ? (isVast ? SAMPLE_VAST : SAMPLE_HTML) : isVast ? BAD_VAST : BAD_MARKUP);
        onReport(null);
    };

    const bad = Boolean(liveError) || errors.length > 0;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <Label required>Add Markup</Label>
                <span className="flex items-center gap-1.5 text-md text-tertiary">
                    Load a sample:
                    <button type="button" onClick={() => sample("good")} className="rounded-md px-1.5 py-0.5 font-semibold hover:bg-secondary" style={{ color: "#1F7F80" }}>
                        valid
                    </button>
                    <span aria-hidden="true">/</span>
                    <button type="button" onClick={() => sample("bad")} className="rounded-md px-1.5 py-0.5 font-semibold hover:bg-secondary" style={{ color: AMBER }}>
                        with errors
                    </button>
                </span>
            </div>

            <Fillable filled={Boolean(value)} onFill={() => sample("good")} hint="Click to paste sample markup">
                <div
                    className={cx(
                        "relative flex overflow-hidden rounded-lg bg-primary shadow-xs ring-1 ring-inset",
                        bad ? "ring-error_subtle" : "ring-primary focus-within:ring-2 focus-within:ring-brand",
                    )}
                >
                    <div
                        ref={gutterRef}
                        aria-hidden="true"
                        className="w-11 shrink-0 overflow-hidden border-r border-secondary bg-secondary py-3 text-right font-mono text-md select-none"
                        style={{ lineHeight: `${LINE_HEIGHT}px` }}
                    >
                        {lines.map((_, i) => {
                            const tone = toneOf(i + 1);
                            return (
                                <div key={i} className="pr-2" style={{ height: LINE_HEIGHT, color: tone === "error" ? RED : tone === "warning" ? AMBER : "#98A2B3", fontWeight: tone ? 700 : 400 }}>
                                    {i + 1}
                                </div>
                            );
                        })}
                    </div>

                    {/* Behind the text: one stripe per flagged line, scrolled with it. */}
                    <div className="pointer-events-none absolute inset-y-0 right-0 left-11 overflow-hidden" aria-hidden="true">
                        <div ref={stripesRef} className="py-3">
                            {lines.map((_, i) => {
                                const tone = toneOf(i + 1);
                                return <div key={i} style={{ height: LINE_HEIGHT, backgroundColor: tone === "error" ? `${RED}14` : tone === "warning" ? `${AMBER}14` : "transparent" }} />;
                            })}
                        </div>
                    </div>

                    <textarea
                        ref={taRef}
                        aria-label="Add Markup"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onScroll={syncScroll}
                        onBlur={() => value.trim() && run()}
                        rows={Math.min(20, Math.max(8, lines.length + 1))}
                        spellCheck={false}
                        wrap="off"
                        placeholder={type === "VAST (xml)" ? "Paste raw, unwrapped VAST XML" : "Paste the HTML markup"}
                        className="relative w-full resize-none overflow-auto bg-transparent px-3 pt-3 pb-14 font-mono text-md text-primary outline-none"
                        style={{ lineHeight: `${LINE_HEIGHT}px` }}
                    />

                    {/* Inside the editor, bottom right — where you look after reading the
                        last line, rather than in a row below the field. */}
                    <div className="pointer-events-none absolute right-3 bottom-3 z-10">
                        <span className="pointer-events-auto">
                            <Button size="sm" color="secondary" iconLeading={CheckDone01} onClick={run} isDisabled={!value.trim()}>
                                Validate Markup
                            </Button>
                        </span>
                    </div>
                </div>
            </Fillable>

            {/* Once a current report is on screen it supersedes the live line — the same
                problem stated twice, once without a line number, just reads as noise. */}
            {liveError && (!report || stale) && <span className="text-md text-error-primary">{liveError}</span>}

            <span className="text-md text-tertiary">Paste the tag itself. Nimbus doesn’t host images, so a file upload isn’t accepted.</span>

            {report && (
                <div className="mt-1 overflow-hidden rounded-xl ring-1 ring-secondary">
                    {stale ? (
                        <p className="flex items-center gap-2 px-4 py-3 text-md" style={{ backgroundColor: `${AMBER}0f`, color: AMBER }}>
                            <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
                            The markup changed since the last check. Validate again.
                        </p>
                    ) : errors.length === 0 && warnings.length === 0 ? (
                        <p className="flex items-center gap-2 px-4 py-3 text-md font-medium" style={{ backgroundColor: `${TEAL}0f`, color: "#1F7F80" }}>
                            <CheckCircle className="size-4 shrink-0" aria-hidden="true" />
                            Markup checks out — {lines.length} {lines.length === 1 ? "line" : "lines"} of {type ?? "HTML"}, nothing to fix.
                        </p>
                    ) : (
                        <>
                            <p
                                className="flex items-center gap-2 px-4 py-3 text-md font-semibold"
                                style={errors.length ? { backgroundColor: `${RED}0f`, color: RED } : { backgroundColor: `${AMBER}0f`, color: AMBER }}
                            >
                                {errors.length ? <XCircle className="size-4 shrink-0" aria-hidden="true" /> : <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />}
                                {errors.length > 0 && `${errors.length} ${errors.length === 1 ? "problem" : "problems"} to fix`}
                                {errors.length > 0 && warnings.length > 0 && ", "}
                                {warnings.length > 0 && `${warnings.length} ${warnings.length === 1 ? "thing" : "things"} worth checking`}
                                {errors.length === 0 && " — this will still serve"}
                            </p>
                            <ul className="divide-y divide-secondary border-t border-secondary">
                                {issues.map((issue, i) => (
                                    <li key={i}>
                                        <button
                                            type="button"
                                            onClick={() => jumpTo(issue.line)}
                                            className="flex w-full items-start gap-3 px-4 py-2.5 text-left hover:bg-secondary"
                                        >
                                            <span
                                                className="mt-px shrink-0 rounded px-1.5 py-0.5 font-mono text-md font-bold"
                                                style={{ color: issue.severity === "error" ? RED : AMBER, backgroundColor: issue.severity === "error" ? `${RED}14` : `${AMBER}14` }}
                                            >
                                                {issue.line}
                                            </span>
                                            <span className="flex min-w-0 flex-col gap-0.5">
                                                <span className="text-md text-primary">{issue.message}</span>
                                                {issue.excerpt && <code className="truncate font-mono text-md text-tertiary">{issue.excerpt}</code>}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

/* ------------------------------------------------------------ Asset Setup --- */

export interface AssetSetupProps {
    /** Pre-filled state for a deep link. */
    filled?: boolean;
    /** Show the markup error state. */
    invalid?: boolean;
    /** Paste markup containing macros, which the charter forbids. */
    macros?: boolean;
    /** Land with Validate Markup already run, so the verdict is on screen. */
    checked?: boolean;
}

export const AssetSetup = ({ filled = false, invalid = false, macros: withMacros = false, checked = false }: AssetSetupProps) => {
    const [name, setName] = useState(filled ? "SampleApp_MREC_Autumn" : "");
    const [type, setType] = useState<AdType | undefined>(filled ? "HTML" : undefined);
    const [size, setSize] = useState<AdSize | undefined>(filled ? "Medium Rectangle" : undefined);
    const [markup, setMarkup] = useState(withMacros ? MACRO_MARKUP : invalid ? BAD_MARKUP : filled ? SAMPLE_HTML : "");
    const [imps, setImps] = useState<string[]>(filled ? SAMPLE_IMPRESSION_URLS.slice(0, 2).concat("") : ["", "", ""]);
    const [clicks, setClicks] = useState<string[]>(filled ? [SAMPLE_CLICK_URLS[0], "", ""] : ["", "", ""]);
    const [saved, setSaved] = useState<string | null>(null);
    // Deep links to the error states arrive already checked, so the report is on screen.
    const [report, setReport] = useState<MarkupReport | null>(() => {
        const initial = withMacros ? MACRO_MARKUP : invalid ? BAD_MARKUP : checked && filled ? SAMPLE_HTML : null;
        return initial ? { at: initial, issues: validateMarkup(initial, "HTML") } : null;
    });

    const ret = peekReturn();
    const macros = findMacros(markup);
    const notMarkup = markup.trim().length > 0 && !/^\s*<(\?xml|VAST|div|a|img|span|script|iframe)/i.test(markup.trim());
    const wrapped = type === "VAST (xml)" && isWrappedVast(markup);
    const markupError = notMarkup
        ? `This doesn't look like valid ${type === "VAST (xml)" ? "VAST" : "HTML"} markup.`
        : macros.length > 0
          ? `Macros aren't supported. Nimbus serves ${macros.length === 1 ? "this" : "these"} as literal text: ${macros.join(", ")}`
          : wrapped
            ? "This VAST is wrapped. Paste the raw, unwrapped XML — a tag or URL in place of the XML won't serve."
            : undefined;
    const markupLooksWrong = Boolean(markupError);
    const complete = Boolean(name.trim() && type && size && markup.trim()) && !markupLooksWrong;

    const fillForm = () => {
        const bad = currentFillMode() === "bad";
        setName(bad ? "   " : "SampleApp_MREC_Autumn");
        setType("HTML");
        setSize("Medium Rectangle");
        setMarkup(bad ? BAD_MARKUP : SAMPLE_HTML);
        setImps(bad ? BAD_IMPRESSION_URLS : SAMPLE_IMPRESSION_URLS);
        setClicks(bad ? BAD_CLICK_URLS : SAMPLE_CLICK_URLS);
        const pasted = bad ? BAD_MARKUP : SAMPLE_HTML;
        setReport({ at: pasted, issues: validateMarkup(pasted, "HTML") });
    };
    useRegisterPageFill(fillForm);

    const clear = () => {
        setName("");
        setType(undefined);
        setSize(undefined);
        setMarkup("");
        setImps(["", "", ""]);
        setClicks(["", "", ""]);
        setSaved(null);
        setReport(null);
    };

    const save = () => {
        if (!complete || !type || !size) return;
        // The live pass only sees paste-level faults. Check the structure before saving,
        // so a tag that never closes can't reach the library.
        const issues = validateMarkup(markup, type);
        setReport({ at: markup, issues });
        if (issues.some((i) => i.severity === "error")) return;
        addAsset({ name, type, size, markup, impressionTrackers: imps.filter(Boolean), clickTrackers: clicks.filter(Boolean) });
        setSaved(name);
        if (ret) window.location.hash = `${ret.href}?keep=1&added=${encodeURIComponent(name)}`;
    };

    const preview = previewFor(type ?? "HTML", size ?? "Full screen");

    const urlRow = (values: string[], set: (v: string[]) => void, label: string, samples: string[]) => (
        <div className="flex flex-col gap-2">
            <Label>{label}</Label>
            {values.map((v, i) => (
                <Fillable key={i} filled={Boolean(v)} onFill={() => set(values.map((x, j) => (j === i ? samples[i % samples.length] : x)))}>
                <Input
                    aria-label={`${label} ${i + 1}`}
                    size="md"
                    value={v}
                    onChange={(next) => set(values.map((x, j) => (j === i ? next : x)))}
                    isInvalid={Boolean(v) && (!/^https?:\/\//.test(v) || findMacros(v).length > 0)}
                    hint={
                        v && !/^https?:\/\//.test(v)
                            ? "Must be a full https:// URL"
                            : v && findMacros(v).length > 0
                              ? `Macros aren't supported in trackers: ${findMacros(v).join(", ")}`
                              : undefined
                    }
                />
                </Fillable>
            ))}
            <span className="text-md text-tertiary">{values.filter(Boolean).length} of {values.length} used. Macros aren't supported here.</span>
        </div>
    );

    return (
        <DasShell navItems={V3_NAV_ITEMS} navKey="manage assets">
            <Tabs active="setup" />
            <div className="flex flex-col gap-6 px-8 py-8">
                {ret && (
                    <p className="flex items-center gap-2 rounded-xl px-4 py-3 text-md" style={{ backgroundColor: `${TEAL}0f`, color: "#1F7F80" }}>
                        <InfoCircle className="size-4 shrink-0" aria-hidden="true" />
                        Adding a creative for the campaign you were setting up. Saving brings you straight back to it.
                    </p>
                )}

                <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="flex min-w-0 flex-col gap-6">
                        <div className="flex flex-col gap-1.5">
                            <Label required>Creative Name</Label>
                            <Fillable filled={Boolean(name)} onFill={() => setName("SampleApp_MREC_Autumn")}>
                                <Input aria-label="Creative Name" size="md" value={name} onChange={setName} isInvalid={Boolean(name) && !name.trim()} hint={name && !name.trim() ? "Name the creative" : undefined} />
                            </Fillable>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                                <Label required>Ad Type</Label>
                                <Fillable filled={Boolean(type)} onFill={() => setType("HTML")}>
                                    <Select
                                        aria-label="Ad Type"
                                        placeholder="Select"
                                        items={AD_TYPES.map((t) => ({ id: t, label: t }))}
                                        selectedKey={type ?? null}
                                        onSelectionChange={(k) => setType(k ? (String(k) as AdType) : undefined)}
                                    >
                                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                    </Select>
                                </Fillable>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <Label required>Ad Size</Label>
                                <Fillable filled={Boolean(size)} onFill={() => setSize("Medium Rectangle")}>
                                    <Select
                                        aria-label="Ad Size"
                                        placeholder="Select"
                                        items={AD_SIZES.map((s) => ({ id: s, label: s }))}
                                        selectedKey={size ?? null}
                                        onSelectionChange={(k) => setSize(k ? (String(k) as AdSize) : undefined)}
                                    >
                                        {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                                    </Select>
                                </Fillable>
                            </div>
                        </div>

                        <MarkupField
                            value={markup}
                            onChange={setMarkup}
                            type={type}
                            liveError={markupError}
                            report={report}
                            onReport={setReport}
                        />

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {urlRow(imps, setImps, "Impression Tracking URL(s)", SAMPLE_IMPRESSION_URLS)}
                            {urlRow(clicks, setClicks, "Click Tracking URL(s)", SAMPLE_CLICK_URLS)}
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button color="secondary" className="uppercase" onClick={clear}>
                                Clear Form
                            </Button>
                            <Button color="primary-pink" className="uppercase" isDisabled={!complete} onClick={save}>
                                Add Creative
                            </Button>
                            {saved && !ret && (
                                <span className="self-center text-md font-medium" style={{ color: "#1F7F80" }}>
                                    “{saved}” added to the library.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Our addition: see the placement as you build it. */}
                    <aside className="flex flex-col gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary xl:sticky xl:top-14">
                        <h2 className="flex items-center text-lg font-extrabold text-primary">
                            Preview
                            <Added />
                        </h2>
                        {size || type ? (
                            <>
                                <div className="mx-auto w-[220px]">
                                    <AdFormatDemo format={preview.format} moment={preview.moment} />
                                </div>
                                <p className="text-center text-md text-tertiary">
                                    Approximate placement for {size ?? "this size"}. Size and position vary by device, screen and app.
                                </p>
                            </>
                        ) : (
                            <p className="rounded-xl border border-dashed border-secondary p-6 text-center text-md text-tertiary">
                                Choose an Ad Type and Ad Size to see where this creative sits in an app.
                            </p>
                        )}
                    </aside>
                </div>
            </div>
        </DasShell>
    );
};

/* -------------------------------------------------------- View All Assets --- */

export const ViewAllAssets = ({ search = "" }: { search?: string }) => {
    const assets = useAssets();
    const [query, setQuery] = useState(search);
    const q = query.trim().toLowerCase();
    const rows = q ? assets.filter((a) => `${a.name} ${a.type} ${a.size} ${a.campaigns.join(" ")}`.toLowerCase().includes(q)) : assets;
    const batch = useBatch(rows);
    const visible = batch.onlySelected ? batch.selected : rows;
    // An asset on a campaign can't be deleted in bulk either — same guard as the single
    // Delete, applied before the batch rather than after it.
    const deletable = batch.selected.filter((a) => a.campaigns.length === 0);
    const blocked = batch.selected.filter((a) => a.campaigns.length > 0);
    const [showBlocked, setShowBlocked] = useState(false);

    const assetCsv = (list: Asset[]) =>
        downloadCsv(
            "assets",
            ["Asset Name", "Status", "Associated Campaigns", "Ad Type", "Ad Size", "Impression Trackers", "Click Trackers"],
            list.map((a) => [a.name, a.status, a.campaigns.join("; "), a.type, a.size, a.impressionTrackers.length, a.clickTrackers.length]),
        );

    const th = "px-3 py-2.5 text-left text-md font-semibold text-tertiary";
    const td = "px-3 py-3 text-md text-secondary";

    return (
        <DasShell navItems={V3_NAV_ITEMS} navKey="manage assets">
            <Tabs active="view" />
            <div className="flex flex-col gap-5 px-8 py-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-display-xs font-extrabold text-primary">Assets</h2>
                    <div className="flex items-center gap-3">
                        <Input aria-label="Search Assets" size="md" icon={SearchLg} placeholder="Search Assets" value={query} onChange={setQuery} wrapperClassName="w-72" />
                        {/* Same Actions menu as manage keywords, so the two libraries behave
                            identically: one named menu for what acts on the table, one pink
                            button for the thing you came to do. */}
                        <Dropdown.Root>
                            <Button color="secondary" className="uppercase" iconTrailing={ChevronDown}>
                                Actions
                            </Button>
                            <Dropdown.Popover className="w-60">
                                <Dropdown.Menu>
                                    <Dropdown.Item icon={CheckSquare} onAction={batch.start}>
                                        Batch actions
                                    </Dropdown.Item>
                                    <Dropdown.Item icon={Download01} onAction={() => assetCsv(rows)}>
                                        {q ? `Export ${rows.length} shown (CSV)` : `Export all ${rows.length} (CSV)`}
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown.Root>
                        <Button color="primary-pink" className="uppercase" onClick={() => (window.location.hash = "#/asset-setup")}>
                            Add Creative
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                    {batch.on && (
                        <BatchBar
                            batch={batch}
                            actions={
                                <BatchAction icon={Download01} onClick={() => assetCsv(batch.selected)}>
                                    Export selected
                                </BatchAction>
                            }
                            menu={
                                <BatchDanger
                                    onAction={() => {
                                        if (blocked.length) return setShowBlocked(true);
                                        deletable.forEach((a) => deleteAsset(a.id));
                                        batch.stop();
                                    }}
                                >
                                    Delete {batch.selected.length} {batch.selected.length === 1 ? "asset" : "assets"}
                                </BatchDanger>
                            }
                        />
                    )}
                    <table className="w-full min-w-[1040px]">
                        <thead className="bg-secondary">
                            <tr>
                                {batch.on && <BatchHeadCell batch={batch} />}
                                {["Status", "Asset Name", "Associated Campaigns", "Ad Type", "Ad Size", "Impression Trackers", "Click Trackers", ""].map((h) => (
                                    <th key={h} className={th}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {visible.map((a) => (
                                <tr key={a.id} className="border-t border-secondary">
                                    {batch.on && <BatchCell batch={batch} id={a.id} label={a.name} />}
                                    <td className={td}>
                                        <span className="inline-flex items-center gap-2">
                                            <span className="size-2 rounded-full" style={{ backgroundColor: a.status === "Running" ? TEAL : "#98A2B3" }} aria-hidden="true" />
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className={cx(td, "font-medium")}>
                                        <a href={`#/asset-detail?a=${a.id}`} className="font-semibold hover:underline" style={{ color: TEAL }}>
                                            {a.name}
                                        </a>
                                    </td>
                                    <td className={td}>{a.campaigns.length ? a.campaigns.join(", ") : "None"}</td>
                                    <td className={td}>{a.type}</td>
                                    <td className={cx(td, a.size === "Invalid" && "font-semibold text-error-primary")}>{a.size}</td>
                                    <td className={td}>{a.impressionTrackers.length || "—"}</td>
                                    <td className={td}>{a.clickTrackers.length || "—"}</td>
                                    <td className={cx(td, "whitespace-nowrap")}>
                                        {/* Delete sits behind the menu: it is one click from
                                            stopping a live creative, and it was previously a
                                            neighbour of the button you press most. */}
                                        <span className="flex items-center justify-end gap-3">
                                            <PinkAction icon={PlayCircle}>Test Asset</PinkAction>
                                            <Dropdown.Root>
                                                <Dropdown.DotsButton />
                                                <Dropdown.Popover className="w-48">
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item icon={Edit03} onAction={() => window.location.assign(`#/asset-detail?a=${a.id}`)}>
                                                            Edit asset
                                                        </Dropdown.Item>
                                                        <Dropdown.Item
                                                            icon={Trash01}
                                                            onAction={() => window.location.assign(`#/asset-detail?a=${a.id}${a.campaigns.length ? "&confirm=1" : ""}`)}
                                                        >
                                                            Delete
                                                        </Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown.Popover>
                                            </Dropdown.Root>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {visible.length === 0 && (
                                <tr>
                                    <td colSpan={batch.on ? 9 : 8} className="px-3 py-10 text-center text-md text-tertiary">
                                        No assets match “{query}”.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {showBlocked && (
                <BatchBlocked
                    title={`${blocked.length} ${blocked.length === 1 ? "asset is" : "assets are"} on a campaign`}
                    lead="Deleting one would stop a creative that is serving, so these have to come off their campaigns first. Nothing was deleted — deselect them and try again."
                    names={blocked.map((a) => a.name)}
                    onClose={() => setShowBlocked(false)}
                />
            )}
        </DasShell>
    );
};
