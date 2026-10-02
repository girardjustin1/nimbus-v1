import { useState } from "react";
import { InfoCircle, SearchLg, XClose } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Select } from "@/components/base/select/select";
import { AdFormatDemo } from "@/pages/deal-activation-system/studio/components/ad-format-demo";
import { cx } from "@/utils/cx";
import { currentFillMode, useRegisterPageFill } from "../../../shared/demo-fill";
import { Fillable } from "../../../shared/demo-fill-ui";
import { DasShell, PINK, PinkAction, TEAL } from "../../v1/screens/das-shell";
import { V2_NAV_ITEMS } from "./nav";
import { AD_SIZES, AD_TYPES, type AdSize, type AdType, addAsset, peekReturn, previewFor, useAssets } from "./asset-data";

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

const SAMPLE_HTML = `<div id="sample-creative">
  <a href="https://example.com/click">
    <img src="https://cdn.example.com/sample-300x250.png" alt="" />
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

const BAD_MARKUP = `<div id="sample-creative"
  <a href=https://example.com/click>
    <img src=</div>`;

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

/** Every macro form we reject, with where each one comes from. */
const MACRO_PATTERNS: { re: RegExp; label: string }[] = [
    { re: /\$\{[A-Z_0-9]+\}/g, label: "${…}" },
    { re: /%%[A-Z_0-9]+%%/g, label: "%%…%%" },
    { re: /\[(?:TIMESTAMP|CACHEBUSTER|RANDOM|CLICK_URL|CLICK_URL_ENC)\]/gi, label: "[…]" },
    { re: /\{\{[A-Za-z_0-9.]+\}\}/g, label: "{{…}}" },
    { re: /__[A-Z_0-9]+__/g, label: "__…__" },
];

/** The macros present in some markup, de-duplicated and in the order they appear. */
const findMacros = (markup: string) => {
    const hits = MACRO_PATTERNS.flatMap(({ re }) => markup.match(re) ?? []);
    return [...new Set(hits)];
};

/** A VAST tag that points at another tag instead of carrying the XML inline. */
const isWrappedVast = (markup: string) => /<VASTAdTagURI|<Wrapper[\s>]/i.test(markup);

const Label = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
    <span className="text-sm font-semibold text-primary">
        {children}
        {required && " *"}
    </span>
);

/** Prototype chrome: marks wording with no equivalent in the product. */
const Added = () => (
    <span
        title="Our wording — no equivalent in DAS today"
        className="ml-2 rounded-full border border-dashed px-1.5 py-px text-[10px] font-bold uppercase"
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

/* ------------------------------------------------------------ Asset Setup --- */

export interface AssetSetupProps {
    /** Pre-filled state for a deep link. */
    filled?: boolean;
    /** Show the markup error state. */
    invalid?: boolean;
    /** Paste markup containing macros, which the charter forbids. */
    macros?: boolean;
}

export const AssetSetup = ({ filled = false, invalid = false, macros: withMacros = false }: AssetSetupProps) => {
    const [name, setName] = useState(filled ? "SampleApp_MREC_Autumn" : "");
    const [type, setType] = useState<AdType | undefined>(filled ? "HTML" : undefined);
    const [size, setSize] = useState<AdSize | undefined>(filled ? "Medium Rectangle" : undefined);
    const [markup, setMarkup] = useState(withMacros ? MACRO_MARKUP : invalid ? BAD_MARKUP : filled ? SAMPLE_HTML : "");
    const [imps, setImps] = useState<string[]>(filled ? SAMPLE_IMPRESSION_URLS.slice(0, 2).concat("") : ["", "", ""]);
    const [clicks, setClicks] = useState<string[]>(filled ? [SAMPLE_CLICK_URLS[0], "", ""] : ["", "", ""]);
    const [saved, setSaved] = useState<string | null>(null);

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
        setMarkup(bad ? MACRO_MARKUP : SAMPLE_HTML);
        setImps(bad ? BAD_IMPRESSION_URLS : SAMPLE_IMPRESSION_URLS);
        setClicks(bad ? BAD_CLICK_URLS : SAMPLE_CLICK_URLS);
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
    };

    const save = () => {
        if (!complete || !type || !size) return;
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
            <span className="text-xs text-tertiary">{values.filter(Boolean).length} of {values.length} used. Macros aren't supported here.</span>
        </div>
    );

    return (
        <DasShell navItems={V2_NAV_ITEMS} navKey="manage assets">
            <Tabs active="setup" />
            <div className="flex flex-col gap-6 px-8 py-8">
                {ret && (
                    <p className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm" style={{ backgroundColor: `${TEAL}0f`, color: "#1F7F80" }}>
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

                        <div className="flex flex-col gap-1.5">
                            <Label required>Add Markup</Label>
                            <Fillable filled={Boolean(markup)} onFill={() => setMarkup(type === "VAST (xml)" ? SAMPLE_VAST : SAMPLE_HTML)} hint="Click to paste sample markup">
                                <textarea
                                    aria-label="Add Markup"
                                    value={markup}
                                    onChange={(e) => setMarkup(e.target.value)}
                                    rows={10}
                                    spellCheck={false}
                                    placeholder={type === "VAST (xml)" ? "Paste raw, unwrapped VAST XML" : "Paste the HTML markup"}
                                    className={cx(
                                        "w-full rounded-lg bg-primary px-3.5 py-3 font-mono text-sm text-primary shadow-xs ring-1 ring-inset outline-none focus:ring-2",
                                        markupLooksWrong ? "ring-error_subtle" : "ring-primary focus:ring-brand",
                                    )}
                                />
                            </Fillable>
                            {markupError && <span className="text-sm text-error-primary">{markupError}</span>}
                            <span className="text-sm text-tertiary">Paste the tag itself. Nimbus doesn't host images, so a file upload isn't accepted.</span>
                        </div>

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
                                <span className="self-center text-sm font-medium" style={{ color: "#1F7F80" }}>
                                    “{saved}” added to the library.
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Our addition: see the placement as you build it. */}
                    <aside className="flex flex-col gap-3 rounded-2xl bg-primary p-5 ring-1 ring-secondary xl:sticky xl:top-14">
                        <h2 className="flex items-center text-lg font-semibold text-primary">
                            Preview
                            <Added />
                        </h2>
                        {size || type ? (
                            <>
                                <div className="mx-auto w-[220px]">
                                    <AdFormatDemo format={preview.format} moment={preview.moment} />
                                </div>
                                <p className="text-center text-xs text-tertiary">
                                    Approximate placement for {size ?? "this size"}. Size and position vary by device, screen and app.
                                </p>
                            </>
                        ) : (
                            <p className="rounded-xl border border-dashed border-secondary p-6 text-center text-sm text-tertiary">
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

    const th = "px-3 py-2.5 text-left text-xs font-semibold text-tertiary";
    const td = "px-3 py-3 text-sm text-secondary";

    return (
        <DasShell navItems={V2_NAV_ITEMS} navKey="manage assets">
            <Tabs active="view" />
            <div className="flex flex-col gap-5 px-8 py-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-display-xs font-semibold text-primary">Assets</h2>
                    <div className="flex items-center gap-3">
                        <Input aria-label="Search Assets" size="md" icon={SearchLg} placeholder="Search Assets" value={query} onChange={setQuery} wrapperClassName="w-72" />
                        <Button color="primary-pink" className="uppercase" onClick={() => (window.location.hash = "#/asset-setup")}>
                            Add Creative
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-xl ring-1 ring-secondary">
                    <table className="w-full min-w-[1040px]">
                        <thead className="bg-secondary">
                            <tr>
                                {["Status", "Asset Name", "Associated Campaigns", "Ad Type", "Ad Size", "Impression Trackers", "Click Trackers", ""].map((h) => (
                                    <th key={h} className={th}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((a) => (
                                <tr key={a.id} className="border-t border-secondary">
                                    <td className={td}>
                                        <span className="inline-flex items-center gap-2">
                                            <span className="size-2 rounded-full" style={{ backgroundColor: a.status === "Running" ? TEAL : "#98A2B3" }} aria-hidden="true" />
                                            {a.status}
                                        </span>
                                    </td>
                                    <td className={cx(td, "font-medium text-primary")}>{a.name}</td>
                                    <td className={td}>{a.campaigns.length ? a.campaigns.join(", ") : "None"}</td>
                                    <td className={td}>{a.type}</td>
                                    <td className={cx(td, a.size === "Invalid" && "font-semibold text-error-primary")}>{a.size}</td>
                                    <td className={td}>{a.impressionTrackers.length || "—"}</td>
                                    <td className={td}>{a.clickTrackers.length || "—"}</td>
                                    <td className={cx(td, "whitespace-nowrap")}>
                                        <span className="flex items-center gap-3">
                                            <PinkAction>Test Asset</PinkAction>
                                            <PinkAction icon={XClose}>Remove</PinkAction>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-3 py-10 text-center text-sm text-tertiary">
                                        No assets match “{query}”.
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
