import { proto, story } from "../intro/tokens";
import { CardGrid, Cta, CtaRow, MiniCard, PageHeader } from "../intro/ui";

/**
 * Archive › About the archive — what each archived group was, and what replaced it.
 * Nothing here is deleted; it is out of the way of the current work.
 */

export const ArchiveHeader = () => (
    <PageHeader
        eyebrow="Archive"
        title="Earlier work, kept viewable."
        lead="Four groups that current work has replaced. Each stays here as it was, with every story still opening, and each says what took its place."
        chips={["4 groups", "Nothing deleted", "Sample data only"]}
        actions={
            <CtaRow>
                <Cta kind="primary" href={story("start-here-overview--docs")}>
                    Go to the current work
                </Cta>
            </CtaRow>
        }
    />
);

export const ArchiveGroups = () => (
    <CardGrid min={420}>
        <MiniCard
            eyebrow="Replaced by Prototypes › Full application"
            title="App Screens"
            href={story("prototypes-full-application-screen-index--docs")}
            cta="Open the screen index"
        >
            Seventeen dashboard screens built from the design system before the Nov 13 style guide. Every one is rebuilt in the full application. Research ›
            Table audit still reads its tables from here.
        </MiniCard>
        <MiniCard
            eyebrow="Replaced by DAS Rounds 3 to 6"
            title="DAS early concepts"
            href={story("prototypes-deal-activation-system-rounds--docs")}
            cta="See the rounds"
        >
            The Round 1 screen concepts and components from September, and the Round 2 notes from 1 October. Both rounds still open as prototypes.
        </MiniCard>
        <MiniCard eyebrow="Not taken forward" title="DAS Studio concept" href={proto("das-studio")} cta="Open the Studio prototype">
            A guided, full-screen campaign builder explored on 22 September. The single-page setup in the DAS rounds is what was built.
        </MiniCard>
        <MiniCard
            eyebrow="Replaced by Full application › Reporting"
            title="Performance Insights concepts"
            href={story("prototypes-full-application-reporting-performance-insights--default")}
            cta="Open Performance Insights"
        >
            The September redesign concepts: a start page, a question bar and an explorer. The page is now rebuilt on the Nov 13 style guide; its charts moved
            to Design System › Chart library.
        </MiniCard>
    </CardGrid>
);
