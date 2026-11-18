import type { Meta, StoryObj } from "@storybook/react-vite";
import { NewQuery } from "../../../../../prototypes/app/v2/screens/reporting/insights/new-query";
import { SavedQueries } from "../../../../../prototypes/app/v2/screens/reporting/insights/saved-queries";

/** Round 1 · Reporting · Performance Insights — renders v2, with the Round 1 styles (prototypes/app/v2, #/pi-*). */
const meta = {
    title: "Transition/Round 1/Screens/Reporting/Performance Insights",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Saved Queries with sample saved and recommended queries, in v2. */
export const Default: Story = { render: () => <SavedQueries /> };

/** Saved Queries with nothing saved, in v2. */
export const Empty: Story = { render: () => <SavedQueries empty /> };

/** New Query as a table, in v2. */
export const NewQueryTable: Story = { name: "New Query", render: () => <NewQuery /> };

/** The same query as a line chart, in v2. */
export const LineChart: Story = { name: "Line chart", render: () => <NewQuery chart="line" /> };

/** The same query as an area chart, in v2. */
export const AreaChart: Story = { name: "Area chart", render: () => <NewQuery chart="area" /> };

/** The same query as a bar chart, in v2. */
export const BarChart: Story = { name: "Bar chart", render: () => <NewQuery chart="bar" /> };
