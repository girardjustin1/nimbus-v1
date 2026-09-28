/**
 * Sept 22 review — the feedback batch, as data.
 *
 * One entry per change coming out of the September 22 design review. Quotes are taken
 * from the call, trimmed to the design point and nothing else. The reviewer is named by
 * role, not by name, because this Storybook publishes to a public URL.
 *
 * Nothing in this batch is applied to the existing screens. The revised versions live
 * next to this file so the originals stay exactly as they were reviewed, and the two can
 * be compared before anything is adopted.
 */

/** Asked for outright on the call, vs. proposed by design in response to it. */
export type Status = "Asked for" | "Proposed";

export interface FeedbackItem {
    n: number;
    /** Storybook nav slug, e.g. "1-reporting-placement". */
    slug: string;
    title: string;
    status: Status;
    /** From the Sep 22 call, trimmed to the design point. */
    quotes: string[];
    /** What we're doing, and why that reading of the quote. */
    decision: string[];
    /** Files that change when this is adopted. */
    touches: string[];
    /** Considered and deliberately not doing. */
    notDoing?: string;
}

/** Framing for the whole batch — the order of work was set at the top of the call. */
export const framing = {
    quote: "Let's focus on the setup stuff first. And then we can do reporting — that can be the second thing we do. So don't worry about doing all of it at once.",
    decision:
        "Setup is round one. Reporting is a separate effort with its own kickoff, so it moves out of the setup concepts and sits on its own at the end.",
};

export const items: FeedbackItem[] = [
    {
        n: 1,
        slug: "1-reporting-placement",
        title: "Reporting moves out of Performance Insights",
        status: "Asked for",
        quotes: [
            "You have it as living inside of Performance Insights, and Performance Insights is — DAS is this teeny tiny little component of Performance Insights. So that just needs to be something we need to do, like a totally separate kickoff for that.",
            "Can you just make it standalone reporting? Put it in the navigation, under Deal Activation System, and put like Reporting Concepts.",
            "I think there's good stuff in here, but if I show people and it looks like [it lives in PI], they'll just be like, that's going to affect the entire presentation.",
            "It'll be clear that it's just sort of in there. We're not really sure where it's going to live yet, and it's something we can just look at in a vacuum.",
            "That's the first thing I definitely want you to do is change where that lives in the nav in Storybook.",
        ],
        decision: [
            "The reporting concepts move out of Round 1 Concepts into their own group, placed last under Deal Activation System so setup reads first.",
            "The screens also stop rendering with Performance Insights highlighted in the product nav. That highlight is what made them look like a Performance Insights proposal — the words in the nav said PI even when the Storybook path did not.",
            "The group gets an intro saying placement is undecided, so it reads as something to judge on its own rather than a change to the whole dashboard.",
        ],
        touches: [
            "src/pages/deal-activation-system/reporting.stories.tsx — title",
            "src/pages/deal-activation-system/reporting.tsx — navKey on both concepts",
            ".storybook/preview.tsx — storySort order",
        ],
    },
    {
        n: 2,
        slug: "2-date-only",
        title: "Flight dates lose the time of day",
        status: "Asked for",
        quotes: [
            "Right now we can only do start, stop date. There's no time.",
            "That's coming, but the backend doesn't support it yet.",
        ],
        decision: [
            "Both setup flows drop to date-only. A time of day in the design implies a capability that does not exist yet, and a publisher who sets 6:00 PM would be promised something the platform cannot honour.",
            "The date-and-time picker is not deleted. It stays in Storybook as the target state for when the backend catches up, marked as such, so the work is not lost and the intent is on the record.",
            "The end-before-start check keeps working — it just compares dates instead of dates and times.",
        ],
        touches: [
            "prototypes/das/v1/screens/campaign-setup-one-page.tsx — FlightDates",
            "src/pages/deal-activation-system/studio/components/budget-schedule.tsx",
            "src/pages/deal-activation-system/studio/studio-data.ts — validation",
        ],
        notDoing:
            "Leaving the time field in and disabling it. A greyed-out control still reads as a promise, and it would need removing again later anyway.",
    },
    {
        n: 3,
        slug: "3-stacked-revenue",
        title: "Revenue by day stacks by campaign",
        status: "Asked for",
        quotes: [
            "On this page, can these be stacked bars? Because right here you're representing multiple campaigns — but then up here, the graph is just like DAS, so it's not going to be helpful.",
            "Leave Open Marketplace, make it a stacked graph of the DAS campaigns inside of it though. So that this matches — you can see them up here.",
        ],
        decision: [
            "The single teal DAS block splits into one segment per campaign, using a teal ramp so the DAS share still reads as one mass.",
            "Drawing that split inside the full-height bar does not actually work: DAS is about 14% of total revenue, so each campaign lands two or three pixels tall — harder to read than the single block it replaced. So the chart gets two views. “DAS campaigns” is scaled to DAS, where the campaigns are legible, and is the default. “Share of total” adds Open Marketplace back on top and keeps the comparison the original chart existed to make.",
            "Open Marketplace is otherwise untouched. The ask was to subdivide DAS, not to change the comparison — this keeps both, rather than trading one for the other.",
            "The segments are derived from the same campaign list the delivery table below uses, so the chart and the table can never disagree about which campaigns exist.",
            "Legend and tooltip switch to campaign names — that is the whole point of the change, being able to tell which campaign the teal belongs to.",
        ],
        touches: ["src/pages/deal-activation-system/das-data.ts — dailyRevenue", "src/pages/deal-activation-system/reporting.tsx — Revenue by day"],
    },
    {
        n: 4,
        slug: "4-behind-pace",
        title: "Behind pace becomes a link",
        status: "Asked for",
        quotes: [
            "It would be cool if Behind pace — maybe that's clickable.",
            "Some of these customers are going to have like 50 campaigns running. So then you go find this one…",
            "Maybe this is a link, or there's like a little go-to-campaign here or something.",
        ],
        decision: [
            "Behind pace and Ending in 7 days become links straight to the campaign they are counting. The deep link already exists on the campaign name; the tiles just did not use it.",
            "When a tile counts more than one campaign it links to the list filtered to those campaigns, rather than guessing which one was meant.",
            "Ending in 7 days was a hardcoded 1. It is now derived, so the number cannot drift away from the data underneath it.",
            "Live campaigns and Spend this flight stay inert — they describe the whole account, so there is nowhere specific to send anyone.",
        ],
        touches: ["prototypes/das/v1/screens/manage-campaigns.tsx — KpiStrip", "src/pages/deal-activation-system/manage-campaigns.tsx — KpiStrip"],
    },
    {
        n: 5,
        slug: "5-fake-client-names",
        title: "Sample advertisers stay fictional",
        status: "Asked for",
        quotes: ["They can be completely fake. It's kind of better that they are, because then I can show it to other customers if I want to."],
        decision: [
            "No change to the data — it is already invented. This is recorded as a decision so nobody later improves the prototype by putting real advertisers in it.",
            "Being fictional is a feature, not a placeholder: it is what makes these screens safe to show to any customer.",
            "The rule goes in the data file's header and the README, where someone is likely to look before editing.",
        ],
        touches: ["src/pages/deal-activation-system/das-data.ts — header comment", "README.md"],
    },
    {
        n: 6,
        slug: "6-stepper-reframed",
        title: "The stepper is recorded, not recommended",
        status: "Proposed",
        quotes: [
            "I got feedback from a customer literally last week saying that a wizard is a little cumbersome.",
            "If we wanted to do a wizard, I think this is great. I think I want to go away from wizard though.",
            "I love the sidebar thing that you've got there. That's a cool idea.",
        ],
        decision: [
            "One-page setup is the direction. The step-by-step concept is kept, but retitled so it reads as the alternative that was explored and set aside, not a competing proposal.",
            "The reason goes on the page. Without it, someone reading this in three months sees two equal options and reopens a question that is already answered.",
            "Nothing is deleted. The concept is evidence that the one-page route was chosen over an alternative, which is worth more than a tidy folder.",
        ],
        touches: [".storybook/preview.tsx — group title", "src/pages/deal-activation-system/studio/ — overview copy"],
    },
    {
        n: 7,
        slug: "7-preview-approximation",
        title: "The device preview says it is an approximation",
        status: "Proposed",
        quotes: [
            "The concern I would have is that it's giving ourselves enough rope to hang ourselves — where the publisher starts to bring things up and we're saying, this is an approximation. Phones are different sizes.",
            "It would actually cause them to be so compelled wanting that to actually work 100% perfect.",
            "I love it though. Let's keep it in the mix, because there's something about it that's obviously very compelling.",
        ],
        decision: [
            "The caption currently reads “This preview shows how the ad renders in a Nimbus-served app.” That is a claim of accuracy, and it is the exact claim the concern is about.",
            "It becomes an explicit approximation, naming the reason — device sizes vary — so the caveat travels with the screenshot when someone shares it out of context.",
            "The concept itself is unchanged. The worry was about what it promises, not what it shows.",
        ],
        touches: ["src/pages/deal-activation-system/studio/components/preview-stage.tsx — caption"],
    },
    {
        n: 8,
        slug: "8-concept-naming",
        title: "Concept letters get a scope",
        status: "Proposed",
        quotes: [
            "Is the intention that everything labeled Concept A, B, C only belongs to — like all the A's belong to each other? Or would it be concept A for targeting versus concept B for campaign management?",
        ],
        decision: [
            "The letters are scoped per surface and always were — Targeting A has nothing to do with Campaign list A. That was not visible in the label, which is why the question came up.",
            "Labels gain their surface: “Targeting · A” rather than “Concept A”. The fix is in the label, not in a legend someone has to find.",
            "The letters stay. They are useful shorthand on a call; they just need to say what they are lettering.",
        ],
        touches: ["src/pages/deal-activation-system/*.tsx — ConceptNote labels", "src/pages/deal-activation-system/*.stories.tsx — story names"],
    },
];

export const byStatus = (status: Status) => items.filter((i) => i.status === status);
