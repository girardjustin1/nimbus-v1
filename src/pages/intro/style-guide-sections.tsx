import heroArt from "./art/hero-app.jpg";
import shotV5 from "./screens/das-v5.jpg";
import shotChart from "./screens/sg-chart.jpg";
import shotControls from "./screens/sg-controls.jpg";
import shotCopy from "./screens/sg-copy.jpg";
import shotList from "./screens/sg-list-table.jpg";
import shotReport from "./screens/sg-report-table.jpg";
import shotReporting from "./screens/sg-reporting.jpg";
import shotTabs from "./screens/sg-tabs.jpg";
import shotType from "./screens/sg-type.jpg";
import { proto, story } from "./tokens";
import { CardGrid, Cta, CtaRow, Hero, MiniCard, Points, Split, Swatch } from "./ui";

/**
 * Full Application › Style guide — each rule beside a real screen that follows it, from
 * the full application or from DAS, where the rule was settled.
 */

const APP = "app/v1";

export const StyleHero = () => (
    <Hero
        eyebrow="The Nov 13 style guide"
        title="Eight rules, each with a screen that follows it."
        lead="Settled one review at a time on the Deal Activation System, then applied to every page of the dashboard on 13 November."
        chips={["Type", "Colour", "Tables", "Reporting page", "Controls", "Charts", "Copy", "Sample data"]}
        art={heroArt}
        actions={
            <CtaRow>
                <Cta kind="primary" href={proto(APP)}>
                    See it in the full application
                </Cta>
                <Cta kind="secondary" href={story("application-ui-nimbus-tokens-00-overview--docs")}>
                    Nimbus tokens
                </Cta>
            </CtaRow>
        }
    />
);

export const TypeRule = () => (
    <Split
        n={1}
        eyebrow="Type"
        title="One typeface, three weights, nothing under 15px"
        shot={shotType}
        caption="Campaign overview · Deal Activation System"
        actions={
            <CtaRow>
                <Cta href={story("audits-typography-rules--docs")}>Typography Rules</Cta>
                <Cta href={proto(APP, "view-a-at-risk")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["Proxima Nova everywhere,", "including buttons, which render in Arial on staging today."],
                ["Headlines 800, labels 700.", "Page and section titles extra-bold; labels and table headers bold and black."],
                ["A 15px floor.", "A test fails any product screen that goes smaller."],
            ]}
        />
        <p style={{ margin: "12px 0 0" }}>Settled in DAS Round 3, 5 October.</p>
    </Split>
);

export const Colours = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12, margin: "16px 0" }}>
        <Swatch hex="#DA6EA3" name="Pink" use="Primary actions, links, active nav" />
        <Swatch hex="#A94579" name="Dark pink" use="Buttons and links that carry text" />
        <Swatch hex="#37B6B7" name="Teal" use="Active tabs, checkboxes, focus, charts" />
        <Swatch hex="#1F7F80" name="Dark teal" use="Teal text that has to be read" />
        <Swatch hex="#101828" name="Charcoal" use="Report table headers, the sidebar" />
        <Swatch hex="#FCFAF9" name="Warm stripe" use="Every other table row" />
    </div>
);

export const TableRules = () => (
    <>
        <Split
            n={3}
            eyebrow="Tables · report"
            title="Reports get the charcoal header"
            shot={shotReport}
            caption="Realtime dashboard, table view · Reporting"
            actions={
                <CtaRow>
                    <Cta href={story("application-ui-table-list-vs-report--docs")}>List vs Report</Cta>
                    <Cta href={proto(APP, "realtime-table")}>Open this screen</Cta>
                </CtaRow>
            }
        >
            Anything that reports numbers: realtime, Performance Insights, buyer breakdown, discrepancy reports, Full performance. White labels on charcoal,
            warm alternating rows, a total row, figures right-aligned.
        </Split>
        <Split
            eyebrow="Tables · list"
            title="Lists keep a light header, and every column sorts"
            shot={shotList}
            caption="Manage campaigns · Deal Activation System"
            flip
            actions={
                <CtaRow>
                    <Cta href={story("application-ui-nimbus-tokens-tables--docs")}>Tables</Cta>
                    <Cta href={proto(APP, "campaigns")}>Open this screen</Cta>
                </CtaRow>
            }
        >
            Organised lists of things: campaigns, assets, keywords, demand partners, floors. Bold black labels. Both kinds run full bleed and rule every column.
            Click a header once for ascending, again for descending, a third time to go back. Settled in DAS Round 5 (26 Oct) and on 6 Nov.
        </Split>
    </>
);

export const ReportingRule = () => (
    <>
        <Split
            n={4}
            eyebrow="The reporting page"
            title="One shape for every reporting page"
            shot={shotReporting}
            caption="Performance Insights, New Query · Reporting"
            actions={
                <CtaRow>
                    <Cta href={story("application-ui-nimbus-tokens-bands--docs")}>Bands</Cta>
                    <Cta href={story("application-ui-nimbus-tokens-filter-control--docs")}>Filter control</Cta>
                    <Cta href={proto(APP, "pi-query")}>Open this screen</Cta>
                </CtaRow>
            }
        >
            <Points
                items={[
                    ["Date row:", "start and end date, the quick range, the interval, the page's actions."],
                    ["Bands:", "Metrics, Breakdown, Filters, Compare, Chart Type, each a full-width labelled row."],
                    ["Then", "summary tiles, the chart, and the same data as a sortable report table."],
                ]}
            />
        </Split>
        <Split
            eyebrow="Where it came from"
            title="First built for DAS Full performance"
            shot={shotV5}
            caption="Full performance · DAS Round 5"
            flip
            actions={
                <CtaRow>
                    <Cta href={proto("das/v5", "view-d")}>Open Round 5</Cta>
                    <Cta href={story("oct-26-introduction--docs")}>Oct 26 review</Cta>
                </CtaRow>
            }
        >
            Product asked for Full performance to take Performance Insights' bands, filter menu and chart type bar. The same tokens now build Performance
            Insights itself, the realtime dashboard, buyer breakdown and benchmarks.
        </Split>
    </>
);

export const ControlRules = () => (
    <>
        <Split
            n={5}
            eyebrow="Controls"
            title="Staging's fields and buttons, cleaned up"
            shot={shotControls}
            caption="Configure demand, a partner's form · Demand"
            actions={
                <CtaRow>
                    <Cta href={story("application-ui-nimbus-tokens-buttons--docs")}>Buttons</Cta>
                    <Cta href={story("application-ui-nimbus-tokens-teal-controls--docs")}>Teal controls</Cta>
                    <Cta href={proto(APP, "demand-configure-partner")}>Open this screen</Cta>
                </CtaRow>
            }
        >
            <Points
                items={[
                    ["Fields and dropdowns:", "grey fill, faint rule, 46px tall, teal focus ring."],
                    ["Buttons:", "a pink pill for the thing you came to do; a grey outline for what only changes the view."],
                    ["Search", "runs the full width, or fills the row beside its buttons."],
                ]}
            />
        </Split>
        <Split
            eyebrow="Tabs and tiles"
            title="Bold tabs, the active one filled"
            shot={shotTabs}
            caption="Floors · AdOps"
            flip
            actions={
                <CtaRow>
                    <Cta href={story("application-ui-nimbus-tokens-page-tabs--docs")}>Page tabs</Cta>
                    <Cta href={proto(APP, "floors")}>Open this screen</Cta>
                </CtaRow>
            }
        >
            Page tabs are bold and teal; the active tab is filled pale teal with a rule beneath. Summary tiles sit flat under them, one figure each.
        </Split>
    </>
);

export const ChartRule = () => (
    <Split
        n={6}
        eyebrow="Charts"
        title="Actual numbers, on one chart"
        shot={shotChart}
        caption="A campaign's Delivery chart · Deal Activation System"
        actions={
            <CtaRow>
                <Cta href={story("nov-6-edits-chart-concepts--all-five")}>The nine concepts</Cta>
                <Cta href={proto(APP, "view-a-at-risk")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["Real figures.", "Nothing is indexed against “normal”. Product chose this chart on 6 Nov for that reason."],
                ["One palette:", "teal, pink, navy, brown; at most eight slices, the rest folded into “Other”."],
                ["Readable:", "ticks, legends and tooltips at 15px; the tooltip names the day in full."],
            ]}
        />
    </Split>
);

export const CopyRule = () => (
    <Split
        n={7}
        eyebrow="Copy"
        title="State the data. Never coach."
        shot={shotCopy}
        caption="A paused campaign · Deal Activation System"
        flip
        actions={
            <CtaRow>
                <Cta href={story("nov-6-edits-introduction--docs")}>Nov 6 review</Cta>
                <Cta href={proto(APP, "view-a?c=c4")}>Open this screen</Cta>
            </CtaRow>
        }
    >
        <Points
            items={[
                ["Staging's wording", "for labels, tabs, buttons and columns. Restyle, don't rename."],
                ["No coaching.", "A paused campaign says when it paused and what's left. No targets, no “you should”."],
                ["No added explanations", "where staging has none. Deliberate one-offs stay one-offs."],
            ]}
        />
    </Split>
);

export const SampleDataRule = () => (
    <CardGrid min={230}>
        <MiniCard eyebrow="8 · Sample data" title="Everything is fictional" tone="warm">
            Publisher, apps, demand partners, people and URLs are made up, because this Storybook is public.
        </MiniCard>
        <MiniCard eyebrow="One week" title="Nov 7 to Nov 13, 2026" tone="warm">
            Every reporting page shows the same week, so figures can be followed from page to page.
        </MiniCard>
        <MiniCard
            eyebrow="Out of scope"
            title="Third-party pieces"
            tone="warm"
            href={story("november-13th-2026-engineering-constraints--docs")}
            cta="Engineering constraints"
        >
            Payment embeds, chart internals, the select and calendar libraries change only as far as they allow.
        </MiniCard>
    </CardGrid>
);
