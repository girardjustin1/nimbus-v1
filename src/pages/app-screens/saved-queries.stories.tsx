import type { Meta, StoryObj } from "@storybook/react-vite";
import { SavedQueriesScreen } from "./saved-queries";

const meta = {
    title: "Archive/App Screens/Saved Queries",
    component: SavedQueriesScreen,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof SavedQueriesScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Saved queries list: the "Queries" tab with a Saved / Recommended filter and a
 * sortable table of saved reports. Delete rows show a red ✕ (with a "Delete"
 * tooltip); addable rows show a pink +.
 */
export const SavedQueries: Story = {
    args: { variant: "saved-list" },
};

/**
 * The reporting query builder on the "Save Queries" tab: date + Group By config,
 * Filter / Metrics / Breakdown / Compare rows, a Chart Type selector (Line
 * active) and a full-width multi-series line chart with a floating tooltip card.
 */
export const QueryBuilder: Story = {
    args: { variant: "builder" },
};

/**
 * Query builder with the Breakdown "More Options" popover open — a Version
 * search with two checked "App Version" options. The Breakdown control collapses
 * its label to "+2 More".
 */
export const BreakdownMoreOptions: Story = {
    args: { variant: "breakdown-open" },
};

/**
 * The "Save Query" dialog: a folder featured icon, a Query Name field, the
 * Update-Date-Range / Save-Exact-Dates radios, a Private Report checkbox and the
 * Continue / Cancel actions, over the query-builder chrome.
 */
export const SaveQueryModal: Story = {
    args: { variant: "save-modal" },
};
