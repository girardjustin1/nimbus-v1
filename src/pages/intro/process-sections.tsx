import shotBuyers from "./screens/app-buyers.jpg";
import shotPiTable from "./screens/app-pi-table.jpg";
import shotPi from "./screens/app-pi.jpg";
import shotV1 from "./screens/das-v1.jpg";
import shotV3 from "./screens/das-v3.jpg";
import shotV5 from "./screens/das-v5.jpg";
import shotV6 from "./screens/das-v6.jpg";
import { proto, story } from "./tokens";
import { CardGrid, Chip, Cta, CtaRow, Decision, MiniCard, PageHeader, ShotCard, Steps, Timeline } from "./ui";

/**
 * Start Here › Process & roadmap — the four steps, the priorities, the milestones
 * and the open decisions, as cards and a track rather than tables.
 */

const APP = "app/v1";

export const ProcessHero = () => (
    <PageHeader
        eyebrow="Process & roadmap"
        title="From Storybook to the dashboard, in four steps."
        lead="Agreed with product and engineering on 13 November: finish Storybook first, port from it once, then staging and a rollout section by section."
        chips={["Step 1 of 4", "Performance Insights first", "Agreed 13 Nov 2026"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story("start-here-how-to-review--docs")}>
                    Start the review
                </Cta>
                <Cta kind="secondary" href={story("reviews-nov-13-·-full-application-summary--docs")}>
                    The 13 Nov call
                </Cta>
            </CtaRow>
        }
    />
);

export const ProcessSteps = () => (
    <Steps
        items={[
            {
                label: "Step 1",
                state: "now",
                title: "Finish Storybook",
                body: "Every page shows the styles we want, reviewed by product, before anything is ported.",
                meta: "Design, with product",
            },
            {
                label: "Step 2",
                state: "next",
                title: "Port to code",
                body: "Everything moves from Storybook into the dashboard's codebase in one pass.",
                meta: "Engineering",
            },
            {
                label: "Step 3",
                state: "next",
                title: "Staging and QA",
                body: "Push to staging, compare against Storybook, fine-tune.",
                meta: "Engineering and design",
            },
            { label: "Step 4", state: "next", title: "Roll out", body: "Section by section, in priority order.", meta: "Engineering" },
        ]}
    />
);

const Chunks = ({ items }: { items: string[] }) => (
    <span style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
        {items.map((c) => (
            <Chip key={c} tone="teal">
                {c}
            </Chip>
        ))}
    </span>
);

export const Priorities = () => (
    <CardGrid>
        <ShotCard
            badge="Priority 1"
            shot={shotPiTable}
            eyebrow="Reporting"
            title="Performance Insights"
            body="One of the oldest parts of the dashboard, and the home of most of its base styles. Its pieces are reused everywhere:"
            note={<Chunks items={["Date bar", "Bands", "Filters", "Charts", "Tables", "Summary tiles"]} />}
            href={proto(APP, "pi-query")}
            cta="Open the prototype"
            links={[["Stories", story("prototypes-full-application-reporting-performance-insights--default")]]}
        />
        <ShotCard
            badge="Priority 2"
            shot={shotV6}
            eyebrow="Deal Activation System"
            title="DAS, already through six rounds"
            body="Setup, assets, keywords, campaigns and reporting are reviewed and in staging. Engineering's order of difficulty inside it:"
            note={<Chunks items={["Dropdowns", "Modals", "Tables"]} />}
            href={proto(APP, "view-a-at-risk")}
            cta="Open the prototype"
            links={[["The six rounds", story("prototypes-deal-activation-system-rounds--docs")]]}
        />
        <ShotCard
            badge="Priority 3"
            shot={shotBuyers}
            eyebrow="Pages that share the pieces"
            title="Then everything built from the same chunks"
            body="Once Performance Insights is right, these follow with little extra work, and the rest of the dashboard after them:"
            note={<Chunks items={["Buyer breakdown", "Benchmarks", "Activity", "Floors", "Manage campaigns"]} />}
            href={proto(APP, "buyer-breakdown")}
            cta="Open the prototype"
            links={[["Every screen", story("prototypes-full-application-screen-index--docs")]]}
        />
    </CardGrid>
);

export const Milestones = () => (
    <Timeline
        items={[
            {
                date: "Sep 22, 2026",
                state: "done",
                title: "DAS Round 1 reviewed",
                body: "One-page campaign setup and the first pass at keywords, targeting and pacing.",
                href: proto("das/v1"),
                cta: "Round 1",
                shot: shotV1,
            },
            {
                date: "Oct 1 – 5",
                state: "done",
                title: "Rounds 2 and 3: the type rules arrive",
                body: "One rail, one way to pick from a library, and the rule that nothing goes under 15px.",
                href: story("research-typography-rules--docs"),
                cta: "Typography Rules",
                shot: shotV3,
            },
            {
                date: "Oct 16 – 27",
                state: "done",
                title: "Rounds 4 and 5: the Nimbus tokens",
                body: "Manage campaigns, the campaign overview and Full performance; then tables, tabs, bands, fields and buttons become shared tokens.",
                href: story("reviews-oct-26-·-nimbus-tokens-walkthrough--docs"),
                cta: "Oct 26 review",
                shot: shotV5,
            },
            {
                date: "Oct 29 – Nov 6",
                state: "done",
                title: "Round 6: one spend number, actual numbers, no coaching",
                body: "Pacing replaces Campaign Health, the Delivery chart gains requests and active users, every table sorts.",
                href: story("reviews-nov-6-·-delivery-chart-walkthrough--docs"),
                cta: "Nov 6 review",
                shot: shotV6,
            },
            {
                date: "Nov 12",
                state: "done",
                title: "DAS reaches staging",
                body: "Engineering walks through DAS ported to staging: existing styles kept where defined, the prototype's where there were none.",
            },
            {
                date: "Nov 13",
                state: "now",
                title: "Direction agreed, full application built",
                body: "Product, engineering and design agree the process. Engineering shares its component list and constraints. Every dashboard page is rebuilt on the style guide.",
                href: proto(APP),
                cta: "Open the full application",
                shot: shotPi,
            },
            {
                date: "Next",
                state: "next",
                title: "Product's side-by-side review",
                body: "Staging against the full application on the high-impact pages: what to keep from each.",
                href: story("start-here-how-to-review--docs"),
                cta: "How to review",
            },
            {
                date: "Then",
                state: "next",
                title: "Port, staging, rollout",
                body: "Steps 2 to 4, starting with Performance Insights.",
            },
        ]}
    />
);

export const OpenDecisions = () => (
    <CardGrid min={300}>
        <Decision
            title="Nimbus benchmarks chart"
            built="One small chart per metric, one axis each."
            alternative="Staging's single chart with a $ axis and a % axis."
            href={proto(APP, "benchmarks")}
            cta="See it"
        />
        <Decision
            title="Demand list table headers"
            built="The light list header, per the table rule."
            alternative="Staging's black header."
            href={proto(APP, "demand-active")}
            cta="See it"
        />
        <Decision
            title="Toggle colour"
            built="Pink, as the base component has it."
            alternative="Staging's teal."
            href={proto(APP, "demand-nplus")}
            cta="See it"
        />
        <Decision
            title="Coaching lines"
            built="Trimmed: “contact your Nimbus rep” and “be sure to confirm with the publisher”."
            alternative="Keep staging's text."
            href={proto(APP, "test-mode")}
            cta="See it"
        />
        <Decision
            title="Pages with no staging screenshot"
            built="Configure Floors, the discrepancy report and Finance's frame, from the call notes."
            alternative="Product supplies the staging screens."
            href={proto(APP, "floors-configure")}
            cta="See it"
        />
        <Decision
            title="Daily active users"
            built="Sample data on the DAS Delivery chart."
            alternative="The backend feed, expected before launch."
            href={proto(APP, "view-a-at-risk")}
            cta="See it"
        />
    </CardGrid>
);

export const Reading = () => (
    <CardGrid min={230}>
        <MiniCard eyebrow="13 Nov" title="Direction" href={story("reviews-nov-13-·-full-application-summary--docs")} cta="Read the decisions" tone="warm">
            What was decided on the call, by topic, and how the build answers it.
        </MiniCard>
        <MiniCard eyebrow="Engineering" title="Constraints" href={story("research-engineering-constraints--docs")} cta="See the list" tone="warm">
            What is hard to restyle, and the components the dashboard uses most.
        </MiniCard>
        <MiniCard eyebrow="The rules" title="Style guide" href={story("start-here-style-guide--docs")} cta="Read the style guide" tone="warm">
            What gets ported: eight rules, each with a screen.
        </MiniCard>
    </CardGrid>
);
