import type { Meta, StoryObj } from "@storybook/react-vite";
import { NimbusLeaderboard, NimbusPerformance } from "../../../../../prototypes/app/v2/screens/reporting/buyers/nimbus-benchmarks";

/** Round 1 · Reporting · Nimbus benchmarks — renders v2, with the Round 1 styles (prototypes/app/v2, #/benchmarks). */
const meta = {
    title: "Transition/Round 1/Screens/Reporting/Nimbus benchmarks",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Nimbus Performance, last 7 days, by day, in v2. */
export const Default: Story = { render: () => <NimbusPerformance /> };

/** The exchange's figures beside zeros for the publisher's, in v2. */
export const Empty: Story = { render: () => <NimbusPerformance empty /> };

/** Nimbus Leaderboard, Share of Voice and eCPM, in v2. */
export const Leaderboard: Story = { render: () => <NimbusLeaderboard /> };
