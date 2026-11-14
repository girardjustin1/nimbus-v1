import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusLeaderboard, NimbusPerformance } from "../../../../prototypes/app/v1/screens/reporting/buyers/nimbus-benchmarks";

/**
 * Reporting · Nimbus benchmarks — the publisher against the Nimbus Exchange, rebuilt
 * from staging (13 Nov) in the Nov 13 style guide. Same components as the prototype's
 * #/benchmarks, #/benchmarks-empty and #/benchmarks-leaderboard screens.
 */
const meta = {
    title: "Prototypes/Full application/Reporting/Nimbus benchmarks",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Rebuilds "Screenshot 2026-11-13 at 9.11.39 PM.png": Nimbus Performance, last 7 days, by day. */
export const Default: Story = {
    render: () => <NimbusPerformance />,
};

/** 9.11.39 PM as staging shows it today: the exchange's figures beside zeros for mine. */
export const Empty: Story = {
    render: () => <NimbusPerformance empty />,
};

/** Rebuilds "Screenshot 2026-11-13 at 9.11.49 PM.png": Nimbus Leaderboard, Share of Voice and eCPM. */
export const Leaderboard: Story = {
    render: () => <NimbusLeaderboard />,
};
