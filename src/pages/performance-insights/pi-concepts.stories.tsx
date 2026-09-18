import type { Meta, StoryObj } from "@storybook/react-vite";
import { Explorer, QuestionBar, StartPage } from "./pi-concepts";

/**
 * Performance Insights → screen concepts.
 *
 * Three directions for replacing the checkbox-wall query builder: a template start
 * page, a sentence-style query bar that only runs on demand, and a pivot explorer.
 */
const meta = {
    title: "Performance Insights/Concepts",
    parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Concept A: start from templates and saved queries instead of a blank form. */
export const ConceptAStartPage: Story = { name: "Concept A · Start page", render: () => <StartPage /> };

/** Concept B: the query as one editable sentence, with results and period-over-period deltas. */
export const ConceptBQuestionBar: Story = { name: "Concept B · Question bar", render: () => <QuestionBar /> };

/** Concept B after an edit: results go stale and nothing re-queries until Run. */
export const ConceptBQuestionBarDraft: Story = { name: "Concept B · Edited, not yet run", render: () => <QuestionBar draft /> };

/** Concept C: pivot-table explorer with drag-in fields, drill-down rows and heatmap cells. */
export const ConceptCExplorer: Story = { name: "Concept C · Explorer", render: () => <Explorer /> };
