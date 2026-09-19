import type { ProtoMeta, ProtoVersion } from "../shared/prototype-frame";

/** Every published version of the DAS Studio prototype. Add a row when you cut a new version folder. */
export const versions: ProtoVersion[] = [
    {
        id: "v1",
        label: "Concept 1",
        date: "September 22, 2026",
        summary:
            "A publisher builds a deal campaign in a focused, full-screen studio: pick a goal from four visual tiles, name the deal, choose who sees it, then set budget, bid and dates. A live panel estimates delivery likelihood, impressions and reach as they go, and the bid shows where it sits in the recommended range. While building the creative, the ad renders in a real app screen beside the form (banner, interstitial, rewarded video or native) and updates with every keystroke. Review leads with the flight, budget and a render of the ad, and a full-screen preview steps through every moment of the format on phone or tablet before anything is published.",
    },
];

export const latest = versions[versions.length - 1].id;

export const meta = (current: string): ProtoMeta => ({
    name: "DAS Studio",
    tagline: "Deal Activation as a guided builder with live estimates and a live ad preview.",
    accent: "#3538CD",
    soft: "#EEF4FF",
    versions,
    current,
});
