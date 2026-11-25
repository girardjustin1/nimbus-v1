import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Band, Bands, type FilterDim, FilterControl, type FilterState, filterExcluded } from "../../../../prototypes/performance-insights/v2/screens/nimbus-ui";
import { Rule, TokenPage } from "./token-page";

/** Sample categories only: fictional apps, accounts and example.com advertisers. */
const ADVERTISERS = ["shoes", "travel", "games", "bank", "grocer", "books", "music", "pets", "garden", "sports", "coffee", "fitness"].map((w) => `${w}.example.com`);
const DIMS: FilterDim[] = [
    { id: "Ad Type", label: "Ad Type", values: ["Native", "Static", "Unavailable", "Video", "Video - Rewarded"] },
    { id: "Advertiser", label: "Advertiser", values: ADVERTISERS },
    {
        id: "App",
        label: "App",
        values: ["Daily Scores", "Match Report", "Xtra Innings", "Puzzle Parade"],
        group: { label: "Account", of: { "Daily Scores": "Scoreline Media", "Match Report": "Scoreline Media", "Xtra Innings": "Metro Mobile", "Puzzle Parade": "Northlight Apps" } },
    },
    {
        id: "Country",
        label: "Country",
        values: ["United States", "Canada", "United Kingdom", "Germany", "France", "Mexico", "Brazil", "Japan"],
        group: {
            label: "Region",
            of: { "United States": "NORAM", Canada: "NORAM", "United Kingdom": "EUROPE", Germany: "EUROPE", France: "EUROPE", Mexico: "LATAM", Brazil: "LATAM", Japan: "APAC" },
        },
    },
    {
        id: "DAS",
        label: "DAS",
        values: ["Sports fans PMP", "Commuters PG", "Open Marketplace"],
        note: "Performance Insights data is subject to true-up and is finalized within 72 hours. For real-time campaign spend, open DAS › Manage Campaigns.",
    },
    { id: "Platform", label: "Platform", values: ["Android", "CTV", "iPhone"] },
];

const meta = {
    title: "Design System/Nimbus Tokens/Filter Control",
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: {
            description: {
                component:
                    "`FilterControl` — Performance Insights' filters as on staging (25 Nov), shared with Buyer Breakdown and Benchmarks. **+ ADD** opens the inline panel: the category rail (a picked count in brackets), then the category's values as rows with Clear Selections, then CANCEL / SAVE. Lists over seven values get a search box and two columns; “All” picks every value; picks are teal rows, not checkboxes. Country opens by region and App by account (a middle pane); DAS carries staging's true-up note. At most 1,000 values are drawn; search reaches the rest. Saved values sit on the row as checkboxes: unticking one keeps it there and drops it from the report (every value may be unticked), and the ✕ behind the rule clears them all. `filterExcluded` turns the state into what to leave out of the data.",
            },
        },
    },
} satisfies Meta;
export default meta;
type Story = StoryObj;

const Example = ({ initial = {}, openOn, openGroup, query }: { initial?: FilterState; openOn?: string; openGroup?: string; query?: string }) => {
    const [value, setValue] = useState<FilterState>(initial);
    const excluded = filterExcluded(DIMS, value);
    return (
        <>
            <Bands>
                <Band label="Filters">
                    <FilterControl dims={DIMS} value={value} onChange={setValue} openOn={openOn} openGroup={openGroup} query={query} />
                </Band>
            </Bands>
            <p className="text-md text-tertiary">
                Left out of the data:{" "}
                {Object.entries(excluded)
                    .filter(([, v]) => v.length)
                    .map(([d, v]) => `${d}: ${v.join(", ")}`)
                    .join(" · ") || "nothing"}
            </p>
        </>
    );
};

export const Empty: Story = {
    name: "Empty — + ADD",
    render: () => (
        <TokenPage>
            <Rule title="No filters yet">Click + ADD, pick a category and its values, then Save.</Rule>
            <Example />
        </TokenPage>
    ),
};

export const ComparingPlatforms: Story = {
    name: "Saved — one value unticked",
    render: () => (
        <TokenPage>
            <Rule title="Static unticked, iPhone on">Unticking keeps the value on the row and drops it from the report; the ✕ on the right clears everything.</Rule>
            <Example initial={{ "Ad Type": { values: ["Static", "Video"], off: ["Static"] }, Platform: { values: ["iPhone"], off: [] } }} />
        </TokenPage>
    ),
};

export const PanelOpen: Story = {
    name: "Panel — a short list",
    render: () => (
        <TokenPage>
            <Rule title="Ad Type, two picked">Picks are teal rows; the rail counts them. Save is live once something changed.</Rule>
            <Example initial={{ "Ad Type": { values: ["Static", "Video"], off: [] } }} openOn="Ad Type" />
        </TokenPage>
    ),
};

export const LongList: Story = {
    name: "Panel — a long list, searched",
    render: () => (
        <TokenPage>
            <Rule title="Advertiser, searched for “s”">Over seven values: search and two columns.</Rule>
            <Example openOn="Advertiser" query="s" />
        </TokenPage>
    ),
};

export const Grouped: Story = {
    name: "Panel — Country by region",
    render: () => (
        <TokenPage>
            <Rule title="Country, Europe open">Regions first, with search, then the region's countries; All picks the region.</Rule>
            <Example openOn="Country" openGroup="EUROPE" />
        </TokenPage>
    ),
};

export const WithNote: Story = {
    name: "Panel — DAS with its note",
    render: () => (
        <TokenPage>
            <Rule title="DAS">Deals, with staging's note on true-up beside them.</Rule>
            <Example openOn="DAS" />
        </TokenPage>
    ),
};
