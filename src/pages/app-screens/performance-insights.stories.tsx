import type { Meta, StoryObj } from "@storybook/react";
import { PerformanceInsightsScreen } from "./performance-insights";

const meta = {
    title: "Archive/App Screens/Performance Insights",
    component: PerformanceInsightsScreen,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta<typeof PerformanceInsightsScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Default: LINE chart type selected, multi-series magenta line chart + floating Revenue tooltip. */
export const LineChart: Story = {
    args: { chartType: "line" },
};

/** TABLE chart type selected — tabular query results with sortable columns and a TOTAL row. */
export const TableView: Story = {
    args: { chartType: "table" },
};

/** BAR chart type selected — single-series monthly bar chart. */
export const BarChart: Story = {
    args: { chartType: "bar" },
};

/** STACKED BAR chart type selected — three-series stacked monthly bars. */
export const StackedBar: Story = {
    args: { chartType: "stacked-bar" },
};

/** PIE chart type selected — series distribution pie with legend. */
export const PieChart: Story = {
    args: { chartType: "pie" },
};

/** Initial state — no chart type selected, Save Query / Download disabled, Compare shows "Select". */
export const EmptyState: Story = {
    args: { chartType: null },
};

/** "Save Queries" tab — Saved / Recommended report list with delete and add-to-saved actions. */
export const SavedQueries: Story = {
    args: { tab: "saved" },
};

/** "Save Query" modal overlaid on the query builder. */
export const SaveQueryModal: Story = {
    args: { chartType: "line", showSaveModal: true },
};
