import type { Meta, StoryObj } from "@storybook/react-vite";
import { DasOverview } from "../deal-activation-system/reporting";
import { DasOverviewRevised } from "./revised/reporting";

/**
 * Sept 22 · 1 — Reporting moves out of Performance Insights.
 *
 * The review asked for these concepts to sit on their own under Deal Activation System
 * rather than inside Performance Insights, so they read as something to judge in a vacuum
 * instead of a change to the whole reporting dashboard.
 */
const meta = {
    title: "Sept 22/1 Reporting placement",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** The revised home: DAS reporting in the DAS section of the nav, with the review note attached. */
export const Revised: Story = { name: "Revised · DAS reporting home", render: () => <DasOverviewRevised /> };

/** The same screen with the annotations off, for screenshots. */
export const RevisedClean: Story = { name: "Revised · without the review note", render: () => <DasOverviewRevised annotate={false} /> };

/** What was reviewed on Sep 22 — the nav says Performance Insights, which is the problem. */
export const Reviewed: Story = { name: "Reviewed Sep 22 · inside Performance Insights", render: () => <DasOverview /> };
