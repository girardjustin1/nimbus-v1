import heroArt from "./art/hero-app.jpg";
import dasArt from "./art/hero-das.jpg";
import shotBlocking from "./screens/app-blocking.jpg";
import shotCampaigns from "./screens/app-campaigns.jpg";
import shotDemand from "./screens/app-demand.jpg";
import shotFloors from "./screens/app-floors.jpg";
import shotOverview from "./screens/app-overview.jpg";
import shotPiTable from "./screens/app-pi-table.jpg";
import shotPi from "./screens/app-pi.jpg";
import shotRealtime from "./screens/app-realtime.jpg";
import shotSettings from "./screens/app-settings.jpg";
import shotSetup from "./screens/app-setup.jpg";
import shotV6 from "./screens/das-v6.jpg";
import { proto, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Feature, Hero, MiniCard, ShotCard, Stats, Steps } from "./ui";

/**
 * Full Application › Overview — the page Storybook opens on. Sections are components so
 * the MDX stays a short outline; screenshots come from scripts/capture-intro-screens.mjs.
 */

const APP = "app/v1";
const nov13 = (page: string) => story(`november-13th-2026-${page}--default`);

export const OverviewHero = () => (
    <Hero
        eyebrow="Nimbus design system"
        title="One design system for the whole Nimbus dashboard."
        lead="Every screen of the publisher dashboard, rebuilt on one style guide: the tokens, components and rules settled through the Deal Activation System's review rounds. Storybook is where it's agreed, before anything is ported."
        chips={["92 screens", "7 areas", "Nov 13 style guide", "Sample data only"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto(APP)}>
                    Open the full application
                </Cta>
                <Cta kind="secondary" href={story("full-application-how-to-review--docs")}>
                    How to review
                </Cta>
            </CtaRow>
        }
        shots={[
            { src: shotPi, label: "Performance Insights", href: proto(APP, "pi-query-line") },
            { src: shotRealtime, label: "Realtime dashboard", href: proto(APP, "realtime") },
            { src: shotCampaigns, label: "Manage campaigns", href: proto(APP, "campaigns") },
        ]}
        caption="Live screens from the full application prototype. Every publisher, partner and figure is fictional."
    />
);

export const AreaCards = () => (
    <CardGrid>
        <ShotCard
            shot={shotPi}
            eyebrow="1 · Reporting · 15 screens"
            title="Performance Insights and the dashboards"
            body="Key metrics, the realtime dashboard, Performance Insights, buyer breakdown and Nimbus benchmarks, all on one reporting pattern."
            note={
                <>
                    <b>Look at:</b> the date row, the metric and breakdown bands, the chart type bar and the report table.
                </>
            }
            href={proto(APP, "pi-query-line")}
            cta="Open the prototype"
            links={[["Stories", nov13("reporting-performance-insights")]]}
            badge="Priority"
        />
        <ShotCard
            shot={shotDemand}
            eyebrow="2 · Demand · 8 screens"
            title="Partners, placements and payments"
            body="Configure demand, manage active and Nimbus+ demand, and Nimbus+ payments by month."
            note={
                <>
                    <b>Look at:</b> list tables, toggles, the partner configuration form.
                </>
            }
            href={proto(APP, "demand-active")}
            cta="Open the prototype"
            links={[["Stories", nov13("demand-manage-active-demand")]]}
        />
        <ShotCard
            shot={shotOverview}
            eyebrow="3 · Deal Activation System · 49 screens"
            title="DAS, as Round 6 left it"
            body="Campaign setup, assets, keywords, manage campaigns, a campaign's overview and its full performance."
            note={
                <>
                    <b>Look at:</b> the Delivery chart, the Pacing column, every table sorting.
                </>
            }
            href={proto(APP, "view-a-at-risk")}
            cta="Open the prototype"
            links={[["The six rounds", story("das-prototypes-overview--docs")]]}
        />
        <ShotCard
            shot={shotBlocking}
            eyebrow="4 · AdOps · 11 screens"
            title="Blocking, floors and the activity log"
            body="Ad blocking, floors, test mode, discrepancy reports and activity, each with its empty state."
            note={
                <>
                    <b>Look at:</b> the stacked sections, each with its input, buttons and list.
                </>
            }
            href={proto(APP, "ad-blocking")}
            cta="Open the prototype"
            links={[["Stories", nov13("adops-ad-blocking")]]}
        />
        <ShotCard
            shot={shotSettings}
            eyebrow="5 · SDKs, Finance, Settings · 9 screens"
            title="The pages around the edges"
            body="SDK downloads, the Finance pages with their third-party frame and no-permission states, and Settings."
            note={
                <>
                    <b>Look at:</b> form fields, the endpoints list, how a no-permission page reads.
                </>
            }
            href={proto(APP, "settings-api")}
            cta="Open the prototype"
            links={[["Stories", nov13("settings-reporting-api")]]}
        />
    </CardGrid>
);

export const ProcessStrip = () => (
    <Steps
        items={[
            {
                label: "Step 1",
                state: "now",
                title: "Finish Storybook",
                body: "Get every page here to the styles we want, with product's review, before anything is ported.",
            },
            { label: "Step 2", state: "next", title: "Port to code", body: "Engineering ports everything from Storybook into the dashboard's codebase." },
            { label: "Step 3", state: "next", title: "Staging and QA", body: "Push to staging, check it against Storybook, fine-tune." },
            { label: "Step 4", state: "next", title: "Roll out", body: "Section by section, starting with Performance Insights." },
        ]}
    />
);

export const WhatWeMade = () => (
    <>
        <Feature
            art={heroArt}
            eyebrow="Performance Insights"
            title="The page everything else borrows from"
            what="The reporting page, rebuilt first. One of the oldest parts of the dashboard, it holds most of the base styles the rest reuse: the filters and date bar, the stacked sections, charts, tables and summary tiles."
            point="Get this page right and buyer breakdown, benchmarks, activity, floors and manage campaigns follow, because they are made of the same pieces."
            actions={
                <CtaRow>
                    <Cta kind="primary" href={proto(APP, "pi-query")}>
                        Open New Query
                    </Cta>
                    <Cta href={proto(APP, "pi-saved")}>Saved Queries</Cta>
                    <Cta href={nov13("reporting-performance-insights")}>Stories</Cta>
                </CtaRow>
            }
            shots={[
                { src: shotPiTable, alt: "Performance Insights, New Query as a table" },
                { src: shotPi, alt: "Performance Insights, the same query as a line chart" },
            ]}
        />
        <Feature
            art={dasArt}
            eyebrow="Deal Activation System"
            title="Six review rounds that settled the rules"
            what="How a publisher sets up, manages and reports on direct-sold campaigns, reviewed with product six times between 22 September and 6 November. Each round is frozen as it was reviewed."
            point="The tables, fields, tabs, type rules and the no-coaching rule were all decided here, one review at a time. The full application applies them to every other page."
            actions={
                <CtaRow>
                    <Cta kind="primary" href={story("das-prototypes-overview--docs")}>
                        See the six rounds
                    </Cta>
                    <Cta href={proto("das/v6", "view-a-at-risk")}>Round 6</Cta>
                    <Cta href={story("nov-6-edits-introduction--docs")}>Nov 6 review</Cta>
                </CtaRow>
            }
            shots={[
                { src: shotV6, alt: "DAS Round 6, a campaign's Delivery chart" },
                { src: shotSetup, alt: "DAS campaign setup, ready to publish" },
            ]}
        />
        <Feature
            art={heroArt}
            eyebrow="Storybook · November 13th, 2026"
            title="Every page, and every state it can be in"
            what="Each page of the full application has a folder in Storybook, with one story per state: default, empty, error, no permission, each chart type. Alongside sit the 13 Nov call, engineering's constraints and an index of all 92 screens."
            point="It is the thing engineering ports from. If a state isn't here, it hasn't been designed."
            actions={
                <CtaRow>
                    <Cta kind="primary" href={story("november-13th-2026-screen-index--docs")}>
                        Open the screen index
                    </Cta>
                    <Cta href={story("november-13th-2026-direction--docs")}>The 13 Nov call</Cta>
                    <Cta href={story("november-13th-2026-engineering-constraints--docs")}>Engineering constraints</Cta>
                </CtaRow>
            }
            shots={[
                { src: shotFloors, alt: "Floors, with custom floors listed" },
                { src: shotBlocking, alt: "Ad blocking, the stacked sections" },
            ]}
        />
    </>
);

export const Research = () => (
    <>
        <Stats
            items={[
                ["93 → 10", "text styles"],
                ["14 → 7", "font sizes"],
                ["7 → 3", "weights"],
                ["19 → 9", "text colours"],
                ["4 → 1", "typefaces"],
            ]}
        />
        <CtaRow>
            <Cta href={story("audits-typography-audit--docs")}>Typography Audit</Cta>
            <Cta href={story("audits-typography-rules--docs")}>Typography Rules</Cta>
        </CtaRow>
    </>
);

export const NextPages = () => (
    <CardGrid min={230}>
        <MiniCard eyebrow="The rules" title="Style guide" href={story("full-application-style-guide--docs")} cta="Read the style guide">
            Type, colour, tables, the reporting page, controls, charts and copy, each with a real screen.
        </MiniCard>
        <MiniCard eyebrow="The plan" title="Process & roadmap" href={story("full-application-process-roadmap--docs")} cta="See the roadmap">
            The four steps from Storybook to the dashboard, the priorities, milestones and open decisions.
        </MiniCard>
        <MiniCard eyebrow="Your turn" title="How to review" href={story("full-application-how-to-review--docs")} cta="Start reviewing">
            Compare staging and the prototype page by page, most important first.
        </MiniCard>
        <MiniCard eyebrow="Where it began" title="DAS prototypes" href={story("das-prototypes-overview--docs")} cta="See the rounds">
            The six review rounds of the Deal Activation System.
        </MiniCard>
    </CardGrid>
);
