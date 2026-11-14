import heroArt from "./art/hero-app.jpg";
import shotBlocking from "./screens/app-blocking.jpg";
import shotBuyers from "./screens/app-buyers.jpg";
import shotCampaigns from "./screens/app-campaigns.jpg";
import shotDemand from "./screens/app-demand.jpg";
import shotFloors from "./screens/app-floors.jpg";
import shotKeyMetrics from "./screens/app-key-metrics.jpg";
import shotPayments from "./screens/app-payments.jpg";
import shotPiTable from "./screens/app-pi-table.jpg";
import shotRealtime from "./screens/app-realtime.jpg";
import { proto, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Hero, MiniCard, ShotCard, Steps } from "./ui";

/**
 * Full Application › How to review — the side-by-side comparison of staging and the
 * full application, set up as a short walk: three steps, then nine pages in order.
 */

const APP = "app/v1";

export const ReviewHero = () => (
    <Hero
        eyebrow="How to review"
        title="Compare staging and the prototype, page by page."
        lead="The next step agreed on 13 November. Each page keeps staging's structure and wording, so what you're judging is styling: type, tables, fields, tabs and charts."
        chips={["9 pages first", "About 30 minutes", "Keep staging · keep the prototype · mix"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto(APP)}>
                    Open the full application
                </Cta>
                <Cta kind="secondary" href={story("november-13th-2026-screen-index--docs")}>
                    Every screen
                </Cta>
            </CtaRow>
        }
    />
);

export const SetUp = () => (
    <Steps
        items={[
            { label: "1", title: "Two windows", body: "Staging in one, the full application in the other, both about 1440px wide." },
            { label: "2", title: "Use the sidebar", body: "Every item leads to its page, as on staging. The screen menu at the top lists every state." },
            { label: "3", title: "Go in order", body: "Start with Performance Insights. For each page say: keep staging, keep the prototype, or mix." },
        ]}
    />
);

const PAGES: { n: number; shot: string; area: string; title: string; look: string; route: string }[] = [
    {
        n: 1,
        shot: shotPiTable,
        area: "Reporting",
        title: "Performance Insights",
        look: "Date row, metric and breakdown bands, chart type bar, report table. The pattern every reporting page reuses.",
        route: "pi-query",
    },
    {
        n: 2,
        shot: shotRealtime,
        area: "Reporting",
        title: "Realtime dashboard",
        look: "Summary tiles, the revenue and metrics chart, the grouped report table.",
        route: "realtime",
    },
    { n: 3, shot: shotKeyMetrics, area: "Reporting", title: "Key metrics", look: "The card grid and each card's tabs.", route: "key-metrics" },
    { n: 4, shot: shotBuyers, area: "Reporting", title: "Buyer breakdown", look: "Donuts, the shared legend, the table view.", route: "buyer-breakdown" },
    {
        n: 5,
        shot: shotCampaigns,
        area: "Deal Activation System",
        title: "Manage campaigns",
        look: "As DAS Round 6 left it: the Pacing column, every column sorting.",
        route: "campaigns",
    },
    {
        n: 6,
        shot: shotDemand,
        area: "Demand",
        title: "Manage active demand",
        look: "The list table, toggles and Third-Party Viewability.",
        route: "demand-active",
    },
    { n: 7, shot: shotPayments, area: "Demand", title: "n+ payments", look: "Month sections, search, totals.", route: "nplus-payments" },
    { n: 8, shot: shotBlocking, area: "AdOps", title: "Ad blocking", look: "The stacked sections: inputs, block buttons, lists.", route: "ad-blocking" },
    { n: 9, shot: shotFloors, area: "AdOps", title: "Floors", look: "Tiles, custom floors, the Configure Floors tab.", route: "floors" },
];

export const ReviewPages = () => (
    <CardGrid>
        {PAGES.map((p) => (
            <ShotCard
                key={p.route}
                badge={String(p.n)}
                shot={p.shot}
                eyebrow={p.area}
                title={p.title}
                body={
                    <>
                        <b>Look at:</b> {p.look}
                    </>
                }
                href={proto(APP, p.route)}
                cta="Open the prototype"
            />
        ))}
    </CardGrid>
);

export const AlsoWorthALook = () => (
    <CtaRow>
        <Cta href={proto(APP, "benchmarks")}>Nimbus benchmarks</Cta>
        <Cta href={proto(APP, "demand-configure")}>Configure demand</Cta>
        <Cta href={proto(APP, "activity")}>Activity</Cta>
        <Cta href={proto(APP, "discrepancy-reports")}>Discrepancy reports</Cta>
        <Cta href={proto(APP, "settings")}>Settings</Cta>
        <Cta href={proto(APP, "sdks")}>SDKs</Cta>
    </CtaRow>
);

export const WhatToLookAt = () => (
    <CardGrid min={190}>
        <MiniCard eyebrow="Type" title="Is the hierarchy clear?">
            Is anything too big now that nothing is under 15px?
        </MiniCard>
        <MiniCard eyebrow="Tables" title="Right header for this table?">
            Report or list. Do the columns sort the way you'd expect?
        </MiniCard>
        <MiniCard eyebrow="Fields and tabs" title="Staging's, cleaner?">
            Anything that should stay exactly as staging has it?
        </MiniCard>
        <MiniCard eyebrow="Charts" title="Readable at a glance?">
            Do the colours tell the series apart?
        </MiniCard>
        <MiniCard eyebrow="Copy" title="Anything missing?">
            Lines trimmed under the no-coaching rule that should come back?
        </MiniCard>
    </CardGrid>
);

export const OnPurpose = () => (
    <CardGrid min={230}>
        <MiniCard eyebrow="Different on purpose" title="Sample data is fictional" tone="warm">
            Names, figures and URLs won't match staging. This Storybook is public.
        </MiniCard>
        <MiniCard eyebrow="Different on purpose" title="Some things are placeholders" tone="warm">
            The banner's “Read more”, “Manage Placements”, “View Documentation”, and the Finance pages' third-party frame.
        </MiniCard>
        <MiniCard eyebrow="Different on purpose" title="Admin pages aren't included" tone="warm">
            The pink links across the top are labels only.
        </MiniCard>
    </CardGrid>
);

export const Feedback = () => (
    <CardGrid min={230}>
        <MiniCard eyebrow="Say" title="Keep staging">
            This piece is better as it is today. Point at it.
        </MiniCard>
        <MiniCard eyebrow="Say" title="Keep the prototype">
            This piece is better here. Nothing more needed.
        </MiniCard>
        <MiniCard eyebrow="Say" title="Mix">
            Name what to take from each. A screenshot or a short screen recording works best.
        </MiniCard>
    </CardGrid>
);
