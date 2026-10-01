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

export const resetAssets = () => {
    assets = seed;
    emit();
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
