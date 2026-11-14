import { proto, story } from "./tokens";
import { Cta, CtaRow, PageHeader } from "./ui";

/**
 * The header every review's Summary opens with, so all seven read the same way: the date,
 * what the review was about in one sentence, and the same links in the same order —
 * the prototype it was built into, then Walkthrough, Changes and Concepts where they exist.
 */

interface Review {
    date: string;
    topic: string;
    round: string;
    lead: string;
    /** Prototype path and screen the review was built into. */
    proto: [string, string];
    protoLabel: string;
    /** Story or docs ids, by page. */
    walkthrough?: string;
    changes?: string;
    concepts?: string;
    more?: [string, string][];
}

const r = (name: string) => `reviews-${name}`;

const REVIEWS: Record<string, Review> = {
    "nov-13": {
        date: "Nov 13, 2026",
        topic: "Full application",
        round: "Whole dashboard",
        lead: "Product, engineering and design agreed how the dashboard's styles come together: move toward the prototype's styles, finish Storybook first, start with Performance Insights.",
        proto: ["app/v1", ""],
        protoLabel: "Open the full application",
        more: [
            ["Every screen", "prototypes-full-application-screen-index--docs"],
            ["Process & roadmap", "start-here-process-roadmap--docs"],
            ["Engineering constraints", "research-engineering-constraints--docs"],
        ],
    },
    "nov-6": {
        date: "Nov 6, 2026",
        topic: "Delivery chart",
        round: "DAS Round 6",
        lead: "Ad requests and daily active users join the campaign overview's Delivery chart. Nine chart concepts, A chosen. The page stops coaching, and every table sorts.",
        proto: ["das/v6", "view-a-at-risk"],
        protoLabel: "Open Round 6",
        walkthrough: r("nov-6-·-delivery-chart-walkthrough--docs"),
        changes: r("nov-6-·-delivery-chart-changes--overview-before"),
        concepts: r("nov-6-·-delivery-chart-concepts-a-to-e--all-five"),
    },
    "oct-29": {
        date: "Oct 29, 2026",
        topic: "Reporting",
        round: "DAS Round 6",
        lead: "One trued-up spend number everywhere, Pacing in place of Campaign Health, and new metrics and breakdowns in Full performance.",
        proto: ["das/v6", "campaigns"],
        protoLabel: "Open Round 6",
        walkthrough: r("oct-29-·-reporting-walkthrough--docs"),
        changes: r("oct-29-·-reporting-changes--campaigns-before"),
    },
    "oct-26": {
        date: "Oct 26 & 27, 2026",
        topic: "Nimbus tokens",
        round: "DAS Round 5",
        lead: "DAS approved. This round makes it read as Nimbus and writes the rules down as shared tokens: tables, tabs, bands, dates, buttons and filters.",
        proto: ["das/v5", "view-d"],
        protoLabel: "Open Round 5",
        walkthrough: r("oct-26-·-nimbus-tokens-walkthrough--docs"),
        changes: r("oct-26-·-nimbus-tokens-changes--campaigns-before"),
        more: [["Nimbus tokens", "design-system-nimbus-tokens-overview--docs"]],
    },
    "oct-17": {
        date: "Oct 16 & 19, 2026",
        topic: "After publishing",
        round: "DAS Round 4",
        lead: "What follows setup: Manage campaigns, the campaign overview and Full performance. Decided changes are built; open choices are concepts side by side.",
        proto: ["das/v4", "campaigns"],
        protoLabel: "Open Round 4",
        changes: r("oct-17-·-after-publishing-changes--creative-before"),
        concepts: r("oct-17-·-after-publishing-concepts-campaign-health--counts"),
    },
    "oct-5": {
        date: "Oct 2 & 5, 2026",
        topic: "Type rules",
        round: "DAS Round 3",
        lead: "One way to pick from a library, used on every picker, and the type rules: Proxima Nova, extra-bold headlines, nothing under 15px, dates only.",
        proto: ["das/v3", "setup-ready"],
        protoLabel: "Open Round 3",
        changes: r("oct-5-·-type-rules-changes--note-before"),
        concepts: r("oct-5-·-type-rules-concepts-creative-selection--original"),
        more: [["Typography Rules", "research-typography-rules--docs"]],
    },
    "sept-22": {
        date: "Sept 22, 2026",
        topic: "Round 1",
        round: "DAS Round 1",
        lead: "The first DAS review: eight decisions, each with what was said, what we did, and the revised screen beside the one that was reviewed.",
        proto: ["das/v1", ""],
        protoLabel: "Open Round 1",
        changes: r("sept-22-·-round-1-changes-1-reporting-placement--docs"),
    },
};

export const ReviewHeader = ({ id }: { id: keyof typeof REVIEWS }) => {
    const v = REVIEWS[id];
    return (
        <PageHeader
            eyebrow={`Review · ${v.date}`}
            title={v.topic}
            lead={v.lead}
            chips={[v.round, v.date]}
            actions={
                <CtaRow>
                    <Cta kind="primary" href={proto(v.proto[0], v.proto[1])}>
                        {v.protoLabel}
                    </Cta>
                    {v.walkthrough && <Cta href={story(v.walkthrough)}>Walkthrough</Cta>}
                    {v.changes && <Cta href={story(v.changes)}>Changes</Cta>}
                    {v.concepts && <Cta href={story(v.concepts)}>Concepts</Cta>}
                    {(v.more ?? []).map(([label, to]) => (
                        <Cta key={label} href={story(to)}>
                            {label}
                        </Cta>
                    ))}
                </CtaRow>
            }
        />
    );
};
