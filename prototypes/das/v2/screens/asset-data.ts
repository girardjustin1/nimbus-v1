import { useSyncExternalStore } from "react";
import type { FormatId } from "@/pages/deal-activation-system/studio/studio-data";

/**
 * The asset library — the half of DAS that exists in the product but not in our
 * prototype until now.
 *
 * Field names, option values and button labels are transcribed from the staging Asset
 * Setup screen, not invented. The one thing we add is the live preview beside the markup.
 */

/** Staging's Ad Size options, verbatim — note "Full screen" is not title-cased. */
export const AD_SIZES = ["Full screen", "Medium Rectangle", "Banner"] as const;
export type AdSize = (typeof AD_SIZES)[number];

/**
 * Observed in the staging asset table. The dropdown was never captured open, so this may
 * not be the complete option list.
 */
export const AD_TYPES = ["HTML", "VAST (xml)"] as const;
export type AdType = (typeof AD_TYPES)[number];

export interface Asset {
    id: string;
    name: string;
    type: AdType;
    size: AdSize | "N/A" | "Invalid";
    status: "Running" | "Paused";
    campaigns: string[];
    impressionTrackers: string[];
    clickTrackers: string[];
    markup: string;
}

/** Which animated preview stands in for an Ad Size. */
export const previewFor = (type: AdType, size: Asset["size"]): { format: FormatId; moment: "default" | "mrec" } =>
    type === "VAST (xml)"
        ? { format: "rewarded", moment: "default" }
        : size === "Medium Rectangle"
          ? { format: "banner", moment: "mrec" }
          : size === "Banner"
            ? { format: "banner", moment: "default" }
            : { format: "interstitial", moment: "default" };

const sampleMarkup = (label: string) => `<div id="${label}">\n  <a href="https://example.com/click">\n    <img src="https://cdn.example.com/${label}.png" alt="" />\n  </a>\n</div>`;

const seed: Asset[] = [
    {
        id: "a1",
        name: "SampleApp_Interstitial_A",
        type: "HTML",
        size: "Full screen",
        status: "Running",
        campaigns: ["Sports fans · Interstitial"],
        impressionTrackers: ["https://track.example.com/imp?id=a1"],
        clickTrackers: [],
        markup: sampleMarkup("interstitial-a"),
    },
    {
        id: "a2",
        name: "SampleApp_Interstitial_B",
        type: "HTML",
        size: "Full screen",
        status: "Running",
        campaigns: ["Sports fans · Interstitial"],
        impressionTrackers: [],
        clickTrackers: [],
        markup: sampleMarkup("interstitial-b"),
    },
    {
        id: "a3",
        name: "SampleApp_Video_15s",
        type: "VAST (xml)",
        size: "N/A",
        status: "Paused",
        campaigns: [],
        impressionTrackers: ["https://track.example.com/imp?id=a3"],
        clickTrackers: ["https://track.example.com/clk?id=a3"],
        markup: "<VAST version=\"4.0\">\n  <Ad id=\"sample-15s\">…</Ad>\n</VAST>",
    },
    {
        id: "a4",
        name: "SampleApp_MREC_Garden",
        type: "HTML",
        size: "Medium Rectangle",
        status: "Running",
        campaigns: ["Plant lovers · Always on"],
        impressionTrackers: [],
        clickTrackers: [],
        markup: sampleMarkup("mrec-garden"),
    },
    {
        id: "a5",
        name: "SampleApp_Banner_Legacy",
        type: "HTML",
        size: "Invalid",
        status: "Paused",
        campaigns: [],
        impressionTrackers: [],
        clickTrackers: [],
        markup: "<!-- malformed -->",
    },
];

/** Every macro form we reject, with where each one comes from. */
const MACRO_PATTERNS: { re: RegExp; label: string }[] = [
    { re: /\$\{[A-Z_0-9]+\}/g, label: "${…}" },
    { re: /%%[A-Z_0-9]+%%/g, label: "%%…%%" },
    { re: /\[(?:TIMESTAMP|CACHEBUSTER|RANDOM|CLICK_URL|CLICK_URL_ENC)\]/gi, label: "[…]" },
    { re: /\{\{[A-Za-z_0-9.]+\}\}/g, label: "{{…}}" },
    { re: /__[A-Z_0-9]+__/g, label: "__…__" },
];

/** The macros present in some markup, de-duplicated and in the order they appear. */
export const findMacros = (markup: string) => {
    const hits = MACRO_PATTERNS.flatMap(({ re }) => markup.match(re) ?? []);
    return [...new Set(hits)];
};

/** A VAST tag that points at another tag instead of carrying the XML inline. */
export const isWrappedVast = (markup: string) => /<VASTAdTagURI|<Wrapper[\s>]/i.test(markup);

/* ----------------------------------------------------------------- Store --- */

let assets: Asset[] = seed;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const addAsset = (a: Omit<Asset, "id" | "status" | "campaigns">) => {
    const asset: Asset = { ...a, id: `a${assets.length + 1}-${Date.now()}`, status: "Paused", campaigns: [] };
    assets = [asset, ...assets];
    emit();
    return asset;
};

export const updateAsset = (id: string, patch: Partial<Asset>) => {
    assets = assets.map((a) => (a.id === id ? { ...a, ...patch } : a));
    emit();
};

export const deleteAsset = (id: string) => {
    assets = assets.filter((a) => a.id !== id);
    emit();
};

export const assetById = (id: string) => assets.find((a) => a.id === id);

export const resetAssets = () => {
    assets = seed;
    emit();
};

/**
 * Find a just-created asset by name, shaped as the campaign form's Creative. The two
 * models differ: an Asset carries markup and trackers, a Creative is the row a campaign
 * shows.
 */
export const libraryByName = (name: string): { name: string; type: "HTML" | "VAST (xml)"; size: "Full screen" | "Medium Rectangle" | "Banner" | "N/A" } | undefined => {
    const a = assets.find((x) => x.name === name);
    return a ? { name: a.name, type: a.type, size: a.size === "Invalid" ? "N/A" : a.size } : undefined;
};

export const useAssets = () => useSyncExternalStore((l) => (listeners.add(l), () => listeners.delete(l)), () => assets);

/**
 * Where to go back to after creating an asset, and which one was just made. Set when you
 * leave a campaign to add an asset, read when you land back on it.
 */
let returnTo: { href: string; assetName?: string } | null = null;
export const setReturnTo = (href: string) => {
    returnTo = { href };
};
export const completeReturn = (assetName: string) => {
    if (returnTo) returnTo = { ...returnTo, assetName };
    return returnTo;
};
export const takeReturn = () => {
    const r = returnTo;
    returnTo = null;
    return r;
};
export const peekReturn = () => returnTo;

/* ------------------------------------------------- Markup validation --- */

/**
 * A single problem found in pasted markup, located at a line.
 *
 * The line number is the whole point: "this doesn't look like HTML" tells a publisher
 * nothing they can act on, whereas "line 2: the value of href isn't quoted" tells them
 * exactly where to put their cursor.
 */
export interface MarkupIssue {
    /** 1-indexed, matching the gutter beside the field. */
    line: number;
    severity: "error" | "warning";
    message: string;
    /** The offending source line, trimmed, for the report. */
    excerpt: string;
}

/** Elements that never have a closing tag, so they must not go on the nesting stack. */
const VOID_ELEMENTS = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);

const lineOf = (src: string, index: number) => src.slice(0, index).split("\n").length;

interface ScannedTag {
    start: number;
    raw: string;
    /** No `>` before the next `<` — the tag was never finished. */
    unterminated: boolean;
}

/**
 * Pull the tags out of a document, keeping each one's offset.
 *
 * This is deliberately not a real HTML parser. It is a lint pass over a pasted tag,
 * looking for the handful of mistakes that actually reach us, and it reports what it
 * is unsure about rather than guessing.
 */
const scanTags = (src: string): ScannedTag[] => {
    const tags: ScannedTag[] = [];
    let i = 0;
    while (i < src.length) {
        const lt = src.indexOf("<", i);
        if (lt === -1) break;
        const after = src[lt + 1];

        // A comment or doctype: skip to its own terminator, not the next ">".
        if (after === "!") {
            const isComment = src.startsWith("<!--", lt);
            const end = isComment ? src.indexOf("-->", lt) : src.indexOf(">", lt);
            if (end === -1) {
                tags.push({ start: lt, raw: src.slice(lt), unterminated: true });
                break;
            }
            i = end + (isComment ? 3 : 1);
            continue;
        }

        // A bare "<" in text content is not a tag.
        if (!after || !/[A-Za-z/?]/.test(after)) {
            i = lt + 1;
            continue;
        }

        const gt = src.indexOf(">", lt);
        const nextLt = src.indexOf("<", lt + 1);
        if (gt === -1 || (nextLt !== -1 && nextLt < gt)) {
            tags.push({ start: lt, raw: src.slice(lt, nextLt === -1 ? undefined : nextLt), unterminated: true });
            i = nextLt === -1 ? src.length : nextLt;
            continue;
        }

        tags.push({ start: lt, raw: src.slice(lt, gt + 1), unterminated: false });
        i = gt + 1;
    }
    return tags;
};

/**
 * Split a tag's attribute region into attributes, without ever looking inside a quoted
 * value — otherwise the query string of href="...?cid=10482" reads as an attribute of
 * its own, and a correct tag gets reported as broken.
 */
const attributesOf = (inner: string): { name: string; value?: string }[] => {
    const out: { name: string; value?: string }[] = [];
    const re = /\s*([A-Za-z_:][-A-Za-z0-9_:.]*)(?:\s*=\s*("[^"]*"|'[^']*'|[^\s>]+))?/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(inner)) !== null) out.push({ name: m[1], value: m[2] });
    return out;
};

const tagName = (raw: string) => (raw.match(/^<\/?\s*([A-Za-z][A-Za-z0-9:-]*)/)?.[1] ?? "").toLowerCase();

/**
 * Check pasted markup and report every problem with the line it is on.
 *
 * Errors block the creative; warnings do not. The split matters: an unquoted attribute
 * silently truncates a click URL at the first space and is fatal, while an http:// image
 * is merely likely to be blocked, which is the publisher's call to make.
 */
export const validateMarkup = (markup: string, type: AdType): MarkupIssue[] => {
    const issues: MarkupIssue[] = [];
    const lines = markup.split("\n");
    const at = (index: number, severity: MarkupIssue["severity"], message: string) =>
        issues.push({ line: lineOf(markup, index), severity, message, excerpt: (lines[lineOf(markup, index) - 1] ?? "").trim() });
    const atLine = (line: number, severity: MarkupIssue["severity"], message: string) =>
        issues.push({ line, severity, message, excerpt: (lines[line - 1] ?? "").trim() });

    if (!markup.trim()) return [{ line: 1, severity: "error", message: "Nothing to check — paste the creative's markup first.", excerpt: "" }];

    const tags = scanTags(markup);
    const isVast = type === "VAST (xml)";

    /* --- Does it even look like the type that was chosen? --- */
    const first = tags[0];
    if (!first) {
        return [{ line: 1, severity: "error", message: `No tags found. This doesn't look like ${isVast ? "VAST XML" : "HTML"} — paste the tag itself, not a URL or a filename.`, excerpt: lines[0].trim() }];
    }
    if (isVast && !/^<(\?xml|VAST)/i.test(markup.trim())) {
        atLine(1, "error", "VAST has to start with <VAST> (or an XML declaration). This looks like HTML in a VAST slot.");
    }
    if (!isVast && /^<(\?xml|VAST)/i.test(markup.trim())) {
        atLine(1, "error", "This is VAST XML, but Ad Type is set to HTML. Change the Ad Type, or paste HTML.");
    }

    /* --- Structure. --- */
    let unterminated = false;
    let mismatched = false;
    const stack: { name: string; start: number }[] = [];

    for (const tag of tags) {
        if (tag.raw.startsWith("<?")) continue; // an XML declaration is not an element
        const name = tagName(tag.raw);

        if (tag.unterminated) {
            unterminated = true;
            at(tag.start, "error", `<${name || "?"}> is never closed with “>”, so everything after it is swallowed into the tag.`);
            continue;
        }

        const closing = tag.raw.startsWith("</");
        const selfClosing = /\/\s*>$/.test(tag.raw);

        // Unquoted attribute values: fatal, because the value ends at the first space.
        if (!closing) {
            const inner = tag.raw.replace(/^<\s*[A-Za-z][A-Za-z0-9:-]*/, "").replace(/\/?>$/, "");
            for (const a of attributesOf(inner)) {
                if (a.value !== undefined && !/^["']/.test(a.value)) {
                    at(tag.start, "error", `The value of ${a.name} isn't in quotes (${a.name}=${a.value}). It will be cut off at the first space or “>”.`);
                }
            }
        }

        if (closing) {
            const open = stack.pop();
            // Once a tag is unterminated the stack is fiction, so don't pile on from it.
            if (!open) {
                if (!unterminated) at(tag.start, "error", `</${name}> closes a tag that was never opened.`);
                mismatched = true;
            } else if (open.name !== name) {
                if (!unterminated) at(tag.start, "error", `</${name}> doesn't match <${open.name}>, opened on line ${lineOf(markup, open.start)}.`);
                mismatched = true;
                stack.push(open);
            }
        } else if (!selfClosing && (isVast || !VOID_ELEMENTS.has(name))) {
            stack.push({ name, start: tag.start });
        }
    }

    // Report what is still open only when the stack is trustworthy. After an unterminated
    // tag or a mismatch, every remaining entry is a consequence of that first error, and
    // listing them buries the one line the publisher actually has to fix.
    if (!unterminated && !mismatched) {
        for (const open of stack) at(open.start, "error", `<${open.name}> is opened but never closed.`);
    }

    /* --- Macros. Not supported anywhere; they serve as literal text. --- */
    lines.forEach((text, i) => {
        const found = findMacros(text);
        if (found.length) atLine(i + 1, "error", `Macros aren't supported. Nimbus serves ${found.length === 1 ? "this" : "these"} as literal text: ${found.join(", ")}`);
    });

    /* --- VAST specifics. --- */
    if (isVast) {
        // <Wrapper> and <VASTAdTagURI> are the same problem, so report it once, where it starts.
        const wrapAt = lines.findIndex((l) => /<VASTAdTagURI|<Wrapper[\s>]/i.test(l));
        if (wrapAt !== -1) atLine(wrapAt + 1, "error", "This VAST is wrapped — it points at another tag instead of carrying the XML. Paste the raw, unwrapped XML.");
        if (/<VAST\b/i.test(markup) && !/<VAST[^>]*\bversion\s*=/i.test(markup)) {
            atLine(lines.findIndex((l) => /<VAST\b/i.test(l)) + 1, "warning", "<VAST> has no version attribute. Players that require one will drop the ad.");
        }
        if (!/<Ad\b/i.test(markup)) atLine(1, "error", "No <Ad> element — there is nothing for the player to serve.");
    }

    /* --- Things that break inside an in-app webview. --- */
    lines.forEach((text, i) => {
        if (/document\.write\s*\(/.test(text)) atLine(i + 1, "error", "document.write() does nothing once the webview has loaded. Inject the node instead.");
        if (/\bsrc\s*=\s*["']?http:\/\//i.test(text)) atLine(i + 1, "warning", "Loaded over http://. iOS and Android block mixed content by default, so this asset may not appear.");
    });

    return issues.sort((a, b) => a.line - b.line || (a.severity === b.severity ? 0 : a.severity === "error" ? -1 : 1));
};
