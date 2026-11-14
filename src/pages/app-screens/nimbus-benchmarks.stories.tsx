import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusBenchmarksScreen } from "./nimbus-benchmarks";

const meta = {
    title: "Archive/App Screens/Nimbus Benchmarks",
    component: NimbusBenchmarksScreen,
    parameters: {
        layout: "fullscreen",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof NimbusBenchmarksScreen>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Results view: the summary metric row (NIMBUS vs MY eCPM / Win% / CTR), the
 * multi-series "Active users" line chart with its floating date tooltip, and the
 * dark-header benchmarks table comparing Nimbus and Your App across dates.
 */
export const Results: Story = {
    args: { state: "results" },
};

/**
 * Comparison config panel: the multi-column selector for choosing what to
 * benchmark against — dimension (Platform / Ad Type / Ad ID / Demand Resource),
 * comparison scope (Entire Nimbus Exchange / My Ad Stack / Individual Partners),
 * and the partner picker lists, with Cancel / Save actions.
 */
export const ComparisonConfig: Story = {
    args: { state: "config" },
};

/**
 * Empty state: the app-side ("MY") metrics collapse to "-" placeholders with a
 * help icon, and a dark tooltip explains that app data cannot be shown because
 * the active filters include a demand source not connected to the ad stack.
 */
export const EmptyStateTooltip: Story = {
    args: { state: "empty" },
};

/**
 * Nimbus Leaderboard: the "Top Performers in the Nimbus Exchange" view with
 * Share of Voice and eCPM ranked lists, reached via the NIMBUS LEADERBOARD pill.
 */
export const Leaderboard: Story = {
    args: { state: "leaderboard" },
};
