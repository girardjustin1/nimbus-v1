import type { ProtoMeta, ProtoVersion } from "../shared/prototype-frame";

/** Every published version of the DAS prototype. Add a row when you cut a new version folder. */
export const versions: ProtoVersion[] = [
    {
        id: "v1",
        label: "Round 1",
        date: "September 22, 2026",
        summary:
            "A publisher sets up a direct-sold campaign on a single page instead of a five-step wizard, with flight dates on calendar pickers; pressing Publish checks everything and flags each problem on the page, in the “On this page” rail and in a banner that links to it. They target it with their own keywords (words their app already sends, like “sports” or “over21”) plus ad unit and geo, platform and app targets, and manage those keywords in a new keyword library. After launch, every campaign shows at a glance whether it's on pace to deliver what was promised, with a View campaign page drawn in each concept's style, and DAS results are reported separately from Open Marketplace revenue.",
    },
    {
        id: "v2",
        label: "Round 2",
        date: "October 1, 2026",
        summary:
            "The one-page setup, with the duplicated “On this page” rail removed so the right-hand rail does both jobs: it summarises the campaign and jumps you to anything that needs fixing. Everything you can target on — Geos, Platform, Apps, Ad Unit, Keywords — is now its own module at the same level, and the geo and app pickers really work. Creative gains a live preview of how the ad renders. Two new sections round out the structure the product already has: an asset library where a creative is created by pasting its markup, and a keyword library that mirrors it, both reachable from inside a campaign and returning you to it. Wording follows the product exactly; anything we invented carries an ADDED chip.",
    },
    {
        id: "v3",
        label: "Round 3",
        date: "October 2, 2026",
        summary:
            "The 2 Oct review, built. Everything you choose from a library you already made — deal, priority, frequency cap, geos, apps, keywords, creative — now behaves the same way: click or press Down for the whole list alphabetically, type to narrow it, arrows and Enter to pick, with the page held still until you choose. Apps and keywords end in a table rather than chips. Deal asks only for what each option needs, and Campaign Name and Flight Dates are sections of their own. The rail counts the product's five steps and Publish & Duplicate is back, in the Review modal. Rounds 1 and 2 stay frozen as the versions that were reviewed.",
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
