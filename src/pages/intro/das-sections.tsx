import dasArt from "./art/hero-das.jpg";
import shotStudio from "./screens/das-studio.jpg";
import shotV1 from "./screens/das-v1.jpg";
import shotV2 from "./screens/das-v2.jpg";
import shotV3 from "./screens/das-v3.jpg";
import shotV4 from "./screens/das-v4.jpg";
import shotV5 from "./screens/das-v5.jpg";
import shotV6Campaigns from "./screens/das-v6-campaigns.jpg";
import shotV6Performance from "./screens/das-v6-performance.jpg";
import shotV6Setup from "./screens/das-v6-setup.jpg";
import shotV6 from "./screens/das-v6.jpg";
import { proto, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Feature, Hero, ShotCard } from "./ui";

/**
 * Prototypes › Deal Activation System › Rounds — the six review rounds. Sections
 * are components so the MDX stays a short outline.
 */

const V6 = "das/v6";

export const DasHero = () => (
    <Hero
        eyebrow="Deal Activation System"
        title="Six review rounds, each one kept as it was reviewed."
        lead="How a publisher sets up, manages and reports on direct-sold campaigns, worked through with product from 22 September to 6 November 2026. Every round is a clickable prototype, frozen, so any two can be compared."
        chips={["6 rounds", "22 Sep – 6 Nov 2026", "Frozen as reviewed", "Sample data only"]}
        art={dasArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto(V6, "campaigns")}>
                    Open Round 6
                </Cta>
                <Cta kind="secondary" href={story("reviews-nov-6-·-delivery-chart-summary--docs")}>
                    Latest review
                </Cta>
            </CtaRow>
        }
        shots={[
            { src: shotV6Setup, label: "Campaign setup", href: proto(V6, "setup-ready") },
            { src: shotV6Campaigns, label: "Manage campaigns", href: proto(V6, "campaigns") },
            { src: shotV6, label: "Campaign overview", href: proto(V6, "view-a-at-risk") },
        ]}
        caption="Live screens from Round 6, the current round. Every deal, campaign and figure is fictional."
    />
);

export const RoundSix = () => (
    <Feature
        art={dasArt}
        eyebrow="Round 6 · current · Oct 29, updated Nov 6"
        title="One spend number, live pacing"
        what="Every spend figure is the trued-up one Performance Insights shows, labelled “Subject to true-up”; what stays live is pacing. Campaign Health became Pacing, a sortable column; a campaign shows its pacing to the nearest 0.5%."
        point="On 6 Nov the Delivery chart gained the day's ad requests and active users, in actual numbers on one chart, and the page stopped coaching: no warning strip, just the data. Every table sorts."
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto(V6, "view-a-at-risk")}>
                    Open a campaign
                </Cta>
                <Cta href={proto(V6, "campaigns")}>Manage campaigns</Cta>
                <Cta href={proto(V6, "view-d")}>Full performance</Cta>
                <Cta href={story("reviews-nov-6-·-delivery-chart-summary--docs")}>Nov 6 review</Cta>
                <Cta href={story("reviews-oct-29-·-reporting-summary--docs")}>Oct 29 review</Cta>
            </CtaRow>
        }
        shots={[
            { src: shotV6, alt: "Round 6, a campaign's Delivery chart with requests and active users" },
            { src: shotV6Performance, alt: "Round 6, Full performance" },
        ]}
    />
);

export const EarlierRounds = () => (
    <CardGrid>
        <ShotCard
            shot={shotV5}
            eyebrow="Round 5 · Oct 26 & 27"
            title="DAS reads as Nimbus"
            body="Shared Nimbus tokens: full-bleed tables (charcoal reports, light lists), bold tabs, staging's fields and checkboxes, Performance Insights' bands in Full performance. Keyword Health removed."
            href={proto("das/v5", "view-d")}
            cta="Open Round 5"
            links={[["Oct 26 review", story("reviews-oct-26-·-nimbus-tokens-summary--docs")]]}
        />
        <ShotCard
            shot={shotV4}
            eyebrow="Round 4 · Oct 16 & 19"
            title="After a campaign exists"
            body="Setup approved for build. The three screens that follow it: Manage campaigns as staging's table, the campaign overview, and Full performance to break down, pivot and export."
            href={proto("das/v4", "campaigns")}
            cta="Open Round 4"
            links={[["Oct 17 review", story("reviews-oct-17-·-after-publishing-summary--docs")]]}
        />
        <ShotCard
            shot={shotV3}
            eyebrow="Round 3 · Oct 2 & 5"
            title="One way to pick something, used seven times"
            body="Every library field works the same way: type to narrow, arrows and Enter to pick. The 5 Oct type rules arrive: extra-bold headlines, a 15px floor, dates only."
            href={proto("das/v3", "setup-ready")}
            cta="Open Round 3"
            links={[["Oct 5 review", story("reviews-oct-5-·-type-rules-summary--docs")]]}
        />
        <ShotCard
            shot={shotV2}
            eyebrow="Round 2 · Oct 1"
            title="One page, one rail, and the libraries behind it"
            body="One rail that summarises and jumps to problems, targeting as peer modules, an asset library and a keyword library."
            href={proto("das/v2", "setup-reviewed")}
            cta="Open Round 2"
            links={[["Round 2 notes", story("archive-das-early-concepts-round-2-·-oct-1--docs")]]}
        />
        <ShotCard
            shot={shotV1}
            eyebrow="Round 1 · Sep 22"
            title="Extended Targeting"
            body="One-page setup, the publisher's own keywords plus geo, platform, app and ad unit targets, and at-a-glance pacing for every campaign."
            href={proto("das/v1")}
            cta="Open Round 1"
            links={[["Sept 22 review", story("reviews-sept-22-·-round-1-summary--docs")]]}
        />
        <ShotCard
            shot={shotStudio}
            eyebrow="Concept · Sep 22"
            title="DAS Studio: build with the result in view"
            body="A guided, full-screen builder: goal tiles, live delivery estimates while you set audience, budget and bid. A concept, not a round."
            href={proto("das-studio")}
            cta="Open DAS Studio"
            links={[["The concept", story("archive-das-studio-concept-overview--docs")]]}
        />
    </CardGrid>
);

export const Specs = () => (
    <CtaRow>
        <Cta href={story("prototypes-deal-activation-system-campaign-setup-spec--docs")}>Campaign Setup spec</Cta>
        <Cta href={story("design-system-nimbus-tokens-overview--docs")}>Nimbus tokens</Cta>
        <Cta href={story("design-system-application-ui-table-list-vs-report--docs")}>List vs Report</Cta>
        <Cta href={story("start-here-style-guide--docs")}>Style guide</Cta>
    </CtaRow>
);
