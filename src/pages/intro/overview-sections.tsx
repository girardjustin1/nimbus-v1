import heroArt from "./art/hero-app.jpg";
import shotBlocking from "./screens/app-blocking.jpg";
import shotCampaigns from "./screens/app-campaigns.jpg";
import shotDemand from "./screens/app-demand.jpg";
import shotOverview from "./screens/app-overview.jpg";
import shotPi from "./screens/app-pi.jpg";
import shotRealtime from "./screens/app-realtime.jpg";
import shotSettings from "./screens/app-settings.jpg";
import { proto, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Hero, MiniCard, ShotCard } from "./ui";

/**
 * Start Here › Overview — the page Storybook opens on. Sections are components so
 * the MDX stays a short outline; screenshots come from scripts/capture-intro-screens.mjs.
 */

const APP = "app/v1";
const nov13 = (page: string) => story(`prototypes-full-application-${page}--default`);

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
                <Cta kind="secondary" href={story("start-here-how-to-review--docs")}>
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
            links={[["The six rounds", story("prototypes-deal-activation-system-rounds--docs")]]}
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

export const Folders = () => (
    <CardGrid min={230}>
        <MiniCard eyebrow="1 · You are here" title="Start Here" tone="warm">
            This page, the style guide, the process and roadmap, and how to review.
        </MiniCard>
        <MiniCard eyebrow="2" title="Transition" href={story("transition-overview--docs")} cta="See the current round" tone="warm">
            Product's lists of changes, round by round, and who owes what until Storybook is final.
        </MiniCard>
        <MiniCard eyebrow="3" title="Prototypes" href={story("prototypes-full-application-screen-index--docs")} cta="Open the screen index" tone="warm">
            The full application, one story per state, and the Deal Activation System's six rounds.
        </MiniCard>
        <MiniCard eyebrow="4" title="Design System" href={story("design-system-nimbus-tokens-overview--docs")} cta="See the tokens" tone="warm">
            Styles, Nimbus tokens, base components, application UI and the chart library.
        </MiniCard>
        <MiniCard eyebrow="5" title="Reviews" href={story("reviews-nov-13-·-full-application-summary--docs")} cta="Open the latest" tone="warm">
            Every review with product, newest first. Each opens on a summary: decisions and what was left open.
        </MiniCard>
        <MiniCard eyebrow="6" title="Research" href={story("research-typography-audit--docs")} cta="Open the type audit" tone="warm">
            The audits of the live dashboard behind the rules, and engineering's constraints.
        </MiniCard>
        <MiniCard eyebrow="7" title="Archive" href={story("archive-about-the-archive--docs")} cta="What's in the archive" tone="warm">
            Earlier concepts and screens, kept viewable, each with a note on what replaced it.
        </MiniCard>
    </CardGrid>
);

export const NextPages = () => (
    <CardGrid min={230}>
        <MiniCard eyebrow="The rules" title="Style guide" href={story("start-here-style-guide--docs")} cta="Read the style guide">
            Type, colour, tables, the reporting page, controls, charts and copy, each with a real screen.
        </MiniCard>
        <MiniCard eyebrow="The plan" title="Process & roadmap" href={story("start-here-process-roadmap--docs")} cta="See the roadmap">
            The four steps from Storybook to the dashboard, the priorities, milestones and open decisions.
        </MiniCard>
        <MiniCard eyebrow="Your turn" title="How to review" href={story("start-here-how-to-review--docs")} cta="Start reviewing">
            Compare staging and the prototype page by page, most important first.
        </MiniCard>
        <MiniCard eyebrow="Where it began" title="DAS rounds" href={story("prototypes-deal-activation-system-rounds--docs")} cta="See the rounds">
            The six review rounds of the Deal Activation System.
        </MiniCard>
    </CardGrid>
);
