import type { ProtoMeta, ProtoVersion } from "../shared/prototype-frame";

/** Every published version of the DAS prototype. Add a row when you cut a new version folder. */
export const versions: ProtoVersion[] = [
    {
        id: "v1",
        label: "Round 1",
        date: "September 22, 2026",
        summary:
            "A publisher sets up a direct-sold campaign on a single page instead of a five-step wizard, with problems flagged as they go and Publish enabled only when everything checks out. They target it with their own keywords (words their app already sends, like “sports” or “over21”) plus ad unit type and device language, and manage those keywords in a new Keyword Library. After launch, every campaign shows at a glance whether it's on pace to deliver what was promised, and DAS results are reported separately from Open Marketplace revenue.",
    },
];

export const latest = versions[versions.length - 1].id;

export const meta = (current: string): ProtoMeta => ({
    name: "Deal Activation System",
    tagline: "Extended Targeting: keyword and standard targets, one-page setup, delivery-first management and reporting.",
    accent: "#1F7F80",
    soft: "#E6F6F6",
    versions,
    current,
});
