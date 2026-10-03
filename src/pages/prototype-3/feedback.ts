/**
 * Oct 2 review — the feedback batch behind Prototype 3, as data.
 *
 * One entry per change coming out of the October 2 call on Round 2. Quotes are trimmed
 * to the design point and nothing else, and the reviewer is named by role rather than
 * by name because this Storybook publishes to a public URL.
 *
 * The decisive items are already applied to prototype 3; the ones with a real choice in
 * them are shown here as the original beside two proposals, so the comparison happens
 * by looking rather than by describing.
 */

/** Asked for outright on the call, vs. proposed by design in response to it. */
export type Status = "Asked for" | "Proposed" | "Applied";

export interface FeedbackItem {
    slug: string;
    title: string;
    status: Status;
    /** From the Oct 2 call, trimmed to the design point. */
    quotes: string[];
    /** What we're doing, and why that reading of the quote. */
    decision: string[];
    /** Files that change when this is adopted. */
    touches: string[];
    /** Considered and deliberately not doing. */
    notDoing?: string;
}

/**
 * The frame for the whole batch. Everything else follows from one observation: these
 * lists are longer than the UI assumed.
 */
export const framing = {
    quote: "You have to plan on them being long searchable lists. I'm not going to look through any list at all. I'm going to do a type ahead and then it's going to filter down my giant list for me.",
    decision:
        "Round 2 assumed you would browse. A real publisher library has about 150 assets and can have a thousand apps, so browsing is not a thing anyone does. Round 3 makes search the way in, everywhere it applies.",
};

export const items: FeedbackItem[] = [
    {
        slug: "keyword-targeting",
        title: "Targeting keywords",
        status: "Asked for",
        quotes: [
            "I don't want chips. I want it down here in a list — I want this table.",
            "I need, similar to the way we do it with creative, I need to be able to search.",
            "We also need, like where you have upload new asset, we also need add keyword.",
        ],
        decision: [
            "Chips carry no columns, so they cannot show the one thing that matters while choosing: whether a keyword is actually arriving in traffic. Targeting a keyword no app sends is the quietest way to build a campaign that never serves.",
            "Both proposals end in the same table. They differ only in where the search lives — on the page, or behind a button.",
            "Add keyword mirrors Upload new asset: without it, finding the keyword missing from your library means abandoning the form.",
        ],
        touches: ["prototypes/das/v3/screens/keyword-target.tsx", "prototypes/das/v3/screens/search-select.tsx"],
    },
    {
        slug: "creative-selection",
        title: "Adding creatives",
        status: "Asked for",
        quotes: [
            "You're not going to load a preview of 150 assets. That's not realistic.",
            "I like the preview from when you search it.",
            "I'm not going to scroll down a table to see those assets.",
        ],
        decision: [
            "The preview stays, but bounded by the search rather than by the library — it renders on the handful of rows a query matched, never on an unfiltered list.",
            "Same two entry points as keywords, because the review asked for the two to behave identically.",
        ],
        touches: ["prototypes/das/v3/screens/creative-target.tsx"],
    },
    {
        slug: "publish-duplicate",
        title: "Publish & Duplicate",
        status: "Asked for",
        quotes: [
            "I need publish and duplicate. I need those buttons to maintain themselves, because that's where publishers use that a lot.",
            "You have to confirm you wanted to do that, and then it brings you back into the beginning.",
        ],
        decision: [
            "Round 2 reduced the rail to a single Review button and lost both actions. Duplicating is not a convenience — it is the main way a second campaign gets made, for another format or another language.",
            "The confirm matters: publishing and starting a second campaign are two things, and doing both off one click with no acknowledgement leaves you unsure the first one went out.",
        ],
        touches: ["prototypes/das/v3/screens/publish-duplicate.tsx"],
    },
    {
        slug: "keyword-setup",
        title: "Keyword Setup: the note and bulk add",
        status: "Applied",
        quotes: [
            "It has to be one-to-one. If you're giving me a note on multiple, it's weird to have multiple with the note.",
            "I might have you just kill this whole note thing.",
            "Bulk add is the same as this. We don't need it twice.",
        ],
        decision: [
            "The note is gone. One note against however many keywords you pasted is not a thing a note can mean, and the field invited exactly that.",
            "Bulk add was a second page doing what this form already does. Every line is checked here — casing, characters, duplicates, and whether your apps are sending it.",
            "A keyword now has nothing editable on it, which is honest: a keyword is the string your app sends, and the string is the whole of it.",
        ],
        touches: ["prototypes/das/v3/screens/keyword-library-v3.tsx", "prototypes/das/v3/screens/keyword-data.ts"],
        notDoing: "Categories or folders for keywords. Asked directly and answered: “For V1, no.”",
    },
    {
        slug: "campaign-chrome",
        title: "The setup tabs",
        status: "Applied",
        quotes: ["This view all campaign, this tab nav here, we can just kill this entirely. We'll do setup only — no tabs for that one."],
        decision: [
            "View All Campaigns duplicated the nav's own manage campaigns entry: the same destination offered twice, one of them pretending that setup and the list are two halves of one thing.",
        ],
        touches: ["prototypes/das/v3/screens/campaign-setup.tsx"],
    },
    {
        slug: "keyword-integration",
        title: "How keywords reach Nimbus",
        status: "Applied",
        quotes: ["Where did we get these remote config, hardcoded? … I think we chose remote config only."],
        decision: [
            "Offering three integration patterns as equals invited a publisher to pick the one that hurts later: hardcoded keywords need an app release to change, which turns a targeting mistake into a two-week fix.",
            "Keyword Health still reports what each app appears to be doing, because an app that hardcoded its keywords before we said not to still behaves that way and the publisher needs to see it.",
        ],
        touches: ["prototypes/das/v3/screens/keyword-common.tsx", "prototypes/das/v3/screens/keyword-health.tsx"],
    },
];

export const bySlug = (slug: string): FeedbackItem => {
    const found = items.find((i) => i.slug === slug);
    if (!found) throw new Error(`No Oct 2 feedback item named “${slug}”`);
    return found;
};
