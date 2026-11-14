import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewQuery } from "../../../../prototypes/app/v1/screens/reporting/insights/new-query";
import { SavedQueries } from "../../../../prototypes/app/v1/screens/reporting/insights/saved-queries";

/**
 * Performance Insights — Nov 13 style guide. Saved Queries and New Query, rebuilt from
 * staging (reference/111326) with the prototype's tokens; the same components the
 * prototype's pi-* screens render.
 */
const meta = {
    title: "Prototypes/Full application/Reporting/Performance Insights",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Saved Queries with sample saved and recommended queries (staging 9.11.58 PM). */
export const Default: Story = { render: () => <SavedQueries /> };

/** Saved Queries with nothing saved — staging's list as it is today (9.11.58 PM). */
export const Empty: Story = { render: () => <SavedQueries empty /> };

/** New Query as a table: Requests and CTR, last 7 days, by day (9.10.54 PM). */
export const NewQueryTable: Story = { name: "New Query", render: () => <NewQuery /> };

/** The same query as a line chart, Requests and CTR on two axes (9.11.09 PM). */
export const LineChart: Story = { name: "Line chart", render: () => <NewQuery chart="line" /> };

/** The same query as an area chart (9.11.15 PM). */
export const AreaChart: Story = { name: "Area chart", render: () => <NewQuery chart="area" /> };

/** The same query as a bar chart (9.11.20 PM). */
export const BarChart: Story = { name: "Bar chart", render: () => <NewQuery chart="bar" /> };
